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

        .state('reprocessing', {
            url: '/reprocessing',
            templateUrl: 'partials/inventory.html'
        })

        .state('installation', {
            url: '/installation',
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

        .state('amenities', {
            url: '/amenities',
            templateUrl: 'partials/amenities.html'
        })

        .state('buy', {
            url: '/buy',
            templateUrl: 'partials/buy.html'
        })

        .state('sell', {
            url: '/sell',
            templateUrl: 'partials/sell.html'
        })

        .state('casino', {
            url: '/casino',
            templateUrl: 'partials/casino.html'
        })

        .state('bounty-office', {
            url: '/bounty-office',
            templateUrl: 'partials/bounty-office.html'
        })

        .state('night-club', {
            url: '/night-club',
            templateUrl: 'partials/night-club.html'
        })

        .state('stock-brokerage', {
            url: '/stock-brokerage',
            templateUrl: 'partials/stock-brokerage.html'
        })

        .state('insurance', {
            url: '/insurance',
            templateUrl: 'partials/insurance.html'
        });

});

app.run(function($transitions, $location, $window, GenerateService, InventoryService, DataService, NewGameService) {

    NewGameService.init();

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

app.controller('ActionController', function( $scope, $rootScope, $state, ActionService, UniverseService, DataService ){

    $rootScope.investigated = true;
    $scope.stats = DataService.stats;
    $scope.state = $state;

    $scope.action = ActionService;

    $scope.merchant = function () {

    };

    $scope.investigate = function () {
        UniverseService.investigation();
    };

});

app.controller('ConsoleController', function( $scope, $rootScope, $state, $sce, ModalService, DataService, ActionService, ItemService, InventoryService, GenerateService ){

    $scope.ships = DataService.ships;
    $scope.log = DataService.log;
    $scope.stats = DataService.stats;
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
    $scope.amenities = DataService.amenities;
    $scope.currentState = $state.current.name;
    $scope.state = $state;
    $scope.action = ActionService;
    $scope.policies = GenerateService.getInsuranceRates();
    $scope.getPolicy = GenerateService.generateInsurancePolicy;
    $scope.policy = DataService.policy;
    $scope.station = DataService.station;

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
    $scope.stats = DataService.stats;

});

app.directive('backgroundImg', function () {
    return function (scope, element, attrs) {
        element.css({
            'background-image': 'url(' + attrs.backgroundImageDirective + ')',
            'background-repeat': 'no-repeat'
        });
    };
});