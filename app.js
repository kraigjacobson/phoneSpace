var app = angular.module('spaceApp', ['ui.router', 'ngSanitize']);

app.run(['$state', '$stateParams', '$rootScope', '$transitions', '$location', '$window', 'GenerateService', 'InventoryService', 'DataService', 'NewGameService', function ($state, $stateParams, $rootScope, $transitions, $location, $window, GenerateService, InventoryService, DataService, NewGameService) {

    if (localStorage.gameStorage) {
        alert('saved game loaded');
    } else {
        NewGameService.init();
    }

    $rootScope.stationTemps = {};
    $rootScope.state = $state;
    $rootScope.stateParams = $stateParams;

    $transitions.onStart({}, function () {
        if (!$window.ga) {
            return;
        }
        $window.ga('send', 'pageview', {page: $location.path()});
    });

}]);

app.controller('MainController', ['$scope', '$rootScope',
    function ($scope, $rootScope) {

        $rootScope.starfield = false;
        $rootScope.doneLoading = true;

    }]);

app.controller('StationController', ['$scope', '$rootScope', 'UtilService', 'GenerateService', 'InventoryService', 'DataService',
    function ($scope, $rootScope, UtilService, GenerateService, InventoryService, DataService) {

        // generate merchant at station
        console.log();
        if (!$rootScope.stationTemps.name) {
            var roll = UtilService.random(5, 15);
            var tempArray = [];
            for (k = 0; k < roll; k++) {
                var item = GenerateService.generateItem('any', .3);
                tempArray.unshift(item);
            }
            InventoryService.merchantInventory = tempArray;
            $rootScope.stationTemps.name = GenerateService.generateStationName();
            DataService.log.unshift('You arrive at ' + $rootScope.stationTemps.name + '.');
            $rootScope.stationTemps.stationImage = UtilService.getImagePath(UtilService.randomFromArray(DataService.images.stations));
        }
        $rootScope.foreground = $rootScope.stationTemps.stationImage;
        $rootScope.background = UtilService.getImagePath(UtilService.randomFromArray(DataService.images.space));
        $rootScope.label = $rootScope.stationTemps.name;

    }]);

app.controller('ServicesController', ['$scope', '$rootScope', 'UtilService', 'DataService',
    function ($scope, $rootScope, UtilService, DataService) {

        $scope.services = DataService.services;

        $rootScope.label = $rootScope.stationTemps.name + " | Services";
        $rootScope.foreground = UtilService.getImagePath(UtilService.randomFromArray(DataService.images.services));

    }]);

app.controller('StockDetailController', ['$scope', '$rootScope', '$stateParams', 'StockService', 'UtilService', 'DataService',
    function ($scope, $rootScope, $stateParams, StockService, UtilService, DataService) {
        $scope.stock = (StockService.getStock($stateParams.ticker).stock);
        $scope.index = (StockService.getStock($stateParams.ticker).index);
        $scope.stockMarket = DataService.stockMarket;
        console.log($scope.stockMarket);
        $scope.dateBefore = UtilService.dateBefore;
        $scope.dateNow = UtilService.dateNow;
        $scope.stockQty = 0;
        $scope.trade = StockService.trade;
        $scope.wkChange = StockService.calculateValues($scope.stock, 7);
        $scope.moChange = StockService.calculateValues($scope.stock, 30);
        $scope.drawChart = StockService.drawChart;
        $scope.stockInterval = 2;

        $scope.increaseQty = function () {
            if (($scope.stockQty + 1) * $scope.stock.value[0] <= DataService.stats.credits) {
                $scope.stockQty++;
            }
        };

        $scope.decreaseQty = function () {
            if ($scope.stockQty - 1 >= -$scope.stock.myShares) {
                $scope.stockQty--;
            }
        };

        setTimeout(function () {
            StockService.drawChart(7, $scope.stock);
        }, 100);

        $scope.$on('stockInterval', function (event, args) {

            $scope.stockInterval = args.stockInterval;

        });

    }]);

app.controller('ViewscreenController', ['$scope', '$rootScope', 'UtilService', 'DataService',
    function ($scope, $rootScope, UtilService, DataService) {
        document.getElementById('starfield').style.display = 'block';
        if (!$rootScope.background) {
            $rootScope.background = UtilService.getImagePath(UtilService.randomFromArray(DataService.images.space));
        }

    }]);

app.controller('QuickStatsController', ['$scope', '$rootScope', 'UtilService', 'DataService',
    function ($scope, $rootScope, UtilService, DataService) {

        $scope.stats = DataService.stats;

    }]);

app.controller('MapController', ['PathfinderService',
    function (PathfinderService) {

        PathfinderService.drawMap();

    }]);

app.controller('ActionController', ['$scope', '$rootScope', '$state', 'InventoryService', 'ActionService', 'UniverseService', 'DataService',
    function ($scope, $rootScope, $state, InventoryService, ActionService, UniverseService, DataService) {

        $rootScope.investigated = true;
        $scope.stats = DataService.stats;
        $scope.state = $state;
        $rootScope.station = true;
        $scope.action = ActionService;
        $scope.investigate = function () {
            UniverseService.investigation();
        };
        $scope.currentState = $state.current;

    }]);

app.controller('ConsoleController', ['$scope', '$rootScope', '$state', '$transitions', '$timeout', '$stateParams', '$sce', 'BlackjackService', 'DataService', 'ActionService', 'ItemService', 'InventoryService', 'GenerateService', 'PathfinderService',
    function ($scope, $rootScope, $state, $transitions, $timeout, $stateParams, $sce, BlackjackService, DataService, ActionService, ItemService, InventoryService, GenerateService, PathfinderService) {

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
        $scope.action = ActionService;
        $scope.policies = GenerateService.getInsuranceRates();
        $scope.getPolicy = GenerateService.generateInsurancePolicy;
        $scope.policy = DataService.policy;
        $scope.blackjack = BlackjackService;
        $scope.stockMarket = DataService.stockMarket;
        $scope.currentWeek = DataService.currentWeek;

    }]);

// app.controller('ModalController', ['$scope', 'close', 'DataService', 'ItemService', 'InventoryService',
//     function( $scope, close, DataService, ItemService, InventoryService ) {
//
//     $scope.close = function(result) {
//         close(result, 500); // close, but give 500ms for bootstrap to animate
//     };
//     $scope.componentInventory = InventoryService.componentInventory;
//     $scope.inventory = InventoryService.inventory;
//     $scope.merchantInventory = InventoryService.merchantInventory;
//     $scope.myShip = InventoryService.myShip;
//     $scope.repairItem = ItemService.repairItem;
//     $scope.deleteItem = ItemService.deleteItem;
//     $scope.itemIndex = ItemService.currentItemIndex;
//     $scope.stats = DataService.stats;
//
// }]);

app.directive('backgroundImg', [function () {
    return function (scope, element, attrs) {
        element.css({
            'background-image': 'url(' + attrs.backgroundImageDirective + ')',
            'background-repeat': 'no-repeat'
        });
    };
}]);
