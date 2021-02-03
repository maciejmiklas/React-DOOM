import {Column, Directory, PatchBitmap, PatchHeader, Post} from "./WadModel";
import * as R from "ramda";
import U from "../util";
import {Either} from "../Either";

const unfoldColumnofs = (filepos: number, width: number): number[] =>
    R.unfold((idx) => idx == width ? false : [filepos + idx * 4, idx + 1], 0)

const parsePatchHeader = (bytes: number[]) => (dir: Directory): PatchHeader => {
    const shortParser = U.parseShort(bytes)
    const uintParser = U.parseUint(bytes)
    const filepos = dir.filepos;
    const width = shortParser(filepos)
    return {
        dir,
        width,
        height: shortParser(filepos + 2),
        xOffset: shortParser(filepos + 4),
        yOffset: shortParser(filepos + 6),
        columnofs: unfoldColumnofs(filepos + 8, width).map((offset) => filepos + uintParser(offset))
    }
}

// TODO test
const parsePost = (bytes: number[]) => (filepos: number): Either<Post> => {
    const ubyteParser = U.parseUbyte(bytes)
    const topdelta = ubyteParser(filepos)
    const length = ubyteParser(filepos + 1)
    return Either.ofCondition(() => topdelta != 0XFF, () => "End of column", () =>
        ({
            topdelta,
            filepos,
            postBytes: 4 + length,
            data: R.unfold((idx) => idx == length ? false : [ubyteParser(filepos + idx + 3), idx + 1], 0)
        }))
}

const parseColumn = (bytes: number[]) => (filepos: number): Either<Column> => {
    const postParser = parsePost(bytes);
    return Either.until<Post>(
        p => postParser(p.filepos + p.postBytes), postParser(filepos))
        .map(posts => ({posts}));
}

const parseBitmap = (bytes: number[]) => (dir: Directory): Either<PatchBitmap> => {
    const header = parsePatchHeader(bytes)(dir)
    const columnParser = parseColumn(bytes);
    const columns = header.columnofs.map(colOfs => columnParser(colOfs)).filter(c => c.isRight()).map(c => c.get())
    return Either.ofCondition(() => columns.length > 0, () => "No picture columns fround for: " + dir, () => ({
        header,
        columns
    }))
}

export const testFunctions = {
    parsePatchHeader,
    unfoldColumnofs,
    parseColumn
}

export const functions = {
    parseBitmap
}