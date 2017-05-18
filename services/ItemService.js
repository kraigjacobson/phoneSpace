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

    this.damageItem = function (itemLevel, minComponentsMultiplier, maxComponentsMultiplier, minComponentQtyMultiplier, maxComponentQtyMultiplier) {

        var componentsNeeded = [];
        var numberNeeded = UtilService.random(Math.ceil(itemLevel*minComponentsMultiplier),Math.ceil(itemLevel*maxComponentsMultiplier));
        if (numberNeeded !== 0) {

            var tempArray = Object.keys(DataService.components);
            for (i=0;i<numberNeeded;i++) {
                var randomIndex = UtilService.random(-1,tempArray.length-1);
                var randomComponent = tempArray.splice(randomIndex, 1);
                var amt = UtilService.random(Math.ceil(itemLevel*minComponentQtyMultiplier),Math.ceil(itemLevel*maxComponentQtyMultiplier));
                componentsNeeded.push({
                    name: randomComponent[0],
                    need: amt
                })
            }
        }

        return componentsNeeded;

    };

    this.deleteItem = function (i) {

        InventoryService.inventory.splice(i, 1);

    };

});