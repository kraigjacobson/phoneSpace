app.service('ActionService', function($rootScope, $state, ModalService, ShipService, UniverseService, DataService, UtilService, InventoryService, GenerateService, $timeout){

    var self = this;

    this.travel = function () {
        $rootScope.label = "Warping";

        $rootScope.background = UtilService.getImagePath(UtilService.randomFromArray(DataService.images.space));
        $rootScope.foreground = UtilService.getImagePath(UtilService.randomFromArray(DataService.images.space));
        // for testing inventory screen
        var item = GenerateService.generateItem();
        InventoryService.inventory.unshift(item);

        $rootScope.starfield = true;
        console.log('test');

        $state.go('log').then(function () {
            start();
            $timeout(function() {
                $rootScope.starfield = false;


                $rootScope.investigated = true;
                var distance = ShipService.getDistance();
                DataService.stats.daysTraveled ++;
                if (DataService.stats.distanceLeft - distance >= 0) {
                    DataService.stats.distanceLeft -= distance;
                    DataService.stats.distanceTraveled += distance;
                    DataService.log.unshift("You have traveled " + distance + " light years.");
                    UniverseService.event();
                } else {
                    DataService.stats.distanceTraveled = DataService.stats.totalDistance;
                    DataService.log.unshift("You have traveled " + DataService.stats.distanceLeft + " light years.");
                    DataService.stats.distanceLeft = 0;
                    DataService.log.unshift("You have arrived at your destination! It took you " + DataService.stats.daysTraveled + " days!");
                }

                if (DataService.stats.currentShield < DataService.stats.shield) {
                    var shieldRecharge = Math.ceil(DataService.stats.shield * 0.2);
                    if (DataService.stats.currentShield + shieldRecharge > DataService.stats.shield) {
                        DataService.stats.currentShield = DataService.stats.shield;
                    } else {
                        DataService.stats.currentShield += shieldRecharge;
                    }
                }
                stop();
            }, 5000);

        });

    };

    this.investigate = function () {

        $state.go('log').then(function () {
            var roll = UtilService.random(1,5);

            roll === 5 ? UniverseService.event(12) : GenerateService.loot();

        });

        $rootScope.investigated = true;

    };

    this.attack = function () {

        var attackRoll = UtilService.random(1,20);
        if (attackRoll + DataService.stats.accuracy >= $rootScope.enemy.ship.maneuverability) {
            // hit
            var damageRoll = UtilService.random(1,DataService.stats.attack);
            if ($rootScope.enemy.currentShield > 0) {
                // damage shield
                if ($rootScope.enemy.currentShield - damageRoll <= 0) {
                    $rootScope.enemy.currentShield = 0;
                    DataService.log.unshift("You hit " + $rootScope.enemy.ship.name + " for <span class='success'>" + damageRoll + "</span> and disable their shields!");
                } else {
                    $rootScope.enemy.currentShield -= damageRoll;
                    DataService.log.unshift("You damage " + $rootScope.enemy.ship.name + "'s shields for <span class='success'>" + damageRoll + "</span>!");
                }
            } else {
                // damage hull
                if ($rootScope.enemy.currentHull - damageRoll <= 0) {
                    $rootScope.enemy.currentHull = 0;
                    var bounty = UtilService.random(1*DataService.stats.level,10*DataService.stats.level);
                    DataService.stats.credits += bounty;
                    GenerateService.loot();
                    $rootScope.$broadcast('getForeground', { image: UtilService.getImagePath("explosion.jpg") });
                    DataService.log.unshift("You hit " + $rootScope.enemy.ship.name + " for <span class='success'>" + damageRoll + " and destroy them!</span>");
                    DataService.log.unshift("A bounty of " + bounty + " credits has been transferred to your account.");
                    UtilService.getExperience($rootScope.enemy.experience);
                    $rootScope.currentState = "nothing";
                } else {
                    $rootScope.enemy.currentHull -= damageRoll;
                    DataService.log.unshift("You damage " + $rootScope.enemy.ship.name + "'s hull for <span class='success'>" + damageRoll + "</span>!");
                }

            }
        } else {
            // miss
            DataService.log.unshift("You miss!");
        }

        self.enemyAttack();

    };

    this.enemyAttack = function () {
        // enemy attack

        if ($rootScope.enemy.currentHull > 0) {
            var enemyAttackRoll = UtilService.random(1,20);
            if (enemyAttackRoll + $rootScope.enemy.ship.accuracy >= DataService.stats.maneuverability) {
                var damageRoll = UtilService.random(1,Math.floor($rootScope.enemy.ship.attack/3));
                if (DataService.stats.currentShield > 0) {
                    // damage shield
                    if (DataService.stats.currentShield - damageRoll <= 0) {
                        DataService.stats.currentShield = 0;
                        DataService.log.unshift($rootScope.enemy.ship.name + " hits you for <span class='danger'>" + damageRoll + "</span> and disables your shields!");
                    } else {
                        DataService.stats.currentShield -= damageRoll;
                        DataService.log.unshift($rootScope.enemy.ship.name + " damages your shields for <span class='danger'>" + damageRoll + "</span>!");
                    }
                } else {
                    // damage hull
                    if (DataService.stats.currentHull - damageRoll <= 0) {
                        $rootScope.$broadcast('getForeground', { image: UtilService.getImagePath("explosion.jpg") });
                        DataService.log.unshift("You were killed by " + $rootScope.enemy.ship.name + "!");
                        $rootScope.currentState = "nothing";
                    } else {
                        DataService.stats.currentHull -= damageRoll;
                        DataService.log.unshift($rootScope.enemy.ship.name + " damaged your hull for <span class='danger'>" + damageRoll + "</span>!");
                    }
                }
            } else {
                // miss
                DataService.log.unshift($rootScope.enemy.ship.name + " misses you.");
            }
        }
    };

    this.escape = function () {
        enemyRoll = UtilService.random(1,($rootScope.enemy.ship.accuracy + $rootScope.enemy.ship.speed) / 2);
        playerRoll = UtilService.random(1,(DataService.stats.maneuverability + DataService.stats.speed) / 2);
        console.log('enemyRoll',enemyRoll);
        console.log('playerRoll',playerRoll);

        if (playerRoll > enemyRoll) {
            DataService.log.unshift("You escape with your life!");
            self.travel();
        } else {
            DataService.log.unshift("You fail to escape!");
            self.enemyAttack();
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

    this.repair = function () {
    var cost = (DataService.stats.hull - DataService.stats.currentHull) * 5;
        if (DataService.stats.credits < cost) {
            alert('You need ' + cost + 'Ᵽ to repair your ship.');
        } else {
            DataService.stats.currentHull = DataService.stats.hull;
            DataService.stats.credits -= cost;
        }

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