const GetType = (val) => {
    const TYPES = [
        "id", "hex", "hexa", "rgb", "rgba", "hsl", "hsla",
        "int", "float",
        "array", "list",
        "boolean", "null", "undefined",
        "function",
        "date", "regexp",
        "graphic", "token", "animation", "card",
        "character", "text", "path", "jukeboxtrack", "handout", "page", "campaign", "player",
        "string" // only if none of the above match
    ];
    const valType = Object.prototype.toString.call(val).slice(8, -1).toLowerCase().trim();
    switch (valType) {
        case "string": return (Object.entries({
            hex: /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/,
            hexa: /^#[A-Fa-f0-9]{8}$/,
            rgb: /^rgb\((\s*\d{1,3}[,\s)]){3}$/,
            rgba: /^rgba\((\s*\d{1,3}[,\s)]){3}(\s*[\d\.]+[,\s)])$/,
            hsl: /^hsl\((\s*[\d\.%]+[,\s)]){3}$/,
            hsla: /^hsla\((\s*[\d\.%]+[,\s)]){3}(\s*[\d\.]+[,\s)])$/,
            int: /^(-|\+)?[\d,]+$/,
            float: /^(-|\+|\d)[\d,\s]*\.[\d\s]*$/,
            id: /^-[a-zA-Z0-9_-]{19}$/
        }).find(([type, pattern]) => pattern.test(val.trim())) || ["string"]).shift();
        case "number": return /\./u.test(`${val}`) ? "float" : "int";
        // no default
    }
    return valType;
};
const UCase = (val) => `${val || ""}`.toUpperCase(); // "Safe" toUpperCase()
const LCase = (val) => `${val || ""}`.toLowerCase(); // "Safe" toLowerCase()
const SCase = (val) => { // Converts to sentence case, retaining interior uppercase letters UNLESS all uppercase
    val = `${val || ""}`;
    if (/[^a-z]/u.test(val)) { val = LCase(val) }
    return `${UCase(val.charAt(0))}${(val).slice(1)}`;
};
const TCase = (val) => SCase(val) // Converts to title case
    .split(/ /gu)
    .map((subStr) => `${UCase(subStr.charAt(0))}${(/[^a-z]/u.test(subStr) ? LCase(subStr) : subStr).slice(1)}`)
    .join(" ");
