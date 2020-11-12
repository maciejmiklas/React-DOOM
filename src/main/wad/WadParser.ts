import * as R from "ramda";

const parseStr = (pos: number, length: number) => (bytes: number[]): string => {
    return String.fromCharCode.apply(null, bytes.slice(pos, pos + length))
}

/** little-endian */
const parseInt = (pos: number) => (bytes: number[]): number => {
    return R.pipe<number[], number[], number[], number>(
        R.slice(pos, pos + 4),
        R.reverse,
        R.curry(R.reduce)((val: number, cur: number) => val << 8 | cur, 0)
    )(bytes)
}

// ############################ TYPES ############################
type Header = {
    identification: string,
    numlumps: number,
    infotableofs: number
}

// ############################ TYPES ############################

class WadParser {
    static parse(bytes8: Uint8Array) {
        return "parsed!"
    }
}

export const testFunctions = {parseStr, parseInt}
export default WadParser