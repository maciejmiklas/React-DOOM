import {util} from "../main/util";

const IWAD_STR = [73, 87, 65, 68]

describe("Parse Int", () => {
    test("12", () => {
        expect(util.parseInt([0x0C, 0x00, 0x00, 0x00])(0)).toEqual(12)
    });

    test("12 offset", () => {
        expect(util.parseInt([0xFF, 0xFF, 0x0C, 0x00, 0x00, 0x00, 0xFF])(2)).toEqual(12)
    });

    test("1234567898", () => {
        expect(util.parseInt([0xDA, 0x02, 0x96, 0x49])(0)).toEqual(1234567898)
    });

    test("-999912", () => {
        expect(util.parseInt([0x18, 0xBE, 0xF0, 0xFF])(0)).toEqual(-999912)
    });

    test("-12", () => {
        expect(util.parseInt([0xF4, 0xFF, 0xFF, 0xFF])(0)).toEqual(-12)
    });

    test("-1", () => {
        expect(util.parseInt([0xFF, 0xFF, 0xFF, 0xFF])(0)).toEqual(-1)
    });

    test("-5", () => {
        expect(util.parseInt([0xFB, 0xFF, 0xFF, 0xFF])(0)).toEqual(-5)
    });

    test("1", () => {
        expect(util.parseInt([0x01, 0x00, 0x00, 0x00])(0)).toEqual(1)
    });

    test("5", () => {
        expect(util.parseInt([0x05, 0x00, 0x00, 0x00])(0)).toEqual(5)
    });

    test("-4160", () => {
        expect(util.parseInt([0xC0, 0xEF, 0xFF, 0xFF])(0)).toEqual(-4160)
    });

    test("-10000000", () => {
        expect(util.parseInt([0x80, 0x69, 0x67, 0xFF])(0)).toEqual(-10000000)
    });

});

describe("Parse Short", () => {
    test("12", () => {
        expect(util.parseShort([0x0C, 0x00])(0)).toEqual(12)
    });

    test("12 offset", () => {
        expect(util.parseShort([0xFF, 0xFF, 0x0C, 0x00, 0x00, 0x00, 0xFF])(2)).toEqual(12)
    });

    test("4160", () => {
        expect(util.parseShort([0x40, 0x10])(0)).toEqual(4160)
    });

    test("-12", () => {
        expect(util.parseShort([0xF4, 0xFF])(0)).toEqual(-12)
    });

    test("-1", () => {
        expect(util.parseShort([0xFF, 0xFF])(0)).toEqual(-1)
    });

    test("-5", () => {
        expect(util.parseShort([0xFB, 0xFF])(0)).toEqual(-5)
    });

    test("1", () => {
        expect(util.parseShort([0x01, 0x00])(0)).toEqual(1)
    });

    test("5", () => {
        expect(util.parseShort([0x05, 0x00])(0)).toEqual(5)
    });

    test("-4160", () => {
        expect(util.parseShort([0xC0, 0xEF])(0)).toEqual(-4160)
    });
});

describe("Parse Short Opt", () => {
    test("Right", () => {
        expect(util.parseShortOp([0x0C, 0x00])(v => v > 1, (v) => "?")(0).get()).toEqual(12)
    });

    test("Left", () => {
        const either = util.parseShortOp([0x0C, 0x00])(v => v > 13, (v) => "only " + v)(0);
        expect(either.isLeft()).toBeTruthy()
        expect(either.message()).toEqual("only 12")
    });

})

describe("Parse Str", () => {
    test("whole", () => {
        expect(util.parseStr(IWAD_STR)(0, 4)).toEqual("IWAD")
    });

    test("sub string", () => {
        expect(util.parseStr(IWAD_STR)(1, 2)).toEqual("WA")
    });

    test("length out of range", () => {
        expect(util.parseStr(IWAD_STR)(0, 5)).toEqual("IWAD")
    });

    test("out of range", () => {
        expect(util.parseStr(IWAD_STR)(6, 2)).toEqual("")
    });
});

describe("Parse Str Op", () => {
    test("found", () => {
        expect(util.parseStrOp(IWAD_STR)(str => str === "IWAD", () => "?")(0, 4).get()).toEqual("IWAD")
    });

    test("not found", () => {
        const either = util.parseStrOp(IWAD_STR)(str => str === "WAD", () => "nope")(0, 4);
        expect(either.isLeft()).toBeTruthy()
        expect(either.message()).toEqual("nope")
    });

});

