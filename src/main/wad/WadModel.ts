/**
 * WAD - "Where's All the Data?" contains maps for each level, monsters, pickups, sound and textures, so basically
 * whole data set for DOOM game.
 *
 * WAD begins with a Header, this one contains offset to list of Directory entries and amount of directories.
 * Each Directory contains name of the Lump and pointed to data in file for this Lump.
 *
 * Lump is basically any kind of data that can be found in WAD and the location of the Lump is given by Directory.
 *
 * Map consists of Lumps such: Thing (monster) or Linedef (wall), but Lump can be also a texture or sound.
 */

/** A WAD file always starts with a 12-byte header. */
import {Either} from "../Either";

export type Header = {
    identification: WadType

    /** Number of lumps in WAD. */
    numlumps: number

    /** Offset in WAD to the location of the directory. */
    infotableofs: number
}

/**
 * The directory associates names of lumps with the data that belong to them. It consists of a number of entries,
 * each with a length of 16 bytes. The length of the directory is determined by the number given in the WAD header.
 *
 * @see https://doomwiki.org/wiki/WAD#Directory
 */
export type Directory = {

    /** Index of this directory in Directory[] starting from 0. It also indicates position (order) in file. */
    idx: number

    /** Start of Lump's data in WAD  */
    filepos: number

    /** Lump size in bytes. Lump position int WAD: [#filepos,....,#filepos + size] */
    size: number

    /** Lump's name. Map contains of few predefined Lumps (MapLumpType), but there are also other types of Lumps */
    name: string
}

/**
 * Lump's names and their order within single map. The first element does not indicate a real Lump, it's just a
 * starting directory of the map.
 */
export enum MapLumpType {
    MAP_NAME,
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
 * Lump is a abstract data type found in each map.
 * Each Lump definition starts with Directory containing type of the Lump and pointer to Lump's data in WAD.
 */
export type Lump = {
    dir: Directory
}

/**
 * Lump is a abstract data type found in each map.
 * Each Lump definition starts with Directory containing type of the Lump and pointer to Lump's data in WAD.
 */
export type MapLump = Lump & {
    type: MapLumpType
}

/** range from -32768 to +32767 */
export type Position = {
    x: number,
    y: number
}

/**
 * Things represent monsters, pick-ups, and projectiles.
 *
 * see: https://doomwiki.org/wiki/Thing
 */
export type Thing = MapLump & {
    position: Position
    angleFacing: number,
    type: number,
    flags: number
}

/**
 * Position on the map. WAD contains list of all possible positions stored in Lump: VERTEXES.
 * SIDEDEFS contains list of walls on particular map, where each wall references two Vertex, as it's start and end
 * position on the map.
 *
 * @see https://doomwiki.org/wiki/Vertex
 */
export type Vertex = Position & {
    // empty
}

/**
 * Linedef represents single wall on the map.
 * @see https://doomwiki.org/wiki/Linedef
 */
export type Linedef = MapLump & {
    start: Vertex
    end: Vertex
    flags: number
    specialType: number
    sectorTag: number
    frontSide: Sidedef
    backSide: Either<Sidedef>
}

/**
 * Sidedef contains textures for each wall on the map (Linedef)
 *
 * @see https://doomwiki.org/wiki/Sidedef
 */
export type Sidedef = MapLump & {
    offset: Position
    upperTexture: Either<string>
    lowerTexture: Either<string>
    middleTexture: Either<string>
    sector: number
}

export type Vertexe = MapLump & {
    xxx: number
}

export type Seg = MapLump & {
    xxx: number
}

export type Ssector = MapLump & {
    xxx: number
}

export type Node = MapLump & {
    xxx: number
}

export type Sector = MapLump & {
    xxx: number
}

/**
 * Map can be found within WAD as a directory with Name following syntax: ExMy or MAPxx. This directory is being
 * followed by:
 E1M1 --
 THINGS
 LINEDEFS
 SIDEDEFS
 VERTEXES
 SEGS
 SSECTORS
 NODES
 SECTORS
 REJECT
 BLOCKMAP
 * Each Map contains those directories in exact this order.
 */
export type Map = {
    nameDir: Directory
    things: Thing[]
    linedefs: Linedef[]
    sidedefs: Sidedef[]
    vertexes: Vertexe[]
    segs: Seg[]
    ssectors: Ssector[]
    nodes: Node[]
    sectors: Sector[]
}

export enum WadType {
    IWAD,
    PWAD
}

/**
 * Header of Doom Picture (Patch)
 * @see https://doomwiki.org/wiki/Picture_format
 */
export type PatchHeader = {
    dir: Directory
    width: number
    height: number
    xOffset: number
    yOffset: number

    /**
     * Columns offsets relative to start of WAD file.
     * Size of this array is given by width, because it represents horizontal lines on bitmap.
     * Each value in this array points to byes array in WAD file, the size of this array is determined by height.
     *
     * For picture 320x200 we have #columnofs with 320 entries, each one pointing to array in WAD that is 200 bytes long
     */
    columnofs: number[]
}

/**
 * Bitmap column (known as post) of Doom's bitmap. Offset to each columns is given by PatchHeader#columnofs
 *
 * @see https://doomwiki.org/wiki/Picture_format -> Posts
 */
export type Post = {

    /** vertical offset of this post in patch. */
    topdelta: number

    /** Total size of this post including padding bytes. Used to calculate position of next post in column */
    postBytes: number

    /**
     * Array of pixels is this post. Length is given by #length.
     * Each pixel has value 0-255 and it's an index in Doom palate
     */
    data: number[]

    /** Starting position in WAD of this Post */
    filepos: number
}

/**
 * Data of each column is divided into posts, which are lines going downward on the screen (columns).
 *
 * ???
 * Each post has offset in pixels, that gives it's position in column. There could be gap between Posts - in
 * such case free pixels are transparent
 * ????
 *
 */
export type Column = {
    posts: Post[]
}

/**
 * Picture/bitmap in Doom's Patch format
 *
 * @see https://doomwiki.org/wiki/Picture_format
 * @see https://www.cyotek.com/blog/decoding-doom-picture-files
 */
export type PatchBitmap = {
    header: PatchHeader
    columns: Column[]
}

/**
 * Title pictures from WAD
 *
 * @see https://doomwiki.org/wiki/Title_screen
 */
export type TitlePic = {
    help: Either<PatchBitmap[]>
    title: PatchBitmap,
    credit: PatchBitmap
}

export type Wad = {
    header: Header,
    title: TitlePic,
    maps: Map[],
    dirs: Directory[]
}

