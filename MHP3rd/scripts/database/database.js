var data = HH_data;
var sorting = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; 
var filters = [[], []]; // Fully Upgraded, Elem/Sts, Notes
var weapon_info = document.getElementById("weapon_info");
var materials_info = document.getElementById("materials_info");
var rows_list = [];
var active_row = null;

function createSharpnessBar(sharpness_0, sharpness_1){
    var sharpness_colors = ["#ff0032", "#ff3f00", "#ffca00", "#41f000", "#1569ff", "#f0f0f0"];
    var sharpness_bar_0 = "";
    var sharpness_bar_1 = "";
    var sharpness_bar_1_exist = (typeof sharpness_1 !== 'undefined');
    for(var i = 0; i < 6; i++){
        if(i <= sharpness_0.length-1) sharpness_bar_0 += `<div class="sharpness-bar" style="background-color: ${sharpness_colors[i]}; width: ${sharpness_0[i]}px;"></div>`;
        if(sharpness_bar_1_exist && i <= sharpness_1.length-1) sharpness_bar_1 += `<div class="sharpness-bar" style="background-color: ${sharpness_colors[i]}; width: ${sharpness_1[i]}px;"></div>`;
    }
    var bar = `<table class="sharpness" style="border-collapse: collapse;"><tr style="background-color: transparent;"><td style="padding: 1px 1px;">`;
    bar += `<div class="sharpness-bar-container">${sharpness_bar_0}</div>`;
    if(sharpness_bar_1_exist) bar += `<div class="sharpness-bar-container">${sharpness_bar_1}</div></td><td style="padding: 1px 1px;"><div class="sharpness-1">+1</div>`;
    bar += `</td></tr></table>`;
    return bar;
}

function notesMatch(notes_0, notes_1){
	n0 = notes_0.toString();
	n1 = notes_1.toString();
	
	n0 = n0.split("").sort().join("");
	n1 =n1.split("").sort().join("");
		
	for(var i = 0; i < 3; i++) if(n0[i] != n1[i]) return false;
	return true;
}

function getSonglist(notes){
    for(var e in songlist) {
        var music = songlist[e];
        if(notesMatch(e, notes)){
            return music;
        }
    }
    return null;
}

function getWeaponTree(currentName, tree = []){
	tree.push(currentName);
	for(var name in data){
		var weapon = data[name];
		if(weapon["UpgradesTo"] != null && weapon["UpgradesTo"].includes(currentName)){
			getWeaponTree(name, tree);
			break;
		}
	}
	return tree;
}

function showMoreInfo(event){
    var id = event.currentTarget.id;

    for(var i = 0; i < rows_list.length; i++) if(rows_list[i].id == id) active_row = rows_list[i];
    var rows = weapon_info.getElementsByTagName("tr");
    for(var i = 0; i < rows.length; i++) {
        rows[i].classList.remove("active-row");
    }
    active_row.classList.add("active-row");
    var weapon = data[active_row.id];
    var crafting_materials = weapon["Craft"];
    var upgrade_materials = weapon["Upgrade"];
    var notes = weapon["Notes"];
    
    
    var table = `<div class="materials-table"><table><thead><tr style="background-color: #707070"><th>Item</th><th>Qty</th></tr></thead><tbody>`;
    var table_0 = document.createElement("table");
    var table_1 = table;
    var table_2 = table;
    var table_3 = `<div class="materials-table"><table><thead><tr style="background-color: #707070"><th>Notes</th><th>Effect</th></tr></thead><tbody>`;
    for(var material in crafting_materials) if(material != "z") table_1 += `<tr><td>${material}</td><td>${crafting_materials[material]}</td></tr>`;
    for(var material in upgrade_materials) if(material != "z") table_2 += `<tr><td>${material}</td><td>${upgrade_materials[material]}</td></tr>`;
    var songs = getSonglist(notes);
    for(var e in songs){
		var song = "";
		for(var i = 0; i < e.length; i++) song += `<img src="assets/database/notes/note_${e[i]}.png">`
		table_3 += `<tr><td><span style="display: inline-block; text-align: left; width:44px; border: 1px;">${song}</span></td></div><td>${songs[e]}</td></tr>`;
    }
    var tree = getWeaponTree(active_row.id).reverse();
    var weapon_tree = document.getElementById("weapon_tree");
    while(weapon_tree.firstChild) weapon_tree.removeChild(weapon_tree.firstChild);
    for(var i = 0; i < tree.length; i++){	
	    var row_0 = table_0.insertRow();
	    row_0.id = tree[i];
	    row_0.addEventListener("click", function (event) {
			showMoreInfo(event, data);
	    });
	    if(tree[i] == active_row.id) row_0.classList.add("active-row");
	    else row_0.classList.remove("active-row");
	    var cell_0 = row_0.insertCell();
	    cell_0.innerHTML = "";
	    if(data[tree[i]]["Craft"]){
		    cell_0.innerHTML += `<span style="float: right">Craftable</span>`;
	    }
	    else{
			cell_0.innerHTML += `<span style="float: right">
				&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp
			</span>`;
	    }
	    
	    cell_0.innerHTML += `<span style="float: left">${(i+1)}</span><span style="display: inline-block; text-align: left; width: 150px;">${tree[i]}</span>`;
	    
    }
    table_1 += "</tbody></table></div>";
    table_2 += "</tbody></table></div>";
    table_3 += "</tbody></table></div>";
    weapon_tree.appendChild(table_0);
    document.getElementById("crafting_materials").innerHTML = table_1;
    document.getElementById("upgrade_materials").innerHTML = table_2;
    document.getElementById("horn_melodies").innerHTML = table_3;
}

