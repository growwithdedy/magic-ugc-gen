import React, { useEffect, useState } from 'react';
import { collection, query, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { UserData, useAuth } from '../../contexts/AuthContext';
import { playClickSound } from '../../utils/helpers';

export const AdminPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { userData } = useAuth();
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Guard clause just in case
    if (userData?.role !== 'admin') {
        return (
            <div className="fixed inset-0 z-50 bg-[#FDFBF7] flex items-center justify-center p-4">
                <div className="bg-white border-8 border-black p-8 text-center max-w-sm neo-shadow">
                    <h2 className="text-2xl font-black text-[#FF5252] uppercase mb-4">Akses Ditolak</h2>
                    <p className="font-bold mb-6">Anda tidak memiliki izin Admin.</p>
                    <button onClick={onClose} className="neo-btn bg-black text-white px-6 py-2 uppercase font-black">Tutup</button>
                </div>
            </div>
        );
    }

    const fetchUsers = async () => {
        setLoading(true);
        setError('');
        try {
            const q = query(collection(db, 'users'));
            const querySnapshot = await getDocs(q);
            const fetchedUsers: UserData[] = [];
            querySnapshot.forEach((docSnap) => {
                fetchedUsers.push(docSnap.data() as UserData);
            });
            // Sort by status: pending first
            fetchedUsers.sort((a, b) => {
                if (a.status === 'pending' && b.status !== 'pending') return -1;
                if (a.status !== 'pending' && b.status === 'pending') return 1;
                return 0;
            });
            setUsers(fetchedUsers);
        } catch (err: any) {
            console.error("Failed to fetch users:", err);
            setError("Gagal memuat data pengguna.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const toggleStatus = async (uid: string, currentStatus: 'pending' | 'approved') => {
        playClickSound();
        const newStatus = currentStatus === 'approved' ? 'pending' : 'approved';
        const confirmMessage = newStatus === 'approved'
            ? `Setujui akses untuk user ini?`
            : `Cabut akses user ini? (Kembali ke status Pending)`;

        if (!window.confirm(confirmMessage)) return;

        try {
            const userRef = doc(db, 'users', uid);
            await updateDoc(userRef, { status: newStatus });
            // Update local state without refetching for speed
            setUsers(prev => prev.map(u => u.uid === uid ? { ...u, status: newStatus } : u));
        } catch (err) {
            console.error("Failed to update status:", err);
            alert("Gagal mengupdate status. Periksa pengaturan database.");
        }
    };

    const deleteUser = async (uid: string) => {
        playClickSound();
        if (!window.confirm("Apakah Anda yakin ingin MENGHAPUS user ini permanen dari database?")) return;

        try {
            const userRef = doc(db, 'users', uid);
            await deleteDoc(userRef);
            // Update local state
            setUsers(prev => prev.filter(u => u.uid !== uid));
        } catch (err) {
            console.error("Failed to delete user:", err);
            alert("Gagal menghapus user. Periksa pengaturan database.");
        }
    }

    const unapprovedCount = users.filter(u => u.status === 'pending').length;
    // Consider online if active in the last 5 minutes (300,000 ms)
    const onlineCount = users.filter(u => u.lastActive && (Date.now() - u.lastActive) < 300000).length;

    return (
        <div className="fixed inset-0 z-50 bg-[#FDFBF7] overflow-y-auto">
            <div className="max-w-6xl mx-auto px-4 py-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-4 border-b-8 border-black">
                    <div>
                        <div className="inline-block bg-[#00E5FF] border-4 border-black px-4 py-1 transform -rotate-2 neo-shadow-sm mb-2">
                            <h2 className="text-xl font-black uppercase tracking-widest text-black">ADMINISTRATOR</h2>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mt-2">USER PANEL</h1>
                    </div>

                    <div className="mt-4 md:mt-0 flex flex-col items-end gap-2">
                        <div className="flex gap-4">
                            <div className="bg-[#FFDE59] border-2 border-black px-3 py-1 neo-shadow-sm text-sm font-bold">
                                Offline/Total: {users.length - onlineCount}/{users.length}
                            </div>
                            <div className="bg-[#00E676] border-2 border-black px-3 py-1 neo-shadow-sm text-sm font-bold">
                                Online: {onlineCount}
                            </div>
                            <div className="bg-[#FF5252] text-white border-2 border-black px-3 py-1 neo-shadow-sm text-sm font-bold">
                                Belum Approve: {unapprovedCount}
                            </div>
                        </div>

                        <div className="flex items-center gap-4 mt-2">
                            <button onClick={fetchUsers} disabled={loading} className="font-black text-black uppercase border-b-2 border-black hover:bg-[#FFDE59] px-2 py-1 transition-colors">
                                SEGARKAN DATA
                            </button>
                            <button onClick={onClose} className="neo-btn bg-[#FF5252] text-white font-black uppercase px-6 py-3 border-4 border-black neo-shadow-sm hover:translate-y-1 transition-transform">
                                TUTUP PANEL
                            </button>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-[#FF5252] text-white p-4 font-black uppercase border-4 border-black transform rotate-1 mb-8 neo-shadow-sm">
                        {error}
                    </div>
                )}

                {/* User List Matrix */}
                <div className="bg-white border-[6px] border-black p-4 md:p-8 neo-shadow">
                    {loading ? (
                        <div className="text-center py-20 font-black text-2xl uppercase animate-pulse">
                            Memuat Data Pengguna...
                        </div>
                    ) : users.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="font-black text-xl uppercase bg-gray-200 inline-block px-4 py-2 border-4 border-black">Belum ada user terdaftar</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[600px]">
                                <thead>
                                    <tr className="bg-[#A3E635] border-b-4 border-black">
                                        <th className="p-4 font-black uppercase text-sm border-r-4 border-black">Profil</th>
                                        <th className="p-4 font-black uppercase text-sm border-r-4 border-black">Email</th>
                                        <th className="p-4 font-black uppercase text-sm border-r-4 border-black">Role</th>
                                        <th className="p-4 font-black uppercase text-sm border-r-4 border-black">Status</th>
                                        <th className="p-4 font-black uppercase text-sm text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u.uid} className="border-b-4 border-black hover:bg-gray-50 transition-colors">
                                            <td className="p-4 border-r-4 border-black">
                                                <div className="flex items-center gap-3">
                                                    {u.photoURL ? (
                                                        <img src={u.photoURL} alt="avatar" className="w-10 h-10 border-2 border-black bg-gray-200" />
                                                    ) : (
                                                        <div className="w-10 h-10 border-2 border-black bg-gray-300 flex items-center justify-center font-bold">?</div>
                                                    )}
                                                    <span className="font-bold truncate max-w-[150px]">{u.displayName || 'Tanpa Nama'}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 font-semibold border-r-4 border-black text-gray-700">{u.email}</td>
                                            <td className="p-4 border-r-4 border-black">
                                                <span className={`px-2 py-1 text-xs font-black uppercase border-2 border-black ${u.role === 'admin' ? 'bg-[#FF90E8]' : 'bg-white'}`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="p-4 border-r-4 border-black">
                                                <span className={`px-3 py-1 font-black uppercase border-2 border-black inline-block ${u.status === 'approved' ? 'bg-[#00E676] text-black' : 'bg-[#FFDE59] text-black'}`}>
                                                    {u.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center">
                                                {u.role !== 'admin' && (
                                                    <div className="flex gap-2 justify-center">
                                                        <button
                                                            onClick={() => toggleStatus(u.uid, u.status)}
                                                            className={`neo-btn text-xs font-black uppercase px-4 py-2 border-2 border-black neo-shadow-sm ${u.status === 'approved' ? 'bg-white hover:bg-red-100 text-red-600' : 'bg-[#00E676] text-black hover:bg-green-400'}`}
                                                        >
                                                            {u.status === 'approved' ? 'Cabut Akses' : 'Setujui Akses'}
                                                        </button>
                                                        <button
                                                            onClick={() => deleteUser(u.uid)}
                                                            className="neo-btn bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase px-3 py-2 border-2 border-black neo-shadow-sm"
                                                            title="Hapus User"
                                                        >
                                                            Hapus
                                                        </button>
                                                    </div>
                                                )}
                                                {u.role === 'admin' && (
                                                    <span className="text-xs font-black text-gray-400 uppercase italic">Admin Utama</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};
