main();
function main(){
    var doc = app.documents.item(0);
    var page = doc.pages.item(0);
    var textFrame = page.textFrames.item(0);
    if(textFrame == undefined){
        alert("Please select a starting text frame.");
    } else {
        var paragraphs = textFrame.paragraphs;
        var notNeg33 = paragraphs.item(0).tracking > -33;
        while(textFrame.overflows && notNeg33){
            for(i = 0; i < paragraphs.length; i++){
                if(paragraphs.item(i).tracking > -33) {
                    paragraphs.item(i).tracking =  paragraphs.item(i).tracking - 1;
                 } else {
                     notNeg33 = false;
                 }
             }
         } 
        if(!notNeg33 && textFrame.overflows){
            alert("Please resize the text frame not all of the text fit even with -30 tracking.");
        } else {
            for(i = 0; i < paragraphs.length; i++){
                var lines = paragraphs.item(i).lines;
                var num = lines.length;
                if(lines.item(lines.length-1).length < 13){
                    var notPos33 = paragraphs.item(i).tracking < 33;
                    while(num == paragraphs.item(i).lines.length && notPos33) {
                        if(paragraphs.item(i).tracking < 33){
                            paragraphs.item(i).tracking = paragraphs.item(i).tracking + 1;
                        } else {
                            notPos33 = false;
                        }
                    }
                    if(!notPos33){
                        paragraphs.item(i).tracking = paragraphs.item(i).tracking - 1;
                    }
                }
            }
        }
    alert("Done");
    }
}