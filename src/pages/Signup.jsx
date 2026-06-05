import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { webAuthService, session } from '../services/api';
import { districtAssemblies, districts as tnDistricts } from '../data/constituencies';
import { Phone, Lock, User, MapPin, ArrowRight, ArrowLeft, Loader2, ShieldCheck, AlertCircle, CheckCircle, ChevronDown } from 'lucide-react';

const mobileInput = (value) => {
    const digits = (value || '').replace(/\D/g, '');
    if (digits.length > 10 && digits.startsWith('91')) return digits.slice(-10);
    return digits.slice(0, 10);
};

// Account signup against the web-auth API. Creates a real user record so the
// owner can log in later, auto-fill registration, and manage their listing.
// Backend payload: { phone, name, district, assembly, pin, confirmPin,
//                    bizName, bizCategory, bizSubCat }
const Signup = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: identity, 2: PIN
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [phoneState, setPhoneState] = useState(''); // '' | 'checking' | 'exists' | 'ok'

    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [district, setDistrict] = useState('');
    const [assembly, setAssembly] = useState('');
    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');

    // Prefill the phone if the user was bounced here from Login (no account).
    useEffect(() => {
        const pre = sessionStorage.getItem('vanigan_signup_phone');
        if (pre && pre.length >= 10) {
            setPhone(mobileInput(pre));
            sessionStorage.removeItem('vanigan_signup_phone');
        }
    }, []);

    // Reset assembly when the district changes.
    useEffect(() => { setAssembly(''); }, [district]);

    // Live "is this phone already registered?" check (debounced).
    useEffect(() => {
        const clean = phone.replace(/\D/g, '').slice(-10);
        if (clean.length < 10) { setPhoneState(''); return; }
        let active = true;
        setPhoneState('checking');
        const id = setTimeout(async () => {
            try {
                const data = await webAuthService.checkPhone(clean);
                if (active) setPhoneState(data?.exists ? 'exists' : 'ok');
            } catch {
                if (active) setPhoneState('');
            }
        }, 500);
        return () => { active = false; clearTimeout(id); };
    }, [phone]);

    const handleContinue = (e) => {
        e.preventDefault();
        setError('');
        const clean = phone.replace(/\D/g, '').slice(-10);
        if (clean.length < 10) { setError('Please enter a valid 10-digit phone number.'); return; }
        if (phoneState === 'exists') { setError('An account already exists for this number. Please log in instead.'); return; }
        if (!name.trim()) { setError('Please enter your name.'); return; }
        if (!district) { setError('Please select your district.'); return; }
        if (!assembly) { setError('Please select your assembly / area.'); return; }
        setStep(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (pin.length < 4) { setError('PIN must be 4 digits.'); return; }
        if (confirmPin.length < 4) { setError('Please confirm your PIN.'); return; }
        if (pin !== confirmPin) { setError('PINs do not match.'); return; }

        setLoading(true);
        try {
            const auth = await webAuthService.signup({
                phone: phone.replace(/\D/g, '').slice(-10),
                name: name.trim(),
                district,
                assembly,
                pin,
                confirmPin,
                bizName: '',
                bizCategory: '',
                bizSubCat: '',
            });
            session.set(auth);
            navigate('/my-business');
        } catch (err) {
            const apiErr = err?.response?.data?.error;
            if (apiErr === 'phone_exists' || apiErr === 'already_exists') {
                setError('An account already exists for this number. Please log in instead.');
            } else {
                setError(err?.response?.data?.message || 'Could not create your account. Please try again.');
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
                        <h1 className="text-2xl sm:text-3xl font-black text-champagne tracking-tight mb-2">Create your account</h1>
                        <p className="text-muted text-[14px] font-medium leading-relaxed">
                            {step === 1 ? 'Sign up to manage your listing and auto-fill your details.' : 'Set a 4-digit PIN to secure your account.'}
                        </p>
                    </div>

                    {step === 1 ? (
                        <form onSubmit={handleContinue} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[12px] font-bold text-champagne uppercase tracking-wider">Phone Number</label>
                                <div className="relative">
                                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-faint" />
                                    <input
                                        type="tel"
                                        inputMode="numeric"
                                        maxLength={10}
                                        pattern="[0-9]{10}"
                                        value={phone}
                                        onChange={(e) => { setPhone(mobileInput(e.target.value)); setError(''); }}
                                        placeholder="10-digit mobile number"
                                        className="w-full bg-lacquer-deep border border-rule rounded-xl py-3.5 pl-11 pr-10 text-[15px] font-medium text-champagne outline-none focus:border-kinpaku/50 transition-all placeholder:text-faint"
                                    />
                                    {phoneState === 'checking' && <Loader2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-faint animate-spin" />}
                                    {phoneState === 'ok' && <CheckCircle size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-patina" />}
                                    {phoneState === 'exists' && <AlertCircle size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-warning" />}
                                </div>
                                {phoneState === 'exists' && (
                                    <p className="text-[12px] text-warning font-medium">This number already has an account. <Link to="/login" className="underline underline-offset-2 font-bold">Log in</Link></p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-[12px] font-bold text-champagne uppercase tracking-wider">Your Name</label>
                                <div className="relative">
                                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-faint" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => { setName(e.target.value); setError(''); }}
                                        placeholder="Full name"
                                        className="w-full bg-lacquer-deep border border-rule rounded-xl py-3.5 pl-11 pr-4 text-[15px] font-medium text-champagne outline-none focus:border-kinpaku/50 transition-all placeholder:text-faint"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[12px] font-bold text-champagne uppercase tracking-wider">District</label>
                                <div className="relative">
                                    <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-faint z-10" />
                                    <select
                                        value={district}
                                        onChange={(e) => { setDistrict(e.target.value); setError(''); }}
                                        className="w-full appearance-none bg-lacquer-deep border border-rule rounded-xl py-3.5 pl-11 pr-10 text-[15px] font-medium text-champagne outline-none focus:border-kinpaku/50 transition-all"
                                    >
                                        <option value="">Select district</option>
                                        {tnDistricts.map((d) => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-faint pointer-events-none" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[12px] font-bold text-champagne uppercase tracking-wider">Assembly / Area</label>
                                <div className="relative">
                                    <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-faint z-10" />
                                    <select
                                        value={assembly}
                                        onChange={(e) => { setAssembly(e.target.value); setError(''); }}
                                        disabled={!district}
                                        className="w-full appearance-none bg-lacquer-deep border border-rule rounded-xl py-3.5 pl-11 pr-10 text-[15px] font-medium text-champagne outline-none focus:border-kinpaku/50 transition-all disabled:opacity-50"
                                    >
                                        <option value="">{district ? 'Select assembly' : 'Choose district first'}</option>
                                        {(districtAssemblies[district] || []).map((a) => <option key={a} value={a}>{a}</option>)}
                                    </select>
                                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-faint pointer-events-none" />
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
                                className="w-full bg-kinpaku text-lacquer-deep h-[50px] rounded-xl text-[15px] font-black uppercase tracking-wider hover:bg-kinpaku-rich transition-colors flex items-center justify-center gap-2"
                            >
                                Continue <ArrowRight size={18} />
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[12px] font-bold text-champagne uppercase tracking-wider">Create PIN</label>
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

                            <div className="space-y-2">
                                <label className="text-[12px] font-bold text-champagne uppercase tracking-wider">Confirm PIN</label>
                                <div className="relative">
                                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-faint" />
                                    <input
                                        type="password"
                                        inputMode="numeric"
                                        maxLength={4}
                                        value={confirmPin}
                                        onChange={(e) => { setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4)); setError(''); }}
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

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => { setStep(1); setError(''); }}
                                    className="flex items-center justify-center gap-2 px-5 h-[50px] rounded-xl border border-rule text-champagne text-[14px] font-bold hover:bg-graphite transition-colors"
                                >
                                    <ArrowLeft size={16} /> Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-kinpaku text-lacquer-deep h-[50px] rounded-xl text-[15px] font-black uppercase tracking-wider hover:bg-kinpaku-rich transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                                >
                                    {loading ? <><Loader2 size={18} className="animate-spin" /> Creating…</> : <>Create Account <ArrowRight size={18} /></>}
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="mt-8 pt-6 border-t border-rule text-center">
                        <p className="text-[14px] text-muted font-medium">
                            Already have an account?{' '}
                            <Link to="/login" className="text-kinpaku font-bold hover:text-kinpaku-pale transition-colors">Sign in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Signup;
