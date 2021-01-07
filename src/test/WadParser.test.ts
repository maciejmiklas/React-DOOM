import {testFunctions as tf} from "../main/wad/WadParser";
import {Directory, Header, Linedef, MapLumpType, Sidedef, Thing, Vertex, WadType} from "../main/wad/WadModel";
import jsonData from "./data/doom.json"
import {Either} from "../main/Either";
import {util} from "../main/util";

// @ts-ignore
const WAD_BYTES = util.base64ToUint8Array(jsonData.doom)

const FIRST_MAP_DIR_OFFSET = 6 // starting from 0
const HEADER: Either<Header> = tf.parseHeader(WAD_BYTES);
const ALL_DIRS: Either<Directory[]> = HEADER.map(header => tf.parseAllDirectories(header, WAD_BYTES))
const FIRST_MAP: Directory = ALL_DIRS.map(dirs => tf.findNextMapDir(dirs)).get()(0).get();
expect(FIRST_MAP.name).toEqual("E1M1")

const E1M1_THINGS: Directory = {
    filepos: 130300,
    size: 1380,
    name: MapLumpType[MapLumpType.THINGS],
    idx: 7
}

const E1M1_LINEDEFS: Directory = {
    filepos: 131680,
    size: 6650,
    name: MapLumpType[MapLumpType.LINEDEFS],
    idx: 8
}

const E1M1_BLOCKMAP: Directory = {
    filepos: 179096,
    size: 6922,
    name: MapLumpType[MapLumpType.BLOCKMAP],
    idx: 16
}

const FD_E1M1: Directory = {
    filepos: 130300,
    size: 0,
    name: "E1M1",
    idx: 6
}

const FD_E1M2: Directory = {
    filepos: 186020,
    size: 0,
    name: "E1M2",
    idx: 17
}

const VERTEX_0: Vertex = {
    x: 1088,
    y: -3680
}

const VERTEX_1: Vertex = {
    x: 1024,
    y: -3680
}
const VERTEX_2: Vertex = {
    x: 1024,
    y: -3648
}
const VERTEX_3: Vertex = {
    x: 1088,
    y: -3648
}
const VERTEX_26: Vertex = {
    x: 1344,
    y: -3360
}
const VERTEX_27: Vertex = {
    x: 1344,
    y: -3264
}
const VERTEX_466: Vertex = {
    x: 2912,
    y: -4848
}


describe("Parse Header", () => {
    test("IWAD", () => {
        const header = HEADER.get();
        expect(header.identification).toEqual(WadType.IWAD)
        expect(header.numlumps).toEqual(1241)
        expect(header.infotableofs).toEqual(4205648)
    });
});

const eqDir = (dir: Directory, given: Directory) => {
    expect(dir.name).toEqual(given.name)
    expect(dir.filepos).toEqual(given.filepos)
    expect(dir.size).toEqual(given.size)
    expect(dir.idx).toEqual(given.idx)
}

const validateDir = (header: Header) => (nr: number, given: Directory) => {
    const dir = tf.parseDirectory(header.infotableofs + 16 * nr, nr, WAD_BYTES);
    eqDir(dir, given);
}

describe("Find Map Directory", () => {
    const header = HEADER.get();
    const validate = validateDir(header);

    test("First MAP", () => {
        validate(FIRST_MAP_DIR_OFFSET, FD_E1M1)
    });

    test("Second MAP", () => {
        validate(FIRST_MAP_DIR_OFFSET + MapLumpType.BLOCKMAP + 1, FD_E1M2)
    });
})

const validateThingsDir = (dir: Directory) => {
    expect(dir.name).toEqual("THINGS")
}

const validateFirstThing = (thing: Thing) => {
    validateThingsDir(thing.dir)
    expect(thing.position.x).toEqual(1056)
    expect(thing.position.y).toEqual(-3616)
    expect(thing.angleFacing).toEqual(90)
    expect(thing.type).toEqual(1)
    expect(thing.flags).toEqual(7)
}

