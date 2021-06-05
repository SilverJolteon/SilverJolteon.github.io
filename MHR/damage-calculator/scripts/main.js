function c_attack_boost(base, lvl){
	switch(lvl){
		case 1:	return base * 1.00 +  3;
		case 2:	return base * 1.00 +  6;
		case 3:	return base * 1.00 +  9;
		case 4:	return base * 1.05 +  7;
		case 5:	return base * 1.06 +  8;
		case 6:	return base * 1.08 +  9;
		case 7:	return base * 1.10 + 10;
	}
	return base;
}

function c_critical_eye(lvl){
	switch(lvl){
		case 1: return 5;
		case 2: return 10;
		case 3: return 15;
		case 4: return 20;
		case 5: return 25;
		case 6: return 30;
		case 7: return 40;
	}
	return 0;
}

function c_weakness_exploit(lvl){
	switch(lvl){
		case 1: return 15;
		case 2: return 30;
		case 3: return 50;
	}
	return 0;
}

function c_bludgeoner(sharpness, lvl){
	mod = 1;
	switch(lvl){
		case 1: if(sharpness <= 1.00) mod = 1.05; break;
		case 2: if(sharpness <= 1.00) mod = 1.10; break;
		case 3: if(sharpness <= 1.05) mod = 1.10; break;
	}
	return mod;
}

function calcCrit(base, aff, boost){
	return (aff * boost * base) + ((1 - aff) * base);
}

function calcDmg(base, atk, agi, aff, boost, modifier){
	switch(agi){
		case 1: base +=  4; aff +=  3; break;
		case 2: base +=  8; aff +=  5; break;
		case 3: base += 12; aff +=  7; break;
		case 4: base += 16; aff += 10; break;
		case 5: base += 20; aff += 15; break;
	}
	if(aff > 100) aff = 100;
	if(aff < 0) boost = 0.75;
	var dmg = modifier * c_attack_boost(base, atk);
	return Math.floor(calcCrit(dmg, Math.abs(aff)/100, boost));
}

function calculate(){
	var base_attack_0 = parseInt(document.getElementById("base_attack_0").value);
	var base_affinity_0 = parseInt(document.getElementById("base_affinity_0").value);
	var sharpness_0 = parseFloat(document.getElementById("sharpness_0").value);
	var petalace_0 = parseInt(document.getElementById("petalace_0").value);
	var powercharm_0 = document.getElementById("powercharm_0").checked ? 6 : 0;
	var powertalon_0 = document.getElementById("powertalon_0").checked ? 9 : 0;
	
	var attack_boost_0 = c_attack_boost(parseInt(document.getElementById("attack_boost_0").value));
	var agitator_0 = parseInt(document.getElementById("agitator_0").value);
	var peak_performance_0 = parseInt(document.getElementById("peak_performance_0").value);
	var resentment_0 = parseInt(document.getElementById("resentment_0").value);
	var resuscitate_0 = parseInt(document.getElementById("resuscitate_0").value);
	
	var critical_eye_0 = c_critical_eye(parseInt(document.getElementById("critical_eye_0").value));
	var critical_boost_0 = parseFloat(document.getElementById("critical_boost_0").value);
	var weakness_exploit_0 = c_weakness_exploit(parseInt(document.getElementById("weakness_exploit_0").value));
	var maximum_might_0 = parseInt(document.getElementById("maximum_might_0").value);
	
	var bludgeoner_0 = c_bludgeoner(sharpness_0, parseInt(document.getElementById("bludgeoner_0").value));
	var dragonheart_0 = parseFloat(document.getElementById("dragonheart_0").value);
	var pierce_up_0 = parseFloat(document.getElementById("pierce_up_0").value);
	var rapid_fire_up_0 = parseFloat(document.getElementById("rapid_fire_up_0").value);
	
	var total_affinity_0 = base_affinity_0 + critical_eye_0 + maximum_might_0 + weakness_exploit_0;
	var effective_raw_0 = calcDmg(base_attack_0 + peak_performance_0 + resentment_0 + resuscitate_0, attack_boost_0, agitator_0, total_affinity_0, critical_boost_0, sharpness_0*bludgeoner_0*dragonheart_0*pierce_up_0*rapid_fire_up_0) + petalace_0 + powercharm_0 + powertalon_0;
	document.getElementById("effective_raw_0").value = effective_raw_0;
}

window.onload = function(){
	document.getElementById("base_attack_0").value = 200;
	document.getElementById("base_affinity_0").value = 0;
	document.getElementById("sharpness_0").selectedIndex = 0;
	document.getElementById("petalace_0").value = 0;
	document.getElementById("powercharm_0").checked = 0;
	document.getElementById("powertalon_0").checked = 0;
	
	document.getElementById("attack_boost_0").selectedIndex = 0;
	document.getElementById("agitator_0").selectedIndex = 0;
	document.getElementById("peak_performance_0").selectedIndex = 0;
	document.getElementById("resentment_0").selectedIndex = 0;
	document.getElementById("resuscitate_0").selectedIndex = 0;
	
	document.getElementById("critical_eye_0").selectedIndex = 0;
	document.getElementById("critical_boost_0").selectedIndex = 0;
	document.getElementById("weakness_exploit_0").selectedIndex = 0;
	document.getElementById("maximum_might_0").selectedIndex = 0;
	
	document.getElementById("bludgeoner_0").selectedIndex = 0;
	document.getElementById("dragonheart_0").selectedIndex = 0;
	document.getElementById("pierce_up_0").selectedIndex = 0;
	document.getElementById("rapid_fire_up_0").selectedIndex = 0;
	
	document.getElementById("effective_raw_0").value = 200;
}

