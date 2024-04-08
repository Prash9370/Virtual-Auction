require('dotenv').config();
const express = require("express");
const { ObjectId } = require("mongodb");
const bodyParser = require('body-parser');
const { MDBconnect, MDBdisconnect } = require("./mongoConnect");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.sendFile("./frontend/BlogList.html", { root: __dirname });
})

app.get("/login", (req, res) => {
    res.sendFile("./frontend/login.html", { root: __dirname });
});

app.post("/login", async (req, res) => {
    try {
        let { email, password } = req.body;
        const db = await MDBconnect();
        const collection = db.collection('users');
        const result = await collection.findOne({ email: email });
        if (password == result.password) {
            res.json({ status: 'success', username: result.name });
        } else {
            res.json({ status: 'fail' });
        }

    } catch (error) {
        console.log(error)

    } finally {
        MDBdisconnect();
    }
});


app.get("/signup", (req, res) => {
    res.sendFile("./frontend/signup.html", { root: __dirname });
})

app.post("/signup", async (req, res) => {
    try {
        let { fullName, email, password } = req.body;
        const db = await MDBconnect();
        const collection = db.collection('users');
        const result = await collection.findOne({ email: email });
        if (!result) {
            await collection.insertOne({ email: email, name: fullName, password:password });
            res.json({ status: 'success' });
        } else {
            res.json({ status: 'fail' });
        }

    } catch (error) {
        console.log(error)

    } finally {
        MDBdisconnect();
    }
})

app.get("/auctionitems", async (req, res) => {
    try {
        const db = await MDBconnect();
        const collection = db.collection('items');
        const result = await collection.find({}).toArray();
        res.json(result);
        // res.json([{
        //     imageUrl:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtoRx76lW1MsPnfdjIe0C8iyblirXt6SpRsg&s',
        //     name:'Sample Auction Item',
        //     endDate:'07-04-2024',
        //     highestBid:50000
        // }]);

    } catch (error) {
        console.log(error)

    } finally {
        MDBdisconnect();
    }
});
app.get("/createPost", (req, res) => {
    res.sendFile("./frontend/createPost.html", { root: __dirname });
})

app.post("/createPost", async (req, res) => {
    try {
        const { Title, imageUrl, startAmount,lastDate, user, mail } = req.body;
        const db = await MDBconnect();
        const collection = db.collection('items');
        const result = await collection.insertOne({Title, imageUrl, startAmount, lastDate, highestBid:startAmount, highestBidder:'owner', mail, owner:user});
        res.redirect("/");

    } catch (error) {
        console.log(error)
        res.redirect("/");
        
    } finally {
        MDBdisconnect();
    }
})

app.post("/addBid", async (req, res) => {
    try {
        const { highestBid, highestBidder, id } = req.body;
        const db = await MDBconnect();
        const collection = db.collection('items');
        const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: {highestBid:highestBid, highestBidder:highestBidder} });
        res.redirect("/dashboard");

    } catch (error) {
        console.log(error)
        res.redirect("/");

    } finally {
        MDBdisconnect();
    }
})









app.get("/displayBlog", (req, res) => {
    res.sendFile("./frontend/displayBlog.html", { root: __dirname });
})

app.get("/bloglist/personalarray", async (req, res) => {
    try {
        const db = await MDBconnect();
        const collection = db.collection('blogs');
        const result = await collection.find({ email: req.query.auth }).toArray();
        res.json(result);

    } catch (error) {
        console.log(error)

    } finally {
        MDBdisconnect();
    }
});

app.get("/displayItem", async (req, res) => {
    try {
        const db = await MDBconnect();
        const collection = db.collection('items');
        const id = new ObjectId(req.query.id)
        const result = await collection.findOne({ _id: id });
        res.json(result);

    } catch (error) {
        console.log(error)

    } finally {
        MDBdisconnect();
    }
})


app.get("/editblog", (req, res) => {
    res.sendFile("./frontend/editblog.html", { root: __dirname });
})

app.post("/updateblog", async (req, res) => {
    try {
        const { postTitle, blogCategory, postContent, author, mail, id } = req.body;
        const db = await MDBconnect();
        const collection = db.collection('blogs');
        const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: { email: mail, author: author, category: blogCategory, blogTitle: postTitle, blogContent: postContent } });
        res.redirect("/dashboard");

    } catch (error) {
        console.log(error)
        res.redirect("/");

    } finally {
        MDBdisconnect();
    }
})

app.get("/deleteblog", async (req, res) => {
    try {
        const db = await MDBconnect();
        const collection = db.collection('blogs');
        await collection.deleteOne({ _id: new ObjectId(req.query.id) });
        res.redirect("/dashboard");

    } catch (error) {
        console.log(error)
    } finally {
        MDBdisconnect();
    }
})


app.get('/dashboard', (req, res) => {
    res.sendFile("./frontend/dashboard.html", { root: __dirname });
})

app.get('/about', (req, res) => {
    res.sendFile("./frontend/about.html", { root: __dirname });
})

app.get('/contact', (req, res) => {
    res.sendFile("./frontend/contact.html", { root: __dirname });
})
app.listen(process.env.PORT||8080, () => {
    console.log("Server is running");
});