const validateThirdThing = (thing: Thing) => {
    validateThingsDir(thing.dir)
    expect(thing.position.x).toEqual(1104)
    expect(thing.position.y).toEqual(-3600)
    expect(thing.angleFacing).toEqual(90)
    expect(thing.type).toEqual(3)
    expect(thing.flags).toEqual(7)
}

const validateLastThing = (thing: Thing) => {
    validateThingsDir(thing.dir)
    expect(thing.position.x).toEqual(3648)
    expect(thing.position.y).toEqual(-3840)
    expect(thing.angleFacing).toEqual(0)
    expect(thing.type).toEqual(2015)
    expect(thing.flags).toEqual(7)
}

describe("Parse Thing", () => {
    const thingsDir = ALL_DIRS.get()[FIRST_MAP.idx + 1]
    validateThingsDir(thingsDir)
    const parser = tf.parseThing(WAD_BYTES, thingsDir);

    test("First Thing", () => {
        validateFirstThing(parser(0))
    })

    test("Third Thing", () => {
        validateThirdThing(parser(2));
    })

    test("Last Thing", () => {
        validateLastThing(parser(thingsDir.size / 10 - 1));
    })
})

describe("Parse Things", () => {
    const thingsDir = ALL_DIRS.get()[FIRST_MAP.idx + MapLumpType.THINGS]
    expect(thingsDir.name).toEqual("THINGS")
    const parser = tf.parseThings(WAD_BYTES, ALL_DIRS.get())
    const things: Thing[] = parser(FIRST_MAP_DIR_OFFSET).get();

    test("Number of parsed Things", () => {
        expect(things.length).toEqual(thingsDir.size / 10)
    })

    test("First Thing", () => {
        validateFirstThing(things[0]);
    })

    test("Second Thing", () => {
        validateThirdThing(things[2]);
    })

    test("Last Thing", () => {
        validateLastThing(things[things.length - 1]);
    })

    test("Amount", () => {
        expect(things.length).toEqual(138)
    })
})

const validateSidedef_0 = (thing: Sidedef) => {
    validateSidedefDir(thing.dir)
    expect(thing.offset.x).toEqual(0)
    expect(thing.offset.y).toEqual(0)
    expect(thing.upperTexture.isLeft()).toBeTruthy()
    expect(thing.lowerTexture.isLeft()).toBeTruthy()
    expect(thing.middleTexture.get()).toEqual("DOOR3")
    expect(thing.sector).toEqual(40)
}

const validateSidedef_2 = (thing: Sidedef) => {
    validateSidedefDir(thing.dir)
    expect(thing.offset.x).toEqual(0)
    expect(thing.offset.y).toEqual(0)
    expect(thing.upperTexture.isLeft()).toBeTruthy()
    expect(thing.lowerTexture.isLeft()).toBeTruthy()
    expect(thing.middleTexture.get()).toEqual("LITE3")
    expect(thing.sector).toEqual(40)
}

const validateSidedef_26 = (thing: Sidedef) => {
    validateSidedefDir(thing.dir)
    expect(thing.offset.x).toEqual(0)
    expect(thing.offset.y).toEqual(0)
    expect(thing.upperTexture.get()).toEqual("STARTAN3")
    expect(thing.lowerTexture.get()).toEqual("STARTAN3")
    expect(thing.middleTexture.isLeft()).toBeTruthy()
    expect(thing.sector).toEqual(39)
}

const validateSidedef_27 = (thing: Sidedef) => {
    validateSidedefDir(thing.dir)
    expect(thing.offset.x).toEqual(0)
    expect(thing.offset.y).toEqual(0)
    expect(thing.upperTexture.isLeft()).toBeTruthy()
    expect(thing.lowerTexture.isLeft()).toBeTruthy()
    expect(thing.middleTexture.isLeft()).toBeTruthy()
    expect(thing.sector).toEqual(14)
}

