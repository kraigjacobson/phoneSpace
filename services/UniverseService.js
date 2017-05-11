app.service('UniverseService', function($rootScope, $state, UtilService, DataService){

    var self = this;

    this.currentState = "station";

    this.event = function () {

        var roll = UtilService.random(1,20);

        if (roll <= 3) {
            self.currentState = "weird";
            self.weird();
        } else if (roll <= 6) {
            self.currentState = "opportunity";
            self.opportunity();
        } else if (roll <= 9) {
            self.currentState = "merchant";
            self.merchant();
        } else if (roll <= 12) {
            self.currentState = "ship issue";
        } else if (roll <= 15) {
            self.currentState = "combat";
        } else {
            self.currentState = "nothing";
        }

        self.updateState();
        return self.currentState;

    };

    this.investigation = function () {


        $state.go('log').then(function () {

            var roll = UtilService.random(1,20);

            if (roll <= 3) {
                $rootScope.$broadcast('getLog', { log: "It's a trap! You are ambushed by ." + "addBadGuysHere" });
            } else if (roll <= 6) {
                var credits = self.gainCredits(1,5);
                var item = UtilService.generateItem();
                $rootScope.$broadcast('getLog', { log: "You manage to find " + credits + " credits and a " + item.slug + " ." });
            } else if (roll <= 9) {
                var credits = self.gainCredits(1,5);
                $rootScope.$broadcast('getLog', { log: "You manage to find " + credits + " credits." });
            } else if (roll <= 12) {
                var item = UtilService.generateItem();
                $rootScope.$broadcast('getLog', { log: "You manage to find a " + item.slug + "." });
            } else {
                $rootScope.$broadcast('getLog', { log: "You don't find anything interesting." });
            }

        });

    };

    this.gainCredits = function (minBase, maxBase) {
        var credits = UtilService.random(minBase*DataService.stats.level, maxBase*DataService.stats.level);
        DataService.stats.credits += credits;
        $rootScope.$broadcast('updateStats');
        return credits;
    };

    this.gainItems = function () {

    };

    this.weird = function() {

        $rootScope.$broadcast('getLog', { log: UtilService.randomFromArray(DataService.text.weird) });
        $rootScope.$broadcast('getView', { image: UtilService.getImage('space') });

    };

    this.merchant = function() {

        $rootScope.$broadcast('getLog', { log: "You come across a merchant named " + UtilService.fullName() + "." });

    };

    this.opportunity = function() {
        $rootScope.$broadcast('getLog', { log: "You come across a wrecked ship floating in space." });
    };

    this.shipIssue = function() {

    };

    this.combat = function() {

    };

    this.updateState = function () {

        $rootScope.$broadcast('getState', { state: self.currentState });

    };

    self.updateState();

});