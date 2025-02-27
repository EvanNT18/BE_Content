import { useState } from 'react';
import { supabase } from '@/lib/SupabaseClient';
import { useRouter } from 'next/router';

export default function AddEvent() {
  const [judul, setJudul] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [jamMulai, setJamMulai] = useState('');
  const [jamSelesai, setJamSelesai] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [kota, setKota] = useState('');
  const [provinsi, setprovinsi] = useState('');
  const [gambar, setGambar] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    let gambarUrl = '';
    if (gambar) {
      const fileExt = gambar.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { data, error } = await supabase.storage.from('events-images').upload(fileName, gambar);
      if (error) {
        alert('Error saat upload gambar: ' + error.message);
        setLoading(false);
        return;
      }
      gambarUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/events-images/${fileName}`;
    }

    const { error } = await supabase.from('events').insert([
      { judul, tanggal_event: tanggal, deskripsi, jam_mulai: jamMulai, jam_selesai: jamSelesai, lokasi, kota, provinsi, gambar: gambarUrl },
    ]);

    if (error) {
      alert('Gagal menambah event: ' + error.message);
    } else {
      alert('Event berhasil ditambahkan!');
      router.push('/events');
    }
    setLoading(false);
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Tambah Event Baru</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Judul" value={judul} onChange={(e) => setJudul(e.target.value)} className="border p-2 w-full bg-black" required />
        <input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} className="border p-2 w-full bg-black" required />
        <textarea placeholder="Deskripsi" value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} className="border p-2 w-full bg-black"></textarea>
        <input type="time" value={jamMulai} onChange={(e) => setJamMulai(e.target.value)} className="border p-2 w-full bg-black" required />
        <input type="time" value={jamSelesai} onChange={(e) => setJamSelesai(e.target.value)} className="border p-2 w-full bg-black" required />
        <input type="text" placeholder="Lokasi" value={lokasi} onChange={(e) => setLokasi(e.target.value)} className="border p-2 w-full bg-black" required />
        <input type="text" placeholder="Kota" value={kota} onChange={(e) => setKota(e.target.value)} className="border p-2 w-full bg-black" required />
        <input type="text" placeholder="provinsi" value={provinsi} onChange={(e) => setprovinsi(e.target.value)} className="border p-2 w-full bg-black" required />
        <input type="file" onChange={(e) => setGambar(e.target.files?.[0] || null)} className="border p-2 w-full" accept="image/*" />

        <button type="submit" disabled={loading} className="bg-blue-500 text-white px-4 py-2 w-full">
          {loading ? 'Menambahkan...' : 'Tambah Event'}
        </button>
      </form>
    </div>
  );
}
