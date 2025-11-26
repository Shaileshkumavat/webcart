const port = 4900;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const bcrypt = require("bcryptjs");
app.use(express.json());

//middleware
app.use(cors({ origin: "http://127.0.0.1:5500" }));
app.use(cors());


app.get("/", (req,res) => {
    res.send("hi my name is shailesh");
})
// MongoDB Connection
mongoose.connect('mongodb+srv://:Shailesh2773@webapi.kwvqe.mongodb.net/webApi')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// In-memory storage for wishlist
let wishlist = [];

// Route to add item to the wishlist
app.post('/wishlist', (req, res) => {
  const { id, name, img } = req.body;

  // Check if the product is already in the wishlist
  const exists = wishlist.find(item => item.id === id);
  if (exists) {
    return res.status(400).json({ message: 'Product already in wishlist!' });
  }

  // Add to wishlist
  wishlist.push({ id, name, img });
  res.status(201).json({ message: 'Product added to wishlist!', wishlist });
});

// Route to get the wishlist
app.get('/wishlist', (req, res) => {
  res.json(wishlist);
});


// User Schema
const userSchema = new mongoose.Schema({
    name: String,
    mobile:{
        type: String,
        unique: true 
    },
    email:{ 
        type: String, 
        unique: true 
    },
    username:{ 
        type: String, 
        unique: true 
    },
    password: String,
});

const User = mongoose.model('User ', userSchema); // Removed extra space in model name

// Signup Route
app.post('/api/signup', async (req, res) => {
    const { name, mobile, email, username, password, confirm_password } = req.body;

    // Check if passwords match
    if (password !== confirm_password) {
        return res.status(400).json({ message: "Passwords do not match!" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, mobile, email, username, password: hashedPassword });
    try {
        await user.save();

      //generate the token
      const token = jwt.sign(
      { id: user._id, username: user.username }, // Payload
      "your-secret-key", // Replace with your secret key
      { expiresIn: "9h" } // Token expiry
      );

        res.status(201).json({ message: "User  created successfully!",token, redirectUrl: "/index.html" });
    } catch (error) {
        // Handle duplicate key errors
        if (error.code == 11000) {
            return res.status(400).json({ message: "User  with this mobile, email, or username already exists!" });
        }
        res.status(500).json({ message: "Internal server error!" });
    }
});

// Login Route
app.post('/api/login', async (req, res) => {
    const { username_or_email, password } = req.body;

    try {
        // Find user by username or email
        const user = await User.findOne({
            $or: [{ username: username_or_email }, { email: username_or_email }]
        });

        // If user doesn't exist or password is incorrect
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid credentials!" });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: user._id, username: user.username }, // Payload
            "your-secret-key", // Replace with your secret key
            { expiresIn: "1h" } // Token expiration time
        );

        // Send response with token
        res.json({
            message: "Login successful!",
            token
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error!" });
    }
});


// image storage engine

const storage = multer.diskStorage({
    destination: './upload/images',
    filename:(req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage:storage})

// creating upload Endpoint  for images

app.use('/images',express.static('upload/images'))

app.post("/upload",upload.single('product'),(req,res)=>{
      res.json({
        success:true,
        image_url:`http://localhost:${port}/images/${req.file.filename}`
      })
})

//schema for creating product

const Product= mongoose.model("product", {
    id:{
        type : Number,
        required:true, 
    },
    name:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true, //image is required
    }, 
    category:{
        type:String,
        required:true,
    },
    new_price:{
        type:Number,
        required:true,
    },
    old_price:{
        type:Number,
        required:true,
    },    
    date:{
        type:Date,
        default:Date.now,
    },
    available:{
        type:Boolean,
        default:true
    }, 
});
app.post('/addproduct', async(req,res)=>{
    let products = await Product.find({});
    let id;
    if(products.length>0){
        let last_product_array= products.slice(-1);
        let last_product= last_product_array[0];
        id = last_product.id+1
    }
    else{
        id=1;
    }
    const product = new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
    });
    console.log(product);
    await product.save();
    console.log("saved");
    res.json({
        success:true,
        name:req.body.name,
    })
})

//creating API for deleting the product

app.post('/removeproduct', async(req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("removed");
    res.json({
        success:true,
        name:req.body.name
    })
})

// creating API for getting all products

app.get('/allproducts', async (req,res)=>{
    let products = await Product.find({});
    console.log("All products fetched");
    res.send(products);  
})

app.listen(port, (error)=>{
    if(!error) {
        console.log("server running on port" +port)
    }
    else{
        console.log("error :" +error)
    }

})
