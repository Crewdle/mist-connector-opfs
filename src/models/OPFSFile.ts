import { IFile, IReadableStream } from '@crewdle/web-sdk-types';
import { OPFSReadableStream } from './OPFSReadableStream';

/**
 * Represents a file in the OPFS (Open Platform File System).
 */
export class OPFSFile implements IFile {
  private file: File;
  name: string;
  size: number;
  type: string;
  lastModified: number;

  /**
   * Creates a new instance of the OPFSFile class.
   * @param file The underlying File object.
   */
  constructor(file: File) {
    this.file = file;
    this.name = file.name;
    this.size = file.size;
    this.type = file.type;
    this.lastModified = file.lastModified;
  }

  /**
   * Returns a promise that resolves with an ArrayBuffer containing the file's data.
   * @returns A promise that resolves with an ArrayBuffer.
   */
  arrayBuffer(): Promise<ArrayBuffer> {
    return this.file.arrayBuffer();
  }

  /**
   * Returns a promise that resolves with the file's data as a string.
   * @returns A promise that resolves with a string.
   */
  text(): Promise<string> {
    return this.file.text();
  }

  /**
   * Returns a new Blob object that contains a subset of the file's data.
   * @param start The starting byte position (inclusive) of the slice.
   * @param end The ending byte position (exclusive) of the slice.
   * @param contentType The content type of the new Blob object.
   * @returns A new Blob object representing the sliced data.
   */
  slice(start?: number, end?: number, contentType?: string): Blob {
    return this.file.slice(start, end, contentType);
  }

  /**
   * Returns a readable stream that allows reading the file's data.
   * @returns A readable stream for the file's data.
   */
  stream(): IReadableStream {
    return new OPFSReadableStream(this.file.stream());
  }
}
