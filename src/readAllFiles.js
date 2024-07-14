import fs from 'fs';
import path from 'path';

export const readFilesRecursively = (dir) => {

    let results = [];
    const list = fs.readdirSync(dir);

    list.forEach((file) => {

        file = path.resolve(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(readFilesRecursively(file));
        } else {
            results.push(file);
        }

    });

    return results;

};