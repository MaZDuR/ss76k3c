var roleUpgrader = require('role.upgrader');

module.exports = {
    // a function to run the logic for this role
    /** @param {Creep} creep */
    run: function(creep) {
        // if creep is bringing energy to a structure but has no energy left
        if (creep.memory.working == true && creep.carry.energy == 0) {
            // switch state
            creep.memory.working = false;
        }
        // if creep is harvesting energy but is full
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            // switch state
            creep.memory.working = true;
        }

        // if creep is supposed to transfer energy to a structure
        if (creep.memory.working == true) {
            // if in home room
            if (creep.room.name == creep.memory.home) {
                // find closest spawn, extension or tower which is not full
                var structure = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                        // the second argument for findClosestByPath is an object which takes
                        // a property called filter which can be a function
                        // we use the arrow operator to define it
                        filter: (s) => (s.structureType == STRUCTURE_SPAWN
                    || s.structureType == STRUCTURE_EXTENSION
                    || s.structureType == STRUCTURE_TOWER)
                    && s.energy < s.energyCapacity
            });

                if (structure == undefined) {
                    structure = creep.room.storage;
                }

                // if we found one
                if (structure != undefined) {
                    // try to transfer energy, if it is not in range
                    if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        // move towards it
                        creep.travelTo(structure);
                    }
                }
                else
                {
                    var constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                    // if one is found
                    if (constructionSite != undefined) {
                        if (creep.build(constructionSite) == ERR_NOT_IN_RANGE) {

                            // move towards the constructionSite
                            creep.travelTo(constructionSite);
                        }
                    }
                    else
                    {
                        roleUpgrader.run(creep);
                    }
                }
            }
            // if not in home room...
            else {
                // find exit to home room
                const homepos = new RoomPosition(25,25, 'W47N43');
                //var exit = creep.room.findExitTo(creep.memory.home);

                // and move to exit
                //creep.travelTo(creep.pos.findClosestByRange(exit));
                creep.moveTo(homepos);
            }
        }
        // if creep is supposed to harvest energy from source
        else {
            // if in target room
            if (creep.room.name == creep.memory.target) {
                // find source
                creep.getEnergy(false,true,false)
                /*var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                //var source = creep.room.find(FIND_SOURCES_ACTIVE)[creep.memory.sourceIndex];

                // try to harvest energy, if the source is not in range
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    // move towards the source
                    creep.travelTo(source, {reusePath: 15});
                }*/
            }
            // if not in target room
            else {
                // find exit to target room
                var exit = new RoomPosition(25,25, creep.memory.target);
                //var exit = creep.room.findExitTo(creep.memory.target);
                //creep.say("🤷")
                //console.log(creep.name + " Can't find exit! " + creep.room.name)
                // move to exit
                creep.moveTo(exit);
                //creep.moveTo(creep.pos.findClosestByRange(exit));
            }
        }
    }
};