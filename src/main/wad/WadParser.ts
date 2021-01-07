import * as R from "ramda";
import {Either} from "../Either"
import {Directory, Header, Linedef, MapLumpType, Sidedef, Thing, Vertex, WadType} from "./WadModel";
import {Log} from "../Log";
import {util} from "../util";

const parseHeader = (bytes: number[]): Either<Header> => {
    const headerStr = util.parseStrOp(bytes)(s => s === "IWAD", (s) => "WAD type not supported: " + s)(0x00, 4)
    const parseIntBytes = util.parseInt(bytes);
    return Either.ofTruth([headerStr], () =>
        ({
            identification: headerStr.map(s => WadType[s]).get(),
            numlumps: parseIntBytes(0x04),
            infotableofs: parseIntBytes(0x08)
        })).exec(h => Log.debug("Parsed Header: %1", h))
}

/** The type of the map has to be in the form ExMy or MAPxx */
const isMapName = (name: string): boolean => {
    return !R.isNil(name) && name.length > 4 && name.startsWith("MAP") || (name.charAt(0) === "E" && name.charAt(2) === "M");
}

/** Finds next map in directory */
const findNextMapStartDir = (dirs: Directory[]) => (offset: number): Either<Directory> =>
    Either.ofNullable(dirs.find(d => d.idx >= offset && isMapName(d.name)), () => "No Map-Directory on offset:" + offset)

const unfoldByDirectorySize = (dir: Directory, size: number): number[] =>
    R.unfold((idx) => idx == dir.size / size ? false : [dir.filepos + idx * 10, idx + 1], 0)

