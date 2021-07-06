void MarkStart("EunoLIB");
log("Starting!");
/******▌████████████████████████████████████████████████████████████▐******\
|*     ▌█░░░░ EunoLIB: Common Functions for EunosRoll20Scripts ░░░░█▐     *|
|*     ▌████████████████████████████████████████████████████████████▐     *|
|*     ▌████████████████████████ v0.13-alpha ███████████████████████▐     *|
|*     ▌███████████████████████ June 25, 2021 ██████████████████████▐     *|
|*     ▌██░░░░ https://github.com/Eunomiac/EunosRoll20Scripts ░░░░██▐     *|
\******▌████████████████████████████████████████████████████████████▐******/

const EunoCORE = {
    ROOTNAME: "Euno", // Namespace under global state variables

    _scripts: {}, // Installed scripts will register themselves here.
    regSCRIPT: (name, script) => { EunoCORE._scripts[name] = script },
    get SCRIPTS() { return EunoCORE._scripts },

    get ROOT() { // Returns state namespace
        state[EunoCORE.ROOTNAME] = state[EunoCORE.ROOTNAME] || {};
        return state[EunoCORE.ROOTNAME];
    },
    getSTATE: (scriptName) => { // Returns local script state namespace
        EunoCORE.ROOT[scriptName] = EunoCORE.ROOT[scriptName] || {};
        return EunoCORE.ROOT[scriptName];
    },
    UpdateNamespace: () => { /* Checks & Migration functions required for version update */ return true },

    // Script initialization calls.
    Preinitialize: () => Object.values(EunoCORE.SCRIPTS).filter((script) => "Preinitialize" in script).forEach((script) => script.Preinitialize()),
    Initialize: () => Object.values(EunoCORE.SCRIPTS).filter((script) => "Initialize" in script).forEach((script) => script.Initialize()),

    // ████████ [EunoCORE.C] Global References & Constants ████████
    /**
     * @global
     * @name C */
    C: {

        // #region ░░░░░░░[COLORS]░░░░ Color Definitions ░░░░░░
        COLORS: {
            // Black / Grey / White
            black: "#000",
            // get grey10() { return EunoCORE.U.ScaleColor("#FFF", 0.1) },
            // get grey25() { return EunoCORE.U.ScaleColor("#FFF", 0.25) },
            // get grey() { return EunoCORE.U.ScaleColor("#FFF", 0.50) },
            // get grey75() { return EunoCORE.U.ScaleColor("#FFF", 0.75) },
            // get grey90() { return EunoCORE.U.ScaleColor("#FFF", 0.9) },
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
            titleETC: ["bookends", "titleETC.png", [283, 142] ],
            titleSubETC: ["bookends", "titleSubETC.png", [283, 60] ],
            bgChatGold: ["backgrounds", "chatBGGold.jpg", [283, 563] ],
            bgChatSilver: ["backgrounds", "chatBGSilver.jpg", [283, 563] ],
            footerGold: ["bookends", "footerGold.png", [283, 37] ],
            footerSilver: ["bookends", "footerSilver.png", [283, 37] ],
            footerGoBackGold: ["bookends", "footerGoBackGold.png", [283, 37] ],
            footerGoBackSilver: ["bookends", "footerGoBackSilver.png", [283, 37] ],
            footerHideIntroGold: ["bookends", "footerHideIntroGold.png", [283, 37] ],
            buttonDownload: ["buttons", "buttonDownload.png", [50, 50] ],
            buttonChat: ["buttons", "buttonChat.png", [50, 50] ],
            buttonBug: ["buttons", "buttonBug.png", [50, 50] ],
            h1Gold: ["emphasis", "h1Gold.png", [283, 40]],
            h1Silver: ["emphasis", "h1Silver.png", [283, 40]],
            h1FlagGold: ["emphasis", "h1FlagGold.png", [283, 40]],
            h1FlagSilver: ["emphasis", "h1FlagSilver.png", [283, 40]],
            h2Gold: ["emphasis", "h2Gold.png", [283, 37]],
            h2Silver: ["emphasis", "h2Silver.png", [283, 37]],
            h2FlagGold: ["emphasis", "h2FlagGold.png", [283, 37]],
            h2FlagSilver: ["emphasis", "h2FlagSilver.png", [283, 37]],
            h3BGBlack: ["backgrounds", "h3BGBlack.jpg", [626, 626]],
            commandGold: ["emphasis", "commandGold.png", [235, 37]],
            commandSilver: ["emphasis", "commandSilver.png", [235, 37]]
        },
        GetImgURL: (imgKey, imgFolder) => {
            if (!imgFolder && imgKey in EunoCORE.C.IMAGES) {
                [imgFolder, imgKey] = EunoCORE.C.IMAGES[imgKey];
            }
            return [EunoCORE.C.IMGROOT, imgFolder.toLowerCase(), imgKey].join("/");
        },
        GetImgSize: (imgKey) => [...EunoCORE.C.IMAGES[imgKey]].pop()
        // #endregion ░░░░[IMAGES]░░░░

    },

    // Shorthand getters for major script components
    get CFG() { return EunoCONFIG },
    get LIB() { return EunoLIB },
    get U() { return EunoLIB.UTILITIES },
    get O() { return EunoLIB.OBJECTS },
    get H() { return EunoLIB.HTML }
};
on("ready", () => {
    if (EunoCORE.UpdateNamespace()) {
        // Preinitialize each major script component, then finalize initialization.
        //   - Delays are necessary to ensure each step completes for all scripts before moving to the next.
        setTimeout(EunoCORE.Preinitialize, 1000);
        setTimeout(EunoCORE.Initialize, 2000);
        return true;
    } else {
        return log("[Euno] ERROR: Failure to Update 'Euno' Namespace.");
    }
});
// #endregion ▄▄▄▄▄ TOP ▄▄▄▄▄


