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

    this.generateItem = function () {

        var o = {};

        o.level = DataService.stats.level;

        var getType = function () {

            var roll = UtilService.random(1,1);

            if (roll <= 1) {
                return UtilService.randomFromArray(DataService.items.shipPart);
            } else if (roll <= 2) {
                return UtilService.randomFromArray(DataService.items.junk);
            } else {
                return UtilService.randomFromArray(DataService.items.shipPart);
            }

        };

        var type = getType();
        o.type = type.type;
        o.name = o.type;
        o.enhancement = type.enhancement;
        o.image = UtilService.getImagePath(UtilService.randomFromArray(DataService.images.components[o.type]));
        o.componentsNeeded = ItemService.damageItem(o.level,3,3,1,1);
        o.repaired = [];
        o.fullValue = type.value * o.level;
        o.currentValue = o.componentsNeeded.length > 0 ? Math.floor(o.fullValue / o.componentsNeeded.length) : o.fullValue;
        console.log(o);
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