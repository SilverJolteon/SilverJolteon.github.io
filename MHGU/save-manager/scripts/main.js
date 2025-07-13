var VERSION = "v1.4.2";

var save = null;
var SLOT_SIZE = 0x11D088;
var new_save = false;
var game_type = 0;
var cats = [...DLC_CAT_DEFAULTS];

const skill_names = [
  `Poison`, `Paralysis`, `Sleep`, `Stun`, `Hearing`, `Wind Res`, `Tremor Res`, `Bind Res`, `Heat Res`, `Cold Res`,
  `ColdBlooded`, `HotBlooded`, `Anti-Theft`, `Def Lock`, `Frenzy Res`, `Biology`, `Bleeding`, `Attack`, `Defense`,
  `Health`, `Fire Res`, `Water Res`, `Thunder Res`, `Ice Res`, `Dragon Res`, `Blight Res`, `Fire Atk`, `Water Atk`,
  `Thunder Atk`, `Ice Atk`, `Dragon Atk`, `Elemental`, `Status`, `Sharpener`, `Handicraft`, `Sharpness`, `Fencing`,
  `Grinder`, `Blunt`, `Crit Draw`, `Punish Draw`, `Sheathing`, `Sheathe Sharpen`, `Bladescale`, `Reload Spd`,
  `Recoil`, `Precision`, `Normal Up`, `Pierce Up`, `Pellet Up`, `Heavy Up`, `Normal S+`, `Pierce S+`, `Pellet S+`,
  `Crag S+`, `Clust S+`, `Poison C+`, `Para C+`, `Sleep C+`, `Power C+`, `Elem C+`, `C.Range C+`, `Exhaust C+`,
  `Blast C+`, `Rapid Fire`, `Dead Eye`, `Loading`, `Haphazard`, `Ammo Saver`, `Expert`, `Tenderizer`, `Chain Crit`,
  `Crit Status`, `Crit Element`, `Critical Up`, `Negative Crit`, `FastCharge`, `Stamina`, `Constitution`,
  `Stam Recov`, `Distance Runner`, `Evasion`, `Evade Dist`, `Bubble`, `Guard`, `Guard Up`, `KO`, `Stam Drain`,
  `Maestro`, `Artillery`, `Destroyer`, `Bomb Boost`, `Gloves Off`, `Spirit`, `Unscathed`, `Chance`, `Dragon Spirit`,
  `Potential`, `Survivor`, `Furor`, `Crisis`, `Guts`, `Sense`, `Team Player`, `TeamLeader`, `Mounting`, `Vault`,
  `Insight`, `Endurance`, `Prolong SP`, `Psychic`, `Perception`, `Ranger`, `Transporter`, `Protection`,
  `Hero Shield`, `Rec Level`, `Rec Speed`, `Lasting Pwr`, `Wide-Range`, `Hunger`, `Gluttony`, `Eating`, `Light Eater`,
  `Carnivore`, `Mycology`, `Botany`, `Combo Rate`, `Combo Plus`, `Speed Setup`, `Gathering`, `Honey`, `Charmer`,
  `Whim`, `Fate`, `Carving`, `Capturer`, `Bherna`, `Kokoto`, `Pokke`, `Yukumo`, `Soaratorium`, `Flying Pub`,
  `Redhelm`, `Snowbaron`, `Stonefist`, `Drilltusk`, `Dreadqueen`, `C.beard`, `Silverwind`, `Deadeye`, `Dreadking`,
  `Thunderlord`, `Grimclaw`, `Hellblade`, `Nightcloak`, `Rustrazor`, `Soulseer`, `Boltreaver`, `Elderfrost`,
  `Bloodbath`, `Redhelm X`, `Snowbaron X`, `Stonefist X`, `Drilltusk X`, `Dreadqueen X`, `Crystalbeard X`,
  `Silverwind X`, `Deadeye X`, `Dreadking X`, `Thunderlord X`, `Grimclaw X`, `Hellblade X`, `Nightcloak X`,
  `Rustrazor X`, `Soulseer X`, `Boltreaver X`, `Elderfrost X`, `Bloodbath X`, `D. Fencing`, `Edge Lore`, `PowerEater`,
  `Mechanic`, `Brawn`, `Prayer`, `Covert`, `Edgemaster`, `SteadyHand`, `Status Res`, `Fury`, `Nimbleness`, `Readiness`,
  `Resilience`, `Brutality`, `Stalwart`, `Prudence`, `Amplify`, `Hoarding`, `Avarice`, `Anti-Kushala`, `Anti-Chameleos`,
  `Anti-Teostra`, `Secret Arts`, `Talisman Boost`, `Torso Up`, `Negate Poison`, `Double Poison`, `Negate Paralysis`,
  `Double Paralysis`, `Negate Sleep`, `Double Sleep`, `Negate Stun`, `Halve Stun`, `Double Stun`, `HG Earplugs`,
  `Earplugs`, `Windproof (Hi)`, `Windproof (Lo)`, `Tremor Res`, `Negate Bind`, `Heat Cancel`, `Heat Surge`,
  `Cold Cancel`, `Cold Surge`, `Polar Hunter`, `Tropic Hunter`, `Anti-Theft`, `Iron Skin`, `Antivirus`, `Bio Master`,
  `Bio Researcher`, `Negate Bleeding`, `Double Bleeding`, `Attack Up (L)`, `Attack Up (M)`, `Attack Up (S)`,
  `Attack Down (S)`, `Attack Down (M)`, `Attack Down (L)`, `Defense Up (L)`, `Defense Up (M)`, `Defense Up (S)`,
  `Defense Down (S)`, `Defense Down (M)`, `Defense Down (L)`, `Health +50`, `Health +20`, `Health -10`, `Health -30`,
  `Fire Res +20`, `Fire Res +15`, `Fire Res -20`, `Water Res +20`, `Water Res +15`, `Water Res -20`, `Thunder Res +20`,
  `Thunder Res +15`, `Thunder Res -20`, `Ice Res +20`, `Ice Res +15`, `Ice Res -20`, `Dragon Res +20`, `Dragon Res +15`,
  `Dragon Res -20`, `Blightproof`, `Fire Atk +2`, `Fire Atk +1`, `Fire Atk Down`, `Water Atk +2`, `Water Atk +1`,
  `Water Atk Down`, `Thunder Atk +2`, `Thunder Atk +1`, `Thunder Atk Down`, `Ice Atk +2`, `Ice Atk +1`, `Ice Atk Down`,
  `Dragon Atk +2`, `Dragon Atk +1`, `Dragon Atk Down`, `Element Atk Up`, `Element Atk Down`, `Status Atk +2`,
  `Status Atk +1`, `Status Atk Down`, `Speed Sharpening`, `Slow Sharpening`, `Sharpness +2`, `Sharpness +1`,
  `Razor Sharp`, `Blunt Edge`, `Mind's Eye`, `Blind Eye`, `Heavy Polish`, `Bludgeoner`, `Critical Draw`,
  `Punishing Draw`, `Quick Sheath`, `Challenge Sheath`, `Bladescale Hone`, `Reload Speed +3`, `Reload Speed +2`,
  `Reload Speed +1`, `Reload Speed -1`, `Reload Speed -2`, `Reload Speed -3`
];

