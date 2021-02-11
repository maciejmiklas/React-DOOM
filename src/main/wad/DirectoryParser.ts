import {Directory, Header, WadType} from "./WadModel";
import * as R from "ramda";
import U from "../util";
import {Log} from "../Log";
import {Either} from "../Either";

const parseAllDirectories = (header: Header, bytes: number[]): Either<Directory[]> => {
    const dirs = R.unfold(idx => idx > header.numlumps ? false : [header.infotableofs + idx * 16, idx + 1], 0)
        .map((ofs, index) => parseDirectory(ofs, index, bytes))
    Log.debug("Parsed %1 directories", dirs.length)
    return Either.ofCondition(() => findDirectoryByName(dirs)("TITLEPIC").isRight(), () => "TITLEPIC not found in Dirs", () => dirs)
}

const parseDirectory = (offset: number, idx: number, bytes: number[]): Directory => {
    const intParser = U.parseInt(bytes)
    const dir = {
        filepos: intParser(offset),
        size: intParser(offset + 0x04),
        name: U.parseStr(bytes)(offset + 0x08, 8),
        idx
    };
    Log.trace("Parsed Directory %1 on %2 -> %3", idx, offset, dir);
    return dir
}

const findDirectoryByName = (dirs: Directory[]) => (name: string): Either<Directory> =>
    Either.ofNullable(dirs.find(d => d.name === name), () => "Directory: " + name + " not found")

const parseHeader = (bytes: number[]): Either<Header> => {
    const headerStr = U.parseStrOp(bytes)(s => s === "IWAD", (s) => "WAD type not supported: " + s)(0x00, 4)
    const intParser = U.parseInt(bytes);
    return Either.ofTruth([headerStr], () =>
        ({
            identification: headerStr.map(s => WadType[s]).get(),
            numlumps: intParser(0x04),
            infotableofs: intParser(0x08)
        })).exec(h => Log.debug("Parsed Header: %1", h))
}

// ############################ EXPORTS ############################
export const functions = {
    parseHeader,
    parseDirectory,
    parseAllDirectories,
    findDirectoryByName
}