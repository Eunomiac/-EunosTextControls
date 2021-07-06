// #region ░░░░░░░[STYLES]░░░░ CSS Class Style Definitions ░░░░░░
const CSS = Object.fromEntries([
    /* #region Base Element Styles */
    `    div {
            display: block;
            width: auto;
            height: auto;
            margin: 0;
            padding: 0;
            color: #FFE775;
            font-size: 0;
            border: none;
            outline: none;
            text-shadow: none;
            box-shadow: none;
            overflow: hidden;
        }
        span {
            display: inline-block;
            padding: 0;
            color: inherit;
            font-family: inherit;
            font-size: inherit;
            font-weight: inherit;
            line-height: inherit;
            vertical-align: baseline;
        }
        p {
            display: block;
            margin: 6px 3px;
            font-size: 13px;
            font-family: Tahoma, sans-serif;
            line-height: 18px;
            text-align: left;
        }
        pre {
            margin: 0;
            padding: 0;
            font-family: 'Fira Code', Input, monospace;
            font-size: 8px;
            font-weight: bold;
            background-color: #DDD;
        }
        img {display: block}
        a {
            display: inline-block;
            width: 90%;
            margin: 0;
            padding: 5px;
            background: none;
            color: black;
            font-family: inherit;
            font-size: inherit;
            font-weight: bold;
            line-height: inherit;
            vertical-align: inherit;
            text-decoration: none;
            outline: none;
            border: none;
        }
        h1 {
            display: block;
            height: 43px;
            width: 283px;
            margin: 20px 0 -10px -6px;
            font-family: Impact, sans-serif;
            line-height: 28px;
            font-size: 24px;
            font-weight: normal;
            color: black;
            text-align: center;
            background-image: url('https://raw.githubusercontent.com/Eunomiac/EunosRoll20Scripts/master/images/emphasis/h1Gold.png');
            background-size: cover;
        }
        h2 { /* background: bg-color bg-image position/bg-size bg-repeat bg-origin bg-clip bg-attachment initial|inherit, */
            display: block;
            height: 26px;
            width: 283px;
            margin: 5px 0 0px -6px;
            font-family: 'Trebuchet MS', sans-serif;
            line-height: 23px;
            font-size: 16px;
            color: black;
            text-indent: 10px;
            background-image: url('https://raw.githubusercontent.com/Eunomiac/EunosRoll20Scripts/master/images/emphasis/h2Gold.png');
        }
        h3 {
            display: block;
            width: 100%;
            font-family: 'Trebuchet MS', sans-serif;
            line-height: 20px;
            margin: 0 0 9px 0;
            color: gold;
            text-indent: 4px;
            background-image: url('https://raw.githubusercontent.com/Eunomiac/EunosRoll20Scripts/master/images/backgrounds/h3BGBlack.png');
            text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8), -1px -1px 2px rgb(0, 0, 0), -1px -1px 2px rgb(0, 0, 0), -1px -1px 2px rgb(0, 0, 0),
        }
    `,
    /* #endregion Base Styles */
    /* #region Class Styles */
    `   .box {
            width: 283px;
            min-width: 283px;
            min-height: 39px;
            margin: -26px 0 -7px -45px;
            text-align: center;
            position: relative;
            background-image: url('https://raw.githubusercontent.com/Eunomiac/EunosRoll20Scripts/master/images/backgrounds/chatBGGold.jpg');
            background-size: 100%;
        }
        .block {
            min-width: 259px;
            margin: 2px 0 0 0;
            padding: 0 6px;
            text-align: left;
        }
        .title {
            width: 100%;
            margin: 0 0 -30px 0;
            color: black
            font-family: Impact; sans-serif;
            line-height: 36px;
            font-size: 24px;
            font-weight: normal;
            text-align: center;
        }
        .title.main {
            height: 208px;
            background-image: url('https://raw.githubusercontent.com/Eunomiac/EunosRoll20Scripts/master/images/bookends/titleMain.png');
            background-size: cover;
        }
        .title.etc {
            height: 142px;
            background-image: url('https://raw.githubusercontent.com/Eunomiac/EunosRoll20Scripts/master/images/bookends/titleETC.png');
            background-size: cover;
            margin-bottom: -65px;
        }
        .subtitle {
            width: 100%;
            margin: 0 0 0 0;
            color: black
            font-family: Impact; sans-serif;
            line-height: 36px;
            font-size: 24px;
            font-weight: noraml;
            text-align: center;
        }
        .subtitle.etc {
            height: 60px;
            background-image: url('https://raw.githubusercontent.com/Eunomiac/EunosRoll20Scripts/master/images/bookends/titleSubETC.png")}');
            background-size: cover;
        }
        .flag {
            margin: 0;
            text-align: left;
            text-indent: 40px;
        }
        h1.flag {
            height: 31px;
            line-height: 29px;
            background-image: url('https://raw.githubusercontent.com/Eunomiac/EunosRoll20Scripts/master/images/emphasis/h1FlagGold.png');
        }
        h1.silver {background-image: url('https://raw.githubusercontent.com/Eunomiac/EunosRoll20Scripts/master/images/emphasis/h1Silver.png');}
        h1.flag.silver {background-image: url('https://raw.githubusercontent.com/Eunomiac/EunosRoll20Scripts/master/images/emphasis/h1FlagSilver.png');}
        h1.tight {
            height: 28px;
            margin-top: 2px;
            margin-bottom: 0px;
        }
        h2.flag {
            height: 24px;
            line-height: 21px;
            background-image: url('https://raw.githubusercontent.com/Eunomiac/EunosRoll20Scripts/master/images/emphasis/h2FlagGold.png');
            background-position: center -2px;
        }
        h2.silver {background-image: url('https://raw.githubusercontent.com/Eunomiac/EunosRoll20Scripts/master/images/emphasis/h2Silver.png');}
        h2.flag.silver {background-image: url('https://raw.githubusercontent.com/Eunomiac/EunosRoll20Scripts/master/images/emphasis/h2FlagSilver.png');}
        .commandHighlight {
            margin: 0 3px;
            padding: 0 8px 0 6px;
            color: black;
            font-family: monospace;
            font-weight: bolder;
            text-shadow: 0 0 1px black;
            background-image: url('https://raw.githubusercontent.com/Eunomiac/EunosRoll20Scripts/master/images/emphasis/commandGold.png');
            background-size: 100% 100%;
            background-repeat: no-repeat;
        }
        .commandHighlight.silver {background-image: url('https://raw.githubusercontent.com/Eunomiac/EunosRoll20Scripts/master/images/emphasis/commandSilver.png');}
        .commandHighlight.shiftLeft {
            margin: 0 0 0 -20px;
            padding-right: 17px;
            text-align: right;
            text-indent: 14px;
            background-position: right;
        }
        .footer {
            height: 37px;
            margin: 6px 0 0 0;
            background-image: url('https://raw.githubusercontent.com/Eunomiac/EunosRoll20Scripts/master/images/bookends/footerGold.png');
            background-size: 100%;
            background-repeat: no-repeat;
            font-weight: normal;
        }
        .footer.silver {background-image: url('https://raw.githubusercontent.com/Eunomiac/EunosRoll20Scripts/master/images/bookends/footerGold.png');}
        .footer.hideIntro {background-image: url('https://raw.githubusercontent.com/Eunomiac/EunosRoll20Scripts/master/images/bookends/footerHideIntroGold.png');}
        .footer.goBack {background-image: url('https://raw.githubusercontent.com/Eunomiac/EunosRoll20Scripts/master/images/bookends/footerGoBackGold.png');}
        .footer.goBack.silver {background-image: url('https://raw.githubusercontent.com/Eunomiac/EunosRoll20Scripts/master/images/bookends/footerGoBackSilver.png');}
        a.button {
            display: block;
            height: 100%;
            width: 100%;
            margin: 0; padding: 0;
            text-align: inherit;
            font-family: inherit;
            font-size: inherit;
            line-height: inherit;
            font-weight: inherit;
            text-transform: inherit;
            color: inherit;
        }
        span.buttonRound {
            height: 50px;
            width: 50px;
            margin: 0 15px;
        }
        span.buttonRound.download {background-image: url('https://raw.githubusercontent.com/Eunomiac/EunosRoll20Scripts/master/images/buttons/buttonDownload.png');}
        span.buttonRound.chat {background-image: url('https://raw.githubusercontent.com/Eunomiac/EunosRoll20Scripts/master/images/buttons/buttonChat.png');}
        span.buttonRound.bug {background-image: url('https://raw.githubusercontent.com/Eunomiac/EunosRoll20Scripts/master/images/buttons/buttonBug.png');}
        .fade50 {opacity: 0.5}
    `
    /* #endregion Class Styles */
].join("")
    .replace(/\/\*.*?\*\//g, "") // strip CSS comments
    .replace(/\s+/g, " ") // remove excess white space
    .replace(/("|')[a-z]+:\/\/.+?\1/gu, (url) => url.replace(/:/gu, "^")) // escape colons in url entries
    .split(/\}/) // capture selector blocks
    .map((selBlock) => selBlock.split(/\{/).map((selBlock) => (selBlock || "").trim())) // separate selector from block
    .filter(([sel, block]) => sel && block) // filter out null values
    .map(([sel, block]) => sel.split(/\s*,\s*/) // separate comma-delimited selectors ...
        .map((ssel) => [ // ... and give each one its own copy of the associated properties
            ssel.trim(),
            Object.fromEntries(block.split(/;/) // separate 'property: value' lines
                .map((propVal) => (propVal || "").trim().split(/:/)) // separate 'property' and 'value' into key/val
                .filter(([prop, val]) => prop && val) // filter out null values
                .map(([prop, val]) => [prop.trim(), val.trim().replace(/\^/g, ":")])) // restore colons to urls
        ])).flat()); // flatten duplicated selectors (from comma-delimiting) into main array of [key, val] entries for object creation
// #endregion ░░░░[STYLES]░░░░

// #region ░░░░░░░[PARSING]░░░░ Parsing Style Data to Inline CSS ░░░░░░

// #region ========== Parsing Functions: Functions for Parsing to Inline CSS ===========
const getStyles = (tag, classes = []) => {
    classes = [classes].flat();

    // Apply general tag styles
    const styleData = {...(CSS[tag] || {})};

    // Locate styles for exact class references
    classes.forEach((classRef) => Object.assign(styleData, CSS[`.${classRef}`] || {}));

    // Overwrite with more-specific combination references
    Object.keys(CSS).filter((classRef) => /^\..*\./.test(classRef)
                                                  && classRef.split(/\./gu)
                                                      .filter((className) => Boolean((className || "").trim()))
                                                      .map((className) => className.replace(/^\./u, ""))
                                                      .every((className) => classes.includes(className)))
        .forEach((classRef) => Object.assign(styleData, CSS[classRef]));

    // Now, repeat for more-specific references that begin with the element's tag
    const tagClassRefs = Object.keys(CSS).filter((classRef) => classRef.startsWith(`${tag.toLowerCase()}.`));
    tagClassRefs.filter((classRef) => classes.includes(classRef.replace(new RegExp(`^${tag.toLowerCase()}\.`), "")))
        .forEach((classRef) => Object.assign(styleData, CSS[classRef]));

    // Finally, repeat for more-specific combo references that begin with the element's tag
    tagClassRefs.filter((classRef) => classRef.replace(new RegExp(`^${tag.toLowerCase()}\.`), "").split(/\./gu).every((className) => classes.includes(className)))
        .forEach((classRef) => Object.assign(styleData, CSS[classRef]));

    return Object.fromEntries(Object.entries(styleData).filter(([propName, propVal]) => propVal !== null));
};
const parseInlineStyles = (tag, classes = [], styles = {}) => Object.entries({...getStyles(tag, classes), ...styles}).map(([propName, propVal]) => `${propName}: ${propVal};` ).join(" ");
const Tag = (content, tag, classes = [], styles = {}, attributes = {}) => {
    if (tag in CSS || Object.values(styles).length || Object.values(getStyles(tag, classes)).length) {
        Object.assign(attributes, {style: parseInlineStyles(tag, classes, styles)});
    }
    const tagHTML = [
        `<${tag.toLowerCase()} `,
        Object.entries(attributes).map(([attrName, attrVal]) => `${attrName}="${attrVal}"` ).join(" "),
        ">"
    ];
    if (content !== false) {
        content = [content].flat().filter((part) => part);
        if (content.length === 0) {
            content.push("&nbsp;");
        }
        tagHTML.push(...content);
        tagHTML.push(`</${tag.toLowerCase()}>`);
    }
    return tagHTML.join("")
        .replace(/\\~/gu, "@@tilde@@") // Protect escaped tildes
        .replace(/~/gu, "&shy;"); // Turn unescaped tildes into soft hyphen breaks
};
// #endregion _______ Parsing Functions _______

// #region ========== Elements: Basic Element Constructors by Tag ===========
const Div = (content, classes = [], styles = {}, attributes = {}) => Tag(content, "div", classes, styles, attributes);
const Span = (content, classes = [], styles = {}, attributes = {}) => Tag(content, "span", classes, styles, attributes);
const P = (content, classes = [], styles = {}, attributes = {}) => Tag(content, "p", classes, styles, attributes);
const Img = (content, classes = [], styles = {}, attributes = {}) => Tag(false, "img", classes, styles, attributes);
const A = (content, classes = [], styles = {}, attributes = {}) => Tag(content, "a", classes, styles, attributes);
const Pre = (content, classes = [], styles = {}, attributes = {}) => Tag(content, "pre", classes, styles, attributes);
const H1 = (content, classes = [], styles = {}, attributes = {}) => Tag(content, "h1", classes, styles, attributes);
const H2 = (content, classes = [], styles = {}, attributes = {}) => Tag(content, "h2", classes, styles, attributes);
const H3 = (content, classes = [], styles = {}, attributes = {}) => Tag(content, "h3", classes, styles, attributes);
// #endregion _______ Elements _______

// #endregion ░░░░[PARSING]░░░░

// #region ░░░░░░░[CUSTOM ELEMENTS]░░░░ Shorthand Element Constructors for Common Use Cases ░░░░░░
const Box = (content, styles) => Div(content, ["box"], styles);
const Block = (content, styles) => Div(content, ["block"], styles);
const Paras = (content) => [content].flat().map((para) => P(para)).join("");
const Spacer = (height) => Div("&nbsp;", ["spacer"], {height: `${height}px`.replace(/pxpx$/u, "px")});
const ButtonH1 = (command, content, classes = [], styles = {}, attributes = {}) => H1(A(content, ["button"], {}, {href: command}), ["button", ...classes], styles, attributes);
const ButtonH2 = (command, content, classes = [], styles = {}, attributes = {}) => H1(A(content, ["button"], {}, {href: command}), ["button", ...classes], styles, attributes);
const ButtonH3 = (command, content, classes = [], styles = {}, attributes = {}) => H1(A(content, ["button"], {}, {href: command}), ["button", ...classes], styles, attributes);
const Footer = (content, classes = [], styles = {}, attributes = {}) => Div(content || "&nbsp;", ["footer", ...classes], styles, attributes);
const ButtonFooter = (command, content, classes = [], styles = {}, attributes = {}) => Footer(A(content || "&nbsp;", ["button"], {}, {href: command}), classes, styles, attributes);
const Command = (command, classes = [], styles = {}, attributes = {}) => Span(command, ["commandHighlight", ...classes], styles, attributes);
const ButtonCommand = (command, classes = [], styles = {}, attributes = {}) => Command(A(command, ["button"], {}, {href: command}), ["shiftLeft", ...classes], styles, attributes);
const ButtonRound = (command, classes = [], styles = {}, attributes = {}) => Span(A("&nbsp;", ["button"], {}, {href: command}), ["buttonRound", ...classes], styles, attributes);
// #endregion ░░░░[CUSTOM ELEMENTS]░░░░

const exampleHTMLMessage = Box([
    Span(null, ["title", "main"]),
    Block([
        ButtonRound("https://github.com/Eunomiac/EunosRoll20Scripts/releases", ["download"], {margin: "0 5px 20px 5px"}, {title: "Download the most recent version."}),
        ButtonRound("https://app.roll20.net/forum/permalink/10184021/", ["chat"], {margin: "0 5px 8px 5px"}, {title: "Join the discussion in the Roll20 forum thread."}),
        ButtonRound("https://github.com/Eunomiac/EunosRoll20Scripts/issues", ["bug"], {margin: "0 5px 20px 5px"}, {title: "Report bugs, make suggestions and track issues."})
    ], {"text-align": "center", "margin": "-10px 0 -15px 0"}),
    Block([
        Paras([
            "<b><u>Euno~miac's Roll20 Scripts</u></b> is a col~lec~tion of stand-alone scripts, each in~tended to pro~vide com~pre~hen~sive con~trol over a par~tic~u~lar as~pect of the Roll20 VTT. You can learn more about each of the avail~able scripts be~low.",
            "Keep ap~prised of new fea~tures, fixes and fu~ture plans as dev~elop~ment pro~ceeds through al~pha by vis~it~ing the links above."
        ]),
        H2("General Chat Commands"),
        Spacer(5),
        Paras([
            [ButtonCommand("!euno", ["shiftLeft"]), " — View this help mes~sage."]
        ]),
        Spacer(5),
        H2("Available Scripts"),
        Paras("Click the but~tons be~low to learn more about each of <b><u>Euno~miac's Roll20 Scripts</u></b>, all of which are in vary~ing sta~ges of de~vel~op~ment:"),
        ButtonH1("!etc", "!ETC", ["tight"], {}, {title: "Eunomiac's Text Controls: A comprehensive solution to managing Roll20 text objects."}),
        ButtonH1("!egc", "!EGC", ["tight", "fade50"], {}, {title: "Eunomiac's Grab Controls: Create buttons and switches in the sandbox for your players to interact wit"}),
        ButtonH1("!ehc", "!EHC", ["tight", "fade50"], {}, {title: "Eunomiac's HTML Controls: Create handouts and character bios using full HTML & CSS."}),
        Spacer(5),
        H2("Configuration"),
        P("Con~fig~u~ra~tion op~tions for every script in <b><u>Euno~miac's Roll20 Scripts</u></b> col~lec~tion is con~tained in 'EunoCONFIG.js', which you'll find in the API Scripts sec~tion of your game page. Fur~ther in~struc~tions on how to con~fig~ure the scripts to your lik~ing are lo~cated there."),
        Spacer(5),
        P(`To pre~vent this mes~sage from dis~play~ing at start~up, click the chev~ron be~low. <i>(View this mes~sage at any time via the ${Command("!euno")} command.)</i>`)
    ]),
    ButtonFooter("!euno toggle intro", "", ["hideIntro"])
]);

sendChat("CSS Parser", `/w gm ${exampleHTMLMessage}`);