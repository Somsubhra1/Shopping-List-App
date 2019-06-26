const express = require("express");

const router = express.Router();

// Item model
const Item = require("../../models/Item");

// @type     - GET
// @route    - /api/item
// @desc     - a route show all items
// @access   - PUBLIC
router.get("/", (req, res) => {
    Item.find()
        .sort({ date: -1 })
        .then(items => res.json(items))
        .catch(err => console.log("Error getting items " + err));
});

// @type     - POST
// @route    - /api/item
// @desc     - a route add an item
// @access   - PUBLIC
router.post("/", (req, res) => {
    const newItem = new Item({ name: req.body.name });

    newItem
        .save()
        .then(item => res.json(item))
        .catch(err => console.log("Error saving item to db: " + err));
});

// @type     - DELETE
// @route    - /api/item/:id
// @desc     - a route delete an item
// @access   - PUBLIC
router.delete("/:id", (req, res) => {
    Item.findById(req.params.id)
        .then(item => {
            item.remove()
                .then(() => res.json({ success: true }))
                .catch(err => res.status(500).json({ success: "false" }));
        })
        .catch(err => res.status(404).json({ success: false }));
});

module.exports = router;
