import { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../db/db';
import { hashPassword } from '../utils/hash';
const AuthContext=createContext(null);
export function AuthProvider({children}) {
  const [user,setUser]=useState(()=>{try{return JSON.parse(localStorage.getItem('cbt-user'))}catch{return null}});
  useEffect(()=>{if(user)localStorage.setItem('cbt-user',JSON.stringify(user));else localStorage.removeItem('cbt-user')},[user]);
  async function login(username,password) {
    const hash=await hashPassword(password);
    const admin=await db.users.where('username').equals(username).first();
    if(admin?.active&&admin.passwordHash===hash){const u={id:admin.id,username:admin.username,nama:admin.nama,role:admin.role};setUser(u);return u}
    const student=await db.siswa.where('nisn').equals(username).first();
    if(student?.active&&student.passwordHash===hash){const u={id:student.id,username:student.nisn,nama:student.nama,role:'siswa'};setUser(u);return u}
    const teacher=await db.guru.where('username').equals(username).first();
    const account=teacher&&await db.users.where('username').equals(username).first();
    if(account?.active&&account.passwordHash===hash){const u={id:account.id,username:account.username,nama:account.nama,role:'guru',mapelId:teacher.mapelId};setUser(u);return u}
    throw new Error('Nama pengguna atau kata sandi tidak sesuai.');
  }
  function logout(){setUser(null)}
  return <AuthContext.Provider value={{user,login,logout}}>{children}</AuthContext.Provider>
}
export const useAuth=()=>useContext(AuthContext);
