import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    
    
    if (!token) {
      return res
        .status(401)
        .json({
          message: "Not authorized to access this route",
          success: false,
        });
    }
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = await User.findById(decoded.userId).select("-password");
      
      next();
  } catch (error) {
    
    console.log("Internal server error", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
    
  }
    
};
