var app = angular.module('spaceApp');
app.service('PathfinderService', ['$timeout', 'InventoryService', 'UtilService', 'GenerateService', 'DataService', function ($timeout, InventoryService, UtilService, GenerateService, DataService) {

    var self = this;

    localStorage.clear();

    this.myLocation;
    this.map;
    const JUMP_RANGE = 15;

    this.generateSystems = function () {

        Math.distanceBetween = function (p1, p2) {
            return Math.sqrt(Math.pow((p1.x - p2.x), 2) + Math.pow((p1.y - p2.y), 2));
        };

        var PF = require('../assets/js/pathfinding.js');

        if (!localStorage.map) {

            var entities = [];

            for (i = 0; i < 200; i++) {
                popRoll = Math.random();
                if (popRoll < .75) {
                    var pop = UtilService.random(1, 1000);
                } else if (popRoll < .95) {
                    var pop = UtilService.random(1001, 1000000);
                } else {
                    var pop = UtilService.random(1000001, 1000000000);
                }

                entities.push({
                    x: Math.floor(Math.random() * 340),
                    y: Math.floor(Math.random() * 275),
                    neighbors: [],
                    sec: Math.ceil(Math.random() * 10) / 10,
                    pop: pop,
                    index: i
                });
            }
            var getLocation = function () {
                var location;
                var neighbors;
                var desiredNeighbors = 2;
                do {
                    location = UtilService.randomFromArray(entities);
                    neighbors = self.checkNeighbors(entities, location.index);
                    if (neighbors >= desiredNeighbors) {
                        return location;
                    }
                } while (neighbors < desiredNeighbors);
            };

            self.myLocation = getLocation();
            if (!self.myLocation.name) {
                var name = GenerateService.generateName();
                entities[self.myLocation.index].name = name;
            }
            localStorage.map = JSON.stringify(entities);
            localStorage.myLocation = JSON.stringify(self.myLocation);
        } else {
            'you already have a map!';
            self.myLocation = JSON.parse(localStorage.myLocation);
            var entities = JSON.parse(localStorage.map);

        }
        DataService.stats.currentLocation = self.myLocation;
        this.map = entities;
        return entities;
    };

    this.checkNeighbors = function (entities, index) {
        var entity1 = entities[index];
        var neighborCount = 0;
        for (var j = 0; j < entities.length; j++) {
            if (index !== j) {
                var entity2 = entities[j];
                if (Math.distanceBetween(entity1, entity2) <= JUMP_RANGE) {
                    neighborCount++;
                }
            }
        }
        return neighborCount;
    };

    this.addNeighbors = function (entities) {

        // const JUMP_RANGE = InventoryService.myShip.hyperdrive.currentEffectiveness;

        for (var i = 0; i < entities.length; i++) {
            var entity1 = entities[i];
            for (var j = 0; j < entities.length; j++) {
                if (i !== j) {
                    var entity2 = entities[j];
                    if (Math.distanceBetween(entity1, entity2) <= JUMP_RANGE) {
                        entity1.neighbors.push(entity2);
                    }
                }
            }
        }

        return entities;
    };
    this.drawMap = function () {

        var app = new PIXI.Application(350, 285);
        document.getElementById('map').appendChild(app.view);

        app.stage.position.set(340, 275);

        var outlineFilterWhite = new PIXI.filters.GlowFilter(5, 5, 5, 0xFFFFFF, 5);
        var outlineFilterGreen = new PIXI.filters.GlowFilter(5, 5, 5, 0x3ee238, 5);
        var outlineFilterRed = new PIXI.filters.GlowFilter(5, 5, 5, 0xe23838, 5);
        // var outlineFilterRed = new PIXI.filters.OutlineFilter(2, 0xff9999);

        function onButtonDown() {

            // for (i=0;i<app.stage.children.length;i++) {
            //     app.stage.children[i]._filters = null;
            // }
            this.filters = [outlineFilterGreen];
            if (!this.name) {
                var entities = JSON.parse(localStorage.map);
                this.name = GenerateService.generateName();
                entities[this.index].name = this.name;
                localStorage.map = JSON.stringify(entities);
            }
            alert("System: " + this.name + " \nPopulation: " + numberWithCommas(this.pop * 1000) + " \nSecurity: " + this.sec
                // + " \nIndex: " + this.index
            );
        }

        var filterOn = function () {
            this.filters = [outlineFilterWhite];
        };

        var filterOff = function () {
            this.filters = null;
        };

        var entities = self.addNeighbors(self.generateSystems());

        var plotPoint = function (star) {

            var randomColor = function () {
                var letters = ['A', 'B', 'C', 'D', 'E', 'F'];
                var numbers = ['5', '6', '7', '8', '9'];
                var hex = '';
                var order = [];
                for (i = 0; i < 3; i++) {
                    if (i === 2 && order[0] === 1 && order[1] === 1) {
                        order.push(0);
                    } else {
                        order.push(UtilService.random(0, 1));
                    }
                }
                for (j = 0; j < order.length; j++) {
                    if (order[j] === 0) {
                        var char = UtilService.randomFromArray(numbers);
                    } else {
                        var char = UtilService.randomFromArray(letters);
                    }
                    hex += (char + char);
                }
                return '0x' + hex;
            };

            if (star.pop < 1000) {
                var starSystem = PIXI.Sprite.fromImage(UtilService.getImagePath('system-sm.png'));
            } else if (star.pop < 1000000) {
                var starSystem = PIXI.Sprite.fromImage(UtilService.getImagePath('system-md.png'));
            } else {
                var starSystem = PIXI.Sprite.fromImage(UtilService.getImagePath('system-lg.png'));
            }

            starSystem.anchor.set(0.5);
            starSystem.interactive = true;
            starSystem.position.set(-star.x, -star.y);
            starSystem.tint = randomColor();
            starSystem.pop = star.pop;
            starSystem.sec = star.sec;
            starSystem.name = star.name;
            starSystem.index = star.index;
            starSystem
                .on('pointerdown', onButtonDown)
                .on('pointerover', filterOn)
                .on('pointerout', filterOff);
            // filterOff.call(starSystem);

            app.stage.addChild(starSystem);
        };

        var drawLine = function (p1x, p1y, p2x, p2y, color) {
            var line = new PIXI.Graphics();
            line.lineStyle(1, color, 0.1);
            line.moveTo(-p1x, -p1y);
            line.lineTo(-p2x, -p2y);
            app.stage.addChild(line);
        };
        var drawLocation = function () {

            var circle = new PIXI.Graphics();
            circle.lineStyle(1, 0x24E616, 0.1);
            circle.drawCircle(-self.myLocation.x, -self.myLocation.y, 6);
            app.stage.addChild(circle);

        };
        entities.forEach(function (star) {
            plotPoint(star);
            star.neighbors.forEach(function (star2) {
                drawLine(star.x, star.y, star2.x, star2.y, 0xFFFFFF);
            });
            drawLocation();

        });

    };

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}]);