const Ext = (qStr, qRegExp) => {
    const isGrouping = /[)(]/.test(qRegExp.toString());
    const matches = qStr.match(new RegExp(qRegExp)) || [];
    if (isGrouping) {
        return matches.slice(1);
    }
    return matches.pop();
};
const NumToString = (num) => {
    // Can take string representations of numbers, either in standard or scientific/engineering notation.
    // Returns a string representation of the number in standard notation, (almost) regardless of size.
    if (Float(num) === 0) { return "0" }
    num = LCase(num).replace(/[^\d.e+-]/g, "");
    const base = Ext(num, /^-?[\d.]+/);
    const exp = Int(Ext(num, /e([+-]?\d+)$/).pop());
    const baseInts = Ext(base, /^-?(\d+)/).pop().replace(/^0+/, "");
    const baseDecs = LCase(Ext(base, /\.(\d+)/).pop()).replace(/0+$/, "");

    const numFinalInts = Math.max(0, baseInts.length + exp);
    const numFinalDecs = Math.max(0, baseDecs.length - exp);

    const finalInts = [baseInts.slice(0, numFinalInts), baseDecs.slice(0, Math.max(0, exp))].join("") || "0";
    const finalDecs = [
        (baseInts.length - numFinalInts) <= 0 ? "" : baseInts.slice(baseInts.length - numFinalInts - 1),
        baseDecs.slice(baseDecs.length - numFinalDecs)
    ].join("");

    return [
        num.charAt(0) === "-" ? "-" : "",
        finalInts,
        "0".repeat(Math.max(0, numFinalInts - finalInts.length)),
        finalDecs.length ? "." : "",
        "0".repeat(Math.max(0, numFinalDecs - finalDecs.length)),
        finalDecs
    ].join("");
};
const N = {
    [302.02]: true
};
const C = {
    NUMBERWORDS: {
        /* ones: [
            "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve",
            "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"
        ],
        tens: ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"],
        thousands: [
            "", "thousand", "mi-", "bi-", "tri-", "quadri-", "quinti-", "sexti-", "septi-", "octi-", "noni-",
            "deci-", "undeci-", "duodeci-", "tredeci-", "quattuordeci-", "quindeci-", "sexdeci-", "septendeci-", "octodeci-", "novemdeci-",
            "viginti-", "unviginti-", "duoviginti-", "treviginti-", "quattuorviginti-", "quinviginti-", "sexviginti-", "septenviginti-", "octoviginti-", "novemviginti-",
            "triginti-", "untriginti-", "duotriginti-", "tretriginti-", "quattuortriginti-"
        ].map((prefix) => prefix.replace(/-$/u, "llion")) */
        ones: [
            "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve",
            "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"
        ],
        tens: ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"],
        tiers: ["", "thousand", "m-", "b-", "tr-", "quadr-", "quint-", "sext-", "sept-", "oct-", "non-"]
            .map((prefix) => prefix.replace(/-$/, "illion")),
        bigPrefixes: ["", "un", "duo", "tre", "quattuor", "quin", "sex", "octo", "novem"],
        bigSuffixes: ["", "dec-", "vigint-", "trigint-", "quadragint-", "quinquagint-", "sexagint-", "septuagint-", "octogint-", "nonagint-", "cent-"]
            .map((prefix) => prefix.replace(/-$/, "illion"))
    },
    ORDINALS: {
        zero: "zeroeth",
        one: "first",
        two: "second",
        three: "third",
        four: "fourth",
        five: "fifth",
        eight: "eighth",
        nine: "ninth",
        twelve: "twelfth",
        twenty: "twentieth",
        thirty: "thirtieth",
        forty: "fortieth",
        fifty: "fiftieth",
        sixty: "sixtieth",
        seventy: "seventieth",
        eighty: "eightieth",
        ninety: "ninetieth"
    },
    ROMANNUMERALS: {
        grouped: [
            ["", "Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ", "Ⅵ", "Ⅶ", "Ⅷ", "Ⅸ"],
            ["", "Ⅹ", "ⅩⅩ", "ⅩⅩⅩ", "ⅩⅬ", "Ⅼ", "ⅬⅩ", "ⅬⅩⅩ", "ⅬⅩⅩⅩ", "ⅩⅭ"],
            ["", "Ⅽ", "ⅭⅭ", "ⅭⅭⅭ", "ⅭⅮ", "Ⅾ", "ⅮⅭ", "ⅮⅭⅭ", "ⅮⅭⅭⅭ", "ⅭⅯ"],
            ["", "Ⅿ", "ⅯⅯ", "ⅯⅯⅯ", "Ⅿↁ", "ↁ", "ↁⅯ", "ↁⅯⅯ", "ↁⅯⅯⅯ", "ↁↂ"],
            ["", "ↂ", "ↂↂ", "ↂↂↂ", "ↂↇ", "ↇ", "ↇↂ", "ↇↂↂ", "ↇↂↂↂ", "ↇↈ"],
            ["", "ↈ", "ↈↈ", "ↈↈↈ"]
        ],
        ungrouped: [
            ["", "Ⅰ", "ⅠⅠ", "ⅠⅠⅠ", "ⅠⅤ", "Ⅴ", "ⅤⅠ", "ⅤⅠⅠ", "ⅤⅠⅠⅠ", "ⅠⅩ"],
            ["", "Ⅹ", "ⅩⅩ", "ⅩⅩⅩ", "ⅩⅬ", "Ⅼ", "ⅬⅩ", "ⅬⅩⅩ", "ⅬⅩⅩⅩ", "ⅩⅭ"],
            ["", "Ⅽ", "ⅭⅭ", "ⅭⅭⅭ", "ⅭⅮ", "Ⅾ", "ⅮⅭ", "ⅮⅭⅭ", "ⅮⅭⅭⅭ", "ⅭⅯ"],
            ["", "Ⅿ", "ⅯⅯ", "ⅯⅯⅯ", "Ⅿↁ", "ↁ", "ↁⅯ", "ↁⅯⅯ", "ↁⅯⅯⅯ", "ↁↂ"],
            ["", "ↂ", "ↂↂ", "ↂↂↂ", "ↂↇ", "ↇ", "ↇↂ", "ↇↂↂ", "ↇↂↂↂ", "ↇↈ"],
            ["", "ↈ", "ↈↈ", "ↈↈↈ"]
        ]
    }
};


