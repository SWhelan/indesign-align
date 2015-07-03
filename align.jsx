main();
function main(){
    var doc = app.documents.item(0);
    var page = doc.pages.item(0);
    var textFrame = doc.selection[0];
    if(textFrame == undefined){
        alert("Please select at least one text frame.");
    } else {
        var lastTextFrame = doc.selection[doc.selection.length-1];
        var notNeg33 = doc.selection[0].paragraphs.item(0).tracking > -33;
        while(lastTextFrame.overflows && notNeg33){
            for(i = 0; i < doc.selection.length; i++){
                var paragraphs = doc.selection[i].paragraphs;
                if(paragraphs != undefined){
                    for(j = 0; j < paragraphs.length; j++){
                        if(paragraphs.item(j).tracking > -33) {
                            paragraphs.item(j).tracking =  paragraphs.item(j).tracking - 1;
                        }
                    }
                }
            }
            if(lastTextFrame.paragraphs.item(lastTextFrame.paragraphs.length - 1).tracking < -32){
                notNeg33 = false;
            }
        }
        if(!notNeg33 && lastTextFrame.overflows){
            alert("Please resize the text frame not all of the text fit even with -30 tracking. Then run this script again.");
        } else {
            for(j = 0; j < doc.selection.length; j++){
                var paragraphs = doc.selection[j].paragraphs;
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
                        notNeg33 = paragraphs.item(i).tracking > -33;
                        while(doc.selection[doc.selection.length - 1].overflows && notNeg33){
                            if(paragraphs.item(i).tracking > -33){
                                paragraphs.item(i).tracking = paragraphs.item(i).tracking - 1;
                            } else {
                                notNeg33 = false;
                            }
                        }
                    }
                }
            }
            alert("Done");
        }
    }
}