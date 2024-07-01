/**
 * Get the parts of a path
 * @category Object Storage
 * @param path The path to split
 * @returns The parts of the path
 * @ignore
 */
export declare function getPathParts(path: string): string[];
/**
 * Get the path name of an object from a path and a name
 * @category Object Storage
 * @param path The path to the object
 * @param name The name of the object
 * @returns The path name of the object
 * @ignore
 */
export declare function getPathName(path: string, name: string): string;
/**
 * Split a path name into its path and name
 * @category Object Storage
 * @param pathName The path name to split
 * @returns The path and name of the object
 * @ignore
 */
export declare function splitPathName(pathName: string): [string, string];
