btn1 = document.querySelector("#btn1");
btn2 = document.querySelector("#btn2");
btn3 = document.querySelector("#btn3");
btn4 = document.querySelector("#btn4");
btns = document.querySelectorAll(".slideshow-controls button");

leftBtn = document.querySelector(".arrow-left");
rightBtn = document.querySelector(".arrow-right");

images = [...document.querySelectorAll(".image-box")];

backImages = document.querySelectorAll(".background-img");

slideContainer = document.querySelector(".slideshow-container");

let currentImgIndex = 0;

function changeFoto(id) {
	currentImgIndex = id;
	for (let i in images) {
		let pos = i - id;
		let percent = 0.4 * pos;
		let gap = 16 * pos;
		let end = pos < 0 ? -0.2 : pos > 0 ? 0.2 : 0;
		let wW = window.innerWidth;
		let oneDistance = wW * 0.4 + wW * 0.2 + 16;
		//images[i].style.left = wW * 0.5 + wW * percent + wW * end + gap + "px";
		images[i].style.left = wW * 0.5 + oneDistance * pos + "px";
		images[i].classList.remove("main");
		backImages[i].classList.remove("main");
		btns[i].classList.remove("main");
	}
	images[id].classList.add("main");
	backImages[id].classList.add("main");
	btns[id].classList.add("main");
}

btn1.addEventListener("click", (e) => changeFoto(0));
btn2.addEventListener("click", (e) => changeFoto(1));
btn3.addEventListener("click", (e) => changeFoto(2));
btn4.addEventListener("click", (e) => changeFoto(3));

leftBtn.addEventListener("click", (e) =>
	changeFoto(currentImgIndex - 1 < 0 ? 3 : currentImgIndex - 1)
);
rightBtn.addEventListener("click", (e) =>
	changeFoto((currentImgIndex + 1) % 4)
);

changeFoto(0);

function checkPosition(ele, lastPosition = null) {
	const rect = ele.getBoundingClientRect();
	const currentPosition = {
		x: rect.left + rect.width / 2,
		center: window.innerWidth / 2,
		range: window.innerWidth * 0.4 + window.innerWidth * 0.2 + 16
	};

	if (
		!lastPosition ||
		currentPosition.x !== lastPosition.x ||
		currentPosition.y !== lastPosition.y
	) {
		onElementMove(ele, currentPosition);
		lastPosition = currentPosition;
	}

	requestAnimationFrame(() => checkPosition(ele, lastPosition));
}

function onElementMove(element, p) {
	let size = 0;
	if (p.x < p.center) {
		let left = p.center - p.range;
		size = (p.x - left) / (p.center - left);
	} else {
		let right = p.center + p.range;
		size = (right - p.x) / (right - p.center);
	}
	size = Math.min(Math.max(size, 0), 1);
	element.style.width = 40 + 40 * size + "%";
	//element.style.scale = size
}

for (let i of images) {
	checkPosition(i); // Start tracking
}