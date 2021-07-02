
/******▌████████████████████████████████████████████████████████████▐******\
|*     ▌██▓▒░ EunoLIB: Common Functions for EunosRoll20Scripts ░▒▓██▐     *|
|*     ▌████████████████████████████████████████████████████████████▐     *|
|*     ▌█████████████████████▓▒░ v0.13-alpha ░▒▓████████████████████▐     *|
|*     ▌████████████████████▓▒░ June 25, 2021 ░▒▓███████████████████▐     *|
|*     ▌███▓▒░ https://github.com/Eunomiac/EunosRoll20Scripts ░▒▓███▐     *|
\******▌████████████████████████████████████████████████████████████▐******/

// #region █████▓▒░ Top-Level Namespacing & Initialization ░▒▓█████
const EUNOSCRIPTS = {
    get ROOTNAME() { return "Euno" }, // Namespace under global state variable
    get ROOT() { // Returns state namespace
        state[this.ROOTNAME] = state[this.ROOTNAME] || {};
        return state[this.ROOTNAME];
    },
    getSTATE: (scriptName) => { // Returns local script state namespace
        this.ROOT[scriptName] = this.ROOT[scriptName] || {};
        return this.ROOT[scriptName];
    },
    get SCRIPTS() { return [EunoLIB, ETC, EGC, EHC].filter((script) => Boolean(script)) },

    UpdateNamespace: () => { // Any checks or migration functions required on version update.
        return true;
    },

    // Script initialization calls.
    Preinitialize: () => this.SCRIPTS.forEach((script) => {
        if ("Preinitialize" in script) { script.Preinitialize() }
        Object.values(script)
            .filter((subScript) => subScript && typeof subScript === "object" && "Preinitialize" in subScript)
            .forEach((subScript) => subScript.Preinitialize());
    }),
    Initialize: () => this.SCRIPTS.forEach((script) => {
        if ("Initialize" in script) { script.Initialize() }
        Object.values(script)
            .filter((subScript) => subScript && typeof subScript === "object" && "Initialize" in subScript)
            .forEach((subScript) => subScript.Initialize());
    }),

    // Shorthand getters for major script components
    get CFG() { return EUNO_CONFIG },
    get M() { return EunoLIB.MASTER },
    get U() { return EunoLIB.UTILITIES },
    get O() { return EunoLIB.OBJECTS }
};

on("ready", () => {
    if (EUNOSCRIPTS.UpdateNamespace()) {
        // Preinitialize each major script component, then finalize initialization.
        //   - Delays are necessary to ensure each step completes for all scripts before moving to the next.
        setTimeout(EUNOSCRIPTS.Preinitialize, 1000);
        setTimeout(EUNOSCRIPTS.Initialize, 2000);
    } else {
        log("[Euno] ERROR: Failure to Update 'Euno' Namespace.");
    }
});
// #endregion ▄▄▄▄▄ Namespacing & Initialization ▄▄▄▄▄