const validateSidedef_189 = (thing: Sidedef) => {
    validateSidedefDir(thing.dir)
    expect(thing.offset.x).toEqual(0)
    expect(thing.offset.y).toEqual(0)
    expect(thing.upperTexture.get()).toEqual("TEKWALL4")
    expect(thing.lowerTexture.get()).toEqual("TEKWALL4")
    expect(thing.middleTexture.isLeft()).toBeTruthy()
    expect(thing.sector).toEqual(24)
}

const validateSidedef_211 = (thing: Sidedef) => {
    validateSidedefDir(thing.dir)
    expect(thing.offset.x).toEqual(0)
    expect(thing.offset.y).toEqual(56)
    expect(thing.upperTexture.isLeft()).toBeTruthy()
    expect(thing.lowerTexture.isLeft()).toBeTruthy()
    expect(thing.middleTexture.get()).toEqual("STARTAN3")
    expect(thing.sector).toEqual(3)
}

const validateSidedef_442 = (thing: Sidedef) => {
    validateSidedefDir(thing.dir)
    expect(thing.offset.x).toEqual(64)
    expect(thing.offset.y).toEqual(0)
    expect(thing.upperTexture.isLeft()).toBeTruthy()
    expect(thing.lowerTexture.isLeft()).toBeTruthy()
    expect(thing.middleTexture.get()).toEqual("EXITDOOR")
    expect(thing.sector).toEqual(84)
}

const validateSidedefDir = (dir: Directory) => {
    expect(dir.name).toEqual("SIDEDEFS")
}

describe("Parse Sidedef", () => {
    const thingsDir = ALL_DIRS.get()[FIRST_MAP.idx + +MapLumpType.SIDEDEFS]
    validateSidedefDir(thingsDir)
    const parser = tf.parseSidedef(WAD_BYTES, thingsDir);

    test("Sidedef Nr. 0", () => {
        validateSidedef_0(parser(0));
    })

    test("Sidedef Nr. 26", () => {
        validateSidedef_26(parser(26));
    })

    test("Sidedef Nr. 189", () => {
        validateSidedef_189(parser(189));
    })

    test("Sidedef Nr. 211", () => {
        validateSidedef_211(parser(211));
    })

    test("Sidedef Nr. 442", () => {
        validateSidedef_442(parser(442));
    })
})

describe("Parse Sidedefs", () => {
    const thingsDir = ALL_DIRS.get()[FIRST_MAP.idx + +MapLumpType.SIDEDEFS]
    validateSidedefDir(thingsDir)
    const parsed = tf.parseSidedefs(WAD_BYTES, ALL_DIRS.get())(FIRST_MAP_DIR_OFFSET).get();

    test("Sidedef Nr. 0", () => {
        validateSidedef_0(parsed[0]);
    })

    test("Sidedef Nr. 26", () => {
        validateSidedef_26(parsed[26]);
    })

    test("Sidedef Nr. 189", () => {
        validateSidedef_189(parsed[189]);
    })

    test("Sidedef Nr. 211", () => {
        validateSidedef_211(parsed[211]);
    })

    test("Sidedef Nr. 442", () => {
        validateSidedef_442(parsed[442]);
    })

    test("Amount", () => {
        expect(parsed.length).toEqual(648)
    })
})


const validateVertexesDir = (dir: Directory) => {
    expect(dir.name).toEqual("VERTEXES")
}

const validateVertex = (expected: Vertex, given: Vertex) => {
    expect(expected.x).toEqual(given.x)
    expect(expected.y).toEqual(given.y)
}
const validateFirstVertex = (vertex: Vertex) => {
    validateVertex(vertex, VERTEX_0)
}

const validateThirdVertex = (vertex: Vertex) => {
    validateVertex(vertex, VERTEX_2)
}

const validateLastVertex = (vertex: Vertex) => {
    validateVertex(vertex, VERTEX_466)
}

