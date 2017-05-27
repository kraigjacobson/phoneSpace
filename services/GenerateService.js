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

    this.generateItem = function (type, percentChanceBroken) {

        var o = {};

        if (type && type !== 'any') {
            var thisType = type;
        } else {
            var thisType = (function () {

                var roll = UtilService.random(1,1);

                if (roll <= 1) {
                    return UtilService.randomFromArray(Object.keys(DataService.items.shipPart));
                }

            })();
        }

        o.level = DataService.stats.level > 1 ? UtilService.random((DataService.stats.level -1), (DataService.stats.level + 1)) : DataService.stats.level;
        var tempType = DataService.items.shipPart[thisType];
        o.name = thisType;
        o.type = thisType;
        o.enhancement = tempType.enhancement;

        // quality

        o.maxEffectiveness = o.level+3;
        var getQuality = function() {

            var percent = Math.random();

            if (percent > .99 && o.level > 15) {
                return {
                    fullEffectiveness: Math.ceil(o.maxEffectiveness*1.2),
                    quality: 'legendary'
                };
            } else if (percent > .95 && o.level > 10) {
                return {
                    fullEffectiveness: Math.ceil(o.maxEffectiveness*1.1),
                    quality: 'epic'
                };
            } else if (percent > .85 && o.level > 7) {
                return {
                    fullEffectiveness: Math.ceil(o.maxEffectiveness),
                    quality: 'rare'
                };
            } else if (percent > .70 && o.level > 4) {
                return {
                    fullEffectiveness: Math.ceil(o.maxEffectiveness*.9),
                    quality: 'uncommon'
                };
            } else if (percent > .50) {
                return {
                    fullEffectiveness: Math.ceil(o.maxEffectiveness*.8),
                    quality: 'common'
                };
            } else {
                return {
                    fullEffectiveness: Math.ceil(o.maxEffectiveness*.7),
                    quality: 'trash'
                }
            }

        };
        var quality = getQuality();
        o.fullEffectiveness = quality.fullEffectiveness;
        o.quality = quality.quality;

        o.image = UtilService.getImagePath(UtilService.randomFromArray(DataService.images.components[thisType]));
        o.repaired = [];
        o.fullValue = o.fullEffectiveness * 5;
        if (Math.random() < percentChanceBroken) {
            var damage = ItemService.damageItem(1,3,1,3);
            o.componentsNeeded = damage.componentsNeeded;
            o.currentEffectiveness = o.fullEffectiveness / 2;
            o.currentValue = o.fullValue / 2;
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
        o.experience = 10;
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
            if (InventoryService.inventory.length > DataService.stats.capacity) {
                alert('Your inventory is too full.');
            } else {
                if (roll <= 3) {
                    //money + item
                    var credits = self.gainCredits(1,5);
                    var item = self.generateItem();
                    InventoryService.inventory.unshift(item);
                    DataService.log.unshift("You manage to find <span class='gold'>" + credits + "&#11363;</span> and <span class='" + item.quality + "'>" + item.name + "</span>.");
                } else {
                    //item
                    var item = self.generateItem();
                    InventoryService.inventory.unshift(item);
                    DataService.log.unshift("You manage to find <span class='" + item.quality + "'>" + item.name + "</span>.");
                }
            }
        } else {
            if (roll <= 10) {
                //money
                var credits = self.gainCredits(1,5);
                DataService.log.unshift("You manage to find <span class='gold'>" + credits + "&#11363;</span>.");
            } else {
                //nothing
                DataService.log.unshift("You don't find anything interesting.");
            }
        }
    };

    this.getInsuranceRates = function () {

        o = {};
        playerLevel = DataService.stats.level;

        o.platinum = playerLevel * 800;
        o.gold = playerLevel * 400;
        o.silver = playerLevel * 200;
        o.bronze = playerLevel * 100;

        return o;

    };

    this.generateInsurancePolicy = function (policyType) {

        if (DataService.policy) {
            alert('You already have a policy. Would you like to extend it?');
        } else {

            o = {};
            var rate = self.getInsuranceRates()[policyType];
            o.coverage = rate;
            o.policyType = policyType;
            o.cost = Math.floor(rate * 0.5);
            if (o.cost > DataService.stats.credits) {
                alert('You cannot afford this policy.');
            } else {
                o.daysCovered = 100;
                o.daysLeft = o.daysCovered;
                DataService.stats.credits -= o.cost;
                DataService.policy = o;
            }
        }

    }

});