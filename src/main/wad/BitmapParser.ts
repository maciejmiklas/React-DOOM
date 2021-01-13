import {Directory, PatchHeader} from "./WadModel";
import * as R from "ramda";
import {util} from "../util";

const unfoldColumnofs = (dir: Directory, width:number):number[] =>
    R.unfold((idx) => idx == width ? false : [dir.filepos + 8 + idx * 4, idx + 1], 0)

const parsePatchHeader = (bytes: number[]) => (dir: Directory): PatchHeader => {
    const parseShortBytes = util.parseShort(bytes)
    const offset = dir.filepos;
    const width = parseShortBytes(offset)

    return {
        width,
        height: parseShortBytes(offset + 2),
        leftoffset: parseShortBytes(offset + 4),
        topoffset: parseShortBytes(offset + 6),
        columnofs: null
    }
}

/*
HELP1           Ad-screen says Register!, with some screen shots.
HELP2           Actual help, all the controls explained.
TITLEPIC        Maybe this is the title screen? Gee, I dunno...
CREDIT          People at id Software who created this great game.

 */
// https://doomwiki.org/wiki/Title_screen
// const parseTitlePic

const parseBitmap = {}

export const testFunctions = {
    parsePatchHeader,
    unfoldColumnofs
}