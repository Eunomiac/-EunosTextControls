
/******▌████████████████████████████████████████████████████████████▐******\
|*     ▌██████▓▒░ !ETC: EUNOMIAC'S TEXT CONTROLS for Roll20 ░▒▓█████▐     *|
|*     ▌████████████████████████████████████████████████████████████▐     *|
|*     ▌█████████████████████▓▒░ v0.13-alpha ░▒▓████████████████████▐     *|
|*     ▌████████████████████▓▒░ June 25, 2021 ░▒▓███████████████████▐     *|
|*     ▌███▓▒░ https://github.com/Eunomiac/-EunosTextControls ░▒▓███▐     *|
\******▌████████████████████████████████████████████████████████████▐******/


// #region █████▓▒░ CONFIGURATION: Advanced Settings & Options ░▒▓█████

const EUNO_CONFIG = {
    // #region ░▒▓█[Global]█▓▒░ Configuration: Global Settings ░░░░░░

    INACTIVELAYER: "walls", /** The layer to send text objects to when they are toggled off. Change to 'gmlayer' if you
                              * need the lighting ("walls") layer for Dynamic Lighting. */

    // #endregion ░[Global]░░░░

    // #region ░▒▓█[Text Shadows]█▓▒░ Configuration: Text Shadows ░░░░░░
    TextShadows: {

        COLOR: "rgba(0,0,0,0.8)", /** Change this value (hex, color names and rgb/a values are all valid) to change the
                                    * color of the text shadows. */

        LAYER: "map", /** The layer on which to place the text shadow objects.
                        *   - Keeping shadows on the map layer allows moving text objects on the tokens layer without
                        *       shadow objects getting in your way.
                        *   - You can also place the master objects on the map layer, if you don't plan on manually moving them */

        OFFSETS: {/** The number of pixels to offset each text shadow, depending on the font size and family of the master object.
                    *   - The first number is the horizontal shift, the second is the vertical shift.
                    *
                    * Generic values are used UNLESS a specific override for that font-family and size has been set below.
                    *   If any shadows appear too close or too far from their master objects for a specific font and/or size,
                    *     tweaking the overrides below and then running "!etc fix all" will update all text objects with the new offsets.
                    *   Changing the generic values will affect all text shadows that don't have applicable overrides: */
            generic: {
                8: [1, 1],
                10: [2, 2],
                12: [2, 2],
                14: [2, 2],
                16: [2, 2],
                18: [2, 2],
                20: [2, 2],
                22: [2, 2],
                26: [2.5, 2.5],
                32: [3, 3],
                40: [3, 3],
                56: [5, 5],
                72: [7, 7],
                100: [8, 8],
                200: [16, 16],
                300: [16, 16]
            },
            /** To fine-tune offsets for specific fonts and sizes, define overrides here. Overrides can be defined in two ways:
             *
             *    1) Scale Multiplier: Use a getter and the 'scaleOffsets(<mult>)' function to scale all generic values by a
             *                         given multiplier for the specified font, for example... */
            get "Shadows Into Light"() { return this.scaleOffsets(0.5) },
            get "Arial"() { return this.scaleOffsets(0.6) },
            get "Patrick Hand"() { return this.scaleOffsets(0.75) },
            /**
             *    2) Specific Overrides: Override specific sizes with specific values, for example... */
            "Contrail One": {
                56: [3, 3],
                72: [5, 5],
                100: [6, 6],
                200: [12, 12]
            },
            scaleOffsets: (mult) => { /** Returns a copy of the generic offsets, scaled by the provided multiplier.
                                        *  - To submit different horizontal and vertical multipliers, pass an array,
                                        *       i.e. [<horizMult>, <vertMult>] */
                return _.mapObject(this.generic, ([xOffset, yOffset]) => Array.isArray(mult)
                    ? [xOffset * mult[0], yOffset * mult[1]]
                    : [xOffset * mult, yOffset * mult]);
            }
        }
    },
    // #endregion ░[Text Shadows]░░░░

    // #region ░▒▓█[Attribute Displays]█▓▒░ Configuration: Attribute Linking & Displaying ░░░░░░
    AttributeDisplay: {

    }
    // #endregion ░[Attribute Displays]░░░░
};

// #endregion ▄▄▄▄▄ CONFIGURATION ▄▄▄▄▄

// #region █████▓▒░ Top-Level Namespacing, Updating & Validation ░▒▓█████
const EUNO_ROOTNAME = "Euno";
const RO = {get OT() { // "RO.OT" Reference to 'state.Euno'
    state[EUNO_ROOTNAME] = state[EUNO_ROOTNAME] || {};
    return state[EUNO_ROOTNAME];
}};
const EUNO = { // Shorthand getters for major script components
    get D() { return EunosTextControls.DATA },
    get U() { return EunosTextControls.UTILITIES },
    get O() { return EunosTextControls.OBJECTS },
    get M() { return EunosTextControls.MASTER },
    get S() { return EunosTextControls.SandboxControl },
    get C() { return EunosTextControls.ChatboxControl },
    get H() { return EunosTextControls.HandoutControl },
    get CFG() { return EUNO_CONFIG }
};
const Update_EUNO_Namespace = () => { // Any processes necessary to update to latest version.
    return true;
};
// #endregion ▄▄▄▄▄ Top-Level Namespacing ▄▄▄▄▄

