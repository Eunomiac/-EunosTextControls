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
        IsAutoRegistering: false,
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

        // Display status of automatic text shadowing
        displayAutoShadowStatus();

        // Initialize Text class from state data
        Text.Initialize();
    };
    // #endregion

    // #region      Front: Event Handlers
    const handleMessage = (msg) => {
        if (msg.content.startsWith("!ets") && playerIsGM(msg.playerid)) {
            let [call, ...args] = (msg.content.match(/!\S*|\s@"[^"]*"|\s@[^\s]*|\s"[^"]*"|\s[^\s]*/gu) || [])
                .map((x) => x.replace(/^\s*(@)?"?|"?"?\s*$/gu, "$1"))
                .filter((x) => Boolean(x));
            ({
                help: displayIntroMessage,
                shadow: () => Text.AddShadows(getSelTextObjs(msg)),
                toggle: () => toggleAutoShadow(args.includes("true")),
                clear: () => {
                    if (args.includes("all")) {
                        Object.entries(RE.G).filter(([id, textData]) => "masterID" in textData).forEach(([id]) => unregTextShadow(id));
                        flagGM("Shadow objects removed.<br>Registered shadows cleared.");
                        displayAutoShadowToggleMenu();
                    } else {
                        getSelTextObjs(msg).forEach((obj) => unregTextShadow(obj.id));
                    }
                },
                fix: () => { if (args.includes("all")) { Text.Fix() } },
                cancelintro: () => { STA.TE.IsShowingIntro = false; flagGM("Disabling Script Introduction.") },
                teststate: () => { showGM(state) },
                testdata: () => { showGM((msg.selected || [null]).map((sel) => sel && "_type" in sel && getObj(sel._type, sel._id))) },
                purge: () => { if (args.includes("all")) { Initialize(false, true); showGM(RO.OT) } }
            }[(call = args.shift() || "").toLowerCase()] || (() => false))();
        }
    };
    const handleTextChange = (textObj) => {
        const Ҩtext = Text.Get(textObj.id);
        if (Ҩtext && !Ҩtext.isThrottlingEvents) {
            Ҩtext.ThrottleEvents(500);
            Ҩtext.SyncShadow(Ҩtext.isTextShadow);
        }
    };
    const handleTextAdd = (textObj) => {
        setTimeout(() => { // The delay is necessary to ensure the 'controlledby' field has time to update.
            const Ҩtext = new Text(textObj);
            if (STA.TE.IsAutoRegistering && !Ҩtext.isTextShadow) {
                Ҩtext.MakeShadow();
            }
        }, 500);
    };
    const handleTextDestroy = (textObj) => {
        const Ҩtext = Text.Get(textObj.id);
        if (Ҩtext && !Ҩtext.isThrottlingEvents) {
            if (Ҩtext.isTextShadow) {
                if (Text.OkToDestroy.includes(Ҩtext.id)) {
                    Ҩtext.master.RemoveShadow();
                } else {
                    alertGM(HTML.Box([
                        HTML.Header("ERROR: Shadow Removal"),
                        HTML.Block([
                            HTML.H("Recreating Destroyed Shadow"),
                            HTML.Paras([
                                "Manually-deleted text shadows are automatically recreated (to prevent accidentally deleting a desired shadow).",
                                "To remove a text shadow from a text object:",
                                `${HTML.CodeSpan("!ets clear")} — Removes text shadows from all selected text objects <i>(you can select either the master object, the shadow object, or both)</i>`,
                                `${HTML.CodeSpan("!ets clear all")} — Remove <b><u>ALL</u></b> text shadow objects <i>(this will not affect the master text objects, just remove the shadows)</i>`
                            ])
                        ])
                    ]));
                    Ҩtext.MakeShadow();
                }
            } else if (Ҩtext.hasTextShadow) {
                Ҩtext.RemoveShadow();
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
          * and then running "!ets fix all" will update all text objects with new offsets.
          *
          * Generic values are used UNLESS a specific override for that font-family and size exists.
          *     Overrides can be delivered via getters and the scaleOffsets() function if they're simple multiples (see examples below),
          *     ... OR you can define custom values for each font size (see e.g. "Contrail One", below) */
        generic: {
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
            200: [16, 16]
        },
        get "Shadows Into Light"() { return scaleOffsets(SHADOWOFFSETS.generic, 0.5) },
        /** scaleOffsets(offsetTable, multiplier): Returns a copy of the provided offset table, with its values scaled by the multiplier.
          *                                          - Can submit different horizontal and vertical multipliers by passing them as an array,
          *                                            i.e. [<horizMult>, <vertMult>] */
        get "Arial"() { return scaleOffsets(SHADOWOFFSETS.generic, 0.6) },
        get "Patrick Hand"() { return scaleOffsets(SHADOWOFFSETS.generic, 0.75) },
        "Contrail One": { // (for illustration only: does not differ from generic offsets)
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
            200: [16, 16]
        }
    };
    const SHADOWLAYER = "map"; /** The layer containing shadow objects.
                                 * Keeping master objects on the Objects layer and shadow objects on the Map layer makes
                                 * it easier to manipulate the master objects without the shadows getting in your way.
                                 * (Keeping both on the map layer also works well, particularly if the text objects
                                 * will only be modified by other script functions.) */
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
    const getSelTextObjs = (msg) => (msg.selected || []).filter((objData) => objData._type === "text").map((objData) => getObj("text", objData._id));
    const jS = (val) => JSON.stringify(val, null, 2).replace(/\n/g, "<br>").replace(/ /g, "&nbsp;"); // Stringification for display in R20 chat.
    const jC = (val) => HTML.CodeBlock(jS(val)); // Stringification for data objects and other code for display in R20 chat.
    const alertGM = (content, title, isThrottling = true) => { // Simple alert to the GM. Style depends on presence of content, title, or both.
        if (isThrottling && `${title}:${content.slice(0, 20)}` in throttleTimers) {
            return false;
        }
        const randStr = () => _.sample("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split(""), 10).join("");
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
                sendChat(randStr(), `/w gm ${content}`, null, {noarchive: true});
            }
        }
        if (isThrottling) {
            throttleTimers[`${title}:${content.slice(0, 20)}`] = setTimeout(() => delete throttleTimers[title], 1000);
        }
        return true;
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
    const scaleOffsets = (sourceOffsets, multiplier) => keyMapObj(
        sourceOffsets,
        ([leftOffset, topOffset]) => {
            if (Array.isArray(multiplier)) {
                return [leftOffset * multiplier[0], topOffset * multiplier[1]];
            }
            return [leftOffset * multiplier, topOffset * multiplier];
        }
    );

    // #endregion *** *** UTILITY *** ***

    // #region *** *** TEXT CLASS *** ***
    class Text { // Subclass for Shadow Objects, Display Objects
        // #region STATIC METHODS, GETTERS, SETTERS
        static Initialize() {
            Object.entries(RE.G).forEach(([id, data]) => {
                const textObj = getObj("text", id);
                if (textObj) {
                    new Text(textObj);
                } else {
                    delete RE.G[id];
                }
            });
        }
        static Has(textID) { return textID in this.REG }
        static Get(textID) { return this.Has(textID) ? this.REG[textID] : false }
        static Register(Ҩtext) {
            this._REG = this._REG || {};
            this._REG[Ҩtext.id] = Ҩtext;
        }
        static Unregister(Ҩtext) { delete this._REG[Ҩtext.id] }
        static Fix() {
            // Validates Registry & Sandbox Objects, Synchronizing where necessary.

            // ONE: Locate all shadow objects in the sandbox, and remove any that aren't registered in the Text class.
            findObjs({_type: "text"}).filter((obj) => isShadowObj(obj) && !Text.Has(obj.id)).forEach((obj) => obj.remove());

            // TWO: Cycle through registry, ensuring all objects exist.
            //    If a ShadowObj doesn't exist, create it.
            //    If a MasterObj doesn't exist, unreg the shadow.
            /* for (const [id, objData] of Object.entries(RE.G)) {
                const textObj = getObj("text", id);
                if (textObj) {
                    if ("masterID" in objData) { // This is a Shadow Object.
                        const masterObj = getObj("text", objData.masterID);
                        if (!(masterObj && masterObj.id in RE.G)) { // This is an orphan: Kill it.
                            unregTextShadow(textObj.id);
                        }
                    } else if ("shadowID" in objData) { // This is a Master Object.
                        const shadowObj = getObj("text", objData.shadowID);
                        if (!shadowObj) { // Create a shadow if it's missing
                            makeTextShadow(textObj);
                        } else if (!(shadowObj.id in RE.G)) { // ... same for registry.
                            regTextShadow(textObj, shadowObj);
                        }
                    } else { // Should never get here.
                        alertGM(`Registry entry for ${id} does not contain a masterID or a shadowID`, "REGISTRY ERROR");
                    }
                } else {
                    unregTextShadow(objData.shadowID || objData.id);
                }
            }

            // THREE: Cycle through registry again, synchronizing all shadow objects.
            for (const [id, shadowData] of Object.entries(RE.G).filter(([id, data]) => "masterID" in data)) {
                const [masterObj, shadowObj] = [getObj("text", shadowData.masterID), getObj("text", id)];
                syncShadow(masterObj, shadowObj);
            }

            flagGM("Text Shadows Synchronized."); */
        }
        static AddShadows(Ҩtexts) {
            [Ҩtexts].flat().forEach((Ҩtext) => {
                if (getR20Type(Ҩtext) === "text") {
                    Ҩtext = Text.Get(Ҩtext.id) || new Text(Ҩtext);
                }
                if (Ҩtext instanceof Text && !Ҩtext.isTextShadow && !Ҩtext.hasTextShadow) {
                    Ҩtext.MakeShadow();
                }
            });
        }

        static get REG() { return this.REG }
        static get OkToDestroy() {
            this._removalQueue = this._removalQueue || [];
            return this._removalQueue;
        }
        static set OkToDestroy(Ҩtext) {
            this._removalQueue = this._removalQueue || [];
            this._removalQueue.push(Ҩtext.id);
        }
        // #endregion

        // #region CONSTRUCTOR
        constructor(textObj) {
            if (getR20Type(textObj) === "text") {
                this._id = textObj.id;
                this._type = getR20Type(textObj);
                if (this.id in RE.G) {
                    this._importStateData();
                } else if (STA.TE.IsAutoRegistering && !this.isTextShadow) {
                    this._activeLayer = this.layer;
                    this.MakeShadow();
                }
                Text.Register(this);
                this._writeStateData();
            }
        }
        // #endregion

        // #region PRIVATE METHODS, GETTERS, SETTERS
        get isRegisteringToState() { return !this.isTextShadow }
        get stateData() { return RE.G[this.id] || false }
        set stateData(data = {}) { Object.assign(RE.G[this.id], data) }

        _importStateData() {
            if (this.stateData) {
                if ("shadowID" in this.stateData) {
                    this._shadowID = this.stateData.shadowID;
                    if (!Text.Has(this._shadowID)) {
                        this.MakeShadow(getObj("text", this.shadowID));
                    }
                }
            }
        }
        _writeStateData() {
            const stateData = {id: this.id};
            if (this.isRegisteringToState) {
                if (this.isTextShadow) {
                    stateData.masterID = this.masterID;
                } else if (this.hasTextShadow) {
                    stateData.shadowID = this.shadowID;
                }
                this.stateData = stateData;
            }
        }
        // #endregion

        // #region PUBLIC METHODS, GETTERS, SETTERS
        get id() { return this._id }
        get obj() {
            this._obj = this._obj || getObj("text", this.id);
            return this._obj;
        }
        get controlledby() { return (this.obj || {get: () => false}).get("controlledby") }
        get text() { return this.obj.get("text") }      set text(text) { this.obj.set({text}) }
        get color() { return this.obj.get("color") }
        get left() { return this.obj.get("left") }
        get top() { return this.obj.get("top") }
        get fontFamily() { return this.obj.get("font_family") }
        get fontSize() { return this.obj.get("font_size") }
        get layer() { return this.obj.get("layer") }
        set layer(layer) { this.obj.set({layer}) }
        get activeLayer() {
            if (!this._activeLayer) {
                if (this.isActive) {
                    this._activeLayer = this.layer;
                }
            }
            return this._activeLayer || false;
        }
        set activeLayer(layer) { this._activeLayer = layer || this.isActive && this.layer }

        get isActive() { return this.layer !== INACTIVELAYER }
        set isActive(activeState) {
            if (activeState === true) {
                this.layer = this.activeLayer;
                if (this.hasTextShadow) {
                    this.SyncShadow();
                }
            } else if (activeState === false) {
                this.layer = INACTIVELAYER;
                if (this.hasTextShadow) {
                    this.shadow.layer = INACTIVELAYER;
                }
            }
        }

        get isTextShadow() { return this.type === "text" && /etcshadowobj/u.test(this.controlledby) }
        get hasTextShadow() { return Boolean(this.shadow) }
        get isThrottlingEvents() { return this._isThrottlingEvents }
        get masterID() { return this.isTextShadow ? this._masterID : this.id }
        set masterID(id) { this._masterID = id }
        get shadowID() { return this.isTextShadow ? this.id : this._shadowID }
        set shadowID(id) { this._shadowID = id }
        get master() { return Text.Get(this.masterID) }
        get shadow() { return Text.Get(this.shadowID) }
        get masterObj() { return this.master ? this.master.obj : false }
        get shadowObj() { return this.shadow ? this.shadow.obj : false }
        get shadowOffsets() { return ({
            ...SHADOWOFFSETS.generic,
            ...(this.fontFamily in SHADOWOFFSETS ? SHADOWOFFSETS[this.fontFamily] : SHADOWOFFSETS.generic)
        }[this.fontSize]);}

        MakeShadow(shadowObj) {
            if (this.hasTextShadow) {
                shadowObj = shadowObj || this.shadowObj;
            }
            if (this.isTextShadow) {
                alertGM("Error: Cannot add a text shadow to a text shadow object.", "ERROR: Text Shadows");
            } else {
                const [leftOffset, topOffset] = this.shadowOffsets;
                if (!shadowObj) {
                    shadowObj = createObj("text", {
                        _pageid: this.obj.get("_pageid"),
                        left: this.obj.get("left") + leftOffset,
                        top: this.obj.get("top") + topOffset,
                        text: this.obj.get("text"),
                        font_size: this.obj.get("font_size"),
                        rotation: this.obj.get("rotation"),
                        font_family: this.obj.get("font_family"),
                        color: SHADOWCOLOR,
                        layer: SHADOWLAYER,
                        controlledby: "etcshadowobj"
                    });
                }
                const shadowInst = new Text(shadowObj);
                this.shadowID = shadowInst.id;
                shadowInst.masterID = this.id;
                shadowInst.activeLayer = SHADOWLAYER;
                this._writeStateData();
                this.SyncShadow();
            }
        }
        SyncShadow(syncToShadow = false) {
            if (this.masterObj && this.shadowObj) {
                const [leftOffset, topOffset] = this.shadowOffsets;
                if (leftOffset && topOffset) {
                    if (syncToShadow) {
                        this.masterObj.set({
                            text: this.shadowObj.get("text"),
                            left: this.shadowObj.get("left") - leftOffset,
                            top: this.shadowObj.get("top") - topOffset,
                            font_family: this.shadowObj.get("font_family"),
                            rotation: this.shadowObj.get("rotation"),
                            font_size: this.shadowObj.get("font_size")
                        });
                    } else {
                        this.shadowObj.set({
                            text: this.masterObj.get("text"),
                            left: this.masterObj.get("left") + leftOffset,
                            top: this.masterObj.get("top") + topOffset,
                            layer: SHADOWLAYER,
                            color: SHADOWCOLOR,
                            font_family: this.masterObj.get("font_family"),
                            rotation: this.masterObj.get("rotation"),
                            font_size: this.masterObj.get("font_size")
                        });
                    }
                    toFront(this.shadowObj);
                    toFront(this.masterObj);
                }
            }
        }
        RemoveShadow() {
            if (this.shadowObj) {
                Text.Unreg(this.shadow);
                this.shadowObj.remove();
                this.shadow = false;
                this.shadowID = false;
                this._writeStateData();
            }
        }
        ThrottleEvents(duration = 500) {
            this._isThrottlingEvents = true;
            setTimeout(() => this._isThrottlingEvents = false, duration);
        }
        Toggle(activeState) {
            if (activeState === undefined) {
                activeState = !this.isActive;
            }
            this.isActive = activeState;
        }
        // #endregion
    }

    class Shadow extends Text {
        static Make(Ҩmaster) {

        }
        constructor(textObjOrData, Ҩmaster) {
            // textObj could be master or shadow; data could be of master or of shadow
            super(textObjOrData);
            this._masterID = Ҩmaster.id;
            this.updateTextShadow();
        }

        updateTextShadow() {
        }
    }

    // #endregion *** *** TEXT CLASS *** ***

    // #region *** *** FEATURE: TEXT SHADOWS *** ***
    const removalQueue = [];

    // #region      Text Shadows: Creation & Toggling Automatic Creation
    /* const makeTextShadow = (masterObjs) => {
        [masterObjs].flat().forEach((masterObj) => {
            let isSkipping = false;
            if (masterObj && masterObj.id in RE.G) {
                if (RE.G[masterObj.id].shadowID) {
                    unregTextShadow(RE.G[masterObj.id].shadowID);
                } else if (RE.G[masterObj.id].masterID) {
                    flagGM("Cannot add a shadow to an existing text shadow object!");
                    isSkipping = true;
                }
            }
            if (!isSkipping) {
                if (getR20Type(masterObj) === "text") {
                    const [leftOffset, topOffset] = getOffsets(masterObj.get("font_family"), parseInt(masterObj.get("font_size"))) || [];
                    if (leftOffset && topOffset) {
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
            }
        });
    }; */
    const toggleAutoShadow = (isActive) => {
        if (isActive === true) {
            STA.TE.IsAutoRegistering = true;
        } else if (isActive === false) {
            STA.TE.IsAutoRegistering = false;
        }
        displayAutoShadowStatus();
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
    const unregTextShadow = (ids) => {
        [ids].flat().forEach((id) => {
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
    /*  const syncShadow = (masterObj, shadowObj) => {
        // Where the magic happens (?) --- synchronizing text shadows to their master objects, whenever they're changed or created.
        if (getR20Type(masterObj) && getR20Type(shadowObj)) {
            const [leftOffset, topOffset] = getOffsets(masterObj.get("font_family"), parseInt(masterObj.get("font_size"))) || [];
            if (leftOffset && topOffset) {
                shadowObj.set({
                    text: masterObj.get("text"),
                    left: masterObj.get("left") + leftOffset,
                    top: masterObj.get("top") + topOffset,
                    layer: SHADOWLAYER,
                    color: SHADOWCOLOR,
                    font_family: masterObj.get("font_family"),
                    rotation: masterObj.get("rotation"),
                    font_size: masterObj.get("font_size")
                });
                toFront(shadowObj);
                toFront(masterObj);
            }
        }
    }; */
    // #endregion

    // #endregion *** *** TEXT SHADOWS *** ***

    // #region *** *** HTML *** ***

    // #region      HTML: Styles

    const CHATWIDTH = 270; // The minimum width of the chat panel, in pixels.

    const UPSHIFT = -25;   // Constants governing how the chat box is positioned in the chat panel: By default, everything
    const LEFTSHIFT = -42; // shifts up and to the left to cover the standard chat output with the custom styles below.
    const BOTTOMSHIFT = 0;

    const HTML = {
        Box: (content) => `<div style="${parseStyles(`
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
            `)}">${[content].flat().join("")}</div>`,
        Block: (content, bgColor = "white", fontFamily = "serif", fontWeight = "normal", fontSize = 14, lineHeight = null) => `<div style="${parseStyles({
            "width": "97%",
            "margin": "2px 0 0 0",
            "padding": "1.5%",
            "text-align": "left", "text-align-last": "left",
            "background": bgColor,
            "font-family": `'${fontFamily}'`,
            "font-weight": fontWeight,
            "font-size": `${fontSize}px`,
            "line-height": `${lineHeight ? lineHeight : fontSize + 4}px`
        })}">${[content].flat().join("")}</div>`,
        Header: (content, bgColor = "rgba(80,80,80,1)") => `<span style="${parseStyles({
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
            "border": "none", "text-shadow": "none", "box-shadow": "none"
        })}">${[content].flat().join("")}</span>`,
        CodeBlock: (content, bgColor = "white") => HTML.Block(content, bgColor, "monospace", "bold", 10),
        CodeSpan: (content) => `<span style="${parseStyles({
            "display": "inline-block",
            "font-family": "monospace",
            "font-weight": "bolder",
            "font-size": "12px",
            "background": "#AAA",
            "padding": "0 5px"
        })}">${[content].flat().join("")}</span>`,
        Button: (name, command, width = "100%") => `<span style="${parseStyles({
            "display": "inline-block",
            "width": `${width}`,
            "color": "white",
            "text-align": "center"
        })}"><a href="${command}" style="${parseStyles(`
                    width: 90%;
                    background: gold;
                    color: black;
                    font-family: sans-serif;
                    text-transform: uppercase;
                    font-weight: bold;
                    border-radius: 10px;
                    border: 2px outset #666;
                    line-height: 14px;
                `)}">${name}</a></span>`,
        H: (content, level = 3) => `<h${level}>${content}</h${level}>`,
        Paras: (content) => [content].flat().map((para) => `<p>${[para].flat().join("")}</p>`).join(""),
        Span: (content, bgColor = "none", color = "black", fontSize = "14px", fontFamily = "sans-serif", lineHeight = "18px") => `<span style="${parseStyles(`
                display: inline-block;
                background: ${bgColor};
                color: ${color};
                font-size: ${fontSize};
                font-family: ${fontFamily};
                line-height: ${lineHeight};
            `)}">${[content].flat().join("")}</span>`,
        Img: (imgSrc) => `<img src="${imgSrc}">`
    };
    // #endregion

    // #region      HTML: Chat Displays & Menus
    const displayIntroMessage = () => {
        alertGM(HTML.Box([
            HTML.Header("Eunomiac's Text Controls v.0.1"),
            HTML.Block([
                HTML.Img("https://raw.githubusercontent.com/Eunomiac/-EunosTextControls/master/images/Header%20-%20Text%20Shadows%200.1.jpg"),
                HTML.Paras([
                    "Add pleasant shadows to sandbox text objects in Roll20 — either <b>automatically</b>, whenever new text is added to the sandbox, or <b>manually</b>, by selecting text objects and registering them for a shadow via the commands below.",
                    "Shadow objects are intended to be hands off: They're created automatically when registered, will update whenever their master text object's position and/or content changes, and will be removed if the master object is ever deleted."
                ]),
                HTML.H("Automatic Configuration"),
                HTML.Paras([
                    `${HTML.CodeSpan("!ets toggle true")} — This will toggle <b>ON</b> the automatic creation of text shadows for <b><u>ALL</u></b> new text objects, applied when they are first added to the sandbox by any player.  <i>(You can then remove text shadows from specific text objects by selecting them and running <b>!ets clear</b>, as described below.)</i>`,
                    `${HTML.CodeSpan("!ets toggle false")} — Toggle <b>OFF</b> automatic shadow creation.`
                ]),
                HTML.H("Individual Configuration"),
                HTML.Paras([
                    `${HTML.CodeSpan("!ets shadow")} — <b>ADD</b> shadow(s) to all selected text objects.`,
                    `${HTML.CodeSpan("!ets clear")} — <b>REMOVE</b> shadow(s) from all selected text objects <i>(you can select either master objects and/or shadow objects for this command)</i>`
                ]),
                HTML.H("Global Commands"),
                HTML.Paras([
                    `${HTML.CodeSpan("!ets help")} — View this help message.`,
                    `${HTML.CodeSpan("!ets clear all")} — <b>REMOVE <u>ALL</u></b> text shadow objects <i>(this will not affect the master text objects, just remove the shadows)</i>`,
                    `${HTML.CodeSpan("!ets fix all")} — <b>FIX <u>ALL</u></b> text shadow objects, correcting for any errors in position or content, as well as spotting and pruning any orphaned objects from the registry.`
                ]),
                HTML.H("Fine-Tuning Shadows"),
                HTML.Paras(`The code contains further configuration options in the <b>${HTML.CodeSpan("&#42;&#42;&#42; CONFIGURATION &#42;&#42;&#42;")}</b> section, where you can change the color of the shadows and adjust the amount of offset for specific fonts and sizes.`),
                HTML.H("Source Code & Bug Reports"),
                HTML.Paras([
                    "The most recent version of this script, as well as the place to go to submit issues, suggestions or bug reports, is <b><u><a href=\"https://github.com/Eunomiac/-EunosTextControls\" style=\"color: blue;\">right here</a></b>.",
                    "To prevent this message from appearing on startup, click below."
                ]),
                HTML.Button("Hide Intro Message", "!ets cancelintro")
            ])
        ]));
    };
    const displayAutoShadowStatus = () => {
        if (STA.TE.IsAutoRegistering) {
            alertGM(HTML.Box([
                HTML.Header("Auto-Shadowing <u><b>ACTIVE</b></u>", "#080"),
                HTML.Block(HTML.Button("Disable Auto-Shadow", "!ets toggle false"))
            ]));
        } else {
            alertGM(HTML.Box([
                HTML.Header("Auto-Shadowing <u><b>INACTIVE</b></u>", "#800"),
                HTML.Block(HTML.Button("Enable Auto-Shadow", "!ets toggle true"))
            ]));
        }
    };
    const displayAutoShadowToggleMenu = () => {
        alertGM(HTML.Box([
            HTML.Header("Auto-Text Shadow?"),
            HTML.Block([
                HTML.Span("Do you want newly-created text objects to receive a shadow automatically?"),
                HTML.Button("Yes", "!ets toggle true", "50%"),
                HTML.Button("No", "!ets toggle false", "50%")
            ])
        ]));
    };
    // #endregion

    // #endregion *** *** HTML *** ***

    return {Initialize};
})();

on("ready", () => EunosTextControls.Initialize(true));