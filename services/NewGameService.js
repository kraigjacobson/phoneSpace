var app = angular.module('spaceApp');
app.service('NewGameService', function ($rootScope, $state, DataService, GenerateService, InventoryService, UniverseService, UtilService, StockService) {

    this.init = function () {

        for (coIndex = 0; coIndex < 12; coIndex++) {
            var co = StockService.generateCompany();
            DataService.stockMarket.push(co);
        }

        for (d = 0; d < 30; d++) {
            StockService.change();
            UtilService.newDay();
        }

        $rootScope.bounties = null;
        $rootScope.stationTemps = {};

        var ship = InventoryService.myShip;
        var stats = DataService.stats;

        // get starting ship

        var firstShip = DataService.ships["scout"];

        // get starting ship parts

        ship.weapon = GenerateService.generateItem("weapon", 0);
        ship.targetingChip = GenerateService.generateItem("targetingChip", 0);
        ship.hyperdrive = GenerateService.generateItem("hyperdrive", 0);
        ship.thrusters = GenerateService.generateItem("thrusters", 0);
        ship.shieldCell = GenerateService.generateItem("shieldCell", 0);
        ship.armor = GenerateService.generateItem("armor", 0);
        ship.cargoHold = GenerateService.generateItem("cargoHold", 0);

        // calculate total stats

        stats.ship = firstShip.name;
        stats.attack += firstShip.attack + ship.weapon.currentEffectiveness;
        stats.accuracy += firstShip.accuracy + ship.targetingChip.currentEffectiveness;
        stats.speed += firstShip.speed + ship.hyperdrive.currentEffectiveness;
        stats.piloting += firstShip.piloting + ship.thrusters.currentEffectiveness;
        stats.shield += firstShip.shield + ship.shieldCell.currentEffectiveness;
        stats.hull += firstShip.hull + ship.armor.currentEffectiveness;
        stats.currentShield += stats.shield;
        stats.currentHull += stats.hull;
        stats.capacity += firstShip.capacity + ship.cargoHold.currentEffectiveness;

        DataService.policy = null;

        // $state.go('station');

        // $rootScope.foreground = UtilService.getImagePath(UtilService.randomFromArray(DataService.images.stations));

    };

});