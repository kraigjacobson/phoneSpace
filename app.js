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

        .state('ship', {
            url: '/ship',
            templateUrl: 'partials/ship.html'
        });

});

app.run(function($transitions, $location, $window, GenerateService, InventoryService, DataService, NewGameService) {

    NewGameService.init();

    console.log("myShip:", InventoryService.myShip);
    console.log("stats:", DataService.stats);


    $transitions.onStart( {}, function() {
        if (!$window.ga) {
            return;
        }
        $window.ga('send', 'pageview', { page: $location.path() });
    });
});

app.controller('MainController', function( $scope, $rootScope ){

    $rootScope.starfield = false;
    $rootScope.label = "Deep Space";

});

app.controller('ViewscreenController', function( $scope, $rootScope, UtilService, DataService ){
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

app.controller('StatsController', function( $scope, DataService ){

    $scope.stats = DataService.stats;

});

app.controller('ActionController', function( $scope, $rootScope, ActionService, UniverseService ){

    $rootScope.investigated = true;

    $scope.action = ActionService;

    $scope.merchant = function () {

    };

    $scope.investigate = function () {
        UniverseService.investigation();
    };

});

app.controller('ConsoleController', function( $scope, $rootScope, ModalService, DataService, ActionService, ItemService, InventoryService ){

    $scope.ships = DataService.ships;
    $scope.log = DataService.log;
    $scope.inventory = InventoryService.inventory;
    $scope.details = ItemService.details;
    $scope.deleteItem = ItemService.deleteItem;
    $scope.myShip = InventoryService.myShip;

    $scope.$on('getState', function (event, args) {
        $rootScope.state = args.state;
    });

    $scope.$on('getLog', function (event, args) {
        DataService.log.unshift(args.log);
    });

});

app.controller('ModalController', function( $scope, close, DataService, ItemService, InventoryService ) {

    $scope.close = function(result) {
        close(result, 500); // close, but give 500ms for bootstrap to animate
    };
    $scope.componentInventory = InventoryService.componentInventory;
    $scope.inventory = InventoryService.inventory;
    $scope.myShip = InventoryService.myShip;
    $scope.repairItem = ItemService.repairItem;
    $scope.deleteItem = ItemService.deleteItem;
    $scope.itemIndex = ItemService.currentItemIndex;

});

app.directive('backgroundImg', function () {
    return function (scope, element, attrs) {
        element.css({
            'background-image': 'url(' + attrs.backgroundImageDirective + ')',
            'background-repeat': 'no-repeat'
        });
    };
});