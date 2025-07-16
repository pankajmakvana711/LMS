import {User} from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import { generateToken } from "../utils/generateToken.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";

export const register = async (req, res) => {
    try {
        const {name,email,password} = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({success:false,message: "Please fill in all fields"});
        }
        
        const user = await User.findOne({email});
        if (user) {
            return res.status(400).json({success:false,message: "User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({name,email,password:hashedPassword});


        return res.status(201).json({success:true,message: "User created successfully"});

    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,message: "Internal server error"});
    }
};

export const login = async (req, res) => {  
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please fill in all fields" });
        }

        // Add await here to properly fetch the user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Wrong email or password" });
        }   
        
        // Compare the password securely
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ success: false, message: "Wrong email or password" });
        }

        // Generate a token for the user
        generateToken(res, user, `Welcome back ${user.name}`);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Failed to login" });
    }
};

export const logout = async (_, res) => {
    try {
       // res.clearCookie('token');
        return res.status(200).cookie('token', '', {maxAge: 0}).json({ success: true, message: "Logged out successfully" });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Failed to logout" });
    }
}


export const getUserProfile = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId).select("-password").populate("enrolledCourses");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({ success: true,  user });
        
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Failed to get user profile" });
    }
}

export const updateProfile = async (req,res) => {
    try {
        const userId = req.id;
        const {name} = req.body;
        const profilePhoto = req.file;

        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({
                message:"User not found",
                success:false
            }) 
        }
        // extract public id of the old image from the url is it exists;
        if(user.photoUrl){
            const publicId = user.photoUrl.split("/").pop().split(".")[0]; // extract public id
            deleteMediaFromCloudinary(publicId);
        }

        // upload new photo
        const cloudResponse = await uploadMedia(profilePhoto.path);
        const photoUrl = cloudResponse.secure_url;

        const updatedData = {name, photoUrl};
        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {new:true}).select("-password");

        return res.status(200).json({
            success:true,
            user:updatedUser,
            message:"Profile updated successfully."
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to update profile"
        })
    }
}