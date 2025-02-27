import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/SupabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Silahkan Isi kolom Tags' });
        }

        const { data, error } = await supabase.from('tags').insert([
            { name }
        ]);

        if (error) return res.status(500).json({ error: error.message });

        return res.status(201).json({ message: 'Tags berhasil dibuat ', data });
    }

}