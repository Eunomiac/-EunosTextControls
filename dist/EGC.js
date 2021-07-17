// #region █████▓▒░ CONFIGURATION: Advanced Settings & Options ░▒▓█████

const EUNO_EGC_CONFIG = {
    // #region ░▒▓█[Global]█▓▒░ Configuration: Global Settings ░░░░░░

    // #endregion ░[Global]░░░░
};

// #endregion ▄▄▄▄▄ CONFIGURATION ▄▄▄▄▄

// #region █████▓▒░ Top-Level Namespacing, Updating & Validation ░▒▓█████
const EUNO_EGC_ROOTNAME = "Euno";
// #endregion ▄▄▄▄▄ Top-Level Namespacing ▄▄▄▄▄

const EunosGrabControls = (() => {
    const RO = {get OT() { // "RO.OT" Reference to 'state.Euno'
        state[EUNO_EGC_ROOTNAME] = state[EUNO_EGC_ROOTNAME] || {};
        return state[EUNO_EGC_ROOTNAME];
    }};
    const EUNO = { // Shorthand getters for major script components
        get D() { return EunosGrabControls.DATA },
        get U() { return EunosGrabControls.UTILITIES },
        get M() { return EunosGrabControls.MASTER },
        get G() { return EunosGrabControls.GrabPadControl },
        get CFG() { return EUNO_EGC_CONFIG }
    };
    const UpdateNamespace = () => { // Any processes necessary to update to latest version.
        return true;
    };
    return {
        RO, EUNO, UpdateNamespace,
        // #region ░▒▓█[EUNO.D]█▓▒░ Global Data & Constants ░░░░░░
        DATA: (() => {
            // #region *** *** FRONT *** ***

            // #region      Front: Basic References, State & Namespacing
            const SCRIPTNAME = "Data";
            const DEFAULTSTATE = { // Initial values for state storage.
            };

            let D, U, M, G, CFG;
            const STA = {get TE() { return (RO.OT && SCRIPTNAME in RO.OT) ? RO.OT[SCRIPTNAME] : false}};
            // #endregion

            // #region      Front: Initialization
            const Preinitialize = (isResettingState = false) => {
                // Initialize state storage with DEFAULTSTATE where needed.
                if (isResettingState) { delete RO.OT[SCRIPTNAME] }
                RO.OT[SCRIPTNAME] = RO.OT[SCRIPTNAME] || {};
                Object.entries(DEFAULTSTATE)
                    .filter(([key]) => !(key in STA.TE))
                    .forEach(([key, defaultVal]) => { STA.TE[key] = defaultVal });

                // Declare local-scope shorthand for main script components.
                ({D, U, M, G, CFG} = EunosGrabControls.EUNO);
            };
            const Initialize = (isRegisteringEventListeners = false, isResettingState = false) => {
                if (isResettingState) { Preinitialize(true) }

                // Register event handlers for chat commands and text object changes.
                if (isRegisteringEventListeners) {
                    // Register event handlers here.
                }

                // Report Readiness.
                U.Flag(`${SCRIPTNAME} Ready!`);
                log(`[EGC] ${SCRIPTNAME} Ready!`);
            };
            // #endregion

            // #endregion *** *** FRONT *** ***

            const IMGROOT = {
                general: "https://raw.githubusercontent.com/Eunomiac/-EunosGrabControls/ClassRefactor/images/",
                texture: "https://raw.githubusercontent.com/Eunomiac/-EunosGrabControls/ClassRefactor/images/textures/",
                button: "https://raw.githubusercontent.com/Eunomiac/-EunosGrabControls/ClassRefactor/images/buttons/"
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
                Footer: (content, styles = {}, title = undefined) => `<div style="${U.Style(Object.assign({
                    "display": "block",
                    "height": "37px",
                    "width": "auto",
                    "margin": "6px 0 0 0",
                    "background-image": `url('${GetImgURL("BOTTOM.png", "general")}')`,
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
        })(),
        // #endregion ░[EunosGrabControls.EUNO.D]░░░░

        // #region ░▒▓█[EUNO.U]█▓▒░ Global Utility Functions ░░░░░░
        UTILITIES: (() => {
            // #region *** *** FRONT *** ***

            // #region      Front: Basic References, State & Namespacing
            const SCRIPTNAME = "Utilities";
            const DEFAULTSTATE = { // Initial values for state storage.
            };

            let D, U, M, G, CFG;
            const STA = {get TE() { return (RO.OT && SCRIPTNAME in RO.OT) ? RO.OT[SCRIPTNAME] : false}};
            // #endregion

            // #region      Front: Initialization
            const Preinitialize = (isResettingState = false) => {
                // Initialize state storage with DEFAULTSTATE where needed.
                if (isResettingState) { delete RO.OT[SCRIPTNAME] }
                RO.OT[SCRIPTNAME] = RO.OT[SCRIPTNAME] || {};
                Object.entries(DEFAULTSTATE)
                    .filter(([key]) => !(key in STA.TE))
                    .forEach(([key, defaultVal]) => { STA.TE[key] = defaultVal });

                // Declare local-scope shorthand for main script components.
                ({D, U, M, G, CFG} = EunosGrabControls.EUNO);;
            };
            const Initialize = (isRegisteringEventListeners = false, isResettingState = false) => {
                if (isResettingState) { Preinitialize(true) }

                // Register event handlers for chat commands and text object changes.
                if (isRegisteringEventListeners) {
                    // Register event handlers here.
                }

                // Report Readiness.
                U.Flag(`${SCRIPTNAME} Ready!`);
                log(`[EGC] ${SCRIPTNAME} Ready!`);
            };
            // #endregion
            // #endregion

            const throttleTimers = {};

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
            const JC = (val) => D.HTML.CodeBlock(JS(val)); // Stringification for data objects and other code for display in R20 chat.
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
                if (content || title) {
                    if (title) {
                        if (content === null) {
                            sendChat(randStr(), `/w gm ${D.HTML.Box(D.HTML.Block([
                                D.HTML.H(title, 1, {
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
                            sendChat(randStr(), `/w gm ${D.HTML.Box(D.HTML.Block([
                                D.HTML.H(title, 1, {
                                    "margin": "0px 0px -10px -14px",
                                    "font-family": "Trebuchet MS",
                                    "font-weight": "bold",
                                    "font-variant": "small-caps",
                                    "text-indent": "12px",
                                    "font-size": "18px",
                                    "line-height": "34px"
                                }),
                                D.HTML.Block(content)
                            ]))}`, null, {noarchive: true});
                        }
                    } else {
                        sendChat(randStr(), `/w gm ${content}`, null, {noarchive: true});
                    }
                }
            };
            const Show = (obj, title = "Showing ...") => Alert(JC(obj), title); // Show properties of stringified object to GM.
            const Flag = (msg) => Alert(null, `[EGC] ${msg}`.replace(/\[EGC\]\s*\[EGC\]/gu, "[EGC]")); // Simple one-line chat flag sent to the GM.
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
        })(),
        // #endregion ░[EunosGrabControls.EUNO.U]░░░░

        // #region ░▒▓█[EUNO.M]█▓▒░ Global Control, Toggle & Event Listener Functions ░░░░░░
        MASTER: (() => {
            // #region *** *** FRONT *** ***

            // #region      Front: Basic References, State & Namespacing
            const SCRIPTNAME = "MASTER";
            const DEFAULTSTATE = { // Initial values for state storage.
            };

            let D, U, M, G, CFG;
            const STA = {get TE() { return (RO.OT && SCRIPTNAME in RO.OT) ? RO.OT[SCRIPTNAME] : false}};
            // #endregion

            // #region      Front: Initialization
            const Preinitialize = (isResettingState = false) => {
                // Initialize state storage with DEFAULTSTATE where needed.
                if (isResettingState) { delete RO.OT[SCRIPTNAME] }
                RO.OT[SCRIPTNAME] = RO.OT[SCRIPTNAME] || {};
                Object.entries(DEFAULTSTATE)
                    .filter(([key]) => !(key in STA.TE))
                    .forEach(([key, defaultVal]) => { STA.TE[key] = defaultVal });

                // Declare local-scope shorthand for main script components.
                ({D, U, M, G, CFG} = EunosGrabControls.EUNO);;
            };
            const Initialize = (isRegisteringEventListeners = false, isResettingState = false) => {
                if (isResettingState) { Preinitialize(true) }

                // Register event handlers for chat commands and text object changes.
                if (isRegisteringEventListeners) {
                    // Register event handlers here.
                }

                // Report Readiness.
                U.Flag(`${SCRIPTNAME} Ready!`);
                log(`[EGC] ${SCRIPTNAME} Ready!`);
            };
            // #endregion
            // #endregion
            return {Preinitialize, Initialize};
        })(),
        // #endregion ░[EunosGrabControls.EUNO.M]░░░░

        // #region ░▒▓█[EUNO.G]█▓▒░ Grab-Pad Control ░░░░░░
        GrabPadControl: (() => {


            // #region *** *** FRONT *** ***

            // #region      Front: Basic References, State & Namespacing
            const SCRIPTNAME = "GrabPadControl";
            const DEFAULTSTATE = { // Initial values for state storage.
            };

            let D, U, M, G, CFG;
            const STA = {get TE() { return (RO.OT && SCRIPTNAME in RO.OT) ? RO.OT[SCRIPTNAME] : false}};
            // #endregion

            // #region      Front: Initialization
            const Preinitialize = (isResettingState = false) => {
                // Initialize state storage with DEFAULTSTATE where needed.
                if (isResettingState) { delete RO.OT[SCRIPTNAME] }
                RO.OT[SCRIPTNAME] = RO.OT[SCRIPTNAME] || {};
                Object.entries(DEFAULTSTATE)
                    .filter(([key]) => !(key in STA.TE))
                    .forEach(([key, defaultVal]) => { STA.TE[key] = defaultVal });

                // Declare local-scope shorthand for main script components.
                ({D, U, M, G, CFG} = EunosGrabControls.EUNO);;
            };
            const Initialize = (isRegisteringEventListeners = false, isResettingState = false) => {
                if (isResettingState) { Preinitialize(true) }

                // Register event handlers for chat commands and text object changes.
                if (isRegisteringEventListeners) {
                    // Register event handlers here.
                }

                // Report Readiness.
                U.Flag(`${SCRIPTNAME} Ready!`);
                log(`[EGC] ${SCRIPTNAME} Ready!`);
            };
            // #endregion
            // #endregion
            return {Preinitialize, Initialize};
        })()
        // #endregion ░[EunosGrabControls.EUNO.M]░░░░

    };
})();

// #region █████▓▒░ on("ready") Listener: Update, Validate, Initialize ░▒▓█████
on("ready", () => {
    if (EunosGrabControls.UpdateNamespace()) {
        log("[EGC] 'EunosGrabControls.EUNO' Namespace Updated.");
        // Remove any unrecognized entries from state (e.g. from previous versions).
        Object.keys(EunosGrabControls.RO.OT).filter((key) => !(key in EunosGrabControls)).forEach((key) => delete EunosGrabControls.RO.OT[key]);
        log("[EGC] State Pruned");

        // Preinitialize each major script component.
        Object.entries(EunosGrabControls).forEach(([scriptName, scriptFuncs]) => {
            if (scriptFuncs && "Preinitialize" in scriptFuncs) {
                log(`[EGC] Preinitializing ${scriptName}`);
                scriptFuncs.Preinitialize();
            }
        });

        // Initialize each major script component after a brief delay.
        setTimeout(() => Object.entries(EunosGrabControls).forEach(([scriptName, scriptFuncs]) => {
            if (scriptFuncs && "Initialize" in scriptFuncs) {
                log(`[EGC] Initializing ${scriptName}`);
                scriptFuncs.Initialize(true);
            }
        }), 1000);
    } else {
        log("[EGC] Error Updating State Storage. Unfortunately, a full reinstall of EGC is necessary to fix this issue.");
    }
});
// #endregion ▄▄▄▄▄ Event Listener ▄▄▄▄▄