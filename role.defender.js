module.exports = {
    // a function to run the logic for this role
    /** @param {Creep} creep */
    run: function(creep) {
        let flag = Game.flags.defenderFlag;

        if(flag) {
            if (creep.room.name != flag.room.name) {
                // find exit to target room
                var exit = new RoomPosition(25, 25, flag.room);
                // move to exit
                creep.moveTo(exit);
            }
            else {
                // in room, lets kill shit!
                var closestHostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                if(closestHostile != undefined) {

                    if (creep.attack(closestHostile) == ERR_NOT_IN_RANGE) {
                        creep.travelTo(closestHostile);
                    }
                }
                else
                {
                    console.log("Seems the hostile is gone now...");
                    Game.flags.defenderFlag.remove();
                }
            }
        }
        else
        {
            const homespot = new RoomPosition(25, 25, creep.memory.home);
            //return home
            if (creep.room.name != creep.memory.home) {
                creep.moveTo(homespot);
            }
            //creep.moveTo(homespot);
        }
    }

};