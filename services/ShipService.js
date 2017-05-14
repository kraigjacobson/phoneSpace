app.service('ShipService', function(UtilService, DataService){

    var self = this;

    this.minDistance = 1;
    this.maxDistance = 5;
    this.speed = DataService.stats.speed;

    this.getSpeed = function () {
        return speed;
    };

    this.getDistance = function () {

        var distance = UtilService.random(self.minDistance*self.speed,self.maxDistance*self.speed);
        return distance;

    };

});