app.service("InventoryService", function(  ) {

    var self = this;

    this.inventory = [];

    this.merchantInventory = [];

    this.myShip = {};

    this.bounties = null;

    this.stocks = [];

    this.componentInventory = {

        wiringHarness: 20,
        powerConverter: 20,
        microController: 20,
        polarityReducer: 20,
        heatSync: 20,
        particleEmitter: 20,
        matterTransverter: 20,
        voltageDiode: 20,
        gammaRayDeflector: 20,
        plasmaCapacitor: 20,
        grapheneManifold: 20,
        quantumAccelerator: 20,
        trionicCoil: 20,
        gravitronAssembly: 20,
        pulseInhibitor: 20,
        singularityArray: 20,
        chargeLimiter: 20,
        fuseConduit: 20,
        resonanceIsolator: 20,
        tachyonFilament: 20

    };

    this.updateComponentInventoryValue = function ( component, value) {

        if (self.componentInventory[component] + value <= 0) {
            console.log("You don't have enough components");
        } else {
            self.componentInventory[component] += value;
            console.log("updated component inventory: " + component + " " + value);
        }

    };

    this.removeComponentNeeded = function ( index, component) {

        self.inventory.mats.splice(i);
        console.log('removed component from needs list');

    }



});