var addWheelListener = require('../assets/js/wheel-listener');
var app = angular.module('spaceApp');
app.service('PathfinderService', ['$timeout', 'InventoryService', 'UtilService', 'GenerateService', 'DataService', function ($timeout, InventoryService, UtilService, GenerateService, DataService) {

    var self = this;

    // localStorage.clear();

    var mapSize = 1000;

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

            for (i = 0; i < 500; i++) {

                entities.push({
                    x: Math.floor(Math.random() * mapSize),
                    y: Math.floor(Math.random() * mapSize),
                    neighbors: [],
                    // sec: Math.ceil(Math.random() * 10) / 10,
                    sec: 0,
                    pop: 0,
                    // pop: pop,
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
                sys = entities[self.myLocation.index];
                var name = GenerateService.generateName();
                sys.name = name;

                popRoll = Math.random();
                if (popRoll < .75) {
                    sys.pop = UtilService.random(1, 1000);
                } else if (popRoll < .95) {
                    sys.pop = UtilService.random(1001, 1000000);
                } else {
                    sys.pop = UtilService.random(1000001, 1000000000);
                }

                sys.sec = Math.ceil(Math.random() * 10) / 10
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
        var SCREEN_WIDTH = document.getElementById('map').offsetWidth;
        var SCREEN_HEIGHT = document.getElementById('map').offsetHeight;
        var mapElement = document.getElementById('map');
        var app = new PIXI.Application(SCREEN_WIDTH, SCREEN_HEIGHT);
        var interactionManager = new PIXI.interaction.InteractionManager(app.renderer);
        var lastMx = 0;
        var lastMy = 0;
        var mx = 0;
        var my = 0;
        var deltaMx = 0;
        var deltaMy = 0;
        var mouseDown = false;
        var camera = {
            x: DataService.stats.currentLocation.x -SCREEN_WIDTH/2,
            y: DataService.stats.currentLocation.y-SCREEN_HEIGHT/2,
            zoom: 1
        };
        mapElement.appendChild(app.view);

        interactionManager.on('pointerdown', function(e) {
            lastMx = mx;
            lastMy = my;
            mx = e.data.global.x;
            my = e.data.global.y;
            deltaMx = mx-lastMx;
            deltaMy = my-lastMy;
            mouseDown = true;
        });
        interactionManager.on('pointermove', function(e) {
            lastMx = mx;
            lastMy = my;
            mx = e.data.global.x;
            my = e.data.global.y;
            deltaMx = mx-lastMx;
            deltaMy = my-lastMy;

            if (mouseDown && (Math.abs(deltaMx) >= 1 || Math.abs(deltaMy) >= 1)) {
                camera.x -= deltaMx;
                camera.y -= deltaMy;
            }
            if (mx < 0 || mx > SCREEN_WIDTH || my < 0 || my > SCREEN_HEIGHT) {
                mouseDown = false;
            }
        });
        interactionManager.on('pointerup', function(e) {
            lastMx = mx;
            lastMy = my;
            mx = e.data.global.x;
            my = e.data.global.y;
            deltaMx = mx-lastMx;
            deltaMy = my-lastMy;
            mouseDown = false;
        });

        function zoom(x, y, delta) {
            camera.zoom += -delta;
            if (delta < 0) {
                camera.x -= (x-camera.x) * delta;
                camera.y -= (y-camera.y) * delta;
            } else {
                camera.x += ((SCREEN_WIDTH-camera.x)/2)*delta;
                camera.y += ((SCREEN_HEIGHT-camera.y)/2)*delta;
            }
        }

        function tick() {
            if (camera.x < 0) {
                camera.x = 0;
            }
            if (camera.y < 0) {
                camera.y = 0;
            }
            if (camera.x+SCREEN_WIDTH > mapSize*camera.zoom) {
                camera.x = (mapSize*camera.zoom)-SCREEN_WIDTH;
            }
            if (camera.y+SCREEN_HEIGHT > mapSize*camera.zoom) {
                camera.y = (mapSize*camera.zoom)-SCREEN_HEIGHT;
            }


            app.stage.position.x = -camera.x;
            app.stage.position.y = -camera.y;
            app.stage.scale.set(camera.zoom);
        }

        setInterval(function() {
            tick();
        }, 30/1000);

        addWheelListener(mapElement, function (e) {
            var x = e.clientX-mapElement.offsetLeft;
            var y = e.clientY-mapElement.offsetTop;
            zoom((x+camera.x), (y+camera.y), e.deltaY/1000);
        });

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
                var name = GenerateService.generateName();
                sys = entities[this.index];

                popRoll = Math.random();
                if (popRoll < .75) {
                    var pop = UtilService.random(1, 1000);
                } else if (popRoll < .95) {
                    var pop = UtilService.random(1001, 1000000);
                } else {
                    var pop = UtilService.random(1000001, 1000000000);
                }
                var sec = Math.ceil(Math.random() * 10) / 10;

                this.name = sys.name = name;
                this.pop = sys.pop = pop;
                this.sec = sys.sec = sec;

                localStorage.map = JSON.stringify(entities);
            }
            console.log("System: " + this.name + " \nPopulation: " + numberWithCommas(this.pop * 1000) + " \nSecurity: " + this.sec
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

            // var starSystem = PIXI.Sprite.fromImage(UtilService.getImagePath('system-lg.png'));

            var sizeRoll = UtilService.random(1,10);
            if (sizeRoll < 5) {
                var diameter = 1;
            } else if (sizeRoll < 9) {
                var diameter = 2;
            } else {
                var diameter = 3;
            }
            var starSystem = new PIXI.Graphics();
            starSystem.beginFill(randomColor(), 1);
            starSystem.drawCircle(star.x, star.y, diameter);
            starSystem.endFill();
            starSystem.interactive = true;
            starSystem.hitArea = new PIXI.Circle(star.x, star.y, diameter);
            starSystem.pop = star.pop;
            starSystem.sec = star.sec;
            starSystem.name = star.name;
            starSystem.index = star.index;
            starSystem
                .on('pointerdown', onButtonDown)
                .on('pointerover', filterOn)
                .on('pointerout', filterOff);

            app.stage.addChild(starSystem);
        };

        var drawLine = function (p1x, p1y, p2x, p2y, color) {
            var line = new PIXI.Graphics();
            line.lineStyle(1, color, 0.1);
            line.moveTo(p1x, p1y);
            line.lineTo(p2x, p2y);
            app.stage.addChild(line);
        };
        var drawLocation = function () {

            var circle = new PIXI.Graphics();
            circle.lineStyle(1, 0x24E616, 0.1);
            circle.drawCircle(self.myLocation.x, self.myLocation.y, 6);
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