const EunosTextControls = (() => {
    return {
        // #region ░▒▓█[EUNO.D]█▓▒░ Global Data & Constants ░░░░░░
        DATA: (() => {
            // #region *** *** FRONT *** ***

            // #region      Front: Basic References, State & Namespacing
            const SCRIPTNAME = "Data";
            const DEFAULTSTATE = { // Initial values for state storage.
            };

            let D, U, O, M, S, C, H, CFG;
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
                ({D, U, O, M, S, C, H, CFG} = EUNO);
            };
            const Initialize = (isRegisteringEventListeners = false, isResettingState = false) => {
                if (isResettingState) { Preinitialize(true) }

                // Register event handlers for chat commands and text object changes.
                if (isRegisteringEventListeners) {
                    // Register event handlers here.
                }

                // Report Readiness.
                U.Flag(`${SCRIPTNAME} Ready!`);
                log(`[ETC] ${SCRIPTNAME} Ready!`);
            };
            // #endregion

            // #endregion *** *** FRONT *** ***

            const IMGROOT = {
                texture: "https://raw.githubusercontent.com/Eunomiac/-EunosTextControls/ClassRefactor/images/textures/"
            };
            const GetImgURL = (imgFileName, imgType = "texture") => `${IMGROOT[imgType]}${imgFileName}`;


            const CHATWIDTH = 275; // The minimum width of the chat panel, in pixels. Be sure to subtract twice any border widths.

            const UPSHIFT = -26;   // Constants governing how the chat box is positioned in the chat panel: By default, everything
            const LEFTSHIFT = -45; // shifts up and to the left to cover the standard chat output with the custom styles below.
            const BOTTOMSHIFT = -7;

            const HTML = {
                Box: (content, styles = {}, title = undefined) => `<div style="${U.Style(Object.assign({
                    "display": "block",
                    "width": "auto", "min-width": `${CHATWIDTH}px`,
                    "height": "auto", "min-height": "32px",
                    "margin": `${UPSHIFT}px 0 ${BOTTOMSHIFT}px ${LEFTSHIFT}px`,
                    "padding": "0",
                    "color": "gold",
                    "text-align": "center",
                    "position": "relative",
                    "text-shadow": "none", "box-shadow": "none",
                    "background-image": `url('${GetImgURL("blackLeather_2.jpg", "texture")}')`,
                    "border": "4px outset #666",
                    "overflow": "hidden",
                    "border-radius": "33px"
                }, styles))}"${title ? ` title="${title}"` : ""}>${[content].flat().join("")}</div>`,
                Block: (content, styles = {}, title = undefined) => `<div style="${U.Style(Object.assign({
                    "width": "97%",
                    "margin": "2px 0 0 0",
                    "padding": "1.5%",
                    "text-align": "left",
                    "background": "none",
                    "font-family": "serif",
                    "font-weight": "normal",
                    "font-size": "14px",
                    "line-height": "18px"
                }, styles))}"${title ? ` title="${title}"` : ""}>${[content].flat().join("")}</div>`,
                Header: (content, styles = {}, title = undefined) => `<span style="${U.Style(Object.assign({
                    "display": "block",
                    "height": "auto", "min-height": "32px",
                    "width": "auto",
                    "margin": "0",
                    "padding": "0 2px",
                    "text-align": "center",
                    "color": "#ffd400",
                    "font-family": "serif",
                    "font-size": "18px",
                    "line-height": "32px",
                    "font-variant": "small-caps",
                    "background-color": "transparent",
                    "background-image": `url('${GetImgURL("blackLeather_1.jpg", "texture")}')`,
                    "background-size": "cover",
                    "font-weight": "normal",
                    "border": "none", "box-shadow": "none",
                    "text-shadow": "1px 1px 2px rgba(255, 255, 255, 0.8), -1px -1px 2px rgb(0, 0, 0), -1px -1px 2px rgb(0, 0, 0), -1px -1px 2px rgb(0, 0, 0)"
                }, styles))}"${title ? ` title="${title}"` : ""}>${[content].flat().join("")}</span>`,
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
                    "background-image": `url('${GetImgURL("gold_2.jpg", "texture")}')`,
                    "padding": "0 7px 0 5px",
                    "border-radius": "8px",
                    "background-size": "cover",
                    "border": "2px solid gold"
                }, styles))}"${title ? ` title="${title}"` : ""}>${[content].flat().join("")}</span>`,
                ButtonWide: (name, command, styles = {}, title = undefined) => `<span style="${U.Style(Object.assign({
                    "display": "inline-block",
                    "width": "100%",
                    "text-align": "center",
                    "vertical-align": "baseline",
                    "margin": "0",
                    "float": "none"
                }, _.pick(styles, "display", "width", "text-align", "vertical-align", "margin", "float")))}"${title ? ` title="${title}"` : ""}><a href="${command}" style="${U.Style(Object.assign({
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
                }, _.omit(styles, "display", "width", "text-align", "vertical-align", "margin", "float")))}">${name}</a></span>`,
                H: (content, level = 3, styles = {}, title = undefined) => `<h${level} style="${U.Style(Object.assign([
                    null, // <H0>
                    { // <H1>
                    },
                    { // <H2>
                        display: "block",
                        height: "26px",
                        "font-family": "sans-serif",
                        "line-height": "26px",
                        "margin": "0 0 9px -2%",
                        color: "gold",
                        "text-indent": "4px",
                        width: "105%",
                        "background-image": `url('${GetImgURL("blackLeather_1.jpg", "texture")}')`,
                        "border": "2px solid black",
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
                    "line-height": "16px",
                    "font-family": "sans-serif",
                    "text-shadow": "1px 1px 2px rgba(255, 255, 255, 0.7), -2px -2px 3px black, -2px -2px 3px black, -2px -2px 3px black"
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
            const ApplyStyles = () => {
                // For each entry in HTML, find all elements with matching class. Extract "style" line, convert to object, submit as 'styles' parameter
                const processStyles = (elem, HTMLref) => {
                    console.log(elem, HTMLref);
                    const inlineStyles = elem.getAttribute("style");
                    const title = elem.title;
                    const elemString = HTMLref("**CONTENT**", inlineStyles, title).replace(/[a-zA-Z-]*: (;|$)/gu, "").trim().replace(/\s+/gu, " ");
                    const combinedStyles = elemString.match(/style\s*=\s*\S([^"]*)\S/u)[1];
                    elem.style = combinedStyles;
                };
                Object.keys(HTML).forEach((classOrTag) => {
                    if (classOrTag === "H") {
                        ["H1", "H2", "H3", "H4", "H5"].forEach((header) => {
                            const styleRef = HTML.H[parseInt(header.slice(1))];
                            Array.from(document.getElementsByTagName(header)).forEach((elem) => { processStyles(header, styleRef) });
                        });
                    } else if (classOrTag === "Paras") {
                        Array.from(document.getElementsByTagName("P")).forEach((elem) => { processStyles(elem, HTML.Paras) });
                    } else {
                        Array.from(document.getElementsByClassName(classOrTag)).forEach((elem) => { processStyles(elem, HTML[classOrTag]) });
                    }
                });
            };

            return {
                Preinitialize, Initialize,
                CHATWIDTH, UPSHIFT, LEFTSHIFT, BOTTOMSHIFT,
                HTML
            };
        })(),
        // #endregion ░[EUNO.D]░░░░


        // #region ░▒▓█[EUNO.O]█▓▒░ Roll20 Object Manipulation ░░░░░░
        OBJECTS: (() => {
            // #region *** *** FRONT *** ***

            // #region      Front: Basic References, State & Namespacing
            const SCRIPTNAME = "Objects";
            const DEFAULTSTATE = { // Initial values for state storage.
            };

            let D, U, O, M, S, C, H, CFG;
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
                ({D, U, O, M, S, C, H, CFG} = EUNO);
            };
            const Initialize = (isRegisteringEventListeners = false, isResettingState = false) => {
                if (isResettingState) { Preinitialize(true) }

                // Register event handlers for chat commands and text object changes.
                if (isRegisteringEventListeners) {
                    // Register event handlers here.
                }

                // Report Readiness.
                U.Flag(`${SCRIPTNAME} Ready!`);
                log(`[ETC] ${SCRIPTNAME} Ready!`);
            };
            // #endregion
            // #endregion

            // #region 'controlledby' Data Parsing
            const getETCObjs = (category = null) => findObjs({}).filter((obj) => {
                const etcData = GetETCData(obj);
                return "etc" in etcData && (category === null || etcData.etc === category);
            });
            const GetETCData = (obj) => {
                if (!U.GetR20Type(obj)) { return false }
                const cbFields = obj.get("controlledby").split(/,/u) || [];
                if (cbFields.length === 0) { return {} }
                const etcIndex = cbFields.findIndex((cbItem) => /^etc---/u.test(cbItem));
                if (etcIndex < 0) { return {} }
                return U.KVPMap(
                    cbFields[etcIndex].split(/__-__/u),
                    (i, param) => param.split(/---/u).shift(),
                    (param) => param.split(/---/u).pop()
                );
            };
            // #endregion

            return {
                Preinitialize, Initialize
            };
        })(),
        // #endregion ░[EUNO.O]░░░░

        // #region ░▒▓█[EUNO.U]█▓▒░ Global Utility Functions ░░░░░░
        UTILITIES: (() => {
            // #region *** *** FRONT *** ***

            // #region      Front: Basic References, State & Namespacing
            const SCRIPTNAME = "Utilities";
            const DEFAULTSTATE = { // Initial values for state storage.
            };

            let D, U, O, M, S, C, H, CFG;
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
                ({D, U, O, M, S, C, H, CFG} = EUNO);
            };
            const Initialize = (isRegisteringEventListeners = false, isResettingState = false) => {
                if (isResettingState) { Preinitialize(true) }

                // Register event handlers for chat commands and text object changes.
                if (isRegisteringEventListeners) {
                    // Register event handlers here.
                }

                // Report Readiness.
                U.Flag(`${SCRIPTNAME} Ready!`);
                log(`[ETC] ${SCRIPTNAME} Ready!`);
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
                            sendChat(randStr(), `/w gm ${D.HTML.Box(D.HTML.Header(title, {
                                "font-family": "sans-serif",
                                "text-align": "left"
                            }), {
                                "border": "none",
                                "border-radius": "0px",
                                "text-indent": "4px",
                                "min-width": `${D.CHATWIDTH + 8}px`,
                                "margin": `${D.UPSHIFT + 1}px 0 ${D.BOTTOMSHIFT + 1}px ${D.LEFTSHIFT}px`
                            })}`, null, {noarchive: true});
                        } else {
                            sendChat(randStr(), `/w gm ${D.HTML.Box([
                                D.HTML.Header(title),
                                D.HTML.Block(content)
                            ])}`, null, {noarchive: true});
                        }
                    } else {
                        sendChat(randStr(4), `/w gm ${content}`, null, {noarchive: true});
                    }
                }
            };
            const Show = (obj, title = "Showing ...") => Alert(D.HTML.CodeBlock(JC(obj)), {}, title); // Show properties of stringified object to GM.
            const Flag = (msg) => Alert(null, `[ETC] ${msg}`.replace(/\[ETC\]\s*\[ETC\]/gu, "[ETC]")); // Simple one-line chat flag sent to the GM.
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
        // #endregion ░[EUNO.U]░░░░

        // #region ░▒▓█[EUNO.M]█▓▒░ Global Control, Toggle & Event Listener Functions ░░░░░░
        MASTER: (() => {
            // #region *** *** FRONT *** ***

            // #region      Front: Basic References, State & Namespacing
            const SCRIPTNAME = "MASTER";
            const DEFAULTSTATE = { // Initial values for state storage.
            };

            let D, U, O, M, S, C, H, CFG;
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
                ({D, U, O, M, S, C, H, CFG} = EUNO);
            };
            const Initialize = (isRegisteringEventListeners = false, isResettingState = false) => {
                if (isResettingState) { Preinitialize(true) }

                // Register event handlers for chat commands and text object changes.
                if (isRegisteringEventListeners) {
                    // Register event handlers here.
                }

                // Report Readiness.
                U.Flag(`${SCRIPTNAME} Ready!`);
                log(`[ETC] ${SCRIPTNAME} Ready!`);
            };
            // #endregion
            // #endregion
            return {Preinitialize, Initialize};
        })(),
        // #endregion ░[EUNO.M]░░░░

        // #region ░▒▓█[EUNO.S]█▓▒░ Sandbox Text Object Control ░░░░░░
        SandboxControl:  (() => {
            // #region *** *** FRONT *** ***

            // #region      Front: Basic References, State & Namespacing
            const SCRIPTNAME = "SandboxControl";
            const DEFAULTSTATE = { // Initial values for state storage.
                REGISTRY: {},
                IsAutoShadowing: false,
                IsAutoPruning: false,
                IsShowingIntro: true
            };

            let D, U, O, M, S, C, H, CFG;
            const STA = {get TE() { return (RO.OT && SCRIPTNAME in RO.OT) ? RO.OT[SCRIPTNAME] : false}};
            const RE = {get G() { return (STA.TE && "REGISTRY" in STA.TE) ? STA.TE.REGISTRY : {} }};

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
                ({D, U, O, M, S, C, H, CFG} = EUNO);
            };
            const Initialize = (isRegisteringEventListeners = false, isResettingState = false) => {
                if (isResettingState) { Preinitialize(true) }

                // Register event handlers for chat commands and text object changes.
                if (isRegisteringEventListeners) {
                    on("chat:message", handleMessage);
                    on("change:text", handleTextChange);
                    on("add:text", handleTextAdd);
                    on("destroy:text", handleTextDestroy);
                }

                // Report Readiness.
                U.Flag(`${SCRIPTNAME} Ready!`);
                log(`[ETC] ${SCRIPTNAME} Ready!`);

                // Display intro message if toggled:
                if (STA.TE.IsShowingIntro) { displayIntroMessage() }
            };
            // #endregion

            // #region      Front: Event Handlers
            const handleMessage = (msg) => {
                if (msg.content.startsWith("!etc") && playerIsGM(msg.playerid)) {
                    let [call, ...args] = (msg.content.match(/!\S*|\s@"[^"]*"|\s@[^\s]*|\s"[^"]*"|\s[^\s]*/gu) || [])
                        .map((x) => x.replace(/^\s*(@)?"?|"?"?\s*$/gu, "$1"))
                        .filter((x) => Boolean(x));
                    if (({
                        shadow: () => makeTextShadow(U.GetSelObjs(msg, "text")),
                        toggle: () => ({
                            intro: () => toggleIntroMessage(args.includes("true")),
                            autoshadow: () => toggleAutoShadow(args.includes("true")),
                            autoprune: () => toggleAutoPrune(args.includes("true"))
                        }[(call = args.shift() || "").toLowerCase()] || (() => false))(),
                        clear: () => {
                            if (args.includes("all")) {
                                Object.entries(RE.G).filter(([id, textData]) => "masterID" in textData).forEach(([id, textData]) => unregTextShadow(id));
                                U.Flag("Shadows unregistered.");
                                U.Flag("Shadows removed.");
                            } else {
                                unregTextShadow(U.GetSelObjs(msg, "text").map((obj) => obj.id));
                            }
                        },
                        fix: () => { if (args.includes("all")) { fixTextShadows() } },
                        setup: () => { displayToggles() },
                        purge: () => ({
                            state: () => Preinitialize(true),
                            reg: () => STA.TE.REGISTRY = {}
                        }[(call = args.shift() || "").toLowerCase()] || (() => false))(),
                        test: () => ({
                            state: () => U.Show(state),
                            root: () => U.Show(RO.OT),
                            stateref: () => U.Show(STA.TE),
                            data: () => { U.Show((msg.selected || [null]).map((sel) => sel && "_type" in sel && getObj(sel._type, sel._id))) }
                        }[(call = args.shift() || "").toLowerCase()] || (() => false))()
                    }[(call = args.shift() || "").toLowerCase()] || (() => false))() === false) {
                        displayIntroMessage();
                    };
                }
            };
            const handleTextChange = (textObj) => {
                if (textObj.id in RE.G) {
                    const [masterObj, shadowObj] = [
                        RE.G[textObj.id].shadowID ? textObj : getObj("text", RE.G[textObj.id].masterID),
                        RE.G[textObj.id].masterID ? textObj : getObj("text", RE.G[textObj.id].shadowID)
                    ];
                    if (masterObj && shadowObj) {
                        syncShadow(masterObj, shadowObj);
                    }
                }
            };
            const handleTextAdd = (textObj) => {
                setTimeout(() => { // The delay is necessary to ensure the new object fully updates.
                    if (textObj.get("text") === "" && STA.TE.IsAutoPruning) {
                        textObj.remove();
                    } else if (STA.TE.IsAutoShadowing && !isShadowObj(textObj)) {
                        makeTextShadow(textObj);
                    }
                }, 500);
            };
            const handleTextDestroy = (textObj) => {
                if (textObj.id in RE.G) {
                    const textData = RE.G[textObj.id];
                    if (isShadowObj(textObj)) {
                        const masterObj = getObj("text", textData.masterID);
                        if (masterObj && !removalQueue.includes(textObj.id)) {
                            displayError("ManualShadowRemoval");
                            makeTextShadow(masterObj);
                        }
                    } else if (textData.shadowID) {
                        safeRemove(textData.shadowID);
                    }
                }
            };
            // #endregion

            // #endregion *** *** FRONT *** ***

            // #region *** *** UTILITY *** ***
            const isShadowObj = (val) => U.GetR20Type(val) === "text" && /etcshadowobj/u.test(val.get("controlledby"));
            const getOffsets = (fontFamily, fontSize) => ({
                ...CFG.TextShadows.OFFSETS.generic,
                ...(fontFamily in CFG.TextShadows.OFFSETS ? CFG.TextShadows.OFFSETS[fontFamily] : CFG.TextShadows.OFFSETS.generic)
            }[fontSize]);
            // #endregion *** *** UTILITY *** ***

            // #region *** *** CORE TEXT CONTROL *** ***
            const toggleAutoPrune = (isActive) => {
                STA.TE.IsAutoPruning = isActive === true;
                displayToggles();
            };
            // #endregion *** *** CORE TEXT CONTROL *** ***

            // #region *** *** FEATURE: TEXT SHADOWS *** ***
            const removalQueue = [];

            // #region      Text Shadows: Creation & Toggling Automatic Creation
            const makeTextShadow = (masterObjs) => {
                [masterObjs].flat().forEach((masterObj) => {
                    let isSkipping = false;
                    if (!masterObj) {
                        isSkipping = true;
                    } else if (masterObj.id in RE.G) {
                        if (RE.G[masterObj.id].shadowID) {
                            unregTextShadow(RE.G[masterObj.id].shadowID);
                        } else if (RE.G[masterObj.id].masterID) {
                            displayError("AddShadowToShadow");
                            isSkipping = true;
                        }
                    }
                    if (!isSkipping) {
                        if (U.GetR20Type(masterObj) === "text") {
                            const [leftOffset, topOffset] = getOffsets(masterObj.get("font_family"), masterObj.get("font_size"));
                            const shadowOffsets = CFG.TextShadows.OFFSETS[masterObj.get("font_family") in CFG.TextShadows.OFFSETS ? masterObj.get("font_family") : "generic"];
                            const shadowObj = createObj("text", {
                                _pageid: masterObj.get("_pageid"),
                                left: masterObj.get("left") + leftOffset,
                                top: masterObj.get("top") + topOffset,
                                text: masterObj.get("text"),
                                font_size: masterObj.get("font_size"),
                                rotation: masterObj.get("rotation"),
                                font_family: masterObj.get("font_family"),
                                color: CFG.TextShadows.COLOR,
                                layer: CFG.TextShadows.LAYER,
                                controlledby: "etcshadowobj"
                            });
                            regTextShadow(masterObj, shadowObj);
                        }
                    }
                });
            };
            const toggleAutoShadow = (isActive) => {
                STA.TE.IsAutoShadowing = isActive === true;
                displayToggles();
            };
            // #endregion

            // #region      Text Shadows: Registering & Unregistering Master/Shadow Pairs
            const regTextShadow = (masterObj, shadowObj) => {
                RE.G[masterObj.id] = {
                    id: masterObj.id,
                    shadowID: shadowObj.id
                };
                RE.G[shadowObj.id] = {
                    id: shadowObj.id,
                    masterID: masterObj.id
                };
                toFront(masterObj);
                toFront(shadowObj);
            };
            const safeRemove = (ids) => {
                [ids].flat().forEach((id) => {
                    const textObj = getObj("text", id);
                    if (textObj) {
                        removalQueue.push(id);
                        textObj.remove();
                    }
                });
            };
            const unregTextShadow = (textObjs) => {
                [textObjs].flat().forEach((objOrID) => {
                    const id = typeof objOrID === "string"
                        ? objOrID
                        : (U.GetR20Type(objOrID) && objOrID.id);
                    if (id in RE.G) {
                        const textData = RE.G[id];
                        if (textData.masterID in RE.G) {
                            safeRemove(id);
                            delete RE.G[textData.masterID];
                            delete RE.G[id];
                        } else if (textData.shadowID in RE.G) {
                            unregTextShadow(textData.shadowID);
                        }
                    }
                });
            };
            // #endregion

            // #region      Text Shadows: Synchronizing Master/Shadow Objects
            const syncShadow = (masterObj, shadowObj) => {
                // Where the magic happens (?) --- synchronizing text shadows to their master objects, whenever they're changed or created.
                if (U.GetR20Type(masterObj) && U.GetR20Type(shadowObj)) {
                    const [leftOffset, topOffset] = getOffsets(masterObj.get("font_family"), masterObj.get("font_size"));
                    if (![leftOffset, topOffset].includes(undefined)) {
                        shadowObj.set({
                            text: masterObj.get("text"),
                            left: masterObj.get("left") + leftOffset,
                            top: masterObj.get("top") + topOffset,
                            layer: masterObj.get("layer") === CFG.INACTIVELAYER ? CFG.INACTIVELAYER : CFG.TextShadows.LAYER,
                            color: CFG.TextShadows.COLOR,
                            font_family: masterObj.get("font_family"),
                            rotation: masterObj.get("rotation"),
                            font_size: masterObj.get("font_size")
                        });
                        toFront(shadowObj);
                        toFront(masterObj);
                    }
                }
            };
            const fixTextShadows = () => {
                // Validates Registry & Sandbox Objects, Synchronizing where necessary.

                // ONE: Locate all shadow objects in the sandbox, and remove them if they aren't in the registry.
                findObjs({_type: "text"}).filter((obj) => isShadowObj(obj) && !(obj.id in RE.G)).forEach((obj) => obj.remove());

                // TWO: Cycle through registry, ensuring all objects exist and, if AutoPruning is on, that they all have text content.
                //    If object has no text, unregister it.
                //    If a ShadowObj doesn't exist, create it.
                //    If a MasterObj doesn't exist, unreg the shadow.
                for (const [id, objData] of Object.entries(RE.G)) {
                    const textObj = getObj("text", id);
                    if (textObj && STA.TE.IsAutoPruning && textObj.get("text") === "") {
                        unregTextShadow(id);
                    }
                    if ("masterID" in objData) { // This is a Shadow Object.
                        const masterObj = getObj("text", objData.masterID);
                        if (!(masterObj && masterObj.id in RE.G)) { // This is an orphan: Kill it.
                            unregTextShadow(id);
                        } else if (masterObj && STA.TE.IsAutoPruning && masterObj.get("text") === "") {
                            unregTextShadow(masterObj.id);
                            masterObj.remove();
                        }
                    } else if ("shadowID" in objData) { // This is a Master Object.
                        if (textObj && STA.TE.IsAutoPruning && textObj.get("text") === "") {
                            unregTextShadow(id);
                        }
                        const shadowObj = getObj("text", objData.shadowID);
                        if (!shadowObj) { // Create a shadow if it's missing
                            makeTextShadow(textObj);
                        } else if (!(shadowObj.id in RE.G)) { // ... same for registry.
                            regTextShadow(textObj, shadowObj);
                        }
                    } else { // Should never get here.
                        U.Alert(`Registry entry for ${id} does not contain a masterID or a shadowID`, "REGISTRY ERROR");
                    }
                }

                // THREE: Cycle through registry again, synchronizing all shadow objects.
                for (const [id, shadowData] of Object.entries(RE.G).filter(([id, data]) => "masterID" in data)) {
                    const [masterObj, shadowObj] = [getObj("text", shadowData.masterID), getObj("text", id)];
                    syncShadow(masterObj, shadowObj);
                }

                U.Flag("Shadows Synchronized.");
            };
            // #endregion

            // #endregion *** *** TEXT SHADOWS *** ***

            // #region *** *** FEATURE: ATTRIBUTE DISPLAYS *** ***

            // #region         Attribute Displays: Linking Text Objects
            const getAttr = (charRef, attrRef) => {
                const charID = (D.GetChar(charRef) || (() => false)).id;
                const charAttrs = findObjs({_type: "attribute", _characterid: charID});
                let attrObj;
                ({
                    string: () => {

                    },
                    object: () => {

                    }
                }[typeof attrRef])();

                switch (typeof attrRef) {
                    case "string": {

                    }
                }
                // if (typeof attrRef === "string")
                // SWEEP 1: Look for attribute with name that matches lowercase letters and digits


                const charAttrNames = charAttrs.map((attrObj) => attrObj.get("name"));
            };
            const linkTextToAttr = (textObj, charRef, attrRef, options = {}) => {
                if (!U.GetR20Type(textObj)) { return false }
                const charObj = U.GetChar(charRef);
                if (!U.GetR20Type(charObj)) { return false }
                const attrObj = U.GetAttr(charObj, attrRef);
                if (!U.GetR20Type(attrObj)) { return false }


                return true;
            };
            // #endregion


            // #endregion *** *** ATTRIBUTE DISPLAYS *** ***

            // #region *** *** CHAT DISPLAYS & MENUS *** ***
            const toggleIntroMessage = (isActive) => {
                STA.TE.IsShowingIntro = isActive === true;
                displayToggles();
            };
            const displayIntroMessage = () => {
                U.Alert(D.HTML.Box([
                    D.HTML.Header("Eunomiac's Text Controls v.0.1"),
                    D.HTML.Block([
                        D.HTML.ButtonWide("Latest Version", "https://github.com/Eunomiac/-EunosTextControls/releases", {background: "green", color: "white"}),
                        D.HTML.Spacer("3px"),
                        D.HTML.ButtonWide("Issue Tracking", "https://github.com/Eunomiac/-EunosTextControls/issues", {background: "rgba(255,0,0,0.8)", color: "white"}),
                        D.HTML.Spacer("3px"),
                        D.HTML.ButtonWide("Roll20 Forum Thread", "https://app.roll20.net/forum/permalink/10184021/", {background: "magenta", color: "white"}),
                        D.HTML.Spacer("5px"),
                        D.HTML.Paras(["This script pack&shy;age is in&shy;tended to be a com&shy;pre&shy;hen&shy;sive so&shy;lution to ma&shy;naging Roll20 Text Ob&shy;jects via API com&shy;mands or scrip&shy;ted auto&shy;mation. At the mo&shy;ment, how&shy;ever, only the 'Text Sha&shy;dows' fea&shy;ture is cur&shy;rently im&shy;ple&shy;ment&shy;ed."]),
                        D.HTML.H("Basic Chat Commands"),
                        D.HTML.Paras([
                            `${D.HTML.CodeSpan("!etc help")} — View this help message.`,
                            `${D.HTML.CodeSpan("!etc setup")} — Ac&shy;ti&shy;vate or de&shy;ac&shy;ti&shy;vate any of the fea&shy;tures in this script pack&shy;age.`,
                            `${D.HTML.CodeSpan("!etc purge all")} — <b><u>FULLY</u> RE&shy;SET <u>ALL</u></b> script fea&shy;tures, re&shy;tur&shy;ning it to its de&shy;fault in&shy;stall&shy;ation state. Sha&shy;dow ob&shy;jects will be purged, lea&shy;ving the ma&shy;ster ob&shy;jects un&shy;touched.`
                        ]),
                        D.HTML.H("Feature: Text Shadows", 2),
                        D.HTML.Img("https://raw.githubusercontent.com/Eunomiac/-EunosTextControls/master/images/Header%20-%20Text%20Shadows%200.1.jpg"),
                        D.HTML.Paras([
                            "Add plea&shy;sant sha&shy;dows to sand&shy;box text ob&shy;jects in Roll20 — either <b>auto&shy;matically</b>, when&shy;ever new text is ad&shy;ded to the sand&shy;box, or <b>man&shy;ually</b>, by se&shy;lect&shy;ing text ob&shy;jects and re&shy;gister&shy;ing them for a sha&shy;dow via the com&shy;mands be&shy;low.",
                            "Sha&shy;dow ob&shy;jects are in&shy;tended to be hands off: They're crea&shy;ted auto&shy;ma&shy;ti&shy;cally when re&shy;gist&shy;ered, will up&shy;date when&shy;ever their mas&shy;ter text ob&shy;ject's po&shy;sition and/or con&shy;tent changes, and will be re&shy;moved if the mas&shy;ter ob&shy;ject is ever de&shy;leted."
                        ]),
                        D.HTML.H("Chat Commands for Text Shadows", 4),
                        D.HTML.Paras([
                            `${D.HTML.CodeSpan("!etc shadow")} — <b>ADD</b> sha&shy;dow(s) to all se&shy;lec&shy;ted text ob&shy;jects.`,
                            `${D.HTML.CodeSpan("!etc clear")} — <b>REMOVE</b> sha&shy;dow(s) from all se&shy;lec&shy;ted text ob&shy;jects <i>(you can se&shy;lect either mas&shy;ter ob&shy;jects and/or sha&shy;dow ob&shy;jects for this com&shy;mand)</i>`,
                            `${D.HTML.CodeSpan("!etc clear all")} — <b>REMOVE <u>ALL</u></b> text sha&shy;dow ob&shy;jects <i>(this will not af&shy;fect the mas&shy;ter text ob&shy;jects, just re&shy;move the sha&shy;dows)</i>`,
                            `${D.HTML.CodeSpan("!etc fix all")} — <b>FIX <u>ALL</u></b> text sha&shy;dow ob&shy;jects, cor&shy;rect&shy;ing for any er&shy;rors in po&shy;sit&shy;ion or con&shy;tent, as well as spot&shy;ting and pru&shy;ning any or&shy;phaned ob&shy;jects from the re&shy;gistry.`
                        ]),
                        D.HTML.H("Fine-Tuning Text Shadows", 4),
                        D.HTML.Paras(`The code con&shy;tains fur&shy;ther con&shy;fig&shy;ura&shy;tion op&shy;tions in the <b>${D.HTML.CodeSpan("&#42;&#42;&#42; CON&shy;FIG&shy;URATION &#42;&#42;&#42;")}</b> sec&shy;tion. There, you can change the co&shy;lor of the sha&shy;dows, or fine-tune sha&shy;dow off&shy;sets down to the pix&shy;el for spe&shy;ci&shy;fic fonts and/&shy;or si&shy;zes.`),
                        D.HTML.H("Spam Control"),
                        D.HTML.Paras([`To pre&shy;vent this mes&shy;sage from dis&shy;play&shy;ing at start-up, click the but&shy;ton be&shy;low. <i>(You can al&shy;ways view this mes&shy;sage again via the ${D.HTML.CodeSpan("!etc help")} com&shy;mand.)</i>`
                        ]),
                        D.HTML.ButtonWide("Don't Display This At Startup", "!etc toggle intro false")
                    ])
                ]));
            };
            const displayToggles = () => {
                U.Alert(D.HTML.Box([
                    D.HTML.Block([
                        D.HTML.H("[ETC] Options", 2,  {margin: "-10px 0 6px -2%"}),
                        D.HTML.Paras([
                            "Hover over the description on the left for more details about any given setting."
                        ]),
                        D.HTML.Span([
                            D.HTML.Span(`Intro Message <span style="color: ${STA.TE.IsShowingIntro ? "darkgreen" : "darkred"};"><u>${STA.TE.IsShowingIntro ? "EN" : "DIS"}ABLED</u></span>`, {
                                // background: "transparent",
                                // color: "black",
                                "font-size": "14px",
                                "line-height": "18px",
                                "font-family": "sans-serif",
                                "font-weight": "bold",
                                margin: "-5px 0 10px 0"
                            }, "Whether to display the introductory help message on sandbox startup."),
                            D.HTML.ButtonWide(STA.TE.IsShowingIntro ? "DISABLE" : "ENABLE", `!etc toggle intro ${STA.TE.IsShowingIntro ? "false" : "true"}`,  {
                                color: STA.TE.IsShowingIntro ? "white" : "black",
                                width: "27%",
                                background: STA.TE.IsShowingIntro ? "red" : "lime",
                                padding: "2px",
                                "margin-top": "-5px",
                                float: "right"
                            })
                        ], {width: "97%"}),
                        D.HTML.Span([
                            D.HTML.Span(`Object Pruning <span style="color: ${STA.TE.IsAutoPruning ? "darkgreen" : "darkred"};"><u>${STA.TE.IsAutoPruning ? "EN" : "DIS"}ABLED</u></span>`, {
                                // background: "transparent",
                                "font-size": "14px",
                                "line-height": "18px",
                                "font-family": "sans-serif",
                                "font-weight": "bold",
                                margin: "-5px 0 10px 0"
                            }, "Whether empty text objects are automatically removed whenever they appear."),
                            D.HTML.ButtonWide(STA.TE.IsAutoPruning ? "DISABLE" : "ENABLE", `!etc toggle autoprune ${STA.TE.IsAutoPruning ? "false" : "true"}`, {
                                color: STA.TE.IsAutoPruning ? "white" : "black",
                                width: "27%",
                                background: STA.TE.IsAutoPruning ? "red" : "lime",
                                padding: "2px",
                                "margin-top": "-5px",
                                float: "right"
                            })
                        ], {width: "97%"}),
                        D.HTML.Span([
                            D.HTML.Span(`Auto-Shadow <span style="color: ${STA.TE.IsAutoShadowing ? "darkgreen" : "darkred"};"><u>${STA.TE.IsAutoShadowing ? "EN" : "DIS"}ABLED</u></span>`, {
                                // background: "transparent",
                                // color: "black",
                                "font-size": "14px",
                                "line-height": "18px",
                                "font-family": "sans-serif",
                                "font-weight": "bold",
                                margin: "-5px 0 10px 0"
                            }, "Whether shadows should be created automatically for all new text objects."),
                            D.HTML.ButtonWide(STA.TE.IsAutoShadowing ? "DISABLE" : "ENABLE", `!etc toggle autoshadow ${STA.TE.IsAutoShadowing ? "false" : "true"}`,  {
                                color: STA.TE.IsAutoShadowing ? "white" : "black",
                                width: "27%",
                                background: STA.TE.IsAutoShadowing ? "red" : "lime",
                                padding: "2px",
                                "margin-top": "-5px",
                                float: "right"
                            })
                        ], {width: "97%"})
                    ])
                ]));
            };
            const displayError = (errorTag) => {
                const ERRORHTML = {
                    AddShadowToShadow: D.HTML.Box([
                        D.HTML.Header("[ETC] ERROR: Shadow-On-Shadow", {"background-color": "rgb(255, 30, 30)", "background-image": "none", "font-weight": "bold"}),
                        D.HTML.Block([
                            D.HTML.H("Cannot Add a Shadow to a Shadow Object"),
                            D.HTML.Paras([
                                "Text shadows cannot have shadows themselves."
                            ])
                        ])
                    ]),
                    ManualShadowRemoval: D.HTML.Box([
                        D.HTML.Header("[ETC] ERROR: Shadow Deleted", {"background-color": "rgb(255, 30, 30)", "background-image": "none", "font-weight": "bold"}),
                        D.HTML.Block([
                            D.HTML.H("Restoring ..."),
                            D.HTML.Paras([
                                "Manually-deleted text shadows are automatically recreated (to prevent accidentally deleting a desired shadow).",
                                "To remove a text shadow from a text object:",
                                `${D.HTML.CodeSpan("!etc clear")} — Removes text shadows from all selected text objects <i>(you can select either the master object, the shadow object, or both)</i>`,
                                `${D.HTML.CodeSpan("!etc clear all")} — Remove <b><u>ALL</u></b> text shadow objects <i>(this will not affect the master text objects, just remove the shadows)</i>`
                            ])
                        ])
                    ])
                };
                if (errorTag in ERRORHTML) {
                    U.Alert(ERRORHTML[errorTag]);
                }
            };
            // #endregion *** *** CHAT DISPLAYS *** ***

            return {Preinitialize, Initialize};
        })(),
        // #endregion ░[EUNO.S]░░░░

        // #region ░▒▓█[EUNO.C]█▓▒░ Chat Styling, Displays, Menus ░░░░░░
        ChatboxControl: (() => { // In Development.
            return {};
        })(),
        // #endregion ░[EUNO.C]░░░░

        // #region ░▒▓█[EUNO.H]█▓▒░ Handout Styling, Updating, Menus ░░░░░░
        HandoutControl: (() => { // In Development.
            return {};
        })()
        // #endregion ░[EUNO.H]░░░░
    };
})();

// #region █████▓▒░ on("ready") Listener: Update, Validate, Initialize ░▒▓█████
on("ready", () => {
    if (Update_EUNO_Namespace()) {
        log("[ETC] 'EUNO' Namespace Updated.");
        // Remove any unrecognized entries from state (e.g. from previous versions).
        Object.keys(RO.OT).filter((key) => !(key in EunosTextControls)).forEach((key) => delete RO.OT[key]);
        log("[ETC] State Pruned");

        // Preinitialize each major script component.
        Object.entries(EunosTextControls).forEach(([scriptName, scriptFuncs]) => {
            if (scriptFuncs && "Preinitialize" in scriptFuncs) {
                log(`[ETC] Preinitializing ${scriptName}`);
                scriptFuncs.Preinitialize();
            }
        });

        // Initialize each major script component after a brief delay.
        setTimeout(() => Object.entries(EunosTextControls).forEach(([scriptName, scriptFuncs]) => {
            if (scriptFuncs && "Initialize" in scriptFuncs) {
                log(`[ETC] Initializing ${scriptName}`);
                scriptFuncs.Initialize(true);
            }
        }), 1000);
    } else {
        log("[ETC] Error Updating State Storage. Unfortunately, a full reinstall of ETC is necessary to fix this issue.");
    }
});
// #endregion ▄▄▄▄▄ Event Listener ▄▄▄▄▄
