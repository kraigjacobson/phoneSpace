var app = angular.module('spaceApp');
app.service('StockService', ['$rootScope', 'UtilService', 'GenerateService', 'DataService', function ($rootScope, UtilService, GenerateService, DataService) {

    var self = this;

    this.generateCompany = function () {

        var firstArray = [GenerateService.generateName()];
        var genericSuffixes = ['intergalactic', 'global', 'corporation', 'incorporated', 'union', 'syndicate', 'enterprises'];
        var suffixes = {
            aerospace: ['aeronautics', 'aerospace', 'technologies', 'tech'],
            pharmaceuticals: ['pharmaceuticals', 'drug'],
            technology: ['tech', 'technologies', 'systems', 'solutions'],
            financial: ['bank', 'mutual'],
            distribution: ['distribution', 'logistics'],
            manufacturing: ['manufacturing'],
            telecommunications: ['media', 'telecommunications', 'communications'],
            energy: ['energy', 'solutions']
        };

        var industry = UtilService.randomFromArray(Object.keys(suffixes));
        var first = UtilService.randomFromArray(firstArray);
        var suffix = UtilService.randomFromArray(suffixes[industry].concat(genericSuffixes));

        var type = UtilService.randomFromArray(Object.keys(self.weights));

        var company = {
            name: first + ' ' + suffix,
            ticker: first.charAt(0) + (first.charAt(3) ? first.charAt(3) : first.charAt(1)).toUpperCase() + suffix.charAt(0).toUpperCase(),
            type: type,
            growth: self.weights[type].growth,
            spread: self.weights[type].spread,
            value: [parseFloat(self.weights[type].startPrice + UtilService.random(-self.weights[type].startPrice * .1, self.weights[type].startPrice * .1) + Math.random().toFixed(2))],
            change: null,
            changePercent: null,
            industry: industry,
            // myShares: UtilService.random(0,3),
            myShares: 0,
            trendDaysLeft: UtilService.random(1, 30),
            trendRate: self.getRateOfChange(),
            transactions: []
        };

        return company;

    };

    this.change = function () {

        angular.forEach(DataService.stockMarket, function (stock) {
            var marketGrowth = .004;
            var oldValue = stock.value[stock.value.length - 1];
            var growth = stock.value + stock.growth;
            if (stock.trendDaysLeft === 0) {
                stock.trendDaysLeft = UtilService.random(1, 30);
                stock.trendRate = self.getRateOfChange();
            }
            stock.changePercent = self.getRateOfChange();
            stock.change = parseFloat((oldValue * stock.changePercent).toFixed(4));
            var newValue = parseFloat((oldValue + stock.change + stock.trendRate + marketGrowth).toFixed(2));
            stock.value.push(newValue);
            stock.trendDaysLeft--;
        });

    };

    this.trade = function (qty, stock) {
        var tradingFee = 0;
        console.log(stock);
        var price = stock.value[stock.value.length - 1];
        var totalGross = parseFloat((qty * price).toFixed(2)) + tradingFee;
        var totalNet = parseFloat((qty * price).toFixed(2));
        if (qty < 0) {
            // selling
            if (qty <= stock.myShares) {
                // sell successful
                alert('transaction successful');
                DataService.log.unshift('You sold ' + (qty * -1) + ' shares of ' + stock.ticker + ' for Ᵽ' + (totalGross * -1) + '.');
                DataService.stats.credits -= totalGross;
                stock.myShares += qty;
                DataService.stats.stockSales += totalNet;
                DataService.stats.sharesSold += qty;
                stock.transactions.push(self.transaction(qty, price, totalNet, 'fixlater'));
                console.log(stock);
            } else {
                // not enough stock to sell
                alert('not enough stock to sell');
            }
        } else if (qty > 0) {
            // buying
            if (totalGross <= DataService.stats.credits) {
                // buy successful
                DataService.log.unshift('You purchased ' + qty + ' shares of ' + stock.ticker + ' for Ᵽ' + totalGross + '.');
                alert('transaction successful');
                DataService.stats.credits -= totalGross;
                stock.myShares += qty;
                DataService.stats.stockPurchases += totalNet;
                DataService.stats.sharesPurchased += qty;
                stock.transactions.push(self.transaction(qty, price, totalNet, 'fixlater'));
                console.log(stock);
            } else {
                // buy failed
                alert('not enough credits');
            }
        }
    };

    this.transaction = function (qty, price, total, date) {
        o = {};
        o.qty = qty;
        o.price = price;
        o.total = total;
        o.date = date;
        return o;

    };

    this.calculateValues = function (stock, days) {

        o = {};

        o.val = stock.value[stock.value.length - 1] - stock.value[stock.value.length - days + 1];
        o.ratio = (stock.value[stock.value.length - 1] - stock.value[stock.value.length - days + 1]) / stock.value[stock.value.length - 1];

        return o;

    };

    this.drawChart = function (days, stock) {

        var numberDays = days;

        $rootScope.$broadcast('stockInterval', {stockInterval: days});

        var getLabels = function (numberDays) {
            var labels = [];
            for (l = 1; l < numberDays + 1; l++) {
                labels.push(l);
            }
            return labels;
        };

        var ctx = document.getElementById("myChart").getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: getLabels(numberDays),
                datasets: [{
                    label: 'Value',
                    data: stock.value.slice(stock.value.length - numberDays, stock.value.length),
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.2)'
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                legend: {
                    display: false
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: false,
                            callback: function (value, index, values) {
                                return 'Ᵽ' + value;
                            }
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            fontSize: 8,
                            display: false
                        }
                    }]
                }
            }
        });
    };

    this.getStock = function (symbol) {

        for (s = 0; s < DataService.stockMarket.length; s++) {
            if (symbol === DataService.stockMarket[s].ticker) {
                return {
                    stock: DataService.stockMarket[s],
                    index: s
                };
            }
        }
    };

    this.getRateOfChange = function () {
        return parseFloat((UtilService.random(-1, 1, true) / 30).toFixed(4));
    };

    this.weights = {
        big: {
            growth: 1.5,
            spread: 2,
            startPrice: 1000
        },
        mid: {
            growth: 2,
            spread: 3,
            startPrice: 100
        },
        small: {
            growth: 2.5,
            spread: 4,
            startPrice: 10
        }
    }

}]);