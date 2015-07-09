# indesign-align
A script that helps with properly formatting pasted text into indesign.

This script was made specifically for The Observer, the student run newspaper, at Case Western Reserve University but could be very useful for any project that requires the copy and pasting from word documents or google docs into indesign.

## Script Actions
* Asks the user if they would like to remove blank lines for example between paragraph spacing that is left over when copying from elsewhere. The user can opt out if there is purposeful spacing.

* Sets the Default Body Copy options according to the Observer's specifications. The makeDefaults() method is what should be changed to alter what style is applied to all of the text.

* In setting the default styles there are also a few rules set for handling widows and orphans that interrupt the flow of the block of text. Widows are lines that are at the end of paragraphs that are much shorter than the rest of the text. Orphans are when the last line of the paragraph is cut off from the rest of the paragraph and are placed at the top of the next text frame. This script adds the requirement that the first two and the last two lines of each paragraph stay together. Additionally the last word of the last line of each paragraph is not allowed to be hyphenated this helps with the short lines at the end of paragraphs.

* If not all of the text is visible or there is overflow, it attempts to shrink the tracking on all of the paragraphs to a predefined limit (-30 for The Observer). If the text does not fit with the default styles and the smallest tracking the script exits.

* If there is extra space, the tracking is increased to a predefined limit (+30 for The Observer) in an attempt to fill the space. 

* If there are lines at the end of paragraphs that are shorter than a predefined character limit (13 for The Observer) the tracking of just that paragraph is increased until the last line isn't too short or it is decreased, if it can be, until the line is absorbed into the previous line.

* Lastly the color of the text is set based on a prompt to the user. Like many publications The Observer layout is often finished before the copy has gone through final edits. In an attempt to ensure that non final copy doesn't go to print final copy is in black and not final copy is placed in red. The actual colors can also be set in the makeDefaults() method. Alternatively if this doesn't apply, the call to the setColor() method could be removed.

## Running the Script
Place the align.jsx file in your scripts folder. (See below.) Place copy into your document and select all of the text boxes for the copy and then run the script from the scripts panel.

## Placing Script in Scripts Folder
Place the align.jsx file in your InDesign scripts directory. The jsx file will work for both windows and OSX systems.
It is easiest to find the scripts folder by right clicking in the Scripts Panel (Windows > Utilities > Scripts) and clicking reveal in explorer/finder.

From the Adobe InDesign CS6 Scripting Tutorial page 6:

> Installing an InDesign script is easy: put the script file in the Scripts Panel folder inside the Scripts folder in
> your InDesign application folder. (Create the Scripts folder if it does not already exist.)
> Alternately, put the script inside the Scripts Panel folder in your preferences folder. Your preferences folder
> is at:
> > Windows® XP: C:\Documents and Settings\&lt;username>\Application Data\Adobe\InDesign\Version 8.0\&lt;locale>\Scripts
> > 
> > Windows® Vista: C:\Users\&lt;username>\AppData\Roaming\Adobe\InDesign\Version 8.0\&lt;locale>\Scripts
> >
> > Mac OS®: /Users/&lt;username>/Library/Preferences/Adobe InDesign/Version 8.0/&lt;locale>/Scripts
>
> where &lt;username> is your user name and <locale> references your location and language, for example, en_US.
> Once the script is in the folder, it appears on the Scripts panel inside InDesign. To display the panel, choose
> Window > Utilities > Scripts.

To learn more about scripting for InDesign in general the introductory tutorial can be found [here](http://wwwimages.adobe.com/content/dam/Adobe/en/devnet/indesign/sdk/cs6/scripting/InDesign_ScriptingTutorial.pdf "InDesign Scripting Tutorial").
