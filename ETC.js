void MarkStart("ETC");
/******▌████████████████████████████████████████████████████████████▐******\
|*     ▌██████▓▒░ !ETC: EUNOMIAC'S TEXT CONTROLS for Roll20 ░▒▓█████▐     *|
|*     ▌████████████████████████████████████████████████████████████▐     *|
|*     ▌█████████████████████▓▒░ v0.13-alpha ░▒▓████████████████████▐     *|
|*     ▌████████████████████▓▒░ June 25, 2021 ░▒▓███████████████████▐     *|
|*     ▌███▓▒░ https://github.com/Eunomiac/EunosRoll20Scripts ░▒▓███▐     *|
\******▌████████████████████████████████████████████████████████████▐******/

const ETC = (() => {
    // #region ░░░░░░░[FRONT]░░░░ Boilerplate Namespacing & Initialization ░░░░░░

    // #region ========== Namespacing: Basic State References & Namespacing ===========
    const SCRIPTNAME = "ETC";
    const DEFAULTSTATE = {/* initial values for state storage, if any */
        REGISTRY: {},
        IsAutoShadowing: false,
        IsAutoPruning: false,
        IsShowingIntro: true
    };
    const RO = {get OT() { return EunoCORE.ROOT }};
    const STA = {get TE() { return EunoCORE.getSTATE(SCRIPTNAME) }};
    const RE = {get G() { return STA.TE.REGISTRY }};
    // #endregion _______ Namespacing _______

    // #region ========== Initialization: Script Startup & Event Listeners ===========
    const {C} = EunoCORE;
    let CFG, LIB, U, O, H;
    const Preinitialize = (isResettingState = false) => {
        // Reset script state entry, if specified
        if (isResettingState) { delete EunoCORE.ROOT[SCRIPTNAME] }

        // Initialize script state entry with default values where needed
        Object.entries(DEFAULTSTATE)
            .filter(([key]) => !(key in STA.TE))
            .forEach(([key, defaultVal]) => { STA.TE[key] = defaultVal });

        // Define local-scope shorthand references for main script components
        ({CFG, LIB, U, O, H} = EunoCORE);
    };
    const Initialize = (isRegisteringEventListeners = false, isResettingState = false) => {

        // Reset script state entry, if specified
        if (isResettingState) { Preinitialize(true) }

        // Register event handlers, if specified
        if (isRegisteringEventListeners) {
            on("chat:message", handleMessage);
            on("change:text", handleTextChange);
            on("add:text", handleTextAdd);
            on("destroy:text", handleTextDestroy);
        }

        // Report readiness
        U.Flag(`${SCRIPTNAME} Ready!`); log(`[Euno] ${SCRIPTNAME} Ready!`);

        // Display Help message, if so configured
        if (STA.TE.isDisplayingHelpAtStart) {H.DisplayETCHelp()}
    };
    // #endregion _______ Initialization _______

    // #region ========== Events: Event Handlers ===========
    const handleMessage = (msg) => {
        if (msg.content.startsWith("!etc") && playerIsGM(msg.playerid)) {
            let [call, ...args] = (msg.content.match(/!\S*|\s@"[^"]*"|\s@[^\s]*|\s"[^"]*"|\s[^\s]*/gu) || [])
                .map((x) => x.replace(/^\s*(@)?"?|"?"?\s*$/gu, "$1"))
                .filter((x) => Boolean(x));
            // *** INSTEAD OF ALL THE CHECKS, JUST USE A TRY/CATCH BLOCK WITH HELP MESSAGE AS DEFAULT
            if (({
                shadow: () => makeTextShadow(U.GetSelObjs(msg, "text")),
                toggle: () => ({
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
                prune: () => { pruneText(args.includes("all") ? "all" : U.GetSelObjs(msg, "text")) },
                setup: () => { displayToggles() },
                help: () => {
                    if (({
                        shadow: () => toggleAutoShadow(args.includes("true")),
                        prune: () => toggleAutoPrune(args.includes("true"))
                    }[(call = args.shift() || "").toLowerCase()] || (() => false))() === false) {
                        H.DisplayETCHelp();
                    }
                },
                purge: () => ({
                    state: () => Preinitialize(true),
                    reg: () => STA.TE.REGISTRY = {}
                }[(call = args.shift() || "").toLowerCase()] || (() => false))(),
                test: () => ({
                    state: () => U.Show(state),
                    root: () => U.Show(EunoCORE.ROOT),
                    stateref: () => U.Show(STA.TE),
                    data: () => { U.Show((msg.selected || [null]).map((sel) => sel && "_type" in sel && getObj(sel._type, sel._id))) }
                }[(call = args.shift() || "").toLowerCase()] || (() => false))()
            }[(call = args.shift() || "").toLowerCase()] || (() => false))() === false) {
                H.DisplayETCHelp();
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
            if (!(STA.TE.IsAutoPruning && pruneText(textObj))) {
                if (STA.TE.IsAutoShadowing && !isShadowObj(textObj)) {
                    makeTextShadow(textObj);
                }
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
    // #endregion _______ Events _______

    // #region *** *** UTILITY *** ***
    const isShadowObj = (val) => U.GetR20Type(val) === "text" && /etcshadowobj/u.test(val.get("controlledby"));
    const getOffsets = (fontFamily, fontSize) => ({
        ...CFG.TextShadows.OFFSETS.generic,
        ...(fontFamily in CFG.TextShadows.OFFSETS ? CFG.TextShadows.OFFSETS[fontFamily] : CFG.TextShadows.OFFSETS.generic)
    }[fontSize]);
    // #endregion *** *** UTILITY *** ***

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

    // #region *** *** FEATURE: EMPTY TEXT PRUNING *** ***
    const toggleAutoPrune = (isActive) => {
        STA.TE.IsAutoPruning = isActive === true;
        displayToggles();
    };
    const pruneText = (textRef) => {
        if (textRef === "all") {
            textRef = findObjs({_type: "text"});
        } else {
            textRef = [textRef].flat();
        }
        U.Show(textRef, "Text Refs");
        textRef.forEach((textObj) => { if (!textObj.get("text")) { textObj.remove() } });
    };
    // #endregion *** *** EMPTY TEXT PRUNING *** ***

    // #region *** *** FEATURE: ATTRIBUTE DISPLAYS *** ***

    // #region         Attribute Displays: Linking Text Objects
    /* const getAttr = (charRef, attrRef) => {
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
            }; */
    /* const linkTextToAttr = (textObj, charRef, attrRef, options = {}) => {
                if (!U.GetR20Type(textObj)) { return false }
                const charObj = U.GetChar(charRef);
                if (!U.GetR20Type(charObj)) { return false }
                const attrObj = U.GetAttr(charObj, attrRef);
                if (!U.GetR20Type(attrObj)) { return false }


                return true;
            }; */
    // #endregion


    // #endregion *** *** ATTRIBUTE DISPLAYS *** ***

    // #region *** *** CHAT DISPLAYS & MENUS *** ***
    const displayToggles = () => {
        U.Alert(H.Box([
            H.Block([
                H.H("[ETC] Options", 1),
                H.Paras([
                    "Hover over the description on the left for more details about any given setting."
                ]),
                H.Span([
                    H.Span(`Intro Message <span style="color: ${STA.TE.IsShowingIntro ? "darkgreen" : "darkred"};"><u>${STA.TE.IsShowingIntro ? "EN" : "DIS"}ABLED</u></span>`, {
                        // background: "transparent",
                        // color: "black",
                        "font-size": "14px",
                        "line-height": "18px",
                        "font-family": "sans-serif",
                        "font-weight": "bold",
                        margin: "-5px 0 10px 0"
                    }, "Whether to display the introductory help message on sandbox startup."),
                    H.ButtonWide(STA.TE.IsShowingIntro ? "DISABLE" : "ENABLE", `!etc toggle intro ${STA.TE.IsShowingIntro ? "false" : "true"}`,  {
                        color: STA.TE.IsShowingIntro ? "white" : "black",
                        width: "27%",
                        background: STA.TE.IsShowingIntro ? "red" : "lime",
                        padding: "2px",
                        "margin-top": "-5px",
                        float: "right"
                    })
                ], {width: "97%"}),
                H.Span([
                    H.Span(`Object Pruning <span style="color: ${STA.TE.IsAutoPruning ? "darkgreen" : "darkred"};"><u>${STA.TE.IsAutoPruning ? "EN" : "DIS"}ABLED</u></span>`, {
                        // background: "transparent",
                        "font-size": "14px",
                        "line-height": "18px",
                        "font-family": "sans-serif",
                        "font-weight": "bold",
                        margin: "-5px 0 10px 0"
                    }, "Whether empty text objects are automatically removed whenever they appear."),
                    H.ButtonWide(STA.TE.IsAutoPruning ? "DISABLE" : "ENABLE", `!etc toggle autoprune ${STA.TE.IsAutoPruning ? "false" : "true"}`, {
                        color: STA.TE.IsAutoPruning ? "white" : "black",
                        width: "27%",
                        background: STA.TE.IsAutoPruning ? "red" : "lime",
                        padding: "2px",
                        "margin-top": "-5px",
                        float: "right"
                    })
                ], {width: "97%"}),
                H.Span([
                    H.Span(`Auto-Shadow <span style="color: ${STA.TE.IsAutoShadowing ? "darkgreen" : "darkred"};"><u>${STA.TE.IsAutoShadowing ? "EN" : "DIS"}ABLED</u></span>`, {
                        // background: "transparent",
                        // color: "black",
                        "font-size": "14px",
                        "line-height": "18px",
                        "font-family": "sans-serif",
                        "font-weight": "bold",
                        margin: "-5px 0 10px 0"
                    }, "Whether shadows should be created automatically for all new text objects."),
                    H.ButtonWide(STA.TE.IsAutoShadowing ? "DISABLE" : "ENABLE", `!etc toggle autoshadow ${STA.TE.IsAutoShadowing ? "false" : "true"}`,  {
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
            AddShadowToShadow: H.Box([
                H.H("[ETC] ERROR: Shadow-On-Shadow", 1, {"font-family": "sans-serif"}),
                H.Block([
                    H.H("Cannot Add a Shadow to a Shadow Object"),
                    H.Paras([
                        "Text shadows cannot have shadows themselves."
                    ])
                ])
            ]),
            ManualShadowRemoval: H.Box([
                H.H("[ETC] ERROR: Shadow Deleted", 1, {"font-family": "sans-serif"}),
                H.Block([
                    H.H("Restoring ..."),
                    H.Paras([
                        "Manually-deleted text shadows are automatically recreated (to prevent accidentally deleting a desired shadow).",
                        "To remove a text shadow from a text object:",
                        `${H.CodeSpan("!etc clear")} — Removes text shadows from all selected text objects <i>(you can select either the master object, the shadow object, or both)</i>`,
                        `${H.CodeSpan("!etc clear all")} — Remove <b><u>ALL</u></b> text shadow objects <i>(this will not affect the master text objects, just remove the shadows)</i>`
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
})();


EunoCORE.regSCRIPT("ETC", ETC);
void MarkStop("ETC");