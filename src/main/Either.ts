import * as R from "ramda";

export abstract class Either<T> {
    protected readonly val: T
    protected readonly msg: string

    protected constructor(value: T, msg) {
        this.val = value
        this.msg = msg;
    }

    get(): T {
        return this.val
    }

    message(): string {
        return this.msg;
    }

    abstract orElse(other: T): T

    abstract orElseGet(fn: () => T): T

    abstract isLeft(): boolean

    abstract isRight(): boolean

    abstract map(fn: (T) => any): Left<any> | Right<any>

    abstract append<V>(producer: (T) => Either<V>, appender: (T, V) => void): Left<T> | Right<T>

    abstract exec(fn: (T) => void): Left<T> | Right<T>

    static until = <T>(next: (previous: T) => Either<T>, init: Either<T>, max: number = 500): Either<T[]> => {
        let val = init;
        const all = []
        let cnt = 0;
        while (val.isRight() && cnt <= max) {
            val.exec((v) => all.push(v))
            val = next(val.get())
            cnt = cnt + 1
        }
        return Either.ofCondition(() => all.length > 0, () => "Empty result for " + init, () => all)
    }

    static ofArray = <T>(...args: Either<T>[]): Either<T[]> => {
        const ret = args.filter(e => e.isRight()).map(e => e.get())
        return Either.ofCondition(() => ret.length > 0, () => "All candidates for Array are Left: " + args, () => ret)
    }

    static ofRight<T>(val: T): Right<T> {
        return new Right<T>(val)
    }

    static ofLeft<T>(msg: string): Left<T> {
        return new Left(msg);
    }

    static ofNullable<T>(val: T, msg: () => string): Left<T> | Right<T> {
        return R.isNil(val) ? new Left(msg()) : new Right<T>(val)
    }

    static ofCondition<T>(cnd: () => boolean, left: () => string, right: () => T): Left<T> | Right<T> {
        return cnd() ? new Right<T>(right()) : new Left(left())
    }

    static ofTruth<T>(truth: Either<any>[], right: () => T): Left<T> | Right<T> {
        const left = truth.filter(e => e.isLeft())
        return left.length == 0 ? new Right<T>(right()) : new Left(left.map(l => l.message()).join(","))
    }
}

export class Left<T> extends Either<T> {

    constructor(msg: string) {
        super(null, msg)
    }

    map(fn: (T) => any): Left<any> {
        return this
    }

    exec(fn: (T) => void): Left<T> {
        return this
    }

    isLeft(): boolean {
        return true
    }

    append<V>(producer: (T) => Either<V>, appender: (T, V) => void): Left<T> | Right<T> {
        return this;
    }

    isRight(): boolean {
        return false
    }

    orElse(other: T): T {
        return other
    }

    orElseGet(fn: () => T): T {
        return fn()
    }

    get(): T {
        throw new TypeError("Left has no value: " + this.message())
    }

    toString(): string {
        return `Left[${this.message()}]`
    }
}

export class Right<T> extends Either<T> {

    constructor(value: T) {
        super(value, "Right")
        if (R.isNil(value)) {
            throw new TypeError('null get provided to Right')
        }
    }

    orElseGet(fn: () => T): T {
        return this.val;
    }

    exec(fn: (T) => void): Right<T> {
        fn(this.get());
        return this
    }

    append<V>(producer: (T) => Either<V>, appender: (T, V) => void): Left<T> | Right<T> {
        const val = this.get();
        const res = producer(val);
        if (R.isNil(res) || res.isLeft()) {
            return Either.ofLeft("Append got null for " + val)
        }
        appender(val, res.get())
        return new Right(val);
    }

    map(fn: (T) => any): Left<T> | Right<T> {
        const val = this.get();
        const res = fn(val);
        if (R.isNil(res)) {
            return Either.ofLeft("Map got null for " + val)
        }
        return res instanceof Either ? res : new Right(res);
    }

    isLeft(): boolean {
        return false
    }

    isRight(): boolean {
        return true
    }

    orElse(other: T): T {
        return R.isNil(this.val) ? other : this.val
    }

    toString(): string {
        return `Right[${this.get()}]`
    }
}
