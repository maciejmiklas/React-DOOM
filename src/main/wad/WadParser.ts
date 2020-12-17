import * as R from "ramda";
import {Either} from "../Either"
import {Directory, Header, Linedef, LumpType, Thing, Vertex, WadType} from "./WadModel";
import {Log} from "../Log";

const trim0Padding = (bytes: number[], pos: number) =>
    R.until((v: number) => bytes[v] !== 0, (v: number) => v - 1)(pos) + 1

const parseStr = (bytes: number[]) => (pos: number, length: number): string =>
    String.fromCharCode.apply(null, bytes.slice(pos, trim0Padding(bytes, pos + length - 1)))

/** Converts given 4-byte array to number. Notation: little-endian (two's complement) */
const parseNumber = (bytes: number[]) => (pos: number): number => {
    return R.pipe<number[], number[], number[], number>(
        R.slice(pos, pos + 4),
        R.reverse,
        R.curry(R.reduce)((val: number, cur: number) => val << 8 | cur, 0)
    )(bytes)
}

/** little-endian 32bit signed (two's complement) int */
const parseInt = (bytes: number[]) => (pos: number): number => parseNumber(bytes)(pos)

const signedByte = (byte: number) => (byte & 0x80) === 0x80

/** little-endian 16bit signed (two's complement) int */
const parseShort = (bytes: number[]) => (pos: number): number => {
    const padding = signedByte(bytes[pos + 1]) ? 0xFF : 0x00
    return parseNumber([bytes[pos], bytes[pos + 1], padding, padding])(0)
}

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

    Log.debug("Parsed Header: %1", header)
    return Either.ofCondition(
        () => !R.isNil(header.identification) && header.identification === WadType.IWAD,
        () => "Unsupported Header" + headerStr,
        () => header)
}

/** The type of the map has to be in the form ExMy or MAPxx */
const isMapName = (name: string): boolean => {
    return !R.isNil(name) && name.length > 4 && name.startsWith("MAP") || (name.charAt(0) === "E" && name.charAt(2) === "M");
}

/** Finds next map in directory */
const findNextMapDir = (dirs: Directory[]) => (offset: number): Either<Directory> =>
    Either.ofNullable(dirs.find(d => d.idx >= offset && isMapName(d.name)), () => "No Map-Directory on offset:" + offset)

const parseThing = (bytes: number[], thingDir: Directory) => (thingIdx: number): Either<Thing> => {
    const offset = thingDir.filepos + 10 * thingIdx;
    const parseShortBytes = parseShort(bytes)
    const thing = {
        dir: thingDir,
        name: LumpType.THINGS,
        position: {
            x: parseShortBytes(offset),
            y: parseShortBytes(offset + 2),
        },
        angleFacing: parseShortBytes(offset + 4),

        // TODO type should be enum from https://doomwiki.org/wiki/Thing_types#Monsters
        type: parseShortBytes(offset + 6),
        flags: parseShortBytes(offset + 8),
    };
    Log.trace("Parsed Thing on %1 -> %2", thingIdx, thing);
    return Either.of(thing);
}

const unfoldByDirectorySize = (dir: Directory, size: number): number[] =>
    R.unfold((idx) => idx == dir.size / size ? false : [dir.filepos + idx * 10, idx + 1], 0)

const parseThings = (bytes: number[], dirs: Directory[]) => (mapIdx: number): Either<Thing[]> => {
    const thingDir = dirs[mapIdx + 1 + LumpType.THINGS]
    const parser = parseThing(bytes, thingDir)
    return Either.ofCondition(
        () => thingDir.name === "THINGS",
        () => "Directory: " + thingDir + " on map " + mapIdx + " is not a Thing",
        () => unfoldByDirectorySize(thingDir, 10)
            .map((ofs, thingIdx) => parser(thingIdx)).filter(th => th.isRight()).map(th => th.get()));
}

const parseLinedef = (bytes: number[], thingDir: Directory, vertexes: Vertex[]) => (thingIdx: number): Linedef => {
    const offset = thingDir.filepos + 14 * thingIdx;
    const parseShortBytes = parseShort(bytes)
    const linedef = {
        dir: thingDir,
        type: LumpType.LINEDEFS,
        start: vertexes[parseShortBytes(offset)],
        end: vertexes[parseShortBytes(offset + 2)],
        flags: parseShortBytes(offset + 4),
        specialType: parseShortBytes(offset + 6),
        sectorTag: parseShortBytes(offset + 8),
        frontSide: parseShortBytes(offset + 10),
        backSide: parseShortBytes(offset + 12)
    };
    Log.trace("Parsed Linedef on %1 -> %2", thingIdx, linedef);
    return linedef;
}

const parseLinedefs = (bytes: number[], dirs: Directory[], vertexes: Vertex[]) => (mapIdx: number): Either<Linedef[]> => {
    const linedefsDir = dirs[mapIdx + 1 + LumpType.LINEDEFS]
    const parser = parseLinedef(bytes, linedefsDir, vertexes)
    return Either.ofCondition(
        () => linedefsDir.name === "LINEDEFS",
        () => "Directory: " + linedefsDir + " on map " + mapIdx + " is not a Thing",
        () => unfoldByDirectorySize(linedefsDir, 14).map((ofs, thingIdx) => parser(thingIdx)));
}

const parseVertex = (bytes: number[], thingDir: Directory) => (thingIdx: number): Vertex => {
    const offset = thingDir.filepos + 4 * thingIdx;
    const parseShortBytes = parseShort(bytes)
    return {
        x: parseShortBytes(offset),
        y: parseShortBytes(offset + 2),
    };
}

const parseVertexes = (bytes: number[], dirs: Directory[]) => (mapIdx: number): Either<Vertex[]> => {
    const thingDir = dirs[mapIdx + 1 + LumpType.VERTEXES]
    const parser = parseVertex(bytes, thingDir)
    return Either.ofCondition(
        () => thingDir.name === "VERTEXES",
        () => "Directory: " + thingDir + " on map " + mapIdx + " is not a Vertex",
        () => unfoldByDirectorySize(thingDir, 4).map((ofs, thingIdx) => parser(thingIdx)));
}

const parseAllDirectories = (header: Header, bytes: number[]): Directory[] =>
    R.unfold(idx => idx > header.numlumps ? false : [header.infotableofs + idx * 16, idx + 1], 0)
        .map((ofs, index) => parseDirectory(ofs, index, bytes))

const parseDirectory = (offset: number, idx: number, bytes: number[]): Directory => {
    const parseIntBytes = parseInt(bytes)
    const dir = {
        filepos: parseIntBytes(offset),
        size: parseIntBytes(offset + 0x04),
        name: parseStr(bytes)(offset + 0x08, 8),
        idx
    };
    Log.trace("Parsed Directory %1 on %2 -> %3", idx, offset, dir);
    return dir
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
    parseThing,
    parseThings,
    parseVertex,
    parseShort,
    parseVertexes,
    parseLinedef
}
export default WadParser