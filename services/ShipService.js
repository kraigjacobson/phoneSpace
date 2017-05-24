app.service('ShipService', function(UtilService, InventoryService, DataService){

    var self = this;

    this.minDistance = 1;
    this.maxDistance = 5;
    this.speed = InventoryService.myShip.hyperdrive.fullEffectiveness;

    this.getSpeed = function () {
        return speed;
    };

    this.getDistance = function () {

        var distance = UtilService.random(self.minDistance*self.speed,self.maxDistance*self.speed);
        UtilService.getExperience(Math.floor(distance/5));
        return distance;

    };

});