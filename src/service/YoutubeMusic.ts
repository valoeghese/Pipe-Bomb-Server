import * as YTM from "node-youtube-music";
import YTDL from "ytdl-core";
import YTA from "youtube-music-api";

import Track from "../music/Track.js";
import StreamingService from "./StreamingService.js";
import ServiceManager from "./ServiceManager.js";
import StreamInfo from "./StreamInfo.js";
import Exception from "../response/Exception.js";
import { convertArrayToString, removeDuplicates, removeItems, wait } from "../Utils.js";
import APIResponse from "../response/APIResponse.js";

const Yta = new YTA();

let initialized = false;
Yta.initalize().then(() => {
    initialized = true;
});

export async function waitForInitialization() {
    return new Promise<void>(async resolve => {
        if (initialized) return resolve();
        while (!initialized) {
            await wait(100);
        }
        resolve();
    });
}

export default class YoutubeMusic extends StreamingService {
    constructor() {
        super("Youtube Music", "ym");
    }

    public async search(query: string, page?: number): Promise<Track[]> {
        try {
            const results = await YTM.searchMusics(query);
            const out: Track[] = [];

            results.forEach(data => {
                out.push(this.convertJsonToTrack(data));
            });

            removeDuplicates(out, track => track.trackID);
            
            return out;
        } catch (e) {
            throw new Exception(e);
        }
    }

    public getAudio(trackID: string): Promise<StreamInfo> {
        trackID = this.convertTrackIDToLocal(trackID);

        return ServiceManager.getInstance().getService("Youtube").getAudio(trackID);
    }

    public convertJsonToTrack(trackInfo: YTM.MusicVideo) {
        return new Track(`ym-${trackInfo.youtubeId}`, {
            title: trackInfo.title,
            artists: trackInfo.artists.map(artist => artist.name),
            image: trackInfo.thumbnailUrl,
            duration: trackInfo.duration.totalSeconds,
            originalUrl: "https://music.youtube.com/watch?v=" + trackInfo.youtubeId
        })
    }

    public async getTrack(trackID: string): Promise<Track> {
        await waitForInitialization();
        trackID = this.convertTrackIDToLocal(trackID);        

        try {
            const data = await Yta.getSong(trackID);

            if (Array.isArray(data.videoId)) {
                throw new APIResponse(400, `Invalid track ID 'ym-${trackID}'`);
            }

            let thumbnailSize = 0;
            let thumbnail: string | null = null;
            for (let thumbnailData of data.thumbnails) {
                const newSize = thumbnailData.width * thumbnailData.height;
                if (newSize > thumbnailSize) {
                    thumbnailSize = newSize;
                    thumbnail = thumbnailData.url;
                }
            }

            return new Track(`ym-${trackID}`, {
                title: data.name,
                artists: [data.artist],
                image: thumbnail,
                duration: Math.round(data.duration / 1000),
                originalUrl: data.url
            });
        } catch (e) {
            if (e instanceof APIResponse) {
                throw e;
            }
            console.error("YTA ERROR", e);
            throw new Exception(e);
        }
    }

    public async getSuggestedTracks(track: Track): Promise<Track[]> {
        const trackID = this.convertTrackIDToLocal(track.trackID);

        try {
            const results = await YTM.getSuggestions(trackID);

            const out: Track[] = [];

            results.forEach(data => {
                out.push(this.convertJsonToTrack(data));
            });

            removeDuplicates(out, track => track.trackID);
            removeItems(out, newTrack => newTrack.trackID != track.trackID);

            return out;
        } catch (e) {
            throw new Exception(e);
        }
    }
}