function loadData() {
	rows_list = [];
	var id = 1;
	var sorting_header = [];
	for(var name in data){
		var weapon = data[name];
		var include_0 = 1;
		if(document.getElementById("fully_upgraded").checked && weapon["UpgradesTo"] != null) include_0 = 0;
		var include_1 = 0;
		var spec = (weapon["Special"] == null) ? "None" : weapon["Special"];
		for(var i = 0; i < filters[0].length; i++){
			if(spec.includes(filters[0][i])) include_1++;;
		}
		if(filters[0].length == 0 || include_1 > 0) include_1 = 1;
		else include_1 = 0;
		var include_2 = 1;
		for(var i = 0; i < filters[1].length; i++){
			if(!weapon["Notes"].includes(filters[1][i])) include_2 = 0;
		}
		if(!include_0 || !include_1 || !include_2){
			id++;
			continue;
		}
	   
        (function (weapon) {
		  var rarity_colors = ["#f5f5f5", "#b688ff", "#e8d92b", "#ff8098", "#56d85d", "#5f8cff", "#ff4248"];
            var special = (weapon["Special"] == null) ? "-" : weapon["Special"];
            var defense = (weapon["Defense"] == null) ? "-" : "+" + weapon["Defense"];
            var slots = (weapon["Slots"] == 1) ? "O--" : (weapon["Slots"] == 2) ? "OO-" : (weapon["Slots"] == 3) ? "OOO" : "---";
            var notes = (weapon["Notes"]) ? `<img src="assets/database/notes/note_${weapon["Notes"][0]}.png"><img src="assets/database/notes/note_${weapon["Notes"][1]}.png"><img src="assets/database/notes/note_${weapon["Notes"][2]}.png">` : "---";
            var sharpness = createSharpnessBar(weapon["Sharpness"]["+0"], weapon["Sharpness"]["+1"]);
            var crafting_cost = (weapon["Craft"] && weapon["Craft"]["z"]) ? weapon["Craft"]["z"].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "z" : "---";
            var upgrade_cost = (weapon["Upgrade"] && weapon["Upgrade"]["z"]) ? weapon["Upgrade"]["z"].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "z" : "---";
            var row = document.createElement("tr");
            row.innerHTML = `
			 <td>${id}</td>
                <td><div style='color: ${rarity_colors[weapon["Rarity"]-1]}'>${name}</div></td>
                <td><div style='color: ${rarity_colors[weapon["Rarity"]-1]}'>${weapon["Rarity"]}</div></td>
                <td>${weapon["Attack"]}<div style="color: #42e6ee;">(${parseInt(weapon["Attack"]) + 15})</div></td>
                <td>${special}</td>
                <td>${weapon["Affinity"]}%</td>
                <td>${defense}</td>
                <td>${slots}</td>
                <td>${notes}</td>
                <td>${sharpness}</td>
                <td>${crafting_cost}</td>
                <td>${upgrade_cost}</td>
            `;
		  var sharp = 0;
		  var modifiers = [1, 10, 100, 1000, 10000, 100000];
		  var sharpness_bar_1_exist = (typeof weapon["Sharpness"]["+1"] !== 'undefined');
		  for(var i = 0; i < (sharpness_bar_1_exist ? weapon["Sharpness"]["+1"] : weapon["Sharpness"]["+0"]).length; i++){
			sharp += (sharpness_bar_1_exist ? weapon["Sharpness"]["+1"] : weapon["Sharpness"]["+0"])[i] * modifiers[i];
		  }
		  var headers = [
			id, 
			name, 
			weapon["Rarity"], 
			weapon["Attack"], 
			special, 
			weapon["Affinity"], 
			(weapon["Defense"] == null) ? 0 : weapon["Defense"], 
			slots, 
			notes, 
			sharp, 
			(weapon["Craft"] && weapon["Craft"]["z"]) ? weapon["Craft"]["z"] : 0, 
			(weapon["Upgrade"] && weapon["Upgrade"]["z"]) ? weapon["Upgrade"]["z"] : 0
		  ];
		  var sort_type = 0;
		  var header_index = 0;
		  for(var i = 0; i < sorting.length; i++){
			if(sorting[i] > 0){
				header_index = i;
				sort_type = sorting[i];
			}
		  }
		  var index = -1;
		  for(var i = 0; i < sorting_header.length; i++){
                if((sort_type == 1 && headers[header_index] > sorting_header[i]) || (sort_type == 2 && headers[header_index] < sorting_header[i])){
                    index = i;
                    break;
                }
            }
		  if(index == -1){
			row.id = name;
			row.addEventListener("click", function (event) {
				showMoreInfo(event, data);
			});
			rows_list.push(row);
			weapon_info.appendChild(row);
			sorting_header.push(headers[header_index]);
		  }
		  else{
			rows_list.push(row);
			var r = weapon_info.insertRow(index);
			r.id = name;
			r.innerHTML = row.innerHTML;
			r.addEventListener("click", function (event) {
				showMoreInfo(event, data);
			});
			sorting_header.splice(index, 0, headers[header_index]);
		  }
        })(weapon); // Pass weapon data to the closure
	   id++;
    }
}

