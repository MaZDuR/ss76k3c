var roles = {
    harvester: require('role.harvester'),
    upgrader: require('role.upgrader'),
    builder: require('role.builder'),
    repairer: require('role.repairer'),
    wallRepairer: require('role.wallRepairer'),
    longDistanceHarvester: require('role.longDistanceHarvester'),
    claimer: require('role.claimer'),
    miner: require('role.miner'),
    lorry: require('role.lorry'),
    defender: require('role.defender'),
    reserver: require('role.reserver')
};

Creep.prototype.runRole =
    function () {


        var closestHostile = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {filter: o => o.getActiveBodyparts(ATTACK) > 0});
        if(closestHostile != undefined) {
            //console.log("LOCATED HOSTILE CREEP");
            //closestHostile.pos.createFlag('defenderFlag', COLOR_RED, COLOR_BLUE);
        }
        roles[this.memory.role].run(this);
    };

/** @function
 @param {bool} useContainer
 @param {bool} useSource */
Creep.prototype.getEnergy =
    function (useContainer, useSource, garbage=true) {


        let resource;

        if (resource = this.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {filter: d => d.resourceType == RESOURCE_ENERGY && (d.amount - this.pos.getRangeTo(d)) > 50   })) {

            if (garbage)
            {

                if (resource != undefined) {
                    // try to withdraw energy, if the container is not in range
                    if (this.pickup(resource) == ERR_NOT_IN_RANGE) {
                        //console.log("Found " + resource.energy + " Resource in room " + this.pos.roomName);
                        // move towards it
                        this.travelTo(resource);
                        this.say(resource.amount + "ð¼")
                    }
                }

            }
        } else {
            /** @type {StructureContainer} */
            let container;
            // if the Creep should look for containers
            if (useContainer) {
                // find closest container
                container = this.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: s => (s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE) &&
                        s.store[RESOURCE_ENERGY] > 50
                });
                // if one was found
                if (container != undefined) {
                    // try to withdraw energy, if the container is not in range
                    if (this.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        // move towards it
                        this.travelTo(container);
                    }
                }
            }
            // if no container was found and the Creep should look for Sources
            if (container == undefined && useSource) {
                // find closest source
                var source = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE);


                // try to harvest energy, if the source is not in range
                if (this.harvest(source) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    this.travelTo(source);
                }
            }
        }
    };