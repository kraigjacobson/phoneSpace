app.service('DataService', function($http) {

    var self = this;

    this.log = ['Your journey begins!'];

    this.inventory = [];

    this.classA = function (name, attack, accuracy, maneuverability, speed, cost, img) {

        this.name = name;
        this.attack = attack;
        this.accuracy = accuracy;
        this.maneuverability = maneuverability;
        this.speed = speed;
        this.cost = cost;
        this.img = img;
        this.shield = 1;
        this.hull = 1;

    };

    this.ships = {

        scamp: new self.classA("Scamp",2,1,1,1,0,"scamp.png"),
        scout: new self.classA("Scout",1,1,1,2,0,"scout.png")

    };

    this.stats = {
        name: "Guy",
        level: 1,
        ship: self.ships.scamp.name,
        attack: self.ships.scamp.attack,
        accuracy: self.ships.scamp.accuracy,
        speed: self.ships.scamp.speed,
        maneuverability: self.ships.scamp.maneuverability,
        shield: self.ships.scamp.shield,
        hull: self.ships.scamp.hull,
        credits: 100,
        totalDistance: 50000,
        distanceLeft: 50000,
        distanceTraveled: 0,
        daysTraveled: 0
    };

    this.text = {

        weird: [
            'A nearby supernova causes the instruments to go haywire for an hour.',
            'A crew member has smuggled an unknown life-form on the ship. You jettison it out the airlock.'
        ],
        names: {
            vowels: ['a', 'e', 'i', 'o', 'u'],
            parts: ['b','c','d','f','g','h','j','k','l','m','n','p','q','qu','r','s','t','v','w','x','z','st','rh','sr','dh','th','tr','sh','gh','vr','ck']
        }

    };

    this.images = {

        space: [
            "space1.jpg",
            "space2.jpg",
            "space3.jpg"
        ],
        stations: [

        ],
        characters: [

        ],
        wrecks:[
            'wreck.jpg',
            'wreck2.jpg'
        ],
        components: {
            weapon: ['weapon.jpg'],
            targetingComputer: ['targeting.png'],
            drive: ['drive.png'],
            thrusters: ['thruster.png'],
            shieldHardener: ['shield.png'],
            armor: ['armor.png']
        }

    };

    this.shipPart = function (type, value, enhancement) {

        this.type = type;
        this.value = value;
        this.enhancement = enhancement;

    };

    this.items = {

        junk: [
            { name: "hammer", value: 3 },
            { name: "wrench", value: 3 },
            { name: "thermal inverter", value: 5 }
        ],
        shipPart: [
            new self.shipPart("weapon",5,'attack'),
            new self.shipPart("targetingComputer",5,'accuracy'),
            new self.shipPart("drive",5,'speed'),
            new self.shipPart("thrusters",5,'maneuverability'),
            new self.shipPart("shieldHardener",5,'shield'),
            new self.shipPart("armor",5,'hull')
        ]

    };

    this.material = function (rarity, value) {
        this.rarity = rarity;
        this.value = value;
    };

    this.materials = {
        aluminum: new self.material('common',10),
        zinc: new self.material('common',10),
        silicon: new self.material('common',10),
        copper: new self.material('common',10),
        neodymium: new self.material('uncommon',20),
        dysprosium: new self.material('uncommon',20),
        terbium: new self.material('uncommon',20),
        yttrium: new self.material('uncommon',20),
        lanthanum: new self.material('rare',40),
        europium: new self.material('rare',40),
        lutetium: new self.material('rare',40),
        cerium: new self.material('rare',40),
        thulium: new self.material('very rare',80),
        erbium: new self.material('very rare',80),
        praseodymium: new self.material('very rare',80),
        scandium: new self.material('very rare',80),
        holmium: new self.material('scarce',200),
        prometheum: new self.material('scarce',200),
        samarium: new self.material('scarce',200),
        einsteinium: new self.material('scarce',200)
    };

});