import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { authService } from '../services/api';
import { Phone, Lock, ArrowRight, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';

// Owner login: phone + 4-digit PIN (the backend's auth model). On success we
// stash the owner phone locally and send them to the My Business dashboard.
const Login = () => {
    const navigate = useNavigate();
    const [phone, setPhone] = useState('');
    const [pin, setPin] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const cleanPhone = phone.replace(/\D/g, '').slice(-10);
        if (cleanPhone.length < 10) {
            setError('Please enter a valid 10-digit phone number.');
            return;
        }
        if (pin.length < 4) {
            setError('Please enter your 4-digit PIN.');
            return;
        }
        setLoading(true);
        try {
            await authService.verifyPin(cleanPhone, pin);
            // Persist a lightweight session for the dashboard to read.
            sessionStorage.setItem('vanigan_owner_phone', cleanPhone);
            navigate('/my-business');
        } catch (err) {
            const code = err?.response?.status;
            const apiErr = err?.response?.data?.error;
            if (code === 404 || apiErr === 'no_business') {
                setError('No business found for this number. Please register first.');
            } else if (code === 401 || code === 400 || apiErr === 'invalid_pin') {
                setError('Incorrect PIN. Please try again.');
            } else {
                setError('Could not sign you in. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-lacquer pt-28 pb-20 selection:bg-[rgba(232,119,34,0.28)] selection:text-champagne" style={{ fontFamily: 'var(--ks-font-body)' }}>
            <Navbar />
            <div className="max-w-md mx-auto px-5 sm:px-6">
                <div className="bg-raised rounded-[24px] sm:rounded-[32px] p-6 sm:p-10 border border-rule shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)]">
                    <div className="text-center mb-8">
                        <div className="w-14 h-14 bg-graphite rounded-2xl flex items-center justify-center text-kinpaku mx-auto mb-5 border border-kinpaku/50">
                            <ShieldCheck size={26} />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-champagne tracking-tight mb-2">Owner Login</h1>
                        <p className="text-muted text-[14px] font-medium leading-relaxed">
                            Access your dashboard with your registered phone number and PIN.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[12px] font-bold text-champagne uppercase tracking-wider">Registered Phone</label>
                            <div className="relative">
                                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-faint" />
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => { setPhone(e.target.value); setError(''); }}
                                    placeholder="10-digit mobile number"
                                    className="w-full bg-lacquer-deep border border-rule rounded-xl py-3.5 pl-11 pr-4 text-[15px] font-medium text-champagne outline-none focus:border-kinpaku/50 transition-all placeholder:text-faint"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[12px] font-bold text-champagne uppercase tracking-wider">4-Digit PIN</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-faint" />
                                <input
                                    type="password"
                                    inputMode="numeric"
                                    maxLength={4}
                                    value={pin}
                                    onChange={(e) => { setPin(e.target.value.replace(/\D/g, '').slice(0, 4)); setError(''); }}
                                    placeholder="••••"
                                    className="w-full bg-lacquer-deep border border-rule rounded-xl py-3.5 pl-11 pr-4 text-[18px] font-bold tracking-[0.5em] text-champagne outline-none focus:border-kinpaku/50 transition-all placeholder:text-faint placeholder:tracking-[0.3em]"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-start gap-2.5 text-warning bg-warning/10 border border-warning/30 rounded-xl px-4 py-3">
                                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                                <p className="text-[13px] font-medium">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-kinpaku text-lacquer-deep h-[50px] rounded-xl text-[15px] font-black uppercase tracking-wider hover:bg-kinpaku-rich transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                            {loading ? <><Loader2 size={18} className="animate-spin" /> Signing in…</> : <>Sign In <ArrowRight size={18} /></>}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-rule text-center">
                        <p className="text-[14px] text-muted font-medium">
                            Don't have a listing yet?{' '}
                            <Link to="/add-business" className="text-kinpaku font-bold hover:text-kinpaku-pale transition-colors">Register your business</Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Login;
