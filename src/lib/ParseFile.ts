import formidable from "formidable";
import { NextApiRequest, NextApiResponse } from "next";
import fs from 'fs';

export default async function parseFile(req: NextApiRequest, res: NextApiResponse) {
    try {
        const fileContent = await new Promise((resolve, reject) => {
            formidable({multiples: true}).parse(req, (err, _fields, files) => {
                if (err) {
                    reject(err);
                    return;
                }

                if (!files.file) {
                    reject(new Error("No file uploaded."));
                    return;
                }

                let buffers = [];

                for (const file of files.file) {
                    buffers.push(fs.readFileSync(file.filepath));
                }

                resolve(buffers);
            });
        });

        return fileContent as unknown as Buffer<ArrayBufferLike>[];
    } catch (err: any) {
        throw err;
    }
}