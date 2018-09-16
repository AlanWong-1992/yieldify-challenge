var canvas = document.querySelector('canvas');
canvas.width = 800;
canvas.height = 600;

var c = canvas.getContext('2d');
var mouse = {
  x: undefined,
  y: undefined
}

window.addEventListener('mousemove', (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
})

class Canon {
  constructor(context, color, dlt, x, y, angle, length) {
    this.c = context;
    this.color = color;
    this.dlt = -1;
    this.x1 = x;
    this.y1 = y;
    this.x2 = undefined;
    this.y2 = undefined;
    this.angle = angle;
    this.length = length;

    this.draw = () => {
      c.beginPath();
      c.arc(this.x1, this.y1, 45, 0, Math.PI * 2, false);
      c.fillStyle = this.color;
      c.fill();
      c.lineWidth = '2';
      c.stroke();

      c.beginPath();
      c.moveTo(this.x1, this.y1);
      c.lineTo(this.x2, this.y2);
      c.lineWidth = 10;
      c.stroke();
    };

    this.update = () => {

      var updateAngle = () => {
        var dx = mouse.x - 0;
        var dy = canvas.height - mouse.y;
        var radianAngle = Math.atan2(dy, dx);
        var degreeAngle = radianAngle * (180/Math.PI) * -1;

        return degreeAngle;
      };

      this.angle = updateAngle();

      // Calculates new x2 and y2 co-ords for the Canon Gun
      var lineToAngle = (c, x1, y1, length, angle) => {

          angle *= Math.PI / 180;

          var x2 = x1 + length * Math.cos(angle),
              y2 = y1 + length * Math.sin(angle);

          return {x2, y2};
      };

      // Calls above function to get updated x2, y2 co-ords
      var updatedXY = lineToAngle(this.c, this.x1, this.y1, this.length, this.angle)
      this.x2 = updatedXY.x2
      this.y2 = updatedXY.y2

      // Updating angle of rectangle
      this.angle += this.dlt;
      if (this.angle < -85 || this.angle > -10) this.dlt = -this.dlt;

      this.draw();
    };
  }
  //
  // fire = () => {
  //   var pro = {
	// 			x: this.x1,
	// 			y: this.y2,
	// 			r: 15,
	// 			v: 20,
	// 			theta: 45
	// 			};
  // }
}

let canon = new Canon(c, 'Lavender', -1, 0, canvas.height, -10, 80);

var pro = {
    x: 0,
    y: canvas.height,
    r: 2,
    v: 25,
    theta: 45
    };

var frameCount = 0;
var v0x = pro.v * Math.cos(pro.theta * Math.PI/180);
var v0y = pro.v * Math.sin(pro.theta * Math.PI/180);
var startX = pro.x;
var startY = pro.y;
var g = 1.2;

var animate = () => {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, innerWidth, innerHeight);

  canon.update();

  if(-pro.y<=canvas.height - pro.r && pro.x <= canvas.width - pro.r)
  	{
  		pro.y = startY - ( v0y * frameCount - (1/2 * g * Math.pow(frameCount,2)) );
  		pro.x = startX + v0x * frameCount;
  	}

  console.log('canvas width', canvas.width);
  console.log('x', pro.x);
  console.log('y', pro.y);

  c.save();
  c.beginPath();
	c.fillStyle = "rgba(0, 200, 0, 0.6)";
	c.arc(pro.x ,pro.y ,pro.r , 0, Math.PI*2, true);
	c.fill();
	c.stroke();
	c.closePath();
  c.restore();
  frameCount+=0.8;

}

animate();
