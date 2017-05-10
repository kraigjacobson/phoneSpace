var app = angular.module('spaceApp', [
]);

app.controller('MainController', function(
    $scope,
    $rootScope
){


});

app.controller('ViewscreenController', function(
    $scope,
    UtilService
){
    if(!$scope.image) {
        $scope.image = UtilService.getImage('space');
    }

    $scope.$on('getView', function (event, args) {
        $scope.image = args.image;
    });

});

app.controller('StatsController', function(
    $scope,
    DataService
){

    $scope.stats = DataService.stats;

    $scope.$on('updateStats', function (event, args) {
        $scope.stats = DataService.stats;
    });

});

app.controller('ActionsController', function(
    $scope,
    $rootScope,
    PlayerService,
    UniverseService
){


    $scope.travel = PlayerService.travel;

    $scope.merchant = function () {
        alert('merchant clicked');
    };

    $scope.investigate = function () {
        UniverseService.investigation();
    };

});

app.controller('ConsoleController', function(
    $scope,
    $rootScope
){

    $scope.journal = [];

    $scope.$on('getState', function (event, args) {
        $rootScope.state = args.state;
    });

    $scope.$on('getLog', function (event, args) {
        $scope.journal.unshift(args.log);
    });


});