const EunoLIB = (() => {

    // #region *** *** FRONT *** ***
    let CFG, M, U, O;

    // #region      Front: Basic References, State & Namespacing
    const SCRIPTNAME = "EunoLIB";
    const DEFAULTSTATE = { /* initial values for state storage, if any */ };
    const RO = {get OT() { return EUNOSCRIPTS.ROOT }};
    const STA = {get TE() { return EUNOSCRIPTS.getSTATE(SCRIPTNAME) }};
    // #endregion

    // #region      Front: Initialization
    const Preinitialize = (isResettingState = false) => {
        if (isResettingState) { delete RO.OT[SCRIPTNAME] } // reset script state entry
        Object.entries(DEFAULTSTATE) // initialize script state entry with default values where needed
            .filter(([key]) => !(key in STA.TE))
            .forEach(([key, defaultVal]) => { STA.TE[key] = defaultVal });
        ({CFG, M, U, O} = EUNOSCRIPTS); // declare local-scope shorthand for main script components
    };
    const Initialize = (isRegisteringEventListeners = false, isResettingState = false) => {
        if (isResettingState) { Preinitialize(true) } // reset script state entry
        if (isRegisteringEventListeners) { /* 'on()' event handlers, if any */ }
        U.Flag(`${SCRIPTNAME} Ready!`); log(`[Euno] ${SCRIPTNAME} Ready!`); // report readiness
    };
    // #endregion

    // #endregion *** *** FRONT *** ***

    const MASTER = (() => { //░░░░░▒▓█[EUNO.M]█▓▒░░░░░ Master Data Control, References & Constants ░░░░░░

        // #region *** *** FRONT *** ***

        // #region      Front: Basic References, State & Namespacing
        const SCRIPTNAME = "MASTER";
        const DEFAULTSTATE = { /* initial values for state storage, if any */ };
        const STA = {get TE() { return EUNOSCRIPTS.getSTATE(SCRIPTNAME) }};
        // #endregion

        // #region      Front: Initialization
        const Preinitialize = (isResettingState = false) => {
            if (isResettingState) { delete RO.OT[SCRIPTNAME] } // reset script state entry
            Object.entries(DEFAULTSTATE) // initialize script state entry with default values where needed
                .filter(([key]) => !(key in STA.TE))
                .forEach(([key, defaultVal]) => { STA.TE[key] = defaultVal });
        };
        const Initialize = (isRegisteringEventListeners = false, isResettingState = false) => {
            if (isResettingState) { Preinitialize(true) } // reset script state entry
            if (isRegisteringEventListeners) { /* 'on()' event handlers, if any */ }
            U.Flag(`${SCRIPTNAME} Ready!`); log(`[Euno] ${SCRIPTNAME} Ready!`); // report readiness
        };
        // #endregion

        // #endregion *** *** FRONT *** ***

        const IMGROOT = {
            general: "https://raw.githubusercontent.com/Eunomiac/EunosRoll20Scripts/master/images/",
            texture: "https://raw.githubusercontent.com/Eunomiac/EunosRoll20Scripts/master/images/textures/",
            button: "https://raw.githubusercontent.com/Eunomiac/EunosRoll20Scripts/master/images/buttons/"
        };
        const GetImgURL = (imgFileName, imgType = "general") => `${IMGROOT[imgType]}${imgFileName}`;
        const COLORS = {
            palegold: "#ffe775"
        };

        const CHATWIDTH = 283; // The minimum width of the chat panel, in pixels. Be sure to subtract twice any border widths.
        const UPSHIFT = -29;   // Constants governing how the chat box is positioned in the chat panel: By default, everything
        const LEFTSHIFT = -45; // shifts up and to the left to cover the standard chat output with the custom styles below.
        const BOTTOMSHIFT = -4;
        const HTML = {
            Box: (content, styles = {}, title = undefined) => `<div style="${U.Style(Object.assign({
                "display": "block",
                "width": "auto", "min-width": `${CHATWIDTH}px`,
                "height": "auto", "min-height": "39px",
                "margin": `${UPSHIFT}px 0 ${BOTTOMSHIFT}px ${LEFTSHIFT}px`,
                "padding": "0",
                "color": COLORS.palegold,
                "text-align": "center",
                "position": "relative",
                "text-shadow": "none", "box-shadow": "none", "border": "none",
                "background-image": `url('${GetImgURL("BG.jpg", "general")}')`,
                "background-size": "100%",
                "overflow": "hidden",
                "outline": "2px solid black"
            }, styles))}"${title ? ` title="${title}"` : ""}>${[content].flat().join("")}</div>`,
            Block: (content, styles = {}, title = undefined) => `<div style="${U.Style(Object.assign({
                "width": `${CHATWIDTH - 24}px`,
                "margin": "2px 0 0 0",
                "padding": "0 12px",
                "text-align": "left",
                "background": "none",
                "font-family": "serif",
                "font-weight": "normal",
                "font-size": "14px",
                "line-height": "18px"
            }, styles))}"${title ? ` title="${title}"` : ""}>${[content].flat().join("")}</div>`,
            Title: (content, styles = {}, title = undefined) => `<div style="${U.Style(Object.assign({
                "display": "block",
                "height": "142px",
                "width": "auto",
                "margin": "0 0 -30px 0",
                "background-image": `url('${GetImgURL("TOP.png", "general")}')`,
                "background-size": "cover",
                "font-weight": "normal",
                "border": "none", "box-shadow": "none", "text-shadow": "none"
            }, styles))}"${title ? ` title="${title}"` : ""}>${[content].flat().join("")}</div>`,
            Footer: (content, imgFileName = "BOTTOM.png", styles = {}, title = undefined) => `<div style="${U.Style(Object.assign({
                "display": "block",
                "height": "37px",
                "width": "auto",
                "margin": "6px 0 0 0",
                "background-image": `url('${GetImgURL(imgFileName, "general")}')`,
                "background-size": "100%",
                "background-repeat": "no-repeat",
                "font-weight": "normal",
                "border": "none", "box-shadow": "none", "text-shadow": "none"
            }, styles))}"${title ? ` title="${title}"` : ""}>${[content].flat().join("")}</div>`,
            CodeBlock: (content, styles = {}, title = undefined) => HTML.Block(content, Object.assign({
                "background": "white",
                "font-family": "monospace",
                "font-weight": "bold",
                "font-size": "10px"
            }, styles), title),
            CodeSpan: (content, styles = {}, title = undefined) => `<span style="${U.Style(Object.assign({
                "display": "inline-block",
                "font-family": "monospace",
                "font-weight": "bolder",
                "font-size": "12px",
                "color": "black",
                "text-shadow": "0 0 1px black",
                "background-image": `url('${GetImgURL("CodeSpanBG.png")}')`,
                "padding": "0 7px 0 5px",
                "background-size": "100% 100%"
            }, styles))}"${title ? ` title="${title}"` : ""}>${[content].flat().join("")}</span>`,
            ButtonCodeSpan: (content, command, styles = {}, title = undefined) => HTML.CodeSpan(HTML.A(content, command || content, Object.assign({}, styles, {
                display: "inline-block",
                width: "auto",
                height: "auto",
                "padding": "0",
                "margin": "0",
                "background": "none",
                "border-radius": "none",
                "border": "none",
                "text-align": "inherit",
                "font-family": "inherit",
                "font-size": "inherit",
                "line-height": "inherit",
                "font-weight": "inherit",
                "text-transform": "inherit",
                "color": "inherit"
            })), styles, title),
            ButtonH: (content, command, level = 2, styles = {}, title = undefined) => HTML.H(HTML.A(content, command, Object.assign({}, styles, {
                "display": "block",
                "width": "100%",
                "height": "100%",
                "padding": "0",
                "margin": "0",
                "background": "none",
                "border-radius": "none",
                "border": "none",
                "text-align": "inherit",
                "font-family": "inherit",
                "font-size": "inherit",
                "line-height": "inherit",
                "font-weight": "inherit",
                "text-transform": "inherit",
                "color": "inherit"
            })), level, styles, title),
            ButtonFooter: (imgFileName, command, styles = {}, title = undefined) => HTML.Footer(HTML.A("", command, Object.assign({}, styles, {
                "display": "block",
                "width": "100%",
                "height": "100%",
                "padding": "0",
                "margin": "0",
                "background": "none",
                "border-radius": "none",
                "border": "none",
                "text-align": "inherit",
                "font-family": "inherit",
                "font-size": "inherit",
                "line-height": "inherit",
                "font-weight": "inherit",
                "text-transform": "inherit",
                "color": "inherit"
            })), imgFileName, styles, title),
            ButtonWide: (name, command, styles = {}, title = undefined) => `<span style="${U.Style(Object.assign({
                "display": "inline-block",
                "width": "100%",
                "text-align": "center",
                "vertical-align": "baseline",
                "margin": "0",
                "float": "none"
            }, _.pick(styles, "display", "width", "text-align", "vertical-align", "margin", "float")))}"${title ? ` title="${title}"` : ""}>${HTML.A(name, command, _.omit(styles, "display", "width", "text-align", "vertical-align", "margin", "float"), title)}</span>`,
            ButtonRound: (imgName, command, styles = {}, title = undefined) => {
                return `<span style="${U.Style(Object.assign({}, {
                    "display": "inline-block",
                    "width": "50px",
                    "height": "50px",
                    "margin": "0 15px",
                    "background-image": `url('${GetImgURL(imgName, "button")}')`
                }, _.pick(styles, "display", "width", "line-height", "margin", "float")))}"${title ? ` title="${title}"` : ""}>${HTML.A("", command, Object.assign({}, styles, {
                    "display": "block",
                    "width": "50px",
                    "height": "50px",
                    "padding": "0",
                    "margin": "0",
                    "background": "none",
                    "border-radius": "none",
                    "border": "none"
                }), title)}</span>`;
            },
            A: (content, command, styles = {}, title = undefined) => {
                return `<a href="${command}" style="${U.Style(Object.assign({
                    display: "inline-block",
                    width: "90%",
                    padding: "5px",
                    "margin-top": "0",
                    background: "gold",
                    color: "black",
                    "font-family": "sans-serif",
                    "text-transform": "uppercase",
                    "font-weight": "bold",
                    "border-radius": "10px",
                    border: "2px outset #666",
                    "font-size": "14px",
                    "line-height": "18px"
                }, styles))}">${[content].flat().join("")}</a>`;
            },
            H: (content, level = 2, styles = {}, title = undefined) => `<h${level} style="${U.Style(Object.assign([
                null, // <H0>
                { // <H1>
                    display: "block",
                    height: "43px", width: "288px",
                    margin: "20px 0px -10px -14px",
                    "font-family": "Impact",
                    "line-height": "36px",
                    "font-size": "24px",
                    "font-weight": "normal",
                    color: "black",
                    "text-align": "center",
                    "background-image": `url('${GetImgURL("H1.png")}')`,
                    "background-size": "100% 100%"
                },
                { // <H2>
                    display: "block",
                    height: "26px", width: "285px",
                    "margin": "15px 0 -5px -13px",
                    "font-family": "Trebuchet MS",
                    "line-height": "26px",
                    "font-size": "16px",
                    color: "black",
                    "text-indent": "10px",

                    "background-image": `url('${GetImgURL("H2.png")}')`,
                    "background-size": "cover"
                },
                { // <H3>
                    display: "block",
                    "font-family": "sans-serif",
                    "line-height": "20px",
                    "margin": "0 0 9px -1%",
                    color: "gold",
                    "text-indent": "4px",
                    width: "102%",
                    "background-image": `url('${GetImgURL("blackLeather_1.jpg", "texture")}')`,
                    "text-shadow": "1px 1px 2px rgba(255, 255, 255, 0.8), -1px -1px 2px rgb(0, 0, 0), -1px -1px 2px rgb(0, 0, 0), -1px -1px 2px rgb(0, 0, 0)"
                },
                { // <H4>
                    display: "block",
                    width: "102%",
                    color: "gold",
                    "font-size": "16px",
                    "line-height": "20px",
                    "font-family": "sans-serif",
                    "border-bottom": "2px solid gold",
                    "border-top": "2px solid gold",
                    "margin": "0 0 5px -1%",
                    "text-indent": "4px",
                    "background-image": `url('${GetImgURL("blackLeather_1.jpg", "texture")}')`,
                    "text-shadow": "1px 1px 2px rgba(255, 255, 255, 0.8), -1px -1px 2px rgb(0, 0, 0), -1px -1px 2px rgb(0, 0, 0), -1px -1px 2px rgb(0, 0, 0)"
                },
                { // <H5>
                }
            ][level], styles))}"${title ? ` title="${title}"` : ""}>${[content].flat().join("")}</h${level}>`,
            Spacer: (height, display = "block") => `<span style="${U.Style({display, height})}">&nbsp;</span>`,
            Paras: (content, styles = {}) => [content].flat().map((para) => `<p style="${U.Style(Object.assign({
                "margin": "10px 0",
                "line-height": "18px",
                "font-family": "Tahoma"
            }, styles))}">${para}</p>`).join(""),
            Span: (content, styles = {}, title = undefined) => `<span style="${U.Style(Object.assign({
                "display": "inline-block",
                "width": "auto",
                "background": "none",
                "color": "gold",
                "font-size": "14px",
                "line-height": "18px"
            }, styles))}"${title ? ` title="${title}"` : ""}>${[content].flat().join("")}</span>`, //  bgColor = "none", color = "black", fontSize = "14px", lineHeight = "18px") =>
            Img: (imgSrc, styles = {}, title = undefined) => `<img src="${imgSrc}" style="${U.Style(styles)}"${title ? ` title="${title}"` : ""}>`
        };

        return {
            Preinitialize, Initialize,
            CHATWIDTH, UPSHIFT, LEFTSHIFT, BOTTOMSHIFT, COLORS,
            HTML
        };
    })();

    const UTILITIES = (() => { //░░▒▓█[EUNO.U]█▓▒░░ Global Utility Functions ░░░░░░

        // #region *** *** FRONT *** ***

        // #region      Front: Basic References, State & Namespacing
        const SCRIPTNAME = "UTILITIES";
        const DEFAULTSTATE = { /* initial values for state storage, if any */ };
        const STA = {get TE() { return EUNOSCRIPTS.getSTATE(SCRIPTNAME) }};
        // #endregion

        // #region      Front: Initialization
        const Preinitialize = (isResettingState = false) => {
            if (isResettingState) { delete RO.OT[SCRIPTNAME] } // reset script state entry
            Object.entries(DEFAULTSTATE) // initialize script state entry with default values where needed
                .filter(([key]) => !(key in STA.TE))
                .forEach(([key, defaultVal]) => { STA.TE[key] = defaultVal });
        };
        const Initialize = (isRegisteringEventListeners = false, isResettingState = false) => {
            if (isResettingState) { Preinitialize(true) } // reset script state entry
            if (isRegisteringEventListeners) { /* 'on()' event handlers, if any */ }
            U.Flag(`${SCRIPTNAME} Ready!`); log(`[Euno] ${SCRIPTNAME} Ready!`); // report readiness
        };
        // #endregion

        // #endregion *** *** FRONT *** ***

        // #region *** *** Validation & Type Checking *** ***
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
        const GetType = (val) => {
            const valType = Object.prototype.toString.call(val).slice(8, -1).toLowerCase();
            switch (valType) {
                case "number": return /\./u.test(`${val}`) ? "float" : "int";
                case "object": return GetR20Type(val) || "list";
                default: return valType;
            }
        };
        // #endregion *** *** Validation *** ***

        // #region *** *** Parsing JSON & Inline CSS for Chat Output *** ***
        const JS = (val) => JSON.stringify(val, null, 2).replace(/\n/g, "<br>").replace(/ /g, "&nbsp;"); // Stringification for display in R20 chat.
        const JC = (val) => M.HTML.CodeBlock(JS(val)); // Stringification for data objects and other code for display in R20 chat.
        const Style = (styleData) => { // Parse object containing CSS styles to inline style attribute.
            if (typeof styleData === "string") {
                return styleData.replace(/\s{2,}/gu, " ").replace(/'(serif|sans-serif|monospace)'/gu, "$1");
            } else {
                return Object.entries(styleData).map(([prop, val]) => `${prop}: ${val}`).join("; ").replace(/'(serif|sans-serif|monospace)'/gu, "$1");
            }
        };
        // #endregion

        // #region *** *** Basic GM Alerts & Flags *** ***
        const Alert = (content, title) => { // Simple alert to the GM. Style depends on presence of content, title, or both.
            const randStr = () => _.sample("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split(""), 4).join("");
            if (content !== false && (content || title)) {
                if (title) {
                    if (content === null) {
                        sendChat(randStr(), `/w gm ${M.HTML.Box(M.HTML.Block([
                            M.HTML.H(title, 1, {
                                "margin": "0px 0px -10px -14px",
                                "font-family": "Trebuchet MS",
                                "font-weight": "bold",
                                "font-variant": "small-caps",
                                "text-indent": "12px",
                                "font-size": "18px",
                                "line-height": "34px",
                                "text-align": "left"
                            })]))}`, null, {noarchive: true});
                    } else {
                        sendChat(randStr(), `/w gm ${M.HTML.Box(M.HTML.Block([
                            M.HTML.H(title, 1, {
                                "margin": "0px 0px -10px -14px",
                                "font-family": "Trebuchet MS",
                                "font-weight": "bold",
                                "font-variant": "small-caps",
                                "text-indent": "12px",
                                "font-size": "18px",
                                "line-height": "34px"
                            }),
                            M.HTML.Block(content)
                        ]))}`, null, {noarchive: true});
                    }
                } else {
                    sendChat(randStr(), `/w gm ${content}`, null, {noarchive: true});
                }
            }
        };
        const Show = (obj, title = "Showing ...") => Alert(JC(obj), title); // Show properties of stringified object to GM.
        const Flag = (msg) => Alert(null, `[Euno] ${msg}`.replace(/\[Euno\]\s*\[Euno\]/gu, "[Euno]")); // Simple one-line chat flag sent to the GM.
        // #endregion *** *** Basic GM Alerts *** ***

        // #region *** *** Roll20 Objects *** ***
        const GetSelObjs = (msg, type = "text") => { // Returns an array of selected objects.
            if (msg.selected && msg.selected.length) {
                return msg.selected.filter((objData) => objData._type === type).map((objData) => getObj(type, objData._id));
            }
            return [];
        };
        // #endregion *** *** Roll20 Objects *** ***

        // #region *** *** Array & Object Processing *** ***
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
        // #endregion *** *** Array & Object Processing *** ***

        return {
            Preinitialize, Initialize,

            GetR20Type, GetType,
            JS, JC, Style,
            Alert, Show, Flag,
            GetSelObjs,
            KVPMap
        };

    })();

    const OBJECTS = (() => { //░░░░▒▓█[EUNO.O]█▓▒░░░░ Roll20 Object Manipulation ░░░░░░

        // #region *** *** FRONT *** ***

        // #region      Front: Basic References, State & Namespacing
        const SCRIPTNAME = "OBJECTS";
        const DEFAULTSTATE = { /* initial values for state storage, if any */ };
        const STA = {get TE() { return EUNOSCRIPTS.getSTATE(SCRIPTNAME) }};
        // #endregion

        // #region      Front: Initialization
        const Preinitialize = (isResettingState = false) => {
            if (isResettingState) { delete RO.OT[SCRIPTNAME] } // reset script state entry
            Object.entries(DEFAULTSTATE) // initialize script state entry with default values where needed
                .filter(([key]) => !(key in STA.TE))
                .forEach(([key, defaultVal]) => { STA.TE[key] = defaultVal });
        };
        const Initialize = (isRegisteringEventListeners = false, isResettingState = false) => {
            if (isResettingState) { Preinitialize(true) } // reset script state entry
            if (isRegisteringEventListeners) { /* 'on()' event handlers, if any */ }
            U.Flag(`${SCRIPTNAME} Ready!`); log(`[Euno] ${SCRIPTNAME} Ready!`); // report readiness
        };
        // #endregion

        // #endregion *** *** FRONT *** ***

        return {
            Preinitialize, Initialize
        };

    })();

    return {
        Preinitialize, Initialize,

        MASTER,
        UTILITIES,
        OBJECTS
    };
})();
