import { IWritableStream } from '@crewdle/web-sdk-types';

/**
 * Represents a writable stream for OPFS.
 */
export class OPFSWritableStream implements IWritableStream {
  private writer: WritableStreamDefaultWriter<Uint8Array>;

  /**
   * Creates a new instance of OPFSWritableStream.
   * @param writer The writer for the stream.
   */
  constructor(writer: WritableStreamDefaultWriter<Uint8Array>) {
    this.writer = writer;
  }

  /**
   * Writes a chunk of data to the stream.
   * @param chunk The chunk of data to write.
   * @returns A promise that resolves when the write operation is complete.
   */
  async write(chunk: ArrayBuffer): Promise<void> {
    const uint8Array = new Uint8Array(chunk);
    await this.writer.write(uint8Array);
  }

  /**
   * Closes the stream.
   * @returns A promise that resolves when the stream is closed.
   */
  async close(): Promise<void> {
    await this.writer.close();
  }
}
