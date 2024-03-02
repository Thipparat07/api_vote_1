import express from "express";
import { conn } from "../dbconn";
import mysql from "mysql";

export const router = express.Router();


class EloRating {
    static calculateNewRating(playerRating: number, opponentRating: number, result: number): number {
      const kFactor = 32; // ค่า K-factor ที่ใช้ในการปรับคะแนน
  
      const expectedScore = 1 / (1 + 10 ** ((opponentRating - playerRating) / 400));
      const actualScore = result;
  
      const ratingChange = kFactor * (actualScore - expectedScore);
  
      const newRating = playerRating + ratingChange;
  
      return Math.round(newRating); // ให้คะแนนเป็นจำนวนเต็ม
    }
  }
  
  // ตัวอย่างการใช้งาน
  const playerRating = 1500;
  const opponentRating = 1600;
  const result = 1; // 1 หมายถึงชนะ, 0.5 หมายถึงเสมอ, 0 หมายถึงแพ้
  
  const newRating = EloRating.calculateNewRating(playerRating, opponentRating, result);
  
  console.log(`คะแนนใหม่ของผู้เล่น: ${newRating}`);
  