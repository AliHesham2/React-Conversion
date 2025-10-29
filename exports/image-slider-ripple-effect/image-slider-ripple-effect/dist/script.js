// https://dribbble.com/shots/6887888-Sports-clothing-and-fashion-online-store
// https://codepen.io/osublake/pen/WQyBJb

let width;
let height;
const setA = (ele, settings)=>{
  const el = document.getElementById(ele)
  if(!el) return
  Object.entries(settings).forEach(([key,val])=>{
    el.setAttribute(key, val)
  })
}
const onResize = () => {
  const { innerWidth, innerHeight } = window;
  width = innerWidth;
  height = innerHeight;
  setA("fimg-a", { x: width / 2, y: height / 2 });
  setA("fimg-b", { x: width / 2, y: height / 2 });
};

onResize();
window.addEventListener("resize", onResize);

TimelineLite.prototype.wait = function(position) {
  return this.set({}, {}, position);
};

var xlink = "http://www.w3.org/1999/xlink";
var imgUrl = "https://i.imgur.com/nQPodHo.png";
var feImage = document.querySelector("feImage");

let images = [
  "https://images.unsplash.com/photo-1483721310020-03333e577078?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1522898467493-49726bf28798?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  "https://images.unsplash.com/photo-1521804906057-1df8fdb718b7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
  "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1349&q=80",
];

const setNextLoop = slides => {
  const [a, b] = slides;
  const [first, ...rest] = images;
  images = [...rest, first];
  setA(`logo-image-${a}`, { "xlink:href": first });
  setA(`logo-overlay-${a}`, { "xlink:href": first });
  loop([b, a]);
};
const loop = slides => {
  const tl = new TimelineMax({ onComplete: () => setNextLoop(slides) });

  tl.set("#fimg-a", {
    attr: { x: width / 2, y: height / 2, width: "0", height: "0" }
  })
    .set("#fimg-b", {
      attr: { x: width / 2, y: height / 2, width: "0", height: "0" }
    })
    .from("#displacement-map-a", 2, { attr: { scale: 1000 } }, 0)
    .from("#displacement-map-b", 2, { attr: { scale: 1000 } }, 0)
    .to(`#slide-${slides[0]}`, 3, { opacity: 0 }, 0)
    .to(`#slide-${slides[1]}`, 3, { opacity: 1 }, 0)
    .to(`#title-${slides[0]}`, 1, { y: -100, opacity: 0 }, 0)
    .from(`#title-${slides[1]}`, 1, { y: 100, opacity: 0 }, 0.5)
    .to(
      "#fimg-a",
      2,
      {
        attr: {
          x: -width / 2,
          y: -height / 2,
          width: "200%",
          height: "200%"
        }
      },
      0
    )
    .to(
      "#fimg-b",
      2,
      {
        attr: {
          x: -width / 2,
          y: -height / 2,
          width: "200%",
          height: "200%"
        }
      },
      0
    )
    .set(`#slide-${slides[0]}`, { zIndex: 3 }, 3)
    .set(`#slide-${slides[1]}`, { zIndex: 5 }, 3)
    .set(`#title-${slides[0]}`, { y: 0, opacity: 1 }, 3);
};

toBase64(imgUrl, function(data) {
  feImage.setAttributeNS(xlink, "xlink:href", data);
  loop(["a", "b"]);
});

function toBase64(url, callback) {
  var img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = function() {
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    canvas.height = this.height;
    canvas.width = this.width;
    ctx.drawImage(this, 0, 0);

    var dataURL = canvas.toDataURL("image/png");
    callback(dataURL);
    canvas = null;
  };

  img.src = url;
}