const shoutout_defaults = [`Let's do this!`, `Thanks!`, `Nice work!`, `Sorry!`, `Don't sweat it!`, `Congratulations!`, `Missed!`, `Thanks for hunting!`, `I'll set a trap!`, `I'll try to mount it!`, `I'll place a bomb!`, `I'll do a strong attack!`, `Follow me!`, `I'll use a Hunter Art!`, `Let's capture this thing!`, `I'm abandoning the Quest.`, `I'll use a Voucher.`, `I'll change equipment.`, `Choose any Quest you like!`, `I'll choose a Quest.`, `We'll need drinks.`, `Wait a sec for me!`, `All set!`, `I'm outta here.`, `Let's do this!`, `Thanks!`, `Nice work!`, `Sorry!`, `Don't sweat it!`, `Congratulations!`, `Missed!`, `Thanks for hunting!`, `I'll set a trap!`, `I'll try to mount it!`, `I'll place a bomb!`, `I'll do a strong attack!`, `Follow me!`, `I'll use a Hunter Art!`, `Let's capture this thing!`, `I'm abandoning the Quest.`, `I'll use a Voucher.`, `I'll change equipment.`, `Choose any Quest you like!`, `I'll choose a Quest.`, `We'll need drinks.`, `Wait a sec for me!`, `All set!`, `I'm outta here.`, `Let's do this!`, `Thanks!`, `Nice work!`, `Sorry!`, `Don't sweat it!`, `Congratulations!`, `Missed!`, `Thanks for hunting!`, `I'll set a trap!`, `I'll try to mount it!`, `I'll place a bomb!`, `I'll do a strong attack!`, `Follow me!`, `I'll use a Hunter Art!`, `Let's capture this thing!`, `I'm abandoning the Quest.`, `I'll use a Voucher.`, `I'll change equipment.`, `Choose any Quest you like!`, `I'll choose a Quest.`, `We'll need drinks.`, `Wait a sec for me!`, `All set!`, `I'm outta here.`, `I mounted it!`, `I'll set a trap!`, `I set up us a bomb!`, `I'm in trouble!`, `It has me pinned!`, `Thanks for the help!`, `Hunter Art 1 activated!`, `Hunter Art 2 activated!`, `Hunter Art 3 activated!`, `I mounted it!`, `I'll set a trap!`, `I set up us a bomb!`, `I'm in trouble!`, `It has me pinned!`, `Thanks for the help!`, `Hunter Art 1 activated!`, `Hunter Art 2 activated!`, `Hunter Art 3 activated!`, `I mounted it!`, `I'll set a trap!`, `I set up us a bomb!`, `I'm in trouble!`, `It has me pinned!`, `Thanks for the help!`, `Hunter Art 1 activated!`, `Hunter Art 2 activated!`, `Hunter Art 3 activated!`];

