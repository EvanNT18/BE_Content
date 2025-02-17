import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/SupabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'ID event tidak valid' });
    }

    if (req.method === 'PUT') {
        const { tanggal_event, gambar, judul, deskripsi, jam_mulai, jam_selesai, lokasi, kota, negara } = req.body;

        const { data, error } = await supabase
            .from('events')
            .update({ tanggal_event, gambar, judul, deskripsi, jam_mulai, jam_selesai, lokasi, kota, negara })
            .eq('id', id);

        if (error) return res.status(500).json({ error: error.message });

        return res.status(200).json({ message: 'Event berhasil diperbarui', data });
    }

    if (req.method === 'DELETE') {
        const { error } = await supabase.from('events').delete().eq('id', id);

        if (error) return res.status(500).json({ error: error.message });

        return res.status(200).json({ message: 'Event berhasil dihapus' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
