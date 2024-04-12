function GS_init(){
	data = GS_data;
	document.getElementById("navbar-title").innerHTML = "Great Sword Database";
	var header = document.getElementById("unique-header");
	header.innerHTML = "";
	header.style.display = "none";
	document.getElementById("para_filter").style.display = "none";
}

function GS_terminate(){
	document.getElementById("para_filter").style.display = "";
}