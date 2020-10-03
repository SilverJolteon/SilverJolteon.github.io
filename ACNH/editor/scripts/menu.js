window.onload = function(){
	var isChrome = navigator.userAgent.indexOf("Chrome") != -1;
	if(isChrome){
		var settings = document.getElementById("settings");
		settings.style["right"] = "10px";
	}
	
	for(var id = 0; id < 16; id++) gen_hair(id);
	for(var id = 0; id < 12; id++) gen_eye(id);
}

var saveByteArray = (function () {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    return function (data, name) {
        var blob = new Blob(data, {type: "octet/stream"}),
            url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = name;
        a.click();
        window.URL.revokeObjectURL(url);
    };
}());

function save_hair(){
	for(var id = 0; id < 16; id++){
		var hair = document.getElementById("hair-color-" + color_ids[id]);
		hair = parseInt(hair.value.substring(1, 7), 16);
		
		var shine = document.getElementById("shine-color-" + color_ids[id]);
		shine = parseInt(shine.value.substring(1, 7), 16);
		edit_hair(color_ids[id], hair, shine);
	}
	saveByteArray([CharaMakeHairColorParam], 'CharaMakeHairColorParam.bcsv');
	var location = document.getElementById("hair_location");
	location.innerHTML = 'Save to <font color="#34ADCA">/atmosphere/contents/01006F8002326000/romfs/Bcsv/</font><font color="#017A97">CharaMakeHairColorParam.bcsv</font>';
}

function save_eye(){
	for(var id = 0; id < 12; id++){
		var eye = document.getElementById("eye-color-" + id);
		eye = parseInt(eye.value.substring(1, 7), 16);
	
		edit_eye(id, eye);
	}
	saveByteArray([CharaMakeEyeColorParam], 'CharaMakeEyeColorParam.bcsv');
	var location = document.getElementById("eye_location");
	location.innerHTML = 'Save to <font color="#34ADCA">/atmosphere/contents/01006F8002326000/romfs/Bcsv/</font><font color="#017A97">CharaMakeEyeColorParam.bcsv</font>';
}

function save_settings(){
	var data = [];
	data.push("Presets");
	for(var i = 0; i < 16; i++){
		var hair = document.getElementById("hair-color-" + color_ids[i]);
		var shine = document.getElementById("shine-color-" + color_ids[i]);
		data.push("\n"+hair.value);
		data.push(shine.value);
	}
	for(var i = 0; i < 12; i++){
		var eye = document.getElementById("eye-color-" + i);
		if(i == 0) data.push("\n\n"+eye.value);
		else data.push("\n"+eye.value);
	}
	saveByteArray([data], 'presets.csv');
}

var loadSettings = function(event){
	var file = event.target.files[0];
	var reader = new FileReader();
	reader.readAsText(file);
	reader.onload = function(){
		var buffer = reader.result, data = buffer.split(",");
		if(data[0].localeCompare("Presets") == 0){
			for(var i = 0; i < 16; i++){
			var hair = document.getElementById("hair-color-" + color_ids[i]);
			var shine = document.getElementById("shine-color-" + color_ids[i]);
			hair.jscolor.fromString(data[i*2 + 1]);	
			shine.jscolor.fromString(data[i*2 + 2]);
			}
			for(var i = 0; i < 12; i++){
				var eye = document.getElementById("eye-color-" + i);
				eye.jscolor.fromString(data[33 + i]);
			}
		}
		
	};
};