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
        IsAutoPruning: false
    };

    const STA = {get TE() { return EunoCORE.getSTATE(SCRIPTNAME) }};
    const RE = {get G() { return STA.TE.REGISTRY }};
    // #endregion _______ Namespacing _______

    // #region ========== Initialization: Script Startup & Event Listeners ===========

    // Define shorthand references to major script components.
    const {C} = EunoCORE; let CFG, LIB, U, O, H; // these have to be declared now, but must wait for intialization to be assigned
    const Preinitialize = (isResettingState = false) => {
        // Reset script state entry, if specified
        if (isResettingState) { delete EunoCORE.ROOT[SCRIPTNAME] }

        // Initialize script state entry with default values where needed
        Object.entries(DEFAULTSTATE)
            .filter(([key]) => !(key in STA.TE))
            .forEach(([key, defaultVal]) => { STA.TE[key] = defaultVal });
    };
    const Initialize = (isRegisteringEventListeners = false, isResettingState = false) => {
        // Assign shorthand script references to their (now preinitialized) scripts
        ({CFG, LIB, U, O, H} = EunoCORE);

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
        LIB.ReportReady(`!${SCRIPTNAME}`, "Euno");
    };
    // #endregion _______ Initialization _______

    // #region ========== Events: Event Handlers ===========
    const handleMessage = (msg) => {
        if (msg.content.startsWith("!etc") && playerIsGM(msg.playerid)) {
            let [call, ...args] = (msg.content.match(/!\S*|\s@"[^"]*"|\s"[^"]*"|\s[^\s]*/gu) || [])
                .map((x) => x.replace(/^\s*(@)?"?|"?"?\s*$/gu, "$1"))
                .filter((x) => Boolean(x));
            try {
                ({
                    shadow: () => makeTextShadow(O.GetSelObjs(msg, "text")),
                    toggle: () => ({
                        autoshadow: () => toggleAutoShadow(args.includes("true")),
                        autoprune: () => toggleAutoPrune(args.includes("true"))
                    }[(call = args.shift() || "").toLowerCase()] || (() => false))(),
                    clear: () => {
                        if (args.includes("all")) {
                            getTextShadow("registered").forEach(((shadow) => unregTextShadow(shadow)));
                            U.Flag("Shadows Removed & Unregistered.", 2);
                        } else {
                            unregTextShadow(O.GetSelObjs(msg, "text").map((obj) => obj.id));
                        }
                    },
                    fix: () => { if (args.includes("all")) { fixTextShadows() } },
                    prune: () => { pruneText(args.includes("all") ? "all" : O.GetSelObjs(msg, "text")) },
                    setup: () => { displayToggles() },
                    help: () => {
                        ({
                            shadow: () => toggleAutoShadow(args.includes("true")),
                            prune: () => toggleAutoPrune(args.includes("true"))
                        }[(call = args.shift() || "").toLowerCase()] || (() => false))();
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
                }[(call = args.shift() || "").toLowerCase()] || (() => false))();
            } catch (err) {
                displayHelp();
            }
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

    const getTextData = (qText) => {
        const textObjs = [getText(qText)].flat();
        switch (textObjs.length) {
            case 0: return false;
            case 1: return textObjs[0].id in RE.G ? RE.G[textObjs[0].id] : false;
            default: return textObjs.map((textObj) => getTextData(textObj));
        }
    };
    const isShadowObj = (qTextObj) => U.GetR20Type(qTextObj) === "text" && /etcshadowobj/u.test(qTextObj.get("controlledby"));
    const getTextShadow = (qShadow) => {
        switch (qShadow) {
            case "all": return getText("all").filter((textObj) => isShadowObj(textObj));
            case "unregistered": return getText("unregistered").filter((textObj) => isShadowObj(textObj));
            default: {
                const textDatas = [getTextData(qShadow)].flat();
                switch (textDatas.length) {
                    case 0: return false;
                    case 1: return (textDatas[0].isShadow && getText(textDatas[0].id))
                                || (textDatas[0].hasShadow && getText(textDatas[0].shadowID))
                                || false;
                    default: return textDatas.map((textData) => getTextShadow(textData.id));
                }
            }
        }
    };
    const getOffsets = (fontFamily, fontSize) => ({
        ...CFG.ETC.DropShadows.OFFSETS.generic,
        ...(fontFamily in CFG.ETC.DropShadows.OFFSETS ? CFG.ETC.DropShadows.OFFSETS[fontFamily] : CFG.ETC.DropShadows.OFFSETS.generic)
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
                    const shadowOffsets = CFG.ETC.DropShadows.OFFSETS[masterObj.get("font_family") in CFG.ETC.DropShadows.OFFSETS ? masterObj.get("font_family") : "generic"];
                    const shadowObj = createObj("text", {
                        _pageid: masterObj.get("_pageid"),
                        left: masterObj.get("left") + leftOffset,
                        top: masterObj.get("top") + topOffset,
                        text: masterObj.get("text"),
                        font_size: masterObj.get("font_size"),
                        rotation: masterObj.get("rotation"),
                        font_family: masterObj.get("font_family"),
                        color: CFG.ETC.DropShadows.COLOR,
                        layer: CFG.ETC.DropShadows.LAYER,
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
            hasShadow: true,
            shadowID: shadowObj.id
        };
        RE.G[shadowObj.id] = {
            id: shadowObj.id,
            isShadow: true,
            masterID: masterObj.id
        };
        toFront(masterObj);
        toFront(shadowObj);
    };
    const safeRemove = (qText) => {
        [getText(qText)].flat().forEach((textObj) => {

            if (textObj) {
                removalQueue.push(textObj);
                textObj.remove();
            }
        });
    };
    const unregTextShadow = (qText) => {
        [getTextShadow(qText)].flat().forEach((shadowObj) => {
            const [id, {masterID}] = getTextData(shadowObj);
            safeRemove(shadowObj);
            delete RE.G[masterID];
            delete RE.G[id];
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
                    layer: masterObj.get("layer") === CFG.INACTIVELAYER ? CFG.INACTIVELAYER : CFG.ETC.DropShadows.LAYER,
                    color: CFG.ETC.DropShadows.COLOR,
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
    const displayHelp = () => {
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
                H.H1("Attribute Linking", ["dim", "tight"]),
                H.H1("Table & Chart Styling", ["dim", "tight"]),
                H.H1("Timers & Calendars", ["dim", "tight"]),
                H.H1("Miscellaneous", ["dim", "tight"]),
                H.Spacer(5)
            ]),
            H.ButtonFooter("!euno", "", ["goBack"])
        ]));
    };
    const displayToggles = () => {
        U.Alert(H.Box([
            H.Block([
                H.Subtitle("Options", ["etc"]),
                H.P("Ho~ver over the de~scrip~tion on the left for more de~tails about any gi~ven set~ting."),
                H.Span([
                    H.Span(`Object Pruning <span style="color: ${STA.TE.IsAutoPruning ? "darkgreen" : "darkred"};"><u>${STA.TE.IsAutoPruning ? "EN" : "DIS"}ABLED</u></span>`, ["silver"], {
                        // background: "transparent",
                        "font-size": "14px",
                        "line-height": "18px",
                        "font-family": "sans-serif",
                        "font-weight": "bold",
                        margin: "-5px 0 10px 0"
                    }, {title: "Whether empty text objects are automatically removed whenever they appear."}),
                    H.ButtonWide(STA.TE.IsAutoPruning ? "DISABLE" : "ENABLE", `!etc toggle autoprune ${STA.TE.IsAutoPruning ? "false" : "true"}`, ["silver"], {
                        "font-size": "12px",
                        color: STA.TE.IsAutoPruning ? "white" : "black",
                        width: "27%",
                        background: STA.TE.IsAutoPruning ? "red" : "lime",
                        padding: "2px",
                        "margin-top": "-5px",
                        float: "right"
                    })
                ], ["silver"], {width: "97%"}),
                H.Span([
                    H.Span(`Auto-Shadow <span style="color: ${STA.TE.IsAutoShadowing ? "darkgreen" : "darkred"};"><u>${STA.TE.IsAutoShadowing ? "EN" : "DIS"}ABLED</u></span>`, ["silver"], {
                        // background: "transparent",
                        // color: "black",
                        "font-size": "14px",
                        "line-height": "18px",
                        "font-family": "sans-serif",
                        "font-weight": "bold",
                        margin: "-5px 0 10px 0"
                    }, {title: "Whether shadows should be created automatically for all new text objects."}),
                    H.ButtonWide(STA.TE.IsAutoShadowing ? "DISABLE" : "ENABLE", `!etc toggle autoshadow ${STA.TE.IsAutoShadowing ? "false" : "true"}`, ["silver"],  {
                        "font-size": "12px",
                        color: STA.TE.IsAutoShadowing ? "white" : "black",
                        width: "27%",
                        background: STA.TE.IsAutoShadowing ? "red" : "lime",
                        padding: "2px",
                        "margin-top": "-5px",
                        float: "right"
                    })
                ], ["silver"], {width: "97%"})
            ])
        ], ["silver"]));
    };
    const displayError = (errorTag) => {
        const ERRORHTML = {
            AddShadowToShadow: H.Box([
                H.Subtitle("ERROR: Shadow-On-Shadow", ["etc"]),
                H.Block([
                    H.H2("Cannot Add a Shadow to a Shadow Object"),
                    H.Paras([
                        "Text sha~dows can~not have sha~dows them~selves."
                    ])
                ])
            ]),
            ManualShadowRemoval: H.Box([
                H.Subtitle("ERROR: Shadow Deleted", ["etc"]),
                H.Block([
                    H.H2("Restoring ..."),
                    H.Paras([
                        "Manually-deleted text sha~dows are auto~ma~tic~ally re~created (to pre~vent ac~cid~ent~ally de~let~ing a de~sired sha~dow).",
                        "To re~move a text sha~dow from a text ob~ject:",
                        [H.ButtonCommand("!etc clear", ["shiftLeft"]), " — Re~moves text sha~dows from all sel~ected text ob~jects <i>(you can sel~ect ei~ther the mas~ter ob~ject, the sha~dow ob~ject, or both)</i>"],
                        [H.ButtonCommand("!etc clear all", ["shiftLeft"]), " — Re~move <b><u>ALL</u></b> text sha~dow ob~jects <i>(this will not af~fect the mas~ter text ob~jects, just re~move the sha~dows)</i>"]
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