const parseThing = (bytes: number[], dir: Directory) => (thingIdx: number): Thing => {
    const offset = dir.filepos + 10 * thingIdx;
    const parseShortBytes = util.parseShort(bytes)
    const thing = {
        dir: dir,
        name: MapLumpType.THINGS,
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
    return thing;
}

const parseThings = (bytes: number[], dirs: Directory[]) => (mapIdx: number): Either<Thing[]> => {
    const thingDir = dirs[mapIdx + MapLumpType.THINGS]
    const parser = parseThing(bytes, thingDir)
    return Either.ofCondition(
        () => thingDir.name === "THINGS",
        () => "Directory: " + thingDir + " on map " + mapIdx + " is not a Thing",
        () => unfoldByDirectorySize(thingDir, 10)
            .map((ofs, thingIdx) => parser(thingIdx)).map(th => th));
}

const parseSidedef = (bytes: number[], dir: Directory) => (thingIdx: number): Sidedef => {
    const offset = dir.filepos + 30 * thingIdx;
    const parseShortBytes = util.parseShort(bytes)
    const parseStrOpBytes = util.parseStrOp(bytes)(v => v !== "-", () => "")
    const sidedef = {
        dir: dir,
        type: MapLumpType.SIDEDEFS,
        offset: {
            x: parseShortBytes(offset),
            y: parseShortBytes(offset + 2),
        },
        upperTexture: parseStrOpBytes(offset + 4, 8),
        lowerTexture: parseStrOpBytes(offset + 12, 8),
        middleTexture: parseStrOpBytes(offset + 20, 8),
        sector: parseShortBytes(offset + 28)
    };
    Log.trace("Parsed Sidedef on %1 -> %2", thingIdx, sidedef);
    return sidedef;
}

const parseSidedefs = (bytes: number[], dirs: Directory[]) => (mapIdx: number): Either<Sidedef[]> => {
    const thingDir = dirs[mapIdx + MapLumpType.SIDEDEFS]
    const parser = parseSidedef(bytes, thingDir)
    return Either.ofCondition(
        () => thingDir.name === "SIDEDEFS",
        () => "Directory: " + thingDir + " on map " + mapIdx + " is not a Sidedef",
        () => unfoldByDirectorySize(thingDir, 30)
            .map((ofs, thingIdx) => parser(thingIdx)).map(th => th));
}

const parseLinedef = (bytes: number[], dir: Directory, vertexes: Vertex[], sidedefs: Sidedef[]) => (thingIdx: number): Either<Linedef> => {
    const offset = dir.filepos + 14 * thingIdx;
    const parseShortBytes = util.parseShort(bytes)
    const parseShortOpBytes = util.parseShortOp(bytes)

    const parseVertex = parseShortOpBytes(v => v < vertexes.length && v >= 0,
        v => "Vertex out of bound: " + v + " of " + vertexes.length + " on " + offset)
    const startVertex = parseVertex(offset).map(idx => vertexes[idx]);
    const endVertex = parseVertex(offset + 2).map(idx => vertexes[idx]);

    const parseSide = parseShortOpBytes(v => v < sidedefs.length && v >= 0,
        v => "Sidedef out of bound: " + v + " of " + sidedefs.length + " on " + offset)
    const frontSide = parseSide(offset + 10).map(idx => sidedefs[idx]);
    const backSide = parseSide(offset + 12).map(idx => sidedefs[idx]);

    return Either.ofTruth([startVertex, endVertex, frontSide], () =>
        ({
            dir: dir,
            type: MapLumpType.LINEDEFS,
            start: startVertex.get(),
            end: endVertex.get(),
            flags: parseShortBytes(offset + 4),
            specialType: parseShortBytes(offset + 6),
            sectorTag: parseShortBytes(offset + 8),
            frontSide: frontSide.get(),
            backSide: backSide
        })).exec(v => {
        Log.trace("Parsed Linedef on %1 -> %2", thingIdx, v)
    })
}

const parseLinedefs = (bytes: number[], dirs: Directory[], vertexes: Vertex[], sidedefs: Sidedef[]) => (mapIdx: number): Either<Linedef[]> => {
    const linedefsDir = dirs[mapIdx + MapLumpType.LINEDEFS]
    const parser = parseLinedef(bytes, linedefsDir, vertexes, sidedefs)
    const parsed = unfoldByDirectorySize(linedefsDir, 14).map((ofs, thingIdx) => parser(thingIdx)).filter(v => v.isRight()).map(v => v.get())
    return Either.ofCondition(
        () => linedefsDir.name === "LINEDEFS" && parsed.length > 0,
        () => "Directory: " + linedefsDir + " on map " + mapIdx + " is not a LINEDEFS",
        () => parsed);
}

const parseVertex = (bytes: number[], thingDir: Directory) => (thingIdx: number): Vertex => {
    const offset = thingDir.filepos + 4 * thingIdx;
    const parseShortBytes = util.parseShort(bytes)
    return {
        x: parseShortBytes(offset),
        y: parseShortBytes(offset + 2),
    };
}

const parseVertexes = (bytes: number[], dirs: Directory[]) => (mapIdx: number): Either<Vertex[]> => {
    const thingDir = dirs[mapIdx + MapLumpType.VERTEXES]
    const parser = parseVertex(bytes, thingDir)
    return Either.ofCondition(
        () => thingDir.name === "VERTEXES",
        () => "Directory: " + thingDir + " on map " + mapIdx + " is not a VERTEXES",
        () => unfoldByDirectorySize(thingDir, 4).map((ofs, thingIdx) => parser(thingIdx)));
}

const parseAllDirectories = (header: Header, bytes: number[]): Directory[] =>
    R.unfold(idx => idx > header.numlumps ? false : [header.infotableofs + idx * 16, idx + 1], 0)
        .map((ofs, index) => parseDirectory(ofs, index, bytes))

const parseDirectory = (offset: number, idx: number, bytes: number[]): Directory => {
    const parseIntBytes = util.parseInt(bytes)
    const dir = {
        filepos: parseIntBytes(offset),
        size: parseIntBytes(offset + 0x04),
        name: util.parseStr(bytes)(offset + 0x08, 8),
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
    parseHeader,
    parseDirectory,
    parseAllDirectories,
    isMapName,
    findNextMapDir: findNextMapStartDir,
    parseThing,
    parseThings,
    parseVertex,
    parseVertexes,
    parseLinedef,
    parseLinedefs,
    parseSidedef,
    parseSidedefs
}
export default WadParser