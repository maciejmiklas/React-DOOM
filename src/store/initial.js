export const initial = {
    router: {
        active: {
            name: "STORAGE",
            props: {}
        },
        previous: {
            name: "MENU",
            props: {},
        }
    },
    menu: {
        visible: ["CONTROLS", "GRAPHICS", "SOUND", "UPLOAD_WADS", "MANAGE_WADS", "STORAGE"]
    },
    messages: [],
    wads: {
        files: [
            {
                name: "Doom1",
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
                    longestSessionMs: 0,
                    lastSessionMs: 0
                }
            },
            {
                name: "Doom2",
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
                    longestSessionMs: 0,
                    lastSessionMs: 0
                }
            },
            {
                name: "Doom3",
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
                    longestSessionMs: 0,
                    lastSessionMs: 0
                }
            }
        ]
    },
    navigation: {
        title: "",
        backEnabled: false
    },
    confirm: {
        visible: false,
        callbacks: [],
        headerText: "-",
        msgText: "-",
    }
};