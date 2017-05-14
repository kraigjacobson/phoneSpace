app.service('ActionService', function($rootScope, $state, ShipService, UniverseService, DataService, UtilService){

    var self = this;

    this.travel = function () {
        // for testing inventory screen
        var item = UtilService.generateItem();
        DataService.inventory.unshift(item);

        $rootScope.starfield = true;

        $state.go('log').then(function () {

            start();
            $rootScope.starfield = false;
            $rootScope.investigated = true;
            var distance = ShipService.getDistance();
            DataService.stats.daysTraveled ++;
            if (DataService.stats.distanceLeft - distance >= 0) {
                DataService.stats.distanceLeft -= distance;
                DataService.stats.distanceTraveled += distance;
                $rootScope.$broadcast('getLog', { log: "You have traveled " + distance + " light years." });
                UniverseService.event();
            } else {
                DataService.stats.distanceTraveled = DataService.stats.totalDistance;
                $rootScope.$broadcast('getLog', { log: "You have traveled " + DataService.stats.distanceLeft + " light years." });
                DataService.stats.distanceLeft = 0;
                $rootScope.$broadcast('getLog', { log: "You have arrived at your destination! It took you " + DataService.stats.daysTraveled + " days!" });
            }

        });

    };

    this.investigate = function () {

        $state.go('log').then(function () {

            var roll = UtilService.random(6,7);

            if (roll <= 5) {
                $rootScope.currentState = "combat";
                UniverseService.combat();
            } else if (roll <= 7) {
                var credits = UtilService.gainCredits(1,5);
                var item = UtilService.generateItem();
                DataService.inventory.unshift(item);
                $rootScope.$broadcast('getLog', { log: "You manage to find " + credits + " credits and a " + item.name + "." });
            } else if (roll <= 9) {
                var credits = UtilService.gainCredits(1,5);
                $rootScope.$broadcast('getLog', { log: "You manage to find " + credits + " credits." });
            } else if (roll <= 11) {
                var item = UtilService.generateItem();
                DataService.inventory.unshift(item);
                $rootScope.$broadcast('getLog', { log: "You manage to find a " + item.name + "." });
            } else {
                $rootScope.$broadcast('getLog', { log: "You don't find anything interesting." });
            }

        });

        $rootScope.investigated = true;

    };

    this.attack = function () {

        var attackRoll = UtilService.random(1,20);
        if (attackRoll >= $rootScope.enemy.ship.maneuverability) {
            // hit
            var damageRoll = UtilService.random(1,DataService.stats.attack);
            if ($rootScope.enemy.currentShield > 0) {
                // damage shield
                if ($rootScope.enemy.currentShield - damageRoll <= 0) {
                    $rootScope.enemy.currentShield = 0;
                    $rootScope.$broadcast('getLog', { log: "You hit " + $rootScope.enemy.ship.name + " for " + damageRoll + " and disable their shields!" });
                } else {
                    $rootScope.enemy.currentShield -= damageRoll;
                    $rootScope.$broadcast('getLog', { log: "You damage " + $rootScope.enemy.ship.name + "'s shields for " + damageRoll + "!" });
                }
            } else {
                // damage hull
                if ($rootScope.enemy.currentHull - damageRoll <= 0) {
                    var bounty = UtilService.random(1*DataService.stats.level,10*DataService.stats.level);
                    DataService.stats.credits += bounty;
                    $rootScope.$broadcast('getView', { image: UtilService.getImagePath("explosion.jpg") });
                    $rootScope.$broadcast('getLog', { log: "You hit " + $rootScope.enemy.ship.name + " for " + damageRoll + " and destroy them!" });
                    $rootScope.$broadcast('getLog', { log: "A bounty of " + bounty + " credits has been transferred to your account." });
                    $rootScope.$broadcast('updateStats');
                    $rootScope.currentState = "nothing";
                } else {
                    $rootScope.enemy.currentShield -= damageRoll;
                    $rootScope.$broadcast('getLog', { log: "You damage " + $rootScope.enemy.ship.name + "'s hull for " + damageRoll + "!" });
                }

            }
        } else {
            // miss
            $rootScope.$broadcast('getLog', { log: "You miss!" });
        }
        var enemy = $rootScope.enemy;

    };

    this.escape = function () {

        if (UtilService.random(1,2)===1) {
            $rootScope.$broadcast('getView', { image: UtilService.getImagePath(UtilService.randomFromArray(DataService.images.space)) });
            $rootScope.$broadcast('getLog', { log: "You escape with your life!" });
            $rootScope.currentState = "nothing";

        } else {
            $rootScope.$broadcast('getLog', { log: "You fail to escape!" });
        }

    };

});