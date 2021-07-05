void MarkStart("EunoLIB");
log("Starting!");
/******▌████████████████████████████████████████████████████████████▐******\
|*     ▌██▓▒░ EunoLIB: Common Functions for EunosRoll20Scripts ░▒▓██▐     *|
|*     ▌████████████████████████████████████████████████████████████▐     *|
|*     ▌█████████████████████▓▒░ v0.13-alpha ░▒▓████████████████████▐     *|
|*     ▌████████████████████▓▒░ June 25, 2021 ░▒▓███████████████████▐     *|
|*     ▌███▓▒░ https://github.com/Eunomiac/EunosRoll20Scripts ░▒▓███▐     *|
\******▌████████████████████████████████████████████████████████████▐******/

// #region █████▓▒░ TOP: Root-Level Namespacing, Initialization, On "Ready" Listener ░▒▓█████
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

    // █████▓▒░ [EunoCORE.C] Global References & Constants ░▒▓█████
    C: {

        // #region ░░░░▒▓█[COLORS]█▓▒░ Color Definitions ░░░░░░
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
        // #endregion ░▒▓█[COLORS]█▓▒░

        // #region ░░░░▒▓█[IMAGES]█▓▒░ Image Source URLs ░░░░░░
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
        // #endregion ░▒▓█[IMAGES]█▓▒░

    },

    // Shorthand getters for major script components
    get CFG() { return EunoCONFIG },
    get LIB() { return EunoLIB },
    get U() { log("U Called!"); return EunoLIB.UTILITIES },
    get O() { return EunoLIB.OBJECTS },
    get H() { return EunoLIB.HTML }
};
on("ready", () => {
    try { EunoCONFIG } catch (noConfigError) { return log("[Euno] Error: Can't find 'EunoCONFIG.js'. Is it installed?") }
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


// #region █████▓▒░ EunoLIB: Library of Script Dependencies ░▒▓█████
const EunoLIB = (() => {
    // #region ░░░░▒▓█[FRONT]█▓▒░ Boilerplate Namespacing & Initialization ░░░░░░

    // #region ========== Namespacing: Basic State References & Namespacing ===========
    const SCRIPTNAME = "EunoLIB";
    const DEFAULTSTATE = { /* initial values for state storage, if any */ };
    const RO = {get OT() { return EunoCORE.ROOT }};
    const STA = {get TE() { return EunoCORE.getSTATE(SCRIPTNAME) }};
    // #endregion _______ Namespacing _______

    // #region ========== Initialization: Script Startup & Event Listeners ===========
    const {C} = EunoCORE;
    let CFG, LIB, U, O, H;
    const Preinitialize = (isResettingState = false) => {
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
        // Reset script state entry, if specified
        if (isResettingState) { Preinitialize(true) }

        // Register event handlers, if specified
        if (isRegisteringEventListeners) { /* 'on()' event handlers, if any */ }

        // Initialize EunoLIB sub-scripts
        ["UTILITIES", "OBJECTS", "HTML"].forEach((subScriptName) => EunoLIB[subScriptName].Initialize(isRegisteringEventListeners));

        // Report readiness
        U.Flag(`${SCRIPTNAME} Ready!`);
        log(`[Euno] ${SCRIPTNAME} Ready!`);
    };
    // #endregion _______ Initialization _______

    // #endregion ░▒▓█[FRONT]█▓▒░

    // █████▓▒░ [EunoLIB.U] Global Utility Functions ░▒▓█████
    const UTILITIES = (() => {
        // #region ░░░░▒▓█[FRONT]█▓▒░ Boilerplate Namespacing & Initialization ░░░░░░

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
            Flag(`${SCRIPTNAME} Ready!`, 2);
            log(`[EunoLIB] ${SCRIPTNAME} Ready!`);
        };
        // #endregion _______ Initialization _______

        // #endregion ░▒▓█[FRONT]█▓▒░

        // #region ░░░░▒▓█[Validation]█▓▒░ Verification & Type Checking ░░░░░░
        const GetR20Type = (val) => { // Returns specific type/subtype of R20 object, or false if val isn't an R20 object.
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
        const GetType = (val) => { // More discerning 'typeof' replacement: Handles number types and Roll20 object types
            const valType = Object.prototype.toString.call(val).slice(8, -1).toLowerCase().trim();
            switch (valType) {
                case "string": {
                    if (/^(#[A-Fa-f0-9]{3}|#[A-Fa-f0-9]{6})/u.test(val)) { return "hex" }
                    if (/^#[A-Fa-f0-9]{8}$/u.test(val)) { return "hexa" }
                    if (/^rgb\((\s*\d{1,3}[,\s)]){3}$/u.test(val)) { return "rgb" }
                    if (/^rgba\((\s*\d{1,3}[,\s)]){3}(\s*[\d\.]+[,\s)])$/u.test(val)) { return "rgba" }
                    if (/^hsl\((\s*[\d\.%]+[,\s)]){3}$/u.test(val)) { return "hsl" }
                    if (/^hsla\((\s*[\d\.%]+[,\s)]){3}(\s*[\d\.]+[,\s)])$/u.test(val)) { return "hsla" }
                    break;
                }
                case "number": return /\./u.test(`${val}`) ? "float" : "int";
                case "object": return GetR20Type(val) || "list";
                // no default
            }
            return valType;
        };
        // #endregion ░▒▓█[Validation]█▓▒░

        // #region ░░░░▒▓█[Conversion]█▓▒░ Converting Data Types & Formats ░░░░░░
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
        // #endregion ░▒▓█[Conversion]█▓▒░

        // #region ░░░░▒▓█[Scaling]█▓▒░ Scaling & Related Manipulation of Values ░░░░░░
        const ScaleColor = (colorRef, scaleFactor = 1) => {
            const colorVals = [];
            console.log(`==== ${colorRef} ====`);
            const colorRefType = GetType(colorRef);
            switch (colorRefType) {
                case "hex": case "hexa": {
                    colorRef = colorRef.replace(/[^A-Za-z0-9]/gu, "");
                    if (colorRef.length === 3) { colorRef = colorRef.split("").map((h) => `${h}${h}`).join("") }
                    if (colorRef.length === 6) { colorRef += "FF" }
                    colorVals.push(...colorRef.match(/.{2}/g).map((hex) => HexToDec(hex)));
                    console.log(`${colorRef.match(/.{2}/g).join("|")} --- ${colorVals.join(", ")}`);
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
                console.log(colorVals);
            }
            switch (colorRefType) {
                case "hex": case "hexa": return `#${colorVals.map((val) => DecToHex(val)).join("")}`;
                default: return `${GetType(colorRef)}(${colorVals.join(", ")})`;
            }
        };
        // #endregion ░▒▓█[Scaling]█▓▒░

        // #region ░░░░▒▓█[String Parsing]█▓▒░ Parsing JSON & Inline CSS for Chat Output ░░░░░░
        const JS = (val) => JSON.stringify(val, null, 2).replace(/\n/g, "<br>").replace(/ /g, "&nbsp;"); // Stringification for display in R20 chat.
        const JC = (val) => H.Pre(JS(val)); // Stringification for data objects and other code for display in R20 chat.
        // #endregion ░▒▓█[String Parsing]█▓▒░

        // #region ░░░░▒▓█[Chat]█▓▒░ Basic Chat Messages ░░░░░░
        const Alert = (content, title, headerLevel = 1, classes = []) => { // Simple alert to the GM. Style depends on presence of content, title, or both.
            const randStr = () => _.sample("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split(""), 4).join("");
            if (content !== false && (content || title)) {
                if (title) {
                    if (content === null) {
                        sendChat(randStr(), `/w gm ${H.Box(H.Block(H[`H${headerLevel}`](title, classes), {padding: 0}), {"min-height": "unset"})}`, null, {noarchive: true});
                        /* {
                                "margin": "0px 0px -10px -14px",
                                "font-family": "Trebuchet MS",
                                "font-weight": "bold",
                                "font-variant": "small-caps",
                                "text-indent": "12px",
                                "font-size": "18px",
                                "line-height": "34px",
                                "text-align": "left"
                            })}`, null, {noarchive: true}); */
                    } else {
                        sendChat(randStr(), `/w gm ${H.Box(H.Block([
                            H[`H${headerLevel}`](title, classes),
                            H.Block(content)
                        ]))}`, null, {noarchive: true});
                        /* [
                            H.HTML.H(title, 1, {
                                "margin": "0px 0px -10px -14px",
                                "font-family": "Trebuchet MS",
                                "font-weight": "bold",
                                "font-variant": "small-caps",
                                "text-indent": "12px",
                                "font-size": "18px",
                                "line-height": "34px"
                            }),
                            H.HTML.Block(content)
                        ]))}`, null, {noarchive: true}); */
                    }
                } else {
                    sendChat(randStr(), `/w gm ${content}`, null, {noarchive: true});
                }
            }
        };
        const Show = (obj, title = "Showing ...") => Alert(JC(obj), title); // Show properties of stringified object to GM.
        const Flag = (msg, headerLevel = 1) => Alert(null, msg, headerLevel, ["flag"]); // Simple one-line chat flag sent to the GM.
        // #endregion ░▒▓█[Chat]█▓▒░

        // #region ░░░░▒▓█[Arrays & Objects]█▓▒░ Array & Object Processing ░░░░░░
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
        // #endregion ░▒▓█[Arrays & Objects]█▓▒░

        return {
            Preinitialize, Initialize,

            GetR20Type, GetType,
            HexToDec, DecToHex, ScaleColor,
            JS, JC,
            Alert, Show, Flag,
            KVPMap
        };

    })();

    // █████▓▒░ [EunoLIB.O] Roll20 Object Manipulation ░▒▓█████
    const OBJECTS = (() => {
        // #region ░░░░▒▓█[FRONT]█▓▒░ Boilerplate Namespacing & Initialization ░░░░░░

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
            U.Flag(`${SCRIPTNAME} Ready!`, 2);
            log(`[EunoLIB] ${SCRIPTNAME} Ready!`);
        };
        // #endregion _______ Initialization _______

        // #endregion ░▒▓█[FRONT]█▓▒░

        // #region ░░░░▒▓█[Selections]█▓▒░ Extracting Selected Objects from API Chat Messages ░░░░░░
        const GetSelObjs = (msg, type = "text") => { // Returns an array of selected objects.
            if (msg.selected && msg.selected.length) {
                return msg.selected.filter((objData) => objData._type === type).map((objData) => getObj(type, objData._id));
            }
            return [];
        };
        // #endregion ░▒▓█[Selections]█▓▒░

        return {
            Preinitialize, Initialize,

            GetSelObjs
        };

    })();

    // █████▓▒░ [EunoLIB.H] HTML/CSS Parsing & Styling for Chat & Handouts ░▒▓█████
    const HTML = (() => {
        // #region ░░░░▒▓█[FRONT]█▓▒░ Boilerplate Namespacing & Initialization ░░░░░░

        // #region ========== Namespacing: Basic State References & Namespacing ===========
        const SCRIPTNAME = "HTML";
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
            U.Flag(`${SCRIPTNAME} Ready!`, 2);
            log(`[EunoLIB] ${SCRIPTNAME} Ready!`);
        };
        // #endregion _______ Initialization _______

        // #endregion ░▒▓█[FRONT]█▓▒░

        // #region ░░░░▒▓█[STYLES]█▓▒░ CSS Class Style Definitions ░░░░░░
        const cssVars = {
            boxPosition: {
                width: 283,
                shifts: {top: -29, right: 0, bottom: -7, left: -45}
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
                margin: "10px",
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
            "img": {
                display: "block"
            },
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
                "vertical-align": "inherit"
            },
            "h1": {
                display: "block",
                height: "43px",
                width: "100%",
                margin: "20px 0 -10px 0",
                "font-family": "Impact, sans-serif",
                "line-height": "36px",
                "font-size": "24px",
                "font-weight": "normal",
                color: "black",
                "text-align": "center",
                "background-image": `url('${C.GetImgURL("h1Gold")}')`,
                "background-size": C.GetImgSize("h1Gold")
            },
            "h2": { // background: bg-color bg-image position/bg-size bg-repeat bg-origin bg-clip bg-attachment initial|inherit;
                display: "block",
                height: "26px",
                width: "100%",
                "margin": "15px 0 -5px 0",
                "font-family": "'Trebuchet MS', sans-serif",
                "line-height": "23px",
                "font-size": "16px",
                color: "black",
                "text-indent": "10px",
                "background-image": `url('${C.GetImgURL("h2Gold")}')`/* ,
                "background": parseBGStyle({
                    color: C.COLORS.black,
                    image: "h2Gold",
                    position: "center top",
                    repeat: "no-repeat",
                    origin: "border-box"
                }) */
            },
            "h3": {
                display: "block",
                width: "100%",
                "font-family": "'Trebuchet MS', sans-serif",
                "line-height": "20px",
                "margin": "0 0 9px 0",
                color: "gold",
                "text-indent": "4px",
                "background-image": `url('${C.GetImgURL("h3BGBlack")}')`/* ,
                "background": parseBGStyle({
                    color: C.COLORS.black,
                    image: "h3BGBlack",
                    position: "center top",
                    repeat: "no-repeat",
                    origin: "border-box"
                }) */,
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
                "padding": "0 12px",
                "text-align": "left"
            },
            "title": {
                "height": "142px",
                "width": "100%",
                "margin": "0 0 -30px 0",
                "background-image": `url('${C.GetImgURL("titleMain")}')`,
                "background-size": C.GetImgSize("titleMain"),
                color: C.COLORS.black,
                "font-family": "Impact, sans-serif",
                "line-height": "36px",
                "font-size": "24px",
                "font-weight": "normal",
                "text-align": "center"
            },
            "h1.flag": {
                "height": "31px",
                margin: "0",
                "text-align": "left",
                "line-height": "29px",
                "text-indent": "5px",
                "background-image": `url('${C.GetImgURL("h1FlagGold")}')`
            },
            "h1.silver": {
                "background-image": `url('${C.GetImgURL("h1Silver")}')`
            },
            "h1.flag.silver": {
                "background-image": `url('${C.GetImgURL("h1FlagSilver")}')`
            },
            "h2.flag": {
                height: "22px",
                margin: "0",
                "background-size": "283px 30px",
                "line-height": "19px",
                "background-image": `url('${C.GetImgURL("h2FlagGold")}')`
            },
            "h2.silver": {
                "background-image": `url('${C.GetImgURL("h2Silver")}')`
            },
            "h2.flag.silver": {
                "background-image": `url('${C.GetImgURL("h2FlagSilver")}')`
            },
            "commandHighlight": {
                padding: "0 7px 0 5px",
                color: C.COLORS.black,
                "font-family": "monospace",
                "font-weight": "bolder",
                "text-shadow": `0 0 1px ${C.COLORS.black}`,
                "background-image": `url('${C.GetImgURL("commandGold")}')`,
                "background-size": "cover",
                "background-repeat": "no-repeat"
            },
            "commandHighlight.silver": {
                "background-image": `url('${C.GetImgURL("commandSilver")}')`
            },
            "commandHighlight.shiftLeft": {
                "padding-right": "17px",
                "margin-left": "-20px",
                "text-align": "right",
                "text-indent": "14px",
                "background-position": "right"
            }
        };
        // #endregion ░▒▓█[STYLES]█▓▒░

        // #region ░░░░▒▓█[PARSING]█▓▒░ Parsing Style Data to Inline CSS ░░░░░░

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
            tagClassRefs.filter((classRef) => classRef.split(/\./gu).every((className) => classes.includes(className)))
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
                ">",
                ...(content === false // Passing 'false' to content indicates an element with no content to wrap (e.g. <img>)
                    ? [""]
                    : [...[content].flat(), `</${tag.toLowerCase()}>`]
                )
            ].join("");
            // sendChat("Check", `/w gm Returning: <pre>${_.escape(tagHTML)}</pre>`);
            return [
                `<${tag.toLowerCase()} `,
                Object.entries(attributes).map(([attrName, attrVal]) => `${attrName}="${attrVal}"` ).join(" "),
                ">",
                ...(content === false // Passing 'false' to content indicates an element with no content to wrap (e.g. <img>)
                    ? [""]
                    : [...[content].flat(), `</${tag.toLowerCase()}>`]
                )
            ].join("");
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
        // #endregion ░▒▓█[PARSING]█▓▒░

        // #region ░░░░▒▓█[CUSTOM ELEMENTS]█▓▒░ Shorthand Element Constructors for Common Use Cases ░░░░░░
        const Box = (content, styles = {}) => Div(content, ["box"], styles);
        const Block = (content, styles = {}) => Div(content, ["block"], styles);
        // #endregion ░▒▓█[CUSTOM ELEMENTS]█▓▒░

        return {
            Preinitialize, Initialize,

            Tag,
            Div, Span, P, Img, A, H1, H2, H3,

            Box, Block
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