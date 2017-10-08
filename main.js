// import modules
require('prototype.creep');
require('prototype.tower');
require('prototype.spawn');
require('Traveler');


module.exports.loop = function() {

    var allspawns = _.filter(Game.spawns, s => s.structureType == STRUCTURE_SPAWN);
    // check for each spawn the numbers are set
    for (let spawns of allspawns) {

        if (spawns.memory.booted != true){
            console.log("Booting Memory " + spawns.name + '(' + spawns.pos.roomName + ')');
            //put minCreeps in memory
            let minCreeps = {};
            //define all the roles and amount
            let numberOfCreeps = {};
            let creepsInRoom = spawns.room.find(FIND_MY_CREEPS);
            let evolve = numberOfCreeps['miner'] = _.sum(creepsInRoom, (c) => c.memory.role == 'miner');
            spawns.memory.minCreeps = minCreeps;
            spawns.memory.minCreeps.upgrader = 2
            spawns.memory.minCreeps.builder = 2
            spawns.memory.minCreeps.repairer = 1
            spawns.memory.minCreeps.wallRepairer = 1
            spawns.memory.minCreeps.LongDistanceHarvester = 0
            spawns.memory.minCreeps.claimer = 0
            spawns.memory.minCreeps.miner = 2
            spawns.memory.minCreeps.harvester = 3-evolve
            spawns.memory.minCreeps.lorry = 2
            spawns.memory.minCreeps.defender = 1
            spawns.memory.booted = true;
            spawns.memory.minLongDistanceHarvesters = {}
            //spawns.memory.minLongDistanceHarvesters['W48N43'] = 2
            //spawns.memory.minLongDistanceHarvesters['W46N43'] = 1
            //spawns.memory.minLongDistanceHarvesters['W47N42'] = 3
        }
    }

    // check for memory entries of died creeps by iterating over Memory.creeps
    for (let name in Memory.creeps) {
        // and checking if the creep is still alive
        if (Game.creeps[name] == undefined) {
            // if not, delete the memory entry
            delete Memory.creeps[name];
        }
    }

    // for each creeps
    for (let name in Game.creeps) {
        // run creep logic
        Game.creeps[name].runRole();
    }

    // find all towers
    var towers = _.filter(Game.structures, s => s.structureType == STRUCTURE_TOWER);
    // for each tower
    for (let tower of towers) {
        // run tower logic
        tower.defend();
    }

    // for each spawn
    for (let spawnName in Game.spawns) {
        // run spawn logic
        Game.spawns[spawnName].spawnCreepsIfNecessary();
    }
};