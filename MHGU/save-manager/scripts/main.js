var save = null;
const SLOT_SIZE = 0x11D088;

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
		this.game = -1;
		this.slots = [0, 0, 0];
		this.slot_offsets = [];
		this.save_slots = [];
	}
	
	detectGame(){
		const MHXX_SIZE = 0x481D88;
		const MHGU_SIZE = 0x4EB8BC;
		
		switch(this.data.length){
			case MHXX_SIZE:
				this.game = 0;
				break;
			case MHGU_SIZE:
				this.game = 1;
				break;
			default:
				this.game = -1;
		}
	}
	
	readSlots(){
		var decoder = new TextDecoder("utf-8");
		
		var off = 0;
		if(this.game == 1) off = 0x24;
		this.slots = Array.from(this.data.subarray(0x04 + off, 0x07 + off));
		this.slot_offsets = [
			new DataView(this.data.buffer.slice(0x10 + off, 0x14 + off)).getUint32(0, true),
			new DataView(this.data.buffer.slice(0x14 + off, 0x18 + off)).getUint32(0, true),
			new DataView(this.data.buffer.slice(0x18 + off, 0x1C + off)).getUint32(0, true)
		];
		
		for(var slot = 0; slot < 3; slot++){
			var slot_data = new SaveInfo(this.data.buffer.slice(this.slot_offsets[slot]+off, this.slot_offsets[slot] + off + SLOT_SIZE));
			if(this.slots[slot]){
				// Name
				var name = decoder.decode(this.data.subarray(this.slot_offsets[slot] + off, this.slot_offsets[slot] + off + 0x20));
				name = name.replace(/\0/g, '');
				slot_data.name = name;
				
				// Gender
				var gender_offset = 0x0244;
				var global_name_offset = 0x23B7D;
				var gender = new DataView(this.data.buffer.slice(this.slot_offsets[slot] + off + gender_offset, this.slot_offsets[slot] + off + gender_offset + 1)).getUint8(0, true);
				var global_name = decoder.decode(this.data.subarray(this.slot_offsets[slot] + off + global_name_offset, this.slot_offsets[slot] + off + global_name_offset + 0x20));
				slot_data.gender = gender == 0 ? "♂" : "♀";
				if(!global_name.includes(name)) slot_data.gender = "-";
				
				//HR
				var HR = new DataView(this.data.buffer.slice(this.slot_offsets[slot] + off + 0x28, this.slot_offsets[slot] + off + 0x2A)).getUint16(0, true);
				slot_data.HR = HR == 0 ? "---" : HR;
				
				//Funds
				slot_data.funds = new DataView(this.data.buffer.slice(this.slot_offsets[slot] + off + 0x24, this.slot_offsets[slot] + off + 0x28)).getUint32(0, true);
				
				// Play Time
				var seconds = new DataView(this.data.buffer.slice(this.slot_offsets[slot] + off + 0x20, this.slot_offsets[slot] + off + 0x24)).getUint32(0, true);
				var hours = Math.floor(seconds / 3600);
				seconds -= hours * 3600;
				var minutes = Math.floor(seconds / 60);
				seconds -= minutes * 60;
				var time = hours.toString() + ':' + minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
				slot_data.time = time;
			}
			this.save_slots.push(slot_data);
		}
	}
	
	download(){
		var off = 0;
		if(this.game == 1) off = 0x24;
		var src_slot_offsets = this.slot_offsets;
		var dst_slot_offsets = [
			new DataView(CLEAN_MHXX_SAVE.buffer, 0x10, 0x14).getUint32(0, true),
			new DataView(CLEAN_MHXX_SAVE.buffer, 0x14, 0x18).getUint32(0, true),
			new DataView(CLEAN_MHXX_SAVE.buffer, 0x18, 0x1C).getUint32(0, true)
		];
		console.log(dst_slot_offsets);
		for(var i = 0; i < 3; i++){
			CLEAN_MHXX_SAVE[4+i] = this.slots[i];
		}
		
		var newData = new Uint8Array([
			...CLEAN_MHXX_SAVE.slice(0, dst_slot_offsets[0]),
			...this.save_slots[0].data,
			...CLEAN_MHXX_SAVE.slice(dst_slot_offsets[0] + SLOT_SIZE, dst_slot_offsets[1]),
			...this.save_slots[1].data,
			...CLEAN_MHXX_SAVE.slice(dst_slot_offsets[1] + SLOT_SIZE, dst_slot_offsets[2]),
			...this.save_slots[2].data,
			...CLEAN_MHXX_SAVE.slice(dst_slot_offsets[2] + SLOT_SIZE)
		]);
		
		

		saveByteArray([newData], "system");
	}
}

var saveByteArray = (function (){
	var a = document.createElement("a");
	document.body.appendChild(a);
	a.style = "display: none";
	return function (data, name){
	   var blob = new Blob(data, {type: "application/octet/stream"}),
		  url = window.URL.createObjectURL(blob);
	   a.href = url;
	   a.download = name;
	   a.click();
	   window.URL.revokeObjectURL(url);
	};
}());
    

function displayInfo(save){
	
	var DLC = document.getElementById("DLC");
	DLC.innerHTML = `<button onclick="downloadDLC()" style="height: 32px;"><b>Download MHXX DLC (3DS)</b></button>`;
	
	var table = document.getElementById("saveTable");
	var text = "";
	
	save.save_slots.forEach((slot, index) => {
		text += `<div>`;
		if(slot.name){
			text += `<div class="save-slot">
				<table><tr>
					<td class="slot-name">
						${slot.name}
					</td>
					<td class="slot-gender"><span class="slot-title">Gender</span><span class="slot-text">${slot.gender}</span></span>
					<td class="slot-hr"><span class="slot-title">HR</span><span class="slot-text">${slot.HR}</span></span>
				</tr><tr>
					<td class="slot-funds"><span class="slot-title">Funds</span><span class="slot-text">${slot.funds}z</span></span>
					<td colspan=2 class="slot-time"><span class="slot-title">Play Time</span><span class="slot-text">${slot.time}</span></span>
				</tr></table>	
			</div>`;
		}
		else{
			text += `<div class="empty-slot">(No Data)</div>`;
		}
		
		text += `</div>`;
	});
	
	table.innerHTML = text;
}

function downloadDLC(){
	save.download();
}

function readSave(event){
	var file = event.target.files[0];
	var reader = new FileReader();
	
	reader.onload = function(e){
		save = new SaveFile(new Uint8Array(e.target.result));
		save.detectGame();
		save.readSlots();
		displayInfo(save);
	};
	
	reader.readAsArrayBuffer(file);
}

function loadSave(){
	document.getElementById("loadSave").click();
}