class Footer{
	constructor(data){
		this.data = new Uint8Array(data);
		if(this.data.length == 0) this.data = new Uint8Array(0x283C);
		this.shoutouts = this.getShoutouts();
	};
	
	getShoutouts(){
		var shoutouts = [];
		var shoutout_size = this.data.length == 0x283C ? 0x68 : 0x3C;
		
		for(var i = 1; i < this.data.length-3; i += shoutout_size){
			var shoutout = "";
			for(var j = 0; j < shoutout_size; j++){
				var b = this.data[i+j];
				if(b != 0) shoutout += (String.fromCharCode(b));
			}
			if(shoutout.length == 0) shoutout = shoutout_defaults[shoutouts.length];
			shoutouts.push(shoutout);
		}
		
		return shoutouts;
	}
	
	getFooter(save_type){
		var footer_size = save_type == 2 ? 0x283C : 0x1738;
		var shoutout_size = save_type == 2 ? 0x68 : 0x3C;
		var footer = new Uint8Array(footer_size);
		var offset = 0x01;
		for(var i = 0; i < this.shoutouts.length; i++){
			var shoutout = new Uint8Array(shoutout_size);
			for(var j = 0; j < this.shoutouts[i].length && j < shoutout_size; j++){
				shoutout[j] = this.shoutouts[i].charCodeAt(j);
			}
			footer.set(shoutout, offset);
			offset += shoutout_size;
		}

		return footer;
	}
}

class SaveInfo{
	constructor(data){
			this.data = new Uint8Array(data);
			this.name = "";
			this.gender = "";
			this.HR = 0;
			this.funds = 0;
			this.time = "";
	};
};

class SaveFile{
	constructor(data){
		this.data = data;
		this.game = 0;
		this.off = 0;
		this.slots = [0, 0, 0];
		this.slot_offsets = [];
		this.save_slots = [];
		this.footers = [];
		this.options = [0, 0, 0, 0]; // Brightness, Rumble, Disable 3D, Enable Circle Pad Pro
	}
	
	detectGame(){
		const MHXX_3DS_SIZE = 0x481D88;
		const MHXX_SWITCH_SIZE = 0x481DAC;
		const MHGU_SIZE = 0x4EB8BC;
		switch(this.data.length){
			case MHXX_3DS_SIZE:
				this.game = 0;
				game_type = 0;
				this.off = 0x00;
				break;
			case MHXX_SWITCH_SIZE:
				this.game = 1;
				game_type = 1;
				this.off = 0x24;
				break;
			case MHGU_SIZE:
				this.game = 2;
				game_type = 2;
				this.off = 0x24;
				break;
			default:
				return 1;
		}
		return 0;
	}
	
