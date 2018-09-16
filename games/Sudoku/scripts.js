const 
 H = 9,
 W = 9, 
 EVENT_PROC_DELAY = 50;

var arr, collision,
 gameFi = document.getElementById("game"),
 pointsFi = document.getElementById("points"),
 eventLastProcSelect = 0,
 eventLastProcSet = 0,
 coords = {
	y: 0,
	x: 0,
	b_y: 0,
	b_x: 0,
	in_sector: false
};

function init() {
	//switch to another block
	document.getElementById("loading").style.visibility = "hidden";
	pointsFi.style.visibility = "visible";
	gameFi.style.visibility = "visible";
	gameFi.classList.add("transition");
	gameFi.style.opacity = "1";
	
	//build grid with 16 blocks
	var block = document.createElement("div");
	block.className="block";
	for( let i=0; i<H; i++ ) 
		for( let j=0; j<W; j++ ) {
		var clone=block.cloneNode();
		gameFi.appendChild(clone);
		if(!(i%3))
			clone.style.borderTop= "5px solid #A0A0A0";
		if(!(j%3))
			clone.style.borderLeft= "5px solid #A0A0A0";
	}
	
	//game init
	collision = [];
	arr = [H];
	for( let i=0; i<H; i++ ) {
		arr[i] = [W];
		arr[i].fill(0);
	}
	document.addEventListener("mouseover", getCoords);
	addEventListener("keydown", gameFrame);
}

function drawArr() {
	var block = gameFi.firstElementChild;
	
	for(let i=0; i<H; i++)
		for(let j=0; j<W; j++) {
			if (arr[i][j]) {
				block.innerHTML=arr[i][j];
				block.style.color=getColor(arr[i][j]);
			}
				else  block.innerHTML="<br>";
			block = block.nextElementSibling;
		}
}

function randInt(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1);
    rand = Math.round(rand);
    return rand;
}

function getCoords(e) {
	if (e.target.className=="block") {
		// if the last event processing was more than 50 msec ago
		if (Date.now() - eventLastProcSelect > EVENT_PROC_DELAY) {
			var id=[].indexOf.call(gameFi.children, e.target);
			coords.y=Math.ceil((id+1)/9)-1;
			coords.x=id%9;
			//start coords of 3x3 block
			coords.b_y=(Math.ceil((coords.y+1)/3)-1)*3;
			coords.b_x=(Math.ceil((coords.x+1)/3)-1)*3;
			coords.in_sector = true;
			eventLastProcSelect = Date.now();
		}
	} else coords.in_sector = false;
	console.log("y:%d, x:%d, block_y:%d, block_x:%d, in sector: ",coords.y,coords.x, coords.b_y, coords.b_x, coords.in_sector);
}

function gameFrame(e) {
	if (coords.in_sector) 
		if (e.key>=0 && e.key<=9) {
			arr[coords.y][coords.x]=e.key;
			//console.log("pressed "+ e.key);
			let cd, i, j;
			for (i=0; i<H-3; i++) {
				if (arr[i][coords.x]===arr[coords.y][coords.x]) {
					cd = [i,coords.x];
					collision.push(cd);
				}
				if (arr[coord.y][i]===arr[coords.y][coords.x]) {
					cd = [coords.y, i];
					collision.push(cd);
				}
			}
			for (i=coord.b_y; i<coord.b_y+3; i++)
				for (j=coord.b_x; j<coord.bx+3; j++)
					if (arr[coord.y][coord.y]===arr[i][j]) {
						cd = [i, j];
						collision.push(cd);
					}
			//todo
		}
}

//#FF7464
//#BECEFF

//main func
window.onload = function() {
	init();
}