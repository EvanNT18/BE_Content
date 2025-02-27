import { supabase } from '@/lib/SupabaseClient';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }
    
    const { id } = req.query;

    // Query data dari Supabase berdasarkan ID
    const { data, error } = await supabase
        .from("certificates") 
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    return res.json(data);
}
