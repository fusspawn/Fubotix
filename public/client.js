	/* UI */
if (window.UIInstalled) {
    var element = document.getElementById("botcontrols");
    element.parentNode.removeChild(element);
}
if (bot_interval) {
    clearTimeout(bot_interval);
}
document.getElementById("settings").innerHTML += "<div id='botcontrols'><hr/> <h2> <center> Fubot <center/> </h2></div>";
document.getElementById("botcontrols").innerHTML += "<span class='wide_link scrolling_allowed' style='float:left' id='keep_running_option'><input type='checkbox' id='run_fu_script'> Run Auto </input></span>";
document.getElementById("botcontrols").innerHTML += "<span class='wide_link scrolling_allowed' style='float:left' id='mining_bot_option'><input type='checkbox' id='run_mine_script'> Run Miner </input></span>";
document.getElementById("botcontrols").innerHTML += "<span class='wide_link scrolling_allowed' style='float:left' id='combat_bot_option'><input type='checkbox' id='run_combat_script'> Run Combat </input></span>";
document.getElementById("botcontrols").innerHTML += "<span class='wide_link scrolling_allowed' style='float:left' id='combat_bot_option'><input type='checkbox' id='run_smelter_script'> Run Smelter </input></span>";
document.getElementById("botcontrols").innerHTML += "<span class='wide_link scrolling_allowed' style='float:left' id='combat_targets_option'><input type='text' id='combat_target_string'>  </input></span>";
document.getElementById("botcontrols").innerHTML += "<span class='wide_link scrolling_allowed' style='float:left' id='location_option'><input type='button' id='dump_location_button' onclick='javascript: dump_location();' value='Dump Location'> </input></span>";
document.getElementById("botcontrols").innerHTML += "<span class='wide_link scrolling_allowed' style='float:left' id='combat_bot_option'><input type='checkbox' id='run_path_recorder_script'> Run Path Recorder </input></span>";
document.getElementById("botcontrols").innerHTML += "<span class='wide_link scrolling_allowed' style='float:left' id='location_option'><input type='button' id='dump_path_button' onclick='javascript: DumpPath();' value='Dump Path'> </input></span>";
document.getElementById("botcontrols").innerHTML += "<span class='wide_link scrolling_allowed' style='float:left' id='location_option'><input type='button' id='dump_path_button' onclick='javascript: ClearPath();' value='Clear Path'> </input></span>";
document.getElementById("botcontrols").innerHTML += "<span class='wide_link scrolling_allowed' style='float:left' id='location_option'><input type='button' id='dump_path_button' onclick='javascript: RunTestPath();' value='Run Back Path'> </input></span>";
window.UIInstalled = true;

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
                if (ui_option_checked("run_mine_script")) {
                    AutoScripts.Mine();
                } else if (ui_option_checked("run_path_recorder_script")) {
                    PathRecord();
                    bot_interval = setTimeout(bot_tick, 100);
                    return;
                } else if (ui_option_checked("run_smelter_script")) {
                    AutoScripts.Forge();
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

bot_socket.removeListener("captcha_response", CaptureResponse);
bot_socket.on("captcha_response", CaptureResponse);
addChatText("AntiDetectHandler - Added");
addChatText("Fubot Installed");



