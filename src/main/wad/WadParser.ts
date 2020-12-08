import * as R from "ramda";
import {Either} from "../Either"
import {Directory, Header, MapLumpName, Thing, WadType} from "./WadModel";

const trim0Padding = (bytes: number[], pos: number) =>
    R.until((v: number) => bytes[v] !== 0, (v: number) => v - 1)(pos) + 1

const parseStr = (bytes: number[]) => (pos: number, length: number): string =>
    String.fromCharCode.apply(null, bytes.slice(pos, trim0Padding(bytes, pos + length - 1)))

/** little-endian number with given amount of bytes */
const parseNumber = (length: number) => (bytes: number[]) => (pos: number): number => {
    return R.pipe<number[], number[], number[], number>(
        R.slice(pos, pos + length),
        R.reverse,
        R.curry(R.reduce)((val: number, cur: number) => val << 8 | cur, 0)
    )(bytes)
}

/** little-endian 32bit int */
const parseInt = (bytes: number[]) => (pos: number): number => parseNumber(4)(bytes)(pos)

/** little-endian 16bit int */
const parseShort = (bytes: number[]) => (pos: number): number => parseNumber(2)(bytes)(pos)

const parseHeader = (bytes: number[]): Either<Header> => {
    const headerStr = parseStr(bytes)(0x00, 4)
    const parseIntBytes = parseInt(bytes);
    const header = {
        // The ASCII characters "IWAD" or "PWAD".
        identification: WadType[headerStr],

        // An integer specifying the number of lumps in the WAD.
        numlumps: parseIntBytes(0x04),

        // An integer holding a pointer to the location of the directory.
        infotableofs: parseIntBytes(0x08)
    };

    return Either.ofCondition(
        () => !R.isNil(header.identification) && header.identification === WadType.IWAD,
        () => header, () => "Unsupported Header" + headerStr)
}

/** The name of the map has to be in the form ExMy or MAPxx */
const isMapName = (name: string): boolean => {
    return !R.isNil(name) && name.length > 4 && name.startsWith("MAP") || (name.charAt(0) === "E" && name.charAt(2) === "M");
}

/** Finds next map in directory */
const findNextMapDir = (dirs: Directory[]) => (offset: number): Either<Directory> =>
    Either.ofNullable(dirs.find(d => d.idx >= offset && isMapName(d.name)), () => "No Map-Directory on offset:" + offset)

const parseThing = (bytes: number[]) => (thingDir: Directory) => (thingIdx: number): Either<Thing> => {
    const offset = thingDir.filepos + 10 * thingIdx;
    const parseShortBytes = parseShort(bytes)

    return Either.of({
        dir: thingDir,
        name: MapLumpName.THINGS,
        x: parseShortBytes(offset + 0),
        y: parseShortBytes(offset + 2),
        angleFacing: parseShortBytes(offset + 4),
        type: parseShortBytes(offset + 6),
        flags: parseShortBytes(offset + 8),
    });
}
const parseThings = (dirs: Directory[]) => (mapIdx: number): Either<Thing[]> => {
    const mapDir = dirs[mapIdx];
    const thingDir = dirs[mapIdx + 1 + MapLumpName.THINGS]

    return null;
}

const parseAllDirectories = (header: Header, bytes: number[]): Directory[] =>
    R.unfold(idx => idx > header.numlumps ? false : [header.infotableofs + idx * 16, idx + 1], 0)
        .map((ofs, index) => parseDirectory(ofs, index, bytes))

const parseDirectory = (offset: number, idx: number, bytes: number[]): Directory => {
    const parseIntBytes = parseInt(bytes)
    return {
        filepos: parseIntBytes(offset),
        size: parseIntBytes(offset + 0x04),
        name: parseStr(bytes)(offset + 0x08, 8),
        idx
    }
}

class WadParser {
    static parse(bytes8: Uint8Array) {
        return "parsed!"
    }
}

// ############################ EXPORTS ############################
export const testFunctions = {
    parseStr,
    parseInt,
    parseHeader,
    parseDirectory,
    parseAllDirectories,
    isMapName,
    findNextMapDir,
    parseThing
}
export default WadParser