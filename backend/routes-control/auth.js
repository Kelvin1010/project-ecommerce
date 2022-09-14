const User = require("../models/User");
const router = require("express").Router();
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

//REGISTER
router.post("/register", async (req,res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS
        ).toString()
    })

    try {
        const saveUser = await newUser.save()
        res.status(201).json(saveUser)
    } catch (error) {
        res.status(500).json(error);
    }
})


//LOGIN
router.post("/login", async (req,res) => {
    try {
        const user = await User.findOne({
            email: req.body.email
        })
        !user && res.status(401).json("Wrong credentials!")

        const hashPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS)
        const passwordT = hashPassword.toString(CryptoJS.enc.Utf8);

        passwordT !== req.body.password && 
        res.status(401).json("Wrong credentials!")

        const accessToken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin,
            },
            process.env.JWT,
            {expiresIn: "3d"}
        )


        const {password,...others} = user._doc
        res.status(200).json({...others, accessToken})
    } catch (error) {
        res.status(500).json(error)
    }
});


module.exports = router;