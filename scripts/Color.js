var color_ids = [0, 1, 2, 3, 8, 9, 4, 15, 6, 5, 10, 7, 11, 14, 12, 13];

function swap32(val) {
    return ((val & 0xFF) << 24)
           | ((val & 0xFF00) << 8)
           | ((val >> 8) & 0xFF00)
           | ((val >> 24) & 0xFF);
}

function color_8_to_32(color){
	var temp = {};
	
	// Split hex RGB into each color
	temp.red_8 = (color & 0xFF0000) >> 16;
	temp.green_8 = (color & 0x00FF00) >> 8;
	temp.blue_8 = color & 0x0000FF;
	
	// Convert 8 bit colors into 32 bit colors
	temp.red_32 = swap32(temp.red_8 * 0x030303 + 0x3C000000);
	temp.green_32 = swap32(temp.green_8 * 0x030303 + 0x3C000000);
	temp.blue_32 = swap32(temp.blue_8 * 0x030303 + 0x3C000000);
	
	return temp;
}

function color_32_to_8(red_32, green_32, blue_32){
	if(swap32(red_32) > 0x3F000000) red_32 = 0x0000003F;
	if(swap32(green_32) > 0x3F000000) green_32 = 0x0000003F;
	if(swap32(blue_32) > 0x3F000000) blue_32 = 0x0000003F;
	
	var red_8 = swap32(red_32) * 5.0663948059082E-6 - 5100;
	var green_8 = swap32(green_32) * 5.0663948059082E-6 - 5100;
	var blue_8 = swap32(blue_32) * 5.0663948059082E-6 - 5100;

	return (red_8 << 16) | (green_8 << 8) | blue_8;
}

function getColor(color_id_old, type){
	var color_id = color_id_old;
	var hair_color = {};
	var shine_color = {};
	var eye_color = {};
	
	var color ={};
	for(i = 0; i < 4; i++){
		var temp;
		if(type == 0){
			color_id = color_ids[color_id_old];
			temp = CharaMakeHairColorParam[0x74 + (color_id * 0x60) + 3 - i]&0xFF>>>0;
			hair_color.red_32 |= temp << i * 8;
			temp = CharaMakeHairColorParam[0x74 + (color_id * 0x60) + 4 + 3 - i]&0xFF>>>0;
			hair_color.blue_32 |= temp << i * 8;
			temp = CharaMakeHairColorParam[0x74 + (color_id * 0x60) + 8 + 3 - i]&0xFF>>>0;
			hair_color.green_32 |= temp << i * 8;
			
			temp = CharaMakeHairColorParam[0x68 + (color_id * 0x60) + 3 - i]&0xFF>>>0;
			shine_color.blue_32 |= temp << i * 8;
			temp = CharaMakeHairColorParam[0x68 + (color_id * 0x60) + 4 + 3 - i]&0xFF>>>0;
			shine_color.green_32 |= temp << i * 8;
			temp = CharaMakeHairColorParam[0x68 + (color_id * 0x60) + 8 + 3 - i]&0xFF>>>0;
			shine_color.red_32 |= temp << i * 8;
		}
		if(type == 1){
			temp = CharaMakeEyeColorParam[0x50 + (color_id * 0x54) + 3 - i]&0xFF>>>0;
			eye_color.blue_32 |= temp << i * 8;
			temp = CharaMakeEyeColorParam[0x50 + (color_id * 0x54) + 4 + 3 - i]&0xFF>>>0;
			eye_color.green_32 |= temp << i * 8;
			temp = CharaMakeEyeColorParam[0x50 + (color_id * 0x54) + 8 + 3 - i]&0xFF>>>0;
			eye_color.red_32 |= temp << i * 8;
		}
	}
	if(type == 0){
		color.hair = color_32_to_8(hair_color.red_32, hair_color.green_32, hair_color.blue_32);
		color.shine = color_32_to_8(shine_color.red_32, shine_color.green_32, shine_color.blue_32);
	}
	if(type == 1) color.eye = color_32_to_8(eye_color.red_32, eye_color.green_32, eye_color.blue_32);
	
	return color;
}

