var app = angular.module('spaceApp');
app.service('ItemService', ['$rootScope', 'DataService', 'InventoryService', 'UtilService', 'ModalService', function ($rootScope, DataService, InventoryService, UtilService, ModalService) {

    var self = this;

    this.details = function (i, inventory) {
        if (inventory === 'ship') {
            var template = 'partials/ship-item.html';
        } else if (inventory === 'inventory') {
            var template = 'partials/item.html';
        } else if (inventory === 'merchant') {
            var template = 'partials/merchant-item.html'
        }
        self.currentItemIndex = i;
        self.show(template);
    };

    this.show = function (template) {
        ModalService.showModal({
            templateUrl: template,
            controller: "ModalController"
        }).then(function (modal) {
            console.log(modal);
            modal.element.modal();
            modal.close.then(function (result) {
            });
        });
    };

    this.repairItem = function (i, isShip) {
        if (isShip) {
            var itemLocation = "myShip";
        } else {
            var itemLocation = "inventory";
        }

        var item = InventoryService[itemLocation][self.currentItemIndex];
        var itemComponent = item.componentsNeeded;

        if (DataService.stats.repairParts < itemComponent[i].need) {
            alert("You don't have enough parts to repair this item.");
        } else {
            self.componentName = itemComponent[i].name;
            var amt = itemComponent[i].need;
            DataService.stats.repairParts -= amt;
            item.penalty -= amt;
            itemComponent.splice(i, 1);
            item.repaired.push(self.componentName);
            if (!itemComponent.length) {
                InventoryService[itemLocation][self.currentItemIndex].repaired = [];
                item.currentValue = item.fullValue;
                item.currentEffectiveness = item.fullEffectiveness;
            }
        }

    };

    this.damageItem = function (minComponents, maxComponents, minQty, maxQty) {

        var damage = {
            componentsNeeded: [],
            penalty: 0
        };

        var numberNeeded = UtilService.random(minComponents, maxComponents);
        if (numberNeeded !== 0) {

            var tempArray = Object.keys(DataService.components);
            for (i = 0; i < numberNeeded; i++) {
                var randomIndex = UtilService.random(-1, tempArray.length - 1);
                var randomComponent = tempArray.splice(randomIndex, 1);
                var amt = UtilService.random(minQty, maxQty);
                damage.penalty += amt;
                damage.componentsNeeded.push({
                    name: randomComponent[0],
                    need: amt
                })
            }
        }

        return damage;

    };

    this.deleteItem = function (i) {
        console.log('index', i);
        InventoryService.inventory.splice(i, 1);
    };

    this.sellItem = function (i) {
        item = InventoryService.inventory[i];
        amt = Math.floor(item.currentValue / 2); // change number with bartering perk
        DataService.log.unshift('You sell ' + item.name + ' for ' + amt + '&#11363;.');
        DataService.stats.credits += amt;
        InventoryService.merchantInventory.unshift(item);
        InventoryService.inventory.splice(i, 1);

    };

    this.buyItem = function (i) {
        if (InventoryService.inventory.length < DataService.stats.capacity) {
            item = InventoryService.merchantInventory[i];
            amt = item.currentValue; // change number with bartering perk
            if (amt <= DataService.stats.credits) {
                DataService.log.unshift('You buy ' + item.name + ' for ' + amt + '&#11363;.');
                DataService.stats.credits -= amt;
                InventoryService.inventory.unshift(item);
                InventoryService.merchantInventory.splice(i, 1);
            } else {
                alert("You don't have enough credits.");
            }
        } else {
            alert('Your cargo hold is full.');
        }

    };

    this.recycle = function (i) {
        var repairParts = Math.floor(UtilService.random(1, 4) * InventoryService.inventory[i].level * .5);
        if (repairParts !== 0) {
            alert('You received ' + repairParts + ' repair parts.');
            DataService.stats.repairParts += repairParts;
        } else {
            alert('You were unable to recover any repair parts.');
        }
        InventoryService.inventory.splice(i, 1);
    };

    this.fitToShip = function (i) {
        var newPart = InventoryService.inventory[i];
        var installCost = newPart.fullEffectiveness;
        if (DataService.stats.credits < installCost) {
            alert("You need " + installCost + "Ᵽ to pay for installation.");
        } else {
            var oldPart = InventoryService.myShip[newPart.type];
            DataService.stats.credits -= installCost;

            DataService.log.unshift('You spent ' + installCost + ' to install <span class="' + newPart.quality + '">' + newPart.name + '</span>.');
            // remove old ship part stat
            DataService.stats[oldPart.enhancement] -= oldPart.currentEffectiveness;
            // add new part stat
            DataService.stats[oldPart.enhancement] += newPart.currentEffectiveness;
            if (newPart.type === 'armor') {
                var difference = newPart.fullEffectiveness - oldPart.fullEffectiveness;
                DataService.stats.currentHull += difference;
            }
            if (newPart.type === 'shieldCell') {
                var difference = newPart.fullEffectiveness - oldPart.fullEffectiveness;
                console.log(difference);
                DataService.stats.currentShield += difference;
            }

            // old ship part into inventory
            InventoryService.inventory.push(InventoryService.myShip[newPart.type]);
            // new part into ship slot
            InventoryService.myShip[newPart.type] = newPart;
            // delete new part from ship inventory
            InventoryService.inventory.splice(i, 1);
        }
    }

}]);