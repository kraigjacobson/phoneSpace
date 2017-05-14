app.service('UniverseService', function($rootScope, $state, UtilService, DataService){

    var self = this;

    $rootScope.currentState = "station";

    this.event = function () {

        var roll = UtilService.random(1,20);

        if (roll <= 3) {
            $rootScope.currentState = "weird";
            self.weird();
        } else if (roll <= 6) {
            $rootScope.currentState = "opportunity";
            $rootScope.investigated = false;
            self.opportunity();
        } else if (roll <= 9) {
            $rootScope.currentState = "merchant";
            self.merchant();
        } else if (roll <= 12) {
            $rootScope.currentState = "ship issue";
        } else if (roll <= 15) {
            $rootScope.currentState = "combat";
            self.combat();
        } else {
            $rootScope.currentState = "nothing";
            $rootScope.$broadcast('getView', { image: UtilService.getImagePath(UtilService.randomFromArray(DataService.images.space)) });
            $rootScope.label = "Deep Space";
        }

    };

    this.weird = function() {

        $rootScope.$broadcast('getLog', { log: UtilService.randomFromArray(DataService.text.weird) });
        $rootScope.$broadcast('getView', { image: UtilService.getImagePath(UtilService.randomFromArray(DataService.images.space)) });
        $rootScope.label = "Deep Space";

    };

    this.merchant = function() {
        var merchantName = UtilService.fullName();
        $rootScope.$broadcast('getLog', { log: "You come across a merchant named " + merchantName + "." });
        $rootScope.$broadcast('getView', { image: UtilService.getImagePath("merchant.png") });
        $rootScope.label = "Merchant: " + merchantName;

    };

    this.opportunity = function() {
        $rootScope.investigated = false;
        $rootScope.$broadcast('getLog', { log: "You come across a wrecked ship floating in space." });
        $rootScope.$broadcast('getView', { image: UtilService.getImagePath(UtilService.randomFromArray(DataService.images.wrecks)) });
        $rootScope.label = "Wrecked Ship";
    };

    this.shipIssue = function() {

    };

    this.combat = function() {
        var enemyName = UtilService.fullName();
        $rootScope.enemy = UtilService.generateEnemy();
        $rootScope.$broadcast('getLog', { log: "You are attacked by " + enemyName + "." });
        $rootScope.$broadcast('getView', { image: UtilService.getImagePath($rootScope.enemy.ship.img) });
        $rootScope.label = "Pirate: " + enemyName;

    };

});