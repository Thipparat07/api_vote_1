import express from "express";
import { conn } from "../dbconn";
import mysql from "mysql";

export const router = express.Router();

// INSERT User with check for existing name
router.post("/", (req, res) => {
    let data = req.body;
    console.log(data);

    // ตรวจสอบว่าชื่อมีอยู่แล้วหรือไม่
    let checkNameSql = "SELECT COUNT(*) AS count FROM `user` WHERE `name` = ?";
    checkNameSql = mysql.format(checkNameSql, [data.name]);

    conn.query(checkNameSql, (checkErr, checkResult) => {
        if (checkErr) {
            console.error(checkErr);
            res.status(500).json({
                success: 'Internal Server Error'
            });
        } else {
            const nameExists = checkResult[0].count > 0;

            if (nameExists) {
                // ถ้าชื่อมีอยู่แล้ว ส่งคืนการตอบกลับที่มีรหัสสถานะ 201
                res.status(201).json({
                    success: 'Name already exists'
                });
            } else {
                // ถ้าชื่อไม่มีอยู่ ดำเนินการแทรกข้อมูลตามปกติ
                let insertSql = "INSERT INTO `user`(`name`, `password`, `email`, `type`) VALUES (?,?,?,1)";
                insertSql = mysql.format(insertSql, [data.name, data.password, data.email]);

                conn.query(insertSql, (insertErr, result) => {
                    if (insertErr) {
                        console.error(insertErr);
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
            }
        }
    });
});


// //เสร็จ
// //INSERT User
// router.post("/", (req, res) => {
//     let data = req.body;
//     console.log(data);
//     let sql = "INSERT INTO `user`(`name`, `password`, `email`, `type`) VALUES (?,?,?,1)";
//     sql = mysql.format(sql, [data.name,data.password,data.email]);

//     conn.query(sql, (err, result) => {
//         if (err) {
//             console.error(err);
//             res.status(500).json({
//                 success: 'Internal Server Error'
//             });
//         } else {
//             if (result.affectedRows === 1) {
//                 res.status(201).json({
//                     success: 'Insert Success'
//                 });
//             } else {
//                 res.status(400).json({
//                     success: 'Insert failed'
//                 });
//             }
//         }
//     });
// });




