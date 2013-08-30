var Packer = exports.Packer = function() {};
Packer.prototype = {
    fit: function(blocks) {
        var block, currentPos = 0;
        for (n = 0; n < blocks.length; n++) {
            block = blocks[n];
            block.fit = {x: 0, y: currentPos};
            currentPos += block.h;
        }
    }
};