// #region ████████ EunoLIB: Library of Script Dependencies ████████
/**
 * EunoLIB Library Namespace.
 * @namespace
 */
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
    const {C} = EunoCORE;
    /* eslint-disable */
    let CFG;
    let LIB;
    /**
     * @borrows UTILITIES as U
     */
    let U;
    let O,
        H;
    const Preinitialize = (isResettingState = false) => {
        try { EunoCONFIG } catch (noConfigError) { return log("[Euno] Error: Can't find 'EunoCONFIG.js'. Is it installed?") }
        // Reset script state entry, if specified
        if (isResettingState) { delete RO.OT[SCRIPTNAME] }

        // Initialize script state entry with default values where needed
        Object.entries(DEFAULTSTATE)
            .filter(([key]) => !(key in STA.TE))
            .forEach(([key, defaultVal]) => { STA.TE[key] = defaultVal });

        // Define local-scope shorthand references for main script components
        ({CFG, LIB, U, O, H} = EunoCORE);

        // Preinitialize EunoLIB sub-scripts
        ["UTILITIES", "OBJECTS", "HTML"].forEach((subScriptName) => EunoLIB[subScriptName].Preinitialize());
    };
    const Initialize = (isRegisteringEventListeners = false, isResettingState = false) => {
        // Report readiness of EunoCONFIG (verified in Preinitialize)
        U.Flag("EunoCONFIG Ready!");

        // Reset script state entry, if specified
        if (isResettingState) { Preinitialize(true) }

        // Register event handlers, if specified
        if (isRegisteringEventListeners) { /* 'on()' event handlers, if any */ }

        // Initialize EunoLIB sub-scripts
        ["UTILITIES", "OBJECTS", "HTML"].forEach((subScriptName) => EunoLIB[subScriptName].Initialize(isRegisteringEventListeners));

        // Report readiness
        U.Flag(`${SCRIPTNAME} Ready!`); log(`[Euno] ${SCRIPTNAME} Ready!`);

        // Display Help message, if so configured
        if (STA.TE.isDisplayingHelpAtStart) {H.DisplayHelp({isAutoDisplaying: true})}
        // setTimeout(H.DisplayETCHelp, 1500);
    };
    // #endregion _______ Initialization _______

    // #endregion ░░░░[FRONT]░░░░

    const UTILITIES = (() => {
            
        /** ████████ [EunoLIB.U] Global Utility Functions ████████
         * @alias UTILITIES
         * @namespace
         */
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

        /**
         * @function GetR20Type
         * @memberof UTILITIES
         * @description Returns specific type/subtype of R20 object, or false if val isn't an R20 object.
         *
         * @param {*} val            the value to retrieve the type of
         * @return {string|boolean}  the Roll20 type, or "token", "card", "animation" where applicable, or false if not a Roll20 object.
         */
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
        /**
         * @function GetType
         * @memberof UTILITIES
         * @description More discerning 'typeof' replacement: Handles number types and Roll20 object types. 
         * Note: Be aware this function returns "int"/"float" for strings that can be parsed into those types,
         * "id" for strings that could be Roll20 object ids, and "hex", "hexa", "rgb", "rgba", "hsl", "hsla"
         * for strings that are HTML/CSS color values
         * 
         * @param {*} val             the value to retrieve the type of
         * @return {string}           the type of val
         */
        const GetType = (val) => { // 
            // 
            const valType = Object.prototype.toString.call(val).slice(8, -1).toLowerCase().trim();
            switch (valType) {
                case "string": {
                    if (/^(#[A-Fa-f0-9]{3}|#[A-Fa-f0-9]{6})/u.test(val)) { return "hex" }
                    if (/^#[A-Fa-f0-9]{8}$/u.test(val)) { return "hexa" }
                    if (/^rgb\((\s*\d{1,3}[,\s)]){3}$/u.test(val)) { return "rgb" }
                    if (/^rgba\((\s*\d{1,3}[,\s)]){3}(\s*[\d\.]+[,\s)])$/u.test(val)) { return "rgba" }
                    if (/^hsl\((\s*[\d\.%]+[,\s)]){3}$/u.test(val)) { return "hsl" }
                    if (/^hsla\((\s*[\d\.%]+[,\s)]){3}(\s*[\d\.]+[,\s)])$/u.test(val)) { return "hsla" }
                    if (/^(-|\+)?[\d,]+$/.test(val)) { return "int" }
                    if (/^(-|\+|\d)[\d,\s]*\.[\d\s]*$/u.test(val)) { return "float" }
                    if (/^-[a-zA-Z0-9_-]{19}$/u.test(val)) { return "id" }
                    break;
                }
                case "number": return /\./u.test(`${val}`) ? "float" : "int";
                case "object": return GetR20Type(val) || "list";
                // no default
            }
            return valType;
        };
        // #endregion ░░░░[Validation]░░░░

        // #region ░░░░░░░[Conversion]░░░░ Converting Data Types & Formats ░░░░░░
        const HexToDec = (hex) => hex
            .toLowerCase()
            .replace(/[^a-z0-9]/gu, "")
            .split("")
            .reverse()
            .reduce((tot, digit, i) => tot + Math.pow(16, i) * [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "a", "b", "c", "d", "e", "f"].findIndex((val) => `${val}` === digit), 0);
        const DecToHex = (dec) => {
            const hex = [];
            let quot = parseInt(dec);
            do {
                hex.push([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "a", "b", "c", "d", "e", "f"][quot % 16]);
                quot = Math.floor(quot/16);
            } while (quot > 0);
            return hex.reverse().join("");
        };
            // #endregion ░░░░[Conversion]░░░░

        // #region ░░░░░░░[Scaling]░░░░ Scaling & Related Manipulation of Values ░░░░░░
        const ScaleColor = (colorRef, scaleFactor = 1) => {
            const colorVals = [];
            const colorRefType = GetType(colorRef);
            switch (colorRefType) {
                case "hex": case "hexa": {
                    colorRef = colorRef.replace(/[^A-Za-z0-9]/gu, "");
                    if (colorRef.length === 3) { colorRef = colorRef.split("").map((h) => `${h}${h}`).join("") }
                    if (colorRef.length === 6) { colorRef += "FF" }
                    colorVals.push(...colorRef.match(/.{2}/g).map((hex) => HexToDec(hex)));
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
                case "hex": case "hexa": return `#${colorVals.map((val) => DecToHex(val)).join("")}`;
                default: return `${GetType(colorRef)}(${colorVals.join(", ")})`;
            }
        };
            // #endregion ░░░░[Scaling]░░░░

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

        // #region ========== Type Conversion: To Numbers, Objects ===========
        const ParseStrings = (val) => [val].flat().map((str) => { // Converts strings into appropriate data type
            switch(GetType(val)) {
                case "int": return parseInt(val);
                case "float": return parseFloat(val);
                default: {
                    switch(`${val}`.toLowerCase()) {
                        case "true": return true;
                        case "false": return false;
                        case "null": return null;
                        case "undefined": return undefined;
                        default: return val;
                    }
                }
            }
        });
        const ParseParams = (val, delim = ",", propDelim = ":") => Object.fromEntries(val // Converts comma-delimited <key>:<val> pairs to object.
            .split(delim)
            .map((kvPair) => kvPair.split(propDelim)));
        const JS = (val) => JSON.stringify(val, null, 2) // Stringification for display in R20 chat.
            .replace(/\n/g, "<br>")
            .replace(/ /g, "&nbsp;");
        const JC = (val) => H.Pre(JS(val)); // Stringification for data objects and other code for display in R20 chat.
        // #endregion _______ Type Conversion _______

        // #region ========== Numbers to Strings: Convert Numbers to Words, Signed Numbers, Ordinals, Roman Numerals ===========
        const NumToWords = (num) => {};
        const NumToOrdinal = (num) => {};
        const NumToRoman = (num) => {};
        const NumToSignedNum = (num) => {num = ParseStrings(num); return `${num >= 0 ? "+" : "-"}${Math.abs(num)}`};
        // #endregion _______ Numbers to Strings _______

        // #endregion ░░░░[Strings]░░░░

        // #region ░░░░░░░[Chat]░░░░ Basic Chat Messages ░░░░░░
        const randStr = () => _.sample("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split(""), 4).join("");
        const Alert = (content, title, headerLevel = 1, classes = [], options = {noarchive: true}) => { // Simple alert to the GM. Style depends on presence of content, title, or both.
            if (content !== false && (content || title)) {
                if (title) {
                    if (content === null) {
                        sendChat(randStr(), `/w gm ${H.Box(H.Block(H[`H${headerLevel}`](title, classes), {padding: 0}), {"min-height": "unset"})}`, null, options);
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
        const Show = (obj, title = "Showing ...") => Alert(JC(obj), title); // Show properties of stringified object to GM.
        const Flag = (msg, headerLevel = 1, classes = []) => Alert(null, msg, headerLevel, ["flag", ...classes]); // Simple one-line chat flag sent to the GM.
        // #endregion ░░░░[Chat]░░░░

        // #region ░░░░░░░[Arrays & Objects]░░░░ Array & Object Processing ░░░░░░
        const KVPMap = (obj, keyFunc = (x) => x, valFunc) => {
            /* An object-equivalent Array.map() function, which accepts mapping functions to transform both keys and values.
            *      If only one function is provided, it's assumed to be mapping the values and will receive (v, k) args. */
            [valFunc, keyFunc] = [valFunc, keyFunc].filter((x) => typeof x === "function" || typeof x === "boolean");
            keyFunc = keyFunc || ((k) => k);
            valFunc = valFunc || ((v) => v);
            const newObj = {};
            Object.entries(obj).forEach(([key, val]) => {
                newObj[keyFunc(key, val)] = valFunc(val, key);
            });
            return newObj;
        };
            // #endregion ░░░░[Arrays & Objects]░░░░

        return {
            // [FRONT: Initialization]
            Preinitialize, Initialize,

            // [Validation]
            GetR20Type, GetType,

            // [Conversion]
            HexToDec, DecToHex,

            // [Scaling]
            ScaleColor,

            // [Strings: Case Conversion]
            UCase, LCase, SCase, TCase,
            // [Strings: Type Conversion]
            ParseStrings, ParseParams, JS, JC,
            // [Strings: Numbers to Strings]
            NumToWords, NumToOrdinal, NumToRoman, NumToSignedNum,

            // [Chat]
            Alert, Direct, Show, Flag,

            // [Arrays & Objects]
            KVPMap
        };
    })();

    /** ████████ [EunoLIB.O] Roll20 Object Manipulation ████████
     * @global
     * @namespace O
     */
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

        // #region ░░░░░░░[Selections]░░░░ Extracting Selected Objects from API Chat Messages ░░░░░░
        const GetSelObjs = (msg, type = "text") => { // Returns an array of selected objects.
            if (msg.selected && msg.selected.length) {
                return msg.selected.filter((objData) => objData._type === type).map((objData) => getObj(type, objData._id));
            }
            return [];
        };
        // #endregion ░░░░[Selections]░░░░

        return {
            Preinitialize, Initialize,

            GetSelObjs
        };

    })();

    /** ████████ [EunoLIB.H] HTML/CSS Parsing & Styling for Chat & Handouts ████████
     * @global
     * @namespace H
     */
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
                shifts: {top: -26, right: 0, bottom: -7, left: -45}
            },
            bodyFontSize: 13
        };
        const cssBaseTagStyles = {
            "div": {
                display: "block",
                width: "auto", height: "auto",
                margin: "0", padding: "0",
                color: C.COLORS.palegold,
                "font-size": "0",
                border: "none", outline: "none", "text-shadow": "none", "box-shadow": "none",
                overflow: "hidden"
            },
            "span": {
                display: "inline-block",
                padding: "0",
                "color": "inherit",
                "font-family": "inherit",
                "font-size": "inherit",
                "font-weight": "inherit",
                "line-height": "inherit",
                "vertical-align": "baseline"
            },
            "p": {
                display: "block",
                margin: "6px 3px",
                "font-size": `${cssVars.bodyFontSize}px`,
                "font-family": "Tahoma, sans-serif",
                "line-height": `${1.5 * cssVars.bodyFontSize}px`,
                "text-align": "left"
            },
            "pre": {
                "margin": "0", "padding": "0",
                "font-family": "'Fira Code', Input, monospace",
                "font-size": "10px",
                "font-weight": "normal",
                "background-color": C.COLORS.grey75
            },
            "img": {display: "block"},
            "a": {
                display: "inline-block",
                width: "90%",
                margin: "0",
                padding: "5px",
                background: "none",
                "color": C.COLORS.black,
                "font-family": "inherit",
                "font-size": "inherit",
                "font-weight": "bold",
                "line-height": "inherit",
                "vertical-align": "inherit",
                "text-decoration": "none",
                "outline": "none", "border": "none"
            },
            "h1": {
                display: "block",
                height: "43px",
                "width": `${cssVars.boxPosition.width}px`,
                margin: "20px 0 -10px -6px",
                "font-family": "Impact, sans-serif",
                "line-height": "28px",
                "font-size": "24px",
                "font-weight": "normal",
                color: C.COLORS.black,
                "text-align": "center",
                "background-image": `url('${C.GetImgURL("h1Gold")}')`,
                "background-size": C.GetImgSize("h1Gold").map((dim) => `${dim}px`).join(" ")
            },
            "h2": { // background: bg-color bg-image position/bg-size bg-repeat bg-origin bg-clip bg-attachment initial|inherit;
                display: "block",
                height: "26px",
                "width": `${cssVars.boxPosition.width}px`,
                "margin": "5px 0 0px -6px",
                "font-family": "'Trebuchet MS', sans-serif",
                "line-height": "23px",
                "font-size": "16px",
                color: C.COLORS.black,
                "text-indent": "10px",
                "background-image": `url('${C.GetImgURL("h2Gold")}')`
            },
            "h3": {
                display: "block",
                width: "100%",
                "font-family": "'Trebuchet MS', sans-serif",
                "line-height": "20px",
                "margin": "0 0 9px 0",
                color: C.COLORS.gold,
                "text-indent": "4px",
                "background-image": `url('${C.GetImgURL("h3BGBlack")}')`,
                "text-shadow": "1px 1px 2px rgba(255, 255, 255, 0.8), -1px -1px 2px rgb(0, 0, 0), -1px -1px 2px rgb(0, 0, 0), -1px -1px 2px rgb(0, 0, 0)"
            }
        };
        const cssClassStyles = {
            "box": {
                "width": `${cssVars.boxPosition.width}px`,
                "min-width": `${cssVars.boxPosition.width}px`,
                "min-height": "39px",
                "margin": `${cssVars.boxPosition.shifts.top}px ${cssVars.boxPosition.shifts.right}px ${cssVars.boxPosition.shifts.bottom}px ${cssVars.boxPosition.shifts.left}px`,
                "text-align": "center",
                "position": "relative",
                "background-image": `url('${C.GetImgURL("bgChatGold")}')`,
                "background-size": "100%"
            },
            "block": {
                "min-width": `${cssVars.boxPosition.width - 24}px`,
                "margin": "2px 0 0 0",
                "padding": "0 6px",
                "text-align": "left"
            },
            "title": {
                "width": "100%",
                "margin": "0 0 -30px 0",
                color: C.COLORS.black,
                "font-family": "Impact, sans-serif",
                "line-height": "36px",
                "font-size": "24px",
                "font-weight": "normal",
                "text-align": "center"
            },
            "title.main": {
                "height": `${C.GetImgSize("titleMain").pop()}px`,
                "background-image": `url('${C.GetImgURL("titleMain")}')`,
                "background-size": C.GetImgSize("titleMain").map((dim) => `${dim}px`).join(" ")
            },
            "title.etc": {
                "height": `${C.GetImgSize("titleETC").pop()}px`,
                "background-image": `url('${C.GetImgURL("titleETC")}')`,
                "background-size": C.GetImgSize("titleETC").map((dim) => `${dim}px`).join(" "),
                "margin-bottom": "-65px"
            },
            "subtitle": {
                "width": "100%",
                "margin": "0 0 0 0",
                "color": C.COLORS.black,
                "font-family": "Impact, sans-serif",
                "line-height": "36px",
                "font-size": "24px",
                "font-weight": "noraml",
                "text-align": "center"
            },
            "subtitle.etc": {
                "height": `${C.GetImgSize("titleSubETC").pop()}px`,
                "background-image": `url('${C.GetImgURL("titleSubETC")}')`,
                "background-size": C.GetImgSize("titleSubETC").map((dim) => `${dim}px`).join(" ")
            },
            "flag": {
                margin: "0",
                "text-align": "left",
                "text-indent": "40px"
            },
            "h1.flag": {
                "height": "31px",
                "line-height": "29px",
                "background-image": `url('${C.GetImgURL("h1FlagGold")}')`
            },
            "h1.silver": {"background-image": `url('${C.GetImgURL("h1Silver")}')`},
            "h1.flag.silver": {"background-image": `url('${C.GetImgURL("h1FlagSilver")}')`},
            "h1.tight": {
                height: "28px",
                "margin-top": "2px",
                "margin-bottom": "0px"
            },
            "h2.flag": {
                height: "24px",
                "line-height": "21px",
                "background-image": `url('${C.GetImgURL("h2FlagGold")}')`,
                "background-position": "center -2px"
            },
            "h2.silver": {"background-image": `url('${C.GetImgURL("h2Silver")}')`},
            "h2.flag.silver": {"background-image": `url('${C.GetImgURL("h2FlagSilver")}')`},
            "commandHighlight": {
                margin: "0 3px",
                padding: "0 8px 0 6px",
                color: C.COLORS.black,
                "font-family": "monospace",
                "font-weight": "bolder",
                "text-shadow": `0 0 1px ${C.COLORS.black}`,
                "background-image": `url('${C.GetImgURL("commandGold")}')`,
                "background-size": "100% 100%",
                "background-repeat": "no-repeat"
            },
            "commandHighlight.silver": {"background-image": `url('${C.GetImgURL("commandSilver")}')`},
            "commandHighlight.shiftLeft": {
                "margin": "0 0 0 -20px",
                "padding-right": "17px",
                "text-align": "right",
                "text-indent": "14px",
                "background-position": "right"
            },
            "footer": {
                "height": "37px",
                "margin": "6px 0 0 0",
                "background-image": `url('${C.GetImgURL("footerGold")}')`,
                "background-size": "100%",
                "background-repeat": "no-repeat",
                "font-weight": "normal"
            },
            "footer.silver": {"background-image": `url('${C.GetImgURL("footerSilver")}')`},
            "footer.hideIntro": {"background-image": `url('${C.GetImgURL("footerHideIntroGold")}')`},
            "footer.goBack": {"background-image": `url('${C.GetImgURL("footerGoBackGold")}')`},
            "footer.goBack.silver": {"background-image": `url('${C.GetImgURL("footerGoBackSilver")}')`},
            "a.button": {
                "display": "block",
                "height": "100%", "width": "100%",
                "margin": "0", "padding": "0",
                "text-align": "inherit",
                "font-family": "inherit",
                "font-size": "inherit",
                "line-height": "inherit",
                "font-weight": "inherit",
                "text-transform": "inherit",
                "color": "inherit"
            },
            "span.buttonRound": {
                "height": "50px",
                "width": "50px",
                "margin": "0 15px"
            },
            "span.buttonRound.download": {"background-image": `url('${C.GetImgURL("buttonDownload")}')`},
            "span.buttonRound.chat": {"background-image": `url('${C.GetImgURL("buttonChat")}')`},
            "span.buttonRound.bug": {"background-image": `url('${C.GetImgURL("buttonBug")}')`},
            "fade50": {opacity: "0.5"}
        };
        // #endregion ░░░░[STYLES]░░░░

        // #region ░░░░░░░[PARSING]░░░░ Parsing Style Data to Inline CSS ░░░░░░

        // #region ========== Parsing Functions: Functions for Parsing to Inline CSS ===========
        const getClassStyleData = (tag, classes = []) => {
            classes = [classes].flat();
            const styleData = {};

            // Locate styles for exact class references
            classes.forEach((classRef) => Object.assign(styleData, cssClassStyles[classRef] || {}));

            // Overwrite with more-specific combination references
            Object.keys(cssClassStyles).filter((classRef) => classRef.includes(".")
                                                             && classRef.split(/\./gu).every((className) => classes.includes(className)))
                .forEach((classRef) => Object.assign(styleData, cssClassStyles[classRef]));

            // Now, repeat for more-specific references that begin with the element's tag
            const tagClassRefs = Object.keys(cssClassStyles).filter((classRef) => classRef.startsWith(`${tag.toLowerCase()}.`));
            tagClassRefs.filter((classRef) => classes.includes(classRef.replace(new RegExp(`^${tag.toLowerCase()}\.`), "")))
                .forEach((classRef) => Object.assign(styleData, cssClassStyles[classRef]));

            // Finally, repeat for more-specific combo references that begin with the element's tag
            tagClassRefs.filter((classRef) => classRef.replace(new RegExp(`^${tag.toLowerCase()}\.`), "").split(/\./gu).every((className) => classes.includes(className)))
                .forEach((classRef) => Object.assign(styleData, cssClassStyles[classRef]));

            return Object.fromEntries(Object.entries(styleData).filter(([propName, propVal]) => propVal !== null));
        };
        const getStyleData = (tag, classes = [], styles = {}) => ({
            ... (cssBaseTagStyles[(tag || "").toLowerCase()] || {}), // 1) Apply base tag style.
            ... getClassStyleData(tag, classes), //                          2) Apply class styles.
            ... styles //                                               3) Apply custom (inline) styles.
        });
        const parseBGStyle = (bgData = {}) => [
            bgData.color || false,
            bgData.image && `url('${C.GetImgURL(bgData.image)})` || bgData.gradient,
            [bgData.position, bgData.size].filter((prop) => Boolean(prop)).join("/"),
            bgData.repeat,
            bgData.origin,
            bgData.clip,
            bgData.attachment
        ].filter((prop) => Boolean(prop)).join(" ");
        const parseStyleLine = (tag, classes = [], styles = {}) => Object.entries(getStyleData(tag, classes, styles)).map(([propName, propVal]) => `${propName}: ${propVal};` ).join(" ");
        const hasInlineStyles = (tag, classes = [], styles = {}) => tag in cssBaseTagStyles || Object.values(styles).length || Object.values(getClassStyleData(tag, classes)).length;
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
        const Div = (content, classes = [], styles = {}, attributes = {}) => Tag(content, "div", classes, styles, attributes);
        const Span = (content, classes = [], styles = {}, attributes = {}) => Tag(content, "span", classes, styles, attributes);
        const P = (content, classes = [], styles = {}, attributes = {}) => Tag(content, "p", classes, styles, attributes);
        const Img = (content, classes = [], styles = {}, attributes = {}) => Tag(false, "img", classes, styles, attributes);
        const A = (content, classes = [], styles = {}, attributes = {}) => Tag(content, "a", classes, styles, attributes);
        const H1 = (content, classes = [], styles = {}, attributes = {}) => Tag(content, "h1", classes, styles, attributes);
        const H2 = (content, classes = [], styles = {}, attributes = {}) => Tag(content, "h2", classes, styles, attributes);
        const H3 = (content, classes = [], styles = {}, attributes = {}) => Tag(content, "h3", classes, styles, attributes);
        // #endregion _______ Elements _______

        // #endregion ░░░░[PARSING]░░░░

        // #region ░░░░░░░[CUSTOM ELEMENTS]░░░░ Shorthand Element Constructors for Common Use Cases ░░░░░░
        const Box = (content, styles) => Div(content, ["box"], styles);
        const Block = (content, styles) => Div(content, ["block"], styles);
        const ButtonRound = (command, classes = [], styles = {}, attributes = {}) => Span(A("&nbsp;", ["button"], {}, {href: command}), ["buttonRound", ...classes], styles, attributes);
        const Paras = (content) => [content].flat().map((para) => P(para)).join("");
        const Spacer = (height) => Div("&nbsp;", ["spacer"], {height: `${height}px`.replace(/pxpx$/u, "px")});
        const Footer = (content, classes = [], styles = {}, attributes = {}) => Div(content || "&nbsp;", ["footer", ...classes], styles, attributes);
        const ButtonH1 = (command, content, classes = [], styles = {}, attributes = {}) => H1(A(content, ["button"], {}, {href: command}), ["button", ...classes], styles, attributes);
        const ButtonH2 = (command, content, classes = [], styles = {}, attributes = {}) => H1(A(content, ["button"], {}, {href: command}), ["button", ...classes], styles, attributes);
        const ButtonH3 = (command, content, classes = [], styles = {}, attributes = {}) => H1(A(content, ["button"], {}, {href: command}), ["button", ...classes], styles, attributes);
        const ButtonFooter = (command, content, classes = [], styles = {}, attributes = {}) => Footer(A(content || "&nbsp;", ["button"], {}, {href: command}), classes, styles, attributes);
        const Command = (command, classes = [], styles = {}, attributes = {}) => Span(command, ["commandHighlight", ...classes], styles, attributes);
        const ButtonCommand = (command, classes = [], styles = {}, attributes = {}) => Command(A(command, ["button"], {}, {href: command}), ["shiftLeft", ...classes], styles, attributes);
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
           █ ░       https://www.google.com/search?q=dictionary#dobs=necessary
           █
           █ ░░░░ EXCEPTIONS TO THE GENERAL RULE ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
           █ ░    (a) NEVER place two-letter syllables on the next line               (NOT e.g. "ful~ly"; "strick~en")
           █ ░        NEVER divide a word into one-letter syllables                   (NOT e.g. "e~ven", "a~gain", "e~nough")
           █          NEVER place a soft/liquid L syllable on the next line           (NOT e.g. "possi~ble", "princi~ples")
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
        /**
        * Displays top-level help message for script collection to GM.
        * @param {Object} [options] - Options affecting display of help message: isAutoDisplaying (boolean)
        */
        /**
         *
         *
         * @param {*} [options={}]
         */
        /**
         *
         *
         * @param {Object} [options] - Options affecting display of help message: isAutoDisplaying (boolean)* @param {Object} myObj description
         * @param {boolean} options.a description
         */
        const DisplayHelp = (options) => {
            U.Alert(H.Box([
                H.Span(null, ["title", "main"]),
                H.Block([
                    H.ButtonRound("https://github.com/Eunomiac/EunosRoll20Scripts/releases", ["download"], {margin: "0 5px 20px 5px"}, {title: "Download the most recent version."}),
                    H.ButtonRound("https://app.roll20.net/forum/permalink/10184021/", ["chat"], {margin: "0 5px 8px 5px"}, {title: "Join the discussion in the Roll20 forum thread."}),
                    H.ButtonRound("https://github.com/Eunomiac/EunosRoll20Scripts/issues", ["bug"], {margin: "0 5px 20px 5px"}, {title: "Report bugs, make suggestions and track issues."})
                ], {"text-align": "center", "margin": "-10px 0 -15px 0"}),
                H.Block([
                    H.Paras([
                        "<b><u>Euno~miac's Roll20 Scripts</u></b> is a col~lec~tion of stand-alone scripts, each in~tended to pro~vide com~pre~hen~sive con~trol over a par~tic~u~lar as~pect of the Roll20 VTT. You can learn more about each of the avail~able scripts be~low.",
                        "Keep ap~prised of new fea~tures, fixes and fu~ture plans as dev~elop~ment pro~ceeds through al~pha by vis~it~ing the links above."
                    ]),
                    H.H2("General Chat Commands"),
                    H.Spacer(5),
                    H.Paras([
                        [H.ButtonCommand("!euno", ["shiftLeft"]), " — View this help mes~sage."]
                    ]),
                    H.Spacer(5),
                    H.H2("Available Scripts"),
                    H.Paras("Click the but~tons be~low to learn more about each of <b><u>Euno~miac's Roll20 Scripts</u></b>, all of which are in vary~ing sta~ges of de~vel~op~ment:"),
                    H.ButtonH1("!etc", "!ETC", ["tight"], {}, {title: "Eunomiac's Text Controls: A comprehensive solution to managing Roll20 text objects."}),
                    H.ButtonH1("!egc", "!EGC", ["tight", "fade50"], {}, {title: "Eunomiac's Grab Controls: Create buttons and switches in the sandbox for your players to interact with."}),
                    H.ButtonH1("!ehc", "!EHC", ["tight", "fade50"], {}, {title: "Eunomiac's HTML Controls: Create handouts and character bios using full HTML & CSS."}),
                    H.Spacer(5),
                    H.H2("Configuration"),
                    H.P("Con~fig~u~ra~tion op~tions for every script in <b><u>Euno~miac's Roll20 Scripts</u></b> col~lec~tion is con~tained in 'EunoCONFIG.js', which you'll find in the API Scripts sec~tion of your game page. Fur~ther in~struc~tions on how to con~fig~ure the scripts to your lik~ing are lo~cated there."),
                    options.isAutoDisplaying ? H.Spacer(5) : H.Spacer(1),
                    options.isAutoDisplaying ? H.P(`To pre~vent this mes~sage from dis~play~ing at start~up, click the chev~ron be~low. <i>(View this mes~sage at any time via the ${H.Command("!euno")} command.)</i>`) : ""
                ]),
                options.isAutoDisplaying ? H.ButtonFooter("!euno toggle intro", "", ["hideIntro"]) : H.Footer()
            ]));
        };
        /** */
        const DisplayETCHelp = () => {
            U.Alert(H.Box([
                H.Span(null, ["title", "etc"]),
                H.Block([
                    H.P("<b>!ETC</b> is in~ten~ded to be a com~pre~hen~sive so~lu~tion to man~ag~ing Roll20 Text Ob~jects."),
                    H.H2("!ETC Chat Commands"),
                    H.Spacer(5),
                    H.Paras([
                        [H.ButtonCommand("!etc", ["shiftLeft"]), " — View this help mes~sage."],
                        [H.ButtonCommand("!etc setup", ["shiftLeft"]), " — Ac~ti~vate or de~ac~ti~vate any of the fea~tures in this script pack~age."],
                        [H.ButtonCommand("!etc reset all", ["shiftLeft"]), " — <b><u>FULLY</u> re~set <u>ALL</u></b> <b>!ETC</b> script fea~tures, re~turn~ing <b>!ETC</b> to its de~fault in~stal~la~tion state."]
                    ]),
                    H.Spacer(5),
                    H.H2("!ETC Features"),
                    H.Spacer(5),
                    H.Paras("Learn more about each of <b>!ETC</b>'s fea~tures by click~ing the head~ings be~low:"),
                    H.Spacer(5),
                    H.ButtonH1("!etc help shadow", "Text Drop Shadows", ["tight"], {}, {title: "Control drop shadow behavior."}),
                    H.ButtonH1("!etc help prune", "Empty Text Pruning", ["tight"], {}, {title: "Configure pruning of empty text objects."}),
                    H.H1("Attribute Linking", ["fade50", "tight"]),
                    H.H1("Table & Chart Styling", ["fade50", "tight"]),
                    H.H1("Timers & Calendars", ["fade50", "tight"]),
                    H.H1("Miscellaneous", ["fade50", "tight"]),
                    H.Spacer(5)
                ]),
                H.ButtonFooter("!euno", "", ["goBack"])
            ]));
        };
        // #endregion ░░░░[HELP MESSAGES]░░░░

        return {
            // [FRONT: Initialization]
            Preinitialize, Initialize,

            // [PARSING]
            Tag,
            Div, Span, P, Img, A, H1, H2, H3,

            // [CUSTOM ELEMENTS]
            Box, Block, ButtonRound, Paras, Spacer, Footer, ButtonH1, ButtonH2, ButtonH3, ButtonFooter, Command, ButtonCommand,

            // [HELP MESSAGES]
            DisplayHelp, DisplayETCHelp
        };

    })();

    return {
        Preinitialize, Initialize,

        UTILITIES,
        OBJECTS,
        HTML
    };
})();
// #endregion ▄▄▄▄▄ EunoLIB ▄▄▄▄▄

EunoCORE.regSCRIPT("EunoLIB", EunoLIB);
void MarkStop("EunoLIB");