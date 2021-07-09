void MarkStart("EunoLIB");
log("Starting!");
/******▌████████████████████████████████████████████████████████████▐******\
|*     ▌█░░░░    EunoLIB: Common Functions for EunoScripts     ░░░░█▐     *|
|*     ▌████████████████████████████████████████████████████████████▐     *|
|*     ▌██░░░░ https://github.com/Eunomiac/EunosRoll20Scripts ░░░░██▐     *|
\******▌████████████████████████████████████████████████████████████▐******/

// #region ████████ EunoCORE: Functionality Required before Initialization ████████
const EunoCORE = {
    // NAMESPACING: Namespace under global state variables
    ROOTNAME: "EunoScripts",
    // Returns root state namespace for all EunoScripts
    get ROOT() {
        state[EunoCORE.ROOTNAME] = state[EunoCORE.ROOTNAME] || {};
        return state[EunoCORE.ROOTNAME];
    },
    // Returns script state namespace for specified EunoScript
    getSTATE: (scriptName) => {
        EunoCORE.ROOT[scriptName] = EunoCORE.ROOT[scriptName] || {};
        return EunoCORE.ROOT[scriptName];
    },

    // SCRIPT REGISTRATION: Installed scripts register themselves in EunoCORE
    _scripts: {},
    regSCRIPT: (name, script) => { EunoCORE._scripts[name] = script },
    get SCRIPTS() { return EunoCORE._scripts },

    // VERSION MIGRATION: Any migration processing necessary on version update
    UpdateNamespace: () => { return true },

    // SCRIPT INITIALIZATION:
    Preinitialize: (isResettingState = false) => Object.values(EunoCORE.SCRIPTS)
        .filter((script) => "Preinitialize" in script)
        .forEach((script) => script.Preinitialize(isResettingState)),
    Initialize: (isRegisteringEventListeners = true, isResettingState = false) => Object.values(EunoCORE.SCRIPTS)
        .filter((script) => "Initialize" in script)
        .forEach((script) => script.Initialize(isRegisteringEventListeners, isResettingState)),

    // PRE-DEFINED UTILITY FUNCTIONS: EunoLIB.UTILITY functions that must be defined before initialization
    GetType: (val) => {
        const TYPES = [
            "id", "hex", "hexa", "rgb", "rgba", "hsl", "hsla",
            "int", "float",
            "array", "list",
            "boolean", "null", "undefined",
            "function",
            "date", "regexp",
            "graphic", "token", "animation", "card",
            "character", "text", "path", "jukeboxtrack", "handout", "page", "campaign", "player",
            "string" // only if none of the above match
        ];
        const valType = Object.prototype.toString.call(val).slice(8, -1).toLowerCase().trim();
        switch (valType) {
            case "string": return (Object.entries({
                hex: /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/,
                hexa: /^#[A-Fa-f0-9]{8}$/,
                rgb: /^rgb\((\s*\d{1,3}[,\s)]){3}$/,
                rgba: /^rgba\((\s*\d{1,3}[,\s)]){3}(\s*[\d\.]+[,\s)])$/,
                hsl: /^hsl\((\s*[\d\.%]+[,\s)]){3}$/,
                hsla: /^hsla\((\s*[\d\.%]+[,\s)]){3}(\s*[\d\.]+[,\s)])$/,
                int: /^(-|\+)?[\d,]+$/,
                float: /^(-|\+|\d)[\d,\s]*\.[\d\s]*$/,
                id: /^-[a-zA-Z0-9_-]{19}$/
            }).find(([type, pattern]) => pattern.test(val.trim())) || ["string"]).shift();
            case "number": return /\./u.test(`${val}`) ? "float" : "int";
            // no default
        }
        return valType;
    },
    ScaleColor: (colorRef, scaleFactor = 1) => {
        const colorVals = [];
        const colorRefType = EunoCORE.GetType(colorRef);
        switch (colorRefType) {
            case "hex": case "hexa": {
                colorRef = colorRef.replace(/[^A-Za-z0-9]/gu, "");
                if (colorRef.length === 3) { colorRef = colorRef.split("").map((h) => `${h}${h}`).join("") }
                colorVals.push(...colorRef.match(/.{2}/g).map((hex) => EunoCORE.HexToDec(hex)));
                break;
            }
            case "rgb": case "rgba": case "hsl": case "hsla": {
                colorVals.push(...colorRef
                    .match(/[\d\.%]+[,\s)]/g)
                    .map((val) => {
                        if (/%/.test(val)) { return parseInt(val.replace(/[^\d\.]/gu, "")) / 100 }
                        return /\./.test(val) ? parseFloat(val) : parseInt(val);
                    }));
                break;
            }
            case "string": return colorRef;
            default: return false;
        }
        for (let i = 0; i < 3; i++) {
            colorVals[i] = Math.round(colorVals[i] * scaleFactor);
        }
        switch (colorRefType) {
            case "hexa": return `rgba(${colorVals.join(", ")})`;
            case "hex": return `#${colorVals.map((val) => EunoCORE.DecToHex(val)).join("")}`;
            default: return `${colorRefType}(${colorVals.join(", ")})`;
        }
    },
    HexToDec: (hex) => hex
        .toLowerCase()
        .replace(/[^a-z0-9]/gu, "")
        .split("")
        .reverse()
        .reduce((tot, digit, i) => tot + Math.pow(16, i) * "0123456789abcdef".search(digit), 0),
    DecToHex: (dec) => {
        const hex = [];
        let quot = parseInt(dec);
        do {
            hex.push("0123456789abcdef".charAt(quot % 16));
            quot = Math.floor(quot/16);
        } while (quot > 0);
        return hex.reverse().join("");
    },

    // #region ████████ EunoCORE.CONSTANTS: Globally-Accessible Constants ████████
    CONSTANTS: {
        // #region ░░░░░░░[COLORS]░░░░ Color Definitions ░░░░░░
        COLORS: {
            // Black / Grey / White
            black: "#000",
            get grey10() { return EunoCORE.ScaleColor("#FFF", 0.1) },
            get grey25() { return EunoCORE.ScaleColor("#FFF", 0.25) },
            get grey() { return EunoCORE.ScaleColor("#FFF", 0.50) },
            get grey75() { return EunoCORE.ScaleColor("#FFF", 0.75) },
            get grey90() { return EunoCORE.ScaleColor("#FFF", 0.9) },
            white: "#FFF",

            // Golds
            gold: "#FFD700",
            palegold: "#FFE775"
        },
        // #endregion ░░░░[COLORS]░░░░

        // #region ░░░░░░░[IMAGES]░░░░ Image Source URLs ░░░░░░
        IMGROOT: "https://raw.githubusercontent.com/Eunomiac/EunosRoll20Scripts/master/images",
        IMAGES: {
            titleMain: ["bookends", "titleMain.png", [283, 208] ],
            titleMainButtons: ["bookends", "titleMainButtons.png", [283, 208] ],
            titleETC: ["bookends", "titleETC.png", [283, 142] ],
            subtitleGold: ["bookends", "subtitleGold.png", [283, 60] ],
            subtitleSilver: ["bookends", "subtitleSilver.png", [283, 60] ],
            subtitleBronze: ["bookends", "subtitleBronze.png", [283, 60] ],
            subtitleSilverETC: ["bookends", "subtitleSilverETC.png", [283, 60] ],
            subtitleBronzeETC: ["bookends", "subtitleBronzeETC.png", [283, 60] ],
            bgChatGold: ["backgrounds", "chatBGGold.jpg", [283, 563] ],
            bgChatSilver: ["backgrounds", "chatBGSilver.jpg", [283, 563] ],
            bgChatBronze: ["backgrounds", "chatBGBronze.jpg", [283, 563] ],
            footerGold: ["bookends", "footerGold.png", [283, 37] ],
            footerSilver: ["bookends", "footerSilver.png", [283, 37] ],
            footerBronze: ["bookends", "footerBronze.png", [283, 37] ],
            footerGoBackGold: ["bookends", "footerGoBackGold.png", [283, 37] ],
            footerGoBackSilver: ["bookends", "footerGoBackSilver.png", [283, 37] ],
            footerGoBackBronze: ["bookends", "footerGoBackBronze.png", [283, 37] ],
            footerHideIntroGold: ["bookends", "footerHideIntroGold.png", [283, 37] ],
            buttonDownload: ["buttons", "buttonDownload.png", [50, 50] ],
            buttonChat: ["buttons", "buttonChat.png", [50, 50] ],
            buttonBug: ["buttons", "buttonBug.png", [50, 50] ],
            h1Gold: ["emphasis", "h1Gold.png", [283, 40]],
            h1Silver: ["emphasis", "h1Silver.png", [283, 40]],
            h1Bronze: ["emphasis", "h1Bronze.png", [283, 40]],
            h1GoldDim: ["emphasis", "h1GoldDim.png", [283, 40]],
            h1SilverDim: ["emphasis", "h1SilverDim.png", [283, 40]],
            h1BronzeDim: ["emphasis", "h1BronzeDim.png", [283, 40]],
            h1FlagGold: ["emphasis", "h1FlagGold.png", [283, 40]],
            h1FlagSilver: ["emphasis", "h1FlagSilver.png", [283, 40]],
            h2Gold: ["emphasis", "h2Gold.png", [283, 37]],
            h2Silver: ["emphasis", "h2Silver.png", [283, 37]],
            h2Bronze: ["emphasis", "h2Bronze.png", [283, 37]],
            h2GoldDim: ["emphasis", "h2GoldDim.png", [283, 37]],
            h2SilverDim: ["emphasis", "h2SilverDim.png", [283, 37]],
            h2BronzeDim: ["emphasis", "h2BronzeDim.png", [283, 37]],
            h2FlagGold: ["emphasis", "h2FlagGold.png", [283, 37]],
            h2FlagSilver: ["emphasis", "h2FlagSilver.png", [283, 37]],
            h3BGBlack: ["backgrounds", "h3BGBlack.jpg", [626, 626]],
            commandGold: ["emphasis", "commandGold.png", [235, 37]],
            commandSilver: ["emphasis", "commandSilver.png", [235, 37]],
            commandBronze: ["emphasis", "commandBronze.png", [235, 37]],
            toggleButtonOnGold: ["buttons", "toggleOnGold.png", [273, 68]],
            toggleButtonOffGold: ["buttons", "toggleOffGold.png", [273, 68]],
            toggleButtonOnSilver: ["buttons", "toggleOnSilver.png", [273, 68]],
            toggleButtonOffSilver: ["buttons", "toggleOffSilver.png", [273, 68]]
        },
        GetImgURL: (imgKey, imgFolder) => {
            if (!imgFolder && imgKey in EunoCORE.C.IMAGES) {
                [imgFolder, imgKey] = EunoCORE.C.IMAGES[imgKey];
            }
            return [EunoCORE.C.IMGROOT, imgFolder.toLowerCase(), imgKey].join("/");
        },
        GetImgSize: (imgKey) => [...EunoCORE.C.IMAGES[imgKey]].pop(),

        // #region ░░░░░░░[NUMBER STRINGS]░░░░ Number Words, Ordinal Suffixes, Roman Numerals ░░░░░░
        NUMBERWORDS: {
            ones: [
                "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve",
                "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen", "Twenty"
            ],
            tens: ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"],
            thousands: [
                "", "Thousand", "Mi-", "Bi-", "Tri-", "Quadri-", "Quinti-", "Sexti-", "Septi-", "Octi-", "Noni-",
                "Deci-", "Undeci-", "Duodeci-", "Tredeci-", "Quattuordeci-", "Quindeci-", "Sexdeci-", "Septendeci-", "Octodeci-", "Novemdeci-",
                "Viginti-", "Unviginti-", "Duoviginti-", "Treviginti-", "Quattuorviginti-", "Quinviginti-", "Sexviginti-", "Septenviginti-", "Octoviginti-", "Novemviginti-",
                "Triginti-", "Untriginti-", "Duotriginti-", "Tretriginti-", "Quattuortriginti-"
            ].map((prefix) => prefix.replace(/-$/u, "llion"))
        },
        ORDINALS: {
            zero: "Zeroeth",
            one: "First",
            two: "Second",
            three: "Third",
            four: "Fourth",
            five: "Fifth",
            eight: "Eighth",
            nine: "Ninth",
            twelve: "Twelfth",
            twenty: "Twentieth",
            thirty: "Thirtieth",
            forty: "Fortieth",
            fifty: "Fiftieth",
            sixty: "Sixtieth",
            seventy: "Seventieth",
            eighty: "Eightieth",
            ninety: "Ninetieth"
        },
        ROMANNUMERALS: {
            grouped: [
                ["", "Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ", "Ⅵ", "Ⅶ", "Ⅷ", "Ⅸ"],
                ["", "Ⅹ", "ⅩⅩ", "ⅩⅩⅩ", "ⅩⅬ", "Ⅼ", "ⅬⅩ", "ⅬⅩⅩ", "ⅬⅩⅩⅩ", "ⅩⅭ"],
                ["", "Ⅽ", "ⅭⅭ", "ⅭⅭⅭ", "ⅭⅮ", "Ⅾ", "ⅮⅭ", "ⅮⅭⅭ", "ⅮⅭⅭⅭ", "ⅭⅯ"],
                ["", "Ⅿ", "ⅯⅯ", "ⅯⅯⅯ", "ⅯⅯⅯⅯ", "ⅯⅯⅯⅯⅯ", "ⅯⅯⅯⅯⅯⅯ", "ⅯⅯⅯⅯⅯⅯⅯ", "ⅯⅯⅯⅯⅯⅯⅯⅯ", "ⅯⅯⅯⅯⅯⅯⅯⅯⅯ"]
            ],
            ungrouped: [
                ["", "Ⅰ", "ⅠⅠ", "ⅠⅠⅠ", "ⅠⅤ", "Ⅴ", "ⅤⅠ", "ⅤⅠⅠ", "ⅤⅠⅠⅠ", "ⅠⅩ"],
                ["", "Ⅹ", "ⅩⅩ", "ⅩⅩⅩ", "ⅩⅬ", "Ⅼ", "ⅬⅩ", "ⅬⅩⅩ", "ⅬⅩⅩⅩ", "ⅩⅭ"],
                ["", "Ⅽ", "ⅭⅭ", "ⅭⅭⅭ", "ⅭⅮ", "Ⅾ", "ⅮⅭ", "ⅮⅭⅭ", "ⅮⅭⅭⅭ", "ⅭⅯ"],
                ["", "Ⅿ", "ⅯⅯ", "ⅯⅯⅯ", "ⅯⅯⅯⅯ", "ⅯⅯⅯⅯⅯ", "ⅯⅯⅯⅯⅯⅯ", "ⅯⅯⅯⅯⅯⅯⅯ", "ⅯⅯⅯⅯⅯⅯⅯⅯ", "ⅯⅯⅯⅯⅯⅯⅯⅯⅯ"]
            ]
        }
        // #endregion ░░░░[NUMBER STRINGS]░░░░
        // #endregion ░░░░[IMAGES]░░░░
    },
    // #endregion ▄▄▄▄▄▄▄▄ EunoCORE.CONSTANTS ▄▄▄▄▄▄▄▄

    // SHORTHAND GETTERS: Shorthand getters for major script components
    get CFG() { return EunoCONFIG },
    get LIB() { return EunoLIB },
    get C() { return EunoCORE.CONSTANTS },
    get U() { return EunoLIB.UTILITIES },
    get O() { return EunoLIB.OBJECTS },
    get H() { return EunoLIB.HTML }
};
// #endregion ▄▄▄▄▄▄▄▄ EunoCORE ▄▄▄▄▄▄▄▄

