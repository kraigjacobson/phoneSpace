app.service('NewGameService', function( $rootScope, DataService, GenerateService, InventoryService, UniverseService, UtilService ){
    
    this.init = function () {

        var ship = InventoryService.myShip;
        var stats = DataService.stats;

        // get starting ship

        var firstShip = DataService.ships["scout"];

        // get starting ship parts

        ship.weapon = GenerateService.generateItem("weapon", true);
        ship.targetingChip = GenerateService.generateItem("targetingChip", true);
        ship.hyperdrive = GenerateService.generateItem("hyperdrive", true);
        ship.thrusters = GenerateService.generateItem("thrusters", true);
        ship.shieldCell = GenerateService.generateItem("shieldCell", true);
        ship.armor = GenerateService.generateItem("armor", true);
        // ship.cargoHold = GenerateService.generateItem("capacity", true);

        // calculate total stats

        stats.ship = firstShip.name;
        stats.attack += firstShip.attack + ship.weapon.currentEffectiveness;
        stats.accuracy += firstShip.accuracy + ship.targetingChip.currentEffectiveness;
        stats.speed += firstShip.speed + ship.hyperdrive.currentEffectiveness;
        stats.maneuverability += firstShip.maneuverability + ship.thrusters.currentEffectiveness;
        stats.shield += firstShip.shield + ship.shieldCell.currentEffectiveness;
        stats.hull += firstShip.hull + ship.armor.currentEffectiveness;
        stats.currentShield += stats.shield;
        stats.currentHull += stats.hull;
        // stats.capacity += firstShip.capacity + ship.cargoHold.currentEffectiveness;

        UniverseService.event(10);
        UtilService.getExperience(0);

    }

});