	init(){
		var off = this.off;
		this.slots = Array.from(this.data.subarray(0x04 + off, 0x07 + off));
		this.slot_offsets = [
			new DataView(this.data.buffer.slice(0x10 + off, 0x14 + off)).getUint32(0, true),
			new DataView(this.data.buffer.slice(0x14 + off, 0x18 + off)).getUint32(0, true),
			new DataView(this.data.buffer.slice(0x18 + off, 0x1C + off)).getUint32(0, true)
		];
		var footer_size = (this.slot_offsets[1] - this.slot_offsets[0]) - SLOT_SIZE;
		for(var slot = 0; slot < 3; slot++){
			var slot_data = new SaveInfo(this.data.buffer.slice(this.slot_offsets[slot]+off, this.slot_offsets[slot] + off + SLOT_SIZE));
			this.save_slots[slot] = slot_data;
			
			var footer_data = new Footer(this.data.buffer.slice(this.slot_offsets[slot] + off + SLOT_SIZE, this.slot_offsets[slot] + off + SLOT_SIZE + footer_size));
			this.footers[slot] = footer_data;
		}
		
		this.options[0] = new DataView(this.data.buffer.slice(0x28 + off, 0x29 + off)).getUint8(0, true);
		this.options[1] = new DataView(this.data.buffer.slice(0x29 + off, 0x2A + off)).getUint8(0, true);
		this.options[2] = new DataView(this.data.buffer.slice(0xB27E + off, 0xB27F + off)).getUint8(0, true);
		this.options[3] = new DataView(this.data.buffer.slice(0xB27F + off, 0xB280 + off)).getUint8(0, true);
	}
	
	manageCats(){
		var popup = document.getElementById("popup");
		popup.innerHTML = "";
		var info = `<div class="cat-window"><span id="catcount"></span></br></br><table>`;
		for(var row = 0; row < 10; row++){
			info += "<tr>";
			for(var col = 0; col < 6; col++){
				var id = row * 6 + col;
				var checked = cats.includes(id) ? "checked" : "";
				info += `<td style="border: 1px solid grey; text-align: left">
							<input type="checkbox" data-id="${id}" ${checked}>
							<label for="cat_${id}"> ${DLC_CAT_NAMES[id]}</label>`;
				if(DLC_CAT_SKILLS[id] === "") DLC_CAT_SKILLS[id] = "<i>None</i>";
				info += `</br><span style="color: grey; font-size: 10px">${DLC_CAT_SKILLS[id]}</span>`;
				var origin = "";
				if(id < 2)       origin = `<span style="color: #93c47d; font-size: 10px">MH4U/MH4G Bonus</span>`;
				else if(id < 24) origin = `<span style="color: #cc0000; font-size: 10px">MHGen/MHX DLC</span>`;
				else if(id < 36) origin = `<span style="color: #ff9900; font-size: 10px">MHX DLC</span>`;
				else if(id < 49) origin = `<span style="color: #3c78d8; font-size: 10px">MHXX DLC</span>`;
				else if(id < 57) origin = `<span style="color: #76a5af; font-size: 10px">MHX Collab</span>`;
				else if(id < 60) origin = `<span style="color: #9900ff; font-size: 10px">MHGU DLC</span>`;
				if(origin) info += `</br>${origin}`;
				info += "</td>";
			}
			info += "</tr>";
		}
		info += `</table>
					<span>
						<button id="deselect" style="margin-right: 10px">Uncheck all</button>
						<button id="defaults" style="margin-right: 10px">Set to default</button>
						<button id="save_cats">Save</button>
					</span>
				</div>`;
		popup.innerHTML += info;
		
		const checkboxes = popup.querySelectorAll('input[type="checkbox"]');
		
		const updateCats = () => {
			const checked = Array.from(checkboxes)
				.filter(cb => cb.checked)
				.map(cb => parseInt(cb.dataset.id));
				
			document.getElementById("catcount").innerHTML = `${checked.length} / 50 Palicoes Selected`;
			
			checkboxes.forEach(cb => {
				cb.disabled = !cb.checked && checked.length >= 50;
			});
		}

		checkboxes.forEach(cb => {
			cb.addEventListener("change", updateCats);
		});
		
		
		document.getElementById("defaults").addEventListener("click", () => {
			checkboxes.forEach(cb => {
			var id = parseInt(cb.dataset.id);
				cb.checked = DLC_CAT_DEFAULTS.includes(id);
			});
			updateCats();
		});
		
		document.getElementById("deselect").addEventListener("click", () => {
			checkboxes.forEach(cb => cb.checked = false);
			updateCats();
		});
		
		document.getElementById("save_cats").addEventListener("click", () => {
			cats = Array.from(checkboxes)
				.filter(cb => cb.checked)
				.map(cb => parseInt(cb.dataset.id));
			closeWindow();
		});
		
		updateCats();
		
		document.getElementById("popup-window-overlay").style.display = "block";
		document.getElementById("popup-window").style.display = "block";
	}
	
