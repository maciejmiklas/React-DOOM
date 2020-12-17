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

    abstract exec(fn: (T) => void): Left<T> | Right<T>

    static of<T>(val: T): Right<T> {
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
}

export class Left<T> extends Either<T> {

    constructor(msg: string) {
        super(null, msg)
    }

    map(fn: (T) => any): Left<any> {
        return this
    }

    exec(fn: (T) => void): Left<T> {
        fn(null);
        return this
    }

    isLeft(): boolean {
        return true
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

    map(fn: (T) => any): Right<any> {
        const res = fn(this.get());
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
