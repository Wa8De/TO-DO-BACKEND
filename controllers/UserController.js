const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// Create a new user
const Register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user
    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
    });

    // Exclude password from the response
    const { password: _, ...userWithoutPassword } = newUser.toJSON();

    return res.status(201).json({
      message: "User created successfully !",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

const Login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    // Find the user by email (case-insensitive)
    const user = await User.findOne({ email: email.toLowerCase() });

    // Perform a timing-safe comparison for invalid credentials
    const isPasswordValid = user
      ? await bcrypt.compare(password, user.password)
      : false;

    if (!user || !isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const expirationTime = rememberMe ? "30d" : "24h";
    // Generate a JWT
    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: expirationTime }
    );

    // Return the token and user data
    return res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      token,
      rememberMe,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

const AuthenticatedUser = async (req, res) => {
  try {
    const { id } = res.locals;

    // Find the user by email (case-insensitive)
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "User Not Valid , please reauthanticate" });
    }
    // Perform a timing-safe comparison for invalid credentials

    // Return the token and user data
    return res.status(200).json({
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

module.exports = {
  Register,
  Login,
  AuthenticatedUser,
};
