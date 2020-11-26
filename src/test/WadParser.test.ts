import {Directory, Header, MapLumpName, testFunctions as tf, WadType} from "../main/wad/WadParser";
import {base64ToUint8Array} from "../main/util"
import jsonData from "./data/doom.json"

// @ts-ignore
const WAD_BYTES = base64ToUint8Array(jsonData.doom)
const IWAD_STR = [73, 87, 65, 68]
const FIRST_MAP_DIR_OFFSET = 7

const E1M1_THINGS: Directory = {
    filepos: 130300,
    size: 1380,
    name: MapLumpName[MapLumpName.THINGS],
    idx: 7
}

const E1M1_LINEDEFS: Directory = {
    filepos: 131680,
    size: 6650,
    name: MapLumpName[MapLumpName.LINEDEFS],
    idx: 8
}

const E1M1_BLOCKMAP: Directory = {
    filepos: 179096,
    size: 6922,
    name: MapLumpName[MapLumpName.BLOCKMAP],
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

describe("parseInt", () => {
    test("12", () => {
        expect(tf.parseInt(0)([0x0C, 0x00, 0x00, 0x00])).toEqual(12)
    });

    test("12 offset", () => {
        expect(tf.parseInt(2)([0xFF, 0xFF, 0x0C, 0x00, 0x00, 0x00, 0xFF])).toEqual(12)
    });

    test("1234567898", () => {
        expect(tf.parseInt(0)([0xDA, 0x02, 0x96, 0x49])).toEqual(1234567898)
    });

    test("-999912", () => {
        expect(tf.parseInt(0)([0x18, 0xBE, 0xF0, 0xFF])).toEqual(-999912)
    });
});

describe("parseStr", () => {
    test("whole", () => {
        expect(tf.parseStr(0, 4)(IWAD_STR)).toEqual("IWAD")
    });

    test("sub string", () => {
        expect(tf.parseStr(1, 2)(IWAD_STR)).toEqual("WA")
    });

    test("length out of range", () => {
        expect(tf.parseStr(0, 5)(IWAD_STR)).toEqual("IWAD")
    });

    test("out of range", () => {
        expect(tf.parseStr(6, 2)(IWAD_STR)).toEqual("")
    });
});

describe("parseHeader", () => {
    test("IWAD", () => {
        const header = tf.parseHeader(WAD_BYTES);
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
    const dir = tf.parseDirectory(header.infotableofs + 16 * (nr - 1), nr - 1, WAD_BYTES);
    eqDir(dir, given);
}

describe("parseMapDirectory", () => {
    const header = tf.parseHeader(WAD_BYTES);
    const validate = validateDir(header);

    test("First MAP - THINGS", () => {
        validate(FIRST_MAP_DIR_OFFSET + 1 + MapLumpName.THINGS, E1M1_THINGS)
    })

    test("First MAP - LINEDEFS", () => {
        validate(FIRST_MAP_DIR_OFFSET + 1 + MapLumpName.LINEDEFS, E1M1_LINEDEFS)
    })

    test("First MAP - BLOCKMAP", () => {
        validate(FIRST_MAP_DIR_OFFSET + 1 + MapLumpName.BLOCKMAP, E1M1_BLOCKMAP)
    })
})

describe("findNextMapDir", () => {
    const header = tf.parseHeader(WAD_BYTES);
    const dirs = tf.parseAllDirectories(header, WAD_BYTES);
    const nextDir = tf.findNextMapDir(dirs);

    test("E1M1", () => {
        const mapDir = nextDir(0)
        expect(mapDir.name).toEqual("E1M1")
    })

    test("E1M2", () => {
        const mapDir = nextDir(17)
        expect(mapDir.name).toEqual("E1M2")
    })

    test("E1M9", () => {
        const mapDir = nextDir(90)
        expect(mapDir.name).toEqual("E1M9")
    })

    test("loop", () => {
        let offs = 0;
        for (let i = 0; i < 8; i++) {
            const mapDir = nextDir(offs)
            expect(mapDir.name).toEqual("E1M" + (i + 1))
            offs = mapDir.idx + 1
        }
    })

})

describe("isMapName", () => {

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

describe("parseFreeDirectory", () => {
    const header = tf.parseHeader(WAD_BYTES);
    const validate = validateDir(header);

    test("First MAP", () => {
        validate(FIRST_MAP_DIR_OFFSET, FD_E1M1)
    });

    test("Second MAP", () => {
        validate(FIRST_MAP_DIR_OFFSET + MapLumpName.BLOCKMAP + 2, FD_E1M2)
    });
})

const findDirectory = (dir: Directory, dirs: Directory[]) =>
    dirs.find(d => (d.name === dir.name && d.filepos === dir.filepos && d.size == dir.size))

describe("parseAllDirectories", () => {
    const header = tf.parseHeader(WAD_BYTES);
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

