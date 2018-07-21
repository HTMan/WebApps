const 
 H = 4,
 W = 4, 
 BL_NUM = H*W,
 EVENT_PROC_DELAY = 50;

var arr=[],
 fullArr = 0,
 totalPoints = 0, 
 gameFi = document.getElementById("game"),
 pointsFi = document.getElementById("points"),
 eventLastProc = 0;

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
	for( var i=0; i<BL_NUM; i++ ) {
		var clone=block.cloneNode();
		gameFi.appendChild(clone);
	}
	
	//game init
	arr = new Array(H);
	for( var i=0; i<H; i++ ) {
		arr[i] = new Array(W);
		arr[i].fill(0);
	}
	randSpawn();
	randSpawn();
	drawArr();
	pointsFi.innerHTML="Use WASD or Arrows<br>to shift numbers<br>";
	addEventListener("keydown", gameFrame);
}

function finishGame() {
	removeEventListener("keydown",gameFrame);
	gameFi.style.opacity = "0.5";
	pointsFi.innerHTML=totalPoints+"<br>F5 - restart";
}

function getColor(num) {
	switch(num) {
		case 2: case 4: case 8: return "#000000";
		case 16: return "#990000";
		case 32: return "#cc3300";
		case 64: return "#ff471a";
		case 128: return "#ff8533";
		case 256: return "#ffcc00";
		case 512: return "#e6e600";
		case 1024: return "#ccff33";
		case 2048: return "#99ff33";
		case 4096: return "#66ff99";
		default: return "#33ccff";
	}
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
	pointsFi.innerHTML=totalPoints+"<br><br>";
}

function randInt(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1);
    rand = Math.round(rand);
    return rand;
}

function randSpawn() {
	var i, j, num=0;

	do {
		i=randInt(0,H-1),
		j=randInt(0,W-1);
			if(!arr[i][j]) {
				if ( randInt(0,1) ) num=2; 
					else num=4;
				arr[i][j]=num;
			}
	} while(!num);
}

//if return 1 - game over
function checkArr() {
	
	var collCounts=false;
	fullArr=1;
	for(let i=0; i<H; i++)
		for(let j=0; j<W; j++) 
			if (!arr[i][j]) {
				fullArr=0;
				return 0;
			} else 
			if ((j<W-1 && arr[i][j]===arr[i][j+1]) || (i<H-1 && arr[i][j]===arr[i+1][j]) ) 
				collCounts=true;
	if (collCounts)
	return 0;
	else return 1;
}

function procNum(i, j, y, x) {
	var 
	i2=i+y,
	j2=j+x;
	
	while(i2<H && j2<W && i2>=0 && j2>=0) {
		if (!arr[i2][j2]) {
			arr[i2][j2]=arr[i][j];
			arr[i][j]=0;
		} else
		if(arr[i][j]===arr[i2][j2]) {
			totalPoints+=(arr[i2][j2]<<=1);
			arr[i][j]=0;
			break;
		} else break;
		i=i2;
		j=j2;
		i2+=y;
		j2+=x;
	}
}

function moveNums(y, x) {
	var i,j;
	
	if(x+y===-1) {
		for(i=0; i<H; i++)
			for(j=0; j<W; j++) 
				if (arr[i][j]) procNum(i,j,y,x);
	} 
	else if(y) {
		for(i=H-1; i>=0; i--)
			for(j=0; j<W; j++) 
				if (arr[i][j]) procNum(i,j,y,x);
	} 
	else {
		for(i=0; i<H; i++)
			for(j=W-1; j>=0; j--) 
				if (arr[i][j]) procNum(i,j,y,x);
	}
}

function getCom(e) {
	var com={ det:true, x:0, y:0 };

	switch(e.key) {
		case "w": case "KeyW": case "ArrowUp": 
			com['y']=-1;
			break;
		case "a": case "KeyA": case "ArrowLeft": 
			com['x']=-1;
			break;
		case "s": case "KeyS": case "ArrowDown":
			com['y']=1;
			break;
		case "d": case "KeyD": case "ArrowRight":
			com['x']=1;
			break;
		default:
			com["det"]=false;
	}
	return com;
}

function gameFrame(e) {
	// if the last event processing was more than 50 msec ago
	if (Date.now() - eventLastProc > EVENT_PROC_DELAY) {
		var com=getCom(e);
		if (com["det"]) {
			moveNums(com['y'], com['x']);
			if(!fullArr) randSpawn();
			drawArr();
			if (checkArr())
				finishGame();
		}
		eventLastProc = Date.now();
	}
}

//main func
window.onload = function() {
	init();
}