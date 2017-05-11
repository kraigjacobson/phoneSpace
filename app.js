var app = angular.module('spaceApp', [
    'ui.router'
]);

app.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/log');

    $stateProvider

        .state('log', {
            url: '/log',
            templateUrl: 'partials/log.html'
        })

        .state('stats', {
            url: '/stats',
            templateUrl: 'partials/stats.html'
        })

        .state('inventory', {
            url: '/inventory',
            templateUrl: 'partials/inventory.html'
        });

});

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

