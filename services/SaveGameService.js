var app = angular.module('spaceApp');
app.service('SaveGameService', ['DataService', function (DataService) {

    var self = this;

    DataService.log = localStorage.log;



}]);