app.service('StockService', function( UtilService, GenerateService, DataService ){

    var self = this;

    this.generateCompany = function () {

        var firstArray = [GenerateService.generateName()];
        var suffixArray = ['Intergalactic','Global','Mutual','Bank','Solutions','Media','Pharmaceuticals','Systems','Energy','Corporation','Incorporated','Logistics','Tech','Communications','Union','Syndicate','Enterprises'];

        var first = UtilService.randomFromArray(firstArray);
        var suffix = UtilService.randomFromArray(suffixArray);

        var type = UtilService.randomFromArray(Object.keys(self.weights));

        var company = {
            name:  first + ' ' + suffix,
            ticker: first.charAt(0) + (first.charAt(3) ? first.charAt(3) :  first.charAt(1)).toUpperCase() + suffix.charAt(0).toUpperCase(),
            type: type,
            growth: self.weights[type].growth,
            spread: self.weights[type].spread,
            value: [parseFloat(self.weights[type].startPrice + UtilService.random(-self.weights[type].startPrice*.1,self.weights[type].startPrice*.1) + Math.random().toFixed(2))],
            change: null,
            changePercent: null,
            industry:'aerospace',
            myShares: UtilService.random(0,3)
        };

        return company;

    };

    this.change = function () {

        angular.forEach(DataService.stockMarket, function(stock) {
            var oldValue = stock.value[stock.value.length - 1];
            var growth = stock.value + stock.growth;
            stock.changePercent = parseFloat((UtilService.random(-1,1,true)/20).toFixed(4));
            stock.change = parseFloat((oldValue*stock.changePercent).toFixed(4));
            var newValue = parseFloat((oldValue + stock.change).toFixed(2)) ;
            stock.value.push(newValue);
        });

    };

    this.getStock = function (symbol) {

        for(s=0;s<DataService.stockMarket.length;s++){
            if (symbol === DataService.stockMarket[s].ticker) {
                return DataService.stockMarket[s];
            }
        }
    };

    this.drawChart = function () {

        alert('drawing chart');

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

});