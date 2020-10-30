const enc = new TextEncoder();


const pHeader = (bytes32) => {
    const identification = "IWAD";
    const numlumps = 1;
    const infotableofs = 2;
    return {identification, numlumps, infotableofs};
}

class WadReader {
   static parse(bytes8) {
       const bytes32 = new Uint32Array(bytes8);
        const header = pHeader(bytes32);
        return "parsed!"
    }
}

export {WadReader};