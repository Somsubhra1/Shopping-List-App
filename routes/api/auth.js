const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");
require("dotenv/config");

const router = express.Router();

// User model
const User = require("../../models/User");

// @type     - POST
// @route    - /api/auth
// @desc     - Login a user
// @access   - PUBLIC
router.post("/", (req, res) => {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
        return res.status(400).json({ msg: "Please enter all fields" });
    }

    // Check for existing user:
    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(404).json({ msg: "User doesn't exist" });
            }

            // Compare password
            bcrypt
                .compare(password, user.password)
                .then(isMatch => {
                    if (!isMatch) {
                        return res
                            .status(400)
                            .json({ msg: "Invalid credentials" });
                    }

                    // Sign token
                    jwt.sign(
                        { id: user._id },
                        process.env.jwtSecret,
                        {
                            expiresIn: 3600
                        },
                        (err, token) => {
                            if (err) {
                                throw err;
                            }
                            return res.json({
                                token,
                                user: {
                                    id: user._id,
                                    name: user.name,
                                    email: user.email
                                }
                            });
                        }
                    );
                })
                .catch(err =>
                    res.status(500).json({ msg: "Error signing token" })
                );
        })
        .catch(err => {
            throw err;
        });
});

// @type     - GET
// @route    - /api/auth/user
// @desc     - Get user data
// @access   - PRIVATE
router.get("/user", auth, (req, res) => {
    User.findById(req.user.id)
        .select("-password") // removes password from the db response
        .then(user => res.json(user))
        .catch(err =>
            res.status(500).json({ msg: "Error fetching user details " + err })
        );
});

module.exports = router;
