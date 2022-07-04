const U = {
    RoundNum: (qNum, numDecDigits = 0) => {
        if (parseFloat(qNum) === parseInt(qNum)) {
            return parseInt(qNum);
        }
        return Math.round(parseFloat(qNum) * 10 ** parseInt(numDecDigits)) / 10 ** parseInt(numDecDigits);
    }
};

const C = {
    COLORS: {
        // Black / Grey / White
        black: "#000",
        grey10: `rgb(${new Array(3).fill(parseInt(255 * 0.1)).join(", ")})`,
        grey25: `rgb(${new Array(3).fill(parseInt(255 * 0.25)).join(", ")})`,
        grey: `rgb(${new Array(3).fill(parseInt(255 * 0.5)).join(", ")})`,
        grey75: `rgb(${new Array(3).fill(parseInt(255 * 0.75)).join(", ")})`,
        grey90: `rgb(${new Array(3).fill(parseInt(255 * 0.9)).join(", ")})`,
        white: "#FFF",

        // Gold
        gold: "#FFD700",
        palegold: "#FFE775",

        // Silver
        silver: "silver",
        palesilver: "#FFFFFF",

        // Bronze
        bronze: "#CD7F32",
        palebronze: "#E6BF99"
    },
    // #endregion ░░░░[COLORS]░░░░
    // #region ░░░░░░░[FONTS] Supported Sandbox Fonts ░░░░░░░ ~
    FONTS: {
        families: [
            "Arial",
            "Patrick Hand",
            "Contrail One",
            "Shadows Into Light",
            "Candal",
            "Tahoma",
            "Nunito",
            "Merriweather",
            "Anton",
            "Rye",
            "IM Fell DW Pica",
            "Montserrat",
            "Goblin One",
            "Della Respira",
            "Crimson Text",
            "Kaushan Script"
        ],
        sizes: [8, 10, 12, 14, 16, 18, 20, 22, 26, 32, 40, 56, 72, 100, 200, 300]
    },
    // #endregion ░░░░[FONTS]░░░░
    // #region ░░░░░░░[IMAGES] Image Source URLs ░░░░░░░ ~

    IMAGES: (function() {
        const IMGROOT = "https://tinyurl.com/xczfeezdv"; //~ "http://raw.githubusercontent.com/Eunomiac/EunosRoll20Scripts/master/images";
        return Object.fromEntries(Object.entries({
            buttonDownload: ["buttons", "buttonDownload.png", [50, 50]],
            buttonChat: ["buttons", "buttonChat.png", [50, 50]],
            buttonBug: ["buttons", "buttonBug.png", [50, 50]],

            //     #region ========== Gold: Level 1 Gold Theme =========== ~
            bgChatGold: ["backgrounds", "bgChatGold.jpg", [283, 563]],

            titleMain: ["bookends", "headerMain.png", [283, 208]],
            titleMainButtons: ["bookends", "headerMainButtons.png", [283, 208]],
            subtitleGold: ["bookends", "subtitleGold.png", [283, 142]],

            footerGold: ["bookends", "footerGold.png", [283, 142]],
            footerGoBackGold: ["bookends", "footerGoBackGold.png", [283, 142]],
            footerHideIntroGold: ["bookends", "footerHideIntroGold.png", [283, 142]],

            h1Gold: ["emphasis", "h1Gold.png", [283, 40]],
            h1GoldDim: ["emphasis", "h1GoldDim.png", [283, 40]],
            h1GoldTight: ["emphasis", "h1GoldTight.png", [283, 28]],
            h1GoldTightDim: ["emphasis", "h1GoldTightDim.png", [283, 28]],
            h1FlagGold: ["emphasis", "h1FlagGold.png", [283, 33]],

            h2Gold: ["emphasis", "h2Gold.png", [283, 37]],
            h2GoldDim: ["emphasis", "h2GoldDim.png", [283, 37]],
            h2GoldTight: ["emphasis", "h2GoldTight.png", [283, 24]],
            h2GoldTightDim: ["emphasis", "h2GoldTightDim.png", [283, 24]],
            h2FlagGold: ["emphasis", "h2FlagGold.png", [283, 24]],

            commandGold: ["emphasis", "commandGold.png", [235, 37]],

            toggleButtonOnGold: ["buttons", "toggleOnGold.png", [283, 78]],
            toggleButtonOffGold: ["buttons", "toggleOffGold.png", [283, 78]],
            //     #endregion _______ Gold _______
            //     #region ========== Silver: Level 2 Silver Theme =========== ~
            bgChatSilver: ["backgrounds", "bgChatSilver.jpg", [283, 563]],

            titleETC: ["bookends", "headerScriptETC.png", [283, 142]],
            titleEGC: ["bookends", "headerScriptEGC.png", [283, 142]],
            titleEHC: ["bookends", "headerScriptEHC.png", [283, 142]],
            subtitleSilver: ["bookends", "subtitleSilver.png", [283, 142]],

            footerSilver: ["bookends", "footerSilver.png", [283, 142]],
            footerGoBackSilver: ["bookends", "footerGoBackSilver.png", [283, 142]],

            h1Silver: ["emphasis", "h1Silver.png", [283, 40]],
            h1SilverDim: ["emphasis", "h1SilverDim.png", [283, 40]],
            h1SilverTight: ["emphasis", "h1SilverTight.png", [283, 28]],
            h1SilverTightDim: ["emphasis", "h1SilverTightDim.png", [283, 28]],
            h1FlagSilver: ["emphasis", "h1FlagSilver.png", [283, 33]],

            h2Silver: ["emphasis", "h2Silver.png", [283, 37]],
            h2SilverDim: ["emphasis", "h2SilverDim.png", [283, 37]],
            h2SilverTight: ["emphasis", "h2SilverTight.png", [283, 24]],
            h2SilverTightDim: ["emphasis", "h2SilverTightDim.png", [283, 24]],
            h2FlagSilver: ["emphasis", "h2FlagSilver.png", [283, 24]],

            commandSilver: ["emphasis", "commandSilver.png", [235, 37]],

            toggleButtonOnSilver: ["buttons", "toggleOnSilver.png", [283, 78]],
            toggleButtonOffSilver: ["buttons", "toggleOffSilver.png", [283, 78]],
            //     #endregion _______ Silver _______
            //     #region ========== Bronze: Level 3 Bronze Theme =========== ~
            bgChatBronze: ["backgrounds", "bgChatBronze.jpg", [283, 563]],

            subtitleBronze: ["bookends", "subtitleBronze.png", [283, 142]],
            subtitleBronzeETC: ["bookends", "subtitleBronzeETC.png", [283, 142]],
            subtitleBronzeEGC: ["bookends", "subtitleBronzeEGC.png", [283, 142]],
            subtitleBronzeEHC: ["bookends", "subtitleBronzeEHC.png", [283, 142]],

            footerBronze: ["bookends", "footerBronze.png", [283, 142]],
            footerGoBackBronze: ["bookends", "footerGoBackBronze.png", [283, 142]],

            h1Bronze: ["emphasis", "h1Bronze.png", [283, 40]],
            h1BronzeDim: ["emphasis", "h1BronzeDim.png", [283, 40]],
            h1BronzeTight: ["emphasis", "h1BronzeTight.png", [283, 28]],
            h1BronzeTightDim: ["emphasis", "h1BronzeTightDim.png", [283, 28]],
            h1FlagBronze: ["emphasis", "h1FlagBronze.png", [283, 33]],

            h2Bronze: ["emphasis", "h2Bronze.png", [283, 37]],
            h2BronzeDim: ["emphasis", "h2BronzeDim.png", [283, 37]],
            h2BronzeTight: ["emphasis", "h2BronzeTight.png", [283, 24]],
            h2BronzeTightDim: ["emphasis", "h2BronzeTightDim.png", [283, 24]],
            h2FlagBronze: ["emphasis", "h2FlagBronze.png", [283, 24]],

            commandBronze: ["emphasis", "commandBronze.png", [235, 37]],

            toggleButtonOnBronze: ["buttons", "toggleOnBronze.png", [283, 78]],
            toggleButtonOffBronze: ["buttons", "toggleOffBronze.png", [283, 78]],
            //     #endregion _______ Bronze _______

            h3BGBlack: ["backgrounds", "h3BGBlack.jpg", [626, 626]]
        }).map(([key, [folder, name, [width, height]]]) => [key, {height, width, img: [IMGROOT, folder, name].join("/")}]));
    })(),
    GetImgURL: function(imgKey) { return this.IMAGES[imgKey].img },
    GetImgSize: function(imgKey) {
        if (imgKey in this.IMAGES) {
            return [this.IMAGES[imgKey].width, this.IMAGES[imgKey].height];
        } else {
            throw `[Euno] Error: Bad Image Key: ${imgKey}`;
        }
    }
};
const [chatWidth, chatHeight, chatBottomPadding, chatLeftShift] = [283, 33, 7, -45];
const cssVars = {
    chatWidth, chatHeight, chatBottomPadding,
    blockSpacing: 10,
    shifts: {
        boxAll: [-1 * (chatHeight - chatBottomPadding), 0, -1 * chatBottomPadding, chatLeftShift],
        titleMainBottom: 0,
        titleScriptsBottom: -62,
        subtitleBottom: -100,
        footerTop: -100,
        commandHighlightShiftLeft: -20,
        h1Bottom: C.GetImgSize("h1GoldTight")[1] - C.GetImgSize("h1Gold")[1],
        h2Bottom: C.GetImgSize("h2GoldTight")[1] - C.GetImgSize("h2Gold")[1]
    },
    padding: {
        box: 10,
        subtitleTop: 17,
        commandHighlightAll: [1, 8, 0, 6],
        commandHighlightShiftRight: 17
    },
    indents: {
        flag: 30,
        h2: 10,
        h3: 4,
        commandHighlightShift: 14
    },
    font: {
        bodySansSerif: {
            color: C.COLORS.palegold,
            family: "Montserrat",
            size: 10,
            weight: "normal",
            get lineHeight() {
                return parseInt(1.5 * this.size);
            }
        },
        h1: {
            color: C.COLORS.black,
            family: "Anton",
            size: 20,
            weight: "normal",
            lineHeight: 28
        },
        h2: {
            color: C.COLORS.black,
            family: "Montserrat",
            size: 16,
            weight: "bold",
            lineHeight: 23
        },
        h3: {
            color: C.COLORS.palegold,
            family: "Montserrat",
            size: 12,
            weight: "bold",
            lineHeight: 20
        }
    },
    get halfSpace() {
        return EunoCORE.U.RoundNum(this.blockSpacing / 2, 2);
    },
    get qartSpace() {
        return EunoCORE.U.RoundNum(this.blockSpacing / 4, 2);
    }
};
const CSSText = [
    //     #region ========== Base Styles: Default Styles for Base Element Tags =========== ~
    `   div, span, a, p, pre, h1, h2, h3, img {
                    display: block;
                    height: auto; width: auto;
                    margin: 0; padding: 0;
                    vertical-align: baseline;
                    background-size: cover;
                    background-repeat: no-repeat;
                    border: none; outline: none; box-shadow: none; text-shadow: none;

                    color: inherit;
                    line-height: inherit;
                    font-family: inherit;
                    font-size: inherit;
                    font-weight: inherit;
                    text-align: inherit;
                }

                div {
                    position: relative;
                    z-index: 1;
                }

                p, h1, h2, h3, img {
                    margin: ${cssVars.blockSpacing}px 0;
                }

                .box {
                    min-height: ${cssVars.chatHeight}px;
                    width: ${cssVars.chatWidth}px;
                    margin: ${cssVars.shifts.boxAll.map((shift) => `${shift}px`).join(" ")};
                    color: ${cssVars.font.bodySansSerif.color};
                    line-height: ${cssVars.font.bodySansSerif.lineHeight}px;
                    font-family: ${cssVars.font.bodySansSerif.family}, sans-serif;
                    font-size: ${cssVars.font.bodySansSerif.size}px;
                    font-weight: ${cssVars.font.bodySansSerif.weight};
                    text-align: center;
                    background-image: url('${C.GetImgURL("bgChatGold")}');
                    background-size: auto;
                    background-repeat: repeat;
                    box-shadow: inset 0 0 5px ${C.COLORS.black}, inset 0 0 5px ${C.COLORS.black}, inset 0 0 5px ${C.COLORS.black};
                }
                .block {
                    text-align: left;
                }

                span, a {
                    display: inline-block;
                    text-decoration: none;
                    background-color: transparent;
                }
                p {
                    padding: 0 ${cssVars.padding.box}px;
                }
                h1 {
                    height: ${C.GetImgSize("h1Gold")[1]}px;
                    width: ${C.GetImgSize("h1Gold")[0]}px;
                    background-image: url('${C.GetImgURL("h1Gold")}');
                    margin: ${cssVars.blockSpacing}px 0 ${cssVars.shifts.h1Bottom}px 0;
                    color: ${cssVars.font.h1.color};
                    font-family: ${cssVars.font.h1.family}, sans-serif;
                    font-size: ${cssVars.font.h1.size}px;
                    font-weight: ${cssVars.font.h1.weight};
                    line-height: ${cssVars.font.h1.lineHeight}px;
                    text-align: center;
                }
                h2 {
                    height: ${C.GetImgSize("h2Gold")[1]}px;
                    width: ${C.GetImgSize("h2Gold")[0]}px;
                    background-image: url('${C.GetImgURL("h2Gold")}');
                    margin: ${cssVars.blockSpacing}px 0 ${cssVars.shifts.h2Bottom}px 0;
                    color: ${cssVars.font.h2.color};
                    font-family: ${cssVars.font.h2.family}, sans-serif;
                    font-size: ${cssVars.font.h2.size}px;
                    font-weight: ${cssVars.font.h2.weight};
                    line-height: ${cssVars.font.h2.lineHeight}px;
                    text-indent: ${cssVars.indents.h2}px;
                }
                h3 {
                    width: 100%;
                    background-image: url('${C.GetImgURL("h3BGBlack")}');
                    color: ${cssVars.font.h3.color};
                    font-family: ${cssVars.font.h3.family}, sans-serif;
                    font-size: ${cssVars.font.h3.size}px;
                    font-weight: ${cssVars.font.h3.weight};
                    line-height: ${cssVars.font.h3.lineHeight}px;
                    text-indent: ${cssVars.indents.h3}px;
                    text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8), -1px -1px 2px rgb(0, 0, 0), -1px -1px 2px rgb(0, 0, 0), -1px -1px 2px rgb(0, 0, 0),
                }
                pre {
                    color: ${C.COLORS.black};
                    font-family: 'Fira Code', monospace;
                    font-size: 8px;
                    font-weight: bold;
                    background-color: ${C.COLORS.grey90};
                }
            `,
    //     #endregion _______ Base Styles _______
    //     #region ========== Class Styles: Styles Applied by CSS Class Reference =========== ~
    `   .box.silver {
                    color: ${C.COLORS.white};
                    background-image: url('${C.GetImgURL("bgChatSilver")}');
                }
                .box.bronze {
                    color: ${C.COLORS.palebronze};
                    background-image: url('${C.GetImgURL("bgChatBronze")}');
                }
                .box.flag {
                    background-image: none;
                    box-shadow: none;
                    min-height: unset;
                }
                .block.silver {color: ${C.COLORS.white};}
                .block.titleButtons {
                    position: relative;
                    width: 40px;
                    top: -200px;
                    left: 240px;
                }
                .title, .subtitle {
                    width: ${cssVars.chatWidth}px;
                    color: ${C.COLORS.black};
                    font-family: Anton, sans-serif;
                    line-height: 36px;
                    font-size: 24px;
                    background-image: url('${C.GetImgURL("titleMainButtons")}');
                }
                .title.main {
                    height: ${C.GetImgSize("titleMainButtons")[1]}px;
                    margin-bottom: ${cssVars.shifts.titleMainBottom}px;
                }
                .title.etc {
                    height: ${C.GetImgSize("titleETC")[1]}px;
                    background-image: url('${C.GetImgURL("titleETC")}');
                    margin-bottom: ${cssVars.shifts.titleScriptsBottom}px;
                }
                .subtitle {
                    height: ${C.GetImgSize("subtitleBronzeETC")[1]}px;
                    background-image: url('${C.GetImgURL("subtitleBronzeETC")}');
                    background-size: auto;
                    margin-bottom: ${cssVars.shifts.subtitleBottom}px;
                    padding-top: ${cssVars.padding.subtitleTop}px;
                    line-height: 30px;
                }
                .subtitle.etc {
                    background-image: url('${C.GetImgURL("subtitleBronzeETC")}');
                }
                h1.flag, h2.flag, h3.flag {
                    margin: 0;
                    text-align: left;
                    text-indent: ${cssVars.indents.flag}px;
                    background-size: 100% 100%;
                }
                .tight {margin: 0}
                h1.flag {
                    height: ${C.GetImgSize("h1FlagGold")[1]}px;
                    line-height: ${C.GetImgSize("h1FlagGold")[1]}px;
                    background-image: url('${C.GetImgURL("h1FlagGold")}');
                }
                h1.tight {
                    height: ${C.GetImgSize("h1GoldTight")[1]}px;
                    line-height: ${C.GetImgSize("h1GoldTight")[1]}px;
                }
                h1.dim {background-image: url('${C.GetImgURL("h1GoldDim")}')}
                h1.dim.tight {background-image: url('${C.GetImgURL("h1GoldTightDim")}')}
                h1.silver {background-image: url('${C.GetImgURL("h1Silver")}')}
                h1.silver.dim {background-image: url('${C.GetImgURL("h1SilverDim")}')}
                h1.silver.dim.tight {background-image: url('${C.GetImgURL("h1SilverTightDim")}')}
                h1.bronze {background-image: url('${C.GetImgURL("h1Bronze")}')}
                h1.bronze.dim {background-image: url('${C.GetImgURL("h1BronzeDim")}')}
                h1.bronze.dim.tight {background-image: url('${C.GetImgURL("h1BronzeTightDim")}')}
                h1.flag.silver {background-image: url('${C.GetImgURL("h1FlagSilver")}')}
                h1.flag.bronze {background-image: url('${C.GetImgURL("h1FlagBronze")}')}
                h2.flag {
                    height: ${C.GetImgSize("h2FlagGold")[1]}px;
                    line-height: ${C.GetImgSize("h2FlagGold")[1]}px;
                    background-image: url('${C.GetImgURL("h2FlagGold")}');
                }
                h2.tight {
                    height: ${C.GetImgSize("h2GoldTight")[1]}px;
                    line-height: ${C.GetImgSize("h2GoldTight")[1]}px;
                }
                h2.dim {background-image: url('${C.GetImgURL("h2GoldDim")}')}
                h2.dim.tight {background-image: url('${C.GetImgURL("h2GoldTightDim")}')}
                h2.silver {background-image: url('${C.GetImgURL("h2Silver")}')}
                h2.silver.dim {background-image: url('${C.GetImgURL("h2SilverDim")}')}
                h2.silver.dim.tight {background-image: url('${C.GetImgURL("h2SilverTightDim")}')}
                h2.bronze {background-image: url('${C.GetImgURL("h2Bronze")}')}
                h2.bronze.dim {background-image: url('${C.GetImgURL("h2BronzeDim")}')}
                h2.bronze.dim.tight {background-image: url('${C.GetImgURL("h2BronzeTightDim")}')}
                h2.flag.silver {background-image: url('${C.GetImgURL("h2FlagSilver")}')}
                h2.flag.bronze {background-image: url('${C.GetImgURL("h2FlagBronze")}')}
                h3.flag {
                    height: ${C.GetImgSize("h2FlagGold")[1]}px;
                    line-height: ${C.GetImgSize("h2FlagGold")[1]}px;
                    background-image: url('${C.GetImgURL("h2FlagGold")}');
                    font-size: 12px;
                    line-height: 24px;
                    color: ${C.COLORS.black};
                    text-shadow: none;
                }
                h3.tight {
                    height: ${C.GetImgSize("h2GoldTight")[1]}px;
                    line-height: ${C.GetImgSize("h2GoldTight")[1]}px;
                }
                h3.dim {background-image: url('${C.GetImgURL("h2GoldDim")}')}
                h3.dim.tight {background-image: url('${C.GetImgURL("h2GoldTightDim")}')}
                h3.silver {background-image: url('${C.GetImgURL("h2Silver")}')}
                h3.silver.dim {background-image: url('${C.GetImgURL("h2SilverDim")}')}
                h3.silver.dim.tight {background-image: url('${C.GetImgURL("h2SilverTightDim")}')}
                h3.bronze {background-image: url('${C.GetImgURL("h2Bronze")}')}
                h3.bronze.dim {background-image: url('${C.GetImgURL("h2BronzeDim")}')}
                h3.bronze.dim.tight {background-image: url('${C.GetImgURL("h2BronzeTightDim")}')}
                h3.flag.silver {background-image: url('${C.GetImgURL("h2FlagSilver")}')}
                h3.flag.bronze {background-image: url('${C.GetImgURL("h2FlagBronze")}')}
                .commandHighlight {
                    padding: ${cssVars.padding.commandHighlightAll
        .map((pad) => `${pad}px`)
        .join(" ")};
                    color: ${C.COLORS.black};
                    font-family: monospace;
                    font-weight: bolder;
                    text-shadow: 0 0 1px ${C.COLORS.black};
                    background-image: url('${C.GetImgURL("commandGold")}');
                    background-size: 100% 100%;
                }
                .commandHighlight.silver {background-image: url('${C.GetImgURL("commandSilver")}')}
                .commandHighlight.bronze {background-image: url('${C.GetImgURL("commandBronze")}')}
                .commandHighlight.shiftLeft {
                    margin-left: ${cssVars.shifts.commandHighlightShiftLeft}px;
                    padding-right: ${
    cssVars.padding.commandHighlightShiftRight
}px;
                    text-align: right;
                    text-indent: ${cssVars.indents.commandHighlightShift}px;
                    background-position: right;
                }
                .footer {
                    height: ${C.GetImgSize("footerGold")[1]}px;
                    margin-top: ${cssVars.shifts.footerTop}px;
                    background-image: url('${C.GetImgURL("footerGold")}');
                    z-index: 0;
                }
                .footer.hideIntro {background-image: url('${C.GetImgURL("footerHideIntroGold")}')}
                .footer.goBack {background-image: url('${C.GetImgURL("footerGoBackGold")}')}
                .footer.silver {background-image: url('${C.GetImgURL("footerSilver")}')}
                .footer.goBack.silver {background-image: url('${C.GetImgURL("footerGoBackSilver")}')}
                .footer.bronze {background-image: url('${C.GetImgURL("footerBronze")}')}
                .footer.goBack.bronze {background-image: url('${C.GetImgURL("footerGoBackBronze")}')}
                span.buttonLabel {
                    width: 40px;
                    text-align: right;
                }
                span.buttonDesc {
                    font-size: 20px;
                    vertical-align: middle;
                    padding-bottom: 2px;
                    text-indent: 5px;
                }
                a.button {
                    display: block;
                    height: 100%;
                    width: 100%;
                }
                span.buttonRound {
                    height: 50px;
                    width: 50px;
                    margin: 0 15px;
                }
                span.buttonRound.titleButtons {
                    height: 37px;
                    width: 40px;
                    margin: 0;
                }
                span.buttonRound.download {background-image: url('${C.GetImgURL("buttonDownload")}')}
                span.buttonRound.chat {background-image: url('${C.GetImgURL("buttonChat")}')}
                span.buttonRound.bug {background-image: url('${C.GetImgURL("buttonBug")}')}
                div.toggleButton {
                    height: ${C.GetImgSize("toggleButtonOnGold")[1]}px;
                    padding: 0px 3px;
                    background-size: 105% ${C.GetImgSize("toggleButtonOnGold")[1]}px;
                }
                div.toggleButton.toggleOn {background-image: url('${C.GetImgURL("toggleButtonOnGold")}')}
                div.toggleButton.toggleOff {background-image: url('${C.GetImgURL("toggleButtonOffGold")}')}
                div.toggleButton.toggleOn.silver {background-image: url('${C.GetImgURL("toggleButtonOnSilver")}')}
                div.toggleButton.toggleOff.silver {background-image: url('${C.GetImgURL("toggleButtonOffSilver")}')}
                div.toggleButton.toggleOn.bronze {background-image: url('${C.GetImgURL("toggleButtonOnBronze")}')}
                div.toggleButton.toggleOff.bronze {background-image: url('${C.GetImgURL("toggleButtonOffBronze")}')}
                span.toggleButtonTitle {
                    width: 185px;
                    font-family: Anton, sans-serif;
                    font-weight: normal;
                    font-size: 14px;
                    color: ${C.COLORS.black};
                    text-transform: uppercase;
                    vertical-align: top;
                    margin-top: 8px;
                }
                span.toggleButtonBody {
                    height: 40px;
                    width: 160px;
                    font-family: 'Montserrat', sans-serif;
                    font-size: ${cssVars.font.bodySansSerif.size}px;
                    color: ${C.COLORS.black};
                    line-height: 14px;
                    font-weight: bold;
                }
                span.toggleButtonRight {
                    height: 30px;
                    width: 100px;
                    margin-left: 10px;
                    vertical-align: top;
                }
                .alignLeft {text-align: left}

            `
    //     #endregion _______ Class Styles _______
].join("");
console.log(CSSText);
const CSS = {};
CSSText
    .replace(/\/\*.*?\*\//g, "") // strip CSS comments
    .replace(/[\n\s]+/g, " ") // remove excess white space
    .replace(/("|')[a-z]+:\/\/.+?\1/gu, (url) => url.replace(/:/gu, "^")) // escape colons in url entries
    .split(/\}/) // capture selector blocks
    .map((selBlock) =>
        selBlock.split(/\{/).map((selBlock) => (selBlock || "").trim())) // separate selector from block
    .filter(([sel, block]) => sel && block) // filter out null values
    .map(([sel, block]) =>
        sel
            .split(/\s*,\s*/) // separate comma-delimited selectors ...
            .map((ssel) => [
                // ... and give each one its own copy of the associated properties
                ssel.trim(),
                Object.fromEntries(block
                    .split(/;/) // separate 'property: value' lines
                    .map((propVal) => (propVal || "").trim().split(/:/)) // separate 'property' and 'value' into key/val
                    .filter(([prop, val]) => prop && val) // filter out null values
                    .map(([prop, val]) => [
                        prop.trim(),
                        val.trim().replace(/\^/g, ":")
                    ])) // restore colons to urls
            ]))
    .flat() // flatten duplicated selectors (from comma-delimiting) into main array of [key, val] entries for object creation
    .forEach(([sel, block]) => {
        CSS[sel] = Object.assign(CSS[sel] || {}, block);
    });