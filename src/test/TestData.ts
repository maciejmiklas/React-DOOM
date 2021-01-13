import {testFunctions as mpt} from "../main/wad/MapParser";
import {functions as dp} from "../main/wad/DirectoryParser";

import {Directory, Header, MapLumpType, Vertex,} from "../main/wad/WadModel";

import jsonData from "./data/doom.json"
import {Either} from "../main/Either";
import {util} from "../main/util";

// @ts-ignore
export const WAD_BYTES = util.base64ToUint8Array(jsonData.doom)

export const FIRST_MAP_DIR_OFFSET = 6 // starting from 0
export const HEADER: Either<Header> = dp.parseHeader(WAD_BYTES);
export const ALL_DIRS: Either<Directory[]> = HEADER.map(header => dp.parseAllDirectories(header, WAD_BYTES))
export const FIRST_MAP: Directory = ALL_DIRS.map(dirs => mpt.findNextMapDir(dirs)).get()(0).get();
expect(FIRST_MAP.name).toEqual("E1M1")

export const FD_E1M1: Directory = {
    filepos: 130300,
    size: 0,
    name: "E1M1",
    idx: 6
}

export const FD_E1M2: Directory = {
    filepos: 186020,
    size: 0,
    name: "E1M2",
    idx: 17
}


export const E1M1_THINGS: Directory = {
    filepos: 130300,
    size: 1380,
    name: MapLumpType[MapLumpType.THINGS],
    idx: 7
}

export const E1M1_LINEDEFS: Directory = {
    filepos: 131680,
    size: 6650,
    name: MapLumpType[MapLumpType.LINEDEFS],
    idx: 8
}

export const E1M1_BLOCKMAP: Directory = {
    filepos: 179096,
    size: 6922,
    name: MapLumpType[MapLumpType.BLOCKMAP],
    idx: 16
}

export const VERTEX_0: Vertex = {
    x: 1088,
    y: -3680
}

export const VERTEX_1: Vertex = {
    x: 1024,
    y: -3680
}

export const VERTEX_2: Vertex = {
    x: 1024,
    y: -3648
}

export const VERTEX_3: Vertex = {
    x: 1088,
    y: -3648
}

export const VERTEX_26: Vertex = {
    x: 1344,
    y: -3360
}

export const VERTEX_27: Vertex = {
    x: 1344,
    y: -3264
}

export const VERTEX_466: Vertex = {
    x: 2912,
    y: -4848
}

export const eqDir = (dir: Directory, given: Directory) => {
    expect(dir.name).toEqual(given.name)
    expect(dir.filepos).toEqual(given.filepos)
    expect(dir.size).toEqual(given.size)
    expect(dir.idx).toEqual(given.idx)
}

export const validateDir = (header: Header) => (nr: number, given: Directory) => {
    const dir = dp.parseDirectory(header.infotableofs + 16 * nr, nr, WAD_BYTES);
    eqDir(dir, given);
}