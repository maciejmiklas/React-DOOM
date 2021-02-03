import {functions as wp, testFunctions as tf} from "../main/wad/WadParser";
import {ALL_DIRS, WAD_BYTES,validateTitleColumn, validateTitlePatchHeader,} from "./TestData";


describe("parseTitlePic", () => {
    const tp = tf.parseTitlePic(WAD_BYTES, ALL_DIRS.get())
    test("Found Pictures", () => {
        expect(tp.isRight()).toBeTruthy();
        expect(tp.get().credit).toBeTruthy()
        expect(tp.get().title).toBeTruthy()
        expect(tp.get().help).toBeTruthy()
        expect(tp.get().help.get().length).toEqual(2)
    });

    test("TITLE", () => {
        validateTitlePatchHeader(tp.get().title.header)
        validateTitleColumn(tp.get().title.columns[0])
        validateTitleColumn(tp.get().title.columns[7])
    });
});

describe("parseWad", () => {
    test("Find first", () => {
        wp.parseWad(WAD_BYTES);
    });
});
