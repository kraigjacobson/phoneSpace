app.service('UtilService', function ($rootScope, DataService){

    var self = this;

    this.random = function (min,max) {

        if (!max) {
            var range = min;
        } else {
            var range = max-min;
        }

        return Math.floor(Math.random()*(range+1)+min);

    };

    this.randomFromArray = function (array) {

        return array[Math.floor(Math.random()*array.length)];

    };

    this.getImagePath = function (imageFileName) {

        return window.location.origin + '/space/www/assets/img/' + imageFileName;

    };

    this.repairItem = function (i) {
        var currentMaterial = $rootScope.currentItem.mats[i];
        var currentMaterialInventory = DataService.componentInventory[currentMaterial.name];
        console.log(currentMaterial.name);
        if (currentMaterial.need > currentMaterialInventory) {
            alert("You don't have enough components!");
        } else {
            alert("You found and installed the correct parts!");
            // currentMaterialInventory -= currentMaterial.need;
            // DataService.inventory[i].mats[j].need = 0;
        }
        console.log('Repaired Item ', $rootScope.currentItem.mats[i]);
    };

    this.deleteItem = function (i) {

        DataService.inventory.splice(i, 1);

    };

    this.getExperience = function (amt) {

        DataService.stats.experience += amt;
        var currentLevel = DataService.stats.level;
        var getNextLevelXp = function () {
            var init = 50, exp = 50;
            for (i = 1; i < currentLevel; i++) {
                if (i%2===0) {
                    exp = exp + init + init/2;
                } else {
                    exp = exp + init + init/4;
                }

            }
            console.log('exp',exp);
            return Math.floor(exp);
        };

        if (DataService.stats.experience > getNextLevelXp()) {
            var nextLevel = DataService.stats.level + 1;
            DataService.log.unshift("You achieved level " + nextLevel + "!");
            DataService.stats.level ++;
        }

    };

});