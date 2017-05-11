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
        })

        .state('settings', {
            url: '/settings',
            templateUrl: 'partials/settings.html'
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

app.controller('ActionController', function(
    $scope,
    $rootScope,
    ActionService,
    UniverseService
){

    $rootScope.investigated = true;

    $scope.action = ActionService;

    $scope.merchant = function () {

    };

    $scope.investigate = function () {
        UniverseService.investigation();
    };

});

app.controller('ConsoleController', function(
    $scope,
    $rootScope,
    DataService
){

    $scope.log = DataService.log;
    $scope.inventory = DataService.inventory;

    $scope.$on('getState', function (event, args) {
        $rootScope.state = args.state;
    });

    $scope.$on('getLog', function (event, args) {
        DataService.log.unshift(args.log);
    });


});

