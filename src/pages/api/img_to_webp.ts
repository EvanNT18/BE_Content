import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import parseFile from '@/lib/ParseFile';
import sharp from 'sharp';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    // Parse file content from request
    let files = undefined as unknown as Buffer<ArrayBufferLike>[];
    try {
        files = await parseFile(req, res);
    } catch (e: any) {
        return res.status(400).json({ message: e.message })
    }

    // Convert image to WebP using Sharp.js
    try {
        const webpImage = await sharp(files[0]).webp({
            quality: 50
        }).toBuffer();

        return res.setHeader(
            'Content-Type',
            'image/webp'
        ).status(200).send(webpImage);
    } catch (e: any) {
        return res.status(500).json({ message: e.message || 'Something went wrong' });
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
};
