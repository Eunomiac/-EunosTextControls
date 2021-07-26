void MarkStart("EunoCONFIG");
state = {};
/* ****▌████████████████████████████████████████████████████████████▐******\
|*     ▌██▓▒░ EunoCONFIG: Customization of EunosRoll20Scripts ░▒▓███▐     *|
|*     ▌███████████████████v@@VERSION@@██@@DATE@@███████████████████▐     *|
|*     ▌███▓▒░ https://github.com/Eunomiac/EunosRoll20Scripts ░▒▓███▐     *|
\* ****▌████████████████████████████████████████████████████████████▐******/

const EunoCONFIG = {
    GLOBAL: { // ████[GLOBAL]██▓▒░ Settings Applicable to All Scripts ░▒▓████████

        /* 🔶INACTIVELAYER🔶
         * The layer to send sandbox objects to when they are toggled off.
         *   - Unless you use dynamic lighting, 'walls' is unused and thus makes a good storage space.
         *   - If you do use dynamic lighting, change this setting to 'gmlayer' and reduce your GM Layer
         *       opacity to zero. */
        INACTIVELAYER: "walls"
    },
    ETC: { // ████[!ETC]██▓▒░ Settings for !ETC: Euno's Text Controls ░▒▓█████
        DropShadows: { // ░▒▓█[ETC: Drop Shadows]█▓▒░ Configure Text Drop Shadows ░░░░

            /* 🟥🟥IMPORTANT: Run '!etc shadow fix' to update sandbox objects after changing any of these settings. 🟥🟥 */

            /* 🔶SHADOWCOLOR, HIGHLIGHTCOLOR🔶
             * The default color for text shadow objects, and text highlight objects for bevelled text.
             *   - Accepts any CSS-valid single-color value (e.g. color name, hex code, rgb/a).
             *   - If you want some transparency to your shadows, use an rgba() color definition,
             *       (e.g. 'rgba(0, 0, 0, 0.75)' for a black shadow that is only 75% opaque). */
            SHADOWCOLOR: "black",
            HIGHLIGHTCOLOR: "white",

            /* 🔶LAYER🔶
             * The default layer on which to place text shadow objects.
             *   - Assigning shadows to the map layer keeps them from interfering with selecting things on the objects layer.
             *   - Assigning shadows to the same layer as their master objects is possible and will work, though it's a bit
             *       more tedious to work on your sandbox if you have to constantly avoid selecting shadow objects. */
            LAYER: "map",

            /* 🔷OFFSETS🔷
             * These settings determine the distance shadows are positioned relative to their master text objects.
             *   - If any shadows appear too close or too far from their master objects, these are the values you want to change.
             *   - Offsets can be configured along two axes: horizontally (positive = RIGHT) and vertically (positive = DOWN).
             *       - Single-Number Value: Applies to both axes equally (for a 45-degree offset).
             *       - Array of Two Values: Applies the first value to the horizontal axis, and the second to the vertical. */
            OFFSETS: {

                /* 🔶defaultMult🔶
                 *  The default offset multiplier for all text objects.
                 *    - This value is multiplied by the font size to derive the pixel offset of the shadow beneath, along both axes.
                 *    - Changing this value will affect all text objects that do not have specific overrides set.
                 *        - There are two ways to override these defaults: by applying a scaling multiplier to a whole font family,
                 *          or by setting exact pixel offsets for specific font/size combinations. Both methods are detailed below.
                 *        - If both methods are used for the same font and size, an explicit pixel offset will override any multipliers. */
                defaultMult: 0.08,

                /* 🔶globalLightSource🔶
                 *  The direction of the imaginary light source illuminating your text and casting your shadows. This determines the
                 *  direction of the shadow offset.
                 *    - This value must be an integer between 0 and 360, representing the angle of the light.
                 *      - Degrees begin with 0 at the top, advancing clockwise in a circle around your sandbox. Using a clock face to
                 *        illustrate: 0 degrees = 12 o'clock; 90 = 3 o'clock; 180 = 6 o'clock; 270 = 9 o'clock.
                 *        - None of those values will likely appeal to you, as they all result in strictly horizontal or vertical offsets
                 *          (e.g. 90 degrees places the light source directly right of your screen, to cast shadows straight left).
                 *    - 315 is the default, placing the light source between 10 and 11 o'clock, casting shadows down and to the right
                 *      at a 45 degree angle. */
                globalLightSource: 315,

                /* 🔶multipliers🔶
                 *  Override the defaults with a multiplier that scales the offsets for an entire font family.
                 *    - These scale the default shadow offsets directly (e.g. '0.5' will result in the default offset being halved).
                 *    - For reference, all fonts are included below: a multiplier of '1' results in the unmodified default offset */
                multipliers: {
                    "Anton": 1,
                    "Arial": 0.6,
                    "Candal": 1,
                    "Contrail One": 1,
                    "Crimson Text": 0.4,
                    "Della Respira": 0.4,
                    "Goblin One": 1,
                    "IM Fell DW Pica": 0.5,
                    "Kaushan Script": 0.4,
                    "Merriweather": 0.6,
                    "Montserrat": 0.5,
                    "Nunito": 0.5,
                    "Patrick Hand": 0.75,
                    "Rye": 0.5,
                    "Shadows Into Light": 0.5,
                    "Tahoma": 0.75
                },

                /* 🔶replacements🔶
                 *  Override the defaults by specifying the exact number of pixels to offset shadows for a specific font/size combination.
                 *    - These values must be passed as arrays, even if the x- and y- offsets are the same. */
                replacements: {
                    "Anton": {
                        /* Use this as a template for your overrides.
                        *   - Valid Sizes: 8, 10, 12, 14, 16, 18, 20, 22, 26, 32, 40, 56, 72, 100, 200, 300
                        *   - Any sizes you do not include will use the default (or multiplied, if a multiplier was specified) offset.
                        *   - Don't forget to remove the comment slashes ('//') at the start of any line you want active! */

                    // 56: [4, 4],
                    // 72: [6, 6],
                    // 100: [6, 6],
                    // 200: [12, 12]
                    },
                    "Arial": {

                    },
                    "Candal": {

                    },
                    "Contrail One": {

                    },
                    "Crimson Text": {

                    },
                    "Della Respira": {

                    },
                    "Goblin One": {

                    },
                    "IM Fell DW Pica": {

                    },
                    "Kaushan Script": {

                    },
                    "Merriweather": {

                    },
                    "Montserrat": {

                    },
                    "Nunito": {

                    },
                    "Patrick Hand": {

                    },
                    "Rye": {

                    },
                    "Shadows Into Light": {

                    },
                    "Tahoma": {

                    }
                }
            }
        }
    }
};
void MarkStop("EunoCONFIG");