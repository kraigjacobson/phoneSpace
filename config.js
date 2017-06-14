var app = angular.module('spaceApp');
app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/station');

    $stateProvider

        .state('log', {
            templateUrl: 'partials/log.html'
        })

        .state('stats', {
            templateUrl: 'partials/stats.html'
        })

        .state('inventory-selection', {
            templateUrl: 'partials/inventory-selection.html'
        })

        .state('inventory', {
            templateUrl: 'partials/inventory.html'
        })

        .state('ship', {
            templateUrl: 'partials/ship.html'
        })

        .state('map', {
            templateUrl: 'partials/map.html'
        })


        .state('station', {
            url: '/station',
            templateUrl: 'partials/log.html',
            controller: 'StationController'
        })

        .state('services', {
            url: '/station/services',
            templateUrl: 'partials/services.html',
            controller: 'ServicesController'
        })

        .state('bountyOffice', {
            url: '/station/services/bounty-office',
            templateUrl: 'partials/bounty-office.html',
            controller: ['$rootScope', 'UtilService', 'DataService', function ($rootScope, UtilService, DataService) {
                $rootScope.label = $rootScope.stationTemps.name + " | Bounty Office";
                $rootScope.foreground = UtilService.getImagePath(UtilService.randomFromArray(DataService.images.bountyOffice));
            }]
        })

        .state('casino', {
            url: '/station/services/casino',
            templateUrl: 'partials/casino.html',
            controller: ['$rootScope', 'UtilService', 'DataService', 'GenerateService', function ($rootScope, UtilService, DataService, GenerateService) {
                if (!$rootScope.stationTemps.casino) {
                    $rootScope.stationTemps.casino = {};
                    $rootScope.stationTemps.casino.name = GenerateService.generateName();
                    $rootScope.stationTemps.casino.image = UtilService.getImagePath(UtilService.randomFromArray(DataService.images.casino));
                }
                $rootScope.label = $rootScope.stationTemps.name + " | " + $rootScope.stationTemps.casino.name + " Casino";
                $rootScope.foreground = $rootScope.stationTemps.casino.image;
            }]
        })

        .state('blackjack', {
            url: '/station/services/casino/blackjack',
            templateUrl: 'partials/blackjack.html'
        })

        .state('insurance', {
            url: '/station/services/insurance',
            templateUrl: 'partials/insurance.html',
            controller: ['$rootScope', 'UtilService', 'DataService', 'GenerateService', function ($rootScope, UtilService, DataService, GenerateService) {
                if (!$rootScope.stationTemps.insurance) {
                    $rootScope.stationTemps.insurance = {};
                    $rootScope.stationTemps.insurance.name = GenerateService.generateName() + ' Insurance';
                    $rootScope.stationTemps.insurance.image = UtilService.getImagePath(UtilService.randomFromArray(DataService.images.insurance));
                }
                $rootScope.label = $rootScope.stationTemps.name + " | " + $rootScope.stationTemps.insurance.name;
                $rootScope.foreground = $rootScope.stationTemps.insurance.image;
            }]
        })

        .state('market', {
            url: '/station/services/market',
            templateUrl: 'partials/buy.html',
            controller: 'ConsoleController'
        })

        .state('nightClub', {
            url: '/station/services/night-club',
            templateUrl: 'partials/night-club.html',
            controller: ['$rootScope', 'UtilService', 'DataService', 'GenerateService', function ($rootScope, UtilService, DataService, GenerateService) {
                if (!$rootScope.stationTemps.nightclub) {
                    $rootScope.stationTemps.nightclub = {};
                    $rootScope.stationTemps.nightclub.name = GenerateService.generateName();
                    $rootScope.stationTemps.nightclub.image = UtilService.getImagePath(UtilService.randomFromArray(DataService.images.nightClub));
                }
                $rootScope.label = $rootScope.stationTemps.name + " | " + $rootScope.stationTemps.nightclub.name;
                $rootScope.foreground = $rootScope.stationTemps.nightclub.image;
            }]
        })

        .state('partInstallation', {
            url: '/station/docking-bay/installation',
            templateUrl: 'partials/inventory.html'
        })

        .state('repair', {
            url: '/station/docking-bay/repair',
            templateUrl: 'partials/repair.html',
            controller: ['$rootScope', 'UtilService', 'DataService', function ($rootScope, UtilService, DataService) {
                $rootScope.label = $rootScope.stationTemps.name + " | " + "Ship Repair";
                $rootScope.foreground = UtilService.getImagePath(UtilService.randomFromArray(DataService.images.repair));
            }]
        })

        .state('reprocessing', {
            url: '/station/docking-bay/reprocessing',
            templateUrl: 'partials/inventory.html',
            controller: ['$rootScope', 'UtilService', 'DataService', function ($rootScope, UtilService, DataService) {
                $rootScope.label = $rootScope.stationTemps.name + " | " + "Reprocessing";
                $rootScope.foreground = UtilService.getImagePath(UtilService.randomFromArray(DataService.images.repair));
            }]
        })

        .state('stockBrokerage', {
            url: '/station/services/stock-brokerage',
            templateUrl: 'partials/stock-brokerage.html',
            controller: ['$rootScope', 'UtilService', 'DataService', function ($rootScope, UtilService, DataService) {
                $rootScope.label = $rootScope.stationTemps.name + " | " + "Stock Brokerage";
                $rootScope.foreground = UtilService.getImagePath(UtilService.randomFromArray(DataService.images.stockBrokerage));
            }]
        })

        .state('stock-detail', {
            url: "/station/services/stock-brokerage/stock-detail-{ticker}",
            templateUrl: 'partials/stock-detail.html',
            controller: 'StockDetailController'
        })

        .state('portfolio', {
            url: "/station/services/stock-brokerage/portfolio",
            templateUrl: 'partials/portfolio.html',
            controller: ['$scope', '$rootScope', 'UtilService', 'DataService', function ($scope, $rootScope, UtilService, DataService) {
                $scope.stockMarket = DataService.stockMarket;
            }]
        })

        .state('docking-bay', {
            url: '/station/docking-bay',
            templateUrl: 'partials/docking-bay.html',
            controller: ['$rootScope', 'UtilService', 'DataService', function ($rootScope, UtilService, DataService) {
                $rootScope.label = $rootScope.stationTemps.name + " | Docking Bay";
                $rootScope.foreground = UtilService.getImagePath(UtilService.randomFromArray(DataService.images.dockingBay));
            }]
        })

        .state('combat', {
            url: '/combat',
            templateUrl: 'partials/log.html'
        })

        .state('planet', {
            url: '/planet',
            templateUrl: 'partials/log.html'
        })

        .state('wreck', {
            url: '/wreck',
            templateUrl: 'partials/log.html'
        })

        .state('ship-issue', {
            url: '/ship-issue',
            templateUrl: 'partials/log.html'
        })

        .state('weird', {
            url: '/weird',
            templateUrl: 'partials/log.html'
        })

        .state('buy', {
            url: '/buy',
            templateUrl: 'partials/buy.html',
            controller: 'ConsoleController'
        })

        .state('sell', {
            url: '/sell',
            templateUrl: 'partials/sell.html'
        });

}]);