	readSlots(){
		var decoder = new TextDecoder("utf-8");		
		
		for(var slot = 0; slot < 3; slot++){
			if(this.slots[slot]){
				// Name
				var name = decoder.decode(this.save_slots[slot].data.subarray(0, 0x20));
				name = name.replace(/\0/g, '');
				this.save_slots[slot].name = name;
				
				// Gender
				var gender_offset = 0x0244;
				var global_name_offset = 0x23B7D;
				var gender = new DataView(this.save_slots[slot].data.buffer.slice(gender_offset, gender_offset + 1)).getUint8(0, true);
				var global_name = decoder.decode(this.save_slots[slot].data.subarray(global_name_offset, global_name_offset + 0x20));
				this.save_slots[slot].gender = gender == 0 ? "♂" : "♀";
				if(!global_name.includes(name)) this.save_slots[slot].gender = "-";
				
				
				//HR
				var HR = new DataView(this.save_slots[slot].data.buffer.slice(0x28, 0x2A)).getUint16(0, true);
				this.save_slots[slot].HR = HR == 0 ? "---" : HR;
				
				//Funds
				this.save_slots[slot].funds = new DataView(this.save_slots[slot].data.buffer.slice(0x24, 0x28)).getUint32(0, true);
				
				// Play Time
				var seconds = new DataView(this.save_slots[slot].data.buffer.slice(0x20, 0x24)).getUint32(0, true);
				var hours = Math.floor(seconds / 3600);
				seconds -= hours * 3600;
				var minutes = Math.floor(seconds / 60);
				seconds -= minutes * 60;
				var time = hours.toString() + ':' + minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
				this.save_slots[slot].time = time;
			}
		}
	}
	
	exportCharms(slot, type){
		var charm_list = [];
		var data = this.save_slots[slot].data;
		for(var i = 0; i < 2000; i++){
			var charm = Array(5).fill("");
			var offset = 36 * i + 0x62EE;
			if(data[offset] == 0x6){
				if(type == 0) charm[0] = data[offset+16];
				else charm[0] = `,${data[offset+16]}`;
				if(data[offset + 12]){
					charm[1] = skill_names[data[offset+12]-1];
					charm[2] = data[offset+14];
				}
				if(data[offset+13]){
					charm[3] = skill_names[data[offset+13]-1];
					charm[4] = data[offset+15];
					if(charm[4] > 128) charm[4] -= 256;
				}
				charm_list.push(charm);
			}
		}
		var output = "";
		if(type == 0) output = `#Format: Slots,Skill1,Points1,Skill2,Points2\n`;
		else output = `#Format:,Slots,Skill1,Points1,Skill2,Points2\n`;
		output += charm_list.map(row => row.join(",")).join("\n");
		var utf8Encode = new TextEncoder();
		if(type == 0) saveByteArray([output], `mycharms.txt`);
		else saveByteArray([output], `CHARM.csv`);
	}
	
	deleteSlot(slot){
		this.save_slots[slot] = new SaveInfo(new Array(SLOT_SIZE).fill(0));;
		this.slots[slot] = 0;
		displayInfo(this);
	}
	
	exportSlot(slot){
		var saveslot = new Uint8Array([
			...this.save_slots[slot].data,
			...this.footers[slot].getFooter(2)
		]);
		saveByteArray([saveslot], `${this.save_slots[slot].name}.saveslot`);
	}
	
