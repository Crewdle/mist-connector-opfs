import { IReadableStream } from "@crewdle/web-sdk-types";
export declare class OPFSReadableStream implements IReadableStream {
    private reader;
    constructor(stream: ReadableStream<Uint8Array>);
    read(): Promise<Uint8Array | null>;
    close(): Promise<void>;
}
