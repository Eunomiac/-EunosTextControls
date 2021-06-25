/**
 *
 * EUNOMIAC'S TEXT CONTROLS FOR ROLL20
 *
 *      Version: 0.1-alpha
 *      Date: June 23, 2001
 *      GitHub: https://github.com/Eunomiac/-EunosTextControls
 *
 */

const EunosTextControls = (() => {
    // #region *** *** FRONT *** ***

    // #region      Front: Basic References
    const ROOTNAME = "Euno";
    const RO = {get OT() { return ROOTNAME in state ? state[ROOTNAME] : false }};

    const SCRIPTNAME = "EunosTextControls";

    if (!RO.OT[SCRIPTNAME] && RO.OT.EunosTextControl) {
        RO.OT[SCRIPTNAME] = {...RO.OT.EunosTextControl};
        delete RO.OT.EunosTextControl;
    }

    const STA = {get TE() { return (RO.OT && SCRIPTNAME in RO.OT) ? RO.OT[SCRIPTNAME] : false}};

    const DEFAULTSTATE = { // Initial values for state storage.
        REGISTRY: {},
        IsAutoShadowing: false,
        IsAutoPruning: false,
        IsShowingIntro: true
    };
    const RE = {get G() { return (STA.TE && "REGISTRY" in STA.TE) ? STA.TE.REGISTRY : {} }};
    // #endregion

    // #region      Front: Initialization
    const Initialize = (isRegisteringEventListeners = false, isResettingState = false) => {

        state[ROOTNAME] = state[ROOTNAME] || {};

        // Initialize state storage with DEFAULTSTATE where needed.
        if (isResettingState) { delete RO.OT[SCRIPTNAME] }
        RO.OT[SCRIPTNAME] = RO.OT[SCRIPTNAME] || {};
        Object.entries(DEFAULTSTATE).filter(([key]) => !(key in STA.TE)).forEach(([key, defaultVal]) => { STA.TE[key] = defaultVal });

        // Register event handlers for chat commands and text object changes.
        if (isRegisteringEventListeners) {
            on("chat:message", handleMessage);
            on("change:text", handleTextChange);
            on("add:text", handleTextAdd);
            on("destroy:text", handleTextDestroy);
        }

        // Report Readiness.
        flagGM(`${SCRIPTNAME} Ready!`);
        log(`${SCRIPTNAME} Ready!`);

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
            ({
                help: () => displayIntroMessage(),
                shadow: () => makeTextShadow(getSelTextObjs(msg)),
                toggle: () => ({
                    intro: () => toggleIntroMessage(args.includes("true")),
                    autoshadow: () => toggleAutoShadow(args.includes("true")),
                    autoprune: () => toggleAutoPrune(args.includes("true"))
                }[(call = args.shift() || "").toLowerCase()] || (() => false))(),
                clear: () => {
                    if (args.includes("all")) {
                        Object.entries(RE.G).filter(([id, textData]) => "masterID" in textData).forEach(([id, textData]) => unregTextShadow(id));
                        flagGM("Shadow objects removed.");
                        flagGM("Registered shadows cleared.");
                    } else {
                        unregTextShadow(getSelTextObjs(msg).map((obj) => obj.id));
                    }
                },
                fix: () => { if (args.includes("all")) { fixTextShadows() } },
                setup: () => { displayToggles() },
                test: () => ({
                    state: () => showGM(state),
                    root: () => showGM(RO.OT),
                    stateref: () => showGM(STA.TE),
                    data: () => { showGM((msg.selected || [null]).map((sel) => sel && "_type" in sel && getObj(sel._type, sel._id))) }
                }[(call = args.shift() || "").toLowerCase()] || (() => false))()
            }[(call = args.shift() || "").toLowerCase()] || (() => false))();
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

    // #region *** *** CONFIGURATION *** ***

    // #region    Configuration: Text Object Control
    const INACTIVELAYER = "walls"; /** The layer to send text objects to when they are toggled off. Change to 'gmlayer' if you
                                     * need the lighting ("walls") layer for Dynamic Lighting. */
    // #endregion

    // #region      Configuration: Text Shadows
    const SHADOWOFFSETS = {
        /** The number of pixels to offset each text shadow, depending on the font size and family of the master object.
          * The first number is the horizontal shift, the second is the vertical shift.
          *
          * If any shadows appear too close or too far from each other for a given font size, tweaking the values here
          * and then running "!etc fix all" will update all text objects with new offsets.
          *
          * Generic values are used UNLESS a specific override for that font-family and size exists.
          *     Overrides can be delivered via getters and the scaleOffsets() function if they're simple multiples (see examples below),
          *     ... OR you can define custom values for each font size (see e.g. "Contrail One", below, which is just an example and no different from generic) */
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
        get "Shadows Into Light"() { return scaleOffsets(SHADOWOFFSETS.generic, 0.5) },
        /** scaleOffsets(offsetTable, multiplier): Returns a copy of the provided offset table, with its values scaled by the multiplier.
          *                                          - Can submit different horizontal and vertical multipliers by passing them as an array,
          *                                            i.e. [<horizMult>, <vertMult>] */
        get "Arial"() { return scaleOffsets(SHADOWOFFSETS.generic, 0.6) },
        get "Patrick Hand"() { return scaleOffsets(SHADOWOFFSETS.generic, 0.75) },
        "Contrail One": { // (for illustration only: does not differ from generic offsets)
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
            56: [3, 3],
            72: [5, 5],
            100: [6, 6],
            200: [12, 12],
            300: [16, 16]
        }
    };
    const SHADOWLAYER = "map"; /** The layer containing shadow objects.
                                * Keeping master objects on the Objects layer and shadow objects on the Map layer makes
                                * it easier to manipulate the master objects without the shadows getting in your way.
                                * (Keeping both on the map layer also works well!) */
    const SHADOWCOLOR = "black"; /** Change this value (hex, color names and rgb/a values are all valid) to change the color assigned
                                   * to text shadow objects. */

    // #endregion

    // #endregion *** *** CONFIGURATION *** ***

    // #region *** *** UTILITY *** ***

    const throttleTimers = {};
    const parseStyles = (styleData) => {
        // Parse object containing CSS styles to inline style attribute.
        if (typeof styleData === "string") {
            return styleData.replace(/\s{2,}/gu, " ").replace(/'(serif|sans-serif|monospace)'/gu, "$1");
        } else {
            return Object.entries(styleData).map(([prop, val]) => `${prop}: ${val}`).join("; ").replace(/'(serif|sans-serif|monospace)'/gu, "$1");
        }
    };
    const getR20Type = (val) => { // Returns specific type/subtype of R20 object, or false if val isn't an R20 object.
        if (_.isObject(val) && val.id && "get" in val) {
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
    const isShadowObj = (val) => getR20Type(val) === "text" && /etcshadowobj/u.test(val.get("controlledby"));
    const getSelTextObjs = (msg) => { // Returns an array of selected text objects.
        if (msg.selected && msg.selected.length) {
            return msg.selected.filter((objData) => objData._type === "text").map((objData) => getObj("text", objData._id));
        }
        return [];
    };
    const jS = (val) => JSON.stringify(val, null, 2).replace(/\n/g, "<br>").replace(/ /g, "&nbsp;"); // Stringification for display in R20 chat.
    const jC = (val) => HTML.CodeBlock(jS(val)); // Stringification for data objects and other code for display in R20 chat.
    const alertGM = (content, title) => { // Simple alert to the GM. Style depends on presence of content, title, or both.
        const randStr = () => _.sample("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split(""), 4).join("");
        if (content || title) {
            if (title) {
                if (content === null) {
                    sendChat(randStr(), `/w gm ${HTML.Box(HTML.Header(title, "#555"))}`, null, {noarchive: true});
                } else {
                    sendChat(randStr(), `/w gm ${HTML.Box([
                        HTML.Header(title, "#555"),
                        HTML.Block(content)
                    ].join(""))}`, null, {noarchive: true});
                }
            } else {
                sendChat(randStr(4), `/w gm ${content}`, null, {noarchive: true});
            }
        }
    };
    const showGM = (obj, title = "Showing ...") => alertGM(HTML.CodeBlock(jC(obj)), title); // Show properties of stringified object to GM.
    const flagGM = (msg) => alertGM(null, msg); // Simple one-line chat flag sent to the GM.
    const keyMapObj = (obj, keyFunc = (x) => x, valFunc = undefined) => {
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
    const getOffsets = (fontFamily, fontSize) => ({
        ...SHADOWOFFSETS.generic,
        ...(fontFamily in SHADOWOFFSETS ? SHADOWOFFSETS[fontFamily] : SHADOWOFFSETS.generic)
    }[fontSize]);
    const scaleOffsets = (sourceOffsets, multiplier) => keyMapObj(
        sourceOffsets,
        (v) => {
            if (Array.isArray(multiplier)) {
                return [v[0] * multiplier[0], v[1] * multiplier[1]];
            }
            return [v[0] * multiplier, v[1] * multiplier];
        }
    );

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
                    flagGM("Cannot add a shadow to an existing text shadow object!");
                    isSkipping = true;
                }
            }
            if (!isSkipping) {
                if (getR20Type(masterObj) === "text") {
                    const [leftOffset, topOffset] = getOffsets(masterObj.get("font_family"), masterObj.get("font_size"));
                    const shadowOffsets = SHADOWOFFSETS[masterObj.get("font_family") in SHADOWOFFSETS ? masterObj.get("font_family") : "generic"];
                    const shadowObj = createObj("text", {
                        _pageid: masterObj.get("_pageid"),
                        left: masterObj.get("left") + leftOffset,
                        top: masterObj.get("top") + topOffset,
                        text: masterObj.get("text"),
                        font_size: masterObj.get("font_size"),
                        rotation: masterObj.get("rotation"),
                        font_family: masterObj.get("font_family"),
                        color: SHADOWCOLOR,
                        layer: SHADOWLAYER,
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
                : (getR20Type(objOrID) && objOrID.id);
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
        if (getR20Type(masterObj) && getR20Type(shadowObj)) {
            const [leftOffset, topOffset] = getOffsets(masterObj.get("font_family"), masterObj.get("font_size"));
            if (![leftOffset, topOffset].includes(undefined)) {
                shadowObj.set({
                    text: masterObj.get("text"),
                    left: masterObj.get("left") + leftOffset,
                    top: masterObj.get("top") + topOffset,
                    layer: masterObj.get("layer") === INACTIVELAYER ? INACTIVELAYER : SHADOWLAYER,
                    color: SHADOWCOLOR,
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
                    textObj.remove();
                }
                const shadowObj = getObj("text", objData.shadowID);
                if (!shadowObj) { // Create a shadow if it's missing
                    makeTextShadow(textObj);
                } else if (!(shadowObj.id in RE.G)) { // ... same for registry.
                    regTextShadow(textObj, shadowObj);
                }
            } else { // Should never get here.
                alertGM(`Registry entry for ${id} does not contain a masterID or a shadowID`, "REGISTRY ERROR");
            }
        }

        // THREE: Cycle through registry again, synchronizing all shadow objects.
        for (const [id, shadowData] of Object.entries(RE.G).filter(([id, data]) => "masterID" in data)) {
            const [masterObj, shadowObj] = [getObj("text", shadowData.masterID), getObj("text", id)];
            syncShadow(masterObj, shadowObj);
        }

        flagGM("Text Shadows Synchronized.");
    };
    // #endregion

    // #endregion *** *** TEXT SHADOWS *** ***

    // #region *** *** HTML *** ***

    // #region      HTML: Styles

    const CHATWIDTH = 270; // The minimum width of the chat panel, in pixels.

    const UPSHIFT = -25;   // Constants governing how the chat box is positioned in the chat panel: By default, everything
    const LEFTSHIFT = -42; // shifts up and to the left to cover the standard chat output with the custom styles below.
    const BOTTOMSHIFT = 0;

    const HTML = {
        Box: (content, title) => `<div style="${parseStyles(`
                display: block;
                width: auto; min-width: ${CHATWIDTH}px;
                height: auto; min-height: 14px;
                margin: ${UPSHIFT}px 0 ${BOTTOMSHIFT}px ${LEFTSHIFT}px;
                padding: 0;
                text-align: center; text-align-last: center;
                position: relative;
                border: none; text-shadow: none; box-shadow: none;
                background: white;
                outline: 2px solid black;
                overflow: hidden;
            `)}"${title ? ` title="${title}"` : ""}>${[content].flat().join("")}</div>`,
        Block: (content, bgColor = "white", fontFamily = "serif", fontWeight = "normal", fontSize = 14, lineHeight = undefined, title = undefined) => `<div style="${parseStyles({
            "width": "97%",
            "margin": "2px 0 0 0",
            "padding": "1.5%",
            "text-align": "left", "text-align-last": "left",
            "background": bgColor,
            "font-family": `'${fontFamily}'`,
            "font-weight": fontWeight,
            "font-size": `${fontSize}px`,
            "line-height": `${lineHeight ? lineHeight : fontSize + 4}px`
        })}"${title ? ` title="${title}"` : ""}>${[content].flat().join("")}</div>`,
        Header: (content, bgColor = "rgba(80,80,80,1)", fontWeight = "normal", title = undefined) => `<span style="${parseStyles({
            "display": "block",
            "height": "auto",
            "width": "auto",
            "margin": "0",
            "padding": "0 5px",
            "text-align": "left", "text-align-last": "left",
            "color": "white",
            "font-family": "sans-serif",
            "font-size": "16px",
            "line-height": "24px",
            "font-variant": "small-caps",
            "background-color": bgColor,
            "font-weight": fontWeight,
            "border": "none", "text-shadow": "none", "box-shadow": "none"
        })}"${title ? ` title="${title}"` : ""}>${[content].flat().join("")}</span>`,
        CodeBlock: (content, bgColor = "white") => HTML.Block(content, bgColor, "monospace", "bold", 10),
        CodeSpan: (content, title) => `<span style="${parseStyles({
            "display": "inline-block",
            "font-family": "monospace",
            "font-weight": "bolder",
            "font-size": "12px",
            "background": "#AAA",
            "padding": "0 5px"
        })}"${title ? ` title="${title}"` : ""}>${[content].flat().join("")}</span>`,
        Button: (name, command, styles = {}, title = undefined) => `<span style="${parseStyles(Object.assign({
            "display": "inline-block",
            "width": "100%",
            "text-align": "center",
            "vertical-align": "baseline",
            "margin": "0",
            "float": "none"
        }, _.pick(styles, "display", "width", "text-align", "vertical-align", "margin", "float")))}"${title ? ` title="${title}"` : ""}><a href="${command}" style="${parseStyles(Object.assign({
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
        H: (content, level = 3, styles = {}, title = undefined) => `<h${level} style="${parseStyles(Object.assign([
            null, // <H0>
            { // <H1>
            },
            { // <H2>
                display: "block",
                height: "26px",
                "font-family": "sans-serif",
                "line-height": "26px",
                "margin": "0 0 9px -2%",
                color: "white",
                "text-indent": "4px",
                width: "105%",
                "background-image": "linear-gradient(90deg, black 50%, #AAA 100%)",
                "border": "2px solid black"
            },
            { // <H3>
                display: "block",
                "font-family": "sans-serif",
                "line-height": "20px",
                "margin": "0 0 9px -1%",
                color: "white",
                "text-indent": "4px",
                width: "102%",
                "background-image": "linear-gradient(90deg, black 50%, #AAA 100%)"
            },
            { // <H4>
                display: "block",
                "font-family": "sans-serif",
                "border-bottom": "2px solid gray",
                "margin": "0 0 5px 0",
                "line-height": "14px"
            },
            { // <H5>
            }
        ][level], styles))}"${title ? ` title="${title}"` : ""}>${[content].flat().join("")}</h${level}>`,
        Spacer: (height, display = "block") => `<span style="${parseStyles({
            display,
            height
        })}">&nbsp;</span>`,
        Paras: (content, styles = {}) => [content].flat().map((para) => `<p style="${parseStyles(Object.assign({
            "line-height": "15px",
            "font-family": "serif"
        }, styles))}">${para}</p>`).join(""),
        Span: (content, styles = {}, title = undefined) => `<span style="${parseStyles(Object.assign({
            "display": "inline-block",
            "width": "auto",
            "background": "none",
            "color": "black",
            "font-size": "14px",
            "line-height": "18px"
        }, styles))}"${title ? ` title="${title}"` : ""}>${[content].flat().join("")}</span>`, //  bgColor = "none", color = "black", fontSize = "14px", lineHeight = "18px") =>
        Img: (imgSrc, title) => `<img src="${imgSrc}"${title ? ` title="${title}"` : ""}>`
    };
    // #endregion

    // #region      HTML: Chat Displays & Menus
    const toggleIntroMessage = (isActive) => {
        STA.TE.IsShowingIntro = isActive === true;
        displayToggles();
    };
    const displayIntroMessage = () => {
        alertGM(HTML.Box([
            HTML.Header("Eunomiac's Text Controls v.0.1"),
            HTML.Block([
                HTML.Img("https://raw.githubusercontent.com/Eunomiac/-EunosTextControls/master/images/Header%20-%20Text%20Shadows%200.1.jpg"),
                HTML.Spacer("3px"),
                HTML.Button("Latest Version", "https://github.com/Eunomiac/-EunosTextControls/releases", {background: "green", color: "white"}),
                HTML.Spacer("3px"),
                HTML.Button("Issue Tracking", "https://github.com/Eunomiac/-EunosTextControls/issues", {background: "rgba(255,0,0,0.8)", color: "white"}),
                HTML.Spacer("3px"),
                HTML.Button("Roll20 Forum Thread", "https://app.roll20.net/forum/permalink/10184021/", {background: "magenta", color: "white"}),
                HTML.Spacer("5px"),
                HTML.Paras(["This script pack&shy;age is in&shy;tended to be a com&shy;pre&shy;hen&shy;sive so&shy;lution to ma&shy;naging Roll20 Text Ob&shy;jects via API com&shy;mands or scrip&shy;ted auto&shy;mation. At the mo&shy;ment, how&shy;ever, only the 'Text Sha&shy;dows' fea&shy;ture is cur&shy;rently im&shy;ple&shy;ment&shy;ed."]),
                HTML.H("Basic Chat Commands"),
                HTML.Paras([
                    `${HTML.CodeSpan("!etc help")} — View this help message.`,
                    `${HTML.CodeSpan("!etc setup")} — Ac&shy;ti&shy;vate or de&shy;ac&shy;ti&shy;vate any of the fea&shy;tures in this script pack&shy;age.`,
                    `${HTML.CodeSpan("!etc purge all")} — <b><u>FULLY</u> RE&shy;SET <u>ALL</u></b> script fea&shy;tures, re&shy;tur&shy;ning it to its de&shy;fault in&shy;stall&shy;ation state. Sha&shy;dow ob&shy;jects will be purged, lea&shy;ving the ma&shy;ster ob&shy;jects un&shy;touched.`
                ]),
                HTML.H("Feature: Text Shadows", 2),
                HTML.Img("https://raw.githubusercontent.com/Eunomiac/-EunosTextControls/master/images/Header%20-%20Text%20Shadows%200.1.jpg"),
                HTML.Paras([
                    "Add plea&shy;sant sha&shy;dows to sand&shy;box text ob&shy;jects in Roll20 — either <b>auto&shy;matically</b>, when&shy;ever new text is ad&shy;ded to the sand&shy;box, or <b>man&shy;ually</b>, by se&shy;lect&shy;ing text ob&shy;jects and re&shy;gister&shy;ing them for a sha&shy;dow via the com&shy;mands be&shy;low.",
                    "Sha&shy;dow ob&shy;jects are in&shy;tended to be hands off: They're crea&shy;ted auto&shy;ma&shy;ti&shy;cally when re&shy;gist&shy;ered, will up&shy;date when&shy;ever their mas&shy;ter text ob&shy;ject's po&shy;sition and/or con&shy;tent changes, and will be re&shy;moved if the mas&shy;ter ob&shy;ject is ever de&shy;leted."
                ]),
                HTML.H("Chat Commands for Text Shadows", 4),
                HTML.Paras([
                    `${HTML.CodeSpan("!etc shadow")} — <b>ADD</b> sha&shy;dow(s) to all se&shy;lec&shy;ted text ob&shy;jects.`,
                    `${HTML.CodeSpan("!etc clear")} — <b>REMOVE</b> sha&shy;dow(s) from all se&shy;lec&shy;ted text ob&shy;jects <i>(you can se&shy;lect either mas&shy;ter ob&shy;jects and/or sha&shy;dow ob&shy;jects for this com&shy;mand)</i>`,
                    `${HTML.CodeSpan("!etc clear all")} — <b>REMOVE <u>ALL</u></b> text sha&shy;dow ob&shy;jects <i>(this will not af&shy;fect the mas&shy;ter text ob&shy;jects, just re&shy;move the sha&shy;dows)</i>`,
                    `${HTML.CodeSpan("!etc fix all")} — <b>FIX <u>ALL</u></b> text sha&shy;dow ob&shy;jects, cor&shy;rect&shy;ing for any er&shy;rors in po&shy;sit&shy;ion or con&shy;tent, as well as spot&shy;ting and pru&shy;ning any or&shy;phaned ob&shy;jects from the re&shy;gistry.`
                ]),
                HTML.H("Fine-Tuning Text Shadows", 4),
                HTML.Paras(`The code con&shy;tains fur&shy;ther con&shy;fig&shy;ura&shy;tion op&shy;tions in the <b>${HTML.CodeSpan("&#42;&#42;&#42; CON&shy;FIG&shy;URATION &#42;&#42;&#42;")}</b> sec&shy;tion. There, you can change the co&shy;lor of the sha&shy;dows, or fine-&shy;tune sha&shy;dow off&shy;sets down to the pix&shy;el for spe&shy;ci&shy;fic fonts and/&shy;or si&shy;zes.`),
                HTML.H("Spam Control"),
                HTML.Paras([`To pre&shy;vent this mes&shy;sage from dis&shy;play&shy;ing at start-&shy;up, click the but&shy;ton be&shy;low. <i>(You can al&shy;ways view this mes&shy;sage again via the ${HTML.CodeSpan("!etc help")} com&shy;mand.)</i>`
                ]),
                HTML.Button("Don't Display This At Startup", "!etc toggle intro false")
            ])
        ]));
    };
    const displayToggles = () => {
        alertGM(HTML.Box([
            HTML.Block([
                HTML.H("[ETC] Options", 2,  {margin: "-10px 0 6px -2%"}),
                HTML.Paras([
                    "Hover over the description on the left for more details about any given setting."
                ]),
                HTML.Span([
                    HTML.Span(`Intro Message <span style="color: ${STA.TE.IsShowingIntro ? "darkgreen" : "darkred"};"><u>${STA.TE.IsShowingIntro ? "EN" : "DIS"}ABLED</u></span>`, {
                        background: "transparent",
                        color: "black",
                        "font-size": "14px",
                        "line-height": "18px",
                        "font-family": "sans-serif",
                        "font-weight": "bold",
                        margin: "-5px 0 10px 0"
                    }, "Whether to display the introductory help message on sandbox startup."),
                    HTML.Button(STA.TE.IsShowingIntro ? "DISABLE" : "ENABLE", `!etc toggle intro ${STA.TE.IsShowingIntro ? "false" : "true"}`,  {
                        color: STA.TE.IsShowingIntro ? "white" : "black",
                        width: "27%",
                        background: STA.TE.IsShowingIntro ? "red" : "lime",
                        padding: "2px",
                        "margin-top": "-5px",
                        float: "right"
                    })
                ], {width: "97%"}),
                HTML.Span([
                    HTML.Span(`Object Pruning <span style="color: ${STA.TE.IsAutoPruning ? "darkgreen" : "darkred"};"><u>${STA.TE.IsAutoPruning ? "EN" : "DIS"}ABLED</u></span>`, {
                        background: "transparent",
                        "font-size": "14px",
                        "line-height": "18px",
                        "font-family": "sans-serif",
                        "font-weight": "bold",
                        margin: "-5px 0 10px 0"
                    }, "Whether empty text objects are automatically removed whenever they appear."),
                    HTML.Button(STA.TE.IsAutoPruning ? "DISABLE" : "ENABLE", `!etc toggle autoprune ${STA.TE.IsAutoPruning ? "false" : "true"}`, {
                        color: STA.TE.IsAutoPruning ? "white" : "black",
                        width: "27%",
                        background: STA.TE.IsAutoPruning ? "red" : "lime",
                        padding: "2px",
                        "margin-top": "-5px",
                        float: "right"
                    })
                ], {width: "97%"}),
                HTML.Span([
                    HTML.Span(`Auto-Shadow <span style="color: ${STA.TE.IsAutoShadowing ? "darkgreen" : "darkred"};"><u>${STA.TE.IsAutoShadowing ? "EN" : "DIS"}ABLED</u></span>`, {
                        background: "transparent",
                        color: "black",
                        "font-size": "14px",
                        "line-height": "18px",
                        "font-family": "sans-serif",
                        "font-weight": "bold",
                        margin: "-5px 0 10px 0"
                    }, "Whether shadows should be created automatically for all new text objects."),
                    HTML.Button(STA.TE.IsAutoShadowing ? "DISABLE" : "ENABLE", `!etc toggle autoshadow ${STA.TE.IsAutoShadowing ? "false" : "true"}`,  {
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
            ManualShadowRemoval: HTML.Box([
                HTML.Header("[ETC] ERROR: Shadow Deleted", "rgb(255, 30, 30)", "bold"),
                HTML.Block([
                    HTML.H("Restoring ..."),
                    HTML.Paras([
                        "Manually-deleted text shadows are automatically recreated (to prevent accidentally deleting a desired shadow).",
                        "To remove a text shadow from a text object:",
                        `${HTML.CodeSpan("!etc clear")} — Removes text shadows from all selected text objects <i>(you can select either the master object, the shadow object, or both)</i>`,
                        `${HTML.CodeSpan("!etc clear all")} — Remove <b><u>ALL</u></b> text shadow objects <i>(this will not affect the master text objects, just remove the shadows)</i>`
                    ])
                ])
            ])
        };
        if (errorTag in ERRORHTML) {
            alertGM(ERRORHTML[errorTag]);
        }
    };
    // #endregion

    // #endregion *** *** HTML *** ***

    return {Initialize};
})();

on("ready", () => EunosTextControls.Initialize(true));