function sortTable(col){
	while(weapon_info.firstChild) weapon_info.removeChild(weapon_info.firstChild);
	if(col == null){
		loadData();
		return;
	}
	if(col == 0){
		sorting[col] ^= 1;
		for(var i = 0; i < sorting.length; i++) if(i != col && sorting[i] > 0) sorting[col] = 0;
	}
	else if(col == 1 || col == 2){
		if(sorting[col] > 0) sorting[col]--;
		else if(sorting[col] == 0) sorting[col] = 2;
	}
	else{
		if(sorting[col] < 2) sorting[col]++;		else if(sorting[col] == 2) sorting[col] = 0;
	}
	
	for(var i = 0; i < sorting.length; i++) if(i != col) sorting[i] = 0;
	var headers = document.getElementById("data-table").getElementsByTagName("th");
	for(var i = 0; i < headers.length; i++){
	   if(i == col){
		switch(sorting[col]){
			case 0: 
				headers[i].style.backgroundColor = "#202020";
				break;
			case 1:
				headers[i].style.backgroundColor = "#403030";
				break;
			case 2:
				headers[i].style.backgroundColor = "#303040";
				break;
		}
	   }
	   else headers[i].style.backgroundColor = "#202020";
	}
	
	loadData();
}

function filterTable(filter){
	active_row = null;
	document.getElementById("weapon_tree").innerHTML = "";
	document.getElementById("crafting_materials").innerHTML = "";
	document.getElementById("upgrade_materials").innerHTML = "";
	document.getElementById("horn_melodies").innerHTML = "";
	if(filter == null){
		sortTable();
		return;
	}
	var filter_headers = ["", "Fire" ,"Water", "Thunder", "Ice", "Dragon", "Poison", "Paralyze", "None", "", "W", "P", "R", "B", "G", "C", "Y", "O", "Clear"];
	
	if(filter != "Clear" & filter_headers.includes(filter)){
		switch(filter_headers.indexOf(filter) < 9){
			case true:
				if(filters[0].includes(filter)){
					var index = filters[0].indexOf(filter);
					if(index != -1) filters[0].splice(index, 1);
				}
				else filters[0].push(filter);
				break;
			case false:
				if(filters[1].includes(filter)){
					var index = filters[1].indexOf(filter);
					if(index != -1) filters[1].splice(index, 1);
				}
				else filters[1].push(filter);
				break;
		}
	}
	if(filter == "Clear"){
		document.getElementById("fully_upgraded").checked = 0;
		filters[0] = [];
		filters[1] = [];
	}
	var filter_elements = document.getElementById("filters").getElementsByTagName("li");
	for(var i = 0; i < filter_elements.length; i++){
		var found_0 = filters[0].indexOf(filter_headers[i]);
		var found_1 = filters[1].indexOf(filter_headers[i]);
		if(found_0 != -1 || found_1 != -1) filter_elements[i].classList.add("active-filter");
		else filter_elements[i].classList.remove("active-filter");
	}
	sortTable();
}
document.getElementById("fully_upgraded").checked = 0;
filterTable();