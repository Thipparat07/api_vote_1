import express from "express";
import { conn } from "../dbconn";
import mysql from "mysql";
import { log } from "console";

export const router = express.Router();
interface EloRating {
    iid:number;
    total:string;
}

router.get("/", (req, res) => {
  // เรียกใช้งาน SQL เพื่อดึงข้อมูลทั้งหมดจากตาราง "image"
  const sql = "SELECT * FROM image";
  conn.query(sql, (err, result) => {
    if (err) {
      res.json(err);
    } else {

      const randomIndexes: number[] = [];

      // สุ่มสองตำแหน่ง (index) ที่ไม่ซ้ำกัน
      while (randomIndexes.length < 2) {

        const randomIndex = Math.floor(Math.random() * result.length);
        
        if (!randomIndexes.includes(randomIndex)) {
          randomIndexes.push(randomIndex);
        }
      }

      // เลือกรูปภาพที่สุ่มมาสองรูป
      const randomImages = randomIndexes.map((index) => result[index]);

      // ส่งข้อมูลรูปภาพที่สุ่มมายังเว็บไซต์
      res.json(randomImages);
    }
  });
});



router.get("/select/:iid", (req, res) => {
    let iid = +req.params.iid;
    conn.query("select * from score where iid = ?" , [iid], (err, result, fields) => {
    if (err) throw err;
      res.json(result);
    });
  });



  router.get("/up/:score/:iid", (req, res) => {
    let iid = +req.params.iid;
    let update: EloRating = {
        iid: iid,
        total: req.params.score
    }
    let sql =
      "update  `score` set `total`=?  where `iid`=?";
    sql = mysql.format(sql, [update.total, update.iid]);
    conn.query(sql, (err, result) => {
      if (err) throw err;
      res
        .status(201)
        .json({ success: 'Update Success' });
        
    });
  });


//   async fetchRandomImages() {
//     const url = 'http://localhost:3000/trip/picture';
//     let response = await fetch(url);
//     let data = await response.json();
//     console.log(data);


//     for (let i = data.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [data[i], data[j]] = [data[j], data[i]];
//     }

//     this.Alldata = data.slice(0, 2);
//     for (const picid of this.Alldata) {
//       this.PictureID.push(picid.pid);
//     }
//   }




// router.get("/:iid", (req, res) => {
//     const iid = req.params.iid;
//     // console.log(iid);

//     // console.log("ID pic 1 = "+this.PictureID[0]);
//     // console.log("ID pic 2 = "+this.PictureID[1]);
  
//     // เช็คว่า iid ที่ถูกส่งมามีค่าหรือไม่
//     if (!iid) {
//         return res.status(400).json({ error: "Missing iid parameter" });
//     }
  
//     // ตรวจสอบว่า iid นี้มีอยู่ในตาราง image หรือไม่
//     const checkIidQuery = "SELECT * FROM image WHERE iid = ?";
//     conn.query(checkIidQuery, [iid], (err, result) => {
//         if (err) {
//             return res.status(500).json({ error: "Database error" });
//         }
  
//         // ถ้ามี iid นี้ในตาราง image
//         if (result.length === 0) {
//             return res.status(404).json({ error: "Image not found" });
//         }
  
//         // เรียกดูคะแนนปัจจุบันจากตาราง score
//         const getCurrentScoreQuery = "SELECT total FROM score WHERE iid = ?";
//         conn.query(getCurrentScoreQuery, [iid], (err, result) => {
//             if (err) {
//                 return res.status(500).json({ error: "Error getting current score" });
//             }
  
//             // คำนวณคะแนนโดยใช้ Elo Rating Algorithm
//             const k = 32; // ค่าคงที่สำหรับการปรับปรุงคะแนน
//             const currentScore = result.length > 0 ? result[0].total : 1500; // คะแนนปัจจุบัน, ถ้าไม่มีให้ใช้ค่าเริ่มต้น
//             const expectedScoreA = 1 / (1 + 10 ** ((currentScore - 1500) / 400)); // คำนวณคะแนนที่คาดหวัง
//             const actualScoreA = 1; // คะแนนที่ได้จากโหวต (สมมติว่าเป็น 1)
  
//             const newScore = Math.round(currentScore + k * (actualScoreA - expectedScoreA));
  
//             // เช็คว่า iid นี้มีอยู่ในตาราง score หรือไม่
//             const checkScoreQuery = "SELECT * FROM score WHERE iid = ?";
//             conn.query(checkScoreQuery, [iid], (err, result) => {
//                 if (err) {
//                     return res.status(500).json({ error: "Error checking score" });
//                 }

//                 // ถ้ามี iid นี้ในตาราง score
//                 if (result.length > 0) {
//                     // อัพเดทคะแนนโหวตลงในตาราง score
//                     const updateVoteQuery = "UPDATE score SET total = ? WHERE iid = ?";
//                     conn.query(updateVoteQuery, [newScore, iid], (err) => {
//                         if (err) {
//                             return res.status(500).json({ error: "Error updating vote" });
//                         }

