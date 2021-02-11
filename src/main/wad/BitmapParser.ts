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

const mapToImageData = (header: PatchHeader, columns: Column[]): Uint8ClampedArray => {
    const width = header.width;// x->
    const height = header.height;// y ->
    const array = new Uint8ClampedArray(width * height * 4)

    for (let x = 0; x < width; x++) {
        //console.log("X >>", x)
        for (const post of columns[x].posts) {
            let y = post.topdelta
            for (const pixel of post.data) {
                const number = y * width + x;
              //  console.log(" --y ", y, number)
                const pos = number * 4;
                array[pos + 0] = (pixel) & 0b111000000;    // R value
                array[pos + 1] = (pixel <<3) & 0b111000000;  // G value
                array[pos + 2] = (pixel <<6) & 0b11000000;    // B value
                array[pos + 3] = 255;  // A value
                y = y + 1
            }
        }
    }
    return array;
}

const parseBitmap = (bytes: number[]) => (dir: Directory): Either<PatchBitmap> => {
    const header = parsePatchHeader(bytes)(dir)
    const columnParser = parseColumn(bytes);
    const columns = header.columnofs.map(colOfs => columnParser(colOfs)).filter(c => c.isRight()).map(c => c.get())
    return Either.ofCondition(() => columns.length > 0, () => "No picture columns fround for: " + dir, () => ({
        header,
        columns,
        imageData: mapToImageData(header, columns)
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