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

    this.investigate = function () {


        $state.go('log').then(function () {

            var roll = UtilService.random(1,20);

            if (roll <= 3) {
                $rootScope.$broadcast('getLog', { log: "It's a trap! You are ambushed by " + "addBadGuysHere" + "." });
            } else if (roll <= 20) {
                var credits = UtilService.gainCredits(1,5);
                var item = UtilService.generateItem();
                DataService.inventory.unshift(item);
                $rootScope.$broadcast('getLog', { log: "You manage to find " + credits + " credits and a " + item.slug + " ." });
            } else if (roll <= 21) {
                var credits = UtilService.gainCredits(1,5);
                $rootScope.$broadcast('getLog', { log: "You manage to find " + credits + " credits." });
            } else if (roll <= 21) {
                var item = UtilService.generateItem();
                DataService.inventory.unshift(item);
                $rootScope.$broadcast('getLog', { log: "You manage to find a " + item.slug + "." });
            } else {
                $rootScope.$broadcast('getLog', { log: "You don't find anything interesting." });
            }

        });

        $rootScope.investigated = true;

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