import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { playClickSound } from '../../utils/helpers';

export const WaitingApprovalScreen: React.FC = () => {
    const { userData, logout } = useAuth();

    // You can set this via env or just use a default
    const adminWhatsApp = import.meta.env.VITE_ADMIN_WHATSAPP || "6285123514560";
    const userEmail = userData?.email || "Email saya";

    const handleWhatsAppClick = () => {
        playClickSound();
        const message = `Halo, saya ingin verifikasi Magic UGC Generator dengan email ${userEmail}`;
        const waUrl = `https://wa.me/${adminWhatsApp}?text=${encodeURIComponent(message)}`;
        window.open(waUrl, '_blank');
    };

    const handleLogout = async () => {
        playClickSound();
        await logout();
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] font-sans text-black antialiased flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-6 p-10 bg-white border-[8px] border-black neo-shadow transform rotate-1">

                <div className="inline-block bg-[#FF90E8] border-4 border-black px-6 py-2 transform -rotate-2 neo-shadow-sm mb-4">
                    <h2 className="text-xl font-black uppercase tracking-widest">SUBMITTED</h2>
                </div>

                <h1 className="text-3xl font-black tracking-tighter uppercase mb-4" style={{ textShadow: '3px 3px 0px #00E5FF' }}>
                    MENUNGGU<br />PERSETUJUAN
                </h1>

                <div className="bg-gray-100 border-4 border-black p-4 text-left space-y-2 neo-shadow-sm transform -rotate-1">
                    <p className="font-bold text-sm">Akun Anda sedang ditinjau.</p>
                    <p className="font-bold text-sm">Email: <span className="bg-[#FFDE59] px-1">{userData?.email}</span></p>
                    <p className="font-bold text-sm">Status: <span className="text-[#FF5252] uppercase">PENDING</span></p>
                </div>

                <p className="font-semibold text-sm pt-4">
                    Silakan hubungi Admin via WhatsApp untuk mempercepat proses persetujuan (Approval) manual.
                </p>

                <div className="bg-[#A3E635] border-4 border-black p-4 my-6 transform rotate-2 neo-shadow-sm cursor-pointer hover:scale-105 transition-transform" onClick={handleWhatsAppClick}>
                    <p className="font-black text-lg uppercase mb-1">HUBUNGI ADMIN</p>
                    <p className="font-black text-2xl tracking-wider">WA: +62 851-2351-4560</p>
                </div>

                <div className="pt-2 space-y-4">
                    <button
                        onClick={handleWhatsAppClick}
                        className="neo-btn w-full bg-[#00E676] text-black text-lg font-black uppercase px-6 py-4 border-4 border-black neo-shadow hover:-translate-y-1 transition-transform flex items-center justify-center gap-2"
                    >
                        <span>CHAT ADMIN SEKARANG</span>
                    </button>

                    <button
                        onClick={handleLogout}
                        className="text-sm font-black text-gray-500 hover:text-black uppercase border-b-2 border-transparent hover:border-black transition-colors"
                    >
                        Kembali ke Login
                    </button>
                </div>

            </div>
        </div>
    );
};
