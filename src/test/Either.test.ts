import {Either} from '../main/Either'

describe("Either.ofArray", () => {
    test("All Left", () => {
        const res = Either.ofArray(Either.ofLeft("l1"), Either.ofLeft("l2"), Either.ofLeft("l3"))
        expect(res.isLeft()).toBeTruthy()
    })

    test("All Right", () => {
        const res = Either.ofArray(Either.ofRight(1), Either.ofRight(10), Either.ofRight(3))
        expect(res.isRight()).toBeTruthy()
        expect(res.get()).toEqual([1, 10, 3])
    })

    test("Mix", () => {
        const res = Either.ofArray(Either.ofRight(1), Either.ofLeft("l2"), Either.ofRight(10), Either.ofRight(3))
        expect(res.isRight()).toBeTruthy()
        expect(res.get()).toEqual([1, 10, 3])
    })

})

describe("Either.unitl", () => {
    test("number array", () => {
        const res = Either.until<number>(v => Either.ofCondition(() => v < 5, () => "End", () => v + 1), Either.ofRight(0)).get()
        expect(res).toEqual([0, 1, 2, 3, 4, 5])
    })

    test("empty result", () => {
        const res = Either.until<number>(v => Either.ofCondition(() => false, () => "End", () => v + 1), Either.ofLeft("LEFT"))
        expect(res.isLeft()).toBeTruthy()
    })
})

describe("Either.append", () => {
    test("Append to from Right to Right", () => {
        const ei = Either.ofRight({vv: "123"});
        const res = ei.append(v => Either.ofRight(v.vv + "-abc"), (t, v) => t.pp = v)
        expect(res.get()).toEqual({vv: "123", pp: "123-abc"})
    })

    test("Append to from Right to Left", () => {
        const ei = Either.ofRight({vv: "123"});
        const res = ei.append(v => Either.ofLeft("noo"), (t, v) => t.pp = v)
        expect(res.isLeft()).toBeTruthy()
    })

    test("Append to from Left to Right", () => {
        const ei = Either.ofLeft("123");
        const res = ei.append(v => Either.ofRight(v.vv + "-abc"), (t, v) => t.pp = v)
        expect(res.isLeft()).toBeTruthy()
    })
})

describe("Either.of", () => {
    const str = Either.ofRight("123");
    test("isLeft", () => {
        expect(str.isLeft()).toBeFalsy()
    })

    test("isRight", () => {
        expect(str.isRight()).toBeTruthy()
    })

    test("map simple type", () => {
        const ei = Either.ofRight(10).map(v => v + 1);
        expect(ei.isRight()).toBeTruthy()
        expect(ei.get()).toBe(11);
    })
})

describe("Either.ofLeft", () => {
    const left = Either.ofLeft("123");

    test("isLeft", () => {
        expect(left.isLeft()).toBeTruthy()
    })

    test("isRight", () => {
        expect(left.isRight()).toBeFalsy()
    })

    test("message", () => {
        expect(left.message()).toBe("123");
    })

    test("map simple type", () => {
        const ei = left.map(v => v + 1);
        expect(left.isLeft()).toBeTruthy()
        expect(ei.message()).toBe("123");
    })
})

describe("Either.map", () => {
    const nil = Either.ofNullable(null, () => "just null!");
    const nn = Either.ofNullable(100, () => "test 100");

    test("null", () => {
        expect(nil.map(v => v + 1).isLeft()).toBeTruthy()
    })

    test("map to null", () => {
        expect(nn.map(v => null).isLeft()).toBeTruthy()
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
    const of = Either.ofRight(101);
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
    const of = Either.ofRight(101);
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
    const of = Either.ofRight(101);
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


describe("Either.ofTruth", () => {
    const falsy1 = Either.ofCondition(() => false, () => "cond false 1", () => 98);
    const falsy2 = Either.ofCondition(() => false, () => "cond false 2", () => 97);
    const truthy1 = Either.ofCondition(() => true, () => "cond true", () => 99);
    const truthy2 = Either.ofCondition(() => true, () => "cond true", () => 21);

    test("Falsy", () => {
        const val = Either.ofTruth([falsy1, falsy2, truthy1, truthy2], () => 101)
        expect(val.isLeft()).toBeTruthy()
        expect(val.message()).toEqual("cond false 1,cond false 2")
    })

    test("Truthy", () => {
        const val = Either.ofTruth([truthy1, truthy2], () => 101)
        expect(val.isRight()).toBeTruthy()
        expect(val.get()).toEqual(101)
    })
})

describe("Either.ofCondition", () => {
    const falsy = Either.ofCondition(() => false, () => "cond false", () => 98);
    const truthy = Either.ofCondition(() => true, () => "cond true", () => 99);

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
    const of = Either.ofRight(101);

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