import { IWritableStream } from '@crewdle/web-sdk-types';
export declare class OPFSWritableStream implements IWritableStream {
    private writer;
    constructor(writer: WritableStreamDefaultWriter<Uint8Array>);
    write(chunk: ArrayBuffer): Promise<void>;
    close(): Promise<void>;
}
