main();
function main(){
    doc = app.activeDocument;
    //number of characters on a line that I am subjectively calling short
    shortLineThreshold = 13;
    //how far the height of the text box can change before its decided to be enough extra space for a line
    extraSpaceThreshold = 1.5;
    if(doc.selection[0] == undefined){
        alert("Please select at least one text frame.");
        return;
    }
    lastTextFrame = doc.selection[doc.selection.length-1];
    removeEmptyLines();
    setDefaults();
        
    if(isOverflowing()){
        allAtSmallest = areAllAtSmallest();
        fixOverflow();
        if(allAtSmallest && isOverflowing()){
            alert("Please resize the text frames not all of the text fit even with -30 tracking. Then run this script again.");
            return;
        }
    }
    
    if(hasExtraSpace()){
        allAtLargest = areAllAtLargest();
        fixExtraSpace();
        if(allAtLargest && hasExtraSpace()){
            alert("Please resize the text frames as there is still extra space even with 30 tracking. Then run this script again.");
            return;
        }
    }
    
    eliminateShortLines();
    setColor();
    alert("Done");
    return;
}

function setDefaults(){
    makeDefaults();
    for(i = 0; i < doc.selection.length; i++){
        var paragraphs = doc.selection[i].paragraphs;
        if(paragraphs != undefined){
            for(j = 0; j < paragraphs.length; j++){
                paragraphs.item(j).applyParagraphStyle(style, false);
            }
        } 
    }
    doc.paragraphStyles[doc.paragraphStyles.length-1].remove();
    return;
}

function setColor(){
    var finalCopy = confirm("This text is final copy and should be black.", "Final Copy?");
    for(i = 0; i < doc.selection.length; i++){
        var paragraphs = doc.selection[i].paragraphs;
        if(paragraphs != undefined){
            for(j = 0; j < paragraphs.length; j++){
                if(finalCopy){
                    paragraphs.item(j).applyCharacterStyle(finalStyle, false);
                } else {
                    paragraphs.item(j).applyCharacterStyle(notFinalStyle, false);
                }
            }
        } 
    }
}

function makeDefaults(){
    /*The default text styles. Change these as needed.*/
    doc.paragraphStyles.add();
    style = doc.paragraphStyles[doc.paragraphStyles.length-1];
    style.appliedFont = app.fonts.item("Times New Roman");
    style.alignToBaseline = true;
    style.pointSize = 10;
    style.justification = Justification.LEFT_JUSTIFIED;
    
    /* 
     * Remove widows and orphans - lines that are separated from the rest of their paragraphs.
     * Avoid this by requiring that at least two lines are kept together on the text frame breaks.
     */
    style.keepLinesTogether = true;
    style.keepLastLines = 2;
    style.keepFirstLines = 2;

    /*
     * As copy text is often not ready in time for design. Set the text color to red if 
     * the text is not final copy.
     */
    
    // Final Copy Color
    finalStyle = document.colors.itemByName("Final Copy");
    doc.characterStyles.add();       
    finalStyle = doc.characterStyles[doc.characterStyles.length-1];
    finalColor = document.colors.itemByName("Final Copy");
    if(finalColor == null){
        finalColor = document.colors.add();   
        finalColor.colorValue = [100,100,100,100];
        finalColor.name = "Final Copy";
    }
    finalStyle.fillColor = finalColor;
    
    // Not Final Copy Color
    doc.characterStyles.add();
    notFinalStyle = doc.characterStyles[doc.characterStyles.length-1];
    notFinalColor = document.colors.itemByName("Not Final Copy");
    if(notFinalColor == null){
        notFinalColor = document.colors.add();   
        notFinalColor.colorValue = [15,100,100,0];
        notFinalColor.name = "Not Final Copy";
    }
    notFinalStyle.fillColor = notFinalColor;
}

function removeEmptyLines(){
    for(i = 0; i < doc.selection.length; i++){
        var paragraphs = doc.selection[i].paragraphs;
        if(paragraphs != undefined){
            for(j = 0; j < paragraphs.length; j++){
                for(k = 0; k < paragraphs.item(j).lines.length; k++){
                    if(paragraphs.item(j).lines.item(k).length == 1){
                        paragraphs.item(j).lines.item(k).remove();
                    }
                }
            }
        } 
    }
}

