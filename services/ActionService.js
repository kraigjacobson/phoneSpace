var app = angular.module('spaceApp');
app.service('ActionService', function ($rootScope, $timeout, $state, NewGameService, ShipService, UniverseService, DataService, UtilService, InventoryService, GenerateService, StockService) {

    var self = this;
    // var test = 'test';
    // var test = 'test';

    this.travel = function () {
        $rootScope.stationTemps = {};
        UtilService.newDay();
        StockService.change();
        $rootScope.investigated = false;
        self.checkInsurance();

        $rootScope.foreground = UtilService.getImagePath(DataService.images.blank);
        // for testing inventory screen
        // var item = GenerateService.generateItem();
        // InventoryService.inventory.unshift(item);

        $rootScope.starfield = true;

        $state.go('log').then(function () {
            start();
            $timeout(function () {
                $rootScope.starfield = false;
                var distance = ShipService.getDistance();
                DataService.stats.daysTraveled++;
                if (DataService.stats.distanceLeft - distance >= 0) {
                    DataService.stats.distanceLeft -= distance;
                    DataService.stats.distanceTraveled += distance;
                    DataService.log.unshift("You have traveled " + distance + " light years.");

// force event here

                    UniverseService.event();

//

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
            }, 2000);

        });

    };

    this.checkInsurance = function () {
        if (DataService.policy) {
            DataService.policy.daysLeft--;
            if (DataService.policy.daysLeft === 10) {
                alert('Your insurance policy is expiring soon. Please see your nearest agent.');
            }
            if (DataService.policy.daysLeft === 0) {
                alert('Your insurance policy has expired. Please see your nearest agent.');
                DataService.policy = null;
            }
        }
    };

    this.investigate = function () {

        $state.go('log').then(function () {

            $rootScope.investigated = true;
            $timeout(function () {
                var roll = UtilService.random(1, 5);

                if (roll === 5) {
                    DataService.log.unshift("<span class='danger'>It's a trap!</span>");
                    UniverseService.event('combat');
                } else {
                    GenerateService.loot();
                    $rootScope.label = "wrecked ship";
                }
            }, 2000);

        });

    };

    this.attack = function () {

        var attackRoll = UtilService.random(1, 20);
        if (attackRoll + DataService.stats.accuracy >= $rootScope.enemy.ship.piloting) {
            // hit
            var damageRoll = UtilService.random(1, DataService.stats.attack);
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
                    var bounty = {
                        target: $rootScope.enemy.name,
                        bounty: UtilService.random(1 * DataService.stats.level, 10 * DataService.stats.level),
                        time: UtilService.timeNow()
                    };
                    if ($rootScope.bounties === null) {
                        $rootScope.bounties = [bounty];
                    } else {
                        $rootScope.bounties.unshift(bounty);
                    }
                    DataService.stats.credits += bounty.bounty;
                    GenerateService.loot();
                    $rootScope.foreground = UtilService.getImagePath("explosion.jpg");
                    DataService.log.unshift("You hit " + $rootScope.enemy.ship.name + " for <span class='success'>" + damageRoll + "</span> and destroy them!");
                    DataService.log.unshift("You have been awarded a bounty voucher. See a bounty office to claim.");
                    UtilService.getExperience($rootScope.enemy.experience);
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
            var enemyAttackRoll = UtilService.random(1, 20);
            if (enemyAttackRoll + $rootScope.enemy.ship.accuracy >= DataService.stats.piloting) {
                var damageRoll = UtilService.random(1, Math.floor($rootScope.enemy.ship.attack * .5));
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
                        $rootScope.foreground = UtilService.getImagePath("explosion.jpg");
                        DataService.log.unshift("<span class='danger'>You were killed by " + $rootScope.enemy.ship.name + "</span>!");
                        if (DataService.policy) {
                            alert('Ᵽ' + DataService.policy.coverage + ' is transferred to your account from your insurance policy.');
                            DataService.stats.credits += DataService.policy.coverage;
                            DataService.policy = null;
                        }
                        NewGameService.init();

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
        enemyRoll = UtilService.random(1, ($rootScope.enemy.ship.accuracy + $rootScope.enemy.ship.speed) / 2);
        playerRoll = UtilService.random(1, (DataService.stats.piloting + DataService.stats.speed) / 2);

        if (playerRoll > enemyRoll) {
            DataService.log.unshift("You escape with your life!");
            self.travel();
        } else {
            DataService.log.unshift("You fail to escape!");
            self.enemyAttack();
        }

    };

    // this.repairShip = function () {
    // var cost = (DataService.stats.hull - DataService.stats.currentHull) * 5;
    //     if (DataService.stats.credits < cost) {
    //         alert('You need ' + cost + 'Ᵽ to repair your ship.');
    //     } else {
    //         DataService.stats.currentHull = DataService.stats.hull;
    //         DataService.stats.credits -= cost;
    //     }
    //
    // };
    //
    // this.insurance = function () {
    //     $state.go('insurance');
    //     $rootScope.label = "Insurance";
    //     $rootScope.foreground = UtilService.getImagePath(UtilService.randomFromArray(DataService.images.insurance));
    // };
    //
    // this.stockBrokerage = function () {
    //     $state.go('stock-brokerage');
    //     $rootScope.label = "Stock Brokerage";
    //     $rootScope.foreground = UtilService.getImagePath(UtilService.randomFromArray(DataService.images.stockBrokerage));
    // };
    //
    // this.bountyOffice = function () {
    //     $state.go('bounty-office');
    //     $rootScope.label = "Bounty Office";
    //     $rootScope.foreground = UtilService.getImagePath(UtilService.randomFromArray(DataService.images.bountyOffice));
    // };
    //
    // this.nightClub = function () {
    //     $state.go('night-club');
    //     $rootScope.label = "Night Club";
    //     $rootScope.foreground = UtilService.getImagePath(UtilService.randomFromArray(DataService.images.nightClub));
    // };
    //
    // this.casino = function () {
    //     if (DataService.stats.credits >= 5) {
    //         $state.go('casino');
    //         $rootScope.label = "Casino";
    //         $rootScope.foreground = UtilService.getImagePath(UtilService.randomFromArray(DataService.images.casino));
    //     } else {
    //         $rootScope.label = "Casino";
    //         $rootScope.foreground = UtilService.getImagePath(UtilService.randomFromArray(DataService.images.casino));
    //         setTimeout(function () {
    //             state.go('services');
    //             alert("Get lost space rat, come back when you've got some creds!");
    //         }, 500)
    //     }
    // };

    // this.buy = function () {
    //     $state.go('buy');
    // };
    //
    // this.sell = function () {
    //     $state.go('sell');
    // };

    this.collectBounties = function () {
        var totalBounties = 0;
        console.log('totalBounties', totalBounties);
        angular.forEach($rootScope.bounties, function (value, key) {
            console.log('key', key);
            console.log('value', value);
            totalBounties += value.bounty;
        });
        DataService.stats.credits += totalBounties;
        $rootScope.bounties = null;
        alert('you collected ' + totalBounties + '.');
        $state.reload();
    };

    // this.repair = function () {
    //     $state.go('repair');
    //     $rootScope.label = $rootScope.stationTemps.name + " | Ship Repairs";
    //     $rootScope.foreground = UtilService.getImagePath(UtilService.randomFromArray(DataService.images.repair));
    // };

    this.inventory = function () {
        $state.go('inventory');
    };

    this.cargoInventory = function () {
        $state.go('inventory');
    };

    this.shipInventory = function () {
        $state.go('ship');
    };

});