describe("Parse Vertex", () => {
    const vertexesDir = ALL_DIRS.get()[FIRST_MAP.idx + MapLumpType.VERTEXES]
    validateVertexesDir(vertexesDir);
    const parser = tf.parseVertex(WAD_BYTES, vertexesDir)

    test("First Vertex", () => {
        validateFirstVertex(parser(0))
    })

    test("Third Vertex", () => {
        validateThirdVertex(parser(2))
    })

    test("last Vertex", () => {
        validateLastVertex(parser(466))
    })
})

describe("Parse Vertexes", () => {
    const vertexes = tf.parseVertexes(WAD_BYTES, ALL_DIRS.get())(FIRST_MAP_DIR_OFFSET).get()

    test("First Vertex", () => {
        validateFirstVertex(vertexes[0])
    })

    test("Third Vertex", () => {
        validateThirdVertex(vertexes[2])
    })

    test("last Vertex", () => {
        validateLastVertex(vertexes[466])
    })
})

const validateLindedefsDir = (dir: Directory) => {
    expect(dir.name).toEqual("LINEDEFS")
}

const validateLindedef_0 = (lindedef: Linedef) => {
    validateVertex(VERTEX_0, lindedef.start)
    validateVertex(VERTEX_1, lindedef.end)
    expect(lindedef.flags).toEqual(1)
    expect(lindedef.sectorTag).toEqual(0)
    validateSidedef_0(lindedef.frontSide)
    expect(lindedef.backSide.isLeft()).toBeTruthy()
}

const validateLindedef_2 = (lindedef: Linedef) => {
    validateVertex(VERTEX_3, lindedef.start)
    validateVertex(VERTEX_0, lindedef.end)
    expect(lindedef.flags).toEqual(1)
    expect(lindedef.sectorTag).toEqual(0)
    validateSidedef_2(lindedef.frontSide)
    expect(lindedef.backSide.isLeft()).toBeTruthy()
}

const validateLindedef_26 = (lindedef: Linedef) => {
    validateVertex(VERTEX_27, lindedef.start)
    validateVertex(VERTEX_26, lindedef.end)
    expect(lindedef.flags).toEqual(29)
    expect(lindedef.sectorTag).toEqual(0)
    validateSidedef_26(lindedef.frontSide)
    validateSidedef_27(lindedef.backSide.get())
}

describe("Parse Linedef", () => {
    const linedefDir = ALL_DIRS.get()[FIRST_MAP.idx + MapLumpType.LINEDEFS]
    validateLindedefsDir(linedefDir);
    const vertexes = tf.parseVertexes(WAD_BYTES, ALL_DIRS.get())(FIRST_MAP_DIR_OFFSET).get()
    const sidedefs = tf.parseSidedefs(WAD_BYTES, ALL_DIRS.get())(FIRST_MAP_DIR_OFFSET).get();
    const parser = tf.parseLinedef(WAD_BYTES, linedefDir, vertexes, sidedefs);

    test("First Linedef", () => {
        const either = parser(0);
        validateLindedef_0(either.get())
    })

    test("Third Linedef", () => {
        validateLindedef_2(parser(2).get())
    })

    test("27th Linedef", () => {
        validateLindedef_26(parser(26).get())
    })
})

describe("Parse Linedefs", () => {
    const linedefDir = ALL_DIRS.get()[FIRST_MAP.idx + MapLumpType.LINEDEFS]
    validateLindedefsDir(linedefDir);
    const vertexes = tf.parseVertexes(WAD_BYTES, ALL_DIRS.get())(FIRST_MAP_DIR_OFFSET).get()
    const sidedefs = tf.parseSidedefs(WAD_BYTES, ALL_DIRS.get())(FIRST_MAP_DIR_OFFSET).get();
    const linedefs = tf.parseLinedefs(WAD_BYTES, ALL_DIRS.get(), vertexes, sidedefs)(FIRST_MAP_DIR_OFFSET).get();

    test("First Linedef", () => {
        validateLindedef_0(linedefs[0])
    })

    test("Third Linedef", () => {
        validateLindedef_2(linedefs[2])
    })

    test("27th Linedef", () => {
        validateLindedef_26(linedefs[26])
    })
})

