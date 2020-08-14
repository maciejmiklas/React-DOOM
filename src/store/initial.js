export const initial = {
    router: {
        active: "MANAGE_WADS"
    },
    menu: {
        visible: ["CONTROLS", "GRAPHICS", "SOUND", "UPLOAD_WADS", "MANAGE_WADS"]
    },
    wads: {
        files: [
            {
                name: "Doom1.wad",
                content: "ADF-aDFADFGSFDGSDFG-XD",
                uploadTime: "2020-02-03 12:55",
                lastPlayed: "2020-02-02 14:55",
                saves: [
                    {
                        name: "s1"
                    },
                    {
                        name: "s2"
                    }
                ],
                stats: {
                    totalPlayTimeMs: 0,
                    longestSessionMs: 0
                }
            },
            {
                name: "Doom2.wad",
                content: "ADF-aDFADFGSFDGSDFG-XD",
                uploadTime: "2020-02-03 12:55",
                lastPlayed: "2020-02-02 14:55",
                saves: [
                    {
                        name: "s1"
                    },
                    {
                        name: "s2"
                    }
                ],
                stats: {
                    totalPlayTimeMs: 0,
                    longestSessionMs: 0
                }
            },
            {
                name: "Doom3.wad",
                content: "ADF-aDFADFGSFDGSDFG-XD",
                uploadTime: "2020-02-03 12:55",
                lastPlayed: "2020-02-02 14:55",
                saves: [
                    {
                        name: "s1"
                    },
                    {
                        name: "s2"
                    }
                ],
                stats: {
                    totalPlayTimeMs: 0,
                    longestSessionMs: 0
                }
            }
        ],
        edit: {
            name: null
        }
    },
    confirm: {
        visible: false,
        callbackAction: "-",
        callbackProps: {},
        headerText: "-",
        msgText: "-",
    }
};