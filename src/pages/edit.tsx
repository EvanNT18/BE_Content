import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/SupabaseClient";

interface Event {
  id: string;
  tanggal_event: string;
  gambar: string;
  judul: string;
  deskripsi: string;
  jam_mulai: string;
  jam_selesai: string;
  lokasi: string;
  kota: string;
  provinsi: string;
}

export default function EditEventPage() {
  const router = useRouter();
  const id = typeof router.query.id === "string" ? router.query.id : ""; // ✅ FIXED
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function fetchEvent() {
      console.log("🔍 Fetching event ID:", id);
      const { data, error } = await supabase.from("events").select("*").eq("id", id).single();

      if (error) {
        console.error("❌ Error fetching event:", error.message);
        return;
      }

      console.log("✅ Event ditemukan:", data);
      setEvent(data);
      setLoading(false);
    }

    fetchEvent();
  }, [id]);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!event) return;

    console.log("🔍 Data sebelum update:", event);
    console.log("📤 Data yang akan dikirim:", {
      judul: event.judul,
      deskripsi: event.deskripsi,
      tanggal_event: event.tanggal_event,
      jam_mulai: event.jam_mulai,
      jam_selesai: event.jam_selesai,
      lokasi: event.lokasi,
      kota: event.kota,
      provinsi: event.provinsi,
    });


    setUpdating(true);

    const { data, error } = await supabase
      .from("events")
      .update({
        judul: event.judul,
        deskripsi: event.deskripsi,
        tanggal_event: event.tanggal_event,
        jam_mulai: event.jam_mulai,
        jam_selesai: event.jam_selesai,
        lokasi: event.lokasi,
        kota: event.kota,
        provinsi: event.provinsi,
      })
      .eq("id", String(event.id))
      .select(); // Ambil data setelah update

    console.log("🔄 Data setelah update:", data);
    if (error) {
      console.error("❌ Error saat update:", error);
    } else {
      alert("✅ Event berhasil diperbarui!");
    }


    setUpdating(false);
  }


  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setEvent((prev) => prev ? { ...prev, [name]: value } : null);
  }

  if (loading) return <p className="text-center">Loading...</p>;
  if (!event) return <p className="text-center">Event tidak ditemukan.</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Event</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          type="text"
          name="judul"
          value={event.judul}
          onChange={handleChange}
          placeholder="Judul Event"
          className="w-full p-2 border rounded bg-black text-white"
          required
        />
        <textarea
          name="deskripsi"
          value={event.deskripsi}
          onChange={handleChange}
          placeholder="Deskripsi Event"
          className="w-full p-2 border rounded bg-black text-white"
          required
        />
        <input
          type="date"
          name="tanggal_event"
          value={event.tanggal_event}
          onChange={handleChange}
          className="w-full p-2 border rounded bg-black text-white"
          required
        />
        <input
          type="time"
          name="jam_mulai"
          value={event.jam_mulai}
          onChange={handleChange}
          className="w-full p-2 border rounded bg-black text-white"
          required
        />
        <input
          type="time"
          name="jam_selesai"
          value={event.jam_selesai}
          onChange={handleChange}
          className="w-full p-2 border rounded bg-black text-white"
          required
        />
        <input
          type="text"
          name="lokasi"
          value={event.lokasi}
          onChange={handleChange}
          placeholder="Lokasi"
          className="w-full p-2 border rounded bg-black text-white"
          required
        />
        <input
          type="text"
          name="kota"
          value={event.kota}
          onChange={handleChange}
          placeholder="Kota"
          className="w-full p-2 border rounded bg-black text-white"
          required
        />
        <input
          type="text"
          name="provinsi"
          value={event.provinsi}
          onChange={handleChange}
          placeholder="provinsi"
          className="w-full p-2 border rounded bg-black text-white"
          required
        />
        <button
          type="submit"
          className={`bg-blue-500 text-white px-4 py-2 ${updating ? "opacity-50" : ""}`}
          disabled={updating}
        >
          {updating ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </form>
      <button
        onClick={() => router.push("/dashboard")}
        className="mt-4 text-gray-600 underline"
      >
        Kembali ke Dashboard Event
      </button>
    </div>
  );
}