	importSlot(slot) {
	    var input = document.createElement('input');
	    input.type = 'file';
	    input.accept = ".saveslot";
	    input.onchange = event => {
		   var file = event.target.files[0];
		   if (!file) return;

		   var reader = new FileReader();
		   reader.onload = e => {
			  var importedData = new Uint8Array(e.target.result);

			  if(!(importedData.length == 0x11D088 || importedData.length == 0x11F8C4)){
				 if(importedData.length == 0x481D88 || importedData.length == 0x481DAC || importedData.length == 0x4EB8BC) readSave(event);
				 else alert("Invalid save slot file size.");
				 return;
			  }

			  this.save_slots[slot] = new SaveInfo(importedData);
			  this.footers[slot] = new Footer(importedData.slice(SLOT_SIZE));
			  this.slots[slot] = 1;
			  
			  this.readSlots();

			  displayInfo(save);
		   };

		   reader.readAsArrayBuffer(file);
	    };

	    input.click();
	}
	
	download(){
		var save_type = document.getElementById("dropdown").selectedIndex;
		var src_slot_offsets = this.slot_offsets;
		var dst_slot_offsets = [];
		var newData;
		var off = 0;
		
		if(save_type == 0){
			dst_slot_offsets = [
				new DataView(CLEAN_MHXX_3DS_SAVE.buffer, 0x10, 0x14).getUint32(0, true),
				new DataView(CLEAN_MHXX_3DS_SAVE.buffer, 0x14, 0x18).getUint32(0, true),
				new DataView(CLEAN_MHXX_3DS_SAVE.buffer, 0x18, 0x1C).getUint32(0, true)
			];
			
			newData = new Uint8Array(CLEAN_MHXX_3DS_SAVE);
			off = 0x00;
		}
		else if(save_type == 1){
			dst_slot_offsets = [
				new DataView(CLEAN_MHXX_SWITCH_SAVE.buffer, 0x34, 0x38).getUint32(0, true)+0x24,
				new DataView(CLEAN_MHXX_SWITCH_SAVE.buffer, 0x38, 0x3C).getUint32(0, true)+0x24,
				new DataView(CLEAN_MHXX_SWITCH_SAVE.buffer, 0x3C, 0x40).getUint32(0, true)+0x24
			];
			
			newData = new Uint8Array(CLEAN_MHXX_SWITCH_SAVE);
			off = 0x24;
		}
		else if(save_type == 2){
			dst_slot_offsets = [
				new DataView(CLEAN_MHGU_SAVE.buffer, 0x34, 0x38).getUint32(0, true)+0x24,
				new DataView(CLEAN_MHGU_SAVE.buffer, 0x38, 0x3C).getUint32(0, true)+0x24,
				new DataView(CLEAN_MHGU_SAVE.buffer, 0x3C, 0x40).getUint32(0, true)+0x24
			];
			
			newData = new Uint8Array(CLEAN_MHGU_SAVE);
			off = 0x24;
		}
		
		newData.set(this.save_slots[0].data, dst_slot_offsets[0]);
		newData.set(this.footers[0].getFooter(save_type), dst_slot_offsets[0]+SLOT_SIZE);
		newData.set(this.save_slots[1].data, dst_slot_offsets[1]);
		newData.set(this.footers[1].getFooter(save_type), dst_slot_offsets[1]+SLOT_SIZE);
		newData.set(this.save_slots[2].data, dst_slot_offsets[2]);
		newData.set(this.footers[2].getFooter(save_type), dst_slot_offsets[2]+SLOT_SIZE);
		
		for(var i = 0; i < 3; i++){
			newData[0x04 + off + i] = this.slots[i];
		}
		
		newData[0x28 + off] = 0x18;
		newData[0x29 + off] = 0x01;
		newData[0xB27E + off] = this.options[2];
		newData[0xB27F+ off] = this.options[3];
		var cat_offset = 0x2A + off;
		for(var i = 0; i < 50; i++){
			for(var j = 0; j < 0x144; j++){
				if(i < cats.length) newData[cat_offset + j] = DLC_CAT_DATA[cats[i]][j];
				else newData[cat_offset + j] = 0;
			}
			cat_offset += 0x144;
		}
		
		saveByteArray([newData], "system");
	}
}