// // #region ████████ LAYOUT: Styles Controlling Positioning & Size ████████
// `
// `,
// // #endregion ▄▄▄▄▄▄▄▄ LAYOUT ▄▄▄▄▄▄▄▄
// /* #region POSITIONING & LAYOUT */
// /* #region POSITIONING & LAYOUT:  */
// `   div {
//         display: block;
//         height: auto;
//         width: auto;
//         margin: 0;
//         padding: 0;
//     }
//     div.box {
//         width: ${cssVars.boxPosition.width}px;
//         margin: ${Object.values(cssVars.boxPosition.shifts).map((shift) => `${shift}px`).join(" ")};
//     }
//     div.block {
//         padding: 0 ${cssVars.paddingWidth}px;
//     }

//     h1, h2 {margin: ${cssVars.halfSpace}px 0}
//     h3, img, p {margin: ${cssVars.qartSpace}px 0}

// }
// `,
// /* #endregion POSITIONING & LAYOUT */
// /* #region FORMATTING & STYLING */
// `   .box {
//         color: ${C.COLORS.palegold};
//     }
//     .box.silver {
//         color: ${C.COLORS.palesilver};
//     }
//     .box.bronze: {
//         color: ${C.COLORS.palebronze};
//     }

//     .block {
//         color: inherit;
//         font-size: inherit;
//         font-weight: inherit;

//     }


// div {
//     display: block;
//     height: auto; width: auto;
//     margin: 0;
//     padding: 0;
//     color: inherit;
//     font-size: inh

// }
// `,
// /* #endregion FORMATTING & STYLING */

const Float = (qNum) => parseFloat(qNum) || 0;
const Int = (qNum) => parseInt(Math.round(Float(qNum)));
const RoundNum = (qNum, numDecDigits = 0) => {
    if (Float(qNum) === Int(qNum)) { return Int(qNum) }
    return Math.round(Float(qNum) * 10 ** Int(numDecDigits)) / 10 ** Int(numDecDigits);
};
const NumToRoman = (num, isUsingGroupedChars = true) => {
    num = Int(num);
    if (num > 399999) { throw `[Euno] Error: Can't Romanize '${num}' (>= 400,000)` }
    if (num <= 0) { throw `[Euno] Error: Can't Romanize '${num}' (<= 0)` }
    const romanRef = C.ROMANNUMERALS[isUsingGroupedChars ? "grouped" : "ungrouped"];
    const romanNum = `${num}`
        .split("")
        .reverse()
        .map((digit, i) => romanRef[i][Int(digit)])
        .reverse()
        .join("");
    return isUsingGroupedChars
        ? romanNum.replace(/ⅩⅠ/gu, "Ⅺ").replace(/ⅩⅡ/gu, "Ⅻ")
        : romanNum;
};

