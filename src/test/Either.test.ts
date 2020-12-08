import {Either} from '../main/Either'

describe("Either.of", () => {
    const str = Either.of("123");
    test("isLeft", () => {
        expect(str.isLeft()).toBeFalsy()
    })

    test("isRight", () => {
        expect(str.isRight()).toBeTruthy()
    })

    test("map simple type", () => {
        const ei = Either.of(10).map(v => v + 1);
        expect(ei.isRight()).toBeTruthy()
        expect(ei.get()).toBe(11);
    })
})

describe("Either.map", () => {
    const nil = Either.ofNullable(null, () => "just null!");
    const nn = Either.ofNullable(100, () => "test 100");

    test("null", () => {
        expect(nil.map(v => v + 1).isLeft()).toBeTruthy()
    })

    test("map to same type", () => {
        expect(nn.map(v => v + 1).get()).toEqual(101);
    })

    test("map to different type", () => {
        expect(nn.map(v => "v_" + v).get()).toEqual("v_100");
    })

    test("map to function", () => {
        expect(nn.map(v => () => v + 122).get()()).toEqual(222);
    })
})

describe("Either.ofNullable", () => {
    const nil = Either.ofNullable(null, () => "just null!");
    const nn = Either.ofNullable(100, () => "test 100");

    test("from null - isLeft", () => {
        expect(nil.isLeft()).toBeTruthy()
    })

    test("from null - isRight", () => {
        expect(nil.isRight()).toBeFalsy()
    })

    test("from null - get", () => {
        expect(() => nil.get()).toThrow(TypeError)
    })

    test("from null - map", () => {
        expect(nil.map(v => v + 1).isLeft).toBeTruthy()
    })

    test("from null - map - get", () => {
        expect(() => nil.map(v => v + 1).get()).toThrow(TypeError)
    })

    test("from number - isLeft", () => {
        expect(nn.isLeft()).toBeFalsy()
    })

    test("from number - isRight", () => {
        expect(nn.isRight()).toBeTruthy()
    })

    test("from number - get", () => {
        expect(nn.get()).toBe(100);
    })

    test("from number - map", () => {
        expect(nn.map(v => v + 1).get()).toBe(101);
    })
})

describe("Either.orElse", () => {
    const nil = Either.ofNullable(null, () => "just null!");
    const of = Either.of(101);
    const nn = Either.ofNullable(100, () => "test 100");

    test("from null", () => {
        expect(nil.orElse("test 222")).toBe("test 222");
    })

    test("from nullable value", () => {
        expect(nn.orElse(99)).toBe(100);
    })

    test("from value", () => {
        expect(of.orElse(99)).toBe(101);
    })
})

describe("Either.orElseGet", () => {
    const nil = Either.ofNullable(null, () => "just null!");
    const of = Either.of(101);
    const nn = Either.ofNullable(100, () => "test 100");

    test("from null", () => {
        expect(nil.orElseGet(() => "test 222")).toBe("test 222");
    })

    test("from nullable value", () => {
        expect(nn.orElseGet(() => 99)).toBe(100);
    })

    test("from value", () => {
        expect(of.orElseGet(() => 99)).toBe(101);
    })
})

describe("Either.toString", () => {
    const nil = Either.ofNullable(null, () => "just null!");
    const of = Either.of(101);
    const nn = Either.ofNullable(100, () => "test 100");

    test("from null", () => {
        expect(nil.toString()).toBe("Left[just null!]");
    })

    test("from nullable value", () => {
        expect(nn.toString()).toBe("Right[100]");
    })

    test("from value", () => {
        expect(of.toString()).toBe("Right[101]");
    })

    test("from value and map", () => {
        expect(of.map(v => v + 2).toString()).toBe("Right[103]");
    })
})

describe("Either.ofCondition", () => {
    const falsy = Either.ofCondition(() => false, () => 98, () => "cond false");
    const truthy = Either.ofCondition(() => true, () => 99, () => "cond true");

    test("falsy - isLeft", () => {
        expect(falsy.isLeft()).toBeTruthy()
    })

    test("falsy - isRight", () => {
        expect(falsy.isRight()).toBeFalsy()
    })

    test("falsy - toString", () => {
        expect(falsy.toString()).toEqual("Left[cond false]")
    })

    test("falsy - get", () => {
        expect(() => falsy.get()).toThrow(TypeError)
    })

    test("truthy - isLeft", () => {
        expect(truthy.isLeft()).toBeFalsy()
    })

    test("truthy - isRightf", () => {
        expect(truthy.isRight()).toBeTruthy()
    })

    test("truthy - toString", () => {
        expect(truthy.toString()).toEqual("Right[99]")
    })

    test("truthy - get", () => {
        expect(truthy.get()).toEqual(99)
    })
})


describe("Either.exec", () => {
    const nil = Either.ofNullable(null, () => "just null!");
    const of = Either.of(101);

    test("from null", () => {
        expect(nil.exec((v) => {
            expect(v).toBeNull()
        }).isLeft()).toBeTruthy()
    })


    test("from value", () => {
        expect(of.exec((v) => {
            expect(v).toEqual(101)
        }).get()).toEqual(101)
    })

})