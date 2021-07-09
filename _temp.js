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

const C = {
    NUMBERWORDS: {
        ones: [
            "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve",
            "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen", "Twenty"
        ],
        tens: ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"],
        thousands: [
            "", "Thousand", "Mi-", "Bi-", "Tri-", "Quadri-", "Quinti-", "Sexti-", "Septi-", "Octi-", "Noni-",
            "Deci-", "Undeci-", "Duodeci-", "Tredeci-", "Quattuordeci-", "Quindeci-", "Sexdeci-", "Septendeci-", "Octodeci-", "Novemdeci-",
            "Viginti-", "Unviginti-", "Duoviginti-", "Treviginti-", "Quattuorviginti-", "Quinviginti-", "Sexviginti-", "Septenviginti-", "Octoviginti-", "Novemviginti-",
            "Triginti-", "Untriginti-", "Duotriginti-", "Tretriginti-", "Quattuortriginti-"
        ].map((prefix) => prefix.replace(/-$/u, "llion"))
    },
    ORDINALS: {
        zero: "Zeroeth",
        one: "First",
        two: "Second",
        three: "Third",
        four: "Fourth",
        five: "Fifth",
        eight: "Eighth",
        nine: "Ninth",
        twelve: "Twelfth",
        twenty: "Twentieth",
        thirty: "Thirtieth",
        forty: "Fortieth",
        fifty: "Fiftieth",
        sixty: "Sixtieth",
        seventy: "Seventieth",
        eighty: "Eightieth",
        ninety: "Ninetieth"
    },
    ROMANNUMERALS: {
        grouped: [
            ["", "Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ", "Ⅵ", "Ⅶ", "Ⅷ", "Ⅸ"],
            ["", "Ⅹ", "ⅩⅩ", "ⅩⅩⅩ", "ⅩⅬ", "Ⅼ", "ⅬⅩ", "ⅬⅩⅩ", "ⅬⅩⅩⅩ", "ⅩⅭ"],
            ["", "Ⅽ", "ⅭⅭ", "ⅭⅭⅭ", "ⅭⅮ", "Ⅾ", "ⅮⅭ", "ⅮⅭⅭ", "ⅮⅭⅭⅭ", "ⅭⅯ"],
            ["", "Ⅿ", "ⅯⅯ", "ⅯⅯⅯ", "ⅯⅯⅯⅯ", "ⅯⅯⅯⅯⅯ", "ⅯⅯⅯⅯⅯⅯ", "ⅯⅯⅯⅯⅯⅯⅯ", "ⅯⅯⅯⅯⅯⅯⅯⅯ", "ⅯⅯⅯⅯⅯⅯⅯⅯⅯ"]
        ],
        ungrouped: [
            ["", "Ⅰ", "ⅠⅠ", "ⅠⅠⅠ", "ⅠⅤ", "Ⅴ", "ⅤⅠ", "ⅤⅠⅠ", "ⅤⅠⅠⅠ", "ⅠⅩ"],
            ["", "Ⅹ", "ⅩⅩ", "ⅩⅩⅩ", "ⅩⅬ", "Ⅼ", "ⅬⅩ", "ⅬⅩⅩ", "ⅬⅩⅩⅩ", "ⅩⅭ"],
            ["", "Ⅽ", "ⅭⅭ", "ⅭⅭⅭ", "ⅭⅮ", "Ⅾ", "ⅮⅭ", "ⅮⅭⅭ", "ⅮⅭⅭⅭ", "ⅭⅯ"],
            ["", "Ⅿ", "ⅯⅯ", "ⅯⅯⅯ", "ⅯⅯⅯⅯ", "ⅯⅯⅯⅯⅯ", "ⅯⅯⅯⅯⅯⅯ", "ⅯⅯⅯⅯⅯⅯⅯ", "ⅯⅯⅯⅯⅯⅯⅯⅯ", "ⅯⅯⅯⅯⅯⅯⅯⅯⅯ"]
        ]
    }
};

const Float = (qNum) => parseFloat(qNum) || 0;
const Int = (qNum) => parseInt(Math.round(Float(qNum)));

const NumToRoman = (num, isUsingGroupedChars = true) => {
    num = Int(num);
    if (num > 9999) { throw `[Euno] Error: Can't Romanize '${num}' (> 9999)` }
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
    num = `${Float(num)}`;
    const parseThreeDigits = (trio) => {
        const digits = `${trio}`.split("").map((digit) => Int(digit));
        let result = "";
        if (digits.length === 3) {
            const hundreds = digits.shift();
            result += hundreds > 0 ? `${C.NUMBERWORDS.ones[hundreds]} hundred` : "";
            if (digits[0] + digits[1] > 0) {
                result += " and ";
            } else {
                return result;
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
        intStrings.push(`${parseThreeDigits(intArray.pop())} ${C.NUMBERWORDS.thousands[intArray.length]}`);
    }
    numWords.push(intStrings.join(", ").trim());
    if (GetType(decimals) === "int") {
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

console.log([
    13, 2432, 12, 142, 11, 459, 10, 999.00012, 99999
].map((num) => [num, NumToOrdinal(num).toLowerCase()].join(": ")));

