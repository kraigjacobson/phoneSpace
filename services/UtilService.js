app.service('UtilService', function ($rootScope, DataService){

    var self = this;

    this.random = function (min,max) {

        return Math.floor(Math.random()*(max-min+1)+min);

    };

    this.randomFromArray = function (array) {

        return array[Math.floor(Math.random()*array.length)];

    };

    this.getImagePath = function (imageFileName) {

        return window.location.origin + '/space/www/assets/img/' + imageFileName;

    };

    this.fullName = function() {

        var buildName = function () {
            var number = self.random(2,5);
            var name = "";
            if(self.random(1,3)===1){
                name += self.randomFromArray(DataService.text.names.vowels);
            }
            for (i=0;i<number;i++) {
                if (i%2===0) {
                    name += self.randomFromArray(DataService.text.names.parts);
                } else {
                    name += self.randomFromArray(DataService.text.names.vowels);
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

    this.itemName = function () {

        return self.randomFromArray(DataService.text.adjectives);

    };

    this.generateItem = function () {

        var self = this;

        o = {};

        o.level = DataService.stats.level;

        var getType = function () {

            var roll = self.random(1,1);

            if (roll <= 1) {
                return self.randomFromArray(DataService.items.shipPart);
            } else if (roll <= 2) {
                return self.randomFromArray(DataService.items.junk);
            } else {
                return self.randomFromArray(DataService.items.shipPart);
            }

        };

        var materialsNeeded = function () {
        // adjective named for how much is needed to fix it
            var mats = {};
            var numberNeeded = self.random(1,Math.ceil(o.level*0.5));
            for (i=0;i<numberNeeded;i++) {
                var randomMaterial = self.randomFromArray(Object.keys(DataService.materials));
                var amt = self.random(1,Math.ceil(o.level*1.5));
                if (mats[randomMaterial]){
                    mats[randomMaterial] += amt;
                }
                mats[randomMaterial] = amt;
            }
            return mats;

        };
        var type = getType();
        o.type = type.type;
        o.name = o.type;
        o.enhancement = type.enhancement;
        o.image = self.getImagePath(self.randomFromArray(DataService.images.components[o.type]));
        o.value = type.value;
        var val = o.value * o.level;
        o.mats = materialsNeeded();
        o.needed = 0;
        for (i in o.mats) {
            o.needed += o.mats[i];
        }
        if (o.needed > val) {
            o.value = 0;
        } else {
            o.value = val - o.needed;
        }
        return o;



    };

    this.generateEnemy = function () {

        o = {};
        var randomShip = self.randomFromArray(Object.keys(DataService.ships));
        o.ship = DataService.ships[randomShip];
        o.currentShield = o.ship.shield;
        o.currentHull = o.ship.hull;
        return o;

    };

    this.gainCredits = function (minBase, maxBase) {
        var credits = self.random(minBase*DataService.stats.level, maxBase*DataService.stats.level);
        DataService.stats.credits += credits;
        $rootScope.$broadcast('updateStats');
        return credits;
    };

});