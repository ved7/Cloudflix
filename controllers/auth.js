const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");


//register
exports.register = async (req, res) => {
  console.log(req.body);
  const { name, email, password, passwordConfirm } = req.body;
  try {
    if (name === "") {
      return res.render("register", {
        message: "Name is empty!",
      });
    }
    if (email === "") {
      return res.render("register", {
        message: "Email address is empty!",
      });
    }
    if (password === "") {
      return res.render("register", {
        message: "Password cannot be empty!",
      });
    }
    if (passwordConfirm === "") {
      return res.render("register", {
        message: "Please enter Confirm Password also",
      });
    }
    if (password.length < 3) {
      return res.render("register", {
        message: "Password too short(length should be 3 or more)",
      });
    }
    if (password !== passwordConfirm) {
      return res.render("register", {
        message: "Password not matched",
      });
    }
    let user = await User.findOne({ email });
    if (user) {
      return res.render("register", {
        message: "User already exists",
      });
    }

    user = new User({
      name,
      email,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    if (await user.save()) {
      return res.render("register", {
        message: "User Registered in DB",
      });
    } else {
      return res.render("register", {
        message: "may be some error",
      });
    }
  } catch (e) {
    console.log(err.message);
    res.status(500).send("Error in Saving");
  }
};

//login
exports.login = async (req, res) => {
  const { name, password } = req.body;
  try {
    let user = await User.findOne({
      name,
    });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).render("login", {
        message: "email or password is incorrect",
      });
    else {
      const id = user.id;
      //note: jwt is for autherization not authentication
      //means user who has send the request has access to particular web-page or royalties
      const token = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });
      console.log("The token is : " + token);

      const cookieOptions = {
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
      };

      res.cookie("jwt", token, cookieOptions);
      return res.status(200).redirect("dashboard");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

