const HTML = {
    Box: (content, styles = {}, title = undefined) => `<div style="${U.Style(Object.assign({
        "display": "block",
        "width": "auto", "min-width": `${CHATWIDTH}px`,
        "height": "auto", "min-height": "39px",
        "margin": `${UPSHIFT}px 0 ${BOTTOMSHIFT}px ${LEFTSHIFT}px`,
        "padding": "0",
        "color": C.COLORS.palegold,
        "text-align": "center",
        "position": "relative",
        "text-shadow": "none", "box-shadow": "none", "border": "none",
        "background-image": `url('${C.GetImgURL("BG.jpg", "general")}')`,
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
        "background-image": `url('${C.GetImgURL("TOP.png", "general")}')`,
        "background-size": "cover",
        "font-weight": "normal",
        "border": "none", "box-shadow": "none", "text-shadow": "none"
    }, styles))}"${title ? ` title="${title}"` : ""}>${[content].flat().join("")}</div>`,
    Footer: (content, imgFileName = "BOTTOM.png", styles = {}, title = undefined) => `<div style="${U.Style(Object.assign({
        "display": "block",
        "height": "37px",
        "width": "auto",
        "margin": "6px 0 0 0",
        "background-image": `url('${C.GetImgURL(imgFileName, "general")}')`,
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
        "background-image": `url('${C.GetImgURL("CodeSpanBG.png")}')`,
        "padding": "0 7px 0 5px",
        "background-size": "100% 100%"
    }, styles))}"${title ? ` title="${title}"` : ""}>${[content].flat().join("")}</span>`,
    ButtonCodeSpan: (content, command, styles = {}, title = undefined) => HTML.CodeSpan(HTML.A(content, command || content, Object.assign({}, styles, {
        display: "inline-block",
        width: "auto",
        height: "auto",
        "padding": "0",
        "margin": "0",
        "background": "none",
        "border-radius": "none",
        "border": "none",
        "text-align": "inherit",
        "font-family": "inherit",
        "font-size": "inherit",
        "line-height": "inherit",
        "font-weight": "inherit",
        "text-transform": "inherit",
        "color": "inherit"
    })), styles, title),
    ButtonH: (content, command, level = 2, styles = {}, title = undefined) => HTML.H(HTML.A(content, command, Object.assign({}, styles, {
        "display": "block",
        "width": "100%",
        "height": "100%",
        "padding": "0",
        "margin": "0",
        "background": "none",
        "border-radius": "none",
        "border": "none",
        "text-align": "inherit",
        "font-family": "inherit",
        "font-size": "inherit",
        "line-height": "inherit",
        "font-weight": "inherit",
        "text-transform": "inherit",
        "color": "inherit"
    })), level, styles, title),
    ButtonFooter: (imgFileName, command, styles = {}, title = undefined) => HTML.Footer(HTML.A("", command, Object.assign({}, styles, {
        "display": "block",
        "width": "100%",
        "height": "100%",
        "padding": "0",
        "margin": "0",
        "background": "none",
        "border-radius": "none",
        "border": "none",
        "text-align": "inherit",
        "font-family": "inherit",
        "font-size": "inherit",
        "line-height": "inherit",
        "font-weight": "inherit",
        "text-transform": "inherit",
        "color": "inherit"
    })), imgFileName, styles, title),
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
            "background-image": `url('${C.GetImgURL(imgName, "button")}')`
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
            "background-image": `url('${C.GetImgURL("H1.png")}')`,
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

            "background-image": `url('${C.GetImgURL("H2.png")}')`,
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
            "background-image": `url('${C.GetImgURL("blackLeather_1.jpg", "texture")}')`,
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
            "background-image": `url('${C.GetImgURL("blackLeather_1.jpg", "texture")}')`,
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