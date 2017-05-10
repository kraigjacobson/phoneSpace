app.service('PlayerService', function($rootScope, ShipService, UniverseService, DataService){

    var self = this;

    this.travel = function () {

        var distance = ShipService.getDistance();
        DataService.stats.distanceLeft -= distance;
        DataService.stats.distanceTraveled += distance;
        $rootScope.$broadcast('getLog', { log: "You have traveled " + distance + " light years." });
        event = UniverseService.event();

    };

    this.updateStat = function (stat, amt) {

        stat[stat] += amt;

    };

});