const NumToWords = (num) => {
    num = NumToString(num);
    const getTier = (trioNum) => {
        if (trioNum < C.NUMBERWORDS.tiers.length) { return C.NUMBERWORDS.tiers[trioNum] }
        return `${C.NUMBERWORDS.bigPrefixes[trioNum % 10 - 1]}${C.NUMBERWORDS.bigSuffixes[Math.floor(trioNum/10)]}`;
    };
    const parseThreeDigits = (trio, tierNum) => { // three hundred and eight-two
        if (Int(trio) === 0) { return "" }
        const digits = `${trio}`.split("").map((digit) => Int(digit));
        let result = "";
        if (digits.length === 3) {
            const hundreds = digits.shift();
            result += hundreds > 0 ? `${C.NUMBERWORDS.ones[hundreds]} hundred` : "";
            if (hundreds && (digits[0] || digits[1])) {
                result += " and ";
            }
        }
        if (Int(digits.join("")) <= C.NUMBERWORDS.ones.length) {
            result += C.NUMBERWORDS.ones[Int(digits.join(""))];
        } else {
            result += C.NUMBERWORDS.tens[Int(digits.shift())] + (Int(digits[0]) > 0 ? `-${C.NUMBERWORDS.ones[Int(digits[0])]}` : "");
        }
        return result;
    };
    const numWords = [];
    if (num.charAt(0) === "-") {
        numWords.push("negative");
    }
    const [integers, decimals] = num.replace(/[,|\s|-]/gu, "").split(".");
    const intArray = integers.split("")
        .reverse()
        .join("")
        .match(/.{1,3}/g)
        .map((v) => v.split("").reverse().join(""));
    const intStrings = [];
    while (intArray.length) {
        const theseWords = parseThreeDigits(intArray.pop());
        if (theseWords) {
            intStrings.push(`${theseWords} ${getTier(intArray.length)}`);
        }
    }
    numWords.push(intStrings.join(", ").trim());
    if (GetType(decimals) === "int") {
        if (integers === "0") {
            numWords.push("zero");
        }
        numWords.push("point");
        for (const digit of decimals.split("")) {
            numWords.push(C.NUMBERWORDS.ones[Int(digit)]);
        }
    }
    return numWords.join(" ");
};
const  NumToOrdinal = (num, isReturningWords = false) => {
    if (isReturningWords) {
        const [numText, suffix] = LCase(NumToWords(num)).match(/.*?[-|\s]?(\w*?)$/);
        return numText.replace(new RegExp(`${suffix}$`), C.ORDINALS[suffix] || `${suffix}th`);
    }
    const tNum = Int(num) - 100 * Math.floor(Int(num) / 100);
    if (/\.|1[1-3]$/.test(`${num}`)) {
        return `${num}th`;
    }
    return `${num}${["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"][Int(`${num}`.charAt(`${num}`.length - 1))]}`;
};
const Interpolate = (p1, p2, q) => {
    const [p1X, p1Y, p2X, p2Y] = [...p1, ...p2].map((num) => Float(num));
    if (["int", "float"].includes(GetType(q[0]))) {
        q[0] = Float(q[0]);
        return RoundNum(((p2Y - p1Y)/(p2X - p1X))*(q[0] - p1X) + p1Y, 2);
    } else if (["int", "float"].includes(GetType(q[1]))) {
        q[0] = Float(q[0]);
        return RoundNum(((p2X - p1X)/(p2Y - p1Y))*(q[1] - p1Y) + p1X, 2);
    }
    return false;
};

const testCases = [
    [13231, 2432, 12, 84332, 331911, 459, 10, 224123],
    ["400", "-343.51", "2.42726247118967E+30", "6.34785629656473754E+102", "3.03143376857184E-62"],
    ["-63478562965647375434785624596564737543478562965647375434785629656473754347856296564737543478562965647354.4532E+2", "-63478562965647375434785624596564737543478562965647375434785629656473754347856296564737543478562965647354.4532"],
    [0, ...[3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 45, 63, 75, 93, 105, 123, 135].map((exp) => `1E+${exp}`)]
];
const interTestCases = [
    [[1, 1], [5, 5], [false, 3]],
    [[2, 2], [5, 5], [false, 3]],
    [[1, 3], [5, 500], [3, false]],
    [[-2, 1], [5, 5], [false, 3]]
];

console.log(interTestCases.map((points) => Interpolate(...points)));

