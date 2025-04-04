import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
    const { email, password, fullName}= req.body;
    try {
    
    if( password.length < 6){
        return res.status(400).json({message: "Password must be more than 6 characters"});
    }

    const user = await User.findOne({email});

    if(user){
        return res.status(400).json({message: "Email already exists"})
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
        fullName,
        email,
        password: hashedPassword
    });

    if(newUser){
        generateToken(newUser._id, res);
        await newUser.save();

        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic
        })
    } else {
        res.status(400).json({error: "Invalid user data"});
    }
    } catch(error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
    

};

export const login = async(req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({error: "Invalid Credentials"});
        }

        const isPasswordCorrect  = await bcrypt.compare(password, user.password);

        if(!isPasswordCorrect) {
            return res.status(400).json({error: "Invalid Credentials"});
        }

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        })
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({error: "Internal Server Error"});    
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge : 0});
        res.status(200).json({message: "Logged out Successfully"});
    } catch (error) {
        console.log('Error in logout controller', error.message)
        res.status(500).json({error: "Internal Server Error"}); 
    }
};

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const profilePic = req.file ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` : null;

        if(!req.file) {
            return res.status(400).json({message: "No File Uploaded"})
        };

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "profile-pictures",
            use_filename: true,
        })

        // Store file path

        // Update user profile with new image URL
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic : result.secure_url },
            { new: true }
        );

        res.json(updatedUser);
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Error updating profile" });
    }
};


export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log('Error in check Authentication', error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}