//                         // การโหวตสำเร็จ, ส่งผลลัพธ์ละเอียดทางหน้าจอ
//                         return res.status(200).json({
//                             success: true,
//                             currentScore: currentScore,
//                             newScore: newScore,
//                             expectedScoreA: expectedScoreA,
//                             actualScoreA: actualScoreA,
//                         });
//                     });
//                 } else {
//                     // ถ้าไม่มี iid นี้ในตาราง score
//                     // เพิ่มคะแนนโหวตลงในตาราง score
//                     const insertVoteQuery = "INSERT INTO score (`Date`, `total`, `iid`) VALUES (CURRENT_DATE(), ?, ?)";
//                     conn.query(insertVoteQuery, [newScore, iid], (err) => {
//                         if (err) {
//                             return res.status(500).json({ error: "Error voting" });
//                         }

//                         // การโหวตสำเร็จ, ส่งผลลัพธ์ละเอียดทางหน้าจอ
//                         return res.status(200).json({
//                             success: true,
//                             currentScore: currentScore,
//                             newScore: newScore,
//                             expectedScoreA: expectedScoreA,
//                             actualScoreA: actualScoreA,
//                         });
//                     });
//                 }
//             });
//         });
//     });
// });




// router.get("/:iid", (req, res) => {
//     const iid = req.params.iid;
//     console.log(iid);
  
//     // เช็คว่า iid ที่ถูกส่งมามีค่าหรือไม่
//     if (!iid) {
//       return res.status(400).json({ error: "Missing iid parameter" });
//     }
  
//     // ตรวจสอบว่า iid นี้มีอยู่ในตาราง image หรือไม่
//     const checkIidQuery = "SELECT * FROM image WHERE iid = ?";
//     conn.query(checkIidQuery, [iid], (err, result) => {
//       if (err) {
//         return res.status(500).json({ error: "Database error" });
//       }
  
//       // ถ้าไม่มี iid นี้ในตาราง image
//       if (result.length === 0) {
//         return res.status(404).json({ error: "Image not found" });
//       }
  
//       // เรียกดูคะแนนปัจจุบันจากตาราง score
//       const getCurrentScoreQuery = "SELECT total FROM score WHERE iid = ?";
//       conn.query(getCurrentScoreQuery, [iid], (err, result) => {
//         if (err) {
//           return res.status(500).json({ error: "Error getting current score" });
//         }
  
//         // คำนวณคะแนนโดยใช้ Elo Rating Algorithm
//         const k = 32; // ค่าคงที่สำหรับการปรับปรุงคะแนน
//         const currentScore = result.length > 0 ? result[0].total : 1500; // คะแนนปัจจุบัน, ถ้าไม่มีให้ใช้ค่าเริ่มต้น
//         const expectedScoreA = 1 / (1 + 10 ** ((currentScore - 1500) / 400)); // คำนวณคะแนนที่คาดหวัง
//         const actualScoreA = 1; // คะแนนที่ได้จากโหวต (สมมติว่าเป็น 1)
  
//         const newScore = Math.round(currentScore + k * (actualScoreA - expectedScoreA));
  
//         // เพิ่มคะแนนโหวตลงในตาราง score
//         const insertVoteQuery = "INSERT INTO score (`Date`, `total`, `iid`) VALUES (CURRENT_DATE(), ?, ?)";
//         conn.query(insertVoteQuery, [newScore, iid], (err) => {
//           if (err) {
//             return res.status(500).json({ error: "Error voting" });
//           }
  
//           // การโหวตสำเร็จ, ส่งผลลัพธ์ละเอียดทางหน้าจอ
//           return res.status(200).json({
//             success: true,
//             currentScore: currentScore,
//             newScore: newScore,
//             expectedScoreA: expectedScoreA,
//             actualScoreA: actualScoreA,
//           });
//         });
//       });
//     });
//   });
  


// router.get("/:iid", (req, res) => {
//     const iid = req.params.iid;
//     console.log(iid);
  
//     // เช็คว่า iid ที่ถูกส่งมามีค่าหรือไม่
//     if (!iid) {
//       return res.status(400).json({ error: "Missing iid parameter" });
//     }
  
//     // ตรวจสอบว่า iid นี้มีอยู่ในตาราง image หรือไม่
//     const checkIidQuery = "SELECT * FROM image WHERE iid = ?";
//     conn.query(checkIidQuery, [iid], (err, result) => {
//       if (err) {
//         return res.status(500).json({ error: "Database error" });
//       }
  
//       // ถ้าไม่มี iid นี้ในตาราง image
//       if (result.length === 0) {
//         return res.status(404).json({ error: "Image not found" });
//       }
  
//       // เพิ่มคะแนนโหวตลงในตาราง score
//       const insertVoteQuery = "INSERT INTO score (`Date`, `total`, `iid`) VALUES (CURRENT_DATE(), ?, ?)";
//       const voteScore = 5; // สมมติให้คะแนนเป็น 5
//       conn.query(insertVoteQuery, [voteScore, iid], (err) => {
//         if (err) {
//           return res.status(500).json({ error: "Error voting" });
//         }
  
//         // การโหวตสำเร็จ
//         return res.status(200).json({ success: true });
//       });
//     });
//   });
  

// router.get("/:iid", (req, res) => {
//     const iid = req.params.iid;
//     console.log(iid);
    
//     // เรียกใช้งาน SQL เพื่อดึงข้อมูลทั้งหมดจากตาราง "image"
//     // const sql = "SELECT * FROM image where iid = ?";
//     // conn.query(sql, [iid],(err, result) => {
//     //   if (err) {
//     //     res.json(err);
//     //   } else {
//     //     res.json(result); 
//     //   }
//     // });



//   });
