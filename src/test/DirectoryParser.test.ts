import {Directory, MapLumpType} from "../main/wad/WadModel";
import {functions as dp} from "../main/wad/DirectoryParser";
import {
    ALL_DIRS,
    E1M1_BLOCKMAP,
    E1M1_LINEDEFS,
    E1M1_THINGS,
    eqDir,
    FD_E1M1,
    FD_E1M2,
    FIRST_MAP_DIR_OFFSET,
    HEADER,
    validateDir,
    WAD_BYTES
} from "./TestData";

describe("Find directory by name", () => {
    const find = dp.findDirectoryByName(ALL_DIRS.get())
    const findAndCompare = (name: string) => {
        expect(find(name).get().name).toEqual(name)
    }

    test("Find first", () => {
        findAndCompare("PLAYPAL")
    })

    test("Find last", () => {
        findAndCompare("F_END")
    })

    test("Find map 1", () => {
        findAndCompare("E1M1")
    })

    test("Find title", () => {
        findAndCompare("TITLEPIC")
    })
})

const findDirectory = (dir: Directory, dirs: Directory[]) =>
    dirs.find(d => (d.name === dir.name && d.filepos === dir.filepos && d.size == dir.size))

describe("Parse All Directories", () => {
    const header = HEADER.get();
    const allDirs = dp.parseAllDirectories(header, WAD_BYTES);
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