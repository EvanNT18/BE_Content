import { useEffect, useState } from "react";
import { supabase } from "@/lib/SupabaseClient";
import { useRouter } from "next/router";

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

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchEvents() {
      try {
        const { data, error } = await supabase.from("events").select("*");
        if (error) throw error;
        setEvents(data ?? []);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  async function handleDelete(id: string) {
    try {
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) throw error;
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
    } catch (error) {
      alert("Gagal menghapus event: " + (error as Error).message);
    }
  }

  async function handleLogout() {
    try {
      await supabase.auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Gagal logout:", error);
    }
  }

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dashboard Event</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2">
          Logout
        </button>
      </div>
      <button
        onClick={() => router.push("add")}
        className="bg-green-500 text-white px-4 py-2 mb-4"
      >
        Tambah Event
      </button>

      {events.length === 0 ? (
        <p className="text-center">Belum ada event.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <div key={event.id} className="border p-4 rounded-lg shadow-lg">
              <img
                src={event.gambar}
                alt={event.judul}
                className="w-full h-40 object-cover rounded-md"
              />
              <h2 className="text-lg font-semibold mt-2">{event.judul}</h2>
              <p className="text-sm">{event.deskripsi}</p>
              <p className="text-sm text-gray-500">🗓 {event.tanggal_event}</p>
              <p className="text-sm text-gray-500">
                ⏰ {event.jam_mulai} - {event.jam_selesai}
              </p>
              <p className="text-sm text-gray-500">
                📍 {event.lokasi}, {event.kota}, {event.provinsi}
              </p>
              <button
                onClick={() => router.push(`edit?id=${event.id}`)}
                className="bg-blue-500 text-white px-2 py-1 mt-2 mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(event.id)}
                className="bg-red-500 text-white px-2 py-1 mt-2"
              >
                Hapus
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