function fixOverflow(){
    while(isOverflowing() && !allAtSmallest){
        for(i = 0; i < doc.selection.length; i++){
            var paragraphs = doc.selection[i].paragraphs;
            if(paragraphs != undefined){
                for(j = 0; j < paragraphs.length; j++){
                    if(trackingWithinBounds(paragraphs.item(j))) {
                        decreaseTracking(paragraphs.item(j));
                    }
                }
            }
        }
        if(!lastParagraphWithinBounds()){
            allAtSmallest = true;
        }
    }
    return;
}

function fixExtraSpace(){
    while(!isOverflowing() && !allAtLargest){
        for(i = 0; i < doc.selection.length; i++){
            var paragraphs = doc.selection[i].paragraphs;
            if(paragraphs != undefined){
                for(j = 0; j < paragraphs.length; j++){
                    if(trackingWithinBounds(paragraphs.item(j))) {
                        increaseTracking(paragraphs.item(j));
                    }
                }
            }
        }
        if(!lastParagraphWithinBounds()){
            allAtLargest = true;
        }
    }
    fixOverflow();
    return;
}

function eliminateShortLines(){
    for(j = 0; j < doc.selection.length; j++){
        var paragraphs = doc.selection[j].paragraphs;
        for(i = 0; i < paragraphs.length; i++){
            var lines = paragraphs.item(i).lines;
            var initialLineLength = lines.length;
            if(lines.item(lines.length-1).length < shortLineThreshold){
                while(initialLineLength == paragraphs.item(i).lines.length && trackingWithinBounds(paragraphs.item(i))) {
                    increaseTracking(paragraphs.item(i));
                }
                if(initialLineLength > paragraphs.item(i).lines.length){
                    while(initialLineLength >= paragraphs.item(i).lines.length && trackingWithinBounds(paragraphs.item(i))){
                        decreaseTracking(paragraphs.item(i));
                    }
                }
            }
        }
    }
    return;
}

function isOverflowing(){
    //the last text box selected has overflow
    if(lastTextFrame != null){
        return lastTextFrame.overflows;
    } else {
        return false;
    }
}

function hasExtraSpace(){
    var initialBounds = lastTextFrame.geometricBounds;
    var y0 = initialBounds[0];
    var x0 = initialBounds[1];
    var y1 = initialBounds[2];
    var x1 = initialBounds[3];
    var initialWidth = x1 - x0;
    var initialHeight = y1 - y0;
    lastTextFrame.fit(FitOptions.FRAME_TO_CONTENT);
    var newBounds = lastTextFrame.geometricBounds;
    var y0 = newBounds[0];
    var x0 = newBounds[1];
    var y1 = newBounds[2];
    var x1 = newBounds[3];
    var newWidth = x1 - x0;
    var newHeight = y1 - y0;
    lastTextFrame.geometricBounds = initialBounds;
    return Math.abs(initialHeight - newHeight) > extraSpaceThreshold;
}

function trackingTooLarge(paragraph){
    return paragraph.tracking >= 33;
}

function trackingTooSmall(paragraph){
    return paragraph.tracking <= -33;
}

function trackingWithinBounds(paragraph){
    return !trackingTooLarge(paragraph) && !trackingTooSmall(paragraph);
}

function lastParagraphWithinBounds(){
    return trackingWithinBounds(lastTextFrame.paragraphs.item(lastTextFrame.paragraphs.length - 1));
}

function increaseTracking(paragraph){
    paragraph.tracking = paragraph.tracking + 1;
    return;
}

function decreaseTracking(paragraph){
    paragraph.tracking = paragraph.tracking - 1;
    return;
}

function areAllAtSmallest(){
    for(j = 0; j < doc.selection.length; j++){
        var paragraphs = doc.selection[j].paragraphs;
        for(i = 0; i < paragraphs.length; i++){
            if(!trackingTooSmall(paragraphs.item(i))){
                return false;
            }
        }
    }
    return true;
}

function areAllAtLargest(){
    for(j = 0; j < doc.selection.length; j++){
        var paragraphs = doc.selection[j].paragraphs;
        for(i = 0; i < paragraphs.length; i++){
            if(!trackingTooLarge(paragraphs.item(i))){
                return false;
            }
        }
    }
    return true;
}