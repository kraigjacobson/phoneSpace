app.service('ShipService', function(UtilService, InventoryService, DataService){

    var self = this;


    this.getDistance = function () {
        var minDistance = 0.25;
        var maxDistance = .5;
        var speed = DataService.stats.speed;
        var distance = UtilService.random(minDistance * speed, maxDistance * speed);
        UtilService.getExperience(Math.floor(distance/4));
        return distance;

    };

});