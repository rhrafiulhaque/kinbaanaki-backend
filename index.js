//Must Be Prepared The Database Start
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const res = require('express/lib/response');
const app = express();
const bcrypt = require("bcrypt");
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@cluster0.x5fc9ya.mongodb.net/?retryWrites=true&w=majority`;
// const uri = `mongodb://localhost:27017/kinbaanaki`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//Verify JWT Function Start
function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'UnAuthorized access' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'Forbidden access' })
        }
        req.decoded = decoded;
        next();
    });
}
//Verify JWT Function End


// Must Be Prepared The Database END

async function run() {
    try {

        // Connection to Server and Databse Collections 
         client.connect();
        const productsCollection = client.db('kinbaaNaki').collection('products');
        const usersCollection = client.db('kinbaaNaki').collection('users');

        //Register Auth

        //Check is Admin

        app.get('/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = {email:email};
            const result = await usersCollection.findOne(query);
            res.send(result);
        })

        //Add New products
         app.post('/addproduct', async (req, res) => {            
            const productName = { product_name: req.body.productName };
            const productExist = await productsCollection.findOne(productName);
            if (!productExist) {
                const data = {
                    product_name: req.body.productName,
                    price: req.body.price,                    
                    brand: req.body.brand,
                    description: req.body.description,      
                    img: req.body.imageLink,                    
                    availibility: true,
                    category: req.body.category,
                    ratings: 0,
                    size: req.body.sizes
                };
                const result = await productsCollection.insertOne(data);
                res.send(result)
            }else{
                res.status(400).json({
                    "error":'Product Exist'
                })
            }
        })



        // All Products fetch or get
        app.get('/products', async (req, res) => {
            const query = {};
            const products = await productsCollection.find(query).toArray();
            res.send(products);
        })

        // Get Product by ID 

        app.get('/product/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) };
            const product = await productsCollection.findOne(query);
            res.send(product);
        })

        app.post('/register', async (req, res) => {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const email = { email: req.body.email };
            const userExist = await usersCollection.findOne(email);
            if (!userExist) {
                const data = {
                    name: req.body.name,
                    email: req.body.email,
                    password: hashedPassword,
                    role: 'user'
                };
                const result = await usersCollection.insertOne(data);
                res.send(result)
            }else{
                res.status(400).json({
                    "error":'User Exist'
                })
            }
        })

        
        



        // //Get All Product Start
        // app.get('/products', async(req,res)=>{
        //     const query ={};
        //     const products = await productCollection.find(query).toArray();
        //     res.send(products);
        // })
        // //Get All Product End



    }
    finally {

    }
}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('Hello From KinbaaNaki 2');
});
app.listen(port, () => {
    console.log(`KinbaNaki App Listening on Port ${port}`);
})
