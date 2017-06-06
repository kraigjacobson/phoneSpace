var app = angular.module('spaceApp');
app.service('UniverseService', function($rootScope, $state, UtilService, DataService, GenerateService, InventoryService, ItemService){

    var self = this;

    this.event = function (forcedEvent) {

        if (!forcedEvent) {
            var roll = UtilService.random(1,34);
            // var roll = UtilService.random(1,10);
            // var roll = 28;
        }

        if (roll <= 2 || forcedEvent === 'wierd') {
            $rootScope.currentState = "weird";
            self.weird();
        } else if (roll <= 12 || forcedEvent === 'opportunity') {
            $rootScope.currentState = "opportunity";
            self.opportunity();
        } else if (roll <= 14 || forcedEvent === 'ship issue') {
            var randomShipPart = UtilService.randomFromArray(Object.keys(InventoryService.myShip));
            if (InventoryService.myShip[randomShipPart].componentsNeeded.length !== 0) {
                self.event();
            } else {
                $rootScope.currentState = "ship issue";
                self.shipIssue(randomShipPart);
            }
        } else if (roll <= 22 || forcedEvent === 'station') {
            $state.go('station');
        } else if (roll <= 24 || forcedEvent === 'planet') {
            $rootScope.currentState = "planet";
            self.planet();
        } else if (roll <= 34 || forcedEvent === 'combat') {
            $rootScope.currentState = "combat";
            self.combat();
        } else {
            $rootScope.background = UtilService.getImagePath(UtilService.randomFromArray(DataService.images.space));
            $rootScope.foreground = '';
            $rootScope.label = "Deep Space";
        }

    };

    this.weird = function() {

        DataService.log.unshift(UtilService.randomFromArray(DataService.text.weird));
        $rootScope.background = UtilService.getImagePath(UtilService.randomFromArray(DataService.images.space));
        $rootScope.label = "Deep Space";

    };

    this.opportunity = function() {
        DataService.log.unshift("You come across a wrecked ship floating in space.");
        $rootScope.background = UtilService.getImagePath(UtilService.randomFromArray(DataService.images.space));
        $rootScope.foreground = UtilService.getImagePath(UtilService.randomFromArray(DataService.images.wrecks));
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
        $rootScope.background = UtilService.getImagePath(UtilService.randomFromArray(DataService.images.space));
        $rootScope.foreground = UtilService.getImagePath(DataService.images.blank);
        $rootScope.label = "Deep Space";
    };

    this.planet = function() {
        DataService.log.unshift('You arrive at a planet.');
        $rootScope.background = UtilService.getImagePath(UtilService.randomFromArray(DataService.images.space));
        $rootScope.foreground = UtilService.getImagePath(UtilService.randomFromArray(DataService.images.planets));
        $rootScope.label = "Planet";
    };

    this.combat = function() {
        $rootScope.combat = true;
        $rootScope.enemy = GenerateService.generateEnemy();
        DataService.log.unshift("You are attacked by " + $rootScope.enemy.name + ".");
        $rootScope.background = UtilService.getImagePath(UtilService.randomFromArray(DataService.images.space));
        $rootScope.foreground = UtilService.getImagePath($rootScope.enemy.ship.img);
        $rootScope.label = "Pirate: " + $rootScope.enemy.name;

    };

});