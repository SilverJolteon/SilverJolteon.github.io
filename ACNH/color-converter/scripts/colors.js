var cursor = [0, 0, 0];
var color = "";

function displayColors(){
	for(var i = 0; i < 30; i++){
		var colors = document.getElementById("colors");
		var ctx = colors.getContext("2d");
		ctx.beginPath();
		ctx.rect(350 + (16 * i), 36, 16, 36);
		ctx.fillStyle = HVB2RGB(i, 14, 14);
		ctx.fill();
		
		ctx.textAlign = "center";
		ctx.strokeStyle = "#000000";
		ctx.strokeText(i, 358 + (16 * i), 56);
		ctx.fillStyle = "#FFFFFF";
		ctx.fillText(i, 358 + (16 * i), 56);
	}
	for(var i = 0; i < 15; i++){
		var colors = document.getElementById("colors");
		var ctx = colors.getContext("2d");
		ctx.beginPath();
		ctx.rect(350 + (32 * i), 117, 32, 36);
		ctx.fillStyle = HVB2RGB(cursor[0], i, cursor[2]);
		ctx.fill();
		
		ctx.textAlign = "center";
		ctx.strokeStyle = "#000000";
		ctx.strokeText(i, 366 + (32 * i), 137);
		ctx.fillStyle = "#FFFFFF";
		ctx.fillText(i, 366 + (32 * i), 137);
	}
	
	for(var i = 0; i < 15; i++){
		var colors = document.getElementById("colors");
		var ctx = colors.getContext("2d");
		ctx.beginPath();
		ctx.rect(350 + (32 * i), 198, 32, 36);
		ctx.fillStyle = HVB2RGB(cursor[0], cursor[1], i);
		ctx.fill();
		
		ctx.textAlign = "center";
		ctx.strokeStyle = "#000000";
		ctx.strokeText(i, 366 + (32 * i), 218);
		ctx.fillStyle = "#FFFFFF";
		ctx.fillText(i, 366 + (32 * i), 218);
	}
}
function HVB2RGB(h, s, v){
	h = ((h * 359) / 29) / 360;
	s /= 14;
	v /= 14;
	var r, g, b;

	var i = Math.floor(h * 6);
	var f = h * 6 - i;
	var p = v * (1 - s);
	var q = v * (1 - f * s);
	var t = v * (1 - (1 - f) * s);

	switch (i % 6) {
	case 0: r = v, g = t, b = p; break;
	case 1: r = q, g = v, b = p; break;
	case 2: r = p, g = v, b = t; break;
	case 3: r = p, g = q, b = v; break;
	case 4: r = t, g = p, b = v; break;
	case 5: r = v, g = p, b = q; break;
	}
	return "rgb(" + r*255 + ", " + g*255 + ", " + b*255 + ")";
}

function RGB2ACNH(color){
	red = (color & 0xFF0000) >> 16;
	green = (color & 0x00FF00) >> 8;
	blue = color & 0x0000FF;
	
	cmax = (red > green) ? red : green;
	if(blue > cmax) cmax = blue;
	cmin = (red < green) ? red : green;
	if(blue < cmin) cmin = blue;
	
	bri = cmax / 255;
	if(cmax != 0) sat = (cmax - cmin) / cmax;
	else sat = 0;
	
	if(sat == 0) hue = 0;
	else{
		redc = (cmax - red) / (cmax - cmin);
		greenc = (cmax - green) / (cmax - cmin);
		bluec = (cmax - blue) / (cmax - cmin);
		
		if(red == cmax) hue = bluec - greenc;
		else if(green == cmax) hue = 2 + redc - bluec;
		else hue = 4 + greenc - redc;
		
		hue = hue / 6;
		if(hue < 0) hue = hue + 1;
	}
	
	hue *= 360;
	sat *= 100;
	bri *= 100;
	
	hue = (hue * 29) / 359;
	sat = (sat * 14) / 100;
	bri = (bri * 14) / 100;
	cursor[0] = Math.round(hue);
	cursor[1] = Math.round(sat);
	cursor[2] = Math.round(bri);
	document.getElementById("hue_cursor").style.left = 350 + cursor[0] * 16 + "px";
	document.getElementById("vividness_cursor").style.left = 358 + cursor[1] * 32 + "px";
	document.getElementById("brightness_cursor").style.left = 358 + cursor[2] * 32 + "px";
}

function update(){
	var color = document.getElementById("hex-color");
	color = parseInt(color.value.substring(1, 7), 16);
	RGB2ACNH(color);
	displayColors();
}

function pad(str, num, c){
	str = str + '';
	return str.length >= num ? str : new Array(num - str.length + 1).join(c) + str;
}

window.onload = function(){
	displayColors();
	var hex = document.getElementById("hex");
	var input = document.createElement("input");
	input.size = 6;
	input.id = "hex-color";
	hex.appendChild(input);
	new JSColor(input, {onInput:'update()', hash:true});
	input.jscolor.fromString(pad("000000", 6, '0'));
}