describe("Parse Map Directory", () => {
    const validate = HEADER.map(v => validateDir(v)).get()
    test("First MAP - THINGS", () => {
        validate(FIRST_MAP_DIR_OFFSET + MapLumpType.THINGS, E1M1_THINGS)
    })

    test("First MAP - LINEDEFS", () => {
        validate(FIRST_MAP_DIR_OFFSET + MapLumpType.LINEDEFS, E1M1_LINEDEFS)
    })

    test("First MAP - BLOCKMAP", () => {
        validate(FIRST_MAP_DIR_OFFSET + MapLumpType.BLOCKMAP, E1M1_BLOCKMAP)
    })
})

describe("Find Next Map Dir", () => {
    const nextDirEi = ALL_DIRS.map(dirs => tf.findNextMapDir(dirs));
    expect(nextDirEi.isRight).toBeTruthy()
    const nextDir = nextDirEi.get()

    test("E1M1", () => {
        const mapDir = nextDir(0).get()
        expect(mapDir.name).toEqual("E1M1")
    })

    test("E1M2", () => {
        const mapDir = nextDir(17).get()
        expect(mapDir.name).toEqual("E1M2")
    })

    test("E1M9", () => {
        const mapDir = nextDir(90).get()
        expect(mapDir.name).toEqual("E1M9")
    })

    test("Not found", () => {
        const mapDir = nextDir(9000)
        expect(mapDir.isLeft()).toBeTruthy()
    })

    test("loop", () => {
        let offs = 0;
        for (let i = 0; i < 8; i++) {
            const mapDir = nextDir(offs).get()
            expect(mapDir.name).toEqual("E1M" + (i + 1))
            offs = mapDir.idx + 1
        }
    })

})

describe("Is Map Name", () => {

    test("MAPxx", () => {
        expect(tf.isMapName("MAP01")).toBe(true)
        expect(tf.isMapName("MAP03")).toBe(true)
        expect(tf.isMapName("MAP23")).toBe(true)
        expect(tf.isMapName("MAP32")).toBe(true)

        expect(tf.isMapName("MA32")).toBe(false)
        expect(tf.isMapName("_MA32")).toBe(false)
        expect(tf.isMapName("32")).toBe(false)
    })

    test("ExMy", () => {
        expect(tf.isMapName("ExMy")).toBe(true)
        expect(tf.isMapName("E1M1")).toBe(true)
        expect(tf.isMapName("E2M3")).toBe(true)

        expect(tf.isMapName("E23")).toBe(false)
        expect(tf.isMapName("E23M1")).toBe(false)
        expect(tf.isMapName("E02M01")).toBe(false)
    })

})

const findDirectory = (dir: Directory, dirs: Directory[]) =>
    dirs.find(d => (d.name === dir.name && d.filepos === dir.filepos && d.size == dir.size))

describe("Parse All Directories", () => {
    const header = HEADER.get();
    const allDirs = tf.parseAllDirectories(header, WAD_BYTES);
    const validate = (dir: Directory) => {
        const found = findDirectory(dir, allDirs)
        eqDir(dir, found)
    }
    test("First MAP", () => {
        validate(FD_E1M1);
    });

    test("Second MAP", () => {
        validate(FD_E1M2);
    });

    test("First MAP - THINGS", () => {
        validate(E1M1_THINGS);
    });

    test("First MAP - LINEDEFS", () => {
        validate(E1M1_LINEDEFS);
    });

    test("First MAP - BLOCKMAP", () => {
        validate(E1M1_BLOCKMAP);
    });

})

