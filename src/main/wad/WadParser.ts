// Doc copied from https://doomwiki.org/wiki/WAD
import * as R from "ramda";

const trim0Pos = (bytes: number[], pos: number) =>
    R.until((v: number) => bytes[v] !== 0, (v: number) => v - 1)(pos) + 1

const parseStr = (pos: number, length: number) => (bytes: number[]): string =>
    String.fromCharCode.apply(null, bytes.slice(pos, trim0Pos(bytes, pos + length - 1)))

/** little-endian */
const parseInt = (pos: number) => (bytes: number[]): number => {
    return R.pipe<number[], number[], number[], number>(
        R.slice(pos, pos + 4),
        R.reverse,
        R.curry(R.reduce)((val: number, cur: number) => val << 8 | cur, 0)
    )(bytes)
}

const parseHeader = (bytes: number[]): Header => {
    return {
        // The ASCII characters "IWAD" or "PWAD".
        identification: WadType[parseStr(0x00, 4)(bytes)],

        // An integer specifying the number of lumps in the WAD.
        numlumps: parseInt(0x04)(bytes),

        // An integer holding a pointer to the location of the directory.
        infotableofs: parseInt(0x08)(bytes)
    };
}

const parseDirectories = (header: Header, bytes: number[]): Directory[] => R
    .unfold(idx => idx > header.numlumps ? false : [header.infotableofs + idx * 16, idx + 1], 0)
    .map(ofs => parseDirectory(ofs, bytes))

const parseDirectory = (offset: number, bytes: number[]): Directory => {
    return {
        filepos: parseInt(offset)(bytes),
        size: parseInt(offset + 0x04)(bytes),
        name: parseStr(offset + 0x08, 8)(bytes)
    }
}

// ############################ TYPES ############################
/** A WAD file always starts with a 12-byte header. */
export type Header = {
    identification: WadType,

    /** An integer specifying the number of lumps in the WAD. */
    numlumps: number,

    /** An integer holding a pointer to the location of the directory. */
    infotableofs: number
}

/**
 * The directory associates names of lumps with the data that belong to them. It consists of a number of entries,
 * each with a length of 16 bytes. The length of the directory is determined by the number given in the WAD header.
 */
export type Directory = {

    /** An integer holding a pointer to the start of the lump's data in the file.  */
    filepos: number,

    /** An integer representing the size of the lump in bytes. */
    size: number,

    /** An ASCII string defining the lump's name. */
    name: string
}

// ############################ TYPES ############################
export enum WadType {
    IWAD,
    PWAD
}

class WadParser {
    static parse(bytes8: Uint8Array) {
        return "parsed!"
    }
}

export const testFunctions = {parseStr, parseInt, parseHeader, parseDirectory, parseDirectories}
export default WadParser