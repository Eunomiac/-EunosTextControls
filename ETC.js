void MarkStart("ETC");
/******▌████████████████████████████████████████████████████████████▐******\
|*     ▌██████▓▒░ !ETC: EUNOMIAC'S TEXT CONTROLS for Roll20 ░▒▓█████▐     *|
|*     ▌████████████████████████████████████████████████████████████▐     *|
|*     ▌█████████████████████▓▒░ v0.13-alpha ░▒▓████████████████████▐     *|
|*     ▌████████████████████▓▒░ June 25, 2021 ░▒▓███████████████████▐     *|
|*     ▌███▓▒░ https://github.com/Eunomiac/EunosRoll20Scripts ░▒▓███▐     *|
\******▌████████████████████████████████████████████████████████████▐******/

const ETC = (() => {
    // #region █████[ FRONT ]█████ Boilerplate Namespacing & Initialization
    // #region ░░░░░░░[Namespacing]░░░░ Basic References & Namespacing ░░░░░░

    const SCRIPTNAME = "ETC";
    const STA = {get TE() { return EunoCORE.GetLocalSTATE(SCRIPTNAME) }};
    const RE = {get G() { return STA.TE.REGISTRY }};

    // #endregion ░░░░[Namespacing]░░░░
    // #region ░░░░░░░[Initialization]░░░░ Script Startup & Event Listeners ░░░░░░

    // Define shorthand references to major script components.
    const {CFG, C} = EunoCORE;
    let LIB, U, O, H, Flag; // these have to be declared now, but must wait for intialization to be assigned  \\
    const Preinitialize = () => {
        // Initialize local state storage
        EunoCORE.InitState(SCRIPTNAME, {
            REGISTRY: {},
            isAutoShadowing: false,
            isAutoPruning: false
        });

        // Report preinitialization complete to EunoCORE loader
        EunoCORE.ConfirmReady(SCRIPTNAME);
    };                                                                                                                     //
    const Initialize = () => {
        // Assign shorthand script references
        ({LIB, U, O, H} = EunoCORE); //                                    ◀======

        // Assign mappings of library functions for script-specific behavior
        Flag = (message) => U.Flag(message, 2, ["etc", "silver"]);

        // Register event handlers
        on("chat:message", handleMessage);
        on("change:text", handleTextChange);
        on("add:text", handleTextAdd);
        on("destroy:text", handleTextDestroy);

        // Report initialization complete to EunoCORE loader
        EunoCORE.ConfirmReady(SCRIPTNAME, `${SCRIPTNAME} Ready`, 1);
    };

    // #endregion ░░░░[Initialization]░░░░
    // #region ░░░░░░░[Event Handlers]░░░░ chat:message, change:text, add:text, destroy:text ░░░░░░
    const handleMessage = (msg) => {
        if (U.CheckMessage(msg, "!etc")) {
            let {call, args, selected} = U.ParseMessage(msg, ["text"]);
            try { ({
                setup: displayToggles,
                toggle: () => ({
                    autoshadow: () => toggleFeature("autoShadow", args.includes(true), {goBack: args.includes("feature") ? "feature" : "toggles"}),
                    autoprune: () => toggleFeature("autoPrune", args.includes(true), {goBack: args.includes("feature") ? "feature" : "toggles"})
                }[U.LCase(call = args.shift())])(),
                shadow: () => ({
                    add: () =>  makeTextShadow(selected.text),
                    clear: () => {
                        unregTextShadow(args.includes("all") ? ["all"] : selected.text);
                        Flag(`${args.includes("all") ? "" : "Selected "}Shadows Cleared.`);
                    },
                    hide: () => {},
                    show: () => {},
                    fix: fixTextShadows
                }[U.LCase(call = args.shift())])(),
                prune: () => { pruneText(args.includes("all") ? ["all"] : selected.text) },
                help: () => ({
                    shadow: () => displayHelp("dropShadows"),
                    prune: () => displayHelp("textPruning"),
                    offsets: () => U.Show(getOffsets("Montserrat", 100))
                }[U.LCase(call = args.shift())])(),
                reset: () => ({
                    all: () => EunoCORE.InitState(true),
                    reg: () => STA.TE.REGISTRY = {}
                }[U.LCase(call = args.shift())])()
            }[U.LCase(call = args.shift())])();
            } catch { displayHelp("etc") }
        };
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
            if (!(STA.TE.isAutoPruning && pruneText(textObj, true))) {
                if (STA.TE.isAutoShadowing && !isShadowObj(textObj)) {
                    makeTextShadow(textObj);
                }
            }
        }, 500);
    };

    const handleTextDestroy = (textObj) => {
        if (textObj.id in RE.G) {
            if (isShadowObj(textObj)) {
                const masterObj = getObj("text", RE.G[textObj.id].masterID);
                if (masterObj && !removalQueue.includes(textObj.id)) {
                    displayError("ManualShadowRemoval");
                    makeTextShadow(masterObj);
                }
            } else if (RE.G[textObj.id].hasShadow) {
                unregTextShadow(RE.G[textObj.id].shadowID);
            }
        }
    };
    // #endregion ░░░░[Event Handlers]░░░░
    // #endregion ▄▄▄▄FRONT▄▄▄▄

    // #region *** *** UTILITY *** ***

    const getTextData = (qText, isReturningArray = false) => {
        const textDatas = [];
        if (U.GetType(qText) === "array") {
            isReturningArray = true;
            textDatas.push(...U.Arrayify(qText.map((qO) => getTextData(qO, true))));
        } else {
            textDatas.push(...O.GetObj([qText], "text", RE.G).map((textObj) => textObj.id in RE.G ? RE.G[textObj.id] : false));
        }
        if (isReturningArray) {
            return U.Arrayify(textDatas);
        }
        return textDatas.length > 0 ? textDatas.shift() : false;
    };
    const isShadowObj = (qTextObj) => O.GetR20Type(qTextObj) === "text"
                                          && /etcshadowobj/u.test(qTextObj.get("controlledby"));
    const isRegShadow = (qText) => (getTextData(qText) || {}).isShadow;
    const hasShadowObj = (qText) => O.GetR20Type(qText) === "text"
                                           && (getTextData(qText) || {}).hasShadow
                                           && Boolean(O.GetObj((getTextData(qText) || {}).shadowID, "text"));
    const getTextShadow = (qShadow, isReturningArray = false) => {
        const textShadows = [];
        if (U.GetType(qShadow) === "array") {
            isReturningArray = true;
            textShadows.push(...U.Arrayify(qShadow.map((qO) => getTextShadow(qO, true))));
        } else {
            textShadows.push(..._.uniq(U.Arrayify(O.GetObj([qShadow], "text", RE.G)).filter((textObj) => isShadowObj(textObj) || hasShadowObj(textObj)).map((textObj) => hasShadowObj(textObj) ? getTextShadow(RE.G[textObj.id].shadowID) : textObj)));
        }
        if (isReturningArray) {
            return U.Arrayify(textShadows).flat(3);
        }
        return textShadows.length > 0 ? textShadows.shift() : false;
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
            if (!masterObj || masterObj.get("text") === "") {
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
                if (O.GetR20Type(masterObj) === "text") {
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
    const toggleFeature = (feature, isActive, options = {}) => {
        isActive = isActive === true;
        ({
            autoShadow: () => {
                STA.TE.isAutoShadowing = isActive;
                if (options.goBack === "feature") {
                    displayHelp("dropShadows");
                } else {
                    displayToggles();
                }
            },
            autoPrune: () => {
                STA.TE.isAutoPruning = isActive;
                if (options.goBack === "feature") {
                    displayHelp("textPruning");
                } else {
                    displayToggles();
                }
            }
        }[feature] || (() => false))();
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
        U.Arrayify(O.GetObj(qText, "text", RE.G, true)).forEach((textObj) => {
            removalQueue.push(textObj.id);
            textObj.remove();
        });
    };
    const unregTextShadow = (qText, isMuting = false) => {
        getTextShadow(U.Arrayify(qText)).forEach((shadowObj) => {
            const {id, masterID} = getTextData(shadowObj);
            safeRemove(shadowObj);
            if (isMuting) {
                RE.G[masterID].isShadowMuted = true;
            } else {
                delete RE.G[masterID];
            }
            delete RE.G[id];
        });
    };
    // #endregion

    // #region      Text Shadows: Synchronizing Master/Shadow Objects
    const syncShadow = (masterObj, shadowObj) => {
        // Where the magic happens (?) --- synchronizing text shadows to their master objects, whenever they're changed or created.
        if (O.GetR20Type(masterObj) && O.GetR20Type(shadowObj)) {
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
            if (textObj && STA.TE.isAutoPruning && textObj.get("text") === "") {
                unregTextShadow(id);
            }
            if ("masterID" in objData) { // This is a Shadow Object.
                const masterObj = getObj("text", objData.masterID);
                if (!(masterObj && masterObj.id in RE.G)) { // This is an orphan: Kill it.
                    unregTextShadow(id);
                } else if (masterObj && STA.TE.isAutoPruning && masterObj.get("text") === "") {
                    unregTextShadow(masterObj.id);
                    masterObj.remove();
                }
            } else if ("shadowID" in objData) { // This is a Master Object.
                if (textObj && STA.TE.isAutoPruning && textObj.get("text") === "") {
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

        Flag("Shadows Synchronized.");
    };
    // #endregion

    // #endregion *** *** TEXT SHADOWS *** ***

    // #region *** *** FEATURE: EMPTY TEXT PRUNING *** ***
    const pruneText = (qText, isAutomatic = false) => {
        let removalCount = 0;
        O.GetObj(U.Arrayify(qText), "text", RE.G).forEach((textObj) => {
            if (!textObj.get("text")) {
                removalCount++;
                safeRemove(textObj);
            }
        });
        if (!isAutomatic) {
            Flag(`${U.Pluralize(removalCount, "Empty Text Object")} Removed.`);
        }
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
                if (!O.GetR20Type(textObj)) { return false }
                const charObj = U.GetChar(charRef);
                if (!O.GetR20Type(charObj)) { return false }
                const attrObj = U.GetAttr(charObj, attrRef);
                if (!O.GetR20Type(attrObj)) { return false }


                return true;
            }; */
    // #endregion


    // #endregion *** *** ATTRIBUTE DISPLAYS *** ***

    // #region *** *** CHAT DISPLAYS & MENUS *** ***
    const displayHelp = (helpKey) => {
        U.Alert({
            etc: H.Box([
                H.Span(null, ["title", "etc"]),
                H.Block([
                    H.P("<b>!ETC</b> is in~ten~ded to be a com~pre~hen~sive so~lu~tion to man~ag~ing Roll20 Text Ob~jects."),
                    H.H2("!ETC Chat Commands"),
                    H.Spacer(5),
                    H.Paras([ // ↪
                        [H.ButtonCommand("!etc", ["shiftLeft"]), " ↪ View this help mes~sage."],
                        [H.ButtonCommand("!etc setup", ["shiftLeft"]), " ↪ Ac~ti~vate or de~ac~ti~vate any of the fea~tures in this script pack~age."],
                        [H.ButtonCommand("!etc reset all", ["shiftLeft"]), " ↪ <b><u>FULLY</u> re~set <u>ALL</u></b> <b>!ETC</b> script fea~tures, re~turn~ing <b>!ETC</b> to its de~fault in~stal~la~tion state."]
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
            ]),
            dropShadows: H.Box([
                H.Subtitle("Drop Shadows", ["etc"]),
                H.Spacer(5),
                H.Block([
                    H.P("Add drop sha~dows to text ob~jects, ei~ther auto~ma~ti~cally (when~ever one is cre~ated) or man~u~ally via chat com~mand."),
                    H.Paras([
                        [H.Command("Adding/Removing", ["shiftLeft", "silver"]), " ↪ Add/remove sha~dows from sel~ec~ted text ob~jects with a com~mand, or tog~gle on auto~ma~tic sha~dow~ing to have <b>!ETC</b> ap~ply sha~dows to all new text ob~jects."],
                        [H.Command("Shadow Objects", ["shiftLeft", "silver"]), ` ↪ Text sha~dows are cre~ated on the <b>${CFG.ETC.DropShadows.LAYER}</b> la~yer. Sha~dows will move when their mas~ter ob~ject moves; they will up~date their con~tent, size, font, etc. to match their mas~ter ob~ject; and they will re~move them~selves if their mas~ter ob~ject is ever re~moved.`],
                        [H.Command("Configure Offsets", ["shiftLeft", "silver"]), " ↪ If the pos~i~tion~ing of sha~dows for any font/size com~bin~a~tion isn't to your lik~ing, you can con~fi~gure new off~sets by chat com~mand (see be~low)."]
                    ]),
                    H.H2("Chat Commands", ["silver"]),
                    H.Spacer(5),
                    H.Paras([
                        [H.ButtonCommand("!etc shadow add", ["shiftLeft", "silver"]), " ↪ <u>ADD</u> sha~dows to all sel~ec~ted text ob~jects."],
                        [H.ButtonCommand("!etc shadow clear", ["shiftLeft", "silver"]), " ↪ <u>RE~MOVE</u> sha~dows from all sel~ec~ted text ob~jects."],
                        [H.ButtonCommand("!etc shadow clear all", ["shiftLeft", "silver"]), " ↪ <u>RE~MOVE</u> sha~dows from <b><u>ALL</u></b> text ob~jects."],
                        [H.ButtonCommand("!etc shadow hide", ["shiftLeft", "silver"]), " ↪ <u>HIDE</u> all text sha~dows."],
                        [H.ButtonCommand("!etc shadow show", ["shiftLeft", "silver"]), " ↪ <u>SHOW</u> all hid~den text sha~dows."],
                        [H.ButtonCommand("!etc shadow fix", ["shiftLeft", "silver"]), " ↪ Ver~i~fy and cor~rect pre~sence and pos~i~tions of text sha~dows."]
                    ]),
                    H.Spacer(5),
                    H.H2("Automation", ["silver"]),
                    H.Spacer(5),
                    H.ButtonToggle(
                        [
                            "Auto-Shadow",
                            "Whe~ther sha~dows are auto~ma~ti~cally ap~plied to new text ob~jects upon cre~a~tion."
                        ],
                        `!etc toggle autoshadow ${STA.TE.isAutoShadowing ? "false" : "true"} feature`,
                        [`toggle${STA.TE.isAutoShadowing ? "On" : "Off"}`, "silver"],
                        {},
                        {title: `Click to ${STA.TE.isAutoShadowing ? "DEACTIVATE" : "ACTIVATE"} automatic text shadows for all text objects.`}
                    ),
                    H.Spacer(5)
                ], ["silver"]),
                H.ButtonFooter("!etc", "", ["silver", "goBack"])
            ], ["silver"]),
            textPruning: H.Box([
                H.Subtitle("Empty Text Pruning", ["etc"]),
                H.Block([
                    H.P("Ever notice that, when you click off of a text object, Roll20 goes and creates another text object wherever you clicked? If you then click elsewhere without typing anything, that empty and invisible text object remains (potentially interfering with box-selecting objects, among other vexations). Empty Text Pruning addresses this issue by removing empty text objects, either automatically or by chat command."),
                    H.H2("Chat Commands", ["silver"]),
                    H.Spacer(5),
                    H.Paras([
                        [H.ButtonCommand("!etc prune all", ["shiftLeft", "silver"]), " ↪ <u>REMOVE</u> all empty (invisible) text objects from the sandbox."]
                    ]),
                    H.H2("Automation", ["silver"]),
                    H.Spacer(5),
                    H.ButtonToggle(
                        [
                            "Auto-Prune",
                            "Whe~ther empty (in~vi~sible) text ob~jects are auto~ma~ti~cally re~moved from the sand~box."
                        ],
                        `!etc toggle autoprune ${STA.TE.isAutoPruning ? "false" : "true"} feature`,
                        [`toggle${STA.TE.isAutoPruning ? "On" : "Off"}`, "silver"],
                        {},
                        {title: `Click to ${STA.TE.isAutoPruning ? "DEACTIVATE" : "ACTIVATE"} automatic removal of empty text objects.`}
                    ),
                    H.Spacer(5)
                ], ["silver"]),
                H.ButtonFooter("!etc", "", ["goBack", "silver"])
            ], ["silver"])
        }[helpKey]);
    };
    const displayToggles = () => {
        U.Alert(H.Box([
            H.Subtitle("Options", ["etc"]),
            H.Block([
                H.Spacer(15),
                H.ButtonToggle(
                    [
                        "Auto-Shadow",
                        "Whe~ther sha~dows are auto~ma~ti~cally ap~plied to new text ob~jects upon cre~a~tion."
                    ],
                    `!etc toggle autoshadow ${STA.TE.isAutoShadowing ? "false" : "true"}`,
                    [`toggle${STA.TE.isAutoShadowing ? "On" : "Off"}`, "silver"],
                    {},
                    {title: `Click to ${STA.TE.isAutoShadowing ? "DEACTIVATE" : "ACTIVATE"} automatic text shadows for all text objects.`}
                ),
                H.ButtonToggle(
                    [
                        "Auto-Prune",
                        "Whe~ther empty (in~vi~sible) text ob~jects are auto~ma~ti~cally re~moved from the sand~box."
                    ],
                    `!etc toggle autoprune ${STA.TE.isAutoPruning ? "false" : "true"}`,
                    [`toggle${STA.TE.isAutoPruning ? "On" : "Off"}`, "silver"],
                    {},
                    {title: `Click to ${STA.TE.isAutoPruning ? "DEACTIVATE" : "ACTIVATE"} automatic removal of empty text objects.`}
                )
            ], ["silver"]),
            H.ButtonFooter("!etc", "", ["goBack", "silver"])
        ], ["silver"]));
    };
    const displayError = (errorTag) => {
        const ERRORHTML = {
            AddShadowToShadow: H.Box([
                H.Subtitle("ERROR", ["etc"]),
                H.Block([
                    H.H1("Shadow-on-Shadow", ["silver"]),
                    H.Paras([
                        "Text sha~dows can~not have sha~dows them~selves."
                    ])
                ], ["silver"]),
                H.Footer(null, ["silver"])
            ], ["silver"]),
            ManualShadowRemoval: H.Box([
                H.Subtitle("ERROR", ["etc"]),
                H.Block([
                    H.H1("Shadow Deleted Manually", ["silver"]),
                    H.P("Manually-deleted text sha~dows are auto~ma~tic~ally re~created (to pre~vent ac~cid~ent~ally de~let~ing a de~sired sha~dow)."),
                    H.H2("Restoring ...", ["silver"]),
                    H.Paras([
                        "To re~move a text sha~dow from a text ob~ject:",
                        [H.ButtonCommand("!etc shadow clear", ["shiftLeft", "silver"]), " ↪ Re~moves text sha~dows from all sel~ected text ob~jects <i>(you can sel~ect ei~ther the mas~ter ob~ject, the sha~dow ob~ject, or both)</i>"],
                        [H.ButtonCommand("!etc shadow clear all", ["shiftLeft", "silver"]), " ↪ Re~move <b><u>ALL</u></b> text sha~dow ob~jects <i>(this will not af~fect the mas~ter text ob~jects, just re~move the sha~dows)</i>"]
                    ])
                ], ["silver"]),
                H.Footer(null, ["silver"])
            ], ["silver"])
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