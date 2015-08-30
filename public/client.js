	/* UI */
	var PetInventoryCount = 16;
	var MinersGuildPath = [{"i":83,"j":36,"map":0},{"i":83,"j":35,"map":0},{"i":83,"j":34,"map":0},{"i":83,"j":33,"map":0},{"i":82,"j":33,"map":0},{"i":81,"j":33,"map":0},{"i":80,"j":33,"map":0},{"i":79,"j":33,"map":0},{"i":78,"j":33,"map":0},{"i":77,"j":33,"map":0},{"i":76,"j":33,"map":0},{"i":75,"j":33,"map":0},{"i":74,"j":33,"map":0},{"i":73,"j":33,"map":0},{"i":72,"j":33,"map":0},{"i":71,"j":33,"map":0},{"i":70,"j":33,"map":0},{"i":69,"j":33,"map":0},{"i":69,"j":32,"map":0},{"i":69,"j":31,"map":0},{"i":69,"j":30,"map":0},{"i":69,"j":29,"map":0},{"i":70,"j":29,"map":0},{"i":70,"j":28,"map":0},{"i":71,"j":28,"map":0},{"i":71,"j":27,"map":0},{"i":71,"j":26,"map":0},{"i":71,"j":25,"map":0},{"i":71,"j":24,"map":0},{"i":71,"j":23,"map":0},{"i":70,"j":23,"map":0},{"i":69,"j":23,"map":0},{"i":68,"j":23,"map":0},{"i":68,"j":22,"map":0},{"i":67,"j":22,"map":0},{"i":66,"j":22,"map":0},{"i":66,"j":21,"map":0},{"i":66,"j":20,"map":0},{"i":65,"j":20,"map":0},{"i":64,"j":20,"map":0},{"i":63,"j":20,"map":0},{"i":62,"j":20,"map":0},{"i":61,"j":20,"map":0},{"i":60,"j":20,"map":0},{"i":59,"j":20,"map":0},{"i":58,"j":20,"map":0},{"i":58,"j":19,"map":0},{"i":58,"j":18,"map":0},{"i":58,"j":17,"map":0},{"i":58,"j":16,"map":0},{"i":58,"j":15,"map":0},{"i":58,"j":14,"map":0}];
	if(window.UIInstalled) {
		var element = document.getElementById("botcontrols");
		element.parentNode.removeChild(element);
	}

 	if(bot_interval) {
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
	function search_npc_base(name) { for(var i in npc_base) {  if (npc_base[i].name == name) return npc_base[i]; } return null; }
	function search_item_base(name) { for(var i in item_base) {  if (item_base[i].name == name) return item_base[i]; } return null; }

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


	function distance_to(node) {
		return get_distance(players[0].i, players[0].j, node.i, node.j);
	}

	function get_distance(i1, j1, i2, j2) {
		var a = i1 - j1;
		var b = i2 - j2;
		return Math.sqrt( a*a + b*b );
	}


	function get_closest(list) {
		var px = players[0].i;
		var py = players[0].j;
		var cur_distance = 9999999;
		var cur_closest_object = null;

		for(var i in list)
		{
			if(cur_closest_object === null) {
				cur_closest_object = list[i];
				cur_distance = get_distance(px, py, list[i].i, list[i].j);
			}

			var distance = get_distance(px, py, list[i].i, list[i].j);
			if(distance < cur_distance)
			{
				cur_distance = distance;
				cur_closest_object = list[i];
			}
		}

		return cur_closest_object;
	}

	function find_attackables()
	{
		var list=[];
		for(var i in on_map[current_map])
		{
			for(var j in on_map[current_map][i])
			{
				if (map_visible(i, j)){
					var tile = on_map[current_map][i][j];
					var data;
					(data = obj_g(on_map[current_map][i][j])) || (data = player_map[i]	&& player_map[i][j] ? player_map[i][j][0] : !1);
					if(data.b_t == BASE_TYPE.NPC) {
						if(contains(get_wanted_combat_targets(), data.name))
							list.push(data);
					}
				}
			}
		}

		return get_closest(list);
	}

	function find_closest_by_name(name, ensurepath) {
		var list=[];
		if(typeof(ensurepath) === 'undefined')
			ensurepath = false;

		for(var i in on_map[current_map])
		{
			for(var j in on_map[current_map][i])
			{
				if (map_visible(i, j)){
					var tile = on_map[current_map][i][j];
					var data;
					(data = obj_g(on_map[current_map][i][j]))
					|| (data = player_map[i] && player_map[i][j] ? player_map[i][j][0] : !1);
					if(data.name == name) {
						if(ensurepath){
							if(findPathFromTo(players[0], data, players[0]).length > 0)
								list.push(data);
						} else {
							list.push(data);
						}
					}
					if(debug_names_when_find_by_name)
						console.log(data.name);
				}
			}
		}

		return get_closest(list);
	}

	function try_move_and_kill(target) {
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
	}

	function move_to_and_access(a) {
			selected = obj_g(a);
	        needsProximity(players[0], a, 1, !0) && hasClass(document.getElementById("chest"), "hidden") && (chest_item_id = !1,
	        chest_npc = a,
	        "undefined" == typeof last_chest_access || 100 < timestamp() - last_chest_access) && (Socket.send("access_chest", {
	            target_id: a.id
	        }),
	        last_chest_access = timestamp())
	}


	function find_chest() {
		var c = find_closest_by_name("Chest");
		console.dir(c);
		if(c)
			move_to_and_access(c);
		else
			addChatText("Unable to find chest");
	}

	function deposit() {
		var obj = document.getElementById("chest_deposit_item_pet");
		if(obj)
			obj.click();
	}

	function withdraw(id, amount) {
		find_chest();
		var slot = 0;
		for (var i = 0; i < chest_content.length; i++) {
			if (chest_content[i].id == id) {
				slot = i;
			}
		}
		addChatText("Found iron in slot: " + slot);
		document.getElementById("chest_"+slot).click();
		for(var index = 0; index < amount; index++)
			document.getElementById("chest_withdraw").click();
	}

	function manage_inventory() {
		find_chest();
		deposit();
		console.log("chest deposit");
	}

	function pet_has_items() {
		return players[0].pet.chest.length > 0;
	}

	function pet_free_inv_space() {
		return PetInventoryCount - players[0].pet.chest.length; 
	}

	function pet_item_count() {
		return players[0].pet.chest.length;
	}

	function inv_check() {
		if(Inventory.is_full(players[0])) 
			manage_inventory();		
	}

	function inv_count_by_name(name) {
		var itemid = search_item_base(name).b_i;
		addChatText("Seaching for: " + name + " ItemID: " + itemid);
		var count = 0;
		for (var i = 0; i < players[0].temp.inventory.length; i++) {
			if (players[0].temp.inventory[i].id == itemid) {
				count++;
			}
		}
		return count;		
	}
	
	function inv_free_space() {
		return 40 - players[0].temp.inventory.length;
	}

	function inv_is_equipped(name) {
		var itemid = search_item_base(name).b_i;
		for (var i = 0; i < players[0].temp.inventory.length; i++) {
			if (players[0].temp.inventory[i].id == itemid) {
				if(players[0].temp.inventory[i].selected)
					return true;
			}
		}	
		return false;
	}

	function inv_equip_by_name(name) {
		var itemid = search_item_base(name).b_i;
		for (var i = 0; i < players[0].temp.inventory.length; i++) {
			if (players[0].temp.inventory[i].id == itemid) {
				InvMenu.create(i);
				InvMenu.use(i);
				return;
			}
		}	
	}
	
	var bot_interval = null;
	function bot_tick() {
		if(ui_keep_going()){		
			AntiDetect();
			var p = players[0];
			if(!p.temp.busy && p.path.length === 0 && p.temp.health > 10 && !map_change_in_progress && WalkingPath.length === 0) {
				try {
					if(ui_option_checked("run_combat_script"))
						combat_logic();
					else if (ui_option_checked("run_mine_script")) {
						addChatText("mining");
						mine_logic();
					} else if (ui_option_checked("run_path_recorder_script")) {
						PathRecord();						
						bot_interval = setTimeout(bot_tick, 100);
						return;
					} else if(ui_option_checked("run_smelter_script")) {
						ForgeLoop();
					}
				} catch(err) {
					addChatText("Error: " + err);
				}
			}
		}
		bot_interval = setTimeout(bot_tick, 2000);
	}

	bot_interval = setTimeout(bot_tick, 2000);

	

	function mine(spot) {
		DEFAULT_FUNCTIONS.mine(spot, players[0]);
	}

	function combat_logic() {
		inv_check();
		var target = find_attackables();
					if(target)
						try_move_and_kill(target);
	}

	function get_map_id() {
		return current_map;
	}

	function mine_logic()
	{
		if(get_map_id() === 0) //Aboveground
		{
			if(Inventory.is_full(players[0])) {	
				if(at_location(57,14, 0)) {
					RunBack();
					return;
				} else {
					inv_check();
					return;
				}
			}
			
			if(!Inventory.is_full(players[0])) {				
				if(at_location(83,37,0)) {
					RunLadder();
					return;
				} else {				
					addChatText("Going down");
					var ladder = find_closest_by_name("Ladder");
					teleport_script.use(ladder, players[0]);
					return;
				}
			}
		}

		if(get_map_id() === 1)
		{
			if(Inventory.is_full(players[0]))
			{
				addChatText("Full: Going back up");
				var ladder = find_closest_by_name("Ladder");
				if(ladder)
					teleport_script.use(ladder, players[0]);
				next_ore = get_random_ore_name();
				current_node = null;
				return;
			} else {
				if(current_node == null)
				   current_node = find_closest_by_name(next_ore, true);
				if(current_node)
					mine(current_node);
				return;
			}
		}
	}

	function can_reach_node(node) {
		return findPathFromTo(players[0], node, players[0]).length > 0;
	}

	var current_node = null;
    var next_ore = "Iron";
	var ore_names = ["Coal","Iron"];
	var last_ore = 0;
	function get_random_ore_name() {
		  var ore = ore_names[last_ore];
		  last_ore++;
			if(last_ore == ore_names.length) {
					last_ore = 0;
			}
			return ore;
	}

	function dump_location() {
		var i = players[0].i;
		var j = players[0].j;
		addChatText("{i: " + i + ", j: " + j + " , to_map: "+ current_map +"}");
	}

	var lasti = 0;
	var lastj = 0;
	var lastmap = 0;
	var path_record = [];
	function PathRecord() {
		var i = players[0].i;
		var j = players[0].j;
		var map = current_map;	
		if(i != lasti || j != lastj || map != lastmap) {
			path_record.push({i: i, j: j, map: map});				
			lasti = i;
			lastj = j;
			lastmap = current_map;
			addChatText("Moved to" + i + " " + j + " " + current_map);
		}
	}

	function node_at(i, j) {
		return obj_g(on_map[current_map][i][j]);
	}

	function ClearPath(){
		path_record = [];
	}
	function DumpPath(){
		bot_socket.emit("path_dump", JSON.stringify(path_record));
		console.log(JSON.stringify(path_record));
		addChatText(JSON.stringify(path_record));
	}
	function RunBack() {
		addChatText("Runback");
		setPath(MinersGuildPath.slice().reverse());
	}
	function RunLadder() {
		addChatText("LadderRun");
		setPath(MinersGuildPath.slice());
	}
	function at_location( i,  j, map) {
		return players[0].i == i && players[0].j == j && map == current_map;
	}


	
	function ForgeLoop() {
		if(inv_count_by_name("Iron Ore") < 2) {
			if(inv_count_by_name("Iron Bar") > 0) {				
				addChatText("Depositing");
				manage_inventory();
			} else {
				addChatText("Withdrawing " + inv_free_space() + " Items");
				withdraw(search_item_base("Iron Ore").b_i, 10);	
			}
		}  else {
			if(!inv_is_equipped("Iron Ore")) {
				addChatText("Equipping");
				inv_equip_by_name("Iron Ore");
			} else {
				var forge = find_closest_by_name("Furnace");
				if(distance_to(forge) == 1) {
					addChatText("Forging");
					Socket.send("use_skill", {
						target_id : forge.id
					});
				} else {
					addChatText("Moving to");
					players[0].path = findPathFromTo(players[0], forge, players[0]);
				}
			}
		}
	}

	WalkingPath = [];
	StuckTicks = 0;
	function PathWalkerUpdate() {
		if(WalkingPath.length === 0)
			return;
		var loc = WalkingPath[0];
		if(at_location(loc.i, loc.j, loc.map)) {
			WalkingPath.shift();
			players[0].path = [WalkingPath[0]];
			StuckTicks = 0;
		} else {
			StuckTicks += 1;
			if(StuckTicks > 5) {
				players[0].path = [WalkingPath[0]];
				StuckTicks = 0;
			}
		}
	}

	function setPath(path) {
		WalkingPath = path;	
		players[0].path = [WalkingPath[0]];
	}

	if(walkinterval)
		clearInterval(walkinterval);

	var walkinterval = setInterval(function() {
		PathWalkerUpdate();
	}, 500);

	function RecaptureChallengeUpload() {
		addChatText("Grabbing captcha src for upload");
		var url = document.getElementById("recaptcha_challenge_image").src;
		if(url !== null) {
			bot_socket.emit("captcha_image_url", url);
			addChatText("Uploaded");
			awaiting_cap_response = true;
		} else {
			addChatText("Cant find Captcha Image Url?!");
		}
	}

var awaiting_cap_response = false;
function AntiDetect() {
	if(captcha_interval && !awaiting_cap_response) {
		addChatText("Found Captcha!");
		RecaptureChallengeUpload();
	}
}

function CaptureResponse(text) {	
	captcha_interval = null;
	awaiting_cap_response = false;
	document.getElementById("recaptcha_response_field").value = text;
	addChatText("Captcha Response Found: " + text);
	Socket.send('captcha',{response:Recaptcha.get_response(),challenge:Recaptcha.get_challenge()});
	addChatText("Captcha Response Sent");
}


bot_socket.removeListener("captcha_response", CaptureResponse);
bot_socket.on("captcha_response", CaptureResponse);
addChatText("AntiDetectHandler - Added");
addChatText("Fubot Installed");



