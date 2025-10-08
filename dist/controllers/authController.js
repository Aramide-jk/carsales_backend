"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.getAllUsers = exports.adminLogout = exports.adminLogin = exports.logoutUser = exports.getProfile = exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const UserModel_1 = __importDefault(require("../models/UserModel"));
// Generate JWT
const generateToken = (id, role) => {
    return jsonwebtoken_1.default.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};
exports.registerUser = (0, express_async_handler_1.default)(async (req, res) => {
    const { name, email, password, role } = req.body;
    // Check if user already exists
    const userExists = await UserModel_1.default.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }
    const user = new UserModel_1.default({
        name,
        email,
        password,
        role: role || "user",
    });
    await user.save();
    res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id, user.role),
    });
    console.log("User registered:", email);
});
exports.loginUser = (0, express_async_handler_1.default)(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        console.warn("Login attempt with missing email/password");
        res.status(400);
        throw new Error("Email and password are required");
    }
    const user = await UserModel_1.default.findOne({ email });
    if (!user) {
        res.status(401);
        throw new Error("Invalid credentials");
    }
    const isValid = await bcryptjs_1.default.compare(password, user.password);
    if (!isValid) {
        res.status(401);
        throw new Error("Invalid credentials");
    }
    const token = generateToken(user.id, user.role);
    res.status(200).json({ user, token });
});
const getProfile = async (req, res) => {
    try {
        // assuming you use JWT middleware and put `req.user.id`
        const user = await UserModel_1.default.findById(req.user.id).select("-password");
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }
        res.json({ success: true, data: user });
    }
    catch (error) {
        console.error("Profile fetch error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.getProfile = getProfile;
// Logout User
exports.logoutUser = (0, express_async_handler_1.default)(async (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: "Logged out successfully" });
});
exports.adminLogin = (0, express_async_handler_1.default)(async (req, res) => {
    const { email, password } = req.body;
    const admin = await UserModel_1.default.findOne({ email, role: "admin" });
    if (admin && (await bcryptjs_1.default.compare(password, admin.password))) {
        res.json({
            _id: admin.id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
            token: generateToken(admin.id, admin.role),
        });
    }
    else {
        res.status(401);
        throw new Error("Invalid admin credentials");
    }
});
exports.adminLogout = (0, express_async_handler_1.default)(async (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: "Admin logged out successfully" });
});
exports.getAllUsers = (0, express_async_handler_1.default)(async (req, res) => {
    const users = await UserModel_1.default.find().select("-password");
    res.json(users);
});
exports.deleteUser = (0, express_async_handler_1.default)(async (req, res) => {
    const user = await UserModel_1.default.findById(req.params.id);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }
    await user.deleteOne();
    res.json({ message: "User removed" });
});
