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

    this.investigation = function () {


        $state.go('log').then(function () {

            var roll = UtilService.random(1,20);

            if (roll <= 3) {
                $rootScope.$broadcast('getLog', { log: "It's a trap! You are ambushed by " + "addBadGuysHere" + "." });
            } else if (roll <= 6) {
                var credits = self.gainCredits(1,5);
                var item = UtilService.generateItem();
                DataService.inventory.unshift(item);
                $rootScope.$broadcast('getLog', { log: "You manage to find " + credits + " credits and a " + item.slug + " ." });
            } else if (roll <= 9) {
                var credits = self.gainCredits(1,5);
                $rootScope.$broadcast('getLog', { log: "You manage to find " + credits + " credits." });
            } else if (roll <= 12) {
                var item = UtilService.generateItem();
                DataService.inventory.unshift(item);
                $rootScope.$broadcast('getLog', { log: "You manage to find a " + item.slug + "." });
            } else {
                $rootScope.$broadcast('getLog', { log: "You don't find anything interesting." });
            }

        });

        $rootScope.investigated = true;

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
        $rootScope.investigated = false;
        $rootScope.$broadcast('getLog', { log: "You come across a wrecked ship floating in space." });
    };

    this.shipIssue = function() {

    };

    this.combat = function() {

    };

});