var saveByteArray = (function (){
	var a = document.createElement("a");
	document.body.appendChild(a);
	a.style = "display: none";
	return function (data, name){
	   var blob = new Blob(data, {type: "application/octet-stream"}),
		  url = window.URL.createObjectURL(blob);
	   a.href = url;
	   a.download = name;
	   a.click();
	   window.URL.revokeObjectURL(url);
	};
}());
    

function displayInfo(save) {
    var DL = document.getElementById("DL");
    var text = `<select class="dropdown" id="dropdown">`;
	var selected = "";
	
	selected = game_type == 0 ? "selected" : "";
	text += `<option value=0 ${selected}>MHXX 3DS (JP)</option>`;
	
	selected = game_type == 1 ? "selected" : "";
	text += `<option value=1 ${selected}>MHXX Switch (JP)</option>`;
	
	selected = game_type == 2 ? "selected" : "";
	text += `<option value=2 ${selected}>MHGU Switch (EN)</option>`;
	text += `</select><span class="menu"><button onclick="downloadSave()">Export save (Includes DLC)</button></span>`;
	
	DL.innerHTML = text;
	
    var table = document.getElementById("saveTable");
    text = "";
    
    save.save_slots.forEach((slot, index) => {
        text += `<div class="save-table ${slot.name ? 'save-slot' : 'empty-slot'} list__item is-idle js-item">`;
        if (slot.name) {
            text += `<table><tr>
                <td class="slot-name">${slot.name}</td>
                <td class="slot-gender"><span class="slot-title">Gender</span><span class="slot-text">${slot.gender}</span></td>
                <td class="slot-hr"><span class="slot-title">HR</span><span class="slot-text">${slot.HR}</span></td>
            </tr><tr>
                <td class="slot-funds"><span class="slot-title">Funds</span><span class="slot-text">${slot.funds}z</span></td>
                <td colspan=2 class="slot-time"><span class="slot-title">Play Time</span><span class="slot-text">${slot.time}</span></td>
            </tr></table>
		  <div class="slot-actions">
            <button onclick="deleteSlot(${index})">Delete</button>
            <button onclick="exportSlot(${index})">Export</button>
            <button onclick="importSlot(${index})">Import</button>
			
			<select id="${index}_charms" class="dropdown" style="margin-left: 310px; margin-right: -8px">
				<option value=0>Athena</option>
				<option value=1>mhxx-wiki.db</option>
			</select>
			<button onclick="exportCharms(${index})">Export Charms</button>
		  </div>`;
        } else {
            text += `(No Data)<div class="import"><button onclick="importSlot(${index})">Import</button></div>`;
        }
        text += `<div class="overlay"></div></div>`;
    });
    
    table.innerHTML = text;
    drag_setup();
}

function openWindow(){
	save.manageCats();
}

function closeWindow(){
	document.getElementById("popup-window-overlay").style.display = "none";
	document.getElementById("popup-window").style.display = "none";
}

function exportCharms(slot){
	var type = document.getElementById(`${slot}_charms`).value;
	save.exportCharms(slot, type);
}

function deleteSlot(slot){
	save.deleteSlot(slot);
}

function exportSlot(slot){
	save.exportSlot(slot);
}

function importSlot(slot){
	save.importSlot(slot);
}

function downloadSave(save_type){
	save.download(save_type);
}

function newSave(){
	new_save = true;
	save = new SaveFile(CLEAN_MHXX_3DS_SAVE);
	save.detectGame();
	save.init();
	save.readSlots();
	displayInfo(save);
}

function readSave(event){
	save = null;
	var DL = document.getElementById("DL");
	DL.innerHTML = "";
	
	var table = document.getElementById("saveTable");
	table.innerHTML = "";
	
	var file = event.target.files[0];
	var reader = new FileReader();
	
	reader.onload = function(e){
		new_save = false;
		save = new SaveFile(new Uint8Array(e.target.result));
		res = save.detectGame();
		if(res) newSave();
		else{
			save.init();
			save.readSlots();
			displayInfo(save);
		}
	};
	
	reader.readAsArrayBuffer(file);
}

function loadSave(){
	document.getElementById("loadSave").click();
}

newSave();

window.addEventListener("load", () => {
	var footer = document.getElementById("footer");
	var now = new Date();
	var year = now.getFullYear();
	footer.innerHTML = `<a href="https://github.com/SilverJolteon/">&copy;2024-${year} SilverJolteon · ${VERSION}</a>`;
});
