'use strict';
var getPlayersInfos = function(PLAYER_LIST) {
    var pack = [];

    for (var i in PLAYER_LIST)
    {
        var player = PLAYER_LIST[i];
        pack.push({name: player.name,
		   type: player.type,
                   x: player.body.position.x,
                   y: player.body.position.y,
                   z: player.body.position.z,
                   size: player.size})
    }
    return pack;
}
module.exports = getPlayersInfos;
