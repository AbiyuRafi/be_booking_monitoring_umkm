const Middleware = require("../middleware/Auth");
const db = require("../models/Index");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const fs = require('fs');

class UserController {
    async register(req, res) {
        try {
            const { name, email, password, role } = req.body;
                if (!name || !email || !password || !role) {
                    return res.status(400).json({ message: "All fields are required" });
                }
                if (!validator.isEmail(email)) {
                    return res.status(400).json({ message: "Invalid email format" });
                }
                const allowedRoles = ['umkm', 'konsultan'];
                if (!allowedRoles.includes(role.toLowerCase())) {
                    return res.status(400).json({ message: "Role must be either 'umkm' or 'konsultan'" });
                }
                const existingUser = await db.Users.findOne({ where: { email } });
                if (existingUser) {
                    return res.status(400).json({ message: "Email already exists" });
                }
                const hashedPassword = await bcrypt.hash(password, 10);
                    const user = await db.Users.create({
                        name,
                        email,
                        password: hashedPassword,
                        role: role.toLowerCase(),
                    });
                const token = Middleware.generateToken(user);
            return res.status(201).json({
                status: "success",
                message: "User registered successfully",
                result: {
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                },
            });
        } catch (error) {
            console.error("Error during user registration:", error);
                return res.status(500).json({ message: "Internal server error" });
        }
    }

    async getAllUsers(req, res) {
        try {
            const users = await db.Users.findAll({
                attributes: ['id', 'name', 'email', 'role'], 
            });
            return res.status(200).json({
                status: "success",
                message: "Users retrieved successfully",
                result: users,
            });
        } catch (error) {
            console.error("Error retrieving users:", error);
            return res.status(500).json({
                status: "error",
                message: "Internal server error",
            });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: "Email and password are required" });
            }
            if (!validator.isEmail(email)) {
                return res.status(400).json({ message: "Invalid email format" });
            }
            const userData = await db.Users.findOne({ where: { email } });
            if (!userData) {
                return res.status(401).json({ message: "Invalid email or password" });
            }
            const isMatch = await bcrypt.compare(password, userData.password);
            if (!isMatch) {
                return res.status(401).json({ message: "Invalid email or password" });
            }
            const token = Middleware.generateToken(userData);
            let redirectUrl = "/";
            switch (userData.role) {
                case "umkm":
                redirectUrl = "/dashboard/umkm";
                break;
                case "konsultan":
                redirectUrl = "/dashboard/konsultan";
                break;
                case "admin":
                redirectUrl = "/dashboard/admin";
                break;
            }
            return res.status(200).json({
                status: "success",
                message: "Login successfully",
                result: {
                token,
                user: {
                    id: userData.id,
                    name: validator.escape(userData.name),
                    email: validator.escape(userData.email),
                    role: userData.role,
                    redirectUrl,
                },
                },
            });
        } catch (error) {
            console.error("Login error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async checkAuth(req, res)
    {
        try {
            const user = req.user;
            if (!user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            return res.status(200).json({
                message: "Authenticated",
                user: {
                    id: user.id,
                    name: validator.escape(user.name || ''),
                    email: validator.escape(user.email || ''),
                    role: validator.escape(user.role || ''),
                },
            });
            } catch (error) {
                console.error("Auth check error:", error);
                return res.status(500).json({ message: "Internal server error" });
            }
    }

    async getAllKonsultan (req, res)
    {
        try{
            const konsultan = await db.Users.findAll({
                where: {
                    role: "konsultan"
                }
            });
            return res.status(200).json({
                status: "success",
                message: "Konsultan retrieved successfully",
                result: konsultan,
            });
        } catch {
            return res.status(500).json({
                status: "error",
                message: "Failed to retrieve konsultan",
            }); 
        }
    }
}


module.exports = new UserController();

