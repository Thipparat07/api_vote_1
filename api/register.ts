import express from "express";
import { conn } from "../dbconn";
import mysql from "mysql";

export const router = express.Router();

//เสร็จ
//INSERT User
router.post("/", (req, res) => {
    let data = req.body;
    console.log(data);
    let sql = "INSERT INTO `user`(`name`, `password`, `email`, `type`) VALUES (?,?,?,1)";
    sql = mysql.format(sql, [data.name,data.password,data.email]);

    conn.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({
                success: 'Internal Server Error'
            });
        } else {
            if (result.affectedRows === 1) {
                res.status(201).json({
                    success: 'Insert Success'
                });
            } else {
                res.status(400).json({
                    success: 'Insert failed'
                });
            }
        }
    });
});




