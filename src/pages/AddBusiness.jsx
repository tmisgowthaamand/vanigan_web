import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { businessService } from '../services/api';
import { authService, webAuthService, session } from '../services/api';
import { districtAssemblies, districts as tnDistricts } from '../data/constituencies';
import { subCategoriesFor } from '../data/subCategories';
import {
  CheckCircle,
  MessageCircle,
  Loader2,
  AlertCircle,
  X,
  ShieldCheck,
  MapPin,
  ArrowRight,
  ChevronDown,
  Phone,
  ArrowLeft,
} from 'lucide-react';

/* ─── tiny helpers ─────────────────────────────────────── */
const norm = (v) => (v || '').replace(/\D/g, '').slice(-10);
const mobileInput = (v) => {
  const digits = (v || '').replace(/\D/g, '');
  if (digits.length > 10 && digits.startsWith('91')) return digits.slice(-10);
  return digits.slice(0, 10);
};

const AddBusiness = () => {
  /* step: 1 = phone check  |  2 = registration form */
  const [step, setStep] = useState(1);

  /* Step-1 state */
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [checkStatus, setCheckStatus] = useState('idle'); // idle | loading | error
  const [checkMsg, setCheckMsg] = useState('');
  const [checkPct, setCheckPct] = useState(null);          // 0-100 while scanning
  const [existingBusiness, setExistingBusiness] = useState(null);

  /* Step-2 form state */
  const [showPlatformSelector, setShowPlatformSelector] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('idle'); // idle | loading | error
  const [submitMsg, setSubmitMsg] = useState('');
  const [registeredBusinessId, setRegisteredBusinessId] = useState(null);

  /* Step-2 real-time phone duplicate check */
  const [phoneCheckStatus, setPhoneCheckStatus] = useState('');
  const [phoneCheckMessage, setPhoneCheckMessage] = useState('');
  const [phoneCheckError, setPhoneCheckError] = useState(null);

  /* PIN setup (shown on success screen) */
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinStatus, setPinStatus] = useState('idle');
  const [pinError, setPinError] = useState('');
  const [pinProgress, setPinProgress] = useState('');

  /* Registration success flag */
  const [registered, setRegistered] = useState(false);

  const formTopRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subCategory: '',
    description: '',
    district: '',
    assembly: '',
    address: '',
    landmark: '',
    areas: '',
    city: '',
    pincode: '',
    whatsappNo: '',
    whatsappPrimary: '',
    landline: '',
    alternatePhone: '',
    email: '',
    website: '',
    socialLinks: {},
    openingDays: [],
    openingTime: '',
    closingTime: '',
    faqQuestion: '',
    faqAnswer: '',
    bannerImage: null,
    profileImage: null,
    gallery: [],
    services: [],
  });

  /* ── Prefill phone from session/signup bounce ── */
  useEffect(() => {
    const auth = session.get();
    const phone =
      auth?.user?.phone ||
      sessionStorage.getItem('vanigan_signup_phone') ||
      sessionStorage.getItem('vanigan_owner_phone');
    if (phone && phone.length >= 10) setWhatsappNumber(mobileInput(phone));
  }, []);

  /* ── Sync verification phone into form on step change ── */
  useEffect(() => {
    if (step === 2) {
      setFormData((p) => ({ ...p, whatsappNo: whatsappNumber }));
      // Scroll to top of form
      setTimeout(() => formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  }, [step, whatsappNumber]);

  /* ── Reset assembly when district changes ── */
  useEffect(() => {
    if (formData.district) setFormData((p) => ({ ...p, assembly: '' }));
  }, [formData.district]);

  /* ── Reset sub-category when category changes ── */
  useEffect(() => {
    setFormData((p) => ({ ...p, subCategory: '' }));
  }, [formData.category]);

  /* ── Real-time phone duplicate check on Step 2 ── */
  useEffect(() => {
    if (step !== 2) return;
    const primaryPhone = norm(formData.whatsappPrimary);
    const alternatePhone = norm(formData.alternatePhone);

    if (!primaryPhone || primaryPhone.length !== 10) {
      setPhoneCheckStatus('');
      setPhoneCheckMessage('');
      setPhoneCheckError(null);
      return;
    }
    if (formData.alternatePhone && alternatePhone.length !== 10) {
      setPhoneCheckStatus('');
      setPhoneCheckMessage('');
      setPhoneCheckError(null);
      return;
    }

    setPhoneCheckStatus('checking');

    const checkFn = async () => {
      const candidates = [];
      if (primaryPhone.length === 10) candidates.push({ label: 'Primary', phone: primaryPhone });
      if (alternatePhone && alternatePhone.length === 10) candidates.push({ label: 'Alternate', phone: alternatePhone });

      let found = null;
      for (const c of candidates) {
        try {
          const res = await findExistingBusiness([c]);
          if (res?.business) { found = { ...c, business: res.business }; break; }
        } catch { /* continue */ }
      }
      if (found) {
        setPhoneCheckStatus('duplicate');
        setPhoneCheckMessage(
          `The ${found.label} phone (${found.phone}) already has a registered business. You cannot use this number.`
        );
        setPhoneCheckError(found);
      } else {
        setPhoneCheckStatus('');
        setPhoneCheckMessage('');
        setPhoneCheckError(null);
      }
    };

    const t = setTimeout(checkFn, 800);
    return () => clearTimeout(t);
  }, [formData.whatsappPrimary, formData.alternatePhone, step]);

  /* ══════════════════════════════════════════════════════
     SHARED: find if a phone already has a business
  ══════════════════════════════════════════════════════ */
  const findExistingBusiness = async (phoneCandidates, onProgress) => {
    for (const candidate of phoneCandidates) {
      /* Fast path 1: web-auth account lookup (single DB query, ~200ms) */
      try {
        const checkPromise = webAuthService.checkPhone(candidate.phone);
        const timeoutPromise = new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 4000));
        const check = await Promise.race([checkPromise, timeoutPromise]);
        if (check?.exists) {
          const account = await webAuthService.me(candidate.phone).catch(() => null);
          const biz =
            account?.business ||
            (account?.user?.businessId ? { _id: account.user.businessId } : null);
          if (biz?._id) return { ...candidate, business: biz };
        }
      } catch { /* fall through to directory scan */ }

      /* Fast path 2 / fallback: scan public business directory */
      const matches = await businessService.getByPhone(
        candidate.phone,
        onProgress ? (pct) => onProgress(candidate, pct) : undefined,
        { allowSlowFallback: false }
      );
      if (matches.length > 0) return { ...candidate, business: matches[0] };
    }
    return null;
  };

  const getFormPhoneCandidates = () => {
    const raw = [
      { label: 'Verification number', value: whatsappNumber },
      { label: 'Primary number', value: formData.whatsappPrimary },
      { label: 'Secondary number', value: formData.alternatePhone },
    ]
      .map(({ label, value }) => ({ label, phone: norm(value) }))
      .filter(({ phone }) => phone.length === 10);

    return raw.filter(
      (c, i, arr) => arr.findIndex((x) => x.phone === c.phone) === i
    );
  };

  /* ══════════════════════════════════════════════════════
     STEP 1 — Phone verification
  ══════════════════════════════════════════════════════ */
  const handleStartVerification = async () => {
    const phone = norm(whatsappNumber);
    if (phone.length !== 10) {
      setCheckStatus('error');
      setCheckMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    setExistingBusiness(null);
    setCheckStatus('loading');
    setCheckMsg('Checking this phone number in business records...');
    setCheckPct(null);

    try {
      const existing = await findExistingBusiness(
        [{ label: 'Verification number', phone }],
        (_candidate, pct) => {
          setCheckMsg('Checking this phone number in business records...');
          setCheckPct(pct);
        }
      );

      if (existing) {
        setExistingBusiness(existing.business || null);
        setCheckStatus('error');
        setCheckMsg(`This phone number already has a registered business: ${existing.phone}`);
        setCheckPct(null);
        return;
      }

      /* ✅ New number — go straight to registration form */
      setWhatsappNumber(phone);
      setCheckStatus('idle');
      setCheckMsg('');
      setCheckPct(null);
      setStep(2);
    } catch {
      setCheckStatus('error');
      setCheckMsg('Could not check this phone number. Please try again.');
      setCheckPct(null);
    }
  };

  const handleVerificationSubmit = (e) => {
    e.preventDefault();
    if (checkStatus !== 'loading') handleStartVerification();
  };

  /* ══════════════════════════════════════════════════════
     STEP 2 — Form helpers
  ══════════════════════════════════════════════════════ */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleMobileChange = (name, value) => {
    setFormData((p) => ({ ...p, [name]: mobileInput(value) }));
    setSubmitStatus('idle');
    setSubmitMsg('');
    setExistingBusiness(null);
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude.toFixed(6);
      const lng = pos.coords.longitude.toFixed(6);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
        );
        const data = await res.json();
        setFormData((p) => ({ ...p, address: data?.display_name || `Lat: ${lat}, Lng: ${lng}` }));
      } catch {
        setFormData((p) => ({ ...p, address: `Lat: ${lat}, Lng: ${lng}` }));
      }
    });
  };

  /* ══════════════════════════════════════════════════════
     STEP 2 — Submit registration
  ══════════════════════════════════════════════════════ */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (phoneCheckStatus === 'checking') {
      setSubmitStatus('error');
      setSubmitMsg('Please wait while we verify your phone numbers...');
      return;
    }
    if (phoneCheckStatus === 'duplicate' || phoneCheckError) {
      setSubmitStatus('error');
      setSubmitMsg(phoneCheckMessage || 'One of your phone numbers already has a registered business.');
      return;
    }

    setSubmitStatus('loading');
    setSubmitMsg('Checking your business numbers...');

    try {
      const primaryPhone = norm(formData.whatsappPrimary);
      const secondaryPhone = norm(formData.alternatePhone);
      const verificationPhone = norm(formData.whatsappNo || whatsappNumber);

      if (!formData.whatsappPrimary.trim() || primaryPhone.length !== 10) {
        setSubmitStatus('error');
        setSubmitMsg('Please enter a valid 10-digit primary number.');
        return;
      }
      if (formData.alternatePhone.trim() && secondaryPhone.length !== 10) {
        setSubmitStatus('error');
        setSubmitMsg('Please enter a valid 10-digit secondary number.');
        return;
      }
      if (secondaryPhone && primaryPhone === secondaryPhone) {
        setSubmitStatus('error');
        setSubmitMsg('Primary and secondary numbers cannot be the same.');
        return;
      }

      const existing = await findExistingBusiness(getFormPhoneCandidates());
      if (existing) {
        setExistingBusiness(existing.business || null);
        setSubmitStatus('error');
        setSubmitMsg(`This phone number already has a registered business: ${existing.phone}`);
        return;
      }

      setSubmitMsg('Submitting your registration...');

      /* Build multipart FormData — Multer expects exact field names */
      const FILE_FIELD_MAP = { bannerImage: 'coverImage', profileImage: 'image' };
      const SKIP = new Set(['bannerImage', 'profileImage', 'gallery']);

      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (SKIP.has(key)) return;
        if (key === 'services' || key === 'socialLinks') {
          data.append(key, JSON.stringify(formData[key]));
        } else if (formData[key] instanceof File) {
          data.append(key, formData[key]);
        } else if (formData[key] != null) {
          data.append(key, formData[key]);
        }
      });

      data.set('whatsappNo', verificationPhone);
      data.set('whatsappPrimary', primaryPhone);
      data.set('alternatePhone', secondaryPhone);
      data.set('phone', primaryPhone);
      data.set('phone2', secondaryPhone);

      Object.entries(FILE_FIELD_MAP).forEach(([local, api]) => {
        if (formData[local] instanceof File) data.append(api, formData[local]);
      });
      (formData.gallery || []).forEach((f) => {
        if (f instanceof File) data.append('galleryImages', f);
      });

      const response = await businessService.add(data);
      const bizId = response?.business?._id || response?._id;
      if (bizId) setRegisteredBusinessId(bizId);

      setRegistered(true);
    } catch (err) {
      setSubmitStatus('error');
      setSubmitMsg(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Error submitting registration. Please try again.'
      );
    }
  };

  /* ══════════════════════════════════════════════════════
     PIN setup — called from success screen
  ══════════════════════════════════════════════════════ */
  const handleSetPin = async () => {
    setPinError('');
    if (pin.length < 4) { setPinError('Enter a 4-digit PIN.'); return; }
    if (pin !== confirmPin) { setPinError('PINs do not match.'); return; }

    const candidates = [...new Set(
      [formData.whatsappPrimary, formData.whatsappNo, whatsappNumber]
        .map(norm)
        .filter((p) => p.length === 10)
    )];
    if (candidates.length === 0) { setPinError('Could not determine your registered phone number.'); return; }

    setPinStatus('loading');
    setPinProgress('Securing your account…');

    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const BACKOFFS = [2000, 3000, 4000, 5000, 6000, 8000, 10000, 10000, 12000];
    const MAX_ATTEMPTS = BACKOFFS.length + 1;
    let notFound = false, alreadySet = false, otherError = false;

    const establishSession = async (ownerPhone) => {
      try {
        const me = await webAuthService.me(ownerPhone);
        if (me?.user) {
          let auth = me;
          if (!me.business) {
            try {
              const verify = await authService.verifyPin(ownerPhone, pin);
              const bizId = verify?._id || verify?.business?._id;
              if (bizId) {
                await webAuthService.linkBusiness(ownerPhone, bizId).catch(() => {});
                const refreshed = await webAuthService.me(ownerPhone).catch(() => null);
                auth = refreshed?.user ? refreshed : { ...me, business: verify?._id ? verify : verify?.business };
              }
            } catch { /* keep session without linked business */ }
          }
          session.set(auth);
          return;
        }
      } catch { /* fall through to legacy */ }

      sessionStorage.setItem('vanigan_owner_phone', ownerPhone);
      localStorage.setItem('vanigan_owner_phone', ownerPhone);
      try {
        const res = await authService.verifyPin(ownerPhone, pin);
        const biz =
          res?.business ||
          res?.data?.business ||
          (Array.isArray(res?.businesses) ? res.businesses[0] : null) ||
          (res?._id ? res : null);
        if (biz) {
          const s = JSON.stringify(biz);
          sessionStorage.setItem('vanigan_owner_business', s);
          localStorage.setItem('vanigan_owner_business', s);
        }
      } catch { /* phone key is enough */ }
    };

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      notFound = false;
      for (const ownerPhone of candidates) {
        try {
          const res = await authService.setPin(ownerPhone, pin);
          const bizId = res?.business?._id || res?._id;
          if (bizId) setRegisteredBusinessId(bizId);
          setPinProgress('Signing you in…');
          await establishSession(ownerPhone);
          setPinStatus('done');
          const finalId = bizId || registeredBusinessId;
          window.location.href = finalId ? `/business/${finalId}` : '/my-business';
          return;
        } catch (err) {
          const apiErr = err?.response?.data?.error;
          const st = err?.response?.status;
          if (apiErr === 'pin_already_set' || st === 409) { alreadySet = true; break; }
          if (apiErr === 'Business not found.' || st === 404) { notFound = true; continue; }
          otherError = true;
        }
      }
      if (alreadySet || otherError) break;
      if (!notFound) break;
      if (attempt < MAX_ATTEMPTS - 1) {
        setPinProgress(`Finalizing your new listing… (attempt ${attempt + 2} of ${MAX_ATTEMPTS})`);
        await sleep(BACKOFFS[attempt]);
      }
    }

    setPinProgress('');
    if (alreadySet) {
      for (const ownerPhone of candidates) {
        try {
          const res = await authService.verifyPin(ownerPhone, pin);
          const bizId = res?.business?._id || res?._id || (Array.isArray(res?.businesses) && res.businesses[0]?._id);
          if (bizId) setRegisteredBusinessId(bizId);
          await establishSession(ownerPhone);
          setPinStatus('done');
          const finalId = bizId || registeredBusinessId;
          window.location.href = finalId ? `/business/${finalId}` : '/my-business';
          return;
        } catch { /* try next */ }
      }
      setPinError('A PIN is already set for this business. Please use it on the Login page.');
    } else if (notFound) {
      setPinError('Your listing is still being finalized. Please tap "Set PIN & Confirm" again in a moment.');
    } else {
      setPinError('Could not set PIN. Please try again.');
    }
    setPinStatus('error');
  };

  /* ══════════════════════════════════════════════════════
     SUCCESS SCREEN
  ══════════════════════════════════════════════════════ */
  if (registered) {
    return (
      <div className="min-h-screen bg-lacquer flex flex-col pt-20">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-raised rounded-[24px] sm:rounded-[3rem] p-7 sm:p-12 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] border border-rule text-center animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-graphite rounded-4xl flex items-center justify-center text-kinpaku mx-auto mb-6 sm:mb-8 border border-kinpaku shadow-sm">
              <CheckCircle size={44} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-champagne mb-3 tracking-tight">Success!</h2>
            <p className="text-muted text-[13px] mb-8 font-bold uppercase tracking-widest leading-relaxed px-2">
              Your business registration has been submitted successfully.
            </p>

            {pinStatus === 'done' ? (
              <div className="mb-8 p-5 bg-graphite rounded-2xl border border-[rgba(61,177,173,0.4)] text-left">
                <p className="text-patina text-[13px] font-bold flex items-center gap-2 mb-1">
                  <ShieldCheck size={16} /> PIN set successfully
                </p>
                <p className="text-muted text-[12px] font-medium leading-relaxed">
                  You're being redirected to your business page…
                </p>
              </div>
            ) : (
              <div className="mb-8 p-5 sm:p-6 bg-lacquer-deep rounded-2xl border border-rule text-left">
                <p className="text-champagne text-[13px] font-black uppercase tracking-wider mb-1 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-kinpaku" /> Set Your Security PIN
                </p>
                <p className="text-muted text-[12px] font-medium leading-relaxed mb-4">
                  Create a 4-digit PIN to log in to your My Business dashboard.
                </p>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <input
                    type="password" inputMode="numeric" maxLength={4} value={pin}
                    onChange={(e) => { setPin(e.target.value.replace(/\D/g, '').slice(0, 4)); setPinError(''); }}
                    placeholder="PIN"
                    className="bg-raised border border-rule rounded-xl py-3 px-4 text-center text-[16px] font-bold tracking-[0.3em] text-champagne outline-none focus:border-kinpaku/50 placeholder:tracking-normal placeholder:text-faint"
                  />
                  <input
                    type="password" inputMode="numeric" maxLength={4} value={confirmPin}
                    onChange={(e) => { setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4)); setPinError(''); }}
                    placeholder="Confirm"
                    className="bg-raised border border-rule rounded-xl py-3 px-4 text-center text-[16px] font-bold tracking-[0.3em] text-champagne outline-none focus:border-kinpaku/50 placeholder:tracking-normal placeholder:text-faint"
                  />
                </div>
                {pinError && <p className="text-warning text-[12px] font-medium mb-3">{pinError}</p>}
                {pinStatus === 'loading' && pinProgress && (
                  <p className="text-patina text-[12px] font-medium mb-3">{pinProgress}</p>
                )}
                <button
                  onClick={handleSetPin}
                  disabled={pinStatus === 'loading'}
                  className="w-full py-3.5 bg-graphite border border-kinpaku/50 text-kinpaku rounded-xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-kinpaku hover:text-lacquer-deep transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {pinStatus === 'loading'
                    ? <><Loader2 size={15} className="animate-spin" /> Setting PIN…</>
                    : 'Set PIN & Confirm'}
                </button>
              </div>
            )}

            <button
              onClick={() => window.location.href = '/'}
              className="w-full py-5 sm:py-6 bg-kinpaku text-lacquer-deep rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-[rgba(232,119,34,0.3)] hover:bg-kinpaku-rich transition-all active:scale-95"
            >
              Back to Home
            </button>
          </div>
        </main>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════
     MAIN RENDER
  ══════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-lacquer pt-28 pb-20 selection:bg-[rgba(232,119,34,0.28)] selection:text-champagne">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4" ref={formTopRef}>

        {/* ── Progress header ── */}
        <div className="bg-raised rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 mb-8 sm:mb-10 border border-rule shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-champagne tracking-tighter mb-2">
                Register Your Business
              </h1>
              <p className="text-muted text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-patina animate-pulse" />
                Step {step} of 2 — {step === 1 ? 'Verification' : 'Business Details'}
              </p>
            </div>
            <div className="flex gap-2">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-500 ${step >= i ? 'w-12 bg-kinpaku' : 'w-4 bg-[#3A332A]'}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ══════════ STEP 1 — Phone check ══════════ */}
        {step === 1 && (
          <div className="bg-raised rounded-[24px] sm:rounded-[40px] p-6 sm:p-10 md:p-16 shadow-[0_30px_60px_-12px_rgba(225,29,72,0.12)] border border-kinpaku/50 animate-in fade-in zoom-in-95 duration-700">
            <div className="max-w-md mx-auto space-y-10">

              <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl font-black text-champagne tracking-tight">
                  Start Your Business <span className="text-kinpaku">Journey</span>
                </h2>
                <p className="text-muted text-[16px] font-medium leading-relaxed">
                  Connect your WhatsApp to verify your identity and unlock your premium business dashboard.
                </p>
              </div>

              <form onSubmit={handleVerificationSubmit} className="space-y-6 pt-2">
                {/* Phone input */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-kinpaku">
                    <div className="w-8 h-8 bg-graphite rounded-lg flex items-center justify-center">
                      <MessageCircle size={18} />
                    </div>
                    <label className="text-[11px] font-black uppercase tracking-widest">
                      Official WhatsApp Number
                    </label>
                  </div>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    pattern="[0-9]{10}"
                    placeholder="Enter 10-digit mobile number"
                    value={whatsappNumber}
                    onChange={(e) => {
                      setWhatsappNumber(mobileInput(e.target.value));
                      setCheckStatus('idle');
                      setCheckMsg('');
                      setCheckPct(null);
                      setExistingBusiness(null);
                    }}
                    className="w-full bg-lacquer-deep border-2 border-rule rounded-2xl px-5 sm:px-8 py-4 sm:py-6 outline-none focus:border-kinpaku/30 focus:bg-raised transition-all text-champagne text-xl font-bold placeholder:text-faint"
                  />
                </div>

                {/* ── Loading progress card ── */}
                {checkStatus === 'loading' && (
                  <div className="p-5 rounded-2xl bg-graphite border border-rule animate-in fade-in duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <Loader2 size={18} className="animate-spin text-kinpaku shrink-0" />
                      <p className="text-[12px] font-black uppercase tracking-wider text-champagne flex-1">
                        {checkMsg}
                      </p>
                    </div>
                    {checkPct !== null && (
                      <div className="space-y-2 mt-1">
                        <p className="text-[20px] font-black text-kinpaku">{checkPct}%</p>
                        <div className="w-full bg-lacquer-deep rounded-full h-1.5 overflow-hidden">
                          <div
                            className="h-full bg-kinpaku rounded-full transition-all duration-500"
                            style={{ width: `${checkPct}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Error card ── */}
                {checkStatus === 'error' && (
                  <div className="p-5 rounded-2xl border border-warning/40 bg-raised flex items-start gap-3 animate-in fade-in duration-300">
                    <AlertCircle size={18} className="text-warning shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-[12px] font-black uppercase tracking-wider text-warning leading-relaxed">
                        {checkMsg}
                      </p>
                      {existingBusiness?._id && (
                        <div className="mt-4 flex flex-col sm:flex-row gap-3">
                          <Link
                            to={`/business/${existingBusiness._id}`}
                            className="inline-flex items-center justify-center rounded-xl border border-warning/40 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-warning hover:bg-warning/10 transition-colors"
                          >
                            View Existing Business
                          </Link>
                          <button
                            type="button"
                            onClick={() => {
                              const cleanPhone = norm(whatsappNumber);
                              if (cleanPhone) {
                                localStorage.setItem('vanigan_owner_phone', cleanPhone);
                                sessionStorage.setItem('vanigan_owner_phone', cleanPhone);
                              }
                              sessionStorage.setItem('vanigan_owner_business', JSON.stringify(existingBusiness));
                              localStorage.setItem('vanigan_owner_business', JSON.stringify(existingBusiness));
                              window.location.href = '/my-business';
                            }}
                            className="inline-flex items-center justify-center rounded-xl bg-warning/10 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-warning hover:bg-warning/20 transition-colors"
                          >
                            Go To My Business
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ── CTA button ── */}
                <button
                  type="submit"
                  disabled={checkStatus === 'loading' || norm(whatsappNumber).length !== 10}
                  className="w-full bg-kinpaku text-lacquer-deep py-5 sm:py-7 rounded-2xl text-[13px] sm:text-[15px] font-black uppercase tracking-[0.2em] sm:tracking-[0.35em] flex items-center justify-center gap-4 hover:bg-kinpaku-rich shadow-2xl shadow-[rgba(232,119,34,0.3)] hover:-translate-y-1 transition-all group disabled:opacity-90 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {checkStatus === 'loading' ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      <span className="tracking-[0.3em]">C H E C K I N G . . .</span>
                    </>
                  ) : (
                    <>
                      GET STARTED NOW
                      <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform duration-500" />
                    </>
                  )}
                </button>

                {/* ── Security note ── */}
                <div className="flex items-center gap-4 px-5 py-4 bg-graphite rounded-2xl border border-kinpaku/50">
                  <CheckCircle className="text-kinpaku shrink-0" size={18} />
                  <p className="text-muted text-[11px] font-bold uppercase tracking-tight leading-relaxed">
                    Your form data will be saved automatically in a new secure session.
                  </p>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ══════════ STEP 2 — Registration form ══════════ */}
        {step === 2 && (
          <form
            onSubmit={handleSubmit}
            className="bg-raised rounded-[24px] sm:rounded-[40px] p-6 sm:p-10 md:p-16 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] border border-rule space-y-12 sm:space-y-16 animate-in slide-in-from-bottom-10 duration-700"
          >
            {/* ── Verified phone banner ── */}
            <div className="flex items-center justify-between gap-4 p-4 sm:p-5 bg-graphite rounded-2xl border border-kinpaku/40">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-kinpaku/10 rounded-lg flex items-center justify-center">
                  <Phone size={16} className="text-kinpaku" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-faint uppercase tracking-widest">Verified WhatsApp</p>
                  <p className="text-champagne font-bold text-[15px]">{whatsappNumber}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setSubmitStatus('idle');
                  setSubmitMsg('');
                }}
                className="flex items-center gap-1.5 text-[11px] font-black text-muted uppercase tracking-widest hover:text-kinpaku transition-colors"
              >
                <ArrowLeft size={14} /> Change
              </button>
            </div>

            {/* ── Step 2 status messages ── */}
            {submitStatus !== 'idle' && (
              <div className={`p-5 rounded-2xl border flex items-start gap-4 ${submitStatus === 'error' ? 'bg-raised border-warning/40 text-warning' : 'bg-lacquer-deep border-rule text-ink'}`}>
                {submitStatus === 'loading' && <Loader2 size={18} className="animate-spin text-kinpaku shrink-0 mt-0.5" />}
                {submitStatus === 'error' && <AlertCircle size={18} className="shrink-0 mt-0.5" />}
                <div className="flex-1">
                  <p className="text-[12px] font-black uppercase tracking-wider leading-relaxed">{submitMsg}</p>
                  {submitStatus === 'error' && existingBusiness?._id && (
                    <Link
                      to={`/business/${existingBusiness._id}`}
                      className="mt-3 inline-flex items-center justify-center rounded-xl border border-warning/40 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-warning hover:bg-warning/10 transition-colors"
                    >
                      View Existing Business
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* ══ Section 1 — Identity & Description ══ */}
            <div className="space-y-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-kinpaku rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-[rgba(232,119,34,0.2)]">1</div>
                <h3 className="text-kinpaku text-[10px] sm:text-[11px] font-black uppercase tracking-[0.25em] sm:tracking-[0.4em]">Essential Business Identity</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-champagne uppercase tracking-widest pl-1">Business Name <span className="text-kinpaku">*</span></label>
                  <input name="name" value={formData.name} onChange={handleChange} className="form-input-light" placeholder="How do your customers know you?" required />
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-black text-champagne uppercase tracking-widest pl-1">Category <span className="text-kinpaku">*</span></label>
                  <div className="relative">
                    <select name="category" value={formData.category} onChange={handleChange} className="form-input-light appearance-none pr-12" required>
                      <option value="">Select Category</option>
                      {[
                        "Hospitals & Clinics","Transport","Electricals & Electronics","Education","Sports",
                        "Real Estate","Spa & Beauty","Digital & IT Products","Hire Services","Automobile",
                        "B2B Services","Banquets & Event Halls","Bills & Recharge","Caterers","Civil Contractors",
                        "Daily Needs","Doctors","Jobs","Jewellery","Labs & Diagnostics","Banking & Finance",
                        "Packers & Movers","Wedding Services","Hotels & Restaurants","Repairs","IT & Software",
                        "Construction Materials","Pest Control","Agriculture","Printing Services",
                        "Textiles & Garments","Travel & Tourism","Home Appliances","Demand Services",
                        "Religious","Organic Products","Advertising","Insurance","Advocate & Legal","Courier Services",
                      ].map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-kinpaku"><ChevronDown size={16} /></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-black text-champagne uppercase tracking-widest pl-1">Sub-Category <span className="text-kinpaku">*</span></label>
                  <div className="relative">
                    <select name="subCategory" value={formData.subCategory} onChange={handleChange} className="form-input-light appearance-none pr-12" disabled={!formData.category} required>
                      <option value="">{formData.category ? 'Select Sub-Category' : 'Choose Category First'}</option>
                      {subCategoriesFor(formData.category).map((sub) => <option key={sub} value={sub}>{sub}</option>)}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-kinpaku"><ChevronDown size={16} /></div>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-3">
                  <label className="text-[11px] font-black text-champagne uppercase tracking-widest pl-1">Tell us about your Business</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="form-input-light resize-none px-5" placeholder="Share a few words about what makes your business special..." />
                </div>
              </div>
            </div>

            {/* ══ Section 2 — Location ══ */}
            <div className="pt-12 sm:pt-20 space-y-10 border-t border-rule">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-kinpaku rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-[rgba(232,119,34,0.2)]">2</div>
                <h3 className="text-kinpaku text-[10px] sm:text-[11px] font-black uppercase tracking-[0.25em] sm:tracking-[0.4em]">Where is your Business Located?</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-champagne uppercase tracking-widest pl-1">District <span className="text-kinpaku">*</span></label>
                  <select name="district" value={formData.district} onChange={handleChange} className="form-input-light" required>
                    <option value="">— Select Region —</option>
                    {tnDistricts.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-champagne uppercase tracking-widest pl-1">Assembly Constituency <span className="text-kinpaku">*</span></label>
                  <select name="assembly" value={formData.assembly} onChange={handleChange} className="form-input-light" disabled={!formData.district} required>
                    <option value="">{formData.district ? '— Select Constituency —' : 'Choose District First'}</option>
                    {formData.district && districtAssemblies[formData.district]?.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2 space-y-3">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[11px] font-black text-champagne uppercase tracking-widest pl-1">Full Office Address <span className="text-kinpaku">*</span></label>
                    <button type="button" onClick={handleUseLocation} className="text-[11px] font-black text-patina uppercase tracking-widest flex items-center gap-2 hover:bg-graphite px-4 py-2 rounded-xl transition-all">
                      <MapPin size={14} /> Detect Location
                    </button>
                  </div>
                  <textarea name="address" value={formData.address} onChange={handleChange} rows="3" className="form-input-light resize-none px-5" placeholder="Street name, Building No, etc." required />
                </div>

                <div className="md:col-span-2 space-y-3">
                  <label className="text-[11px] font-black text-champagne uppercase tracking-widest pl-1">Landmark / How to find you</label>
                  <input name="landmark" value={formData.landmark} onChange={handleChange} className="form-input-light" placeholder="e.g. Near New Bus Stand, Above AXIS Bank" />
                </div>

                <div className="md:col-span-2 space-y-3">
                  <label className="text-[11px] font-black text-champagne uppercase tracking-widest pl-1">Primary Coverage Areas</label>
                  <input name="areas" value={formData.areas} onChange={handleChange} className="form-input-light" placeholder="Areas you serve (e.g. Anna Nagar, T. Nagar)" />
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-black text-champagne uppercase tracking-widest pl-1">City / Town</label>
                  <input name="city" value={formData.city} onChange={handleChange} className="form-input-light" placeholder="e.g. Madurai" />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-champagne uppercase tracking-widest pl-1">Pincode</label>
                  <input name="pincode" value={formData.pincode} onChange={handleChange} className="form-input-light" placeholder="6-digit PIN code" />
                </div>
              </div>
            </div>

            {/* ══ Section 3 — Contact ══ */}
            <div className="pt-12 sm:pt-20 space-y-10 border-t border-rule">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-kinpaku rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-[rgba(232,119,34,0.2)]">3</div>
                <h3 className="text-kinpaku text-[10px] sm:text-[11px] font-black uppercase tracking-[0.25em] sm:tracking-[0.4em]">Direct Contact Channels</h3>
              </div>

              <div className="space-y-10">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-champagne uppercase tracking-widest pl-1">Primary WhatsApp Business Phone <span className="text-kinpaku">*</span></label>
                  <input
                    name="whatsappPrimary"
                    value={formData.whatsappPrimary}
                    onChange={(e) => handleMobileChange('whatsappPrimary', e.target.value)}
                    className={`w-full bg-lacquer-deep border-2 rounded-2xl px-5 sm:px-8 py-4 sm:py-6 text-lg font-bold text-champagne shadow-sm focus:bg-raised transition-all placeholder:text-faint ${phoneCheckStatus === 'duplicate' ? 'border-warning focus:border-warning' : 'border-rule focus:border-kinpaku'}`}
                    placeholder="9876543210"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    pattern="[0-9]{10}"
                    required
                  />
                  {phoneCheckStatus === 'checking' && (
                    <div className="flex items-center gap-2 text-[12px] text-kinpaku font-bold">
                      <Loader2 size={14} className="animate-spin" /> Verifying phone numbers...
                    </div>
                  )}
                  {phoneCheckStatus === 'duplicate' && (
                    <div className="flex items-start gap-2 text-[12px] text-warning font-bold">
                      <AlertCircle size={14} className="mt-0.5 shrink-0" />
                      <span>{phoneCheckMessage}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-faint uppercase tracking-widest pl-1">Verification Number (locked)</label>
                    <input name="whatsappNo" value={formData.whatsappNo} readOnly className="form-input-light bg-graphite cursor-not-allowed text-faint" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-champagne uppercase tracking-widest pl-1">Office Landline</label>
                    <input name="landline" value={formData.landline} onChange={handleChange} className="form-input-light" placeholder="STD Code - Number" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-champagne uppercase tracking-widest pl-1">Alternate Mobile</label>
                    <input
                      name="alternatePhone"
                      value={formData.alternatePhone}
                      onChange={(e) => handleMobileChange('alternatePhone', e.target.value)}
                      className="form-input-light"
                      placeholder="Second contact mobile"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      pattern="[0-9]{10}"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-champagne uppercase tracking-widest pl-1">Official Email Address</label>
                    <input name="email" value={formData.email} onChange={handleChange} className="form-input-light" placeholder="contact@yourbusiness.com" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-black text-champagne uppercase tracking-widest pl-1">Professional Website</label>
                  <input name="website" value={formData.website} onChange={handleChange} className="form-input-light" placeholder="https://www.yourbrand.com" />
                </div>
              </div>
            </div>

            {/* ══ Section 4 — Social & Hours ══ */}
            <div className="pt-12 sm:pt-20 space-y-10 border-t border-rule">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-kinpaku rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-[rgba(232,119,34,0.2)]">4</div>
                <h3 className="text-kinpaku text-[10px] sm:text-[11px] font-black uppercase tracking-[0.25em] sm:tracking-[0.4em]">Social Media & Operating Hours</h3>
              </div>

              <div className="space-y-12">
                <div className="space-y-8">
                  {Object.entries(formData.socialLinks).map(([platform, value]) => (
                    <div key={platform} className="flex items-center gap-6 animate-in zoom-in-95 duration-200">
                      <label className="w-32 text-[10px] font-black text-faint uppercase tracking-[0.2em]">{platform}</label>
                      <div className="flex-1 relative">
                        <input
                          value={value}
                          onChange={(e) => setFormData((p) => ({ ...p, socialLinks: { ...p.socialLinks, [platform]: e.target.value } }))}
                          className="form-input-light pr-14"
                          placeholder={`Paste ${platform} profile URL here...`}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const nl = { ...formData.socialLinks };
                            delete nl[platform];
                            setFormData((p) => ({ ...p, socialLinks: nl }));
                          }}
                          className="absolute right-5 top-1/2 -translate-y-1/2 text-kinpaku hover:scale-110 transition-transform"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {showPlatformSelector ? (
                    <div className="flex flex-wrap gap-3 sm:gap-4 p-5 sm:p-8 bg-graphite rounded-[20px] sm:rounded-[32px] border border-kinpaku/50 animate-in fade-in zoom-in-95 duration-400">
                      {['Facebook', 'Twitter', 'Instagram', 'Google Maps', 'YouTube'].map((p) => {
                        const id = p.toLowerCase().split(' ')[0];
                        if (formData.socialLinks[id] !== undefined) return null;
                        return (
                          <button
                            key={p}
                            type="button"
                            onClick={() => { setFormData((prev) => ({ ...prev, socialLinks: { ...prev.socialLinks, [id]: '' } })); setShowPlatformSelector(false); }}
                            className="px-8 py-3 rounded-2xl bg-raised border border-kinpaku text-kinpaku text-[11px] font-black uppercase tracking-widest hover:bg-kinpaku hover:text-white transition-all shadow-sm"
                          >
                            {p}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    Object.keys(formData.socialLinks).length < 5 && (
                      <button
                        type="button"
                        onClick={() => setShowPlatformSelector(true)}
                        className="w-full py-6 border-2 border-dashed border-kinpaku rounded-3xl text-kinpaku font-black uppercase text-[11px] tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-graphite transition-all"
                      >
                        + Link Social Profile
                      </button>
                    )
                  )}
                </div>

                <div className="space-y-8 bg-lacquer-deep rounded-[24px] sm:rounded-[40px] p-6 sm:p-10 border border-rule">
                  <label className="text-[11px] font-black text-champagne uppercase tracking-widest pl-1">Working Days</label>
                  <div className="flex flex-wrap gap-3">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                      <label
                        key={day}
                        className={`flex items-center gap-3 px-8 py-4 rounded-2xl cursor-pointer transition-all border ${formData.openingDays.includes(day) ? 'bg-kinpaku border-kinpaku text-white shadow-lg shadow-[rgba(232,119,34,0.2)]' : 'bg-raised border-rule text-muted hover:border-kinpaku'}`}
                      >
                        <input
                          type="checkbox" hidden checked={formData.openingDays.includes(day)}
                          onChange={(e) => {
                            const days = e.target.checked
                              ? [...formData.openingDays, day]
                              : formData.openingDays.filter((d) => d !== day);
                            setFormData((p) => ({ ...p, openingDays: days }));
                          }}
                        />
                        <span className="text-xs font-black uppercase tracking-widest">{day}</span>
                      </label>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-6">
                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-champagne uppercase tracking-widest pl-1">Open Doors At</label>
                      <input type="time" name="openingTime" value={formData.openingTime} onChange={handleChange} className="form-input-light bg-raised border-rule" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-champagne uppercase tracking-widest pl-1">Closed Doors At</label>
                      <input type="time" name="closingTime" value={formData.closingTime} onChange={handleChange} className="form-input-light bg-raised border-rule" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ══ Section 5 — FAQ ══ */}
            <div className="pt-12 sm:pt-20 space-y-10 border-t border-rule">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-kinpaku rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-[rgba(232,119,34,0.2)]">5</div>
                <h3 className="text-kinpaku text-[10px] sm:text-[11px] font-black uppercase tracking-[0.25em] sm:tracking-[0.4em]">Clear the Doubts (FAQ)</h3>
              </div>
              <div className="space-y-10 bg-graphite rounded-[24px] sm:rounded-[40px] p-6 sm:p-12 border border-kinpaku/30">
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-champagne uppercase tracking-widest pl-1">Your Customer's Main Question</label>
                  <input name="faqQuestion" value={formData.faqQuestion} onChange={handleChange} className="form-input-light bg-raised border-rule px-5" placeholder="e.g. Do you provide doorstep service?" />
                </div>
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-champagne uppercase tracking-widest pl-1">The Helpful Answer</label>
                  <textarea name="faqAnswer" value={formData.faqAnswer} onChange={handleChange} rows="3" className="form-input-light bg-raised border-rule resize-none px-5" placeholder="Yes, we provide free home delivery within 5kms..." />
                </div>
              </div>
            </div>

            {/* ══ Section 6 — Media ══ */}
            <div className="pt-12 sm:pt-20 space-y-10 border-t border-rule">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-kinpaku rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-[rgba(232,119,34,0.2)]">6</div>
                <h3 className="text-kinpaku text-[10px] sm:text-[11px] font-black uppercase tracking-[0.25em] sm:tracking-[0.4em]">Business Gallery & Branding</h3>
              </div>

              {/* Banner */}
              <div className="space-y-4">
                <label className="text-[11px] font-black text-champagne uppercase tracking-widest">
                  Cover / Banner Photo <span className="text-[10px] text-faint normal-case font-medium ml-2">(Optional)</span>
                </label>
                <div
                  onClick={() => document.getElementById('banner-upload').click()}
                  className="border-2 border-dashed border-rule rounded-[32px] text-center hover:border-kinpaku hover:bg-graphite transition-all cursor-pointer group relative overflow-hidden min-h-[200px] flex items-center justify-center bg-lacquer-deep"
                >
                  <input type="file" id="banner-upload" hidden accept="image/*" onChange={(e) => { const f = e.target.files[0]; if (f) setFormData((p) => ({ ...p, bannerImage: f })); }} />
                  {formData.bannerImage ? (
                    <div className="w-full h-full absolute inset-0">
                      <img src={URL.createObjectURL(formData.bannerImage)} className="w-full h-full object-cover" alt="Banner" />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                        <p className="text-white font-black uppercase text-[11px] tracking-widest bg-kinpaku px-6 py-3 rounded-full">Change Photo</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <div className="text-2xl">🖼️</div>
                      <p className="text-xs font-black text-champagne uppercase tracking-widest">Tap to upload cover / banner photo</p>
                      <p className="text-[10px] text-faint font-bold tracking-tight">BANNER RATIO — CROPS TO FIT</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Gallery */}
              <div className="space-y-4 pt-8">
                <label className="text-[11px] font-black text-champagne uppercase tracking-widest">
                  Gallery Images <span className="text-[10px] text-faint normal-case font-medium ml-2">(Optional — up to 10)</span>
                </label>
                <div className="bg-lacquer-deep border-2 border-rule rounded-[20px] sm:rounded-[32px] p-5 sm:p-10 space-y-6">
                  {formData.gallery.length > 0 && (
                    <div className="flex flex-wrap gap-4">
                      {formData.gallery.map((file, i) => (
                        <div key={i} className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-lg border-2 border-rule group">
                          <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="Gallery" />
                          <button
                            type="button"
                            onClick={() => setFormData((p) => ({ ...p, gallery: p.gallery.filter((_, idx) => idx !== i) }))}
                            className="absolute inset-0 bg-kinpaku/80 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <input
                    type="file" multiple accept="image/*"
                    onChange={(e) => setFormData((p) => ({ ...p, gallery: [...p.gallery, ...Array.from(e.target.files)].slice(0, 10) }))}
                    className="text-[10px] font-black uppercase text-faint file:bg-kinpaku file:text-white file:border-0 file:rounded-xl file:px-6 file:py-3 file:mr-6 file:cursor-pointer hover:file:bg-patina transition-all cursor-pointer"
                  />
                </div>
              </div>

              {/* Services */}
              <div className="space-y-8 pt-8">
                <label className="text-[11px] font-black text-champagne uppercase tracking-widest">
                  Services / Products <span className="text-[10px] text-faint normal-case font-medium ml-2">(Optional — up to 6)</span>
                </label>
                <div className="space-y-6">
                  {formData.services.map((service, index) => (
                    <div key={index} className="bg-lacquer-deep rounded-[20px] sm:rounded-[32px] p-5 sm:p-10 border border-rule space-y-8 sm:space-y-10 animate-in fade-in slide-in-from-top-4 duration-300">
                      <div className="flex justify-between items-center pb-4 border-b border-rule">
                        <span className="text-champagne text-xs font-black uppercase tracking-widest">Service {index + 1}</span>
                        <button
                          type="button"
                          onClick={() => setFormData((p) => ({ ...p, services: p.services.filter((_, i) => i !== index) }))}
                          className="text-kinpaku text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                        >
                          <X size={14} /> Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                        <div className="space-y-3">
                          <label className="text-[11px] font-black text-champagne uppercase tracking-widest">Name</label>
                          <input
                            value={service.name}
                            onChange={(e) => {
                              const ns = [...formData.services];
                              ns[index] = { ...ns[index], name: e.target.value };
                              setFormData((p) => ({ ...p, services: ns }));
                            }}
                            className="form-input-light bg-raised"
                            placeholder="Service / product name"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[11px] font-black text-champagne uppercase tracking-widest">Price (₹)</label>
                          <input
                            value={service.price}
                            onChange={(e) => {
                              const ns = [...formData.services];
                              ns[index] = { ...ns[index], price: e.target.value };
                              setFormData((p) => ({ ...p, services: ns }));
                            }}
                            className="form-input-light bg-raised"
                            placeholder="e.g. 500"
                          />
                        </div>
                        <div className="md:col-span-2 space-y-3">
                          <label className="text-[11px] font-black text-champagne uppercase tracking-widest">Details</label>
                          <textarea
                            rows="3"
                            value={service.details}
                            onChange={(e) => {
                              const ns = [...formData.services];
                              ns[index] = { ...ns[index], details: e.target.value };
                              setFormData((p) => ({ ...p, services: ns }));
                            }}
                            className="form-input-light bg-raised resize-none"
                            placeholder="Brief description of this service..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {formData.services.length < 6 && (
                    <button
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, services: [...p.services, { name: '', price: '', details: '' }] }))}
                      className="w-full py-6 border-2 border-dashed border-rule rounded-3xl text-muted font-black uppercase text-[11px] tracking-[0.4em] flex items-center justify-center gap-4 hover:border-kinpaku hover:text-kinpaku hover:bg-graphite transition-all"
                    >
                      + Add Service / Product
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* ══ Submit button ══ */}
            <div className="pt-12 sm:pt-16 border-t border-rule">
              <button
                type="submit"
                disabled={submitStatus === 'loading' || phoneCheckStatus === 'checking' || phoneCheckStatus === 'duplicate'}
                className="w-full bg-kinpaku text-lacquer-deep py-6 sm:py-8 rounded-2xl text-[13px] sm:text-[15px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-kinpaku-rich shadow-2xl shadow-[rgba(232,119,34,0.3)] hover:-translate-y-1 transition-all group disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {submitStatus === 'loading' ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span className="tracking-[0.2em]">Submitting...</span>
                  </>
                ) : (
                  <>
                    Submit Registration
                    <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform duration-500" />
                  </>
                )}
              </button>
              <p className="text-center text-[11px] text-faint font-bold uppercase tracking-widest mt-6">
                By submitting, you agree to our{' '}
                <Link to="/terms" className="text-kinpaku hover:underline">Terms & Conditions</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-kinpaku hover:underline">Privacy Policy</Link>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddBusiness;
