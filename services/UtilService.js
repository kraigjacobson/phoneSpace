app.service('UtilService', function (DataService){

    var self = this;

    this.random = function (min,max) {

        return Math.floor(Math.random()*(max-min+1)+min);

    };

    this.randomFromArray = function (array) {

        return array[Math.floor(Math.random()*array.length)];

    };

    this.getImage = function (arrayWithinImages) {

        return self.randomFromArray(DataService.images[arrayWithinImages]);

    };

    this.fullName = function() {

        return self.randomFromArray(DataService.text.names.first) + " " + self.randomFromArray(DataService.text.names.last);

    };

    this.rollCondition = function () {

        var roll = self.random(1,15);

        if (roll <= 1) {
            return DataService.conditions.poor;
        } else if (roll <= 2) {
            return DataService.conditions.fair;
        } else {
            return DataService.conditions.excellent;
        }

    };

    this.generateItem = function () {

        o = {};
        var condObject = self.rollCondition();
        var condition = self.randomFromArray(condObject.adjectives);
        o.type = self.randomFromArray(Object.keys(DataService.items));
        var item = self.randomFromArray(DataService.items[o.type]);
        o.value = item.value*condObject.valueModifier;
        o.slug = condition + ' ' + item.name;
        return o;

    };

});