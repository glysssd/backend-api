const db = require("../db");
const bcrypt = require("bcrypt");

const getUsers = async (req, res) => {
    try {
        const result = await db.execute("SELECT * FROM users");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

const getUser = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.execute({
            sql: "SELECT * FROM users WHERE user_id = ?",
            args: [id],
        });

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

const createUser = async (req, res) => {
    try {
        const {
            user_login,
            user_pass,
            fname,
            lname,
            gender,
            user_level,
            branch_cd,
            email,
            user_activation_key,
            isActive,
        } = req.body;

        const hashedPassword = await bcrypt.hash(user_pass, 10);

        await db.execute({
            sql: `
                INSERT INTO users
                (
                    user_login,
                    user_pass,
                    fname,
                    lname,
                    gender,
                    user_level,
                    branch_cd,
                    email,
                    user_activation_key,
                    isActive
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            args: [
                user_login,
                hashedPassword,
                fname,
                lname,
                gender,
                user_level || 0,
                branch_cd || "",
                email || "",
                user_activation_key || "",
                isActive ?? 1,
            ],
        });

        res.status(201).json({
            message: "User created successfully",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            user_login,
            fname,
            lname,
            gender,
            user_level,
            branch_cd,
            email,
            isActive,
        } = req.body;

        await db.execute({
            sql: `
                UPDATE users
                SET
                    user_login=?,
                    fname=?,
                    lname=?,
                    gender=?,
                    user_level=?,
                    branch_cd=?,
                    email=?,
                    isActive=?
                WHERE user_id=?
            `,
            args: [
                user_login,
                fname,
                lname,
                gender,
                user_level,
                branch_cd,
                email,
                isActive,
                id,
            ],
        });

        res.json({
            message: "User updated successfully",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        await db.execute({
            sql: "DELETE FROM users WHERE user_id=?",
            args: [id],
        });

        res.json({
            message: "User deleted successfully",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
};