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

        /** IMPORTANT: Run '!etc fix all' to update sandbox objects after changing any of these settings. */

        DropShadows: { // ░▒▓█[ETC: Drop Shadows]█▓▒░ Configure Text Drop Shadows ░░░░░░

            COLOR: "black", /** The color of the text shadows.
                              *   - Accepts any CSS-valid single-color value (e.g. color name, hex code, rgb/a)
                              *   - If you want some transparency to your shadows, use an rgba() color definition (e.g. 'rgba(0, 0, 0, 0.75)'
                              *     for a black shadow that is only 75% opaque). */

            LAYER: "map", /** The layer on which to place the text shadow objects.
                            *   - Assigning shadows to the map layer keeps them from interfering with selecting or moving master objects
                            *     on the objects layer, should you wish the master objects to be easily selectable. */

            OFFSETS: {/** The number of pixels to offset each text shadow from the position of its master text object.
                        *   - If any shadows appear too close or too far from their master objects for a specific font and/or size, these
                        *     are the values you want to change.
                        *   - The first number is the horizontal (x) shift, the second is the vertical (y) shift. */

                /** ▓▓ OFFSET DEFAULTS ▓▓
                 *  These default offsets are used for all text objects, unless overridden (see below).
                 *    - Changing these values will affect all text objects that do not have a specific override. */
                generic: {
                    8: [1, 1],
                    10: [2, 2],
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
                    200: [16, 16],
                    300: [16, 16]
                },

                /** ▓▓ OFFSET OVERRIDES ▓▓
                 *  You can correct the offsets for specific font and size combinations in one of two ways: by applying a multiplier to
                 *  the default offsets above, or by replacing specific offsets directly.
                 *    - You CANNOT use both methods for the same font family.
                 *    - Supported sandbox fonts are: "Arial", "Candal", "Contrail One", "Patrick Hand" and "Shadows Into Light" */

                /**  ░░ OVERRIDES: APPLY MULTIPLIER ▒▒
                 *  You can apply a multiplier to the full set of default offsets, scaling them for an entire font family, by defining a getter
                 *  and using the 'scaleOffsets()' function.
                 *    - You can apply a different multiplier to the horizontal and vertical offsets by passing an array (see e.g. 'Arial', below) */

                get "Shadows Into Light"() { return this.scaleOffsets(0.5) },
                get "Arial"() { return this.scaleOffsets([0.6, 0.6]) },
                get "Patrick Hand"() { return this.scaleOffsets(0.75) },
                get "Tahoma"() { return this.scaleOffsets(0.75) },
                get "Rye"() { return this.scaleOffsets(0.9) },
                get "IM Fell DW Pica"() { return this.scaleOffsets(0.75) },
                get "Nunito"() { return this.scaleOffsets(0.75) },
                get Montserrat() { return this.scaleOffsets(0.5) },
                get Merriweather() { return this.scaleOffsets(0.75) },
                get "Della Respira"() { return this.scaleOffsets(0.75) },
                get "Crimson Text"() { return this.scaleOffsets(0.75) },
                get "Kaushan Script"() { return this.scaleOffsets(0.8) },

                /** ░░ OVERRIDES: DIRECT REPLACEMENT ▒▒
                 *  Alternatively, you can define specific offsets for any font/size combination.
                 *    - The default offsets will be used for any sizes you don't include. */

                "Contrail One": {
                    56: [3, 3],
                    72: [5, 5],
                    100: [6, 6],
                    200: [12, 12]
                },

                // Scaling Function: 'scaleOffsets(mult)' or 'scaleOffsets([xMult, yMult])'
                scaleOffsets: (mult) => _.mapObject(this.generic, ([xOffset, yOffset]) => [
                    xOffset * [mult].flat()[0],
                    yOffset * ([mult].flat()[1] || [mult].flat()[0])
                ])
            }
        }
    }
};
void MarkStop("EunoCONFIG");