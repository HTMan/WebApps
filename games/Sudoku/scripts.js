const 
 H = 9,
 W = 9, 
 EVENT_PROC_DELAY = 100;

var arr, collision, 
 count_filled_cells=0, 
 max_arr_size=H*W,
 gameFi = document.getElementById("game"),
 pointsFi = document.getElementById("points"),
 eventLastProcSelect = 0,
 eventLastProcCheck = 0,
 coords = {
	y: 0,
	x: 0,
	b_y: 0,
	b_x: 0,
	in_sector: false,
	need_upd: true,
	target_block: 0
};

function init() {
	//switch to another block
	document.getElementById("loading").style.display = "none";
	pointsFi.style.visibility = "visible";
	gameFi.style.visibility = "visible";
	gameFi.classList.add("transition");
	gameFi.style.opacity = "1";
	
	//build grid with 16 blocks
	var block = document.createElement("div");
	//block.className="block";
	for( let i=0; i<H; i++ ) 
		for( let j=0; j<W; j++ ) {
		var clone=block.cloneNode();
		gameFi.appendChild(clone);
		if(!(i%3))
			clone.classList.add("brd-t");
		if(!(j%3))
			clone.classList.add("brd-l");
	}
	
	//game init
	collision = new Map();
	arr = [H];
	for( let i=0; i<H; i++ ) {
		arr[i] = [W];
		arr[i].fill(0);
	}
	addEventListener("mouseover", detSector);
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

function detSector(e) {
	if (Date.now() - eventLastProcSelect > EVENT_PROC_DELAY) {
		if (e.target.parentNode.id=="game") {
			// if the last event processing was more than 50 msec ago
				coords.need_upd=true;
				coords.target_block= e.target;
				coords.in_sector = true;
		} else coords.in_sector = false;
		eventLastProcSelect = Date.now();
	}
}

function updCoords() {
	coords.need_upd=false;
	var id=[].indexOf.call(gameFi.children, coords.target_block);
	coords.y=Math.ceil((id+1)/H)-1;
	coords.x=id%W;
	//start coords of 3x3 block
	coords.b_y=(Math.ceil((coords.y+1)/3)-1)*3;
	coords.b_x=(Math.ceil((coords.x+1)/3)-1)*3;
	console.log("y:%d, x:%d, block_y:%d, block_x:%d",coords.y,coords.x, coords.b_y, coords.b_x);
}

function gameFinish() {
	
}

function gameFrame(e) {
	if (Date.now() - eventLastProcCheck > EVENT_PROC_DELAY) {
		if (coords.in_sector && e.key>=0 && e.key<=9) {
			console.log("pressed "+ e.key);
			if (coords.need_upd) updCoords();
			if (e.key) {
				
			} 
			else if (arr[coords.y][coords.x]) {
				arr[coords.y][coords.x]=0;
				count_filled_cells--;
			}
			if (count_filled_cells===max_arr_size && !collision.size) 
				gameFinish();
		}
		eventLastProcCheck = Date.now();
	}
}

//#FF7464
//#BECEFF

//main func
window.onload = init();