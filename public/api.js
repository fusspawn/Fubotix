API = {
    Init: function () { 
        addChatText("API Init Begin");
        InitUI();
    },   
    InitUI: function () {
        addChatText("Requesting Latest UI");
        $.ajax("http://localhost/ui.html", function (err, data) {
            if (err) {
                addChatText("Error loading bot ui.. Message: " + err);
            }
            $("#mod_menu").remove();
            $("body").innerHTML += data;
            addChatText("Latest UI Installed");
        });
    },
    DB: {
        search_item_base: function (name) { for (var i in item_base) { if (item_base[i].name == name) return item_base[i]; } return null; },
        search_npc_base: function (name) { for (var i in npc_base) { if (npc_base[i].name == name) return npc_base[i]; } return null; },
        get_item_id: function (name) { return API.DB.search_item_base(name).b_i; }
    },
    
    Inventory: {
        deposit: function () {
            API.World.find_chest();
            var obj = document.getElementById("chest_deposit_item_pet");
            if (obj)
                obj.click();
        },
        withdraw: function (id, amount) {
            API.World.find_chest();
            var slot = 0;
            for (var i = 0; i < chest_content.length; i++) {
                if (chest_content[i].id == id) {
                    slot = i;
                }
            }
            addChatText("Found iron in slot: " + slot);
            document.getElementById("chest_" + slot).click();
            for (var index = 0; index < amount; index++)
                document.getElementById("chest_withdraw").click();
        },
        
        manage_inventory: function () {
            API.World.find_chest();
            API.Inventory.deposit();
        },
        
        inv_check : function () {
            if (Inventory.is_full(players[0]))
                API.Inventory.manage_inventory();
        },
        inv_count_by_name: function (name) {
            var itemid = API.DB.search_item_base(name).b_i;
            var count = 0;
            for (var i = 0; i < players[0].temp.inventory.length; i++) {
                if (players[0].temp.inventory[i].id == itemid) {
                    count++;
                }
            }
            return count;
        },
        inv_free_space: function () {
            return 40 - players[0].temp.inventory.length;
        },
        inv_is_equipped: function (name) {
            var itemid = API.DB.search_item_base(name).b_i;
            for (var i = 0; i < players[0].temp.inventory.length; i++) {
                if (players[0].temp.inventory[i].id == itemid) {
                    if (players[0].temp.inventory[i].selected)
                        return true;
                }
            }
            return false;
        },
        inv_equip_by_name: function (name) {
            var itemid = API.DB.search_item_base(name).b_i;
            for (var i = 0; i < players[0].temp.inventory.length; i++) {
                if (players[0].temp.inventory[i].id == itemid) {
                    InvMenu.create(i);
                    InvMenu.use(i);
                    return;
                }
            }
        }
    },
    
    World: {
        distance_to: function (node) {
            return API.World.get_distance(players[0].i, players[0].j, node.i, node.j);
        },
        get_distance: function (i1, j1, i2, j2) {
            var a = i1 - j1;
            var b = i2 - j2;
            return Math.sqrt(a * a + b * b);
        },
        get_closest: function (list) {
            var px = players[0].i;
            var py = players[0].j;
            var cur_distance = 9999999;
            var cur_closest_object = null;
            
            for (var i in list) {
                if (cur_closest_object === null) {
                    cur_closest_object = list[i];
                    cur_distance = API.World.get_distance(px, py, list[i].i, list[i].j);
                }
                
                var distance = API.World.get_distance(px, py, list[i].i, list[i].j);
                if (distance < cur_distance) {
                    cur_distance = distance;
                    cur_closest_object = list[i];
                }
            }
            return cur_closest_object;
        },
        find_attackables: function (targetnames) {
            var list = [];
            for (var i in on_map[current_map]) {
                for (var j in on_map[current_map][i]) {
                    if (map_visible(i, j)) {
                        var tile = on_map[current_map][i][j];
                        var data;
                        (data = obj_g(on_map[current_map][i][j])) || (data = player_map[i] && player_map[i][j] ? player_map[i][j][0] : !1);
                        if (data.b_t == BASE_TYPE.NPC) {
                            if (contains(targetnames, data.name))
                                list.push(data);
                        }
                    }
                }
            }
            return API.World.get_closest(list);
        },
        find_closest_by_name: function (name, ensurepath) {
            var list = [];
            if (typeof (ensurepath) === 'undefined')
                ensurepath = false;
            for (var i in on_map[current_map]) {
                for (var j in on_map[current_map][i]) {
                    if (map_visible(i, j)) {
                        var tile = on_map[current_map][i][j];
                        var data;
                        (data = obj_g(on_map[current_map][i][j])) 
					                || (data = player_map[i] && player_map[i][j] ? player_map[i][j][0] : !1);
                        if (data.name == name) {
                            if (ensurepath) {
                                if (findPathFromTo(players[0], data, players[0]).length > 0)
                                    list.push(data);
                            } else {
                                list.push(data);
                            }
                        }
                        if (debug_names_when_find_by_name)
                            console.log(data.name);
                    }
                }
            }
            
            return API.World.get_closest(list);
        },        
        try_move_and_kill: function (target) {
            selected = obj_g(target);
            if (players[0].temp.target_id != target.id) {
                if (Timers.running("set_target"))
                    return !0;
                Socket.send("set_target", {
                    target: target.id
                });
                Timers.set("set_target", null_function, 100);
            }
            needsProximity(players[0], target, 1, !0, !0);
        },        
        move_to_and_access: function (a) {
            selected = obj_g(a);
            needsProximity(players[0], a, 1, !0) && hasClass(document.getElementById("chest"), "hidden") && (chest_item_id = !1,
	        chest_npc = a,
	        "undefined" == typeof last_chest_access || 100 < timestamp() - last_chest_access) && (Socket.send("access_chest", {
                target_id: a.id
            }),
	        last_chest_access = timestamp())
        },       
        find_chest: function () {
            var c = API.World.find_closest_by_name("Chest");
            if (c)
                API.world.move_to_and_access(c);
            else
                addChatText("Unable to find chest");
        },
        get_map_id: function () {
            return current_map;
        },
        use_ladder: function (ladder) {
            teleport_script.use(ladder, players[0]);
        },
        mine: function (node) {
            DEFAULT_FUNCTIONS.mine(node, players[0]);
        },
        can_reach_node: function (node) {
            if (API.World.distance_to(node) == 1)
                return true;
            else
                return API.World.find_path_extended(node).length > 0;
        },
        at_location : function (i, j, map) {
            return players[0].i == i && players[0].j == j && map == current_map;
        },
        find_path_extended: function (loc) {
            var old_extend = map_increase;
            map_increase = 1000;
            var path = findPathFromTo(players[0], loc, players[0]);
            map_increase = old_extend;
            return path;
        },
        move_to: function (loc) { 
            players[0].path = API.World.find_path_extended(loc);
        }
    },
    
    Captcha: {
        RecaptureChallengeUpload: function () {
            addChatText("Grabbing captcha src for upload");
            var url = document.getElementById("recaptcha_challenge_image").src;
            if (url !== null) {
                bot_socket.emit("captcha_image_url", url);
                addChatText("Uploaded");
                API.Captcha.awaiting_cap_response = true;
            } else {
                addChatText("Cant find Captcha Image Url?!");
            }
        },
        
        
        awaiting_cap_response: false,
        AntiDetect: function () {
            if (captcha_interval && !API.Captcha.awaiting_cap_response) {
                addChatText("Found Captcha!");
                API.Captcha.RecaptureChallengeUpload();
            }
        },
        
        CaptureResponse: function (text) {
            captcha_interval = null;
            API.Captcha.awaiting_cap_response = false;
            document.getElementById("recaptcha_response_field").value = text;
            addChatText("Captcha Response Found: " + text);
            Socket.send('captcha', { response: Recaptcha.get_response(), challenge: Recaptcha.get_challenge() });
            addChatText("Captcha Response Sent");
        }
    }
};

API.Init();