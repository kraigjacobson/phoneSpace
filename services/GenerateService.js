app.service('GenerateService', function ($rootScope, DataService, InventoryService, ItemService, UtilService){

    var self = this;

    this.generateFullName = function() {

        var buildName = function () {
            var number = UtilService.random(2,5);
            var name = "";
            if(UtilService.random(1,3)===1){
                name += UtilService.randomFromArray(DataService.text.names.vowels);
            }
            for (i=0;i<number;i++) {
                if (i%2===0) {
                    name += UtilService.randomFromArray(DataService.text.names.parts);
                } else {
                    name += UtilService.randomFromArray(DataService.text.names.vowels);
                }
            }
            return name;
        };

        var fullName = capitalizeFirstLetter(buildName())  + " " + capitalizeFirstLetter(buildName());

        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        return (fullName);

    };

    this.generateItem = function (type, perfect) {
        // Object.keys(DataService.items.shipParts)

        var o = {};

        if (type) {
            var thisType = type;
        } else {
            var thisType = (function () {

                var roll = UtilService.random(1,1);

                if (roll <= 1) {
                    return UtilService.randomFromArray(Object.keys(DataService.items.shipPart));
                }

            })();
        }

        var getQuality = function() {

            var actual = o.fullEffectiveness;
            var max = o.maxEffectiveness;
            var percent = actual / max;

            if (percent > .99) {
                return "legendary";
            } else if (percent > .95) {
                return "epic";
            } else if (percent > .90) {
                return "rare";
            } else if (percent > .75) {
                return "uncommon";
            } else if (percent > .50) {
                return "common";
            } else {
                return "trash";
            }

        };

        o.level = DataService.stats.level;
        var tempType = DataService.items.shipPart[thisType];
        o.name = thisType;
        o.type = thisType;
        o.enhancement = tempType.enhancement;
        const effectivenessMax = 3;
        o.fullEffectiveness = UtilService.random(o.level, effectivenessMax * o.level) + UtilService.random(1,effectivenessMax);
        o.maxEffectiveness = effectivenessMax * o.level + effectivenessMax;
        o.quality = getQuality();
        o.image = UtilService.getImagePath(UtilService.randomFromArray(DataService.images.components[thisType]));
        o.repaired = [];
        o.fullValue = Math.pow(o.fullEffectiveness, 2);
        if (!perfect) {
            var damage = ItemService.damageItem(o.level);
            o.componentsNeeded = damage.componentsNeeded;
            o.penalty = damage.penalty;
            if (o.fullValue - o.penalty*o.level < 0) {
                o.currentValue = 0;
            } else {
                o.currentValue = Math.floor(o.fullValue - o.penalty*o.level);
            }
            o.currentEffectiveness = Math.floor(o.fullEffectiveness - o.penalty)
        } else {
            o.componentsNeeded = [];
            o.penalty = 0;
            o.currentValue = o.fullValue;
            o.currentEffectiveness = o.fullEffectiveness;
        }

        return o;

    };

    this.generateEnemy = function () {

        var o = {};
        var randomShip = UtilService.randomFromArray(Object.keys(DataService.ships));
        o.ship = DataService.ships[randomShip];
        o.currentShield = o.ship.shield;
        o.currentHull = o.ship.hull;
        o.experience = 1;
        return o;

    };

    this.gainCredits = function (minBase, maxBase) {

        var credits = UtilService.random(minBase*DataService.stats.level, maxBase*DataService.stats.level);
        DataService.stats.credits += credits;
        $rootScope.$broadcast('updateStats');
        return credits;

    };

    this.loot = function () {

        var roll = UtilService.random(1,15);

        if (roll <= 7) {
            var credits = self.gainCredits(1,5);
            var item = self.generateItem();
            InventoryService.inventory.unshift(item);
            $rootScope.$broadcast('getLog', { log: "You manage to find " + credits + " credits and a " + item.name + "." });
        } else if (roll <= 9) {
            var credits = self.gainCredits(1,5);
            $rootScope.$broadcast('getLog', { log: "You manage to find " + credits + " credits." });
        } else if (roll <= 11) {
            var item = self.generateItem();
            InventoryService.inventory.unshift(item);
            $rootScope.$broadcast('getLog', { log: "You manage to find a " + item.name + "." });
        } else {
            $rootScope.$broadcast('getLog', { log: "You don't find anything interesting." });
        }

    }

});