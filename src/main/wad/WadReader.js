import * as R from "ramda";

const parseStr = (pos, length) => bytes => {
    return String.fromCharCode.apply(null, bytes.slice(pos, pos + length))
}

/** little-endian */
const parseInt = (pos) => bytes => {
    return R.pipe(
        R.slice(pos, pos + 4),
        R.reverse,
        R.curry(R.reduce)((val, cur) => val << 8 | cur, 0)
    )(bytes)
}

/** The ASCII characters "IWAD" or "PWAD" */
const parseHeadType = parseStr(0x00, 4)

/** An integer specifying the number of lumps in the WAD. */
const parseHeadNumlumps = parseInt(0x04)

/** An integer holding a pointer to the location of the directory. */
const parseHeadInfotableofs = parseInt(0x08)

/** A WAD file always starts with a 12-byte header. It contains three values. */
const parseHeader = (bytes) => {
    return {
        // The ASCII characters "IWAD" or "PWAD".
        identification: parseHeadType(bytes),

        // An integer specifying the number of lumps in the WAD.
        numlumps: parseHeadNumlumps(bytes),

        // An integer holding a pointer to the location of the directory.
        infotableofs: parseHeadInfotableofs(bytes)
    };
}

class WadReader {
    static parse(bytes8) {
        return "parsed!"
    }
}

export const testFunctions = {parseStr, parseHeadType, parseInt, parseHeader}
export default WadReader;