import {Directory, Header, testFunctions as tf, WadType} from "../main/wad/WadParser";
import {base64ToUint8Array} from "../main/util"
import jsonData from "./data/doom.json"

// @ts-ignore
const wadBytes = base64ToUint8Array(jsonData.doom)
const iwad = [73, 87, 65, 68]

const firstDirectory: Directory = {
    filepos: 12,
    size: 10752,
    name: "PLAYPAL"
}

const secondDirectory: Directory = {
    filepos: 10764,
    size: 8704,
    name: "COLORMAP"
}

const sixDirectory: Directory = {
    filepos: 69928,
    size: 60372,
    name: "DEMO3"
}

const lastDirectory: Directory = {
    filepos: 0,
    size: 0,
    name: "F_END"
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
        expect(tf.parseStr(0, 4)(iwad)).toEqual("IWAD")
    });

    test("sub string", () => {
        expect(tf.parseStr(1, 2)(iwad)).toEqual("WA")
    });

    test("length out of range", () => {
        expect(tf.parseStr(0, 5)(iwad)).toEqual("IWAD")
    });

    test("out of range", () => {
        expect(tf.parseStr(6, 2)(iwad)).toEqual("")
    });
});

describe("parseHeader", () => {
    test("IWAD", () => {
        const header = tf.parseHeader(wadBytes);
        expect(header.identification).toEqual(WadType.IWAD)
        expect(header.numlumps).toEqual(1241)
        expect(header.infotableofs).toEqual(4205648)
    });
});

const validateLump = (header: Header) => (nr: number, given: Directory) => {
    const dir = tf.parseDirectory(header.infotableofs + 16 * (nr - 1), wadBytes);
    expect(dir.name).toEqual(given.name)
    expect(dir.filepos).toEqual(given.filepos)
    expect(dir.size).toEqual(given.size)
}

describe("parseDirectory", () => {
    const header = tf.parseHeader(wadBytes);
    const validate = validateLump(header);
    test("First Lump", () => {
        validate(1, firstDirectory)
    });

    test("Second Lump", () => {
        validate(2, secondDirectory)
    });

    test("6-th Lump", () => {
        validate(6, sixDirectory)
    });

    test("Last Lump", () => {
        validate(header.numlumps, lastDirectory)
    });
})

const findDirectory = (dir: Directory, dirs: Directory[]) =>
    dirs.find(d => (d.name === dir.name && d.filepos === dir.filepos && d.size == dir.size))

describe("parseDirectories", () => {
    const header = tf.parseHeader(wadBytes);
    const allDirs = tf.parseDirectories(header, wadBytes);
    const validate = validateLump(header);

    test("First Lump", () => {
        const found = findDirectory(firstDirectory, allDirs)
        validate(1, found)
    });

    test("Second Lump", () => {
        const found = findDirectory(secondDirectory, allDirs)
        validate(2, found)
    });

    test("6-th Lump", () => {
        const found = findDirectory(sixDirectory, allDirs)
        validate(6, found)
    });

    test("Last Lump", () => {
        const found = findDirectory(lastDirectory, allDirs)
        validate(header.numlumps, found)
    });
})

