import { useEffect, useState } from 'react';
import { supabase } from '@/lib/SupabaseClient';

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
  negara: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
  const { data, error } = await supabase.from('events').select('*');

  if (error) {
    console.error("Error saat fetch data:", error);
  } else {
    console.log("Data events:", data); // Tambahkan log ini
    setEvents(data || []);
  }
  setLoading(false);
}

    fetchEvents();


  }, []);

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Daftar Event</h1>
      {events.length === 0 ? (
        <p className="text-center">Belum ada event.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map(event => (
            <div key={event.id} className="border p-4 rounded-lg shadow-lg">
              <img src={event.gambar} alt={event.judul} className="w-full h-40 object-cover rounded-md" />
              <h2 className="text-lg font-semibold mt-2">{event.judul}</h2>
              <p className="text-sm">{event.deskripsi}</p>
              <p className="text-sm text-gray-500">🗓 {event.tanggal_event}</p>
              <p className="text-sm text-gray-500">⏰ {event.jam_mulai} - {event.jam_selesai}</p>
              <p className="text-sm text-gray-500">📍 {event.lokasi}, {event.kota}, {event.negara}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
