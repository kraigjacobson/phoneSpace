app.service('PlayerService', function($rootScope, $state, ShipService, UniverseService, DataService){

    var self = this;

    this.travel = function () {

        $state.go('log').then(function () {

            var distance = ShipService.getDistance();
            DataService.stats.distanceLeft -= distance;
            DataService.stats.distanceTraveled += distance;
            $rootScope.$broadcast('getLog', { log: "You have traveled " + distance + " light years." });
            event = UniverseService.event();

        });

    };

});