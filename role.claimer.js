module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
        // if in target room
        if (creep.room.name != creep.memory.target) {
            // find exit to target room
            var exit = new RoomPosition(25, 25, creep.memory.target);
            // move to exit
            creep.moveTo(exit);
        }
        else {
            // try to claim controller
            if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                // move towards the controller
                creep.travelTo(creep.room.controller);
            }
        }
    }
};