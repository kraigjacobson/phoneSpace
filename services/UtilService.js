var app = angular.module('spaceApp');
app.service('UtilService', function ($rootScope, DataService) {

    var self = this;

    this.random = function (min, max, decimal) {

        if (!max) {
            var range = min;
        } else {
            var range = max - min;
        }

        if (decimal) {
            return Math.random() * (range) + min;
        } else {
            return Math.floor(Math.random() * (range + 1) + min);
        }

    };

    this.randomFromArray = function (array) {

        return array[Math.floor(Math.random() * array.length)];

    };

    this.getImagePath = function (imageFileName) {

        return window.location.origin + '/assets/img/' + imageFileName;

    };

    this.deleteItem = function (i) {

        DataService.inventory.splice(i, 1);

    };

    this.timeNow = function () {
        var d = new Date();
        var year = (d.getFullYear() + 1256);
        var month = d.getMonth() + 1;
        var day = d.getDate();
        var hour = d.getHours();
        var minute = d.getMinutes();
        var seconds = d.getSeconds();
        return day + "-" + month + "-" + year + " " + hour + ":" + minute + ":" + seconds;
    };

    this.dateNow = function () {
        var d = new Date();
        var year = (d.getFullYear() + 1256);
        var month = d.getMonth() + 1;
        var day = d.getDate();
        return day + "-" + month + "-" + year;
    };

    this.dateBefore = function (howMany) {
        var d = new Date();
        // var year = (d.getFullYear() + 1256);
        // var month = d.getMonth() + 1;
        // var day = d.getDate() - howMany;
        return d.setDate(d.getDate() - howMany);
        // return day + "-" + month + "-" + year;
    };

    this.newDay = function () {
        // console.log(DataService.currentWeek[0]);
        var newDay = DataService.currentWeek[0].add(1, 'd');
        DataService.currentWeek.unshift(newDay);
        if (DataService.currentWeek.length > 7) {
            DataService.currentWeek.pop();
        }
        // console.log(DataService.currentWeek[0]);
        // console.log('newDay', newDay);
        // console.log(DataService.currentWeek);

    };

    this.getExperience = function (amt) {

        DataService.stats.experience += amt;
        var currentLevel = DataService.stats.level;
        var getNextLevelXp = function () {
            var init = 50, exp = 50;
            for (i = 1; i < currentLevel; i++) {
                if (i % 2 === 0) {
                    exp = exp + init + init / 2;
                } else {
                    exp = exp + init + init / 4;
                }

            }
            return Math.floor(exp);
        };

        if (DataService.stats.experience > getNextLevelXp()) {
            var nextLevel = DataService.stats.level + 1;
            DataService.log.unshift("<span class='gold'>You achieved level " + nextLevel + "!</span>");
            DataService.stats.level++;
        }

    };

});