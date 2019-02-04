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

  get(t) {
    const {x1, y1, cx1, cy1, cx2, cy2, x2, y2} = this.getEffectiveBezierValues();
    const pomaxBezier = new Bezier(x1, y1, cx1, cy1, cx2, cy2, x2, y2);
    return pomaxBezier.get(t);
  }

  derivative(t) {
    const {x1, y1, cx1, cy1, cx2, cy2, x2, y2} = this.getEffectiveBezierValues();
    const pomaxBezier = new Bezier(x1, y1, cx1, cy1, cx2, cy2, x2, y2);
    return pomaxBezier.derivative(t);
  }

  getEffectiveBezierValues() {
    let t = mousePosition.x / window.innerWidth * Math.PI * 2;
    let radius = 100;
    let cx1 = radius * Math.cos(t + this.offset);
    let cy1 = radius * Math.sin(t + this.offset);

    return {
      x1: this.x1,
      y1: this.y1,
      cx1: cx1,
      cy1: cy1,
      cx2: this.cx2 + mousePosition.x / 10,
      cy2: this.cy2 + mousePosition.y / 10,
      x2: this.x2,
      y2: this.y2
    };
  }

  draw(ctx) {
    const values = this.getEffectiveBezierValues();

    ctx.beginPath();
    ctx.moveTo(
      values.x1,
      values.y1
    );

    ctx.bezierCurveTo(
      values.cx1,
      values.cy1,
      values.cx2,
      values.cy2,
      values.x2,
      values.y2
    );
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(values.cx1, values.cy1, 2, 2, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(values.cx2, values.cy2, 2, 2, 0, 0, Math.PI * 2);
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

var animationProgress = {
  bezierIndex: 0,
  t: 0
}

function draw() {
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fill();

  ctx.save()
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.strokeStyle = 'rgba(50, 50, 200, 1)';
  curves.forEach((curve) => curve.draw(ctx));

  // Draw circle moing around bezier
  const currentBezier = curves[animationProgress.bezierIndex];
  const point = currentBezier.get(animationProgress.t);
  ctx.beginPath();
  ctx.fillStyle = 'red';
  ctx.rect(point.x, point.y, 10, 10);
  ctx.fill();


  ctx.restore();


  // Advance progress of animation thingey
  animationProgress.t += 0.01;
  if (animationProgress.t > 1) {
    animationProgress.bezierIndex = (animationProgress.bezierIndex + 1) % 4;
    animationProgress.t = 0;
  }



  requestAnimationFrame(draw)
}

requestAnimationFrame(draw);