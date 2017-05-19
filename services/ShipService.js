app.service('ShipService', function(UtilService, InventoryService){

    var self = this;

    this.minDistance = 1;
    this.maxDistance = 5;
    this.speed = InventoryService.myShip.hyperdrive.fullEffectiveness;

    this.getSpeed = function () {
        return speed;
    };

    this.getDistance = function () {

        var distance = UtilService.random(self.minDistance*self.speed,self.maxDistance*self.speed);
        return distance;

    };

});