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

});