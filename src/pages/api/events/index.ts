import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/SupabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { tanggal_event, gambar, judul, deskripsi, jam_mulai, jam_selesai, lokasi, kota, negara } = req.body;

        if (!tanggal_event || !judul || !jam_mulai || !jam_selesai || !lokasi || !kota || !negara) {
            return res.status(400).json({ error: 'Semua field wajib diisi' });
        }

        const { data, error } = await supabase.from('events').insert([
            { tanggal_event, gambar, judul, deskripsi, jam_mulai, jam_selesai, lokasi, kota, negara }
        ]);

        if (error) return res.status(500).json({ error: error.message });

        return res.status(201).json({ message: 'Event berhasil dibuat', data });
    }

    if (req.method === 'GET') {
        const { data, error } = await supabase.from('events').select('*');

        if (error) return res.status(500).json({ error: error.message });

        return res.status(200).json({ events: data });
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
