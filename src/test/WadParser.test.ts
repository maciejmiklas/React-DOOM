import {testFunctions as tf} from "../main/wad/WadParser";
import {base64ToUint8Array} from "../main/util"
import jsonData from "./data/doom.json"

// @ts-ignore
const wadBytes = base64ToUint8Array(jsonData.doom)
const iwad = [73, 87, 65, 68]

describe("parseInt", () => {
    test("12", () => {
        expect(tf.parseInt(0)([0x0C, 0x00, 0x00, 0x00])).toEqual(12)
    });

    test("12 offset", () => {
        expect(tf.parseInt(2)([0xFF, 0xFF, 0x0C, 0x00, 0x00, 0x00, 0xFF])).toEqual(12)
    });

    test("1234567898", () => {
        expect(tf.parseInt(0)([0xDA, 0x02,0x96,0x49])).toEqual(1234567898)
    });

    test("-999912", () => {
        expect(tf.parseInt(0)([0x18,0xBE,0xF0,0xFF])).toEqual(-999912)
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

describe("parseHeadType", () => {
    test("IWAD", () => {
        expect(tf.parseHeadType(iwad)).toEqual("IWAD")
    });
});

describe("parseHeader", () => {
    test("IWAD", () => {
        const header = tf.parseHeader(wadBytes);
        expect(header.identification).toEqual("IWAD")
        expect(header.numlumps).toEqual(1241)
        expect(header.infotableofs).toEqual(4205648)
    });
});