function edit_hair(color_id, hair, shine){
	var hair_color = color_8_to_32(hair);
	var shine_color = color_8_to_32(shine);	
	
	// Replace bytes
	
	for(i = 0; i < 4; i++){
		CharaMakeHairColorParam[0x74 + (color_id * 0x60) + 3 - i] = (hair_color.red_32 >> (i * 8) & 0xFF);
		CharaMakeHairColorParam[0x74 + (color_id * 0x60) + 4 + 3 - i] = (hair_color.blue_32 >> (i * 8) & 0xFF);
		CharaMakeHairColorParam[0x74 + (color_id * 0x60) + 8 + 3 - i] = (hair_color.green_32 >> (i * 8) & 0xFF);
		
		CharaMakeHairColorParam[0x68 + (color_id * 0x60) + 3 - i] = (shine_color.blue_32 >> (i * 8) & 0xFF);
		CharaMakeHairColorParam[0x68 + (color_id * 0x60) + 4 + 3 - i] = (shine_color.green_32 >> (i * 8) & 0xFF);
		CharaMakeHairColorParam[0x68 + (color_id * 0x60) + 8 + 3 - i] = (shine_color.red_32 >> (i * 8) & 0xFF);
	}
}

function edit_eye(color_id, eye){
	var eye_color = color_8_to_32(eye);
	
	// Replace bytes
	
	for(i = 0; i < 4; i++){
		CharaMakeEyeColorParam[0x50 + (color_id * 0x54) + 3 - i] = (eye_color.blue_32 >> (i * 8) & 0xFF);
		CharaMakeEyeColorParam[0x50 + (color_id * 0x54) + 4 + 3 - i] = (eye_color.green_32 >> (i * 8) & 0xFF);
		CharaMakeEyeColorParam[0x50 + (color_id * 0x54) + 8 + 3 - i] = (eye_color.red_32 >> (i * 8) & 0xFF);
	}
}

function pad(str, num, c){
	str = str + '';
	return str.length >= num ? str : new Array(num - str.length + 1).join(c) + str;
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

jscolor.trigger('input');

window.onload = function(){
	for(var id = 0; id < 16; id++) gen_hair(id);
	for(var id = 0; id < 6; id++) gen_eye(id);
}

function gen_hair(color_id) {
		var p0 = document.createElement('center');
		var p1 = document.createElement('tr');
		p0.appendChild(p1);
		var hair = document.createElement('INPUT');
		hair.size = 6;
		hair.id = "hair-color-" + color_ids[color_id];
		var shine = document.createElement('INPUT');
		shine.size = 6;
		shine.id = "shine-color-" + color_ids[color_id];
		p1.appendChild(hair);
		p1.appendChild(shine);
		new JSColor(hair, {hash:true});
		new JSColor(shine, {hash:true});
		var color = getColor(color_id, 0);
		hair.jscolor.fromString(pad(color.hair.toString(16), 6, '0'));	
		shine.jscolor.fromString(pad(color.shine.toString(16), 6, '0'));	
		if(color_id < 8) document.getElementById('hair_colors0').appendChild(p0);
		else document.getElementById('hair_colors1').appendChild(p0);
}

function gen_eye(color_id) {
		var p0 = document.createElement('center');
		var p1 = document.createElement('tr');
		p0.appendChild(p1);
		var eye = document.createElement('INPUT');
		eye.size = 6;
		eye.id = "eye-color-" + color_id;
		p1.appendChild(eye);
		new JSColor(eye, {hash:true});
		var color = getColor(color_id, 1);
		eye.jscolor.fromString(pad(color.eye.toString(16), 6, '0'));		
		document.getElementById('eye_colors').appendChild(p0);
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
	for(var id = 0; id < 6; id++){
		var eye = document.getElementById("eye-color-" + id);
		eye = parseInt(eye.value.substring(1, 7), 16);
	
		edit_eye(id, eye);
	}
	saveByteArray([CharaMakeEyeColorParam], 'CharaMakeEyeColorParam.bcsv');
	var location = document.getElementById("eye_location");
	location.innerHTML = 'Save to <font color="#34ADCA">/atmosphere/contents/01006F8002326000/romfs/Bcsv/</font><font color="#017A97">CharaMakeEyeColorParam.bcsv</font>';
}