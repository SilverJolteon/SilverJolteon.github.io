function SnS_init(){
	data = SnS_data;
	document.getElementById("navbar-title").innerHTML = "Sword & Shield Database";
	var header = document.getElementById("unique-header");
	header.innerHTML = "";
	header.style.display = "none";
	
	var filters = document.getElementById("filters-table");
	var filter_row = filters.insertRow();
	filter_row.innerHTML = `
		<td onClick="filterTable('Sleep')" style="color: #c0c0c0; height: 100%; width: auto;">Sleep</td>	
	`;
	filter_row.id = "filter_row";
}

function SnS_terminate(){
	var filter_row = document.getElementById("filter_row");
	filter_row.parentNode.removeChild(filter_row);
}