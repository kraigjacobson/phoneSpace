app.service('ActionService', function($rootScope, $state, ModalService, ShipService, UniverseService, DataService, UtilService, InventoryService, GenerateService){

    var self = this;

    this.travel = function () {

        $rootScope.background = UtilService.getImagePath(UtilService.randomFromArray(DataService.images.space));
        $rootScope.foreground = UtilService.getImagePath(UtilService.randomFromArray(DataService.images.space));
        // for testing inventory screen
        var item = GenerateService.generateItem();
        InventoryService.inventory.unshift(item);

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
                DataService.log.unshift("You have traveled <span class='danger'>" + distance + "</span> light years.");
                console.log(DataService.log);
                UniverseService.event();
            } else {
                DataService.stats.distanceTraveled = DataService.stats.totalDistance;
                DataService.log.unshift("You have traveled " + DataService.stats.distanceLeft + " light years.");
                DataService.stats.distanceLeft = 0;
                DataService.log.unshift("You have arrived at your destination! It took you " + DataService.stats.daysTraveled + " days!");
            }

        });

    };

    this.investigate = function () {

        $state.go('log').then(function () {
            var roll = UtilService.random(1,5);

            roll = 5 ? UniverseService.combat() : GenerateService.loot();

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
                    DataService.log.unshift("You hit " + $rootScope.enemy.ship.name + " for " + damageRoll + " and disable their shields!");
                } else {
                    $rootScope.enemy.currentShield -= damageRoll;
                    DataService.log.unshift("You damage " + $rootScope.enemy.ship.name + "'s shields for " + damageRoll + "!");
                }
            } else {
                // damage hull
                if ($rootScope.enemy.currentHull - damageRoll <= 0) {
                    var bounty = UtilService.random(1*DataService.stats.level,10*DataService.stats.level);
                    DataService.stats.credits += bounty;
                    DataService.stats.experience += $rootScope.enemy.experience;
                    var currentLevel = DataService.stats.level;
                    var root = Math.floor(Math.sqrt(DataService.stats.experience));
                    console.log(root);
                    if (currentLevel < root) {
                        DataService.log.unshift("You achieved level " + root + "!");
                        DataService.stats.experience = root;
                    }
                    GenerateService.loot();
                    $rootScope.$broadcast('getForeground', { image: UtilService.getImagePath("explosion.jpg") });
                    DataService.log.unshift("You hit " + $rootScope.enemy.ship.name + " for " + damageRoll + " and destroy them!");
                    DataService.log.unshift("A bounty of " + bounty + " credits has been transferred to your account.");
                    $rootScope.currentState = "nothing";
                } else {
                    $rootScope.enemy.currentShield -= damageRoll;
                    DataService.log.unshift("You damage " + $rootScope.enemy.ship.name + "'s hull for " + damageRoll + "!");
                }

            }
        } else {
            // miss
            DataService.log.unshift("You miss!");
        }
        var enemy = $rootScope.enemy;

    };

    this.escape = function () {

        if (UtilService.random(1,2)===1) {
            $rootScope.$broadcast('getForeground', { image: null });
            DataService.log.unshift("You escape with your life!");
            $rootScope.currentState = "nothing";

        } else {
            DataService.log.unshift("You fail to escape!");
        }

    };

    this.buy = function () {

        $state.go('buy');

    };

    this.sell = function () {

        $state.go('sell');

    };

    this.hangar = function () {

        $state.go('inventory');

    };

    this.goToShip = function () {

        $state.go('ship');

    };

    this.goToInventory = function () {

        $state.go('inventory');

    };

    this.goToComponents = function () {

        $state.go('components');

    };

});