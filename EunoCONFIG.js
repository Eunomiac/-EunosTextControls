void MarkStart("EunoCONFIG");
/******▌████████████████████████████████████████████████████████████▐******\
|*     ▌██▓▒░ EunoCONFIG: Customization of EunosRoll20Scripts ░▒▓███▐     *|
|*     ▌████████████████████████████████████████████████████████████▐     *|
|*     ▌█████████████████████▓▒░ v0.13-alpha ░▒▓████████████████████▐     *|
|*     ▌████████████████████▓▒░ June 25, 2021 ░▒▓███████████████████▐     *|
|*     ▌███▓▒░ https://github.com/Eunomiac/EunosRoll20Scripts ░▒▓███▐     *|
\******▌████████████████████████████████████████████████████████████▐******/

const EunoCONFIG = {
    GLOBAL: { // ████[GLOBAL]██▓▒░ Settings Applicable to All Scripts ░▒▓████████

        INACTIVELAYER: "walls" /** The layer to send sandbox objects to when they are toggled off.
                                *    - Unless you use dynamic lighting, 'walls' is unused and thus makes a good storage space.
                                *    - If you do use dynamic lighting, change this setting to 'gmlayer' and reduce your GM Layer
                                *      opacity to zero. */

    },
    ETC: { //    ████[!ETC]██▓▒░ Settings for !ETC: Euno's Text Controls ░▒▓█████

        DropShadows: { // ░▒▓█[ETC: Drop Shadows]█▓▒░ Configure Text Drop Shadows ░░░░░░

            /** IMPORTANT: Run '!etc shadow fix' to update sandbox objects after changing any of these settings. */

            COLOR: "black", /** The color of the text shadows.
                              *   - Accepts any CSS-valid single-color value (e.g. color name, hex code, rgb/a)
                              *   - If you want some transparency to your shadows, use an rgba() color definition (e.g. 'rgba(0, 0, 0, 0.75)'
                              *     for a black shadow that is only 75% opaque). */

            LAYER: "map", /** The layer on which to place the text shadow objects.
                            *   - Assigning shadows to the map layer keeps them from interfering with selecting things on the objects layer.
                            *   - Assigning shadows to the same layer as their master objects is possible and will work, though it's a bit
                            *     more tedious to work on your sandbox if you have to constantly avoid selecting shadow objects */

            OFFSETS: {/** The number of pixels to offset each text shadow from the position of its master text object.
                        *   - If any shadows appear too close or too far from their master objects for a specific font and/or size, these
                        *     are the values you want to change.
                        *   - When passing arrays, the first number is the horizontal (x) shift RIGHT, the second is the vertical (y) shift DOWN.
                        *     When passing single numbers, the value applies to both axes */

                /** ▓▓ OFFSET DEFAULT MULTIPLIER ▓▓
                 *  The default offset multiplier is used for all text objects, unless overridden (see below).
                 *  This value is multiplied by the font size to derive the pixel offset of the shadow beneath, along both axes.
                 *    - Changing these values will affect all text objects that do not have specific overrides set. */

                defaultMults: [0.08, 0.08],

                /** ▓▓ OFFSET OVERRIDES ▓▓
                 *  You can correct the offsets for specific font and size combinations in one of two ways: by applying a scaling multiplier to
                 *  the default offsets derived from the multipliers above, or by replacing specific offsets directly.
                 *    - If both methods are used for the same font/size combination, the multiplier will be applied FIRST (i.e.
                 *      the override value will be applied as-is, without multiplication) */

                /**  ░░ OVERRIDES: APPLY SCALING MULTIPLIER ░░
                 *  You can apply a multiplier to the full set of default offsets, scaling them for an entire font family, by assigning a number
                 *  to the entire font family.
                 *    - Unlike the default multipliers above, these scale the default shadow offsets directly (i.e. '0.5' will result in the default offset
                 *      being halved).
                 *    - You can apply different multipliers to the horizontal and vertical by passing an array */

                multipliers: {
                    "Shadows Into Light": 0.5,
                    Arial: 0.6,
                    "Patrick Hand": 0.75,
                    Tahoma: 0.75,
                    Rye: 0.5,
                    "IM Fell DW Pica": 0.5,
                    Nunito: 0.75,
                    Montserrat: 0.5,
                    Merriweather: 0.6,
                    "Della Respira": 0.4,
                    "Crimson Text": 0.4,
                    "Kaushan Script": [0.4, 0.4]
                },

                /** ░░ OVERRIDES: DIRECT REPLACEMENT ░░
                 *  Alternatively, you can define specific offsets, measured in pixels, for any font/size combination.
                 *    - The default/scaled offsets will be used for any sizes you don't include.
                 *    - These values must be passed as arrays, even if the x- and y- offsets are the same. */

                overrides: {
                    "Contrail One": {
                        56: [3, 3],
                        72: [5, 5],
                        100: [6, 6],
                        200: [12, 12]
                    }
                }
            }
        }
    }
};
EunoCONFIG.ETC.DropShadows.OFFSETS.generic = Object.fromEntries([8, 10, 12, 14, 16, 18, 20, 22, 26, 32, 40, 56, 72, 100, 200, 300].map((size) => [
    size,
    EunoCONFIG.ETC.DropShadows.OFFSETS.defaultMults.map((mult) => size * mult)
]));
void MarkStop("EunoCONFIG");