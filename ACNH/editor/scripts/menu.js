window.onload = function(){
	var isChrome = navigator.userAgent.indexOf("Chrome") != -1;
	if(isChrome){
		var settings = document.getElementById("settings");
		settings.style["right"] = "10px";
	}
	for(var id = 0; id < 12; id++) gen_skin(id);
	for(var id = 0; id < 16; id++) gen_hair(id);
	for(var id = 0; id < 12; id++) gen_eye(id);
	select_menu(1);
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

function save_skin(){
	for(var id = 0; id < 12; id++){
		var skin = document.getElementById("skin-color-" + id);
		skin = parseInt(skin.value.substring(1, 7), 16);
	
		edit_skin(id, skin);
	}
	saveByteArray([CharaMakeSkinColorParam], 'CharaMakeSkinColorParam.bcsv');
	var location = document.getElementById("skin_location");
	location.innerHTML = 'Save to <font color="#34ADCA">/atmosphere/contents/01006F8002326000/romfs/Bcsv/</font><font color="#017A97">CharaMakeSkinColorParam.bcsv</font>';
}

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
	data.push("Skin Colors");
	for(var i = 0; i < 12; i++){
		var skin = document.getElementById("skin-color-" + i);
		data.push("\n"+skin.value);
	}
	data.push("\n,\nHair Colors");
	for(var i = 0; i < 16; i++){
		var hair = document.getElementById("hair-color-" + color_ids[i]);
		var shine = document.getElementById("shine-color-" + color_ids[i]);
		data.push("\n"+hair.value);
		data.push(shine.value);
	}
	data.push("\n,\nEye Colors");
	for(var i = 0; i < 12; i++){
		var eye = document.getElementById("eye-color-" + i);
		data.push("\n"+eye.value);
	}
	data.push("\n,");
	saveByteArray([data], 'presets.csv');
}

var loadSettings = function(event){
	var file = event.target.files[0];
	var reader = new FileReader();
	reader.readAsText(file);
	reader.onload = function(){
		var buffer = reader.result, data = buffer.split(",");
		if(data[0].localeCompare("Skin Colors") == 0){
			var line = 1;
			var i = 0;
			while(1){
				if(data[line].localeCompare("\n") == 0) break;
				var skin = document.getElementById("skin-color-" + i);
				skin.jscolor.fromString(data[line]);
				line++;
				i++;
			}
			
			line += 2;
			i = 0;
			while(1){
				if(data[line].localeCompare("\n") == 0) break;
				var hair = document.getElementById("hair-color-" + color_ids[i]);
				var shine = document.getElementById("shine-color-" + color_ids[i]);
				hair.jscolor.fromString(data[line]);	
				shine.jscolor.fromString(data[line + 1]);
				line+=2;
				i++;
			}
			line += 2;
			i = 0;
			while(1){
				if(data[line].localeCompare("\n") == 0) break;
				var eye = document.getElementById("eye-color-" + i);
				eye.jscolor.fromString(data[line]);
				line++;
				i++;
			}
		}
		
	};
};

function select_menu(n){
	for(var i = 0 ; i < 3; i++){
		document.getElementById("map").src="assets/menu-bg-" + n + ".png";
		document.getElementById("skin_location").innerHTML = "";
		document.getElementById("hair_location").innerHTML = "";
		document.getElementById("eye_location").innerHTML = "";

		if(n == i){
			document.getElementById("menu" + i).style.display = "block";
			document.getElementById("body" + i).style.display = "block";
		}
		else{
			document.getElementById("menu" + i).style.display = "none";
			document.getElementById("body" + i).style.display = "none";
		}
	}
}