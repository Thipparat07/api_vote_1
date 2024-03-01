//Routerหาเส้นทาง
import { json } from "body-parser";
import express, { query } from "express";
import { conn } from "../dbconn";
export const router = express.Router();

//Get tips from datbase
router.get('/', (req, res)=>{
    if(req.query.id){
        const id = req.query.id;
        const name = req.query.name;
        res.send('Method GET in trip.ts with ' +id+' '+name);
    }else{
        const sql = "select * from trip";
        conn.query(sql, (err, result,)=>{
            if(err){
                res.json(err);
            }else{
                res.json(result);
            }
        });
    }
    
});

router.get("/:id", (req,res)=>{
    const id = req.params.id;
    // res.send("Method GET in trip.ts with" +id);
    const sql = "select * from trip where idx = ?";
    conn.query(sql,[id], (err, result,)=>{
        if(err){
            res.json(err);
        }else{
            res.json(result);
        }
    });
});

// router.get("/:price", (req,res)=>{
//     const price = req.params.price;
//     // res.send("Method GET in trip.ts with" +id);
//     const sql = "select * from trip where price < ?";
//     conn.query(sql,[price], (err, result,)=>{
//         if(err){
//             res.json(err);
//         }else{
//             res.json(result);
//         }
//     });
// });

//post
router.post("/", (req,res)=>{
    const body = req.body;
    // res.status(201);
    // res.send("Method Post in trip.ts with " + JSON.stringify(body));
    res.status(201).json(body);
});

//../trip/
router.get("/search/fields",(req,res)=>{
    const id = req.query.id;
    const name = req.query.name;

    const sql = "select * from trip where "+
    "(idx IS NULL OR idx = ?) OR (name IS NULL OR name like ?)";

    conn.query(sql,[id,"%"+name+"%"],(err,result)=>{
        res.json(result);
    })


})