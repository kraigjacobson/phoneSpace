app.service('ItemService', function (DataService, InventoryService, UtilService, ModalService){

    var self = this;

    this.details = function (i) {

        self.currentItemIndex = i;
        this.show(i);
        this.show = function(i) {
            ModalService.showModal({
                templateUrl: 'partials/item.html',
                controller: "ModalController"
            }).then(function(modal) {
                modal.element.modal();
                modal.close.then(function(result) {
                    //callback
                });
            });
        };

    };

    this.repairItem = function (i) {

        var item = InventoryService.inventory[self.currentItemIndex];
        var itemComponent = InventoryService.inventory[self.currentItemIndex].componentsNeeded;

        if (InventoryService.componentInventory[itemComponent[i].name] < itemComponent[i].need) {
            alert("You don't have the required components to repair this item.");
        } else {
            self.componentName = itemComponent[i].name;
            InventoryService.componentInventory[itemComponent[i].name] -= itemComponent[i].need;
            itemComponent.splice(i,1);
            item.repaired.push(self.componentName);
            if (!itemComponent.length) {
                InventoryService.inventory[self.currentItemIndex].repaired = [];
                item.currentValue = item.fullValue;
            }
        }

    };

    this.deleteItem = function (i) {

        DataService.inventory.splice(i, 1);

    };

    this.damageItem = function (itemLevel, minComponentsMultiplier, maxComponentsMultiplier, minComponentQtyMultiplier, maxComponentQtyMultiplier) {

        var componentsNeeded = [];
        var numberNeeded = UtilService.random(Math.ceil(itemLevel*minComponentsMultiplier),Math.ceil(itemLevel*maxComponentsMultiplier));
        if (numberNeeded !== 0) {
            for (i=0;i<numberNeeded;i++) {
                var randomComponent = UtilService.randomFromArray(Object.keys(DataService.components));
                var amt = UtilService.random(Math.ceil(itemLevel*minComponentQtyMultiplier),Math.ceil(itemLevel*maxComponentQtyMultiplier));
                var duplicate = $.inArray(randomComponent, componentsNeeded);
                if (duplicate) {
                }
                componentsNeeded.push({
                    name: randomComponent,
                    need: amt
                })
            }
        }

        return componentsNeeded;

    };

});