app.service("InventoryService", function() {

    var self = this;

    this.inventory = [];

    this.componentInventory = {

        wiringHarness: 2,
        powerConverter: 2,
        microController: 2,
        polarityReducer: 2,
        heatSync: 2,
        particleEmitter: 2,
        matterTransverter: 2,
        voltageDiode: 2,
        gammaRayDeflector: 2,
        plasmaCapacitor: 2,
        grapheneManifold: 2,
        quantumAccelerator: 2,
        trionicCoil: 2,
        gravitronAssembly: 2,
        pulseInhibitor: 2,
        singularityArray: 2,
        chargeLimiter: 2,
        fuseConduit: 2,
        resonanceIsolator: 2,
        tachyonFilament: 2

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