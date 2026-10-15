import { hashPassword } from '../utils/hash.js';

const choices = ['A. Pilihan pertama','B. Pilihan kedua','C. Pilihan ketiga','D. Pilihan keempat'];
export async function seedDatabase(db) {
  const [adminHash, guruHash, studentHash] = await Promise.all(['admin123','guru123','siswa123'].map(hashPassword));
  await db.transaction('rw', db.users, db.siswa, db.guru, db.kelas, db.mapel, db.tahunAjaran, db.soal, db.ujian, db.ujianSoal, db.pengaturan, async () => {
    await db.users.bulkAdd([{username:'admin',nama:'Administrator',role:'admin',passwordHash:adminHash,active:true},{username:'guru1',nama:'Budi Santoso, S.Pd.',role:'guru',passwordHash:guruHash,active:true},{username:'guru2',nama:'Siti Aminah, S.Pd.',role:'guru',passwordHash:guruHash,active:true}]);
    const kelasIds = await db.kelas.bulkAdd([{nama:'X IPA 1',tingkat:'X',rombel:'IPA 1'},{nama:'XI IPA 1',tingkat:'XI',rombel:'IPA 1'},{nama:'XII IPA 1',tingkat:'XII',rombel:'IPA 1'}], {allKeys:true});
    const mapelIds = await db.mapel.bulkAdd([{nama:'Matematika',kode:'MAT'},{nama:'Bahasa Indonesia',kode:'BIN'}], {allKeys:true});
    await db.tahunAjaran.add({tahun:'2026/2027',semester:'Ganjil',aktif:true});
    await db.guru.bulkAdd([{username:'guru1',nama:'Budi Santoso, S.Pd.',mapelId:mapelIds[0]},{username:'guru2',nama:'Siti Aminah, S.Pd.',mapelId:mapelIds[1]}]);
    const students = Array.from({length:20},(_,i)=>({nisn:`0062026${String(i+1).padStart(4,'0')}`,nama:`Siswa Contoh ${i+1}`,passwordHash:studentHash,kelasId:kelasIds[i%3],rombel:['IPA 1','IPA 1','IPA 1'][i%3],active:true}));
    await db.siswa.bulkAdd(students);
    const types=['pilihan-ganda','pilihan-ganda-kompleks','benar-salah','menjodohkan','isian-singkat','esai'];
    const questions=Array.from({length:30},(_,i)=>({mapelId:mapelIds[i%2],kelasId:kelasIds[i%3],jenis:types[i%types.length],pertanyaan:`Contoh soal ${i+1}: pilih jawaban yang paling tepat.`,opsi:choices.map((teks,j)=>({teks,gambar:null,id:String.fromCharCode(65+j)})),jawabanBenar:i%6===4?'jawaban':i%6===5?'':String.fromCharCode(65+(i%4)),bobot:1+(i%3),tingkatKesulitan:['mudah','sedang','sulit'][i%3],pembahasan:'Pembahasan contoh.',gambar:null,createdAt:Date.now()}));
    const questionIds=await db.soal.bulkAdd(questions,{allKeys:true});
    const examId=await db.ujian.add({nama:'Simulasi Ujian Sekolah',mapelId:mapelIds[0],kelasId:kelasIds[1],tanggal:new Date().toISOString().slice(0,10),jamMulai:'08:00',durasiMenit:90,jumlahSoal:20,acakSoal:true,acakOpsi:true,tampilkanNilai:true,batasMinimalMenit:0,token:'CBT261',status:'aktif',createdAt:Date.now()});
    await db.ujianSoal.bulkAdd(questionIds.slice(0,20).map((soalId,urutan)=>({ujianId:examId,soalId,urutan})));
    await db.pengaturan.bulkAdd([{kunci:'sekolah',nilai:{nama:'SMA Contoh',alamat:'Alamat Sekolah',kepalaSekolah:'Kepala Sekolah',logo:null}},{kunci:'pgKompleks',nilai:'proporsional'}]);
  });
}
