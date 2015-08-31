	/* UI */
if (window.UIInstalled) {
    var element = document.getElementById("botcontrols");
    element.parentNode.removeChild(element);
}
if (bot_interval) {
    clearTimeout(bot_interval);
}

function ui_keep_going() {
    return document.getElementById("run_fu_script").checked;
}

function get_wanted_combat_targets() {
    var html = document.getElementById("combat_target_string").value;
    return html.split(",");
}
function ui_option_checked(id) {
    return document.getElementById(id).checked;
}

var AllowedNPCS = ["Green Wizard",
    "Dwarf Mage", "Orc Mage"];

var debug_names_when_find_by_name = false;

function contains(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}

var bot_interval = null;
function bot_tick() {
    if (ui_keep_going()) {
        API.Captcha.AntiDetect();
        var p = players[0];
        if (!p.temp.busy && p.path.length === 0 && p.temp.health > 10 && !map_change_in_progress) {
            try {
                if(ui_option_checked("run_combat_script"))
                    AutoScripts.Combat();
                else if (ui_option_checked("run_mine_script")) {
                    AutoScripts.Mine();
                } else if (ui_option_checked("run_path_recorder_script")) {
                    PathRecord();
                    bot_interval = setTimeout(bot_tick, 100);
                    return;
                } else if (ui_option_checked("run_smelter_script")) {
                    AutoScripts.Forge();
                } else if (ui_option_checked("run_steel_smelter_script")) {
                    AutoScripts.SteelForge();
                }
            } catch (err) {
                addChatText("Error: " + err);
            }
        }
    }
    bot_interval = setTimeout(bot_tick, 2000);
}

bot_interval = setTimeout(bot_tick, 2000);




function combat_logic() {
    inv_check();
    var target = find_attackables();
    if (target)
        try_move_and_kill(target);
}


function dump_location() {
    var i = players[0].i;
    var j = players[0].j;
    addChatText("{i: " + i + ", j: " + j + " , to_map: " + current_map + "}");
}

var lasti = 0;
var lastj = 0;
var lastmap = 0;
var path_record = [];
function PathRecord() {
    var i = players[0].i;
    var j = players[0].j;
    var map = current_map;
    if (i != lasti || j != lastj || map != lastmap) {
        path_record.push({ i: i, j: j, map: map });
        lasti = i;
        lastj = j;
        lastmap = current_map;
        addChatText("Moved to" + i + " " + j + " " + current_map);
    }
}

function ClearPath() {
    path_record = [];
}
function DumpPath() {
    bot_socket.emit("path_dump", JSON.stringify(path_record));
    console.log(JSON.stringify(path_record));
    addChatText(JSON.stringify(path_record));
}




