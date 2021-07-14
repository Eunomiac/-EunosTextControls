void MarkStart("ETC");
/******▌████████████████████████████████████████████████████████████▐******\
|*     ▌██████▓▒░ !ETC: EUNOMIAC'S TEXT CONTROLS for Roll20 ░▒▓█████▐     *|
|*     ▌████████████████████████████████████████████████████████████▐     *|
|*     ▌███▓▒░ https://github.com/Eunomiac/EunosRoll20Scripts ░▒▓███▐     *|
\******▌████████████████████████████████████████████████████████████▐******/

const ETC = (() => {
    // #region ▒░▒░▒░▒[FRONT] Boilerplate Namespacing & Initialization ▒░▒░▒░▒ ~
    // #region ░░░░░░░[Namespacing]░░░░ Basic References & Namespacing ░░░░░░ ~

    const SCRIPTNAME = "ETC";
    const STA = {get TE() { return EunoCORE.GetLocalSTATE(SCRIPTNAME) }};
    const RE = {get G() { return STA.TE.REGISTRY }};

    // #endregion ░░░░[Namespacing]░░░░
    // #region ░░░░░░░[Initialization]░░░░ Script Startup & Event Listeners ░░░░░░ ~

    // Define shorthand references to major script components.
    const {CFG, C} = EunoCORE;
    let LIB, U, O, H, Flag; // these have to be declared now, but must wait for intialization to be assigned  \\
    const DEFAULTSTATE = {
        REGISTRY: {},
        hiddenMasterIDs: [],
        shadowOffsets: {},
        isAutoShadowing: false,
        isAutoPruning: false
    };
    const Preinitialize = () => {
        // Initialize local state storage
        EunoCORE.InitLocalSTATE(SCRIPTNAME );

        // Report preinitialization complete to EunoCORE loader
        EunoCORE.ConfirmReady(SCRIPTNAME);
    };                                                                                                                     //
    const Initialize = () => {
        // Assign shorthand script references
        ({LIB, U, O, H} = EunoCORE); //                                    ◀======

        // Assign mappings of library functions for script-specific behavior
        Flag = (message) => U.Flag(message, 1, ["etc", "silver"]);

        // Derive shadow offsets from EunoCONFIG.js
        processOffsets();

        // Register event handlers
        on("chat:message", handleMessage);
        on("change:text", handleTextChange);
        on("add:text", handleTextAdd);
        on("destroy:text", handleTextDestroy);

        // Alert readiness confirmation
        U.Flag(`!${SCRIPTNAME} Ready`, 1); log(`[Euno] ${SCRIPTNAME} Initialized`);

        // Report initialization complete to EunoCORE loader
        EunoCORE.ConfirmReady(SCRIPTNAME);
    };
    // #endregion ░░░░[Initialization]░░░░
    // #region ░░░░░░░[Handlers]░░░░ Event Handlers: chat:message, change:text, add:text, destroy:text ░░░░░░ ~

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
                    hide: hideTextShadows,
                    show: showTextShadows,
                    lock: () => lockTextObj(args.includes("all") ? ["all"] : selected.text),
                    unlock: () => unlockTextObj(args.includes("all") ? ["all"] : selected.text),
                    fix: fixTextShadows
                }[U.LCase(call = args.shift())])(),
                prune: () => { pruneText(args.includes("all") ? ["all"] : selected.text) },
                help: () => ({
                    shadow: () => displayHelp("dropShadows"),
                    prune: () => displayHelp("textPruning")
                }[U.LCase(call = args.shift())])(),
                reset: () => ({
                    all: () => EunoCORE.InitLocalSTATE(true),
                    reg: () => STA.TE.REGISTRY = {}
                }[U.LCase(call = args.shift())])()
            }[U.LCase(call = args.shift())])();
            } catch(err) { log(err.message); displayHelp("etc") }
        };
    };
    const handleTextChange = (textObj) => {
        if (textObj.id in RE.G && !ignoreQueue.includes(textObj.id)) {
            if (isLocked(textObj)) {
                const textData = _.pick(getTextData(textObj), "top", "left");
                textObj.set(textData);
            }
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
        if (textObj.id in RE.G && !ignoreQueue.includes(textObj.id)) {
            if (isShadowObj(textObj)) {
                const masterObj = getObj("text", RE.G[textObj.id].masterID);
                if (masterObj) {
                    displayError("ManualShadowRemoval");
                    makeTextShadow(masterObj);
                }
            } else if (RE.G[textObj.id].hasShadow) {
                unregTextShadow(RE.G[textObj.id].shadowID);
            }
        }
    };

    // #endregion ░░░░[Handlers]░░░░
    // #endregion ▒▒▒▒[FRONT]▒▒▒▒
    // #region ▒░▒░▒░▒[UTILITY] General Utility Functions for Text Objects ▒░▒░▒░▒ ~
    const ignoreQueue = [];
    const getText = (qText) => O.GetObj(qText, "text", RE.G);
    const getTextData = (qText, isReturningArray = false) => {
        const textDatas = [];
        if (U.GetType(qText) === "array") {
            isReturningArray = true;
            textDatas.push(...U.Arrayify(qText.map((qO) => getTextData(qO, true))));
        } else {
            textDatas.push(...getText([qText]).map((textObj) => textObj.id in RE.G ? RE.G[textObj.id] : false));
        }
        if (isReturningArray) {
            return U.Arrayify(textDatas).flat(3);
        }
        return textDatas.length > 0 ? textDatas.shift() : false;
    };
    const isShadowObj = (qTextObj) => O.GetR20Type(qTextObj) === "text"
                                          && /etcshadowobj/u.test(qTextObj.get("controlledby"));
    const isRegShadow = (qText) => (getTextData(qText) || {}).isShadow;
    const hasShadowObj = (qText) => O.GetR20Type(qText) === "text"
                                           && (getTextData(qText) || {}).hasShadow
                                           && ((getTextData(qText) || {}).isShadowMuted
                                                || Boolean(getText((getTextData(qText) || {}).shadowID, "text")));
    const parseFont = (fontFamily) => U.TCase(fontFamily.replace(/[^A-Za-z ]/gu, ""));
    const isValidFont = (fontFamily) => C.FONTS.includes(parseFont(fontFamily));
    const getTextMaster = (qMaster, isReturningArray = false) => {
        const textMasters = [];
        if (U.GetType(qMaster) === "array") {
            isReturningArray = true;
            textMasters.push(...U.Arrayify(qMaster).map((qO) => getTextMaster(qO, true)));
        } else {
            textMasters.push(..._.uniq(U.Arrayify(getText([qMaster]))
                .filter((textObj) => isRegShadow(textObj) || hasShadowObj(textObj))
                .map((textObj) => isRegShadow(textObj) ? getTextMaster(RE.G[textObj.id].masterID) : textObj)));
        }
        if (isReturningArray) {
            return U.Arrayify(textMasters).flat(3);
        }
        return textMasters.length > 0 ? textMasters.shift() : false;
    };
    const getTextShadow = (qShadow, isReturningArray = false) => {
        const textShadows = [];
        if (U.GetType(qShadow) === "array") {
            isReturningArray = true;
            textShadows.push(...U.Arrayify(qShadow.map((qO) => getTextShadow(qO, true))));
        } else {
            textShadows.push(..._.uniq(U.Arrayify(getText([qShadow]))
                .filter((textObj) => isShadowObj(textObj) || hasShadowObj(textObj))
                .map((textObj) => hasShadowObj(textObj) ? getTextShadow(RE.G[textObj.id].shadowID) : textObj)));
        }
        if (isReturningArray) {
            return U.Arrayify(textShadows).flat(3);
        }
        return textShadows.length > 0 ? textShadows.shift() : false;
    };
    const getMasterData = (qMaster, isReturningArray = false) => getTextData(getTextMaster(qMaster));
    const getShadowData = (qShadow, isReturningArray = false) => getTextData(getTextShadow(qShadow));
    const safeRemove = (qText) => {
        U.Arrayify(getText(qText)).forEach((textObj) => {
            ignoreQueue.push(textObj.id);
            textObj.remove();
        });
    };
    const safeSet = (qText, newData = {}) => {
        U.Arrayify(getText(qText)).forEach((textObj) => {
            ignoreQueue.push(textObj.id);
            textObj.set(newData);
            setTimeout(() => U.Remove(ignoreQueue, textObj.id), 1000);
        });

    };
    // #endregion ▒▒▒▒[UTILITY]▒▒▒▒

    // #region ████████ ETC: Master Control & General Functions for ETC ████████ ~

    const toggleFeature = (feature, isActive, options = {}) => {
        isActive = isActive === true;
        try {({
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
        }[feature])();
        } catch {log(`[Euno] ERROR: '${feature}' is not a recognized ETC feature.`)};
    };

    // #endregion ▄▄▄▄▄▄▄▄ ETC ▄▄▄▄▄▄▄▄

    // #region ████████ TEXT SHADOWS: Applying Text Shadows to Text Objects ████████ ~
    // #region ░░░░░░░[Offsets]░░░░ Determining Shadow Offset Distances ░░░░░░░ ~

    const processOffsets = () => {
        const OFFSETS = {...CFG.ETC.DropShadows.OFFSETS};
        const genericOffsets = {...OFFSETS.generic};
        for (const fontFamily of C.FONTS) {
            STA.TE.shadowOffsets[fontFamily] = U.KVPMap(
                genericOffsets,
                (offset, fontSize) => {
                    if (fontFamily in OFFSETS.multipliers) {
                        const [multX, multY] = U.GetType(OFFSETS.multipliers[fontFamily]) === "array"
                            ? OFFSETS.multipliers[fontFamily]
                            : [OFFSETS.multipliers[fontFamily], OFFSETS.multipliers[fontFamily]];
                        return [offset[0] * multX, offset[1] * multY];
                    }
                    if (fontFamily in OFFSETS.overrides
                        && fontSize in OFFSETS.overrides[fontFamily]) {
                        return OFFSETS.overrides[fontFamily][fontSize];
                    }
                    return offset;
                }
            );
        }
    };
    const getShadowOffset = (fontFamily, fontSize) => {
        if (isValidFont(fontFamily)) {
            fontSize = U.Float(fontSize);
            if (fontSize in STA.TE.shadowOffsets[fontFamily]) {
                return STA.TE.shadowOffsets[fontFamily][fontSize];
            }
            return [
                U.Interpolate(
                    [[0, [0, 0]], ...Object.entries(STA.TE.shadowOffsets[fontFamily])]
                        .map(([size, offsets]) => [U.Int(size), offsets[0]]),
                    [fontSize, null]
                ),
                U.Interpolate(
                    [[0, [0, 0]], ...Object.entries(STA.TE.shadowOffsets[fontFamily])]
                        .map(([size, offsets]) => [U.Int(size), offsets[1]]),
                    [fontSize, null]
                )
            ];
        } else {
            throw `Invalid Font: ${fontFamily} (${parseFont(fontFamily)})`;
        }
    };

    // #endregion ░░░░[Offsets]░░░░
    // #region ░░░░░░░[Add & Remove]░░░░ Creation, Registration, Unregistration of Text Shadows ░░░░░░░ ~

    const makeTextShadow = (qMaster) => {
        U.Arrayify(getText(qMaster)).forEach((masterObj) => {
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
                    const [fontFamily, fontSize] = [parseFont(masterObj.get("font_family")), U.Float(masterObj.get("font_size"))];
                    const [leftOffset, topOffset] = getShadowOffset(fontFamily, fontSize);
                    const shadowObj = createObj("text", {
                        _pageid: masterObj.get("_pageid"),
                        left: masterObj.get("left") + leftOffset,
                        top: masterObj.get("top") + topOffset,
                        text: masterObj.get("text"),
                        font_size: masterObj.get("font_size"),
                        rotation: masterObj.get("rotation"),
                        font_family: fontFamily,
                        color: CFG.ETC.DropShadows.COLOR,
                        layer: CFG.ETC.DropShadows.LAYER,
                        controlledby: "etcshadowobj"
                    });
                    regTextShadow(masterObj, shadowObj);
                }
            }
        });
    };
    const regTextShadow = (masterObj, shadowObj) => {
        RE.G[masterObj.id] = {
            id: masterObj.id,
            hasShadow: true,
            shadowID: shadowObj.id,
            isShadowMuted: false
        };
        RE.G[shadowObj.id] = {
            id: shadowObj.id,
            isShadow: true,
            masterID: masterObj.id
        };
        toFront(masterObj);
        toFront(shadowObj);
    };
    const unregTextShadow = (qText, isMuting = false) => {
        getTextShadow(U.Arrayify(qText)).forEach((shadowObj) => {
            const {id, masterID} = getTextData(shadowObj);
            safeRemove(shadowObj);
            if (isMuting && RE.G[masterID]) {
                RE.G[masterID].isShadowMuted = true;
            } else {
                delete RE.G[masterID];
            }
            delete RE.G[id];
        });
    };

    // #endregion ░░░░[Add & Remove]░░░░
    // #region ░░░░░░░[Hiding & Showing]░░░░ Hiding, Showing Text Shadows ░░░░░░░ ~

    const hideTextShadows = () => unregTextShadow(getTextShadow(["registered"]), true);
    const showTextShadows = () => {
        const masterDatas = getMasterData(["registered"]);
        const filteredDatas = masterDatas.filter((masterData) => masterData.isShadowMuted);
        const mappedDatas = filteredDatas.map((masterData) => masterData.id);

        makeTextShadow(getMasterData(["registered"])
            .filter((masterData) => masterData.isShadowMuted)
            .map((masterData) => masterData.id));
    };
    // #endregion ░░░░[Hiding & Showing]░░░░
    // #region ░░░░░░░[Synchronization]░░░░ Synchronizing Text Objects' Position & Settings ░░░░░░░ ~

    const isLocked = (qText) => (getTextData(qText) || {}).isPositionLocked;
    const lockTextObj = (qText) => U.Arrayify(getTextMaster(qText)).forEach((masterObj) => {
        Object.assign(RE.G[masterObj.id], {
            top: masterObj.get("top"),
            left: masterObj.get("left"),
            isPositionLocked: true
        });
    });
    const unlockTextObj = (qText) => U.Arrayify(getTextMaster(qText)).forEach((masterObj) => RE.G[masterObj.id].isPositionLocked = false);
    const syncShadow = (masterObj, shadowObj) => {
        // Where the magic happens (?) --- synchronizing text shadows to their master objects, whenever they're changed or created.
        if (O.GetR20Type(masterObj) && O.GetR20Type(shadowObj)) {
            const [fontFamily, fontSize] = [parseFont(masterObj.get("font_family")), U.Float(masterObj.get("font_size"))];
            const [leftOffset, topOffset] = getShadowOffset(fontFamily, fontSize);
            if (![leftOffset, topOffset].includes(undefined)) {
                safeSet(shadowObj, {
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
        findObjs({_type: "text"})
            .filter((obj) => isShadowObj(obj) && !(obj.id in RE.G))
            .forEach((obj) => safeRemove(obj));

        // TWO: Cycle through registry, ensuring all objects exist and, if AutoPruning is on, that they all have text content.
        //    If object has no text, unregister it.
        //    If a ShadowObj doesn't exist, create it UNLESS master object is muted.
        //    If a MasterObj doesn't exist, unreg the shadow.
        const [objsToPrune, objsToUnreg, objsToRegister, shadowsToMake] = [[], [], []];
        for (const [id, objData] of Object.entries(RE.G)) {
            const textObj = getObj("text", id);
            if (textObj && STA.TE.isAutoPruning && textObj.get("text") === "") {
                objsToPrune.push(textObj);
            }
            if ("masterID" in objData) { // This is a Shadow Object.
                const masterObj = getObj("text", objData.masterID);
                if (!(masterObj && masterObj.id in RE.G)) { // This is an orphan: Kill it.
                    objsToUnreg.push(textObj);
                } else if (masterObj && STA.TE.isAutoPruning && masterObj.get("text") === "") {
                    objsToPrune.push(masterObj);
                }
            } else if ("shadowID" in objData) { // This is a Master Object.
                if (textObj && STA.TE.isAutoPruning && textObj.get("text") === "") {
                    objsToPrune.push(textObj);
                }
                if (!objData.isShadowMuted) { // Restore shadow UNLESS shadow is hidden (muted)
                    const shadowObj = getObj("text", objData.shadowID);
                    if (!shadowObj) { // Create a shadow if it's missing
                        shadowsToMake.push(textObj);
                    } else if (!(shadowObj.id in RE.G)) { // ... same for registry.
                        objsToRegister.push([textObj, shadowObj]);
                    }
                }
            } else { // Should never get here.
                U.Alert(`Registry entry for ${id} does not contain a masterID or a shadowID`, "REGISTRY ERROR");
            }
        }
        _.uniq(objsToPrune).forEach((textObj) => pruneText(textObj));
        _.uniq(objsToUnreg).forEach((textObj) => unregTextShadow(textObj));
        _.uniq(shadowsToMake).forEach((masterObj) => makeTextShadow(masterObj));
        _.uniq(objsToRegister).forEach(([masterObj, shadowObj]) => regTextShadow(masterObj, shadowObj));

        // THREE: Re-process shadow offsets to update for any changes in EunoCONFIG.js
        processOffsets();

        // THREE: Cycle through registry again, synchronizing all shadow objects.
        for (const [id, shadowData] of Object.entries(RE.G).filter(([id, data]) => "masterID" in data)) {
            const [masterObj, shadowObj] = [getObj("text", shadowData.masterID), getObj("text", id)];
            syncShadow(masterObj, shadowObj);
        }

        Flag("Shadows Synchronized.");
    };

    // #endregion ░░░░[Synchronization]░░░░
    // #endregion ▄▄▄▄▄ TEXT SHADOWS ▄▄▄▄▄

    // #region ████████ TEXT PRUNING: Removing Empty (and Invisible) Text Objects ████████ ~

    const pruneText = (qText, isAutomatic = false) => {
        let removalCount = 0;
        getText(U.Arrayify(qText)).forEach((textObj) => {
            if (!textObj.get("text")) {
                removalCount++;
                unregTextShadow(textObj);
                if (textObj) {safeRemove(textObj)}
            }
        });
        if (!isAutomatic) {
            Flag(`${U.Pluralize(removalCount, "Empty Text Object")} Removed.`);
        }
    };

    // #endregion ▄▄▄▄▄ TEXT PRUNING ▄▄▄▄▄

    // #region ████████ ATTRIBUTE LINKING: Linking Character Attributes to Text Object Displays ████████ ~
    // #region ░░░░░░░[Linking]░░░░ Linking Attributes to Text Objects ░░░░░░░ ~

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

    // #endregion ░░░░[Linking]░░░░
    // #endregion ▄▄▄▄▄ ATTRIBUTE LINKING ▄▄▄▄▄

    // #region ████████ CHAT MESSAGES: Help, Errors & Menus ████████ ~

    const displayHelp = (helpKey) => {
        U.Alert({
            etc: H.Box([
                H.Span(null, ["title", "etc"]),
                H.Block([
                    H.P("<b>!ETC</b> is in~ten~ded to be a com~pre~hen~sive so~lu~tion to man~ag~ing Roll20 Text Ob~jects."),
                    H.H2("!ETC Chat Commands"),
                    H.Paras([ // ↪
                        H.ButtonCommand([
                            "!etc",
                            "View this help mes~sage."
                        ]),
                        H.ButtonCommand([
                            "!etc setup",
                            "Ac~ti~vate or de~ac~ti~vate any of the fea~tures in this script pack~age."
                        ]),
                        H.ButtonCommand([
                            "!etc reset all",
                            "<b><u>FULLY</u></b> re~set <b><u>ALL</u></b> <b>!ETC</b> script fea~tures, re~turn~ing <b>!ETC</b> to its de~fault in~stal~la~tion state."
                        ])
                    ]),
                    H.H2("!ETC Features"),
                    H.Paras("Learn more about each of <b>!ETC</b>'s fea~tures by click~ing the head~ings be~low:"),
                    H.ButtonH1("!etc help shadow", "Text Drop Shadows", ["tight"], {}, {title: "Control drop shadow behavior."}),
                    H.ButtonH1("!etc help prune", "Empty Text Pruning", ["tight"], {}, {title: "Configure pruning of empty text objects."}),
                    H.H1("Attribute Linking", ["dim", "tight"]),
                    H.H1("Table & Chart Styling", ["dim", "tight"]),
                    H.H1("Timers & Calendars", ["dim", "tight"]),
                    H.H1("Miscellaneous", ["dim", "tight"])
                ]),
                H.ButtonFooter("!euno", "", ["goBack"])
            ]),
            dropShadows: H.Box([
                H.Subtitle("Drop Shadows", ["etc"]),
                H.Block([
                    H.Paras([
                        "Add drop sha~dows to text ob~jects, ei~ther auto~ma~ti~cally (when~ever one is cre~ated) or man~u~ally via chat com~mand.",
                        H.InlineHeader([
                            "Adding/Removing",
                            "Add/remove sha~dows from sel~ec~ted text ob~jects with a com~mand, or tog~gle on auto~ma~tic sha~dow~ing to have <b>!ETC</b> ap~ply sha~dows to all new text ob~jects."
                        ], ["silver"]),
                        H.InlineHeader([
                            "Shadow Objects",
                            `Text sha~dows are cre~ated on the <b>${U.UCase(CFG.ETC.DropShadows.LAYER)}</b> la~yer. Sha~dows will move when their mas~ter ob~ject moves; they will up~date their con~tent, size, font, etc. to match their mas~ter ob~ject; and they will re~move them~selves if their mas~ter ob~ject is ever re~moved.`
                        ], ["silver"]),
                        H.InlineHeader([
                            "Configure Offsets",
                            "If the pos~i~tion~ing of sha~dows for any font/size com~bin~a~tion isn't to your lik~ing, you can con~fi~gure new off~sets by chat com~mand (see be~low)."
                        ], ["silver"])
                    ]),
                    H.H2("Chat Commands", ["silver"]),
                    H.Paras([
                        H.ButtonCommand([
                            "!etc shadow add",
                            "<u>ADD</u> sha~dows to all sel~ec~ted text ob~jects."
                        ], ["silver"]),
                        H.ButtonCommand([
                            "!etc shadow clear",
                            "<u>RE~MOVE</u> sha~dows from all sel~ec~ted text ob~jects."
                        ], ["silver"]),
                        H.ButtonCommand([
                            "!etc shadow clear all",
                            "<u>RE~MOVE</u> sha~dows from <b><u>ALL</u></b> text ob~jects."
                        ], ["silver"]),
                        H.ButtonCommand([
                            "!etc shadow hide",
                            "<u>HIDE</u> all text sha~dows."
                        ], ["silver"]),
                        H.ButtonCommand([
                            "!etc shadow show",
                            "<u>SHOW</u> all hid~den text sha~dows."
                        ], ["silver"]),
                        H.ButtonCommand([
                            "!etc shadow fix",
                            "Ver~i~fy and cor~rect pre~sence and pos~i~tions of text sha~dows."
                        ], ["silver"])
                    ]),
                    H.H2("Automation", ["silver"]),
                    H.P(H.ButtonToggle([
                        "Auto-Shadow",
                        "Whe~ther sha~dows are auto~ma~ti~cally ap~plied to new text ob~jects upon cre~a~tion."
                    ], `!etc toggle autoshadow ${STA.TE.isAutoShadowing ? "false" : "true"} feature`, [`toggle${STA.TE.isAutoShadowing ? "On" : "Off"}`, "silver"], {}, {title: `Click to ${STA.TE.isAutoShadowing ? "DEACTIVATE" : "ACTIVATE"} automatic text shadows for all text objects.`}))
                ], ["silver"]),
                H.ButtonFooter("!etc", "", ["silver", "goBack"])
            ], ["silver"]),
            textPruning: H.Box([
                H.Subtitle("Empty Text Pruning", ["etc"]),
                H.Block([
                    H.P("Ever notice that, when you click off of a text object, Roll20 goes and creates another text object wherever you clicked? If you then click elsewhere without typing anything, that empty and invisible text object remains (potentially interfering with box-selecting objects, among other vexations). Empty Text Pruning addresses this issue by removing empty text objects, either automatically or by chat command."),
                    H.H2("Chat Commands", ["silver"]),
                    H.P(H.ButtonCommand([
                        "!etc prune all",
                        "<u>REMOVE</u> all empty (invisible) text objects from the sandbox."
                    ], ["silver"])),
                    H.H2("Automation", ["silver"]),
                    H.P(H.ButtonToggle([
                        "Auto-Prune",
                        "Whe~ther empty (in~vi~sible) text ob~jects are auto~ma~ti~cally re~moved from the sand~box."
                    ], `!etc toggle autoprune ${STA.TE.isAutoPruning ? "false" : "true"} feature`, [`toggle${STA.TE.isAutoPruning ? "On" : "Off"}`, "silver"], {}, {title: `Click to ${STA.TE.isAutoPruning ? "DEACTIVATE" : "ACTIVATE"} automatic removal of empty text objects.`}))
                ], ["silver"]),
                H.ButtonFooter("!etc", "", ["goBack", "silver"])
            ], ["silver"])
        }[helpKey]);
    };
    const displayToggles = () => {
        U.Alert(H.Box([
            H.Subtitle("Options", ["etc"]),
            H.Block(
                H.ButtonToggle([
                    "Auto-Shadow",
                    "Whe~ther sha~dows are auto~ma~ti~cally ap~plied to new text ob~jects upon cre~a~tion."
                ], `!etc toggle autoshadow ${STA.TE.isAutoShadowing ? "false" : "true"}`, [`toggle${STA.TE.isAutoShadowing ? "On" : "Off"}`, "silver"], {}, {title: `Click to ${STA.TE.isAutoShadowing ? "DEACTIVATE" : "ACTIVATE"} automatic text shadows for all text objects.`})
                , ["silver"]
            ),
            H.Block(
                H.ButtonToggle([
                    "Auto-Prune",
                    "Whe~ther empty (in~vi~sible) text ob~jects are auto~ma~ti~cally re~moved from the sand~box."
                ], `!etc toggle autoprune ${STA.TE.isAutoPruning ? "false" : "true"}`, [`toggle${STA.TE.isAutoPruning ? "On" : "Off"}`, "silver"], {}, {title: `Click to ${STA.TE.isAutoPruning ? "DEACTIVATE" : "ACTIVATE"} automatic removal of empty text objects.`})
                , ["silver"]
            ),
            H.ButtonFooter("!etc", "", ["goBack", "silver"])
        ], ["silver"]));
    };
    const displayError = (errorTag) => {
        const ERRORHTML = {
            AddShadowToShadow: H.Box([
                H.Subtitle("ERROR", ["etc"]),
                H.Block([
                    H.H1("Shadow-on-Shadow", ["silver"]),
                    H.P("Text sha~dows can~not have sha~dows them~selves.")
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
                        H.ButtonCommand([
                            "!etc shadow clear",
                            "Re~moves text sha~dows from all sel~ected text ob~jects <i>(you can sel~ect ei~ther the mas~ter ob~ject, the sha~dow ob~ject, or both)</i>"
                        ], ["silver"]),
                        H.ButtonCommand([
                            "!etc shadow clear all",
                            "Re~move <b><u>ALL</u></b> text sha~dow ob~jects <i>(this will not af~fect the mas~ter text ob~jects, just re~move the sha~dows)</i>"
                        ], ["silver"])
                    ])
                ], ["silver"]),
                H.Footer(null, ["silver"])
            ], ["silver"])
        };
        if (errorTag in ERRORHTML) {
            U.Alert(ERRORHTML[errorTag]);
        }
    };

    // #endregion ▄▄▄▄▄ CHAT MESSAGES ▄▄▄▄▄

    // #region ▒░▒░▒░▒[EXPORTS] ETC ▒░▒░▒░▒ ~
    return {Preinitialize, Initialize};
    // #endregion ▒▒▒▒[EXPORTS: ETC]▒▒▒▒
})();

EunoCORE.Register("ETC", ETC);
void MarkStop("ETC");