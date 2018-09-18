var canvas = document.querySelector('canvas');
canvas.width = 800;
canvas.height = 400;

var c = canvas.getContext('2d');
var mouse = {
  x: undefined,
  y: undefined
}

window.addEventListener('mousemove', (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
})

window.addEventListener('click', () => {
  canon.fire();
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
    this.canonBall = undefined;

    this.draw = () => {
      c.beginPath();
      c.arc(this.x1, this.y1, 45, 0, Math.PI * 2, false);
      c.fillStyle = this.color;
      c.fill();
      c.stroke();

      c.beginPath();
      c.moveTo(this.x1, this.y1);
      c.lineTo(this.x2, this.y2);
      c.lineWidth = 10;
      c.stroke();
      c.closePath();
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

      if (typeof this.canonBall === 'object') {
        this.canonBall.update();
      }
    };
  }

  fire() {
    this.canonBall = new Canonball(this.x2, this.y2, 5, 20, this.angle, 1, 0.85, 0.3);
  }
}

class Canonball {
  constructor(x, y, radius, velocity, angle, time, elasticity, friction) {
    this.x = 0;
    this.y = canvas.height - 100;
    this.startX = x;
    this.startY = y;
    this.radius = radius;
    this.velocity = 40,
    this.radians= (angle * - 1) * Math.PI/180,
    this.gravity = 2.9;
    this.v0x = this.velocity * Math.cos(this.radians);
    this.v0y = this.velocity * Math.sin(this.radians);
    this.time = time;
    this.elasticity = elasticity;
    this.friction = friction;

    this.draw = () => {
      c.save();
      c.beginPath();
    	c.fillStyle = "rgba(0, 200, 0, 0.6)";
    	c.arc(this.x ,this.y ,this.radius , 0, Math.PI*2, true);
    	c.fill();
    	c.stroke();
    	c.closePath();
      c.restore();
    };

    this.update = () => {

      if (this.y + this.radius < canvas.height) {

          // Calculations for the position of x and y based on formula for projectile motion
      		this.y = this.startY - (this.v0y * this.time - (1/2 * this.gravity * Math.pow(this.time,2)));
      		this.x = this.startX + this.v0x * this.time;

          // detection of ball hitting floor on y-axis
          if (this.y + this.radius > canvas.height) {

            // Reset the startX and startY so that it can be used again in the formula-
            // for projectile motion, but now starting where the ball landed.
            this.startX = this.x;
            this.startY = canvas.height;

            // Reset time to t0 so that velocity calculations are back to V0
            this.time = time;

            // Reset y position to be above the floor otherwise above if clause would
            // be false
            this.y = canvas.height - this.radius - 1;

            // v0y needs to be reduced as next bounce will be lower
            this.v0y *= this.elasticity;

            // v0x needs to be adjusted everytime floor is hit as there is friction
            // if v0x is less than 0 then stop the movement of the ball along x-axis
            this.v0x > 0 ? this.v0x -= this.friction : this.v0x = 0;

          }
      }

      this.time+=0.5;

      this.draw();
    };
  }
}

let canon = new Canon(c, 'Lavender', -1, 0, canvas.height, -10, 80);

var animate = () => {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);

  canon.update();

}

animate();
