import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/SupabaseClient";
import bcrypt from "bcrypt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email dan password wajib diisi" });
  }

  try {
    // Hash password dengan bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Simpan ke database Supabase
    const { data, error } = await supabase.from("users").insert([
      { email, password: hashedPassword }
    ]);

    if (error) {
      throw error;
    }

    return res.status(201).json({ message: "Akun berhasil dibuat", user: data });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}
