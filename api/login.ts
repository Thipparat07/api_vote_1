import express from "express";
import { conn } from "../dbconn";
import mysql from "mysql";
// import Swal from "sweetalert2";

export const router = express.Router();

//เสร็จ
router.post("/", (req, res) => {
    let data = req.body;
    let sql = "select * from user where name = ? AND password = ?";

    sql = mysql.format(sql, [data.name, data.password]);

    conn.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({
                message: 'Internal Server Error'
            });
        } else {
            if (result.length > 0) {
                const user = result[0];
                
                res.status(200).json({
                    success: true,
                    message: 'Authentication Success',
                    uid: user.uid,
                    name: user.name,
                    password:user.password,
                    
                });
                console.log(user);
            } else {
                res.json({
                    success: false,
                    message: 'Authentication failed'
                });
                // res.status(400).json({
                //     message: 'Insert failed'
                // });
            }
        }
    });
});
