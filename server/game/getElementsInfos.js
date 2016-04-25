'use strict';
var getElementsInfos = function(ELEMENT_LIST) {
    var pack = [];

    for (var i in ELEMENT_LIST)
    {
        var element = ELEMENT_LIST[i];
        pack.push({name: element.name,
                   x: element.body.position.x,
                   y: element.body.position.y,
                   z: element.body.position.z,
                   size: element.size})
    }
    return pack;
}
module.exports = getElementsInfos;
