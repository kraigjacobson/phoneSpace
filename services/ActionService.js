app.service('ActionService', function($rootScope, $state, ShipService, UniverseService, DataService, UtilService){

    var self = this;

    this.travel = function () {

        $state.go('log').then(function () {

            $rootScope.investigated = true;
            var distance = ShipService.getDistance();
            DataService.stats.distanceLeft -= distance;
            DataService.stats.distanceTraveled += distance;
            DataService.stats.daysTraveled ++;
            $rootScope.$broadcast('getLog', { log: "You have traveled " + distance + " light years." });
            event = UniverseService.event();

        });

    };

    this.attack = function () {

        $rootScope.$broadcast('getLog', { log: "You attack a badguy!" });

    };

    this.escape = function () {

        if (UtilService.random(1,2)===1) {
            $rootScope.$broadcast('getLog', { log: "You escape with your life!" });
            $rootScope.currentState = "nothing";

        } else {
            $rootScope.$broadcast('getLog', { log: "You fail to escape!" });
        }

    };

});