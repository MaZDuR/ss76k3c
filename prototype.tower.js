// create a new function for StructureTower
StructureTower.prototype.defend =
    function () {
        // find closes hostile creep
        var target = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS, { filter: o => o.getActiveBodyparts(ATTACK) > 0});
        // if one is found...
        if (target != undefined) {
            // ...FIRE!
            this.attack(target);
        }
    };