import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { playClickSound } from '../../utils/helpers';

export const LoginScreen: React.FC = () => {
    const { loginWithGoogle } = useAuth();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        playClickSound();
        setIsLoading(true);
        setError('');
        try {
            await loginWithGoogle();
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Gagal login dengan Google.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] font-sans text-black antialiased flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-8 p-10 bg-white border-[8px] border-black neo-shadow transform -rotate-1">

                <div className="inline-block bg-[#FFDE59] border-4 border-black px-6 py-2 transform rotate-3 neo-shadow-sm mb-2">
                    <h2 className="text-xl font-black uppercase tracking-widest">PRIVATE ACCESS</h2>
                </div>

                <h1 className="text-5xl font-black tracking-tighter mb-2 uppercase" style={{ textShadow: '4px 4px 0px #A3E635' }}>
                    MAGIC UGC
                </h1>

                <p className="font-bold text-gray-700 bg-gray-100 border-4 border-black p-4 neo-shadow-sm rotate-1">
                    Aplikasi ini memerlukan akses khusus. Silakan login dengan akun Google Anda.
                </p>

                {error && (
                    <div className="bg-[#FF5252] text-white p-4 font-black uppercase border-4 border-black transform rotate-1">
                        {error}
                    </div>
                )}

                <div className="mt-8 pt-4">
                    <button
                        onClick={handleLogin}
                        disabled={isLoading}
                        className={`neo-btn w-full flex items-center justify-center gap-3 bg-white text-black text-xl font-black uppercase px-6 py-4 border-4 border-black neo-shadow transition-transform ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-1'}`}
                    >
                        <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                            <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                                <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                                <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.369 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                                <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.799 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.734 49.679 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                                <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.109 -17.884 43.989 -14.754 43.989 Z" />
                            </g>
                        </svg>
                        {isLoading ? 'MEMUAT...' : 'LOGIN VIA GOOGLE'}
                    </button>
                </div>
            </div>
        </div>
    );
};
