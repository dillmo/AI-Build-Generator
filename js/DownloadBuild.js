"use strict";

function downloadBuildXML() {
    // Convert angle bracket character codes to raw angle brackets
    var XMLFile = document.getElementById("output").innerHTML
        .replace(/&lt;/g, "<").replace(/&gt;/g, ">");

    // Convert file text to blob
    var fileBlob = new Blob([XMLFile], {type: "text/xml"});

    saveAs(fileBlob, "Mod_Build.xml");
}
