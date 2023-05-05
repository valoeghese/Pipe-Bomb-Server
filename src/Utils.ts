import { dirname } from "path";
import { fileURLToPath } from "url";

export function shuffle<Type>(array: Type[]) {
    const dupe = Array.from(array);
    let currentIndex = dupe.length,  randomIndex;
  
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [dupe[currentIndex], dupe[randomIndex]] = [dupe[randomIndex], dupe[currentIndex]];
    }
  
    return dupe;
}

export function convertArrayToString(items: string[]) {
  let out = "";
  for (let i = 0; i < items.length; i++) {
      if (i > 0) {
          if (i == items.length - 2) {
              out += " & ";
          } else {
              out += ", ";
          }
      }
      out += items[i];
  }
  return out;
}

export function wait(milliseconds: number) {
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}

export function concatArrayBuffers(buffers: ArrayBuffer[]): ArrayBuffer {
    let totalLength = 0;
    for (const buffer of buffers) {
        totalLength += buffer.byteLength;
    }
  
    const resultBuffer = new ArrayBuffer(totalLength);
  
    const resultArray = new Uint8Array(resultBuffer);
  
    let offset = 0;
    for (const buffer of buffers) {
        const bufferArray = new Uint8Array(buffer);
        for (let i = 0; i < buffer.byteLength; i++) {
            resultArray[offset + i] = bufferArray[i];
        }
        offset += buffer.byteLength;
    }
  
    return resultBuffer;
}

export const DIRNAME = dirname(fileURLToPath(import.meta.url));

export function stripNonAlphanumeric(input: string, allowSpaces: boolean) {
    if (allowSpaces) return input.replace(/[^0-9a-zA-Z ]/g, "");
    return input.replace(/[^0-9a-zA-Z]/g, "");
}

export function removeDuplicates<Type>(items: Type[], matchProperty?: (item: Type) => any) {
    if (matchProperty) {
        const existingMatchProperties: any[] = [];
        const newList: Type[] = [];
    
        for (let item of items) {
            const itemMatchProp = matchProperty(item);
            if (!existingMatchProperties.includes(itemMatchProp)) {
                existingMatchProperties.push(itemMatchProp);
                newList.push(item);
            }
        }
        items.splice(0, items.length, ...newList);
    } else {
        const newList: Type[] = [];
        for (let item of items) {
            if (!newList.includes(item)) {
                newList.push(item);
            }            
        }
        items.splice(0, items.length, ...newList);
    }
}

export function removeItems<Type>(items: Type[], shouldKeep: (item: Type) => boolean) {
    const newList: Type[] = [];

    for (let item of items) {
        if (shouldKeep(item)) newList.push(item);
    }

    items.splice(0, items.length, ...newList);
}