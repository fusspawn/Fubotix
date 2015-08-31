AutoScripts = {
    Forge: function () {
        if (API.Inventory.inv_count_by_name("Iron Ore") < 2) {
            if (API.Inventory.inv_count_by_name("Iron Bar") > 0) {
                addChatText("Depositing");
                API.Inventory.manage_inventory();
            } else {
                addChatText("Withdrawing " + API.Inventory.inv_free_space() + " Items");
                API.Inventory.withdraw(API.DB.search_item_base("Iron Ore").b_i, 10);
            }
        } else {
            if (!API.Inventory.inv_is_equipped("Iron Ore")) {
                addChatText("Equipping");
                API.Inventory.inv_equip_by_name("Iron Ore");
            } else {
                var forge = API.World.find_closest_by_name("Furnace");
                if (API.World.distance_to(forge) == 1) {
                    addChatText("Forging");
                    Socket.send("use_skill", {
                        target_id : forge.id
                    });
                } else {
                    addChatText("Moving to");
                    API.World.move_to(forge);
                }
            }
        }
    },
    MineData: {
        current_node: null, 
        ore_names: [
                        "Iron Vein",
                        "Coal"
                   ],
        get_ore_name: function() {
            return AutoScripts.MineData.ore_names[Math.floor(Math.random()*AutoScripts.MineData.ore_names.length)];
        }
    },
    Mine: function () {
        if (API.World.get_map_id() === 0) //Aboveground
        {
            if (Inventory.is_full(players[0])) {
                if (API.World.at_location(57, 14, 0)) {                    
                    API.World.move_to({ i: 83, j: 37, map: 0 });
                    return;
                } else {
                    API.Inventory.inv_check();
                    return;
                }
            }
            
            if (!Inventory.is_full(players[0])) {
                if (API.World.at_location(83, 37, 0)) {
                    API.World.move_to({ i: 57, j: 14, map: 0 });
                    return;
                } else {
                    addChatText("Going down");
                    var ladder = API.World.find_closest_by_name("Ladder");
                    teleport_script.use(ladder, players[0]);
                    return;
                }
            }
        }
        
        if (API.World.get_map_id() === 1) {
            if (Inventory.is_full(players[0])) {
                addChatText("Full: Going back up");
                var ladder = API.World.find_closest_by_name("Ladder");
                if (ladder)
                    API.World.use_ladder(ladder);
                AutoScripts.MineData.current_node = null;
                return;
            } else {
                if(AutoScripts.MineData.current_node == null)
                    AutoScripts.MineData.current_node = API.World.find_closest_by_name(AutoScripts.MineData.get_ore_name(), true);
                if (AutoScripts.MineData.current_node)
                    API.World.mine(AutoScripts.MineData.current_node);
                return;
            }
        }
    },
    CombatData: {
        MobNames: ["Orc Mage", "Bronze Golem"]
    },
    Combat: function() {
        if(Inventory.is_full(players[0]) && API.World.find_closest_by_name("Chest") !== null) {
            var chest_node = API.World.find_closest_by_name("Chest");            
            if(API.World.distance_to(chest_node) > 1)
                API.World.move_to(chest_node);
            else
                API.Inventory.inv_check();
        } else {
            var target = API.World.find_attackables(AutoScripts.CombatData.MobNames);
            if(target)
                API.World.try_move_and_kill(target);
            else 
                addChatText("Awaiting new Targets!");
        }
    },
    SteelForge: function () {
        if (API.Inventory.inv_count_by_name("Iron Ore") < 1 
            || API.Inventory.inv_count_by_name("Coal") < 1) {
            if (API.Inventory.inv_count_by_name("Steel Bar") > 0) {
                addChatText("Depositing");
                API.Inventory.manage_inventory();
            } else {
                var halfspace = Math.floor(API.Inventory.inv_free_space() / 2);
                addChatText("Withdrawing " + API.Inventory.inv_free_space() + " Iron Items");
                API.Inventory.withdraw(API.DB.search_item_base("Iron Ore").b_i, halfspace);
                
                addChatText("Withdrawing " + API.Inventory.inv_free_space() + " Coal Items");
                API.Inventory.withdraw(API.DB.search_item_base("Coal").b_i, halfspace);
            }
        } else {
            if (!API.Inventory.inv_is_equipped("Iron Ore")
             || !API.Inventory.inv_is_equipped("Coal")) {                 
                addChatText("Equipping");
                API.Inventory.inv_equip_by_name("Iron Ore");                
                API.Inventory.inv_equip_by_name("Coal");               
                
            } else {
                var forge = API.World.find_closest_by_name("Furnace");
                if (API.World.distance_to(forge) == 1) {
                    addChatText("Forging");
                    Socket.send("use_skill", {
                        target_id : forge.id
                    });
                } else {
                    addChatText("Moving to");
                    API.World.move_to(forge);
                }
            }
        }
    },
}