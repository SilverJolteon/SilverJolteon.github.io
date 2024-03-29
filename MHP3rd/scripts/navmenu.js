function openSidenav(){
	document.getElementById("sidenav").style.width = "100vw";
}

function closeSidenav(){
	document.getElementById("sidenav").style.width = "0";
}

function displayNavmenu(page){
	var navbar = document.getElementById("navbar");
	navbar.innerHTML = `
		<button type="button" onClick="openSidenav()">
			<svg width="24" height="24">
				<path fill="currentColor" d="M4 18h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zm0-5h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zM3 7c0 .55.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1z"></path>
			</svg>
		</button>
	`;
	
	var sidenav = document.getElementById("sidenav");
	sidenav.innerHTML = `
		<span onClick="closeSidenav()">&times;</span>
		<img class="logo" src="assets/logo.png">
	`;
	if(page != "damage-calculator") sidenav.innerHTML += `<a href="damage-calculator.html">Damage Calculator</a>`;
	else navbar.innerHTML += `<span>Damage Calculator</span>`;

	if(page != "database") sidenav.innerHTML += `<a href="database.html">Weapon Database</a>`;
	
	if(page != "charm-search") sidenav.innerHTML += `<a href="charm-search.html">Charm Table Search</a>`;
	else navbar.innerHTML += `<span>Charm Table Search</span>`;
	
	if(page != "kelbi-horn") sidenav.innerHTML += `<a href="kelbi-horn.html">Kelbi Horn Reward Tables</a>`;
	else navbar.innerHTML += `<span>Kelbi Horn Reward Tables</span>`;
	
	if(page == "database"){
		sidenav.innerHTML += `
			</br>
			<a href="javascript:void(0)" onClick="changeWeapon('HH')">Hunting Horn Database</a>
			<a href="javascript:void(0)" onClick="changeWeapon('SA')">Switch Axe Database</a>
		`;
		navbar.innerHTML += `<span id="navbar-title">Damage Calculator</span>`;
	}
	document.getElementById("footer").innerHTML = `
		<div class="footer"><a href="https://twitter.com/SilverJolteon">© SilverJolteon</a></div>
	`;
	
}