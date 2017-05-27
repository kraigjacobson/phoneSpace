app.service('UniverseService', function($rootScope, $state, UtilService, DataService, GenerateService, InventoryService, ItemService){

    var self = this;

    $rootScope.currentState = "station";

    this.event = function (forcedEvent) {

        if (!forcedEvent) {
            var roll = UtilService.random(1,55);
            // var roll = 28;
        }

        if (roll <= 5 || forcedEvent === 'wierd') {
            $rootScope.currentState = "weird";
            self.weird();
        } else if (roll <= 15 || forcedEvent === 'opportunity') {
            $rootScope.currentState = "opportunity";
            self.opportunity();
        // } else if (roll <= 20 || forcedEvent === 'merchant') {
        //     $rootScope.currentState = "merchant";
        //     self.merchant();
        } else if (roll <= 22 || forcedEvent === 'ship issue') {
            var randomShipPart = UtilService.randomFromArray(Object.keys(InventoryService.myShip));
            if (InventoryService.myShip[randomShipPart].componentsNeeded.length !== 0) {
                self.event();
            } else {
                $rootScope.currentState = "ship issue";
                self.shipIssue(randomShipPart);
            }
        } else if (roll <= 30 || forcedEvent === 'station') {
            $rootScope.currentState = "station";
            self.station();
        } else if (roll <= 40 || forcedEvent === 'planet') {
            $rootScope.currentState = "planet";
            self.planet();
        } else if (roll <= 50 || forcedEvent === 'combat') {
            $rootScope.currentState = "combat";
            self.combat();
        } else {
            $rootScope.currentState = "nothing";
            $rootScope.$broadcast('getBackground', { image: UtilService.getImagePath(UtilService.randomFromArray(DataService.images.space)) });
            $rootScope.$broadcast('getForeground', { image: '' });
            $rootScope.label = "Deep Space";
        }

    };

    this.weird = function() {

        DataService.log.unshift(UtilService.randomFromArray(DataService.text.weird));
        $rootScope.$broadcast('getBackground', { image: null });
        $rootScope.label = "Deep Space";

    };

    this.merchant = function() {
        var roll = UtilService.random(3,10);
        var tempArray = [];
        for (k = 0; k < roll; k++) {
            var item = GenerateService.generateItem('any',.6);
            tempArray.unshift(item);
        }
        InventoryService.merchantInventory = tempArray;
        var merchantName = GenerateService.generateFullName();
        DataService.log.unshift("You come across a merchant named " + merchantName + ".");
        $rootScope.$broadcast('getBackground', { image: UtilService.getImagePath(UtilService.randomFromArray(DataService.images.space)) });
        $rootScope.$broadcast('getForeground', { image: UtilService.getImagePath("merchant.png") });
        $rootScope.label = "Merchant: " + merchantName;

    };

    this.opportunity = function() {
        $rootScope.investigated = false;
        DataService.log.unshift("You come across a wrecked ship floating in space.");
        $rootScope.$broadcast('getBackground', { image: UtilService.getImagePath(UtilService.randomFromArray(DataService.images.space)) });
        $rootScope.$broadcast('getForeground', { image: UtilService.getImagePath(UtilService.randomFromArray(DataService.images.wrecks)) });
        $rootScope.label = "Wrecked Ship";
    };

    this.shipIssue = function(randomShipPart) {

        var partItemLevel = InventoryService.myShip[randomShipPart].level;
        var damage = ItemService.damageItem(1,partItemLevel,1,3);
        InventoryService.myShip[randomShipPart].componentsNeeded = damage.componentsNeeded; // bug here, will replace whole components needed object, even if there are already damaged items in it
        InventoryService.myShip[randomShipPart].penalty = damage.penalty; // bug here, will replace penalty even if there already is one
        InventoryService.myShip[randomShipPart].currentEffectiveness -= damage.penalty;
        InventoryService.myShip[randomShipPart].currentValue - damage.penalty*partItemLevel < 0 ? InventoryService.myShip[randomShipPart].currentValue = 0 : Math.floor(InventoryService.myShip[randomShipPart].currentValue -= damage.penalty*partItemLevel);
        DataService.log.unshift('Your ' + randomShipPart + ' has malfunctioned and needs new parts!');
        $rootScope.$broadcast('getBackground', { image: UtilService.getImagePath(UtilService.randomFromArray(DataService.images.space)) });
        $rootScope.$broadcast('getForeground', { image: UtilService.getImagePath(DataService.images.blank) });
        $rootScope.label = "Deep Space";
    };

    this.station = function() {
        DataService.station = true;
        // generate merchant at station
        var roll = UtilService.random(5,15);
        var tempArray = [];
        for (k = 0; k < roll; k++) {
            var item = GenerateService.generateItem('any',.3);
            tempArray.unshift(item);
        }

        InventoryService.merchantInventory = tempArray;
        DataService.log.unshift('You arrive at a station.');
        $rootScope.$broadcast('getForeground', { image: UtilService.getImagePath(UtilService.randomFromArray(DataService.images.stations)) });
        $rootScope.$broadcast('getBackground', { image: UtilService.getImagePath(UtilService.randomFromArray(DataService.images.space)) });
        $rootScope.label = "Station";
    };

    this.planet = function() {
        DataService.log.unshift('You arrive at a planet.');
        $rootScope.$broadcast('getForeground', { image: UtilService.getImagePath(UtilService.randomFromArray(DataService.images.planets)) });
        $rootScope.$broadcast('getBackground', { image: UtilService.getImagePath(UtilService.randomFromArray(DataService.images.space)) });
        $rootScope.label = "Planet";
    };

    this.combat = function() {
        var enemyName = GenerateService.generateFullName();
        $rootScope.enemy = GenerateService.generateEnemy();
        DataService.log.unshift("You are attacked by " + enemyName + ".");
        $rootScope.$broadcast('getBackground', { image: UtilService.getImagePath(UtilService.randomFromArray(DataService.images.space)) });
        $rootScope.$broadcast('getForeground', { image: UtilService.getImagePath($rootScope.enemy.ship.img) });
        $rootScope.label = "Pirate: " + enemyName;

    };

});