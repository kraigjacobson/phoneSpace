app.service('GenerateService', function ($rootScope, DataService, ItemService, UtilService){

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

    this.generateItem = function (type, broken) {
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

            var actual = o.effectiveness;
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
        o.effectiveness = UtilService.random(1 * o.level, effectivenessMax * o.level) + UtilService.random(1,effectivenessMax);
        o.maxEffectiveness = effectivenessMax * o.level + effectivenessMax;
        o.quality = getQuality();
        o.image = UtilService.getImagePath(UtilService.randomFromArray(DataService.images.components[thisType]));
        if (broken) {
            o.componentsNeeded = ItemService.damageItem(o.level,3,3,1,1);
        } else {
            o.componentsNeeded = 0;
        }
        o.repaired = [];
        o.fullValue = tempType.value * o.effectiveness + UtilService.random(1,9);
        o.currentValue = o.componentsNeeded.length > 0 ? Math.floor(o.fullValue / o.componentsNeeded.length) : o.fullValue;
        return o;

    };

    this.generateEnemy = function () {

        var o = {};
        var randomShip = UtilService.randomFromArray(Object.keys(DataService.ships));
        o.ship = DataService.ships[randomShip];
        o.currentShield = o.ship.shield;
        o.currentHull = o.ship.hull;
        return o;

    };

    this.gainCredits = function (minBase, maxBase) {

        var credits = UtilService.random(minBase*DataService.stats.level, maxBase*DataService.stats.level);
        DataService.stats.credits += credits;
        $rootScope.$broadcast('updateStats');
        return credits;

    };

});