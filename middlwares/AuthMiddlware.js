const jwt = require("jsonwebtoken");
const User = require("../models/User");

const Check = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    const token = authHeader.replace("Bearer ", "");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded._id,
      deletedAt: null,
    }).select("-password");

    if (!user) {
      return res.status(401).json({ message: "No user found" });
    }

    const id = user._id.toString();
    res.locals.id = id;
    res.locals.AuthUser = user;

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: error.message });
  }
};

module.exports = { Check };
