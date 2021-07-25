MarkStart("EunoLIB");
/* ****▌████████████████████████████████████████████████████████████▐******\
|*     ▌█░░░░    EunoLIB: Common Functions for EunoScripts     ░░░░█▐     *|
|*     ▌███████████████████v@@VERSION@@██@@DATE@@███████████████████▐     *|
|*     ▌██░░░░ https://github.com/Eunomiac/EunosRoll20Scripts ░░░░██▐     *|
\* ****▌████████████████████████████████████████████████████████████▐******/

// #region ████████ EunoCORE: Functionality Required in Advance of Initialization ████████
const EunoCORE = {
    // #region ░░░░░░░[STORAGE]░░░░ Initialization & Management of 'state' Namespaces ░░░░░░░ ~
    ROOTNAME: "EunoScripts", // Namespace under global state variables
    get ROOT() { // Root state namespace for all EunoScripts
        if (!(this.ROOTNAME in state)) { state[this.ROOTNAME] = {isEunoState: true} }
        if (!state[this.ROOTNAME].isEunoState) { throw "[Euno] State Conflict: Another script has claimed state.EunoScripts" }
        return state[this.ROOTNAME];
    },
    GetLocalSTATE: function(scriptName) { // Returns script state namespace for specified EunoScript
        if (!(scriptName in this.ROOT)) {
            if (!(scriptName in this.SCRIPTDATA)) { throw `[Euno] Unrecognized Script: ${scriptName}` }
            if (!this.SCRIPTDATA[scriptName].hasDefaultSTATE) { throw `[Euno] State Access Error: ${scriptName} has not initialized state storage` }
            this.ROOT[scriptName] = {...this.getScript(scriptName).DEFAULTSTATE};
        }
        return this.ROOT[scriptName];
    },
    DeleteLocalSTATE: function(scriptName) { delete this.ROOT[scriptName] }, // Clears local state storage for specified EunoScript
    // #endregion ░░░░[STATE STORAGE]░░░░
    // #region ░░░░░░░[REGISTRATION] Installed EunoScripts Register Themselves Here ░░░░░░░ ~
    _scriptData: {},
    get SCRIPTDATA() { return this._scriptData },
    getScript: function(scriptName) { return (this.SCRIPTDATA[scriptName] || {script: false}).script },
    Register: function(name, script) {
        this._scriptData[name] = {
            name,
            script,
            hasDefaultSTATE: "DEFAULTSTATE" in script,
            hasPreinitialize: "Preinitialize" in script,
            hasInitialize: "Initialize" in script,
            hasListeners: "Listeners" in script,
            hasPostInitialize: "PostInitialize" in script
        };
    },
    // #endregion ░░░░[ REGISTRATION]░░░░
    // #region ░░░░░░░[INITIALIZATION] Managed Initialization of All Installed EunoScripts ░░░░░░░ ~
    InitSteps: ["Preinitialize", "Initialize", "PostInitialize"],
    // VERSION MIGRATION: Any migration processing necessary on version update
    UpdateNamespace: () => {
        try {
            /* Migration Tasks */
            return true;
        } catch (err) { throw `[Euno] ERROR: Unable to Update Namespace: ${err.message}` }
    },
    // SCRIPT INITIALIZATION
    ConfirmReady: function(scriptName) {
        // Scripts confirm init steps completed via this function.
        this.initializationLog[scriptName] = true;
        if (Object.values(this.initializationLog).every((scriptStatus) => scriptStatus === true)) {
            // If all scripts have confirmed step completion, move to next step.
            this.INITIALIZE();
        }
    },
    INITIALIZE: function() {
        if (this.InitSteps.length) {
            const initStep = this.InitSteps.shift();

            const scriptDatas = Object.values(this._scriptData).filter((scriptData) => scriptData[`has${initStep}`]);

            switch (initStep) {
                case "Preinitialize": {
                    this.UpdateNamespace();
                    try {EunoCONFIG} // Verify EunoCONFIG.js is installed
                    catch {throw "[Euno] Error: Can't find 'EunoCONFIG.js'. Is it installed?"}
                    break;
                }
                case "Initialize": break;
                case "Listeners": {
                    scriptDatas.forEach(({name, script, Listeners: listenData}) => this.L.RegisterListener(name, script, listenData));
                    return false;
                }
                case "PostInitialize": {
                    this.U.Flag("Initialization Complete!");
                    break;
                }
                // no default
            }

            if (scriptDatas.length) {
                const scripts = scriptDatas.map(({name, script}) => [name, script]);
                // Log scripts to initialization log, for later confirmation of step completion
                this.initializationLog = {...Object.fromEntries(scripts)};
                // Process each script through next initialization step
                scripts.forEach(([, script]) => { script[initStep]() });
            } else {
                this.INITIALIZE();
            }
            // Initialization not yet complete
            return false;
        } else {
            // Initialization Complete!
            return true;
        }
    },
    // #endregion ░░░░[INITIALIZATION]░░░░

    // #region ████████ C (EunoCORE.CONSTANTS): Globally-Accessible Constants ████████
    CONSTANTS: {
        // #region ░░░░░░░[COLORS] Color Definitions ░░░░░░░ ~
        COLORS: {
            // Black / Grey / White
            black: "#000",
            grey10: `rgb(${new Array(3).fill(parseInt(255 * 0.1)).join(", ")})`,
            grey25: `rgb(${new Array(3).fill(parseInt(255 * 0.25)).join(", ")})`,
            grey: `rgb(${new Array(3).fill(parseInt(255 * 0.5)).join(", ")})`,
            grey75: `rgb(${new Array(3).fill(parseInt(255 * 0.75)).join(", ")})`,
            grey90: `rgb(${new Array(3).fill(parseInt(255 * 0.9)).join(", ")})`,
            white: "#FFF",

            // Gold
            gold: "#FFD700",
            palegold: "#FFE775",

            // Silver
            silver: "silver",
            palesilver: "#FFFFFF",

            // Bronze
            bronze: "#CD7F32",
            palebronze: "#E6BF99"
        },
        // #endregion ░░░░[COLORS]░░░░
        // #region ░░░░░░░[FONTS] Supported Sandbox Fonts ░░░░░░░ ~
        FONTS: {
            families: [
                "Arial",
                "Patrick Hand",
                "Contrail One",
                "Shadows Into Light",
                "Candal",
                "Tahoma",
                "Nunito",
                "Merriweather",
                "Anton",
                "Rye",
                "IM Fell DW Pica",
                "Montserrat",
                "Goblin One",
                "Della Respira",
                "Crimson Text",
                "Kaushan Script"
            ],
            sizes: [8, 10, 12, 14, 16, 18, 20, 22, 26, 32, 40, 56, 72, 100, 200, 300]
        },
        // #endregion ░░░░[FONTS]░░░░
        // #region ░░░░░░░[IMAGES] Image Source URLs ░░░░░░░ ~

        IMAGES: (function() {
            const IMGROOT = "https://tinyurl.com/xczfeezdv"; //~ "http://raw.githubusercontent.com/Eunomiac/EunosRoll20Scripts/master/images";
            return Object.fromEntries(Object.entries({
                buttonDownload: ["buttons", "buttonDownload.png", [50, 50]],
                buttonChat: ["buttons", "buttonChat.png", [50, 50]],
                buttonBug: ["buttons", "buttonBug.png", [50, 50]],

                //     #region ========== Gold: Level 1 Gold Theme =========== ~
                bgChatGold: ["backgrounds", "bgChatGold.jpg", [283, 563]],

                titleMain: ["bookends", "headerMain.png", [283, 208]],
                titleMainButtons: ["bookends", "headerMainButtons.png", [283, 208]],
                subtitleGold: ["bookends", "subtitleGold.png", [283, 142]],

                footerGold: ["bookends", "footerGold.png", [283, 142]],
                footerGoBackGold: ["bookends", "footerGoBackGold.png", [283, 142]],
                footerHideIntroGold: ["bookends", "footerHideIntroGold.png", [283, 142]],

                h1Gold: ["emphasis", "h1Gold.png", [283, 40]],
                h1GoldDim: ["emphasis", "h1GoldDim.png", [283, 40]],
                h1GoldTight: ["emphasis", "h1GoldTight.png", [283, 28]],
                h1GoldTightDim: ["emphasis", "h1GoldTightDim.png", [283, 28]],
                h1FlagGold: ["emphasis", "h1FlagGold.png", [283, 33]],

                h2Gold: ["emphasis", "h2Gold.png", [283, 37]],
                h2GoldDim: ["emphasis", "h2GoldDim.png", [283, 37]],
                h2GoldTight: ["emphasis", "h2GoldTight.png", [283, 24]],
                h2GoldTightDim: ["emphasis", "h2GoldTightDim.png", [283, 24]],
                h2FlagGold: ["emphasis", "h2FlagGold.png", [283, 24]],

                commandGold: ["emphasis", "commandGold.png", [235, 37]],

                toggleButtonOnGold: ["buttons", "toggleOnGold.png", [283, 78]],
                toggleButtonOffGold: ["buttons", "toggleOffGold.png", [283, 78]],
                //     #endregion _______ Gold _______
                //     #region ========== Silver: Level 2 Silver Theme =========== ~
                bgChatSilver: ["backgrounds", "bgChatSilver.jpg", [283, 563]],

                titleETC: ["bookends", "headerScriptETC.png", [283, 142]],
                titleEGC: ["bookends", "headerScriptEGC.png", [283, 142]],
                titleEHC: ["bookends", "headerScriptEHC.png", [283, 142]],
                subtitleSilver: ["bookends", "subtitleSilver.png", [283, 142]],

                footerSilver: ["bookends", "footerSilver.png", [283, 142]],
                footerGoBackSilver: ["bookends", "footerGoBackSilver.png", [283, 142]],

                h1Silver: ["emphasis", "h1Silver.png", [283, 40]],
                h1SilverDim: ["emphasis", "h1SilverDim.png", [283, 40]],
                h1SilverTight: ["emphasis", "h1SilverTight.png", [283, 28]],
                h1SilverTightDim: ["emphasis", "h1SilverTightDim.png", [283, 28]],
                h1FlagSilver: ["emphasis", "h1FlagSilver.png", [283, 33]],

                h2Silver: ["emphasis", "h2Silver.png", [283, 37]],
                h2SilverDim: ["emphasis", "h2SilverDim.png", [283, 37]],
                h2SilverTight: ["emphasis", "h2SilverTight.png", [283, 24]],
                h2SilverTightDim: ["emphasis", "h2SilverTightDim.png", [283, 24]],
                h2FlagSilver: ["emphasis", "h2FlagSilver.png", [283, 24]],

                commandSilver: ["emphasis", "commandSilver.png", [235, 37]],

                toggleButtonOnSilver: ["buttons", "toggleOnSilver.png", [283, 78]],
                toggleButtonOffSilver: ["buttons", "toggleOffSilver.png", [283, 78]],
                //     #endregion _______ Silver _______
                //     #region ========== Bronze: Level 3 Bronze Theme =========== ~
                bgChatBronze: ["backgrounds", "bgChatBronze.jpg", [283, 563]],

                subtitleBronze: ["bookends", "subtitleBronze.png", [283, 142]],
                subtitleBronzeETC: ["bookends", "subtitleBronzeETC.png", [283, 142]],
                subtitleBronzeEGC: ["bookends", "subtitleBronzeEGC.png", [283, 142]],
                subtitleBronzeEHC: ["bookends", "subtitleBronzeEHC.png", [283, 142]],

                footerBronze: ["bookends", "footerBronze.png", [283, 142]],
                footerGoBackBronze: ["bookends", "footerGoBackBronze.png", [283, 142]],

                h1Bronze: ["emphasis", "h1Bronze.png", [283, 40]],
                h1BronzeDim: ["emphasis", "h1BronzeDim.png", [283, 40]],
                h1BronzeTight: ["emphasis", "h1BronzeTight.png", [283, 28]],
                h1BronzeTightDim: ["emphasis", "h1BronzeTightDim.png", [283, 28]],
                h1FlagBronze: ["emphasis", "h1FlagBronze.png", [283, 33]],

                h2Bronze: ["emphasis", "h2Bronze.png", [283, 37]],
                h2BronzeDim: ["emphasis", "h2BronzeDim.png", [283, 37]],
                h2BronzeTight: ["emphasis", "h2BronzeTight.png", [283, 24]],
                h2BronzeTightDim: ["emphasis", "h2BronzeTightDim.png", [283, 24]],
                h2FlagBronze: ["emphasis", "h2FlagBronze.png", [283, 24]],

                commandBronze: ["emphasis", "commandBronze.png", [235, 37]],

                toggleButtonOnBronze: ["buttons", "toggleOnBronze.png", [283, 78]],
                toggleButtonOffBronze: ["buttons", "toggleOffBronze.png", [283, 78]],
                //     #endregion _______ Bronze _______

                h3BGBlack: ["backgrounds", "h3BGBlack.jpg", [626, 626]]
            }).map(([key, [folder, name, [width, height]]]) => [key, {height, width, img: [IMGROOT, folder, name].join("/")}]));
        })(),
        GetImgURL: function(imgKey) { return this.IMAGES[imgKey].img },
        GetImgSize: function(imgKey) {
            if (imgKey in this.IMAGES) {
                return [this.IMAGES[imgKey].width, this.IMAGES[imgKey].height];
            } else {
                throw `[Euno] Error: Bad Image Key: ${imgKey}`;
            }
        },
        // #endregion ░░░░[IMAGES]░░░░
        // #region ░░░░░░░[ROLL20] Roll20-Specific Data ░░░░░░░ ~
        ROLL20TYPES: {
            all: [
                "graphic", "text", "path", "character", "ability", "attribute", "handout", "rollabletable", "tableitem", "macro",
                "page", "campaign", "player", "deck", "card", "hand", "jukeboxtrack", "custfx"
            ],
            canCreate: [
                "graphic", "text", "path", "character", "ability", "attribute", "handout", "rollabletable", "tableitem", "macro"
            ]
        },
        // #endregion ░░░░[ROLL20 OBJECTS]░░░░
        // #region ░░░░░░░[NUMBERS] Number Words, Ordinal Suffixes, Roman Numerals ░░░░░░░ ~
        NUMBERWORDS: {
            ones: [
                "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
                "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"
            ],
            tens: ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"],
            tiers: ["", "thousand", "m-", "b-", "tr-", "quadr-", "quint-", "sext-", "sept-", "oct-", "non-"]
                .map((prefix) => prefix.replace(/-$/, "illion")),
            bigPrefixes: [ "", "un", "duo", "tre", "quattuor", "quin", "sex", "octo", "novem" ],
            bigSuffixes: [ "", "dec", "vigint", "trigint", "quadragint", "quinquagint", "sexagint", "septuagint", "octogint", "nonagint", "cent"]
                .map((prefix) => prefix ? `${prefix}illion` : "")
        },
        ORDINALS: {
            zero: "zeroeth", one: "first", two: "second", three: "third", four: "fourth", five: "fifth", eight: "eighth", nine: "ninth", twelve: "twelfth",
            twenty: "twentieth", thirty: "thirtieth", forty: "fortieth", fifty: "fiftieth", sixty: "sixtieth", seventy: "seventieth", eighty: "eightieth", ninety: "ninetieth"
        },
        ROMANNUMERALS: {
            grouped: [
                ["", "Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ", "Ⅵ", "Ⅶ", "Ⅷ", "Ⅸ"],
                ["", "Ⅹ", "ⅩⅩ", "ⅩⅩⅩ", "ⅩⅬ", "Ⅼ", "ⅬⅩ", "ⅬⅩⅩ", "ⅬⅩⅩⅩ", "ⅩⅭ"],
                ["", "Ⅽ", "ⅭⅭ", "ⅭⅭⅭ", "ⅭⅮ", "Ⅾ", "ⅮⅭ", "ⅮⅭⅭ", "ⅮⅭⅭⅭ", "ⅭⅯ"],
                ["", "Ⅿ", "ⅯⅯ", "ⅯⅯⅯ", "Ⅿↁ", "ↁ", "ↁⅯ", "ↁⅯⅯ", "ↁⅯⅯⅯ", "ↁↂ"],
                ["", "ↂ", "ↂↂ", "ↂↂↂ", "ↂↇ", "ↇ", "ↇↂ", "ↇↂↂ", "ↇↂↂↂ", "ↇↈ"],
                ["", "ↈ", "ↈↈ", "ↈↈↈ"]
            ],
            ungrouped: [
                ["", "Ⅰ", "ⅠⅠ", "ⅠⅠⅠ", "ⅠⅤ", "Ⅴ", "ⅤⅠ", "ⅤⅠⅠ", "ⅤⅠⅠⅠ", "ⅠⅩ"],
                ["", "Ⅹ", "ⅩⅩ", "ⅩⅩⅩ", "ⅩⅬ", "Ⅼ", "ⅬⅩ", "ⅬⅩⅩ", "ⅬⅩⅩⅩ", "ⅩⅭ"],
                ["", "Ⅽ", "ⅭⅭ", "ⅭⅭⅭ", "ⅭⅮ", "Ⅾ", "ⅮⅭ", "ⅮⅭⅭ", "ⅮⅭⅭⅭ", "ⅭⅯ"],
                ["", "Ⅿ", "ⅯⅯ", "ⅯⅯⅯ", "Ⅿↁ", "ↁ", "ↁⅯ", "ↁⅯⅯ", "ↁⅯⅯⅯ", "ↁↂ"],
                ["", "ↂ", "ↂↂ", "ↂↂↂ", "ↂↇ", "ↇ", "ↇↂ", "ↇↂↂ", "ↇↂↂↂ", "ↇↈ"],
                ["", "ↈ", "ↈↈ", "ↈↈↈ"]
            ]
        }
    // #endregion ░░░░[NUMBER STRINGS]░░░░
    },
    // #endregion ▄▄▄▄▄ C ▄▄▄▄▄

    // #region ░░░░░░░[SHORTHAND GETTERS] Shorthand Getters for Major Script Components ░░░░░░░ ~
    get CFG() { return EunoCONFIG },
    get LIB() { return EunoLIB },
    get REG() { return EunoLIB.RE.G },
    get C() { return EunoCORE.CONSTANTS },
    get U() { return EunoLIB.UTILITIES },
    get L() { return EunoLIB.LISTENER },
    get O() { return EunoLIB.OBJECTS },
    get H() { return EunoLIB.HTML }
    // #endregion ░░░░[SHORTHAND GETTERS]░░░░
};
// #endregion ▄▄▄▄▄ EunoCORE ▄▄▄▄▄

