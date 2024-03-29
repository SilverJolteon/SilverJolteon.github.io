function c_element_sharpness(lvl){
	switch(lvl){
		case 0.00: return 1.00;
		case 0.50: return 0.25;
		case 0.75: return 0.50;
		case 1.00: return 0.75;
		case 1.05: return 1.00;
		case 1.20: return 1.0625;
		case 1.32: return 1.125;
		case 1.39: return 1.20;
	}
}

function calcCrit(base, aff, boost){
	if(boost == 1.00) return base;
	return (aff * boost * base) + ((1 - aff) * base);
}

function calcDmg(base, aff, critical, modifier){
	var dmg = modifier * base;
	if(aff == 0) return dmg;
	return calcCrit(dmg, Math.abs(aff)/100, critical);
}

function calculate(){
	var base_attack_0 = parseInt(document.getElementById("base_attack_0").value);
	var base_affinity_0 = parseInt(document.getElementById("base_affinity_0").value);
	var sharpness_0 = parseFloat(document.getElementById("sharpness_0").value);
	var element_1_0 = parseInt(document.getElementById("element_1_0").value);
	var element_2_0 = parseInt(document.getElementById("element_2_0").value);
	var element_1_attack_0 = parseInt(document.getElementById("element_1_attack_0").value);
	var element_2_attack_0 = parseInt(document.getElementById("element_2_attack_0").value);
	
	var attack_up_0 = parseInt(document.getElementById("attack_up_0").value);
	var challenger_0 = parseInt(document.getElementById("challenger_0").value);
	var element_atk_up_0 = parseInt(document.getElementById("element_atk_up_0").value);
	var elemental_crit_0 = parseFloat(document.getElementById("elemental_crit_0").value);
	
	var critical_boost_0 = parseFloat(document.getElementById("critical_boost_0").value);
	var critical_eye_0 = parseInt(document.getElementById("critical_eye_0").value);
	var repeat_offender_0 = parseInt(document.getElementById("repeat_offender_0").value);
	var weakness_exploit_0 = parseInt(document.getElementById("weakness_exploit_0").value);
	
	var normal_rapid_up_0 = parseFloat(document.getElementById("normal_rapid_up_0").value);
	var pierce_pierce_up_0 = parseFloat(document.getElementById("pierce_pierce_up_0").value);
	var pellet_spread_up_0 = parseFloat(document.getElementById("pellet_spread_up_0").value);
	
	var effective_element_0 = c_element_sharpness(sharpness_0)*(element_1_0 + element_2_0 + element_1_attack_0 + element_2_attack_0 + element_atk_up_0)*elemental_crit_0;
	var total_affinity_0 = base_affinity_0 + critical_eye_0 + +repeat_offender_0 + weakness_exploit_0;

	switch(challenger_0){
		case 1: base_attack_0 +=  10; total_affinity_0 +=  10; break;
		case 2: base_attack_0 +=  25; total_affinity_0 +=  20; break;
	}
	var critical_0 = critical_boost_0;
	if(total_affinity_0 > 100) total_affinity_0 = 100;
	if(total_affinity_0 < 0){
		critical_0 = 0.75;
	}

	if(sharpness_0 == 0.00) sharpness_0 = 1.00;
	var total_multiplier_0 = sharpness_0*Math.max(normal_rapid_up_0, pierce_pierce_up_0, pellet_spread_up_0);
	var effective_raw_0 = calcDmg(base_attack_0 + attack_up_0, total_affinity_0, critical_0, total_multiplier_0);
	document.getElementById("effective_raw_0").value = Math.floor(+effective_raw_0.toFixed(2));
	document.getElementById("effective_element_0").value = Math.floor(+effective_element_0.toFixed(2));
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

	document.getElementById("attack_up_0").selectedIndex = 0;
	document.getElementById("challenger_0").selectedIndex = 0;
	document.getElementById("element_atk_up_0").selectedIndex = 0;
	document.getElementById("elemental_crit_0").selectedIndex = 0;
	
	document.getElementById("critical_boost_0").selectedIndex = 0;
	document.getElementById("critical_eye_0").selectedIndex = 0;
	document.getElementById("repeat_offender_0").selectedIndex = 0;
	document.getElementById("weakness_exploit_0").selectedIndex = 0;
	
	document.getElementById("normal_rapid_up_0").selectedIndex = 0;
	document.getElementById("pierce_pierce_up_0").selectedIndex = 0;
	document.getElementById("pellet_spread_up_0").selectedIndex = 0;	
	
	
	document.getElementById("effective_raw_0").value = 300;
	document.getElementById("effective_element_0").value = 0;
	document.getElementById("effective_total_0").value = 300;
}
