import { NextResponse } from "next/server";
import { supabase } from '@/lib/SupabaseClient';



export async function GET(_: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    // Query data dari Supabase berdasarkan ID
    const { data, error } = await supabase
        .from("certificates") 
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
}
