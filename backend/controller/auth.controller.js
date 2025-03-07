import User from "../models/user.model.js";
import { uploadImage } from "../config/clodinary.js";
import { generateToken } from "../config/generateToken.js";
export const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const profilePic = req.file;
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    let cloudinaryResponse;
    if (profilePic) {
      cloudinaryResponse = await uploadImage(profilePic.path);
    }
    const newUser = await User.create({
      fullName,
      email,
      password,
      profileImage: cloudinaryResponse?.url,
    });
    res
      .status(201)
      .json({ message: "User created successfully", user: newUser, success: true });
  } catch (error) {
    console.log("Internal server error", error.message);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = generateToken(user._id, res);

    res
      .status(200)
      .json({ message: "User logged in successfully", success: true,user });
  } catch (error) {
    console.log("Internal server error", error.message);
  }
};

export const getUserInfo = async (req, res) => { 
  try {
    res.status(200).json({ user: req.user, success: true });
  } catch (error) {
    console.log("Internal server error ", error.message);
    return res.status(500).json({ message: "Internal server error",success: false });  
    
  }
}

export const logout = async (req, res) => {
  try {
    res
      .status(200).cookie("token","",{maxAge: 0}).json({ message: "User logged out successfully", success: true });
  } catch (error) {
    console.log("Internal server error ", error.message);
    return res.status(500).json({ message: "Internal server error",success: false });
    
  }
 }