// #region ████████ EunoLIB: Library of Script Dependencies ████████
const EunoLIB = /** @lends EunoLIB */ (() => {
    // #region ▒░▒░▒░▒[FRONT] Boilerplate Namespacing & Initialization ▒░▒░▒░▒ ~
    // #region ░░░░░░░[Namespacing] Basic References & Namespacing ░░░░░░░ ~

    const SCRIPTNAME = "EunoLIB";
    const STA = {get TE() {return EunoCORE.GetLocalSTATE(SCRIPTNAME)}};
    const RE = {get G() {return STA.TE.REGISTRY}};

    const {CFG, C} = EunoCORE; let LIB, REG, U, L, O, H; // must wait for intialization to be assigned
    // #endregion ░░░░[Namespacing]░░░░
    // #region ░░░░░░░[Initialization] Script Startup & Event Listeners ░░░░░░░ ~
    const DEFAULTSTATE = {
        REGISTRY: {},
        isDisplayingHelpAtStart: true
    };
    const Initialize = () => {
        // Assign shorthand script references
        ({LIB, REG, U, L, O, H} = EunoCORE); //                                    ◀======

        // Report Config Readiness (verified earlier)
        U.Flag("EunoCONFIG Ready"); log("[Euno] EunoCONFIG Ready");

        // Register event handlers
        L.RegisterListener(SCRIPTNAME, "chat:message", "handleMessage", {returnObjs: ["all"], chatCall: "!euno"});
        L.RegisterListener(SCRIPTNAME, "chat:message", "handleMessage", {returnObjs: ["all"], chatCall: "!edev"});

        // Alert readiness confirmation
        U.Flag(`${SCRIPTNAME} Ready`); log(`[Euno] ${SCRIPTNAME} Initialized`);

        // Report initialization complete to EunoCORE loader
        EunoCORE.ConfirmReady(SCRIPTNAME);
    };
    const PostInitialize = () => {

        // Display Help message, if so configured
        if (STA.TE.isDisplayingHelpAtStart) {
            H.DisplayHelp({isAutoDisplaying: true});
        }

        // Report postinitialization complete to EunoCORE loader
        EunoCORE.ConfirmReady(SCRIPTNAME);
    };

    // #endregion ░░░░[Initialization]░░░░
    // #region ░░░░░░░[Handlers] Event Handlers ░░░░░░ ~
    const handleMessage = (msgData) => {
        let {call, args, selected} = msgData;
        if (call === "!euno") {
            try {({
                toggle: () => ( {
                    intro: () => {
                        STA.TE.isDisplayingHelpAtStart = args.includes(true);
                        if (STA.TE.isDisplayingHelpAtStart) {
                            U.Flag("Showing Help at Start.", 2);
                        } else {
                            U.Flag("Hiding Help at Start.", 2, ["silver"]);
                        }
                    }
                }[ U.LCase((call = args.shift())) ]() )
            }[ U.LCase((call = args.shift())) ]() );
            } catch { H.DisplayHelp() }
        } else if (call === "!edev") {
            try {({
                get: () => ( {
                    stateall: () => U.Show(state),
                    root: () => U.Show(EunoCORE.ROOT),
                    state: () => U.Show(STA.TE),
                    data: () => U.Show(selected)
                }[U.LCase((call = args.shift()))]())
            }[U.LCase((call = args.shift()))]());
            } catch { U.Flag(`[EDev] Error: Bad Call: '${call}'`, 2) }
        }
    };
    // #endregion ░░░░[Handlers]░░░░
    // #endregion ▒▒▒▒[FRONT]▒▒▒▒

    // #region ████████ U (UTILITIES): Global Utility Functions ████████
    const UTILITIES = (() => {
        // #region ▒░▒░▒░▒[FRONT] Boilerplate Namespacing & Initialization ▒░▒░▒░▒ ~
        //     #region ========== Namespacing: Basic State References & Namespacing =========== ~
        const SCRIPTNAME = "UTILITIES";
        const STA = {get TE() {return EunoCORE.GetLocalSTATE(SCRIPTNAME)}};
        //     #endregion _______ Namespacing _______
        //     #region ========== Initialization: Script Startup & Event Listeners =========== ~
        const Initialize = () => {
            // Alert readiness confirmation
            Flag(`EunoLIB.${SCRIPTNAME} Ready`, 2, ["silver"]);
            log(`[Euno] ${SCRIPTNAME} Initialized`);

            // Report initialization complete to EunoCORE loader
            EunoCORE.ConfirmReady(SCRIPTNAME);
        };
        //     #endregion _______ Initialization _______
        // #endregion ▒▒▒▒[FRONT]▒▒▒▒

        // #region ░░░░░░░[Validation] Verification & Type Checking ░░░░░░░ ~
        const GetType = (val) => {
            /** TYPES RETURNED:
             *
             * "id",                        // is likely a Roll20 object id
             * "hex", "hexa", "rgb", "rgba", "hsl", "hsla",             // css color values
             * "int", "float", "bigint",    // numbers, even if cast to string
             * "array", "list",             // list = simple object literal
             * "boolean", "null", "undefined",
             * "function",
             * "date", "regexp", ... ... ...// ... as well as all other core javascript prototypes
             * "graphic", "text", "path", "character", "ability", "attribute", "handout", "rollabletable", "tableitem", "macro",
             * "page", "campaign", "player", "deck", "card", "hand", "jukeboxtrack", "custfx",
             * "string"                     // only if none of the above match
             *
             */
            const valType = Object.prototype.toString.call(val)
                .slice(8, -1)
                .toLowerCase()
                .trim();
            switch (valType) {
                case "string":
                    return (
                        Object.entries({
                            hex: /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/,
                            hexa: /^#[A-Fa-f0-9]{8}$/,
                            rgb: /^rgb\((\s*\d{1,3}[,\s)]){3}$/,
                            rgba: /^rgba\((\s*\d{1,3}[,\s)]){3}(\s*[\d\.]+[,\s)])$/,
                            hsl: /^hsl\((\s*[\d\.%]+[,\s)]){3}$/,
                            hsla: /^hsla\((\s*[\d\.%]+[,\s)]){3}(\s*[\d\.]+[,\s)])$/,
                            int: /^(-|\+)?[\d,]+$/,
                            float: /^(-|\+|\d)[\d,\s]*\.[\d\s]*$/,
                            id: /^-[a-zA-Z0-9_-]{19}$/
                        }).find(([type, pattern]) => pattern.test(val.trim())) || ["string"]
                    ).shift();
                case "number":
                    return /\./.test(`${val}`) ? "float" : "int";
                case "object":
                    return O.GetR20Type(val) || "list";
                // no default
            }
            return valType;
        };
        // #endregion ░░░░[Validation]░░░░
        // #region ░░░░░░░[Conversion]░░░░ Converting Between String Types ░░░░░░░ ~
        const HexToDec = (hex) => LCase(hex)
            .replace(/[^a-z0-9]/g, "")
            .split("").reverse()
            .reduce((tot, digit, i) => tot + Math.pow(16, i) * "0123456789abcdef".search(digit), 0);
        const DecToHex = (dec) => {
            const hex = [];
            let quot = parseInt(dec);
            do {
                hex.push("0123456789abcdef".charAt(quot % 16));
                quot = Math.floor(quot / 16);
            } while (quot > 0);
            return hex.reverse().join("");
        };
        // #endregion ░░░░[Conversion]░░░░
        // #region ░░░░░░░[Numbers] Number Generation, Manipulation, Parsing from Strings ░░░░░░░ ~
        //     #region ========== Parsing: "Safe" Parsing of Numbers =========== ~
        const Float = (qNum) => parseFloat(qNum) || 0;
        const Int = (qNum) => parseInt(Math.round(Float(qNum)));
        //     #endregion _______ Parsing _______
        //     #region ========== Constraining: Rounding, Binding, Cycling =========== ~
        const RoundNum = (qNum, numDecDigits = 0) => {
            if (Float(qNum) === Int(qNum)) {
                return Int(qNum);
            }
            return Math.round(Float(qNum) * 10 ** Int(numDecDigits)) / 10 ** Int(numDecDigits);
        };
        const BindNum = (qNum, minVal, maxVal) => Math.max(Math.min(Float(qNum), Float(maxVal)), Float(minVal));
        const CycleNum = (qNum, minVal, maxVal) => {
            qNum = Float(qNum);
            minVal = Float(minVal);
            maxVal = Float(maxVal);
            while (qNum > maxVal) {
                qNum -= maxVal - minVal;
            }
            while (qNum < minVal) {
                qNum += maxVal - minVal;
            }
            return qNum;
        };
        //     #endregion _______ Constraining _______
        // #endregion ░░░░[Numbers]░░░░
        // #region ░░░░░░░[Strings] String Manipulation, JSON, Type Conversion ░░░░░░░ ~
        //     #region ========== Case Conversion: Upper, Lower, Sentence & Title Case =========== ~
        const UCase = (val) => `${val || ""}`.toUpperCase(); // "Safe" toUpperCase()
        const LCase = (val) => `${val || ""}`.toLowerCase(); // "Safe" toLowerCase()
        const SCase = (val) => {
            // Converts to sentence case, retaining interior uppercase letters UNLESS all uppercase
            val = `${val || ""}`;
            if (/[^a-z]/u.test(val)) {
                val = LCase(val);
            }
            return `${UCase(val.charAt(0))}${val.slice(1)}`;
        };
        const TCase = (val) => `${val || ""}`
            .split(/ /gu)
            .map((subStr) =>
                `${UCase(subStr.charAt(0))}${(/^[^a-z]*$/u.test(subStr)
                    ? subStr
                    : LCase(subStr)
                ).slice(1)}`)
            .join(" ");
        //     #endregion _______ Case Conversion _______
        //     #region ========== Type Conversion: To Numbers, Objects, JSON =========== ~
        const ParseString = (val) => {
            // Converts strings into appropriate data type
            if (GetType(val) === "array") {
                return val.map((v) => ParseString(v));
            }
            switch (GetType(val)) {
                case "int": return Int(val);
                case "float": return Float(val);
                default: {
                    switch (LCase(val)) {
                        case "true": return true;
                        case "false": return false;
                        case "null": return null;
                        case "undefined": return undefined;
                        default: return val;
                    }
                }
            }
        };
        const ParseParams = (val, delim = ",", propDelim = ":") =>
            Object.fromEntries(val // Converts comma-delimited <key>:<val> pairs to object.
                .split(delim)
                .map((kvPair) => kvPair.split(propDelim)));
        const JS = (val) =>
            JSON.stringify(val, null, 2) // Stringification for display in R20 chat.
                .replace(/\n/g, "<br>")
                .replace(/ /g, "&nbsp;");
        const JC = (val) => H.Pre(JS(val)); // Stringification for data objects and other code for display in R20 chat.
        //     #endregion _______ Type Conversion _______
        //     #region ========== Formatting: Lists, Pluralization, Possessives =========== ~
        const Pluralize = (qty, singular, plural) => Float(qty) === 1
            ? `${qty} ${singular}`
            : plural || `${singular}s`.replace(/ss$/, "ses").replace(/ys$/, "ies");
        //     #endregion _______ Formatting _______
        //     #region ========== Numbers to Strings: Convert Numbers to Words, Signed Numbers, Ordinals, Roman Numerals =========== ~
        const NumToString = (num) => {
            // Can take string representations of numbers, either in standard or scientific/engineering notation.
            // Returns a string representation of the number in standard notation.
            if (Float(num) === 0) {return "0"}
            num = LCase(num).replace(/[^\d.e+-]/g, "");
            const base = Extract(num, /^-?[\d.]+/);
            const exp = Int(Extract(num, /e([+-]?\d+)$/).pop());
            const baseInts = Extract(base, /^-?(\d+)/).pop().replace(/^0+/, "");
            const baseDecs = LCase(Extract(base, /\.(\d+)/).pop()).replace(/0+$/, "");
            const numFinalInts = Math.max(0, baseInts.length + exp);
            const numFinalDecs = Math.max(0, baseDecs.length - exp);

            const finalInts = [
                baseInts.slice(0, numFinalInts),
                baseDecs.slice(0, Math.max(0, exp))
            ].join("") || "0";
            const finalDecs = [
                baseInts.length - numFinalInts > 0
                    ? baseInts.slice(baseInts.length - numFinalInts - 1)
                    : "",
                baseDecs.slice(baseDecs.length - numFinalDecs)
            ].join("");

            return [
                num.charAt(0) === "-" ? "-" : "",
                finalInts,
                "0".repeat(Math.max(0, numFinalInts - finalInts.length)),
                finalDecs.length ? "." : "",
                "0".repeat(Math.max(0, numFinalDecs - finalDecs.length)),
                finalDecs
            ].join("");
        };
        const NumToWords = (num) => {
            num = NumToString(num);
            const getTier = (trioNum) => {
                if (trioNum < C.NUMBERWORDS.tiers.length) {
                    return C.NUMBERWORDS.tiers[trioNum];
                }
                return [
                    C.NUMBERWORDS.bigPrefixes[(trioNum % 10) - 1],
                    C.NUMBERWORDS.bigSuffixes[Math.floor(trioNum / 10)]
                ].join("");
            };
            const parseThreeDigits = (trio, tierNum) => {
                if (Int(trio) === 0) {return ""}
                const digits = `${trio}`.split("").map((digit) => Int(digit));
                let result = "";
                if (digits.length === 3) {
                    const hundreds = digits.shift();
                    result += hundreds > 0 ? `${C.NUMBERWORDS.ones[hundreds]} hundred` : "";
                    if (hundreds && (digits[0] || digits[1])) {
                        result += " and ";
                    }
                }
                if (Int(digits.join("")) <= C.NUMBERWORDS.ones.length) {
                    result += C.NUMBERWORDS.ones[Int(digits.join(""))];
                } else {
                    result += `${C.NUMBERWORDS.tens[Int(digits.shift())]}${Int(digits[0]) > 0 ? `-${C.NUMBERWORDS.ones[Int(digits[0])]}` : ""}`;
                }
                return result;
            };
            const numWords = [];
            if (num.charAt(0) === "-") {
                numWords.push("negative");
            }
            const [integers, decimals] = num.replace(/[,|\s|-]/g, "").split(".");
            const intArray = integers.split("").reverse().join("")
                .match(/.{1,3}/g)
                .map((v) => v.split("").reverse().join(""));
            const intStrings = [];
            while (intArray.length) {
                const theseWords = parseThreeDigits(intArray.pop());
                if (theseWords) {
                    intStrings.push(`${theseWords} ${getTier(intArray.length)}`);
                }
            }
            numWords.push(intStrings.join(", ").trim());
            if (GetType(decimals) === "int") {
                if (integers === "0") {
                    numWords.push("zero");
                }
                numWords.push("point");
                for (const digit of decimals.split("")) {
                    numWords.push(C.NUMBERWORDS.ones[Int(digit)]);
                }
            }
            return numWords.join(" ");
        };
        const NumToOrdinal = (num, isReturningWords = false) => {
            if (isReturningWords) {
                const [numText, suffix] = LCase(NumToWords(num)).match(/.*?[-|\s]?(\w*?)$/);
                return numText.replace(
                    new RegExp(`${suffix}$`),
                    C.ORDINALS[suffix] || `${suffix}th`
                );
            }
            const tNum = Int(num) - 100 * Math.floor(Int(num) / 100);
            if (/\.|1[1-3]$/.test(`${num}`)) {
                return `${num}th`;
            }
            return `${num}${
                ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"][
                    Int(`${num}`.charAt(`${num}`.length - 1))
                ]
            }`;
        };
        const NumToRoman = (num, isUsingGroupedChars = true) => {
            if (U.GetType(num) === "float") {
                throw `[Euno] Error: Can't Romanize Floats (${num})`;
            }
            if (num > 399999) {
                throw `[Euno] Error: Can't Romanize >= 400,000 (${num})`;
            }
            if (num <= 0) {
                throw `[Euno] Error: Can't Romanize <= 0 (${num})`;
            }
            const romanRef = C.ROMANNUMERALS[isUsingGroupedChars ? "grouped" : "ungrouped"];
            const romanNum = NumToString(num)
                .split("")
                .reverse()
                .map((digit, i) => romanRef[i][Int(digit)])
                .reverse()
                .join("");
            return isUsingGroupedChars
                ? romanNum.replace(/ⅩⅠ/gu, "Ⅺ").replace(/ⅩⅡ/gu, "Ⅻ")
                : romanNum;
        };
        const NumToSignedNum = (qNum, delim = "") => `${Float(qNum) < 0 ? "-" : "+"}${delim}${Math.abs(Float(qNum))}`;
        const NumToPaddedNum = (qNum, numDecDigits) => {
            const [leftDigits, rightDigits] = `${Float(qNum)}`.split(/\./);
            if (GetType(rightDigits) === "int") {
                if (rightDigits.length > numDecDigits) {
                    return `${RoundNum(qNum, numDecDigits)}`;
                } else if (rightDigits.length < numDecDigits) {
                    return `${leftDigits}.${rightDigits}${"0".repeat(numDecDigits - rightDigits.length)}`;
                } else {
                    return `${Float(qNum)}`;
                }
            }
            return `${leftDigits}.${"0".repeat(numDecDigits)}`;
        };
        //     #endregion _______ Numbers to Strings _______
        //     #region ========== RegExp: Regular Expressions =========== ~
        const Extract = (qStr, qRegExp) => {
            const isGrouping = /[)(]/.test(qRegExp.toString());
            const matches = qStr.match(new RegExp(qRegExp)) || [];
            if (isGrouping) {
                return matches.slice(1);
            }
            return matches.pop();
        };
        //     #endregion _______ RegExp _______
        // #endregion ░░░░[Strings]░░░░
        // #region ░░░░░░░[Math] Mathematical Operations, Interpolation, Scaling ░░░░░░░ ~
        const Scale = (qObj, scaleFactor = 1, sigDigits = 2) => {
            if (GetType(qObj) === "list") {
                return KVPMap(qObj, (val) => RoundNum(Float(val) * Float(scaleFactor), sigDigits));
            }
            if (GetType(qObj) === "array") {
                return qObj.map((val) => RoundNum(Float(val) * Float(scaleFactor), sigDigits));
            }
            if (["int", "float"].includes(GetType(qObj))) {
                return RoundNum(Float(qObj) * Float(scaleFactor), sigDigits);
            }
            return qObj;
        };
        const ScaleColor = (colorRef, scaleFactor = 1) => {
            const colorVals = [];
            const colorRefType = GetType(colorRef);
            switch (colorRefType) {
                case "string": {
                    if (colorRef in C.COLORS) {
                        return ScaleColor(C.COLORS[colorRef], scaleFactor);
                    }
                    return colorRef;
                }
                case "hex": case "hexa": {
                    colorRef = colorRef.replace(/[^A-Za-z0-9]/g, "");
                    if (colorRef.length === 3) {
                        colorRef = colorRef.split("").map((h) => `${h}${h}`).join("");
                    }
                    colorVals.push(...colorRef.match(/.{2}/g).map((hex) => HexToDec(hex)));
                    break;
                }
                case "rgb": case "rgba": case "hsl": case "hsla": {
                    colorVals.push(...colorRef.match(/[\d\.%]+[,\s)]/g).map((val) => {
                        if (/%/.test(val)) {
                            return Int(val.replace(/[^\d\.]/g, "")) / 100;
                        }
                        return /\./.test(val) ? Float(val) : Int(val);
                    }));
                    break;
                }
                default: return colorRef;
            }
            const scaledColorVals = Scale(colorVals, scaleFactor, 0);
            switch (colorRefType) {
                case "hexa": return `rgba(${scaledColorVals.join(", ")})`;
                case "hex": return `#${scaledColorVals.map((val) => EunoCORE.DecToHex(val)).join("")}`;
                default: return `${colorRefType}(${scaledColorVals.join(", ")})`;
            }
        };
        const Interpolate = (coords, query) => {
            const [iQuery, iBase] = ["int", "float"].includes(GetType(query[0]))
                ? [1, 0]
                : [0, 1];
            const [base, qCoords, bCoords] = [
                query[iBase],
                coords.map((coord) => coord[iQuery]),
                coords.map((coord) => coord[iBase])
            ];
            if (bCoords.includes(base)) {
                return RoundNum(coords.find((coord) => coord[iBase] === base)[iQuery], 2);
            }
            const [
                [query1, base1],
                [query2, base2]
            ] = (() => {
                const iAbove = bCoords.findIndex((bCoord) => base < bCoord);
                const iMax = coords.length - 1;
                switch (iAbove) {
                    case -1: return [
                        [qCoords[iMax - 1], bCoords[iMax - 1]],
                        [qCoords[iMax], bCoords[iMax]]
                    ];
                    case 0: return [
                        [qCoords[0], bCoords[0]],
                        [qCoords[1], bCoords[1]]
                    ];
                    default: return [
                        [qCoords[iAbove - 1], bCoords[iAbove - 1]],
                        [qCoords[iAbove], bCoords[iAbove]]
                    ];
                }
            })();
            return RoundNum((base - base1) * (query2 - query1) / (base2 - base1) + query1, 2);
        };
        // #endregion ░░░░[Math]░░░░
        // #region ░░░░░░░[Chat] Parsing Message Objects, Displaying Basic Chat Messages ░░░░░░░ ~
        const randStr = () => _.sample("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split(""), 4).join("");
        const CheckMessage = (msg, calls, {isGM = true} = {}) => {
            return U.GetType(msg) === "list"
                    && msg.type === "api"
                    && (calls === null || U.Arrayify(calls).some((call) => msg.content.startsWith(call)))
                    && (calls === null || !isGM || playerIsGM(msg.playerid));
        };
        const ParseMessage = (msg, types = []) => {
            const msgData = {
                msg,
                call: undefined,
                args: undefined,
                isAPI: msg.type === "api",
                isGM: playerIsGM(msg.playerid),
                playerID: msg.playerid,
                playerDisplayName: msg.who,
                content: msg.content,
                selected: Object.fromEntries(U.Arrayify(types).map((type) => [type, O.GetSelObj([msg], type)]))
            };
            [msgData.call, ...msgData.args] = U.ParseString(U.Arrayify(msg.content
                .match(/!\S*|\s@"[^"]*"|\s"[^"]*"|\s[^\s]*/gu))
                .map((arg) => arg.replace(/^\s*(@)?"?|"?"?\s*$/gu, "$1")));
            return msgData;
        };
        const Alert = (content, title, headerLevel = 1, classes = [], options = {noarchive: true}) => {
            // Simple alert to the GM. Style depends on presence of content, title, or both.
            if (content !== false && (content || title)) {
                if (title) {
                    if (content === null) {
                        sendChat(
                            randStr(),
                            `/w gm ${EunoCORE.H.Box(EunoCORE.H.Block(EunoCORE.H[`H${headerLevel}`](title, classes)), classes)}`,
                            null,
                            options
                        );
                    } else {
                        sendChat(
                            randStr(),
                            `/w gm ${EunoCORE.H.Box(EunoCORE.H.Block([
                                EunoCORE.H[`H${headerLevel}`](title, classes),
                                EunoCORE.H.Block(content)
                            ]))}`,
                            null,
                            options
                        );
                    }
                } else {
                    sendChat(randStr(), `/w gm ${content}`.replace(/@@tilde@@/gu, "~"), null, options);
                }
            }
        };
        const Direct = (content, target = "all", options) => {
            if (LCase(target) === "all") {
                sendChat(
                    randStr(),
                    `/direct ${content}`.replace(/@@tilde@@/gu, "~"),
                    null,
                    options
                );
            } else {
                Alert(content, null, undefined, undefined, options);
            }
        };
        const Show = (obj, title = "Showing ...") => {
            // Show properties of stringified object to GM.
            Alert(EunoCORE.H.Box(EunoCORE.H.Block([
                EunoCORE.H.H1(title, ["tight"]),
                EunoCORE.H.Block(JC(obj))])));
        };
        const Flag = (msg, headerLevel = 1, classes = []) => Alert(null, msg, headerLevel, ["flag", ...classes]); // Simple one-line chat flag sent to the GM.
        // #endregion ░░░░[Chat]░░░░
        // #region ░░░░░░░[Arrays & Objects] Array & Object Processing ░░░░░░░ ~
        // Arrayify: Ensures value returns as an array containing only truthy objects.
        //     Useful when iterating over a map to functions that return falsy values on failure
        const Arrayify = (x) => [x].flat().filter((xx) => xx === "" || xx === 0 || Boolean(xx));
        const KVPMap = (obj, keyFunc, valFunc) => {
            /**
             * An object-equivalent Array.map() function, which accepts mapping functions to transform both keys and values.
             * If only one function is provided, it's assumed to be mapping the values and will receive (v, k) args.
             * @param {object} obj
             * @param {function} keyFunc
             * @param {function} [valFunc]
             * @return {object}
             */
            [valFunc, keyFunc] = [valFunc, keyFunc].filter((x) => ["function", "boolean"].includes(typeof x));
            keyFunc = keyFunc || ((k) => k);
            valFunc = valFunc || ((v) => v);
            return Object.fromEntries(Object.entries(obj).map(([key, val]) => [keyFunc(key, val), valFunc(val, key)]));
        };
        const KVPFilter = (obj, keyTestFunc, valTestFunc) => {
            [valTestFunc, keyTestFunc] = [valTestFunc, keyTestFunc].filter((x) => ["function", "boolean"].includes(typeof x));
            keyTestFunc = keyTestFunc || (() => true);
            valTestFunc = valTestFunc || (() => true);
            return Object.fromEntries(Object.entries(obj).filter(([key, val]) => keyTestFunc(key) && valTestFunc(val)));
        };
        const KVPForEach = (obj, func) => Object.entries(obj).forEach(([key, val]) => func(val, key));
        const parseSearchFunc = (qObj, searchFunc) => {
            const [objType, funcType] = [qObj, searchFunc].map(GetType);
            if (["list", "array"].includes(objType)) {
                if (funcType === "function") { return searchFunc }
                if (objType === "list" && searchFunc in qObj) { return ([key]) => key === searchFunc }
                if (funcType === "regexp") {
                    if (objType === "list") { return ([, val]) => searchFunc.test(val) }
                    return (val) => searchFunc.test(val);
                }
                if (funcType === "int") {
                    if (objType === "list") { return ([, val]) => val === Object.values(qObj)[Int(searchFunc)] }
                    return (elem, i) => i = Int(searchFunc);
                }
                if (["first", "last", "random"].includes(searchFunc)) {
                    return parseSearchFunc(qObj, {
                        first: 0,
                        last: Object.values(qObj).length - 1,
                        random: Math.floor(Math.random() * Object.values(qObj).length)
                    }[searchFunc]);
                }
                searchFunc = JSON.stringify(searchFunc);
                if (objType === "list") { return ([, val]) => JSON.stringify(val) === searchFunc }
                return (val) => JSON.stringify(val) === searchFunc;
            }
            return searchFunc;
        };
        const Remove = (qObj, searchFunc) => {
            if (GetType(qObj) === "list") {
                const remKey = Object.entries(qObj).find(parseSearchFunc(qObj, searchFunc));
                if (remKey) {
                    const {[remKey]: remVal} = qObj;
                    delete qObj[remKey];
                    return remVal;
                }
            } else if (GetType(qObj) === "array") {
                const index = qObj.findIndex(parseSearchFunc(qObj, searchFunc));
                if (index >= 0) {
                    let remVal;
                    for (let i = 0; i <= qObj.length; i++) {
                        if (i === index) {
                            remVal = qObj.shift();
                        } else {
                            qObj.push(qObj.shift());
                        }
                    }
                    return remVal;
                }
            }
            return false;
        };
        const Replace = (qObj, searchFunc, repVal) => {
            const qType = GetType(qObj);
            let repKey;
            if (qType === "list") {
                repKey = (Object.entries(qObj).find(parseSearchFunc(qObj, searchFunc)) || [false])[0];
                if (repKey === false) { return false }
            } else if (qType === "array") {
                repKey = qObj.findIndex(parseSearchFunc(qObj, searchFunc));
                if (repKey === -1) { return false }
            }
            if (GetType(repVal) === "function") {
                qObj[repKey] = repVal(qObj[repKey], repKey);
            } else {
                qObj[repKey] = repVal;
            }
            return true;
        };
        // #endregion ░░░░[Arrays & Objects]░░░░

        // #region ▒░▒░▒░▒[EXPORTS] U (UTILITIES) ▒░▒░▒░▒ ~
        return {
            // [FRONT: Initialization]
            Initialize,

            // [Validation]
            GetType,

            // [Conversion]
            HexToDec, DecToHex,

            // [Numbers: Parsing]
            Float, Int,
            // [Numbers: Constraining]
            RoundNum, BindNum, CycleNum,

            // [Strings: Case Conversion]
            UCase, LCase,
            SCase, TCase,
            // [Strings: Type Conversion]
            ParseString, ParseParams,
            JS, JC,
            // [Strings: Formatting]
            Pluralize,
            // [Strings: Numbers to Strings]
            NumToWords, NumToOrdinal, NumToRoman, NumToSignedNum, NumToPaddedNum,
            // [Strings: RegExp]
            Extract,

            // [Math]
            Scale, ScaleColor,
            Interpolate,

            // [Chat]
            CheckMessage, ParseMessage,
            Alert, Direct, Show, Flag,

            // [Arrays & Objects]
            Arrayify,
            KVPMap, KVPFilter, KVPForEach,
            Remove, Replace
        };
        // #endregion ▒▒▒▒[EXPORTS: U]▒▒▒▒
    })();
    // #endregion ▄▄▄▄▄ U ▄▄▄▄▄

    // #region ████████ L (LISTENER): Master Event Listener ████████
    const LISTENER = (() => {
        // #region ▒░▒░▒░▒[FRONT] Boilerplate Namespacing & Initialization ▒░▒░▒░▒ ~
        //     #region ========== Namespacing: Basic State References & Namespacing =========== ~
        const SCRIPTNAME = "LISTENER";
        const STA = {get TE() {return EunoCORE.GetLocalSTATE(SCRIPTNAME)}};
        //     #endregion _______ Namespacing _______
        //     #region ========== Initialization: Script Startup & Event Listeners =========== ~
        const DEFAULTSTATE = {
            Listeners: {}
        };
        const Preinitialize = () => {
            STA.TE.Listeners = {};

            // Report initialization complete to EunoCORE loader
            EunoCORE.ConfirmReady(SCRIPTNAME);
        };
        const Initialize = () => {
            // Alert readiness confirmation
            U.Flag(`EunoLIB.${SCRIPTNAME} Ready`, 2, ["silver"]);
            log(`[Euno] ${SCRIPTNAME} Initialized`);

            // Report initialization complete to EunoCORE loader
            EunoCORE.ConfirmReady(SCRIPTNAME);
        };
        const Postinitialize = () => {
            U.Show(STA.TE);

            EunoCORE.ConfirmReady(SCRIPTNAME);
        };
        //     #endregion _______ Initialization _______
        // #endregion ▒▒▒▒[FRONT]▒▒▒▒

        // #region ░░░░░░░[REGISTRATION]░░░░ Registration of Script Listeners ░░░░░░░ ~
        const RegisterListener = (scriptName, triggerEvent, handlerFuncName, {gmOnly = true, returnObjs = false, chatCall = null} = {}) => {
            let [trigger, triggerProperty] = U.Extract(triggerEvent, /^(.+?:[^:]+):?(.+)?$/);
            triggerProperty = triggerProperty || "any";
            if (!(trigger in STA.TE.Listeners)) {
                on(trigger, (...args) => handleEvent(trigger, ...args));
            }
            if (/^chat:/.test(trigger)) {
                STA.TE.Listeners[trigger] = STA.TE.Listeners[trigger] || {};
                STA.TE.Listeners[trigger][chatCall] = {
                    scriptName,
                    gmOnly: Boolean(gmOnly),
                    returnObjs,
                    handler: handlerFuncName
                };
            } else if (/^change:/.test(trigger)) {
                STA.TE.Listeners[trigger] = STA.TE.Listeners[trigger] || {};
                STA.TE.Listeners[trigger][triggerProperty] = STA.TE.Listeners[trigger][triggerProperty] || [];
                STA.TE.Listeners[trigger][triggerProperty].push({scriptName, handler: handlerFuncName});
            } else {
                STA.TE.Listeners[trigger] = STA.TE.Listeners[trigger] || [];
                STA.TE.Listeners[trigger].push({scriptName, handler: handlerFuncName});
            }
        };
        // let throttleTimer, isThrottling = false;
        const handleEvent = (trigger, ...returnVals) => {
            const [eventType, eventSubject] = trigger.split(/:/);
            /* if (!isThrottling) {
                U.Show({trigger, returnVals, eventType, eventSubject});
                isThrottling = true;
                setTimeout(() => isThrottling = false, 1500);
            } */
            switch (eventType) {
                case "chat": {
                    const [msg] = returnVals;
                    if (U.CheckMessage(msg, null)) {
                        const call = U.Extract(msg.content, /^[^ ]+/);
                        if (call in STA.TE.Listeners[trigger]) {
                            const {scriptName, gmOnly, returnObjs, handler} = STA.TE.Listeners[trigger][call];
                            const {isGM, ...msgData} = U.ParseMessage(msg, returnObjs);
                            if (!gmOnly || isGM) {
                                const script = EunoCORE.getScript(scriptName);
                                if (script) {
                                    script[handler](msgData);
                                } else {
                                    throw `Error finding script '${scriptName}'`;
                                }
                            }
                        }
                    }
                    break;
                }
                case "change": {
                    const [obj, prev] = returnVals;
                    const deltas = ["any"];
                    for (const [prop, val] of Object.entries(prev)) {
                        if (obj.get(prop) !== prev[prop]) {
                            deltas.push(prop);
                        }
                    }
                    const filteredScriptData = Object.entries(STA.TE.Listeners[trigger]).filter(([key]) => deltas.includes(key)).map(([, data]) => data).flat();
                    filteredScriptData.forEach((data) => {
                        const {scriptName, handler} = data;
                        const script = EunoCORE.getScript(scriptName);
                        if (script) {
                            script[handler](obj, prev);
                        }
                    });
                    break;
                }
                case "add": case "destroy": {
                    const [obj] = returnVals;
                    STA.TE.Listeners[trigger].forEach((data) => {
                        const {scriptName, handler} = data;
                        const script = EunoCORE.getScript(scriptName);
                        if (script) {
                            script[handler](obj);
                        }
                    });
                    break;
                }
                // no default
            }
        };
        // #endregion ░░░░[REGISTRATION]░░░░

        // #region ▒░▒░▒░▒[EXPORTS] L (LISTENER) ▒░▒░▒░▒ ~
        return {
            DEFAULTSTATE, Preinitialize, Initialize, Postinitialize,
            RegisterListener
        };
        // #endregion ▒▒▒▒[EXPORTS: L]▒▒▒▒
    })();
    // #endregion ▄▄▄▄▄ L ▄▄▄▄▄

    // #region ████████ O (OBJECTS): Roll20 Object Manipulation ████████
    const OBJECTS = (() => {
        // #region ▒░▒░▒░▒[FRONT] Boilerplate Namespacing & Initialization ▒░▒░▒░▒ ~
        //     #region ========== Namespacing: Basic State References & Namespacing =========== ~
        const SCRIPTNAME = "OBJECTS";
        const STA = {
            get TE() {
                return EunoCORE.GetLocalSTATE(SCRIPTNAME);
            }
        };
        //     #endregion _______ Namespacing _______
        //     #region ========== Initialization: Script Startup & Event Listeners =========== ~
        const Initialize = () => {
            // Alert readiness confirmation
            U.Flag(`EunoLIB.${SCRIPTNAME} Ready`, 2, ["silver"]);
            log(`[Euno] ${SCRIPTNAME} Initialized`);

            // Report initialization complete to EunoCORE loader
            EunoCORE.ConfirmReady(SCRIPTNAME);
        };
        //     #endregion _______ Initialization _______
        // #endregion ▒▒▒▒[FRONT]▒▒▒▒

        // #region ░░░░░░░[Getters] Retrieving Sandbox Objects ░░░░░░░ ~
        const GetR20Type = (val) => {
            if (val && typeof val === "object" && "id" in val && "get" in val) {
                const type = val.get("_type");
                if (type === "graphic") {
                    if (val.get("represents")) {
                        return "token";
                    }
                    if (val.get("_subtype") === "card") {
                        return "playedcard";
                    }
                    if (/\.webm/u.test(val.get("imgsrc"))) {
                        return "animation";
                    }
                    return "graphic";
                }
                return type;
            }
            return false;
        };
        /* NOTE: All object and data getters can accept either a single reference OR an array of references.
                If an array is supplied, an array will be returned (empty if no matches)
                Otherwise, a single return value will be given, or false if nothing found */
        const GetObj = (qObj, type, registry = {}, isReturningArray = false) => {
            // U.Show({qObj, type, isReturningArray});
            const qObjs = U.Arrayify(qObj);
            const objs = [];
            if (U.GetType(qObj) === "array") {
                isReturningArray = true;
                objs.push(...U.Arrayify(qObjs.map((qO) => GetObj(qO, type, registry, true)).flat()));
            } else {
                switch (type) {
                    case "playedcard":
                    case "token":
                    case "animation": {
                        objs.push(...U.Arrayify(GetObj(qObjs, "graphic", registry, true)).filter((obj) => GetR20Type(obj) === type));
                        break;
                    }
                    case "pc":
                    case "npc": {
                        objs.push(...U.Arrayify(GetChar(qObjs, type, registry, true)));
                        break;
                    }
                    case "character": {
                        if (qObjs.every((qO) => GetR20Type(qO) === "id")) {
                            objs.push(...qObjs.map((id) => getObj("character", id)));
                        } else {
                            objs.push(...qObjs.map((qO) => GetChar(qO, type, registry, true)));
                        }
                        break;
                    }
                    case "path":
                    case "text":
                    case "graphic":
                    case "page":
                    case "campaign":
                    case "player":
                    case "macro":
                    case "rollabletable":
                    case "tableitem":
                    case "attribute":
                    case "ability":
                    case "handout":
                    case "deck":
                    case "card":
                    case "hand":
                    case "jukeboxtrack":
                    case "custfx": {
                        objs.push(...U.Arrayify(qObjs
                            .map((qObjElem) => {
                                switch (qObjElem) {
                                    case "all":
                                        return findObjs({_type: type});
                                    case "registered":
                                        return U.Arrayify(GetObj("all", type, registry, true)).filter((obj) => obj.id in registry);
                                    case "unregistered":
                                        return U.Arrayify(GetObj("all", type, registry, true)).filter((obj) => !(obj.id in registry));
                                    default: {
                                        switch (U.GetType(qObjElem)) {
                                            case "id":
                                                return getObj(type, qObjElem) || false;
                                            case "array":
                                                return U.Arrayify(qObjElem).map((qObjSubElem) =>
                                                    GetObj(qObjSubElem, type, registry, true));
                                            default:
                                                return GetR20Type(qObjElem) === type
                                                    ? qObjElem
                                                    : false;
                                        }
                                    }
                                }
                            })
                            .flat()));
                        break;
                    }
          // no default
                }
            }
            if (isReturningArray) {
                // U.Show(objs, "Returning ARRAY");
                return U.Arrayify(objs).flat(3);
            }
            // U.Show({obj: objs.length > 0 ? objs.shift() : false}, "Returning OBJ");
            return objs.length > 0 ? objs.shift() : false;
        };
        const GetChar = (qChar, registry = {}, isReturningArray = false) => {
            const qChars = U.Arrayify(qChar);
            const charObjs = [];
            if (U.GetType(qChar) === "array") {
                isReturningArray = true;
                charObjs.push(...U.Arrayify(qChars.map((qC) => GetChar(qC, registry))));
            } else {
                const charIDs = []; // ... get ids for char objs
                charObjs.push(...GetObj(charIDs, "character", registry));
            }
            if (isReturningArray) {
                return U.Arrayify(charObjs).flat(3);
            }
            return charObjs.length > 0 ? charObjs.shift() : false;
        };
        const GetSelObj = (msg, type, isReturningArray = false) => {
            if (U.GetType(msg) === "array") {
                return GetSelObj(msg.shift(), type, true);
            }
            const objs = [];
            if (U.GetType(msg) === "list" && msg.selected && msg.selected.length) {
                switch (type) {
                    case "all":
                    case "any":
                        objs.push(...msg.selected.map((objData) =>
                            getObj(objData._type, objData._id)));
                        break;
                    case "token":
                    case "card":
                    case "animation":
                        objs.push(...GetSelObj(msg, "graphic", true).filter((graphicObj) => graphicObj.get("_subtype") === type));
                        break;
                    case "pc":
                    case "npc":
                    case "character":
                        objs.push(...GetSelObj(msg, "token", true).map((tokenObj) =>
                            GetChar(tokenObj)));
                        break;
                    case "player":
                        /* GetPlayer function; */ break;
                    default:
                        objs.push(...msg.selected
                            .filter((objData) => objData._type === type)
                            .map((objData) => getObj(type, objData._id)));
                        break;
                }
                if (isReturningArray) {
                    return U.Arrayify(objs).flat(3);
                }
                return objs.length > 0 ? objs.shift() : false;
            }
            return isReturningArray ? [] : false;
        };
        // #endregion ░░░░[Getters]░░░░

        // #region ▒░▒░▒░▒[EXPORTS] O (OBJECTS) ▒░▒░▒░▒ ~
        return {
            Initialize,

            GetR20Type,
            GetObj,
            GetChar,
            GetSelObj
        };
        // #endregion ▒▒▒▒[EXPORTS: O]▒▒▒▒
    })();
    // #endregion ▄▄▄▄▄ O ▄▄▄▄▄

    // #region ████████ H (HTML): HTML/CSS Parsing & Styling for Chat & Handouts ████████
    const HTML = (() => {
        // #region ▒░▒░▒░▒[FRONT] Boilerplate Namespacing & Initialization ▒░▒░▒░▒ ~
        //     #region ========== Namespacing: Basic State References & Namespacing =========== ~
        const SCRIPTNAME = "HTML";
        const STA = {
            get TE() {
                return EunoCORE.GetLocalSTATE(SCRIPTNAME);
            }
        };
        //     #endregion _______ Namespacing _______
        //     #region ========== Initialization: Script Startup & Event Listeners =========== ~
        const Initialize = () => {
            // Alert readiness confirmation
            U.Flag(`EunoLIB.${SCRIPTNAME} Ready`, 2, ["silver"]);
            log(`[Euno] ${SCRIPTNAME} Initialized`);

            // Report initialization complete to EunoCORE loader
            EunoCORE.ConfirmReady(SCRIPTNAME);
        };
        //     #endregion _______ Initialization _______
        // #endregion ▒▒▒▒[FRONT]▒▒▒▒

        // #region ░░░░░░░[Styles] CSS Class Style Definitions ░░░░░░░ ~
        const [chatWidth, chatHeight, chatBottomPadding, chatLeftShift] = [283, 33, 7, -45];
        const cssVars = {
            chatWidth, chatHeight, chatBottomPadding,
            blockSpacing: 10,
            shifts: {
                boxAll: [-1 * (chatHeight - chatBottomPadding), 0, -1 * chatBottomPadding, chatLeftShift],
                titleMainBottom: 0,
                titleScriptsBottom: -62,
                subtitleBottom: -100,
                footerTop: -100,
                commandHighlightShiftLeft: -20,
                h1Bottom: C.GetImgSize("h1GoldTight")[1] - C.GetImgSize("h1Gold")[1],
                h2Bottom: C.GetImgSize("h2GoldTight")[1] - C.GetImgSize("h2Gold")[1]
            },
            padding: {
                box: 10,
                subtitleTop: 17,
                commandHighlightAll: [1, 8, 0, 6],
                commandHighlightShiftRight: 17
            },
            indents: {
                flag: 30,
                h2: 10,
                h3: 4,
                commandHighlightShift: 14
            },
            font: {
                bodySansSerif: {
                    color: C.COLORS.palegold,
                    family: "Montserrat",
                    size: 10,
                    weight: "normal",
                    get lineHeight() {
                        return parseInt(1.5 * this.size);
                    }
                },
                h1: {
                    color: C.COLORS.black,
                    family: "Anton",
                    size: 20,
                    weight: "normal",
                    lineHeight: 28
                },
                h2: {
                    color: C.COLORS.black,
                    family: "Montserrat",
                    size: 16,
                    weight: "bold",
                    lineHeight: 23
                },
                h3: {
                    color: C.COLORS.palegold,
                    family: "Montserrat",
                    size: 12,
                    weight: "bold",
                    lineHeight: 20
                }
            },
            get halfSpace() {
                return EunoCORE.U.RoundNum(this.blockSpacing / 2, 2);
            },
            get qartSpace() {
                return EunoCORE.U.RoundNum(this.blockSpacing / 4, 2);
            }
        };
        const CSS = {};
        [
            //     #region ========== Base Styles: Default Styles for Base Element Tags =========== ~
            `   div, span, a, p, pre, h1, h2, h3, img {
                    display: block;
                    height: auto; width: auto;
                    margin: 0; padding: 0;
                    vertical-align: baseline;
                    background-size: cover;
                    background-repeat: no-repeat;
                    border: none; outline: none; box-shadow: none; text-shadow: none;

                    color: inherit;
                    line-height: inherit;
                    font-family: inherit;
                    font-size: inherit;
                    font-weight: inherit;
                    text-align: inherit;
                }

                div {
                    position: relative;
                    z-index: 1;
                }

                p, h1, h2, h3, img {
                    margin: ${cssVars.blockSpacing}px 0;
                }

                .box {
                    min-height: ${cssVars.chatHeight}px;
                    width: ${cssVars.chatWidth}px;
                    margin: ${cssVars.shifts.boxAll.map((shift) => `${shift}px`).join(" ")};  
                    color: ${cssVars.font.bodySansSerif.color};
                    line-height: ${cssVars.font.bodySansSerif.lineHeight}px;
                    font-family: ${cssVars.font.bodySansSerif.family}, sans-serif;
                    font-size: ${cssVars.font.bodySansSerif.size}px;
                    font-weight: ${cssVars.font.bodySansSerif.weight};
                    text-align: center;
                    background-image: url('${C.GetImgURL("bgChatGold")}');
                    background-size: auto;
                    background-repeat: repeat;
                    box-shadow: inset 0 0 5px ${C.COLORS.black}, inset 0 0 5px ${C.COLORS.black}, inset 0 0 5px ${C.COLORS.black};
                }
                .block {
                    text-align: left;
                }

                span, a {
                    display: inline-block;
                    text-decoration: none;
                    background-color: transparent;
                }
                p {
                    padding: 0 ${cssVars.padding.box}px;
                }
                h1 {
                    height: ${C.GetImgSize("h1Gold")[1]}px;
                    width: ${C.GetImgSize("h1Gold")[0]}px;
                    background-image: url('${C.GetImgURL("h1Gold")}');
                    margin: ${cssVars.blockSpacing}px 0 ${cssVars.shifts.h1Bottom}px 0;
                    color: ${cssVars.font.h1.color};
                    font-family: ${cssVars.font.h1.family}, sans-serif;
                    font-size: ${cssVars.font.h1.size}px;
                    font-weight: ${cssVars.font.h1.weight};
                    line-height: ${cssVars.font.h1.lineHeight}px;
                    text-align: center;
                }
                h2 {
                    height: ${C.GetImgSize("h2Gold")[1]}px;
                    width: ${C.GetImgSize("h2Gold")[0]}px;
                    background-image: url('${C.GetImgURL("h2Gold")}');
                    margin: ${cssVars.blockSpacing}px 0 ${cssVars.shifts.h2Bottom}px 0;
                    color: ${cssVars.font.h2.color};
                    font-family: ${cssVars.font.h2.family}, sans-serif;
                    font-size: ${cssVars.font.h2.size}px;
                    font-weight: ${cssVars.font.h2.weight};
                    line-height: ${cssVars.font.h2.lineHeight}px;
                    text-indent: ${cssVars.indents.h2}px;
                }
                h3 {
                    width: 100%;
                    background-image: url('${C.GetImgURL("h3BGBlack")}');
                    color: ${cssVars.font.h3.color};
                    font-family: ${cssVars.font.h3.family}, sans-serif;
                    font-size: ${cssVars.font.h3.size}px;
                    font-weight: ${cssVars.font.h3.weight};
                    line-height: ${cssVars.font.h3.lineHeight}px;
                    text-indent: ${cssVars.indents.h3}px;
                    text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8), -1px -1px 2px rgb(0, 0, 0), -1px -1px 2px rgb(0, 0, 0), -1px -1px 2px rgb(0, 0, 0),
                }
                pre {
                    color: ${C.COLORS.black};
                    font-family: 'Fira Code', monospace;
                    font-size: 8px;
                    font-weight: bold;
                    background-color: ${C.COLORS.grey90};
                }
            `,
            //     #endregion _______ Base Styles _______
            //     #region ========== Class Styles: Styles Applied by CSS Class Reference =========== ~
            `   .box.silver {
                    color: ${C.COLORS.white};
                    background-image: url('${C.GetImgURL("bgChatSilver")}');
                }
                .box.bronze {
                    color: ${C.COLORS.palebronze};
                    background-image: url('${C.GetImgURL("bgChatBronze")}');
                }
                .box.flag {
                    background-image: none;
                    box-shadow: none;
                    min-height: unset;
                }
                .block.silver {color: ${C.COLORS.white};}
                .block.titleButtons {
                    position: relative;
                    width: 40px;
                    top: -200px;
                    left: 240px;
                }
                .title, .subtitle {
                    width: ${cssVars.chatWidth}px;
                    color: ${C.COLORS.black};
                    font-family: Anton, sans-serif;
                    line-height: 36px;
                    font-size: 24px;
                    background-image: url('${C.GetImgURL("titleMainButtons")}');
                }
                .title.main {
                    height: ${C.GetImgSize("titleMainButtons")[1]}px;
                    margin-bottom: ${cssVars.shifts.titleMainBottom}px;
                }
                .title.etc {
                    height: ${C.GetImgSize("titleETC")[1]}px;
                    background-image: url('${C.GetImgURL("titleETC")}');
                    margin-bottom: ${cssVars.shifts.titleScriptsBottom}px;
                }
                .subtitle {
                    height: ${C.GetImgSize("subtitleBronzeETC")[1]}px;
                    background-image: url('${C.GetImgURL("subtitleBronzeETC")}');
                    background-size: auto;
                    margin-bottom: ${cssVars.shifts.subtitleBottom}px;
                    padding-top: ${cssVars.padding.subtitleTop}px;
                    line-height: 30px;
                }
                .subtitle.etc {
                    background-image: url('${C.GetImgURL("subtitleBronzeETC")}');
                }
                h1.flag, h2.flag, h3.flag {
                    margin: 0;
                    text-align: left;
                    text-indent: ${cssVars.indents.flag}px;
                    background-size: 100% 100%;
                }
                .tight {margin: 0}
                h1.flag {
                    height: ${C.GetImgSize("h1FlagGold")[1]}px;
                    line-height: ${C.GetImgSize("h1FlagGold")[1]}px;
                    background-image: url('${C.GetImgURL("h1FlagGold")}');
                }
                h1.tight {
                    height: ${C.GetImgSize("h1GoldTight")[1]}px;
                    line-height: ${C.GetImgSize("h1GoldTight")[1]}px;
                }
                h1.dim {background-image: url('${C.GetImgURL("h1GoldDim")}')}
                h1.dim.tight {background-image: url('${C.GetImgURL("h1GoldTightDim")}')}
                h1.silver {background-image: url('${C.GetImgURL("h1Silver")}')}
                h1.silver.dim {background-image: url('${C.GetImgURL("h1SilverDim")}')}
                h1.silver.dim.tight {background-image: url('${C.GetImgURL("h1SilverTightDim")}')}
                h1.bronze {background-image: url('${C.GetImgURL("h1Bronze")}')}
                h1.bronze.dim {background-image: url('${C.GetImgURL("h1BronzeDim")}')}
                h1.bronze.dim.tight {background-image: url('${C.GetImgURL("h1BronzeTightDim")}')}
                h1.flag.silver {background-image: url('${C.GetImgURL("h1FlagSilver")}')}
                h1.flag.bronze {background-image: url('${C.GetImgURL("h1FlagBronze")}')}
                h2.flag {
                    height: ${C.GetImgSize("h2FlagGold")[1]}px;
                    line-height: ${C.GetImgSize("h2FlagGold")[1]}px;
                    background-image: url('${C.GetImgURL("h2FlagGold")}');
                }
                h2.tight {
                    height: ${C.GetImgSize("h2GoldTight")[1]}px;
                    line-height: ${C.GetImgSize("h2GoldTight")[1]}px;
                }
                h2.dim {background-image: url('${C.GetImgURL("h2GoldDim")}')}
                h2.dim.tight {background-image: url('${C.GetImgURL("h2GoldTightDim")}')}
                h2.silver {background-image: url('${C.GetImgURL("h2Silver")}')}
                h2.silver.dim {background-image: url('${C.GetImgURL("h2SilverDim")}')}
                h2.silver.dim.tight {background-image: url('${C.GetImgURL("h2SilverTightDim")}')}
                h2.bronze {background-image: url('${C.GetImgURL("h2Bronze")}')}
                h2.bronze.dim {background-image: url('${C.GetImgURL("h2BronzeDim")}')}
                h2.bronze.dim.tight {background-image: url('${C.GetImgURL("h2BronzeTightDim")}')}
                h2.flag.silver {background-image: url('${C.GetImgURL("h2FlagSilver")}')}
                h2.flag.bronze {background-image: url('${C.GetImgURL("h2FlagBronze")}')}
                h3.flag {
                    height: ${C.GetImgSize("h2FlagGold")[1]}px;
                    line-height: ${C.GetImgSize("h2FlagGold")[1]}px;
                    background-image: url('${C.GetImgURL("h2FlagGold")}');
                    font-size: 12px;
                    line-height: 24px;
                    color: ${C.COLORS.black};
                    text-shadow: none;
                }
                h3.tight {
                    height: ${C.GetImgSize("h2GoldTight")[1]}px;
                    line-height: ${C.GetImgSize("h2GoldTight")[1]}px;
                }
                h3.dim {background-image: url('${C.GetImgURL("h2GoldDim")}')}
                h3.dim.tight {background-image: url('${C.GetImgURL("h2GoldTightDim")}')}
                h3.silver {background-image: url('${C.GetImgURL("h2Silver")}')}
                h3.silver.dim {background-image: url('${C.GetImgURL("h2SilverDim")}')}
                h3.silver.dim.tight {background-image: url('${C.GetImgURL("h2SilverTightDim")}')}
                h3.bronze {background-image: url('${C.GetImgURL("h2Bronze")}')}
                h3.bronze.dim {background-image: url('${C.GetImgURL("h2BronzeDim")}')}
                h3.bronze.dim.tight {background-image: url('${C.GetImgURL("h2BronzeTightDim")}')}
                h3.flag.silver {background-image: url('${C.GetImgURL("h2FlagSilver")}')}
                h3.flag.bronze {background-image: url('${C.GetImgURL("h2FlagBronze")}')}
                .commandHighlight {
                    padding: ${cssVars.padding.commandHighlightAll
            .map((pad) => `${pad}px`)
            .join(" ")};
                    color: ${C.COLORS.black};
                    font-family: monospace;
                    font-weight: bolder;
                    text-shadow: 0 0 1px ${C.COLORS.black};
                    background-image: url('${C.GetImgURL("commandGold")}');
                    background-size: 100% 100%;
                }
                .commandHighlight.silver {background-image: url('${C.GetImgURL("commandSilver")}')}
                .commandHighlight.bronze {background-image: url('${C.GetImgURL("commandBronze")}')}
                .commandHighlight.shiftLeft {
                    margin-left: ${cssVars.shifts.commandHighlightShiftLeft}px;
                    padding-right: ${
        cssVars.padding.commandHighlightShiftRight
        }px;
                    text-align: right;
                    text-indent: ${cssVars.indents.commandHighlightShift}px;
                    background-position: right;
                }
                .footer {
                    height: ${C.GetImgSize("footerGold")[1]}px;
                    margin-top: ${cssVars.shifts.footerTop}px;
                    background-image: url('${C.GetImgURL("footerGold")}');
                    z-index: 0;
                }
                .footer.hideIntro {background-image: url('${C.GetImgURL("footerHideIntroGold")}')}
                .footer.goBack {background-image: url('${C.GetImgURL("footerGoBackGold")}')}
                .footer.silver {background-image: url('${C.GetImgURL("footerSilver")}')}
                .footer.goBack.silver {background-image: url('${C.GetImgURL("footerGoBackSilver")}')}
                .footer.bronze {background-image: url('${C.GetImgURL("footerBronze")}')}
                .footer.goBack.bronze {background-image: url('${C.GetImgURL("footerGoBackBronze")}')}
                span.buttonLabel {
                    width: 40px;
                    text-align: right;
                }
                span.buttonDesc {
                    font-size: 20px;
                    vertical-align: middle;
                    padding-bottom: 2px;
                    text-indent: 5px;
                }
                a.button {
                    display: block;
                    height: 100%;
                    width: 100%;
                }
                span.buttonRound {
                    height: 50px;
                    width: 50px;
                    margin: 0 15px;
                }
                span.buttonRound.titleButtons {
                    height: 37px;
                    width: 40px;
                    margin: 0;
                }
                span.buttonRound.download {background-image: url('${C.GetImgURL("buttonDownload")}')}
                span.buttonRound.chat {background-image: url('${C.GetImgURL("buttonChat")}')}
                span.buttonRound.bug {background-image: url('${C.GetImgURL("buttonBug")}')}
                div.toggleButton {
                    height: ${C.GetImgSize("toggleButtonOnGold")[1]}px;
                    padding: 0px 3px;
                    background-size: 105% ${C.GetImgSize("toggleButtonOnGold")[1]}px;
                }
                div.toggleButton.toggleOn {background-image: url('${C.GetImgURL("toggleButtonOnGold")}')}
                div.toggleButton.toggleOff {background-image: url('${C.GetImgURL("toggleButtonOffGold")}')}
                div.toggleButton.toggleOn.silver {background-image: url('${C.GetImgURL("toggleButtonOnSilver")}')}
                div.toggleButton.toggleOff.silver {background-image: url('${C.GetImgURL("toggleButtonOffSilver")}')}
                div.toggleButton.toggleOn.bronze {background-image: url('${C.GetImgURL("toggleButtonOnBronze")}')}
                div.toggleButton.toggleOff.bronze {background-image: url('${C.GetImgURL("toggleButtonOffBronze")}')}
                span.toggleButtonTitle {
                    width: 185px;
                    font-family: Anton, sans-serif;
                    font-weight: normal;
                    font-size: 14px;
                    color: ${C.COLORS.black};
                    text-transform: uppercase;
                    vertical-align: top;
                    margin-top: 8px;
                }
                span.toggleButtonBody {
                    height: 40px;
                    width: 160px;
                    font-family: 'Montserrat', sans-serif;
                    font-size: ${cssVars.font.bodySansSerif.size}px;
                    color: ${C.COLORS.black};
                    line-height: 14px;
                    font-weight: bold;
                }
                span.toggleButtonRight {
                    height: 30px;
                    width: 100px;
                    margin-left: 10px;
                    vertical-align: top;
                }
                .alignLeft {text-align: left}

            `
            //     #endregion _______ Class Styles _______
        ]
            .join("")
            .replace(/\/\*.*?\*\//g, "") // strip CSS comments
            .replace(/[\n\s]+/g, " ") // remove excess white space
            .replace(/("|')[a-z]+:\/\/.+?\1/gu, (url) => url.replace(/:/gu, "^")) // escape colons in url entries
            .split(/\}/) // capture selector blocks
            .map((selBlock) =>
                selBlock.split(/\{/).map((selBlock) => (selBlock || "").trim())) // separate selector from block
            .filter(([sel, block]) => sel && block) // filter out null values
            .map(([sel, block]) =>
                sel
                    .split(/\s*,\s*/) // separate comma-delimited selectors ...
                    .map((ssel) => [
                        // ... and give each one its own copy of the associated properties
                        ssel.trim(),
                        Object.fromEntries(block
                            .split(/;/) // separate 'property: value' lines
                            .map((propVal) => (propVal || "").trim().split(/:/)) // separate 'property' and 'value' into key/val
                            .filter(([prop, val]) => prop && val) // filter out null values
                            .map(([prop, val]) => [
                                prop.trim(),
                                val.trim().replace(/\^/g, ":")
                            ])) // restore colons to urls
                    ]))
            .flat() // flatten duplicated selectors (from comma-delimiting) into main array of [key, val] entries for object creation
            .forEach(([sel, block]) => {
                CSS[sel] = Object.assign(CSS[sel] || {}, block);
            });
        // #endregion ░░░░[Styles]░░░░
        // #region ░░░░░░░[Parsing] Parsing Style Data to Inline CSS ░░░░░░░ ~
        //     #region ========== Parsing Functions: Functions for Parsing to Inline CSS =========== ~
        const getStyles = (tag, classes = []) => {
            classes = [classes].flat();
            const styleSteps = [{classes}];

            // Apply general tag styles
            const styleData = {...(CSS[tag] || {})};
            styleSteps.push({...styleData});

            // Locate styles for exact class references
            classes.forEach((classRef) =>
                Object.assign(styleData, CSS[`.${classRef}`] || {}));
            styleSteps.push({...styleData});

            // Overwrite with more-specific combination references
            Object.keys(CSS)
                .filter((classRef) =>
                    /^\..*\./.test(classRef)
            && classRef
                .split(/\./gu)
                .filter((className) => Boolean((className || "").trim()))
                .map((className) => className.replace(/^\./u, ""))
                .every((className) => classes.includes(className)))
                .forEach((classRef) => Object.assign(styleData, CSS[classRef]));
            styleSteps.push({...styleData});

            // Now, repeat for more-specific references that begin with the element's tag
            const tagClassRefs = Object.keys(CSS).filter((classRef) =>
                classRef.startsWith(`${tag.toLowerCase()}.`));
            tagClassRefs
                .filter((classRef) =>
                    classes.includes(classRef.replace(new RegExp(`^${tag.toLowerCase()}\.`), "")))
                .forEach((classRef) => Object.assign(styleData, CSS[classRef]));
            styleSteps.push({...styleData});

            // Finally, repeat for more-specific combo references that begin with the element's tag
            tagClassRefs
                .filter((classRef) =>
                    classRef
                        .replace(new RegExp(`^${tag.toLowerCase()}\.`), "")
                        .split(/\./gu)
                        .every((className) => classes.includes(className)))
                .forEach((classRef) => Object.assign(styleData, CSS[classRef]));
            styleSteps.push({...styleData});
            if (
                classes.includes("block")
        && styleData.height === "37px"
        && /chatBGGold\.jpg/.test(styleData["background-image"] || "")
            ) {
                U.Direct(H.Box(H.Pre(U.JS(styleSteps))));
            }

            return Object.fromEntries(Object.entries(styleData).filter(([propName, propVal]) => propVal !== null));
        };
        const parseStyleLine = (tag, classes = [], styles = {}) =>
            Object.entries({...getStyles(tag, classes), ...styles})
                .map(([propName, propVal]) => `${propName}: ${propVal};`)
                .join(" ");
        const hasInlineStyles = (tag, classes = [], styles = {}) =>
            tag in CSS
      || Object.values(styles).length
      || Object.values(getStyles(tag, classes)).length;
        const Tag = (content, tag, classes = [], styles = {}, attributes = {}) => {
            if (hasInlineStyles(tag, classes, styles)) {
                Object.assign(attributes, {
                    style: parseStyleLine(tag, classes, styles)
                });
            }
            const tagHTML = [
                `<${tag.toLowerCase()} `,
                Object.entries(attributes)
                    .map(([attrName, attrVal]) => `${attrName}="${attrVal}"`)
                    .join(" "),
                ">"
            ];
            if (content !== false) {
                content = [content].flat().filter((part) => part);
                if (content.length === 0) {
                    content.push("&nbsp;");
                }
                tagHTML.push(...content);
                tagHTML.push(`</${tag.toLowerCase()}>`);
            }
            return tagHTML
                .join("")
                .replace(/\\~/gu, "@@tilde@@") // Protect escaped tildes
                .replace(/~/gu, "&shy;"); // Turn unescaped tildes into soft hyphen breaks
        };
        /* const getStyles = (tag, classes = []) => {
            classes = U.Arrayify(classes);

            // To provide some approximation of CSS specificity, begin with general styles and overwrite
            // them with styles from more specific selectors

            // Initialize with default tag styles
            const styleData = {...CSS[tag]};

            // Overwrite with styles that exactly match one of the element's classes
            classes.forEach((classRef) => Object.assign(styleData, CSS[`.${classRef}`] || {}));

            // Overwrite with styles that exactly match multiple required classes
            Object.keys(CSS)
                .filter((classRef) => /^\..*\./.test(classRef)
                                       && classRef.split(/\./gu)
                                           .every((className) => className && classes.includes(`${className}`.trim().replace(/^\./u, ""))))
                .forEach((classRef) => Object.assign(styleData, CSS[classRef]));

            const tagClassRefs = Object.keys(CSS).filter((classRef) => classRef.startsWith(`${tag.toLowerCase()}.`));

            // Overwrite with styles that specify a tag AND exactly match one of the element's classes
            tagClassRefs.filter((classRef) => classes.includes(classRef.replace(new RegExp(`^${tag.toLowerCase()}\.`), "")))
                .forEach((classRef) => Object.assign(styleData, CSS[classRef]));

            // Overwrite with styles that specify a tag AND exactly match multiple required classes
            tagClassRefs.filter((classRef) => classRef.split(/\./gu).slice(1).every((className) => classes.includes(className)))
                .forEach((classRef) => Object.assign(styleData, CSS[classRef]));

            return Object.fromEntries(Object.entries(styleData).filter(([propName, propVal]) => propVal !== null));
        };
        const parseStyleLine = (tag, classes = [], styles = {}) => Object.entries({...getStyles(tag, classes), ...styles})
            .map(([propName, propVal]) => `${propName}: ${propVal};`).join(" ");
        const hasInlineStyles = (tag, classes = [], styles = {}) => tag in CSS
                                                                     || Object.values(styles).length
                                                                     || Object.values(getStyles(tag, classes)).length;
        const Tag = (content, tag, classes = [], styles = {}, attributes = {}) => {
            if (hasInlineStyles(tag, classes, styles)) {
                Object.assign(attributes, {style: parseStyleLine(tag, classes, styles)});
            }
            const tagHTML = [
                `<${tag.toLowerCase()} `,
                Object.entries(attributes)
                    .map(([attrName, attrVal]) => `${attrName}="${attrVal}"`)
                    .join(" "),
                ">"
            ];
            if (content !== false) {
                content = U.Arrayify(content);
                if (content.length === 0) {
                    content.push("&nbsp;");
                }
                tagHTML.push(...content);
                tagHTML.push(`</${tag.toLowerCase()}>`);
            }
            return tagHTML
                .join("")
                .replace(/\\~/gu, "@@tilde@@") // Protect escaped tildes
                .replace(/~/gu, "&shy;") // Turn unescaped tildes into soft hyphen breaks
                .replace(/@@tilde@@/g, "~"); // Restore escaped tildes
        }; */
        //     #endregion _______ Parsing Functions _______
        //     #region ========== Elements: Basic Element Constructors by Tag =========== ~
        const baseElements = {
            Div: (content, classes = [], styles = {}, attributes = {}) => Tag(content, "div", classes, styles, attributes),
            Span: (content, classes = [], styles = {}, attributes = {}) => Tag(content, "span", classes, styles, attributes),
            P: (content, classes = [], styles = {}, attributes = {}) => Tag(content, "p", classes, styles, attributes),
            Img: (content, classes = [], styles = {}, attributes = {}) => Tag(false, "img", classes, styles, attributes),
            A: (content, classes = [], styles = {}, attributes = {}) => Tag(content, "a", classes, styles, attributes),
            Pre: (content, classes = [], styles = {}, attributes = {}) => Tag(content, "pre", classes, styles, attributes),
            H1: (content, classes = [], styles = {}, attributes = {}) => Tag(content, "h1", classes, styles, attributes),
            H2: (content, classes = [], styles = {}, attributes = {}) => Tag(content, "h2", classes, styles, attributes),
            H3: (content, classes = [], styles = {}, attributes = {}) => Tag(content, "h3", classes, styles, attributes),
            OL: (content, classes = [], styles = {}, attributes = {}) => Tag(U.Arrayify(content)
                .map((item) => Tag(item, "li")), "ol", classes, styles, attributes )
        };
        //     #endregion _______ Elements _______
        // #endregion ░░░░[Parsing]░░░░
        // #region ░░░░░░░[Custom Elements] Shorthand Element Constructors for Common Use Cases ░░░░░░░ ~
        const customElements = {
            Box: (content, classes = [], styles = {}) => H.Div(content, ["box", ...classes], styles),
            Block: (content, classes = [], styles = {}) => H.Div(content, ["block", ...classes], styles),
            Subtitle: (content, classes = [], styles = {}) => H.Div(content, ["subtitle", ...classes], styles),
            ButtonRound: (command, classes = [], styles = {}, attributes = {}) => H.Span(
                H.A("&nbsp;", ["button"], {}, {href: command}),
                ["buttonRound", ...classes],
                styles,
                attributes
            ),
            Paras: (content) => U.Arrayify(content).map((para) => H.P(para)).join(""),
            Spacer: (height) => H.Div("&nbsp;", ["spacer"], {height: `${height}px`.replace(/pxpx$/u, "px")}),
            Footer: (content, classes = [], styles = {}, attributes = {}) => H.Div(content || "&nbsp;", ["footer", ...classes], styles, attributes),
            InlineHeader: (
                [headerText, bodyText],
                classes = [],
                styles = {},
                attributes = {}
            ) =>
                H.Span(`${H.Command(
                    headerText,
                    ["shiftLeft", ...classes],
                    styles,
                    attributes
                )} — ${bodyText}`),
            ButtonH1: (
                command,
                content,
                classes = [],
                styles = {},
                attributes = {}
            ) =>
                H.H1(
                    H.A(content, ["button"], {}, {href: command}),
                    ["button", ...classes],
                    styles,
                    attributes
                ),
            ButtonH2: (
                command,
                content,
                classes = [],
                styles = {},
                attributes = {}
            ) =>
                H.H2(
                    H.A(content, ["button"], {}, {href: command}),
                    ["button", ...classes],
                    styles,
                    attributes
                ),
            ButtonH3: (
                command,
                content,
                classes = [],
                styles = {},
                attributes = {}
            ) =>
                H.H3(
                    H.A(content, ["button"], {}, {href: command}),
                    ["button", ...classes],
                    styles,
                    attributes
                ),
            ButtonFooter: (
                command,
                content,
                classes = [],
                styles = {},
                attributes = {}
            ) =>
                H.Footer(
                    H.A(content || "&nbsp;", ["button"], {}, {href: command}),
                    classes,
                    styles,
                    attributes
                ),
            Command: (command, classes = [], styles = {}, attributes = {}) =>
                H.Span(command, ["commandHighlight", ...classes], styles, attributes),
            ButtonCommand: (
                [command, bodyText],
                classes = [],
                styles = {},
                attributes = {}
            ) =>
                [
                    H.Command(
                        H.A(command, ["button"], {}, {href: command}),
                        ["shiftLeft", ...classes],
                        styles,
                        attributes
                    ),
                    "<br> ↪ ",
                    bodyText
                ].join(""),
            ButtonToggle: (
                [title, body],
                command,
                classes = [],
                styles = {},
                attributes = {}
            ) =>
                H.Div(
                    [
                        H.Span(title, ["toggleButtonTitle"]),
                        H.Span(body, ["toggleButtonBody"]),
                        H.Span(
                            H.A(null, ["button"], {}, {href: command}),
                            ["toggleButtonRight"],
                            {},
                            attributes
                        )
                    ],
                    ["toggleButton", ...classes],
                    styles
                )
        };
        // #endregion ░░░░[Custom Elements]░░░░
        // #region ░░░░░░░[Chat Messages] Main Intro/Help Message for EunoScripts ░░░░░░░ ~
        /* ████████ HYPHENATION & TILDE ('~') USE █████████████████████████████████████████████████████████████████████████████████████████████
           █
           █ Text displayed in the narrow Roll20 Chat panel is ideal for liberal use of hyphenation to divide words. Unfortunately, browsers
           █ are not able to hyphenate words automatically: You must manually indicate where hyphens are allowed, permitting the browser to
           █ insert them if a word division is necessary.
           █
           █ Use the tilde symbol ('~') to indicate allowed hyphenation breaks in words. The tilde tells the script "if you need to hyphenate
           █ this word to make room, hyphenate it here, otherwise ignore me".
           █
           █ All such tildes will be stripped from the text before displaying. To include a natural tilde in your text, use an escaped tilde
           █ (i.e. "\\~").
           █
           ████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████ */
        /* ████████ HYPHENATION GUIDELINES ████████████████████████████████████████████████████████████████████████████████████████████████████
           █
           █ ░░░░ GENERAL RULE: DIVIDE BETWEEN SYLLABLES ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
           █ ░    To verify syllable breaks in a word, append it to the end of the link below and click:
           █ ░       https://www.google.com/search?q=dictionary#dobs=
           █
           █ ░░░░ EXCEPTIONS TO THE GENERAL RULE ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
           █ ░    (a) NEVER place two-letter syllables on the next line               (NOT e.g. "ful~ly"; "strick~en")
           █ ░        NEVER divide a word into one-letter syllables                   (NOT e.g. "e~ven", "a~gain", "e~nough")
           █          NEVER place a soft/liquid 'L' syllable on the next line         (NOT e.g. "possi~ble", "princi~ples")
           █      (b) NEVER divide one-syllable words                                     (e.g. "thought", "helped", "phlegm")
           █      (c) AVOID divisions that would result in awkward segments               (e.g. "every", "only", "eighteen", "people")
           █      (d) DO divide following a prefix                                        (e.g. "pre~fix", "re~location")
           █      (e) DO divide between root and suffix                                   (e.g. "care~less", "convert~ible", "world~wide")
           █      (f) DO divide between doubled consonants                                (e.g. "equip~ping", "rub~ber")
           █      (g) AVOID misleading breaks that could cause word confusion         (NOT e.g. "read~just", "reap~pear", "wo~men", "of~ten")
           █      (h) NEVER divide a hyphenated compound word                         (NOT e.g. "court-mar~tial")
           █          DO divide NON-hyphenated compound words between their elements      (e.g. "hot~house", "sail~boat")
           █      (i) DO divide before "-ing"...                                          (e.g. "fly~ing", "happen~ing")
           █            (i.1) ... UNLESS rule (f) applies                                 (e.g. "bid~ding", "control~ling")
           █            (i.2) ... UNLESS "-ing" is preceded by '<consonant>L'             (e.g. "han~dling", "dwin~dling", "tin~kling")
           █      (k) NEVER divide abbreviations, contractions or numbers                 (e.g. "UNDP", "won’t", "235,006", "114.37")
           █      (l) NEVER divide the very last word in your message
           █
           █  Source: https://www.btb.termiumplus.gc.ca/tcdnstyl-chap&info0=2.17
           █
           ████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████ */
        const DisplayHelp = (options = {}) => {
            U.Alert(H.Box([
                H.Span(null, ["title", "main"]),
                H.Block(
                    [
                        H.ButtonRound(
                            "https://github.com/Eunomiac/EunosRoll20Scripts/releases",
                            ["titleButtons"],
                            {},
                            {title: "Download the most recent version."}
                        ),
                        H.ButtonRound(
                            "https://app.roll20.net/forum/permalink/10184021/",
                            ["titleButtons"],
                            {},
                            {title: "Join the discussion in the Roll20 forum thread."}
                        ),
                        H.ButtonRound(
                            "https://github.com/Eunomiac/EunosRoll20Scripts/issues",
                            ["titleButtons"],
                            {},
                            {title: "Report bugs, make suggestions and track issues."}
                        )
                    ],
                    ["titleButtons"]
                ),
                H.Block(
                    [
                        H.P("<b><u>Euno's Scripts</u></b> is a col~lec~tion of stand-alone scripts, each in~tended to pro~vide com~pre~hen~sive con~trol over a par~tic~u~lar as~pect of the Roll20 VTT. You can learn more about each of the avail~able scripts be~low, and keep ap~prised of new fea~tures, fixes and fu~ture plans through~out dev~elop~ment by vis~it~ing the links above."),
                        H.H2("General Chat Commands"),
                        H.P(H.ButtonCommand(["!euno", "View this help mes~sage."])),
                        H.H2("Available Scripts"),
                        H.P("Click the but~tons be~low to learn more about each of <b><u>Euno's Scripts</u></b>, all of which are in vary~ing sta~ges of de~vel~op~ment:"),
                        H.ButtonH1(
                            "!etc",
                            [
                                H.Span("!ETC", ["buttonLabel"]),
                                H.Span(" - Euno's Text Controls", ["buttonDesc"])
                            ],
                            ["tight", "alignLeft"],
                            {},
                            {title: "Eunomiac's Text Controls: A comprehensive solution to managing Roll20 text objects."}
                        ),
                        H.ButtonH1(
                            "!egc",
                            [
                                H.Span("!EGC", ["buttonLabel"], {}),
                                H.Span(" - Euno's Grab Controls", ["buttonDesc"])
                            ],
                            ["tight", "alignLeft", "bronze"],
                            {},
                            {title: "Eunomiac's Grab Controls: Create buttons and switches in the sandbox for your players to interact with."}
                        ),
                        H.ButtonH1(
                            "!ehc",
                            [
                                H.Span("!EHC", ["buttonLabel"], {}),
                                H.Span(" - Euno's HTML Controls", ["buttonDesc"])
                            ],
                            ["tight", "alignLeft", "bronze"],
                            {},
                            {title: "Eunomiac's HTML Controls: Create handouts and character bios using full HTML & CSS."}
                        ),
                        H.H2("Configuration"),
                        H.P("Con~fig~u~ra~tion op~tions for every script in the <b><u>Euno's Scripts</u></b> col~lec~tion is con~tained in 'EunoCONFIG.js', which you'll find in the API Scripts sec~tion of your game page. Fur~ther in~struc~tions on how to con~fig~ure the scripts to your lik~ing are lo~cated there."),
                        options.isAutoDisplaying
                            ? H.P(`To pre~vent this mes~sage from dis~play~ing at start~up, click the chev~ron be~low. <i>(View this mes~sage at any time via the ${H.Command("!euno")} command.)</i>`)
                            : ""
                    ],
                    [],
                    {"margin-top": "-130px"}
                ),
                options.isAutoDisplaying
                    ? H.ButtonFooter("!euno toggle intro", "", ["hideIntro"])
                    : H.Footer()
            ]));
        };
        // #endregion ░░░░[Chat Messages]░░░░

        // #region ▒░▒░▒░▒[EXPORTS] H (HTML) ▒░▒░▒░▒ ~
        return {
            // [FRONT: Initialization]
            Initialize,

            // [PARSING]
            Tag,
            ...baseElements,

            // [CUSTOM ELEMENTS]
            ...customElements,

            // [HELP MESSAGES]
            DisplayHelp/*~ */,

            // TEMPORARY RETURN FOR CODEPEN DEBUG COMPATIBILITY */
            CSS, cssVars /* ~*/
        };
        // #endregion ▒▒▒▒[EXPORTS: H]▒▒▒▒
    })();
    // #endregion ▄▄▄▄▄ H ▄▄▄▄▄

    // #region ▒░▒░▒░▒[EXPORTS] EunoLIB ▒░▒░▒░▒ ~
    return {
        DEFAULTSTATE, Initialize, PostInitialize,
        handleMessage,
        RE,

        UTILITIES,
        LISTENER,
        OBJECTS,
        HTML
    };
    // #endregion ▒▒▒▒[EXPORTS: EunoLIB]▒▒▒▒
})();
// #endregion ▄▄▄▄▄ EunoLIB ▄▄▄▄▄

EunoCORE.Register("EunoLIB", EunoLIB);
EunoCORE.Register("UTILITIES", EunoLIB.UTILITIES);
EunoCORE.Register("LISTENER", EunoLIB.LISTENER);
EunoCORE.Register("OBJECTS", EunoLIB.OBJECTS);
EunoCORE.Register("HTML", EunoLIB.HTML);

on("ready", () => EunoCORE.INITIALIZE());
MarkStop("EunoLIB");