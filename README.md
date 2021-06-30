![Eunomiac's Roll20 Scripts](https://repository-images.githubusercontent.com/379321510/662e8a00-d94c-11eb-89c0-21afb9c80764)

I've written a ton of scripts in my neverending quest to transform the Roll20 sandbox into a more interactive, more feature-packed virtual tabletop. I haven't seen many implementations of these features elsewhere, so I decided to finally take the time to untangle my interdependent web of scripts and prepare them for contribution to the Roll20 community at large.  I'll be grouping these into packages by theme, the first of which to be released (in very early alpha) being **!ETC: Eunomiac's Text Controls**.

![ETC: Eunomiac's Text Controls](https://raw.githubusercontent.com/Eunomiac/EunosRoll20Scripts/5d1778854720debd39b905d09f1b472858021864/images/ETCLogo.png)

Roll20's native support for Text Objects (i.e. text you create directly in the sandbox) is limited, especially if you'd like to make your sandbox into an infographic or HUD. Enter **!ETC** to provide a host of functions dedicated to streamlining, simplifying and automating your ability to use Text Objects for all manner of applications!

## Installation & Setup
* **Install ETC.js** — Install the contents of **ETC.js** as a new script in the "API Scripts" section of your game management page.

... and you're done! Instructions are printed to chat on script startup, and can be reviewed at any time by typing "**!etc**".

## !ETC Feature: Text Drop Shadows

![ETC Feature: Text Drop Shadows](https://raw.githubusercontent.com/Eunomiac/EunosRoll20Scripts/master/images/ETCTextShadowsHeader.png)

Add drop shadows to text objects, either automatically (whenever one is created) or manually via chat command.
* **Fully Plug-And-Play** — You can add/remove shadows from selected text objects with a command, or toggle on automatic shadowing, which will add a text shadow to any new text object created by any player.
* **Completely Hands-Off** — Text shadows are created on the map layer (by default), then z-ordered behind their master text objects. Shadows will move when their master object moves; they will update their content, size, font, etc. to match their master object; and they will remove themselves if their master object is ever removed—all without any user involvement. Ideally, you should never have to think about the text shadow objects themselves.
* **Tuned for All Fonts & Sizes** — The shadows are positioned depending on the font family and size, for a pleasing look whether you're shadowing a huge heading or a paragraph of body text.  Configuration options clearly marked and commented in the script allow further fine-tuning of these details, if the default settings aren't to your liking: You can configure different vertical and horizontal offsets, specify specific offsets for specific font and size combinations, change the color of the shadows, and specify the layer on which text shadows should be created.

## !ETC Feature: Auto-Prune Empty Text Objects
Ever notice that, when you click off of a text object, Roll20 goes and creates another text object wherever you clicked? If you then click elsewhere without typing anything, that empty and invisible text object remains (potentially interfering with box-selecting objects, among other vexations).  By toggling Auto-Prune on, **!ETC** will automatically remove any empty text objects from the sandbox whenever they are created.

## Future Plans for !ETC
Additional features in development include:
* **Text Justification & Alignment** — Define height and/or width for a text object, then the horizontal justification *(left/center/right)* and/or the vertical alignment *(top/middle/bottom)* of its contents. <b>!ETC</b> will constantly update the text object whenever its content changes, adding line breaks and padding as necessary to maintain the prescribed settings. You can also configure overflow behavior (if both height and width are specified): truncated, truncated with ellipses, or allowed to overflow along one or both axes.
* **Attribute Linking** — Link a text object in the sandbox to an attribute on a character, then choose from a number of different ways to display that value: directly, as a bar showing current value out of maximum value, or by repeating a symbol, character or string a number of times equal to the attribute value. The text object will automatically update whenever the linked attribute is changed.
* **Tables & Charts** — Combining the two above features, it becomes possible to create charts, tables and other infographic-style displays of almost limitless complexity: column and row alignment is retained, and the text objects update automatically whenever their associated data is changed.
* **Chat Command Control** — Link a text object to an API chat command, then define which players can use the command to update the contents of the text object. Because these changes are handled via API command, you can also use this feature to automate more complex behavior than merely displaying an attribute: Other scripts can call these control commands, and they can be coded into buttons on character sheets.

# Beyond !ETC
I am in the process of planning out a selection of other script packages:

![ETC: Eunomiac's Grab Controls](https://raw.githubusercontent.com/Eunomiac/EunosRoll20Scripts/5d1778854720debd39b905d09f1b472858021864/images/EGCLogo.png)

Who said you can't have buttons in the Roll20 Sandbox? **!EGC** circumvents this limitation by creating a new type of interactive control: the "Grab Pad".  You simply point **!EGC** at a sandbox object (graphic, text, path, anything), and it will add an invisible graphic object on top that can be controlled by whomever you specify.  Whenever that invisible pad is moved, it triggers a chat command or custom function (your choice) then immediately snaps back to its home position, ready to be used again.  In short, Grab Pads are like buttons that you wiggle instead of push.

![ETC: Eunomiac's HTML Controls](https://raw.githubusercontent.com/Eunomiac/EunosRoll20Scripts/5d1778854720debd39b905d09f1b472858021864/images/EHCLogo.png)

Dispense with the limitations of the Roll20 content editors, and instead create gorgeous handouts and chat messages with (almost) full HTML and CSS support. Buttons capable of submitting API chat commands can be included in both chat messages and handouts, the latter being an excellent way to create a master GM "control panel" for your game.

... and more, in even earlier stages of development! 
