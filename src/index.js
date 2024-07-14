import express from 'express';
import { generateRandomId } from './generateRandomId.js';
import simpleGit from 'simple-git';
import dotenv from "dotenv";
import { storage } from './firebase.config.js';
import { ref, uploadBytes } from "firebase/storage";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFilesRecursively } from './readAllFiles.js';

const app = express();
app.use(express.json());

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const git = simpleGit();


app.post('/deploy', async (req, res) => {
    try {
        const repoUrl = req.body.repoUrl;
        if (!repoUrl) throw new Error('Repository URL not provided');

        const id = generateRandomId();
        const repoPath = path.join(__dirname, 'outputs', id);

        await git.clone(repoUrl, repoPath);

        const files = readFilesRecursively(repoPath);
        console.log(files);


        files.forEach(async (file) => {

            const stats = fs.statSync(file);

            if (stats.isDirectory()) {
                const relativePath = path.join(path.relative(repoPath, file), '/'); // Add trailing slash
                const storageRef = ref(storage, path.join('projects', id, relativePath));
                await uploadBytes(storageRef, new Blob([]));
            } else {
                const relativePath = path.relative(repoPath, file);
                const storageRef = ref(storage, path.join('projects', id, relativePath));
                const fileContent = fs.readFileSync(file);

                await uploadBytes(storageRef, fileContent);
            }

        })

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


app.listen(3000, () => {
    console.log('listening on port 3000');
});