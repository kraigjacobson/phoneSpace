var app = angular.module('spaceApp');

app.service('DataService', ['$rootScope', function ($rootScope) {

    var moment = require('moment');

    var self = this;

    this.currentWeek = [moment().add(1234, 'y').add(4, 'M').add(12, 'd')];

    this.stockMarket = [];

    var distance = 50000;

    this.log = [];

    this.classA = function (name, attack, accuracy, piloting, speed, capacity, cost, img) {

        this.name = name;
        this.attack = attack;
        this.accuracy = accuracy;
        this.piloting = piloting;
        this.speed = speed;
        this.capacity = capacity;
        this.cost = cost;
        this.img = img;
        this.shield = 10;
        this.hull = 10;

    };

    this.ships = {

        scamp: new self.classA("Scamp", 20, 10, 10, 10, 20, 0, "scamp.png"),
        scout: new self.classA("Scout", 15, 10, 15, 20, 10, 0, "scout.png")

    };

    this.services = [
        'bountyOffice', 'casino', 'insurance', 'market', 'nightClub','stockBrokerage'
    ];

    this.dockingServices = [
        'partInstallation', 'repair', 'reprocessing'
    ];

    this.policy = {};

    this.stats = {
        name: "Guy",
        currentLocation: null,
        level: 1,
        experience: 0,
        ship: '',
        attack: 0,
        accuracy: 0,
        speed: 0,
        piloting: 0,
        shield: 0,
        currentShield: 0,
        currentHull: 0,
        capacity: 0,
        hull: 0,
        credits: 10000,
        repairParts: 10,
        totalDistance: distance,
        distanceLeft: distance,
        distanceTraveled: 0,
        daysTraveled: 0,
        stockPurchases: 0,
        stockSales: 0,
        sharesPurchased: 0,
        sharesSold: 0,
        systemsVisited: 1
    };

    this.text = {
        weird: [
            'A nearby supernova causes the instruments to go haywire for an hour.',
            'An unknown life-form was found on the ship. You jettison it out the airlock.',
            'Time turbulence causes you to experience echoes of events that occured just moments ago.',
            'You find a picture of an old partner in your bunk.',
            'Your cat has 3 kittens. You should probably find a home for them on the next station.',
            'All your instrument panels go dark as a bright jellyfish like creature flies past the main viewscreen.'
        ],
        names: {
            vowels: ['a', 'e', 'i', 'o', 'u'],
            parts: ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'qu', 'r', 's', 't', 'v', 'w', 'x', 'z', 'st', 'rh', 'sr', 'dh', 'th', 'tr', 'sh', 'gh', 'vr', 'ck']
        }

    };

    this.images = {

        space: [
            "space1.png"
        ],
        stations: [
            "station1.jpg",
            "station2.jpg",
            "station3.jpg"
        ],
        bountyOffice: [
            'bounty-office.jpg'
        ],
        casino: [
            'casino.jpg'
        ],
        nightClub: [
            'night-club.jpg'
        ],
        newMarket: [
            'new-market.jpg',
            'new-market2.jpg'
        ],
        usedMarket: [
            'market.jpg',
            'market2.jpg'
        ],
        stockBrokerage: [
            'brokerage.jpg'
        ],
        insurance: [
            'insurance.jpg'
        ],
        dockingBay: [
            'docking-bay.jpg'
        ],
        services: [
            'services.jpg'
        ],
        repair: [
            'repair.jpg'
        ],
        characters: [
            'alien1.png'
        ],
        wrecks: [
            'wreck.jpg',
            'wreck2.jpg'
        ],
        planets: [
            'planet1.png'
        ],
        components: {
            weapon: ['weapon.jpg'],
            targetingChip: ['targeting.png'],
            hyperdrive: ['drive.PNG'],
            thrusters: ['thruster.png'],
            shieldCell: ['shield.png'],
            armor: ['armor.png'],
            cargoHold: ['cargo.jpg']
        },
        blank: 'blank.png',
        black: 'black.png'

    };

    this.shipPart = function (enhancement) {

        this.enhancement = enhancement;

    };

    this.items = {

        junk: [
            {name: "hammer", value: 3},
            {name: "wrench", value: 3},
            {name: "thermal inverter", value: 5}
        ],
        shipPart: {
            weapon: new self.shipPart('attack'),
            targetingChip: new self.shipPart('accuracy'),
            hyperdrive: new self.shipPart('speed'),
            thrusters: new self.shipPart('piloting'),
            shieldCell: new self.shipPart('shield'),
            armor: new self.shipPart('hull'),
            cargoHold: new self.shipPart('capacity'),
        }

    };

    this.component = function (rarity, value) {
        this.rarity = rarity;
        this.value = value;
    };

    this.components = {
        wiringHarness: new self.component('common', 10),
        powerConverter: new self.component('common', 10),
        microController: new self.component('common', 10),
        polarityReducer: new self.component('common', 10),
        heatSync: new self.component('uncommon', 20),
        particleEmitter: new self.component('uncommon', 20),
        matterTransverter: new self.component('uncommon', 20),
        voltageDiode: new self.component('uncommon', 20),
        gammaRayDeflector: new self.component('rare', 40),
        plasmaCapacitor: new self.component('rare', 40),
        grapheneManifold: new self.component('rare', 40),
        quantumAccelerator: new self.component('rare', 40),
        trionicCoil: new self.component('very rare', 80),
        gravitronAssembly: new self.component('very rare', 80),
        pulseInhibitor: new self.component('very rare', 80),
        singularityArray: new self.component('very rare', 80),
        chargeLimiter: new self.component('scarce', 200),
        fuseConduit: new self.component('scarce', 200),
        resonanceIsolator: new self.component('scarce', 200),
        tachyonFilament: new self.component('scarce', 200)
    };

}]);