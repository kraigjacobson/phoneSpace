app.service('UniverseService', function($rootScope, $state, UtilService, DataService, GenerateService, InventoryService, ItemService){

    var self = this;

    $rootScope.currentState = "station";

    this.event = function () {

        var roll = UtilService.random(1,30);
        // var roll = 8;

        if (roll <= 3) {
            $rootScope.currentState = "weird";
            self.weird();
        } else if (roll <= 6) {
            $rootScope.currentState = "opportunity";
            $rootScope.investigated = false;
            self.opportunity();
        } else if (roll <= 8) {
            $rootScope.currentState = "merchant";
            self.merchant();
        } else if (roll <= 9) {
            var randomShipPart = UtilService.randomFromArray(Object.keys(InventoryService.myShip));
            console.log(InventoryService.myShip[randomShipPart].componentsNeeded.length);
            if (InventoryService.myShip[randomShipPart].componentsNeeded.length !== 0) {
                self.event();
            } else {
                $rootScope.currentState = "ship issue";
                self.shipIssue(randomShipPart);
            }
        } else if (roll <= 10) {
            $rootScope.currentState = "station";
            self.station();
        } else if (roll <= 12) {
            $rootScope.currentState = "combat";
            self.combat();
        } else {
            $rootScope.currentState = "nothing";
            $rootScope.$broadcast('getBackground', { image: UtilService.getImagePath(UtilService.randomFromArray(DataService.images.space)) });
            $rootScope.$broadcast('getForeground', { image: UtilService.getImagePath(UtilService.randomFromArray(DataService.images.space)) });
            $rootScope.label = "Deep Space";
        }

    };

    this.weird = function() {

        $rootScope.$broadcast('getLog', { log: UtilService.randomFromArray(DataService.text.weird) });
        $rootScope.$broadcast('getBackground', { image: null });
        $rootScope.label = "Deep Space";

    };

    this.merchant = function() {
        var roll = UtilService.random(1,10);
        console.log(roll);
        var tempArray = [];
        for (k = 0; k < roll; k++) {
            var item = GenerateService.generateItem();
            tempArray.unshift(item);
            console.log('roll ' + k);
        }
        InventoryService.merchantInventory = tempArray;
        console.log(tempArray);
        var merchantName = GenerateService.generateFullName();
        $rootScope.$broadcast('getLog', { log: "You come across a merchant named " + merchantName + "." });
        $rootScope.$broadcast('getBackground', { image: UtilService.getImagePath(UtilService.randomFromArray(DataService.images.space)) });
        $rootScope.$broadcast('getForeground', { image: UtilService.getImagePath("merchant.png") });
        $rootScope.label = "Merchant: " + merchantName;

    };

    this.opportunity = function() {
        $rootScope.investigated = false;
        $rootScope.$broadcast('getLog', { log: "You come across a wrecked ship floating in space." });
        $rootScope.$broadcast('getBackground', { image: UtilService.getImagePath(UtilService.randomFromArray(DataService.images.space)) });
        $rootScope.$broadcast('getForeground', { image: UtilService.getImagePath(UtilService.randomFromArray(DataService.images.wrecks)) });
        $rootScope.label = "Wrecked Ship";
    };

    this.shipIssue = function(randomShipPart) {

        var partItemLevel = InventoryService.myShip[randomShipPart].level;
        var damage = ItemService.damageItem(partItemLevel);
        console.log(damage);
        InventoryService.myShip[randomShipPart].componentsNeeded = damage.componentsNeeded; // bug here, will replace whole components needed object, even if there are already damaged items in it
        InventoryService.myShip[randomShipPart].penalty = damage.penalty; // bug here, will replace penalty even if there already is one
        InventoryService.myShip[randomShipPart].currentEffectiveness -= damage.penalty;
        InventoryService.myShip[randomShipPart].currentValue - damage.penalty*partItemLevel < 0 ? InventoryService.myShip[randomShipPart].currentValue = 0 : Math.floor(InventoryService.myShip[randomShipPart].currentValue -= damage.penalty*partItemLevel);
        $rootScope.$broadcast('getLog', { log: 'Your ' + randomShipPart + ' has malfunctioned and needs new parts!'});
        $rootScope.$broadcast('getForeground', { image: UtilService.getImagePath(UtilService.randomFromArray(DataService.images.space)) });
        $rootScope.$broadcast('getBackground', { image: null });
        $rootScope.label = "Deep Space";
        console.log(InventoryService.myShip[randomShipPart]);
    };

    this.station = function() {
        $rootScope.$broadcast('getLog', { log: 'You arrive at a station.' });
        $rootScope.$broadcast('getForeground', { image: UtilService.getImagePath(UtilService.randomFromArray(DataService.images.space)) });
        $rootScope.$broadcast('getBackground', { image: null });
        $rootScope.label = "Station";
    };

    this.combat = function() {
        var enemyName = GenerateService.generateFullName();
        $rootScope.enemy = GenerateService.generateEnemy();
        $rootScope.$broadcast('getLog', { log: "You are attacked by " + enemyName + "." });
        $rootScope.$broadcast('getBackground', { image: UtilService.getImagePath(UtilService.randomFromArray(DataService.images.space)) });
        $rootScope.$broadcast('getForeground', { image: UtilService.getImagePath($rootScope.enemy.ship.img) });
        $rootScope.label = "Pirate: " + enemyName;

    };

});