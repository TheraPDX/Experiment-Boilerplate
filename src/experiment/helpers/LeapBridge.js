define(['Leap'], function(Leap) {
    var LeapBridge = function(fingersNumber, x, y, fingerRadius) {

        this.isLeap = false;
        this.FINGER_RADIUS = fingerRadius || 10;
        this.fingersNumber = fingersNumber || 10;
        x = x || 1;
        y = y || 1;

        this.fingers = [];
        for(var i = 0; i < this.fingersNumber; i++) {
            this.fingers[i] = {
                x: x,
                y: y,
                z: x / y,
                ox: x,
                oy: y,
                oz: x / y
            };
        }

        // Leap detection
        var controller = new Leap.Controller();
        controller.on('connect', this.onLeapDeviceConnect.bind(this));
        controller.on('deviceDisconnected', this.onLeapDeviceDisconnect.bind(this));
        controller.connect();
    };
    LeapBridge.prototype =  {
        onLeapDeviceConnect: function() {
            console.log('[LeapBridge] onConnect');
            this.isLeap = true;
            Leap.loop(this.listen.bind(this));
        },

        onLeapDeviceDisconnect: function() {
            console.log('[LeapBridge] onLeapDeviceDisconnect');
            this.isLeap = false;
        },

        listen: function(event) {
            if(!this.isLeap) return;

            var finger, lastFinger, tipPosition;
            for(var i = 0; i < this.fingersNumber; i++) {
                finger = event.fingers[i];
                lastFinger = event.controller.lastFrame.fingers[i];

                // Writes up to 10 fingers to sketch.touches.
                if(finger && finger.valid) {
                    tipPosition = finger.stabilizedTipPosition;
                    this.fingers[i].x = tipPosition[0] - this.FINGER_RADIUS;
                    this.fingers[i].y = -(tipPosition[1] - this.FINGER_RADIUS); // Y axis is inverted
                    this.fingers[i].z = tipPosition[2] - this.FINGER_RADIUS;
                }
                // Uses Leap.Controller.lastFrame to also write old and delta coordinates.
                if(lastFinger && lastFinger.valid) {
                    this.fingers[i].ox = lastFinger.tipPosition[0];
                    this.fingers[i].oy = lastFinger.tipPosition[1];
                    this.fingers[i].oz = lastFinger.tipPosition[2];

                    // this.dx = this.ox - this.x;
                    // this.dy = this.oy - this.y;
                    // this.dz = this.oz - this.z;
                }
            }
        }
    };

    return LeapBridge;
});