app.service('DataService', function($http) {

    var self = this;

    this.log = [];

    this.inventory = [];

    this.stats = {
        name: "Guy",
        level: 1,
        credits: 100,
        totalDistance: 5000,
        distanceLeft: 5000,
        distanceTraveled: 0
    };

    this.text = {

        weird: [
            'A nearby supernova causes the instruments to go haywire for an hour.',
            'A crew member has smuggled an unknown life-form on the ship. You jettison it out the airlock.'
        ],
        names: {
            first: ['Lou', 'James', 'Meeson'],
            last: ['Reed', 'Smith', 'Toogao']
        }

    };

    this.images = {

        space: [
            "assets/img/space1.jpg",
            "assets/img/space2.jpg",
            "assets/img/space3.jpg"
        ],
        stations: [

        ],
        ships: [

        ],
        characters: [

        ]

    };

    this.items = {

        junk: [
            { name: "hammer", value: 3 },
            { name: "wrench", value: 3 },
            { name: "thermal inverter", value: 5 }
        ],
        shipPart: [
            { name: "engine", value: 5 },
            { name: "shield", value: 5 },
            { name: "weapon", value: 5 }
        ]

    };

    this.conditions = {
        poor: {
            adjectives: ['bent', 'cracked', 'melted'],
            valueModifier: 1
        },
        fair: {
            adjectives: ['used', 'worn', 'greasy', 'dusty'],
            valueModifier: 3
        },
        excellent: {
            adjectives: ['pristine', 'gleaming', 'brand-new', 'premium', 'advanced'],
            valueModifier: 5
        }
    };

});