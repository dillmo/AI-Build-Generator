"use strict";

var upgradeCodes

// Load the upgrade codes when the document loads
$(document).ready(function() {
        $.getJSON("json/UpgradeCodes.json", function(data) {
                upgradeCodes = data
            });
    });

// Called upon hitting enter in the text box
// Outputs build XML to the read-only text field
function outputBuildXML(event) {
    if (event.keyCode == 13) {
        var buildCode = document.getElementById("buildCode").value;

        document.getElementById("output").innerHTML = genBuildXML(buildCode);
    }
}

// Generates the build XML to be written to the page
function genBuildXML(buildCode) {
    var prefix = "<?xml version=\"1.0\">" + "<enemy>" + "<behaviour>" +
                 "<root x=\"110\" y=\"40\">" + "<normal>";
    var postfix = "</normal>" + "</root>" + "</behaviour>" + "</enemy>";
    var innerXML = XMLBlock("string", "area name", "", "healArea") +
               XMLBlock("string", "team", "ownenemy", "OWN_TEAM") +
               XMLBlock("string", "who", "targetself", "self") +
               XMLBlock("string", "Comment", "", "In shop") +
               XMLBlock("normal", "", "", genUpgradeXML(buildCode));

    return prefix + XMLBlock("condition", "isInNamedArea", "", innerXML) + postfix;
}

// Returns a generic XML block. Chained to compose build XML.
function XMLBlock(tag, id, values, inner) {
    var returnXML = "<" + tag;
    if (id != "") returnXML += " id=\"" + id + "\"";
    if (values != "") returnXML += " values=\"" + values + "\"";
    returnXML += ">";
    if (inner != "") returnXML += inner;
    returnXML += "</" + tag + ">";

    return returnXML;
}

// Returns the upgrade logic nested inside the shop check
function genUpgradeXML(buildCode) {
    var nautName = buildCode.replace(/(.*\]|^)(\w+).*/, "$2");
    var nautsbuilderIDs = buildCode.match(/\d+/g);

    // Create an array to track bought upgrades and populate it with zeroes
    var boughtUpgrades = Array.apply(null, Array(28)).map(Number.prototype.valueOf, 0);

    var upgrades = [];

    // Starts at 1 because the first value in the array is not an upgrade ID
    for (i = 1; i < nautsbuilderIDs.length; i++) {
        // Find the in-game upgrade ID
        var nautsbuilderID = nautsbuilderIDs[i];
        var upgradeNumber = boughtUpgrades[nautsbuilderID];
        var inGameID = upgradeCodes[nautName][nautsbuilderID][upgradeNumber];
        upgrades[i - 1] = inGameID;

        // Increment the number of bought upgrades in boughtUpgrades
        boughtUpgrades[nautsbuilderID]++;
    }

    var upgradeXML = "";

    // Each iteration generates logic for a single upgrade
    for (var i = 0; i < upgrades.length; i++) {
        upgradeXML += XMLBlock("condition", "isUpgradeEnabled", "",
                XMLBlock("string", "condition", "yesno", "no") +
                XMLBlock("string", "upgrade name", "", upgrades[i]) +
                XMLBlock("normal", "", "",
                    XMLBlock("condition", "canPayUpgrade", "",
                        XMLBlock("string", "upgrade name", "", upgrades[i]) +
                        XMLBlock("normal", "", "",
                            XMLBlock("action", "enableUpgrade", "",
                                XMLBlock("string", "condition", "yesno", "yes") +
                                XMLBlock("string", "upgrade name", "", upgrades[i])
                            )
                        )
                    )
                )
            );
    }

    return upgradeXML;
}
