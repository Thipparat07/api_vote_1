import express from "express";
import { conn } from "../dbconn";
import mysql from "mysql";

export const router = express.Router();


router.get("/", (req, res) => {
    // เรียกใช้งาน SQL เพื่อดึงข้อมูลทั้งหมดจากตาราง "image"
    const sql = "SELECT * FROM image ";
    conn.query(sql, (err, result) => {
      if (err) {
        res.json(err);
      } else {
        res.json(result);
      }
    });
  });