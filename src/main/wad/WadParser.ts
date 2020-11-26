import * as R from "ramda";

const trim0Padding = (bytes: number[], pos: number) =>
    R.until((v: number) => bytes[v] !== 0, (v: number) => v - 1)(pos) + 1

const parseStr = (pos: number, length: number) => (bytes: number[]): string =>
    String.fromCharCode.apply(null, bytes.slice(pos, trim0Padding(bytes, pos + length - 1)))

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

/** The name of the map has to be in the form ExMy or MAPxx */
const isMapName = (name: string): boolean => {
    return name.length > 4 && name.startsWith("MAP") || (name.charAt(0) === "E" && name.charAt(2) === "M");
}

/** Finds next map in directory */
const findNextMapDir = (dirs: Directory[]) => (offset: number): Directory =>
   dirs.find(d => d.idx >= offset && isMapName(d.name))

const parseThings = (dirs: Directory[]) => (mapIdx: number): Things => {
    return null;
}

const parseAllDirectories = (header: Header, bytes: number[]): Directory[] => R
    .unfold(idx => idx > header.numlumps ? false : [header.infotableofs + idx * 16, idx + 1], 0)
    .map((ofs, index) => parseDirectory(ofs, index, bytes))

const parseDirectory = (offset: number, idx: number, bytes: number[]): Directory => {
    return {
        filepos: parseInt(offset)(bytes),
        size: parseInt(offset + 0x04)(bytes),
        name: parseStr(offset + 0x08, 8)(bytes),
        idx
    }
}

// ############################ TYPES ############################
/** A WAD file always starts with a 12-byte header. */
export type Header = {
    identification: WadType

    /** An integer specifying the number of lumps in the WAD. */
    numlumps: number

    /** An integer holding a pointer to the location of the directory. */
    infotableofs: number
}

/**
 * The directory associates names of lumps with the data that belong to them. It consists of a number of entries,
 * each with a length of 16 bytes. The length of the directory is determined by the number given in the WAD header.
 */
export type Directory = {

    /** Index of the directory in Directory[] starting from 0. It also indicated position (order) in file. Idx can be
     * used to calculate directory position in file: Header#infotableofs + (#idx + 1) * 16 */
    idx: number

    /** An integer holding a pointer to the start of the lump's data in the file.  */
    filepos: number

    /** An integer representing the size of the lump in bytes. */
    size: number

    /** An ASCII string defining the lump's name. */
    name: string
}

/** Those Lumps must follow in file immediately after map name, in exactly this order! */
export enum MapLumpName {
    THINGS,
    LINEDEFS,
    SIDEDEFS,
    VERTEXES,
    SEGS,
    SSECTORS,
    NODES,
    SECTORS,
    REJECT,
    BLOCKMAP
}

/**
 * A lump is any section of data within the structure of a WAD file, or a file containing such a portion of a WAD file.
 * Each lump has a name (up to 8 characters), which is not necessarily unique. Lumps contain data such as:
 * Graphics, Sounds, Music, Demos, Sprites, Wall textures, Wall patches, Flats, Level maps and associated data
 */
export type Lump = {
    dir: Directory
}

export type MapLump = Lump & {
    name: MapLumpName
}

/**
 * A lump listing all the Things present in this map: their X and Y coordinates, starting angles, type and flags.
 */
export type Things = MapLump & {
    xxx: number
}

/**
 * A list of linedefs, defined by their starting and ending vertices, flags, type, tag, and front and back
 * sidedefs (if any).
 */
export type Linedefs = MapLump & {
    xxx: number
}

/**
 * A list of the sidedefs that are linked to the linedefs. These contain the data for what textures appear where on the
 * side of each line, their X and Y offsets, and what sector this side of the linedef belongs to.
 */
export type Sidedefs = MapLump & {
    xxx: number
}

/** A list of each vertex in the map, using X and Y coordinates. */
export type Vertexes = MapLump & {
    xxx: number
}

/** A list of line segments called "segs" that connect to form subsectors. */
export type Segs = MapLump & {
    xxx: number
}

/** A list of subsectors, created by a node builder. */
export type Ssectors = MapLump & {
    xxx: number
}

/**
 * The node tree which Doom uses to speed up the rendering process. Similar to a vismap in modern 3D games
 * (such as Quake 3). Created by a node builder.
 */
export type Nodes = MapLump & {
    xxx: number
}

/**
 * Defines the floor and ceiling heights and textures, as well as light value, tag, and type of each sector in your map.
 */
export type Sectors = MapLump & {
    xxx: number
}

/**
 * Optionally compiled by the node builder, this lump contains data about which sectors are visible from which other
 * sectors. Originally, Doom used this to optimize the game speed by skipping AI routines for enemies whose target was
 * in a rejected sector. Some modern source ports do not require this lump any more; ZDoom for example has been
 * designed to work even without this lump present. For compatibility purposes, an empty (0-filled) REJECT
 * lump should be included if nothing else. The REJECT lump can also be used to create certain special effects
 * (sectors into which enemies cannot see, for example) if modified carefully.
 */
export type Reject = {
    xxx: number
}

/** Collision-detection information which determines whether objects in a map are touching. */
export type Blockmap = {
    xxx: number
}

export type LevelMap = {
    /** The directory indication beginning of the map in the file */
    nameDir: Directory
    things: Things
    linedefs: Linedefs
    sidedefs: Sidedefs
    vertexes: Vertexes
    segs: Segs
    ssectors: Ssectors
    nodes: Nodes
    sectors: Sectors
    reject: Reject
    blockmap: Blockmap
}

export enum WadType {
    IWAD,
    PWAD
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
    findNextMapDir
}
export default WadParser