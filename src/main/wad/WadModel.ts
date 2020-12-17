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

    /** Index of this directory in Directory[] starting from 0. It also indicates position (order) in file. */
    idx: number

    /** An integer holding a pointer to the start of the lump's data in the file.  */
    filepos: number

    /** An integer representing the size of the lump in bytes. */
    size: number

    /** An ASCII string defining the lump's type. */
    name: string
}

/** Those Lumps must follow in file immediately after map type, in exactly this order! */
export enum LumpType {
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
 * Each lump has a type (up to 8 characters), which is not necessarily unique. Lumps contain data such as:
 * Graphics, Sounds, Music, Demos, Sprites, Wall textures, Wall patches, Flats, Level maps and associated data
 */
export type Lump = {
    dir: Directory
    type: LumpType
}

/** range from -32768 to +32767 */
export type Position = {
    x: number,
    y: number
}

/**
 * A lump listing all the Things present in this map: their X and Y coordinates, starting angles, type and flags.
 *
 * Things represent players, monsters, pick-ups, and projectiles. Inside the game, these are known as actors, or mobjs.
 * They also represent obstacles, certain decorations, player start positions and teleport landing sites.
 *
 * see: https://doomwiki.org/wiki/Thing
 */
export type Thing = Lump & {
    position: Position
    angleFacing: number,
    type: number,
    flags: number
}

/**
 * Vertices are nothing more than coordinates on the map.
 *
 * @see https://doomwiki.org/wiki/Vertex
 */
export type Vertex = Position & {

}

/**
 * Linedefs are what make up the 'shape' (for lack of a better word) of a map. Every linedef is between two vertices
 * and contains one or two sidedefs (which contain wall texture data). There are two major purposes of linedefs.
 * The first is to divide the map into sectors, and the second is to trigger action specials.
 *
 * @see https://doomwiki.org/wiki/Linedef
 */
export type Linedef = Lump & {
    start: Vertex,
    end: Vertex,
    flags: number,
    specialType: number,
    sectorTag: number,
    frontSide: number,
    backSide:number
}

/**
 * A list of the sidedefs that are linked to the linedefs. These contain the data for what textures appear where on the
 * side of each line, their X and Y offsets, and what sector this side of the linedef belongs to.
 */
export type Sidedef = Lump & {
    xxx: number
}

/** A list of each vertex in the map, using X and Y coordinates. */
export type Vertexe = Lump & {
    xxx: number
}

/** A list of line segments called "segs" that connect to form subsectors. */
export type Seg = Lump & {
    xxx: number
}

/** A list of subsectors, created by a node builder. */
export type Ssector = Lump & {
    xxx: number
}

/**
 * The node tree which Doom uses to speed up the rendering process. Similar to a vismap in modern 3D games
 * (such as Quake 3). Created by a node builder.
 */
export type Node = Lump & {
    xxx: number
}

/**
 * Defines the floor and ceiling heights and textures, as well as light get, tag, and type of each sector in your map.
 */
export type Sector = Lump & {
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

/** All lumps from Map */
export type MapLumps = {
    /** The directory indication beginning of the map in the file. nameDir#type gives type of the map */
    nameDir: Directory
    things: Thing[]
    linedefs: Linedef[]
    sidedefs: Sidedef[]
    vertexes: Vertexe[]
    segs: Seg[]
    ssectors: Ssector[]
    nodes: Node[]
    sectors: Sector[]
    reject: Reject[]
    blockmap: Blockmap[]
}

export enum WadType {
    IWAD,
    PWAD
}
