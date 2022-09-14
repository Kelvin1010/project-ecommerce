const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 5555;
const cors = require("cors");
const dotenv = require("dotenv");
const productRoute = require('./routes-control/product')
const authRoute = require("./routes-control/auth");
const userRoute = require("./routes-control/user");
const cartRoute = require('./routes-control/cart');
const ordertRoute = require('./routes-control/order');
const postRoute = require('./routes-control/posts')
const stripeRoute = require("./routes-control/stripe");
const multer = require('multer');
const path = require('path');



dotenv.config();
app.use(express.json());
app.use(cors());


//Connect DB
mongoose.connect(process.env.MG_URL)
    .then(() => console.log("Connecting with Mongoose DB"))
    .catch((error) => {
        console.log(error)
    })


//Upload Images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        console.log(file)
        cb(
            null, 
            // Date.now() + path.extname(file.originalname)
            req.body.name
        )
    }
})

app.use("/images", express.static(path.join(__dirname,"/images")))

const upload = multer({storage: storage});
app.post("/api/upload", upload.single("file"), (req,res) => {
    res.status(200).json("File has been Upload!")
})



//Route connect 
app.use("/api/products",productRoute);
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", ordertRoute);
app.use("/api/checkout", stripeRoute);
app.use("/api/posts", postRoute);


app.listen(port, () => {
    console.log(`API is working!!!`)
})