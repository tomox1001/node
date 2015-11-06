var _ = require('lodash');
var express = require('express');
var router = express.Router();

router.get('/:orderId?', function(req, res) {
    var orderId = req.params.orderId;

    var result = {
        result: true,
        data: {
            orderId: orderId,
            orderDateTime: 1443580462901,
            orderUserId: 'Uab324de',
            orderItemId: 'I12ac45f',
            orderQuantity: 56,
            orderState: '受注',
            tags: ['特急','期間外']
        }
    };

    res.json(result);
});

module.exports = router;
