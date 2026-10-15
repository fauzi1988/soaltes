import Dexie from 'dexie';

export const db = new Dexie('cbtSMA');
db.version(1).stores({
  users: '++id, username, role, active', siswa: '++id, &nisn, nama, kelasId, rombel, active',
  guru: '++id, &username, nama, mapelId', kelas: '++id, nama, tingkat', mapel: '++id, nama, kode',
  tahunAjaran: '++id, tahun, semester, aktif', soal: '++id, mapelId, kelasId, jenis, tingkatKesulitan, updatedAt',
  ujian: '++id, nama, mapelId, kelasId, tanggal, status, token', ujianSoal: '++id, ujianId, soalId, urutan',
  pesertaUjian: '++id, ujianId, siswaId, status, [ujianId+siswaId]', jawaban: '++id, pesertaUjianId, soalId, [pesertaUjianId+soalId]',
  hasil: '++id, ujianId, siswaId, pesertaUjianId, statusKoreksi, nilai, [ujianId+siswaId]', pelanggaran: '++id, pesertaUjianId, waktu, jenis',
  pengaturan: '++id, &kunci'
});

export async function initializeDatabase() {
  const count = await db.users.count();
  if (!count) {
    const { seedDatabase } = await import('./seed.js');
    await seedDatabase(db);
  }
}
