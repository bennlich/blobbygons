let canvas = document.getElementById('my-canvas');
let ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var mousePosition = { x: 0, y: 0 }


class BezierCurve {

  constructor(x1, y1, x2, y2, cx1, cy1, cx2, cy2, offset) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.cx1 = cx1;
    this.cy1 = cy1;
    this.cx2 = cx2;
    this.cy2 = cy2;
    this.offset = offset;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.moveTo(
      this.x1,
      this.y1
    );

    let t = mousePosition.x / window.innerWidth * Math.PI * 2;
    let radius = 100;
    let cx1 = radius * Math.cos(t + this.offset);
    let cy1 = radius * Math.sin(t + this.offset);
    ctx.bezierCurveTo(
      cx1,
      cy1,
      this.cx2 + mousePosition.x / 10,
      this.cy2 + mousePosition.y / 10,
      this.x2,
      this.y2
    );
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(cx1, cy1, 2, 2, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(this.cx2, this.cy2, 2, 2, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

}

let curves = [
  new BezierCurve(0, 100, 100, 0, 100, 100, 100, 100, Math.PI / 4),
  new BezierCurve(100, 0, 0, -100, 100, -100, 100, -100, Math.PI / 2),
  new BezierCurve(0, 100, -100, 0, -100, 100, -100, 100, 3 * Math.PI / 4),
  new BezierCurve(-100, 0, 0, -100, -100, -100, -100, -100, 0)
];


canvas.addEventListener('mousemove', (e) => {
  mousePosition = { x: e.clientX, y: e.clientY }
})

function draw() {
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fill();

  ctx.save()
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.strokeStyle = 'rgba(50, 50, 200, 1)';
  curves.forEach((curve) => curve.draw(ctx));
  ctx.restore();

  requestAnimationFrame(draw)
}

requestAnimationFrame(draw);