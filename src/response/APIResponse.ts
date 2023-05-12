import Exception from "./Exception.js";

export interface APIResponseOptions {
    cacheTime?: number,
    type?: string
}

export default class APIResponse {
    public static statusCodes = {
        '200': 'OK',
        '201': 'Created',
        '202': 'Accepted',
        '203': 'Non-Authoritative Information',
        '204': 'No Content',
        '205': 'Reset Content',
        '206': 'Partial Content',
        '300': 'Multiple Choices',
        '301': 'Moved Permanently',
        '302': 'Found',
        '303': 'See Other',
        '304': 'Not Modified',
        '305': 'Use Proxy',
        '306': 'Unused',
        '307': 'Temporary Redirect',
        '400': 'Bad Request',
        '401': 'Unauthorized',
        '402': 'Payment Required',
        '403': 'Forbidden',
        '404': 'Not Found',
        '405': 'Method Not Allowed',
        '406': 'Not Acceptable',
        '407': 'Proxy Authentication Required',
        '408': 'Request Timeout',
        '409': 'Conflict',
        '410': 'Gone',
        '411': 'Length Required',
        '412': 'Precondition Required',
        '413': 'Request Entry Too Large',
        '414': 'Request-URI Too Long',
        '415': 'Unsupported Media Type',
        '416': 'Requested Range Not Satisfiable',
        '417': 'Expectation Failed',
        '418': 'I\'m a teapot',
        '429': 'Too Many Requests',
        '500': 'Internal Server Error',
        '501': 'Not Implemented',
        '502': 'Bad Gateway',
        '503': 'Service Unavailable',
        '504': 'Gateway Timeout',
        '505': 'HTTP Version Not Supported'
    };

    public readonly statusCode: number;
    public readonly statusMessage: string;
    public readonly response: any;
    public processTime: number | null = null;
    public readonly options: APIResponseOptions;

    constructor(statusCode: number, response: any, options?: APIResponseOptions) {
        if (!(statusCode.toString() in APIResponse.statusCodes)) throw new Exception(`'${statusCode}' is not a valid status code.`);
        this.statusCode = statusCode;
        this.statusMessage = APIResponse.statusCodes[this.statusCode.toString()];
        this.response = response;
        this.options = options || {};
    }
}