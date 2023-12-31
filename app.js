//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
const encrypt = require("mongoose-encryption");


app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
	email: String,
	password: String
});
const secret = process.env.SECRET;
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);



app.get("/", (req, res) => {
	res.render("home");
});
app.get("/login", (req, res) => {
	res.render("login");
});
app.get("/register", (req, res) => {
	res.render("register");
});

app.post("/register", (req, res) => {
	const newUser = new User({
		email: req.body.username,
		password: req.body.password
	});
	newUser.save()
		.then(() => {
			res.render("secrets");
		})
		.catch((err) => {
			console.log(err);
		});
});

app.post("/login", (req, res) => {
	const username = req.body.username;
	const password = req.body.password;

	User.findOne({ email: username })
		.then(user => {
			if (user.password === password) {
				res.render("secrets");
			}
		})
		.catch(err => {
			console.log(err);
		});
});

app.listen(3000, () => {
	console.log("Server started on port 3000.")
});