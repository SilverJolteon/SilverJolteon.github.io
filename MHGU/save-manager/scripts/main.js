var save = null;
const SLOT_SIZE = 0x11D088;
var new_save = false;

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
	
	init(){
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
			this.save_slots[slot] = slot_data;
		}
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
				var global_name = decoder.decode(this.save_slots[slot].data.subarray(this.global_name_offset, global_name_offset + 0x20));
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
	
	deleteSlot(slot){
		this.save_slots[slot] = new SaveInfo(new Array(SLOT_SIZE).fill(0));;
		this.slots[slot] = 0;
		displayInfo(this);
	}
	
	exportSlot(slot){
		saveByteArray([this.save_slots[slot].data], `${this.save_slots[slot].name}.saveslot`);
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

			  // Ensure the imported data matches the expected slot size
			  if (importedData.length !== SLOT_SIZE) {
				 alert("Invalid save slot file size.");
				 return;
			  }

			  // Replace the save slot with the imported data
			  this.save_slots[slot] = new SaveInfo(importedData);
			  this.slots[slot] = 1;
			  this.readSlots();

			  // Re-display the information with the updated slot
			  displayInfo(save);  // Updated here to ensure the UI refreshes
		   };

		   reader.readAsArrayBuffer(file);
	    };

	    input.click();  // Trigger the file selection dialog
	}
	
	download(with_dlc){
		var off = 0;
		if(this.game == 1) off = 0x24;
		var src_slot_offsets = this.slot_offsets;
		var dst_slot_offsets = [
			new DataView(CLEAN_MHXX_SAVE.buffer, 0x10, 0x14).getUint32(0, true),
			new DataView(CLEAN_MHXX_SAVE.buffer, 0x14, 0x18).getUint32(0, true),
			new DataView(CLEAN_MHXX_SAVE.buffer, 0x18, 0x1C).getUint32(0, true)
		];
		for(var i = 0; i < 3; i++){
			CLEAN_MHXX_SAVE[4+i] = this.slots[i];
		}
		var newData;
		if(with_dlc){
			for(var i = 0; i < 3; i++){
				CLEAN_MHXX_SAVE[4+i] = this.slots[i];
			}
			newData = new Uint8Array([
				...CLEAN_MHXX_SAVE.slice(0, dst_slot_offsets[0]),
				...this.save_slots[0].data,
				...CLEAN_MHXX_SAVE.slice(dst_slot_offsets[0] + SLOT_SIZE, dst_slot_offsets[1]),
				...this.save_slots[1].data,
				...CLEAN_MHXX_SAVE.slice(dst_slot_offsets[1] + SLOT_SIZE, dst_slot_offsets[2]),
				...this.save_slots[2].data,
				...CLEAN_MHXX_SAVE.slice(dst_slot_offsets[2] + SLOT_SIZE)
			]);
		}
		else{
			for(var i = 0; i < 3; i++){
				this.data[4+i] = this.slots[i];
			}
			newData = new Uint8Array([
				...this.data.slice(0, src_slot_offsets[0]),
				...this.save_slots[0].data,
				...this.data.slice(src_slot_offsets[0] + SLOT_SIZE, src_slot_offsets[1]),
				...this.save_slots[1].data,
				...this.data.slice(src_slot_offsets[1] + SLOT_SIZE, src_slot_offsets[2]),
				...this.save_slots[2].data,
				...this.data.slice(src_slot_offsets[2] + SLOT_SIZE)
			]);
		}
		

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
    

function displayInfo(save) {
    var DLC = document.getElementById("DLC");
    DLC.innerHTML = `<button onclick="downloadSave(false)" style="height: 32px;"><b>Export SYSTEM For MHXX 3DS</b></button>`;
	if(!new_save) DLC.innerHTML += `
	<button onclick="downloadSave(true)" style="height: 32px;"><b>Export SYSTEM For MHXX 3DS (With All DLC)</b></button>`;
    
    var table = document.getElementById("saveTable");
    var text = "";
    
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
		  </div>`;
        } else {
            text += `(No Data)<div class="import"><button onclick="importSlot(${index})">Import</button></div>`;
        }
        text += `</div>`;
    });
    
    table.innerHTML = text;
    drag_setup();
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

function downloadSave(with_dlc){
	save.download(with_dlc);
}

function newSave(){
	new_save = true;
	save = new SaveFile(CLEAN_MHXX_SAVE);
	save.detectGame();
	save.init();
	save.readSlots();
	displayInfo(save);
}

function readSave(event){
	save = null;
	var DLC = document.getElementById("DLC");
	DLC.innerHTML = "";
	
	var table = document.getElementById("saveTable");
	table.innerHTML = "";
	
	var file = event.target.files[0];
	var reader = new FileReader();
	
	reader.onload = function(e){
		new_save = false;
		save = new SaveFile(new Uint8Array(e.target.result));
		save.detectGame();
		save.init();
		save.readSlots();
		displayInfo(save);
	};
	
	reader.readAsArrayBuffer(file);
}

function loadSave(){
	document.getElementById("loadSave").click();
}