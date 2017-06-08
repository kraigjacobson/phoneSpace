var app = angular.module('spaceApp');
app.service('PathfinderService', [function () {

    var self = this;

    this.generateSystems = function () {

        // localStorage.clear();

        Math.distanceBetween = function (p1, p2) {
            return Math.sqrt(Math.pow((p1.x - p2.x), 2) + Math.pow((p1.y - p2.y), 2));
        };

        var PF = require('../assets/js/pathfinding.js');

        if (!localStorage.map) {
            console.log('no map? Let\'s build one!');
            var entities = [];

            for (i = 0; i < 200; i++) {

                entities.push({
                    x: Math.floor(Math.random() * 340),
                    y: Math.floor(Math.random() * 275),
                    neighbors: [],
                    type: 'star'
                });
            }

            var preppedEntities = JSON.stringify(entities);
            localStorage.map = preppedEntities;

        } else {
            'you already have a map!';
            var entities = JSON.parse(localStorage.map);

        }
        return entities;
    };

    this.addNeighbors = function (entities) {

        const SHIP_TRAVEL_DISTANCE = 25;

        for (var i = 0; i < entities.length; i++) {
            var entity1 = entities[i];
            if (entity1.type === 'star') {
                for (var j = 0; j < entities.length; j++) {
                    if (i != j) {
                        var entity2 = entities[j];
                        if (entity2.type === 'star') {
                            if (Math.distanceBetween(entity1, entity2) <= SHIP_TRAVEL_DISTANCE) {
                                entity1.neighbors.push(entity2);
                            }
                        }
                    }
                }
            }
        }

        return entities;
    };

    this.getPath = function () {

    };

    this.drawMap = function () {

        var entities = self.addNeighbors(self.generateSystems());

        var c = document.getElementById('map');
        var ctx = c.getContext("2d");

        var plotPoint = function (x, y, color) {
            var randomColor = function () {
                return Math.floor(Math.random() * 155 +100);
            };
            color = "rgba(" + randomColor() + "," + randomColor() + "," + randomColor() + ",1)";
            ctx.fillStyle = color;
            ctx.fillRect(x, y, 2, 2);
        };

        var drawLine = function (p1x, p1y, p2x, p2y, color) {
            ctx.beginPath();
            ctx.moveTo(p1x, p1y);
            ctx.lineTo(p2x, p2y);
            ctx.strokeStyle = color;
            ctx.stroke();
        };

        entities.forEach(function (star, i) {
            star.neighbors.forEach(function (star2) {
                drawLine(star.x, star.y, star2.x, star2.y, 'rgba(255, 255, 255, 0.1');
            });
            plotPoint(star.x, star.y, 'white');

        });

    };

}]);