on("ready", () => {
    if (EunoCORE.UpdateNamespace()) {
        // Preinitialize each major script component, then finalize initialization.
        //   - Delays are necessary to ensure each step completes for all scripts before moving to the next.
        setTimeout(EunoCORE.Preinitialize, 1000);
        setTimeout(EunoCORE.Initialize, 2000);
    } else {
        throw "[Euno] ERROR: Failure to Update 'Euno' Namespace.";
    }
});

// #region ████████ EunoLIB: Library of Script Dependencies ████████
const EunoLIB = (() => {
    // #region ░░░░░░░[FRONT]░░░░ Boilerplate Namespacing & Initialization ░░░░░░

    // #region ========== Namespacing: Basic State References & Namespacing ===========
    const SCRIPTNAME = "EunoLIB";
    const DEFAULTSTATE = {/* initial values for state storage, if any */
        isDisplayingHelpAtStart: true
    };
    const RO = {get OT() { return EunoCORE.ROOT }};
    const STA = {get TE() { return EunoCORE.getSTATE(SCRIPTNAME) }};
    // #endregion _______ Namespacing _______

    // #region ========== Initialization: Script Startup & Event Listeners ===========
    const {CFG, C} = EunoCORE;
    let LIB, U, O, H;
    const [scriptPreinitializedLog, scriptInitializedLog] = [{}, {}];

    const Preinitialize = (isResettingState = false) => {
        // Verify EunoCONFIG.js is installed
        try { EunoCONFIG }
        catch {
            throw "[Euno] Error: Can't find 'EunoCONFIG.js'. Is it installed?";
        }

        // Reset script state entry, if specified
        if (isResettingState) { delete RO.OT[SCRIPTNAME] }

        // Initialize script state entry with default values where needed
        Object.entries(DEFAULTSTATE)
            .filter(([key]) => !(key in STA.TE))
            .forEach(([key, defaultVal]) => { STA.TE[key] = defaultVal });

        // Define local-scope shorthand references for main script components
        ({LIB, U, O, H} = EunoCORE);

        // List scripts to wait for check-in before confirming full initialization is complete
        Object.assign(scriptInitializedLog, EunoCORE.SCRIPTS);

        // Preinitialize EunoLIB sub-scripts
        ["UTILITIES", "OBJECTS", "HTML"].forEach((subScriptName) => EunoLIB[subScriptName].Preinitialize());
    };
    const Initialize = (isRegisteringEventListeners = false, isResettingState = false) => {
        // Report readiness of EunoCONFIG (verified in Preinitialize)
        U.Flag("EunoCONFIG Ready!");

        // Reset script state entry, if specified
        if (isResettingState) { Preinitialize(true) }

        // Register event handlers, if specified
        if (isRegisteringEventListeners) {
            on("chat:message", handleMessage);
        }

        // Initialize EunoLIB sub-scripts
        ["UTILITIES", "OBJECTS", "HTML"].forEach((subScriptName) => EunoLIB[subScriptName].Initialize(isRegisteringEventListeners));

        // Report readiness
        ReportReady(SCRIPTNAME, "Euno");
    };
    const ReportReady = (scriptName, prefix) => {
        const scriptRef = (scriptName || "").replace(/^!/, "");
        if (typeof prefix === "string") {
            prefix = `[${prefix}]`;
        }
        prefix = prefix || "";
        if (scriptRef in scriptInitializedLog) {
            U.Flag(`${scriptName} Ready!`); log([prefix, scriptName, "Ready!"].join(" "));
            scriptInitializedLog[scriptRef] = true;
        }
        if (Object.values(scriptInitializedLog).every((scriptStatus) => scriptStatus === true)) {
            PostInitialize();
        }
    };
    const PostInitialize = () => {
        U.Flag("EunoScripts Ready!"); log("[Euno] EunoScripts Ready!");

        // Display Help message, if so configured
        if (STA.TE.isDisplayingHelpAtStart) {H.DisplayHelp({isAutoDisplaying: true})}
    };
    // #endregion _______ Initialization _______

    // #region ========== Events: Event Handlers ===========
    const handleMessage = (msg) => {
        if (msg.content.startsWith("!euno") && playerIsGM(msg.playerid)) {
            let [call, ...args] = (msg.content.match(/!\S*|\s@"[^"]*"|\s@[^\s]*|\s"[^"]*"|\s[^\s]*/gu) || [])
                .map((x) => x.replace(/^\s*(@)?"?|"?"?\s*$/gu, "$1"))
                .filter((x) => Boolean(x));
            try {
                ({
                    toggle: () => ({
                        intro: () => {
                            STA.TE.isDisplayingHelpAtStart = args.includes("true");
                            if (STA.TE.isDisplayingHelpAtStart) {
                                U.Flag("Showing Help at Start.", 2);
                            } else {
                                U.Flag("Hiding Help at Start.", 2, ["silver"]);
                            }
                        }
                    }[U.LCase(call = args.shift())])()
                }[U.LCase(call = args.shift())])();
            } catch {
                H.DisplayHelp();
            }
        }
    };
    // #endregion _______ Events _______

    // #endregion ░░░░[FRONT]░░░░

    // ████████ [EunoLIB.U] Global Utility Functions ████████
    const UTILITIES = (() => {

        // #region ░░░░░░░[FRONT]░░░░ Boilerplate Namespacing & Initialization ░░░░░░

        // #region ========== Namespacing: Basic State References & Namespacing ===========
        const SCRIPTNAME = "UTILITIES";
        const DEFAULTSTATE = { /* initial values for state storage, if any */ };
        const STA = {get TE() { return EunoCORE.getSTATE(SCRIPTNAME) }};
        // #endregion _______ Namespacing _______

        // #region ========== Initialization: Script Startup & Event Listeners ===========
        const Preinitialize = (isResettingState = false) => {
            // Reset script state entry, if specified
            if (isResettingState) { delete RO.OT[SCRIPTNAME] }

            // Initialize script state entry with default values where needed
            Object.entries(DEFAULTSTATE)
                .filter(([key]) => !(key in STA.TE))
                .forEach(([key, defaultVal]) => { STA.TE[key] = defaultVal });
        };
        const Initialize = (isRegisteringEventListeners = false, isResettingState = false) => {
            // Reset script state entry, if specified
            if (isResettingState) { Preinitialize(true) }

            // Register event handlers, if specified
            if (isRegisteringEventListeners) { /* 'on()' event handlers, if any */ }

            // Report readiness
            Flag(`EunoLIB.${SCRIPTNAME} Ready!`, 2, ["silver"]);
            log(`[EunoLIB] ${SCRIPTNAME} Ready!`);
        };
            // #endregion _______ Initialization _______

        // #endregion ░░░░[FRONT]░░░░

        // #region ░░░░░░░[Validation]░░░░ Verification & Type Checking ░░░░░░
        const GetType = (val) => {
            const type = EunoCORE.GetType(val);
            return type === "object"
                ? O.GetR20Type(val) || "list"
                : type;
        };
        // #endregion ░░░░[Validation]░░░░

        // #region ░░░░░░░[Numbers]░░░░ Number Generation, Manipulation, Parsing from Strings ░░░░░░

        // #region ========== Parsing: "Safe" Parsing of Numbers ===========
        const Float = (qNum) => parseFloat(qNum) || 0;
        const Int = (qNum) => parseInt(Math.round(Float(qNum)));
        // #endregion _______ Parsing _______

        // #region ========== Constraining: Rounding, Binding, Cycling ===========
        const RoundNum = (qNum, numDecDigits = 0) => {
            if (Float(qNum) === Int(qNum)) { return Int(qNum) }
            return Math.round(Float(qNum) * 10 ** Int(numDecDigits)) / 10 ** Int(numDecDigits);
        };
        const BindNum = (qNum, minVal, maxVal) => Math.max(Math.min(Float(qNum), Float(maxVal)), Float(minVal));
        const CycleNum = (qNum, minVal, maxVal) => {
            qNum = Float(qNum); minVal = Float(minVal); maxVal = Float(maxVal);
            while (qNum > maxVal)
            {qNum -= maxVal - minVal}
            while (qNum < minVal)
            {qNum += maxVal - minVal}
            return qNum;
        };
        // #endregion _______ Constraining _______

        // #endregion ░░░░[Numbers]░░░░

        // #region ░░░░░░░[Strings]░░░░ String Manipulation, JSON, Type Conversion ░░░░░░

        // #region ========== Case Conversion: Upper, Lower, Sentence & Title Case ===========
        const UCase = (val) => `${val || ""}`.toUpperCase(); // "Safe" toUpperCase()
        const LCase = (val) => `${val || ""}`.toLowerCase(); // "Safe" toLowerCase()
        const SCase = (val) => { // Converts to sentence case, retaining interior uppercase letters UNLESS all uppercase
            val = `${val || ""}`;
            if (/[^a-z]/u.test(val)) { val = LCase(val) }
            return `${UCase(val.charAt(0))}${(val).slice(1)}`;
        };
        const TCase = (val) => SCase(val) // Converts to title case
            .split(/ /gu)
            .map((subStr) => `${UCase(subStr.charAt(0))}${(/[^a-z]/u.test(subStr) ? LCase(subStr) : subStr).slice(1)}`)
            .join(" ");
        // #endregion _______ Case Conversion _______

        // #region ========== Type Conversion: To Numbers, Objects, JSON ===========
        const ParseString = (val) => { // Converts strings into appropriate data type
            if (GetType(val) === "array") { return val.map((v) => ParseString(v)) }
            switch(GetType(val)) {
                case "int": return Int(val);
                case "float": return Float(val);
                default: {
                    switch(LCase(val)) {
                        case "true": return true;
                        case "false": return false;
                        case "null": return null;
                        case "undefined": return undefined;
                        default: return val;
                    }
                }
            }
        };
        const ParseParams = (val, delim = ",", propDelim = ":") => Object.fromEntries(val // Converts comma-delimited <key>:<val> pairs to object.
            .split(delim)
            .map((kvPair) => kvPair.split(propDelim)));
        const JS = (val) => JSON.stringify(val, null, 2) // Stringification for display in R20 chat.
            .replace(/\n/g, "<br>")
            .replace(/ /g, "&nbsp;");
        const JC = (val) => H.Pre(JS(val)); // Stringification for data objects and other code for display in R20 chat.
        // #endregion _______ Type Conversion _______

        // #region ========== Numbers to Strings: Convert Numbers to Words, Signed Numbers, Ordinals, Roman Numerals ===========
        const NumToWords = (num) => {
            num = `${Float(num)}`;
            const parseThreeDigits = (trio) => {
                const digits = `${trio}`.split("").map((digit) => Int(digit));
                let result = "";
                if (digits.length === 3) {
                    const hundreds = digits.shift();
                    result += hundreds > 0 ? `${C.NUMBERWORDS.ones[hundreds]} hundred` : "";
                    if (digits[0] + digits[1] > 0) {
                        result += " and ";
                    } else {
                        return result;
                    }
                }
                if (Int(digits.join("")) <= C.NUMBERWORDS.ones.length) {
                    result += C.NUMBERWORDS.ones[Int(digits.join(""))];
                } else {
                    result += C.NUMBERWORDS.tens[Int(digits.shift())] + (Int(digits[0]) > 0 ? `-${C.NUMBERWORDS.ones[Int(digits[0])]}` : "");
                }
                return result;
            };
            const numWords = [];
            if (num.charAt(0) === "-") {
                numWords.push("negative");
            }
            const [integers, decimals] = num.replace(/[,|\s|-]/gu, "").split(".");
            const intArray = integers.split("")
                .reverse()
                .join("")
                .match(/.{1,3}/g)
                .map((v) => v.split("").reverse().join(""));
            const intStrings = [];
            while (intArray.length) {
                intStrings.push(`${parseThreeDigits(intArray.pop())} ${C.NUMBERWORDS.thousands[intArray.length]}`);
            }
            numWords.push(intStrings.join(", ").trim());
            if (GetType(decimals) === "int") {
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
                return numText.replace(new RegExp(`${suffix}$`), C.ORDINALS[suffix] || `${suffix}th`);
            }
            const tNum = Int(num) - 100 * Math.floor(Int(num) / 100);
            if (/\.|1[1-3]$/.test(`${num}`)) {
                return `${num}th`;
            }
            return `${num}${["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"][Int(`${num}`.charAt(`${num}`.length - 1))]}`;
        };
        const NumToRoman = (num, isUsingGroupedChars = true) => {
            num = Int(num);
            if (num > 9999) { throw `[Euno] Error: Can't Romanize '${num}' (> 9999)` }
            if (num <= 0) { throw `[Euno] Error: Can't Romanize '${num}' (<= 0)` }
            const romanRef = C.ROMANNUMERALS[isUsingGroupedChars ? "grouped" : "ungrouped"];
            const romanNum = `${num}`
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
        // #endregion _______ Numbers to Strings _______

        // #endregion ░░░░[Strings]░░░░

        // #region ░░░░░░░[Chat]░░░░ Basic Chat Messages ░░░░░░
        const randStr = () => _.sample("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split(""), 4).join("");
        const Alert = (content, title, headerLevel = 1, classes = [], options = {noarchive: true}) => { // Simple alert to the GM. Style depends on presence of content, title, or both.
            if (content !== false && (content || title)) {
                if (title) {
                    if (content === null) {
                        sendChat(randStr(), `/w gm ${H.Box(H.Block(H[`H${headerLevel}`](title, classes), [], {padding: 0}), [], {"min-height": "auto", "border": "none"})}`, null, options);
                    } else {
                        sendChat(randStr(), `/w gm ${H.Box(H.Block([
                            H[`H${headerLevel}`](title, classes),
                            H.Block(content)
                        ]))}`, null, options);
                    }
                } else {
                    sendChat(randStr(), `/w gm ${content}`.replace(/@@tilde@@/gu, "~")); // Restore escaped tildes), null, options);
                }
            }
        };
        const Direct = (content, target = "all", options) => {
            if (LCase(target) === "all") {
                sendChat(randStr(), `/direct ${content}`.replace(/@@tilde@@/gu, "~"), null, options); // Restore escaped tildes), null, options);
            } else {
                Alert(content, null, undefined, undefined, options);
            }
        };
        const Show = (obj, title = "Showing ...") => Alert(H.Box(H.Block([H.H1(title, ["tight"], {"margin-top": "0px"}), H.Block(JC(obj), [], {width: "283px", "margin": "0 0 0 -7px", "padding": "0", "outline": "2px solid black"})]))); // Show properties of stringified object to GM.
        const Flag = (msg, headerLevel = 1, classes = []) => Alert(null, msg, headerLevel, ["flag", ...classes]); // Simple one-line chat flag sent to the GM.
        // #endregion ░░░░[Chat]░░░░

        // #region ░░░░░░░[Arrays & Objects]░░░░ Array & Object Processing ░░░░░░
        // Arrayify: Ensures value returns as an array containing only truthy objects.
        //     Useful when iterating over a map to functions that return falsy values on failure
        const Arrayify = (x) => [x].flat().filter((xx) => Boolean(xx));
        /* An object-equivalent Array.map() function, which accepts mapping functions to transform both keys and values.
        *      If only one function is provided, it's assumed to be mapping the values and will receive (v, k) args. */
        const KVPMap = (obj, keyFunc, valFunc) => {
            [valFunc, keyFunc] = [valFunc, keyFunc].filter((x) => typeof x === "function" || typeof x === "boolean");
            keyFunc = keyFunc || ((k) => k);
            valFunc = valFunc || ((v) => v);
            return Object.fromEntries(Object.entries(obj).map(([key, val]) => [keyFunc(key, val), valFunc(val, key)]));
        };
        // #endregion ░░░░[Arrays & Objects]░░░░

        return {
            // [FRONT: Initialization]
            Preinitialize, Initialize,

            // [Validation]
            GetType,

            // [Conversion]
            HexToDec: EunoCORE.HexToDec, DecToHex: EunoCORE.DecToHex,

            // [Scaling]
            ScaleColor: EunoCORE.ScaleColor,

            // [Numbers: Parsing]
            Float, Int,

            // [Numbers: Constraining]
            RoundNum, BindNum, CycleNum,

            // [Strings: Case Conversion]
            UCase, LCase, SCase, TCase,
            // [Strings: Type Conversion]
            ParseString, ParseParams, JS, JC,
            // [Strings: Numbers to Strings]
            NumToWords, NumToOrdinal, NumToRoman, NumToSignedNum, NumToPaddedNum,

            // [Chat]
            Alert, Direct, Show, Flag,

            // [Arrays & Objects]
            Arrayify, KVPMap
        };
    })();

    // ████████ [EunoLIB.O] Roll20 Object Manipulation ████████
    const OBJECTS = (() => {
        // #region ░░░░░░░[FRONT]░░░░ Boilerplate Namespacing & Initialization ░░░░░░

        // #region ========== Namespacing: Basic State References & Namespacing ===========
        const SCRIPTNAME = "OBJECTS";
        const DEFAULTSTATE = { /* initial values for state storage, if any */ };
        const STA = {get TE() { return EunoCORE.getSTATE(SCRIPTNAME) }};
        // #endregion _______ Namespacing _______

        // #region ========== Initialization: Script Startup & Event Listeners ===========
        const Preinitialize = (isResettingState = false) => {
            // Reset script state entry, if specified
            if (isResettingState) { delete RO.OT[SCRIPTNAME] }

            // Initialize script state entry with default values where needed
            Object.entries(DEFAULTSTATE)
                .filter(([key]) => !(key in STA.TE))
                .forEach(([key, defaultVal]) => { STA.TE[key] = defaultVal });
        };
        const Initialize = (isRegisteringEventListeners = false, isResettingState = false) => {
            // Reset script state entry, if specified
            if (isResettingState) { Preinitialize(true) }

            // Register event handlers, if specified
            if (isRegisteringEventListeners) { /* 'on()' event handlers, if any */ }

            // Report readiness
            U.Flag(`EunoLIB.${SCRIPTNAME} Ready!`, 2, ["silver"]);
            log(`[EunoLIB] ${SCRIPTNAME} Ready!`);
        };
        // #endregion _______ Initialization _______

        // #endregion ░░░░[FRONT]░░░░

        // #region ░░░░░░░[Getters]░░░░ Retrieving Sandbox Objects ░░░░░░
        const GetR20Type = (val) => {
            if (val && typeof val === "object" && "id" in val && "get" in val) {
                const type = val.get("_type");
                if (type === "graphic") {
                    if (val.get("represents")) {
                        return "token";
                    }
                    if (val.get("_subtype") === "card") {
                        return "card";
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
            const qObjs = U.Arrayify(qObj);
            const objs = [];
            if (U.GetType(qObj) === "array") {
                isReturningArray = true;
                objs.push(...U.Arrayify(qObjs.map((qO) => GetObj(qO, type, registry))));
            } else {
                switch (type) {
                    case "card": case "token": case "animation": {
                        objs.push(...U.Arrayify(GetObj(qObjs, "graphic", registry, true))
                            .filter((obj) => GetR20Type(obj) === type));
                        break;
                    }
                    case "pc": case "npc": {
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
                    case "graphic": case "text": case "path": /* ... */ {
                        objs.push(...U.Arrayify(qObjs.map((qObjElem) => {
                            switch (qObjElem) {
                                case "all": return findObjs({_type: type});
                                case "registered": return U.Arrayify(GetObj("all", type, registry, true)).filter((obj) => obj.id in registry);
                                case "unregistered": return U.Arrayify(GetObj("all", type, registry, true)).filter((obj) => !(obj.id in registry));
                                default: {
                                    switch (U.GetType(qObjElem)) {
                                        case "id": return getObj(type, qObjElem) || false;
                                        case "array": return U.Arrayify(qObjElem).map((qObjSubElem) => GetObj(qObjSubElem, type, registry, true));
                                        default: return GetR20Type(qObjElem) === type ? qObjElem : false;
                                    }
                                }
                            }
                        })));
                        break;
                    }
                    // no default
                }
            }
            if (isReturningArray) {
                return U.Arrayify(objs);
            }
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
                return U.Arrayify(charObjs);
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
                    case "all": case "any": objs.push(...msg.selected.map((objData) => getObj(objData._type, objData._id))); break;
                    case "token": case "card": case "animation": objs.push(...GetSelObj(msg, "graphic", true).filter((graphicObj) => graphicObj.get("_subtype") === type)); break;
                    case "pc": case "npc": case "character": objs.push(...GetSelObj(msg, "token", true).map((tokenObj) => GetChar(tokenObj))); break;
                    case "player": /* GetPlayer function; */ break;
                    default: objs.push(...msg.selected.filter((objData) => objData._type === type).map((objData) => getObj(type, objData._id))); break;
                }
                if (isReturningArray) {
                    return U.Arrayify(objs);
                }
                return objs.length > 0 ? objs.shift() : false;
            }
            return isReturningArray ? [] : false;
        };
        // #endregion ░░░░[Getters]░░░░

        return {
            Preinitialize, Initialize,

            GetR20Type,
            GetObj, GetChar, GetSelObj
        };

    })();

    // ████████ [EunoLIB.H] HTML/CSS Parsing & Styling for Chat & Handouts ████████
    const HTML = (() => {
        // #region ░░░░░░░[FRONT]░░░░ Boilerplate Namespacing & Initialization ░░░░░░

        // #region ========== Namespacing: Basic State References & Namespacing ===========
        const SCRIPTNAME = "HTML";
        const DEFAULTSTATE = {/* initial values for state storage, if any */};
        const STA = {get TE() { return EunoCORE.getSTATE(SCRIPTNAME) }};
        // #endregion _______ Namespacing _______

        // #region ========== Initialization: Script Startup & Event Listeners ===========
        const Preinitialize = (isResettingState = false) => {
            // Reset script state entry, if specified
            if (isResettingState) { delete RO.OT[SCRIPTNAME] }

            // Initialize script state entry with default values where needed
            Object.entries(DEFAULTSTATE)
                .filter(([key]) => !(key in STA.TE))
                .forEach(([key, defaultVal]) => { STA.TE[key] = defaultVal });
        };
        const Initialize = (isRegisteringEventListeners = false, isResettingState = false) => {
            // Reset script state entry, if specified
            if (isResettingState) { Preinitialize(true) }

            // Register event handlers, if specified
            if (isRegisteringEventListeners) { /* 'on()' event handlers, if any */ }

            // Report readiness
            U.Flag(`EunoLIB.${SCRIPTNAME} Ready!`, 2, ["silver"]);
            log(`[EunoLIB] ${SCRIPTNAME} Ready!`);
        };
        // #endregion _______ Initialization _______

        // #endregion ░░░░[FRONT]░░░░

        // #region ░░░░░░░[STYLES]░░░░ CSS Class Style Definitions ░░░░░░
        const cssVars = {
            boxPosition: {
                width: 283,
                borderWidth: 2,
                shifts: {top: -27, right: 0, bottom: -6, left: -45}
            },
            bodyFontSize: 10
        };
        const CSS = Object.fromEntries([
            /* #region Base Element Styles */
            `    div {
                    display: block;
                    width: auto;
                    height: auto;
                    margin: 0;
                    padding: 0;
                    color: inherit;
                    font-size: 0;
                    border: none;
                    outline: none;
                    text-shadow: none;
                    box-shadow: none;
                    overflow: hidden;
                }
                span {
                    display: inline-block;
                    padding: 0;
                    color: inherit;
                    font-family: inherit;
                    font-size: inherit;
                    font-weight: inherit;
                    line-height: inherit;
                    vertical-align: baseline;
                }
                p {
                    display: block;
                    margin: 6px 3px;
                    font-size: ${cssVars.bodyFontSize}px;
                    font-family: Tahoma, sans-serif;
                    line-height: ${1.5 * cssVars.bodyFontSize}px;
                    text-align: left;
                }
                pre {
                    margin: 0;
                    padding: 0;
                    font-family: 'Fira Code', Input, monospace;
                    font-size: 8px;
                    font-weight: bold;
                    background-color: ${C.COLORS.grey75};
                }
                img {display: block}
                a {
                    display: inline-block;
                    width: 90%;
                    margin: 0;
                    padding: 5px;
                    background: none;
                    color: ${C.COLORS.black};
                    font-family: inherit;
                    font-size: inherit;
                    font-weight: bold;
                    line-height: inherit;
                    vertical-align: inherit;
                    text-decoration: none;
                    outline: none;
                    border: none;
                }
                h1 {
                    display: block;
                    height: 43px;
                    width: ${cssVars.boxPosition.width}px;
                    margin: 20px 0 -10px -6px;
                    font-family: Impact, sans-serif;
                    line-height: 28px;
                    font-size: 24px;
                    font-weight: normal;
                    color: ${C.COLORS.black};
                    text-align: center;
                    background-image: url('${C.GetImgURL("h1Gold")}');
                    background-size: ${C.GetImgSize("h1Gold").map((dim) => `${dim}px`).join(" ")};
                    background-repeat: no-repeat;
                }
                h2 { /* background: bg-color bg-image position/bg-size bg-repeat bg-origin bg-clip bg-attachment initial|inherit, */
                    display: block;
                    height: 26px;
                    width: ${cssVars.boxPosition.width}px;
                    margin: 5px 0 0px -6px;
                    font-family: 'Trebuchet MS', sans-serif;
                    line-height: 23px;
                    font-size: 16px;
                    color: ${C.COLORS.black};
                    text-indent: 10px;
                    background-image: url('${C.GetImgURL("h2Gold")}');
                    background-repeat: no-repeat;
                }
                h3 {
                    display: block;
                    width: 100%;
                    font-family: 'Trebuchet MS', sans-serif;
                    line-height: 20px;
                    margin: 0 0 9px 0;
                    color: ${C.COLORS.gold};
                    text-indent: 4px;
                    background-image: url('${C.GetImgURL("h3BGBlack")}');
                    background-repeat: no-repeat;
                    text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8), -1px -1px 2px rgb(0, 0, 0), -1px -1px 2px rgb(0, 0, 0), -1px -1px 2px rgb(0, 0, 0),
                }
            `,
            /* #endregion Base Styles */
            /* #region Class Styles */
            `   .box {
                    width: ${cssVars.boxPosition.width}px;
                    min-width: ${cssVars.boxPosition.width}px;
                    min-height: 39px;
                    margin: ${cssVars.boxPosition.shifts.top}px ${cssVars.boxPosition.shifts.right}px ${cssVars.boxPosition.shifts.bottom}px ${cssVars.boxPosition.shifts.left}px;
                    color: ${C.COLORS.palegold};
                    text-align: center;
                    position: relative;
                    background-image: url('${C.GetImgURL("bgChatGold")}');
                    background-size: 100%;
                    box-shadow: inset 0 0 5px ${C.COLORS.black}, inset 0 0 5px ${C.COLORS.black}, inset 0 0 5px ${C.COLORS.black};
                }
                .box.silver {color: ${C.COLORS.white};}
                .block {
                    min-width: ${cssVars.boxPosition.width - 24}px;
                    margin: 2px 0 0 0;
                    padding: 0 6px;
                    text-align: left;
                    color: inherit;
                }
                .block.silver {color: ${C.COLORS.white};}
                .block.titleButtons {
                    width: 40px;
                    min-width: 40px;
                    margin: 0;
                    padding: 0;
                    position: relative;
                    top: -165px;
                    left: 240px;
                }
                .title {
                    width: 100%;
                    margin: 0 0 -30px 0;
                    color: ${C.COLORS.black};
                    font-family: Impact; sans-serif;
                    line-height: 36px;
                    font-size: 24px;
                    font-weight: normal;
                    text-align: center;
                    background-image: url('${C.GetImgURL("titleMainButtons")}');
                    background-origin: padding-box;
                    background-repeat: no-repeat;
                    background-position: center 3px;
                }
                .title.main {
                    height: ${C.GetImgSize("titleMainButtons").pop()}px;
                    background-size: 280px;
                }
                .title.etc {
                    height: ${C.GetImgSize("titleETC").pop()}px;
                    background-image: url('${C.GetImgURL("titleETC")}');
                    background-size: 280px;
                    margin-bottom: -65px;
                }
                .subtitle {
                    width: 100%;
                    margin: 0 0 -30px 0;
                    padding: 17px 0 0 0;
                    color: ${C.COLORS.black};
                    font-family: Impact; sans-serif;
                    line-height: 36px;
                    font-size: 24px;
                    font-weight: normal;
                    text-align: center;
                    background-image: url('${C.GetImgURL("subtitleSilverETC")}');
                    background-origin: padding-box;
                    background-repeat: no-repeat;
                    background-position: center 3px;
                }
                .subtitle.etc {
                    height: ${C.GetImgSize("subtitleSilverETC").pop()}px;
                    background-image: url('${C.GetImgURL("subtitleSilverETC")}');
                    background-size: 280px;
                }
                .flag {
                    margin: 0;
                    text-align: left;
                    text-indent: 40px;
                }
                h1.flag {
                    height: 31px;
                    line-height: 29px;
                    background-image: url('${C.GetImgURL("h1FlagGold")}');
                }
                h1.dim {background-image: url('${C.GetImgURL("h1GoldDim")}')}
                h1.silver {background-image: url('${C.GetImgURL("h1Silver")}')}
                h1.silver.dim {background-image: url('${C.GetImgURL("h1SilverDim")}')}
                h1.bronze {background-image: url('${C.GetImgURL("h1Bronze")}')}
                h1.bronze.dim {background-image: url('${C.GetImgURL("h1BronzeDim")}')}
                h1.flag.silver {background-image: url('${C.GetImgURL("h1FlagSilver")}')}
                h1.tight {
                    height: 28px;
                    margin-top: 2px;
                    margin-bottom: 0px;
                }
                h2.flag {
                    height: 24px;
                    line-height: 21px;
                    background-image: url('${C.GetImgURL("h2FlagGold")}');
                    background-position: center -2px;
                }
                h2.dim {background-image: url('${C.GetImgURL("h2GoldDim")}')}
                h2.silver {background-image: url('${C.GetImgURL("h2Silver")}')}
                h2.silver.dim {background-image: url('${C.GetImgURL("h2SilverDim")}')}
                h2.bronze {background-image: url('${C.GetImgURL("h2Bronze")}')}
                h2.bronze.dim {background-image: url('${C.GetImgURL("h2BronzeDim")}')}
                h2.flag.silver {background-image: url('${C.GetImgURL("h2FlagSilver")}')}
                .commandHighlight {
                    margin: 0 3px;
                    padding: 0 8px 0 6px;
                    color: ${C.COLORS.black};
                    font-family: monospace;
                    font-weight: bolder;
                    text-shadow: 0 0 1px ${C.COLORS.black};
                    background-image: url('${C.GetImgURL("commandGold")}');
                    background-size: 100% 100%;
                    background-repeat: no-repeat;
                }
                .commandHighlight.silver {background-image: url('${C.GetImgURL("commandSilver")}')}
                .commandHighlight.bronze {background-image: url('${C.GetImgURL("commandBronze")}')}
                .commandHighlight.shiftLeft {
                    margin: 0 0 0 -20px;
                    padding-right: 17px;
                    text-align: right;
                    text-indent: 14px;
                    background-position: right;
                }
                .footer {
                    height: 37px;
                    margin: 6px 0 0 0;
                    background-image: url('${C.GetImgURL("footerGold")}');
                    background-size: 280px;
                    background-repeat: no-repeat;
                    background-position: center -2px;
                    font-weight: normal;
                }
                .footer.silver {background-image: url('${C.GetImgURL("footerSilver")}')}
                .footer.hideIntro {background-image: url('${C.GetImgURL("footerHideIntroGold")}')}
                .footer.goBack {background-image: url('${C.GetImgURL("footerGoBackGold")}')}
                .footer.goBack.silver {background-image: url('${C.GetImgURL("footerGoBackSilver")}')}
                span.buttonLabel {
                    display: inline-block;
                    min-width: 50px;
                    text-indent: 0;
                    text-align: center;
                }
                span.buttonDesc {
                    display: inline-block;
                    font-family: 'Trebuchet MS';
                    font-size: 20px;
                    vertical-align: middle;
                    padding-bottom: 2px;
                    text-indent: 0px;
                }
                a.button {
                    display: block;
                    height: 100%;
                    width: 100%;
                    margin: 0; padding: 0;
                    text-align: inherit;
                    font-family: inherit;
                    font-size: inherit;
                    line-height: inherit;
                    font-weight: inherit;
                    text-transform: inherit;
                    color: inherit;
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
                div.block.toggleButton {
                    height: ${C.GetImgSize("toggleButtonOnGold")[1]}px;
                    margin: 5px 0 5px -6px;
                    padding: 0 2px;
                    background-repeat: no-repeat;
                    background-size: ${C.GetImgSize("toggleButtonOnGold").map((dim) => `${dim}px`).join(" ")};
                }
                div.block.toggleButton.toggleOn {background-image: url('${C.GetImgURL("toggleButtonOnGold")}')}
                div.block.toggleButton.toggleOff {background-image: url('${C.GetImgURL("toggleButtonOffGold")}')}
                div.block.toggleButton.toggleOn.silver {background-image: url('${C.GetImgURL("toggleButtonOnSilver")}')}
                div.block.toggleButton.toggleOff.silver {background-image: url('${C.GetImgURL("toggleButtonOffSilver")}')}
                div.toggleButtonTitle {
                    display: inline-block;
                    width: 185px;
                    font-family: Impact, sans-serif;
                    font-weight: normal;
                    font-size: 14px;
                    color: ${C.COLORS.black};
                    text-transform: uppercase;
                    vertical-align: top;
                }
                div.toggleButtonBody {
                    display: inline-block;
                    height: 40px;
                    width: 160px;
                    font-family: 'Tahoma', sans-serif;
                    font-size: ${cssVars.bodyFontSize}px;
                    color: ${C.COLORS.black};
                    line-height: 14px;
                    font-weight: bold;
                }
                div.toggleButtonRight {
                    display: inline-block;
                    height: 30px;
                    width: 100px;
                    margin-left: 10px;
                    vertical-align: top;
                }
                .alignLeft {text-align: left}

            `
            /* #endregion Class Styles */
        ].join("")
            .replace(/\/\*.*?\*\//g, "") // strip CSS comments
            .replace(/\s+/g, " ") // remove excess white space
            .replace(/("|')[a-z]+:\/\/.+?\1/gu, (url) => url.replace(/:/gu, "^")) // escape colons in url entries
            .split(/\}/) // capture selector blocks
            .map((selBlock) => selBlock.split(/\{/).map((selBlock) => (selBlock || "").trim())) // separate selector from block
            .filter(([sel, block]) => sel && block) // filter out null values
            .map(([sel, block]) => sel.split(/\s*,\s*/) // separate comma-delimited selectors ...
                .map((ssel) => [ // ... and give each one its own copy of the associated properties
                    ssel.trim(),
                    Object.fromEntries(block.split(/;/) // separate 'property: value' lines
                        .map((propVal) => (propVal || "").trim().split(/:/)) // separate 'property' and 'value' into key/val
                        .filter(([prop, val]) => prop && val) // filter out null values
                        .map(([prop, val]) => [prop.trim(), val.trim().replace(/\^/g, ":")])) // restore colons to urls
                ])).flat()); // flatten duplicated selectors (from comma-delimiting) into main array of [key, val] entries for object creation
        // #endregion ░░░░[STYLES]░░░░

        // #region ░░░░░░░[PARSING]░░░░ Parsing Style Data to Inline CSS ░░░░░░

        // #region ========== Parsing Functions: Functions for Parsing to Inline CSS ===========
        const getStyles = (tag, classes = []) => {
            classes = [classes].flat();
            const styleSteps = [{classes}];

            // Apply general tag styles
            const styleData = {...(CSS[tag] || {})};
            styleSteps.push({...styleData});

            // Locate styles for exact class references
            classes.forEach((classRef) => Object.assign(styleData, CSS[`.${classRef}`] || {}));
            styleSteps.push({...styleData});

            // Overwrite with more-specific combination references
            Object.keys(CSS).filter((classRef) => /^\..*\./.test(classRef)
                                                  && classRef.split(/\./gu)
                                                      .filter((className) => Boolean((className || "").trim()))
                                                      .map((className) => className.replace(/^\./u, ""))
                                                      .every((className) => classes.includes(className)))
                .forEach((classRef) => Object.assign(styleData, CSS[classRef]));
            styleSteps.push({...styleData});

            // Now, repeat for more-specific references that begin with the element's tag
            const tagClassRefs = Object.keys(CSS).filter((classRef) => classRef.startsWith(`${tag.toLowerCase()}.`));
            tagClassRefs.filter((classRef) => classes.includes(classRef.replace(new RegExp(`^${tag.toLowerCase()}\.`), "")))
                .forEach((classRef) => Object.assign(styleData, CSS[classRef]));
            styleSteps.push({...styleData});

            // Finally, repeat for more-specific combo references that begin with the element's tag
            tagClassRefs.filter((classRef) => classRef.replace(new RegExp(`^${tag.toLowerCase()}\.`), "").split(/\./gu).every((className) => classes.includes(className)))
                .forEach((classRef) => Object.assign(styleData, CSS[classRef]));
            styleSteps.push({...styleData});
            if (classes.includes("block") && styleData.height === "37px" && /chatBGGold\.jpg/.test(styleData["background-image"] || "")) {
                U.Direct(H.Box(H.Pre(U.JS(styleSteps))));
            }

            return Object.fromEntries(Object.entries(styleData).filter(([propName, propVal]) => propVal !== null));
        };
        const parseBGStyle = (bgData = {}) => [
            bgData.color || false,
            bgData.image && `url('${C.GetImgURL(bgData.image)})` || bgData.gradient,
            [bgData.position, bgData.size].filter((prop) => Boolean(prop)).join("/"),
            bgData.repeat,
            bgData.origin,
            bgData.clip,
            bgData.attachment
        ].filter((prop) => Boolean(prop)).join(" ");
        const parseStyleLine = (tag, classes = [], styles = {}) => Object.entries({...getStyles(tag, classes), ...styles}).map(([propName, propVal]) => `${propName}: ${propVal};` ).join(" ");
        const hasInlineStyles = (tag, classes = [], styles = {}) => tag in CSS || Object.values(styles).length || Object.values(getStyles(tag, classes)).length;
        const Tag = (content, tag, classes = [], styles = {}, attributes = {}) => {
            if (hasInlineStyles(tag, classes, styles)) {
                Object.assign(attributes, {style: parseStyleLine(tag, classes, styles)});
            }
            const tagHTML = [
                `<${tag.toLowerCase()} `,
                Object.entries(attributes).map(([attrName, attrVal]) => `${attrName}="${attrVal}"` ).join(" "),
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
            return tagHTML.join("")
                .replace(/\\~/gu, "@@tilde@@") // Protect escaped tildes
                .replace(/~/gu, "&shy;"); // Turn unescaped tildes into soft hyphen breaks
        };
        // #endregion _______ Parsing Functions _______

        // #region ========== Elements: Basic Element Constructors by Tag ===========
        const baseElements = {
            Div: (content, classes = [], styles = {}, attributes = {}) => Tag(content, "div", classes, styles, attributes),
            Span: (content, classes = [], styles = {}, attributes = {}) => Tag(content, "span", classes, styles, attributes),
            P: (content, classes = [], styles = {}, attributes = {}) => Tag(content, "p", classes, styles, attributes),
            Img: (content, classes = [], styles = {}, attributes = {}) => Tag(false, "img", classes, styles, attributes),
            A: (content, classes = [], styles = {}, attributes = {}) => Tag(content, "a", classes, styles, attributes),
            Pre: (content, classes = [], styles = {}, attributes = {}) => Tag(content, "pre", classes, styles, attributes),
            H1: (content, classes = [], styles = {}, attributes = {}) => Tag(content, "h1", classes, styles, attributes),
            H2: (content, classes = [], styles = {}, attributes = {}) => Tag(content, "h2", classes, styles, attributes),
            H3: (content, classes = [], styles = {}, attributes = {}) => Tag(content, "h3", classes, styles, attributes)
        };
        // #endregion _______ Elements _______

        // #endregion ░░░░[PARSING]░░░░

        // #region ░░░░░░░[CUSTOM ELEMENTS]░░░░ Shorthand Element Constructors for Common Use Cases ░░░░░░
        const customElements = {
            Box: (content, classes = [], styles = {}) => H.Div(content, ["box", ...classes], styles),
            Block: (content, classes = [], styles = {}) => H.Div(content, ["block", ...classes], styles),
            Subtitle: (content, classes = [], styles = {}) => H.Div(content, ["subtitle", ...classes], styles),
            ButtonRound: (command, classes = [], styles = {}, attributes = {}) => H.Span(H.A("&nbsp;", ["button"], {}, {href: command}), ["buttonRound", ...classes], styles, attributes),
            Paras: (content) => [content].flat().map((para) => H.P(para)).join(""),
            Spacer: (height) => H.Div("&nbsp;", ["spacer"], {height: `${height}px`.replace(/pxpx$/u, "px")}),
            Footer: (content, classes = [], styles = {}, attributes = {}) => H.Div(content || "&nbsp;", ["footer", ...classes], styles, attributes),
            ButtonH1: (command, content, classes = [], styles = {}, attributes = {}) => H.H1(H.A(content, ["button"], {}, {href: command}), ["button", ...classes], styles, attributes),
            ButtonH2: (command, content, classes = [], styles = {}, attributes = {}) => H.H1(H.A(content, ["button"], {}, {href: command}), ["button", ...classes], styles, attributes),
            ButtonH3: (command, content, classes = [], styles = {}, attributes = {}) => H.H1(H.A(content, ["button"], {}, {href: command}), ["button", ...classes], styles, attributes),
            ButtonFooter: (command, content, classes = [], styles = {}, attributes = {}) => H.Footer(H.A(content || "&nbsp;", ["button"], {}, {href: command}), classes, styles, attributes),
            Command: (command, classes = [], styles = {}, attributes = {}) => H.Span(command, ["commandHighlight", ...classes], styles, attributes),
            ButtonCommand: (command, classes = [], styles = {}, attributes = {}) => H.Command(H.A(command, ["button"], {}, {href: command}), ["shiftLeft", ...classes], styles, attributes),
            ButtonToggle: ([title, body], command, classes = [], styles = {}, attributes = {}) => H.Div([
                H.Div(title, ["toggleButtonTitle"]),
                H.Div(body, ["toggleButtonBody"]),
                H.Div(H.A(null, ["button"], {}, {href: command}), ["toggleButtonRight"], {}, attributes)
            ], ["block", "toggleButton", ...classes], styles)
        };
        // #endregion ░░░░[CUSTOM ELEMENTS]░░░░

        // #region ░░░░░░░[HELP MESSAGES]░░░░ Main Intro/Help Message for EunoScripts ░░░░░░

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
                H.Block([
                    H.ButtonRound("https://github.com/Eunomiac/EunosRoll20Scripts/releases", ["titleButtons"], {}, {title: "Download the most recent version."}),
                    H.ButtonRound("https://app.roll20.net/forum/permalink/10184021/", ["titleButtons"], {}, {title: "Join the discussion in the Roll20 forum thread."}),
                    H.ButtonRound("https://github.com/Eunomiac/EunosRoll20Scripts/issues", ["titleButtons"], {}, {title: "Report bugs, make suggestions and track issues."})
                ], ["titleButtons"]),
                H.Block([
                    H.Paras([
                        "<b><u>Euno~miac's Roll20 Scripts</u></b> is a col~lec~tion of stand-alone scripts, each in~tended to pro~vide com~pre~hen~sive con~trol over a par~tic~u~lar as~pect of the Roll20 VTT. You can learn more about each of the avail~able scripts be~low, and keep ap~prised of new fea~tures, fixes and fu~ture plans through~out dev~elop~ment by vis~it~ing the links above."
                    ]),
                    H.H2("General Chat Commands"),
                    H.Spacer(5),
                    H.Paras([
                        [H.ButtonCommand("!euno", ["shiftLeft"]), " — View this help mes~sage."]
                    ]),
                    H.Spacer(5),
                    H.H2("Available Scripts"),
                    H.Paras("Click the but~tons be~low to learn more about each of <b><u>Euno~miac's Roll20 Scripts</u></b>, all of which are in vary~ing sta~ges of de~vel~op~ment:"),
                    H.ButtonH1("!etc", [H.Span("!ETC", ["buttonLabel"], {}), H.Span(" - Euno's Text Controls", ["buttonDesc"])], ["tight", "alignLeft"], {"text-indent": "10px"}, {title: "Eunomiac's Text Controls: A comprehensive solution to managing Roll20 text objects."}),
                    H.ButtonH1("!egc", [H.Span("!EGC", ["buttonLabel"], {}), H.Span(" - Euno's Grab Controls", ["buttonDesc"])], ["tight", "bronze", "alignLeft"], {"text-indent": "10px"}, {title: "Eunomiac's Grab Controls: Create buttons and switches in the sandbox for your players to interact with."}),
                    H.ButtonH1("!ehc", [H.Span("!EHC", ["buttonLabel"], {}), H.Span(" - Euno's HTML Controls", ["buttonDesc"])], ["tight", "bronze", "alignLeft"], {"text-indent": "10px"}, {title: "Eunomiac's HTML Controls: Create handouts and character bios using full HTML & CSS."}),
                    H.Spacer(5),
                    H.H2("Configuration"),
                    H.P("Con~fig~u~ra~tion op~tions for every script in <b><u>Euno~miac's Roll20 Scripts</u></b> col~lec~tion is con~tained in 'EunoCONFIG.js', which you'll find in the API Scripts sec~tion of your game page. Fur~ther in~struc~tions on how to con~fig~ure the scripts to your lik~ing are lo~cated there."),
                    options.isAutoDisplaying ? H.Spacer(5) : H.Spacer(1),
                    options.isAutoDisplaying ? H.P(`To pre~vent this mes~sage from dis~play~ing at start~up, click the chev~ron be~low. <i>(View this mes~sage at any time via the ${H.Command("!euno")} command.)</i>`) : ""
                ], [], {"margin-top": "-130px"}),
                options.isAutoDisplaying ? H.ButtonFooter("!euno toggle intro", "", ["hideIntro"]) : H.Footer()
            ]));
        };
        // #endregion ░░░░[HELP MESSAGES]░░░░

        return {
            // [FRONT: Initialization]
            Preinitialize, Initialize,

            // [PARSING]
            Tag,
            ... baseElements,

            // [CUSTOM ELEMENTS]
            ... customElements,

            // [HELP MESSAGES]
            DisplayHelp
        };

    })();

    return {
        Preinitialize, Initialize, ReportReady,

        UTILITIES,
        OBJECTS,
        HTML
    };
})();
// #endregion ▄▄▄▄▄ EunoLIB ▄▄▄▄▄

EunoCORE.regSCRIPT("EunoLIB", EunoLIB);
void MarkStop("EunoLIB");