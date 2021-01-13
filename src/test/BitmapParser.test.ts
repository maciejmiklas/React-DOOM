import {functions as dp} from "../main/wad/DirectoryParser";
import {testFunctions as tf} from "../main/wad/BitmapParser";
import {ALL_DIRS, WAD_BYTES} from "./TestData";
import {PatchHeader} from "../main/wad/WadModel";

describe("Unfold Columnofs", () => {
    const dir = dp.findDirectoryByName(ALL_DIRS.get())("TITLEPIC").get()

    test("Validate Size", () => {
        expect(tf.unfoldColumnofs(dir, 320).length).toEqual(320)
    })

    test("Validate Offsets", () => {
        const unfolded = tf.unfoldColumnofs(dir, 3)
        expect(unfolded[0]).toEqual(1957648)
        expect(unfolded[1]).toEqual(1957652)
        expect(unfolded[2]).toEqual(1957656)
    })
})

const validateTitlePatchHeader = (header: PatchHeader) => {
    expect(header.width).toEqual(320)
    expect(header.height).toEqual(200)
    expect(header.leftoffset).toEqual(0)
    expect(header.topoffset).toEqual(0)
}

const validateStbarPatchHeader = (header: PatchHeader) => {
    expect(header.width).toEqual(320)
    expect(header.height).toEqual(32)
    expect(header.leftoffset).toEqual(0)
    expect(header.topoffset).toEqual(0)
}

describe("Parse PatchHeader", () => {
    const findDir = dp.findDirectoryByName(ALL_DIRS.get())
    const patchParser = tf.parsePatchHeader(WAD_BYTES)

    test("Test TITLEPIC Header", () => {
        validateTitlePatchHeader(patchParser(findDir("TITLEPIC").get()))
    })

    test("Test STBAR Header", () => {
        validateStbarPatchHeader(patchParser(findDir("STBAR").get()))
    })
})