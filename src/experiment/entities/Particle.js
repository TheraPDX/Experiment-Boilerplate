define(['entities/Vector'], function(Vector) {
    var Particle = function(x, y) {
        this.position = new Vector(x, y);
        this.velocity = new Vector();
        this.acceleration = new Vector();
        this.mass = 10;

        this.size = Math.random() > 0.5 ? 2 : 3;

        this.fillStyle = "#fff";

        this.opacity = 0;
    };

    Particle.prototype = {
        applyForce: function(force) {
            this.acceleration.add(force.divide(this.mass));
        },

        update: function(context) {
            this.velocity.add(this.acceleration);
            this.position.add(this.velocity);
            this.draw(context);

            this.acceleration.multiply(0);
        },

        draw: function(context) {
            context.fillStyle = this.fillStyle;
            // context.moveTo(this.position.x, this.position.y);
            // context.arc(this.position.x, this.position.y, 1, 0, 2 * Math.PI, true);
            // context.fill();
            context.fillRect(this.position.x, this.position.y, this.size, this.size);
        }
    };

    return Particle;
});