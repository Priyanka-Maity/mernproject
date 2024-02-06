require('dotenv').config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");
const ejs = require("ejs");
const { Image, Message } = require("./mongodb");
const customer = require("./middleware/auth.controll");
const auth = require("./middleware/auth");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const cookieParsar = require("cookie-parser");

app.use(express.json())
app.use(cookieParsar())
app.use(express.static("public"))
app.use(express.urlencoded({ extended: false }))
// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "public", "views"))

app.get("/home", auth, (req, res) => {
  res.render("home")
})

app.get("/", (req, res) => {
  res.render("login")
})

app.get("/signup", (req, res) => {
  res.render("signup")
})

app.get("/adminlogin", (req, res) => {
  res.render("adminlogin")
})

app.get("/admin", (req, res) => {
  res.render("admin")
});

app.get("/review", (req, res) => {
  res.render("review")
})
app.get("/logout", auth, async (req, res) => {
  try {

    req.user.tokens = req.user.tokens.filter((currElement) => {
      return currElement.token != req.token
    })
    res.clearCookie("jwt")
    console.log("logout success")
    await req.user.save()
    res.render("login");
  }
  catch (error) {
    res.status(500).send(error);

  }
})

app.get("/gallery", async (req, res) => {
  try {
    const images = await Image.find();
    console.log("Images:", images);
    res.render("gallery", { images });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Internal Server Error");
  }
});



app.post("/signup", async (req, res) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    number: req.body.number,
  }
  const customerInstance = new customer(data);
  try {
    const token = await customerInstance.generateAuthToken();
    console.log(token)

    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 600000),
      httpOnly: true
    })
    const result = await customerInstance.save();
    console.log("User created:", result);
    res.render("login");
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("Internal Server Error");
  }
})

app.post("/login", async (req, res) => {

  try {
    const check = await customer.findOne({ name: req.body.name })

    if (check.password === req.body.password) {
      const token = await check.generateAuthToken();
      console.log(token)
      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 600000),
        httpOnly: true
      });
      res.redirect("home");

    } else {
      res.send("Wrong password")
    }
  } catch {
    res.send("Wrong details")
  }
})

app.post("/adminlogin", async (req, res) => {

  try {
    const check = await customer.findOne({ name: "Admin" })
    if (check.password === "admin123") {
      const allSignupData = await customer.find();
      const Signupno = await customer.find().count()
      const UserReview = await Message.find()
      console.log("please:", UserReview)
      res.render("admin", { allSignupData, Signupno, UserReview });
    } else {
      res.send("Wrong password")
    }
  }
  catch {
    res.send("Wrong details")
  }
})

app.post('/admin', upload.array('fileInputName'), async (req, res) => {
  // Access the uploaded files using req.files
  const images = req.files.map(file => ({ filename: file.filename }));

  try {
    const createdImages = await Image.insertMany(images);
    console.log("Images created:", createdImages);

    res.redirect('/gallery');
  } catch (error) {
    console.error("Error creating images:", error);
  }
});

app.post("/review", async (req, res) => {
  const msg = {
    user: req.body.user,
    address: req.body.address,
    message: req.body.message,
  }
  try {
    const Reviews = await Message.create(msg)
    console.log(Reviews);
    res.send("succsess")
  } catch {
    res.status(500).send("Internal Server Error");
  }
})

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


