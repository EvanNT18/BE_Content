import { useState } from "react";
import { supabase } from "@/lib/SupabaseClient";
import { useRouter } from "next/router";
import bcrypt from "bcryptjs"; // Import bcrypt untuk hash password

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Ambil user berdasarkan email
    const { data: user, error } = await supabase
      .from("users")
      .select("id, email, password") 
      .eq("email", email)
      .single();

    setLoading(false);

    if (error || !user) {
      alert("Login gagal: Email tidak ditemukan.");
      return;
    }

  
    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) {
      alert("Login gagal: Password salah.");
      return;
    }

  
    localStorage.setItem("user", JSON.stringify(user));

    alert("Login berhasil!");
    router.push("/dashboard");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4 text-black">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded"
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
