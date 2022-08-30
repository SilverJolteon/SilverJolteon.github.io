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

function c_element_attack(base, lvl){
	switch(lvl){
		case 1:	return base * 1.00 +  2;
		case 2:	return base * 1.00 +  3;
		case 3:	return base * 1.05 +  4;
		case 4:	return base * 1.10 +  4;
		case 5:	return base * 1.20 +  4;
	}
	return base;
}

function c_element_sharpness(lvl){
	switch(lvl){
		case 0.00: return 1.00;
		case 0.50: return 0.25;
		case 0.75: return 0.50;
		case 1.00: return 0.75;
		case 1.05: return 1.00;
		case 1.20: return 1.0625;
		case 1.32: return 1.15;
		case 1.39: return 1.25;
	}
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

function c_chain_crit(type, lvl){
	if(lvl == -1) return 0;
	if(type == 0){
		switch(lvl){
			case 00: return 5 + 10;
			case 01: return 5 + 12;
			case 02: return 5 + 15;
			case 10: return 5 + 8;
			case 11: return 5 + 9;
			case 12: return 5 + 10;
			case 20: return 5 + 8;
			case 21: return 5 + 9;
			case 22: return 5 + 10;
			case 30: return 5 + 10;
			case 31: return 5 + 12;
			case 32: return 5 + 15;
		}
	}
	else{
		switch(lvl){
			case 00: return 5 + 6;
			case 01: return 5 + 8;
			case 02: return 5 + 12;
			case 10: return 5 + 6;
			case 11: return 5 + 8;
			case 12: return 5 + 12;
			case 20: return 5 + 0;
			case 21: return 5 + 0;
			case 22: return 5 + 0;
			case 30: return 5 + 8;
			case 31: return 5 + 10;
			case 32: return 5 + 15;
		}
	}
	return 0;
}

function calcCrit(base, aff, boost){
	if(boost == 1.00) return base;
	return (aff * boost * base) + ((1 - aff) * base);
}

function calcDmg(base, atk, agi, aff, boost, modifier){
	
	var dmg = modifier * c_attack_boost(base, atk);
	return calcCrit(dmg, Math.abs(aff)/100, boost);
}

function calculate(){
	var base_attack_0 = parseInt(document.getElementById("base_attack_0").value);
	var base_affinity_0 = parseInt(document.getElementById("base_affinity_0").value);
	var sharpness_0 = parseFloat(document.getElementById("sharpness_0").value);
	var element_1_0 = parseInt(document.getElementById("element_1_0").value);
	var element_2_0 = parseInt(document.getElementById("element_2_0").value);
	var element_1_attack_0 = parseInt(document.getElementById("element_1_attack_0").value);
	var element_2_attack_0 = parseInt(document.getElementById("element_2_attack_0").value);
	
	var attack_boost_0 = c_attack_boost(parseInt(document.getElementById("attack_boost_0").value));
	var agitator_0 = parseInt(document.getElementById("agitator_0").value);
	var peak_performance_0 = parseInt(document.getElementById("peak_performance_0").value);
	var resentment_0 = parseInt(document.getElementById("resentment_0").value);
	var resuscitate_0 = parseInt(document.getElementById("resuscitate_0").value);
	
	var critical_eye_0 = c_critical_eye(parseInt(document.getElementById("critical_eye_0").value));
	var critical_boost_0 = parseFloat(document.getElementById("critical_boost_0").value);
	var weakness_exploit_0 = c_weakness_exploit(parseInt(document.getElementById("weakness_exploit_0").value));
	var maximum_might_0 = parseInt(document.getElementById("maximum_might_0").value);
	var critical_element_0 = parseFloat(document.getElementById("critical_element_0").value);
	
	var normal_rapid_up_0 = parseFloat(document.getElementById("normal_rapid_up_0").value);
	var pierce_up_0 = parseFloat(document.getElementById("pierce_up_0").value);
	var spread_up_0 = parseFloat(document.getElementById("spread_up_0").value);
	var rapid_fire_up_0 = parseFloat(document.getElementById("rapid_fire_up_0").value);
	var offensive_guard_0 = parseFloat(document.getElementById("offensive_guard_0").value);
	
	var bludgeoner_0 = c_bludgeoner(sharpness_0, parseInt(document.getElementById("bludgeoner_0").value));
	var dragonheart_0 = parseFloat(document.getElementById("dragonheart_0").value);
	var chain_crit_raw_0 = c_chain_crit(0, parseInt(document.getElementById("chain_crit_0").value));
	var chain_crit_ele_0 = c_chain_crit(1, parseInt(document.getElementById("chain_crit_0").value));
	var adrenaline_rush_0 = parseFloat(document.getElementById("adrenaline_rush_0").value);
	
	var total_element_0 = c_element_sharpness(sharpness_0)*(c_element_attack(element_1_0, element_1_attack_0) + c_element_attack(element_2_0, element_2_attack_0) + chain_crit_ele_0);
	var total_affinity_0 = base_affinity_0 + critical_eye_0 + maximum_might_0 + weakness_exploit_0;
	switch(agitator_0){
		case 1: base_attack_0 +=  4; total_affinity_0 +=  3; break;
		case 2: base_attack_0 +=  8; total_affinity_0 +=  5; break;
		case 3: base_attack_0 += 12; total_affinity_0 +=  7; break;
		case 4: base_attack_0 += 16; total_affinity_0 += 10; break;
		case 5: base_attack_0 += 20; total_affinity_0 += 15; break;
	}
	if(total_affinity_0 > 100) total_affinity_0 = 100;
	if(total_affinity_0 < 0){
		critical_boost_0 = 0.75;
		critical_element_0 = 1;
	}
	var effective_element_0 = calcCrit(total_element_0, Math.abs(total_affinity_0)/100, critical_element_0);
	if(sharpness_0 == 0.00) sharpness_0 = 1.00;
	var total_multiplier_0 = sharpness_0*Math.max(normal_rapid_up_0, pierce_up_0, spread_up_0)*rapid_fire_up_0*offensive_guard_0*bludgeoner_0*dragonheart_0;
	var effective_raw_0 = calcDmg(base_attack_0 + peak_performance_0 + resentment_0 + resuscitate_0 + chain_crit_raw_0 + adrenaline_rush_0, attack_boost_0, agitator_0, total_affinity_0, critical_boost_0, total_multiplier_0);
	document.getElementById("effective_raw_0").value = Math.floor(effective_raw_0);
	document.getElementById("effective_element_0").value = Math.floor(effective_element_0);
	document.getElementById("effective_total_0").value = Math.floor(effective_raw_0+effective_element_0);
}

window.onload = function(){
	document.getElementById("base_attack_0").value = 300;
	document.getElementById("base_affinity_0").value = 0;
	document.getElementById("sharpness_0").selectedIndex = 0;
	document.getElementById("element_1_0").value = 0;
	document.getElementById("element_2_0").value = 0;
	document.getElementById("element_1_attack_0").selectedIndex = 0;
	document.getElementById("element_2_attack_0").selectedIndex = 0;
	
	document.getElementById("attack_boost_0").selectedIndex = 0;
	document.getElementById("agitator_0").selectedIndex = 0;
	document.getElementById("peak_performance_0").selectedIndex = 0;
	document.getElementById("resentment_0").selectedIndex = 0;
	document.getElementById("resuscitate_0").selectedIndex = 0;
	
	document.getElementById("critical_eye_0").selectedIndex = 0;
	document.getElementById("critical_boost_0").selectedIndex = 0;
	document.getElementById("weakness_exploit_0").selectedIndex = 0;
	document.getElementById("maximum_might_0").selectedIndex = 0;
	document.getElementById("critical_element_0").selectedIndex = 0;
	
	document.getElementById("normal_rapid_up_0").selectedIndex = 0;
	document.getElementById("pierce_up_0").selectedIndex = 0;
	document.getElementById("spread_up_0").selectedIndex = 0;
	document.getElementById("rapid_fire_up_0").selectedIndex = 0;
	document.getElementById("offensive_guard_0").selectedIndex = 0;
	
	document.getElementById("bludgeoner_0").selectedIndex = 0;
	document.getElementById("dragonheart_0").selectedIndex = 0;
	document.getElementById("chain_crit_0").selectedIndex = 0;
	document.getElementById("adrenaline_rush_0").selectedIndex = 0;
	
	document.getElementById("effective_raw_0").value = 300;
	document.getElementById("effective_element_0").value = 0;
	document.getElementById("effective_total_0").value = 300;
}
