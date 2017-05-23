var app = angular.module('spaceApp', [ 'ui.router', 'angularModalService', 'ngSanitize']);

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

        .state('inventory-selection', {
            url: '/inventory-selection',
            templateUrl: 'partials/inventory-selection.html'
        })

        .state('ship', {
            url: '/ship',
            templateUrl: 'partials/ship.html'
        })

        .state('components', {
            url: '/components',
            templateUrl: 'partials/components.html'
        })

        .state('buy', {
            url: '/buy',
            templateUrl: 'partials/buy.html'
        })

        .state('sell', {
            url: '/sell',
            templateUrl: 'partials/sell.html'
        });

});

app.run(function($transitions, $location, $window, GenerateService, InventoryService, DataService, NewGameService) {

    NewGameService.init();

    // console.log("myShip:", InventoryService.myShip);
    // console.log("stats:", DataService.stats);


    $transitions.onStart( {}, function() {
        if (!$window.ga) {
            return;
        }
        $window.ga('send', 'pageview', { page: $location.path() });
    });
});

app.controller('MainController', function( $scope, $rootScope ){

    $rootScope.starfield = false;
    $rootScope.label = "Station";

});

app.controller('ViewscreenController', function( $scope, $rootScope, UtilService, DataService ){
    $("#starfield").hide();
    if(!$rootScope.foreground) {
        $rootScope.background = UtilService.getImagePath(UtilService.randomFromArray(DataService.images.stations));
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

app.controller('ConsoleController', function( $scope, $rootScope, $sce, ModalService, DataService, ActionService, ItemService, InventoryService ){

    $scope.ships = DataService.ships;
    $scope.log = DataService.log;
    $scope.components = InventoryService.componentInventory;
    $scope.inventory = InventoryService.inventory;
    $scope.merchantInventory = InventoryService.merchantInventory;
    $scope.details = ItemService.details;
    $scope.deleteItem = ItemService.deleteItem;
    $scope.fitToShip = ItemService.fitToShip;
    $scope.recycle = ItemService.recycle;
    $scope.sellItem = ItemService.sellItem;
    $scope.buyItem = ItemService.buyItem;
    $scope.goToShip = ActionService.goToShip;
    $scope.goToInventory = ActionService.goToInventory;
    $scope.goToComponents = ActionService.goToComponents;
    $scope.myShip = InventoryService.myShip;
    $scope.itemIndex = ItemService.currentItemIndex;
    $scope.Math = window.Math;

    $scope.$on('getState', function (event, args) {
        $rootScope.state = args.state;
    });

    $scope.$on('getInventory', function (event, args) {
        $rootScope.inventory = args.inventory;
    });

});

app.controller('ModalController', function( $scope, close, DataService, ItemService, InventoryService ) {

    $scope.close = function(result) {
        close(result, 500); // close, but give 500ms for bootstrap to animate
    };
    $scope.componentInventory = InventoryService.componentInventory;
    $scope.inventory = InventoryService.inventory;
    $scope.merchantInventory = InventoryService.merchantInventory;
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