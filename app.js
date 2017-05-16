var app = angular.module('spaceApp', [ 'ui.router', 'angularModalService']);

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

    $rootScope.starfield = false;
    $rootScope.label = "Deep Space";

});

app.controller('ViewscreenController', function(
    $scope,
    $rootScope,
    UtilService,
    DataService
){

    $("#starfield").hide();
    if(!$rootScope.foreground) {
        $rootScope.background = UtilService.getImagePath(UtilService.randomFromArray(DataService.images.space));
    }

    $scope.$on('getBackground', function (event, args) {
        $rootScope.background = args.image;
    });

    $scope.$on('getForeground', function (event, args) {
        $rootScope.foreground = args.image;
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
    ModalService,
    DataService,
    ActionService
){

    $scope.ships = DataService.ships;
    $scope.log = DataService.log;
    $scope.inventory = DataService.inventory;
    $scope.details = ActionService.details;
    $scope.deleteItem = ActionService.deleteItem;


    $scope.show = function() {
        ModalService.showModal({
            templateUrl: 'partials/item.html',
            controller: "ModalController"
        }).then(function(modal) {
            modal.element.modal();
            modal.close.then(function(result) {
                $scope.message = "You said " + result;
            });
        });
    };

    $scope.$on('getState', function (event, args) {
        $rootScope.state = args.state;
    });

    $scope.$on('getLog', function (event, args) {
        DataService.log.unshift(args.log);
    });

});

// bootstrap modal start


app.controller('ModalController', function($scope, close) {

    $scope.close = function(result) {
        close(result, 500); // close, but give 500ms for bootstrap to animate
    };

});
// bootstrap modal end

app.directive('backgroundImg', function () {
    return function (scope, element, attrs) {
        element.css({
            'background-image': 'url(' + attrs.backgroundImageDirective + ')',
            'background-repeat': 'no-repeat'
        });
    };
});