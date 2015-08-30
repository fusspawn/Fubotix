Player.Mods = Player.Mods || {};

var Mods = Player.Mods;

Mods.version = "3.5-2015-08-23";

Mods.modOptions = Mods.modOptions || {};

Mods.Load = {};

Mods.time = timestamp();

var disable_options = !0, Load = Mods.Load, modOptions = Mods.modOptions, switchWorldBugFix = function() {};

function getElem(id, obj) {
    if ("string" !== typeof id) return null;
    var style = document.getElementById(id);
    if (null === style) return null;
    if ("undefined" === typeof obj) return style;
    for (var name in obj) if ("id" == name || "className" == name || "cssFloat" == name || "innerHTML" == name) style[name] = obj[name]; else if ("string" === typeof obj[name] && style.setAttribute(name, obj[name]), 
    "function" === typeof obj[name] && (style[name] = obj[name]), "number" === typeof obj[name] && (style[name] = "" + obj[name]), 
    "object" === typeof obj[name]) for (var key in obj[name]) "style" == name && (style.style[key] = obj[name][key]), 
    "setAttributes" == name && style.setAttribute(key, "javascript: " + obj[name][key]), 
    "setFunctions" == name && (style[key] = obj[name][key]);
    return style;
}

function createElem(obj, el, data) {
    if ("undefined" === typeof obj || "undefined" === el) return Mods.consoleLog("createElem error: no type or attachTo"), 
    null;
    obj = document.createElement(obj);
    if ("undefined" != typeof data) for (var key in data) if ("id" == key || "className" == key || "cssFloat" == key || "innerHTML" == key) obj[key] = data[key]; else if ("string" === typeof data[key] && obj.setAttribute(key, data[key]), 
    "function" === typeof data[key] && (obj[key] = data[key]), "number" === typeof data[key] && (obj[key] = "" + data[key]), 
    "object" === typeof data[key]) for (var k in data[key]) "style" == key && (obj.style[k] = data[key][k]), 
    "setAttributes" == key && obj.setAttribute(k, "" + data[key][k]), "setFunctions" == key && (obj[k] = data[key][k]);
    if ("string" === typeof el) getElem(el).appendChild(obj); else if ("object" === typeof el) el.appendChild(obj); else return null;
    return obj;
}

function getAbsoluteHeight(el) {
    el = "string" === typeof el ? document.querySelector(el) : el;
    var size = window.getComputedStyle(el), size = parseFloat(size.marginTop) + parseFloat(size.marginBottom);
    return Math.ceil(el.offsetHeight + size);
}

function preventDefault(e) {
    e = e || window.event;
    e.preventDefault && e.preventDefault();
    e.returnValue = !1;
}

String.prototype.toHHMMSS = function(min) {
    var v = parseInt(this, 10);
    min = Math.floor(v / 3600);
    var n = Math.floor((v - 3600 * min) / 60), v = v - 3600 * min - 60 * n, text = "";
    0 != min && (text = min + ":");
    if (0 != n || "" !== text) n = 10 > n && "" !== text ? "0" + n : String(n), text += n + ":";
    return text = "" === text ? v + "s" : text + (10 > v ? "0" + v : String(v));
};

function addEvent(element, type, callback) {
    element.addEventListener ? (element.addEventListener(type, callback, !1), EventCache.add(element, type, callback)) : element.attachEvent ? (element["e" + type + callback] = callback, 
    element[type + callback] = function() {
        element["e" + type + callback](window.event);
    }, element.attachEvent("on" + type, element[type + callback]), EventCache.add(element, type, callback)) : element["on" + type] = element["e" + type + callback];
}

var EventCache = function() {
    var tokens = [];
    return {
        listEvents: tokens,
        add: function(v1, v2, thresh) {
            tokens.push(arguments);
        },
        flush: function() {
            var j, token;
            for (j = tokens.length - 1; 0 <= j; --j) token = tokens[j], token[0].removeEventListener && token[0].removeEventListener(token[1], token[2], token[3]), 
            "on" != token[1].substring(0, 2) && (token[1] = "on" + token[1]), token[0].detachEvent && token[0].detachEvent(token[1], token[2]), 
            token[0][token[1]] = null;
        }
    };
}();

if ("dendrek" == players[0].name || "witwiz" == players[0].name) disable_options = !1;

Mods.initialize = function() {
    Mods.modOptionsTypes = {
        text: {
            type: "text",
            createElement: "span",
            closeElement: "span",
            opt_span: "all",
            style: {
                "": ""
            }
        },
        checkbox: {
            createElement: "input type='checkbox'",
            style: {
                width: ".8em",
                height: ".8em",
                margin: "0px",
                "margin-right": "6px"
            }
        },
        radio: {
            type: "radio",
            createElement: "input type='radio'",
            style: {
                width: ".8em",
                height: ".8em",
                margin: "0px",
                "margin-right": "6px"
            }
        },
        button: {
            type: "button",
            createElement: "button",
            closeElement: "button",
            className: "market_select pointer",
            opt_span: "all",
            style: {
                margin: "0px",
                "font-size": "1em"
            }
        },
        block_color: {
            createElement: "div",
            closeElement: "div",
            opt_span: "all",
            style: {
                border: "1px solid #666666",
                width: "100px",
                height: "20px"
            }
        }
    };
    Mods.modOptionsVersion = function() {
        var array = {
            expmonitor: {
                id: "expmonitor",
                name: "x2 Experience Monitor",
                shortname: "x2 Experience Monitor",
                description1: "Shows a timer during x2 events.",
                description2: "This mod shows a visibe timer whenever a x2 event is started.",
                load: !1,
                loaded: !1,
                newmod: !1,
                updated: !1,
                time: 0
            },
            fullscreen: {
                id: "fullscreen",
                name: "FullScreen Mode",
                shortname: "FullScreen Mode",
                description1: "Enable full-screen mode.",
                description2: "This mod allows to display the game on the whole screen. It is only suggested on PC (no mobile devices). WARNING: on slow devices, it may affect game performance. After loading the mod, enable full screen mode in the options menu.",
                load: !1,
                loaded: !1,
                newmod: !1,
                updated: !1,
                time: 0
            },
            autocast: {
                id: "autocast",
                name: "Auto Cast",
                shortname: "Auto Cast",
                description1: "Enable auto-casting equipped magic.",
                description2: "This mod enables auto-casting magic (which becomes automatic when engaging in combat). It is disabled by default, to turn it on enable Autocast in game options.",
                load: !1,
                loaded: !1,
                newmod: !1,
                updated: !1,
                time: 0
            },
            newmap: {
                id: "newmap",
                name: "Enhanced Map",
                shortname: "Enhanced Map",
                description1: "Enhances game map with several added details.",
                description2: "Map now shows current position and details, including travel signs, mobs, bosses, resource spots and POI. In dungeons, fellow players are shown in the full map. Mimimap shows bigger dots, yellow-colored for friends.",
                load: !1,
                loaded: !1,
                newmod: !1,
                updated: !1,
                time: 0
            },
            newmarket: {
                id: "newmarket",
                name: "Enhanced Market",
                shortname: "Enhanced Market",
                description1: "Adds various helpers for market interface.",
                description2: "Allows resubmit or edit of market offers, display target player for transactions, highlights offers directed to the player and other market improvements. Adds Trade channel.",
                load: !1,
                loaded: !1,
                newmod: !1,
                updated: !1,
                time: 0
            },
            tabs: {
                id: "tabs",
                name: "Tabbed Chat",
                shortname: "Tabbed Chat",
                description1: "Adds tabs to the chat interface.",
                description2: "Every chat tab can have different filters and subscribed channels. Filters are now applied only on active chat. Subscribed channels can be filtered from tabs via right-click menu. Tabs can also be renamed/deleted via context menu.",
                requires: "Chatmd",
                load: !1,
                loaded: !1,
                newmod: !1,
                updated: !1,
                time: 0
            },
            kbind: {
                id: "kbind",
                name: "Keybinding Extensions",
                shortname: "Keybinding Extensions",
                description1: "Adds an iterface to manage custom keybindings for various actions.",
                description2: "From the game menu, a new 'keybindings' item allows access to mod customization.",
                load: !1,
                loaded: !1,
                newmod: !1,
                updated: !1,
                time: 0
            },
            gearmd: {
                id: "gearmd",
                name: "Gear Screen Mod",
                shortname: "Gear Mod",
                description1: "Enable a gear menu, to show what you have equipped.",
                description2: "From your Inventory, click (Show Equipment) to access a gear screen, where you can easily see what you have equipped and what you're missing. This screen can be moved! And click 'Equipped' to switch it to 'Vanity Set.' Using the in-game wiki search under Items, then use (Try On) to equip items to your Vanity Set!",
                load: !1,
                loaded: !1,
                newmod: !1,
                updated: !1,
                time: 0
            }
        };
        array.expbar = {
            id: "expbar",
            name: "Experience Bar",
            shortname: "Experience Bar",
            description1: "Shows an experience bar for your chosen active skill.",
            description2: "Open your skill's menu and click any skill to have the experience bar show that skill.",
            load: !1,
            loaded: !1,
            newmod: !1,
            updated: !1,
            time: 0,
            options: {
                0: {
                    id: "attached",
                    name: "Lock exp bar above the health bar.",
                    description: "If you move the health bar, the exp bar will move with it.",
                    type: Mods.modOptionsTypes.checkbox,
                    onclick: "javascript: Mods.modOptions_options(&apos;expbar&apos;,&apos;attached&apos;);"
                },
                1: {
                    id: "toggle",
                    name: "Allow exp bar to be toggled on/off.",
                    description: "If on, clicking the exp bar will cause it to hide. Click a skill to un-hide it.",
                    type: Mods.modOptionsTypes.checkbox,
                    onclick: "javascript: Mods.modOptions_options(&apos;expbar&apos;,&apos;toggle&apos;);"
                },
                2: {
                    id: "color",
                    name: "Change the color of the exp bar.",
                    type: Mods.modOptionsTypes.text,
                    options: {
                        0: {
                            id: "color",
                            type: Mods.modOptionsTypes.radio,
                            value: "0",
                            background: "",
                            onclick: "javascript: Mods.modOptions_options(&apos;expbar&apos;,&apos;color&apos;);"
                        },
                        1: {
                            id: "color",
                            type: Mods.modOptionsTypes.radio,
                            value: "1",
                            background: "",
                            onclick: "javascript: Mods.modOptions_options(&apos;expbar&apos;,&apos;color&apos;);"
                        },
                        2: {
                            id: "color",
                            type: Mods.modOptionsTypes.radio,
                            value: "2",
                            background: "",
                            onclick: "javascript: Mods.modOptions_options(&apos;expbar&apos;,&apos;color&apos;);"
                        },
                        3: {
                            id: "color",
                            type: Mods.modOptionsTypes.radio,
                            value: "3",
                            background: "",
                            onclick: "javascript: Mods.modOptions_options(&apos;expbar&apos;,&apos;color&apos;);"
                        },
                        4: {
                            id: "color",
                            type: Mods.modOptionsTypes.radio,
                            value: "4",
                            background: "",
                            onclick: "javascript: Mods.modOptions_options(&apos;expbar&apos;,&apos;color&apos;);"
                        },
                        5: {
                            id: "color",
                            type: Mods.modOptionsTypes.radio,
                            value: "5",
                            background: "",
                            onclick: "javascript: Mods.modOptions_options(&apos;expbar&apos;,&apos;color&apos;);"
                        }
                    }
                }
            }
        };
        array.petinv = {
            id: "petinv",
            name: "Pet Inventory",
            shortname: "Pet Inventory",
            description1: "Attaches the pet inventory to the main one.",
            description2: "You will see the pet's inventory beneath your main inventory. You will also be able to transfer items between the two inventories very easily. By default, left-clicking items will send them from your inventory to your pet's and shift+clicking will cause you to use/equip items. Additional features include: (unload) and (load) to unload/load all pet-inventory items quickly.",
            load: !1,
            loaded: !1,
            newmod: !1,
            updated: !1,
            time: 0,
            options: {
                0: {
                    id: "shiftclick",
                    name: "Allow shift+click to send items to pet chest.",
                    description: "If toggled on, shift+click sends items from your inventory to the pet chest, while left-click uses/equips items. If toggled off, shift+click uses/equips items, while left-click sends items from your inventory to the pet chest.",
                    type: Mods.modOptionsTypes.checkbox,
                    onclick: "javascript: Mods.modOptions_options(&apos;petinv&apos;,&apos;shiftclick&apos;);"
                },
                1: {
                    id: "petexp",
                    name: "Hide the pet's exp/evolution on the pet chest.",
                    type: Mods.modOptionsTypes.checkbox,
                    onclick: "javascript: Mods.modOptions_options(&apos;petinv&apos;,&apos;petexp&apos;);"
                },
                2: {
                    id: "pettext",
                    name: "Hide text/information above pet inventory.",
                    description: "If toggled off, the 'Pet/'s chest title, as well as the greyed text and checkbox will be hidden.",
                    type: Mods.modOptionsTypes.checkbox,
                    onclick: "javascript: Mods.modOptions_options(&apos;petinv&apos;,&apos;pettext&apos;);",
                    options: {
                        0: {
                            id: "0",
                            name: "Hide 'Pet/'s chest'.",
                            type: Mods.modOptionsTypes.checkbox,
                            onclick: "javascript: Mods.modOptions_options(&apos;petinv&apos;,&apos;pettext&apos;,&apos;0&apos;);"
                        },
                        1: {
                            id: "1",
                            name: "Hide grey text for (click to close) and shift+click.",
                            type: Mods.modOptionsTypes.checkbox,
                            onclick: "javascript: Mods.modOptions_options(&apos;petinv&apos;,&apos;pettext&apos;,&apos;1&apos;);"
                        },
                        2: {
                            id: "2",
                            name: "Hide shift+click checkbox.",
                            type: Mods.modOptionsTypes.checkbox,
                            onclick: "javascript: Mods.modOptions_options(&apos;petinv&apos;,&apos;pettext&apos;,&apos;2&apos;);"
                        }
                    }
                }
            }
        };
        array.mosmob = {
            id: "mosmob",
            name: "Mouseover Stats",
            shortname: "Mouseover Stats",
            description1: "When you mouseover a mob, an item, or an object, you'll be able to see its stats.",
            description2: "The stats shown are 'A' for accuracy, 'S' for strength, 'D' for defence, and 'Hp' for health. Objects show a description or required levels. A game options allows to tweak panel appearance.",
            load: !1,
            loaded: !1,
            newmod: !1,
            updated: !1,
            time: 0,
            options: {
                0: {
                    id: "appearance",
                    name: "Choose how the mob's stats appear.",
                    description: "When you mouseover a mob, you will see its stats: accuracy, strength, defense and health. You can decide here how those values are shown.",
                    type: Mods.modOptionsTypes.text,
                    options: {
                        0: {
                            id: "appearance",
                            name: "(A0, S0, D0, H5)",
                            type: Mods.modOptionsTypes.radio,
                            value: "0",
                            onclick: "javascript: Mods.modOptions_options(&apos;mosmob&apos;,&apos;appearance&apos;);"
                        },
                        1: {
                            id: "appearance",
                            name: "(Acc0, Str0, Def0, Hp5)",
                            type: Mods.modOptionsTypes.radio,
                            value: "1",
                            onclick: "javascript: Mods.modOptions_options(&apos;mosmob&apos;,&apos;appearance&apos;);"
                        },
                        2: {
                            id: "appearance",
                            name: "(0 / 0 / 0 | 5)",
                            type: Mods.modOptionsTypes.radio,
                            value: "2",
                            onclick: "javascript: Mods.modOptions_options(&apos;mosmob&apos;,&apos;appearance&apos;);"
                        }
                    }
                },
                1: {
                    id: "twolines",
                    name: "Show the mob's stats below the mob's name.",
                    description: "When toggled on, you'll see two lines of text: 1) level and name, 2) stats. When toggled off, the name and stats all appear on one line.",
                    type: Mods.modOptionsTypes.checkbox,
                    onclick: "javascript: Mods.modOptions_options(&apos;mosmob&apos;,&apos;twolines&apos;);"
                },
                2: {
                    id: "color",
                    name: "Set color of mob's stats based on difficulty.",
                    description: "When toggled on, the mob's stats will be compared to your own. If it's stronger, the stat will be red, if much weaker, the stat will be green. Stats within your combat range will be yellow.",
                    type: Mods.modOptionsTypes.checkbox,
                    onclick: "javascript: Mods.modOptions_options(&apos;mosmob&apos;,&apos;color&apos;);"
                }
            }
        };
        array.health = {
            id: "health",
            name: "Updated Health Bar",
            shortname: "Health Bar",
            description1: "Will now display health values for you and your target.",
            description2: "You'll see current health values on your and your target's health bars that adjust as you take/deal damage or heal.",
            load: !1,
            loaded: !1,
            newmod: !1,
            updated: !1,
            time: 0,
            options: {
                0: {
                    id: "capitalize",
                    name: "Capitalize your name.",
                    description: "The game's default is to show your name in lower case. Choose this option to have your name shown in proper case.",
                    type: Mods.modOptionsTypes.checkbox,
                    onclick: "javascript: Mods.modOptions_options(&apos;health&apos;,&apos;capitalize&apos;);"
                },
                1: {
                    id: "appearance",
                    name: "Choose how the name/health/level appear.",
                    type: Mods.modOptionsTypes.text,
                    options: {
                        0: {
                            id: "appearance",
                            name: "L1 White Rat (5)",
                            description: "The mob's level will be shown in front of its name, and its current health will be shown in parenthesis.",
                            type: Mods.modOptionsTypes.radio,
                            value: "0",
                            onclick: "javascript: Mods.modOptions_options(&apos;health&apos;,&apos;appearance&apos;);"
                        },
                        1: {
                            id: "appearance",
                            name: "White Rat (5/5)",
                            description: "The mob's level is hidden. Its current and max health are shown in parenthesis as ([current]/[max]).",
                            type: Mods.modOptionsTypes.radio,
                            value: "1",
                            onclick: "javascript: Mods.modOptions_options(&apos;health&apos;,&apos;appearance&apos;);"
                        },
                        2: {
                            id: "appearance",
                            name: "White Rat (5/5 100%)",
                            description: "The mob's level is hidden. Its current, max and percent health are shown in parenthesis as ([current]/[max] [percent]%).",
                            type: Mods.modOptionsTypes.radio,
                            value: "2",
                            onclick: "javascript: Mods.modOptions_options(&apos;health&apos;,&apos;appearance&apos;);"
                        }
                    }
                }
            }
        };
        array.forgem = {
            id: "forgem",
            name: "Forging Interface",
            shortname: "Forge Interface",
            description1: "The forging UI is greatly improved to be easier to use.",
            description2: "You can now learn recipes (by using them once) and then will be able to quickly place/remove mats with a button click.",
            load: !1,
            loaded: !1,
            newmod: !1,
            updated: !1,
            time: 0,
            options: {
                0: {
                    id: "reset",
                    name: "Forget All Recipes",
                    description: "This will delete your entire recipes list, causing you to start with zero recipes known. (You can always relearn any recipe by creating that item again.)",
                    type: Mods.modOptionsTypes.button,
                    onclick: "javascript: Mods.modOptions_options(&apos;forgem&apos;,&apos;reset',true);"
                }
            }
        };
        array.chestm = {
            id: "chestm",
            name: "Chest Interface",
            shortname: "Chest Interface",
            description1: "New options for sorting, withdrawing and depositing.",
            description2: "You have several options for how to sort items, including 'inventory first'; you can also use withdraw 'All' to fill your inventory quickly, or deposit 'All+' to deposit all unequipped items at once. (If you Ctrl+click an item in your inventory, All+ will also ignore that item; this is useful for items that you cannot equip.)",
            load: !1,
            loaded: !1,
            newmod: !1,
            updated: !1,
            time: 0,
            options: {
                0: {
                    id: "sortinv",
                    name: "When sorting the chest, sort inventory items to the top.",
                    type: Mods.modOptionsTypes.checkbox,
                    onclick: "javascript: Mods.modOptions_options(&apos;chestm&apos;,&apos;sortinv&apos;);",
                    options: {
                        0: {
                            id: "0",
                            name: "Choose highlight color.",
                            type: Mods.modOptionsTypes.text,
                            description: "Inventory items in your chest will have the border color you choose.",
                            options: {
                                0: {
                                    id: "chestm_sortinv_color",
                                    name: "No highlight color",
                                    type: Mods.modOptionsTypes.radio,
                                    value: "0",
                                    onclick: "javascript: Mods.modOptions_options(&apos;chestm&apos;,&apos;sortinv&apos;,&apos;color&apos;);"
                                },
                                1: {
                                    id: "chestm_sortinv_color",
                                    type: Mods.modOptionsTypes.radio,
                                    value: "1",
                                    border: "#FFFFFF",
                                    onclick: "javascript: Mods.modOptions_options(&apos;chestm&apos;,&apos;sortinv&apos;,&apos;color&apos;);"
                                },
                                2: {
                                    id: "chestm_sortinv_color",
                                    type: Mods.modOptionsTypes.radio,
                                    value: "2",
                                    border: "#00FF00",
                                    onclick: "javascript: Mods.modOptions_options(&apos;chestm&apos;,&apos;sortinv&apos;,&apos;color&apos;);"
                                },
                                3: {
                                    id: "chestm_sortinv_color",
                                    type: Mods.modOptionsTypes.radio,
                                    value: "3",
                                    border: "#FF00FF",
                                    onclick: "javascript: Mods.modOptions_options(&apos;chestm&apos;,&apos;sortinv&apos;,&apos;color&apos;);"
                                },
                                4: {
                                    id: "chestm_sortinv_color",
                                    type: Mods.modOptionsTypes.radio,
                                    value: "4",
                                    border: "#FFFF00",
                                    onclick: "javascript: Mods.modOptions_options(&apos;chestm&apos;,&apos;sortinv&apos;,&apos;color&apos;);"
                                }
                            }
                        }
                    }
                },
                1: {
                    id: "sortfav",
                    name: "When sorting the chest, sort favorited items to the top.",
                    type: Mods.modOptionsTypes.checkbox,
                    onclick: "javascript: Mods.modOptions_options(&apos;chestm&apos;,&apos;sortfav&apos;);",
                    options: {
                        0: {
                            id: "0",
                            name: "Choose highlight color.",
                            type: Mods.modOptionsTypes.text,
                            description: "Favorited items in your chest will have the border color you choose.",
                            options: {
                                0: {
                                    id: "chestm_sortfav_color",
                                    name: "No highlight color",
                                    type: Mods.modOptionsTypes.radio,
                                    value: "0",
                                    onclick: "javascript: Mods.modOptions_options(&apos;chestm&apos;,&apos;sortfav&apos;,&apos;color&apos;);"
                                },
                                1: {
                                    id: "chestm_sortfav_color",
                                    type: Mods.modOptionsTypes.radio,
                                    value: "1",
                                    border: "#FFFFFF",
                                    onclick: "javascript: Mods.modOptions_options(&apos;chestm&apos;,&apos;sortfav&apos;,&apos;color&apos;);"
                                },
                                2: {
                                    id: "chestm_sortfav_color",
                                    type: Mods.modOptionsTypes.radio,
                                    value: "2",
                                    border: "#00FF00",
                                    onclick: "javascript: Mods.modOptions_options(&apos;chestm&apos;,&apos;sortfav&apos;,&apos;color&apos;);"
                                },
                                3: {
                                    id: "chestm_sortfav_color",
                                    type: Mods.modOptionsTypes.radio,
                                    value: "3",
                                    border: "#FF00FF",
                                    onclick: "javascript: Mods.modOptions_options(&apos;chestm&apos;,&apos;sortfav&apos;,&apos;color&apos;);"
                                },
                                4: {
                                    id: "chestm_sortfav_color",
                                    type: Mods.modOptionsTypes.radio,
                                    value: "4",
                                    border: "#FFFF00",
                                    onclick: "javascript: Mods.modOptions_options(&apos;chestm&apos;,&apos;sortfav&apos;,&apos;color&apos;);"
                                }
                            }
                        }
                    }
                },
                2: {
                    id: "hidecheckbox",
                    name: "Hide additional sorting option checkboxes.",
                    type: Mods.modOptionsTypes.checkbox,
                    onclick: "javascript: Mods.modOptions_options(&apos;chestm&apos;,&apos;hidecheckbox&apos;);"
                },
                3: {
                    id: "gearsort",
                    name: "Choose how gear is sub-sorted.",
                    description: "Gear is already sorted by chategory (armor vs weapon vs jewelry). But can be further sub-sorted based on one of the following parameters.",
                    type: Mods.modOptionsTypes.text,
                    options: {
                        0: {
                            id: "gearsort",
                            name: "Sort by minimum level requirement.",
                            type: Mods.modOptionsTypes.radio,
                            value: "0",
                            onclick: "javascript: Mods.modOptions_options(&apos;chestm&apos;,&apos;gearsort&apos;);"
                        },
                        1: {
                            id: "gearsort",
                            name: "Sort by armor type.",
                            type: Mods.modOptionsTypes.radio,
                            value: "1",
                            onclick: "javascript: Mods.modOptions_options(&apos;chestm&apos;,&apos;gearsort&apos;);"
                        },
                        2: {
                            id: "gearsort",
                            name: "Sort by primary stat bonus.",
                            type: Mods.modOptionsTypes.radio,
                            value: "2",
                            onclick: "javascript: Mods.modOptions_options(&apos;chestm&apos;,&apos;gearsort&apos;);"
                        }
                    }
                },
                4: {
                    id: "allplus",
                    name: "Hide the All+ deposit option.",
                    type: Mods.modOptionsTypes.checkbox,
                    onclick: "javascript: Mods.modOptions_options(&apos;chestm&apos;,&apos;allplus&apos;);"
                }
            }
        };
        array.rclick = {
            id: "rclick",
            name: "Right-Click Menu Extensions",
            shortname: "RightClick Menu Extensions",
            description1: "Right-clicking on mobs: 'Drops', 'Combat Analysis' and wiki access.",
            description2: "These are new menu options when you right click on mobs. Item Drops shows all items the mob is able to drop (and accurate drop rates); Combat Analysis shows the expected amount of damage that you and the mob will do. Right click on items/mobs allows wiki search. On a player, allows whispering. On inventory items allow to destroy all similar items and to search wiki. Additionally, this mod will show gathering success rates when used on mining nodes, trees, and fishing spots.",
            load: !1,
            loaded: !1,
            newmod: !1,
            updated: !1,
            time: 0,
            options: {
                0: {
                    id: "dropitem",
                    name: "Choose what the item 'Drops' option shows.",
                    type: Mods.modOptionsTypes.text,
                    options: {
                        0: {
                            id: "0",
                            name: "Show 'Wiki' drop rates.",
                            description: "The drop rates shown on the wiki are not accurate because they are not adjusted to the accurate in-game values. By default, this mod shows the adjusted drop rates. However, turning this option on will show the un-adjusted (aka 'wiki') rates.",
                            type: Mods.modOptionsTypes.checkbox,
                            onclick: "javascript: Mods.modOptions_options(&apos;rclick&apos;,&apos;dropitem&apos;,&apos;0&apos;);"
                        }
                    }
                },
                1: {
                    id: "combat",
                    name: "Choose what the 'Combat Analysis' option shows.",
                    type: Mods.modOptionsTypes.text,
                    options: {
                        0: {
                            id: "0",
                            name: "Average damage",
                            description: "This shows the actual average damage (over a large number of fights) that can be expected with your current gear. It takes into account that damage can never be less than 0. For example, a mob that normally hits you for 0, will sometimes hit you for more than 0. So its average damage has to be greater than 0.",
                            type: Mods.modOptionsTypes.checkbox,
                            onclick: "javascript: Mods.modOptions_options(&apos;rclick&apos;,&apos;combat&apos;,&apos;0&apos;);"
                        },
                        1: {
                            id: "1",
                            name: "Chance to hit for zero",
                            description: "A 'miss' is a hit of zero (when you or the enemy take 0 damage). The higher this rate is, the more likely a miss will occur.",
                            type: Mods.modOptionsTypes.checkbox,
                            onclick: "javascript: Mods.modOptions_options(&apos;rclick&apos;,&apos;combat&apos;,&apos;1&apos;);"
                        },
                        2: {
                            id: "2",
                            name: "Max damage",
                            description: "Max damage is the highest possible melee hit that you or your enemy can do. You should avoid fighting a mob whose max hit is greater than your current health.",
                            type: Mods.modOptionsTypes.checkbox,
                            onclick: "javascript: Mods.modOptions_options(&apos;rclick&apos;,&apos;combat&apos;,&apos;2&apos;);"
                        },
                        3: {
                            id: "3",
                            name: "Ave. hits to kill",
                            description: "Assuming you and the enemy start at full health, this is approximately how many hits it will normally take for one of you to kill the other.",
                            type: Mods.modOptionsTypes.checkbox,
                            onclick: "javascript: Mods.modOptions_options(&apos;rclick&apos;,&apos;combat&apos;,&apos;3&apos;);"
                        },
                        4: {
                            id: "4",
                            name: "Ave. time to kill",
                            description: "Assuming you and the enemy start at full health, this is approximately how many seconds it will normally take for one of you to kill the other.",
                            type: Mods.modOptionsTypes.checkbox,
                            onclick: "javascript: Mods.modOptions_options(&apos;rclick&apos;,&apos;combat&apos;,&apos;4&apos;);"
                        }
                    }
                }
            }
        };
        array.magicm = {
            id: "magicm",
            name: "Magic Damage Interface",
            shortname: "Magic Interface",
            description1: "Magic damage done now appears over the enemy.",
            description2: "When you cast spells, you will see the amount of damage they do appear over the enemy's head. Additionally, new keybinds are available for magic spells: 7 8 9 0 as well as the number pad 1 2 3 4.",
            load: !1,
            loaded: !1,
            newmod: !1,
            updated: !1,
            time: 0
        };
        array.wikimd = {
            id: "wikimd",
            name: "In-Game Wiki",
            shortname: "In-Game Wiki",
            description1: "An in-game wiki will now be available in this menu.",
            description2: "You can use the wiki to browse the game's database for items/monsters/vendors to see information like stats, drops, vendor availability/prices, and craft recipes. There are plenty of options for searching the wiki (such as by name, by min-skill requirement, by type, etc) to make navigating it and finding what you're looking for easier. On crafting recipes, you can look at crafting formula or learn the formula for later use in the Forge Mod.",
            load: !1,
            loaded: !1,
            newmod: !1,
            updated: !1,
            time: 0
        };
        array.miscmd = {
            id: "miscmd",
            name: "Miscellaneous Improvements",
            shortname: "Miscellaneous",
            description1: "Various improvements of the game's UI.",
            description2: "These are 'small' mods that didn't require individual load options. Included at the moment: 1) Indicators for items that will be saved upon death, 2) Toolbar at the top showing various useful information.",
            load: !1,
            loaded: !1,
            newmod: !1,
            updated: !1,
            time: 0
        };
        array.chatmd = {
            id: "chatmd",
            name: "Chat Extensions",
            shortname: "Chat Extensions",
            description1: "Adds chat filters and commands.",
            description2: "A new chat filter (found in the Filters menu) has been added that blocks 'spam' messages, including: 'I think I'm missing something.' 'Cannot do that yet.' 'You are under attack!' 'You feel a bit better.' and 'It's a [object name]'; in addition, when you do /online, your friends will be yellow colored, and mods/admins as well with green/orange colors. Another option allows to enable links in chat. The mod also adds newbie tips, shown every 10 minutes (can be disabled from game options). Also, you can right-click a player's name in chat window to ignore, add/remove as friend. Also chat commands (ping, played, wiki...) are added.",
            load: !1,
            loaded: !1,
            newmod: !1,
            updated: !1,
            time: 0
        };
        array.farming = {
            id: "farming",
            name: "Farming Improvements",
            shortname: "Farming Mod",
            description1: "Adds the ability to 'queue' farming actions.",
            description2: "Queued farming actions (seeding, harvesting and raking) will occur automatically once you are no longer busy with the previous action. You can queue one plot at a time, or the entire farm, if you like. Additional keybinds include: Ctrl (to queue actions) and Space (to toggle between Active and Paused). Also, the Island Deed now sends you on a path straight to the sign for a quick exist.",
            load: !1,
            loaded: !1,
            newmod: !1,
            updated: !1,
            time: 0
        };
        if (Mods.modOptions != array) for (var index in array) {
            null == Mods.modOptions[index] && (Mods.modOptions[index] = array[index], Mods.modOptions[index].newmod = !0);
            for (var e in array[index]) null == Mods.modOptions[index][e] && (Mods.modOptions[index][e] = array[index][e], 
            Mods.modOptions[index].updated = !0), Mods.modOptions[index][e] != array[index][e] && "boolean" != typeof array[index][e] && (Mods.modOptions[index][e] = array[index][e], 
            Mods.modOptions[index][e].updated = !0);
        }
    };
    Mods.modOptionsVersion();
    Mods.modOptionsLoad = function() {
        var data = {}, elem = {}, obj = {}, options = {}, y;
        for (y in Mods.modOptions) data[Mods.modOptions[y].id] = Mods.modOptions[y].load, 
        obj[Mods.modOptions[y].id] = Mods.modOptions[y].newmod;
        localStorage.modOptionsLoad = localStorage.modOptionsLoad || JSON.stringify(data);
        localStorage.modOptionsNewmod = localStorage.modOptionsNewmod || JSON.stringify(obj);
        var elem = JSON.parse(localStorage.modOptionsLoad), options = JSON.parse(localStorage.modOptionsNewmod), key;
        for (key in data) Mods.modOptions[key].load = "boolean" == typeof elem[key] ? elem[key] : data[key], 
        Mods.modOptions[key].newmod = "boolean" == typeof options[key] ? options[key] : obj[key];
    };
    Mods.modOptionsLoad();
    Mods.loadModsSelectAll = function(checked) {
        for (var len in Mods.modOptions) getElem("checkbox_" + Mods.modOptions[len].id).checked = checked;
    };
    Mods.loadSelectedMods = function(id) {
        if ("undefined" != typeof id && void 0 != Mods.modOptions[id]) {
            if (!Mods.modOptions[id].loaded) {
                Mods.failedLoad(id);
                Timers.set("failed_load_mods", function() {
                    Mods.failedLoad(!0);
                }, 1500);
                Mods.loadMod(id);
                Mods.modOptions[id].loaded = !0;
                var el = capitaliseFirstLetter(id);
                Mods.loadedMods.push(el);
            }
            Mods.modOptions[id].newmod = !1;
            Mods.modOptions[id].updated = !1;
            for (el = getElem("row_" + id); el.firstChild; ) el.removeChild(el.firstChild);
            createElem("td", el, {
                style: "padding-top: 8px; padding-bottom: 0px; font-weight: bold;",
                innerHTML: Mods.modOptions[id].name + "<span style='color:#FFFFFF; font-weight:normal;'>" + (Mods.modOptions[id].loaded ? " (loaded)" : "") + (Mods.modOptions[id].newmod ? " ** New **" : Mods.modOptions[id].updated ? " ** Updated **" : "") + "</span>",
                setAttributes: {
                    colSpan: "3"
                }
            });
            getElem("mods_menu_newmods").style.display = "none";
            getElem("mods_menu_updated").style.display = "none";
            var data = JSON.parse(localStorage.modOptionsLoad), scripts = JSON.parse(localStorage.modOptionsNewmod);
            data[id] = !0;
            scripts[id] = !1;
        } else {
            var data = {}, scripts = {}, s;
            for (s in Mods.modOptions) {
                !getElem("checkbox_" + Mods.modOptions[s].id).checked || -1 != Mods.loadedMods.indexOf(capitaliseFirstLetter(s)) || Mods.modOptions[s].requires && -1 == Mods.loadedMods.indexOf(Mods.modOptions[s].requires) || (Mods.failedLoad(s), 
                Timers.set("failed_load_mods", function() {
                    Mods.failedLoad(!0);
                }, 1500), Mods.loadMod(Mods.modOptions[s].id), Mods.modOptions[s].loaded = !0, el = capitaliseFirstLetter(s), 
                Mods.loadedMods.push(el));
                data[Mods.modOptions[s].id] = getElem("checkbox_" + Mods.modOptions[s].id).checked;
                Mods.modOptions[s].newmod = !1;
                scripts[Mods.modOptions[s].id] = !1;
                Mods.modOptions[s].updated = !1;
                for (el = getElem("row_" + Mods.modOptions[s].id); el.firstChild; ) el.removeChild(el.firstChild);
                createElem("td", el, {
                    style: "padding-top: 8px; padding-bottom: 0px; font-weight: bold;",
                    innerHTML: Mods.modOptions[s].name + "<span style='color:#FFFFFF; font-weight:normal;'>" + (Mods.modOptions[s].loaded ? " (loaded)" : "") + (Mods.modOptions[s].newmod ? " ** New **" : Mods.modOptions[s].updated ? " ** Updated **" : "") + "</span>",
                    setAttributes: {
                        colSpan: "3"
                    }
                });
            }
            getElem("mods_menu_newmods").style.display = "none";
            getElem("mods_menu_updated").style.display = "none";
        }
        localStorage.modOptionsLoad = JSON.stringify(data);
        localStorage.modOptionsNewmod = JSON.stringify(scripts);
    };
    Mods.loadMod = function(ff) {
        Mods.modOptions[ff].loaded || (Load[ff](), Mods.modOptions[ff].loaded = !0, Mods.modOptionsOptionsDisplay(ff));
    };
    Mods.loadModMenu_options = function() {
        getElem("mod_load_options").style.display = "none";
        getElem("mod_load_mods_options").style.display = "none";
        getElem("mod_options_options").style.display = "block";
        getElem("mod_options_mods_options").style.display = "block";
        Mods.modOptionsOptionsDisplay("expbar");
    };
    Mods.loadModMenu_load = function() {
        getElem("mod_load_options").style.display = "block";
        getElem("mod_load_mods_options").style.display = "block";
        getElem("mod_options_options").style.display = "none";
        getElem("mod_options_mods_options").style.display = "none";
    };
    Mods.modOptionsOptionsDisplay = function(id) {
        for (var len in Mods.modOptions) getElem("mod_options_options_" + Mods.modOptions[len].id).style.display = "none";
        getElem("mod_options_options_" + id).style.display = "block";
        Mods.modOptions[id].loaded ? (getElem("mod_options_options_" + id + "_loaded").style.display = "block", 
        getElem("mod_options_options_" + id + "_notloaded").style.display = "none") : (getElem("mod_options_options_" + id + "_loaded").style.display = "none", 
        getElem("mod_options_options_" + id + "_notloaded").style.display = "block");
    };
    Mods.loadNewMods = function() {
        var state = getElem("checkbox_enable_newmods").checked;
        if (state) for (var len in Mods.modOptions) Mods.modOptions[len].newmod && (getElem("checkbox_" + Mods.modOptions[len].id).checked = !0);
        localStorage.loadNewMods = JSON.stringify(state);
    };
    Mods.loadModOptions = function() {
        createElem("div", wrapper, {
            id: "mods_form",
            className: "menu scrolling_allowed",
            onmousedown: function(evt) {
                evt = evt || window.event;
                this.coordinates = {
                    dx: (parseInt(this.style.left) || 0) - evt.clientX,
                    dy: (parseInt(this.style.top) || 0) - evt.clientY
                };
                this.canMove = !0;
            },
            onmousemove: function(e) {
                e = e || window.event;
                this.canMove && "mods_wiki_name" != e.target.id && "mods_wiki_level_low" != e.target.id && "mods_wiki_level_high" != e.target.id && (this.style.left = Math.min(window.innerWidth - 200, Math.max(-200, e.clientX + this.coordinates.dx)) + "px", 
                this.style.top = Math.min(window.innerHeight - 170, Math.max(-170, e.clientY + this.coordinates.dy)) + "px");
            },
            onmouseup: function(evt) {
                this.canMove = !1;
            },
            style: "z-index: 99999; position: absolute; left: 100px; top: 75px; width: 400px; overflowY: auto;",
            innerHTML: "<span id='mods_form_top' class='common_border_bottom' style='margin-bottom:4px;'><span style='float:left; font-weight: bold; color:#FFFF00; margin-bottom:3px;'>Mods Info</span><span id='mods_menu_load' class='common_link' onclick='javascript:Mods.loadModMenu_load();' style='float:left; margin:0px; margin-left:42px;'>Load Mods</span><span id='mods_menu_options' class='common_link' onclick='javascript:Mods.loadModMenu_options(); 'style='float:left; margin:0px; margin-left:46px;'>Mod Options</span><span id = 'mod_options_close' class='common_link' style='margin: 0px; margin-bottom: 2px;' onclick='javascript:addClass(getElem(&apos;mods_form&apos;),&apos;hidden&apos;);'>Close</span></span>"
        });
        createElem("div", "mods_form", {
            id: "mod_load_mods_options",
            className: "common_border_bottom",
            style: "width: 100%; min-height: 24px; margin-bottom: 5px; font-size: .8em; display: block",
            innerHTML: "<button id='mods_menu_load_all' class='market_select pointer' onclick='javascript:Mods.loadModsSelectAll(true);' style='float:left; margin:0px; margin-left:5px;'>Select All</button><button id='mods_menu_load_none' class='market_select pointer' onclick='javascript:Mods.loadModsSelectAll(false);' style='float:left; margin:0px; margin-left:6px;'>Select None</button><button id ='mods_menu_load_selected' class='market_select pointer' style='margin: 0px; margin-bottom: 2px;' onclick='javascript:Mods.loadSelectedMods();'>Load Selected</button>"
        });
        createElem("div", "mods_form", {
            id: "mod_load_options",
            className: "scrolling_allowed",
            style: "display: block; height: 250px; overflow-x: hidden;",
            innerHTML: "<span style='color:yellow; font-size:.8em; font-weight:bold; padding-left:4px;'>Mod Pack version " + Mods.version + " (created by Dendrek &amp; WitWiz -  Maintained by RStudios) </span><table id='mod_options_table' cellspacing='0' style='font-size: 0.8em; width:100%; margin-top:5px;'><tr id='mods_menu_newmods' style='color:#00FF00; font-weight:bold; display:none;'><td colspan='3'>** New Mod(s) Available! **<span style='color:#FFFFFF; float:right; font-weight:normal; margin-top:2px;'>Always enable new mods</span><input type='checkbox' id='checkbox_enable_newmods' style='width:.8em; height:.8em; float:right;' onclick='javascript:Mods.loadNewMods();'></td></tr><tr id='mods_menu_updated' style='color:#00FF00; font-weight:bold; display:none;'><td colspan='3'>** Mod(s) Updated! ** &nbsp;&nbsp;&nbsp;<span style='font-weight:normal; color:#FFFFFF; float:right;'>(reload your browser to enable the updates)</span></td></tr></table>"
        });
        createElem("div", "mods_form", {
            id: "mod_options_options",
            className: "common_border_right",
            style: "width: 26%; height: 0px; padding-bottom: 4px; font-size: .8em; float: left; display: none; border-top: 1px solid #666666; border-right: 1px solid #666666; border-bottom: 1px solid #666666; overflow-x: hidden;"
        });
        createElem("div", "mods_form", {
            id: "mod_options_mods_options",
            className: "scrolling_allowed",
            style: "width: 72.4%; min-height: 100%; margin-left: 1%; display: none; float: left; border-top: 1px solid #666666; border-left: 1px solid #666666; border-bottom: 1px solid #666666"
        });
        createElem("span", "mod_options_options", {
            id: "mod_options_name_title",
            style: "size: .8em; display: inline-block; float: left; clear: left; margin: 0px; margin-bottom: 14px; width: 98px; padding-top: 10px; padding-left: 6px; font-weight: bold; color: yellow",
            innerHTML: "Mod Options"
        });
        var r = !0, e = "", s;
        for (s in Mods.modOptions) {
            Mods.modOptions[s].newmod && (getElem("mods_menu_newmods").style.display = "");
            Mods.modOptions[s].updated && !Mods.modOptions[s].newmod && (getElem("mods_menu_updated").style.display = "");
            e = (r = !1, "");
            createElem("tr", "mod_options_table", {
                id: "row_" + Mods.modOptions[s].id,
                style: "font-size: 1em; color: #FF0; background-color: " + e
            });
            createElem("td", "row_" + Mods.modOptions[s].id, {
                colSpan: "3",
                style: "font-weight: bold; padding: 6px 6px 0px 6px; border-top: 1px solid #666;",
                innerHTML: Mods.modOptions[s].name + "<span style='color:#FFFFFF; font-weight:normal;'>" + (Mods.modOptions[s].loaded ? " (loaded)" : "") + (Mods.modOptions[s].newmod ? " ** New **" : Mods.modOptions[s].updated ? " ** Updated **" : "") + "</span>"
            });
            var arg = "getElem(&apos;r2_td1_" + Mods.modOptions[s].id + "&apos;).style.paddingBottom", len = "getElem(&apos;r2_td2_" + Mods.modOptions[s].id + "&apos;).style.paddingBottom", option = "getElem(&apos;row3_" + Mods.modOptions[s].id + "&apos;).style.display";
            createElem("tr", "mod_options_table", {
                id: "row2_" + Mods.modOptions[s].id,
                style: "font-size: 1em; color: #FFF; font-weight: normal; background-color: " + e
            });
            createElem("td", "row2_" + Mods.modOptions[s].id, {
                id: "r2_td1_" + Mods.modOptions[s].id,
                style: "width: 15px; padding: 0px 0px 6px 6px;",
                innerHTML: "<input id='checkbox_" + Mods.modOptions[s].id + "' type='checkbox' style='width:.8em; height:.8em; margin-right:6px;'>"
            });
            createElem("td", "row2_" + Mods.modOptions[s].id, {
                id: "r2_td2_" + Mods.modOptions[s].id,
                colSpan: "2",
                style: "padding: 0px 0px 6px 6px;",
                innerHTML: Mods.modOptions[s].description1 + "<span class='common_link' onclick='javascript: ( " + option + " == &apos;none&apos; ) ? ( " + option + " = &apos;&apos;, " + arg + " = " + len + " = &apos;0px&apos; ) : ( " + option + " = &apos;none&apos;, " + arg + " = " + len + " = &apos;6px&apos; );' style='float:right; margin:0px;'>(more info)</span>"
            });
            createElem("tr", "mod_options_table", {
                id: "row3_" + Mods.modOptions[s].id,
                style: "color: #FFF; background-color: " + e + "; display: none;"
            });
            createElem("td", "row3_" + Mods.modOptions[s].id);
            createElem("td", "row3_" + Mods.modOptions[s].id, {
                colSpan: "2",
                style: "padding: 0px 0px 6px 0px;",
                innerHTML: Mods.modOptions[s].description2
            });
            createElem("span", "mod_options_options", {
                id: "mod_options_name_" + Mods.modOptions[s].id,
                className: "common_link",
                style: "size: .8em; display: inline-block; float: left; clear: left; margin: 0px; padding: 8px 0px 10px 6px; width: 90%; border-top: 1px solid #666;",
                innerHTML: Mods.modOptions[s].shortname,
                onclick: function() {
                    Mods.modOptionsOptionsDisplay(Mods.modOptions[s].id);
                }
            });
            createElem("div", "mod_options_mods_options", {
                id: "mod_options_options_" + Mods.modOptions[s].id,
                style: "padding-top: 10px; padding-left: 5%; width: 95%; height: 95%; font-size: .8em; display: none;",
                innerHTML: "<span style='color:yellow; font-weight:bold; float:left;'>" + Mods.modOptions[s].name + " Options</span><span id='mod_options_options_" + Mods.modOptions[s].id + "_notloaded' style='margin-top:41px; width:100%; float:left; clear:left;'><span style='float:left; margin-bottom:4px; text-align:center; width:91%; '>The " + Mods.modOptions[s].name.toLowerCase() + " mod is not loaded...</span><button id='mod_options_options_load_" + Mods.modOptions[s].id + "' class='market_select pointer' type='button' style='font-size:1.25em; margin:0px; width:80px; left:45%; margin-left:-40px; float:left; clear:left; display:block; position:relative;' onclick='javascript:Mods.loadSelectedMods(&apos;" + s + "&apos;);'>Load Mod</button></span><span id='mod_options_options_" + Mods.modOptions[s].id + "_loaded' style='margin-top:6px; margin-bottom:6px; width:100%; float:left; clear:left; display:none;'><table id='mod_options_options_" + Mods.modOptions[s].id + "_table' style='font-size: 0.8em; width:100%;'><tr><td style='width:17px;'></td><td style='width:17px;'></td><td style='width:17px;'></td><td></td></table></span>"
            });
            r = !r;
            getElem("checkbox_enable_newmods").checked && Mods.modOptions[s].newmod && (Mods.modOptions[s].load = !0);
            getElem("checkbox_" + Mods.modOptions[s].id).checked = Mods.modOptions[s].load;
        }
        r = !1;
        for (s in Mods.modOptions) r && (getElem("mod_options_options_" + Mods.modOptions[s].id).style.display = "none"), 
        "block" == getElem("mod_options_options_" + Mods.modOptions[s].id).style.display && (r = !0);
        r || (getElem("mod_options_options_expbar").style.display = "block");
        Mods.modOptions.wikimd.loaded && (getElem("mods_form_top").innerHTML = "<span style='float:left; font-weight: bold; color:#FFFF00; margin-bottom:3px;'>Mods Info</span><span id='mods_menu_load' class='common_link' onclick='javascript:Mods.loadModMenu_load();' style='float:left; margin:0px; margin-left: 42px;'>Load</span><span id='mods_menu_options' class='common_link' onclick='javascript:Mods.loadModMenu_options(); ' style='float:left; margin:0px; margin-left: 45px;'>Options</span><span id='mods_menu_load' class='common_link' onclick='javascript:Mods.loadModMenu_wiki();' style='float:left; margin:0px; margin-left: 41px;'>Wiki</span><span id='mod_options_close' class='common_link' style='margin: 0px; margin-bottom: 2px;' onclick='javascript:addClass(getElem(&apos;mods_form&apos;),&apos;hidden&apos;);'>Close</span>", 
        getElem("mods_form").style.width = "464px", getElem("mods_form").style.marginLeft = "-225px", 
        Mods.Wikimd.loadDivs(), Mods.loadModMenu_options = function() {
            getElem("mod_load_options").style.display = "none";
            getElem("mod_load_mods_options").style.display = "none";
            getElem("mod_options_options").style.display = "block";
            getElem("mod_options_mods_options").style.display = "block";
            getElem("mod_wiki_options").style.display = "none";
            getElem("mod_wiki_mods_options").style.display = "none";
            Mods.modOptionsOptionsDisplay("expbar");
        }, Mods.loadModMenu_load = function() {
            getElem("mod_load_options").style.display = "block";
            getElem("mod_load_mods_options").style.display = "block";
            getElem("mod_options_options").style.display = "none";
            getElem("mod_options_mods_options").style.display = "none";
            getElem("mod_wiki_options").style.display = "none";
            getElem("mod_wiki_mods_options").style.display = "none";
        }, Mods.loadModMenu_wiki = function() {
            getElem("mod_load_options").style.display = "none";
            getElem("mod_load_mods_options").style.display = "none";
            getElem("mod_options_options").style.display = "none";
            getElem("mod_options_mods_options").style.display = "none";
            getElem("mod_wiki_options").style.display = "block";
            getElem("mod_wiki_mods_options").style.display = "block";
        });
        disable_options && (getElem("mods_menu_options").className = "", getElem("mods_menu_options").onclick = function() {}, 
        getElem("mods_menu_options").style.fontWeight = "bold", getElem("mods_menu_options").style.color = "#999999");
    };
    Mods.initializeOptionsMenu = function() {
        var url = "", data = Mods.modOptions, target = "", index = 0, prefix;
        for (prefix in data) if (void 0 != data[prefix].options) {
            var modules = data[prefix].options, id;
            for (id in modules) if (void 0 != modules[id].id && (url = prefix + "_" + modules[id].id, 
            target = modules[id], index = 0, Mods.populateOptionsMenu(url, target, index, data[prefix].id), 
            void 0 != modules[id].options)) {
                var list = modules[id].options, k;
                for (k in list) if (void 0 != list[k].id && (url = prefix + "_" + id + "_" + list[k].id, 
                target = list[k], index = 1, Mods.populateOptionsMenu(url, target, index, data[prefix].id), 
                void 0 != list[k].options)) {
                    var children = list[k].options, key;
                    for (key in children) void 0 != children[key].id && (url = prefix + "_" + id + "_" + k + "_" + children[key].id, 
                    target = children[key], index = 2, Mods.populateOptionsMenu(url, target, index, data[prefix].id));
                }
            }
        } else url = prefix + "_0options", target = null, index = 0, Mods.populateOptionsMenu(url, target, index, data[prefix].id);
    };
    Mods.populateOptionsMenu = function(id, obj, c, priority) {
        if (null != obj) {
            var options = obj.type, values = "mod_options_options_row_" + id, pp = "id='mod_options_options_" + id + "' ", value = "<" + options.createElement + (void 0 != obj.value ? " value='" + obj.value + "' " : " "), len = void 0 != options["class"] ? "class='" + options["class"] + "' " : "", data = "style='' ", color = void 0 != obj.onclick ? "onclick='" + obj.onclick + "'>" : "'>", handler = void 0 != options.closeElement ? "</" + options.closeElement + "></td>" : "</td>", head = "", body = "", row = "";
            id = "mod_options_options_row2_" + id + (void 0 != obj.value ? "_" + obj.value : "");
            var html = "", r = 0, m = 0, k;
            for (k in options.style) data = data.slice(0, -2) + k + ":" + options.style[k] + ";' ";
            "all" == options.opt_span ? r = 4 - c : (r = 1, m = 4 - (c + r));
            void 0 != obj.description && (row = "<span class='common_link' onclick='javascript:getElem(&apos;" + id + "&apos;).style.display = getElem(&apos;" + id + "&apos;).style.display == &apos;none&apos;? &apos;&apos;:&apos;none&apos;' style='float:right; margin:0px;'>(more info)</span></td>", 
            html = "<td colspan='" + c + "'></td><td colspan='" + (4 - c) + "'><span>" + obj.description + "</span></td>");
            "text" == options.type ? head = obj.name + row : "button" == options.type ? (head = obj.name, 
            body = row + "</td>", handler = void 0 != options.closeElement ? "</" + options.closeElement + ">" : "") : body = void 0 != obj.border ? "<div style='height:10px; width:40px; margin-top:1px; border:1px solid " + obj.border + ";'></div>" : void 0 != obj.background ? "<div style='height:11px; width:40px; margin-top:1px; background:" + obj.border + ";'></div>" : "<td colspan='" + m + "'><span>" + obj.name + "</span>" + row;
            c = 0 < c ? "<td colspan='" + c + "'><td colspan='" + r + "'>" : "<td colspan='" + r + "'>";
        } else values = "mod_options_options_row_" + id, pp = "mod_options_options_" + id, 
        value = "<span ", len = "", data = "style='' ", color = ">", handler = "</span></td>", 
        head = "This mod does not have any options that can be changed.", body = "", id = "mod_options_options_row2_" + id, 
        html = "", c = "<td colspan='4'>";
        obj = document.createElement("tr");
        obj.id = values;
        obj.innerHTML = c + value + pp + len + data + color + head + handler + body;
        obj.style.marginTop = "12px";
        getElem("mod_options_options_" + priority + "_table").appendChild(obj);
        c = document.createElement("tr");
        c.id = id;
        c.innerHTML = html;
        c.style.display = "none";
        getElem("mod_options_options_" + priority + "_table").appendChild(c);
        c = document.createElement("tr");
        c.innerHTML = "&nbsp;";
        c.style.fontSize = ".3em";
        getElem("mod_options_options_" + priority + "_table").appendChild(c);
    };
    Mods.loadOptionsMenu = function(IMAGE) {
        var internalCommit = !0;
        void 0 != Mods.modOptions[IMAGE] && (internalCommit = !1);
        for (var type in Mods.modOptions) {
            var obj = Mods.modOptions[type];
            if ((!internalCommit && type == IMAGE || internalCommit) && void 0 != obj.options && obj.loaded) {
                var obj = obj.options, data = JSON.parse(localStorage[type + "_options"]), id;
                for (id in obj) if ("radio" == obj[id].type.type ? (getElem("mod_options_options_" + type + "_" + obj[id].id).value = data[type][obj[id].id] || 0, 
                Mods.modOptions_options(type, obj[id].id)) : "checkbox" == obj[id].type.type && (getElem("mod_options_options_" + type + "_" + obj[id].id).checked = data[type][obj[id].id] || !1, 
                Mods.modOptions_options(type, obj[id].id)), void 0 != obj.options) {
                    var children = obj.options, key;
                    for (key in children) "radio" == children[key].type.type ? (getElem("mod_options_options_" + type + "_" + id + "_" + children[key].id).value = data[type][id][children[key].id] || 0, 
                    Mods.modOptions_options(type, obj[id].id, children[key].id)) : "checkbox" == children[key].type.type && (getElem("mod_options_options_" + type + "_" + id + "_" + children[key].id).checked = data[type][id][children[key].id] || !1, 
                    Mods.modOptions_options(type, obj[id].id, children[key].id));
                }
            }
        }
    };
    Mods.modOptions_options = function(hash, key, e) {};
    Load.variables();
    Load.functions();
};

Load.functions = function() {
    Mods.consoleLog = function(message) {
        iOS || Android || console.log(message);
    };
    Mods.failedLoad = function(c) {
        if (!0 === c) {
            c = !0;
            var msg = "", uuidNow;
            for (uuidNow in Mods.failedToLoad) modOptions[uuidNow] && (c = !1, msg += modOptions[uuidNow].name + ", ");
            msg = c ? "Mods loaded and ready: RPG MO Mods Pack version " + Mods.version : "Mod failed to load: " + msg.slice(0, -2) + ". Please inform the mod developers (RStudios, Dendrek or WitWiz). Try reloading the game and do not load this mod until this issue can be fixed.";
            quiet_mod_load || addChatText(msg, void 0, COLOR.TEAL);
        } else Mods.failedToLoad[c] = 1;
    };
    Mods.timestamp = function(params) {
        delete Mods.failedToLoad[params];
        Mods.consoleLog(params + " loaded (" + Math.round((timestamp() - modOptions[params].time) / 10) / 100 + "s)");
    };
    Mods.findWithAttr = function(obj, key, func) {
        for (var idx in obj) if (obj[idx][key] == func) return idx;
    };
    ChatSystem.toggle = function() {
        var val;
        -1 != Mods.loadedMods.indexOf("Wikimd") && (val = Mods.Wikimd.chatSystemToggle());
        val || captcha || (Mods.chatSystemToggle(), -1 != Mods.loadedMods.indexOf("Tabs") && (val = GAME_STATE == GAME_STATES.CHAT ? getAbsoluteHeight(my_text) : 0, 
        Mods.Tabs.resize(val)));
    };
    Chat.set_hidden = function() {
        if (-1 != loadedMods.indexOf("Chatmd") && 0 == Mods.Chatmd.set_hidden() || 0 == Mods.set_hidden()) return !1;
        -1 != loadedMods.indexOf("Tabs") && (getElem("tabs").style.visibility = "hidden", 
        getElem("chat_resize").style.visibility = "hidden");
    };
    Mods.cleanText = function(txt, indent_level, text) {
        indent_level ? txt = txt.replace(/['"]/g, "*") : text ? txt.replace(/'/g, "\\'").replace(/"/g, '\\"') : txt = txt.replace(/'/g, "&apos;").replace(/"/g, "&quot;");
        return txt;
    };
    Mods.timeConvert = function(s, y, cell) {
        var p, v, value;
        v = {
            year: 31536e3,
            day: 86400,
            hour: 3600,
            minute: 60,
            second: 1
        };
        s = (0 < s ? s : 0) - (0 < y ? y : 0);
        value = "";
        s = 1e3 === cell || .001 === cell ? s / 1e3 : 60 === cell || 3600 === cell ? s * cell : s;
        for (p in v) 1 <= s / v[p] && (y = Math.floor(s / v[p]), s -= y * v[p], value += y + " " + p + sOrNoS(y) + ", ");
        return value = value.slice(0, -2);
    };
    Mods.UpdateBase = Mods.UpdateBase || updateBase;
    updateBase = function() {
        Mods.UpdateBase();
    };
    Mods.CustomMenu = Mods.CustomMenu || ActionMenu.custom_create;
    ActionMenu.custom_create = function(p, c) {
        Mods.CustomMenu(p, c);
        var element = getElem("action_menu");
        element.offsetTop + element.offsetHeight > window.innerHeight && (element.style.top = window.innerHeight - element.offsetHeight + "px");
    };
    inventoryClick = function(b) {
        Mods.oldInventoryClick(b);
        -1 !== Mods.loadedMods.indexOf("Gearmd") && Mods.Gearmd.inventoryClick();
        -1 !== Mods.loadedMods.indexOf("Miscmd") && Mods.Miscmd.inventoryClick();
    };
    setCanvasSize = function(canvas) {
        Mods.oldCanvasSize(canvas);
        Mods.setCanvasSize();
    };
    Mods.setCanvasSize = function() {
        for (var cc = 0; 3 > cc; cc++) Mods.fontSize[cc] = Math.min(1, Math.round((1 + .4 * (cc - 1)) * current_ratio_y * 10) / 10) + "em";
        for (var c in loadedMods) cc = loadedMods[c], "undefined" != typeof Mods[cc] && "undefined" != typeof Mods[cc].setCanvasSize && Mods[cc].setCanvasSize();
        getElem("object_selector_info", {
            style: {
                left: Math.ceil(320 * current_ratio_x) + "px",
                width: "20%",
                height: "auto",
                textAlign: "center"
            }
        });
        getElem("market_offer_popup") && hasClass(getElem("market"), "hidden") && Mods.Newmarket.hidedetails();
        -1 != Mods.loadedMods.indexOf("Tabs") && Mods.Tabs.resize();
    };
    Inventory.equip = function(self, messageType, message) {
        if (!Mods.inventoryEquip(self, messageType, message)) return Mods.oldInventoryEquip(self, messageType, message);
    };
    Mods.inventoryEquip = function(obj, callback, scope) {
        var r = !1, key;
        for (key in loadedMods) {
            var h1 = loadedMods[key];
            "undefined" != typeof Mods[h1] && "undefined" != typeof Mods[h1].inventoryEquip && (r = !0 === Mods[h1].inventoryEquip(obj, callback, scope) || !0 === r ? !0 : !1);
        }
        return r;
    };
    document.addEventListener("keyup", function(event) {
        Mods.eventListener("keyup", event.keyCode, keyMap.action(event));
    });
    document.addEventListener("keydown", function(event) {
        Mods.eventListener("keydown", event.keyCode, keyMap.action(event));
    });
    Mods.currentSocket = function(target) {
        "object" === typeof target && target.action && Mods.socketOn(target.action, target.data, target);
    };
    Mods.socketOn = function(b, c, cmd) {
        for (var f in loadedMods) void 0 !== Mods[loadedMods[f]].socketOn && -1 !== Mods[loadedMods[f]].socketOn.actions.indexOf(b) && Mods[loadedMods[f]].socketOn.fn(b, c, cmd);
    };
    socket.on("message", Mods.currentSocket);
    switchWorldBugFix = function() {
        socket.removeListener("message", Mods.currentSocket);
        socket.on("message", Mods.currentSocket);
    };
    Mods.eventListener = function(idx, key, value) {
        for (var path in loadedMods) void 0 === Mods[loadedMods[path]].eventListener || !Mods[loadedMods[path]].eventListener.keys[idx] || !0 !== Mods[loadedMods[path]].eventListener.keys[idx][0] && -1 === Mods[loadedMods[path]].eventListener.keys[idx].indexOf(key) && -1 == Mods[loadedMods[path]].eventListener.keys[idx].indexOf(value) || Mods[loadedMods[path]].eventListener.fn(idx, key, value);
    };
};

Load.variables = function() {
    Mods.loadedMods = Mods.loadedMods || [];
    loadedMods = Mods.loadedMods;
    localStorage.enableNewMods = localStorage.enableNewMods || "false";
    Mods.disableInvClick = !1;
    KEY_ACTION.CTRL = 145;
    keyMap.keys[1][17] = KEY_ACTION.CTRL;
    keyMap.keys[1][91] = KEY_ACTION.CTRL;
    Mods.oldCanvasSize = Mods.oldCanvasSize || setCanvasSize;
    Mods.oldInventoryEquip = Mods.oldInventoryEquip || Inventory.equip;
    Mods.failedToLoad = Mods.failedToLoad || {};
    Mods.set_hidden = Mods.set_hidden || Chat.set_hidden;
    Mods.fontSize = Mods.fontSize || {
        0: .7,
        1: 1,
        2: 1.3
    };
    Mods.marketReplace = {
        " Of": ":",
        "'": "`",
        Necklace: "Neck.",
        Medallion: "Medal.",
        "Platinum ": "Plat. ",
        "Pet ": "",
        " Scroll": "",
        "Enchanted ": "Ench. ",
        Platemail: "Plate.",
        Helmet: "Helm.",
        "Superior ": "Sup. ",
        " Permission": "",
        Defense: "Def.",
        Accuracy: "Acc.",
        Strength: "Str.",
        Farming: "Farm.",
        Woodcutting: "WC.",
        Jewelry: "Jewel.",
        Cooking: "Cook.",
        Carpentry: "Carp.",
        Alchemy: "Alch.",
        "Fishing ": "Fish. ",
        " Fishing": " Fish.",
        "Medium ": "Med. ",
        Teleport: "Tele."
    };
    Mods.oldInventoryClick = inventoryClick;
    Mods.chatSystemToggle = Mods.chatSystemToggle || ChatSystem.toggle;
    getElem("inventory").style.zIndex = "199";
    Mods.Health = Mods.Health || {};
    Mods.Health.old_inAFight = Mods.Health.old_inAFight || BigMenu.in_a_fight;
    Mods.Rclick = Mods.Rclick || {};
    Mods.Rclick.oldActionMenu = Mods.Rclick.oldActionMenu || ActionMenu.create;
    Mods.Rclick.oldInvMenu = Mods.Rclick.oldInvMenu || InvMenu.create;
    localStorage.infopanelmode = localStorage.infopanelmode || 0;
    Mods.Mosmob = Mods.Mosmob || {};
    Mods.regular_onmousemove = Mods.regular_onmousemove || regular_onmousemove;
    Mods.Tabs = Mods.Tabs || {};
    Mods.Newmarket = Mods.Newmarket || {};
    Mods.Newmarket.submitHolder = Mods.Newmarket.submitHolder || {};
    Mods.Newmarket.submitSorted = Mods.Newmarket.submitSorted || [];
    Mods.Newmarket.submitQueued = Mods.Newmarket.submitQueued || !1;
    Mods.Newmap = Mods.Newmap || {};
    Mods.Kbind = Mods.Kbind || {};
    Mods.Tabs.oldremove_channel = Mods.Tabs.oldremove_channel || Contacts.remove_channel;
    Mods.Tabs.oldadd_channel = Mods.Tabs.oldadd_channel || Contacts.add_channel;
    Mods.Tabs.wwMaxTabs = 8;
    Mods.Tabs.wwCurrentTabs = Mods.Tabs.wwCurrentTabs || [];
    Mods.Tabs.wwTabContent = Mods.Tabs.wwTabContent || [];
    Mods.Tabs.chat_size_percent = .3;
    Mods.Tabs.chat_resize_timestamp = timestamp();
    localStorage.chestInv_color = localStorage.chestInv_color || JSON.stringify("#C000FF");
    localStorage.chestFav_color = localStorage.chestFav_color || JSON.stringify("#FF8000");
    localStorage.chest_colCheck = localStorage.chest_colCheck || "true";
    localStorage.chest_colCheckF = localStorage.chest_colCheckF || "true";
    localStorage.sortFav_check = localStorage.sortFav_check || "false";
    localStorage.sortInv_check = localStorage.sortInv_check || "false";
    localStorage.chestArmorPriority = localStorage.chestArmorPriority || "false";
    localStorage.chestCraftPriority = localStorage.chestCraftPriority || "false";
    localStorage.chestPricePriority = localStorage.chestPricePriority || "false";
    localStorage.chestPlayerPriorities && "{object Object}" == localStorage.chestPlayerPriorities && delete localStorage.chestPlayerPriorities;
    localStorage.chestPlayerPriorities = localStorage.chestPlayerPriorities || JSON.stringify({});
    localStorage.avoidAll = localStorage.avoidAll || JSON.stringify({});
    Mods.Chestm = Mods.Chestm || {};
    Mods.Chestm.chest_item_id = Mods.Chestm.chest_item_id || 0;
    Mods.Chestm.tempChest = Mods.Chestm.tempChest || {};
    Mods.Chestm.inv_select_color = JSON.parse(localStorage.chestInv_color);
    Mods.Chestm.fav_select_color = JSON.parse(localStorage.chestFav_color);
    Mods.Chestm.chest_colCheck = JSON.parse(localStorage.chest_colCheck);
    Mods.Chestm.chest_colCheckF = JSON.parse(localStorage.chest_colCheckF);
    Mods.Chestm.chest_sort_hidden = !0;
    Mods.Chestm.sortFav_check = JSON.parse(localStorage.sortFav_check);
    Mods.Chestm.sortInv_check = JSON.parse(localStorage.sortInv_check);
    Mods.Chestm.armorPriority = JSON.parse(localStorage.chestArmorPriority);
    Mods.Chestm.craftPriority = JSON.parse(localStorage.chestCraftPriority);
    Mods.Chestm.pricePriority = JSON.parse(localStorage.chestPricePriority);
    Mods.Chestm.playerPriorities = JSON.parse(localStorage.chestPlayerPriorities);
    Mods.Chestm.currentChestPage = 1;
    Mods.Chestm.chestArmorPriorities = {
        5: 0,
        0: 1,
        2: 2,
        1: 3,
        7: 4,
        6: 5,
        3: 6,
        8: 7,
        4: 8
    };
    Mods.Chestm.chestCraftPriorities = {
        3: 0,
        8: 1,
        4: 2,
        7: 3,
        5: 4,
        0: 5,
        2: 6,
        1: 7,
        6: 8
    };
    Mods.Chestm.materialsPriorities = {
        Jewel: 0,
        Cut: 1,
        Uncut: 2,
        ore: 3,
        Chunk: 3,
        Sand: 3,
        Clay: 3,
        Copper: 3,
        Zinc: 3,
        Coal: 3,
        Bar: 4,
        Mould: 4,
        Log: 5,
        Wood: 5,
        Vial: 6,
        Raw: 7,
        Feather: 8,
        Egg: 9,
        Scale: 10,
        Eye: 11,
        Soil: 12,
        Leaf: 12,
        Seed: 12,
        Grass: 12,
        Hay: 12,
        Wheat: 12,
        Enchant: 13,
        Teleport: 14
    };
    Mods.Chestm.ctrlPressed = !1;
    Mods.Chestm.avoidAll = Mods.Chestm.avoidAll || JSON.parse(localStorage.avoidAll);
    localStorage.RECIPE_LIST = localStorage.RECIPE_LIST || JSON.stringify([]);
    localStorage.RECIPE_U_LIST = localStorage.RECIPE_U_LIST || JSON.stringify({});
    Mods.Forgem = Mods.Forgem || {};
    Mods.Forgem.toForgeItem = Mods.Forgem.toForgeItem || -1;
    Mods.Forgem.FORGE_MATERIALS_LIST = Mods.Forgem.FORGE_MATERIALS_LIST || [];
    Mods.Forgem.FORGE_MAT_LIST = Mods.Forgem.FORGE_MAT_LIST || {};
    Mods.Forgem.RECIPE_LIST = JSON.parse(localStorage.RECIPE_LIST) || [];
    Mods.Forgem.RECIPE_U_LIST = JSON.parse(localStorage.RECIPE_U_LIST) || {};
    Mods.Forgem.oldDrop = Mods.Forgem.oldDrop || Forge.drop;
    Mods.Forgem.oldSelect = Mods.Forgem.oldSelect || Forge.select;
    Mods.Forgem.oldOpen = Mods.Forgem.oldOpen || Forge.forge_open;
    localStorage.expSkillSet = localStorage.expSkillSet || "health";
    Mods.Expbar = Mods.Expbar || {};
    Mods.Expbar.set_skill = localStorage.expSkillSet;
    localStorage.autocastenabled = localStorage.autocastenabled || JSON.stringify(1);
    getElem("options_form");
    Mods.Autocast = Mods.Autocast || {};
    Mods.Autocast.lastFullCast = timestamp();
    Mods.Autocast.enabled = JSON.parse(localStorage.autocastenabled);
    --Mods.Autocast.enabled;
    Mods.Kbind = Mods.Kbind || {};
    Mods.showBag = void 0 == Mods.showBag ? !1 : Mods.showBag;
    Mods.Kbind.lastfoodeaten = timestamp();
    Mods.Expmonitor = Mods.Expmonitor || {};
    Mods.Expmonitor.XPEventSeconds = Mods.Expmonitor.XPEventSeconds || 0;
    Mods.Expmonitor.LastLogin = Mods.Expmonitor.LastLogin || timestamp();
    Mods.Expmonitor.LastXpRequest = Mods.Expmonitor.LastXpRequest || timestamp();
    localStorage.announceBlock = localStorage.announceBlock || JSON.stringify([]);
    localStorage.tradechatmode = localStorage.tradechatmode || 0;
    localStorage.marketpopup = localStorage.marketpopup || !1;
    Mods.Newmarket.times = Mods.Newmarket.times || JSON.parse(localStorage.announceBlock);
    Mods.Newmarket.announceList = Mods.Newmarket.announceList || {};
    Mods.Newmarket.max_lines = 2 + 2 * players[0].params.market_offers / 5;
    Mods.Newmarket.announces = Mods.Newmarket.announces || {
        messages: [],
        count: 0
    };
    Mods.Newmarket.states = Mods.Newmarket.states || {};
    Mods.Newmarket.submitHolder = [];
    Mods.Newmarket.tradechatmode = JSON.parse(localStorage.tradechatmode);
    --Mods.Newmarket.tradechatmode;
    Mods.Newmarket.infopannelmode = JSON.parse(localStorage.infopanelmode);
    --Mods.Newmarket.infopannelmode;
    Mods.Newmarket.popup = JSON.parse(localStorage.marketpopup);
    localStorage.fullscreenenabled = localStorage.fullscreenenabled ? localStorage.fullscreenenabled : JSON.stringify(1);
    Mods.Fullscreen = Mods.Fullscreen || {};
    Mods.Fullscreen.iMapBegin = Mods.Fullscreen.iMapBegin || iMapBegin;
    Mods.Fullscreen.jMapBegin = Mods.Fullscreen.jMapBegin || jMapBegin;
    Mods.Fullscreen.iMapTo = Mods.Fullscreen.iMapTo || iMapTo;
    Mods.Fullscreen.jMapTo = Mods.Fullscreen.jMapTo || jMapTo;
    Mods.Fullscreen.astarsearchOld = Mods.Fullscreen.astarsearchOld || astar.search;
    Mods.Fullscreen.enabled = JSON.parse(localStorage.fullscreenenabled);
    --Mods.Fullscreen.enabled;
    localStorage.enableShiftClick = localStorage.enableShiftClick || !1;
    Mods.Petinv = Mods.Petinv || {};
    Mods.Petinv.enableShiftClick_check = JSON.parse(localStorage.enableShiftClick);
    Mods.Petinv.invSendItem = !1;
    Mods.Petinv.petInv_toggle = players[0].pet.enabled ? !0 : !1;
    Mods.Magicm = Mods.Magicm || {};
    Mods.Magicm.enemy = Mods.Magicm.enemy || {};
    Mods.Magicm.magic_damage_timers = Mods.Magicm.magic_damage_timers || {
        0: 0,
        1: 0,
        2: 0,
        3: 0
    };
    Mods.Wikimd = Mods.Wikimd || {};
    Mods.Wikimd.newWikiLoad = Mods.Wikimd.newWikiLoad || {};
    Mods.Wikimd.oldWikiLoad = Mods.Wikimd.oldWikiLoad || {};
    Mods.Wikimd.item_formulas = Mods.Wikimd.item_formulas || {};
    Mods.Wikimd.item_slots = {
        0: "Helm",
        1: "Cape",
        2: "Chest",
        3: "R.Hand",
        4: "L.Hand",
        5: "Glove",
        6: "Boots",
        7: "Neck",
        8: "Ring",
        9: "none",
        10: "Magic",
        11: "Pants"
    };
    Mods.Wikimd.oldSortList = Mods.Wikimd.oldSortList || [];
    Mods.Wikimd.oldSortValue = Mods.Wikimd.oldSortValue || "";
    Mods.Wikimd.newSortValue = Mods.Wikimd.newSortValue || "";
    Mods.Wikimd.oldSort = Mods.Wikimd.oldSort || {};
    Mods.Wikimd.oldSort = {
        item: Mods.Wikimd.oldSort.item || "name",
        monster: Mods.Wikimd.oldSort.monster || "name",
        vendor: Mods.Wikimd.oldSort.vendor || "name",
        craft: Mods.Wikimd.oldSort.craft || "name",
        pet: Mods.Wikimd.oldSort.pet || "name",
        spell: Mods.Wikimd.oldSort.spell || "name",
        enchant: Mods.Wikimd.oldSort.enchant || "name"
    };
    Mods.Wikimd.formulas = Mods.Wikimd.formulas || {};
    Mods.Wikimd.span = {
        item: {
            wiki_r1_c0: {
                c: 2,
                r: 2
            },
            wiki_r1_c3: {
                c: 2
            }
        },
        monster: {
            wiki_r2_c1: {
                c: 5
            }
        },
        vendor: {
            wiki_r1_c0: {
                c: 2
            },
            wiki_r1_c1: {
                c: 5
            }
        },
        craft: {
            wiki_r1_c0: {
                c: 2
            },
            wiki_r2_c0: {
                c: 2
            },
            wiki_r2_c1: {
                c: 5
            }
        },
        pet: {
            wiki_r2_c1: {
                c: 5
            }
        },
        spell: {
            wiki_r1_c0: {
                r: 2
            }
        },
        enchant: {
            wiki_r2_c2: {
                c: 5
            }
        }
    };
    Mods.Wikimd.mouse = {
        x: 0,
        y: 0
    };
    Mods.Wikimd.pet_family = Mods.Wikimd.pet_family || {};
    Mods.Wikimd.family = Mods.Wikimd.family || {};
    LazyLoad.css(cdn_url + "mod.css?v=" + mod_version, function() {
        Mods.consoleLog("CSS Loaded");
    });
    localStorage.activeQuest = localStorage.activeQuest || JSON.stringify(!1);
    localStorage.penalty_bonus = localStorage.penalty_bonus || JSON.stringify("health");
    localStorage.audioVolume = localStorage.audioVolume || "50";
    Mods.Miscmd = Mods.Miscmd || {};
    Mods.Miscmd.ideath = Mods.Miscmd.ideath || {};
    Mods.Miscmd.ideath.inventory = [];
    Mods.Miscmd.ideath.bgColor = "#3A6";
    Mods.Miscmd.ideath.brColor = "inherit";
    Mods.Miscmd.toolbar = Mods.Miscmd.toolbar || {};
    Mods.Miscmd.toolbar.oldDrawMap = Mods.Miscmd.toolbar.oldDrawMap || drawMap;
    Mods.Miscmd.toolbar.xpmessage = [ "Current experience rate is 2x" ];
    Mods.Miscmd.toolbar.ids = {
        playerLocation: "td_location",
        playerStats: "td_stats",
        questData: "td_quests",
        currentTime: "td_time",
        invSlots: "td_inventory",
        dpsinfo: "td_dpsinfo"
    };
    Mods.Miscmd.toolbar.oldInventoryAdd = Mods.Miscmd.toolbar.oldInventoryAdd || Inventory.add;
    Mods.Miscmd.toolbar.oldInventoryRemove = Mods.Miscmd.toolbar.oldInventoryRemove || Inventory.remove;
    Mods.Miscmd.toolbar.activeQuest = Mods.Miscmd.toolbar.activeQuest || JSON.parse(localStorage.activeQuest);
    Mods.Miscmd.toolbar.oldQuestsShowActive = Mods.Miscmd.toolbar.oldQuestsShowActive || Quests.show_active;
    Mods.Miscmd.penalty = Mods.Miscmd.penalty || JSON.parse(localStorage.penalty_bonus);
    Mods.Miscmd.oldPenaltyBonus = Mods.Miscmd.oldPenaltyBonus || penalty_bonus;
    Mods.Miscmd.potions = Mods.Miscmd.potions || {};
    Mods.Miscmd.adps = [];
    Mods.Miscmd.maxtime = 18e4;
    Mods.Miscmd.avgdps = 0;
    Mods.Miscmd.maxdps = 0;
    Mods.Miscmd.avgexp = 0;
    Mods.Miscmd.dpsmode = !1;
    Mods.Miscmd.lastSkill = {};
    Mods.Miscmd.changeVolume = Mods.Miscmd.changeVolume || {};
    localStorage.colorChannel = localStorage.colorChannel || JSON.stringify(!1);
    localStorage.highlightFriends = localStorage.highlightFriends || JSON.stringify(!0);
    localStorage.timer = localStorage.timer && "object" == typeof JSON.parse(localStorage.timer) && localStorage.timer || JSON.stringify({
        start: {},
        set: {}
    });
    localStorage.tipsenabled = localStorage.tipsenabled ? localStorage.tipsenabled : JSON.stringify(0);
    localStorage.enableallchatts = localStorage.enableallchatts ? localStorage.enableallchatts : JSON.stringify(0);
    Mods.Chatmd = Mods.Chatmd || {};
    Mods.Chatmd.addChatText = Mods.Chatmd.addChatText || addChatText;
    Mods.Chatmd.ping = 0;
    Mods.Chatmd.colors = {
        EN: "#FFFFFF",
        ST: "#D4D4D4",
        18: "#99FFC6",
        $$: "#F2A2F2",
        "{M}": "#EAE330",
        "default": "#FFDFC0",
        none: "#DDDD69"
    };
    Mods.Chatmd.default_channels = {
        $$: 1,
        18: 1,
        AR: 1,
        BR: 1,
        CZ: 1,
        DE: 1,
        EN: 1,
        E2: 1,
        E3: 1,
        E4: 1,
        E5: 1,
        E6: 1,
        E7: 1,
        E8: 1,
        E9: 1,
        ES: 1,
        ET: 1,
        FI: 1,
        FR: 1,
        HU: 1,
        IT: 1,
        JP: 1,
        KO: 1,
        NL: 1,
        NO: 1,
        PL: 1,
        RO: 1,
        RU: 1,
        SV: 1,
        ST: 1,
        TH: 1,
        TR: 1,
        TW: 1
    };
    Mods.Chatmd.runTimer = Mods.Chatmd.runTimer || JSON.parse(localStorage.timer);
    Mods.Chatmd.ModCh = Mods.Chatmd.ModCh || {};
    Mods.Chatmd.ModCh.delay = Mods.Chatmd.ModCh.delay || !1;
    Mods.Chatmd.ModCh.channel = "{M}";
    Mods.Chatmd.ModCh.regular_onclick = Mods.Chatmd.ModCh.regular_onclick || regular_onclick;
    chat_filters.mod = !1;
    Mods.Chatmd.afkHolder = Mods.Chatmd.afkHolder || {};
    Mods.Chatmd.afkMessage = Mods.Chatmd.afkMessage || "";
    Mods.Chatmd.whispNames = Mods.Chatmd.whispNames || [];
    Mods.Chatmd.cycleWhisper = Mods.Chatmd.cycleWhisper || !0;
    Mods.Chatmd.oldDrawObject = Mods.Chatmd.oldDrawObject || drawObject;
    Mods.Chatmd.mooDelay = Mods.Chatmd.mooDelay || {};
    Mods.Chatmd.blockCommand = !1;
    Mods.Chatmd.enableallchatts = JSON.parse(localStorage.enableallchatts);
    --Mods.Chatmd.enableallchatts;
    Mods.Chatmd.tipsenabled = JSON.parse(localStorage.tipsenabled);
    --Mods.Chatmd.tipsenabled;
    Mods.Tabs.set_visible = Mods.Tabs.set_visible || Chat.set_visible;
    Mods.Tabs.chatMovement = Mods.Tabs.chatMovement || -1;
    Mods = Mods || {};
    Mods.Farming = Mods.Farming || {};
    Mods.Farming.queue = Mods.Farming.queue || {};
    Mods.Farming.sortedQueue = Mods.Farming.sortedQueue || [];
    Mods.Farming.ctrlPressed = Mods.Farming.ctrlPressed || !1;
    Mods.Farming.queueHidden = Mods.Farming.queueHidden || !1;
    Mods.Farming.queuePaused = Mods.Farming.queuePaused || !1;
    Mods.Farming.oldDefault = Mods.Farming.oldDefault || {
        rake: DEFAULT_FUNCTIONS.rake,
        seed: DEFAULT_FUNCTIONS.seed,
        harvest: DEFAULT_FUNCTIONS.harvest
    };
    Mods.Farming.oldInventoryEquip = Mods.Farming.oldInventoryEquip || Inventory.equip;
    Mods.Farming.oldMoveInPath = Mods.Farming.oldMoveInPath || moveInPath;
    localStorage.farming_options = localStorage.farming_options || JSON.stringify({});
    Mods.Farming.options = Mods.Farming.options || JSON.parse(localStorage.farming_options);
    Mods.Farming.farming_queue_template = Handlebars.compile("<span style='width: 100%; display: block; float: left; color: #FF0; font-weight: bold; border-bottom: 1px solid #DDD; padding-bottom: 5px; margin-bottom: 2px;'>Farming Queue <span class='common_link' style='margin: 0; font-weight: normal; float: right;' onclick='Mods.Farming.queueOptions(true);'>(options)</span></span><span id='mods_farming_queue' style='width: 100%; float: left; display: block; margin-bottom: 2px; padding-bottom: 2px; overflow-y: hidden;'><span style='width: 100%; float: left; display: inline-block; font-weight: bold; color: #999;'><span style='float: left;'>Action:&nbsp;&nbsp;Object</span><span style='float: right;'>Coords</span></span></span><span style='width: 100%; float: left; display: inline-block; border-bottom: 1px solid #DDD; margin-bottom: 2px; padding-bottom: 4px;'><span style='float: left;'>Queued:&nbsp;<span id='mods_farming_total'>0</span></span><span class='common_link' style='margin: 0; float: right; display: block; font-weight: normal;' onclick='Mods.Farming.cancelQueue()'>(clear)</span></span><span style='color: #FF0;'>Action: <span id='mods_farming_action' style='color: #FFF; font-weight: normal;'>Active</span></span><span id='farming_queue_button' class='common_link' style='margin: 0; float: right; display: block; font-weight: normal;' onclick='Mods.Farming.pauseQueue(this)'>(queue)</span>");
    Mods.Farming.farming_queue_action_template = Handlebars.compile("<span id='mods_farming_{{slot}}' style='width: 100%; float: left; display: inline-block; font-weight: normal;'><span>{{action}}:&nbsp;&nbsp;{{object}}</span><span style='float: right;'>({{i}}, {{j}})</span></span>");
    Mods.Farming.farming_queue_option_template = Handlebars.compile("<span style='color: #FF0; font-weight: bold; width: 100%; float: left; margin-bottom: 2px; padding-bottom: 5px; border-bottom: 1px solid #DDD;'>Farming Options</span><table style='color: #DDD;'><tr><td colspan='2'><div id='mods_farming_opt_hide' class='common_link' style='margin: 4px;' onclick='Mods.Farming.hideQueue()'>Hide queued window</div></td></tr><tr><td><input type='checkbox' id='mods_farming_opt_equipped' style='width: .8em; height: .8em;'></td><td><div style='margin: 3px;'>Meet requirements to queue action</div></td></tr><tr><td><input type='checkbox' id='mods_farming_opt_stop' style='width: .8em; height: .8em;'></td><td><div style='margin: 3px;'>Stop movement while queuing</div></td></tr><tr><td><input type='checkbox' id='mods_farming_opt_save' style='width: .8em; height: .8em;'></td><td><div style='margin: 3px;'>Save queue when leaving island</div></td></tr><tr><td colspan='2'><div style='margin: 3px;'>Ctrl: Toggle Queuing</div></td></tr><tr><td colspan='2'><div style='margin: 3px;'>Space: Toggle Active/Paused</div></td></tr></table>");
};

Load.rclick = function() {
    modOptions.rclick.time = timestamp();
    ActionMenu.mobDrops = function(v, ipt) {
        var name = "";
        if (ipt == BASE_TYPE.OBJECT) {
            var level = object_base[v].name;
            addChatText(level + " drops:", void 0, COLOR.ORANGE);
            for (var row in object_base[v].params.results) {
                var data = {}, next, f, n = 0;
                next = 0;
                f = object_base[v].params.results[row].returns;
                for (var index in f) {
                    var level = object_base[v].params.results[row].skill, level = skills[0][level].current > skills[0][level].level ? skills[0][level].current : skills[0][level].level, max = f[index].chance || level >= f[index].level && void 0 != f[index].max_chance && Math.min(f[index].base_chance + (level - f[index].level) / 100, f[index].max_chance) || Math.min(level >= f[index].level && f[index].base_chance + (level - f[index].level) / 100, 1) || 0;
                    data[item_base[f[index].id].name] = {
                        percent: max * (1 - next),
                        xp: "undefined" == typeof f[index].xp ? "" : "(" + f[index].xp + "xp) "
                    };
                    "undefined" != typeof f[index].xp && (n += f[index].xp * max * (1 - next));
                    next += data[item_base[f[index].id].name].percent;
                }
                next = 0;
                for (index in data) name = name + index + " " + Math.round(1e4 * data[index].percent) / 100 + "% " + data[index].xp + "- ", 
                next += data[index].percent;
                name = 0 < Math.round(1e4 * (1 - next)) / 100 ? name + "No loot " + Math.round(1e4 * (1 - next)) / 100 + "%" : name.slice(0, -3);
                0 < n && (n = Math.round(100 * n) / 100, name = name + "; avg: " + n + "xp");
                name += ". ";
                addChatText(name, void 0, COLOR.WHITE);
                name = "";
            }
        } else if (ipt == BASE_TYPE.NPC) {
            if (npc_base[v].type == OBJECT_TYPE.SHOP) {
                data = {};
                level = npc_base[v].name;
                for (n in npc_base[v].temp.content) row = npc_base[v].temp.content[n], 0 < row.count && (data[item_base[row.id].name] = {
                    stock: row.count
                });
                for (index in data) name = name + index + " (" + data[index].stock + ") - ";
                name = "" === name ? "Nothing." : name.slice(0, -3) + ".";
                addChatText(level + " sells:", void 0, COLOR.ORANGE);
            } else {
                data = {};
                next = n = 0;
                f = npc_base[v].params.drops;
                level = npc_base[v].name;
                for (index in f) max = f[index].chance || skills[0][object_base[v].params.results[0].skill].level >= f[index].level && void 0 != f[index].max_chance && Math.min(f[index].base_chance + (skills[0][object_base[v].params.results[0].skill].level - f[index].level) / 100, f[index].max_chance) || Math.min(skills[0][object_base[v].params.results[0].skill].level >= f[index].level && f[index].base_chance + (skills[0][object_base[v].params.results[0].skill].level - f[index].level) / 100, 1) || 0, 
                data[item_base[f[index].id].name] = {
                    percent: max * (1 - next),
                    xp: "undefined" == typeof f[index].xp ? "" : "(" + f[index].xp + "xp) "
                }, "undefined" != typeof f[index].xp && (n += f[index].xp * max * (1 - next)), next += data[item_base[f[index].id].name].percent;
                next = 0;
                for (index in data) name = name + index + " " + Math.round(1e4 * data[index].percent) / 100 + "% " + data[index].xp + "- ", 
                next += data[index].percent;
                name = 0 < Math.round(1e4 * (1 - next)) / 100 ? name + "No loot " + Math.round(1e4 * (1 - next)) / 100 + "%" : name.slice(0, -3);
                addChatText(level + " drops:", void 0, COLOR.ORANGE);
                0 < n && (n = Math.round(100 * n) / 100, name = name + "; avg: " + n + "xp");
                name += ". ";
            }
            addChatText(name, void 0, COLOR.WHITE);
        }
    };
    ActionMenu.combatCheck = function(size) {
        for (var x = 0, w = 0, maxwidth = 0, minwidth = x = 0, maxheight = 0, minheight = 0, widthportion = 0, widthportions = 0, heightportion = 0, heightportions = 0, lessminwidth = 0, lessminHeight = 0, minweight = 0; 2 > minweight; minweight++) 0 == minweight && (minwidth = players[0].temp.total_strength, 
        maxheight = npc_base[size].temp.total_defense, minheight = players[0].temp.total_accuracy), 
        1 == minweight && (minwidth = npc_base[size].temp.total_strength, maxheight = players[0].temp.total_defense, 
        minheight = npc_base[size].temp.total_accuracy), w = Math.ceil(minwidth / 5), x = Math.max(Math.ceil(maxheight - minheight), 0), 
        0 == x ? (maxwidth = .5 * w + 1, x = 0) : 1 < (x - 1) / w ? (maxwidth = (Math.pow(w, 2) + 3 * w + 3) / (6 * x), 
        x = 1 - (w + 2) / (2 * x)) : (maxwidth = .5 * w + 1 - .5 * x - Math.pow(1 - x, 3) / (6 * w * x), 
        x = (Math.pow(x, 2) - 2 * x + 1) / (2 * x * w)), 0 == minweight && (widthportion = maxwidth, 
        widthportions = x, heightportion = w + 1), 1 == minweight && (heightportions = maxwidth, 
        lessminwidth = x, lessminHeight = w + 1);
        var w = players[0].params.magic_slots, minwidth = maxwidth = 0, maxheight = 1 - players[0].params.cooldown, n = 1 - (npc_base[size].temp.magic_block || 0) / 100;
        if (0 < w) for (var name = "", minheight = 0; minheight < w; minheight++) if (minheight < players[0].params.magics.length) var minweight = players[0].params.magics[minheight].id, x = Math.min(1, (players[0].temp.magic / 1.2 + skills[0].magic.current + Magic[minweight].params.penetration) / npc_base[size].temp.total_defense), max = n * Math.round((.5 / 1.333 + .25) * Magic[minweight].params.basic_damage * x) / (Magic[minweight].params.cooldown * maxheight / 1e3), value = Math.ceil(3 / (Magic[minweight].params.cooldown * maxheight / 1e3)), value = n * value * Math.round((1 / 1.333 + .25) * Magic[minweight].params.basic_damage * x), name = name + Magic[minweight].name + " (" + Math.round(100 * x) / 100 + "): " + Math.round(100 * max) / 100 + "/s; ", maxwidth = maxwidth + max, minwidth = minwidth + value;
        var n = npc_base[size].temp.magics && npc_base[size].temp.magics.length || 0, c = maxheight = 0, t = 1 - npc_base[size].temp.cooldown, y = 1 - (players[0].temp.magic_block || 0) / 100;
        if (0 < n) for (var v = "Enemy magic: ", minheight = 0; minheight < n; minheight++) minheight < n && (minweight = npc_base[size].temp.magics[minheight].id, 
        x = Math.min(1, (npc_base[size].temp.magic / 1.2 + Magic[minweight].params.penetration) / players[0].temp.total_defense), 
        max = 1 / Math.ceil(Magic[minweight].params.cooldown * t / 1e3 / 3), max = y * Math.round((.5 / 1.333 + .25) * Magic[minweight].params.basic_damage * x * max / 3 * 100) / 100, 
        value = Math.min(1, Math.ceil(3 / (Magic[minweight].params.cooldown * t / 1e3))), 
        value = y * value * Math.round((1 / 1.333 + .25) * Magic[minweight].params.basic_damage * x), 
        v = v + Magic[minweight].name + " (" + Math.round(100 * x) / 100 + "): " + Math.round(100 * max) / 100 + "/s; ", 
        maxheight += max, c += value);
        lessminwidth = "ENEMY: average damage = " + Math.round(100 * heightportions) / 100 + " + " + Math.round(300 * maxheight) / 100 + "M = " + Math.round(100 * (heightportions + 3 * maxheight)) / 100 + ", chance to hit = " + Math.round(1e4 * (1 - lessminwidth)) / 100 + "%, max damage: " + lessminHeight + " + " + c + "M = " + (lessminHeight + c);
        widthportions = "YOU: average damage = " + Math.round(100 * widthportion) / 100 + " + " + Math.round(300 * maxwidth) / 100 + "M = " + Math.round(100 * (widthportion + 3 * maxwidth)) / 100 + ", chance to hit = " + Math.round(1e4 * (1 - widthportions)) / 100 + "%, max damage: " + heightportion + " + " + minwidth + "M = " + (heightportion + minwidth);
        addChatText("Combat Analysis: " + npc_base[size].name, void 0, COLOR.ORANGE);
        addChatText(lessminwidth, void 0, COLOR.WHITE);
        addChatText(widthportions, void 0, COLOR.WHITE);
        0 < w && (addChatText(name, void 0, COLOR.TEAL), addChatText("Total magic damage: " + Math.round(100 * maxwidth) / 100 + "/s", void 0, COLOR.TEAL));
        0 < n && (addChatText(v, void 0, COLOR.TEAL), addChatText("Total magic damage from enemy: " + Math.round(100 * maxheight) / 100 + "/s", void 0, COLOR.TEAL));
        size = Math.ceil(npc_base[size].temp.health / (widthportion + 3 * maxwidth));
        heightportions = (size - 1) * (heightportions + 3 * maxheight);
        widthportion = 3 * size;
        widthportion = Math.floor(widthportion / 60) + ":" + (10 > parseInt(widthportion % 60, 10) ? "0" : "") + parseInt(widthportion % 60, 10);
        heightportions = "Average per fight: hits: " + Math.round(100 * size) / 100 + ", damage received: " + Math.round(100 * heightportions) / 100 + ", time to kill: " + widthportion;
        addChatText(heightportions, void 0, COLOR.WHITE);
    };
    Contacts.add_channel = function(val) {
        if (Contacts.can_join_channel(val)) {
            if (-1 < loadedMods.indexOf("Tabs")) for (var uuid = 0; uuid < Mods.Tabs.wwCurrentTabs.length; uuid++) Mods.Tabs.wwCurrentTabs[uuid].channels[val] = !0;
            Mods.Tabs.oldadd_channel(val);
        }
    };
    Contacts.remove_channel = function(nid) {
        if (-1 < loadedMods.indexOf("Tabs")) for (var uuid = 0; uuid < Mods.Tabs.wwCurrentTabs.length; uuid++) delete Mods.Tabs.wwCurrentTabs[uuid].channels[nid];
        Mods.Tabs.oldremove_channel(nid);
    };
    InvMenu.create = function(data) {
        Mods.Rclick.oldInvMenu(data);
        data = players[0].temp.inventory[data];
        "undefined" != typeof data && (data = item_base[data.id], d = getElem("action_menu"), 
        -1 < loadedMods.indexOf("Kbind") && (d.innerHTML += "<span class='line' onclick='Mods.destroyallitems(" + data.b_i + ")'>Destroy All<span class='item'>" + Mods.cleanText(data.name) + "</span></span>"), 
        -1 < loadedMods.indexOf("Wikimd") && -1 < loadedMods.indexOf("Chatmd") && (data = data.name.replace(/'/g, "\\&apos;"), 
        d.innerHTML += "<span class='line' onclick='Mods.Chatmd.chatCommands(&apos;/wiki item name " + data + "&apos;);addClass(getElem(&apos;action_menu&apos;), &apos;hidden&apos;)'>Check Wiki<span class='item'>ITEM</span></span><span class='line' onclick='Mods.Chatmd.chatCommands(&apos;/wiki craft item " + data + "&apos;);addClass(getElem(&apos;action_menu&apos;), &apos;hidden&apos;)'>Check Wiki<span class='item'>CRAFT</span></span><span class='line' onclick='Mods.Chatmd.chatCommands(&apos;/wiki npc item " + data + "&apos;);addClass(getElem(&apos;action_menu&apos;), &apos;hidden&apos;)'>Check Wiki<span class='item'>NPC</span></span>"));
    };
    Mods.destroyallitems = function(p) {
        InvMenu.hide();
        "undefined" != typeof p && Popup.prompt("Do you want to destroy all " + item_base[p].name + "?", function() {
            Socket.send("inventory_destroy", {
                item_id: p,
                all: !0
            });
        });
    };
    getElem("action_menu").style.zIndex = "999999999";
    ActionMenu.create = function(settings, options, element) {
        Mods.Rclick.oldActionMenu(settings, options, element);
        if (!element) {
            element = getElem("action_menu");
            addClass(element, "hidden");
            element.style.top = settings.clientY + 10 + "px";
            element.style.left = settings.clientX + "px";
            var collection = settings = "";
            options = "";
            for (var text in players) if ("0" != text && players[text].i == selected_object.i && players[text].j == selected_object.j && players[text].b_t == BASE_TYPE.PLAYER) {
                options = "<span class='line' onclick=\"ChatSystem.whisper('" + players[text].name.sanitize() + "');addClass(getElem(&apos;action_menu&apos;), ";
                options += "&apos;hidden&apos;)\">Whisper <span class='item'>" + players[text].name.sanitize() + "</span></span>";
                break;
            }
            if (1 == selected_object.b_t && void 0 != selected_object.params.results || 4 == selected_object.b_t) settings = "<span class='line' onclick='ActionMenu.mobDrops(" + selected_object.b_i + "," + selected_object.b_t + ");addClass(getElem(&apos;action_menu&apos;), &apos;hidden&apos;)' style='margin-left:-5px;'><span class='item'>" + selected_object.name + "</span>Drops</span>" + ("4" == selected_object.b_t ? "<span class='line' onclick='ActionMenu.combatCheck(" + selected_object.b_i + ");addClass(getElem(&apos;action_menu&apos;), &apos;hidden&apos;)'>Combat Analysis</span>" : ""), 
            modOptions.chatmd.loaded && (selected_object.type == OBJECT_TYPE.SHOP ? (text = selected_object.name.replace(/'/g, "*"), 
            collection = "<span class='line' onclick='Mods.Chatmd.chatCommands(&apos;/wiki npc name " + text + "&apos;);addClass(getElem(&apos;action_menu&apos;), &apos;hidden&apos;)'>Check Wiki<span class='item'>NPC</span></span>") : selected_object.type == OBJECT_TYPE.ENEMY && (text = selected_object.name.replace(/'/g, "*"), 
            collection = "<span class='line' onclick='Mods.Chatmd.chatCommands(&apos;/wiki mob name " + text.replace("[BOSS]", "") + "&apos;);addClass(getElem(&apos;action_menu&apos;), &apos;hidden&apos;)'>Check Wiki<span class='item'>MOB</span></span>"));
            text = ActionMenu.action(selected_object, 0) + ActionMenu.action(selected_object, 1) + settings + collection + options;
            element.innerHTML = text;
            0 < element.innerHTML.length && removeClass(element, "hidden");
        }
    };
    Mods.timestamp("rclick");
};

Load.chestm = function() {
    modOptions.chestm.time = timestamp();
    Chest.open = function(x, flags, mode) {
        chest_content = x;
        chests[0] = x;
        for (var attributes in Mods.Chestm.tempChest) delete Mods.Chestm.tempChest[attributes];
        for (x = 0; x < chests[0].length; x++) Mods.Chestm.tempChest[chest_content[x].id] = x;
        flags && Chest.change_page(chest_page);
        mode && Carpentry.init(mode);
        Chest.sort_player_modChest();
    };
    BigMenu.update_chest = function(result) {
        -1 < navigator.userAgent.search("Chrome") && (Mods.Chestm.inv_select_color = getElem("chest_invColor").value, 
        Mods.Chestm.fav_select_color = getElem("chest_favColor").value);
        Mods.Chestm.chest_colCheck = getElem("chest_colCheck").checked;
        Mods.Chestm.chest_colCheckF = getElem("chest_colCheckF").checked;
        chest_content = result;
        getElem("chest_coins_amount").innerHTML = thousandSeperate(players[0].temp.coins);
        for (var r = chest_page - 1, x = 60 * r, length = Math.min(result.length, 60 * r + 60); x < 60 * r + 60; x++) {
            var node = getElem("chest_" + (x - 60 * r)), id, text, obj;
            if (x < length) {
                text = item_base[result[x].id];
                obj = IMAGE_SHEET[text.img.sheet];
                id = result[x].id;
                node.style.background = 'url("' + obj.url + '") no-repeat scroll ' + -text.img.x * obj.tile_width + "px " + -text.img.y * obj.tile_height + "px transparent";
                node = node.childNodes[0];
                text = result[x].count;
                obj = Inventory.get_item_count(players[0], result[x].id);
                l = "";
                o = 0;
                for (h = 6 - text.toString().length - obj.toString().length; o < h; o++) l += "&nbsp;";
                node.innerHTML = text + l + obj;
            } else id = -1;
            node = getElem("chest_" + (x - 60 * r));
            0 < Inventory.get_item_count(players[0], id) && Mods.Chestm.chest_colCheck ? node.style.borderColor = Mods.Chestm.inv_select_color : node.style.borderColor = Mods.Chestm.chest_colCheckF && Mods.Chestm.playerPriorities[id] ? Mods.Chestm.fav_select_color : "";
            localStorage.chestInv_color = JSON.stringify(Mods.Chestm.inv_select_color);
            localStorage.chestFav_color = JSON.stringify(Mods.Chestm.fav_select_color);
            localStorage.chest_colCheck = JSON.stringify(Mods.Chestm.chest_colCheck);
            localStorage.chest_colCheckF = JSON.stringify(Mods.Chestm.chest_colCheckF);
        }
        BigMenu.update_chest_selection();
        Chest.button_enable_check();
    };
    Chest.mouseoverColor = function(obj, index) {
        var id = obj.id, id = parseInt(id.replace("chest_", "")) + 60 * (parseInt(chest_page) - 1), id = chests[0][id] && chests[0][id].id || !1;
        "" != obj.style.borderColor && 1 == index && (obj.style.borderColor = "#1DEDFF");
        "" != obj.style.borderColor && 0 == index && (obj.style.borderColor = 0 < Inventory.get_item_count(players[0], id) && Mods.Chestm.chest_colCheck && Mods.Chestm.inv_select_color || Mods.Chestm.chest_colCheckF && Mods.Chestm.playerPriorities[id] && Mods.Chestm.fav_select_color || "");
    };
    Chest.button_enable_check = function() {
        var b = chest_page - 1, j = parseInt(selected_chest) + 60 * b;
        if ("undefined" != typeof chest_content[j]) {
            var x = chest_content[j].id, y = getElem("chest_withdraw_item_1"), b = getElem("chest_withdraw_item_8"), c = getElem("chest_withdraw_item_19"), el = getElem("chest_withdraw_item_all"), m = getElem("chest_deposit_item_1"), s = getElem("chest_deposit_item_all"), e = getElem("chest_deposit_item_pet"), f = getElem("chest_destroy_item");
            0 == chest_content[j].count ? (y.className = "", b.className = "", c.className = "", 
            el.className = "", f.className = "", y.onclick = function() {}, b.onclick = function() {}, 
            c.onclick = function() {}, el.onclick = function() {}, f.onclick = function() {}) : (y.className = "link", 
            b.className = "link", c.className = "link", el.className = "link", f.className = "link", 
            y.onclick = function() {
                Chest.withdraw(1);
            }, b.onclick = function() {
                Chest.withdraw(8);
            }, c.onclick = function() {
                Chest.withdraw(19);
            }, el.onclick = function() {
                Chest.withdraw(99);
            }, f.onclick = function() {
                Chest.destroy();
            });
            0 == Inventory.get_item_count(players[0], x) ? (m.className = "", s.className = "", 
            m.onclick = function() {}, s.onclick = function() {}) : (m.className = "link", s.className = "link", 
            m.onclick = function() {
                Chest.deposit(1);
            }, s.onclick = function() {
                Chest.deposit(99);
            });
            b = !1;
            for (j = 0; j < players[0].temp.inventory.length; j++) if (!players[0].temp.inventory[j].selected) {
                b = !0;
                break;
            }
            b ? (e.className = "link", e.onclick = function() {
                Chest.deposit_all();
            }) : (e.className = "", e.onclick = function() {});
        }
    };
    Chest.sort_player_modChest = function() {
        Mods.Chestm.armorPriority = "0" == getElem("chest_sort_category").value ? !0 : !1;
        Mods.Chestm.craftPriority = "1" == getElem("chest_sort_category").value ? !0 : !1;
        Mods.Chestm.pricePriority = "2" == getElem("chest_sort_category").value ? !0 : !1;
        chests[0].sort(function(data, b) {
            Mods.Chestm.sortFav_check = getElem("chest_favCheck").checked;
            Mods.Chestm.sortInv_check = getElem("chest_invCheck").checked;
            var c = item_base[data.id].params.price, keys = item_base[b.id].params.price, p = item_base[data.id].params, k = item_base[b.id].params, x = item_base[data.id].name, y = item_base[b.id].name, n = Mods.Chestm.playerPriorities, p = (k.min_defense || k.min_accuracy || k.min_health || k.min_forging || k.min_jewelry || k.min_cooking || k.min_carpentry || k.min_fishing || k.min_alchemy || k.min_magic || 0) - (p.min_defense || p.min_accuracy || p.min_health || p.min_forging || p.min_jewelry || p.min_cooking || p.min_carpentry || p.min_fishing || p.min_alchemy || p.min_magic || 0), k = item_base[data.id].b_t, m = item_base[b.id].b_t;
            1 == Mods.Chestm.armorPriority ? (k = Mods.Chestm.chestArmorPriorities[k], m = Mods.Chestm.chestArmorPriorities[m]) : 1 == Mods.Chestm.craftPriority ? (k = Mods.Chestm.chestCraftPriorities[k], 
            m = Mods.Chestm.chestCraftPriorities[m]) : 1 == Mods.Chestm.pricePriority && (k = -item_base[data.id].params.price, 
            m = -item_base[b.id].params.price);
            if (1 == Mods.Chestm.sortFav_check && "undefined" != typeof n[data.id] && "undefined" == typeof n[b.id]) return -1;
            if (1 == Mods.Chestm.sortFav_check && "undefined" == typeof n[data.id] && "undefined" != typeof n[b.id]) return 1;
            if (1 == Mods.Chestm.sortInv_check && 0 < Inventory.get_item_count(players[0], data.id) && 0 == Inventory.get_item_count(players[0], b.id)) return -1;
            if (1 == Mods.Chestm.sortInv_check && 0 == Inventory.get_item_count(players[0], data.id) && 0 < Inventory.get_item_count(players[0], b.id)) return 1;
            if (k == m) {
                if (3 == item_base[data.id].b_t && !Mods.Chestm.pricePriority) {
                    var n = item_base[data.id].name, k = item_base[b.id].name, other = m = -1, e;
                    for (e in Mods.Chestm.materialsPriorities) -1 < n.search(e) && (m = Mods.Chestm.materialsPriorities[e]), 
                    -1 < k.search(e) && (other = Mods.Chestm.materialsPriorities[e]);
                    if (-1 != m && -1 == other) return -1;
                    if (-1 == m && -1 != other) return 1;
                    if (m < other) return -1;
                    if (m > other) return 1;
                }
                return 0 < p ? 1 : 0 > p || c > keys ? -1 : c < keys ? 1 : x > y ? -1 : x < y ? 1 : 0;
            }
            return k < m ? -1 : k > m ? 1 : x > y ? -1 : x < y ? 1 : 0;
        });
        BigMenu.update_chest(chests[0], Mods.Chestm.currentChestPage);
        localStorage.sortFav_check = Mods.Chestm.sortFav_check;
        localStorage.sortInv_check = Mods.Chestm.sortInv_check;
        localStorage.chestArmorPriority = Mods.Chestm.armorPriority;
        localStorage.chestCraftPriority = Mods.Chestm.craftPriority;
        localStorage.chestPricePriority = Mods.Chestm.pricePriority;
    };
    Chest.deposit = function(id) {
        var c = chest_page - 1, c = parseInt(selected_chest) + 60 * c, r = chests[0][c].id, c = Mods.Chestm.tempChest[r];
        Mods.Chestm.chest_item_id = r;
        Socket.send("chest_deposit", {
            item_id: r,
            item_slot: c,
            target_id: chest_npc.id,
            target_i: chest_npc.i,
            target_j: chest_npc.j,
            amount: id
        });
    };
    Chest.destroy = function() {
        var index = chest_page - 1, index = parseInt(selected_chest) + 60 * index, id = chests[0][index].id, index = Mods.Chestm.tempChest[id];
        Mods.Chestm.chest_item_id = id;
        Popup.prompt("Do you want to destroy " + item_base[Mods.Chestm.chest_item_id].name + "?", function() {
            Socket.send("chest_destroy", {
                item_id: id,
                item_slot: index,
                target_id: chest_npc.id
            });
        });
    };
    Chest.withdraw = function(spawn) {
        var index = chest_page - 1, index = parseInt(selected_chest) + 60 * index;
        spawn > chest_content[index].count && (spawn = chest_content[index].count);
        var id = chests[0][index].id, index = Mods.Chestm.tempChest[id];
        Mods.Chestm.chest_item_id = id;
        Socket.send("chest_withdraw", {
            item_id: id,
            item_slot: index,
            target_id: chest_npc.id,
            target_i: chest_npc.i,
            target_j: chest_npc.j,
            amount: spawn
        });
    };
    Chest.withdrawfavs = function(b) {};
    Chest.deposit_all = function() {
        var objs = players[0].temp.inventory, animations = Inventory.get_item_counts(players[0]);
        if (Timers.running("deposit_all")) return !1;
        Timers.set("deposit_all", null_function, 1e3);
        var evt = 0, target = 0, type;
        for (type in animations) {
            var evt = Inventory.get_item_count(players[0], type), k;
            for (k in objs) parseInt(objs[k].id) == type && objs[k].selected && --evt;
            0 == evt || Mods.Chestm.avoidAll[type] || (function(target, key, val) {
                setTimeout(function() {
                    Socket.send("chest_deposit", {
                        item_id: key,
                        item_slot: Mods.Chestm.tempChest[key],
                        target_id: chest_npc.id,
                        target_i: chest_npc.i,
                        target_j: chest_npc.j,
                        amount: val
                    });
                }, 75 * target);
            }(target, type, evt), target += 1);
        }
    };
    Mods.Chestm.eventListener = {
        keys: {
            keydown: [ KEY_ACTION.CTRL ],
            keyup: [ KEY_ACTION.CTRL ]
        },
        fn: function(node, s, e) {
            "keydown" == node && e === KEY_ACTION.CTRL && (Mods.Chestm.ctrlPressed = !0, Mods.disableInvClick = !0, 
            Mods.Chestm.showAvoidAll(!0), Timers.set("clear_ctrl_chest", function() {
                Mods.Chestm.eventListener.fn("keyup", !1, KEY_ACTION.CTRL);
            }, 1e3));
            "keyup" == node && e === KEY_ACTION.CTRL && (Mods.Chestm.ctrlPressed = !1, Mods.disableInvClick = !1, 
            Mods.Chestm.showAvoidAll(!1));
        }
    };
    Mods.Chestm.showAvoidAll = function($hidden) {
        $hidden = $hidden || !1;
        for (var id = 0; 40 > id; id++) {
            var elem = getElem("inv_" + id), method = players[0].temp.inventory[id] && players[0].temp.inventory[id].id || !1, options = elem.style.borderColor || "#FFFFFF", callback = "#FFFFFF" != elem.style.borderColor && "rgb(255, 255, 255)" != elem.style.borderColor ? elem.style.borderColor : "";
            elem.style.borderColor = method && $hidden && Mods.Chestm.avoidAll[method] ? options : callback;
        }
    };
    (function() {
        for (var cnt = 0; 10 > cnt; cnt++) if ("undefined" != typeof getElem("chest").childNodes[1].childNodes[0]) getElem("chest").childNodes[1].removeChild(getElem("chest").childNodes[1].childNodes[0]); else break;
        createElem("span", getElem("chest").childNodes[1], {
            id: "chest_chest",
            style: "float: left; font-weight: bold;",
            innerHTML: "Chest"
        });
        createElem("span", getElem("chest").childNodes[1], {
            id: "chest_sort",
            className: "link",
            style: "float: left; font-weight: bold; margin: 0px; margin-left: 10px;",
            innerHTML: "Sort"
        });
        createElem("span", getElem("chest").childNodes[1], {
            id: "chest_market",
            className: "link",
            style: "margin-right: 72px; margin-top: 5px;",
            innerHTML: "Market",
            onclick: function() {
                Market.open();
            }
        });
        createElem("span", getElem("chest").childNodes[1], {
            id: "chest_close",
            className: "link",
            style: "margin: 0px; padding: 0px; float: right;",
            innerHTML: "Close",
            onclick: function() {
                addClass(getElem("chest"), "hidden");
            }
        });
        for (cnt = 0; 5 > cnt; cnt++) createElem("span", getElem("chest").childNodes[1], {
            id: "chest_page_" + (5 - cnt),
            className: "chest_pages link",
            style: "margin: 0px; padding-right: 9px; float: right;",
            onclick: function() {
                for (var index = 0; 5 > index; index++) getElem("chest_page_" + (index + 1)).style.color = "";
                index = parseInt(this.id.replace("chest_page_", ""));
                getElem("chest_page_" + index).style.color = "orange";
                Chest.change_page(index);
            },
            innerHTML: 5 - cnt
        });
        getElem("chest_withdraw").style.display = "none";
        getElem("chest_withdraw_8").style.display = "none";
        getElem("chest_destroy").style.display = "none";
        getElem("chest_deposit").style.display = "none";
        getElem("chest_deposit_all").style.display = "none";
        getElem("chest_item_name").style.display = "none";
        createElem("span", "chest", {
            id: "chest_sort_holder",
            style: "width: 359px; min-height: 22px; display: none; margin-bottom: 3px; margin-top: 3px; padding-bottom: 4px; color: #FFF; border-bottom: 1px solid #666;"
        });
        createElem("span", "chest", {
            id: "chest_btn_holder",
            style: "font-weight: bold; color: #555;"
        });
        createElem("select", "chest_sort_holder", {
            id: "chest_sort_category",
            className: "market_select",
            style: "width: 144px; float: left; margin: 1px 12px 3px 5px;",
            onchange: function() {
                Chest.sort_player_modChest();
            },
            innerHTML: "<option value='-1'>-- Sort Inventory --</option><option value='0'>Sort: Equipment</option><option value='1'>Sort: Materials</option><option value='2'>Sort: Vendor Price</option>"
        });
        createElem("div", "chest_sort_holder", {
            id: "chest_divInv",
            style: "display: inline-block; float: left;"
        });
        createElem("input", "chest_divInv", {
            id: "chest_invCheck",
            type: "checkbox",
            style: "float: left; margin: 1px 7px 0px 0px; width: 0.7em; height: 0.7em;",
            onchange: function() {
                Chest.sort_player_modChest();
            }
        });
        createElem("span", "chest_divInv", {
            id: "chest_invCheck_name",
            style: "float: left; font-size: 0.7em; margin-top: -1px;",
            innerHTML: "Inventory Items"
        });
        createElem("input", "chest_divInv", {
            id: "chest_colCheck",
            type: "checkbox",
            style: "float: left; clear: left; margin: 1px 7px 0px 0px; width: 0.7em; height: 0.7em;",
            onchange: function() {
                BigMenu.update_chest(chest_content);
            }
        });
        createElem("span", "chest_divInv", {
            id: "chest_colCheck_name",
            style: "float: left; font-size: 0.7em;",
            innerHTML: "Highlight"
        });
        createElem("div", "chest_sort_holder", {
            id: "chest_divFav",
            style: "display: inline-block; float: left;"
        });
        createElem("input", "chest_divFav", {
            id: "chest_favCheck",
            type: "checkbox",
            style: "float: left; margin: 1px 7px 0px 14px; width: 0.7em; height: 0.7em;",
            onchange: function() {
                Chest.sort_player_modChest();
            }
        });
        createElem("span", "chest_divFav", {
            id: "chest_favCheck_name",
            style: "float: left; font-size: 0.7em; margin-top: -1px;",
            innerHTML: "Favorited Items"
        });
        createElem("input", "chest_divFav", {
            id: "chest_colCheckF",
            type: "checkbox",
            style: "float: left; clear: left; margin: 1px 7px 0px 14px; width: 0.7em; height: 0.7em;",
            onchange: function() {
                BigMenu.update_chest(chest_content);
            }
        });
        createElem("span", "chest_divFav", {
            id: "chest_colCheck_nameF",
            style: "float: left; font-size: 0.7em;",
            innerHTML: "Highlight"
        });
        -1 < navigator.userAgent.search("Chrome") && (createElem("input", "chest_divInv", {
            id: "chest_invColor",
            type: "color",
            style: "float: left; margin: -2px 0px 0px 3px; width: .95em; height: 1.25em; border: none; background: none; background-color: transparent;",
            onchange: function() {
                BigMenu.update_chest(chest_content);
            }
        }), createElem("input", "chest_divFav", {
            id: "chest_favColor",
            type: "color",
            style: "float: left; margin: -2px 0px 0px 3px; width: .95em; height: 1.25em; border: none; background: none; background-color: transparent;",
            onchange: function() {
                BigMenu.update_chest(chest_content);
            }
        }));
        createElem("span", "chest_btn_holder", {
            id: "chest_withdraw_item",
            style: "float: left; color: #FF0; font-weight: normal; margin: 5px 6px;",
            innerHTML: "Withdraw"
        });
        createElem("span", "chest_btn_holder", {
            id: "chest_withdraw_item_1",
            className: "link",
            style: "float: left; margin: 3px;",
            innerHTML: "1",
            onclick: function() {
                Chest.withdraw(1);
            }
        });
        createElem("span", "chest_btn_holder", {
            id: "chest_withdraw_item_8",
            className: "link",
            style: "float: left; margin: 3px;",
            innerHTML: "8",
            onclick: function() {
                Chest.withdraw(8);
            }
        });
        createElem("span", "chest_btn_holder", {
            id: "chest_withdraw_item_19",
            className: "link",
            style: "float: left; margin: 3px;",
            innerHTML: "19",
            onclick: function() {
                Chest.withdraw(19);
            }
        });
        createElem("span", "chest_btn_holder", {
            id: "chest_withdraw_item_all",
            className: "link",
            style: "float: left; margin: 4px 6px;",
            innerHTML: "All",
            onclick: function() {
                Chest.withdraw(99);
            }
        });
        createElem("span", "chest_btn_holder", {
            id: "chest_deposit_item",
            style: "float: right; color: #FF0; font-weight: normal; margin: 5px 6px;",
            innerHTML: "Deposit"
        });
        createElem("span", "chest_btn_holder", {
            id: "chest_deposit_item_1",
            className: "link",
            style: "float: right; margin: 4px 6px;",
            innerHTML: "1",
            onclick: function() {
                Chest.deposit(1);
            }
        });
        createElem("span", "chest_btn_holder", {
            id: "chest_deposit_item_all",
            className: "link",
            style: "float: right; margin: 4px 6px;",
            innerHTML: "All",
            onclick: function() {
                Chest.deposit(99);
            }
        });
        createElem("span", "chest_btn_holder", {
            id: "chest_deposit_item_pet",
            className: "link",
            style: "float: right; margin: 4px 5px;",
            innerHTML: "All+",
            onclick: function() {
                Chest.deposit_all();
            }
        });
        createElem("span", "chest_btn_holder", {
            id: "chest_destroy_item",
            className: "link",
            style: "float: left; margin: 4px 0px 0px 20px;",
            innerHTML: "Destroy",
            onclick: function() {
                Chest.destroy();
                Chest.sort_player_modChest();
            }
        });
        for (cnt = 0; 60 > cnt; cnt++) getElem("chest_" + cnt).onmouseover = new Function("Chest.mouseoverColor(this,true);"), 
        getElem("chest_" + cnt).onmouseout = new Function("Chest.mouseoverColor(this,false);"), 
        getElem("chest_" + cnt).onclick = function() {};
        getElem("chest_colCheck").checked = Mods.Chestm.chest_colCheck;
        getElem("chest_colCheckF").checked = Mods.Chestm.chest_colCheckF;
        -1 < navigator.userAgent.search("Chrome") && (getElem("chest_invColor").value = Mods.Chestm.inv_select_color, 
        getElem("chest_favColor").value = Mods.Chestm.fav_select_color);
        getElem("chest_sort").onclick = function() {
            Mods.Chestm.chest_sort_hidden = !Mods.Chestm.chest_sort_hidden;
            Mods.Chestm.chest_sort_hidden ? (getElem("chest_sort_holder").style.display = "none", 
            getElem("chest_sort").innerHTML = "Sort") : (getElem("chest_sort_holder").style.display = "inline-block", 
            getElem("chest_sort").innerHTML = "Sort (hide)");
        };
        getElem("chest_invCheck").checked = Mods.Chestm.sortInv_check;
        getElem("chest_favCheck").checked = Mods.Chestm.sortFav_check;
        getElem("chest_sort_category").value = Mods.Chestm.armorPriority ? 0 : Mods.Chestm.craftPriority ? 1 : Mods.Chestm.pricePriority ? 2 : -1;
        getElem("chest").onclick = function(n) {
            var target = n.target;
            n = target.id;
            var source = /chest_[0-9]/.test(n);
            source || (target = target.parentNode, target = target.id, /chest_[0-9]/.test(target) && (n = target, 
            source = !0));
            source && (n = n.replace("chest_", ""));
            target = Mods.Chestm.ctrlPressed;
            source && (target ? (n = parseInt(n) + 60 * (parseInt(chest_page) - 1), (n = chests[0][n] && chests[0][n].id || !1) && (Mods.Chestm.playerPriorities[n] ? delete Mods.Chestm.playerPriorities[n] : Mods.Chestm.playerPriorities[n] = !0)) : (selected_chest = n, 
            Chest.button_enable_check()));
            localStorage.chestPlayerPriorities = JSON.stringify(Mods.Chestm.playerPriorities);
            Chest.sort_player_modChest();
        };
        getElem("inventory").onclick = function(event) {
            var obj = event.target;
            event = obj.id;
            var val = /inv_[0-9]/.test(event);
            val && (event = event.replace("inv_", ""));
            var script = Mods.Chestm.ctrlPressed;
            val && script && (val = players[0].temp.inventory[event] && players[0].temp.inventory[event].id || !1) && (Mods.Chestm.avoidAll[val] ? delete Mods.Chestm.avoidAll[val] : Mods.Chestm.avoidAll[val] = !0, 
            obj.style.borderColor = (Mods.Chestm.avoidAll[val] || !1) && "#00FF00" || "#FF0000", 
            Timers.set("slot_border_" + event, function() {
                obj.style.borderColor = "";
                Mods.Chestm.ctrlPressed && Mods.Chestm.showAvoidAll(!0);
            }, 1e3), Mods.Chestm.showAvoidAll(!0));
            localStorage.avoidAll = JSON.stringify(Mods.Chestm.avoidAll);
        };
    })();
    Mods.timestamp("chestm");
};

Load.forgem = function() {
    modOptions.forgem.time = timestamp();
    Mods.Forgem.forgeMatList = function() {
        var to = [], position = FORGE_FORMULAS[Mods.Forgem.toForgeItem];
        Mods.Forgem.FORGE_MATERIALS_LIST.splice(0, Mods.Forgem.FORGE_MATERIALS_LIST.length);
        if (void 0 != position.item_id && "-1" != Mods.Forgem.toForgeItem) for (var j = 0; j < position.pattern.length; j++) for (var x = 0; x < position.pattern[j].length; x++) {
            to.push(position.pattern[j][x]);
            Mods.Forgem.countUnique(to, Mods.Forgem.FORGE_MATERIALS_LIST);
            for (var g in Mods.Forgem.FORGE_MAT_LIST) delete Mods.Forgem.FORGE_MAT_LIST[g];
            for (var slot = 0; slot < Mods.Forgem.FORGE_MATERIALS_LIST.length; slot++) Mods.Forgem.FORGE_MAT_LIST[Mods.Forgem.FORGE_MATERIALS_LIST[slot]] = FORGE_FORMULAS[Mods.Forgem.toForgeItem].materials[Mods.Forgem.FORGE_MATERIALS_LIST[slot]];
        } else for (g in Mods.Forgem.FORGE_MAT_LIST) delete Mods.Forgem.FORGE_MAT_LIST[g];
    };
    Mods.Forgem.countUnique = function(list, array) {
        array.splice(0, array.length);
        for (var out = {}, j = 0; j < list.length; j++) out.hasOwnProperty(list[j]) || "-1" == list[j] || (array.push(list[j]), 
        out[list[j]] = 1);
    };
    Mods.Forgem.forgeButtonShow = function() {
        var index = getElem("forge_btnSelect"), state = !0;
        Mods.Forgem.toForgeItem = getElem("forge_search").value;
        if (-1 != Mods.Forgem.toForgeItem && void 0 != FORGE_FORMULAS[Mods.Forgem.toForgeItem].item_id) {
            Mods.Forgem.forgeMatList();
            for (var idx in Mods.Forgem.FORGE_MAT_LIST) state = void 0 != Mods.Forgem.FORGE_MAT_LIST[idx] && Inventory.get_item_count(players[0], idx) >= Mods.Forgem.FORGE_MAT_LIST[idx] && 1 == state ? !0 : !1;
        } else state = !1;
        index.style.display = state ? "block" : "none";
        state = !1;
        index = getElem("forge_btnRemove");
        for (idx = 0; 4 > idx; idx++) for (var id = 0; 4 > id; id++) if ("" != getElem("forg_slot_" + idx + "_" + id).style.background || state) state = !0;
        index.style.display = state ? "block" : "none";
        index = parseInt(getElem("forge_search").value);
        getElem("forge_btnForget").style.display = "number" == typeof index && -1 != index ? "block" : "none";
    };
    Mods.Forgem.place_mats = function(j) {
        var geometry = FORGE_FORMULAS[Mods.Forgem.toForgeItem];
        Mods.Forgem.remove_mats();
        if (j) for (j = 0; j < geometry.pattern.length; j++) for (var k = 0; k < geometry.pattern[j].length; k++) for (var inventoryIndex = 0; inventoryIndex < players[0].temp.inventory.length; inventoryIndex++) if (players[0].temp.inventory[inventoryIndex].id == geometry.pattern[j][k]) {
            var event = getElem("forg_inv_" + inventoryIndex);
            event.srcElement = event;
            event.preventDefault = function() {};
            Forge.select(event, !1);
            Forge.switcher(forge_selected, getElem("forg_slot_" + j + "_" + k), !0);
        }
        Mods.Forgem.forgeButtonShow();
    };
    Mods.Forgem.remove_mats = function() {
        for (var parserIndex = 0; 4 > parserIndex; parserIndex++) for (var id = 0; 4 > id; id++) for (var failed = 0; 40 > failed; failed++) if ("" != getElem("forg_slot_" + parserIndex + "_" + id).style.background && "" == getElem("forg_inv_" + failed).style.background) {
            var event = getElem("forg_slot_" + parserIndex + "_" + id);
            event.srcElement = event;
            event.preventDefault = function() {};
            Forge.select(event, !1);
            Forge.switcher(forge_selected, getElem("forg_inv_" + failed), !0);
        }
        Mods.Forgem.forgeButtonShow();
    };
    Mods.Forgem.forget_recipe = function() {
        var val = parseInt(getElem("forge_search").value);
        getElem("forge_search").value = "-1";
        delete Mods.Forgem.RECIPE_U_LIST[val];
        for (var ii = 0; ii < Mods.Forgem.RECIPE_LIST.length; ii++) Mods.Forgem.RECIPE_LIST[ii] == val && Mods.Forgem.RECIPE_LIST.splice(ii, 1);
        addChatText("You have forgotten an old recipe... (" + item_base[FORGE_FORMULAS[val].item_id].name + ")", null, COLOR.ORANGE);
        localStorage.RECIPE_LIST = JSON.stringify(Mods.Forgem.RECIPE_LIST);
        localStorage.RECIPE_U_LIST = JSON.stringify(Mods.Forgem.RECIPE_U_LIST);
        getElem("forge_search").removeChild(getElem("forge_options_" + val));
        0 == Mods.Forgem.RECIPE_LIST.length && (getElem("forge_recipe_select").innerHTML = "No Recipes Known");
        Mods.Forgem.forgeButtonShow();
    };
    Mods.Forgem.newRecipe = function(value) {
        value = "number" == typeof value ? value : parseInt(forge_formula);
        if ("number" == typeof value && (getElem("forge_recipe_select").innerHTML = "-- Select Recipe --", 
        !Mods.Forgem.RECIPE_U_LIST.hasOwnProperty(value) || 0 == Mods.Forgem.RECIPE_LIST.length)) {
            Mods.Forgem.RECIPE_LIST.push(value);
            Mods.Forgem.RECIPE_U_LIST[value] = 1;
            localStorage.RECIPE_LIST = JSON.stringify(Mods.Forgem.RECIPE_LIST);
            localStorage.RECIPE_U_LIST = JSON.stringify(Mods.Forgem.RECIPE_U_LIST);
            addChatText("You have discovered a new recipe! (" + item_base[FORGE_FORMULAS[value].item_id].name + ")", null, COLOR.ORANGE);
            var elem = document.createElement("option");
            elem.id = "forge_options_" + value;
            elem.value = value;
            elem.innerHTML = item_base[FORGE_FORMULAS[value].item_id].name;
            getElem("forge_search").appendChild(elem);
        }
        Mods.Forgem.forgeButtonShow();
    };
    Forge.drop = function(vars, n) {
        Mods.Forgem.oldDrop(vars, n);
        Mods.Forgem.forgeButtonShow();
    };
    Forge.select = function(arg1, handler) {
        Mods.Forgem.oldSelect(arg1, handler);
        Mods.Forgem.forgeButtonShow();
    };
    Forge.forge_open = function() {
        Mods.Forgem.oldOpen();
        Mods.Forgem.forgeButtonShow();
    };
    (function() {
        getElem("forging_menu").style.minHeight = "204px";
        getElem("forging_components").style.bottom = "17px";
        createElem("select", "forging_menu", {
            id: "forge_search",
            className: "market_select",
            style: "width: 142px; position: absolute; top: 25px; left: 3px; display: inline-block;",
            onchange: "Mods.Forgem.forgeButtonShow();"
        });
        createElem("option", "forge_search", {
            id: "forge_recipe_select",
            value: "-1",
            innerHTML: "-- Select Recipe --"
        });
        for (var oldChildIndex = 0; oldChildIndex < Mods.Forgem.RECIPE_LIST.length; oldChildIndex++) FORGE_FORMULAS[Mods.Forgem.RECIPE_LIST[oldChildIndex]] ? createElem("option", "forge_search", {
            id: "forge_options_" + Mods.Forgem.RECIPE_LIST[oldChildIndex],
            value: Mods.Forgem.RECIPE_LIST[oldChildIndex],
            innerHTML: item_base[FORGE_FORMULAS[Mods.Forgem.RECIPE_LIST[oldChildIndex]].item_id].name
        }) : (delete Mods.Forgem.RECIPE_U_LIST[Mods.Forgem.RECIPE_LIST[oldChildIndex]], 
        Mods.Forgem.RECIPE_LIST.splice(oldChildIndex, 1), localStorage.RECIPE_LIST = JSON.stringify(Mods.Forgem.RECIPE_LIST), 
        localStorage.RECIPE_U_LIST = JSON.stringify(Mods.Forgem.RECIPE_U_LIST));
        createElem("div", "forging_menu", {
            id: "forge_btn_container",
            style: "display: inline-block; position: absolute; width: 60px; height: 50px; top: 25px; left: 150px;"
        });
        createElem("button", "forge_btn_container", {
            id: "forge_btnRemove",
            className: "market_select pointer",
            style: "position: absolute; top: 23px; font-weight: bold; min-width: 55px; display: none;",
            innerHTML: "Clear",
            onclick: function() {
                Mods.Forgem.remove_mats();
            }
        });
        createElem("button", "forge_btn_container", {
            id: "forge_btnSelect",
            className: "market_select pointer",
            style: "position: absolute; top: 145px; font-weight: bold; min-width: 55px; display: none;",
            innerHTML: "Select",
            onclick: function() {
                Mods.Forgem.place_mats(!0);
            }
        });
        createElem("button", "forge_btn_container", {
            id: "forge_btnForget",
            className: "market_select pointer",
            style: "position: absolute; top: 0px; font-weight: bold; min-width: 55px; display: none;",
            innerHTML: "Forget",
            onclick: function() {
                Mods.Forgem.forget_recipe(!0);
            }
        });
        0 == Mods.Forgem.RECIPE_LIST.length && (getElem("forge_recipe_select").innerHTML = "No Recipes Known");
        bindOnPress(getElem("forge_make"), function() {
            Forge.attempt();
            Mods.Forgem.newRecipe();
        });
    })();
    Mods.timestamp("forgem");
};

Load.health = function() {
    modOptions.health.time = timestamp();
    BigMenu.in_a_fight = function(e, self) {
        var pad = -1 != loadedMods.indexOf("Chatmd") && "" != Mods.Chatmd.afkMessage ? "<span class='pointer' title='" + Mods.Chatmd.afkMessage + "' style='color: #F00;' onclick='javascript:Mods.Chatmd.chatCommands(&apos;/afk&apos;)'>*</span>" : "";
        Mods.Health.old_inAFight(e, self);
        "undefined" !== typeof e && (skills[0].health.current = e.temp.health, getElem("player_health_name").innerHTML = pad + capitaliseFirstLetter(e.name) + " (" + e.temp.health + "/" + skills[0].health.level + ")");
        "undefined" != typeof self && (getElem("enemy_health_name").innerHTML = self.name + " (" + self.temp.health + ")");
    };
    Player.update_healthbar = function() {
        var pad = -1 != loadedMods.indexOf("Chatmd") && "" != Mods.Chatmd.afkMessage ? "<span class='pointer' title='" + Mods.Chatmd.afkMessage + "' style='color: #F00;' onclick='javascript:Mods.Chatmd.chatCommands(&apos;/afk&apos;)'>*</span>" : "";
        players[0].temp.healthbar && removeClass(getElem("player_healthbar"), "hidden");
        getElem("player_health_name").innerHTML = pad + capitaliseFirstLetter(players[0].name) + " (" + skills[0].health.current + "/" + skills[0].health.level + ")";
        -1 == players[0].temp.target_id && (getElem("player_health").style.width = Math.round(skills[0].health.current / skills[0].health.level * 100) + "%");
    };
    Player.update_healthbar();
    Mods.timestamp("health");
};

Load.mosmob = function() {
    modOptions.mosmob.time = timestamp();
    regular_onmousemove = function(coordinates) {
        Mods.regular_onmousemove(coordinates);
        2 == socket_status && (coordinates = translateMousePositionToScreenPosition(coordinates.clientX, coordinates.clientY), 
        100 > coordinates.x && 100 > coordinates.y || minimap) && (getElem("object_selector_info").style.display = "block");
    };
    updateMouseSelector = function(ev) {
        if (hasClass(getElem("mods_tooltip_holder"), "hidden")) {
            var el = getElem("object_selector_info");
            el.style.pointerEvents = "none";
            if (!mouse_over_magic) {
                ev.clientX = ev.clientX || ev.pageX || ev.touches && ev.touches[0].pageX;
                ev.clientY = ev.clientY || ev.pageY || ev.touches && ev.touches[0].pageY;
                Math.round(Math.min(window.innerWidth, width * max_scale));
                Math.round(Math.min(window.innerWidth / color, height * max_scale));
                var n = Math.min(16, Math.round(16 * current_ratio_y)), p = translateMousePosition(ev.clientX, ev.clientY);
                ev = "";
                var color = "#FFFF00";
                if (p && map_visible(p.i, p.j) && on_map[current_map] && on_map[current_map][p.i] && on_map[current_map][p.i]) {
                    var e;
                    (e = obj_g(on_map[current_map][p.i][p.j])) || (e = player_map[p.i] && player_map[p.i][p.j] ? player_map[p.i][p.j][0] : !1);
                    e && e.name && "Name" != e.name && (ev = e.name, e.b_t == BASE_TYPE.PLAYER && (color = "#FFFFFF", 
                    ev = capitaliseFirstLetter(ev) + " (" + FIGHT.calculate_monster_level(e) + ")"), 
                    e.b_t == BASE_TYPE.PET && (ev = pets[e.id].name + "<br/><span style='font-size:" + .7 * n + "px'>" + capitaliseFirstLetter(ev) + "</span>"), 
                    e.b_t == BASE_TYPE.NPC && (e.type == OBJECT_TYPE.SHOP ? ev += " (NPC)" : (editor_enabled && (ev = ev + " (ID:" + e.b_i + ")"), 
                    ev = ev + " (" + FIGHT.calculate_monster_level(e) + ")<br/><span style='font-size:" + .7 * n + "px'>(" + npc_base[e.b_i].temp.total_accuracy + "A, " + npc_base[e.b_i].temp.total_strength + "S, " + npc_base[e.b_i].temp.total_defense + "D, " + (npc_base[e.b_i].temp.magic ? npc_base[e.b_i].temp.magic + "M, " : "") + npc_base[e.b_i].params.health + "Hp)</span>", 
                    0 == Mods.Newmarket.infopannelmode && (ev += e.params.aggressive ? "<br/><span style='color:#FF0000;font-size:" + .7 * n + "px'>Aggressive</span>" : "<br/><span style='color:#FFFFFF;font-size:" + .7 * n + "px'>Passive</span>"))), 
                    e.params.desc && 0 == Mods.Newmarket.infopannelmode && (ev = ev + "<br/><span style='font-size:" + .7 * n + "px'><i>" + e.params.desc + "</i></span>"), 
                    editor_enabled && (ev += "<br/>(i: " + p.i + ", j:" + p.j + ")", e.blocking && (ev += "(B)")));
                }
                editor_enabled && (e = p.i - dx, p = p.j - dy, 10 < p && 11 > e && 1 < e && (p = e - 2 + 9 * (16 - p) + editor_page * editor_page_size, 
                p < BASE_TYPE[tileset].length && 0 <= p && p < (editor_page + 1) * editor_page_size && (ev = BASE_TYPE[tileset][p].name, 
                BASE_TYPE[tileset][p].blocking && (ev += "(B)"))));
                el.innerHTML = ev;
                el.style.color = color;
            }
            "" == ev ? el.style.display = "none" : (2 == Mods.Newmarket.infopannelmode ? (el.style.border = "none", 
            el.style.backgroundColor = "") : (el.className = "menu", el.style.borderRadius = "14px", 
            el.style.padding = "7px", el.style.border = "2px #666 solid", el.style.MozBorderRadius = "10px"), 
            el.style.display = "block");
        }
    };
    InfoPaneltoggle = function() {
        var elem = getElem("settings_infopanel");
        switch (Mods.Newmarket.infopannelmode) {
          case 0:
            elem.innerHTML = "Info Panel: no inspect";
            Mods.Newmarket.infopannelmode = 1;
            break;

          case 1:
            elem.innerHTML = "Info Panel: transparent";
            Mods.Newmarket.infopannelmode = 2;
            break;

          default:
            elem.innerHTML = "Info Panel: full", Mods.Newmarket.infopannelmode = 0;
        }
        localStorage.infopanelmode = JSON.stringify(Mods.Newmarket.infopannelmode);
    };
    Mods.Mosmob.createDiv = function() {
        if (null != getElem("mods_tooltip_holder")) return !1;
        createElem("div", wrapper, {
            id: "mods_tooltip_holder",
            className: "menu hidden",
            style: "position: absolute; left: 50%; margin-left: -122px; top: 3.4%; font-size: 0.7em; padding: 7px; border: 2px solid #666; border-radius: 14px; z-index: 100; max-width: 230px;"
        });
        Mods.Mosmob.holder_html_template = Handlebars.compile("<div id='mods_tooltip_name' style='position: relative; width: 100%; float: left; text-align: center;'>&nbsp;</div><div id='mods_tooltip_content' style='position: relative; width: 100%; float: left; clear: left; padding: 3px 6px 1px 0px;'>&nbsp;</div>");
        getElem("mods_tooltip_holder").innerHTML = Mods.Mosmob.holder_html_template();
    };
    Mods.Mosmob.gatherParams = function(id) {
        var $scope = {}, row = item_base[id];
        if (void 0 == row || void 0 == row.params) return !1;
        var args = row.params, strings;
        $scope.name = row.name;
        $scope.owned = "";
        var row = 0 + Inventory.get_item_count(players[0], id), k;
        for (k in players[0].pet.chest) players[0].pet.chest[k] == id && (row += 1);
        for (k in chests[0]) if (chests[0][k].id == id) {
            0 < chests[0][k].count && (row += chests[0][k].count);
            break;
        }
        $scope.owned += "<span style='color: #FFF'>" + thousandSeperate(row) + "</span>";
        args.min_magic && (args.magic_slots || 10 == args.slot || args.cooldown) ? (row = 10 == args.slot ? Magic[args.magic].params : !1, 
        $scope.spell = 0 == row ? !1 : row.basic_damage + " <span style='color: #AAA;'>Dmg</span>, " + row.cooldown / 1e3 + "s <span style='color: #AAA;'>CD</span>, " + row.xp + " <span style='color: #AAA;'>Exp/Cast</span><br>" + row.penetration + " <span style='color: #AAA;'>Spell Pen</span>, " + row.uses + " <span style='color: #AAA;'>Uses/Scroll</span>") : $scope.spell = !1;
        row = {
            Good: {
                1: 2500,
                2: 8e4
            },
            Great: {
                1: 8e3,
                2: 17e4
            },
            Best: {
                1: 34999,
                2: 45e4
            },
            Legendary: {
                1: 15e4,
                2: 15e5
            },
            Rare: {
                1: 0,
                2: 1
            }
        };
        $scope.price = void 0 == args.price ? "span style='color: #F00;'>0</span>" : "<span style='color: #FFF;'>" + thousandSeperate(args.price) + "</span> <span style='color: #AAA'>coins</span>";
        $scope.obtained = "";
        if (modOptions.wikimd.loaded) {
            $scope.obtained = "";
            var data = Mods.Wikimd.item_formulas[id];
            data.craft && data.craft.level && ($scope.obtained += "<span style='text-align: center'>Craft <span style='color: #AAA;'>(" + capitaliseFirstLetter(data.craft.source.skill) + ")</span>,&nbsp;</span>");
            data.enchant && data.enchant.from_enchant && ($scope.obtained += "<span style='text-align: center'>Craft <span style='color: #AAA;'>(Enchant)</span>,&nbsp;</span>");
            data.drop && data.drop.sources && ($scope.obtained += "<span style='text-align: center'>Drop,&nbsp;</span>");
            if (data.sold && data.sold.sources) {
                $scope.obtained += "<span style='text-align: center'>";
                var c = !1;
                for (strings in data.sold.sources) if (data.sold.sources[strings].spawn) {
                    c = !0;
                    break;
                }
                $scope.obtained = c ? $scope.obtained + "Buy from " : $scope.obtained + "Sale to ";
                $scope.obtained += "<span style='color: #AAA;'>(NPC)</span>,&nbsp;</span>";
            }
        }
        if (void 0 == args.no_present) {
            strings = "";
            for (var x in row) args.price >= row[x][1] && args.price <= row[x][2] && (strings += x + ", ");
            strings = strings.slice(0, -2);
            0 != strings.length && ($scope.obtained += "<span style='text-align: center'>Present <span style='color: #AAA;'>(" + strings + ")</span>,&nbsp;</span>");
        }
        args = !1;
        for (k in ItemPacks) if (!args && ItemPacks[k].items) for (var videoCounter in ItemPacks[k].items) {
            if (ItemPacks[k].items[videoCounter].id == id) {
                $scope.obtained += "<span style='text-align: center'>MOS,&nbsp;</span>";
                args = !0;
                break;
            }
        } else break;
        0 < $scope.obtained.length ? ($scope.obtained = "<span style='text-align: center;'>Obtained: <span style='color: #FFF'><span style='width: 60%;'>" + $scope.obtained.slice(0, -14), 
        $scope.obtained += "</span></span></span>") : $scope.obtained = !1;
        return $scope;
    };
    Mods.Mosmob.compileInfo = function(val) {
        val = Mods.Mosmob.gatherParams(val);
        if (0 == val) return !1;
        var content = "<div style='color: #FF0; padding: 0px 10px 2px 10px; text-align: center;'>Owned: " + val.owned + "<span style='color: #AAA'>,</span> Value: " + val.price + "<br>", content = content + (val.obtained ? val.obtained + "<br>" : ""), content = content + (val.spell ? "Spell Info: <span style='color: #FFF;'>" + val.spell + "</span><br>" : ""), content = content + (val.enchant ? "Enchant Info: <span style='color: #FFF;'>" + val.enchant + "</span>" : "");
        return content + "</div>";
    };
    Mods.Mosmob.updateTooltip = function(e) {
        !1 !== e && -1 < e ? (removeClass(getElem("mods_tooltip_holder"), "hidden"), getElem("mods_tooltip_name").innerHTML = "<div style='width: 100%; text-align: center; padding-bottom: 4px; padding-top: 1px;'><span style='color: #FF0; font-weight: bold; padding-bottom: 3px; padding-left: 3px; font-size: 1.2em;'>" + Mods.cleanText(item_base[e].name) + "</span><br><span style='color: #FF0; padding: 1px 3px 3px 3px; font-style: italic; text-align: center'>" + Items.info(e) + "</span>", 
        getElem("mods_tooltip_content").innerHTML = Mods.Mosmob.compileInfo(e), getElem("object_selector_info").style.display = "none") : addClass(getElem("mods_tooltip_holder"), "hidden");
    };
    Mods.Mosmob.findID = function(n) {
        n = n.target || n.srcElement;
        var code = n.id, result = /(chest_|cabinet_chest_|shop_|forg_slot_|inv_|pet_inv_|pet_chest_|wiki_row\d_col\d_div_)(\d{1,3})(_(\d{1,2}))?/.exec(code), len = n.item_id || n.getAttribute("item_id");
        n = !1;
        if ("forge_result" == code) if ("undefined" != typeof forge_formula) len = -1, n = FORGE_FORMULAS[forge_formula], 
        n = void 0 != n ? n.item_id : !1; else {
            Mods.Mosmob.updateTooltip(!1);
            return;
        } else if (!(result || -1 < len && null != len)) {
            Mods.Mosmob.updateTooltip(!1);
            return;
        }
        if (result) if ("chest_" == result[1]) n = parseInt(result[2]), n += 60 * (chest_page - 1), 
        n = chests[0][n], n = void 0 != n ? n.id : !1; else if ("cabinet_chest_" == result[1]) n = parseInt(result[2]), 
        code = on_map[current_map][last_cabinet.i][last_cabinet.j].params.items, n = void 0 != code ? code[n] : !1; else if ("shop_" == result[1]) n = parseInt(result[2]), 
        n = shop_npc.temp.content[n], n = void 0 != n ? n.id : !1; else if ("forg_slot_" == result[1]) n = parseInt(result[2]), 
        code = parseInt(result[4]), n = forge_components[n][code], n = void 0 != n ? n.id : !1; else if ("inv_" == result[1]) n = parseInt(result[2]), 
        n = players[0].temp.inventory[n], n = void 0 != n ? n.id : !1; else {
            if ("pet_inv_" == result[1] || "pet_chest_" == result[1]) n = parseInt(result[2]), 
            n = players[0].pet.chest[n], n = parseInt(n);
        } else -1 < len && (n = len);
        -1 < n ? Mods.Mosmob.updateTooltip(n) : Mods.Mosmob.updateTooltip(!1);
    };
    getElem("wrapper").onmousemove = regular_onmousemove;
    createElem("div", "options_game", {
        innerHTML: "<span class='wide_link pointer' id='settings_infopanel' onclick='InfoPaneltoggle();'>Info Panel: full</span>"
    });
    Mods.Mosmob.createDiv();
    InfoPaneltoggle();
    document.body.onmouseover = Mods.Mosmob.findID;
    Mods.timestamp("mosmob");
};

Load.expbar = function() {
    modOptions.expbar.time = timestamp();
    Mods.Expbar.updateExpInfo = function() {
        var b = Math.round(Level.xp_for_level(skills[0][Mods.Expbar.set_skill].level + 1) - skills[0][Mods.Expbar.set_skill].xp), g = Math.round(Level.xp_for_level(skills[0][Mods.Expbar.set_skill].level + 1) - Level.xp_for_level(skills[0][Mods.Expbar.set_skill].level)), b = g - b, v = Math.round(b / g * 100), c = Mods.fontSize[0], x = getElem("player_healthbar").style.left, w = getElem("player_healthbar").style.width;
        localStorage.expSkillSet = Mods.Expbar.set_skill;
        getElem("player_xp_name").innerHTML = skills[0][Mods.Expbar.set_skill].level + " " + capitaliseFirstLetter(Mods.Expbar.set_skill) + ": " + b + " / " + g + " (" + v + "%)";
        getElem("player_xp_bar_front").style.width = v + "%";
        getElem("player_xp_name").style.fontSize = c;
        getElem("player_xp_bar").style.left = x;
        getElem("player_xp_bar").style.width = w;
    };
    Mods.Expbar.socketOn = {
        actions: [ "skills" ],
        fn: function() {
            Mods.Expbar.updateExpInfo();
        }
    };
    Mods.Expbar.setCanvasSize = function() {
        getElem("magic_slots").style.top = Math.ceil(127 * current_ratio_y) + "px";
        Mods.Expbar.updateExpInfo();
    };
    (function() {
        createElem("div", wrapper, {
            id: "player_xp_bar",
            className: "xp_bar",
            style: "position: absolute; top: 0%; left: 0%; width: 100%; height: 2.8%; z-index: 9999;",
            title: "Go to the Skills menu and click a skill to set this bar's watched skill.",
            innerHTML: '<div id="player_xp_bar_back" class="xp_bar_back" style="position: absolute; width: 100.3%; height: 100%; background: #000; top: 0%; left: 0%; opacity: 0.4;">\r\n                </div>\r\n                <div id="player_xp_bar_front" class="xp_bar_front" style="position: absolute; width: 20%; height: 100%; top: 0%; left: 0.3%; background: -moz-linear-gradient(top,  rgb(0, 184, 192) 0%,rgb(2, 49, 71) 50%,rgb(0, 46, 60) 51%,rgb(0, 21, 44) 100%); background: -webkit-linear-gradient(top,  rgb(0, 184, 192) 0%,rgb(2, 49, 71) 50%,rgb(0, 46, 60) 51%,rgb(0, 21, 44) 100%); background: -o-linear-gradient(top,  rgb(0, 184, 192) 0%,rgb(2, 49, 71) 50%,rgb(0, 46, 60) 51%,rgb(0, 21, 44) 100%); background: -ms-linear-gradient(top,  rgb(0, 184, 192) 0%,rgb(2, 49, 71) 50%,rgb(0, 46, 60) 51%,rgb(0, 21, 44) 100%); background: linear-gradient(top,  rgb(0, 184, 192) 0%,rgb(2, 49, 71) 50%,rgb(0, 46, 60) 51%,rgb(0, 21, 44) 100%); filter: progid:DXImageTransform.Microsoft.gradient( startColorstr=\'#bfd255\', endColorstr=\'#9ecb2d\',GradientType=0 )">\r\n                    <div id="player_xp_name" class="xp_name" style="font-size: .8em; padding-top: 1px; color: #FFF; position: absolute; hight: inherit; top: inherit; left: 5px; white-space: nowrap;">40 Strength: 20,000 / 100,000 (20%)\r\n                    </div>\r\n                </div>'
        });
        for (var index in skills[0]) getElem("skill_" + index).parentElement.onclick = new Function("Mods.Expbar.set_skill = '" + index + "';Mods.Expbar.updateExpInfo();");
        Mods.Expbar.updateExpInfo();
        getElem("magic_slots").style.right = "";
        getElem("magic_slots").style.left = "2px";
        setCanvasSize();
    })();
    Mods.timestamp("expbar");
};

Load.fullscreen = function() {
    modOptions.fullscreen.time = timestamp();
    Mods.Fullscreen.toggle = function() {
        var elem = getElem("settings_fullscreen"), start = getElem("settings_game_grid");
        switch (Mods.Fullscreen.enabled) {
          case 0:
            elem.innerHTML = "Fullscreen Mode (off)";
            Mods.Fullscreen.enabled = 1;
            start.onclick = function() {
                toggleGridSize();
            };
            start.style.color = "";
            map_increase = 4;
            break;

          default:
            elem.innerHTML = "Fullscreen Mode (on)<br/><span style='color:red;font-size:10px;'>WARNING: May impact game performance.</span>", 
            Mods.Fullscreen.enabled = 0, start.onclick = "", start.style.color = "#AAA", map_increase = 6;
        }
        localStorage.fullscreenenabled = JSON.stringify(Mods.Fullscreen.enabled);
        resetMapShift();
        drawMap();
        setCanvasSize(!0);
    };
    iMapBegin = function() {
        return 0 == Mods.Fullscreen.enabled ? -6 : Mods.Fullscreen.iMapBegin();
    };
    jMapBegin = function() {
        return 0 == Mods.Fullscreen.enabled ? -9 : Mods.Fullscreen.jMapBegin();
    };
    iMapTo = function() {
        return 0 == Mods.Fullscreen.enabled ? minimap ? 99 : 24 : Mods.Fullscreen.iMapTo();
    };
    jMapTo = function() {
        return 0 == Mods.Fullscreen.enabled ? minimap ? 99 : 21 : Mods.Fullscreen.jMapTo();
    };
    astar.search = function(event, selector, data, callback, cb) {
        return 0 == Mods.Fullscreen.enabled ? Mods.Fullscreen.astarsearchNew(event, selector, data, callback, cb) : Mods.Fullscreen.astarsearchOld(event, selector, data, callback, cb);
    };
    Mods.Fullscreen.astarsearchNew = function(grid, start, end, diagonal, heuristic) {
        var time;
        time = 6 == map_increase ? 15 : 5 + map_increase / 2;
        astar.init(grid, start, time + 1);
        heuristic = heuristic || astar.manhattan;
        diagonal = !!diagonal;
        var openHeap = astar.heap();
        for (openHeap.push(start); 0 < openHeap.size(); ) {
            var currentNode = openHeap.pop();
            if (currentNode === end) {
                grid = currentNode;
                for (start = []; grid.parent; ) start.push(grid), grid = grid.parent;
                return start.reverse();
            }
            currentNode.closed = !0;
            for (var neighbors = astar.neighbors(grid, currentNode, diagonal, start, time), e = 0, u = neighbors.length; e < u; e++) {
                var neighbor = neighbors[e];
                if (!neighbor.closed && !neighbor.isWall()) {
                    var gScore = currentNode.g + neighbor.cost, beenVisited = neighbor.visited;
                    if (!beenVisited || gScore < neighbor.g) neighbor.visited = !0, neighbor.parent = currentNode, 
                    neighbor.h = neighbor.h || heuristic(neighbor.pos, end.pos), neighbor.g = gScore, 
                    neighbor.f = neighbor.g + neighbor.h, beenVisited ? openHeap.rescoreElement(neighbor) : openHeap.push(neighbor);
                }
            }
        }
        return [];
    };
    createElem("div", "options_video", {
        innerHTML: "<span class='wide_link pointer' id='settings_fullscreen' onclick='Mods.Fullscreen.toggle();'>Fullscreen Mode (off)</span>"
    });
    getElem("my_text").style.zIndex = "90";
    Mods.Fullscreen.toggle();
    Mods.timestamp("fullscreen");
};

Load.autocast = function() {
    modOptions.autocast.time = timestamp();
    Mods.Autocast.toggle = function() {
        var elem = getElem("settings_autocast");
        switch (Mods.Autocast.enabled) {
          case 0:
            elem.innerHTML = "Autocast (off)";
            Mods.Autocast.enabled = 1;
            break;

          default:
            elem.innerHTML = "Autocast (on)", Mods.Autocast.enabled = 0;
        }
        localStorage.autocastenabled = JSON.stringify(Mods.Autocast.enabled);
    };
    Mods.Autocast.socketOn = {
        actions: [ "attack" ],
        fn: function(node, s, e) {
            0 == Mods.Autocast.enabled && 0 < players[0].params.magic_slots && "attack" === node && ("0" != e.defender && "0" != e.attacker || setTimeout(function() {
                Mods.Autocast.TryCast();
            }, 175));
        }
    };
    Mods.Autocast.TryCast = function() {
        if (inAFight && 0 == Mods.Autocast.enabled) {
            for (var x = 0; x < players[0].params.magic_slots; x++) players[0].params.magics[x] && players[0].params.magics[x].ready && Player.client_use_magic(x);
            Mods.Autocast.lastFullCast = timestamp();
            setTimeout(function() {
                Mods.Autocast.TryCast();
            }, 190);
        }
    };
    createElem("div", "options_game", {
        innerHTML: "<span class='wide_link pointer' id='settings_autocast' onclick='Mods.Autocast.toggle();'>Autocast (off)</span>"
    });
    Mods.Autocast.toggle();
    Mods.timestamp("autocast");
};

Load.expmonitor = function() {
    modOptions.expmonitor.time = timestamp();
    Mods.Expmonitor.socketOn = {
        actions: [ "message", "login" ],
        fn: function(me, e, r) {
            if ("message" == me && e.message && e.color === COLOR.TEAL && "whisper" != e.type) {
                var t = -1, k = timestamp(), props = [ "Current experience rate is 1x", "Event not running or time unknown", "Current experience rate is 2x", "Time left: " ];
                for (i in props) if (0 === e.message.indexOf(props[i])) {
                    t = Number(i);
                    break;
                }
                switch (t) {
                  case 0:
                  case 1:
                    Mods.Expmonitor.XPEventSeconds = 0;
                    break;

                  case 2:
                    5e3 < k - Mods.Expmonitor.LastLogin && 5e3 < k - Mods.Expmonitor.LastXpRequest ? (Mods.Expmonitor.XPEventSeconds = Mods.Expmonitor.XPEventSeconds < k ? k : Mods.Expmonitor.XPEventSeconds, 
                    Mods.Expmonitor.XPEventSeconds += 18e5) : (Mods.Expmonitor.LastXpRequest = timestamp(), 
                    Socket.send("message", {
                        data: "/xp"
                    }));
                    break;

                  case 3:
                    e = e.message.match(/Time left: (\d+\.\d+)\s*minute/);
                    0 < e.length && 60 < Math.abs(60 * e[1] - Mods.Expmonitor.XPEventSeconds) && (Mods.Expmonitor.XPEventSeconds = k + 1e3 * Math.round(60 * e[1]));
                    break;

                  default:
                    return;
                }
                Mods.Expmonitor.XPEventSeconds > k && "hidden" === getElem("xp_timer_holder").style.visibility && (getElem("xp_timer").innerHTML = "Calculating", 
                getElem("xp_timer_holder").style.visibility = "visible", Mods.Expmonitor.Timer());
            }
            "login" == me && "ok" == r.status && (Mods.Expmonitor.LastLogin = timestamp());
        }
    };
    Mods.Expmonitor.Timer = function() {
        var n = Math.round((Mods.Expmonitor.XPEventSeconds - timestamp()) / 1e3);
        0 < n ? (getElem("xp_timer").innerHTML = String(n).toHHMMSS(), Timers.set("check_2x", function() {
            Mods.Expmonitor.Timer();
        }, 1e3)) : getElem("xp_timer_holder").style.visibility = "hidden";
    };
    Mods.Expmonitor.setCanvasSize = function() {
        var n = 3, doneCount = bigIcons ? 64 : 32;
        (16 * current_ratio_y).toFixed(2);
        var n = n + (players[0].pet.enabled ? 1 : 0), n = n + (300 == players[0].map || 16 == players[0].map ? 1 : 0), data = getElem("xp_timer_holder");
        data.style.right = Math.round((doneCount * n + 4) * current_ratio_x) + "px";
        data.style.top = 23 * current_ratio_y + "px";
    };
    "Name" != players[0].name && (Mods.Expmonitor.LastXpRequest = timestamp(), Socket.send("message", {
        data: "/xp",
        lang: getElem("current_channel").value
    }));
    showCaptchaBonus = function() {
        document.getElementById("captcha_bonus_assign").style.display = "block";
        document.getElementById("penalty_points_bonus").innerHTML = -players[0].params.penalty;
        removeClass(document.getElementById("penalty_points_bonus"), "green");
        removeClass(document.getElementById("penalty_points_bonus"), "red");
        removeClass(document.getElementById("penalty_points_bonus"), "orange");
        addClass(document.getElementById("captcha_red"), "hidden");
        addClass(document.getElementById("captcha_green"), "hidden");
        if (0 < players[0].params.penalty) addClass(document.getElementById("penalty_points_bonus"), "red"), 
        removeClass(document.getElementById("captcha_red"), "hidden"), document.getElementById("penalty_bonus_points").value = 0; else {
            5 == -players[0].params.penalty ? addClass(document.getElementById("penalty_points_bonus"), "orange") : addClass(document.getElementById("penalty_points_bonus"), "green");
            removeClass(document.getElementById("captcha_green"), "hidden");
            document.getElementById("captcha_green").innerHTML = "* Assign points to get experience";
            var newValue = 0;
            "undefined" !== typeof Mods && "undefined" !== typeof Mods.Expmonitor && "undefined" !== typeof Mods.Expmonitor.XPEventSeconds && 0 < Mods.Expmonitor.XPEventSeconds ? newValue = -players[0].params.penalty : 0 < -players[0].params.penalty && (newValue = 1);
            document.getElementById("penalty_bonus_points").value = newValue;
        }
    };
    createElem("div", wrapper, {
        id: "xp_timer_holder",
        style: "visibility: hidden;",
        innerHTML: ""
    });
    createElem("div", xp_timer_holder, {
        id: "xp_label",
        innerHTML: "<span>2x</span><span style='font-size: 0.7em;'>exp</span>"
    });
    createElem("div", xp_timer_holder, {
        id: "xp_timer",
        innerHTML: ""
    });
    Mods.timestamp("expmonitor");
};

Load.kbind = function() {
    modOptions.kbind.time = timestamp();
    Mods.Kbind.Init = function() {
        for (var all = Mods.Kbind.AKbind, m = 0; m < all.length; m++) getElem("kbinding_" + m).checked ? (all[m].value = getElem("kbind_" + m).value, 
        all[m].enabled = !0) : (all[m].value = 0, all[m].enabled = !1);
        localStorage.AKbind = JSON.stringify(all);
    };
    Mods.Kbind.CastAll = function() {
        if (inAFight && 150 < timestamp() - Mods.Autocast.lastFullCast && GAME_STATE != GAME_STATES.CHAT) {
            for (var x = 0; x < players[0].params.magic_slots; x++) players[0].params.magics[x] && players[0].params.magics[x].ready && Player.client_use_magic(x);
            Mods.Autocast.lastFullCast = timestamp();
        }
    };
    Mods.blockKbind = !1;
    Mods.Kbind.Process = function(state, length) {
        var data = Mods.Kbind.AKbind;
        if (GAME_STATE != GAME_STATES.CHAT && hasClass(getElem("market"), "hidden") && !captcha && !Mods.blockKbind) {
            data[0].enabled && length == data[0].value && !players[0].temp.busy && Chest.deposit_all();
            data[1].enabled && length == data[1].value && !players[0].temp.busy && Mods.Petinv.unload();
            if (data[2].enabled && length == data[2].value && inAFight && 150 < timestamp() - Mods.Autocast.lastFullCast) {
                for (var m = 0; m < players[0].params.magic_slots; m++) players[0].params.magics[m].ready && Player.client_use_magic(m);
                Mods.Autocast.lastFullCast = timestamp();
            }
            data[3].enabled && length == data[3].value && inAFight && 150 < timestamp() - lastRunAwayAttempt && Socket.send("run_from_fight", {});
            lastRunAwayAttempt = timestamp();
            data[4].enabled && length == data[4].value && !players[0].temp.busy && Mods.Kbind.DestroyOres();
            data[5].enabled && length == data[5].value && !players[0].temp.busy && Mods.Petinv.load();
            data[6].enabled && length == data[6].value && !players[0].temp.busy && Mods.Kbind.eatfood();
            data[7].enabled && length == data[7].value && (getElem("inventory").style.zIndex = "199", 
            Mods.showBag = !Mods.showBag.valueOf(), Mods.showBag ? getElem("inventory").style.display = "block" : getElem("inventory").style.display = "");
            if (data[8].enabled && length == data[8].value && (data = getElem("chest"), !hasClass(data, "hidden"))) {
                data = 60 * (parseInt(chest_page) - 1) + parseInt(selected_chest);
                data = item_base[chests[0][data].id];
                m = data.params;
                state = data.b_t;
                var c = !1;
                (m.min_cooking || m.min_forging || m.min_jewelry || m.min_alchemy || m.min_farming || -1 < data.name.indexOf("Enchant Scroll") || 1 < m.min_magic && 5 != state && 0 != state && -1 == data.name.indexOf("Teleport") || 1 == state) && 4 != state && 14 != m.slot && (c = !0);
                c && Chest.withdraw(99);
                !c && Chest.withdraw(1);
            }
        }
    };
    Mods.Kbind.eatfood = function() {
        if (GAME_STATE != GAME_STATES.CHAT && skills[0].health.level > skills[0].health.current && 250 < timestamp() - Mods.Kbind.lastfoodeaten) {
            for (var c = !1, j = 0; j < players[0].temp.inventory.length; j++) if ("undefined" != typeof item_base[players[0].temp.inventory[j].id].params.heal) {
                inventoryClick(j) && (Mods.Kbind.lastfoodeaten = timestamp());
                c = !0;
                break;
            }
            c || addChatText("You have no food in inventory!", void 0, COLOR.WHITE);
        }
    };
    Mods.Kbind.DestroyOres = function(index) {
        if (GAME_STATE != GAME_STATES.CHAT) if (index = "number" == typeof index ? index : -1, 
        -1 == index) Popup.prompt("Do you want to destroy all ores in your bag?", function() {
            Mods.Kbind.DestroyOres(0);
        }); else if (index < players[0].temp.inventory.length) switch (parseInt(players[0].temp.inventory[index].id)) {
          case 184:
            Socket.send("inventory_destroy", {
                item_id: 184,
                all: !0
            });
            Timers.set("destroy cycle " + index, function() {
                Mods.Kbind.DestroyOres(index);
            }, 50);
            break;

          case 185:
            Socket.send("inventory_destroy", {
                item_id: 185,
                all: !0
            });
            Timers.set("destroy cycle " + index, function() {
                Mods.Kbind.DestroyOres(index);
            }, 50);
            break;

          case 484:
            Socket.send("inventory_destroy", {
                item_id: 484,
                all: !0
            });
            Timers.set("destroy cycle " + index, function() {
                Mods.Kbind.DestroyOres(index);
            }, 50);
            break;

          case 373:
            Socket.send("inventory_destroy", {
                item_id: 373,
                all: !0
            });
            Timers.set("destroy cycle " + index, function() {
                Mods.Kbind.DestroyOres(index);
            }, 50);
            break;

          case 657:
            Socket.send("inventory_destroy", {
                item_id: 657,
                all: !0
            });
            Timers.set("destroy cycle " + index, function() {
                Mods.Kbind.DestroyOres(index);
            }, 50);
            break;

          case 31:
            Socket.send("inventory_destroy", {
                item_id: 31,
                all: !0
            });
            Timers.set("destroy cycle " + index, function() {
                Mods.Kbind.DestroyOres(index);
            }, 50);
            break;

          case 383:
            Socket.send("inventory_destroy", {
                item_id: 383,
                all: !0
            });
            Timers.set("destroy cycle " + index, function() {
                Mods.Kbind.DestroyOres(index);
            }, 50);
            break;

          case 186:
            Socket.send("inventory_destroy", {
                item_id: 186,
                all: !0
            });
            Timers.set("destroy cycle " + index, function() {
                Mods.Kbind.DestroyOres(index);
            }, 50);
            break;

          case 32:
            Socket.send("inventory_destroy", {
                item_id: 32,
                all: !0
            });
            Timers.set("destroy cycle " + index, function() {
                Mods.Kbind.DestroyOres(index);
            }, 50);
            break;

          case 33:
            Socket.send("inventory_destroy", {
                item_id: 33,
                all: !0
            });
            Timers.set("destroy cycle " + index, function() {
                Mods.Kbind.DestroyOres(index);
            }, 50);
            break;

          case 30:
            Socket.send("inventory_destroy", {
                item_id: 30,
                all: !0
            });
            Timers.set("destroy cycle " + index, function() {
                Mods.Kbind.DestroyOres(index);
            }, 50);
            break;

          default:
            index++, Mods.Kbind.DestroyOres(index);
        }
    };
    Mods.Kbind.eventListener = {
        keys: {
            keyup: [ !0 ]
        },
        fn: function(m, response) {
            Mods.Kbind.Process(m, response);
        }
    };
    (function() {
        Mods.Kbind.AKbind = [ {
            value: 0,
            enabled: !1
        }, {
            value: 0,
            enabled: !1
        }, {
            value: 0,
            enabled: !1
        }, {
            value: 0,
            enabled: !1
        }, {
            value: 0,
            enabled: !1
        }, {
            value: 0,
            enabled: !1
        }, {
            value: 0,
            enabled: !1
        }, {
            value: 66,
            enabled: !0
        }, {
            value: 0,
            enabled: !1
        } ];
        keylist = {
            0: "<option value=0>(none)</option><option value=8>[BackSpace]</option> \r\n        <option value=9>[Tab]</option><option value=13>[Enter]</option> \r\n        <option value=27>[Esc]</option><option value=33>[PgUp]</option> \r\n        <option value=34>[PgDwn]</option><option value=35>[End]</option> \r\n        <option value=36>[Home]</option><option value=45>[Ins]</option> \r\n        <option value=46>[Delete]</option><option value=66>B</option> \r\n        <option value=67>C</option> \r\n        <option value=69>E</option><option value=70>F</option> \r\n        <option value=71>G</option><option value=72>H</option> \r\n        <option value=73>I</option><option value=74>J</option> \r\n        <option value=75>K</option><option value=76>L</option> \r\n        <option value=77>M</option><option value=78>N</option> \r\n        <option value=79>O</option><option value=80>P</option> \r\n        <option value=81>Q</option><option value=82>R</option> \r\n        <option value=84>T</option><option value=85>U</option> \r\n        <option value=86>V</option><option value=88>X</option> \r\n        <option value=89>Y</option><option value=90>Z</option> \r\n        <option value=96>[Numpad0]</option> \r\n        <option value=97>[Numpad1]</option><option value=98>[Numpad2]</option> \r\n        <option value=99>[Numpad3]</option><option value=100>[Numpad4]</option> \r\n        <option value=101>[Numpad5]</option><option value=102>[Numpad6]</option> \r\n        <option value=103>[Numpad7]</option><option value=104>[Numpad8]</option> \r\n        <option value=105>[Numpad9]</option>"
        };
        createElem("div", wrapper, {
            id: "keybinding_form",
            className: "menu",
            style: "position: absolute; display: none; z-index: 300; width: 330px; height: 245px; top: 50%; left: 50%; margin-left: -115px; margin-top: -122px;",
            innerHTML: "<span class='common_border_bottom'><span style='float:left; font-weight: bold;color:#FFFF00;'>Keybindings</span><span class='common_link' style='margin:0px;margin-bottom:2px;' onclick='javascript:Mods.Kbind.Init();getElem(\"keybinding_form\").style.display=\"none\";'>Close</span></span><div style='padding-top: 8px;'><table width='100%'><tr><td><input type='checkbox' id='kbinding_0' onclick='void(0);'></td><td><select id='kbind_0' class='market_select'>" + keylist[0] + "</select></td><td>Deposit All+ in chest</td></tr><tr><td><input type='checkbox' id='kbinding_1' onclick='void(0);'></td><td><select id='kbind_1' class='market_select'>" + keylist[0] + "</select></td><td>Unload pet inventory</td></tr><tr><td><input type='checkbox' id='kbinding_5' onclick='void(0);'></td><td><select id='kbind_5' class='market_select'>" + keylist[0] + "</select></td><td>Load pet inventory</td></tr><tr><td><input type='checkbox' id='kbinding_2' onclick='void(0);'></td><td><select id='kbind_2' class='market_select'>" + keylist[0] + "</select></td><td>Cast all magic.</td></tr><tr><td><input type='checkbox' id='kbinding_3' onclick='void(0);'></td><td><select id='kbind_3' class='market_select'>" + keylist[0] + "</select></td><td>Run from fight</td></tr><tr><td><input type='checkbox' id='kbinding_4' onclick='void(0);'></td><td><select id='kbind_4' class='market_select'>" + keylist[0] + "</select></td><td>Destroy all ores in bag</td></tr><tr><td><input type='checkbox' id='kbinding_6' onclick='void(0);'></td><td><select id='kbind_6' class='market_select'>" + keylist[0] + "</select></td><td>Eat food in inventory</td></tr><tr><td><input type='checkbox' id='kbinding_7' onclick='void(0);'></td><td><select id='kbind_7' class='market_select'>" + keylist[0] + "</select></td><td>Toggle inventory</td></tr><tr><td><input type='checkbox' id='kbinding_8' onclick='void(0);'></td><td><select id='kbind_8' class='market_select'>" + keylist[0] + "</select></td><td>Withdraw 1 or All</td></tr></table></div>"
        });
        var data = Mods.Kbind.AKbind;
        localStorage.AKbind = localStorage.AKbind || JSON.stringify(data);
        for (var c = JSON.parse(localStorage.AKbind), n = 0; n < data.length; n++) c[n] = void 0 != c[n] ? c[n] : data[n];
        data = Mods.Kbind.AKbind = c;
        localStorage.AKbind = JSON.stringify(data);
        for (c = 0; c < data.length; c++) getElem("kbinding_" + c).checked = data[c].enabled, 
        getElem("kbind_" + c).value = data[c].value;
        data = document.createElement("span");
        data.className = "wide_link";
        data.id = "keybinding_link";
        data.style.cssFloat = "left";
        data.onclick = function() {
            getElem("keybinding_form").style.display = "block";
        };
        data.innerHTML = "Keybindings";
        c = getElem("mods_link");
        getElem("settings").insertBefore(data, c);
        Mods.Kbind.Init();
        CompiledTemplate.magic_slots = Handlebars.compile("{{#each this.magics}}<div class='magic_outer pointer' style='{{magic_image this.id}};'><div class='magic_inner' id='magic_slot_{{this.i}}' onclick='Player.client_use_magic({{this.i}})' onmouseover='mouseOverMagic({{this.i}})' onmouseout='mouseOutMagic({{this.i}})'>{{this.count}}</div></div>{{/each}}<div class='magic_outer'><div class='magic_inner pointer' style='font-size:10px;text-align: center;background-color: rgba(0, 0, 0, 0.8);' id='magic_slot_all' onclick='Mods.Kbind.CastAll()'>Cast All</div></div>");
    })();
    Mods.timestamp("kbind");
};

Load.petinv = function() {
    modOptions.petinv.time = timestamp();
    Mods.Petinv.invHeight = function() {
        var index = getElem("inventory");
        if (players[0].pet.enabled) var login = pets[players[0].pet.id].params.inventory_slots;
        var me = getElem("inv_pet_settings"), mask = getElem("pet_inv_expand"), container = getElem("pet_inv_unload"), options = getElem("pet_inv_load");
        if (!players[0].pet.enabled) for (index.style.paddingBottom = "2px", addClass(me, "hidden"), 
        addClass(mask, "hidden"), addClass(container, "hidden"), addClass(options, "hidden"), 
        getElem("inv_pet_chest").style.borderTop = "", getElem("shift_click").style.display = "none", 
        getElem("inv_checkbox").style.display = "none", index = 0; 16 > index; index++) getElem("inv_pet_chest_" + index).style.display = "none"; else if (players[0].pet.enabled && Mods.Petinv.petInv_toggle) getElem("shift_click").style.display = "block", 
        getElem("inv_checkbox").style.display = "block", mask.innerHTML = "Pet's chest <span style='color:grey;font-size:80%;vertical-align:middle;'>(click to close)</span><br>", 
        getElem("inv_pet_chest").style.borderTop = "1px solid #666666", Mods.Petinv.init_menuInv(), 
        9 > login && players[0].pet.enabled && Mods.Petinv.petInv_toggle ? (index.style.paddingBottom = "76px", 
        me.style.top = "258px", removeClass(me, "hidden"), removeClass(mask, "hidden"), 
        removeClass(options, "hidden"), removeClass(container, "hidden")) : 8 < login && players[0].pet.enabled && Mods.Petinv.petInv_toggle && (index.style.paddingBottom = "114px", 
        me.style.top = "297px", removeClass(me, "hidden"), removeClass(mask, "hidden"), 
        removeClass(options, "hidden"), removeClass(container, "hidden")); else if (players[0].pet.enabled && !Mods.Petinv.petInv_toggle) {
            getElem("shift_click").style.display = "none";
            getElem("inv_checkbox").style.display = "none";
            index.style.paddingBottom = "23px";
            addClass(me, "hidden");
            removeClass(mask, "hidden");
            removeClass(container, "hidden");
            removeClass(options, "hidden");
            getElem("inv_pet_chest").style.borderTop = "1px solid #666666";
            for (index = 0; 16 > index; index++) getElem("inv_pet_chest_" + index).style.display = "none";
            mask.innerHTML = "Pet's chest <span style='color:grey;font-size:80%;vertical-align:middle;'>(click to expand)</span><br>";
        }
    };
    Mods.Petinv.spawnInvPetChest = function() {
        for (a = 0; 16 > a; a++) createElem("div", "inv_pet_chest", {
            id: "inv_pet_chest_" + a,
            className: "inv_item",
            innerHTML: "&nbsp;"
        });
    };
    Mods.Petinv.init_menuInv = function() {
        for (var index = 0; 16 > index; index++) players[0].pet.enabled ? getElem("inv_pet_chest_" + index).style.display = pets[players[0].pet.id].params.inventory_slots > index ? "inline-block" : "none" : getElem("inv_pet_chest_" + index).style.display = "none";
        if (players[0].pet.enabled) {
            for (index = 0; index < pets[players[0].pet.id].params.inventory_slots; index++) {
                var elem = getElem("inv_pet_chest_" + index);
                removeClass(elem, "selected");
                if ("undefined" != typeof players[0].pet.chest[index]) {
                    var me = item_base[players[0].pet.chest[index]], sprite = IMAGE_SHEET[me.img.sheet];
                    elem.style.background = 'url("' + sprite.url + '") no-repeat scroll ' + -me.img.x * sprite.tile_width + "px " + -me.img.y * sprite.tile_height + "px transparent";
                } else elem.style.background = "";
            }
            index = pets[players[0].pet.id];
            index = index.params.xp_required ? "Pet experience " + Math.round(players[0].pet.xp) + " / " + index.params.xp_required + " (" + Math.round(players[0].pet.xp / index.params.xp_required * 100) + "%)" : index.params.requires_stone ? "Pet needs Stone of Evolution to evolve." : "Pet has reached its maximum level.";
            getElem("inv_pet_settings").innerHTML = index;
        }
        for (index = 0; 40 > index; index++) elem = getElem("inv_" + index), "undefined" != typeof players[0].temp.inventory[index] ? (me = item_base[players[0].temp.inventory[index].id], 
        sprite = IMAGE_SHEET[me.img.sheet], elem.style.background = 'url("' + sprite.url + '") no-repeat scroll ' + -me.img.x * sprite.tile_width + "px " + -me.img.y * sprite.tile_height + "px transparent") : elem.style.background = "";
    };
    Mods.Petinv.invSendItemCheck = function(n) {
        enableShiftClick = getElem("shift_click").checked;
        return 0 == Mods.Petinv.petInv_toggle || 0 == players[0].pet.enabled ? !1 : 1 == n && 1 == enableShiftClick || 0 == n && 0 == enableShiftClick ? !0 : !1;
    };
    Mods.Petinv.createFunc = function(method) {
        return function(ev) {
            Mods.disableInvClick || (Mods.Petinv.invSendItemCheck(ev.shiftKey) ? Pet.menu_add(method) : (inventoryClick(method), 
            left_click_cancel = !0));
        };
    };
    Mods.Petinv.socketOn = {
        actions: [ "my_pet_data", "skills" ],
        fn: function(m, k) {
            if ("my_pet_data" == m || "skills" == m) Mods.Petinv.init_menuInv(), Mods.Petinv.invHeight();
        }
    };
    Mods.Petinv.unload = function(id) {
        if (players[0].pet.enabled) var len = pets[players[0].pet.id].params.inventory_slots;
        id = "number" == typeof id ? id : 0;
        id < len && (Pet.menu_remove(id), 40 > players[0].temp.inventory.length && 0 < players[0].pet.chest.length && Timers.set("unload pet inv" + id, function() {
            Mods.Petinv.unload(id);
        }, 81));
    };
    Mods.Petinv.load = function(id) {
        if (players[0].pet.enabled) var len = pets[players[0].pet.id].params.inventory_slots;
        id = "number" == typeof id ? id : players[0].temp.inventory.length - 1;
        0 < id && players[0].pet.chest.length < len && (players[0].temp.inventory[id].selected ? Mods.Petinv.load(id - 1) : (Pet.menu_add(id), 
        Timers.set("load pet inv" + id, function() {
            Mods.Petinv.load(id - 1);
        }, 81)));
    };
    (function() {
        getElem("inventory").style.paddingBottom = "114px";
        createElem("div", "inventory", {
            id: "inv_pet_chest",
            style: "border-top: 1px solid #666; position: absolute; top: 203px; padding-top: 2px; width: 288px; margin-bottom: 17px; color #FF0; display: block;"
        });
        createElem("div", "inventory", {
            id: "inv_pet_settings",
            style: "position: absolute; top: 297px; text-size: 80%;",
            innerHTML: "Pet has reached its maximum level."
        });
        createElem("div", "inv_pet_chest", {
            id: "pet_inv_expand",
            style: "height: 17px; width: 265px; top: 0px; vertical-align: middle;",
            innerHTML: "Pet's chest <span style='color:grey;font-size:80%;vertical-align:middle;'>(click to close)</span><br>"
        });
        createElem("input", "inv_pet_chest", {
            id: "shift_click",
            type: "checkbox",
            style: "position: absolute; right: 0px; top: 0px;"
        });
        createElem("div", "inv_pet_chest", {
            id: "inv_checkbox",
            title: "When set to (send items), hold Shift and click items in your inventory to send them to your pet chest.\nRegular click uses/equips the items. Toggle to (use items) to reverse this functionality.",
            style: "position: absolute; right: 21px; top: 4px; font-size: .8em; color: grey;",
            innerHTML: "use items = shift+click"
        });
        createElem("span", "inventory", {
            id: "pet_inv_load",
            className: "common_link",
            style: "color: #999; font-size: .8em; font-weight: normal; margin: 0px; padding: 0px 5px 2px 0px; position: absolute; bottom: 0%; right: 42px;",
            innerHTML: "(load)",
            onclick: "Mods.Petinv.load()"
        });
        createElem("span", "inventory", {
            id: "pet_inv_unload",
            className: "common_link",
            style: "color: #999; font-size: .8em; font-weight: normal; margin: 0px; padding: 0px 5px 2px 0px; position: absolute; bottom: 0%; right: 0%;",
            innerHTML: "(unload)",
            onclick: "Mods.Petinv.unload()"
        });
        Mods.Petinv.spawnInvPetChest();
        getElem("shift_click").checked = Mods.Petinv.enableShiftClick_check;
        for (a = 0; 40 > a; a++) getElem("inv_" + a).onclick = Mods.Petinv.createFunc(a);
        for (a = 0; 16 > a; a++) getElem("inv_pet_chest_" + a).onclick = function(id) {
            return function() {
                Pet.menu_remove(id);
            };
        }(a);
        getElem("pet_inv_expand").onclick = new Function("Mods.Petinv.petInv_toggle = !Mods.Petinv.petInv_toggle;Mods.Petinv.invHeight();");
        Mods.Petinv.invHeight();
        Mods.Petinv.init_menuInv();
        Mods.Petinv.enableShiftClick_check ? (getElem("inv_checkbox").innerHTML = "send items = shift+click", 
        getElem("shift_click").checked = !0) : (getElem("inv_checkbox").innerHTML = "use items = shift+click", 
        getElem("shift_click").checked = !1);
        getElem("shift_click").onclick = function() {
            Mods.Petinv.enableShiftClick_check = !Mods.Petinv.enableShiftClick_check;
            (localStorage.enableShiftClick = Mods.Petinv.enableShiftClick_check) ? getElem("inv_checkbox").innerHTML = "send items = shift+click" : getElem("inv_checkbox").innerHTML = "use items = shift+click";
        };
    })();
    Mods.timestamp("petinv");
};

Load.magicm = function() {
    modOptions.magicm.time = timestamp();
    Mods.Magicm.socketOn = {
        actions: [ "message" ],
        fn: function(file, data, error) {
            data.color == COLOR.GREEN && -1 < data.message.search("magic damage") && (file = data.message.substr(1, data.message.search(" magic") - 1), 
            /locked/.test(file) || Mods.Magicm.show_magic_damage(file));
        }
    };
    Mods.Magicm.show_magic_damage = function(authorstring) {
        var node = getElem("enemy_hit").cloneNode(!0), data = Mods.Magicm.enemy, b = Mods.Magicm.magic_damage_timers, s = 0 == b[0] ? 0 : 0 == b[1] ? 1 : 0 == b[2] ? 2 : 0 == b[3] ? 3 : b[0] <= b[1] ? 0 : b[1] <= b[2] ? 1 : b[2] <= b[3] ? 2 : 3, x = 0 == s || 2 == s ? (s / 2 * -1 - .5) * half_tile_width_round : s / 2 * half_tile_width_round, y = -2 * half_tile_height_round, p = players[0].temp.target_id, p = objects_data[p] || players[p];
        data != p && (data = Mods.Magicm.magic_damage_timers, data[0] = data[1] = data[2] = data[3] = 0, 
        data = Mods.Magicm.enemy = p);
        data && (p = translateTileToCoordinates(data.i, data.j), translateTileToCoordinates(dx, dy), 
        node.id = "magic_" + s + data.id + new Date().getTime(), removeClass(node, "hidden"), 
        node.innerHTML = getElem("enemy_hit").innerHTML, node.childNodes[1].innerHTML = authorstring, 
        wrapper.appendChild(node), node.style.left = (p.x + 16 + players[0].mx + x) * current_ratio_x + "px", 
        node.style.top = (p.y - 40 + players[0].my + y) * current_ratio_y + "px", addClass(node, "opacity_100"), 
        b[s] = 100, setTimeout(function() {
            decreaseOpacity(node, 150, 10);
            Mods.Magicm.decreaseMagic(s, 150, 10);
        }, 150));
    };
    Mods.Magicm.decreaseMagic = function(prop, val, idx) {
        0 < Mods.Magicm.magic_damage_timers[prop] && (Mods.Magicm.magic_damage_timers[prop] = Math.max(Mods.Magicm.magic_damage_timers[prop] - idx, 0), 
        setTimeout(function() {
            Mods.Magicm.decreaseMagic(prop, val, idx);
        }, val));
    };
    Mods.timestamp("magicm");
};

Load.wikimd = function() {
    modOptions.wikimd.time = timestamp();
    Mods.Wikimd.populate_item_formulas = function() {
        Mods.Wikimd.item_formulas = {};
        for (var n in item_base) {
            var data = item_base[n], id = data.b_i, result = ITEM_CATEGORY[data.b_t], name = data.name, obj = data.params, m = data.temp, x = data.img, type = Mods.Wikimd.item_slots[obj.slot] || "none", value = thousandSeperate(obj.price), v = "none", _ref = "none", data = obj.enchant_id, _ref2 = 10 == obj.slot ? Magic[obj.magic].params : !1;
            "L.Hand" == type && 3 == obj.disable_slot && (type = "2 Hands");
            for (var key in skills[0]) "undefined" != typeof obj["min_" + key] && (v = capitaliseFirstLetter(key), 
            _ref = item_base[n].params["min_" + key]);
            "undefined" != typeof obj.heal && (v = "Food", _ref = obj.heal);
            Mods.Wikimd.item_formulas[id] = Mods.Wikimd.item_formulas[id] || {};
            Mods.Wikimd.item_formulas[id].id = id;
            Mods.Wikimd.item_formulas[id].type = result;
            Mods.Wikimd.item_formulas[id].name = name;
            Mods.Wikimd.item_formulas[id].params = obj;
            Mods.Wikimd.item_formulas[id].temp = m;
            Mods.Wikimd.item_formulas[id].img = x;
            Mods.Wikimd.item_formulas[id].skill = v;
            Mods.Wikimd.item_formulas[id].level = _ref;
            Mods.Wikimd.item_formulas[id].slot = type;
            Mods.Wikimd.item_formulas[id].price = value;
            data && (Mods.Wikimd.item_formulas[id].enchant = Mods.Wikimd.item_formulas[id].enchant || {}, 
            Mods.Wikimd.item_formulas[id].enchant.to_enchant = data, v = obj.min_accuracy ? Forge.enchantingChancesWeapon : obj.min_defense ? Forge.enchantingChancesArmor : Forge.enchantingChancesJewelry, 
            Mods.Wikimd.item_formulas[id].enchant.low = Math.min(1, (obj.enchant_bonus || 0) + (v[176] && v[176](_ref) || v[64] && v[64](_ref) || v[1125] && v[1125](_ref) || 0)), 
            Mods.Wikimd.item_formulas[id].enchant.med = Math.min(1, (obj.enchant_bonus || 0) + (v[177] && v[177](_ref) || v[173] && v[173](_ref) || v[1126] && v[1126](_ref) || 0)), 
            Mods.Wikimd.item_formulas[id].enchant.high = Math.min(1, (obj.enchant_bonus || 0) + (v[178] && v[178](_ref) || v[174] && v[174](_ref) || v[1127] && v[1127](_ref) || 0)), 
            Mods.Wikimd.item_formulas[id].enchant.sup = Math.min(1, (obj.enchant_bonus || 0) + (v[179] && v[179](_ref) || v[175] && v[175](_ref) || v[1128] && v[1128](_ref) || 0)), 
            Mods.Wikimd.item_formulas[data] = Mods.Wikimd.item_formulas[data] || {}, Mods.Wikimd.item_formulas[data].enchant = Mods.Wikimd.item_formulas[data].enchant || {}, 
            Mods.Wikimd.item_formulas[data].enchant.from_enchant = id);
            _ref2 && (Mods.Wikimd.item_formulas[id].magic = _ref2);
        }
        for (n in object_base) if (obj = object_base[n], "undefined" != typeof obj.params.results) for (key in m = obj.params.results, 
        m) {
            var _ref2 = m[key].returns, filename;
            for (filename in _ref2) if (data = _ref2[filename], id = data.id, result = {}, result.name = obj.name, 
            result.id = obj.b_i, result.type = obj.type, result.img = obj.img, result.b_t = obj.b_t, 
            v = m[key].skill, name = m[key].requires, _ref = data.level, type = data.base_chance || null, 
            value = data.max_chance || null, x = data.xp || null, data = data.consumes || null, 
            "health" != v) {
                Mods.Wikimd.item_formulas[id].craft = Mods.Wikimd.item_formulas[id].craft || {};
                Mods.Wikimd.item_formulas[id].craft.level = _ref;
                Mods.Wikimd.item_formulas[id].craft.xp = x;
                Mods.Wikimd.item_formulas[id].craft.source = Mods.Wikimd.item_formulas[id].craft.source || {};
                Mods.Wikimd.item_formulas[id].craft.source.object = result;
                Mods.Wikimd.item_formulas[id].craft.source.skill = v;
                Mods.Wikimd.item_formulas[id].craft.source.patterns = Mods.Wikimd.item_formulas[id].craft.source.patterns || {};
                var j = 0, _ref = !0, doc;
                for (doc in Mods.Wikimd.item_formulas[id].craft.source.patterns) {
                    v = Mods.Wikimd.item_formulas[id].craft.source.patterns[doc];
                    if (v.base_chance == type && v.max_chance == value) {
                        var _ref = !1, p;
                        for (p in v.requires) {
                            for (var _c in name) p == _c && v.requires[p] != name[_c] && (_ref = !0);
                            if (_ref) break;
                        }
                    }
                    _ref && j++;
                }
                _ref && (Mods.Wikimd.item_formulas[id].craft.source.patterns[j] = {
                    consumes: data,
                    requires: name,
                    base_chance: type,
                    max_chance: value,
                    source: result
                });
            }
        }
        for (j in FORGE_FORMULAS) {
            data = FORGE_FORMULAS[j];
            id = data.item_id;
            obj = object_base[36];
            result = {};
            result.name = obj.name;
            result.id = obj.b_i;
            result.type = obj.type;
            result.img = obj.img;
            result.b_t = obj.b_t;
            v = "forging";
            _ref = data.level;
            filename = data.chance;
            doc = data.pattern || null;
            x = data.xp;
            name = data.materials;
            data = {};
            for (n in name) data[n] = name[n];
            delete data[36];
            name[36] = 1;
            Mods.Wikimd.item_formulas[id].craft = Mods.Wikimd.item_formulas[id].craft || {};
            Mods.Wikimd.item_formulas[id].craft.level = _ref;
            Mods.Wikimd.item_formulas[id].craft.xp = x;
            Mods.Wikimd.item_formulas[id].craft.source = Mods.Wikimd.item_formulas[id].craft.source || {};
            Mods.Wikimd.item_formulas[id].craft.source.object = result;
            Mods.Wikimd.item_formulas[id].craft.source.skill = v;
            Mods.Wikimd.item_formulas[id].craft.source.patterns = Mods.Wikimd.item_formulas[id].craft.source.patterns || {};
            Mods.Wikimd.item_formulas[id].craft.source.patterns[j] = {
                pattern: doc,
                requires: name,
                chance: filename,
                consumes: data
            };
        }
        for (j in CARPENTRY_FORMULAS) {
            doc = CARPENTRY_FORMULAS[j];
            result = {
                name: "House"
            };
            result.type = j;
            filename = 1;
            var v = "Carpentry", k;
            for (k in doc) {
                data = doc[k];
                id = data.item_id;
                _ref = data.level;
                data = data.consumes;
                x = 0;
                for (n in data) "length" != n && (x += CARPENTRY_MATERIAL_XP[data[n].id] * data[n].count);
                name = data;
                Mods.Wikimd.item_formulas[id].craft = Mods.Wikimd.item_formulas[id].craft || {};
                Mods.Wikimd.item_formulas[id].craft.level = _ref;
                Mods.Wikimd.item_formulas[id].craft.xp = x;
                Mods.Wikimd.item_formulas[id].craft.source = Mods.Wikimd.item_formulas[id].craft.source || {};
                Mods.Wikimd.item_formulas[id].craft.source.object = result;
                Mods.Wikimd.item_formulas[id].craft.source.skill = v;
                Mods.Wikimd.item_formulas[id].craft.source.patterns = Mods.Wikimd.item_formulas[id].craft.source.patterns || {};
                Mods.Wikimd.item_formulas[id].craft.source.patterns[k] = {
                    requires: name,
                    chance: filename,
                    consumes: data
                };
            }
        }
        for (n in npc_base) {
            obj = npc_base[n];
            if ("undefined" != typeof obj.params.drops) for (key in k = obj.params.drops, k) data = k[key], 
            id = data.id, name = obj.name, j = obj.b_i, result = obj.b_t, x = obj.img, filename = data.chance, 
            _ref = obj.level, Mods.Wikimd.item_formulas[id].drop = Mods.Wikimd.item_formulas[id].drop || {}, 
            Mods.Wikimd.item_formulas[id].drop.sources = Mods.Wikimd.item_formulas[id].drop.sources || {}, 
            Mods.Wikimd.item_formulas[id].drop.sources[n] = {
                name: name,
                id: j,
                level: _ref,
                type: result,
                chance: filename,
                img: x
            };
            if ("undefined" != typeof obj.temp.content) for (key in _ref = obj.temp.content, 
            _ref) data = _ref[key], id = data.id, name = obj.name, j = obj.b_i, result = obj.b_t, 
            x = obj.img, k = data.count || 0, v = data.spawn || !1, Mods.Wikimd.item_formulas[id].sold = Mods.Wikimd.item_formulas[id].sold || {}, 
            Mods.Wikimd.item_formulas[id].sold.sources = Mods.Wikimd.item_formulas[id].sold.sources || {}, 
            Mods.Wikimd.item_formulas[id].sold.sources[n] = {
                name: name,
                id: j,
                count: k,
                type: result,
                spawn: v,
                img: x
            };
        }
        Mods.Wikimd.populate_formulas();
    };
    Mods.Wikimd.populate_formulas = function() {
        var data = Mods.Wikimd.item_formulas, events = Mods.Wikimd.formulas = {}, key = 0, result, arr, ret, options, k, p;
        for (p in data) if ("undefined" != typeof data[p].craft) {
            var patterns = data[p].craft.source.patterns, format;
            for (format in patterns) {
                events[key] = {};
                events[key].id = data[p].id;
                events[key].img = data[p].img;
                events[key].name = data[p].name;
                events[key].skill = data[p].craft.source.skill;
                events[key].object = patterns[format].source || data[p].craft.source.object;
                events[key].pattern = patterns[format];
                events[key].xp = data[p].craft.xp;
                events[key].level = data[p].craft.level;
                result = {};
                arr = events[key].pattern.requires;
                ret = {};
                options = events[key].pattern.consumes;
                for (k in options) "object" == typeof options[k] ? ret[options[k].id] = options[k].count : ret[k] = options[k];
                for (k in arr) "object" == typeof arr[k] ? "undefined" != typeof arr[k].id && "undefined" != typeof arr[k].count ? result[arr[k].id] = arr[k].count : result[arr[k]] = 1 : "Anvil" != events[key].object.name ? result[arr[k]] = 1 : result[k] = arr[k];
                options = arr = 0;
                for (k in result) "length" != k && (arr += parseInt(result[k]));
                for (k in ret) "length" != k && (options += parseInt(ret[k]));
                delete events[key].pattern.consumes;
                delete events[key].pattern.requires;
                events[key].pattern.requires = result;
                events[key].pattern.consumes = ret;
                events[key].pattern.requires.length = arr;
                events[key].pattern.consumes.length = options;
                key++;
            }
        }
    };
    Mods.Wikimd.populate_pets = function() {
        for (var data = Mods.Wikimd.pet_family = {}, index = 0, length = pets.length, index = 0; 2 > index; index++) for (var stylesNumOld in pets) {
            var id = length - stylesNumOld, type = pets[id].params.item_id, x = pets[id].params.level;
            data[type] = data[type] || {};
            data[type][x] = type;
            id = pets[id].params.next_pet_item_id;
            void 0 != id && (data[type][x + 1] = id);
            for (var n in data[type]) for (var key in data[type]) data[data[type][n]] = data[data[type][n]] || {}, 
            data[data[type][n]][key] = data[type][key];
            if (1 == index) for (n in Mods.Wikimd.formulas) if (Mods.Wikimd.formulas[n].id == type && "Big Treasure Chest" != Mods.Wikimd.formulas[n].object.name) {
                data[type] = Mods.Wikimd.formulas[n];
                break;
            }
        }
    };
    Mods.Wikimd.populate_family = function() {
        var s = Mods.Wikimd.pet_family, example_data = Mods.Wikimd.family = {}, sptr;
        for (sptr in s) {
            var html = void 0 != s[sptr][1] ? s[sptr][1] : void 0 != s[sptr][2] ? s[sptr][2] : void 0 != s[sptr][3] ? s[sptr][3] : void 0 != s[sptr][4] ? s[sptr][4] : s[sptr][5];
            "number" == typeof html && 0 < html && (html = pets[item_base[html].params.pet].name, 
            html = html.replace(/ ?(Baby|\[|\]|Ancient|Legendary|Rare|Common) ?/gi, ""), example_data[sptr] = html);
        }
    };
    Mods.Wikimd.loadDivs = function() {
        createElem("div", "mods_form", {
            id: "mod_wiki_mods_options",
            className: "common_border_bottom scrolling_allowed",
            style: "width: 100%; height: 24px; margin-bottom: 5px; font-size: .8em; display: none;",
            innerHTML: "<select     id='mods_wiki_type'                  class='market_select scrolling_allowed'             style='float:left;     margin:0px;                         width:70px;'></select><select     id='mods_wiki_type_item'             class='market_select scrolling_allowed'             style='float:left;     margin:0px;     margin-left:6px;     width:70px;         display:none;                        '></select><select     id='mods_wiki_type_monster'          class='market_select scrolling_allowed'             style='float:left;     margin:0px;     margin-left:6px;     width:70px;         display:none;                        '></select><select     id='mods_wiki_type_vendor'           class='market_select scrolling_allowed'             style='float:left;     margin:0px;     margin-left:6px;     width:70px;         display:none;                        '></select><select     id='mods_wiki_type_craft'            class='market_select scrolling_allowed'             style='float:left;     margin:0px;     margin-left:6px;     width:70px;         display:none;                        '></select><select     id='mods_wiki_type_enchant'          class='market_select scrolling_allowed'             style='float:left;     margin:0px;     margin-left:6px;     width:70px;         display:none;                        '></select><select     id='mods_wiki_type_pet'              class='market_select scrolling_allowed'             style='float:left;     margin:0px;     margin-left:6px;     width:70px;         display:none;                        '></select><select     id='mods_wiki_type_spell'            class='market_select scrolling_allowed'             style='float:left;     margin:0px;     margin-left:6px;     width:70px;         display:none;                        '></select><select     id='mods_wiki_type_item_type'        class='market_select scrolling_allowed'             style='float:left;     margin:0px;     margin-left:6px;     width:80px;         display:none;                        '></select><select     id='mods_wiki_type_item_skill'       class='market_select scrolling_allowed'             style='float:left;     margin:0px;     margin-left:6px;     width:80px;         display:none;                        '></select><select     id='mods_wiki_type_craft_skill'      class='market_select scrolling_allowed'             style='float:left;     margin:0px;     margin-left:6px;     width:80px;         display:none;                        '></select><select     id='mods_wiki_type_craft_source'     class='market_select scrolling_allowed'             style='float:left;     margin:0px;     margin-left:6px;     width:80px;         display:none;                        '></select><input      id='mods_wiki_name' type='text'      class='market_select scrolling_allowed'             style='float:left;                     margin-left:6px;     width:200px;        display:none;     height:16px;       '></input><button     id='mods_wiki_load'                  class='market_select pointer scrolling_allowed'     style='                margin:0px;                                                                margin-bottom:2px; '>Go!</button>"
        });
        createElem("span", "mod_wiki_mods_options", {
            id: "mods_wiki_range_separate",
            className: "scrolling_allowed",
            style: "float: left; margin-left: 6px; height: 20px; display: none; border-left: 1px solid #FFF;",
            onclick: "javascript:Mods.Wikimd.loadWikiType(false);",
            innerHTML: "<select id='mods_wiki_range' class='market_select scrolling_allowed' style='float:left; margin-left:6px; width:70px; display:none; margin-top:0px;'></input>"
        });
        createElem("span", "mod_wiki_mods_options", {
            id: "mods_wiki_level",
            className: "scrolling_allowed",
            style: "float: left; margin-left: 6px; display: none;",
            onclick: "javascript:Mods.Wikimd.loadWikiType(false);",
            innerHTML: "<input type='text' id='mods_wiki_level_low' class='market_select scrolling_allowed' style='width: 25px; margin-right: 5px; height:16px; float:left;'><span class='scrolling_allowed' style='float:left; margin-top:3px;'>to</span><input type='text' id='mods_wiki_level_high' class='market_select scrolling_allowed' style='width: 25px;margin-left: 5px; height:16px; float:left;'>"
        });
        for (var buffer = "", c = 0; 300 > c; c++) for (var column = 0; 3 > column; column++) if (0 == column) buffer += "<tr class='scrolling_allowed wiki_f2 hidden' id='wiki_row" + column + "_" + c + "'><td colspan='7'>&nbsp;</td></tr>"; else {
            for (var me = "<tr class='scrolling_allowed hidden' id='wiki_row" + column + "_" + c + "'>", p = c, start = column, end = "", n = 0; 6 > n; n++) {
                var hop = "<td class='scrolling_allowed' id='wiki_row" + start + "_col" + n + "_" + p + "'>", key = (0 == p ? "<div style='padding-top: 3px' " : "<span ") + "class='scrolling_allowed' id='wiki_row", value = "<div class='scrolling_allowed' id='wiki_row" + start + "_col" + n + "_div_" + p + "'>";
                0 == n && (value += "<div class='scrolling_allowed' id='wiki_row" + start + "_col" + n + "_img_" + p + "'>&nbsp;</div>");
                value += key + start + "_col" + n + "_text_" + p + (0 == p ? "'>&nbsp;</div>" : "'>&nbsp;</span>");
                value += "</div>";
                end += hop + value + "</td>";
            }
            buffer += me + end + "</tr>";
        }
        createElem("div", "mods_form", {
            id: "mod_wiki_options",
            className: "scrolling_allowed",
            style: "display: block; height: 250px; overflow-x: hidden;",
            innerHTML: "<span class='scrolling_allowed' id='mod_wiki_search'>" + ("<table id='mod_wiki_search_items_table' class='scrolling_allowed' cellspacing='0' cellpadding='0' style='font-size: 0.8em; width:100%; margin-top:5px; padding-right:1px;'>" + buffer + "</table>") + "</span>"
        });
        createElem("div", wrapper, {
            id: "wiki_recipe_form",
            className: "menu",
            style: "position: relative; left: 50%; top: 30%; z-index: 99999999; width: 145px; height: 163px; display: none;"
        });
        createElem("span", "wiki_recipe_form", {
            id: "wiki_recipe_top",
            innerHTML: "<span class='pointer' style='font-weight: bold; color: #FFFFFF; float: right;' onclick='javascript: getElem(&apos;wiki_recipe_form&apos;).style.display = &apos;none&apos;'>Close</span>"
        });
        createElem("div", "wiki_recipe_form", {
            id: "wiki_recipe_holder",
            style: "position: relative; display: inline-block; float: left;"
        });
        for (c = 0; 4 > c; c++) for (column = 0; 4 > column; column++) createElem("div", "wiki_recipe_holder", {
            id: "wiki_formula_" + c + "_" + column,
            className: "inv_item",
            style: "display: inline-block; width: 32px; height: 32px; border: 1px solid #999; margin: 1px; float: left;",
            innerHTML: "&nbsp;"
        });
        getElem("mods_wiki_type").innerHTML = "<option value='-1'>Select</option>          <option value='item'>ITEM</option>                <option value='monster'>MOB</option>              <option value='vendor'>NPC</option>                  <option value='craft'>CRAFT</option>                <option value='enchant'>ENCHANT</option>          <option value='spell'>SPELL</option>             <option value='pet'>PET</option>";
        getElem("mods_wiki_type_item").innerHTML = "<option value='all'>All</option>            <option value='skill'>Skill</option>              <option value='type'>Type</option>                <option value='name'>Name</option>";
        getElem("mods_wiki_type_item_type").innerHTML = "<option value='-1'>Select</option>          <option value='weapons'>Weapon</option>           <option value='r.hand armors'>Shield</option>     <option value='chest'>Chest</option>                 <option value='helm'>Helm</helm>                    <option value='pants'>Pants</option>              <option value='glove'>Gloves</option>            <option value='boots'>Boots</option>                    <option value='cape'>Cape</option>               <option value='jewelry'>Jewelry</option>        <option value='magic'>Magic</option>            <option value='materials'>Material</option>         <option value='tools'>Tool</option>                  <option value='foods'>Food</option>             <option value='pets'>Pets</option>";
        getElem("mods_wiki_type_item_skill").innerHTML = "<option value='-1'>Select</option>          <option value='accuracy'>Accuracy</option>        <option value='strength'>Strength</option>        <option value='defense'>Defense</option>             <option value='health'>Health</option>              <option value='magic'>Magic</option>              <option value='alchemy'>Alchemy</option>         <option value='woodcutting'>Woodcut</option>            <option value='farming'>Farming</option>         <option value='fishing'>Fishing</option>        <option value='cooking'>Cooking</option>        <option value='jewelry'>Jewelry</option>            <option value='carpentry'>Carpentry</option>         <option value='forging'>Forging</option>        <option value='mining'>Mining</option>";
        getElem("mods_wiki_type_monster").innerHTML = "<option value='all'>All</option>            <option value='name'>Name</option>                <option value='item'>Item</option>";
        getElem("mods_wiki_type_vendor").innerHTML = "<option value='all'>All</option>            <option value='name'>Name</option>                <option value='item'>Item</option>";
        getElem("mods_wiki_type_craft").innerHTML = "<option value='all'>All</option>            <option value='skill'>Skill</option>              <option value='source'>Source</option>            <option value='item'>Item</option>";
        getElem("mods_wiki_type_craft_skill").innerHTML = "<option value='-1'>Select</option>          <option value='alchemy'>Alchemy</option>          <option value='woodcutting'>Woodcut</option>      <option value='farming'>Farming</option>             <option value='fishing'>Fishing</option>            <option value='cooking'>Cooking</option>          <option value='jewelry'>Jewelry</option>         <option value='carpentry'>Carpentry</option>            <option value='forging'>Forging</option>         <option value='mining'>Mining</option>          <option value='magic'>Magic</option>";
        getElem("mods_wiki_type_craft_source").innerHTML = "<option value='-1'>Select</option>          <option value='furnace'>Furnace</option>          <option value='anvil'>Anvil</option>              <option value='campfire'>Campfire</option>           <option value='carpentry'>House/Farm</option>       <option value='kettle'>Kettle</option>            <option value='gather'>Gathering</option>        <option value='other'>Other</option>";
        getElem("mods_wiki_type_pet").innerHTML = "<option value='all'>All</option>            <option value='name'>Name</option>                <option value='family'>Family</option";
        getElem("mods_wiki_type_enchant").innerHTML = "<option value='all'>All</option>            <option value='item'>Item</option>";
        getElem("mods_wiki_type_spell").innerHTML = "<option value='all'>All</option>            <option value='name'>Name</option>";
        var c = {
            type: 0,
            type_item: 1,
            type_monster: 1,
            type_vendor: 1,
            type_craft: 1,
            type_pet: 1,
            type_spell: 1,
            type_enchant: 1,
            type_item_type: 2,
            type_item_skill: 2,
            type_craft_skill: 2,
            type_craft_source: 2
        }, column = [ "onchange" ], e;
        for (e in c) for (var r in column) getElem("mods_wiki_" + e).setAttribute(column[r], "javascript: Mods.Wikimd.loadWikiType(" + c[e] + ");");
        getElem("mods_wiki_name").setAttribute("onclick", "javascript:Mods.Wikimd.loadWikiType(false);");
        getElem("mods_wiki_load").setAttribute("onclick", "javascript:Mods.Wikimd.populateWiki(true);");
        getElem("mods_wiki_name").setAttribute("onfocus", "javascript: Mods.blockKbind = true;");
        getElem("mods_wiki_name").setAttribute("onblur", "javascript: Mods.blockKbind = false");
        getElem("mods_wiki_level_low").setAttribute("onfocus", "javascript: Mods.blockKbind = true;");
        getElem("mods_wiki_level_low").setAttribute("onblur", "javascript: Mods.blockKbind = false");
        getElem("mods_wiki_level_high").setAttribute("onfocus", "javascript: Mods.blockKbind = true;");
        getElem("mods_wiki_level_high").setAttribute("onblur", "javascript: Mods.blockKbind = false");
        getElem("mod_wiki_options").style.display = "none";
        getElem("mod_load_options").style.display = "none";
        getElem("mod_load_options").style.display = "block";
    };
    Mods.Wikimd.chatSystemToggle = function() {
        return Mods.blockKbind ? (Mods.Wikimd.populateWiki(!0), !0) : !1;
    };
    Mods.Wikimd.nameMenu = function(p, c) {
        "string" !== typeof p && (p = !1);
        "number" !== typeof c && (c = !1);
        var dom = "item" == p || "craft" == p || "pet" == p || "spell" == p || "enchant" == p ? item_base : "monster" == p ? npc_base : !1;
        if (p && c && dom) {
            dom = getElem("action_menu");
            addClass(dom, "hidden");
            var position = Mods.Wikimd.mouse;
            dom.style.top = position.y + 10 + "px";
            dom.style.left = position.x + "px";
            if ("item" != p && "craft" != p && "pet" != p && "spell" != p && "enchant" != p || !modOptions.chatmd.loaded) "monster" == p && modOptions.rclick.loaded && (n = npc_base[c].name, 
            dom.innerHTML = "<div style='padding-left: 3px;'><span class='line' onclick='ActionMenu.mobDrops(" + c + ",4);addClass(getElem(&apos;action_menu&apos;), &apos;hidden&apos;)' style='margin-left:-5px;'><span class='item'>" + n + "</span>Drops</span><span class='line' onclick='ActionMenu.combatCheck(" + c + ");addClass(getElem(&apos;action_menu&apos;), &apos;hidden&apos;);'>Combat Analysis</span><span class='line' onclick='addClass(getElem(&apos;action_menu&apos;),&apos;hidden&apos;)'>Close</span></div>"); else {
                var n = item_base[c].name.replace(/'/g, "*"), position = "<span class='line' onclick='" + ("Mods.Chatmd.chatCommands(&apos;/wiki item name " + n + "&apos;);addClass(getElem(&apos;action_menu&apos;), &apos;hidden&apos;)") + "' style='margin-left:-5px;'>Check Wiki<span class='item'>ITEM</span></span>", file;
                file = "<span class='line' onclick='" + ("Mods.Chatmd.chatCommands(&apos;/wiki mob item " + n + "&apos;);addClass(getElem(&apos;action_menu&apos;), &apos;hidden&apos;)") + "' style='margin-left:-5px;'>Check Wiki<span class='item'>MOB</span></span>";
                var rank;
                rank = "<span class='line' onclick='" + ("Mods.Chatmd.chatCommands(&apos;/wiki npc item " + n + "&apos;);addClass(getElem(&apos;action_menu&apos;), &apos;hidden&apos;)") + "' style='margin-left:-5px;'>Check Wiki<span class='item'>NPC</span></span>";
                var separator;
                separator = "<span class='line' onclick='" + ("Mods.Chatmd.chatCommands(&apos;/wiki craft item " + n + "&apos;);addClass(getElem(&apos;action_menu&apos;), &apos;hidden&apos;)") + "' style='margin-left:-5px;'>Check Wiki<span class='item'>CRAFT</span></span>";
                var scope;
                scope = "<span class='line' onclick='" + ("Mods.Chatmd.chatCommands(&apos;/wiki enchant item " + n + "&apos;);addClass(getElem(&apos;action_menu&apos;), &apos;hidden&apos;)") + "' style='margin-left:-5px;'>Check Wiki<span class='item'>ENCHANT</span></span>";
                var themePrefix;
                themePrefix = -1 < item_base[c].params.pet ? "<span class='line' onclick='" + ("Mods.Chatmd.chatCommands(&apos;/wiki pet name " + n + "&apos;);addClass(getElem(&apos;action_menu&apos;), &apos;hidden&apos;)") + "' style='margin-left:-5px;'>Check Wiki<span class='item'>PET</span></span>" : "";
                n = 10 == item_base[c].params.slot ? "<span class='line' onclick='" + ("Mods.Chatmd.chatCommands(&apos;/wiki spell name " + n + "&apos;);addClass(getElem(&apos;action_menu&apos;), &apos;hidden&apos;)") + "' style='margin-left:-5px;'>Check Wiki<span class='item'>SPELL</span></span>" : "";
                dom.innerHTML = ("<div style='padding-left: 8px;'>" + position + file + rank + separator + scope + themePrefix + n + "<span class='line' onclick='addClass(getElem(&apos;action_menu&apos;),&apos;hidden&apos;)' style='margin-left:-5px;'>Close</span></div>").replace(/\*/g, "\\&apos;");
            }
            0 < dom.innerHTML.length && removeClass(dom, "hidden");
        }
    };
    Mods.Wikimd.populateWiki = function(e, func) {
        var name, c, m, n, element, j, y, _i, data, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _this, obj, newValue, oldValue, options;
        name = Mods.Wikimd.oldSortValue;
        1 == e ? (Mods.Wikimd.newSortValue = Mods.Wikimd.currentSort(), e = Mods.Wikimd.populateWikiList()) : e = e || Mods.Wikimd.populateWikiList();
        -1 != loadedMods.indexOf("Chatmd") && (m = getElem("mods_wiki_load"), m.innerHTML = "Back!", 
        m.setAttribute("onclick", "javascript:Mods.Chatmd.chatCommands('/wiki " + name.replace(/'/g, "\\'") + "')"));
        name = getElem("mods_wiki_type").value;
        func = func || Mods.Wikimd.sortWiki(e, name, Mods.Wikimd.oldSort[name]);
        m = !1;
        for (c in e) {
            m = !0;
            break;
        }
        for (element = 0; 300 > element; element++) for (c = 0; 3 > c; c++) addClass(getElem("wiki_row" + c + "_" + element), "hidden");
        if (m) for (m = {
            item: {
                1: {
                    className: [ "scrolling_allowed wiki_row1", "scrolling_allowed wiki_a1" ],
                    0: {
                        className: [ "scrolling_allowed wiki_p35" ],
                        div: {
                            className: [ "scrolling_allowed market_select pointer wiki_h35 wiki_base1" ],
                            onclick: [ function() {
                                Mods.Wikimd.sortWiki(null, "item", "name");
                            } ]
                        },
                        img: {
                            className: [ "scrolling_allowed hidden", "scrolling_allowed wiki_img" ]
                        },
                        text: {
                            className: [ "scrolling_allowed wiki_name" ],
                            innerHTML: [ "Item Name" ],
                            style: [ {
                                marginTop: "-8px"
                            } ]
                        }
                    },
                    1: {
                        className: [ "scrolling_allowed wiki_p13" ],
                        div: {
                            className: [ "scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR" ],
                            onclick: [ function() {
                                Mods.Wikimd.sortWiki(null, "item", "level");
                            } ]
                        },
                        text: {
                            className: [ "scrolling_allowed wiki_base1 wiki_nameText" ],
                            innerHTML: [ "Level" ]
                        }
                    },
                    2: {
                        className: [ "scrolling_allowed wiki_p13" ],
                        div: {
                            className: [ "scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_bL" ],
                            onclick: [ function() {
                                Mods.Wikimd.sortWiki(null, "item", "skill");
                            } ]
                        },
                        text: {
                            className: [ "scrolling_allowed wiki_base1 wiki_nameText" ],
                            innerHTML: [ "Skill" ]
                        }
                    },
                    3: {
                        className: [ "scrolling_allowed wiki_p26" ],
                        div: {
                            className: [ "scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_bL" ],
                            onclick: [ function() {
                                Mods.Wikimd.sortWiki(null, "item", "price");
                            } ]
                        },
                        text: {
                            className: [ "scrolling_allowed wiki_base1 wiki_nameText" ],
                            innerHTML: [ "Price" ]
                        }
                    },
                    4: {
                        className: [ "scrolling_allowed wiki_p13" ],
                        div: {
                            className: [ "scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bL" ],
                            onclick: [ function() {
                                Mods.Wikimd.sortWiki(null, "item", "slot");
                            } ]
                        },
                        text: {
                            className: [ "scrolling_allowed wiki_base1 wiki_nameText" ],
                            innerHTML: [ "Slot" ]
                        }
                    }
                },
                2: {
                    className: [ "scrolling_allowed wiki_row2", "scrolling_allowed wiki_a2" ],
                    0: {
                        className: [ "scrolling_allowed hidden" ]
                    },
                    1: {
                        className: [ "scrolling_allowed wiki_p13" ],
                        div: {
                            className: [ "scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bT wiki_bR", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bT wiki_bR" ],
                            onclick: [ function() {
                                Mods.Wikimd.sortWiki(null, "item", "power");
                            } ]
                        },
                        text: {
                            className: [ "scrolling_allowed wiki_base1 wiki_nameText" ],
                            innerHTML: [ "Power" ]
                        }
                    },
                    2: {
                        className: [ "scrolling_allowed wiki_p13" ],
                        div: {
                            className: [ "scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bT wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bT wiki_bR wiki_bL" ],
                            onclick: [ function() {
                                Mods.Wikimd.sortWiki(null, "item", "aim");
                            } ]
                        },
                        text: {
                            className: [ "scrolling_allowed wiki_base1 wiki_nameText" ],
                            innerHTML: [ "Aim" ]
                        }
                    },
                    3: {
                        className: [ "scrolling_allowed wiki_p13" ],
                        div: {
                            className: [ "scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bT wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bT wiki_bR wiki_bL" ],
                            onclick: [ function() {
                                Mods.Wikimd.sortWiki(null, "item", "armor");
                            } ]
                        },
                        text: {
                            className: [ "scrolling_allowed wiki_base1 wiki_nameText" ],
                            innerHTML: [ "Armor" ]
                        }
                    },
                    4: {
                        className: [ "scrolling_allowed wiki_p13" ],
                        div: {
                            className: [ "scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bT wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bT wiki_bR wiki_bL" ],
                            onclick: [ function() {
                                Mods.Wikimd.sortWiki(null, "item", "magic");
                            } ]
                        },
                        text: {
                            className: [ "scrolling_allowed wiki_base1 wiki_nameText" ],
                            innerHTML: [ "Magic" ]
                        }
                    },
                    5: {
                        className: [ "scrolling_allowed wiki_p13" ],
                        div: {
                            className: [ "scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bT wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bT wiki_bL" ],
                            onclick: [ function() {
                                Mods.Wikimd.sortWiki(null, "item", "speed");
                            } ]
                        },
                        text: {
                            className: [ "scrolling_allowed wiki_base1 wiki_nameText" ],
                            innerHTML: [ "Speed" ]
                        }
                    }
                }
            },
            monster: {
                1: {
                    className: [ "scrolling_allowed wiki_row2", "scrolling_allowed wiki_a2" ],
                    0: {
                        className: [ "scrolling_allowed wiki_p35" ],
                        div: {
                            className: [ "scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR" ],
                            onclick: [ function() {
                                Mods.Wikimd.sortWiki(null, "moster", "respawn");
                            } ]
                        },
                        img: {
                            className: [ "scrolling_allowed hidden" ]
                        },
                        text: {
                            className: [ "scrolling_allowed wiki_base1 wiki_nameText" ],
                            innerHTML: [ "Respawn Time" ]
                        }
                    },
                    1: {
                        className: [ "scrolling_allowed wiki_p13" ],
                        div: {
                            className: [ "scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_mL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_mL" ],
                            onclick: [ function() {
                                Mods.Wikimd.sortWiki(null, "monster", "level");
                            } ]
                        },
                        text: {
                            className: [ "scrolling_allowed wiki_base1 wiki_nameText" ],
                            innerHTML: [ "Level" ]
                        }
                    },
                    2: {
                        className: [ "scrolling_allowed wiki_p13" ],
                        div: {
                            className: [ "scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_bL" ],
                            onclick: [ function() {
                                Mods.Wikimd.sortWiki(null, "monster", "health");
                            } ]
                        },
                        text: {
                            className: [ "scrolling_allowed wiki_base1 wiki_nameText" ],
                            innerHTML: [ "Health" ]
                        }
                    },
                    3: {
                        className: [ "scrolling_allowed wiki_p13" ],
                        div: {
                            className: [ "scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_bL" ],
                            onclick: [ function() {
                                Mods.Wikimd.sortWiki(null, "monster", "accuracy");
                            } ]
                        },
                        text: {
                            className: [ "scrolling_allowed wiki_base1 wiki_nameText" ],
                            innerHTML: [ "ACC" ]
                        }
                    },
                    4: {
                        className: [ "scrolling_allowed wiki_p13" ],
                        div: {
                            className: [ "scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_bL" ],
                            onclick: [ function() {
                                Mods.Wikimd.sortWiki(null, "monster", "strength");
                            } ]
                        },
                        text: {
                            className: [ "scrolling_allowed wiki_base1 wiki_nameText" ],
                            innerHTML: [ "STR" ]
                        }
                    },
                    5: {
                        className: [ "scrolling_allowed wiki_p13" ],
                        div: {
                            className: [ "scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bL" ],
                            onclick: [ function() {
                                Mods.Wikimd.sortWiki(null, "monster", "defense");
                            } ]
                        },
                        text: {
                            className: [ "scrolling_allowed wiki_base1 wiki_nameText" ],
                            innerHTML: [ "DEF" ]
                        }
                    }
                },
                2: {
                    className: [ "scrolling_allowed wiki_row1", "scrolling_allowed wiki_a1" ],
                    0: {
                        className: [ "scrolling_allowed wiki_p35" ],
                        div: {
                            className: [ "scrolling_allowed market_select pointer wiki_h17 wiki_base1 wiki_bT", "scrolling_allowed market_select pointer wiki_h35 wiki_base1 wiki_bT" ],
                            onclick: [ function() {
                                Mods.Wikimd.sortWiki(null, "monster", "name");
                            } ]
                        },
                        img: {
                            className: [ "scrolling_allowed hidden", "scrolling_allowed wiki_img" ]
                        },
                        text: {
                            className: [ "scrolling_allowed wiki_name" ],
                            innerHTML: [ "Monster Name" ],
                            style: [ {
                                marginTop: "-8px"
                            } ]
                        }
                    },
                    1: {
                        className: [ "scrolling_allowed wiki_p65" ],
                        div: {
                            className: [ "scrolling_allowed market_select wiki_h17 wiki_base1 wiki_h17 wiki_bT wiki_bL", "scrolling_allowed market_select wiki_base2 wiki_pad2 wiki_bT wiki_bL wiki_mR wiki_mL" ],
                            onclick: [ function() {} ]
                        },
                        text: {
                            className: [ "scrolling_allowed wiki_base1 wiki_nameImg", "scrolling_allowed" ],
                            innerHTML: [ "Item Drops" ]
                        }
                    }
                }
            },
            vendor: {
                1: {
                    className: [ "scrolling_allowed wiki_row1", "scrolling_allowed wiki_a1" ],
                    0: {
                        className: [ "scrolling_allowed wiki_p35" ],
                        div: {
                            className: [ "scrolling_allowed market_select pointer wiki_h35 wiki_base1", "scrolling_allowed market_select pointer wiki_base1 wiki_pad2" ],
                            onclick: [ function() {
                                Mods.Wikimd.sortWiki(null, "vendor", "name");
                            } ]
                        },
                        img: {
                            className: [ "scrolling_allowed hidden", "scrolling_allowed wiki_img" ]
                        },
                        text: {
                            className: [ "scrolling_allowed wiki_name" ],
                            innerHTML: [ "Vendor Name" ],
                            style: [ {
                                marginTop: "-8px"
                            } ]
                        }
                    },
                    1: {
                        className: [ "scrolling_allowed wiki_p65" ],
                        div: {
                            className: [ "scrolling_allowed market_select wiki_h35 wiki_base1 wiki_bL", "scrolling_allowed market_select wiki_base1 wiki_pad2 wiki_bL" ],
                            onclick: [ function() {} ]
                        },
                        text: {
                            className: [ "scrolling_allowed wiki_base1 wiki_nameImg", "scrolling_allowed" ],
                            innerHTML: [ "Buys / Sells" ]
                        }
                    }
                }
            },
            craft: {
                1: {
                    className: [ "scrolling_allowed wiki_row2", "scrolling_allowed wiki_a2" ],
                    0: {
                        className: [ "scrolling_allowed wiki_p35" ],
                        div: {
                            className: [ "scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR" ],
                            onclick: [ function() {
                                Mods.Wikimd.sortWiki(null, "craft", "location");
                            } ]
                        },
                        img: {
                            className: [ "scrolling_allowed hidden" ]
                        },
                        text: {
                            className: [ "scrolling_allowed wiki_base1 wiki_nameText" ],
                            innerHTML: [ "Craft Location" ]
                        }
                    },
                    1: {
                        className: [ "scrolling_allowed wiki_p13" ],
                        div: {
                            className: [ "scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_mL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_mL" ],
                            onclick: [ function() {
                                Mods.Wikimd.sortWiki(null, "craft", "level");
                            } ]
                        },
                        text: {
                            className: [ "scrolling_allowed wiki_base1 wiki_nameText" ],
                            innerHTML: [ "Level" ]
                        }
                    },
                    2: {
                        className: [ "scrolling_allowed wiki_p13" ],
                        div: {
                            className: [ "scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_bL" ],
                            onclick: [ function() {
                                Mods.Wikimd.sortWiki(null, "craft", "skill");
                            } ]
                        },
                        text: {
                            className: [ "scrolling_allowed wiki_base1 wiki_nameText" ],
                            innerHTML: [ "Skill" ]
                        }
                    },
                    3: {
                        className: [ "scrolling_allowed wiki_p13" ],
                        div: {
                            className: [ "scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_bL" ],
                            onclick: [ function() {
                                Mods.Wikimd.sortWiki(null, "craft", "base_chance");
                            } ]
                        },
                        text: {
                            className: [ "scrolling_allowed wiki_base1 wiki_nameText" ],
                            innerHTML: [ "Min%" ]
                        }
                    },
                    4: {
                        className: [ "scrolling_allowed wiki_p13" ],
                        div: {
                            className: [ "scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_bL" ],
                            onclick: [ function() {
                                Mods.Wikimd.sortWiki(null, "craft", "max_chance");
                            } ]
                        },
                        text: {
                            className: [ "scrolling_allowed wiki_base1 wiki_nameText" ],
                            innerHTML: [ "Max%" ]
                        }
                    },
                    5: {
                        className: [ "scrolling_allowed wiki_p13" ],
                        div: {
                            className: [ "scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bL" ],
                            onclick: [ function() {
                                Mods.Wikimd.sortWiki(null, "craft", "xp");
                            } ]
                        },
                        text: {
                            className: [ "scrolling_allowed wiki_base1 wiki_nameText" ],
                            innerHTML: [ "Exp" ]
                        }
                    }
                },
                2: {
                    className: [ "scrolling_allowed wiki_row1", "scrolling_allowed wiki_a1" ],
                    0: {
                        className: [ "scrolling_allowed wiki_p35" ],
                        div: {
                            className: [ "scrolling_allowed market_select pointer wiki_h17 wiki_base1 wiki_bT", "scrolling_allowed market_select pointer wiki_h35 wiki_base1 wiki_bT" ],
                            onclick: [ function() {
                                Mods.Wikimd.sortWiki(null, "craft", "name");
                            } ]
                        },
                        img: {
                            className: [ "scrolling_allowed hidden", "scrolling_allowed wiki_img" ]
                        },
                        text: {
                            className: [ "scrolling_allowed wiki_name" ],
                            innerHTML: [ "Craft Name" ],
                            style: [ {
                                marginTop: "-8px"
                            } ]
                        }
                    },
                    1: {
                        className: [ "scrolling_allowed wiki_p65" ],
                        div: {
                            className: [ "scrolling_allowed market_select wiki_h35 wiki_base1 wiki_h17 wiki_bT wiki_bL", "scrolling_allowed market_select wiki_base1 wiki_h35 wiki_bT wiki_bL" ],
                            onclick: [ function() {} ]
                        },
                        text: {
                            className: [ "scrolling_allowed wiki_base1 wiki_nameImg", "scrolling_allowed" ],
                            innerHTML: [ "Required Materials" ]
                        }
                    }
                }
            },
            pet: {
                1: {
                    className: [ "scrolling_allowed wiki_row2", "scrolling_allowed wiki_a2" ],
                    0: {
                        className: [ "scrolling_allowed wiki_p35" ],
                        div: {
                            className: [ "scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR", "scrolling_allowed market_select pointer wiki_h17 wiki_base1" ],
                            onclick: [ function() {} ]
                        },
                        img: {
                            className: [ "scrolling_allowed hidden", "scrolling_allowed wiki_img" ]
                        },
                        text: {
                            className: [ "scrolling_allowed wiki_base1 wiki_nameText", "scrolling_allowed wiki_nameText" ],
                            innerHTML: [ "<span style='font-weight: normal color: #999 font-size: 1.05em'>Req to level: &nbsp;</span><span onclick='Mods.Wikimd.sortWiki(null, &apos;pet&apos;, &apos;stones&apos;)'>SoE</span>&nbsp; | &nbsp;<span onclick='Mods.Wikimd.sortWiki(null, &apos;pet&apos;, &apos;xp_required&apos;)'>Exp</span>" ]
                        }
                    },
                    1: {
                        className: [ "scrolling_allowed wiki_p13" ],
                        div: {
                            className: [ "scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_mL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_mL" ],
                            onclick: [ function() {
                                Mods.Wikimd.sortWiki(null, "pet", "aim");
                            } ]
                        },
                        text: {
                            className: [ "scrolling_allowed wiki_base1 wiki_nameText" ],
                            innerHTML: [ "Aim" ]
                        }
                    },
                    2: {
                        className: [ "scrolling_allowed wiki_p13" ],
                        div: {
                            className: [ "scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_bL" ],
                            onclick: [ function() {
                                Mods.Wikimd.sortWiki(null, "pet", "power");
                            } ]
                        },
                        text: {
                            className: [ "scrolling_allowed wiki_base1 wiki_nameText" ],
                            innerHTML: [ "Power" ]
                        }
                    },
                    3: {
                        className: [ "scrolling_allowed wiki_p13" ],
                        div: {
                            className: [ "scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_bL" ],
                            onclick: [ function() {
                                Mods.Wikimd.sortWiki(null, "pet", "armor");
                            } ]
                        },
                        text: {
                            className: [ "scrolling_allowed wiki_base1 wiki_nameText" ],
                            innerHTML: [ "Armor" ]
                        }
                    },
                    4: {
                        className: [ "scrolling_allowed wiki_p13" ],
                        div: {
                            className: [ "scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_bL" ],
                            onclick: [ function() {
                                Mods.Wikimd.sortWiki(null, "pet", "magic");
                            } ]
                        },
                        text: {
                            className: [ "scrolling_allowed wiki_base1 wiki_nameText" ],
                            innerHTML: [ "Magic" ]
                        }
                    },
                    5: {
                        className: [ "scrolling_allowed wiki_p13" ],
                        div: {
                            className: [ "scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bL" ],
                            onclick: [ function() {
                                Mods.Wikimd.sortWiki(null, "pet", "speed");
                            } ]
                        },
                        text: {
                            className: [ "scrolling_allowed wiki_base1 wiki_nameText" ],
                            innerHTML: [ "Speed" ]
                        }
                    }
                },
                2: {
                    className: [ "scrolling_allowed wiki_row1", "scrolling_allowed wiki_a1" ],
                    0: {
                        className: [ "scrolling_allowed wiki_p35" ],
                        div: {
                            className: [ "scrolling_allowed market_select pointer wiki_h17 wiki_base1 wiki_bT", "scrolling_allowed market_select pointer wiki_h35 wiki_base1 wiki_bT" ],
                            onclick: [ function() {} ]
                        },
                        img: {
                            className: [ "scrolling_allowed hidden", "scrolling_allowed wiki_img" ]
                        },
                        text: {
                            className: [ "scrolling_allowed wiki_base1 wiki_nameText", "scrolling_allowed wiki_name" ],
                            innerHTML: [ "<span class='pointer' onclick='Mods.Wikimd.sortWiki(null, &apos;pet&apos;, &apos;name&apos;)'>Name</span>&nbsp; | &nbsp;<span class='pointer'  onclick='Mods.Wikimd.sortWiki(null, &apos;pet&apos;, &apos;family&apos;)'>Family</span>&nbsp; | &nbsp;<span class='pointer'  onclick='Mods.Wikimd.sortWiki(null, &apos;pet&apos;, &apos;inventory_slots&apos;)'>Slots</span>" ],
                            style: [ {
                                marginTop: "-8px"
                            } ]
                        }
                    },
                    1: {
                        className: [ "scrolling_allowed wiki_p65" ],
                        div: {
                            className: [ "scrolling_allowed market_select wiki_h35 wiki_base1 wiki_h17 wiki_bT wiki_bL", "scrolling_allowed market_select wiki_base2 wiki_pad2 wiki_bT wiki_bL wiki_mR wiki_mL" ],
                            onclick: [ function() {} ]
                        },
                        text: {
                            className: [ "scrolling_allowed wiki_base1 wiki_nameImg", "scrolling_allowed" ],
                            innerHTML: [ "Evolution Chain" ]
                        }
                    }
                }
            },
            spell: {
                1: {
                    className: [ "scrolling_allowed wiki_row1", "scrolling_allowed wiki_a1" ],
                    0: {
                        className: [ "scrolling_allowed wiki_p35" ],
                        div: {
                            className: [ "scrolling_allowed market_select pointer wiki_h35 wiki_base1" ],
                            onclick: [ function() {
                                Mods.Wikimd.sortWiki(null, "spell", "name");
                            } ]
                        },
                        img: {
                            className: [ "scrolling_allowed hidden", "scrolling_allowed wiki_img" ]
                        },
                        text: {
                            className: [ "scrolling_allowed wiki_name" ],
                            innerHTML: [ "Spell Name" ],
                            style: [ {
                                marginTop: "-8px"
                            } ]
                        }
                    },
                    1: {
                        className: [ "scrolling_allowed wiki_p13" ],
                        div: {
                            className: [ "scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR" ],
                            onclick: [ function() {
                                Mods.Wikimd.sortWiki(null, "spell", "level");
                            } ]
                        },
                        text: {
                            className: [ "scrolling_allowed wiki_base1 wiki_nameText" ],
                            innerHTML: [ "Level" ]
                        }
                    },
                    2: {
                        className: [ "scrolling_allowed wiki_p13" ],
                        div: {
                            className: [ "scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_bL" ],
                            onclick: [ function() {
                                Mods.Wikimd.sortWiki(null, "spell", "cooldown");
                            } ]
                        },
                        text: {
                            className: [ "scrolling_allowed wiki_base1 wiki_nameText" ],
                            innerHTML: [ "CD" ]
                        }
                    },
                    3: {
                        className: [ "scrolling_allowed wiki_p13" ],
                        div: {
                            className: [ "scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_bL" ],
                            onclick: [ function() {
                                Mods.Wikimd.sortWiki(null, "spell", "price");
                            } ]
                        },
                        text: {
                            className: [ "scrolling_allowed wiki_base1 wiki_nameText" ],
                            innerHTML: [ "Price" ]
                        }
                    },
                    4: {
                        className: [ "scrolling_allowed wiki_p13" ],
                        div: {
                            className: [ "scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_bL" ],
                            onclick: [ function() {
                                Mods.Wikimd.sortWiki(null, "spell", "casts");
                            } ]
                        },
                        text: {
                            className: [ "scrolling_allowed wiki_base1 wiki_nameText" ],
                            innerHTML: [ "Casts" ]
                        }
                    },
                    5: {
                        className: [ "scrolling_allowed wiki_p13" ],
                        div: {
                            className: [ "scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bL" ],
                            onclick: [ function() {
                                Mods.Wikimd.sortWiki(null, "spell", "cost_s");
                            } ]
                        },
                        text: {
                            className: [ "scrolling_allowed wiki_base1 wiki_nameText" ],
                            innerHTML: [ "Cost/S" ]
                        }
                    }
                },
                2: {
                    className: [ "scrolling_allowed wiki_row2", "scrolling_allowed wiki_a2" ],
                    0: {
                        className: [ "scrolling_allowed hidden" ]
                    },
                    1: {
                        className: [ "scrolling_allowed wiki_p13" ],
                        div: {
                            className: [ "scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bT wiki_bR", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bT wiki_bR" ],
                            onclick: [ function() {
                                Mods.Wikimd.sortWiki(null, "spell", "damage");
                            } ]
                        },
                        text: {
                            className: [ "scrolling_allowed wiki_base1 wiki_nameText" ],
                            innerHTML: [ "Dmg" ]
                        }
                    },
                    2: {
                        className: [ "scrolling_allowed wiki_p13" ],
                        div: {
                            className: [ "scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bT wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bT wiki_bR wiki_bL" ],
                            onclick: [ function() {
                                Mods.Wikimd.sortWiki(null, "spell", "exp");
                            } ]
                        },
                        text: {
                            className: [ "scrolling_allowed wiki_base1 wiki_nameText" ],
                            innerHTML: [ "Exp" ]
                        }
                    },
                    3: {
                        className: [ "scrolling_allowed wiki_p13" ],
                        div: {
                            className: [ "scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bT wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bT wiki_bR wiki_bL" ],
                            onclick: [ function() {
                                Mods.Wikimd.sortWiki(null, "spell", "penetration");
                            } ]
                        },
                        text: {
                            className: [ "scrolling_allowed wiki_base1 wiki_nameText" ],
                            innerHTML: [ "Pen" ]
                        }
                    },
                    4: {
                        className: [ "scrolling_allowed wiki_p13" ],
                        div: {
                            className: [ "scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bT wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bT wiki_bR wiki_bL" ],
                            onclick: [ function() {
                                Mods.Wikimd.sortWiki(null, "item", "dmg_s");
                            } ]
                        },
                        text: {
                            className: [ "scrolling_allowed wiki_base1 wiki_nameText" ],
                            innerHTML: [ "Dmg/S" ]
                        }
                    },
                    5: {
                        className: [ "scrolling_allowed wiki_p13" ],
                        div: {
                            className: [ "scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bT wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bT wiki_bL" ],
                            onclick: [ function() {
                                Mods.Wikimd.sortWiki(null, "item", "exp_s");
                            } ]
                        },
                        text: {
                            className: [ "scrolling_allowed wiki_base1 wiki_nameText" ],
                            innerHTML: [ "Exp/S" ]
                        }
                    }
                }
            },
            enchant: {
                1: {
                    className: [ "scrolling_allowed wiki_row2", "scrolling_allowed wiki_a2" ],
                    0: {
                        className: [ "scrolling_allowed wiki_p35" ],
                        div: {
                            className: [ "scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR" ],
                            onclick: [ function() {
                                Mods.Wikimd.sortWiki(null, "enchant", "enchant");
                            } ]
                        },
                        img: {
                            className: [ "scrolling_allowed hidden" ]
                        },
                        text: {
                            className: [ "scrolling_allowed wiki_base1 wiki_nameText" ],
                            innerHTML: [ "Enchanted Item" ]
                        }
                    },
                    1: {
                        className: [ "scrolling_allowed hidden" ]
                    },
                    2: {
                        className: [ "scrolling_allowed wiki_p13" ],
                        div: {
                            className: [ "scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_mL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_mL" ],
                            onclick: [ function() {
                                Mods.Wikimd.sortWiki(null, "enchant", "low");
                            } ]
                        },
                        text: {
                            className: [ "scrolling_allowed wiki_base1 wiki_nameText" ],
                            innerHTML: [ "Low %" ]
                        }
                    },
                    3: {
                        className: [ "scrolling_allowed wiki_p13" ],
                        div: {
                            className: [ "scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_bL" ],
                            onclick: [ function() {
                                Mods.Wikimd.sortWiki(null, "enchant", "med");
                            } ]
                        },
                        text: {
                            className: [ "scrolling_allowed wiki_base1 wiki_nameText" ],
                            innerHTML: [ "Med %" ]
                        }
                    },
                    4: {
                        className: [ "scrolling_allowed wiki_p13" ],
                        div: {
                            className: [ "scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_bL" ],
                            onclick: [ function() {
                                Mods.Wikimd.sortWiki(null, "enchant", "high");
                            } ]
                        },
                        text: {
                            className: [ "scrolling_allowed wiki_base1 wiki_nameText" ],
                            innerHTML: [ "High %" ]
                        }
                    },
                    5: {
                        className: [ "scrolling_allowed wiki_p13" ],
                        div: {
                            className: [ "scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bL" ],
                            onclick: [ function() {
                                Mods.Wikimd.sortWiki(null, "enchant", "sup");
                            } ]
                        },
                        text: {
                            className: [ "scrolling_allowed wiki_base1 wiki_nameText" ],
                            innerHTML: [ "Sup %" ]
                        }
                    }
                },
                2: {
                    className: [ "scrolling_allowed wiki_row1", "scrolling_allowed wiki_a1" ],
                    0: {
                        className: [ "scrolling_allowed wiki_p35" ],
                        div: {
                            className: [ "scrolling_allowed market_select pointer wiki_h17 wiki_base1 wiki_bT", "scrolling_allowed market_select pointer wiki_h35 wiki_base1 wiki_bT" ],
                            onclick: [ function() {
                                Mods.Wikimd.sortWiki(null, "enchant", "name");
                            } ]
                        },
                        img: {
                            className: [ "scrolling_allowed hidden", "scrolling_allowed wiki_img" ]
                        },
                        text: {
                            className: [ "scrolling_allowed wiki_name" ],
                            innerHTML: [ "Item Name" ],
                            style: [ {
                                marginTop: "-8px"
                            } ]
                        }
                    },
                    1: {
                        className: [ "scrolling_allowed hidden" ]
                    },
                    2: {
                        className: [ "scrolling_allowed wiki_p65" ],
                        div: {
                            className: [ "scrolling_allowed market_select wiki_h17 wiki_base1 wiki_h17 wiki_bT wiki_bL", "scrolling_allowed market_select wiki_base2 wiki_pad2 wiki_bT wiki_bL wiki_mR wiki_mL" ],
                            onclick: [ function() {} ]
                        },
                        text: {
                            className: [ "scrolling_allowed wiki_base1 wiki_nameImg", "scrolling_allowed" ],
                            innerHTML: [ "Enchant Chain" ]
                        }
                    }
                }
            }
        }, n = 0; 300 > n; n++) {
            var html = function(contents) {
                return "<div style='padding-top: 3px'>" + contents + "</div>";
            };
            c = n - 1;
            removeClass(getElem("wiki_row0_" + n), "hidden");
            if (!func || n > func.length) break;
            if (0 < n) {
                if (void 0 == func[c]) break;
                obj = Mods.Wikimd.tableData(c, e, func);
                if (!obj) break;
                data = obj.item;
                _ref2 = obj.drops;
                _ref = obj.img;
                items = obj.items;
                _ref3 = obj.images;
                _ref5 = obj.max_chance;
                _ref4 = obj.min_chance;
                _this = obj.n_onclick;
                _ref1 = obj.mins;
                options = obj.magic;
                obj = data.object && "Anvil" == data.object.name ? Mods.findWithAttr(FORGE_FORMULAS, "item_id", Mods.Wikimd.formulas[func[c]].id) : 0;
            }
            for (y = 1; 3 > y; y++) if (_i = getElem("wiki_row" + y + "_" + n), void 0 == m[name][y]) _i.className = "scrolling_allowed hidden"; else for (_i.className = 0 == n ? m[name][y].className[0] : m[name][y].className[1], 
            _i = 0; 6 > _i; _i++) if (element = getElem("wiki_row" + y + "_col" + _i + "_" + n), 
            void 0 == m[name][y][_i]) element.className = "scrolling_allowed hidden"; else for (j in element.className = m[name][y][_i].className, 
            element = getElem("wiki_row" + y + "_col" + _i + "_div_" + n), newValue = getElem("wiki_row" + y + "_col" + _i + "_img_" + n), 
            oldValue = getElem("wiki_row" + y + "_col" + _i + "_text_" + n), element = {
                div: element,
                img: newValue,
                text: oldValue
            }, element) null != element[j] && void 0 != m[name][y][_i][j] && (0 == n ? (element[j].className = m[name][y][_i][j].className[0], 
            m[name][y][_i][j].innerHTML && (element[j].innerHTML = m[name][y][_i][j].innerHTML[0]), 
            m[name][y][_i][j].onclick && (element[j].onclick = m[name][y][_i][j].onclick[0]), 
            m[name][y][_i][j].style && (element[j].style.marginTop = m[name][y][_i][j].style[0].marginTop)) : (newValue = void 0 != m[name][y][_i][j].className[1] ? m[name][y][_i][j].className[1] : m[name][y][_i][j].className[0], 
            element[j].className = newValue));
            0 < n && ("item" == name ? (getElem("wiki_row1_col0_" + n).setAttribute("oncontextmenu", "Mods.Wikimd.nameMenu('item'," + data.id + ")"), 
            getElem("wiki_row1_col0_div_" + n).style.height = "", getElem("wiki_row1_col0_img_" + n).style.background = 'url("' + _ref.url + '") no-repeat scroll ' + -data.img.x * _ref.tile_width + "px " + -data.img.y * _ref.tile_height + "px transparent", 
            getElem("wiki_row1_col0_img_" + n).item_id = data.id, getElem("wiki_row1_col0_text_" + n).innerHTML = html(data.name) + (-1 === Mods.loadedMods.indexOf("Gearmd") || 0 != item_base[data.id].b_t && 2 != item_base[data.id].b_t && 5 != item_base[data.id].b_t && 7 != item_base[data.id].b_t ? "" : "<span style='position: absolute; bottom: -10px; right: 0px; font-size: 10px; color: #999;' onclick='javascript: Mods.Gearmd.changeTryOn(true, " + data.id + ");';>(Try On)</span>"), 
            getElem("wiki_row1_col0_text_" + n).style.marginTop = 18 > data.name.length ? "-8px" : "-15px", 
            getElem("wiki_row1_col1_div_" + n).style.height = "", getElem("wiki_row1_col1_text_" + n).innerHTML = html(data.level), 
            getElem("wiki_row1_col2_text_" + n).innerHTML = html(data.skill), getElem("wiki_row1_col3_text_" + n).innerHTML = html(data.price + " coins"), 
            getElem("wiki_row1_col4_text_" + n).innerHTML = html(data.slot), getElem("wiki_row2_col1_div_" + n).style.height = "", 
            getElem("wiki_row2_col1_text_" + n).innerHTML = html(data.params.power || "-"), 
            getElem("wiki_row2_col2_div_" + n).style.height = "", getElem("wiki_row2_col2_text_" + n).innerHTML = html(data.params.aim || "-"), 
            getElem("wiki_row2_col3_text_" + n).innerHTML = html(data.params.armor || "-"), 
            getElem("wiki_row2_col4_text_" + n).innerHTML = html(data.params.magic || "-"), 
            getElem("wiki_row2_col5_text_" + n).innerHTML = html(data.params.speed || "-")) : "monster" == name ? (getElem("wiki_row1_col0_" + n).setAttribute("oncontextmenu", ""), 
            getElem("wiki_row1_col0_div_" + n).style.height = "", getElem("wiki_row1_col0_text_" + n).style.marginTop = "", 
            getElem("wiki_row1_col0_text_" + n).innerHTML = html("Respawn: " + _ref1 + " Minute" + (1 < _ref1 ? "s" : "")), 
            getElem("wiki_row1_col1_div_" + n).style.height = "", getElem("wiki_row1_col1_text_" + n).innerHTML = html(FIGHT.calculate_monster_level(data)), 
            getElem("wiki_row1_col2_text_" + n).innerHTML = html(data.params.health), getElem("wiki_row1_col3_text_" + n).innerHTML = html(data.temp.total_accuracy), 
            getElem("wiki_row1_col4_text_" + n).innerHTML = html(data.temp.total_strength), 
            getElem("wiki_row1_col5_text_" + n).innerHTML = html(data.temp.total_defense), getElem("wiki_row2_col0_" + n).setAttribute("oncontextmenu", "Mods.Wikimd.nameMenu('monster'," + data.b_i + ")"), 
            getElem("wiki_row2_col0_div_" + n).style.height = 8 > _ref2.length ? "38px" : 15 > _ref2.length ? "73px" : 36 * (Math.ceil(_ref2.length / 7) - 2) + 73 + "px", 
            _ref ? getElem("wiki_row2_col0_img_" + n).style.background = 'url("' + _ref.url + '") no-repeat scroll ' + -data.img.x * _ref.tile_width + "px " + -data.img.y * _ref.tile_height + "px transparent" : getElem("wiki_row2_col0_img_" + n).style.background = 'url("' + getBodyImgNoHalo(data.img.hash).toDataURL("image/png") + '") no-repeat scroll -12px -10px transparent', 
            getElem("wiki_row2_col0_img_" + n).item_id = !1, getElem("wiki_row2_col0_text_" + n).innerHTML = html(data.name), 
            getElem("wiki_row2_col0_text_" + n).style.marginTop = 18 > data.name.length ? "-8px" : "-15px", 
            getElem("wiki_row2_col1_div_" + n).style.height = 8 > _ref2.length ? "36px" : 15 > _ref2.length ? "71px" : 36 * (Math.ceil(_ref2.length / 7) - 2) + 71 + "px", 
            getElem("wiki_row2_col1_text_" + n).innerHTML = _ref3) : "vendor" == name ? (getElem("wiki_row1_col0_" + n).setAttribute("oncontextmenu", ""), 
            getElem("wiki_row1_col0_div_" + n).style.height = 8 > _ref2.length ? "36px" : 15 > _ref2.length ? "72px" : 36 * (Math.ceil(_ref2.length / 7) - 2) + 72 + "px", 
            _ref ? getElem("wiki_row1_col0_img_" + n).style.background = 'url("' + _ref.url + '") no-repeat scroll ' + -data.img.x * _ref.tile_width + "px " + -data.img.y * _ref.tile_height + "px transparent" : getElem("wiki_row1_col0_img_" + n).style.background = 'url("' + getBodyImgNoHalo(data.img.hash).toDataURL("image/png") + '") no-repeat scroll -12px -10px transparent', 
            getElem("wiki_row1_col0_img_" + n).item_id = !1, getElem("wiki_row1_col0_text_" + n).innerHTML = html(data.name), 
            getElem("wiki_row1_col0_text_" + n).style.marginTop = 18 > data.name.length ? "-8px" : "-15px", 
            getElem("wiki_row1_col1_div_" + n).style.height = 8 > _ref2.length ? "36px" : 15 > _ref2.length ? "72px" : 36 * (Math.ceil(_ref2.length / 7) - 2) + 72 + "px", 
            getElem("wiki_row1_col1_text_" + n).innerHTML = _ref3) : "craft" == name ? (getElem("wiki_row1_col0_" + n).setAttribute("oncontextmenu", ""), 
            getElem("wiki_row1_col0_div_" + n).style.height = "", getElem("wiki_row1_col0_text_" + n).style.marginTop = "", 
            getElem("wiki_row1_col0_text_" + n).innerHTML = html(data.object.name), getElem("wiki_row1_col1_div_" + n).style.height = "", 
            getElem("wiki_row1_col1_text_" + n).innerHTML = html(data.level), getElem("wiki_row1_col2_text_" + n).innerHTML = html(capitaliseFirstLetter(data.skill.slice(0, 7))), 
            getElem("wiki_row1_col3_text_" + n).innerHTML = html(_ref4), getElem("wiki_row1_col4_text_" + n).innerHTML = html(_ref5), 
            getElem("wiki_row1_col5_text_" + n).innerHTML = html(data.xp || "-"), getElem("wiki_row2_col0_" + n).setAttribute("oncontextmenu", "Mods.Wikimd.nameMenu('item'," + data.id + ")"), 
            getElem("wiki_row2_col0_div_" + n).setAttribute("onclick", _this), getElem("wiki_row2_col0_div_" + n).style.height = 8 > items ? "36px" : 15 > items ? "72px" : 36 * (Math.ceil(items / 7) - 2) + 72 + "px", 
            getElem("wiki_row2_col0_img_" + n).style.background = 'url("' + _ref.url + '") no-repeat scroll ' + -data.img.x * _ref.tile_width + "px " + -data.img.y * _ref.tile_height + "px transparent", 
            getElem("wiki_row2_col0_img_" + n).item_id = data.id, getElem("wiki_row2_col0_text_" + n).innerHTML = html(data.name + ("Anvil" == data.object.name ? "<br/><span class='common_link' style='font-size:.8em;color:#999999;'>(Formula)</span>" + (-1 < loadedMods.indexOf("Forgem") ? "<span class='common_link' style='font-size:.8em;color:#999999;' onclick='Mods.Forgem.newRecipe(" + obj + ");event.stopPropagation();'>(Learn)</span>" : "") : "")), 
            getElem("wiki_row2_col0_text_" + n).style.marginTop = 18 > data.name.length ? "-8px" : "-15px", 
            getElem("wiki_row2_col1_div_" + n).style.height = 8 > items ? "36px" : 15 > items ? "72px" : 36 * (Math.ceil(items / 7) - 2) + 72 + "px", 
            getElem("wiki_row2_col1_text_" + n).innerHTML = _ref3) : "pet" == name ? (getElem("wiki_row1_col0_" + n).setAttribute("oncontextmenu", ""), 
            getElem("wiki_row1_col0_div_" + n).style.height = "", getElem("wiki_row1_col0_img_" + n).style.background = "", 
            getElem("wiki_row1_col0_img_" + n).item_id = !1, getElem("wiki_row1_col0_text_" + n).innerHTML = html(0 < pets[data.params.pet].params.stones ? "Stones of Evolution: " + pets[data.params.pet].params.stones : 0 < pets[data.params.pet].params.xp_required ? "Exp: " + thousandSeperate(parseInt(pets[data.params.pet].params.xp_required)) : "Cannot be leveled"), 
            getElem("wiki_row1_col0_text_" + n).style.marginTop = "", getElem("wiki_row1_col1_div_" + n).style.height = "", 
            getElem("wiki_row1_col1_text_" + n).innerHTML = html(data.params.aim ? data.params.aim : "-"), 
            getElem("wiki_row1_col2_text_" + n).innerHTML = html(data.params.power ? data.params.power : "-"), 
            getElem("wiki_row1_col3_text_" + n).innerHTML = html(data.params.armor ? data.params.armor : "-"), 
            getElem("wiki_row1_col4_text_" + n).innerHTML = html(data.params.magic ? data.params.magic : "-"), 
            getElem("wiki_row1_col5_text_" + n).innerHTML = html(data.params.speed ? data.params.speed : "-"), 
            getElem("wiki_row2_col0_" + n).setAttribute("oncontextmenu", "Mods.Wikimd.nameMenu('" + name + "'," + item_base[func[c]].b_i + ")"), 
            getElem("wiki_row2_col0_div_" + n).style.height = 6 > _ref2.length ? "38px" : 11 > _ref2.length ? "73px" : 36 * (Math.ceil(_ref2.length / 5) - 2) + 73 + "px", 
            getElem("wiki_row2_col0_img_" + n).style.background = 'url("' + _ref.url + '") no-repeat scroll ' + -data.img.x * _ref.tile_width + "px " + -data.img.y * _ref.tile_height + "px transparent", 
            getElem("wiki_row2_col0_img_" + n).item_id = data.b_i, c = pets[data.params.pet].name.replace(/\[(Ancient|Legendary|Rare|Common)\]/gi, function(m, p) {
                return "[<span style='color: " + {
                    Ancient: COLOR.RED,
                    Legendary: COLOR.ORANGE,
                    Rare: COLOR.YELLOW,
                    Common: COLOR.GREEN
                }[p] + ";;'>" + p.slice(0, 1) + "</span>]";
            }), getElem("wiki_row2_col0_text_" + n).innerHTML = html(c + "<span style='color:#999; font-size:.9em'><br>(" + (void 0 != Mods.Wikimd.family[data.b_i] ? Mods.Wikimd.family[data.b_i] : "Crafted") + ")</span><span style='position: absolute; right: 0px; bottom: 0px; font-size: .8em; color: #CCC'>" + pets[data.params.pet].params.inventory_slots + " slots</span>"), 
            getElem("wiki_row2_col0_text_" + n).style.marginTop = 20 > pets[data.params.pet].name.length ? "-12px" : "-17px", 
            getElem("wiki_row2_col1_div_" + n).style.height = 6 > _ref2.length ? "36px" : 11 > _ref2.length ? "71px" : 36 * (Math.ceil(_ref2.length / 5) - 2) + 71 + "px", 
            getElem("wiki_row2_col1_text_" + n).innerHTML = _ref3) : "spell" == name ? (getElem("wiki_row1_col0_" + n).setAttribute("oncontextmenu", "Mods.Wikimd.nameMenu('item'," + data.id + ")"), 
            getElem("wiki_row1_col0_div_" + n).style.height = "", getElem("wiki_row1_col0_img_" + n).style.background = 'url("' + _ref.url + '") no-repeat scroll ' + -data.img.x * _ref.tile_width + "px " + -data.img.y * _ref.tile_height + "px transparent", 
            getElem("wiki_row1_col0_img_" + n).item_id = data.id, getElem("wiki_row1_col0_text_" + n).innerHTML = html(data.name), 
            getElem("wiki_row1_col0_text_" + n).style.marginTop = 18 > data.name.length ? "-8px" : "-15px", 
            getElem("wiki_row1_col1_div_" + n).style.height = "", getElem("wiki_row1_col1_text_" + n).innerHTML = html(options.min_level), 
            getElem("wiki_row1_col2_text_" + n).innerHTML = html(Math.round(options.cooldown / 100) / 10 + " <span style='color: #8CD'>secs</span>"), 
            getElem("wiki_row1_col3_text_" + n).innerHTML = html(thousandSeperate(data.params.price)), 
            getElem("wiki_row1_col4_text_" + n).innerHTML = html(options.uses), getElem("wiki_row1_col5_text_" + n).innerHTML = html(Math.round(data.params.price / (options.cooldown / 1e3 * options.uses) * 10) / 10 + " <span style='color: #8CD'>cps</span>"), 
            getElem("wiki_row2_col1_div_" + n).style.height = "", getElem("wiki_row2_col1_text_" + n).innerHTML = html(options.basic_damage + " <span style='color: #DD8'>dmg</span>"), 
            getElem("wiki_row2_col2_div_" + n).style.height = "", getElem("wiki_row2_col2_text_" + n).innerHTML = html(options.xp + " <span style='color: #DD8'>exp</span>"), 
            getElem("wiki_row2_col3_text_" + n).innerHTML = html(options.penetration), getElem("wiki_row2_col4_text_" + n).innerHTML = html(Math.round(options.basic_damage / (options.cooldown / 1e3) * 10) / 10 + " <span style='color: #DD8'>dps</span>"), 
            getElem("wiki_row2_col5_text_" + n).innerHTML = html(Math.round(options.xp / (options.cooldown / 1e3) * 10) / 10 + " <span style='color: #DD8'>eps</span>")) : "enchant" == name && (getElem("wiki_row1_col0_" + n).setAttribute("oncontextmenu", ""), 
            getElem("wiki_row1_col0_div_" + n).style.height = "", getElem("wiki_row1_col0_text_" + n).style.marginTop = "", 
            getElem("wiki_row1_col0_text_" + n).innerHTML = html(item_base[data.enchant.to_enchant].name.replace("Enchanted", "Ench").replace("Necklace", "Neck")), 
            getElem("wiki_row1_col2_text_" + n).innerHTML = html(Math.round(100 * data.enchant.low) + "%"), 
            getElem("wiki_row1_col3_text_" + n).innerHTML = html(Math.round(100 * data.enchant.med) + "%"), 
            getElem("wiki_row1_col4_text_" + n).innerHTML = html(Math.round(100 * data.enchant.high) + "%"), 
            getElem("wiki_row1_col5_text_" + n).innerHTML = html(Math.round(100 * data.enchant.sup) + "%"), 
            getElem("wiki_row2_col0_" + n).setAttribute("oncontextmenu", "Mods.Wikimd.nameMenu('item'," + data.id + ")"), 
            getElem("wiki_row2_col0_div_" + n).style.height = "38px", getElem("wiki_row2_col0_img_" + n).style.background = 'url("' + _ref.url + '") no-repeat scroll ' + -data.img.x * _ref.tile_width + "px " + -data.img.y * _ref.tile_height + "px transparent", 
            getElem("wiki_row2_col0_img_" + n).item_id = data.id, getElem("wiki_row2_col0_text_" + n).innerHTML = html(data.name), 
            getElem("wiki_row2_col0_text_" + n).style.marginTop = 25 > data.name.length ? "-8px" : "-15px", 
            getElem("wiki_row2_col2_div_" + n).style.height = "36px", getElem("wiki_row2_col2_text_" + n).innerHTML = _ref3));
            Mods.Wikimd.setSpan(name, n);
        }
    };
    Mods.Wikimd.tableData = function(j, docs, fields) {
        var c, changedSave, node, uv, v, _i, _j, _k, k, _len, _len1, data, _len3, _ref;
        data = getElem("mods_wiki_type").value;
        c = docs[fields[j]];
        if (!c) return !1;
        changedSave = IMAGE_SHEET[c.img.sheet];
        _i = v = uv = "";
        node = {};
        docs = 0;
        n_onclick = _len = _len1 = "";
        _j = 0;
        _ref = {};
        if ("monster" == data) {
            node = c.params.drops;
            for (_k in node) data = item_base[node[_k].id], _len3 = IMAGE_SHEET[data.img.sheet], 
            uv = uv + "<a title='" + Mods.cleanText(data.name) + "(" + 100 * node[_k].chance + "%)'><div item_id='" + data.b_i + "' style='background:url(&apos;" + _len3.url + "&apos;) no-repeat scroll " + -data.img.x * _len3.tile_width + "px " + -data.img.y * _len3.tile_height + "px transparent; width:32px; height:32px; margin:2px; margin-left: 4px; display:inline-block; float:left;' oncontextmenu='Mods.Wikimd.nameMenu(&apos;item&apos;," + data.b_i + ")'>&nbsp;</div></a>";
            _j = Math.round((c.params.health + 60) / 60);
        } else if ("vendor" == data) {
            node = c.temp.content;
            for (_k in node) data = item_base[node[_k].id], _len3 = IMAGE_SHEET[data.img.sheet], 
            node[_k].spawn ? v = v + "<a title='" + Mods.cleanText(data.name) + " (buys & sells) value " + thousandSeperate(data.params.price) + "'><div item_id='" + data.b_i + "' style='background:url(&apos;" + _len3.url + "&apos;) no-repeat scroll " + -data.img.x * _len3.tile_width + "px " + -data.img.y * _len3.tile_height + "px transparent; background-color: #666666; width:32px; height:32px; margin:2px; margin-left: 4px; display:inline-block; float:left;' oncontextmenu='Mods.Wikimd.nameMenu(&apos;item&apos;," + data.b_i + ")'>&nbsp;</div></a>" : _i = _i + "<a title='" + Mods.cleanText(data.name) + " (buys) value " + thousandSeperate(data.params.price) + "'><div item_id='" + data.b_i + "' style='background:url(&apos;" + _len3.url + "&apos;) no-repeat scroll " + -data.img.x * _len3.tile_width + "px " + -data.img.y * _len3.tile_height + "px transparent; width:32px; height:32px; margin:2px; margin-left: 4px; display:inline-block; float:left;' oncontextmenu='Mods.Wikimd.nameMenu(&apos;item&apos;," + data.b_i + ")'>&nbsp;</div></a>";
            uv = v + _i;
        } else if ("craft" == data) {
            node = c.pattern.requires;
            docs = 0;
            tooMany = function(property) {
                return 1 < Math.max(node[property] || 0, c.pattern.consumes[property] || 0) && !0 || !1;
            };
            for (_k in node) if ("length" != _k && "undefined" != typeof item_base[_k]) for (k = 0; k < Math.max(node[_k], c.pattern.consumes[_k] || 0); k++) data = item_base[_k], 
            _len3 = IMAGE_SHEET[data.img.sheet], "undefined" == typeof c.pattern.consumes[_k] ? (v = v + "<a title='" + Mods.cleanText(data.name) + " (not consumed) x" + Math.max(node[_k], c.pattern.consumes[_k] || 0) + "'><div item_id='" + data.b_i + "' style='background:url(&apos;" + _len3.url + "&apos;) no-repeat scroll " + -data.img.x * _len3.tile_width + "px " + -data.img.y * _len3.tile_height + "px transparent; background-color: #666666; width:32px; height:32px; margin:2px; margin-left: 4px; display:inline-block; float:left;' oncontextmenu='Mods.Wikimd.nameMenu(&apos;item&apos;," + data.b_i + ")'>&nbsp;</div></a>", 
            tooMany(_k) && (k = Math.max(node[_k], c.pattern.consumes[_k] || 0)) && (v += "<div style='width:32px; height:20px; margin:2px; margin-left: 4px; margin-top: 14px; display:inline-block; float:left; text-align: center;'> x" + k + "</div>")) : (_i = _i + "<a title='" + Mods.cleanText(data.name) + " (consumed) x" + Math.max(node[_k], c.pattern.consumes[_k] || 0) + "'><div item_id='" + data.b_i + "' style='background:url(&apos;" + _len3.url + "&apos;) no-repeat scroll " + -data.img.x * _len3.tile_width + "px " + -data.img.y * _len3.tile_height + "px transparent; width:32px; height:32px; margin:2px; margin-left: 4px; display:inline-block; float:left;' oncontextmenu='Mods.Wikimd.nameMenu(&apos;item&apos;," + data.b_i + ")'>&nbsp;</div></a>", 
            tooMany(_k) && (k = Math.max(node[_k], c.pattern.consumes[_k] || 0)) && (_i += "<div style='width:32px; height:20px; margin:2px; margin-left: 4px; margin-top: 14px; display:inline-block; float:left; text-align: center;'> x" + k + "</div>"));
            for (_k in c.pattern.consumes) if ("length" != _k && "undefined" != typeof item_base[_k] && "undefined" == typeof node[_k]) for (k = 0; k < c.pattern.consumes[_k]; k++) data = item_base[_k], 
            _len3 = IMAGE_SHEET[data.img.sheet], _i = _i + "<a title='" + Mods.cleanText(data.name) + " (consumed) x" + c.pattern.consumes[_k] + "'><div item_id='" + data.b_i + "' style='background:url(&apos;" + _len3.url + "&apos;) no-repeat scroll " + -data.img.x * _len3.tile_width + "px " + -data.img.y * _len3.tile_height + "px transparent; width:32px; height:32px; margin:2px; margin-left: 4px; display:inline-block; float:left;' oncontextmenu='Mods.Wikimd.nameMenu(&apos;item&apos;," + data.b_i + ")'>&nbsp;</div></a>", 
            tooMany(_k) && (k = c.pattern.consumes[_k]) && (_i += "<div item_id='" + data.b_i + "' style='width:32px; height:20px; margin:2px; margin-left: 4px; margin-top: 14px; display:inline-block; float:left; text-align: center;'> x" + k + "</div>");
            for (_k in node) "length" != _k && (k = Math.max(node[_k], c.pattern.consumes[_k] || 0), 
            docs += 1 >= k && k || 2);
            for (_k in c.pattern.consumes) "undefined" == typeof node[_k] && "length" != _k && (k = parseInt(c.pattern.consumes[_k]), 
            docs += 1 >= k && k || 2);
            uv = v + _i;
            _len = c.pattern.base_chance || c.pattern.chance || "-";
            _len = "number" == typeof _len ? Math.round(1e4 * _len) / 100 + "%" : _len;
            _len1 = c.pattern.max_chance || c.pattern.chance || 1;
            _len1 = "number" == typeof _len1 ? Math.round(1e4 * _len1) / 100 + "%" : _len1;
            n_onclick = "";
            "Anvil" == c.object.name && (n_onclick = "Mods.Wikimd.showFormula('" + fields[j] + "');");
        } else if ("pet" == data) for (_k in node = Mods.Wikimd.pet_family[c.b_i], node.length = 0, 
        node) {
            if ("number" == typeof parseInt(_k) && "undefined" != typeof item_base[node[_k]] && void 0 != item_base[node[_k]].params.pet) if (void 0 == Mods.Wikimd.pet_family[c.b_i].id) data = item_base[node[_k]], 
            node.length += 1, _len3 = IMAGE_SHEET[data.img.sheet], "" != uv && (uv += "<span style='font-size: .8em; height: 32px; width: 10px; margin: 2px; display:inline-block; float:left; position: relative; color: #999;'><span style='position: absolute; width: 100%; top: 40%; right: 10%;'>&gt;</span></span>"), 
            uv = data.b_i == c.b_i ? uv + ("<a title='" + Mods.cleanText(data.name) + "'><div item_id='" + data.b_i + "' style='background:url(&apos;" + _len3.url + "&apos;) no-repeat scroll " + -data.img.x * _len3.tile_width + "px " + -data.img.y * _len3.tile_height + "px #666; width:32px; height:32px; margin:2px; margin-left: 4px; display:inline-block; float:left;' oncontextmenu='Mods.Wikimd.nameMenu(&apos;item&apos;," + data.b_i + ")'>&nbsp;</div></a>") : uv + ("<a title='" + Mods.cleanText(data.name) + "'><div item_id='" + data.b_i + "' style='background:url(&apos;" + _len3.url + "&apos;) no-repeat scroll " + -data.img.x * _len3.tile_width + "px " + -data.img.y * _len3.tile_height + "px transparent; width:32px; height:32px; margin:2px; margin-left: 4px; display:inline-block; float:left;' oncontextmenu='Mods.Wikimd.nameMenu(&apos;item&apos;," + data.b_i + ")'>&nbsp;</div></a>"); else {
                data = Mods.Wikimd.pet_family[c.b_i].pattern;
                fields = data.consumes;
                v = data.requires;
                for (k in v) if ("number" == typeof parseInt(k) && void 0 != item_base[k] && void 0 != item_base[k].img && void 0 == fields[k]) for (j = 0; j < v[k]; j++) data = item_base[k], 
                node.length += 1, _len3 = IMAGE_SHEET[data.img.sheet], "" != uv && (uv += "<span style='font-size: .8em; height: 32px; width: 10px; margin: 2px; display:inline-block; float:left; position: relative; color: #999;'><span style='position: absolute; width: 100%; top: 40%; right: 10%;'>+</span></span>"), 
                uv += "<a title='" + Mods.cleanText(data.name) + "'><div item_id='" + data.b_i + "' style='background:url(&apos;" + _len3.url + "&apos;) no-repeat scroll " + -data.img.x * _len3.tile_width + "px " + -data.img.y * _len3.tile_height + "px #666; width:32px; height:32px; margin:2px; margin-left: 4px; display:inline-block; float:left;' oncontextmenu='Mods.Wikimd.nameMenu(&apos;item&apos;," + data.b_i + ")'>&nbsp;</div></a>";
                for (k in fields) if ("number" == typeof parseInt(k) && void 0 != item_base[k] && void 0 != item_base[k].img) for (j = 0; j < fields[k]; j++) data = item_base[k], 
                node.length += 1, _len3 = IMAGE_SHEET[data.img.sheet], "" != uv && (uv += "<span style='font-size: .8em; height: 32px; width: 10px; margin: 2px; display:inline-block; float:left; position: relative; color: #999;'><span style='position: absolute; width: 100%; top: 40%; right: 10%;'>+</span></span>"), 
                uv += "<a title='" + Mods.cleanText(data.name) + "'><div item_id='" + data.b_i + "' style='background:url(&apos;" + _len3.url + "&apos;) no-repeat scroll " + -data.img.x * _len3.tile_width + "px " + -data.img.y * _len3.tile_height + "px transparent; width:32px; height:32px; margin:2px; margin-left: 4px; display:inline-block; float:left;' oncontextmenu='Mods.Wikimd.nameMenu(&apos;item&apos;," + data.b_i + ")'>&nbsp;</div></a>";
                data = item_base[c.b_i];
                node.length += 1;
                _len3 = IMAGE_SHEET[data.img.sheet];
                uv += "<span style='font-size: .8em; height: 32px; width: 10px; margin: 2px; display:inline-block; float:left; position: relative; color: #999;'><span style='position: absolute; width: 100%; top: 40%; right: 10%;'>=</span></span>";
                uv += "<a title='" + Mods.cleanText(data.name) + "'><div item_id='" + data.b_i + "' style='background:url(&apos;" + _len3.url + "&apos;) no-repeat scroll " + -data.img.x * _len3.tile_width + "px " + -data.img.y * _len3.tile_height + "px #666; width:32px; height:32px; margin:2px; margin-left: 4px; display:inline-block; float:left;' oncontextmenu='Mods.Wikimd.nameMenu(&apos;item&apos;," + data.b_i + ")'>&nbsp;</div></a>";
            }
        } else if ("enchant" == data) for (node = [ c.enchant.from_enchant, c.id, c.enchant.to_enchant ], 
        j = 0; 3 > j; j++) node[j] && (data = item_base[node[j]], _len3 = IMAGE_SHEET[data.img.sheet], 
        _k = node[j] == c.id ? "#666" : "transparent", "" != uv && (uv += "<span style='font-size: .8em; height: 32px; width: 10px; margin: 2px; display:inline-block; float:left; position: relative; color: #999;'><span style='position: absolute; width: 100%; top: 40%; right: 10%;'>&gt;</span></span>"), 
        uv += "<a title='" + Mods.cleanText(data.name) + "'><div item_id='" + data.b_i + "' style='background:url(&apos;" + _len3.url + "&apos;) no-repeat scroll " + -data.img.x * _len3.tile_width + "px " + -data.img.y * _len3.tile_height + "px " + _k + "; width:32px; height:32px; margin:2px; margin-left: 4px; display:inline-block; float:left;' oncontextmenu='Mods.Wikimd.nameMenu(&apos;item&apos;," + data.b_i + ")'>&nbsp;</div></a>"); else "spell" == data && (_ref = c.magic);
        return {
            item: c,
            img: changedSave,
            drops: node,
            items: docs,
            images: uv,
            max_chance: _len1,
            min_chance: _len,
            n_onclick: n_onclick,
            mins: _j,
            magic: _ref
        };
    };
    Mods.Wikimd.showFormula = function(children) {
        if ("undefined" != typeof children) {
            children = Mods.Wikimd.formulas[children].pattern.pattern;
            getElem("wiki_recipe_form").style.display = "block";
            for (var type = 0; 4 > type; type++) for (var id = 0; 4 > id; id++) {
                var elem = getElem("wiki_formula_" + type + "_" + id);
                elem.style.background = "";
                if ("undefined" != typeof children[type] && "undefined" != typeof children[type][id] && "undefined" != typeof item_base[children[type][id]]) {
                    var t = item_base[children[type][id]], w = IMAGE_SHEET[t.img.sheet];
                    elem.style.background = 'url("' + w.url + '") no-repeat scroll ' + -t.img.x * w.tile_width + "px " + -t.img.y * w.tile_height + "px transparent";
                }
            }
        }
    };
    Mods.Wikimd.setSpan = function(table_name, id) {
        for (var data = Mods.Wikimd.span, buffer, x, type, c = 1; 3 > c; c++) for (var n = 0; 6 > n; n++) buffer = getElem("wiki_row" + c + "_col" + n + "_" + id), 
        void 0 != data[table_name] && (x = data[table_name]["wiki_r" + c + "_c" + n], "undefined" != typeof x ? (type = x.c || "", 
        x = x.r || "") : x = type = "", buffer.setAttribute("colspan", type), buffer.setAttribute("rowspan", x));
    };
    Mods.Wikimd.sortWiki = function(data, name, n) {
        if ("undefined" != typeof name && "undefined" != typeof n) {
            var c = !1;
            if ("object" != typeof data || null == data) c = !0;
            var r = !1;
            Mods.Wikimd.oldSortValue != Mods.Wikimd.newSortValue || Mods.Wikimd.sortReverse ? Mods.Wikimd.oldSortValue != Mods.Wikimd.newSortValue && (Mods.Wikimd.sortReverse = !1) : r = !0;
            Mods.Wikimd.oldSortValue = Mods.Wikimd.newSortValue;
            data = null == data ? Mods.Wikimd.newWikiLoad : data;
            name = getElem("mods_wiki_type").value;
            n = n || Mods.Wikimd.oldSort[name];
            if ("object" == typeof data) {
                var init = function(list) {
                    list.sort(function(c, name) {
                        var x, len, result, y, obj, add, func;
                        x = getElem("mods_wiki_type").value;
                        func = function(properties) {
                            return "damage" == properties ? "basic_damage" : "exp" == properties ? "xp" : "casts" == properties ? "uses" : properties;
                        };
                        "item" == x ? add = function(name, index) {
                            return -1 < name && data[name] ? "name" == index || "level" == index || "skill" == index || "slot" == index ? data[name][index] : data[name].params[index] || 0 : 0;
                        } : "monster" == x ? add = function(value, field) {
                            return -1 < value && data[value] ? "name" == field ? data[value][field] : "level" == field ? FIGHT.calculate_monster_level(data[value]) : "health" == field || "respawn" == field ? data[value].temp.health : data[value].temp["total_" + field] : 0;
                        } : "craft" == x ? add = function(id, key) {
                            return -1 < id && data[id] ? "base_chance" == key || "max_chance" == key ? data[id].pattern[key] || data[id].pattern.chance || 1 : "location" == key ? data[id].object.name || 0 : "xp" == key ? parseInt(data[id].xp) || 0 : "level" == key ? parseInt(data[id].level) || 0 : data[id][key] : 0;
                        } : "pet" == x ? add = function(key, j) {
                            return -1 < key && data[key] ? "name" == j ? pets[data[key].params.pet][j] : "xp_required" == j || "stones" == j || "inventory_slots" == j ? pets[data[key].params.pet].params[j] : "family" == j ? Mods.Wikimd.family[key] : data[key].params[j] : 0;
                        } : "spell" == x ? add = function(name, context) {
                            if (!(-1 < name && data[name])) return 0;
                            var value = func(context), options = data[name].magic;
                            return "dmg_s" == value ? Math.round(options.basic_damage / (options.cooldown / 1e3) * 100) / 100 : "cost_s" == value ? Math.round(data[name].params.price / (options.uses * options.cooldown / 1e3) * 100) / 100 : "exp_s" == value ? Math.round(options.xp / (options.cooldown / 1e3) * 100) / 100 : "level" == value ? options.min_level : "name" == value ? data[name].name : options[value];
                        } : "enchant" == x && (add = function(m, type) {
                            return -1 < m && data[m] ? "name" == type ? data[m].name : "enchant" == type ? item_base[data[m].enchant.to_enchant].name : data[m].enchant[type] : 0;
                        });
                        if ("vendor" == x) return data[name][n] > data[c][n] && !done || data[name][n] < data[c][n] && done ? 1 : -1;
                        x = add(c, n);
                        len = add(c, vold);
                        result = add(c, last);
                        y = add(name, n);
                        obj = add(name, vold);
                        add = add(name, last);
                        return x > y ? -1 : x < y ? 1 : len > obj ? -1 : len < obj ? 1 : result > add ? -1 : result < add ? 1 : 0;
                    });
                }, result = [], key;
                for (key in data) result.push(key);
                var ret = Mods.Wikimd.oldSort || {}, done = !1;
                "item" == name ? (vold = "undefined" != typeof ret.item ? ret.item : "name" != n ? "name" : "level", 
                last = "name" != n && "name" != vold ? "name" : "level" != n && "level" != vold ? "level" : "price") : "monster" == name ? (vold = ret.monster ? ret.monster : "name" != n ? "name" : "level", 
                last = "name" != n && "name" != vold ? "name" : "health") : "craft" == name ? (vold = "xp" != n ? "xp" : "level", 
                last = "xp" != n && "xp" != vold ? "xp" : "level" != n && "level" != vold ? "level" : "name") : "pet" == name ? (vold = ret.pet ? ret.pet : "family" != n ? "family" : "inventory_slots", 
                last = "family" != n && "family" != vold ? "family" : "inventory_slots" != n && "inventory_slots" != vold ? "inventory_slots" : "name") : "enchant" == name ? (vold = ret.enchant ? ret.enchant : "low" != n ? "low" : "name", 
                last = "low" != n && "low" != vold ? "low" : "name" != n && "name" != vold ? "name" : "enchant") : "spell" == name && (vold = ret.spell ? ret.spell : "level" != n ? "level" : "name", 
                last = "level" != n && "level" != vold ? "level" : "name" != n && "name" != vold ? "name" : "exp");
                ret[name] == n && r && (done = !0) && (Mods.Wikimd.sortReverse = !0) || (ret[name] = n) && (Mods.Wikimd.sortReverse = !1);
                if ("vendor" == name) init(result); else {
                    r = [];
                    ret = [];
                    for (key in result) {
                        var convert, add;
                        convert = function(svg) {
                            return "damage" == svg ? "basic_damage" : "exp" == svg ? "xp" : "casts" == svg ? "uses" : svg;
                        };
                        "item" == name ? add = function(num, key) {
                            return -1 < num && data[num] ? "name" == key || "level" == key || "skill" == key || "slot" == key ? data[num][key] : data[num].params[key] || 0 : 0;
                        } : "monster" == name ? add = function(num, key) {
                            return -1 < num && data[num] ? "name" == key ? data[num][key] : "level" == key ? FIGHT.calculate_monster_level(data[num]) : "health" == key || "respawn" == key ? data[num].temp.health : data[num].temp["total_" + key] : 0;
                        } : "craft" == name ? add = function(id, key) {
                            return -1 < id && data[id] ? "base_chance" == key || "max_chance" == key ? data[id].pattern[key] || data[id].pattern.chance || 1 : "location" == key ? data[id].object.name || 0 : "xp" == key ? parseInt(data[id].xp) || 0 : "level" == key ? parseInt(data[id].level) || 0 : data[id][key] : 0;
                        } : "pet" == name ? add = function(name, id) {
                            return -1 < name && data[name] ? "name" == id ? pets[data[name].params.pet][id] : "xp_required" == id || "stones" == id || "inventory_slots" == id ? pets[data[name].params.pet].params[id] : "family" == id ? Mods.Wikimd.family[name] : data[name].params[id] : 0;
                        } : "spell" == name ? add = function(name, value) {
                            if (!(-1 < name && data[name])) return 0;
                            var index = convert(value), options = data[name].magic;
                            return "dmg_s" == index ? Math.round(options.basic_damage / (options.cooldown / 1e3) * 100) / 100 : "cost_s" == index ? Math.round(data[name].params.price / (options.uses * options.cooldown / 1e3) * 100) / 100 : "exp_s" == index ? Math.round(options.xp / (options.cooldown / 1e3) * 100) / 100 : "level" == index ? options.min_level : "name" == index ? data[name].name : options[index];
                        } : "enchant" == name && (add = function(m, type) {
                            return -1 < m && data[m] ? "name" == type ? data[m].name : "enchant" == type ? item_base[data[m].enchant.to_enchant].name : data[m].enchant[type] : 0;
                        });
                        0 < add(result[key], n) || "family" == n && "string" == typeof add(result[key], n) ? r.push(result[key]) : ret.push(result[key]);
                    }
                    0 < r.length && init(r);
                    0 < ret.length && init(ret);
                    done && (r.reverse(), 0 == r.length && ret.reverse());
                    for (var s in ret) r.push(ret[s]);
                    result = r;
                }
            }
            Mods.Wikimd.oldSortList = result;
            if (c) Mods.Wikimd.populateWiki(data, result); else return result;
        }
    };
    Mods.Wikimd.populateWikiList = function() {
        var n = getElem("mods_wiki_type"), c = getElem("mods_wiki_type_item"), g = getElem("mods_wiki_type_item_type"), k = getElem("mods_wiki_type_item_skill"), b = getElem("mods_wiki_type_monster"), name = getElem("mods_wiki_type_vendor"), r = getElem("mods_wiki_type_craft"), result = getElem("mods_wiki_type_pet"), _i = getElem("mods_wiki_type_spell"), s = getElem("mods_wiki_type_enchant"), _ref = getElem("mods_wiki_type_craft_skill"), _ref1 = getElem("mods_wiki_type_craft_source"), v = getElem("mods_wiki_name"), opts = getElem("mods_wiki_range"), x = parseInt(getElem("mods_wiki_level_low").value), y = parseInt(getElem("mods_wiki_level_high").value), data = {}, newData = Mods.Wikimd.item_formulas, args = Mods.Wikimd.formulas, key;
        if ("undefined" != typeof n.value) if ("item" == n.value) {
            for (key in newData) data[key] = newData[key];
            if ("name" == c.value) {
                if ("undefined" != typeof v.value) for (key in data) opts = data[key].name.toLowerCase(), 
                b = v.value.toLowerCase(), 0 > opts.indexOf(b) && delete data[key];
            } else {
                if ("skill" == c.value) if ("-1" != k.value) for (key in data) data[key].skill.toLowerCase() != k.value && delete data[key]; else return !1; else if ("type" == c.value) if ("-1" != g.value) for (key in b = g.value, 
                data) {
                    var v = data[key].slot || "none", v = v.toLowerCase(), t = data[key].type || "none", t = t.toLowerCase(), name = data[key].skill || "none", name = name.toLowerCase();
                    -1 < b.indexOf(v) && -1 < b.search(t) || v == b || name == b || t == b || delete data[key];
                } else return !1;
                if (-1 != opts.value) for (key in data) name = "", name = "level" == opts.value ? data[key].level : data[key].params[opts.value] || null, 
                null == name && delete data[key], "number" == typeof x && "undefined" != typeof data[key] && (!(name < x) && -1 < name || delete data[key]), 
                "number" == typeof y && "undefined" != typeof data[key] && (!(name > y) && -1 < name || delete data[key]);
            }
        } else if ("monster" == n.value || "vendor" == n.value) {
            for (key in npc_base) data[key] = npc_base[key];
            if ("monster" == n.value) for (key in data) if (3 != data[key].type) delete data[key]; else if ("name" == b.value) "undefined" != typeof v.value && (n = v.value.toLowerCase(), 
            c = data[key].name.toLowerCase(), -1 == c.indexOf(n) && delete data[key]); else if ("item" == b.value) {
                _i = !1;
                for (t in data[key].params.drops) "number" == typeof parseInt(t) && (s = data[key].params.drops, 
                n = v.value.toLowerCase(), s = item_base[s[t].id].name, s = s.toLowerCase(), -1 < s.indexOf(n) && (_i = !0));
                _i || delete data[key];
            } else -1 != opts.value && "undefined" != typeof data[key] && (name = "level" == opts.value ? FIGHT.calculate_monster_level(data[key]) : "health" == opts.value ? data[key].temp.health : data[key].temp["total_" + opts.value] || null, 
            null == name && delete data[key], "number" == typeof x && "undefined" != typeof data[key] && (!(name < x) && -1 < name || delete data[key]), 
            "number" == typeof y && "undefined" != typeof data[key] && (!(name > y) && -1 < name || delete data[key])); else if ("vendor" == n.value) for (key in data) if (4 != data[key].type) delete data[key]; else if ("name" == name.value) {
                if ("undefined" != typeof v.value) for (key in data) n = v.value.toLowerCase(), 
                c = data[key].name.toLowerCase(), -1 == c.indexOf(n) && delete data[key];
            } else {
                if ("item" == name.value) {
                    _i = !1;
                    for (t in data[key].temp.content) "number" == typeof parseInt(t) && (s = data[key].temp.content, 
                    n = v.value.toLowerCase(), s = item_base[s[t].id].name, s = s.toLowerCase(), -1 != s.indexOf(n) && (_i = !0));
                    _i || delete data[key];
                }
            } else return !1;
        } else if ("craft" == n.value) {
            for (key in args) data[key] = args[key];
            if ("item" == r.value) {
                if ("undefined" != typeof v.value) for (key in data) {
                    _i = !1;
                    n = v.value.toLowerCase();
                    c = data[key].name;
                    c = c.toLowerCase();
                    -1 != c.indexOf(n) && (_i = !0);
                    if (!_i) for (t in data[key].pattern.requires) if ("undefined" != typeof item_base[t].name && (s = item_base[t].name, 
                    s = s.toLowerCase(), -1 != s.indexOf(n))) {
                        _i = !0;
                        break;
                    }
                    if (!_i) for (t in data[key].pattern.consumes) if ("undefined" != typeof item_base[t].name && (s = item_base[t].name, 
                    s = s.toLowerCase(), -1 != s.indexOf(n))) {
                        _i = !0;
                        break;
                    }
                    _i || delete data[key];
                }
            } else {
                if ("skill" == r.value) if (-1 != _ref.value) for (key in data) data[key].skill.toLowerCase() != _ref.value && delete data[key]; else return !1;
                if ("source" == r.value) if (-1 != _ref1.value) for (key in data) data[key].object.name.toLowerCase() != _ref1.value && delete data[key]; else return !1;
                if (-1 != opts.value) for (key in data) name = "base_chance" == opts.value || "max_chance" == opts.value ? 100 * data[key].pattern[opts.value] || 100 * data[key].pattern.chance || null : parseInt(data[key][opts.value]) || null, 
                null == name && delete data[key], "number" == typeof x && "undefined" != typeof data[key] && (!(name < x) && -1 < name || delete data[key]), 
                "number" == typeof y && "undefined" != typeof data[key] && (!(name > y) && -1 < name || delete data[key]);
            }
        } else if ("pet" == n.value) {
            for (key in Mods.Wikimd.pet_family) data[key] = item_base[key];
            for (key in data) "name" == result.value && ("undefined" != typeof v.value ? (n = v.value.toLowerCase(), 
            c = data[key].name.toLowerCase(), -1 == c.indexOf(n) && delete data[key]) : "family" == result.value ? "undefined" != typeof v.value && (n = v.value.toLowerCase(), 
            c = Mods.Wikimd.family[key], void 0 != c ? (c = c.toLowerCase(), -1 == c.indexOf(n) && delete data[key]) : delete data[key]) : -1 != opts.value && "undefined" != typeof data[key] && (name = -1 == opts.value ? null : "aim" == opts.value || "armor" == opts.value || "power" == opts.value || "magic" == opts.value || "speed" == opts.value ? item_base[data[key].b_i].params[opts.value] : pets[data[key].params.pet].params[opts.value], 
            null == name && delete data[key], "number" == typeof x && "undefined" != typeof data[key] && (!(name < x) && -1 < name || delete data[key]), 
            "number" == typeof y && "undefined" != typeof data[key] && (!(name > y) && -1 < name || delete data[key])));
        } else if ("spell" == n.value) {
            for (key in newData) newData[key].magic && (data[key] = newData[key]);
            for (key in data) "name" == _i.value ? "undefined" != typeof v.value && (n = v.value.toLowerCase(), 
            c = data[key].name.toLowerCase(), -1 == c.indexOf(n) && delete data[key]) : -1 != opts.value && "undefined" != typeof data[key] && (t = data[key].magic, 
            b = "damage" == opts.value ? "basic_damage" : "exp" == opts.value ? "xp" : "casts" == opts.value ? "uses" : opts.value, 
            name = "dmg_s" == opts.value ? Math.round(t.basic_damage / (t.cooldown / 1e3) * 10) / 10 : "cost_s" == opts.value ? Math.round(data[key].params.price / (t.uses * t.cooldown)) : "exp_s" == opts.value ? Math.round(t.xp / t.uses) : null, 
            name = -1 == opts.value ? null : null != name ? name : "price" == opts.value ? data[key].params.price : t[b], 
            null == name && delete data[key], "number" == typeof x && "undefined" != typeof data[key] && (!(name < x) && -1 < name || delete data[key]), 
            "number" == typeof y && "undefined" != typeof data[key] && (!(name > y) && -1 < name || delete data[key]));
        } else if ("enchant" == n.value) {
            for (key in newData) newData[key].enchant && newData[key].enchant.to_enchant && (data[key] = newData[key]);
            for (key in data) "item" == s.value ? "undefined" != typeof v.value && (n = v.value.toLowerCase(), 
            c = data[key].name.toLowerCase(), b = (b = data[key].enchant.from_enchant) ? item_base[b].name.toLowerCase() : null, 
            t = (t = data[key].enchant.to_enchant) ? item_base[t].name.toLowerCase() : null, 
            -1 == c.indexOf(n) && (b && -1 == b.indexOf(n) || !b) && (t && -1 == t.indexOf(n) || !b) && delete data[key]) : -1 != opts.value && "undefined" != typeof data[key] && (name = -1 == opts.value ? null : data[key].enchant[opts.value] || null, 
            null == name && delete data[key], "number" == typeof x && "undefined" != typeof data[key] && (!(name < x) && -1 < name || delete data[key]), 
            "number" == typeof y && "undefined" != typeof data[key] && (!(name > y) && -1 < name || delete data[key]));
        } else return !1; else return !1;
        return Mods.Wikimd.newWikiLoad = data;
    };
    Mods.Wikimd.currentSort = function() {
        var block = getElem("mods_wiki_type"), body = getElem("mods_wiki_type_item"), code = getElem("mods_wiki_type_item_type"), cond = getElem("mods_wiki_type_item_skill"), conditions = getElem("mods_wiki_type_monster"), expr = getElem("mods_wiki_type_vendor"), _j = getElem("mods_wiki_type_craft"), idt1 = getElem("mods_wiki_type_spell"), idt2 = getElem("mods_wiki_type_enchant"), _i = getElem("mods_wiki_type_craft_skill"), _len = getElem("mods_wiki_type_craft_source"), _len2 = getElem("mods_wiki_type_pet"), _ref2 = getElem("mods_wiki_name"), _ref3 = getElem("mods_wiki_range"), _ref4 = parseInt(getElem("mods_wiki_level_low").value), _ref5 = parseInt(getElem("mods_wiki_level_high").value), _ref6 = "", _ref6 = "monster" == block.value ? "mob " : "vendor" == block.value ? "npc " : block.value + " ", _ref6 = _ref6 + (("item" == block.value && body.value || "monster" == block.value && conditions.value || "vendor" == block.value && expr.value || "craft" == block.value && _j.value || "pet" == block.value && _len2.value || "spell" == block.value && idt1.value || "enchant" == block.value && idt2.value) + " " || ""), _ref6 = _ref6 + (("item" == block.value && "name" == body.value || "monster" == block.value && "all" != conditions.value || "vendor" == block.value && "all" != expr.value || "craft" == block.value && "item" == _j.value || "pet" == block.value && ("name" == _len2.value || "family" == _len2.value) || "spell" == block.value && "name" == idt1.value || "enchant" == block.value && "item" == idt2.value) && (_ref2.value || "") || ""), _ref6 = _ref6 + ("item" == block.value && ("type" == body.value && code.value + " " || "skill" == body.value && cond.value + " ") || ""), _ref6 = _ref6 + ("craft" == block.value && ("skill" == _j.value && _i.value + " " || "source" == _j.value && _len.value + " ") || "");
        return _ref6 += ("item" == block.value && "name" != body.value || "monster" == block.value && "all" == conditions.value || "craft" == block.value && "item" != _j.value || "pet" == block.value && "all" == _len2.value || "spell" == block.value && "all" == idt1.value || "enchant" == block.value && "all" == idt2.value) && _ref3.value + " (" + (_ref4 || "") + "," + (_ref5 || "") + ")" || "";
    };
    Mods.Wikimd.loadWikiType = function(index, eventName) {
        if (-1 != loadedMods.indexOf("Chatmd")) {
            var elem = getElem("mods_wiki_load");
            elem.innerHTML = "Go!";
            elem.setAttribute("onclick", "javascript:Mods.Wikimd.populateWiki(true);");
        }
        if (!1 !== index) {
            var hashalgo = getElem("mods_wiki_type"), passlen = getElem("mods_wiki_type_item");
            getElem("mods_wiki_type_item_type");
            getElem("mods_wiki_type_item_skill");
            var username = getElem("mods_wiki_type_monster"), whereleet = getElem("mods_wiki_type_vendor"), leetlevel = getElem("mods_wiki_type_craft");
            getElem("mods_wiki_type_craft_skill");
            getElem("mods_wiki_type_craft_source");
            var prefix = getElem("mods_wiki_type_pet"), suffix = getElem("mods_wiki_type_spell"), sizeEnd = getElem("mods_wiki_type_enchant"), temp = getElem("mods_wiki_name"), elem = getElem("mods_wiki_range");
            getElem("mods_wiki_level");
            var name = getElem("mods_wiki_level_low"), charset = getElem("mods_wiki_level_high"), hashalgo = hashalgo.value, passlen = passlen.value, username = username.value, whereleet = whereleet.value, leetlevel = leetlevel.value, prefix = prefix.value, suffix = suffix.value, sizeEnd = sizeEnd.value;
            temp.value = null;
            name.value = null;
            charset.value = null;
            var child, childIndex, childNode, childrenContainer, key, schema, treema, value, _i, _len, _ref, _ref1, _ref2;
            0 == index ? (childIndex = childNode = treema = value = "none", child = "item" == hashalgo && "block" || "none", 
            childrenContainer = "monster" == hashalgo && "block" || "none", key = "vendor" == hashalgo && "block" || "none", 
            schema = "craft" == hashalgo && "block" || "none", _i = "pet" == hashalgo && "block" || "none", 
            _len = "spell" == hashalgo && "block" || "none", _ref = "enchant" == hashalgo && "block" || "none", 
            _ref2 = ("item" == hashalgo && "name" != passlen || "monster" == hashalgo && "all" == username || "craft" == hashalgo && "item" != leetlevel || "pet" == hashalgo && "all" == prefix || "spell" == hashalgo && "all" == suffix || "enchant" == hashalgo && "all" == sizeEnd) && "block" || "none", 
            _ref1 = ("item" == hashalgo && "name" == passlen || "monster" == hashalgo && "all" != username || "vendor" == hashalgo && "all" != whereleet || "craft" == hashalgo && "item" == leetlevel || "pet" == hashalgo && "all" != prefix || "spell" == hashalgo && "name" == suffix || "enchant" == hashalgo && "item" == sizeEnd) && "block" || "none") : 1 == index ? (childIndex = "item" == hashalgo && "type" == passlen && "block" || "none", 
            childNode = "item" == hashalgo && "skill" == passlen && "block" || "none", treema = "craft" == hashalgo && "skill" == leetlevel && "block" || "none", 
            value = "craft" == hashalgo && "source" == leetlevel && "block" || "none", _ref2 = ("item" == hashalgo && "name" != passlen || "monster" == hashalgo && "all" == username || "craft" == hashalgo && "item" != leetlevel || "pet" == hashalgo && "all" == prefix || "spell" == hashalgo && "all" == suffix || "enchant" == hashalgo && "all" == sizeEnd) && "block" || "none", 
            _ref1 = ("item" == hashalgo && "name" == passlen || "monster" == hashalgo && "all" != username || "vendor" == hashalgo && "all" != whereleet || "craft" == hashalgo && "item" == leetlevel || "pet" == hashalgo && "all" != prefix || "spell" == hashalgo && "name" == suffix || "enchant" == hashalgo && "item" == sizeEnd) && "block" || "none") : 2 == index && (_ref2 = "block");
            temp = "monster" != hashalgo ? "item" != hashalgo ? "" : "<option value='level'>Range</option>            <option value='level'>Level</option>        <option value='price'>Price</option>             <option value='power'>Power</option>              <option value='aim'>Aim</option>             <option value='armor'>Armor</option>        <option value='magic'>Magic</option>        <option value='speed'>Speed</option>" : "<option value='level'>Range</option>            <option value='level'>Level</option>        <option value='health'>Health</option>           <option value='accuracy'>ACC</option>             <option value='strength'>STR</option>        <option value='defense'>DEF</option>";
            temp = "craft" != hashalgo ? temp : "<option value='level'>Range</option>            <option value='level'>Level</option>        <option value='base_chance'>Min%</option>        <option value='max_chance'>Max%</option>          <option value='xp'>Exp</option>";
            temp = "pet" != hashalgo ? temp : "<option value='sones'>Range</option>            <option value='stones'>Req SoE</option>     <option value='xp_required'>Req Exp</option>     <option value='inventory_slots'>Slots</option>    <option value='aim'>Aim</option>             <option value='power'>Power</option>        <option value='armor'>Armor</option>        <option value='magic'>Magic</option>                  <option value='speed'>Speed</option>";
            temp = "spell" != hashalgo ? temp : "<option value='level'>Range</option>            <option value='level'>Level</option>        <option value='damage'>Damage</option>           <option value='exp'>Exp</option>                  <option value='cooldown'>Cooldown</option>   <option value='price'>Price</option>        <option value='casts'>Casts</option>        <option value='penetration'>Spell Pen</option>        <option value='dmg_s'>Dmg/S</option>        <option value='cost_s'>Cost/S</option>       <option value='exp_s'>Exp/S</option>";
            temp = "enchant" != hashalgo ? temp : "<option value='low'>Range</option>            <option value='low'>Low %</option>          <option value='med'>Med %</option>               <option value='high'>High %</option>              <option value='sup'>Sup %</option>";
            "block" == _ref2 && (elem.innerHTML = temp);
            getElem("mods_wiki_type_item").style.display = child;
            getElem("mods_wiki_type_item_type").style.display = childIndex;
            getElem("mods_wiki_type_item_skill").style.display = childNode;
            getElem("mods_wiki_type_monster").style.display = childrenContainer;
            getElem("mods_wiki_type_vendor").style.display = key;
            getElem("mods_wiki_type_craft").style.display = schema;
            getElem("mods_wiki_type_craft_skill").style.display = treema;
            getElem("mods_wiki_type_craft_source").style.display = value;
            getElem("mods_wiki_type_pet").style.display = _i;
            getElem("mods_wiki_type_spell").style.display = _len;
            getElem("mods_wiki_type_enchant").style.display = _ref;
            getElem("mods_wiki_name").style.display = _ref1;
            getElem("mods_wiki_range").style.display = _ref2;
            getElem("mods_wiki_level").style.display = _ref2;
            getElem("mods_wiki_range_separate").style.display = _ref2;
        }
    };
    Mods.loadModMenu_options = function() {
        getElem("mod_load_options").style.display = "none";
        getElem("mod_load_mods_options").style.display = "none";
        getElem("mod_options_options").style.display = "block";
        getElem("mod_options_mods_options").style.display = "block";
        getElem("mod_wiki_options").style.display = "none";
        getElem("mod_wiki_mods_options").style.display = "none";
        Mods.modOptionsOptionsDisplay("expbar");
    };
    Mods.loadModMenu_load = function() {
        getElem("mod_load_options").style.display = "block";
        getElem("mod_load_mods_options").style.display = "block";
        getElem("mod_options_options").style.display = "none";
        getElem("mod_options_mods_options").style.display = "none";
        getElem("mod_wiki_options").style.display = "none";
        getElem("mod_wiki_mods_options").style.display = "none";
    };
    Mods.loadModMenu_wiki = function() {
        getElem("mod_load_options").style.display = "none";
        getElem("mod_load_mods_options").style.display = "none";
        getElem("mod_options_options").style.display = "none";
        getElem("mod_options_mods_options").style.display = "none";
        getElem("mod_wiki_options").style.display = "block";
        getElem("mod_wiki_mods_options").style.display = "block";
    };
    (function() {
        getElem("mods_form_top").innerHTML = "<span style='float:left; font-weight: bold; color:#FFFF00; margin-bottom:3px;'>Mods Info</span><span id='mods_menu_load' class='common_link' onclick='javascript:Mods.loadModMenu_load();' style='float:left; margin:0px; margin-left: 42px;'>Load</span><span id='mods_menu_options' class='common_link' onclick='javascript:Mods.loadModMenu_options(); ' style='float:left; margin:0px; margin-left: 45px;'>Options</span><span id='mods_menu_load' class='common_link' onclick='javascript:Mods.loadModMenu_wiki();' style='float:left; margin:0px; margin-left: 41px;'>Wiki</span><span id='mod_options_close' class='common_link' style='margin: 0px; margin-bottom: 2px;' onclick='javascript:addClass(getElem(&apos;mods_form&apos;),&apos;hidden&apos;);'>Close</span>";
        getElem("mods_form", {
            style: {
                width: "464px"
            }
        });
        Mods.Wikimd.loadDivs();
        Mods.elemClass("scrolling_allowed", "mod_wiki_mods_options");
        Mods.elemClass("scrolling_allowed", "mod_wiki_options");
        disable_options && getElem("mods_menu_options", {
            className: "",
            onclick: "",
            style: {
                fontWeight: "bold",
                color: "#999"
            }
        });
        getElem("mod_wiki_search").onmouseover = function(event) {
            Mods.Wikimd.mouse.x = event.clientX;
            Mods.Wikimd.mouse.y = event.clientY;
        };
        Mods.Wikimd.populate_item_formulas();
        Mods.Wikimd.populate_pets();
        Mods.Wikimd.populate_family();
    })();
    Mods.timestamp("wikimd");
};

Load.miscmd = function() {
    modOptions.miscmd.time = timestamp();
    penalty_bonus = function() {
        Mods.Miscmd.penalty = getElem("penalty_bonus_skill").value;
        localStorage.penalty_bonus = JSON.stringify(Mods.Miscmd.penalty);
        Mods.Miscmd.oldPenaltyBonus();
    };
    Mods.Miscmd.ideath.sort_values = function() {
        for (var b = {}, values = [], len = 2, value, j = 0; j < players[0].temp.inventory.length; j++) {
            var k = players[0].temp.inventory[j].id, v = item_base[k].params.price;
            855 != k ? (b[k] = v, values.push(parseInt(k))) : players[0].temp.inventory[j].selected && (len = 7);
        }
        players[0].temp.created_at < timestamp() - 72e5 || (len = 40);
        if (players[0].pet.enabled) {
            value = players[0].pet.id;
            value = pets[value].params.item_id;
            for (j = 0; j < values.length; j++) values[j] == value && values.splice(j, 1);
            delete b[value];
        }
        0 < values.length && values.sort(function(i1, i2) {
            return b[i1] > b[i2] ? -1 : b[i1] < b[i2] ? 1 : item_base[i1].name > item_base[i2].name ? -1 : 1;
        });
        values.splice(len, 40);
        values.push(value);
        return values;
    };
    Mods.Miscmd.ideath.safe_items = function() {
        var frag = Mods.Miscmd.ideath.bgColor, element = Mods.Miscmd.ideath.brColor, container = Mods.Miscmd.ideath.sort_values();
        for (a = 0; 40 > a; a++) {
            var elem = getElem("inv_" + a);
            elem.innerHTML = "&nbsp;";
            if ("undefined" != typeof players[0].temp.inventory[a]) {
                var e = players[0].temp.inventory[a], key;
                for (key in container) e.id == container[key] && (elem.innerHTML = "<div class='pointer' title='You keep this item if you die.' style='position: absolute; top: 0%; left: 0%; margin-left: -1px; margin-top: -1px; width: 13%; height: 13%; background-color: " + frag + "; border: 1px solid; border-color: " + element + "; opacity: .8;'>&nbsp;</div>", 
                container.splice(key, 1));
            }
        }
    };
    oldBigMenuShow = BigMenu.show;
    BigMenu.show = function(_relatedTarget) {
        Mods.showInv = 2 === _relatedTarget ? !0 : !1;
        oldBigMenuShow(_relatedTarget);
    };
    Mods.Miscmd.invClick = function() {
        Mods.showInv && (Mods.showBag = !Mods.showBag, Mods.showBag ? getElem("inventory").style.display = "block" : getElem("inventory").style.display = "");
    };
    Mods.Miscmd.toolbar.loadDivs = function() {
        createElem("div", wrapper, {
            id: "toolbar_main_holder",
            style: "position: absolute; display: block; height: 2.8%; right: 0%; top: 0%; width: 70.5%; font-size: 0.7em; color: #FFF; z-index: 999; background-color: rgba(0, 0, 0, 0.4); overflow: hidden;",
            innerHTML: "<span id='toolbar_holder' style='position: relative; display: inline-block; float: right; padding-top: 1px; height: 100%; width: 99%;'></span>"
        });
        var e = "td_time td_stats td_quests td_inventory_old td_location td_dpsinfo".split(" "), property;
        for (property in e) createElem("span", "toolbar_holder", {
            id: e[property],
            className: "toolbar_item"
        });
        createElem("div", wrapper, {
            id: "td_inventory",
            style: "position: absolute; text-shadow: -1px -1px #333; border: 1px solid #000; border-radius: 4px; font-weight: normal; z-index: 999999; opacity: .8; background-color: rgba(20, 20, 20, 0.7); pointer-events: none; text-align: center; color: white; font-family: ariel;"
        });
        createElem("div", wrapper, {
            id: "td_inv_click",
            onclick: Mods.Miscmd.invClick,
            style: "position: absolute; z-index: 999999; opacity: .8; text-align: center; color: white; font-family: ariel;"
        });
        touch_initialized && (getElem("td_inv_click").style.display = "none");
        getElem("td_stats").setAttribute("title", "These are total adjusted values from your stats and gear.\nA = Accuracy, S = Strength, D = Defense, M = Magic");
        getElem("td_inv_click").setAttribute("title", "These numbers are [open inventory spaces]/[open pet inv spaces] (if you have a pet).\n**Click this icon to toggle your inventory open/closed**");
    };
    Mods.Miscmd.toolbar.playerLocation = function() {
        return "<span style='color: #BBB;'>" + map_names[players[0].map] + "</span> (" + players[0].i + ", " + players[0].j + ")";
    };
    Mods.Miscmd.toolbar.dpsinfo = function() {
        var message;
        Mods.Miscmd.dpsmode ? message = "<span onclick='javascript:Mods.Miscmd.switchdpsmode();' class='pointer'><span style='color: #BBB;'>DPS:</span> " + Math.round(100 * Mods.Miscmd.avgdps) / 100 + " (" + Math.round(100 * Mods.Miscmd.maxdps) / 100 + ")</span>" : (message = 1e4 < Mods.Miscmd.avgexp ? Math.round(Mods.Miscmd.avgexp / 10) / 100 + "k" : Math.round(Mods.Miscmd.avgexp), 
        message = "<span onclick='javascript:Mods.Miscmd.switchdpsmode();' onMouseOver='Mods.Miscmd.ShowExpPopup(this);' onMouseOut='Mods.Miscmd.HideExpPopup();' class='pointer'><span style='color: #BBB;'>Exp/h:</span> " + message + "</span>");
        return message;
    };
    Mods.Miscmd.ShowExpPopup = function(elem) {
        if (0 == Mods.Miscmd.dpsmode) {
            (elem = getElem("ww_xp_popup")) || createElem("div", wrapper, {
                id: "ww_xp_popup",
                className: "xptable menu",
                style: "z-index: 101; visibility: hidden; position: absolute; opacity: 1; padding: 0px;"
            });
            getElem("td_dpsinfo");
            elem.style.left = getElem("td_dpsinfo").getBoundingClientRect().left + "px";
            elem.style.top = getElem("td_dpsinfo").getBoundingClientRect().bottom + "px";
            var x = "<table><thead><tr><th>Skill</th><th>Exp/h</th><th>Level in</th></tr></thead><tbody>", map = {}, index;
            for (index in Mods.Miscmd.adps) map[Mods.Miscmd.adps[index].skill] ? (map[Mods.Miscmd.adps[index].skill].xp += Mods.Miscmd.adps[index].xpdelta, 
            map[Mods.Miscmd.adps[index].skill].mintime > Mods.Miscmd.adps[index].time && (map[Mods.Miscmd.adps[index].skill].mintime = Mods.Miscmd.adps[index].time), 
            map[Mods.Miscmd.adps[index].skill].maxtime < Mods.Miscmd.adps[index].time && (map[Mods.Miscmd.adps[index].skill].maxtime = Mods.Miscmd.adps[index].time)) : (map[Mods.Miscmd.adps[index].skill] = {}, 
            map[Mods.Miscmd.adps[index].skill].mintime = map[Mods.Miscmd.adps[index].skill].maxtime = Mods.Miscmd.adps[index].time, 
            map[Mods.Miscmd.adps[index].skill].xp = Mods.Miscmd.adps[index].xpdelta);
            index = !0;
            for (var key in map) {
                var w = 3600 * map[key].xp / ((map[key].maxtime - map[key].mintime) / 1e3);
                if (isFinite(w) && NaN != w) {
                    var v = Level.xp_for_level(skills[0][key].level + 1) - skills[0][key].xp, t = Math.round((skills[0][key].xp - Level.xp_for_level(skills[0][key].level)) / (Level.xp_for_level(skills[0][key].level + 1) - Level.xp_for_level(skills[0][key].level)) * 100), s = Math.floor(v / (w / 3600)), v = parseInt(s / 3600), j = parseInt(s / 60) % 60, s = s % 60, v = (10 > v ? "0" + v : v) + ":" + (10 > j ? "0" + j : j) + ":" + (10 > s ? "0" + s : s), w = 1e4 < w ? Math.round(w / 10) / 100 + "k" : Math.round(w), x = 1 == index ? x + "<tr>" : x + "<tr class='alt'>", x = x + ("<td>" + key + " (" + t + "%)</td><td>" + w + "</td><td>" + v + "</td></tr>");
                    index = 1 == index ? !1 : !0;
                }
            }
            elem.innerHTML = x + "</tbody></table>";
            elem.style.visibility = "";
        }
    };
    Mods.Miscmd.HideExpPopup = function() {
        getElem("ww_xp_popup").style.visibility = "hidden";
    };
    Mods.Miscmd.switchdpsmode = function() {
        Mods.Miscmd.dpsmode ? (Mods.Miscmd.avgexp = 0, Mods.Miscmd.adps = [], Mods.Miscmd.maxtime = 18e4, 
        Mods.Miscmd.dpsmode = !1) : (Mods.Miscmd.maxdps = 0, Mods.Miscmd.avgdps = 0, Mods.Miscmd.adps = [], 
        Mods.Miscmd.maxtime = 6e4, getElem("ww_xp_popup").style.visibility = "hidden", Mods.Miscmd.dpsmode = !0);
        Mods.Miscmd.toolbar.updateToolbar("dpsinfo");
    };
    Mods.Miscmd.toolbar.playerStats = function() {
        for (var r = !1, x = 0; x < players[0].params.magic_slots; x++) if (players[0].params.magics[x]) var s = Magic[players[0].params.magics[x].id].params.penetration, r = r || s, r = Math.min(r, s);
        return "<span style='color: #BBB;'>Stats:</span> " + Math.floor(players[0].temp.total_accuracy) + "A / " + Math.floor(players[0].temp.total_strength) + "S / " + Math.floor(players[0].temp.total_defense) + "D / " + Math.floor(players[0].temp.magic / 1.2 + skills[0].magic.level + (r || 0)) + "M";
    };
    Mods.Miscmd.toolbar.questData = function(status) {
        var node = getElem("quests_form_content").childNodes[0].childNodes[0];
        "undefined" == typeof node && (Quests.show_active(), node = getElem("quests_form_content").childNodes[0].childNodes[0]);
        for (var c in node.childNodes) if ("undefined" != typeof node.childNodes[c].title && /Location/.test(node.childNodes[c].title)) {
            var e = node.childNodes[c];
            if (null == e.onclick) for (var j in quests) -1 != e.innerHTML.search(quests[j].name) && e.setAttribute("onclick", 'Mods.Miscmd.toolbar.questData("' + j + '"); Mods.Miscmd.toolbar.updateToolbar("questData")');
        }
        status = status || Mods.Miscmd.toolbar.activeQuest || !1;
        if (!status || !player_quests[status] || player_quests[status].progress == quests[status].amount) for (j = 0; j < player_quests.length; j++) player_quests[j].progress < quests[j].amount && (status = j);
        if ("undefined" == typeof player_quests[status]) getElem("td_quests").style.display = "none"; else return getElem("td_quests").style.display = "", 
        node = "<span style='color: #BBB;'>Quest:</span> (" + player_quests[status].progress + "/" + quests[status].amount + ") " + npc_base[quests[status].npc_id].name, 
        Mods.Miscmd.toolbar.activeQuest = status, localStorage.activeQuest = JSON.stringify(status), 
        node;
    };
    Mods.Miscmd.toolbar.currentTime = function() {
        var v = new Date(), n = v.getHours(), max = 11 > n ? " AM" : " PM", n = 0 == n ? 12 : 12 < n ? n - 12 : n, v = v.getMinutes(), v = v.toString(), v = 2 != v.length ? "0" + v : v;
        return n + ":" + v + " " + max;
    };
    Mods.Miscmd.toolbar.invSlots = function() {
        getElem("td_inventory_old").style.display = "none";
        var t = 40 - players[0].temp.inventory.length, n = "", r = "";
        players[0].pet.enabled && (n = players[0].pet.chest.length, r = pets[players[0].pet.id].params.inventory_slots, 
        n = r - n);
        return "<span style='color: yellow;'>" + t + "</span>" + (players[0].pet.enabled ? "/<span style='color:yellow;'>" + n + "</span>" : "");
    };
    Mods.Miscmd.toolbar.updateToolbar = function(key) {
        var state = Mods.Miscmd.toolbar, aliasMap_ = Mods.Miscmd.toolbar.ids;
        if ("undefined" != typeof key) getElem(aliasMap_[key]).innerHTML = state[key](); else for (key in aliasMap_) getElem(aliasMap_[key]).innerHTML = state[key]();
    };
    Mods.Miscmd.inventoryEquip = function(n, v, cf) {
        if ("undefined" != typeof v && -1 != item_base[v].name.indexOf("Potion") && "Potion Of Preservation" != item_base[v].name) for (n = 1; 20 > n; n++) Timers.set("new_potion_" + v + "_" + n, function() {
            var k, p, t, n, x, result, _i;
            result = {};
            result[v] = {};
            for (k in item_base[v].params) if (p = /^boost_(.{1,})$/.exec(k)) t = p[1], p = item_base[v].params[p[0]], 
            x = timestamp(), n = skills[0][t].level, n = Math.ceil(n * p), _i = 6e4 * n + x, 
            result[v][t] = {
                percent: p,
                start: x,
                delta: n,
                end: _i
            };
            if (null != getElem("mod_potion_" + v)) for (k = 1; 20 > k; k++) Timers.clear("new_potion_" + v + "_" + k); else Mods.Miscmd.potions[v] = result[v];
        }, 1e3 * n);
        return !1;
    };
    Mods.Miscmd.checkPotions = function() {
        var data, j, k, t, value, _i, _len, _ref;
        data = Mods.Miscmd.potions;
        t = getElem("mod_potion_holder");
        _i = {
            accuracy: "ACC",
            alchemy: "Alch",
            carpentry: "Crpt",
            cooking: "Cook",
            defense: "DEF",
            farming: "Farm",
            fishing: "Fish",
            forging: "Forg",
            health: "Hlth",
            jewelry: "Jewl",
            magic: "Mag",
            mining: "Mine",
            strength: "STR",
            woodcutting: "Wood"
        };
        null !== t && delete wrapper[t];
        null == t && createElem("div", wrapper, {
            id: "mod_potion_holder",
            style: "position: absolute; z-index: 999; background: transparent; left: 11%; top: 15%; min-width: 32px; min-height: 32px;"
        });
        for (j in data) {
            t = getElem("mod_potion_" + j);
            null == t && (t = item_base[j], value = IMAGE_SHEET[t.img.sheet], createElem("div", "mod_potion_holder", {
                id: "mod_potion_" + j,
                title: t.name,
                style: "position: relative; display: block; padding: 2px; float: left;",
                innerHTML: "<div style='background: url(&apos;" + value.url + "&apos;) no-repeat scroll " + -t.img.x * value.tile_width + "px " + -t.img.y * value.tile_height + "px transparent; float: left; width: 32px; height: 32px; margin-left: -16px; left: 50%; position: relative;'>&nbsp;</div><div id='mod_potion_duration_" + j + "' style='float: left; clear: left; font-size: 0.7em; color: #FFF; background: #444; padding: 4px; border: 1px solid #FFF; border-radius: 5px; -moz-border-radius: 5px;'>&nbsp;</div>"
            }));
            t = "";
            _len = !1;
            for (k in data[j]) value = skills[0][k].current - skills[0][k].level, 0 < value ? (t += "<tr><td>" + _i[k] + "</td><td><span style='color: #FF0; text-align: right; padding-left: 4px;'>+" + value + "</span></td></tr>", 
            _len = !0, data[j][k].value != value && (data[j][k].value = value, _ref = !0)) : data[j][k].value = 0;
            _ref ? (t = "<table>" + t + "</table>", getElem("mod_potion_duration_" + j).innerHTML = t) : _len || (getElem("mod_potion_holder").removeChild(getElem("mod_potion_" + j)), 
            delete data[j]);
        }
    };
    Mods.Miscmd.socketOn = {
        actions: "update_quest quests quest_complete my_data skills inventory my_pet_data item_drop skills hit".split(" "),
        fn: function(node, r, e) {
            var route = Mods.Miscmd.toolbar.updateToolbar;
            "update_quest" != node && "quests" != node && "quest_complete" != node || route("questData");
            "my_pet_data" == node && 0 == r.enabled && setCanvasSize();
            if ("my_data" == node || "skills" == node) route("playerStats"), route("playerLocation");
            if ("inventory" == node || "my_pet_data" == node || "item_drop" == node) route("invSlots"), 
            Mods.Miscmd.ideath.safe_items();
            if ("skills" == node && 0 == Mods.Miscmd.dpsmode) {
                var now = timestamp(), time = now;
                if (r.skill) {
                    if (Mods.Miscmd.lastSkill[r.skill] && Mods.Miscmd.lastSkill[r.skill].xp < r.stats.xp) {
                        var data = {};
                        data.skill = r.skill;
                        data.xpdelta = r.stats.xp - Mods.Miscmd.lastSkill[r.skill].xp;
                        data.time = now;
                        Mods.Miscmd.adps.push(data);
                    }
                    Mods.Miscmd.lastSkill[r.skill] = {};
                    Mods.Miscmd.lastSkill[r.skill].level = r.stats.level;
                    Mods.Miscmd.lastSkill[r.skill].xp = r.stats.xp;
                } else for (sk in r) Mods.Miscmd.lastSkill[sk] && Mods.Miscmd.lastSkill[sk].xp < r[sk].xp && (data = {}, 
                data.skill = sk, data.xpdelta = r[sk].xp - Mods.Miscmd.lastSkill[sk].xp, data.time = now, 
                Mods.Miscmd.adps.push(data)), Mods.Miscmd.lastSkill[sk] = {}, Mods.Miscmd.lastSkill[sk].xp = r[sk].xp, 
                Mods.Miscmd.lastSkill[sk].level = r[sk].level;
                if (0 < Mods.Miscmd.adps.length && Mods.Miscmd.adps[0] && Mods.Miscmd.adps[0].time) for (;Mods.Miscmd.adps[0] && Mods.Miscmd.adps[0].time + Mods.Miscmd.maxtime < now; ) Mods.Miscmd.adps.shift();
                for (r = Mods.Miscmd.avgexp = 0; r < Mods.Miscmd.adps.length; r++) Mods.Miscmd.avgexp += Mods.Miscmd.adps[r].xpdelta, 
                Mods.Miscmd.adps[r].time < time && (time = Mods.Miscmd.adps[r].time);
                Mods.Miscmd.avgexp = 3600 * Mods.Miscmd.avgexp / ((now - time) / 1e3);
                isFinite(Mods.Miscmd.avgexp) && NaN != Mods.Miscmd.avgexp || (Mods.Miscmd.avgexp = 0);
                route("dpsinfo");
            }
            if ("hit" == node && Mods.Miscmd.dpsmode && 0 != e.target.id && e.target.id == selected_object.id) {
                now = timestamp();
                data = {};
                data.damage = e.hit;
                data.time = now;
                time = now - 5e3;
                Mods.Miscmd.adps.push(data);
                Mods.Miscmd.avgdps = 0;
                if (0 < Mods.Miscmd.adps.length && Mods.Miscmd.adps[0] && Mods.Miscmd.adps[0].time) {
                    for (;Mods.Miscmd.adps[0].time + Mods.Miscmd.maxtime < now; ) Mods.Miscmd.adps.shift();
                    for (r = 0; r < Mods.Miscmd.adps.length; r++) Mods.Miscmd.avgdps += Mods.Miscmd.adps[r].damage, 
                    Mods.Miscmd.adps[r].time < time && (time = Mods.Miscmd.adps[r].time);
                }
                Mods.Miscmd.avgdps /= (now - time) / 1e3;
                Mods.Miscmd.avgdps > Mods.Miscmd.maxdps && (Mods.Miscmd.maxdps = Mods.Miscmd.avgdps);
                route("dpsinfo");
            }
        }
    };
    Quests.show_active = function() {
        Mods.Miscmd.toolbar.oldQuestsShowActive();
        Mods.Miscmd.toolbar.questData();
    };
    Mods.Miscmd.toolbar.checkTime = function() {
        Mods.Miscmd.toolbar.updateToolbar("currentTime");
        Mods.Miscmd.checkPotions();
        Timers.set("check_time", function() {
            Mods.Miscmd.toolbar.checkTime();
        }, 1e3);
    };
    Mods.Miscmd.inventoryClick = function() {
        Android && 500 > timestamp() - lastTap || (Mods.Miscmd.ideath.safe_items(), Mods.Miscmd.toolbar.updateToolbar("playerStats"), 
        Mods.Miscmd.toolbar.updateToolbar("invSlots"));
    };
    drawMap = function(self, messageType, message) {
        Mods.Miscmd.toolbar.oldDrawMap(self, messageType, message);
        Mods.Miscmd.toolbar.updateToolbar("playerLocation");
    };
    Inventory.add = function(id, html, fn) {
        Mods.Miscmd.toolbar.updateToolbar("invSlots");
        return Mods.Miscmd.toolbar.oldInventoryAdd(id, html, fn);
    };
    Inventory.remove = function(target, name) {
        Mods.Miscmd.toolbar.updateToolbar("invSlots");
        return Mods.Miscmd.toolbar.oldInventoryRemove(target, name);
    };
    Mods.Miscmd.setCanvasSize = function() {
        getElem("toolbar_main_holder").style.fontSize = Mods.fontSize[0];
        var t = wrapper.style.width.replace("px", "") / width, r = wrapper.style.height.replace("px", "") / height;
        getElem("td_inventory", {
            style: {
                right: ((players[0].pet.enabled ? 66 : 34) + (300 == players[0].map || 16 == players[0].map ? 32 : 0)) * t + "px",
                top: 40 * r + "px",
                width: 28 * t + "px",
                height: 10 * r + "px",
                fontSize: Mods.fontSize[0]
            }
        });
        getElem("td_inv_click", {
            style: {
                right: ((players[0].pet.enabled ? 66 : 34) + (300 == players[0].map || 16 == players[0].map ? 32 : 0)) * t + "px",
                top: 22 * r + "px",
                width: 28 * t + "px",
                height: 28 * r + "px"
            }
        });
    };
    Mods.Miscmd.changeVolume = function(volume) {
        localStorage.audioVolume = volume;
        volume = parseInt(volume);
        try {
            for (var x in sound_effects) sound_effects[x].music.setVolume(volume, 0);
            for (var step in map_music) map_music[step].music.setVolume(volume, 0);
        } catch (f) {}
    };
    navigator.userAgent.match(/chrome/i) && (createElem("div", "options_audio", {
        innerHTML: "<br>Volume: <input id='settings_volume_slider' type='range' min='0' max='100' step='5' value='50' onchange='Mods.Miscmd.changeVolume(value)'/>"
    }), getElem("my_text").style.zIndex = "90", document.getElementById("settings_volume_slider").value = localStorage.audioVolume, 
    Mods.Miscmd.changeVolume(localStorage.audioVolume));
    (function() {
        var b = BigMenu.show_skills;
        BigMenu.show_skills = function() {
            b();
            document.getElementById("status_speed").innerHTML = " " + 2 * (players[0].params.speed - 150);
        };
        var t = document.createElement("span");
        addClass(t, "skill");
        t.innerHTML = "Speed";
        var el = document.createElement("span");
        addClass(el, "level");
        el.id = "status_speed";
        el.innerHTML = 0;
        t.appendChild(el);
        document.getElementById("skills_menu").insertBefore(t, document.getElementById("skill_name").parentNode);
    })();
    (function() {
        getElem("penalty_bonus_skill").value = Mods.Miscmd.penalty;
        for (var failed = 0; 40 > failed; failed++) getElem("inv_" + failed).style.position = "relative";
        getElem("chest_item", {
            style: {
                overflow: "hidden",
                maxWidth: "185px",
                whiteSpace: "nowrap"
            }
        });
        getElem("inv_name", {
            style: {
                overflow: "hidden",
                maxWidth: "185px",
                whiteSpace: "nowrap",
                cssFloat: "left"
            }
        });
        Mods.Miscmd.toolbar.loadDivs();
        Mods.Miscmd.toolbar.updateToolbar();
        Mods.Miscmd.toolbar.checkTime();
        Mods.Miscmd.ideath.safe_items();
        setCanvasSize();
    })();
    Mods.timestamp("miscmd");
};

Load.chatmd = function() {
    modOptions.chatmd.time = timestamp();
    Mods.Chatmd.blockChat = function(body, c, $cookies, tipDetect, loading) {
        $cookies = {
            "#ping;": !0,
            "@mods ": !1
        };
        loading = !1;
        if ("whisper" == tipDetect) for (var key in $cookies) {
            0 == body.indexOf(key) && (c == players[0].name && $cookies[key] || !$cookies[key]) && (loading = !0);
            if (loading && "@mods " == key && c != players[0].name) return body = body.replace(key, ""), 
            key = Player.is_mod(c) ? COLOR.GREEN : Player.is_admin(c) ? COLOR.ORANGE : "#EAE330", 
            addChatText(body, c, key, "chat", Mods.Chatmd.ModCh.channel), !0;
            tipDetect = timestamp() - (Mods.Chatmd.delay || 0);
            if (loading) return 1e3 < tipDetect && (Mods.Chatmd.delay = timestamp(), Mods.Chatmd.message(body)), 
            !0;
        }
        return !1;
    };
    Mods.Chatmd.message = function(value) {
        "#ping;" == value && (value = timestamp() - Mods.Chatmd.ping, addChatText("Your ping is: " + value + "ms", void 0, COLOR.TEAL));
    };
    addChatText = function(data, x, y, type, name, cols, rows) {
        var f, self;
        "object" == typeof data && (x = data.user || data.name, y = data.color, type = data.type, 
        name = data.lang, cols = data.to, rows = data.server, f = data.id, self = JSON.clone(data), 
        data = data.text);
        if (!Mods.Chatmd.blockChat(data, x, y, type, name, cols)) {
            for (var c = [ "You are under attack!", "Cannot do that yet.", "Cannot do that yet", "Cannot do that yet.!", "I think that I'm missing something.", "You feel a bit better.", "Your inventory is full!", "Your inventory is full.", "You feel more experienced.", "I need a seed to do that.", "I need a rake to do that.", selected_object && selected_object.activities && selected_object.activities[0] == ACTIVITIES.INSPECT && (selected_object.params.desc || "It's a " + selected_object.name), "Not enough free space in magic pouch!", players[0].params.magic_slots && "This pouch has a limit " + thousandSeperate(1e3 * players[0].params.magic_slots) + " of each spell!", "You need a magic pouch!", "Your chest is full!" ], n = 0; n < c.length; n++) if (data === c[n]) {
                type = "spam";
                break;
            }
            if (type && "spam" == type) {
                if (1e3 > timestamp() - last_cannot_message) return;
                last_cannot_message = timestamp();
            }
            c = !0;
            n = new Date();
            if (-1 < loadedMods.indexOf("Tabs")) {
                if (-1 < Contacts.ignores.indexOf(x)) {
                    "undefined" != typeof cols && 1e4 < timestamp() - (last_ignore_message || 0) && (last_ignore_message = timestamp(), 
                    Socket.send("message", {
                        data: '/w "' + x + '" [Ignored] This player does not receive your messages.',
                        lang: getElem("current_channel").value,
                        silent: !0
                    }));
                    return;
                }
                for (var j in Mods.Tabs.wwCurrentTabs) {
                    var colliding = !0;
                    void 0 != name && (Contacts.channels[name] || (colliding = !1));
                    if (colliding) for (var channel in Mods.Tabs.wwCurrentTabs[j].channels) if (channel == name && 0 == Mods.Tabs.wwCurrentTabs[j].channels[channel]) {
                        colliding = !1;
                        Mods.Tabs.wwCurrentTabs[j].id == Mods.Tabs.wwactiveTab && (c = !1);
                        break;
                    }
                    colliding && (1 == Mods.Tabs.wwCurrentTabs[j].filter_skillattempts && "attempt" == type ? colliding = !1 : 1 == Mods.Tabs.wwCurrentTabs[j].filter_skillfails && "fails" == type ? colliding = !1 : 1 == Mods.Tabs.wwCurrentTabs[j].filter_playerchat && "chat" == type ? colliding = !1 : 1 == Mods.Tabs.wwCurrentTabs[j].filter_whispering && "whisper" == type ? colliding = !1 : 1 == Mods.Tabs.wwCurrentTabs[j].filter_joinleave && "join_leave" == type ? colliding = !1 : 1 == Mods.Tabs.wwCurrentTabs[j].filter_loot && "loot" == type ? colliding = !1 : 1 == Mods.Tabs.wwCurrentTabs[j].filter_magic && "magic" == type ? colliding = !1 : 1 == Mods.Tabs.wwCurrentTabs[j].filter_spam && "spam" == type && (colliding = !1), 
                    1 == Mods.Tabs.wwCurrentTabs[j].filter_chatmoderator && y == COLOR.GREEN && (y = COLOR.WHITE), 
                    y == COLOR.WHITE && 0 == Mods.Tabs.wwCurrentTabs[j].filter_coloredchannels && 0 == Mods.Tabs.wwCurrentTabs[j].filter_coloredonly && (y = Mods.Chatmd.colorChat(name)));
                    !colliding || (void 0 != x && null != x || void 0 != name || void 0 != type && "chat" != type) && "spam" != type && "exists" != type && "cannot" != type && "duel" != type || Mods.Tabs.wwCurrentTabs[j].id != Mods.Tabs.wwactiveTab && (colliding = !1);
                    colliding && (Mods.Tabs.wwTabContent[Mods.Tabs.findWithAttr(Mods.Tabs.wwTabContent, "id", Mods.Tabs.wwCurrentTabs[j].id)].history.push({
                        text: data,
                        user: x,
                        color: y,
                        lang: name,
                        type: type,
                        to: cols,
                        server: rows,
                        id: f,
                        chattimestamp: (10 > n.getHours() ? "0" : "") + n.getHours() + ":" + (10 > n.getMinutes() ? "0" : "") + n.getMinutes() + ":" + (10 > n.getSeconds() ? "0" : "") + n.getSeconds()
                    }), Mods.Tabs.wwTabContent[j].history.length > Chat.max_chat_history && Mods.Tabs.wwTabContent[j].history.splice(0, 1), 
                    Mods.Tabs.wwCurrentTabs[j].id != Mods.Tabs.wwactiveTab && Mods.Tabs.Warning(Mods.Tabs.wwCurrentTabs[j].id));
                }
            }
            0 != c && (-1 < loadedMods.indexOf("Expmonitor") && y === COLOR.TEAL && "whisper" != type && (f = data.match(/Time left: (\d+\.\d+)\s*minute/)) && 0 < f.length && (f = Math.round(60 * f[1]), 
            0 < f && (data = "Time left: " + String(f).toHHMMSS())), f = y == COLOR.GREEN || y == COLOR.PREMIUM ? !0 : !1, 
            j = 1 == chat_filters.modcolor ? !0 : !1, channel = getElem("filter_channel_only").checked ? !1 : !0, 
            !chat_filters.color && y != COLOR.ORANGE && (channel && j || channel && !f) && (y = Mods.Chatmd.colorChat(name) || y || COLOR.WHITE), 
            !channel && j && f && (y = COLOR.WHITE), "object" == typeof self ? (self.text = data, 
            self.user = x, self.color = y, self.lang = name, self.type = type, self.to = cols, 
            self.server = rows, Mods.Chatmd.addChatText(self, x, y, type, name, cols, rows)) : Mods.Chatmd.addChatText(data, x, y, type, name, cols, rows));
        }
    };
    Chat.add_line = function(key) {
        if ("object" == typeof chat_history[key]) {
            var element = document.createElement("div"), val = COLOR.WHITE, data = "";
            element.style.display = "block";
            element.className = "chat_text";
            chat_history[key].color && (val = chat_history[key].color);
            element.style.color = val;
            var name = COLOR.WHITE, options = chat_filters.color ? !1 : !0;
            "undefined" != typeof chat_history[key].lang && (options && (name = Mods.Chatmd.colorChat(chat_history[key].lang)) || (name = COLOR.WHITE)) && (data += "<span style='color: " + name + ";'>[" + chat_history[key].lang + "]</span>");
            1 != !chat_filters.chattimestamp || !chat_history[key].user && 1 != Mods.Chatmd.enableallchatts || (chat_history[key].chattimestamp ? data = "(" + chat_history[key].chattimestamp + ") " + data : (val = new Date(), 
            data = "(" + (10 > val.getHours() ? "0" : "") + val.getHours() + ":" + (10 > val.getMinutes() ? "0" : "") + val.getMinutes() + ":" + (10 > val.getSeconds() ? "0" : "") + val.getSeconds() + ") " + data));
            chat_history[key].id && (element.id = "chat_" + chat_history[key].id);
            if (chat_history[key].user && "join_leave" != chat_history[key].type) {
                if (!("whisper" != chat_history[key].type && void 0 != chat_history[key].lang || chat_history[key].user == players[0].name && chat_history[key].to == players[0].name)) {
                    var val = Mods.Chatmd.whispNames, name = chat_history[key].user != players[0].name ? chat_history[key].user : chat_history[key].to, current = val.indexOf(name);
                    -1 < current && val.splice(current, 1);
                    val.unshift(name);
                }
                var prop = chat_history[key].user, val = !1, name = getElem("filter_highlight_friends").checked ? "<span style='color: #FFFF00;'>" : "", current = chat_history[key].to && chat_history[key].to != players[0].name ? "to " : "", len = chat_history[key].to && chat_history[key].to != players[0].name ? chat_history[key].to : chat_history[key].user, match = len && len.sanitizeChat(), r = !chat_filters.friends || !1, t;
                for (t in Contacts.friends) Contacts.friends[t].name == match && (val = !0);
                data += (val && r && current + name + "&lt;</span>" || current + "&lt;") + match + (val && r && name + "&gt;</span> " || "&gt; ");
                val = function(f) {
                    return function(c) {
                        Mods.Chatmd.ModCh.nameClick(f);
                    };
                }(len);
                element.onclick = val;
                element.oncontextmenu = function(event) {
                    Mods.Chatmd.chatContext(event, len);
                };
                Chat.set_visible();
            }
            val = chat_history[key].text.sanitizeChat().replace(/%26/g, "&amp;");
            name = /( has joined the game.| has left the game.| has just completed the tutorial!)/.exec(val);
            if ("join_leave" == chat_history[key].type || name && void 0 == chat_history[key].lang && "whisper" != chat_history[key].type && void 0 == chat_history[key].user) {
                prop = chat_history[key].user || val.replace(name[0], "");
                prop = prop.trim();
                current = name[0] || " " + chat_history[key].text;
                val = !1;
                name = -1 == Contacts.ignores.indexOf(prop) ? !1 : !0;
                for (t in Contacts.friends) Contacts.friends[t].name == prop && (val = !0);
                val = val && !chat_filters.friends ? "<span style='color: #FFFF00'>" + prop + "</span>" + current : prop + current;
                if (name) return;
                element.onclick = new Function("Mods.Chatmd.ModCh.nameClick('" + prop.replace(/'/g, "\\'") + "')");
                element.oncontextmenu = function(e) {
                    Mods.Chatmd.chatContext(e, prop);
                };
            }
            if ("$$" == chat_history[key].lang && options) {
                t = Mods.marketReplace;
                var options = {}, k;
                for (k in t) "" !== t[k] && (options[t[k]] = k);
                current = /(\d[km]? )([^|]{1,})( for )/g;
                match = current.exec(val);
                for (t = 0; t < val.length && null !== match; t++) {
                    name = match[2];
                    for (k in options) name = name.replace(k, options[k]);
                    var r = !1, e;
                    for (e in item_base) if (item_base[e].name.replace(/ ?(permission|scroll|pet)\b ?/gi, "").toLowerCase() === name.toLowerCase()) {
                        r = e;
                        break;
                    }
                    var code = /^\[BUY\]/.test(val) ? 1 : 0, name = /^\[BUY\]/.test(val) ? "#62E7B7" : "#E7A762";
                    match[2] = match[2].replace(/\[(Ancient|Legendary|Rare|Common)\]/g, function(match, body) {
                        return "[" + body.slice(0, 1) + "]";
                    });
                    val = val.replace(match[0], match[1] + '<span class="pointer" item_id="' + r + '" onclick="Mods.Chatmd.marketSearch(' + code + ", false, " + r + '); Mods.Chatmd.block_hidden=true;" style="color: ' + name + ';">' + match[2] + "</span>" + match[3]);
                    match = current.exec(val);
                }
                val = val.replace(/\[SELL\]/, "<span style='color: #E7A762;'>[SELL]</span>");
                val = val.replace(/\[BUY\]/, "<span style='color: #62E7B7;'>[BUY]</span>");
                /\[SELL\]/.test(val) && (val = val.replace(/\|/g, "<span style='color: #E7A762;'>|</span>"));
                /\[BUY\]/.test(val) && (val = val.replace(/\|/g, "<span style='color: #62E7B7;'>|</span>"));
            }
            "EN" == chat_history[key].lang && (val = val.filterChat("EN"));
            element.innerHTML = 1 == chat_filters.urlfilter ? data + Mods.Chatmd.urlify(val) : data + val;
            if (/Currently online\(/.test(val) && !chat_history[key].user) {
                data = val.split("):")[0];
                key = val.split("):")[1].split(",").sort();
                element.innerHTML = data + "):";
                for (var count in key) data = key[count].trim().sanitize(), k = document.createElement("span"), 
                k.innerHTML = " " + data, Player.is_admin(data) ? k.style.color = COLOR.ORANGE : Player.is_mod(data) ? k.style.color = COLOR.GREEN : Mods.findWithAttr(Contacts.friends, "name", data) && (k.style.color = "yellow"), 
                k.onclick = new Function("Mods.Chatmd.ModCh.nameClick('" + data.replace(/'/g, "\\'") + "');"), 
                k.oncontextmenu = function(e) {
                    Mods.Chatmd.chatContext(e, this.innerHTML.trim());
                }, element.appendChild(k), count < key.length - 1 && element.insertAdjacentHTML("beforeend", ",");
            }
            addClass(element, "scrolling_allowed");
            getElem("chat").appendChild(element);
            element = getElem("chat").scrollHeight - getElem("chat").offsetHeight - getElem("chat").scrollTop;
            16 < element && 60 > element && (getElem("chat").scrollTop = getElem("chat").scrollHeight);
        }
    };
    Mods.Chatmd.set_hidden = function() {
        return 1 == Mods.Chatmd.block_hidden ? Mods.Chatmd.block_hidden = !1 : !0;
    };
    Mods.Chatmd.marketSearch = function(name, value, newValue) {
        if (selected && (!selected || "Chest" == selected.name) && "undefined" != typeof name && "undefined" != typeof newValue && (Market.open(selected), 
        1 == name || 0 == name)) {
            getElem("market_search_type").value = name;
            if (!1 !== value && -1 < value && 11 > value) getElem("market_search_category").value = value; else if (void 0 != item_base[newValue]) getElem("market_search_category").value = parseInt(item_base[newValue].b_t); else return;
            if (void 0 != item_base[newValue]) getElem("market_search_item").value = newValue; else if (8 < value && "string" == typeof newValue) getElem("market_search_name").value = newValue; else return;
            Market.client_search();
        }
    };
    Mods.Chatmd.ModCh.nameClick = function(v) {
        if (GAME_STATE == GAME_STATES.CHAT) {
            var temp = getElem("mod_text"), c = getElem("my_text");
            if (getElem("current_channel").value == Mods.Chatmd.ModCh.channel) {
                var e = Mods.Chatmd.ModCh.targets();
                if (e) {
                    var data = e.targets, e = e.message;
                    -1 == data.indexOf(v) ? data.push(v) : data.splice(data.indexOf(v), 1);
                    v = JSON.stringify(data);
                    v = v.replace(/"/g, "");
                    temp.value = "@" + v + " " + e;
                    c.value = "/@mods @" + v + " " + e;
                } else temp.value = '/w "' + v + '" ', c.value = '/w "' + v + '" ';
            } else c.value = '/w "' + v + '" ';
            Chat.update_string();
        }
    };
    Mods.Chatmd.ModCh.targets = function() {
        if (GAME_STATE == GAME_STATES.CHAT && getElem("current_channel").value == Mods.Chatmd.ModCh.channel) {
            var name = getElem("mod_text").value;
            if (/^@/.test(name)) {
                var data = /^@ ?"([^"]{0,})"/, e = /^@ ?([^ ]{1,}) /, data = /^@ ?([\[\(][^\]\)]{0,}[\]\)])/.exec(name) || data.exec(name) || e.exec(name);
                if (!data) return {
                    targets: [],
                    message: ""
                };
                name = name.slice(data[0].length).trim().replace(/""/, '""');
                data = data[1];
                "" == data && (data = "[]");
                data = data.replace(/",? ?"/g, '","').replace(/^\(/, "[").replace(/\)$/, "]").replace(/^\[/, '["').replace(/, ?/g, '","').replace(/]$/, '"]').replace(/""/g, '"');
                '["]' == data && (data = "[]");
                !/^\[.*\]$/.test(data) && (data = '["' + data + '"]');
                data = JSON.parse(data);
                return data = {
                    message: name,
                    targets: data
                };
            }
        }
        return !1;
    };
    Mods.Chatmd.chatContext = function(e, url) {
        e.preventDefault();
        e.clientX = e.clientX || e.pageX || e.touches[0].pageX;
        e.clientY = e.clientY || e.pageY || e.touches[0].pageY;
        var send = function(key) {
            Socket.send("message", {
                data: key,
                lang: getElem("current_channel").value
            });
        }, stack = [];
        mod_initialized && (stack = [ {
            name: url,
            method: "Mute",
            func: function() {
                send("/mute " + url);
            }
        }, {
            name: url,
            method: "Unmute",
            func: function() {
                send("/unmute " + url);
            }
        }, {
            name: url,
            method: "Kick",
            func: function() {
                send("/kick " + url);
            }
        }, {
            name: url,
            method: "Ban",
            func: function() {
                Popup.prompt("Ban. Are you sure?", function() {
                    send("/ban " + url);
                });
            }
        } ], e.srcElement.id && stack.push({
            name: url,
            method: "Remove Message",
            func: function() {
                Socket.send("remove_line", {
                    line: e.srcElement.id.replace(/^\D+/g, "")
                });
                Popup.prompt("Also mute " + url + "?", function() {
                    send("/mute " + url);
                }, null_function);
            }
        }));
        stack = stack.concat([ {
            name: url,
            method: "Add Friend",
            func: function() {
                Mods.findWithAttr(Contacts.friends, "name", url) ? addChatText(url + " is already in your friends list.", void 0, COLOR.TEAL) : (Socket.send("contacts", {
                    sub: "add_friend",
                    name: url
                }), Contacts.list_add("friends", url), addChatText(url + " was added as friend.", void 0, COLOR.TEAL));
            }
        }, {
            name: url,
            method: "Remove Friend",
            func: function() {
                Mods.findWithAttr(Contacts.friends, "name", url) ? (Socket.send("contacts", {
                    sub: "remove_friend",
                    name: url
                }), Contacts.list_remove("friends", url), addChatText(url + " was removed from your friends list.", void 0, COLOR.TEAL)) : addChatText(url + " is not in your friends list!", void 0, COLOR.TEAL);
            }
        }, {
            name: url,
            method: "Ignore",
            func: function() {
                -1 == Contacts.ignores.indexOf(url) && (Contacts.ignore_player(url), Player.is_admin(url) || Player.is_mod(url) || addChatText(url + " was added to your ignore list!", void 0, COLOR.TEAL));
            }
        }, {
            name: url,
            method: "Whisper",
            func: function() {
                hasClass(getElem("my_text"), "hidden") && ChatSystem.toggle();
                getElem("my_text").value = '/w "' + url + '" ';
            }
        }, {
            name: "",
            method: "Cancel",
            func: function() {
                addClass(getElem("action_menu"), "hidden");
            }
        } ]);
        ActionMenu.custom_create(e, stack);
    };
    Mods.Chatmd.urlify = function(options) {
        return options.replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi, '<a href="$1" target="_blank" onclick="event.stopPropagation();this.blur();" style="color:yellow;">$1</a>');
    };
    Mods.Chatmd.colorChat = function(value) {
        var r = !1, t = Mods.Chatmd.colors, c = Mods.Chatmd.default_channels, p = !1;
        if ("boolean" == typeof value && !value) r = !0; else if ("string" != typeof value || !c[value]) if ("string" == typeof value) {
            for (var attribute in channel_names) if (channel_names[attribute] == value) {
                p = !0;
                break;
            }
            if (!p) return !1;
        } else return !1;
        r && (value = getElem("current_channel").value);
        value = t[value] || c[value] && t["default"] || t.none;
        chat_filters.color && (value = COLOR.WHITE);
        return r ? (r = /^\//.test(getElem("my_text").value), t = /^\//.test(getElem("mod_text").value), 
        c = /^\/\@mods/.test(getElem("my_text").value), getElem("current_channel").style.color = value, 
        r && !c || (getElem("my_text").style.color = value), t || r && !c || (getElem("mod_text").style.color = value), 
        !1) : value;
    };
    getElem("current_channel").onchange = function() {
        Mods.Chatmd.chatCommand(!1);
    };
    Mods.Chatmd.chatCommand = function(e) {
        if (GAME_STATE === GAME_STATES.CHAT) {
            var text = getElem("my_text").value, m = getElem("mod_text").value, obj = getElem("my_text"), el = getElem("mod_text");
            !/^\/id /.test(text) && /&/g.test(text) && (obj.value = text.replace(/&/g, "%26"));
            !/^\/id /.test(m) && /&/g.test(m) && (el.value = m.replace(/&/g, "%26"));
            if (/^\/w /.test(text) && Mods.Chatmd.cycleWhisper && (33 == e || 34 == e || 0 == e)) {
                var m = /(^\/w (\"([^\"]{1,})\"|([^ ]{1,})))/.exec(text), args = Mods.Chatmd.whispNames;
                if (m) {
                    var value = "", j = args.indexOf(m[3]);
                    33 == e && (value = -1 == j || j == args.length - 1 ? args[0] : args[j + 1]);
                    34 == e && (value = -1 == j || 0 == j ? args[args.length - 1] : args[j - 1]);
                    text = text.replace(m[2], '"' + value + '"');
                    obj.value = text;
                    el.value = text;
                }
            }
            e = getElem("current_channel");
            m = /^\//.test(text);
            args = /^\/\@mods/.test(text);
            value = /^\//.test(el.value);
            chat_filters.color && (obj.style.color = COLOR.WHITE, e.style.color = COLOR.WHITE, 
            el.style.color = COLOR.WHITE);
            Mods.Chatmd.colorChat(!1);
            e.value == Mods.Chatmd.ModCh.channel ? Mods.Chatmd.ModCh.chatCommand(m, args, value, text, obj, el) : e.value == Mods.Chatmd.ModCh.channel || !args && hasClass(el, "hidden") ? m ? (!chat_filters.color && (obj.style.color = COLOR.TEAL) && (el.style.color = COLOR.TEAL), 
            /^\/r/.test(text) && (Mods.Chatmd.chat.whisp(text), Chat.update_string())) : el.value = obj.value : (obj.value = obj.value.replace("/@mods ", ""), 
            removeClass(obj, "hidden"), obj.focus(), el.value = "", addClass(el, "hidden"));
        }
        Chat.update_string();
    };
    Mods.Chatmd.ModCh.chatCommand = function(value, dd, e, data, obj, el) {
        Player.is_mod(players[0].name) || Player.is_admin(players[0].name) || !(0 == Mods.Chatmd.ModCh.delay || Mods.Chatmd.ModCh.delay + 6e5 < timestamp()) || (Mods.Chatmd.ModCh.delay = timestamp(), 
        addChatText("Use this channel to report issues of in-game abuse or harassment to the Chat Moderators.", void 0, COLOR.ORANGE));
        if (/^@ ?< ?$/g.test(el.value)) {
            for (value = chat_history.length - 1; 0 <= value; value--) if ("{M}" == chat_history[value].lang && /^@\(/.test(chat_history[value].text)) {
                value = /(^@\([^\)]{1,}\)) /g.exec(chat_history[value].text)[1];
                el.value = value;
                obj.value = "/@mods " + value;
                Chat.update_string();
                return;
            }
            el.value = el.value.replace(/^@ ?\< ?/, "@() ");
            obj.value = "/@mods " + el.value;
        } else if (dd || e) e ? (/^\/r/.test(el.value) && Mods.Chatmd.chat.whisp(el.value), 
        obj.value = el.value, !chat_filters.color && (el.style.color = COLOR.TEAL) && (obj.style.color = COLOR.TEAL)) : obj.value = "/@mods " + el.value; else {
            if ("/" == obj.value || "/" == el.value) obj.value = "";
            el.value = 0 < el.value.length ? el.value : obj.value;
            !value && (obj.value = "/@mods " + obj.value);
            addClass(obj, "hidden");
            obj.blur();
            removeClass(el, "hidden");
            el.focus();
        }
    };
    Mods.Chatmd.ModCh.createDiv = function() {
        null == getElem("mod_text") && createElem("input", wrapper, {
            id: "mod_text",
            type: "text",
            className: "hidden",
            style: "font-family: Brawler, cursive; font-size: 13px; position: absolute; left: 55px; bottom: 23px; z-index: 90; opacity: 1; color: " + COLOR.GREEN + "; text-shadow: 1px 1px 1px #3A3A3A;\r\n                background: #9C9C9C; border: 0px; padding: 0px; margin: 0px;",
            setAttributes: {
                autocomplete: "off",
                size: "1",
                onkeypress: "javascript: Chat.update_string();",
                maxlength: "154"
            }
        });
    };
    Mods.Chatmd.ModCh.listener = function(event) {
        GAME_STATE == GAME_STATES.CHAT ? (hasClass(getElem("mod_text"), "hidden") || 8 != event && 46 != event || !/^\//.test(getElem("my_text").value) || "" != getElem("mod_text").value || (getElem("my_text").value = ""), 
        Mods.Chatmd.chatCommand(event)) : (addClass(getElem("mod_text"), "hidden"), getElem("mod_text").value = "", 
        getElem("mod_text").blur());
    };
    Mods.Chatmd.setCanvasSize = function() {
        var scale = Math.min(16, Math.round(16 * current_ratio_y));
        getElem("mod_text").style.bottom = 25 * current_ratio_y + "px";
        getElem("mod_text").style.fontSize = scale + "px";
    };
    Mods.Chatmd.ModCh.sendWhisper = function(value) {
        var e = Mods.Chatmd.ModCh.targets();
        value = getElem("mod_text").value;
        var type = "", indent = "";
        e && (value = e.message, type = e.targets, 0 != type.length && (indent = "@(" + type.toString() + ") "));
        if ("" != value && " " != value) {
            var prop, r, b = {
                kemikaalikeijo: 1,
                reside: 1
            }, e = [], result = /^\s*~\s*/.test(value);
            result && (value = value.replace(/^\s*~\s*/, ""));
            for (prop in online_players) if (r = !1, b[prop] && -1 == type.indexOf(prop) || !Player.is_mod(prop) && !Player.is_admin(prop) && -1 == type.indexOf(prop) || (r = !0), 
            r) {
                e.push(prop);
                var ns = Player.is_mod(prop) || Player.is_admin(prop) ? indent : "";
                r && 0 < value.length && Socket.send("message", {
                    data: '/w "' + prop + '" @mods ' + ns + value
                });
            }
            type = Player.is_mod(players[0].name) ? COLOR.GREEN : Player.is_admin(players[0].name) ? COLOR.ORANGE : "#EAE330";
            0 < value.length && addChatText(indent + value, players[0].name, type, "chat", Mods.Chatmd.ModCh.channel);
            result && addChatText("~ Message sent to: " + e.toString().replace(/,/g, ", "), null, COLOR.ORANGE);
        }
    };
    Chat.update_string = function() {
        getElem("my_text").size = Math.max(getElem("my_text").value.length, 1);
        getElem("mod_text").size = Math.max(getElem("mod_text").value.length, 1);
    };
    window_onclick = function(e) {
        e && e.target && "current_channel" == e.target.id || (captcha && getElem("recaptcha_response_field") ? getElem("recaptcha_response_field").focus() : GAME_STATE == GAME_STATES.CHAT && (hasClass(getElem("mod_text"), "hidden") ? getElem("my_text").focus() : getElem("mod_text").focus()));
    };
    window.onclick = window_onclick;
    Mods.Chatmd.filter_checks = function() {
        var me = getElem("filter_channel_only").checked, actual = getElem("filter_highlight_friends").checked;
        localStorage.colorChannel = JSON.stringify(me);
        localStorage.highlightFriends = JSON.stringify(actual);
        -1 < loadedMods.indexOf("Tabs") && (me = Mods.Tabs.wwCurrentTabs[Mods.Tabs.findWithAttr(Mods.Tabs.wwCurrentTabs, "id", Mods.Tabs.wwactiveTab)], 
        me.filter_coloredonly = getElem("filter_channel_only").checked, me.filter_highlightfriends = getElem("filter_highlight_friends").checked, 
        localStorage.CurrentTabs = JSON.stringify(Mods.Tabs.wwCurrentTabs));
    };
    ChatSystem.filters_init = function() {
        var b = "attempt fails chat whisper join_leave loot magic spam color modcolor chattimestamp urlfilter".split(" "), c;
        for (c in b) {
            var element = getElem("filter_" + b[c]);
            removeClass(element, "green");
            removeClass(element, "red");
            chat_filters[b[c]] ? addClass(element, "red") : addClass(element, "green");
        }
        -1 < loadedMods.indexOf("Tabs") && Mods.Tabs.SaveCurrent();
    };
    Mods.Chatmd.socketOn = {
        actions: [ "message", "login" ],
        fn: function(m, e) {
            e && "whisper" == e.type && e.name != players[0].name && Mods.Chatmd.afkReply(e.name, e.message);
            "login" == m && e && "ok" == e.status && Contacts.add_channel("{M}");
        }
    };
    Mods.Chatmd.eventListener = {
        keys: {
            keydown: [ KEY_ACTION.SEND_CHAT ],
            keyup: [ !0 ]
        },
        fn: function(node, s, e) {
            "keydown" != node || e != KEY_ACTION.SEND_CHAT || "" == getElem("my_text").value || Mods.Chatmd.blockCommand || (!isTouchDevice() && (Mods.Chatmd.blockCommand = !0), 
            Timers.set("unblockCommand", function() {
                Mods.Chatmd.blockCommand = !1;
            }, 1e3), Mods.Chatmd.chatCommands(getElem("my_text").value));
            "keyup" == node && (Mods.Chatmd.ModCh.listener(s), e != KEY_ACTION.SEND_CHAT || isTouchDevice() || (Mods.Chatmd.blockCommand = !1));
        }
    };
    Mods.Chatmd.newDrawObject = function(store, data) {
        var params;
        if (data.b_t == BASE_TYPE.PLAYER) {
            params = npc_base[102];
            var length = Math.random();
            Mods.Chatmd.mooDelay[data.name] = Mods.Chatmd.mooDelay[data.name] || 1;
            1e3 < timestamp() - Mods.Chatmd.mooDelay[data.name] && (Mods.Chatmd.mooDelay[data.name] = timestamp(), 
            .7 < length && Mods.Chatmd.m00(data));
        } else params = data;
        Mods.Chatmd.oldDrawObject(store, params);
    };
    updateBase();
    Mods.Chatmd.m00 = function(origin) {
        var values = "m00 m00! mU m00 m00 m00 m00 m00! moo MOO moo mOO M00".split(" "), j = Math.max(1, Math.ceil(Math.random() * values.length)) - 1, n = getElem("enemy_hit").cloneNode(!0), pos = translateTileToCoordinates(origin.i, origin.j);
        n.id = "moo_" + origin.id + new Date().getTime();
        removeClass(n, "hidden");
        n.innerHTML = "<div id='enemy_burst' style='display: block; position: relative; background: #000000; text-align: center; width: 35px; height: 35px; -webkit-transform: rotate(20deg); -moz-transform: rotate(20deg); -ms-transform: rotate(20deg); -o-transform: rotate(20deg);'></div><div id='enemy_damage' class='damage' style='font-size: 16px; top: 4px;'></div>";
        n.childNodes[0].innerHTML = "<div style='position: absolute; background: #000000; top: 0; left: 0; height: 35px; width: 35px; -webkit-transform: rotate(135deg); -moz-transform: rotate(135deg); -ms-transform: rotate(135deg); -o-transform: rotate(135deg)'></div>";
        n.childNodes[1].innerHTML = values[j];
        n.style.background = "#000000";
        n.style.width = "35px";
        n.style.height = "35px";
        wrapper.appendChild(n);
        n.style.left = (pos.x + 16 + players[0].mx) * current_ratio_x + "px";
        n.style.top = (pos.y - 40 + players[0].my - 20) * current_ratio_y + "px";
        addClass(n, "opacity_100");
        setTimeout(function() {
            decreaseOpacity(n, 150, 10);
        }, 150);
    };
    drawObject = function(who, text) {
        Mods.Chatmd.oldDrawObject(who, text);
    };
    Draw.clear(ctx.players_show);
    updateBase();
    Mods.Chatmd.afkReply = function(key, value) {
        var transaction = Mods.Chatmd.afkHolder = Mods.Chatmd.afkHolder || {}, args = Mods.Chatmd.afkMessage;
        "" != args && key != players[0].name && (void 0 == transaction[key] || 3e5 < timestamp() - transaction[key]) && !/^@mods ?/.test(value) && (transaction[key] = timestamp(), 
        Socket.send("message", {
            data: '/w "' + key + '" ' + args
        }));
    };
    Mods.Chatmd.wiki = function(p, args) {
        if ("object" === typeof args && "object" === typeof p && "wiki" === args[0]) {
            var elements = {
                item: "item",
                mob: "monster",
                npc: "vendor",
                craft: "craft",
                pet: "pet",
                spell: "spell",
                enchant: "enchant"
            }, f = function(x, y, to) {
                y = "string" == typeof y ? "_" + y : "";
                return getElem("mods_wiki_" + x + y + ("string" == typeof y && "string" == typeof to ? "_" + to : ""));
            }, spy = Mods.Wikimd.loadWikiType;
            args[1] && (f("type").value = elements[args[1]] || args[1], spy(0, "type"), args[2] && p[args[1]] && void 0 != p[args[1]][args[2]] && (f("type", elements[args[1]] || args[1]).value = args[2], 
            spy(1, args[1]), args.text && "text" === p[args[1]][args[2]] && (f("name").value = "string" === typeof args.text ? args.text : null), 
            args.value && "value" === p[args[1]][args[2]] && (f("type", elements[args[1]] || args[1], args[2]).value = "string" === typeof args.value ? args.value : -1, 
            spy(2, args[2])), !args.range || "range" !== p[args[1]][args[2]] && "value" !== p[args[1]][args[2]] || (f("range").value = args.range, 
            f("level", "low").value = -1 < args.min ? args.min : null, f("level", "high").value = -1 < args.max ? args.max : null)));
            removeClass(getElem("mods_form"), "hidden");
            Mods.Wikimd.populateWiki(!0);
            Mods.loadModMenu_wiki && Mods.loadModMenu_wiki();
        }
    };
    Mods.Chatmd.chat = {
        findcom: function(frame, type) {
            if ("undefined" === typeof Mods.Newmap || "undefined" === typeof Mods.Newmap.POI || "undefined" === typeof Mods.Newmap.POIfind) return "Enhanced Map mod not loaded! You need to load it first before using the /find command.";
            Mods.Newmap.POIfind = [];
            HUD.drawMinimap();
            type = type.toLowerCase().trim();
            if ("" === type) return "Use /find [monster] or [material] to get the map or coordinates of what you're looking for.";
            var prefix = "", len = "", c = !1, n = !1, prop = {
                0: "Dorpat",
                1: "Dungeon",
                2: "Narwa",
                3: "Whiland",
                4: "Reval",
                5: "Rakblood",
                6: "Blood River",
                7: "Hell",
                8: "Clouds",
                9: "Heaven",
                10: "Cesis",
                11: "Walco",
                13: "Pernau",
                14: "Fellin Island",
                15: "Dragon's Lair",
                16: "No Man's Land",
                17: "Ancient Dungeon",
                18: "Lost Woods"
            }, val = {}, k;
            for (k in prop) val[k] = !1;
            var aliasMap_ = {
                "fir log": "fir",
                "fir tree": "fir",
                "fir wood": "fir",
                "oak log": "oak",
                "oak tree": "oak",
                "oak wood": "oak",
                "willow log": "willow",
                "willow tree": "willow",
                "willow wood": "willow",
                "maple log": "maple",
                "maple tree": "maple",
                "maple wood": "maple",
                "spirit wood": "spirit log",
                "spirit tree": "spirit log",
                "blue palm log": "blue palm",
                "blue palm tree": "blue palm",
                "blue palm wood": "blue palm",
                "magic oak log": "magic oak",
                "magic oak tree": "magic oak",
                "magic oak wood": "magic oak",
                "iron ore": "iron",
                "iron chunk": "iron",
                "silver ore": "silver",
                "silver chunk": "silver",
                "gold ore": "gold",
                "gold chunk": "gold",
                "white gold ore": "white gold",
                "white gold chunk": "white gold",
                "azure ore": "azure",
                "azure chunk": "azure",
                azurite: "azure",
                "azurite ore": "azure",
                "azurite chunk": "azure",
                "platinum ore": "platinum",
                "platinum chunk": "platinum",
                "fire stone ore": "fire stone",
                "fire stone chunk": "fire stone",
                firestone: "fire stone",
                "firestone ore": "fire stone",
                "firestone chunk": "fire stone",
                gandalf: "gandalf the grey",
                overlord: "orc overlord",
                phoenix: "flame phoenix",
                vortex: "chaos vortex",
                dorpat: "transfer to dorpat",
                dungeon: "dorpat mine",
                reval: "transfer to reval",
                cesis: "transfer to cesis",
                "ancient dungeon": "transfer to ancient dungeon",
                pernau: "transfer to pernau",
                whiland: "transfer to whiland",
                clouds: "transfer to clouds",
                heaven: "transfer to heaven",
                "lost woods": "transfer to lost woods",
                "forest maze": "transfer to lost woods",
                rakblood: "transfer to rakblood",
                "no man's land": "transfer to no man's land",
                pvp: "transfer to no man's land",
                narwa: "transfer to narwa",
                "blood river": "transfer to blood river",
                hell: "transfer to hell",
                "fellin island": "transfer to fellin island",
                "dragon's lair": "transfer to dragon's lair"
            };
            type in aliasMap_ && (type = aliasMap_[type]);
            for (k in Mods.Newmap.POI[0]) "undefined" !== typeof Mods.Newmap.POI[0][k].name && Mods.Newmap.POI[0][k].name.toLowerCase() === type && (current_map == Mods.Newmap.POI[0][k].mapid ? (c && (prefix += ", "), 
            c = !0, prefix = prefix + "(" + Mods.Newmap.POI[0][k].x + ", " + Mods.Newmap.POI[0][k].y + ")", 
            Mods.Newmap.POIfindMap = current_map, Mods.Newmap.POIfind.push({
                color: "#FF0000",
                i: Mods.Newmap.POI[0][k].x,
                j: Mods.Newmap.POI[0][k].y
            })) : val[Mods.Newmap.POI[0][k].mapid] || (n && (len += ", "), n = !0, val[Mods.Newmap.POI[0][k].mapid] = !0, 
            len += prop[Mods.Newmap.POI[0][k].mapid]));
            type = type.replace(/\w\S*/g, function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
            c && (prefix = "Found " + type + " in " + prop[current_map] + " at coordinates: " + prefix + ". ", 
            HUD.drawMinimap());
            n && (prefix = c ? prefix + "Found in: " + len + "." : prefix + "Found " + type + " in: " + len + ".");
            return c || n ? prefix : type + " not found.";
        },
        dailylogin: function(create, proto) {
            var text = players[0].temp.consecutive_logins;
            return "Daily rewards counter: " + text + " day" + sOrNoS(text) + ".";
        },
        online: function(message, label) {
            label = label.toLowerCase();
            var msg = "", code;
            for (code in online_players) -1 != code.indexOf(label) && (msg += code + ", ");
            return 0 < msg.length ? "Online players (" + label + "): " + msg.slice(0, -2) : "No players online matching " + label;
        },
        tip: function(e) {
            return "TIP: " + Mods.Chatmd.game_tips[0][Math.floor(Math.random() * Mods.Chatmd.game_tips[0].length)];
        },
        played: function(bei, agoi) {
            if ("" != agoi) return "";
            var msDiff = timestamp() - players[0].temp.created_at;
            return "Time since you started playing: " + Mods.timeConvert(msDiff / 1e3) + ".";
        },
        friend: function(route, name) {
            var el = !0, n = !1, key;
            for (key in Contacts.friends) if (Contacts.friends[key].name == name) {
                el = !1;
                break;
            }
            el && Contacts.add_friend(name);
            !el && Contacts.remove_friend(name);
            n = el && "added to " || "removed from ";
            reply = name + " has been " + n + "your friend's list.";
            return "removed from " == n ? !1 : reply;
        },
        ignore: function(keys, object) {
            var t = !0, r = !1, k;
            for (k in Contacts.ignores) if (Contacts.ignores[k] == object) {
                t = !1;
                break;
            }
            t && Contacts.ignore_player(object);
            !t && Contacts.remove_ignore(object);
            r = t && "added to " || "removed from ";
            reply = object + " has been " + r + "your ignore list.";
            return "removed from " == r || Player.is_admin(object) || Player.is_mod(object) ? !1 : reply;
        },
        join: function(meth, name) {
            var first = !0;
            Contacts.channels[name] && (first = !1);
            var r = !1, k;
            for (k in channel_names) if (channel_names[k] == name) {
                r = !0;
                break;
            }
            first && r && Contacts.add_channel(name);
            return reply = "You" + (first && r && " have added channel " || !first && r && " are already in channel " || " cannot join channel ") + name + ".";
        },
        leave: function(e, val) {
            var u = !0, ul = !1;
            !Contacts.channels[val] && (u = !1);
            var r = !1, key;
            for (key in channel_names) if (channel_names[key] == val) {
                r = !0;
                break;
            }
            u && r && Contacts.remove_channel(val);
            return reply = "You" + (u && r && " have left channel " || !ul && " are not in channel " || ul) + val + ".";
        },
        whisp: function(array) {
            var jsonData = Mods.Chatmd.whispNames;
            return 0 < jsonData.length ? (array = array.slice(2), array = '/w "' + jsonData[0] + '"' + array, 
            getElem("my_text").value = array, !hasClass(getElem("mod_text"), "hidden") && (getElem("mod_text").value = array), 
            !1) : reply = "You have no target to whisper.";
        },
        ping: function(options) {
            Mods.Chatmd.ping = timestamp();
            Socket.send("message", {
                data: '/w "' + players[0].name + '" #ping;'
            });
            return !1;
        },
        mods: function(next) {
            removeClass(getElem("mods_form"), "hidden");
            return !1;
        },
        wiki: function(emptyLineFilter, line) {
            function value(text) {
                text && (result.text = text);
            }
            function test(code) {
                code && (_ref = regex.exec(code)) && (result.range = _ref[1], result.min = _ref[3], 
                result.max = _ref[5]);
            }
            function round(e2uHash) {
                if (e2uHash && (spec = x.exec(e2uHash))) {
                    e2uHash = {
                        weapon: "weapons",
                        weaponss: "weapons",
                        shield: "r.hand armors"
                    };
                    var m = [ "weapon", "weaponss", "shield" ], s = spec[1], n;
                    for (n in m) s = s.replace(m[n], e2uHash[m[n]]);
                    result.value = s;
                    test(spec[3]);
                }
            }
            line = line.trim().toLowerCase();
            var result, data, match, x, regex, p, spec, _ref;
            result = {
                0: "wiki"
            };
            data = {
                item: {
                    all: "range",
                    skill: "value",
                    type: "value",
                    name: "text"
                },
                mob: {
                    all: "range",
                    name: "text",
                    item: "text"
                },
                npc: {
                    all: "range",
                    name: "text",
                    item: "text"
                },
                craft: {
                    all: "range",
                    skill: "value",
                    source: "value",
                    item: "text"
                },
                pet: {
                    all: "range",
                    name: "text",
                    family: "text"
                },
                spell: {
                    all: "range",
                    name: "text"
                },
                enchant: {
                    all: "range",
                    item: "text"
                }
            };
            match = {
                monster: "mob",
                vendor: "npc"
            };
            x = /^([^ ]{1,})( (.*))?/gi;
            regex = /^([^ ]{1,}) (\(|min ?|from ?|)?=?(\d{1,})? ?(, ?|to ?|max ?)?=?(\d{1,})?/gi;
            p = /^(item|mob|monster|npc|vendor|craft|pet|spell|enchant) ?(skill|type|name|item|family|all|source)?( (.*))?/gi.exec(line);
            if (!p) return Mods.Chatmd.wiki(data, result), !1;
            result[1] = match[p[1]] || p[1];
            result[2] = match[p[2]] || p[2];
            "text" == data[result[1]][result[2]] && value(p[4]);
            "range" == data[result[1]][result[2]] && test(p[4]);
            "value" == data[result[1]][result[2]] && round(p[4]);
            Mods.Chatmd.wiki(data, result);
            return !1;
        },
        moo: function(arg, n) {
            for (var dummy = 1; 120 > dummy; dummy++) Timers.clear("m00 chat" + dummy);
            n = parseInt(n);
            n = "number" == typeof n && 0 < n ? Math.min(120, Math.max(Math.ceil(n), 1)) : 10;
            reply = "m000000000000000000";
            drawObject = function(who, text) {
                Mods.Chatmd.newDrawObject(who, text);
            };
            drawMap(!1, !0, !1);
            updateBase();
            HUD.drawMinimap();
            Timers.set("m00", function() {
                drawObject = function(who, text) {
                    Mods.Chatmd.oldDrawObject(who, text);
                };
                drawMap(!1, !0, !1);
                updateBase();
            }, 1e3 * n);
            for (dummy = 1; dummy < 10 * n; dummy++) Timers.set("m00 chat" + dummy, function() {
                drawMap(!1, !0, !1);
                updateBase();
            }, 100 * dummy);
        },
        timer: function(path, value) {
            var id = /set/.test(path) && "set" || /start/.test(path) && "start" || /clear/.test(path) && "clear" || !1, name = "set" == id && /.{1,}set/.exec(path)[0].replace(" set", "") || "start" == id && /.{1,}start/.exec(path)[0].replace(" start", "") || "clear" == id && /.{1,}clear/.exec(path)[0].replace(" clear", "") || !1, data = (name = "string" == typeof name && 7 < name.length && name.slice(7, 100) || "default", 
            " (" + name.toLowerCase() + ") ") || "", text = name && " (" + name.toLowerCase() + ") " || "";
            value = "set" == id && /(?=set).{1,}/.exec(path)[0].replace("set ", "") || !1;
            if ("set" == id) {
                var c = 0, s = {
                    hrs: {
                        0: !1,
                        1: [ "hours", "hour", "hrs", "hr", "h" ],
                        2: 3600
                    },
                    min: {
                        0: !1,
                        1: [ "minutes", "minute", "mins", "min", "m" ],
                        2: 60
                    },
                    sec: {
                        0: !1,
                        1: [ "seconds", "second", "secs", "sec", "s" ],
                        2: 1
                    }
                }, k;
                for (k in s) {
                    var m = s[k], type = !1, cb = cb || !1, j;
                    for (j in m[1]) RegExp(m[1][j]).test(value) && (type = m[1][j], m[0] = RegExp(".{1,}" + type).exec(value), 
                    m[0] = m[0][0], value = value.replace(m[0], ""), m[0] = m[0].replace(type, ""), 
                    m[0] = parseFloat(m[0]), m[0] = 0 < m[0] && m[0] * m[2] || 0, c += m[0], cb = !0);
                }
                value = cb ? Math.ceil(c) : parseInt(value) || !1;
            }
            if ("set" == id && "number" == typeof value && 0 < value) Mods.Chatmd.runTimer.set[name.toLowerCase()] = [ timestamp(), 1e3 * value ], 
            Timers.set("set_timer" + name.toLowerCase(), function(args) {
                addChatText("Countdown " + text + "has expired. It has been " + value + " seconds.", void 0, COLOR.TEAL);
                delete Mods.Chatmd.runTimer.set[name.toLowerCase()];
            }, 1e3 * value), reply = "Countdown " + data + "started for " + Mods.timeConvert(value) + "."; else if ("start" == id) Mods.Chatmd.runTimer.start[name] = [ timestamp() ], 
            reply = "Timer " + data + "started."; else if ("clear" == id) delete Mods.Chatmd.runTimer.start[name], 
            delete Mods.Chatmd.runTimer.set[name], Timers.clear("set_timer" + name.toLowerCase()), 
            reply = "Timer/Countdown " + data + "has been deleted."; else {
                data = Mods.Chatmd.runTimer;
                s = c = !1;
                for (m = 0; 2 > m; m++) {
                    0 == m ? (id = "start", cb = "Timers elapsed:", type = ".") : (id = "set", cb = "Countdowns running:", 
                    type = " left.");
                    addChatText(cb, void 0, COLOR.TEAL);
                    for (k in data[id]) s = c = !0, cb = 0 < data[id][k][0] && timestamp() - data[id][k][0] - (data[id][k][1] || 0) || !1, 
                    0 < data[id][k][1] && (cb *= -1), cb = 0 < cb ? "- Timer (" + k + ") running: " + Mods.timeConvert(cb / 1e3) + type : "- Timer (" + k + ") has already elapsed.", 
                    addChatText(cb, void 0, COLOR.TEAL);
                    !c && addChatText("- No timers running...", void 0, COLOR.TEAL);
                    c = !1;
                }
                !s && (reply = "No timers have been started. Try /timer name start (to start a timer) or /timer name set # (to start a countdown).") || (reply = !1);
            }
            localStorage.timer = JSON.stringify(Mods.Chatmd.runTimer);
            return reply;
        },
        modch: function(create, proto) {
            Mods.Chatmd.ModCh.sendWhisper(proto);
        },
        ttlxp: function(emptyLineFilter, line) {
            line = line.trim();
            var m = /^(\d{1,}) ?(\-|to)? ?(\d{1,})?$/.exec(line);
            if (!m) {
                var m = 0, n;
                for (n in skills[0]) skills[0][n].xp && (m += Math.floor(skills[0][n].xp));
                return "Your total experience for all skills is: " + thousandSeperate(Math.round(m));
            }
            n = m[1];
            var p = m[3] || 1, m = Math.min(n, p) + " to " + Math.max(n, p);
            n = Level.xp_for_level(n);
            p = Level.xp_for_level(p);
            n = Math.max(n, p) - Math.min(n, p);
            n = thousandSeperate(n);
            return "Total exp needed to go from level " + m + ": " + n;
        },
        id: function(e, data) {
            var match, current, tmp, attr, j, k, key, obj, len, value, name, word, result;
            name = [];
            result = {};
            word = "";
            tmp = /^(item_base|objects_data|object_base|ground_base|npc_base|players|Magic|quests|pets|IMAGE_SHEET|skills|FORGE_FORMULAS|CARPENTRY_FORMULAS|sprite|countries)? ?(.*)/;
            current = /^(([^!=><&]{1,})?(!|!=|<=|>=|=|<|>))? ?([^!=><&]{1,})/g;
            attr = /([^.]{1,})/g;
            data = tmp.exec(data);
            obj = void 0 != data[1] && void 0 != window[data[1]] ? window[data[1]] : window.item_base;
            tmp = data[1] || "item_base";
            data = data[2].replace(/\+/g, "\\+").replace(/\-/g, "\\-").replace(/\'/g, "\\'").split(/ ?& ?/g);
            if (!data || !obj) return "No items match the given values. (error: no parameters)";
            for (j in obj) result[j] = obj[j];
            for (j in data) if (current.lastIndex = 0, (match = current.exec(data[j].trim())) && match[4]) for (k in obj = match[2] ? match[2].match(attr) : [ "name" ], 
            len = match[3] && "=" != match[3] && "!" != match[3] && "!=" != match[3] && -1 < match[4] ? match[3] : "!" == match[3] || "!=" == match[3] ? "!=" : "=", 
            value = match[4], str = "!=" == len ? "!" + value : "=" == len ? value.replace(/\\/g, "") : ">=" == len ? value + "+" : "<=" == len ? value + "-" : ">" == len ? parseInt(value) + 1 + "+" : parseInt(value) - 1 + "-", 
            name.push(obj.toString().replace(/,/g, ".") + "=" + str), result) {
                match = result[k];
                for (key in obj) "object" == typeof match && (match = match[obj[key]]);
                void 0 != match && "object" !== typeof match && null !== match && -1 < value && -1 < match && ("=" == len && match == value || ">" == len && match > value || "<" == len && match < value || ">=" == len && match >= value || "<=" == len && match <= value || "!=" == len && match != value) || !(-1 < value && -1 < match) && ("!=" !== len && RegExp(value, "gi").test(match) || "!=" === len && 0 == RegExp(value, "gi").test(match)) || delete result[k];
            }
            name = name.toString().replace(/ ,/g, "; ");
            name = (0 < name.length ? "." : "") + name + ": ";
            current = 0;
            for (j in result) if (current += 1, 20 < current) {
                word += "(too many results), ";
                break;
            } else word += result[j].name + " (" + j + "), ";
            return 0 < word.length ? tmp + name + word.slice(0, -2) : tmp + name + "No items match the given values.";
        },
        help: function(params, url) {
            url = url.trim() || "";
            var cmd = {
                afk: 'Use /afk or /afk [message] to set an automatic reply to people who whisper you if you are away from the keyboard. While your status is "AFK" if you type /afk again, the automatic replies will be disabled.',
                combats: "Use /combats to see everyones combat level.",
                cathedral: "Use /cathedral to see how much time is left before can start another cathedral run.",
                daily: "Use /daily to see the number of consecutive days you have on your daily rewards counter.",
                find: "Use /find [monster] or [material] to get the map or coordinates of what you're looking for.",
                friend: "Use /friend [player] to quickly add or remove a player to/from your friends list. Example: /friend dendrek",
                help: "Use /help to see a list of the mod chat commands. To read a description of a command, type /help [command].",
                id: "[For Debuggin] Use /id [object] [params=] [value] to lookup information in the game's database. This command is mostly for debugging purposes and will not be useful to most players.",
                ignore: "Use /ignore [player] to quickly add or remove a player to/from your ignore list. Example: /ignore dumbplayer",
                join: "Use /join [CH] (where CH is a valid channel name, written with capital letters, such a EN, DE, 18, etc) to join that channel. Example: /join EN",
                leave: "Use /leave [CH] (where CH is a valid channel name, written with capital letters, such as EN, DE, 18, etc) to leave taht channel. Example: /leave EN",
                maintenance: "Use /maintenance to see how much time is left till the next maintenance restart.",
                m00: "Use /m00 to see ... something happen. You can extend the duration of this command with /m00 # (such as /m00 30 to set the duration to 30 seconds).",
                obj: "[For Debugging] Use /obj [object] [id] [params] to list the params of the object[id]. This command is mostly for debugging purposes and may not be useful to most players.",
                online: "Use /online to see a list of players who are currently online.",
                o: "Use /o [player] to check if that player is online. It's a fast way to confirm a players online-status without scanning the /online list. Example: /o dendrek",
                penalty: "Use /penalty to see how many captcha points you have stored. You can save up to 5 points. If you reach -5 points, you'll go to jail.",
                ping: "Use /ping to see how much of a delay (called latency) there is between you and your computer. Every 1000ms equals a 1 second delay.",
                played: "Use /played to see how long it has been since you created your current character. This is a measure of time since you started, not of actual time played.",
                r: 'Use /r to reply to the last person who whispered you. If a player has whispered you recently enough, /r will immediately change to /w "playername". Additionally, use PageUp and PageDown to cycle through previous whisper targets.',
                savemap: "Use /savemap to save current map into a .PNG file. Caution, might take a while to generate! Not to be used with a mobile device.",
                saveplayer: "Use /saveplayer to save current player into a .PNG file.",
                world: "Use /world to see which world you are in currently. Use /world x to connecto another world, change x into any available world number.",
                timer: {
                    desc: "Use /timer to check already created timers. You can also create a countdown (using /timer set), a clock (using /timer start), remove timers (using /timer clear), and even give timers names (using /timer [name] [command]). Type /help timer [set/start/clear/name] for more details.",
                    set: 'The command /timer set #[time type] starts a timer for "#" seconds. If time type is specified (examples: seconds/secs/sec/s, /minutes/mins/min/m, /hours/hrs/hr/h) the # will be in that time interval. Example: /timer set 30m starts a timer for 30minutes. /timer set 1h 20m 15s can also be done.',
                    start: 'The command /timer start starts a "clock" from the current moment that counts up. You can check how much time has passed by typing /timer at any time.',
                    clear: 'The command /timer [name] clear cancels all existing timers that have the specified "name" value. If name is not included, /timer clear cancels all existing "default" timers. See /help timer name for more details on naming timers.',
                    name: "Timers can be named in this way: /timer [name] [command]. The commands are set, start, and clear. The name can be practically anything, but it CANNOT contain the words set, start or clear. Examples: /timer orc overlord set 20m (starts a countdown named 'orc overlord'), /timer see how long this takes start (starts a clock named 'see how long this takes')."
                },
                totalexp: "Use /totalexp to see the total experience you've gathered. Or use /totalexp # to see how much exp would be required to go from level 1 to the level specified. Or use /totalexp # to # to see how much exp is required to go from the lower level to the higher. Example: /totalexp 90 to 95",
                totalvalue: "Use /totalvalue to see a total wiki value of all items in your inventory, chest, pet, as well as your coins.",
                xp: "Use /xp to see if a 2x experience event is currently running, and to see the duration if one is.",
                wiki: {
                    desc: 'Use /wiki to open up the in-game wiki. You can also perform a search using this command. /wiki [option1] [option2] [option3] etc, where each option "fills" in one of the search boxes in the wiki. For more details, type /help wiki options.',
                    options: 'The wiki has dropdown boxes that must be filled in. To do a wiki search using the /wiki command, you must "fill in" each box with an appropriate value. Examples of wiki searches: /wiki item name bronze pants, /wiki mob item superior armor enchant, /wiki npc name magician, /wiki craft item iron bar. The different parts of the search must be included for it to work.'
                }
            }, parts = " List of commands: ", prefix = "(", k = "(", key;
            for (key in cmd) {
                var prefix = prefix + (key + "|"), parts = parts + (key + ", "), e;
                for (e in cmd[key]) "desc" == e || 0 <= e || -1 != k.indexOf(e) || (k += e + "|");
            }
            parts = parts.slice(0, -2) + ".";
            prefix = prefix.slice(0, -1) + ")";
            k = k.slice(0, -1) + ")";
            cmd.help += parts;
            parts = RegExp(prefix + " ?" + k + "?", "g").exec(url);
            prefix = "";
            return prefix = parts && cmd[parts[1]] && cmd[parts[1]][parts[2]] ? cmd[parts[1]][parts[2]] : parts && cmd[parts[1]] ? cmd[parts[1]].desc || cmd[parts[1]] : cmd.help;
        },
        obj: function(id, cb) {
            var s, r, k, p, key;
            s = /(item_base|objects_data|object_base|ground_base|npc_base|players|Magic|quests|pets|IMAGE_SHEET|skills|FORGE_FORMULAS|CARPENTRY_FORMULAS|sprite|countries)? ?\[?(\d{1,})\]? ?(.*)/g.exec(cb);
            p = /([^.]{1,})/g;
            if (!s) return "No items match the given value. (error: no parameters)";
            r = s[1] || "item_base";
            p = s[3] ? s[3].match(p) : [];
            k = s[2];
            if (void 0 == window[r] || "undefined" == typeof k) return "No items match the given values. (error: base = undefined)";
            s = p.toString().replace(/,/g, ".");
            s = r + "[" + k + "]" + (0 < s.length ? "." + s : "") + ": ";
            r = window[r][k];
            for (key in p) "undefined" != typeof r && (r = r[p[key]]);
            if ("undefined" === typeof r) return "No items match the given values.";
            if ("object" !== typeof r && null !== r) s += r + ", "; else for (key in r) s = "object" == typeof r[key] ? s + (key + " (object), ") : s + (key + " (" + r[key] + "), ");
            return s.slice(0, -2);
        },
        afk: function(val, msg) {
            var err = "", err = "";
            val = val.replace(/^\/afk ?/g, "").trim();
            err = "[AFK]: " + (0 < val.length ? val : "I am away from my keyboard.");
            "" == Mods.Chatmd.afkMessage || Mods.Chatmd.afkMessage != err && "" != val ? (Mods.Chatmd.afkMessage = err, 
            Mods.Chatmd.afkHolder = {}, err = 'You are now [AFK] : "' + msg + '"') : (Mods.Chatmd.afkMessage = "", 
            err = "You are no longer [AFK]");
            Player.update_healthbar();
            return err;
        },
        ttval: function(bei, agoi) {
            var sum, j;
            sum = 0;
            for (j in players[0].temp.inventory) sum += item_base[players[0].temp.inventory[j].id].params.price;
            for (j in players[0].pet.chest) sum += item_base[players[0].pet.chest[j]].params.price;
            for (j in chests[0]) sum += chests[0][j].count * item_base[chests[0][j].id].params.price;
            sum += players[0].temp.coins;
            sum = thousandSeperate(sum);
            return "The total value of items in your Chest/Inv/Pet + Coins is: " + sum;
        },
        tele: function(changes, source) {
            var type, x;
            x = source.split(/ /g) || [ source ];
            type = players[0].i + (parseInt(x[0]) || 0);
            x = players[0].j + (parseInt(x[1]) || 0);
            Socket.send("message", {
                data: "/level " + players[0].map + " " + type + " " + x
            });
        }
    };
    Mods.Chatmd.chatCommands = function(s) {
        var value = {
            online: "/o ",
            played: "/played",
            friend: "/friend ",
            ignore: "/ignore ",
            join: "/join ",
            leave: "/leave ",
            whisp: "/r ",
            ping: "/ping",
            mods: "/mods",
            wiki: "/wiki",
            moo: "/m00",
            timer: "/timer",
            tip: "/tip",
            modch: "/@mods ",
            ttlxp: "/totalexp",
            id: "/id ",
            help: "/help",
            obj: "/obj ",
            afk: "/afk",
            ttval: "/totalvalue",
            tele: "/tele ",
            dailylogin: "/daily",
            findcom: "/find"
        }, key, rl = !0, k;
        for (k in value) if (RegExp("^" + value[k]).test(s)) {
            rl = !1;
            key = k;
            break;
        }
        if (rl) return s;
        value = s.replace(value[key], "");
        value = value.replace('"', "");
        value = value.replace('"', "");
        (s = Mods.Chatmd.chat[key](s, value)) && addChatText(s, void 0, COLOR.TEAL);
        return !1;
    };
    Mods.Chatmd.ScheduleTips = function() {
        0 == Mods.Chatmd.tipsenabled && Mods.Chatmd.chatCommands("/tip");
        setTimeout(function() {
            Mods.Chatmd.ScheduleTips();
        }, 6e5);
    };
    Mods.Chatmd.Tipstoggle = function() {
        var elem = getElem("settings_tips");
        switch (Mods.Chatmd.tipsenabled) {
          case 0:
            elem.innerHTML = "Tips (off)";
            Mods.Chatmd.tipsenabled = 1;
            break;

          default:
            elem.innerHTML = "Tips (on)", Mods.Chatmd.tipsenabled = 0;
        }
        localStorage.tipsenabled = JSON.stringify(Mods.Chatmd.tipsenabled);
    };
    Mods.Chatmd.Timestamptoggle = function() {
        var elem = getElem("settings_enableallchatts");
        switch (Mods.Chatmd.enableallchatts) {
          case 0:
            elem.innerHTML = "Timestamps on all chat lines (on)";
            Mods.Chatmd.enableallchatts = 1;
            break;

          default:
            elem.innerHTML = "Timestamps on all chat lines (off)", Mods.Chatmd.enableallchatts = 0;
        }
        localStorage.enableallchatts = JSON.stringify(Mods.Chatmd.enableallchatts);
    };
    (function() {
        getElem("chat").style.opacity = ".9";
        getElem("my_text").style.opacity = "1";
        createElem("div", "filters_form", {
            id: "mod_filters",
            style: "padding-top: 23px; width: 50%; float: left;"
        });
        var obj = {
            spam: "Spam information",
            color: "Colored channels",
            modcolor: "Chat moderator color",
            chattimestamp: "Chat timestamps",
            urlfilter: "Disable URL in chat"
        }, p;
        for (p in obj) createElem("span", "mod_filters", {
            id: "filter_" + p,
            className: "wide_link pointer green",
            innerHTML: obj[p],
            onclick: "ChatSystem.filter_toggle('" + p + "')"
        }), "color" == p && (createElem("span", "mod_filters", {
            style: "margin-top: 5px; margin-bottom: 5px; padding-left: 5px; width: 100%; font-size: .9em; display: inline-block; vertical-align: middle;",
            innerHTML: "<input type='checkbox' id='filter_channel_only' onclick='Mods.Chatmd.filter_checks();'><span style='position: absolute; padding-top: 5px; padding-left: 3px;'>Color channel only</span>"
        }), createElem("span", "mod_filters", {
            style: "margin-top: 5px; margin-bottom: 5px; padding-top: 5px; padding-left: 5px; width: 100%; font-size: .9em; display: inline-block; vertical-align: middle;",
            innerHTML: "<input type='checkbox' id='filter_highlight_friends' onclick='Mods.Chatmd.filter_checks();'><span style='position: absolute; padding-top: 5px; padding-left: 3px;'>Highlight friends</span>"
        }));
        getElem("filter_channel_only").checked = JSON.parse(localStorage.colorChannel);
        getElem("filter_highlight_friends").checked = JSON.parse(localStorage.highlightFriends);
        getElem("filter_attempt").style.paddingTop = "20px";
        getElem("filter_attempt").parentNode.style.width = "50%";
        getElem("filter_attempt").parentNode.style.cssFloat = "left";
        getElem("filter_attempt").parentNode.childNodes[1].style.position = "absolute";
        getElem("filters_form").style.width = "328px";
        Mods.Chatmd.game_tips = {
            0: "In defensive fight mode, each point of damage you deal will give 2 xp to the defense skill and 1 xp to health.;In accurate fight mode, each point of damage you deal will give 2 xp to the accuracy skill and 1 xp to health.;In aggressive fight mode, each point of damage you deal will give 2 xp to the strength skill and 1 xp to health.;In controlled fight mode, combat xp is equally divided between strength, defense and accuracy. Health will always get 1 xp per damage dealt.;Ingame wiki mod is a precious resource to plan your adventure. Access it typing /wiki in the chat line.;You can turn tips off from the Game Options menu.;If you like RPG MO, consider writing a review and gaining free MOS: http://forums.mo.ee/viewtopic.php?t=3870.;There is a Secret Cow Level.;The Enhanced Map mod adds several details to the game map, including key resource spots, travel points and boss locations.;The Enhanced Market mod adds several helpers for player's market operations, including the ability to resubmit expired offers and compare your equip with the one that is for sale.;Your health slowly regenerates over time: you gain 1 health every minute.;The more health a mob has, the more time it takes to respawn.;Be ready to be hunted down and fight for your life if you go into No Man's Land, the RPG MO PvP area.;Don't sell raw fish you get, cook it!;Better boots can increase your movement speed.;Food heals you. You can get food by killing chickens or by fishing. You may have to cook the food.;The forums have a lot of information about this game. You can access them on http://forums.mo.ee/ .;Are you lost? Access zone maps and much more on RPG MO Atlas: http://tinyurl.com/rpgmoatlas;If you die, you will lose all the items you are carrying but the two most valuable. Beware!;Potion of Preservation is a special potion that must be equipped and it will be consumed on death, allowing you to save a total of 7 items from your inventory.;If you have a pet equipped and you die you keep the pet. If it is not equipped, but it's in your inventory you may lose it.;When you die you do not lose the items you placed in your pet's inventory.;You can buy an island deed from the farmer in Dorpat.;To see your combat level, mouse over yourself. To see the level of monsters, position the mouse pointer over them.;Public chat is global, meaning everyone online can read it!;Players chat is white, moderators chat is green and developers/admins chat is orange.;To whisper, type /w \"[playersname]\" followed by the message.;Type /online to bring up a list of players currently online.;Type /played to see how much time has passed since your first login.;Type /penalty to view or spend your current penalty points.;Type /wiki to access the ingame wiki database.;Enable the Enhanced Market mod to gain access to the Trade Channel ($$).;Type /xp to check the duration of an ongoing x2 Experience event.;x2 Experience server events are triggered by players using special x2 pots from the MOS market.;Need help? Don't be afraid to ask! RPG MO is full of helpful players! Further help and guides can be found in the game forums.;Higher accuracy will allow you to equip better weapons.;Higher defense will allow you to equip better armor.;Higher health will allow you to equip better jewelry.;Do not ignore Captchas! If you fail or ignore them you will get -5 penalty points and you will go to jail.;If you end up in jail, only a Game Moderator or an Admin can decide to free you.;You can save up to 5 captcha points. Using Captcha points will add XP to a skill of your choice.;You can access the player's market through the chest.;Some pets can be purchased from the pet vendor in Dorpat. Better pets are usually available on the market ;A pet can extend your inventory space by 4, 8, 12 or 16 slots. Pets also give stats boosts.;Cross-chatting is bad. If someone is speaking in a chat channel, make sure you answer in the same one.;The best way to make money is through gathering professions (especially mining). There will always be players looking for iron, sand or coal in the player's market!;Through the market you can place \"buy\" or \"sell\" offers, and you can check buy and sell offers from other players.;MOS is a special currency that can be acquired with real money. It allows you to buy special items from the MOS store.;The MOS Store is accessible from the \"Buy items and coins\" link at the bottom right of page.;To use magic you need to buy and equip a magic pouch, fill it with spell scrolls (all available at Dorpat Magician NPC) and engage in combat.;You are allowed to have a max of 5 accounts (alts), but trading items or materials between your own accounts is not allowed.;Please check RPG MO Code of Conduct on http://forums.mo.ee/viewtopic.php?t=3083".split(";")
        };
        createElem("div", "options_game", {
            innerHTML: "<span class='wide_link pointer' id='settings_tips' onclick='Mods.Chatmd.Tipstoggle();'>Tips (on)</span>"
        });
        createElem("div", "options_game", {
            innerHTML: "<span class='wide_link pointer' id='settings_enableallchatts' onclick='Mods.Chatmd.Timestamptoggle();'>Timestamps on all chat lines (off)</span>"
        });
        Mods.Chatmd.ModCh.createDiv();
        Mods.Chatmd.Tipstoggle();
        Mods.Chatmd.ScheduleTips();
        Mods.Chatmd.Timestamptoggle();
        iOS && (getElem("mod_text").style.left = "63px");
        getElem("checkbox_tabs").checked && -1 == Mods.loadedMods.indexOf("Tabs") && Mods.loadSelectedMods("tabs");
        Contacts.add_channel("{M}");
        channel_names.push(Mods.Chatmd.ModCh.channel);
        Contacts.add_channel(Mods.Chatmd.ModCh.channel);
        addChatText("Several new chat commands available. Type /help to see a list and usage instructions.", void 0, COLOR.TEAL);
    })();
    Mods.timestamp("chatmd");
};

Load.newmap = function() {
    modOptions.newmap.time = timestamp();
    Mods.Newmap.drawMinimapLarge = Mods.Newmap.drawMinimapLarge || HUD.drawMinimapLarge;
    Mods.Newmap.drawMinimap = Mods.Newmap.drawMinimap || HUD.drawMinimap;
    createElem("div", wrapper, {
        id: "mods_newmap_coords",
        style: "visibility: hidden; z-index: 300; left: 35%; top: 20px; position: absolute; color #FFF; text-align: middle; font-size: 20px; text-shadow: #555 1px 1px 1px; pointer-events: none;"
    });
    createElem("div", wrapper, {
        id: "mods_newmap_popup",
        style: "visibility: hidden; z-index: 49; position: absolute; color: #FFF; border-radius: 4px; text-align: middle; font-size: 12px; background-color: #666; padding: 4px; pointer-events: none;"
    });
    createElem("div", wrapper, {
        id: "mods_zone_buttondiv",
        style: "visibility: hidden; z-index: 49; position: absolute; top: 40px; left: 3px; font-size: 8px;",
        innerHTML: "<button id='mods_zone_button' class='market_select pointer' onclick='Mods.Newmap.ShowZone();'>World Map</button>"
    });
    var loading = !1;
    Mods.Newmap.POI = {
        0: [ {
            mapid: 0,
            name: "Dorpat Town",
            type: "CITY",
            x: 20,
            y: 20
        }, {
            mapid: 0,
            name: "Dorpat Outpost",
            type: "CITY",
            x: 83,
            y: 38
        }, {
            mapid: 0,
            name: "Fishing Net",
            description: "5 fishing",
            type: "RESOURCE",
            icon: "net",
            x: 32,
            y: 5
        }, {
            mapid: 0,
            name: "Fishing Rod",
            description: "1 fishing",
            type: "RESOURCE",
            icon: "fish",
            x: 16,
            y: 8
        }, {
            mapid: 0,
            name: "Fishing Rod",
            description: "1 fishing",
            type: "RESOURCE",
            icon: "fish",
            x: 91,
            y: 33
        }, {
            mapid: 0,
            name: "Wooden Harpoon",
            description: "50 fishing",
            type: "RESOURCE",
            icon: "woodharp",
            x: 95,
            y: 5
        }, {
            mapid: 0,
            name: "Steel Harpoon",
            description: "63 fishing",
            type: "RESOURCE",
            icon: "steelharp",
            x: 81,
            y: 90
        }, {
            mapid: 0,
            name: "Sand",
            description: "1 mining",
            type: "RESOURCE",
            icon: "spade",
            x: 73,
            y: 73
        }, {
            mapid: 0,
            name: "Silver",
            description: "25 mining",
            type: "RESOURCE",
            icon: "pick",
            x: 69,
            y: 79
        }, {
            mapid: 0,
            name: "Fir",
            description: "1 woodcutting",
            type: "RESOURCE",
            icon: "wood",
            x: 24,
            y: 27
        }, {
            mapid: 0,
            name: "Fir",
            description: "1 woodcutting",
            type: "RESOURCE",
            icon: "wood",
            x: 88,
            y: 32
        }, {
            mapid: 0,
            name: "Cactus",
            description: "5 woodcutting",
            type: "RESOURCE",
            icon: "wood",
            x: 3,
            y: 88
        }, {
            mapid: 0,
            name: "Willow",
            description: "20 woodcutting",
            type: "RESOURCE",
            icon: "wood",
            x: 87,
            y: 88
        }, {
            mapid: 0,
            name: "Oak",
            description: "10 woodcutting",
            type: "RESOURCE",
            icon: "wood",
            x: 67,
            y: 23
        }, {
            mapid: 0,
            name: "Minotaur Maze",
            description: "Access to Minotaur Cave dungeon",
            type: "POI",
            x: 21,
            y: 87
        }, {
            mapid: 0,
            name: "Dorpat Castle",
            description: "Access to Dorpat Castle dungeon",
            type: "POI",
            x: 50,
            y: 59
        }, {
            mapid: 0,
            name: "Miner's Guild",
            description: "Requires Mining guild permission and 65 mining.",
            type: "POI",
            x: 56,
            y: 14
        }, {
            mapid: 0,
            name: "Skeleton Dungeon",
            description: "",
            type: "POI",
            x: 66,
            y: 29
        }, {
            mapid: 0,
            name: "Transfer to Whiland",
            description: "Leads to Rakblood, No Man's Land (PvP)",
            type: "TRAVEL",
            x: 92,
            y: 15
        }, {
            mapid: 0,
            name: "Cow",
            type: "MOB",
            icon: 102,
            x: 41,
            y: 11
        }, {
            mapid: 0,
            name: "Moth",
            type: "MOB",
            icon: 280,
            x: 48,
            y: 17
        }, {
            mapid: 0,
            name: "Orc Warrior",
            type: "MOB",
            icon: 4,
            x: 75,
            y: 18
        }, {
            mapid: 0,
            name: "Thief",
            type: "MOB",
            icon: 185,
            x: 80,
            y: 9
        }, {
            mapid: 0,
            name: "Minotaur",
            type: "MOB",
            icon: 6,
            x: 18,
            y: 90
        }, {
            mapid: 0,
            name: "Apeman",
            type: "MOB",
            icon: 119,
            x: 50,
            y: 78
        }, {
            mapid: 0,
            name: "Dwarf Mage",
            type: "MOB",
            icon: 7,
            x: 63,
            y: 52
        }, {
            mapid: 0,
            name: "Gray Wizard",
            type: "MOB",
            icon: 0,
            x: 15,
            y: 50
        }, {
            mapid: 0,
            name: "Black Rat",
            type: "MOB",
            icon: 8,
            x: 80,
            y: 78
        }, {
            mapid: 0,
            name: "Dragonfly",
            type: "MOB",
            icon: 120,
            x: 90,
            y: 41
        }, {
            mapid: 0,
            name: "Orc Mage",
            type: "MOB",
            icon: 13,
            x: 83,
            y: 56
        }, {
            mapid: 0,
            name: "Explorer",
            type: "MOB",
            icon: 187,
            x: 45,
            y: 60
        }, {
            mapid: 0,
            name: "Paladin",
            type: "MOB",
            icon: 25,
            x: 50,
            y: 63
        }, {
            mapid: 0,
            name: "Ridder",
            type: "MOB",
            icon: 201,
            x: 43,
            y: 58
        }, {
            mapid: 0,
            name: "Bronze Golem",
            type: "MOB",
            icon: 60,
            x: 70,
            y: 69
        }, {
            mapid: 0,
            name: "Iron Golem",
            type: "MOB",
            icon: 62,
            x: 65,
            y: 75
        }, {
            mapid: 0,
            name: "Sand Golem",
            type: "MOB",
            icon: 162,
            x: 71,
            y: 72
        }, {
            mapid: 0,
            name: "White Rat",
            type: "MOB",
            icon: 1,
            x: 28,
            y: 33
        }, {
            mapid: 0,
            name: "Hen",
            type: "MOB",
            icon: 101,
            x: 9,
            y: 31
        }, {
            mapid: 0,
            name: "Green Wizard",
            type: "MOB",
            icon: 3,
            x: 48,
            y: 46
        }, {
            mapid: 0,
            name: "Chicken",
            type: "MOB",
            icon: 100,
            x: 16,
            y: 34
        }, {
            mapid: 0,
            name: "Dorpat Mine",
            description: "",
            type: "TRAVEL",
            x: 9,
            y: 23
        }, {
            mapid: 0,
            name: "Transfer to Walco",
            description: "",
            type: "TRAVEL",
            x: 94,
            y: 83
        }, {
            mapid: 0,
            name: "Transfer to Reval",
            description: "Leads to Cesis, Pernau",
            type: "TRAVEL",
            x: 6,
            y: 89
        }, {
            mapid: 0,
            name: "Transfer to Clouds",
            description: "Leads to Heaven. Requires wings.",
            type: "TRAVEL",
            x: 43,
            y: 92
        }, {
            mapid: 1,
            name: "Big Treasure Chest",
            description: "Use spare keys from search dungeons here.",
            type: "POI",
            x: 26,
            y: 8
        }, {
            mapid: 1,
            name: "Campfire",
            type: "POI",
            x: 90,
            y: 41
        }, {
            mapid: 1,
            name: "Clay",
            description: "0 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 15,
            y: 27
        }, {
            mapid: 1,
            name: "Tin",
            description: "1 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 6,
            y: 16
        }, {
            mapid: 1,
            name: "Tin",
            description: "1 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 31,
            y: 18
        }, {
            mapid: 1,
            name: "Copper",
            description: "1 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 4,
            y: 9
        }, {
            mapid: 1,
            name: "Copper",
            description: "1 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 34,
            y: 18
        }, {
            mapid: 1,
            name: "Cage",
            description: "35 fishing",
            icon: "cage",
            type: "RESOURCE",
            x: 19,
            y: 25
        }, {
            mapid: 1,
            name: "Gold",
            description: "45 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 30,
            y: 90
        }, {
            mapid: 1,
            name: "Iron",
            description: "25 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 67,
            y: 14
        }, {
            mapid: 1,
            name: "Iron",
            description: "25 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 34,
            y: 21
        }, {
            mapid: 1,
            name: "Coal",
            description: "40 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 55,
            y: 70
        }, {
            mapid: 1,
            name: "Coal",
            description: "40 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 33,
            y: 24
        }, {
            mapid: 1,
            name: "Transfer to Dorpat",
            description: "",
            type: "TRAVEL",
            x: 9,
            y: 23
        }, {
            mapid: 1,
            name: "Transfer to Dorpat",
            description: "",
            type: "TRAVEL",
            x: 66,
            y: 29
        }, {
            mapid: 1,
            name: "Transfer to Dorpat",
            description: "",
            type: "TRAVEL",
            x: 40,
            y: 56
        }, {
            mapid: 1,
            name: "Transfer to Dorpat",
            description: "",
            type: "TRAVEL",
            x: 22,
            y: 88
        }, {
            mapid: 1,
            name: "White Rat",
            type: "MOB",
            icon: 1,
            x: 14,
            y: 21
        }, {
            mapid: 1,
            name: "Moth",
            type: "MOB",
            icon: 280,
            x: 10,
            y: 27
        }, {
            mapid: 1,
            name: "Cave Bat",
            type: "MOB",
            icon: 196,
            x: 21,
            y: 33
        }, {
            mapid: 1,
            name: "Cave Worm",
            type: "MOB",
            icon: 197,
            x: 14,
            y: 52
        }, {
            mapid: 1,
            name: "Black Rat",
            type: "MOB",
            icon: 8,
            x: 11,
            y: 66
        }, {
            mapid: 1,
            name: "Sapphire Dragon",
            type: "MOB",
            icon: 14,
            x: 25,
            y: 84
        }, {
            mapid: 1,
            name: "Ghost Dragon",
            type: "MOB",
            icon: 23,
            x: 9,
            y: 85
        }, {
            mapid: 1,
            name: "Efreet",
            type: "MOB",
            icon: 22,
            x: 91,
            y: 79
        }, {
            mapid: 1,
            name: "Ruby Dragon",
            type: "MOB",
            icon: 27,
            x: 41,
            y: 87
        }, {
            mapid: 1,
            name: "Cursed Dragon",
            type: "MOB",
            icon: 26,
            x: 60,
            y: 90
        }, {
            mapid: 1,
            name: "Adult Ruby Dragon",
            type: "MOB",
            icon: 184,
            x: 86,
            y: 91
        }, {
            mapid: 1,
            name: "King Ruby Dragon",
            type: "MOB",
            icon: 24,
            x: 91,
            y: 87
        }, {
            mapid: 1,
            name: "Ridder",
            type: "MOB",
            icon: 201,
            x: 44,
            y: 56
        }, {
            mapid: 1,
            name: "Crusader",
            type: "MOB",
            icon: 200,
            x: 53,
            y: 59
        }, {
            mapid: 1,
            name: "Dark Knight",
            type: "MOB",
            icon: 29,
            x: 58,
            y: 64
        }, {
            mapid: 1,
            name: "Paladin",
            type: "MOB",
            icon: 25,
            x: 61,
            y: 61
        }, {
            mapid: 1,
            name: "Holy Warrior",
            type: "MOB",
            icon: 30,
            x: 55,
            y: 79
        }, {
            mapid: 1,
            name: "Scholar",
            type: "MOB",
            icon: 202,
            x: 62,
            y: 80
        }, {
            mapid: 1,
            name: "Enchanter",
            type: "MOB",
            icon: 204,
            x: 79,
            y: 67
        }, {
            mapid: 1,
            name: "Skeleton",
            type: "MOB",
            icon: 10,
            x: 74,
            y: 29
        }, {
            mapid: 1,
            name: "Vampire",
            type: "MOB",
            icon: 11,
            x: 72,
            y: 16
        }, {
            mapid: 1,
            name: "Ghost",
            type: "MOB",
            icon: 9,
            x: 71,
            y: 44
        }, {
            mapid: 1,
            name: "Spirit",
            type: "MOB",
            icon: 135,
            x: 74,
            y: 49
        }, {
            mapid: 1,
            name: "Energy Ghost",
            type: "MOB",
            icon: 137,
            x: 58,
            y: 46
        }, {
            mapid: 1,
            name: "Baby Minotaur Skeleton",
            type: "MOB",
            icon: 68,
            x: 43,
            y: 34
        }, {
            mapid: 1,
            name: "Skeleton Knight",
            type: "MOB",
            icon: 67,
            x: 32,
            y: 56
        }, {
            mapid: 1,
            name: "Skeleton Lord",
            type: "MOB",
            icon: 176,
            x: 32,
            y: 67
        }, {
            mapid: 1,
            name: "Vampire Lord",
            type: "MOB",
            icon: 28,
            x: 54,
            y: 19
        }, {
            mapid: 1,
            name: "Hydra",
            type: "MOB",
            icon: 17,
            x: 75,
            y: 17
        }, {
            mapid: 1,
            name: "Gnoll Warrior",
            type: "MOB",
            icon: 16,
            x: 65,
            y: 10
        }, {
            mapid: 1,
            name: "Skeleton Mage",
            type: "MOB",
            icon: 177,
            x: 85,
            y: 20
        }, {
            mapid: 1,
            name: "Gnoll Mage",
            type: "MOB",
            icon: 199,
            x: 89,
            y: 35
        }, {
            mapid: 2,
            name: "Narwa Town",
            type: "CITY",
            x: 68,
            y: 37
        }, {
            mapid: 2,
            name: "Water Altar",
            type: "POI",
            x: 61,
            y: 75
        }, {
            mapid: 2,
            name: "Wooden Harpoon",
            description: "50 fishing",
            icon: "woodharp",
            type: "RESOURCE",
            x: 78,
            y: 30
        }, {
            mapid: 2,
            name: "Transfer to Rakblood",
            description: "Leads to Whiland",
            type: "TRAVEL",
            x: 19,
            y: 81
        }, {
            mapid: 2,
            name: "Transfer to Fellin Island",
            description: "Requires ticket. Leads to Dragon's Lair",
            type: "TRAVEL",
            x: 78,
            y: 38
        }, {
            mapid: 2,
            name: "Transfer to Blood River",
            description: "Leads to Hell. Requires wings.",
            type: "TRAVEL",
            x: 86,
            y: 81
        }, {
            mapid: 2,
            name: "Sailor",
            description: "(NPC) Shop",
            type: "POI",
            x: 74,
            y: 38
        }, {
            mapid: 2,
            name: "Coal",
            description: "40 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 92,
            y: 11
        }, {
            mapid: 2,
            name: "Frozen Spirit",
            type: "MOB",
            icon: 57,
            x: 82,
            y: 93
        }, {
            mapid: 2,
            name: "Frozen Spirit",
            type: "MOB",
            icon: 57,
            x: 72,
            y: 78
        }, {
            mapid: 2,
            name: "Frozen Spirit",
            type: "MOB",
            icon: 57,
            x: 95,
            y: 56
        }, {
            mapid: 2,
            name: "Ice Lizard",
            type: "MOB",
            icon: 55,
            x: 77,
            y: 82
        }, {
            mapid: 2,
            name: "Ice Wyvern",
            type: "MOB",
            icon: 259,
            x: 91,
            y: 80
        }, {
            mapid: 2,
            name: "Ice Giant",
            type: "MOB",
            icon: 54,
            x: 79,
            y: 54
        }, {
            mapid: 2,
            name: "Frozen Bat",
            type: "MOB",
            icon: 53,
            x: 82,
            y: 58
        }, {
            mapid: 2,
            name: "Frozen Bat",
            type: "MOB",
            icon: 53,
            x: 84,
            y: 18
        }, {
            mapid: 2,
            name: "Ice Golem",
            type: "MOB",
            icon: 56,
            x: 90,
            y: 49
        }, {
            mapid: 2,
            name: "Ice Troglodyte",
            type: "MOB",
            icon: 52,
            x: 85,
            y: 34
        }, {
            mapid: 2,
            name: "Wind Protector",
            type: "MOB",
            icon: 58,
            x: 93,
            y: 17
        }, {
            mapid: 2,
            name: "Snow Troll Defender",
            type: "MOB",
            icon: 71,
            x: 51,
            y: 53
        }, {
            mapid: 2,
            name: "Snow Troll Knight",
            type: "MOB",
            icon: 69,
            x: 62,
            y: 64
        }, {
            mapid: 2,
            name: "King Elemental Dragon",
            type: "MOB",
            icon: 76,
            x: 52,
            y: 89
        }, {
            mapid: 2,
            name: "King Elemental Dragon",
            type: "MOB",
            icon: 76,
            x: 32,
            y: 86
        }, {
            mapid: 2,
            name: "Wind Elemental",
            type: "MOB",
            icon: 51,
            x: 18,
            y: 57
        }, {
            mapid: 2,
            name: "Wind Elemental",
            type: "MOB",
            icon: 51,
            x: 25,
            y: 90
        }, {
            mapid: 2,
            name: "Wind Elemental",
            type: "MOB",
            icon: 51,
            x: 10,
            y: 72
        }, {
            mapid: 2,
            name: "Wind Elemental",
            type: "MOB",
            icon: 51,
            x: 9,
            y: 44
        }, {
            mapid: 2,
            name: "Wind Elemental",
            type: "MOB",
            icon: 51,
            x: 32,
            y: 29
        }, {
            mapid: 2,
            name: "Adult Elemental Dragon",
            type: "MOB",
            icon: 74,
            x: 32,
            y: 82
        }, {
            mapid: 2,
            name: "Baby Elemental Dragon",
            type: "MOB",
            icon: 74,
            x: 23,
            y: 74
        }, {
            mapid: 2,
            name: "Snow Troll Assassin",
            type: "MOB",
            icon: 70,
            x: 18,
            y: 47
        }, {
            mapid: 2,
            name: "Snow Gungan Priest",
            type: "MOB",
            icon: 72,
            x: 44,
            y: 34
        }, {
            mapid: 2,
            name: "Snow Gungan Priest",
            type: "MOB",
            icon: 72,
            x: 66,
            y: 25
        }, {
            mapid: 2,
            name: "Bear",
            type: "MOB",
            icon: 104,
            x: 8,
            y: 18
        }, {
            mapid: 2,
            name: "Polar Bear",
            type: "MOB",
            icon: 189,
            x: 18,
            y: 14
        }, {
            mapid: 2,
            name: "Snow Gungan Lord",
            type: "MOB",
            icon: 73,
            x: 48,
            y: 16
        }, {
            mapid: 3,
            name: "Whiland Town",
            type: "CITY",
            x: 28,
            y: 93
        }, {
            mapid: 3,
            name: "Earth Altar",
            type: "POI",
            x: 42,
            y: 39
        }, {
            mapid: 3,
            name: "Wandering Farmer",
            description: "(NPC) Shop",
            type: "POI",
            x: 10,
            y: 29
        }, {
            mapid: 3,
            name: "Transfer to Dorpat",
            type: "TRAVEL",
            x: 4,
            y: 5
        }, {
            mapid: 3,
            name: "Transfer to Rakblood",
            description: "Leads to Narwa",
            type: "TRAVEL",
            x: 71,
            y: 46
        }, {
            mapid: 3,
            name: "Transfer to No Man's Land",
            description: "PVP Area",
            type: "TRAVEL",
            x: 90,
            y: 12
        }, {
            mapid: 3,
            name: "Transfer to Lost Woods",
            type: "TRAVEL",
            x: 8,
            y: 90
        }, {
            mapid: 3,
            name: "Oak",
            description: "10 woodcutting",
            type: "RESOURCE",
            icon: "wood",
            x: 19,
            y: 85
        }, {
            mapid: 3,
            name: "Deer",
            type: "MOB",
            icon: 103,
            x: 10,
            y: 13
        }, {
            mapid: 3,
            name: "Boletus",
            type: "MOB",
            icon: 34,
            x: 12,
            y: 7
        }, {
            mapid: 3,
            name: "Bear",
            type: "MOB",
            icon: 104,
            x: 25,
            y: 87
        }, {
            mapid: 3,
            name: "Silver Shroom",
            type: "MOB",
            icon: 35,
            x: 75,
            y: 42
        }, {
            mapid: 3,
            name: "Blue Magic Shroom",
            type: "MOB",
            icon: 33,
            x: 37,
            y: 81
        }, {
            mapid: 3,
            name: "Avatar's Shroom",
            type: "MOB",
            icon: 38,
            x: 42,
            y: 87
        }, {
            mapid: 3,
            name: "Russula",
            type: "MOB",
            icon: 31,
            x: 39,
            y: 77
        }, {
            mapid: 3,
            name: "Grizzly Bear",
            type: "MOB",
            icon: 188,
            x: 58,
            y: 69
        }, {
            mapid: 3,
            name: "Golden Shroom",
            type: "MOB",
            icon: 36,
            x: 67,
            y: 76
        }, {
            mapid: 3,
            name: "Lava Shroom",
            type: "MOB",
            icon: 41,
            x: 80,
            y: 66
        }, {
            mapid: 3,
            name: "Dark Shroom",
            type: "MOB",
            icon: 32,
            x: 84,
            y: 70
        }, {
            mapid: 3,
            name: "Fire Shroom",
            type: "MOB",
            icon: 40,
            x: 80,
            y: 30
        }, {
            mapid: 3,
            name: "Dry-Rotted Shroom",
            type: "MOB",
            icon: 37,
            x: 55,
            y: 60
        }, {
            mapid: 3,
            name: "Poisoned Shroom",
            type: "MOB",
            icon: 39,
            x: 75,
            y: 31
        }, {
            mapid: 4,
            name: "Reval Town",
            type: "CITY",
            x: 16,
            y: 24
        }, {
            mapid: 4,
            name: "Orc Overlord",
            type: "BOSS",
            cblevel: 450,
            x: 71,
            y: 87
        }, {
            mapid: 4,
            name: "Snake Maze",
            type: "POI",
            x: 59,
            y: 43
        }, {
            mapid: 4,
            name: "Flash Altar",
            type: "POI",
            x: 62,
            y: 65
        }, {
            mapid: 4,
            name: "Jewelry Guild",
            description: "Requires Jewelry Guild permission and 60 jewelry.",
            type: "POI",
            x: 48,
            y: 56
        }, {
            mapid: 4,
            name: "Sand",
            description: "1 mining",
            icon: "spade",
            type: "RESOURCE",
            x: 8,
            y: 34
        }, {
            mapid: 4,
            name: "Gold",
            description: "45 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 66,
            y: 38
        }, {
            mapid: 4,
            name: "Gold",
            description: "45 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 45,
            y: 56
        }, {
            mapid: 4,
            name: "Silver",
            description: "25 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 42,
            y: 55
        }, {
            mapid: 4,
            name: "Clay",
            description: "1 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 46,
            y: 59
        }, {
            mapid: 4,
            name: "Coal",
            description: "40 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 91,
            y: 67
        }, {
            mapid: 4,
            name: "Cactus",
            description: "5 woodcutting",
            type: "RESOURCE",
            icon: "wood",
            x: 10,
            y: 12
        }, {
            mapid: 4,
            name: "Transfer to Dorpat",
            description: "",
            type: "TRAVEL",
            x: 93,
            y: 7
        }, {
            mapid: 4,
            name: "Transfer to Cesis",
            description: "Leads to Ancient Dungeon",
            type: "TRAVEL",
            x: 40,
            y: 91
        }, {
            mapid: 4,
            name: "Transfer to Pernau",
            description: "",
            type: "TRAVEL",
            x: 83,
            y: 87
        }, {
            mapid: 4,
            name: "Lion",
            type: "MOB",
            icon: 190,
            x: 56,
            y: 82
        }, {
            mapid: 4,
            name: "Chaos Vortex",
            type: "MOB",
            icon: 174,
            x: 91,
            y: 81
        }, {
            mapid: 4,
            name: "Desert Runner",
            type: "MOB",
            icon: 44,
            x: 33,
            y: 12
        }, {
            mapid: 4,
            name: "Cyclops Knight",
            type: "MOB",
            icon: 43,
            x: 51,
            y: 30
        }, {
            mapid: 4,
            name: "Orc King",
            type: "MOB",
            icon: 46,
            x: 87,
            y: 68
        }, {
            mapid: 4,
            name: "Kobalos",
            type: "MOB",
            icon: 304,
            x: 89,
            y: 23
        }, {
            mapid: 4,
            name: "Sand Golem",
            type: "MOB",
            icon: 162,
            x: 83,
            y: 84
        }, {
            mapid: 4,
            name: "King Cobra",
            type: "MOB",
            icon: 48,
            x: 62,
            y: 36
        }, {
            mapid: 4,
            name: "Fire Viper",
            type: "MOB",
            icon: 49,
            x: 60,
            y: 49
        }, {
            mapid: 4,
            name: "Fire Imp",
            type: "MOB",
            icon: 47,
            x: 34,
            y: 36
        }, {
            mapid: 4,
            name: "Fire Imp",
            type: "MOB",
            icon: 47,
            x: 65,
            y: 72
        }, {
            mapid: 4,
            name: "Fire Ant",
            type: "MOB",
            icon: 50,
            x: 13,
            y: 82
        }, {
            mapid: 4,
            name: "Desert Orc",
            type: "MOB",
            icon: 45,
            x: 83,
            y: 46
        }, {
            mapid: 5,
            name: "Rakblood Town",
            type: "CITY",
            x: 34,
            y: 68
        }, {
            mapid: 5,
            name: "Coal",
            type: "RESOURCE",
            icon: "pick",
            description: "40 mining",
            x: 56,
            y: 20
        }, {
            mapid: 5,
            name: "Fishing Master",
            type: "POI",
            x: 47,
            y: 76
        }, {
            mapid: 5,
            name: "Transfer to Whiland",
            description: "Leads to Dorpat",
            type: "TRAVEL",
            x: 38,
            y: 21
        }, {
            mapid: 5,
            name: "Transfer to Narwa",
            description: "Leads to Fellin Island, Blood River",
            type: "TRAVEL",
            x: 88,
            y: 91
        }, {
            mapid: 5,
            name: "Fishing Rod",
            description: "1 fishing",
            type: "RESOURCE",
            icon: "fish",
            x: 46,
            y: 79
        }, {
            mapid: 5,
            name: "Assassin",
            type: "MOB",
            icon: 186,
            x: 25,
            y: 79
        }, {
            mapid: 5,
            name: "Explorer",
            type: "MOB",
            icon: 187,
            x: 23,
            y: 66
        }, {
            mapid: 5,
            name: "Dark Orc",
            type: "MOB",
            icon: 66,
            x: 34,
            y: 83
        }, {
            mapid: 5,
            name: "Bronze Golem",
            type: "MOB",
            icon: 60,
            x: 14,
            y: 42
        }, {
            mapid: 5,
            name: "Azure Golem",
            type: "MOB",
            icon: 59,
            x: 17,
            y: 12
        }, {
            mapid: 5,
            name: "Iron Golem",
            type: "MOB",
            icon: 62,
            x: 55,
            y: 25
        }, {
            mapid: 5,
            name: "Coal Golem",
            type: "MOB",
            icon: 61,
            x: 72,
            y: 20
        }, {
            mapid: 5,
            name: "Steel Golem",
            type: "MOB",
            icon: 63,
            x: 65,
            y: 45
        }, {
            mapid: 5,
            name: "Thief",
            type: "MOB",
            icon: 185,
            x: 37,
            y: 44
        }, {
            mapid: 5,
            name: "Rock Spirit",
            type: "MOB",
            icon: 64,
            x: 45,
            y: 85
        }, {
            mapid: 5,
            name: "Mutated Hydra",
            type: "MOB",
            icon: 65,
            x: 51,
            y: 88
        }, {
            mapid: 5,
            name: "Giant Troll",
            type: "MOB",
            icon: 303,
            x: 60,
            y: 79
        }, {
            mapid: 5,
            name: "Emerald Dragon",
            type: "MOB",
            icon: 126,
            x: 63,
            y: 71
        }, {
            mapid: 6,
            name: "Blood River Town",
            type: "CITY",
            x: 35,
            y: 86
        }, {
            mapid: 6,
            name: "Fire Altar",
            type: "POI",
            x: 78,
            y: 42
        }, {
            mapid: 6,
            name: "Platinum",
            description: "75 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 43,
            y: 46
        }, {
            mapid: 6,
            name: "Azure",
            description: "60 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 63,
            y: 33
        }, {
            mapid: 6,
            name: "Azure",
            description: "60 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 85,
            y: 49
        }, {
            mapid: 6,
            name: "Transfer to Narwa",
            description: "Leads to Fellin Island, Rakblood",
            type: "TRAVEL",
            x: 29,
            y: 42
        }, {
            mapid: 6,
            name: "Transfer to Hell",
            description: "",
            type: "TRAVEL",
            x: 59,
            y: 21
        }, {
            mapid: 6,
            name: "Blood Lizard",
            type: "MOB",
            icon: 90,
            x: 61,
            y: 25
        }, {
            mapid: 6,
            name: "Flame Phoenix",
            type: "MOB",
            icon: 87,
            x: 45,
            y: 46
        }, {
            mapid: 6,
            name: "Flame Phoenix",
            type: "MOB",
            icon: 87,
            x: 65,
            y: 31
        }, {
            mapid: 6,
            name: "Efreet",
            type: "MOB",
            icon: 22,
            x: 61,
            y: 37
        }, {
            mapid: 6,
            name: "Efreet",
            type: "MOB",
            icon: 22,
            x: 52,
            y: 60
        }, {
            mapid: 6,
            name: "Efreet",
            type: "MOB",
            icon: 22,
            x: 30,
            y: 29
        }, {
            mapid: 6,
            name: "Cursed Dragon",
            type: "MOB",
            icon: 26,
            x: 55,
            y: 74
        }, {
            mapid: 6,
            name: "Fire Imp",
            type: "MOB",
            icon: 47,
            x: 65,
            y: 88
        }, {
            mapid: 6,
            name: "Fire Imp",
            type: "MOB",
            icon: 47,
            x: 23,
            y: 53
        }, {
            mapid: 6,
            name: "Ruby Dragon",
            type: "MOB",
            icon: 27,
            x: 75,
            y: 83
        }, {
            mapid: 6,
            name: "Ruby Dragon",
            type: "MOB",
            icon: 27,
            x: 39,
            y: 14
        }, {
            mapid: 6,
            name: "Ruby Dragon",
            type: "MOB",
            icon: 27,
            x: 32,
            y: 67
        }, {
            mapid: 6,
            name: "Adult Ruby Dragon",
            type: "MOB",
            icon: 184,
            x: 82,
            y: 30
        }, {
            mapid: 6,
            name: "Adult Ruby Dragon",
            type: "MOB",
            icon: 184,
            x: 73,
            y: 15
        }, {
            mapid: 6,
            name: "King Ruby Dragon",
            type: "MOB",
            icon: 24,
            x: 90,
            y: 60
        }, {
            mapid: 6,
            name: "King Ruby Dragon",
            type: "MOB",
            icon: 24,
            x: 28,
            y: 81
        }, {
            mapid: 6,
            name: "Fire Centipede",
            type: "MOB",
            icon: 159,
            x: 89,
            y: 82
        }, {
            mapid: 6,
            name: "Flame Wyvern",
            type: "MOB",
            icon: 181,
            x: 75,
            y: 65
        }, {
            mapid: 6,
            name: "Fire Behemoth",
            type: "MOB",
            icon: 88,
            x: 69,
            y: 48
        }, {
            mapid: 6,
            name: "Archdevil",
            type: "MOB",
            icon: 19,
            x: 19,
            y: 16
        }, {
            mapid: 6,
            name: "Archdevil",
            type: "MOB",
            icon: 19,
            x: 17,
            y: 36
        }, {
            mapid: 6,
            name: "Fire Viper",
            type: "MOB",
            icon: 49,
            x: 18,
            y: 87
        }, {
            mapid: 7,
            name: "Hell Town",
            type: "CITY",
            x: 31,
            y: 22
        }, {
            mapid: 7,
            name: "Diablo",
            type: "BOSS",
            cblevel: 800,
            x: 11,
            y: 79
        }, {
            mapid: 7,
            name: "Platinum",
            description: "75 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 48,
            y: 38
        }, {
            mapid: 7,
            name: "King Ruby Dragon",
            type: "MOB",
            icon: 24,
            x: 8,
            y: 69
        }, {
            mapid: 7,
            name: "King Ruby Dragon",
            type: "MOB",
            icon: 24,
            x: 27,
            y: 53
        }, {
            mapid: 7,
            name: "Adult Ruby Dragon",
            type: "MOB",
            icon: 184,
            x: 80,
            y: 29
        }, {
            mapid: 7,
            name: "Adult Ruby Dragon",
            type: "MOB",
            icon: 184,
            x: 89,
            y: 15
        }, {
            mapid: 7,
            name: "Ruby Dragon",
            type: "MOB",
            icon: 27,
            x: 40,
            y: 12
        }, {
            mapid: 7,
            name: "Ruby Dragon",
            type: "MOB",
            icon: 27,
            x: 16,
            y: 76
        }, {
            mapid: 7,
            name: "Ghost Dragon",
            type: "MOB",
            icon: 23,
            x: 31,
            y: 59
        }, {
            mapid: 7,
            name: "Flame Phoenix",
            type: "MOB",
            icon: 87,
            x: 11,
            y: 48
        }, {
            mapid: 7,
            name: "Flame Phoenix",
            type: "MOB",
            icon: 87,
            x: 85,
            y: 87
        }, {
            mapid: 7,
            name: "Fire Spirit",
            type: "MOB",
            icon: 191,
            x: 81,
            y: 82
        }, {
            mapid: 7,
            name: "Fire Behemoth",
            type: "MOB",
            icon: 88,
            x: 13,
            y: 15
        }, {
            mapid: 7,
            name: "Fire Behemoth",
            type: "MOB",
            icon: 88,
            x: 81,
            y: 63
        }, {
            mapid: 7,
            name: "Fire Dragon",
            type: "MOB",
            icon: 253,
            x: 71,
            y: 90
        }, {
            mapid: 7,
            name: "Fire Dragon",
            type: "MOB",
            icon: 253,
            x: 51,
            y: 34
        }, {
            mapid: 7,
            name: "Cursed Dragon",
            type: "MOB",
            icon: 26,
            x: 59,
            y: 34
        }, {
            mapid: 7,
            name: "Hell Angel",
            type: "MOB",
            icon: 91,
            x: 47,
            y: 89
        }, {
            mapid: 7,
            name: "Blood Lizard",
            type: "MOB",
            icon: 90,
            x: 26,
            y: 90
        }, {
            mapid: 7,
            name: "Blood Lizard",
            type: "MOB",
            icon: 90,
            x: 59,
            y: 67
        }, {
            mapid: 7,
            name: "Blood Lizard",
            type: "MOB",
            icon: 90,
            x: 43,
            y: 58
        }, {
            mapid: 7,
            name: "Blood Lizard",
            type: "MOB",
            icon: 90,
            x: 34,
            y: 54
        }, {
            mapid: 7,
            name: "Lava Shroom",
            type: "MOB",
            icon: 41,
            x: 89,
            y: 47
        }, {
            mapid: 7,
            name: "Lava Shroom",
            type: "MOB",
            icon: 41,
            x: 89,
            y: 12
        }, {
            mapid: 7,
            name: "Lava Shroom",
            type: "MOB",
            icon: 41,
            x: 55,
            y: 6
        }, {
            mapid: 7,
            name: "Fire Shroom",
            type: "MOB",
            icon: 40,
            x: 87,
            y: 25
        }, {
            mapid: 7,
            name: "Fire Shroom",
            type: "MOB",
            icon: 40,
            x: 85,
            y: 10
        }, {
            mapid: 7,
            name: "Fire Shroom",
            type: "MOB",
            icon: 40,
            x: 57,
            y: 8
        }, {
            mapid: 7,
            name: "Flame Wyvern",
            type: "MOB",
            icon: 181,
            x: 86,
            y: 31
        }, {
            mapid: 7,
            name: "Flame Wyvern",
            type: "MOB",
            icon: 181,
            x: 57,
            y: 11
        }, {
            mapid: 7,
            name: "Archdevil",
            type: "MOB",
            icon: 19,
            x: 59,
            y: 23
        }, {
            mapid: 7,
            name: "Flaming Giant",
            type: "MOB",
            icon: 89,
            x: 70,
            y: 45
        }, {
            mapid: 7,
            name: "Ruby Dragon",
            type: "MOB",
            icon: 27,
            x: 85,
            y: 45
        }, {
            mapid: 7,
            name: "Efreet",
            type: "MOB",
            icon: 22,
            x: 31,
            y: 32
        }, {
            mapid: 7,
            name: "Efreet",
            type: "MOB",
            icon: 22,
            x: 21,
            y: 49
        }, {
            mapid: 7,
            name: "Azure",
            description: "60 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 34,
            y: 65
        }, {
            mapid: 7,
            name: "Azure",
            description: "60 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 62,
            y: 48
        }, {
            mapid: 7,
            name: "Fire Stone",
            description: "80 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 89,
            y: 93
        }, {
            mapid: 7,
            name: "Transfer to Blood River",
            description: "",
            type: "TRAVEL",
            x: 40,
            y: 57
        }, {
            mapid: 8,
            name: "Clouds Town",
            type: "CITY",
            x: 60,
            y: 72
        }, {
            mapid: 8,
            name: "Acid Dragon Lord",
            type: "BOSS",
            cblevel: 3987,
            x: 46,
            y: 37
        }, {
            mapid: 8,
            name: "Air Altar",
            type: "POI",
            x: 13,
            y: 68
        }, {
            mapid: 8,
            name: "White Gold",
            description: "55 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 52,
            y: 18
        }, {
            mapid: 8,
            name: "Beholder",
            type: "MOB",
            icon: 114,
            x: 29,
            y: 17
        }, {
            mapid: 8,
            name: "Beholder",
            type: "MOB",
            icon: 114,
            x: 24,
            y: 32
        }, {
            mapid: 8,
            name: "Archangel",
            type: "MOB",
            icon: 18,
            x: 23,
            y: 44
        }, {
            mapid: 8,
            name: "Blood Battlemage",
            type: "MOB",
            icon: 116,
            x: 35,
            y: 49
        }, {
            mapid: 8,
            name: "Griffin",
            type: "MOB",
            icon: 107,
            x: 38,
            y: 30
        }, {
            mapid: 8,
            name: "Baby Griffin",
            type: "MOB",
            icon: 106,
            x: 40,
            y: 16
        }, {
            mapid: 8,
            name: "Royal Griffin",
            type: "MOB",
            icon: 110,
            x: 9,
            y: 91
        }, {
            mapid: 8,
            name: "Baby Griffin",
            type: "MOB",
            icon: 106,
            x: 22,
            y: 81
        }, {
            mapid: 8,
            name: "Griffin",
            type: "MOB",
            icon: 107,
            x: 35,
            y: 90
        }, {
            mapid: 8,
            name: "Naga",
            type: "MOB",
            icon: 109,
            x: 32,
            y: 68
        }, {
            mapid: 8,
            name: "Ettin",
            type: "MOB",
            icon: 115,
            x: 70,
            y: 46
        }, {
            mapid: 8,
            name: "Chaos Vortex",
            type: "MOB",
            icon: 174,
            x: 84,
            y: 39
        }, {
            mapid: 8,
            name: "Chaos Vortex",
            type: "MOB",
            icon: 174,
            x: 93,
            y: 67
        }, {
            mapid: 8,
            name: "Beholder King",
            type: "MOB",
            icon: 113,
            x: 83,
            y: 29
        }, {
            mapid: 8,
            name: "Beholder King",
            type: "MOB",
            icon: 113,
            x: 86,
            y: 46
        }, {
            mapid: 8,
            name: "Royal Griffin",
            type: "MOB",
            icon: 110,
            x: 89,
            y: 21
        }, {
            mapid: 8,
            name: "Royal Griffin",
            type: "MOB",
            icon: 110,
            x: 53,
            y: 15
        }, {
            mapid: 8,
            name: "Wind Protector",
            type: "MOB",
            icon: 58,
            x: 84,
            y: 11
        }, {
            mapid: 8,
            name: "Beholder King",
            type: "MOB",
            icon: 113,
            x: 70,
            y: 30
        }, {
            mapid: 8,
            name: "Archangel",
            type: "MOB",
            icon: 18,
            x: 65,
            y: 15
        }, {
            mapid: 8,
            name: "Archangel",
            type: "MOB",
            icon: 18,
            x: 11,
            y: 40
        }, {
            mapid: 8,
            name: "Naga",
            type: "MOB",
            icon: 109,
            x: 57,
            y: 30
        }, {
            mapid: 8,
            name: "Royal Griffin",
            type: "MOB",
            icon: 110,
            x: 54,
            y: 44
        }, {
            mapid: 8,
            name: "Zeus",
            icon: 99,
            type: "MOB",
            x: 71,
            y: 54
        }, {
            mapid: 8,
            name: "Zeus",
            icon: 99,
            type: "MOB",
            x: 77,
            y: 43
        }, {
            mapid: 8,
            name: "Zeus",
            icon: 99,
            type: "MOB",
            x: 76,
            y: 36
        }, {
            mapid: 8,
            name: "Zeus",
            icon: 99,
            type: "MOB",
            x: 94,
            y: 33
        }, {
            mapid: 8,
            name: "King Sapphire Dragon",
            icon: 112,
            type: "MOB",
            x: 63,
            y: 78
        }, {
            mapid: 8,
            name: "Adult Sapphire Dragon",
            icon: 111,
            type: "MOB",
            x: 53,
            y: 77
        }, {
            mapid: 8,
            name: "King Black Dragon",
            icon: 108,
            type: "MOB",
            x: 57,
            y: 61
        }, {
            mapid: 8,
            name: "King Ruby Dragon",
            icon: 24,
            type: "MOB",
            x: 60,
            y: 68
        }, {
            mapid: 8,
            name: "Ruby Dragon",
            icon: 27,
            type: "MOB",
            x: 69,
            y: 70
        }, {
            mapid: 8,
            name: "Transfer to Dorpat",
            description: "",
            type: "TRAVEL",
            x: 13,
            y: 19
        }, {
            mapid: 8,
            name: "Transfer to Heaven",
            description: "",
            type: "TRAVEL",
            x: 83,
            y: 83
        }, {
            mapid: 9,
            name: "Heaven Town",
            type: "CITY",
            x: 58,
            y: 16
        }, {
            mapid: 9,
            name: "Demon Portal",
            type: "BOSS",
            cblevel: 1500,
            x: 38,
            y: 9
        }, {
            mapid: 9,
            name: "Nephilim Warrior",
            type: "BOSS",
            cblevel: 3e3,
            x: 26,
            y: 89
        }, {
            mapid: 9,
            name: "White Gold",
            description: "55 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 79,
            y: 18
        }, {
            mapid: 9,
            name: "Zeus",
            icon: 99,
            type: "MOB",
            x: 89,
            y: 40
        }, {
            mapid: 9,
            name: "Flame Phoenix",
            icon: 87,
            type: "MOB",
            x: 73,
            y: 41
        }, {
            mapid: 9,
            name: "Unicorn",
            icon: 245,
            type: "MOB",
            x: 69,
            y: 59
        }, {
            mapid: 9,
            name: "Thunder Bird",
            icon: 258,
            type: "MOB",
            x: 8,
            y: 70
        }, {
            mapid: 9,
            name: "Gandalf The Grey",
            icon: 98,
            type: "MOB",
            x: 58,
            y: 45
        }, {
            mapid: 9,
            name: "Gandalf The Grey",
            icon: 98,
            type: "MOB",
            x: 81,
            y: 15
        }, {
            mapid: 9,
            name: "Thunder Angel",
            icon: 269,
            type: "MOB",
            x: 54,
            y: 62
        }, {
            mapid: 9,
            name: "Confused Merlin",
            icon: 95,
            type: "MOB",
            x: 53,
            y: 74
        }, {
            mapid: 9,
            name: "Dwarf Battlemage",
            icon: 94,
            type: "MOB",
            x: 29,
            y: 66
        }, {
            mapid: 9,
            name: "Dwarf Battlemage",
            icon: 94,
            type: "MOB",
            x: 88,
            y: 29
        }, {
            mapid: 9,
            name: "Merlin",
            icon: 96,
            type: "MOB",
            x: 85,
            y: 33
        }, {
            mapid: 9,
            name: "King Black Dragon",
            icon: 108,
            type: "MOB",
            x: 25,
            y: 79
        }, {
            mapid: 9,
            name: "Young Gandalf",
            icon: 97,
            type: "MOB",
            x: 40,
            y: 31
        }, {
            mapid: 9,
            name: "Young Gandalf",
            icon: 97,
            type: "MOB",
            x: 75,
            y: 85
        }, {
            mapid: 9,
            name: "Battlemage",
            icon: 93,
            type: "MOB",
            x: 16,
            y: 50
        }, {
            mapid: 9,
            name: "Battlemage",
            icon: 93,
            type: "MOB",
            x: 66,
            y: 82
        }, {
            mapid: 9,
            name: "Adult Sapphire Dragon",
            icon: 111,
            type: "MOB",
            x: 20,
            y: 24
        }, {
            mapid: 9,
            name: "Adult Sapphire Dragon",
            icon: 111,
            type: "MOB",
            x: 81,
            y: 51
        }, {
            mapid: 9,
            name: "King Sapphire Dragon",
            icon: 112,
            type: "MOB",
            x: 39,
            y: 44
        }, {
            mapid: 9,
            name: "King Sapphire Dragon",
            icon: 112,
            type: "MOB",
            x: 23,
            y: 11
        }, {
            mapid: 9,
            name: "King Sapphire Dragon",
            icon: 112,
            type: "MOB",
            x: 85,
            y: 68
        }, {
            mapid: 9,
            name: "King Gilded Dragon",
            icon: 244,
            type: "MOB",
            x: 84,
            y: 84
        }, {
            mapid: 9,
            name: "Death Angel",
            icon: 105,
            type: "MOB",
            x: 39,
            y: 13
        }, {
            mapid: 9,
            name: "Transfer to Clouds",
            description: "",
            type: "TRAVEL",
            x: 15,
            y: 21
        }, {
            mapid: 10,
            name: "Cesis Town",
            type: "CITY",
            x: 58,
            y: 64
        }, {
            mapid: 10,
            name: "Fishing Rod",
            description: "1 fishing",
            type: "RESOURCE",
            icon: "fish",
            x: 51,
            y: 66
        }, {
            mapid: 10,
            name: "Ancient Hydra",
            type: "BOSS",
            cblevel: 1e3,
            x: 60,
            y: 89
        }, {
            mapid: 10,
            name: "Maple",
            description: "35 woodcutting",
            icon: "wood",
            type: "RESOURCE",
            x: 71,
            y: 32
        }, {
            mapid: 10,
            name: "Blue Palm",
            description: "55 woodcutting",
            icon: "wood2",
            type: "RESOURCE",
            x: 10,
            y: 38
        }, {
            mapid: 10,
            name: "Magic Oak",
            description: "65 woodcutting",
            icon: "wood2",
            type: "RESOURCE",
            x: 77,
            y: 28
        }, {
            mapid: 10,
            name: "Transfer to Reval",
            description: "Leads to Dorpat, Pernau",
            type: "TRAVEL",
            x: 48,
            y: 17
        }, {
            mapid: 10,
            name: "Transfer to Ancient Dungeon",
            description: "",
            type: "TRAVEL",
            x: 20,
            y: 92
        }, {
            mapid: 10,
            name: "King Emerald Dragon",
            type: "MOB",
            icon: 128,
            x: 52,
            y: 35
        }, {
            mapid: 10,
            name: "King Emerald Dragon",
            type: "MOB",
            icon: 128,
            x: 57,
            y: 80
        }, {
            mapid: 10,
            name: "Grass Killer",
            type: "MOB",
            icon: 195,
            x: 31,
            y: 13
        }, {
            mapid: 10,
            name: "Grass Killer",
            type: "MOB",
            icon: 195,
            x: 17,
            y: 69
        }, {
            mapid: 10,
            name: "Grass Killer",
            type: "MOB",
            icon: 195,
            x: 42,
            y: 61
        }, {
            mapid: 10,
            name: "Barbarian Shaman",
            type: "MOB",
            icon: 132,
            x: 31,
            y: 33
        }, {
            mapid: 10,
            name: "Barbarian Shaman",
            type: "MOB",
            icon: 132,
            x: 76,
            y: 21
        }, {
            mapid: 10,
            name: "Emerald Dragon",
            type: "MOB",
            icon: 126,
            x: 21,
            y: 48
        }, {
            mapid: 10,
            name: "Emerald Dragon",
            type: "MOB",
            icon: 126,
            x: 35,
            y: 64
        }, {
            mapid: 10,
            name: "Barbarian Berserker",
            type: "MOB",
            icon: 133,
            x: 26,
            y: 75
        }, {
            mapid: 10,
            name: "Barbarian Berserker",
            type: "MOB",
            icon: 133,
            x: 84,
            y: 85
        }, {
            mapid: 10,
            name: "Emerald Plant",
            type: "MOB",
            icon: 194,
            x: 17,
            y: 83
        }, {
            mapid: 10,
            name: "Adult Emerald Dragon",
            type: "MOB",
            icon: 127,
            x: 9,
            y: 31
        }, {
            mapid: 10,
            name: "Adult Emerald Dragon",
            type: "MOB",
            icon: 127,
            x: 39,
            y: 82
        }, {
            mapid: 10,
            name: "Grass Snake",
            type: "MOB",
            icon: 130,
            x: 43,
            y: 46
        }, {
            mapid: 10,
            name: "Grass Snake",
            type: "MOB",
            icon: 130,
            x: 77,
            y: 15
        }, {
            mapid: 10,
            name: "Grass Snake",
            type: "MOB",
            icon: 130,
            x: 78,
            y: 39
        }, {
            mapid: 10,
            name: "Baby Emerald Dragon",
            type: "MOB",
            icon: 125,
            x: 36,
            y: 21
        }, {
            mapid: 10,
            name: "Baby Emerald Dragon",
            type: "MOB",
            icon: 125,
            x: 48,
            y: 27
        }, {
            mapid: 10,
            name: "Baby Emerald Dragon",
            type: "MOB",
            icon: 125,
            x: 56,
            y: 23
        }, {
            mapid: 10,
            name: "Naga",
            type: "MOB",
            icon: 109,
            x: 67,
            y: 17
        }, {
            mapid: 10,
            name: "Naga",
            type: "MOB",
            icon: 109,
            x: 87,
            y: 18
        }, {
            mapid: 10,
            name: "Barbarian Ghost",
            type: "MOB",
            icon: 131,
            x: 19,
            y: 34
        }, {
            mapid: 10,
            name: "Barbarian Ghost",
            type: "MOB",
            icon: 131,
            x: 82,
            y: 51
        }, {
            mapid: 10,
            name: "Poisonous Behemoth",
            type: "MOB",
            icon: 193,
            x: 12,
            y: 18
        }, {
            mapid: 10,
            name: "Poisonous Behemoth",
            type: "MOB",
            icon: 193,
            x: 75,
            y: 75
        }, {
            mapid: 10,
            name: "Moss Wyvern",
            type: "MOB",
            icon: 129,
            x: 64,
            y: 84
        }, {
            mapid: 11,
            name: "Walco Town",
            type: "CITY",
            x: 22,
            y: 29
        }, {
            mapid: 11,
            name: "Reaper",
            type: "BOSS",
            cblevel: 600,
            x: 45,
            y: 70
        }, {
            mapid: 11,
            name: "Spirit Log",
            description: "45 woodcutting",
            icon: "wood2",
            type: "RESOURCE",
            x: 29,
            y: 44
        }, {
            mapid: 11,
            name: "Spirit Log",
            description: "45 woodcutting",
            icon: "wood2",
            type: "RESOURCE",
            x: 58,
            y: 33
        }, {
            mapid: 11,
            name: "Spirit Log",
            description: "45 woodcutting",
            icon: "wood2",
            type: "RESOURCE",
            x: 38,
            y: 21
        }, {
            mapid: 11,
            name: "Transfer to Dorpat",
            description: "",
            type: "TRAVEL",
            x: 9,
            y: 84
        }, {
            mapid: 11,
            name: "Shadow Ghost",
            type: "MOB",
            icon: 134,
            x: 16,
            y: 79
        }, {
            mapid: 11,
            name: "Ghost",
            type: "MOB",
            icon: 9,
            x: 23,
            y: 68
        }, {
            mapid: 11,
            name: "Poltergeist",
            type: "MOB",
            icon: 136,
            x: 20,
            y: 39
        }, {
            mapid: 11,
            name: "Energy Ghost",
            type: "MOB",
            icon: 137,
            x: 32,
            y: 20
        }, {
            mapid: 11,
            name: "Skeleton Assassin",
            type: "MOB",
            icon: 138,
            x: 30,
            y: 35
        }, {
            mapid: 11,
            name: "Ghost Dragon",
            type: "MOB",
            icon: 23,
            x: 67,
            y: 53
        }, {
            mapid: 11,
            name: "Vampire",
            type: "MOB",
            icon: 11,
            x: 55,
            y: 45
        }, {
            mapid: 11,
            name: "Vampire Lord",
            type: "MOB",
            icon: 28,
            x: 46,
            y: 74
        }, {
            mapid: 11,
            name: "Spirit",
            type: "MOB",
            icon: 135,
            x: 23,
            y: 55
        }, {
            mapid: 11,
            name: "Skeleton",
            type: "MOB",
            icon: 10,
            x: 76,
            y: 39
        }, {
            mapid: 11,
            name: "Skeleton Knight",
            type: "MOB",
            icon: 67,
            x: 79,
            y: 70
        }, {
            mapid: 13,
            name: "Campfire",
            description: "(There is no chest in Pernau)",
            type: "POI",
            x: 90,
            y: 13
        }, {
            mapid: 13,
            name: "Pharaoh",
            type: "BOSS",
            cblevel: 1300,
            x: 12,
            y: 45
        }, {
            mapid: 13,
            name: "Transfer to Reval",
            description: "",
            type: "TRAVEL",
            x: 85,
            y: 80
        }, {
            mapid: 13,
            name: "Transfer to Pernau Desert",
            description: "",
            type: "TRAVEL",
            x: 40,
            y: 57
        }, {
            mapid: 13,
            name: "Transfer to Pernau Desert",
            description: "",
            type: "TRAVEL",
            x: 11,
            y: 23
        }, {
            mapid: 13,
            name: "Transfer to Pernau Pyramid",
            description: "",
            type: "TRAVEL",
            x: 37,
            y: 42
        }, {
            mapid: 13,
            name: "Transfer to Lion's Den",
            description: "Leads to Pharaoh",
            type: "TRAVEL",
            x: 55,
            y: 10
        }, {
            mapid: 13,
            name: "Transfer to Lion's Den",
            description: "",
            type: "TRAVEL",
            x: 6,
            y: 32
        }, {
            mapid: 13,
            name: "Transfer to Pharaoh",
            description: "",
            type: "TRAVEL",
            x: 7,
            y: 12
        }, {
            mapid: 13,
            name: "Shopkeeper",
            type: "POI",
            x: 15,
            y: 8
        }, {
            mapid: 13,
            name: "Mummy",
            type: "MOB",
            icon: 163,
            x: 83,
            y: 88
        }, {
            mapid: 13,
            name: "Mummy",
            type: "MOB",
            icon: 163,
            x: 53,
            y: 71
        }, {
            mapid: 13,
            name: "White Wall",
            type: "MOB",
            icon: 179,
            x: 88,
            y: 92
        }, {
            mapid: 13,
            name: "White Wall",
            type: "MOB",
            icon: 179,
            x: 88,
            y: 69
        }, {
            mapid: 13,
            name: "White Wall",
            type: "MOB",
            icon: 179,
            x: 91,
            y: 55
        }, {
            mapid: 13,
            name: "White Wall",
            type: "MOB",
            icon: 179,
            x: 80,
            y: 55
        }, {
            mapid: 13,
            name: "Rotting Mummy",
            type: "MOB",
            icon: 164,
            x: 87,
            y: 74
        }, {
            mapid: 13,
            name: "Rotting Mummy",
            type: "MOB",
            icon: 164,
            x: 66,
            y: 81
        }, {
            mapid: 13,
            name: "Rotting Mummy",
            type: "MOB",
            icon: 164,
            x: 76,
            y: 71
        }, {
            mapid: 13,
            name: "Skeleton Lord",
            type: "MOB",
            icon: 176,
            x: 92,
            y: 74
        }, {
            mapid: 13,
            name: "Skeleton Lord",
            type: "MOB",
            icon: 176,
            x: 82,
            y: 58
        }, {
            mapid: 13,
            name: "Skeleton Lord",
            type: "MOB",
            icon: 176,
            x: 59,
            y: 91
        }, {
            mapid: 13,
            name: "Skeleton Lord",
            type: "MOB",
            icon: 176,
            x: 33,
            y: 64
        }, {
            mapid: 13,
            name: "Skeleton Mage",
            type: "MOB",
            icon: 177,
            x: 91,
            y: 64
        }, {
            mapid: 13,
            name: "Skeleton Mage",
            type: "MOB",
            icon: 177,
            x: 79,
            y: 66
        }, {
            mapid: 13,
            name: "Phantom Skull",
            type: "MOB",
            icon: 170,
            x: 80,
            y: 62
        }, {
            mapid: 13,
            name: "Ice Mummy",
            type: "MOB",
            icon: 165,
            x: 76,
            y: 81
        }, {
            mapid: 13,
            name: "Ice Mummy",
            type: "MOB",
            icon: 165,
            x: 58,
            y: 85
        }, {
            mapid: 13,
            name: "Ice Mummy",
            type: "MOB",
            icon: 165,
            x: 41,
            y: 71
        }, {
            mapid: 13,
            name: "DarkElf Mage",
            type: "MOB",
            icon: 161,
            x: 58,
            y: 89
        }, {
            mapid: 13,
            name: "Skeleton King",
            type: "MOB",
            icon: 175,
            x: 60,
            y: 91
        }, {
            mapid: 13,
            name: "Skeleton King",
            type: "MOB",
            icon: 175,
            x: 24,
            y: 65
        }, {
            mapid: 13,
            name: "Emerald Mummy",
            type: "MOB",
            icon: 166,
            x: 62,
            y: 62
        }, {
            mapid: 13,
            name: "Emerald Mummy",
            type: "MOB",
            icon: 166,
            x: 43,
            y: 59
        }, {
            mapid: 13,
            name: "Sand Golem",
            type: "MOB",
            icon: 162,
            x: 45,
            y: 85
        }, {
            mapid: 13,
            name: "White Hard Wall",
            type: "MOB",
            icon: 180,
            x: 39,
            y: 67
        }, {
            mapid: 13,
            name: "White Hard Wall",
            type: "MOB",
            icon: 180,
            x: 36,
            y: 64
        }, {
            mapid: 13,
            name: "White Hard Wall",
            type: "MOB",
            icon: 180,
            x: 40,
            y: 61
        }, {
            mapid: 13,
            name: "White Hard Wall",
            type: "MOB",
            icon: 180,
            x: 46,
            y: 54
        }, {
            mapid: 13,
            name: "Flame Phoenix",
            type: "MOB",
            icon: 87,
            x: 27,
            y: 69
        }, {
            mapid: 13,
            name: "Sand Centipede",
            type: "MOB",
            icon: 157,
            x: 32,
            y: 36
        }, {
            mapid: 13,
            name: "Rock Centipede",
            type: "MOB",
            icon: 158,
            x: 39,
            y: 19
        }, {
            mapid: 13,
            name: "Fire Centipede",
            type: "MOB",
            icon: 159,
            x: 55,
            y: 33
        }, {
            mapid: 13,
            name: "Gilded Mummy",
            type: "MOB",
            icon: 167,
            x: 61,
            y: 40
        }, {
            mapid: 13,
            name: "Gilded Mummy",
            type: "MOB",
            icon: 167,
            x: 59,
            y: 19
        }, {
            mapid: 13,
            name: "Skeletal Dragon",
            type: "MOB",
            icon: 160,
            x: 66,
            y: 45
        }, {
            mapid: 13,
            name: "Diamond Mummy",
            type: "MOB",
            icon: 169,
            x: 79,
            y: 21
        }, {
            mapid: 13,
            name: "Deathstalker Scorpion",
            type: "MOB",
            icon: 171,
            x: 75,
            y: 43
        }, {
            mapid: 13,
            name: "Deathstalker Scorpion",
            type: "MOB",
            icon: 171,
            x: 89,
            y: 45
        }, {
            mapid: 13,
            name: "Emperor Scorpion",
            type: "MOB",
            icon: 172,
            x: 82,
            y: 41
        }, {
            mapid: 13,
            name: "War Elephant",
            type: "MOB",
            icon: 173,
            x: 85,
            y: 25
        }, {
            mapid: 13,
            name: "Amethyst Mummy",
            type: "MOB",
            icon: 168,
            x: 66,
            y: 13
        }, {
            mapid: 13,
            name: "Lion",
            type: "MOB",
            icon: 190,
            x: 16,
            y: 15
        }, {
            mapid: 13,
            name: "Earth Dragon",
            type: "MOB",
            icon: 251,
            x: 11,
            y: 34
        }, {
            mapid: 13,
            name: "Fire Dragon",
            type: "MOB",
            icon: 253,
            x: 19,
            y: 45
        }, {
            mapid: 13,
            name: "Void Dragon",
            type: "MOB",
            icon: 254,
            x: 7,
            y: 43
        }, {
            mapid: 14,
            name: "Fishing Guild",
            description: "Requires Fishing Guild permission and 80 fishing.",
            type: "POI",
            x: 79,
            y: 32
        }, {
            mapid: 14,
            name: "Transfer to Dragon's Lair",
            description: "",
            type: "TRAVEL",
            x: 41,
            y: 48
        }, {
            mapid: 14,
            name: "Transfer to Narwa",
            description: "",
            type: "TRAVEL",
            x: 10,
            y: 26
        }, {
            mapid: 14,
            name: "Gilded Dragon",
            type: "MOB",
            icon: 248,
            x: 45,
            y: 51
        }, {
            mapid: 14,
            name: "Naga",
            type: "MOB",
            icon: 109,
            x: 26,
            y: 63
        }, {
            mapid: 14,
            name: "Poisonous Behemoth",
            type: "MOB",
            icon: 193,
            x: 36,
            y: 77
        }, {
            mapid: 14,
            name: "Barbarian Berserker",
            type: "MOB",
            icon: 133,
            x: 69,
            y: 74
        }, {
            mapid: 14,
            name: "Barbarian Shaman",
            type: "MOB",
            icon: 132,
            x: 58,
            y: 63
        }, {
            mapid: 14,
            name: "Skeletal Dragon",
            type: "MOB",
            icon: 160,
            x: 72,
            y: 49
        }, {
            mapid: 14,
            name: "Barbarian Ghost",
            type: "MOB",
            icon: 131,
            x: 68,
            y: 34
        }, {
            mapid: 14,
            name: "Grass Snake",
            type: "MOB",
            icon: 130,
            x: 51,
            y: 27
        }, {
            mapid: 14,
            name: "Behemoth",
            type: "MOB",
            icon: 20,
            x: 31,
            y: 35
        }, {
            mapid: 14,
            name: "Dragonfly",
            type: "MOB",
            icon: 120,
            x: 36,
            y: 18
        }, {
            mapid: 14,
            name: "Fishing Rod",
            description: "1 fishing",
            type: "RESOURCE",
            icon: "fish",
            x: 87,
            y: 31
        }, {
            mapid: 14,
            name: "Iron Fishing Rod",
            description: "65 fishing",
            type: "RESOURCE",
            icon: "ironrod",
            x: 89,
            y: 31
        }, {
            mapid: 14,
            name: "Fishing Net",
            description: "5 fishing",
            type: "RESOURCE",
            icon: "net",
            x: 88,
            y: 36
        }, {
            mapid: 14,
            name: "Cage",
            description: "35 fishing",
            icon: "cage",
            type: "RESOURCE",
            x: 85,
            y: 32
        }, {
            mapid: 14,
            name: "Wooden Harpoon",
            description: "50 fishing",
            type: "RESOURCE",
            icon: "woodharp",
            x: 88,
            y: 27
        }, {
            mapid: 14,
            name: "Steel Harpoon",
            description: "63 fishing",
            type: "RESOURCE",
            icon: "steelharp",
            x: 87,
            y: 81
        }, {
            mapid: 15,
            name: "Dragon's Lair Outpost",
            description: "",
            type: "CITY",
            x: 49,
            y: 45
        }, {
            mapid: 15,
            name: "Chaotic Dragon",
            description: "",
            type: "BOSS",
            cblevel: 2100,
            x: 71,
            y: 21
        }, {
            mapid: 15,
            name: "Fire Stone",
            description: "80 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 77,
            y: 69
        }, {
            mapid: 15,
            name: "Ruby Dragon",
            type: "MOB",
            icon: 27,
            x: 49,
            y: 34
        }, {
            mapid: 15,
            name: "Adult Ruby Dragon",
            type: "MOB",
            icon: 184,
            x: 48,
            y: 24
        }, {
            mapid: 15,
            name: "King Ruby Dragon",
            type: "MOB",
            icon: 24,
            x: 54,
            y: 16
        }, {
            mapid: 15,
            name: "Fire Dragon",
            type: "MOB",
            icon: 253,
            x: 68,
            y: 17
        }, {
            mapid: 15,
            name: "Ghost Dragon",
            type: "MOB",
            icon: 23,
            x: 61,
            y: 43
        }, {
            mapid: 15,
            name: "Skeletal Dragon",
            type: "MOB",
            icon: 160,
            x: 72,
            y: 39
        }, {
            mapid: 15,
            name: "Void Dragon",
            type: "MOB",
            icon: 254,
            x: 77,
            y: 57
        }, {
            mapid: 15,
            name: "Emerald Dragon",
            type: "MOB",
            icon: 126,
            x: 40,
            y: 40
        }, {
            mapid: 15,
            name: "Adult Emerald Dragon",
            type: "MOB",
            icon: 127,
            x: 32,
            y: 39
        }, {
            mapid: 15,
            name: "King Emerald Dragon",
            type: "MOB",
            icon: 128,
            x: 16,
            y: 42
        }, {
            mapid: 15,
            name: "Adult Black Dragon",
            type: "MOB",
            icon: 249,
            x: 50,
            y: 57
        }, {
            mapid: 15,
            name: "King Black Dragon",
            type: "MOB",
            icon: 108,
            x: 48,
            y: 74
        }, {
            mapid: 15,
            name: "Metal Dragon",
            type: "MOB",
            icon: 252,
            x: 62,
            y: 69
        }, {
            mapid: 15,
            name: "Metal Dragon",
            type: "MOB",
            icon: 252,
            x: 74,
            y: 72
        }, {
            mapid: 15,
            name: "Earth Dragon",
            type: "MOB",
            icon: 251,
            x: 12,
            y: 77
        }, {
            mapid: 15,
            name: "Gilded Dragon",
            type: "MOB",
            icon: 248,
            x: 39,
            y: 55
        }, {
            mapid: 15,
            name: "Adult Gilded Dragon",
            type: "MOB",
            icon: 250,
            x: 31,
            y: 65
        }, {
            mapid: 15,
            name: "King Gilded Dragon",
            type: "MOB",
            icon: 244,
            x: 24,
            y: 62
        }, {
            mapid: 15,
            name: "Transfer to Fellin Island",
            description: "",
            type: "TRAVEL",
            x: 44,
            y: 45
        }, {
            mapid: 16,
            name: "No Man's Land Outpost",
            description: "Chest",
            type: "CITY",
            x: 15,
            y: 23
        }, {
            mapid: 16,
            name: "World Tree",
            description: "",
            type: "BOSS",
            cblevel: 3775,
            x: 84,
            y: 42
        }, {
            mapid: 16,
            name: "Fire Stone",
            description: "80 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 79,
            y: 93
        }, {
            mapid: 16,
            name: "Fir",
            description: "1 woodcutting",
            type: "RESOURCE",
            icon: "wood",
            x: 10,
            y: 19
        }, {
            mapid: 16,
            name: "Tin",
            description: "1 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 16,
            y: 37
        }, {
            mapid: 16,
            name: "Copper",
            description: "1 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 17,
            y: 35
        }, {
            mapid: 16,
            name: "Iron",
            description: "25 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 26,
            y: 42
        }, {
            mapid: 16,
            name: "Coal",
            description: "40 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 55,
            y: 18
        }, {
            mapid: 16,
            name: "Loot Master",
            description: "(NPC)",
            type: "POI",
            x: 8,
            y: 25
        }, {
            mapid: 16,
            name: "Loot Master",
            description: "(NPC)",
            type: "POI",
            x: 21,
            y: 11
        }, {
            mapid: 16,
            name: "Legendary Breeding Master",
            description: "(NPC) Shop",
            type: "POI",
            x: 11,
            y: 88
        }, {
            mapid: 16,
            name: "PVP Shopkeeper",
            description: "(NPC) Shop",
            type: "POI",
            x: 82,
            y: 66
        }, {
            mapid: 16,
            name: "Transfer to Whiland",
            description: "",
            type: "TRAVEL",
            x: 13,
            y: 14
        }, {
            mapid: 16,
            name: "Novice Knight",
            type: "MOB",
            icon: 271,
            x: 18,
            y: 27
        }, {
            mapid: 16,
            name: "Knight",
            type: "MOB",
            icon: 272,
            x: 23,
            y: 29
        }, {
            mapid: 16,
            name: "Knight",
            type: "MOB",
            icon: 272,
            x: 49,
            y: 48
        }, {
            mapid: 16,
            name: "Baron",
            type: "MOB",
            icon: 273,
            x: 73,
            y: 17
        }, {
            mapid: 16,
            name: "Baron",
            type: "MOB",
            icon: 273,
            x: 19,
            y: 52
        }, {
            mapid: 16,
            name: "Baron",
            type: "MOB",
            icon: 273,
            x: 14,
            y: 78
        }, {
            mapid: 16,
            name: "Baron",
            type: "MOB",
            icon: 273,
            x: 62,
            y: 53
        }, {
            mapid: 16,
            name: "Baron",
            type: "MOB",
            icon: 273,
            x: 54,
            y: 56
        }, {
            mapid: 16,
            name: "Baron",
            type: "MOB",
            icon: 273,
            x: 65,
            y: 39
        }, {
            mapid: 16,
            name: "Earl",
            type: "MOB",
            icon: 274,
            x: 22,
            y: 61
        }, {
            mapid: 16,
            name: "Earl",
            type: "MOB",
            icon: 274,
            x: 15,
            y: 89
        }, {
            mapid: 16,
            name: "Earl",
            type: "MOB",
            icon: 274,
            x: 74,
            y: 43
        }, {
            mapid: 16,
            name: "Prince",
            type: "MOB",
            icon: 276,
            x: 43,
            y: 87
        }, {
            mapid: 16,
            name: "Prince",
            type: "MOB",
            icon: 276,
            x: 82,
            y: 72
        }, {
            mapid: 16,
            name: "King",
            type: "MOB",
            icon: 277,
            x: 62,
            y: 81
        }, {
            mapid: 16,
            name: "King",
            type: "MOB",
            icon: 277,
            x: 84,
            y: 87
        }, {
            mapid: 16,
            name: "Marquis",
            type: "MOB",
            icon: 275,
            x: 74,
            y: 67
        }, {
            mapid: 16,
            name: "Marquis",
            type: "MOB",
            icon: 275,
            x: 68,
            y: 51
        }, {
            mapid: 16,
            name: "Marquis",
            type: "MOB",
            icon: 275,
            x: 81,
            y: 42
        }, {
            mapid: 16,
            name: "Marquis",
            type: "MOB",
            icon: 275,
            x: 52,
            y: 64
        }, {
            mapid: 17,
            name: "Ancient Dungeon Outpost",
            description: "Chest",
            type: "CITY",
            x: 44,
            y: 91
        }, {
            mapid: 17,
            name: "Ancient Magician",
            description: "(NPC) Shop",
            type: "POI",
            x: 46,
            y: 86
        }, {
            mapid: 17,
            name: "Ancient Furniture Master",
            description: "(NPC) Shop",
            type: "POI",
            x: 48,
            y: 90
        }, {
            mapid: 17,
            name: "Cannibal Plant",
            description: "",
            type: "BOSS",
            cblevel: 2100,
            x: 41,
            y: 49
        }, {
            mapid: 17,
            name: "Pyrohydra",
            description: "",
            type: "MOB",
            icon: 283,
            x: 13,
            y: 78
        }, {
            mapid: 17,
            name: "Diamond Plant",
            description: "",
            type: "MOB",
            icon: 285,
            x: 27,
            y: 63
        }, {
            mapid: 17,
            name: "Diamond Plant",
            description: "",
            type: "MOB",
            icon: 285,
            x: 48,
            y: 48
        }, {
            mapid: 17,
            name: "Emerald Plant",
            description: "",
            type: "MOB",
            icon: 194,
            x: 45,
            y: 48
        }, {
            mapid: 17,
            name: "Grass Killer",
            description: "",
            type: "MOB",
            icon: 195,
            x: 29,
            y: 85
        }, {
            mapid: 17,
            name: "Earth Dragon",
            description: "",
            type: "MOB",
            icon: 251,
            x: 55,
            y: 47
        }, {
            mapid: 17,
            name: "Earth Dragon",
            description: "",
            type: "MOB",
            icon: 251,
            x: 56,
            y: 73
        }, {
            mapid: 17,
            name: "Beholder Overseer",
            description: "",
            type: "MOB",
            icon: 288,
            x: 48,
            y: 32
        }, {
            mapid: 17,
            name: "Hydra Dragon",
            description: "",
            type: "MOB",
            icon: 286,
            x: 19,
            y: 26
        }, {
            mapid: 17,
            name: "Earthstorm",
            description: "",
            type: "MOB",
            icon: 284,
            x: 13,
            y: 42
        }, {
            mapid: 17,
            name: "Unicorn",
            description: "",
            type: "MOB",
            icon: 245,
            x: 73,
            y: 19
        }, {
            mapid: 17,
            name: "Queen Lizard",
            description: "",
            type: "MOB",
            icon: 282,
            x: 77,
            y: 56
        }, {
            mapid: 17,
            name: "Blood Spirit",
            description: "",
            type: "MOB",
            icon: 281,
            x: 69,
            y: 36
        }, {
            mapid: 17,
            name: "Blood Spirit",
            description: "",
            type: "MOB",
            icon: 281,
            x: 70,
            y: 81
        }, {
            mapid: 17,
            name: "Transfer to Cesis",
            description: "",
            type: "TRAVEL",
            x: 79,
            y: 87
        }, {
            mapid: 18,
            name: "Cave Crawler",
            description: "",
            type: "BOSS",
            cblevel: 434,
            x: 50,
            y: 35
        }, {
            mapid: 18,
            name: "Giant Cyclops",
            description: "",
            type: "BOSS",
            cblevel: 450,
            x: 36,
            y: 76
        }, {
            mapid: 18,
            name: "Venus Flytrap",
            description: "",
            type: "BOSS",
            cblevel: 545,
            x: 79,
            y: 80
        }, {
            mapid: 18,
            name: "Grizzly Bear",
            description: "",
            type: "MOB",
            icon: 188,
            x: 83,
            y: 19
        }, {
            mapid: 18,
            name: "Poisoned Shroom",
            description: "",
            type: "MOB",
            icon: 39,
            x: 78,
            y: 40
        }, {
            mapid: 18,
            name: "Golden Shroom",
            description: "",
            type: "MOB",
            icon: 36,
            x: 70,
            y: 36
        }, {
            mapid: 18,
            name: "Dry-Rotted Shroom",
            description: "",
            type: "MOB",
            icon: 37,
            x: 72,
            y: 24
        }, {
            mapid: 18,
            name: "Avatar's Shroom",
            description: "",
            type: "MOB",
            icon: 38,
            x: 65,
            y: 21
        }, {
            mapid: 18,
            name: "Archdevil",
            description: "",
            type: "MOB",
            icon: 19,
            x: 55,
            y: 30
        }, {
            mapid: 18,
            name: "Archdevil",
            description: "",
            type: "MOB",
            icon: 19,
            x: 17,
            y: 82
        }, {
            mapid: 18,
            name: "Behemoth",
            description: "",
            type: "MOB",
            icon: 20,
            x: 35,
            y: 83
        }, {
            mapid: 18,
            name: "Ettin King",
            description: "",
            type: "MOB",
            icon: 21,
            x: 63,
            y: 78
        }, {
            mapid: 18,
            name: "Transfer to Whiland",
            description: "",
            type: "TRAVEL",
            x: 86,
            y: 14
        } ]
    };
    Mods.Newmap.POIfind = [];
    Mods.Newmap.POIfindMap = 0;
    HUD.drawMinimap = function() {
        if (!minimap) {
            getElem("mods_zone_buttondiv").style.visibility = "hidden";
            Mods.Newmap.drawMinimap();
            ctx.hud.fillStyle = "rgba(255, 255, 255, 0.3)";
            ctx.hud.fillRect(0, 14, 76, 4);
            ctx.hud.fillRect(76, 14, 4, 76);
            ctx.hud.fillRect(0, 90, 80, 4);
            ctx.hud.fillRect(0, 18, 4, 72);
            ctx.globalAlpha = 0;
            ctx.hud.font = "9px Arial";
            ctx.hud.textAlign = "center";
            ctx.hud.fillStyle = "black";
            ctx.hud.fillText("N", 39.5, 18);
            ctx.hud.fillStyle = "yellow";
            ctx.hud.fillText("N", 40.5, 19);
            var paths = [], path = [], p;
            for (p in players) "undefined" != typeof players[p] && players[p].b_t == BASE_TYPE.PLAYER && (players[p].me ? paths.push({
                color: "#55FF55",
                i: players[p].i,
                j: players[p].j
            }) : Mods.findWithAttr(Contacts.friends, "name", players[p].name) ? path.push({
                color: "yellow",
                i: players[p].i,
                j: players[p].j
            }) : 0 <= Contacts.ignores.indexOf(players[p].name) ? paths.push({
                color: "#FFFFFF",
                i: players[p].i,
                j: players[p].j
            }) : paths.push({
                color: "#00BFFF",
                i: players[p].i,
                j: players[p].j
            }));
            for (p in path) paths.push(path[p]);
            if ("undefined" !== typeof Mods.Newmap && "undefined" !== typeof Mods.Newmap.POIfind) if (Mods.Newmap.POIfindMap == current_map) for (p in Mods.Newmap.POIfind) paths.push(Mods.Newmap.POIfind[p]); else Mods.Newmap.POIfind = [];
            for (p in paths) {
                col = paths[p].color;
                d = translateTileToCoordinates(paths[p].i + 13, paths[p].j - 9);
                a = 3 * map_increase;
                a = (Math.round((d.x - dest_x) / 8) / 1.01 + .5 | 0) - a;
                d = 14 + Math.round((d.y - dest_y) / 8);
                var c = !1, t = 0, path = [ {
                    x: 0,
                    y: 0
                }, {
                    x: -6,
                    y: -3
                }, {
                    x: -6,
                    y: 3
                } ], b = [ {
                    x: -1,
                    y: 0
                }, {
                    x: -5,
                    y: -1
                }, {
                    x: -5,
                    y: 1
                } ];
                2 > a && (t = Math.atan2(d - 53.5, a - 39.5), c = !0, d = 39.5 * (d - 53.5) / (39.5 - a) + 53.5, 
                a = 0);
                16 > d && (c || (t = Math.atan2(d - 53.5, a - 39.5), c = !0), a = 39.5 * (a - 39.5) / (53.5 - d) + 39.5, 
                d = 14);
                78 < a && (c || (t = Math.atan2(d - 53.5, a - 39.5), c = !0), d = -39.5 * (d - 53.5) / (39.5 - a) + 53.5, 
                a = 79);
                92 < d && (c || (t = Math.atan2(d - 53.5, a - 39.5), c = !0), a = -39.5 * (a - 39.5) / (53.5 - d) + 39.5, 
                d = 93);
                if (c) {
                    var c = [ {
                        x: 0,
                        y: 0
                    }, {
                        x: 0,
                        y: 0
                    }, {
                        x: 0,
                        y: 0
                    } ], vectors = [ {
                        x: 0,
                        y: 0
                    }, {
                        x: 0,
                        y: 0
                    }, {
                        x: 0,
                        y: 0
                    } ], x = Math.cos(t), t = Math.sin(t), k;
                    for (k in c) c[k].x = a + x * path[k].x - t * path[k].y, c[k].y = d + t * path[k].x + x * path[k].y, 
                    vectors[k].x = a + x * b[k].x - t * b[k].y, vectors[k].y = d + t * b[k].x + x * b[k].y;
                    ctx.hud.closePath();
                    ctx.hud.fillStyle = "#000000";
                    ctx.hud.beginPath();
                    ctx.hud.moveTo(c[0].x, c[0].y);
                    ctx.hud.lineTo(c[1].x, c[1].y);
                    ctx.hud.lineTo(c[2].x, c[2].y);
                    ctx.hud.fill();
                    ctx.hud.closePath();
                    ctx.hud.fillStyle = col;
                    ctx.hud.beginPath();
                    ctx.hud.moveTo(vectors[0].x, vectors[0].y);
                    ctx.hud.lineTo(vectors[1].x, vectors[1].y);
                    ctx.hud.lineTo(vectors[2].x, vectors[2].y);
                    ctx.hud.fill();
                    ctx.hud.closePath();
                } else ctx.hud.fillStyle = "#000000", ctx.hud.fillRect(a - 2, d - 2, 4, 4), ctx.hud.fillStyle = col, 
                ctx.hud.fillRect(a - 1, d - 1, 2, 2);
            }
        }
    };
    HUD.drawMinimapLarge = function() {
        Mods.Newmap.drawMinimapLarge();
        if (minimap) {
            getElem("mods_zone_buttondiv").style.visibility = "";
            loading = !1;
            var obj = Mods.Newmap.FilterObj(Mods.Newmap.POI[0], {
                mapid: current_map
            });
            Mods.Newmap.HotSpots = [];
            var data, size, key;
            for (key in obj) {
                var y = Mods.Newmap.translateMapCoords(obj[key].x + 6, obj[key].y - 3), x = Math.round(y.x) / 1.01 + .5 | 0, y = 14 + Math.round(y.y);
                data = null;
                switch (obj[key].type) {
                  case "CITY":
                    size = "#55FF55";
                    obj[key].icon = "city";
                    break;

                  case "BOSS":
                    size = "red";
                    obj[key].icon = "boss";
                    break;

                  case "MOB":
                    size = "transparent";
                    data = npc_base[obj[key].icon].img;
                    var c = npc_base[obj[key].icon];
                    obj[key].cblevel = npc_base[obj[key].icon].params.combat_level;
                    obj[key].description = c.temp.total_accuracy + "A, " + c.temp.total_strength + "S, " + c.temp.total_defense + "D, " + c.params.health + "Hp";
                    break;

                  case "POI":
                    size = "yellow";
                    obj[key].icon = "poi";
                    break;

                  case "TRAVEL":
                    size = "#00FFFF";
                    obj[key].icon = "travel";
                    break;

                  case "RESOURCE":
                    size = "#F5A9E1";
                    break;

                  default:
                    size = "yellow";
                }
                switch (obj[key].icon) {
                  case "spade":
                    data = item_base[286].img;
                    break;

                  case "pick":
                    data = item_base[23].img;
                    break;

                  case "wood":
                    data = item_base[22].img;
                    break;

                  case "wood2":
                    data = item_base[152].img;
                    break;

                  case "fish":
                    data = item_base[7].img;
                    break;

                  case "ironrod":
                    data = item_base[1036].img;
                    break;

                  case "net":
                    data = item_base[124].img;
                    break;

                  case "cage":
                    data = item_base[127].img;
                    break;

                  case "woodharp":
                    data = item_base[125].img;
                    break;

                  case "steelharp":
                    data = item_base[126].img;
                    break;

                  case "city":
                    data = {
                        sheet: IMAGE_SHEET.MISC,
                        x: 2,
                        y: 7
                    };
                    break;

                  case "boss":
                    data = item_base[544].img;
                    break;

                  case "poi":
                    data = item_base[1132].img;
                    break;

                  case "travel":
                    data = {
                        sheet: IMAGE_SHEET.SICOS,
                        x: 0,
                        y: 5
                    };
                }
                "transparent" != size && (ctx.hud.beginPath(), ctx.hud.arc(x, y, 6, 0, 2 * Math.PI, !1), 
                ctx.hud.fillStyle = size, ctx.hud.fill(), ctx.hud.lineWidth = 1, ctx.hud.strokeStyle = "#000000", 
                ctx.hud.stroke());
                if (data) {
                    var me, r;
                    "string" == typeof data.hash ? (data.x = 12, data.y = 10, c = getBodyImgNoHalo(data.hash), 
                    me = {
                        img: [ c ],
                        tile_width: 1,
                        tile_height: 1
                    }, me.url = c.toDataURL(), c = 12, r = 10) : (me = IMAGE_SHEET[data.sheet], c = data.x, 
                    r = data.y);
                    size = "transparent" == size ? 16 : 12;
                    ctx.hud.drawImage(me.img[0], c * me.tile_width, r * me.tile_height, 32, 32, x - size / 2, y - size / 2, size, size);
                }
                Mods.Newmap.HotSpots.push({
                    x: x,
                    y: y,
                    desc: (data ? "<div style='width:32px;height:32px;float:left;background:url(\"" + me.url + '") no-repeat scroll ' + -data.x * me.tile_width + "px " + -data.y * me.tile_height + "px transparent;display: inline-block;margin: 0px;padding: 0px;'>&nbsp;</div>" : "") + obj[key].type + ": <b>" + obj[key].name + (obj[key].cblevel ? " (" + obj[key].cblevel + ")" : "") + "</b><br/>" + (obj[key].description ? obj[key].description : "")
                });
            }
            Mods.Newmap.BlinkPos("#55FF55");
            if (-1 != [ "Dungeon quest", "No Man's Land", "Cathedral", "Every Man's Land" ].indexOf(map_names[players[0].map])) for (var j in players) players[j].b_t != BASE_TYPE.PLAYER || players[j].me || (y = Mods.Newmap.translateMapCoords(players[j].i + 6, players[j].j - 3), 
            x = Math.round(y.x) / 1.01 + .5 | 0, y = 14 + Math.round(y.y), obj = players[j].name, 
            ctx.hud.font = "9px Arial", ctx.hud.textAlign = "center", ctx.hud.fillStyle = "#000", 
            ctx.hud.fillText(obj, x - 1, y - 1), ctx.hud.fillStyle = "yellow", ctx.hud.fillText(obj, x, y));
            getElem("hud").addEventListener("mousemove", Mods.Newmap.MapCoords, !1);
        }
    };
    Mods.Newmap.ShowZone = function() {
        getElem("mods_zone_buttondiv").style.visibility = "hidden";
        loading = !0;
        var img = new Image();
        img.onload = function() {
            ctx.hud.drawImage(img, .1 * ctx.hud.canvas.width, .05 * ctx.hud.canvas.height, .8 * ctx.hud.canvas.width, .9 * ctx.hud.canvas.height);
        };
        img.src = "https://1641572598.rsc.cdn77.org/world_map_mods.jpg";
    };
    Mods.Newmap.BlinkPos = function(world, x, y) {
        if (minimap && !loading) {
            if (!x && !y) {
                var p = Mods.Newmap.translateMapCoords(players[0].i + 6, players[0].j - 3), q = Math.round(p.x) / 1.01 + .5 | 0, p = 14 + Math.round(p.y);
                x = q;
                y = p;
            }
            ctx.hud.fillStyle = world;
            ctx.hud.fillRect(x - 2, y - 2, 4, 4);
            setTimeout(function() {
                Mods.Newmap.BlinkPos("red" == world ? "#55FF55" : "red", x, y);
            }, 1e3);
        }
    };
    Mods.Newmap.translateMapCoords = function(x, y) {
        return {
            x: y * half_tile_width_round + x * half_tile_width_round + dest_x,
            y: x * half_tile_height_round - y * half_tile_height_round + dest_y
        };
    };
    Mods.Newmap.FilterObj = function(layout, data) {
        return layout.filter(function(row) {
            return Object.keys(data).every(function(field) {
                return row[field] == data[field];
            });
        });
    };
    Mods.Newmap.MouseTranslate = function(x, xs) {
        var r = width / wrapper.style.width.replace("px", ""), g = height / wrapper.style.height.replace("px", "");
        x = x * r - dest_x;
        xs = xs * g - dest_y;
        var g = 2 * x / tile_width, s = 2 * xs / (1.18 * tile_height), r = Math.round((g + s) / 2) - 1, g = Math.round((g - s) / 2);
        return {
            i: r,
            j: g
        };
    };
    Mods.Newmap.MapCoords = function(evt) {
        var elem = getElem("mods_newmap_coords"), el = getElem("mods_newmap_popup");
        evt.clientX = evt.clientX || evt.pageX || evt.touches && evt.touches[0].pageX;
        evt.clientY = evt.clientY || evt.pageY || evt.touches && evt.touches[0].pageY;
        var c = translateMousePositionToScreenPosition(evt.clientX, evt.clientY), e = Mods.Newmap.MouseTranslate(1.15 * evt.clientX, evt.clientY), r = Math.round(e.i) - 9, e = Math.round(e.j) + 7;
        -1 < r && -1 < e && 101 > r && 101 > e && (elem.innerHTML = r + "/" + e);
        var r = !1, t;
        for (t in Mods.Newmap.HotSpots) if (5 > Math.abs(c.x - Mods.Newmap.HotSpots[t].x) && 5 > Math.abs(c.y - Mods.Newmap.HotSpots[t].y)) {
            el.style.top = evt.clientY + "px";
            el.style.left = evt.clientX + 10 + "px";
            el.innerHTML = Mods.Newmap.HotSpots[t].desc;
            r = !0;
            break;
        }
        elem.style.visibility = "";
        el.style.visibility = r ? "" : "hidden";
        if (!minimap || loading) getElem("hud").removeEventListener("mousemove", Mods.Newmap.MapCoords, !1), 
        elem.style.visibility = "hidden", el.style.visibility = "hidden";
    };
    Mods.timestamp("newmap");
};

Load.newmarket = function() {
    modOptions.newmarket.time = timestamp();
    Handlebars.registerHelper("mod_quantity", function(id) {
        var ret = "", result = market_results.filter(function(elm) {
            return elm.id == id;
        });
        0 < result.length && (ret = result[0].count, result = Mods.Newmarket.OwnedQuantity(result[0].item_id), 
        ret = "You own: <span style='color:" + (result >= ret ? "lightgreen" : 0 == result ? "red" : "yellow") + "'>" + result + "</span>");
        return ret;
    });
    Handlebars.registerHelper("select_states", function(id, nameFn) {
        if (nameFn == Mods.Newmarket.states[id]) return "selected='selected'";
    });
    Mods.Newmarket.transaction_announce = function(value) {
        if (value = "string" == typeof value ? value : !1) switch (value) {
          case "announce":
            value = getElem("announce_list");
            Mods.Newmarket.submitAnnouncement(!0);
            Mods.Newmarket.announceList = {};
            addClass(value, "hidden");
            value.innerHTML = "&nbsp;";
            break;

          case "expand":
            value = getElem("announce_queued_list");
            var id = getElem("announce_expand");
            hasClass(value, "hidden") ? (removeClass(value, "hidden"), id.innerHTML = "Collapse") : (addClass(value, "hidden"), 
            id.innerHTML = "Expand");
            break;

          case "select":
            var result = market_transaction_offers;
            value = 0;
            for (id in result) result[id].count && result[id].available && (Mods.Newmarket.gatherAnnounce(result[id].id), 
            value++);
            id = hasClass(getElem("announce_queued_list"), "hidden");
            getElem("announce_list").innerHTML = market_announce_template({
                results: Mods.Newmarket.announceList
            });
            getElem("announce_queued_amount").innerHTML = value;
            null === id && removeClass(getElem("announce_queued_list"), "hidden");
            break;

          case "remove":
            value = getElem("announce_list"), Mods.Newmarket.announceList = {}, addClass(value, "hidden"), 
            value.innerHTML = "&nbsp;";
        }
    };
    Mods.Newmarket.transaction_remove_announce = function(n) {
        delete Mods.Newmarket.announceList[n];
        n = 0;
        for (var res in Mods.Newmarket.announceList) n++;
        0 < n ? (res = hasClass(getElem("announce_queued_list"), "hidden"), getElem("announce_list").innerHTML = market_announce_template({
            results: Mods.Newmarket.announceList
        }), getElem("announce_queued_amount").innerHTML = n, null === res && removeClass(getElem("announce_queued_list"), "hidden")) : (getElem("announce_list").innerHTML = "&nbsp;", 
        addClass(getElem("announce_list"), "hidden"));
    };
    Mods.Newmarket.offerFilter = function(key, value, val) {
        if (void 0 == item_base[key] || "number" != typeof parseInt(value) || 1 > value || "number" != typeof parseInt(val)) return "";
        var ret = "", style = "", styles = Mods.marketReplace, style = item_base[key].name, prop;
        for (prop in styles) style = style.replace(prop, styles[prop]);
        ret += style;
        for (key = 0; 2 > key; key++) {
            style = 0 == key ? value : val;
            if (1 < style / 3e8) return "";
            1 <= style / 1e6 ? style = Math.round(style / 1e6 * 10) / 10 + "m" : 1 <= style / 1e5 ? style = Math.round(style / 1e3) + "k" : 1 <= style / 1e3 && (style = Math.round(style / 1e3 * 10) / 10 + "k");
            ret = 0 == key ? style + " " + ret : ret + (" for " + style + (1 < value ? " ea" : ""));
        }
        return ret;
    };
    Mods.Newmarket.gatherAnnounce = function(mod) {
        var c = !1, e = market_transaction_offers, p;
        for (p in e) if (e[p].id == mod) {
            e = e[p];
            c = !0;
            break;
        }
        if (c && 0 != e.count && 0 != e.available) {
            var c = e.id, n = e.to_player || !1, t = e.type, s = Mods.Newmarket.offerFilter(e.item_id, e.count, e.price), e = Mods.Newmarket.announceList;
            if (0 != s.length) {
                e[mod] = {
                    id: c,
                    to: n,
                    name: s,
                    type: t
                };
                mod = hasClass(getElem("announce_queued_list"), "hidden");
                getElem("announce_list").innerHTML = market_announce_template({
                    results: Mods.Newmarket.announceList
                });
                removeClass(getElem("announce_list"), "hidden");
                null === mod && removeClass(getElem("announce_queued_list"), "hidden");
                mod = 0;
                for (p in e) mod++;
                getElem("announce_queued_amount").innerHTML = mod;
            }
        }
    };
    Mods.Newmarket.clearAnnouncement = function() {
        var buttonRight = getElem("announce_list");
        Mods.Newmarket.announceList = {};
        addClass(buttonRight, "hidden");
        buttonRight.innerHTML = "&nbsp;";
        Mods.Newmarket.announces = {
            messages: [],
            count: 0
        };
    };
    Mods.Newmarket.submitAnnouncement = function(end) {
        function send() {
            var t = Mods.Newmarket.announces.messages, p = Mods.Newmarket.max_lines, r = !1, s;
            if (0 < t.length) for (s in t) if (0 == t[s].indexOf("/w")) Socket.send("message", {
                data: t[s]
            }); else if (!0 !== Contacts.channels.$$) !r && addChatText("You must be subscribed to [$$] to use the Announce feature. Go to: Contacts - Channels - [$$] Subscribe.", void 0, COLOR.TEAL), 
            r = !0; else if (Mods.Newmarket.allowTrade()) Mods.Newmarket.times.push(timestamp()), 
            Socket.send("message", {
                data: t[s],
                lang: "$$"
            }), localStorage.announceBlock = JSON.stringify(Mods.Newmarket.times); else {
                t = 36e5 + Mods.Newmarket.times[0] - timestamp();
                t = Math.round(t / 6e4 * 10) / 10 + " minutes";
                addChatText("You have submitted " + p + " or more offers within the last hour. You must wait at least " + t + " before you can submit another offer.", void 0, COLOR.TEAL);
                break;
            }
            Mods.Newmarket.announceList = {};
        }
        var properties, result, v, x, obj, index, _ref2, value, id, key;
        if (!1 === end) Mods.Newmarket.clearAnnouncement(); else {
            end = Mods.Newmarket.max_lines;
            properties = Mods.Newmarket.announceList;
            result = Mods.Newmarket.announces.messages = [];
            v = "[BUY] ";
            x = "[SELL] ";
            obj = {};
            index = 0;
            for (value in properties) !1 !== properties[value].to ? (_ref2 = 0 == properties[value].type ? " [SELL] " : " [BUY] ", 
            obj[properties[value].to] = obj[properties[value].to] || [], obj[properties[value].to].push(_ref2 + properties[value].name)) : 1 == properties[value].type ? 160 > properties[value].name.length + v.length + 3 ? v += properties[value].name + " | " : (result.push(v.slice(0, -3)), 
            v = "[BUY] " + properties[value].name + " | ", index++) : 0 == properties[value].type && (160 > properties[value].name.length + x.length + 3 ? x += properties[value].name + " | " : (result.push(x.slice(0, -3)), 
            x = "[SELL] " + properties[value].name + " | ", index++));
            0 < v.length - 7 && (result.push(v.slice(0, -3)), index++);
            0 < x.length - 7 && (result.push(x.slice(0, -3)), index++);
            Mods.Newmarket.announces.count = index;
            value = "";
            for (id in obj) {
                value = '/w "' + id + '" My offer:';
                for (key in obj[id]) 160 > value.length + obj[id][key].length + 6 ? value += obj[id][key] + ", " : (value = capitaliseFirstLetter(value.slice(0, -2)) + " is up.", 
                result.push(value), value = '/w "' + id + '" My offer:');
                value = capitaliseFirstLetter(value.slice(0, -2)) + " is up.";
                value.length > ('/w "' + id + '"').length && result.push(value);
            }
            0 != result.length && (result.sort(function(value, element) {
                return /^\[BUY\]/.test(element) || /^\/w/.test(value) ? 1 : /^\/w/.test(element) || /^\[BUY\]/.test(value) ? -1 : 0;
            }), 0 < index ? (Mods.Newmarket.allowTrade(!1), id = (1 == index ? "This Announcement uses 1 $$ line. " : 1 < index ? "These Announcements use " + index + " $$ lines. " : "") + "You have " + (end - Mods.Newmarket.times.length) + " available this hour. Post this Announcement?", 
            Popup.prompt(id, send, Mods.Newmarket.clearAnnouncement)) : send());
        }
    };
    Mods.Newmarket.allowTrade = function(loading) {
        for (var min = Mods.Newmarket.max_lines, length = Mods.Newmarket.times.length; Mods.Newmarket.times[0] + 36e5 < timestamp(); ) Mods.Newmarket.times.splice(0, 1);
        Mods.Newmarket.times.length != length && (localStorage.announceBlock = JSON.stringify(Mods.Newmarket.times));
        if (Mods.Newmarket.times.length >= min) {
            if (loading && "$$" == getElem("current_channel").value) if (1 == Contacts.channels.EN) getElem("current_channel").value = "EN"; else if (1 == Contacts.channels["18"]) getElem("current_channel").value = "18"; else {
                loading = !1;
                for (var chan in Contacts.channels) if ("$$" != chan) {
                    getElem("current_channel").value = Contacts.channels[chan];
                    loading = !0;
                    break;
                }
                loading || (Contacts.add_channel("EN"), getElem("current_channel").value = "EN");
            }
            return !1;
        }
        return !0;
    };
    Mods.Newmarket.transaction_click = function(id) {
        Mods.Newmarket.saveSelectValue();
        var source = getElem("market_drop_" + id).value;
        "delete" == source && Market.client_cancel_offer(id);
        "resubmit" == source && Market.client_extend_offer(id);
        "announce" == source && Mods.Newmarket.gatherAnnounce(id);
        "edit" == source && Mods.Newmarket.edit(id);
    };
    Mods.Newmarket.transaction_select = function() {
        var value = getElem("market_drop_default").value, elements = market_transaction_offers, e;
        for (e in elements) {
            var id = elements[e].id, card = getElem("market_drop_" + id);
            "undefined" != typeof value && "number" == typeof id && ("delete" == value || "edit" == value ? card.value = value : 0 < parseInt(elements[e].count) && (elements[e].available && "announce" == value ? card.value = value : "resubmit" == value && (card.value = value)));
        }
        Mods.Newmarket.saveSelectValue();
    };
    Mods.Newmarket.saveSelectValue = function() {
        var conv = market_transaction_offers, obj = Mods.Newmarket.states = {}, key;
        for (key in conv) {
            var property = getElem("market_drop_" + conv[key].id);
            property && property.value && (obj[conv[key].id] = property.value);
        }
        obj["default"] = getElem("market_drop_default").value;
    };
    Mods.Newmarket.OwnedQuantity = function(id) {
        return (id = Mods.findWithAttr(chest_content, "id", id)) && 0 < chest_content[id].count ? chest_content[id].count : 0;
    };
    Mods.Newmarket.MaxQuantity = function(flavorId) {
        if (flavorId) {
            var args = market_results.filter(function(flavor) {
                return flavor.id == flavorId;
            });
            if (0 < args.length) {
                var number = args[0].item_id, min = args[0].count;
                0 == args[0].type ? getElem("market_offer_amount").value = min : (number = Mods.Newmarket.OwnedQuantity(number), 
                getElem("market_offer_amount").value = number < min ? number : min);
                Market.client_update_total_cost(args[0].id);
            }
        } else getElem("market_new_offer_amount").value = getElem("market_new_offer_count").innerText, 
        Market.client_new_offer_update_total_cost();
    };
    Mods.Newmarket.Tradetoggle = function() {
        var elem = getElem("settings_tradechannel");
        switch (Mods.Newmarket.tradechatmode) {
          case 0:
            elem.innerHTML = "Trade Chat: manual join";
            Mods.Newmarket.tradechatmode = 1;
            break;

          default:
            elem.innerHTML = "Trade Chat: join automatically", Mods.Newmarket.tradechatmode = 0;
        }
        localStorage.tradechatmode = JSON.stringify(Mods.Newmarket.tradechatmode);
    };
    Mods.Newmarket.next = function() {
        getElem("market_search_results").scrollTop = 0;
        50 == market_results.length && (getElem("market_search_min_price").value = market_results[market_results.length - 1].price, 
        getElem("market_search_max_price").value = "", Market.client_search());
    };
    Mods.Newmarket.togglepopup = function() {
        Mods.Newmarket.popup = !Mods.Newmarket.popup;
        localStorage.marketpopup = JSON.stringify(Mods.Newmarket.popup);
    };
    Mods.Newmarket.equippedinslot = function(index) {
        var elements = players[0].temp.inventory, k;
        for (k in elements) if (1 == elements[k].selected && item_base[elements[k].id].params.slot == index) return elements[k].id;
        return null;
    };
    Mods.Newmarket.hidedetails = function(eId) {
        if (eId = getElem("market_offer_popup")) eId.style.visibility = "hidden";
    };
    Mods.Newmarket.details = function(flavorId) {
        if (!Mods.Newmarket.popup) {
            if (null == getElem("market_offer_popup")) {
                var elem = document.createElement("div");
                elem.className = "marketpopup menu";
                elem.id = "market_offer_popup";
                elem.style.opacity = "1";
                getElem("wrapper").appendChild(elem);
            }
            var data = market_results.filter(function(flavor) {
                return flavor.id == flavorId;
            }), elem = getElem("market_offer_popup"), index = new Date(data[0].available_until) - new Date(), index = index / 1e3, index = Math.floor(index / 3600) + "h " + Math.floor(index % 3600 / 60) + "m", _i = item_base[data[0].item_id], _len = IMAGE_SHEET[_i.img.sheet], _len = "<div style=\"background:url('" + _len.url + "') no-repeat scroll " + -_i.img.x * _len.tile_width + "px " + -_i.img.y * _len.tile_height + 'px transparent;width: 32px;height: 32px;display: inline-block;margin: 0px;padding: 0px;float:left;">&nbsp;</div>', _len = _len + "<table>" + ("<tr><td colspan=2>" + (0 == data[0].type ? "<span style='color:lightgreen'>[You are BUYING]" : "<span style='color:orange'>[You are SELLING]") + " <b>" + _i.name + "</b></span></td></tr>"), _len = _len + ("<tr><td colspan=2 style='color:#3BEEEE'>" + Items.info(data[0].item_id) + "</td></tr>");
            if (1 == data[0].type) var value = Mods.findWithAttr(chest_content, "id", data[0].item_id), value = value && 0 < chest_content[value].count ? chest_content[value].count : 0, _len = _len + ("<tr><td style='color:#CCC'>You own:</td><td style='color:" + (0 < value ? "#00FF00'>" : "#FF0000'>") + value + "</td></tr>"); else _i.b_t != ITEM_CATEGORY.WEAPON && _i.b_t != ITEM_CATEGORY.ARMOR && _i.b_t != ITEM_CATEGORY.JEWELRY && _i.b_t != ITEM_CATEGORY.PET || !_i.params.wearable || (value = Mods.Newmarket.equippedinslot(_i.params.slot)) && (_len += "<tr><td colspan=2 style='color:#F3A7BD'>" + Items.info(value) + "<br/>Comparing: " + item_base[value].name + "</td></tr>");
            _len += "<tr><td style='color:#CCC'>Dealer:</td><td style='color:" + (Mods.findWithAttr(Contacts.friends, "name", data[0].player) ? "#FFFF00'>(friend) " : "'>") + data[0].player + "</td></tr>";
            _len += "<tr><td style='color:#CCC'>Expires in:</td><td>" + index + "</td></tr><tr><td style='color:#CCC'>Price:</td><td>" + thousandSeperate(data[0].price) + " vs " + thousandSeperate(_i.params.price) + " (wiki) = " + Math.round(data[0].price / _i.params.price * 100) + "%</td></tr>";
            _len += "<tr><td style='color:#CCC'>Quantity:</td><td>" + data[0].count + " (total " + thousandSeperate(data[0].count * data[0].price) + " coins)</td></tr>";
            _len += "</table>";
            elem.innerHTML = _len;
            data = getElem("market");
            elem.style.position = "absolute";
            elem.style.zIndex = "310";
            elem.style.left = data.offsetLeft - 25 + "px";
            elem.style.top = data.offsetTop - 25 + "px";
            elem.style.visibility = "";
        }
    };
    Mods.Newmarket.edit = function(id) {
        var input = market_transaction_offers.filter(function(elm) {
            return elm.id == id;
        });
        if (0 < input.length) {
            var e = input[0].type, f = input[0].item_id, hash = null == input[0].to_player ? "" : input[0].to_player, c = input[0].price, m = input[0].count;
            Market.client_cancel_offer(id);
            setTimeout(function() {
                Market.open();
                Market.client_new_offer();
                getElem("market_new_offer_search_type").value = e;
                Market.client_update_new_offer_items();
                getElem("market_new_offer_items_item").value = f;
                Market.client_update_new_offer_item_change();
                getElem("market_offer_player").value = hash;
                getElem("market_new_offer_price").value = c;
                getElem("market_new_offer_amount").value = m;
                Market.client_new_offer_update_total_cost();
            }, 1e3);
        }
    };
    Mods.Newmarket.eventListener = {
        keys: {
            keyup: [ KEY_ACTION.SWITCH_LANGUAGE_UP, KEY_ACTION.SWITCH_LANGUAGE_DOWN ],
            keydown: [ KEY_ACTION.SEND_CHAT ]
        },
        fn: function(node, s, e) {
            "keyup" != node || GAME_STATE != GAME_STATES.CHAT || "$$" != getElem("current_channel").value || Mods.Newmarket.allowTrade() || (e == KEY_ACTION.SWITCH_LANGUAGE_UP && (getElem("current_channel").selectedIndex = Math.max(0, getElem("current_channel").selectedIndex - 1)), 
            e == KEY_ACTION.SWITCH_LANGUAGE_DOWN && (getElem("current_channel").selectedIndex = Math.min(getElem("current_channel").length - 1, getElem("current_channel").selectedIndex + 1)), 
            "$$" == getElem("current_channel").value && Mods.Newmarket.allowTrade(!0));
            "keydown" == node && GAME_STATE == GAME_STATES.CHAT && "$$" == getElem("current_channel").value && e == KEY_ACTION.SEND_CHAT && 0 < getElem("my_text").value.length && !/^\//.test(getElem("my_text").value) && (Mods.Newmarket.times.push(timestamp()), 
            localStorage.announceBlock = JSON.stringify(Mods.Newmarket.times));
        }
    };
    Mods.Newmarket.socketOn = {
        actions: [ "market_transaction_offers", "login" ],
        fn: function(m, response) {
            if ("market_transaction_offers" == m) {
                var t, n, k;
                hasClass(getElem("market"), "hidden") || Timers.set("confirm_submit", function() {
                    Mods.Newmarket.checkSubmit(!0);
                    Timers.clear("confirm_submit");
                }, 1e3);
                t = Mods.Newmarket.announceList;
                n = 0;
                for (k in t) n++;
                0 < n && (getElem("announce_list").innerHTML = market_announce_template({
                    results: Mods.Newmarket.announceList
                }), getElem("announce_queued_amount").innerHTML = n, removeClass(getElem("announce_list"), "hidden"));
            }
            "login" == m && response && "ok" == response.status && Mods.Newmarket.tradechatmode && Contacts.add_channel("$$");
        }
    };
    Mods.Newmarket.resubmit = function(flavorId) {
        if (!(Timers.running("checkSubmit") || 0 < Mods.Newmarket.submitHolder.length)) {
            var input = market_transaction_offers.filter(function(flavor) {
                return flavor.id == flavorId;
            });
            if (0 < input.length) {
                Mods.Newmarket.submitHolder.push(input[0]);
                var src = market_transaction_offers.filter(function(q) {
                    return q.item_id == input[0].item_id && q.type == input[0].type && q.to_player == input[0].to_player && q.price == input[0].price && q.count == input[0].count;
                });
                Mods.Newmarket.submitHolder[0].likeoff = src.length;
                Mods.Newmarket.submitHolder[0].timer = 0;
                Market.client_cancel_offer(flavorId);
                Timers.clear("checkSubmit");
            }
        }
    };
    Mods.Newmarket.checkSubmit = function(create, proto) {
        var results = Mods.Newmarket.submitHolder;
        if (0 == results.length || results[0] && void 0 == results[0].id || results[0] && 0 < results[0].timer) {
            var result = !0;
            if (results[0] && 0 < results[0].timer) {
                var el = market_transaction_offers.filter(function(q) {
                    return q.item_id == results[0].item_id && q.type == results[0].type && q.to_player == results[0].to_player && q.price == results[0].price && q.count == results[0].count;
                });
                el.length >= results[0].likeoff && (result = !1);
            }
            if (result) {
                0 != results.length && (Mods.consoleLog("resubmit failed: timeout"), addChatText("Failed to resubmit", void 0, COLOR.TEAL));
                Mods.Newmarket.submitQueued = !1;
                Timers.clear("checkSubmit");
                Mods.Newmarket.submitHolder = [];
                return;
            }
        }
        create && (el = market_transaction_offers.filter(function(q) {
            return q.item_id == results[0].item_id && q.type == results[0].type && q.to_player == results[0].to_player && q.price == results[0].price && q.count == results[0].count;
        }), result = el.length >= results[0].likeoff ? !0 : !1, el = market_transaction_offers.filter(function(elm) {
            return elm.id == results[0].id;
        }), result && 0 == el.length ? (addChatText("Your offer for " + results[0].count + " " + item_base[results[0].item_id].name + ("" == results[0].to_player || null == results[0].to_player ? "" : " to " + results[0].to_player) + " was resubmitted.", void 0, COLOR.TEAL), 
        Mods.Newmarket.submitHolder = [], Mods.Newmarket.submitQueued = !1) : 0 < el.length ? (Mods.Newmarket.submitHolder = [], 
        Mods.Newmarket.submitQueued = !1) : (result = chests[0].filter(function(callSite) {
            return callSite.id == results[0].item_id;
        }), el = 0 < result.length ? parseInt(result[0].count) : 0, 0 < result.length && el >= results[0].count && (0 < Mods.Newmarket.submitHolder.length && setTimeout(function() {
            var result = Mods.Newmarket.submitHolder;
            0 != result.length && Socket.send("market_make_new_offer", {
                type: result[0].type,
                item_id: result[0].item_id,
                to_player: null != result[0].to_player ? result[0].to_player : "",
                price: result[0].price,
                count: result[0].count,
                target_id: chest_npc.id
            });
        }, 100), Mods.Newmarket.submitHolder[0].timer += 1), results[0].id && Timers.set("resubmit", function() {
            Market.client_transactions();
        }, 2e3 * Mods.Newmarket.submitHolder[0].timer + 1500)));
    };
    (function() {
        createElem("div", "options_game", {
            innerHTML: "<span class='wide_link pointer' id='settings_tradechannel' onclick='Mods.Newmarket.Tradetoggle();'>Trade Chat: join automatically</span>"
        });
        Mods.Newmarket.Tradetoggle();
        channel_names.unshift("$$");
        0 == Mods.Newmarket.tradechatmode && Contacts.add_channel("$$");
        getElem("market").style.overflowY = "";
        getElem("market_search_results").style.overflowY = "auto";
        getElem("market_search_results").style.maxHeight = "230px";
        var parent = getElem("market_search_max_price").parentElement;
        parent.getElementsByClassName("market_select pointer")[0].onclick = function() {
            Market.client_search();
            getElem("market_search_results").scrollTop = 0;
        };
        var el = document.createElement("span");
        el.style.verticalAlign = "middle";
        el.style.fontSize = "10px";
        el.innerHTML = "<input type='checkbox' id='chk_enable_mktpopup' onclick='Mods.Newmarket.togglepopup();'> Popup";
        parent.insertBefore(el, getElem("market_search_item").nextSibling);
        getElem("chk_enable_mktpopup").checked = !Mods.Newmarket.popup;
        el = document.createElement("span");
        el.innerHTML = "<button onclick='Mods.Newmarket.next();' class='market_select pointer'>Next &gt;&gt;</button>";
        parent.appendChild(el);
        market_client_new_offer_template = Handlebars.compile("<table style='text-align: left;border: 1px #666666 solid;width: 100%;margin: 0px;margin-top: 20px;' class='table'><tbody><tr class='offer_line'><td>Type</td><td><select id='market_new_offer_search_type' onchange='Market.client_update_new_offer_items();' class='market_select'><option value='0'>Sell</option><option value='1'>Buy</option></select></td></tr><tr class='offer_line even'><td style='width: 96px;'>Item</td><td id='market_new_offer_items'></td></tr><tr class='offer_line'><td>To</td><td><input type='text' class='market_select' placeholder='Everybody' id='market_offer_player' list='player_datalist'/></td></tr><tr class='offer_line even'><td>Price</td><td><input type='number' id='market_new_offer_price' onchange='Market.client_new_offer_update_total_cost();' class='market_select'/></td></tr><tr class='offer_line'><td>Amount</td><td><input id='market_new_offer_amount' type='number' autocomplete='off' style='width:85px;' value='1' class='market_select' onchange='Market.client_new_offer_update_total_cost();'> of <span id='market_new_offer_count'>0</span> <button onclick='javascript:Mods.Newmarket.MaxQuantity()' class='market_select pointer' style='margin: 0px;font-weight: bold;'>Max</button></td></tr><tr class='offer_line even'><td>Total cost</td><td><b id='market_new_offer_total_cost'>0</b></td></tr><tr class='offer_line'><td></td><td><button onclick='javascript:Market.client_make_offer()' class='market_select pointer' style='margin: 0px;font-weight: bold;'>Make offer</button></td></tr></tbody></table><span>* Each offer lasts 24 hours. You can have {{market_offers}} active offers.{{#can_upgrade_market_offers}}<br/><button class='market_select pointer' onclick='Market.upgrade_offers_dialog();'>Upgrade</button>{{/can_upgrade_market_offers}}</span><div style='position: absolute;bottom: 2px;right: 4px;'>You have <span id='market_new_offer_player_coins'></span> coins</div>");
        market_client_search_results_template = Handlebars.compile("<table class='table scrolling_allowed'><tbody class='scrolling_allowed'><tr class='scrolling_allowed'><th>Item</th><th>Count</th><th>Price</th><th>User</th></tr>{{#each results}}<tr class='{{this.classes}} scrolling_allowed {{#if this.to_player}}green{{/if}}' onclick='Market.client_open_offer({{this.id}})' onmouseenter='Mods.Newmarket.details({{this.id}})' onmouseleave='Mods.Newmarket.hidedetails()'>  <td item_id='{{this.item_id}}' class='scrolling_allowed'>{{item_name this.item_id}}</td>  <td  class='scrolling_allowed'>{{this.count}}</td>  <td class='scrolling_allowed'>{{item_price this.price}}</td>  <td class='scrolling_allowed'>{{this.player}}</td></tr>{{/each}}</tbody></table>");
        market_client_open_offer_template = Handlebars.compile("<table style='text-align: left;border: 1px #666666 solid;width: 100%;margin: 0px;margin-top: 20px;' class='table'><tbody><tr class='offer_line'><td style='width: 96px;'>Item</td><td><span style='vertical-align: bottom;margin-right: 4px;padding-bottom: -26px;line-height: 32px;'>{{item_name this.item_id}}</span><div style='{{item_image this.item_id}}width: 32px;height: 32px;display: inline-block;margin: 0px;padding: 0px;'>&nbsp;</div></td></tr><tr class='offer_line even'><td>About</td><td>{{item_stats this.item_id}}</td></tr><tr class='offer_line'><td>Dealer</td><td>{{this.player}}</td></tr><tr class='offer_line even'><td>Price</td><td>{{item_price this.price}}</td></tr><tr class='offer_line'><td>Amount</td><td><input id='market_offer_amount' type='number' autocomplete='off' style='width:85px;' value='1' class='market_select' onchange='Market.client_update_total_cost({{this.id}});'> of {{this.count}} <button onclick='javascript:Mods.Newmarket.MaxQuantity({{this.id}})' class='market_select pointer' style='margin: 0px;font-weight: bold;'>Max</button> {{#if this.type}}{{{mod_quantity this.id}}}{{/if}}</td></tr><tr class='offer_line even'><td>Total cost</td><td><b id='market_total_cost'>{{item_price this.price}}</b></td></tr><tr class='offer_line'><td></td><td><button onclick='javascript:Market.client_accept_offer({{this.id}})' class='market_select pointer' style='margin: 0px;font-weight: bold;'>{{#if this.type}}Sell{{else}}Buy{{/if}}</button></td></tr></tbody></table><div style='position: absolute;bottom: 2px;right: 4px;'>You have <span id='market_offer_player_coins'></span> coins</div>");
        market_announce_template = Handlebars.compile("\r\n            <div style='border: 1px solid #666; padding: 5px; margin-bottom: 5px; background-color: #111;'>\r\n                <span style='color: #FF0; font-weight: bold; padding-top: 3px; line-height: 20px;'>Announces: \r\n                    <span id='announce_queued_amount' style='color: #FFF;'>0</span>\r\n                </span>\r\n                <button class='market_select pointer scrolling_allowed' onclick='Mods.Newmarket.transaction_announce(&apos;announce&apos;)' style='font-size: 0.7em; float: right; margin-bottom: 8px;'>Announce!</button>\r\n                <button class='market_select pointer scrolling_allowed' onclick='Mods.Newmarket.transaction_announce(&apos;remove&apos;)' style='font-size: 0.7em; float: right;'>Cancel</button>\r\n                <button class='market_select pointer scrolling_allowed' onclick='Mods.Newmarket.transaction_announce(&apos;select&apos;)' style='font-size: 0.7em; float: right;'>Select All</button>\r\n                <button id='announce_expand' class='market_select pointer scrolling_allowed' onclick='Mods.Newmarket.transaction_announce(&apos;expand&apos;)' style='font-size: 0.7em; float: right;'>Expand</button>\r\n                <table id='announce_queued_list' class='table scrolling_allowed hidden' style='text-align: center; min-width: 100%; max-width: 100%'>\r\n                    <tbody>\r\n                        <tr>\r\n                            <th style='text-align: left; padding-bottom: 5px;' colspan='2'>Queued Item</th>\r\n                            <th>To</th>\r\n                            <th style='text-align: right; padding-right: 3px;'>Remove</th>\r\n                        </tr>\r\n                        {{#each results}}\r\n                        <tr style='padding-top: 2px;'>\r\n                            <td style='padding-right: 2px;'>{{#if this.type}}<div style='color: #0F0; padding-bottom: 8px;'>[B]</div>{{else}}<div style='color: #0F0; padding-bottom: 8px'>[S]</div>{{/if}}</td>\r\n                            <td style='text-align: left; padding-top: 2px'>{{this.name}}</td>\r\n                            <td style='padding-top: 2px;'>{{#if this.to}}{{this.to}}{{else}}<span style='color: #F2A2F2;'>$$</span>{{/if}}</td>\r\n                            <td style='padding-left: 8px;'>\r\n                                <button class='market_select pointer scrolling_allowed' onclick='Mods.Newmarket.transaction_remove_announce({{this.id}})' style='font-size: 0.7em; float: right;'>Remove</button>\r\n                            </td>\r\n                        </tr>\r\n                        {{/each}}\r\n                    </tbody>\r\n                </table>\r\n            </div>\r\n        ");
        market_client_transaction_offers_template = Handlebars.compile("\r\n            <div id='announce_list' class='hidden'>&nbsp;</div>\r\n            Offers\r\n            <table class='table scrolling_allowed'>\r\n                <tbody>\r\n                    <tr>\r\n                        <th style='width:12%; text-align:center'>Type</th>\r\n                        <th style='width:15%; text-align:center;'>Item</th>\r\n                        <th style='width:4%'>#</th>\r\n                        <th style='width:19%;'>Price</th>\r\n                        <th style='text-align:center; width:18%; padding-left:9px;'>To</th>\r\n                        <th style='width:21%; text-align:left; padding-left:9px; position:relative;'>Select\r\n                            <select id='market_drop_default' class='market_select scrolling allowed' style='width:70px; position:absolute; top:-68%; right:-51%; font-weight:bold;' onchange='Mods.Newmarket.transaction_select()'> \r\n                                <option class='scrolling_allowed' value='delete'{{select_states 'default' 'delete'}}>Delete</option>\r\n                                <option class='scrolling_allowed' value='resubmit'{{select_states 'default' 'resubmit'}}>Resubmit</option>\r\n                                <option class='scrolling_allowed' value='announce'{{select_states 'default' 'announce'}}>Announce</option>\r\n                                <option class='scrolling_allowed' value='edit'{{select_states 'default' 'edit'}}>Edit</option>\r\n                            </select>\r\n                        </th>\r\n                        <th style='width:10%;'></th>\r\n                    </tr>\r\n                    {{#each results}}\r\n                    <tr class='scrolling_allowed {{this.classes}} {{#if this.available}}green{{else}}red{{/if}}' {{#if this.available}}{{#if this.count}}{{else}}style='color:yellow'{{/if}}{{/if}}>\r\n                        <td class='scrolling_allowed' style='vertical-align:middle; text-align:center;'>{{#if this.type}}Buy{{else}}Sell{{/if}}</td>\r\n                        <td class='scrolling_allowed' style='vertical-align:middle; position:relative;'>\r\n                            <div title='{{item_name this.item_id}}' item_id='{{this.item_id}}' style='{{item_image this.item_id}} width:32px; height:32px; display:inline-block; margin:0px; margin-left:14px; padding:0px; float:left; '></div>\r\n                        </td>\r\n                        <td class='scrolling_allowed' style='vertical-align:middle'>{{this.count}}</td>\r\n                        <td class='scrolling_allowed' style='vertical-align:middle;'>{{item_price this.price}}</td>\r\n                        <td class='scrolling_allowed' style='vertical-align:middle; text-align:left; padding-left:12px;'>{{#if this.to_player}}{{this.to_player}}{{else}}Everyone{{/if}}</td>\r\n                        <td class='scrolling_allowed' style='text-align:left; position:relative;'>\r\n                            <select id='market_drop_{{this.id}}' class='market_select scrolling allowed' style='margin:0px; margin-left:9px; width:70px; position: absolute; top: 25%;'>\r\n                                <option class='scrolling_allowed' value='delete'{{select_states this.id 'delete'}}>Delete</option>\r\n                                {{#if this.count}}\r\n                                <option class='scrolling_allowed' value='resubmit'{{select_states this.id 'resubmit'}}>Resubmit</option>\r\n                                {{#if this.available}}\r\n                                <option class='scrolling_allowed' value='announce'{{select_states this.id 'announce'}}>Announce</option>\r\n                                {{/if}}{{/if}}\r\n                                <option class='scrolling_allowed' value='edit'{{select_states this.id 'edit'}}>Edit</option>\r\n                            </select>\r\n                        </td>\r\n                        <td class='scrolling_allowed' style='text-align:center; position:relative'>\r\n                            <button class='market_select pointer scrolling_allowed' onclick='Mods.Newmarket.transaction_click({{this.id}})' style='position: absolute; left: 6px; top: 25%;'>Go</button>\r\n                        </td>\r\n                    </tr>\r\n                    {{/each}}\r\n                </tbody>\r\n            </table>\r\n        ");
    })();
    Mods.timestamp("newmarket");
};

Load.tabs = function() {
    modOptions.tabs.time = timestamp();
    Mods.Tabs.lockScroll = function() {
        var elem = getElem("chat");
        0 < elem.scrollTop && (elem.scrollTop = elem.scrollHeight - elem.offsetHeight - Mods.Tabs.chatMovement);
    };
    Mods.Tabs.dragEvents = function(event) {
        if (-1 < Mods.Tabs.chatMovement || "mousedown" == event.type) {
            var container = getElem("chat");
            switch (event.type) {
              case "drop":
                Mods.Tabs.chatMovement = -1;

              case "dragenter":
              case "dragover":
                event.stopPropagation();
                event.preventDefault();
                break;

              case "scroll":
                Mods.Tabs.lockScroll();

              case "mousedown":
                Mods.Tabs.chatMovement = Math.max(0, container.scrollHeight - (container.offsetHeight + container.scrollTop));
                break;

              case "mouseup":
                Mods.Tabs.chatMovement = -1;
            }
        }
    };
    Mods.Tabs.resize = function(x) {
        var e = getElem("chat"), elem = getElem("tabs"), el = getElem("chat_resize"), y = getAbsoluteHeight(my_text);
        -1 != Mods.loadedMods.indexOf("Chatmd") && (hasClass(getElem("mod_text"), "hidden") || (y = getAbsoluteHeight(mod_text)));
        var y = GAME_STATE == GAME_STATES.CHAT ? y + 25 * current_ratio_y : 25 * current_ratio_y, len = getAbsoluteHeight(tabs) || 0;
        e.style.bottom = y + "px";
        e.style.maxHeight = Math.round(.8 * last_updated.set_canvas_size_new_height - 2 * len) + "px";
        e.style.height = Math.round(last_updated.set_canvas_size_new_height * Mods.Tabs.chat_size_percent - parseFloat(e.style.bottom)) + "px";
        "undefined" != typeof x && (e.scrollTop += x);
        x = Math.round(getAbsoluteHeight(chat) + y);
        e = Math.round(parseFloat(e.style.maxHeight) + y);
        void 0 != el && (el.style.bottom = Math.min(x, e) + "px ");
        void 0 != elem && (elem.style.bottom = Math.min(x, e) + parseFloat(el.style.height) + "px");
    };
    Mods.Tabs.add = function(elm) {
        for (var that = getElem("tabs"), li = document.createElement("li"), index = that.childNodes.length - 1; getElem("tabs_" + index); ) index++;
        li.id = "tabs_" + index;
        li.innerHTML = "" + elm + "";
        li.onclick = function() {
            Mods.Tabs.showTab(this);
            -1 !== Mods.loadedMods.indexOf("Chatmd") && Mods.Chatmd.chatCommand(!1);
        };
        li.oncontextmenu = function(event) {
            Mods.Tabs.rclick(event);
        };
        elm = getElem("tabs_add");
        that.insertBefore(li, elm);
        Mods.Tabs.wwTabContent.push({
            id: "tabs_" + index,
            history: []
        });
        that.childNodes.length > Mods.Tabs.wwMaxTabs && (getElem("tabs_add").style.display = "none");
        return li.id;
    };
    Mods.Tabs.rclick = function(node) {
        node = node.target;
        if (null != node) {
            var text = node.innerText, offset = elementXY(node.id), elem = getElem("action_menu");
            addClass(elem, "hidden");
            elem.style.left = offset.left + 20 + "px";
            elem.innerHTML = "<span class='line' onclick='Mods.Tabs.showTab(getElem(\"" + node.id + '"));ChatSystem.filters();addClass(getElem("action_menu"),"hidden");\'>Edit Tab Filters</span>';
            "tabs_default" != node.id && (elem.innerHTML += "<span class='line' onclick='Mods.Tabs.rename(\"" + node.id + '");addClass(getElem("action_menu"),"hidden");\'>Rename<span class=\'item\'>' + text + "</span></span><span class='line' onclick='Mods.Tabs.remove(\"" + node.id + '");addClass(getElem("action_menu"),"hidden");\'>Remove<span class=\'item\'>' + text + "</span></span>");
            if (0 == Mods.Tabs.wwCurrentTabs[Mods.Tabs.findWithAttr(Mods.Tabs.wwCurrentTabs, "id", node.id)].filter_playerchat) {
                var text = Mods.Tabs.wwCurrentTabs[Mods.Tabs.findWithAttr(Mods.Tabs.wwCurrentTabs, "id", node.id)].channels, t;
                for (t in Contacts.channels) elem.innerHTML = void 0 == text[t] || 1 == text[t] ? elem.innerHTML + ("<span class='line' onclick='Mods.Tabs.switchtabchannel(\"" + node.id + '", "' + t + '", false);addClass(getElem("action_menu"),"hidden");\'>Hide Channel <span class=\'item\'>' + t + "</span></span>") : elem.innerHTML + ("<span class='line' onclick='Mods.Tabs.switchtabchannel(\"" + node.id + '", "' + t + '", true);addClass(getElem("action_menu"),"hidden");\'>Show Channel <span class=\'item\'>' + t + "</span></span>");
            }
            elem.style.top = offset.top - 22 * elem.childElementCount + "px";
            0 < elem.innerHTML.length && removeClass(elem, "hidden");
        }
    };
    Mods.Tabs.switchtabchannel = function(id, n, c) {
        Mods.Tabs.wwCurrentTabs[Mods.Tabs.findWithAttr(Mods.Tabs.wwCurrentTabs, "id", id)].channels[n] = c;
        localStorage.CurrentTabs = JSON.stringify(Mods.Tabs.wwCurrentTabs);
    };
    Mods.Tabs.rename = function(oldKey) {
        var c = getElem(oldKey);
        void 0 != c && Popup.input_prompt("Please enter new chat tab name:", function(n) {
            n && "" != n && (Mods.Tabs.wwCurrentTabs[Mods.Tabs.findWithAttr(Mods.Tabs.wwCurrentTabs, "name", c.innerText)].name = n, 
            c.innerText = n, localStorage.CurrentTabs = JSON.stringify(Mods.Tabs.wwCurrentTabs));
        });
    };
    Mods.Tabs.remove = function(selector) {
        var elem = getElem(selector);
        void 0 != elem && (Mods.Tabs.wwactiveTab == selector && (selector = getElem("tabs_default"), 
        Mods.Tabs.showTab(selector), Mods.Tabs.wwactiveTab = "tabs_default"), Mods.Tabs.wwCurrentTabs.splice(Mods.Tabs.findWithAttr(Mods.Tabs.wwCurrentTabs, "name", elem.innerText), 1), 
        localStorage.CurrentTabs = JSON.stringify(Mods.Tabs.wwCurrentTabs), elem.parentNode.removeChild(elem), 
        getElem("tabs_add").style.display = "");
    };
    Mods.Tabs.findWithAttr = function(array, prop, value) {
        for (var k = 0; k < array.length; k += 1) if (array[k][prop] === value) return k;
    };
    Mods.Tabs.chatrefill = function(indexes) {
        chat_history = indexes.slice(0);
        getElem("chat").innerHTML = "";
        resyncRequired = 100;
        Chat.resync();
    };
    Mods.Tabs.Warning = function(node) {
        getElem(node).className = "warning";
        setTimeout(function() {
            "selected" != getElem(node).className && (getElem(node).className = "");
        }, 350);
        setTimeout(function() {
            "selected" != getElem(node).className && (getElem(node).className = "warning");
        }, 700);
    };
    Mods.Tabs.SaveCurrent = function() {
        var props = Mods.Tabs.wwCurrentTabs[Mods.Tabs.findWithAttr(Mods.Tabs.wwCurrentTabs, "id", Mods.Tabs.wwactiveTab)];
        props.filter_skillattempts = chat_filters.attempt || !1;
        props.filter_skillfails = chat_filters.fails || !1;
        props.filter_playerchat = chat_filters.chat || !1;
        props.filter_whispering = chat_filters.whisper || !1;
        props.filter_joinleave = chat_filters.join_leave || !1;
        props.filter_loot = chat_filters.loot || !1;
        props.filter_magic = chat_filters.magic || !1;
        props.filter_spam = chat_filters.spam || !1;
        props.filter_coloredchannels = chat_filters.color || !1;
        props.filter_coloredonly = getElem("filter_channel_only") ? getElem("filter_channel_only").checked : !1;
        props.filter_highlightfriends = getElem("filter_highlight_friends") ? getElem("filter_highlight_friends").checked : !1;
        props.filter_chatmoderator = chat_filters.modcolor || !1;
        props.filter_timestamps = chat_filters.chattimestamp || !1;
        props.filter_urlfilter = chat_filters.urlfilter || !1;
        props.activechannel = "" != getElem("current_channel").value ? getElem("current_channel").value : "EN";
        localStorage.CurrentTabs = JSON.stringify(Mods.Tabs.wwCurrentTabs);
    };
    Mods.Tabs.LoadCurrent = function() {
        var data = Mods.Tabs.wwCurrentTabs[Mods.Tabs.findWithAttr(Mods.Tabs.wwCurrentTabs, "id", Mods.Tabs.wwactiveTab)];
        chat_filters.attempt = data.filter_skillattempts || !1;
        chat_filters.fails = data.filter_skillfails || !1;
        chat_filters.chat = data.filter_playerchat || !1;
        chat_filters.whisper = data.filter_whispering || !1;
        chat_filters.join_leave = data.filter_joinleave || !1;
        chat_filters.loot = data.filter_loot || !1;
        chat_filters.magic = data.filter_magic || !1;
        chat_filters.spam = data.filter_spam || !1;
        chat_filters.color = data.filter_coloredchannels || !1;
        getElem("filter_channel_only") && (getElem("filter_channel_only").checked = data.filter_coloredonly);
        getElem("filter_highlight_friends") && (getElem("filter_highlight_friends").checked = data.filter_highlightfriends);
        chat_filters.modcolor = data.filter_chatmoderator || !1;
        chat_filters.chattimestamp = data.filter_timestamps || !1;
        chat_filters.urlfilter = data.filter_urlfilter || !1;
        data.activechannel && Contacts.channels[data.activechannel] && (getElem("current_channel").value = data.activechannel);
    };
    Mods.Tabs.showTab = function(elements) {
        var id = elements.id;
        getElem("filters_form").style.display = "none";
        Mods.Tabs.SaveCurrent();
        if (void 0 != getElem("tabs") && Mods.Tabs.wwactiveTab != elements.id) {
            elements = getElem("tabs").childNodes;
            for (var k in elements) elements[k].id == id ? (elements[k].className = "selected", 
            Mods.Tabs.wwactiveTab = id, Mods.Tabs.LoadCurrent(), Mods.Tabs.chatrefill(Mods.Tabs.wwTabContent[Mods.Tabs.findWithAttr(Mods.Tabs.wwTabContent, "id", id)].history)) : "selected" == elements[k].className && (elements[k].className = "");
        }
    };
    Chat.set_visible = function() {
        if (0 == Mods.Tabs.set_visible()) return !1;
        -1 != Mods.loadedMods.indexOf("Tabs") && (getElem("tabs").style.visibility = "visible", 
        getElem("chat_resize").style.visibility = "visible", Mods.Tabs.resize());
        return !0;
    };
    Chat.remove_line = function(elementID, attrs) {
        var node = document.getElementById("chat_" + elementID);
        if (node) {
            var id = /(.*?)&gt;/g.exec(node.innerHTML)[0];
            node.innerHTML = id + " &lt;Message removed by " + attrs + "&gt;";
        }
        for (id in chat_history) if (chat_history[id] && chat_history[id].id && chat_history[id].id == elementID) {
            chat_history[id].text = "<Message removed by " + attrs + ">";
            break;
        }
        for (tab in Mods.Tabs.wwTabContent) for (id in Mods.Tabs.wwTabContent[tab].history) Mods.Tabs.wwTabContent[tab].history[id] && Mods.Tabs.wwTabContent[tab].history[id].id && Mods.Tabs.wwTabContent[tab].history[id].id == elementID && (Mods.Tabs.wwTabContent[tab].history[id].text = "<Message removed by " + attrs + ">");
    };
    (function() {
        var b = getElem("wrapper"), c = getElem("chat"), el = document.createElement("ul");
        el.id = "tabs";
        void 0 != localStorage.CurrentTabs ? Mods.Tabs.wwCurrentTabs = JSON.parse(localStorage.CurrentTabs) || [] : Mods.Tabs.wwCurrentTabs.push({
            id: "tabs_default",
            name: "Default",
            activechannel: "EN",
            channels: JSON.parse(JSON.stringify(Contacts.channels)),
            filter_skillattempts: chat_filters.attempt || !1,
            filter_skillfails: chat_filters.fails || !1,
            filter_playerchat: chat_filters.chat || !1,
            filter_whispering: chat_filters.whisper || !1,
            filter_joinleave: chat_filters.join_leave || !1,
            filter_loot: chat_filters.loot || !1,
            filter_magic: chat_filters.magic || !1,
            filter_spam: chat_filters.spam || !1,
            filter_coloredchannels: chat_filters.color || !1,
            filter_coloredonly: getElem("filter_channel_only") ? getElem("filter_channel_only").checked : !1,
            filter_highlightfriends: getElem("filter_highlight_friends") ? getElem("filter_highlight_friends").checked : !1,
            filter_chatmoderator: chat_filters.modcolor || !1,
            filter_timestamps: chat_filters.chattimestamp || !1,
            filter_urlfilter: chat_filters.urlfilter || !1
        });
        Mods.Tabs.wwactiveTab = "tabs_default";
        if (0 < Mods.Tabs.wwCurrentTabs.length) for (i in Mods.Tabs.wwCurrentTabs) {
            var li = document.createElement("li");
            li.id = Mods.Tabs.wwCurrentTabs[i].id;
            Mods.Tabs.wwCurrentTabs[i].id == Mods.Tabs.wwactiveTab && (li.style.selected = "true", 
            li.className = "selected", chat_filters.attempt = Mods.Tabs.wwCurrentTabs[i].filter_skillattempts || !1, 
            chat_filters.fails = Mods.Tabs.wwCurrentTabs[i].filter_skillfails || !1, chat_filters.chat = Mods.Tabs.wwCurrentTabs[i].filter_playerchat || !1, 
            chat_filters.whisper = Mods.Tabs.wwCurrentTabs[i].filter_whispering || !1, chat_filters.join_leave = Mods.Tabs.wwCurrentTabs[i].filter_joinleave || !1, 
            chat_filters.loot = Mods.Tabs.wwCurrentTabs[i].filter_loot || !1, chat_filters.magic = Mods.Tabs.wwCurrentTabs[i].filter_magic || !1, 
            chat_filters.spam = Mods.Tabs.wwCurrentTabs[i].filter_spam || !1, chat_filters.color = Mods.Tabs.wwCurrentTabs[i].filter_coloredchannels || !1, 
            getElem("filter_channel_only") && (getElem("filter_channel_only").checked = Mods.Tabs.wwCurrentTabs[i].filter_coloredonly), 
            getElem("filter_highlight_friends") && (getElem("filter_highlight_friends").checked = Mods.Tabs.wwCurrentTabs[i].filter_highlightfriends), 
            chat_filters.modcolor = Mods.Tabs.wwCurrentTabs[i].filter_chatmoderator || !1, chat_filters.chattimestamp = Mods.Tabs.wwCurrentTabs[i].filter_timestamps || !1, 
            chat_filters.urlfilter = Mods.Tabs.wwCurrentTabs[i].filter_urlfilter || !1);
            li.innerHTML = Mods.Tabs.wwCurrentTabs[i].name;
            li.onclick = function() {
                Mods.Tabs.showTab(this);
                -1 !== Mods.loadedMods.indexOf("Chatmd") && Mods.Chatmd.chatCommand(!1);
            };
            li.oncontextmenu = function(event) {
                Mods.Tabs.rclick(event);
            };
            el.appendChild(li);
            Mods.Tabs.wwTabContent.push({
                id: Mods.Tabs.wwCurrentTabs[i].id,
                history: Mods.Tabs.wwCurrentTabs[i].id == Mods.Tabs.wwactiveTab ? chat_history.slice(0) : []
            });
        }
        li = document.createElement("li");
        li.id = "tabs_add";
        li.innerHTML = "[+]";
        li.onclick = function(event) {
            Mods.Tabs.wwCurrentTabs.length < Mods.Tabs.wwMaxTabs && Popup.input_prompt("Please enter new chat tab name:", function(name) {
                if (name && "" != name) {
                    var id = Mods.Tabs.add(name), node = {};
                    node.name = name;
                    node.channels = JSON.parse(JSON.stringify(Contacts.channels));
                    node.id = id;
                    node.filter_skillattempts = chat_filters.attempt || !1;
                    node.filter_skillfails = chat_filters.fails || !1;
                    node.filter_playerchat = chat_filters.chat || !1;
                    node.filter_whispering = chat_filters.whisper || !1;
                    node.filter_joinleave = chat_filters.join_leave || !1;
                    node.filter_loot = chat_filters.loot || !1;
                    node.filter_magic = chat_filters.magic || !1;
                    node.filter_spam = chat_filters.spam || !1;
                    node.filter_coloredchannels = chat_filters.color || !1;
                    node.filter_coloredonly = getElem("filter_channel_only") ? getElem("filter_channel_only").checked : !1;
                    node.filter_highlightfriends = getElem("filter_highlight_friends") ? getElem("filter_highlight_friends").checked : !1;
                    node.filter_chatmoderator = chat_filters.modcolor || !1;
                    node.filter_timestamps = chat_filters.chattimestamp || !1;
                    node.filter_urlfilter = chat_filters.urlfilter || !1;
                    node.activechannel = "" != getElem("current_channel").value ? getElem("current_channel").value : "EN";
                    Mods.Tabs.wwCurrentTabs.push(node);
                }
                localStorage.CurrentTabs = JSON.stringify(Mods.Tabs.wwCurrentTabs);
            });
        };
        el.appendChild(li);
        b.appendChild(el);
        el.childNodes.length > Mods.Tabs.wwMaxTabs && (getElem("tabs_add").style.display = "none");
        el = Mods.Tabs.wwCurrentTabs[Mods.Tabs.findWithAttr(Mods.Tabs.wwCurrentTabs, "id", Mods.Tabs.wwactiveTab)];
        el.activechannel && (getElem("current_channel").value = el.activechannel);
        el = getElem("chat_resize");
        void 0 == el && (el = document.createElement("div"), el.id = "chat_resize", el.style.height = "4px", 
        el.style.width = "99.5%", el.style.left = "5px", el.style.position = "absolute", 
        el.style.display = "block", el.style.cursor = "n-resize", el.style.zIndex = "100", 
        el.draggable = "true", addEvent(el, "touchmove", function(e) {
            100 < timestamp() - Mods.Tabs.chat_resize_timestamp && (e = (last_updated.set_canvas_size_new_height - e.changedTouches[0].pageY) / last_updated.set_canvas_size_new_height, 
            1 > e && 0 < e && (Mods.Tabs.chat_size_percent = e), Mods.setCanvasSize(), Mods.Tabs.chat_resize_timestamp = timestamp());
        }, !1), addEvent(el, "mousedown", function(e) {
            Mods.Tabs.dragEvents(e);
        }), addEvent(el, "mouseup", function(e) {
            Mods.Tabs.dragEvents(e);
        }), addEvent(document.documentElement, "drop", function(ev) {
            Mods.Tabs.dragEvents(ev);
        }), addEvent(document.documentElement, "mouseup", function(ev) {
            Mods.Tabs.dragEvents(ev);
        }), addEvent(el, "drag", function(evt) {
            50 < timestamp() - Mods.Tabs.chat_resize_timestamp && (evt = (last_updated.set_canvas_size_new_height - evt.pageY) / last_updated.set_canvas_size_new_height, 
            1 > evt && 0 < evt && (Mods.Tabs.chat_size_percent = evt), Mods.setCanvasSize(), 
            Mods.Tabs.lockScroll(), Mods.Tabs.chat_resize_timestamp = timestamp());
        }), getElem("wrapper").appendChild(el));
        addEvent(b, "dragenter", function(e) {
            Mods.Tabs.dragEvents(e);
        });
        addEvent(b, "dragover", function(e) {
            Mods.Tabs.dragEvents(e);
        });
        addEvent(c, "scroll", function(event) {
            Mods.Tabs.dragEvents(event);
        });
    })();
    Mods.timestamp("tabs");
};

Load.farming = function() {
    modOptions.farming.time = timestamp();
    Mods.Farming.loadDivs = function() {
        null == getElem("mods_farming_holder") && (createElem("div", wrapper, {
            id: "mods_farming_holder",
            className: "menu",
            style: "position: absolute; display: none; z-index: 999;",
            innerHTML: Mods.Farming.farming_queue_template()
        }), createElem("div", wrapper, {
            id: "mods_farming_options",
            className: "menu",
            style: "position: absolute; display: none; z-index: 999;",
            innerHTML: Mods.Farming.farming_queue_option_template(),
            onclick: "Mods.Farming.queueOptions();"
        }));
    };
    Mods.Farming.loadDivs();
    Mods.Farming.lastCtrlTime = 0;
    Mods.Farming.eventListener = {
        keys: {
            keyup: [ KEY_ACTION.CTRL ],
            keydown: [ KEY_ACTION.CTRL, 32 ]
        },
        fn: function(node, s, e) {
            300 === players[0].map && players[0].name == players[0].params.island && ("keyup" === node && e === KEY_ACTION.CTRL && 50 > timestamp() - Mods.Farming.lastCtrlTime && Mods.Farming.ctrlHeld(!1), 
            "keydown" === node && (e === KEY_ACTION.CTRL && (200 < timestamp() - Mods.Farming.lastCtrlTime ? Mods.Farming.ctrlHeld(!Mods.Farming.ctrlPressed) : Mods.Farming.ctrlHeld(!0), 
            Mods.Farming.lastCtrlTime = timestamp()), 300 == players[0].map && 32 === s && GAME_STATE != GAME_STATES.CHAT && (!1 === Mods.Farming.queuePaused ? Mods.Farming.pauseQueue(!1, !1, !0) : Mods.Farming.pauseQueue(!1, !1, !1))));
        }
    };
    Mods.Farming.lastMove = 0;
    moveInPath = function(asset) {
        if (!asset.path || asset.path && 0 === asset.path.length) return !1;
        asset.me && 300 == players[0].map && Mods.Farming.options.mods_farming_opt_stop && (1 === Mods.Farming.queuePaused || Mods.Farming.ctrlPressed) ? (players[0].path = [], 
        selected = selected_object = {
            i: null,
            j: null
        }) : Mods.Farming.oldMoveInPath(asset);
    };
    Mods.Farming.queueOptions = function(event) {
        if (!0 === event) {
            var elem = getElem("mods_farming_options"), val = elem.style.display;
            elem.style.display = "none" == val ? "block" : "none";
        }
        var data = {
            mods_farming_opt_stop: !1,
            mods_farming_opt_save: !0,
            mods_farming_opt_equipped: !0
        }, options = Mods.Farming.options, key;
        for (key in data) elem = getElem(key), void 0 === options[key] ? (val = data[key], 
        options[key] = val, elem.checked = val) : !1 === event ? elem.checked = options[key] : (val = elem.checked, 
        options[key] = val);
        localStorage.farming_options = JSON.stringify(options);
    };
    Mods.Farming.queueOptions(!1);
    Mods.Farming.findExtendedPath = function(object) {
        if ("object" === typeof object && void 0 != object.i && void 0 != object.j) object = map_increase, 
        map_increase = 200, players[0].path = findPathFromTo(players[0], selected_object, players[0]), 
        map_increase = object; else return [];
    };
    Mods.Farming.ctrlHeld = function(j) {
        Mods.Farming.ctrlPressed = !0 === j ? !0 : !1;
        j = !0 === j ? 1 : !0;
        Mods.Farming.actionState();
        Mods.Farming.pauseQueue(null, !0, j);
    };
    Mods.Farming.setCanvasSize = function() {
        getElem("mods_farming_holder", {
            style: {
                display: 300 == players[0].map && players[0].name == players[0].params.island ? "block" : "none",
                left: 6 + ("block" == getElem("magic_slots").style.display || "" == getElem("magic_slots").style.left ? 38 : 0) + "px",
                top: Math.ceil(105 * current_ratio_y) + "px",
                width: "145px",
                fontSize: ".7em"
            }
        });
        getElem("mods_farming_queue").style.height = Math.round(120 * current_ratio_y) + "px";
        getElem("mods_farming_options", {
            style: {
                display: 300 != players[0].map || players[0].name != players[0].params.island ? "none" : getElem("mods_farming_options").style.display,
                left: 18 + parseInt(getElem("mods_farming_holder").style.width.replace("px", "")) + ("block" == getElem("magic_slots").style.display || "" == getElem("magic_slots").style.left ? 38 : 0) + "px",
                top: Math.ceil(105 * current_ratio_y) + "px",
                width: "145px",
                fontSize: ".7em",
                height: ""
            }
        });
        300 == players[0].map || Mods.Farming.options.mods_farming_opt_save || Mods.Farming.cancelQueue();
    };
    Mods.Farming.hideQueue = function(style, rework) {
        var elem = getElem("mods_farming_queue"), cStyle = style || getElem("mods_farming_opt_hide");
        Mods.Farming.queueHidden || rework ? (Mods.Farming.queueHidden = !1, elem.style.display = "", 
        cStyle.innerHTML = "Hide queued window") : (Mods.Farming.queueHidden = !0, elem.style.display = "none", 
        cStyle.innerHTML = "Show queued window");
    };
    Mods.Farming.actionState = function() {
        var val;
        val = Mods.Farming.ctrlPressed || 1 === Mods.Farming.queuePaused ? "Queuing" : !0 === Mods.Farming.queuePaused ? "Paused" : "Active";
        getElem("mods_farming_action").innerHTML = val;
    };
    Mods.Farming.pauseQueue = function(error, filePath, e) {
        filePath ? Mods.Farming.ctrlPressed || Timers.set("farm_check", function(num) {
            Mods.Farming.checkQueue(0, num);
        }, Math.min(Math.max(players[0].temp.animate_until - timestamp(), 50), 500)) : Mods.Farming.ctrlPressed && Mods.Farming.ctrlHeld(!1);
        error = {
            "true": "1",
            1: "false",
            "false": "true"
        };
        Mods.Farming.queuePaused = void 0 != error[e] ? JSON.parse(error[e]) : Mods.Farming.queuePaused;
        e = getElem("farming_queue_button");
        !0 === Mods.Farming.queuePaused ? (Mods.Farming.queuePaused = !1, Timers.set("farm_check", function(num) {
            Mods.Farming.checkQueue(0, num);
        }, Math.min(Math.max(players[0].temp.animate_until - timestamp(), 50), 100)), e.innerHTML = "(queue)") : 1 === Mods.Farming.queuePaused ? (Mods.Farming.queuePaused = !0, 
        e.innerHTML = "(resume)") : (Mods.Farming.queuePaused = 1, e.innerHTML = "(pause)", 
        players[0].path = []);
        Mods.Farming.actionState();
    };
    Mods.Farming.addToQueue = function(obj) {
        if (players[0].params.island !== players[0].name) Mods.Farming.pauseQueue(!1, !1, !0); else if ("object" == typeof obj && void 0 != obj.id) {
            var q = Mods.Farming.queue, j = obj.b_i, c = obj.id, t = obj.name, k = obj.i + "_" + obj.j + "_" + j;
            if (Mods.Farming.canPerform(c, !1)) {
                var lookahead = {
                    333: {
                        slot: 3,
                        name: "Seed",
                        action: "seed"
                    },
                    332: {
                        slot: 4,
                        name: "Rake",
                        action: "rake"
                    }
                };
                action = void 0 != lookahead[j] ? lookahead[j].action : "harvest";
                q[k] = {
                    id: k,
                    obj_id: c,
                    item_id: j,
                    i: obj.i,
                    j: obj.j,
                    delay: 333 == j || 332 == j ? 1e3 : 2e3,
                    action: action
                };
                Mods.Farming.sortedQueue.push(k);
                getElem("mods_farming_queue").innerHTML += Mods.Farming.farming_queue_action_template({
                    slot: k,
                    action: capitaliseFirstLetter(action),
                    object: t,
                    i: obj.i,
                    j: obj.j
                });
                (1 == Mods.Farming.sortedQueue.length || !Timers.running("farm_queue") || 5e3 < timer_holder.farm_queue || 0 == players[0].path.length) && Timers.set("farm_queue", function(args) {
                    Mods.Farming.performQueue(0, Mods.Farming.sortedQueue[0]);
                }, Math.max(players[0].temp.animate_until - timestamp(), 50));
                getElem("mods_farming_total").innerHTML = Mods.Farming.sortedQueue.length;
            }
        }
    };
    Mods.Farming.canPerform = function(object, other) {
        if ((null != other ? other : 1) && 0 == Mods.Farming.sortedQueue.length) return !1;
        var el = objects_data[object];
        if (void 0 == el) return !1;
        var name = el.b_i, out = {
            333: {
                slot: 3,
                name: "Seed",
                action: "seed"
            },
            332: {
                slot: 4,
                name: "Rake",
                action: "rake"
            }
        }, r = !1;
        if (void 0 != (out[name] || void 0)) {
            var el = players[0].temp.inventory, k;
            for (k in el) if (el[k].selected && item_base[el[k].id] && out[name] && (-1 < item_base[el[k].id].name.indexOf(out[name].name) || "Seed" == out[name].name && "Bag of Worms" == item_base[el[k].id].name)) {
                r = !0;
                break;
            }
            r || !1 !== Mods.Farming.options.mods_farming_opt_equipped || (r = 1);
        } else (name = object_base[name].params.duration) && ((secondstamp() - el.params.secondstamp) / 60 || name) >= name && (40 > players[0].temp.inventory.length ? r = !0 : !1 === Mods.Farming.options.mods_farming_opt_equipped && (r = 1));
        return r;
    };
    Mods.Farming.performQueue = function(x, handler) {
        if (players[0].params.island === players[0].name) {
            300 != players[0].map && Mods.Farming.pauseQueue(!1, !1, !0);
            handler = "string" == typeof handler ? handler : Mods.Farming.sortedQueue[0] || null;
            var e = Mods.Farming.sortedQueue, obj = Mods.Farming.queue[e[0]];
            Mods.Farming.ctrlPressed || Mods.Farming.queuePaused || (e["number" == typeof x ? x : 0] != handler ? Mods.Farming.checkQueue(0, e[0]) : (e = Mods.Farming.canPerform(obj.obj_id), 
            void 0 == obj || !0 !== e ? Mods.Farming.pauseQueue(!1, !1, !0) : (e = objects_data[obj.obj_id], 
            void 0 != e && e.i == obj.i && e.j == obj.j && (selected = selected_object = e, 
            Mods.Farming.findExtendedPath(selected_object), 0 == players[0].path.length && ActionMenu.act(0), 
            obj = obj.delay + Math.min(Math.max(players[0].temp.animate_until - timestamp(), 50), 200), 
            0 < players[0].path.length && moveInPath(players[0]), Timers.set("farm_check", function(err, vbs) {
                Mods.Farming.checkQueue(0, err);
            }, obj)))));
        }
    };
    Mods.Farming.checkQueue = function(p, value) {
        if (players[0].params.island === players[0].name) if (100 > timestamp() - Mods.Farming.lastMove || players[0].temp.busy || 0 < players[0].path.length || captcha) Timers.set("farm_check", function() {
            Mods.Farming.checkQueue();
        }, 100); else {
            Mods.Farming.lastMove = timestamp();
            p = "number" == typeof p ? p : 0;
            value = "string" == typeof value ? value : Mods.Farming.sortedQueue[0] || null;
            var pos = Mods.Farming.sortedQueue, data = Mods.Farming.queue[pos[p]], size = void 0 != data ? data.obj_id : null;
            0 == pos.length ? Mods.Farming.cancelQueue() : void 0 == data ? Mods.Farming.deleteFromQueue(p) : "number" != typeof p || "string" != typeof value ? Timers.set("farm_check", function(num) {
                Mods.Farming.checkQueue(0, num);
            }, Math.min(Math.max(players[0].temp.animate_until - timestamp(), 50), 500)) : (data = obj_g(on_map[300][data.i][data.j]), 
            size != data.id ? Mods.Farming.deleteFromQueue(p, !0) : inDistance(players[0].i, players[0].j, data.i, data.j) ? (selected_object = data, 
            ActionMenu.act(0), Mods.Farming.deleteFromQueue(p, !0)) : pos[p] == value ? Mods.Farming.performQueue(p, value) : 0 < pos.length && !Timers.running("farm_queue") && Mods.Farming.performQueue(0, pos[0]));
        }
    };
    Mods.Farming.deleteFromQueue = function(k, v) {
        v = v || !1;
        var msg = Mods.Farming.queue[Mods.Farming.sortedQueue[k]], id = void 0 != msg ? msg.obj_id : null, msg = obj_g(on_map[300][msg.i][msg.j]);
        0 < Mods.Farming.sortedQueue.length && k < Mods.Farming.sortedQueue.length && !Mods.Farming.queuePaused && !Mods.Farming.ctrlPressed && msg.id != id && (id = Mods.Farming.sortedQueue[k], 
        delete Mods.Farming.queue[id], Mods.Farming.sortedQueue.splice(k, 1), null != getElem("mods_farming_" + id) && getElem("mods_farming_queue").removeChild(getElem("mods_farming_" + id)), 
        v && Mods.Farming.checkQueue(k, Mods.Farming.sortedQueue[k]), Timers.set("farming_queue_active", function() {
            Mods.Farming.checkQueue(0);
        }, 2500), getElem("mods_farming_total").innerHTML = Mods.Farming.sortedQueue.length);
    };
    Mods.Farming.cancelQueue = function() {
        Timers.clear("farm_check");
        Timers.clear("farm_queue");
        Mods.Farming.queue = {};
        Mods.Farming.sortedQueue = [];
        getElem("mods_farming_queue").innerHTML = "<span style='width: 100%; float: left; display: inline-block; font-weight: bold; color: #999;'><span>Action:&nbsp;&nbsp;Object</span><span style='float: right;'>Coords</span></span>";
        getElem("mods_farming_total").innerHTML = Mods.Farming.sortedQueue.length;
    };
    DEFAULT_FUNCTIONS.rake = function(p, c) {
        Mods.Farming.performActivity(p) ? (Mods.Farming.oldDefault.rake(p, c), Timers.set("farming_queue_active", function() {
            Mods.Farming.checkQueue(0);
        }, 100)) : (Mods.Farming.findExtendedPath(p), 0 < players[0].path.length && !players[0].temp.busy && moveInPath(players[0]));
    };
    DEFAULT_FUNCTIONS.seed = function(PRNG_seed, x) {
        Mods.Farming.performActivity(PRNG_seed) ? (Mods.Farming.oldDefault.seed(PRNG_seed, x), 
        Timers.set("farming_queue_active", function() {
            Mods.Farming.checkQueue(0);
        }, 100)) : (Mods.Farming.findExtendedPath(PRNG_seed), 0 < players[0].path.length && !players[0].temp.busy && moveInPath(players[0]));
    };
    DEFAULT_FUNCTIONS.harvest = function(payload, callback) {
        Mods.Farming.performActivity(payload) ? (Mods.Farming.oldDefault.harvest(payload, callback), 
        Timers.set("farming_queue_active", function() {
            Mods.Farming.checkQueue(0);
        }, 100)) : (Mods.Farming.findExtendedPath(payload), 0 < players[0].path.length && !players[0].temp.busy && moveInPath(players[0]));
    };
    Mods.Farming.performActivity = function(msg) {
        if (300 == players[0].map) {
            var data = obj_g(msg);
            if (!building_mode_enabled && (!0 !== Mods.Farming.queuePaused || Mods.Farming.ctrlPressed) && data.id && data.params && (void 0 != data.params.rotate || 753 == data.params.carpentry_item_id)) if (void 0 == Mods.Farming.queue[data.i + "_" + data.j + "_" + data.b_i] && Mods.Farming.addToQueue(data), 
            !Mods.Farming.ctrlPressed && 1 !== Mods.Farming.queuePaused && 0 < Mods.Farming.sortedQueue.length) {
                if (data.id == selected_object.id) return !0;
                msg = Mods.Farming.queue[Mods.Farming.sortedQueue[0]];
                (msg = obj_g(on_map[300][msg.i][msg.j])) && (selected = selected_object = msg);
                "object" == typeof selected_object && selected_object.activities && selected_object.activities[0] && 0 < selected_object.activities[0].length && ActionMenu.act(0);
                if (msg.id != data.id) return !1;
            } else return !1; else if (!(data && data.id && data.params) || void 0 == data.params.rotate && 753 != data.params.carpentry_item_id) return !1;
        }
        return !0;
    };
    Mods.Farming.inventoryEquip = function(hash, key, e) {
        779 == key && 300 == players[0].map && (selected = selected_object = obj_g(on_map[300][9][10]), 
        Mods.Farming.findExtendedPath(selected), 0 < players[0].path.length ? moveInPath(players[0]) : ActionMenu.act(0));
        return !1;
    };
    Mods.timestamp("farming");
};

Load.gearmd = function() {
    modOptions.gearmd.time = timestamp();
    Mods.Gearmd = {};
    Gearmd = Mods.Gearmd;
    Gearmd.temp = function() {
        clearGear = function() {
            null !== getElem("gear_inv_holder") && document.body.removeChild(getElem("gear_inv_holder"));
        };
        clearGear();
        createElem("div", wrapper, {
            id: "gear_inv_holder",
            className: "menu",
            title: "Click and drag to move this window.",
            onmousedown: function(evt) {
                evt = evt || window.event;
                this.coordinates = {
                    dx: (parseInt(this.style.left) || 0) - evt.clientX,
                    dy: (parseInt(this.style.top) || 0) - evt.clientY
                };
                this.canMove = !0;
            },
            onmousemove: function(e) {
                e = e || window.event;
                this.canMove && "mods_wiki_name" != e.target.id && (this.style.left = Math.min(parseInt(wrapper.style.width) - 100, Math.max(-100, e.clientX + this.coordinates.dx)) + "px", 
                this.style.top = Math.min(parseInt(wrapper.style.height) - 80, Math.max(-80, e.clientY + this.coordinates.dy)) + "px");
            },
            onmouseup: function(evt) {
                this.canMove = !1;
            },
            style: "position: absolute; top: 100px; width: 190px; left: 45px; float: left; z-index: 999; display: none;"
        });
        createElem("div", "gear_inv_holder", {
            id: "gear_inv_set",
            style: "position: relative; float: left; width: 108px; height: 100%; display: inline-block;"
        });
        createElem("div", "gear_inv_holder", {
            id: "gear_inv_stats",
            style: "position: relative; float: right; width: 70px; padding: 0px 8px 0px 4px; font-size: 10px;"
        });
        createElem("div", "gear_inv_set", {
            style: "position: relative; float: left; width: 100%; height: 20%; display: inline-block; padding: 0px 4px 4px; font-size: 10px;",
            innerHTML: "<span id='gear_inv_equipped' class='link pointer' style='font-weight: bold' onmouseover='javascript: this.style.color=&apos;#3BEEEE&apos;' onmouseout='javascript: this.style.color=&apos;#FFF&apos;' onclick='javascript: Gearmd.toggleEquipped(); Gearmd.updateEquipped();'>Equipped</span>\r\n                <div class='link pointer' style='float: right; font-size: 10px; margin-right: 8px; font-weight: bold; display: block;' onmouseover='javascript: this.style.color=&apos;#3BEEEE&apos;' onmouseout='javascript: this.style.color=&apos;#FFF&apos;' onclick='javascript: Gearmd.hideStats(this);'><<</div>"
        });
        createElem("div", "gear_inv_stats", {
            id: "gear_stats_holder",
            style: "position: relative; width: 100%; display: inline-block; padding: 0px 4px 4px;",
            innerHTML: "<span style='color: yellow; padding-bottom: 4px; width: 100%; display: inline-block;'>Bonuses<span class='link pointer' style='float: right; font-weight: bold; color: #FFF;' onmouseover='javascript: this.style.color=&apos;#3BEEEE&apos;' onmouseout='javascript: this.style.color=&apos;#FFF&apos;' onclick='javascript: Gearmd.showEquipment(getElem(&apos;inv_name&apos;).childNodes[0]);'>Close</span></span>"
        });
        createElem("div", "gear_inv_stats", {
            id: "gear_canvas_holder",
            style: "position: relative; float: left; bottom: 4px; right: -7px; width: 66px; height: 66px; background-color: #222;"
        });
        createElem("canvas", "gear_canvas_holder", {
            id: "gear_inv_canvas",
            width: "64px",
            height: "64px",
            style: "border: 1px solid #666; width: 64px; height: 64px;"
        });
        var obj = [ "Aim", "Power", "Armor", "Magic", "Speed" ], p;
        for (p in obj) {
            var v = obj[p], local = "gear_stats_" + v.toLowerCase();
            createElem("span", "gear_stats_holder", {
                style: "color: #FFF; display: block; width: 100%; padding-bottom: 4px; font-size: 10px;",
                innerHTML: v + " <span id='" + local + "' style='color: #3BEEEE; font-size: 10px; float: right'>111</span>"
            });
        }
        obj = "neck helm cape shield chest weapon ring legs gloves pet boots pop".split(" ");
        for (p in obj) createElem("div", "gear_inv_set", {
            id: "gear_inv_" + obj[p],
            className: "inv_item",
            style: "position: relative; width: 32px; height: 32px; margin: 1px; padding: 0px; border: solid 1px #666666; display: inline-block; font-size: 10px; color: #FFF; text-shadow: 1px 1px #000, 1px -1px #000, -1px 1px #000, -1px -1px #000; letter-spacing: 1px; text-align: center; background-color: #222;",
            onmouseover: "javascript: this.style.borderColor='#3BEEEE'; this.innerHTML='" + obj[p] + "'",
            onmouseout: "javascript: this.style.borderColor='#666'; this.innerHTML='&nbsp;'",
            onclick: "javascript: Gearmd.changeTryOn(false, false, this);",
            title: capitaliseFirstLetter(obj[p]),
            innerHTML: "&nbsp;"
        });
        p = localStorage.tryGear;
        p = "string" == typeof p ? JSON.parse(p) : {
            head: players[0].params.d_head,
            facial_hair: players[0].params.d_facial_hair,
            body: players[0].params.d_body,
            pants: players[0].params.d_pants,
            cape: !1,
            left_hand: !1,
            right_hand: !1,
            shield: !1,
            helmet: !1,
            boots: !1,
            weapon: !1,
            hands: !1
        };
        Gearmd.tryGear = p;
        p = localStorage.showGear;
        p = "string" == typeof p ? JSON.parse(p) : {
            0: !1,
            1: !1,
            2: !1,
            3: !1,
            4: !1,
            5: !1,
            6: !1,
            7: !1,
            8: !1,
            9: !1,
            10: !1,
            11: !1,
            12: !1,
            14: !1
        };
        Gearmd.showGear = p;
        Gearmd.equipped = !0;
        Gearmd.tryEmptyReplace = !1;
        getElem("gear_inv_equipped").setAttribute("title", "Click here to toggle between currently equipped items and your Vanity Set.\nUse the Wiki and search under Items to (Try On) items in your Vanity Set.");
    };
    getElem("inventory").addEventListener("mouseup", function(e) {
        Timers.set("update_equipped", function() {
            Mods.Gearmd.updateEquipped();
        }, 1e3);
    });
    Gearmd.toggleEquipped = function(x) {
        x = "boolean" === typeof x ? x : 0;
        var elem = getElem("gear_inv_equipped");
        Gearmd.equipped && 0 === x || !1 === x ? (Gearmd.equipped = !1, elem.innerHTML = "Vanity Set") : Gearmd.equipped && !0 !== x || (Gearmd.equipped = !0, 
        elem.innerHTML = "Eqiupped");
    };
    Gearmd.hideStats = function(elem) {
        var node = getElem("gear_inv_stats"), val = node.style.display, attr = getElem("gear_inv_holder");
        "" == val || void 0 == val || null == val ? (node.style.display = "none", elem.innerHTML = ">>", 
        attr.style.width = "108px") : (node.style.display = "", elem.innerHTML = "<<", attr.style.width = "190px");
    };
    Gearmd.showEquipment = function(elem, computed) {
        div = getElem("gear_inv_holder");
        elem = elem || getElem("inv_name").childNodes[0];
        "" != div.style.display || computed ? (elem.innerHTML = "Hide Equipment", div.style.display = "") : (elem.innerHTML = "Show Equipment", 
        div.style.display = "None");
        Gearmd.updateEquipped();
    };
    Gearmd.getPlayerOutfit = function(event) {
        var params = {}, index;
        for (index in Gearmd.tryGear) params[index] = !Gearmd.equipped || 0 < Gearmd && ("boolean" === typeof Gearmd.tryGear[index] || "head" === index || "facial_hair" === index || "body" === index || "pants" === index) ? Gearmd.tryGear[index] : 0;
        for (var name in params) {
            if (0 < Gearmd.tryGear[name] && !event) {
                var el = item_base[Gearmd.tryGear[name]];
                el.params && "object" === typeof el.params.visible && "undefined" != typeof el.params.visible[name] && (params[name] = el.params.visible[name], 
                "undefined" != typeof el.params.visible.left_hand && (params.left_hand = el.params.visible.left_hand), 
                "undefined" != typeof el.params.visible.right_hand && (params.right_hand = el.params.visible.right_hand));
            } else if (!0 === params[name] || event || Gearmd.tryEmptyReplace) for (index = 0; index < players[0].temp.inventory.length; index++) item = players[0].temp.inventory[index], 
            item.selected && (el = item_base[item.id], el.params && "object" == typeof el.params.visible && "undefined" != typeof el.params.visible[name] && (params[name] = el.params.visible[name]));
            0 < params[name] || (params[name] = 0);
        }
        return params.head + " " + params.facial_hair + " " + params.body + " " + params.pants + " " + params.cape + " " + params.left_hand + " " + params.right_hand + " " + params.shield + " " + params.weapon + " " + params.helmet + " " + params.boots + " " + params.hands;
    };
    Gearmd.displayPlayer = function(context) {
        context = getElem("gear_inv_canvas").getContext("2d");
        Draw.clear(context);
        context.drawImage(getBodyImg(Gearmd.getPlayerOutfit(Gearmd.equipped)), 0, 0, 64, 54, 5, 10, 64, 54);
    };
    void 0 == Gearmd.oldShowInventory && (Gearmd.oldShowInventory = BigMenu.show_inventory);
    BigMenu.show_inventory = function() {};
    getElem("inv_name").innerHTML = "<div class='link pointer' style='font-size: 10px; font-weight: bold; padding-top: 2px; color: #999;' onmouseover='javascript: this.style.color=&apos;#3BEEEE&apos;' onmouseout='javascript: this.style.color=&apos;#999&apos;' onclick='javascript: Gearmd.showEquipment(this);'>Show Equipment</div>";
    getElem("inv_name").setAttribute("title", "Open the gear menu from here.");
    Mods.Gearmd.inventoryClick = function(b) {
        Gearmd.updateEquipped();
    };
    Gearmd.showEquipped = function(b) {
        return b ? !0 : Gearmd.equipped;
    };
    Gearmd.updateEquipped = function() {
        var ids = Gearmd.equipped, elements = {
            0: "helm",
            1: "cape",
            2: "chest",
            3: "shield",
            4: "weapon",
            5: "gloves",
            6: "boots",
            7: "neck",
            8: "ring",
            11: "legs",
            12: "pet",
            14: "pop"
        }, e;
        for (e in elements) null !== getElem("gear_inv_" + elements[e]) && (getElem("gear_inv_" + elements[e]).style.background = "#333", 
        getElem("gear_inv_" + elements[e]).setAttribute("item_id", "false"));
        if (ids) {
            e = 0;
            for (var length = players[0].temp.inventory.length; e < length; e++) {
                var elem = players[0].temp.inventory[e];
                if (elem.selected) {
                    var data = item_base[elem.id], elem = data.params.slot;
                    if (elements[elem]) {
                        var elem = getElem("gear_inv_" + elements[elem]), evt = IMAGE_SHEET[data.img.sheet];
                        elem.style.background = 'url("' + evt.url + '") no-repeat scroll ' + -data.img.x * evt.tile_width + "px " + -data.img.y * evt.tile_height + "px #333";
                        elem.setAttribute("item_id", data.b_i);
                    }
                }
            }
        } else for (e in elements) if (elem = Gearmd.showGear[e], !1 !== elem) {
            if (!0 === elem) for (length in players[0].temp.inventory) if (data = players[0].temp.inventory[length], 
            data.selected && item_base[data.id].params.slot == e) {
                elem = data.id;
                break;
            }
            if (item_base[elem] || elem.id && item_base[elem.id]) data = elem.id ? item_base[elem.id] : item_base[elem], 
            elem = e, elem = getElem("gear_inv_" + elements[elem]), evt = IMAGE_SHEET[data.img.sheet], 
            elem.style.background = 'url("' + evt.url + '") no-repeat scroll ' + -data.img.x * evt.tile_width + "px " + -data.img.y * evt.tile_height + "px #333", 
            elem.setAttribute("item_id", data.b_i);
        }
        Gearmd.updateStats(ids);
        Gearmd.displayPlayer(ids);
    };
    Gearmd.updateStats = function(data) {
        var obj = {
            aim: 0,
            power: 0,
            armor: 0,
            magic: 0,
            speed: 0
        };
        if (data) for (var id = 0; id < players[0].temp.inventory.length; id++) {
            if (data = players[0].temp.inventory[id], data.selected) {
                data = item_base[data.id];
                for (var k in obj) void 0 !== data.params[k] && (obj[k] += data.params[k]);
            }
        } else for (id in Mods.Gearmd.showGear) if (data = Mods.Gearmd.showGear[id], 0 < data) for (k in data = item_base[data], 
        obj) void 0 !== data.params[k] && (obj[k] += data.params[k]);
        for (k in obj) getElem("gear_stats_" + k).innerHTML = obj[k];
        60 < obj.speed && (getElem("gear_stats_speed").innerHTML = obj.speed + "(60)");
    };
    Gearmd.changeTryOn = function(id, fn, obj) {
        var types = {
            0: "helm",
            1: "cape",
            2: "chest",
            3: "shield",
            4: "weapon",
            5: "gloves",
            6: "boots",
            7: "neck",
            8: "ring",
            11: "legs",
            12: "pet",
            14: "pop"
        }, data = {
            helm: "helmet",
            gloves: "hands",
            pop: "right_hand",
            chest: "body",
            legs: "pants"
        };
        if (fn && (void 0 == item_base[fn] || void 0 == item_base[fn].params.slot || void 0 == types[item_base[fn].params.slot]) || fn && 0 != item_base[fn].b_t && 2 != item_base[fn].b_t && 5 != item_base[fn].b_t && 7 != item_base[fn].b_t) return !1;
        if (id) {
            if (obj = item_base[fn], id = obj.params.slot, void 0 !== id && void 0 !== types[id]) {
                Gearmd.showGear[id] = fn;
                data[types[id]] ? Gearmd.tryGear[data[types[id]]] = fn : Gearmd.tryGear[types[id]] = fn;
                if ("undefined" !== typeof obj.params.disable_slot) {
                    var j = obj.params.disable_slot;
                    Gearmd.showGear[j] = !1;
                    data[types[j]] ? Gearmd.tryGear[data[types[j]]] = !1 : Gearmd.tryGear[types[j]] = !1;
                }
                for (var _i in Gearmd.showGear) obj = Gearmd.showGear[_i], 0 < obj && "undefined" != typeof item_base[obj].params && (j = item_base[obj].params.slot, 
                item_base[obj].params.disable_slot === id && (Gearmd.showGear[j] = !1, data[types[j]] ? Gearmd.tryGear[data[types[j]]] = !1 : Gearmd.tryGear[types[j]] = !1));
            }
        } else if (Gearmd.equipped) {
            id = obj;
            id = id.id || id;
            id = id.replace("gear_inv_", "");
            for (j in types) if (types[j] == id) {
                id = j;
                break;
            }
            if (0 <= id) for (j = 0; j < players[0].temp.inventory.length; j++) if (obj = players[0].temp.inventory[j], 
            obj.selected && (obj = item_base[obj.id], obj.params.slot == id)) {
                left_click_cancel = !1;
                inventoryClick(j);
                break;
            }
        } else {
            id = obj;
            id = id.id || id;
            id = id.replace("gear_inv_", "");
            for (j in types) if (types[j] == id) {
                id = j;
                break;
            }
            Gearmd.showGear[id] = !1;
            data[types[id]] ? Gearmd.tryGear[data[types[id]]] = !1 : Gearmd.tryGear[types[id]] = !1;
        }
        localStorage.tryGear = JSON.stringify(Gearmd.tryGear);
        localStorage.showGear = JSON.stringify(Gearmd.showGear);
        Gearmd.updateEquipped();
        fn && Gearmd.toggleEquipped(!1);
        fn && Gearmd.showEquipment(!1, !0);
    };
    Gearmd.temp();
    Gearmd.updateEquipped();
    Mods.timestamp("gearmd");
};

Mods.elemClass = function(node, b, c) {
    if ("object" === typeof c) {
        if ("undefined" === typeof c.className) return !1;
    } else if ("undefined" != typeof b) {
        if (c = getElem(b), "object" !== typeof c || "undefined" === typeof c.className) return !1;
    } else return !1;
    addClass(c, node);
    for (var ni in c.childNodes) "object" === typeof c.childNodes[ni] && Mods.elemClass(node, null, c.childNodes[ni]);
};

Mods.confirmClass = function(target, name, node) {
    if ("object" === typeof node) {
        if ("undefined" === typeof node.className) return !1;
    } else if ("undefined" != typeof name) {
        if (ClassValue = 0, node = getElem(name), "object" !== typeof node || "undefined" === typeof node.className) return !1;
    } else return !1;
    !hasClass(node, target) && ClassValue++;
    for (var index in node.childNodes) "object" === typeof node.childNodes[index] && Mods.confirmClass(target, null, node.childNodes[index]);
};

Mods.initialize();

Mods.loadModOptions();

Mods.elemClass("scrolling_allowed", "mods_form");

Mods.initializeOptionsMenu();

getElem("mods_link").innerHTML = "Wiki &amp; Mods menu";

getElem("mods_link").setAttribute("onclick", "javascript: removeClass(getElem('mods_form'),'hidden'); BigMenu.show(-1);");

getElem("mods_link").style.display = "";

quiet_mod_load ? (Mods.loadSelectedMods(), addClass(getElem("mods_form"), "hidden")) : Mods.consoleLog("Ready: RPG MO Mods Pack version " + Mods.version);
