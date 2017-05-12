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
            self.opportunity();
        } else if (roll <= 9) {
            $rootScope.currentState = "merchant";
            self.merchant();
        } else if (roll <= 12) {
            $rootScope.currentState = "ship issue";
        } else if (roll <= 15) {
            $rootScope.currentState = "combat";
        } else {
            $rootScope.currentState = "nothing";
        }

    };

    this.weird = function() {

        $rootScope.$broadcast('getLog', { log: UtilService.randomFromArray(DataService.text.weird) });
        $rootScope.$broadcast('getView', { image: UtilService.getImage('space') });

    };

    this.merchant = function() {

        $rootScope.$broadcast('getLog', { log: "You come across a merchant named " + UtilService.fullName() + "." });

    };

    this.opportunity = function() {
        $rootScope.investigated = false;
        $rootScope.$broadcast('getLog', { log: "You come across a wrecked ship floating in space." });
    };

    this.shipIssue = function() {

    };

    this.combat = function() {

    };

});