//Routerหาเส้นทาง
import express from "express";
import multer from 'multer';
import path from "path"
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage"
import { initializeApp } from "firebase/app";
export const router = express.Router();

const firebaseConfig = {
  apiKey: "AIzaSyBoWHyio2SC1fm9_ndtQ8iSLLvWaK4t0zM",
  authDomain: "pet-x-34eeb.firebaseapp.com",
  projectId: "pet-x-34eeb",
  storageBucket: "pet-x-34eeb.appspot.com",
  messagingSenderId: "545684297853",
  appId: "1:545684297853:web:70cda52e85de5664a3f914",
  measurementId: "G-MYEKZN92YZ"
};


initializeApp(firebaseConfig);
const storage = getStorage();

class FileMiddleware {
    //Attribute  filename
    filename = "";

    //Attribute  diskLoader
    //Create opject of diskLoader for saving file
    public readonly diskLoader = multer({
        //storage = define folder (disk) to be saved
        storage: multer.memoryStorage(),
        limits: {
            fileSize: 67108864, // 64 MByte
        },
    });
}

const fileUpload = new FileMiddleware();

router.post("/", fileUpload.diskLoader.single("file"), async (req, res) => {

    const filename = Date.now() + "-" + Math.round(Math.random() * 10000) + ".png";

    const storageRef = ref(storage, "/imagse/" + filename);

    const metadata = {
        contentType: req.file!.mimetype
    }

    const snapshot = await uploadBytesResumable(storageRef, req.file!.buffer, metadata);

    const url = await getDownloadURL(snapshot.ref);

    res.status(200).json({
        file: url + fileUpload.filename
    });
})



//GET/upload
router.get('/', (req, res) => {
    res.send('Method Get in upload.ts');
});

