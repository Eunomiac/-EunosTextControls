void MarkStart("EunoCONFIG");
/******▌████████████████████████████████████████████████████████████▐******\
|*     ▌██▓▒░ EunoCONFIG: Customization of EunosRoll20Scripts ░▒▓███▐     *|
|*     ▌███████████████████v@@VERSION@@██@@DATE@@███████████████████▐     *|
|*     ▌███▓▒░ https://github.com/Eunomiac/EunosRoll20Scripts ░▒▓███▐     *|
\******▌████████████████████████████████████████████████████████████▐******/

const EunoCONFIG = {
    // ████[GLOBAL]██▓▒░ Settings Applicable to All Scripts ░▒▓████████
    GLOBAL: {

        /**
         * INACTIVELAYER: The layer to send sandbox objects to when they are toggled off.
         *     - Unless you use dynamic lighting, 'walls' is unused and thus makes a good storage space.
         *     - If you do use dynamic lighting, change this setting to 'gmlayer' and reduce your GM Layer
         *       opacity to zero.
         **/
        INACTIVELAYER: "walls"

    },
    // ████[!ETC]██▓▒░ Settings for !ETC: Euno's Text Controls ░▒▓█████
    ETC: {
        // ░▒▓█[ETC: Drop Shadows]█▓▒░ Configure Text Drop Shadows ░░░░
        DropShadows: {

            /* 🟥🟥IMPORTANT: Run '!etc shadow fix' to update sandbox objects after changing any of these settings. 🟥🟥 */

            /** 🔶COLOR🔶
             * The default color for text shadows.
             *   - Accepts any CSS-valid single-color value (e.g. color name, hex code, rgb/a).
             *   - If you want some transparency to your shadows, use an rgba() color definition,
             *       (e.g. 'rgba(0, 0, 0, 0.75)' for a black shadow that is only 75% opaque). */
            COLOR: "black",

            /** 🔶LAYER🔶
             * The default layer on which to place text shadow objects.
             *   - Assigning shadows to the map layer keeps them from interfering with selecting things on the objects layer.
             *   - Assigning shadows to the same layer as their master objects is possible and will work, though it's a bit
             *       more tedious to work on your sandbox if you have to constantly avoid selecting shadow objects. */
            LAYER: "map",

            /** 🔷OFFSETS🔷
             * These settings determine the distance shadows are positioned relative to their master text objects.
             *   - If any shadows appear too close or too far from their master objects for a specific font and/or size, these
             *       are the values you want to change.
             *   - Offsets can be configured along two axes: horizontally (positive = RIGHT) and vertically (positive = DOWN).
             *       - Single-Number Value: Applies to both axes equally (for a 45-degree offset).
             *       - Array of Two Values: Applies the first value to the horizontal axis, and the second to the vertical. */
            OFFSETS: {

                /** 🔶defaultMult🔶
                 *  The default offset multiplier for all text objects.
                 *    - This value is multiplied by the font size to derive the pixel offset of the shadow beneath, along both axes.
                 *    - Changing this value will affect all text objects that do not have specific overrides set.
                 *        - There are two ways to override these defaults: by applying a scaling multiplier to a whole font family,
                 *          or by setting exact pixel offsets for specific font/size combinations. Both methods are detailed below.
                 *        - If both methods are used for the same font and size, an explicit pixel offset will override any multipliers. */
                defaultMult: 0.08,

                /** 🔶multipliers🔶
                 *  Override the defaults with a multiplier that scales the offsets for an entire font family.
                 *    - These scale the default shadow offsets directly (e.g. '0.5' will result in the default offset being halved). */
                multipliers: {
                    "Shadows Into Light": 0.5,
                    "Arial": 0.6,
                    "Patrick Hand": 0.75,
                    "Tahoma": 0.75,
                    "Rye": 0.5,
                    "IM Fell DW Pica": 0.5,
                    "Nunito": 0.75,
                    "Montserrat": 0.5,
                    "Merriweather": 0.6,
                    "Della Respira": 0.4,
                    "Crimson Text": 0.4,
                    "Kaushan Script": 0.4
                },

                /** 🔶replacements🔶
                 *  Override the defaults by specifying the exact number of pixels to offset shadows for a specific font/size combination.
                 *    - These values must be passed as arrays, even if the x- and y- offsets are the same. */
                replacements: {
                    "Contrail One": {
                        56: [3, 3],
                        72: [5, 5],
                        100: [6, 6],
                        200: [12, 12]
                    }
                },

                get generic() {
                    return Object.fromEntries([8, 10, 12, 14, 16, 18, 20, 22, 26, 32, 40, 56, 72, 100, 200, 300].map((size) => {
                        const defaultMults = typeof EunoCONFIG.ETC.DropShadows.OFFSETS.defaultMult === "number"
                            ? [EunoCONFIG.ETC.DropShadows.OFFSETS.defaultMult, EunoCONFIG.ETC.DropShadows.OFFSETS.defaultMult]
                            : [EunoCONFIG.ETC.DropShadows.OFFSETS.defaultMult[0], EunoCONFIG.ETC.DropShadows.OFFSETS.defaultMult[1]];
                        return [size, defaultMults.map((mult) => size * mult)];
                    }));
                }
            }
        }
    }
};
void MarkStop("EunoCONFIG");