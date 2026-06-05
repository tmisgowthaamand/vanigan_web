import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, ArrowLeft, CheckCircle, ChevronDown, ImagePlus, Loader2, Plus, Save, Trash2, X } from 'lucide-react';
import { businessService, session } from '../services/api';
import { categorySubMap, subCategoriesFor } from '../data/subCategories';
import { districtAssemblies, districts as tnDistricts } from '../data/constituencies';

const OPEN_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thrusday', 'Friday', 'Saturday', 'Sunday'];

const EMPTY_FORM = {
    name: '',
    category: '',
    subCategory: '',
    description: '',
    address: '',
    city: '',
    pincode: '',
    landmark: '',
    serviceLocations: '',
    district: '',
    assembly: '',
    phone: '',
    whatsappNo: '',
    landline: '',
    phone2: '',
    email: '',
    website: '',
    fbLink: '',
    twitterLink: '',
    instaLink: '',
    googleMap: '',
    videoUrl: '',
    openTime: '',
    closeTime: '',
    infoQuestion: '',
    infoAnswer: '',
};

const textValue = (value) => (value == null ? '' : String(value));

const readSocial = (business, key, fallbackKey) => (
    business?.[key] || business?.socialLinks?.[key] || business?.socialLinks?.[fallbackKey] || ''
);

const buildForm = (business = {}) => ({
    ...EMPTY_FORM,
    name: textValue(business.name),
    category: textValue(business.category),
    subCategory: textValue(business.subCategory),
    description: textValue(business.description),
    address: textValue(business.address),
    city: textValue(business.city),
    pincode: textValue(business.pincode),
    landmark: textValue(business.landmark),
    serviceLocations: textValue(business.serviceLocations || business.areas),
    district: textValue(business.district),
    assembly: textValue(business.assembly),
    phone: textValue(business.phone || business.whatsappPrimary),
    whatsappNo: textValue(business.whatsappNo || business.phone),
    landline: textValue(business.landline),
    phone2: textValue(business.phone2 || business.alternatePhone),
    email: textValue(business.email),
    website: textValue(business.website),
    fbLink: textValue(readSocial(business, 'fbLink', 'facebook')),
    twitterLink: textValue(readSocial(business, 'twitterLink', 'twitter')),
    instaLink: textValue(readSocial(business, 'instaLink', 'instagram')),
    googleMap: textValue(readSocial(business, 'googleMap', 'googleMap')),
    videoUrl: textValue(readSocial(business, 'videoUrl', 'youtube')),
    openTime: textValue(business.openTime || business.openingTime),
    closeTime: textValue(business.closeTime || business.closingTime),
    infoQuestion: textValue(business.infoQuestion || business.faqQuestion),
    infoAnswer: textValue(business.infoAnswer || business.faqAnswer),
});

const buildServices = (business = {}) => {
    const services = Array.isArray(business.services) ? business.services : [];
    return services.slice(0, 6).map((service) => ({
        name: textValue(service.name),
        price: textValue(service.price),
        detail: textValue(service.detail || service.details),
        image: textValue(service.image || service.url),
        imagePublicId: textValue(service.imagePublicId || service.publicId),
        newImage: null,
        newImagePreview: '',
    }));
};

const splitDays = (value) => (
    typeof value === 'string'
        ? value.split(',').map(day => day.trim()).filter(Boolean)
        : Array.isArray(value) ? value : []
);

const Field = ({ label, children }) => (
    <div className="min-w-0 space-y-2">
        <label className="block text-[11px] font-black text-champagne uppercase tracking-widest leading-snug pl-1">{label}</label>
        {children}
    </div>
);

const Section = ({ index, title, hint, children }) => (
    <section className="w-full min-w-0 pt-12 sm:pt-16 first:pt-0 border-t first:border-t-0 border-rule space-y-8 sm:space-y-10 overflow-hidden">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-kinpaku rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-[rgba(232,119,34,0.2)] shrink-0">
                {String(index).split(' ')[0]}
            </div>
            <div className="min-w-0">
                <p className="text-kinpaku text-[10px] sm:text-[11px] font-black uppercase tracking-[0.25em] sm:tracking-[0.4em] leading-relaxed">{title}</p>
                {hint && <p className="text-[12px] sm:text-[13px] text-muted font-medium mt-1 leading-relaxed">{hint}</p>}
            </div>
        </div>
        {children}
    </section>
);

const EditBusiness = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const auth = session.get();
    const sessionBusiness = auth?.business;
    const initialBusiness = location.state?.business || sessionBusiness;
    const ownerPhone = (
        location.state?.ownerPhone ||
        auth?.user?.phone ||
        sessionStorage.getItem('vanigan_owner_phone') ||
        localStorage.getItem('vanigan_owner_phone') ||
        ''
    ).replace(/\D/g, '').slice(-10);

    const [business, setBusiness] = useState(initialBusiness || null);
    const [form, setForm] = useState(() => buildForm(initialBusiness));
    const [openDays, setOpenDays] = useState(() => splitDays(initialBusiness?.openDays));
    const [services, setServices] = useState(() => buildServices(initialBusiness));
    const [existingGallery, setExistingGallery] = useState(() => initialBusiness?.galleryImages || []);
    const [galleryToRemove, setGalleryToRemove] = useState([]);
    const [profileImage, setProfileImage] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const [galleryFiles, setGalleryFiles] = useState([]);
    const [pin, setPin] = useState('');
    const [newPin, setNewPin] = useState('');
    const [confirmNewPin, setConfirmNewPin] = useState('');
    const [loading, setLoading] = useState(!initialBusiness);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const inputClass = 'form-input-light min-w-0 text-[16px] sm:text-[15px] disabled:opacity-60 disabled:cursor-not-allowed';
    const subCategories = useMemo(() => subCategoriesFor(form.category), [form.category]);
    const assemblies = form.district ? (districtAssemblies[form.district] || []) : [];

    useEffect(() => {
        let active = true;
        if (!id) return undefined;
        if (initialBusiness?._id === id) return undefined;

        businessService.getById(id)
            .then((data) => {
                if (!active) return;
                const item = data?.business || data;
                setBusiness(item);
                setForm(buildForm(item));
                setOpenDays(splitDays(item?.openDays));
                setServices(buildServices(item));
                setExistingGallery(item?.galleryImages || []);
            })
            .catch(() => {
                if (active) setError('Could not load this business. Please try again.');
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => { active = false; };
    }, [id, initialBusiness]);

    const updateField = (key, value) => {
        setError('');
        setSuccess('');
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const toggleDay = (day) => {
        setOpenDays(prev => (
            prev.includes(day) ? prev.filter(item => item !== day) : [...prev, day]
        ));
    };

    const updateService = (index, key, value) => {
        setServices(prev => {
            const next = [...prev];
            next[index] = { ...next[index], [key]: value };
            return next;
        });
    };

    const handleServiceImage = (index, file) => {
        if (!file) return;
        updateService(index, 'newImage', file);
        updateService(index, 'newImagePreview', URL.createObjectURL(file));
    };

    const removeGalleryItem = (item) => {
        setExistingGallery(prev => prev.filter(img => img.publicId !== item.publicId && img.url !== item.url));
        if (item.publicId) setGalleryToRemove(prev => [...prev, item.publicId]);
    };

    const addGalleryFiles = (files) => {
        setGalleryFiles(prev => [...prev, ...Array.from(files || [])].slice(0, 10));
    };

    const appendFormFields = (data) => {
        Object.entries(form).forEach(([key, value]) => data.append(key, value));
        data.set('phone', form.phone);
        data.set('whatsappPrimary', form.phone);
        data.set('phone2', form.phone2);
        data.set('alternatePhone', form.phone2);
        data.set('areas', form.serviceLocations);
        data.set('openingTime', form.openTime);
        data.set('closingTime', form.closeTime);
        data.set('faqQuestion', form.infoQuestion);
        data.set('faqAnswer', form.infoAnswer);
        data.append('openDays', openDays.join(','));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');

        if (!ownerPhone) {
            setError('Please log in again before editing your business.');
            return;
        }
        if (!form.name.trim()) {
            setError('Business name is required.');
            return;
        }
        if (!form.address.trim()) {
            setError('Address is required.');
            return;
        }
        if (pin.length !== 4) {
            setError('Enter your current 4-digit PIN to save changes.');
            return;
        }
        if (newPin || confirmNewPin) {
            if (newPin.length !== 4) {
                setError('New PIN must be 4 digits.');
                return;
            }
            if (newPin !== confirmNewPin) {
                setError('New PINs do not match.');
                return;
            }
        }

        const data = new FormData();
        data.append('ownerPhone', ownerPhone);
        data.append('pin', pin);
        if (newPin && newPin === confirmNewPin) data.append('newPin', newPin);
        appendFormFields(data);
        if (galleryToRemove.length) data.append('galleryToRemove', galleryToRemove.join(','));
        if (profileImage) data.append('image', profileImage);
        if (coverImage) data.append('coverImageFile', coverImage);
        galleryFiles.forEach(file => data.append('galleryFiles', file));
        services.slice(0, 6).forEach((service, index) => {
            const position = index + 1;
            data.append(`service${position}Name`, service.name || '');
            data.append(`service${position}Price`, service.price || '');
            data.append(`service${position}Detail`, service.detail || '');
            if (service.newImage) data.append(`service${position}Image`, service.newImage);
        });

        setSaving(true);
        try {
            const response = await businessService.updateOwnerBusiness(id, data);
            const updated = response?.item || response?.business || response;
            if (updated?._id) {
                setBusiness(updated);
                setForm(buildForm(updated));
                setOpenDays(splitDays(updated.openDays));
                setServices(buildServices(updated));
                setExistingGallery(updated.galleryImages || []);
                setGalleryToRemove([]);
                setGalleryFiles([]);
                setProfileImage(null);
                setCoverImage(null);
                const nextAuth = { ...(auth || {}), business: updated };
                if (auth?.user) session.set(nextAuth);
            }
            setPin('');
            setNewPin('');
            setConfirmNewPin('');
            setSuccess('Business updated successfully.');
            setTimeout(() => navigate('/my-business'), 900);
        } catch (err) {
            const apiError = err?.response?.data?.error || err?.response?.data?.message;
            if (apiError === 'wrong_pin' || err?.response?.status === 401 || err?.response?.status === 403) {
                setError('Incorrect PIN. Please enter the current owner PIN.');
            } else {
                setError(apiError || 'Could not save changes. Please try again.');
            }
        } finally {
            setSaving(false);
        }
    };

    if (!ownerPhone) {
        return (
            <main className="min-h-screen bg-lacquer pt-28 pb-20 px-5">
                <div className="max-w-xl mx-auto bg-raised border border-rule rounded-[24px] p-8 text-center">
                    <AlertCircle className="mx-auto text-warning mb-4" size={34} />
                    <h1 className="text-2xl font-black text-champagne mb-2">Login required</h1>
                    <p className="text-muted text-[14px] mb-6">Please sign in to edit your business listing.</p>
                    <Link to="/login" className="inline-flex items-center justify-center bg-kinpaku text-lacquer-deep h-12 px-8 rounded-xl font-black uppercase tracking-wider">
                        Sign in
                    </Link>
                </div>
            </main>
        );
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-lacquer pt-28 pb-20 flex items-center justify-center">
                <div className="flex items-center gap-3 text-muted font-bold">
                    <Loader2 className="animate-spin text-kinpaku" /> Loading business...
                </div>
            </main>
        );
    }

    if (!business && error) {
        return (
            <main className="min-h-screen bg-lacquer pt-28 pb-20 px-5">
                <div className="max-w-xl mx-auto bg-raised border border-rule rounded-[24px] p-8 text-center">
                    <AlertCircle className="mx-auto text-warning mb-4" size={34} />
                    <h1 className="text-2xl font-black text-champagne mb-2">Business not found</h1>
                    <p className="text-muted text-[14px] mb-6">{error}</p>
                    <Link to="/my-business" className="text-kinpaku font-bold underline underline-offset-4">Back to My Business</Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-lacquer pt-28 pb-20 selection:bg-[rgba(232,119,34,0.28)] selection:text-champagne overflow-x-hidden" style={{ fontFamily: "'Saans', 'Inter', system-ui, sans-serif" }}>
            <div className="w-full max-w-4xl mx-auto px-4">
                <div className="bg-raised rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 mb-8 sm:mb-10 border border-rule shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <button
                                type="button"
                                onClick={() => navigate('/my-business')}
                                className="inline-flex items-center gap-2 text-muted hover:text-kinpaku text-[13px] font-bold mb-4"
                            >
                                <ArrowLeft size={16} /> Back to My Business
                            </button>
                            <h1 className="text-2xl sm:text-3xl font-black text-champagne tracking-tighter mb-2">
                                Edit Your Business
                            </h1>
                            <p className="text-muted text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-patina animate-pulse" />
                                Owner Dashboard - Business Details
                            </p>
                        </div>
                        <div className="grid grid-cols-9 gap-1.5">
                            {Array.from({ length: 9 }, (_, index) => (
                                <div
                                    key={index}
                                    className="h-1.5 w-4 sm:w-7 rounded-full bg-kinpaku"
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="w-full min-w-0 bg-raised rounded-[24px] sm:rounded-[40px] p-6 sm:p-10 md:p-16 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] border border-rule space-y-12 sm:space-y-16 animate-in slide-in-from-bottom-10 duration-700"
                >
                    <Section index="1 of 9" title="Essential Business Identity" hint="Modify your business name, category and description">
                        <Field label="Business Name *">
                            <input className={inputClass} value={form.name} onChange={(e) => updateField('name', e.target.value)} required />
                        </Field>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field label="Category">
                                <div className="relative">
                                    <select className={`${inputClass} appearance-none pr-10`} value={form.category} onChange={(e) => { updateField('category', e.target.value); updateField('subCategory', ''); }}>
                                        <option value="">Select Category</option>
                                        {Object.keys(categorySubMap).map(category => <option key={category} value={category}>{category}</option>)}
                                    </select>
                                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-faint pointer-events-none" />
                                </div>
                            </Field>
                            <Field label="Sub-Category">
                                <div className="relative">
                                    <select className={`${inputClass} appearance-none pr-10`} value={form.subCategory} onChange={(e) => updateField('subCategory', e.target.value)} disabled={!form.category}>
                                        <option value="">{form.category ? 'Select Sub-Category' : 'Choose Category First'}</option>
                                        {subCategories.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                                    </select>
                                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-faint pointer-events-none" />
                                </div>
                            </Field>
                        </div>
                        <Field label="Description">
                            <textarea className={`${inputClass} resize-y min-h-[110px]`} value={form.description} onChange={(e) => updateField('description', e.target.value)} />
                        </Field>
                    </Section>

                    <Section index="2 of 9" title="Where is your Business Located?" hint="Update your physical location details">
                        <Field label="Address *">
                            <textarea className={`${inputClass} resize-y min-h-[90px]`} value={form.address} onChange={(e) => updateField('address', e.target.value)} required />
                        </Field>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field label="District">
                                <select className={inputClass} value={form.district} onChange={(e) => { updateField('district', e.target.value); updateField('assembly', ''); }}>
                                    <option value="">Select District</option>
                                    {tnDistricts.map(districtName => <option key={districtName} value={districtName}>{districtName}</option>)}
                                </select>
                            </Field>
                            <Field label="Assembly">
                                <select className={inputClass} value={form.assembly} onChange={(e) => updateField('assembly', e.target.value)} disabled={!form.district}>
                                    <option value="">{form.district ? 'Select Assembly' : 'Choose District First'}</option>
                                    {assemblies.map(area => <option key={area} value={area}>{area}</option>)}
                                </select>
                            </Field>
                            <Field label="City">
                                <input className={inputClass} value={form.city} onChange={(e) => updateField('city', e.target.value)} />
                            </Field>
                            <Field label="Pincode">
                                <input className={inputClass} value={form.pincode} onChange={(e) => updateField('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" />
                            </Field>
                        </div>
                        <Field label="Landmark">
                            <input className={inputClass} value={form.landmark} onChange={(e) => updateField('landmark', e.target.value)} />
                        </Field>
                        <Field label="Service Locations">
                            <input className={inputClass} value={form.serviceLocations} onChange={(e) => updateField('serviceLocations', e.target.value)} />
                        </Field>
                    </Section>

                    <Section index="3 of 9" title="Direct Contact Channels" hint="Update phone numbers, email, and website">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field label="Primary Phone">
                                <input className={`${inputClass} bg-graphite cursor-not-allowed`} value={form.phone} readOnly type="tel" />
                            </Field>
                            <Field label="WhatsApp No">
                                <input className={inputClass} value={form.whatsappNo} onChange={(e) => updateField('whatsappNo', e.target.value.replace(/\D/g, '').slice(0, 10))} type="tel" inputMode="numeric" />
                            </Field>
                            <Field label="Landline">
                                <input className={inputClass} value={form.landline} onChange={(e) => updateField('landline', e.target.value)} />
                            </Field>
                            <Field label="Alt Phone">
                                <input className={inputClass} value={form.phone2} onChange={(e) => updateField('phone2', e.target.value.replace(/\D/g, '').slice(0, 10))} type="tel" inputMode="numeric" />
                            </Field>
                            <Field label="Email">
                                <input className={inputClass} value={form.email} onChange={(e) => updateField('email', e.target.value)} type="email" />
                            </Field>
                            <Field label="Website">
                                <input className={inputClass} value={form.website} onChange={(e) => updateField('website', e.target.value)} type="url" placeholder="https://..." />
                            </Field>
                        </div>
                    </Section>

                    <Section index="4 of 9" title="Social Media Profiles" hint="Add links to your social media profiles">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                ['fbLink', 'Facebook'],
                                ['twitterLink', 'Twitter / X'],
                                ['instaLink', 'Instagram'],
                                ['googleMap', 'Google Maps'],
                                ['videoUrl', 'YouTube'],
                            ].map(([key, label]) => (
                                <Field key={key} label={label}>
                                    <input className={inputClass} value={form[key]} onChange={(e) => updateField(key, e.target.value)} type="url" placeholder="https://..." />
                                </Field>
                            ))}
                        </div>
                    </Section>

                    <Section index="5 of 9" title="Operating Hours" hint="Specify opening days and timing schedules">
                        <div className="space-y-3">
                            <label className="text-[11px] font-black text-champagne uppercase tracking-widest">Opening Days</label>
                            <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-2">
                                {OPEN_DAYS.map(day => (
                                    <button
                                        key={day}
                                        type="button"
                                        onClick={() => toggleDay(day)}
                                        className={`min-w-0 px-3 sm:px-6 py-3 rounded-2xl text-[12px] font-black border transition-colors ${openDays.includes(day) ? 'bg-kinpaku border-kinpaku text-lacquer-deep shadow-lg shadow-[rgba(232,119,34,0.2)]' : 'bg-raised border-rule text-muted hover:border-kinpaku'}`}
                                    >
                                        {day.slice(0, 3)}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field label="Open Time">
                                <input className={inputClass} type="time" value={form.openTime} onChange={(e) => updateField('openTime', e.target.value)} />
                            </Field>
                            <Field label="Close Time">
                                <input className={inputClass} type="time" value={form.closeTime} onChange={(e) => updateField('closeTime', e.target.value)} />
                            </Field>
                        </div>
                    </Section>

                    <Section index="6 of 9" title="Services & Products" hint="List key services/products offered, max 6">
                        <div className="space-y-4">
                            {services.map((service, index) => (
                                <div key={index} className="min-w-0 bg-lacquer-deep border border-rule rounded-[20px] sm:rounded-[32px] p-5 sm:p-8 space-y-6">
                                    <div className="flex flex-col min-[420px]:flex-row min-[420px]:items-center sm:justify-between gap-3 pb-4 border-b border-rule">
                                        <p className="text-[12px] font-black uppercase tracking-widest text-champagne">Service {index + 1}</p>
                                        <button type="button" onClick={() => setServices(prev => prev.filter((_, i) => i !== index))} className="w-fit text-warning text-[12px] font-bold inline-flex items-center gap-1">
                                            <Trash2 size={13} /> Remove
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Field label="Name">
                                            <input className={inputClass} value={service.name} onChange={(e) => updateService(index, 'name', e.target.value)} />
                                        </Field>
                                        <Field label="Price">
                                            <input className={inputClass} value={service.price} onChange={(e) => updateService(index, 'price', e.target.value)} />
                                        </Field>
                                    </div>
                                    <Field label="Details">
                                        <textarea className={`${inputClass} min-h-[80px] resize-y`} value={service.detail} onChange={(e) => updateService(index, 'detail', e.target.value)} />
                                    </Field>
                                    <div className="flex flex-col min-[420px]:flex-row min-[420px]:items-center gap-4">
                                        {(service.newImagePreview || service.image) && (
                                            <img src={service.newImagePreview || service.image} alt="" className="w-20 h-20 rounded-xl object-cover border border-rule" />
                                        )}
                                        <label className="inline-flex w-full min-[420px]:w-fit items-center justify-center gap-2 border-2 border-dashed border-rule rounded-2xl px-5 py-4 text-[12px] font-black uppercase tracking-widest text-kinpaku hover:border-kinpaku hover:bg-graphite cursor-pointer transition-all">
                                            <ImagePlus size={14} /> {service.image || service.newImagePreview ? 'Change Photo' : 'Upload Photo'}
                                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleServiceImage(index, e.target.files?.[0])} />
                                        </label>
                                    </div>
                                </div>
                            ))}
                            {services.length < 6 && (
                                <button type="button" onClick={() => setServices(prev => [...prev, { name: '', price: '', detail: '', image: '', imagePublicId: '', newImage: null, newImagePreview: '' }])} className="w-full border-2 border-dashed border-rule rounded-3xl px-3 py-6 text-muted hover:text-kinpaku hover:border-kinpaku hover:bg-graphite text-[11px] font-black uppercase tracking-[0.3em] inline-flex items-center justify-center gap-3 text-center transition-all">
                                    <Plus size={16} /> Add Service / Product
                                </button>
                            )}
                        </div>
                    </Section>

                    <Section index="7 of 9" title="Business Gallery & Branding" hint="Manage logo, cover image, and gallery photos">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <Field label="Profile Photo / Logo">
                                <div className="flex flex-col min-[420px]:flex-row min-[420px]:items-center gap-4">
                                    {(profileImage || business?.image) && <img src={profileImage ? URL.createObjectURL(profileImage) : business.image} alt="" className="w-20 h-20 rounded-xl object-cover border border-rule" />}
                                    <label className="inline-flex w-full min-[420px]:w-fit items-center justify-center gap-2 border-2 border-dashed border-rule rounded-2xl px-5 py-4 text-[12px] font-black uppercase tracking-widest text-kinpaku hover:border-kinpaku hover:bg-graphite cursor-pointer transition-all">
                                        <ImagePlus size={14} /> Change Photo
                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => setProfileImage(e.target.files?.[0] || null)} />
                                    </label>
                                </div>
                            </Field>
                            <Field label="Cover / Banner Image">
                                <div className="flex flex-col min-[420px]:flex-row min-[420px]:items-center gap-4">
                                    {(coverImage || business?.coverImage) && <img src={coverImage ? URL.createObjectURL(coverImage) : business.coverImage} alt="" className="w-28 h-20 rounded-xl object-cover border border-rule" />}
                                    <label className="inline-flex w-full min-[420px]:w-fit items-center justify-center gap-2 border-2 border-dashed border-rule rounded-2xl px-5 py-4 text-[12px] font-black uppercase tracking-widest text-kinpaku hover:border-kinpaku hover:bg-graphite cursor-pointer transition-all">
                                        <ImagePlus size={14} /> Change Cover
                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => setCoverImage(e.target.files?.[0] || null)} />
                                    </label>
                                </div>
                            </Field>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[11px] font-black text-champagne uppercase tracking-widest">Gallery Images</label>
                            <div className="flex flex-wrap gap-3">
                                {existingGallery.map((item) => (
                                    <div key={item.publicId || item.url} className="relative">
                                        <img src={item.url} alt="" className="w-20 h-20 rounded-xl object-cover border border-rule" />
                                        <button type="button" onClick={() => removeGalleryItem(item)} className="absolute -right-2 -top-2 w-7 h-7 rounded-full bg-warning text-white flex items-center justify-center">
                                            <X size={13} />
                                        </button>
                                    </div>
                                ))}
                                {galleryFiles.map((file, index) => (
                                    <div key={`${file.name}-${index}`} className="relative">
                                        <img src={URL.createObjectURL(file)} alt="" className="w-20 h-20 rounded-xl object-cover border border-rule" />
                                        <button type="button" onClick={() => setGalleryFiles(prev => prev.filter((_, i) => i !== index))} className="absolute -right-2 -top-2 w-7 h-7 rounded-full bg-warning text-white flex items-center justify-center">
                                            <X size={13} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <label className="inline-flex w-full sm:w-fit items-center justify-center gap-2 border-2 border-dashed border-rule rounded-2xl px-5 py-4 text-[12px] font-black uppercase tracking-widest text-kinpaku hover:border-kinpaku hover:bg-graphite cursor-pointer transition-all">
                                <ImagePlus size={14} /> Add Gallery Photos
                                <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => addGalleryFiles(e.target.files)} />
                            </label>
                        </div>
                    </Section>

                    <Section index="8 of 9" title="Clear the Doubts (FAQ)" hint="Add a frequently asked question about your business">
                        <Field label="Question">
                            <input className={inputClass} value={form.infoQuestion} onChange={(e) => updateField('infoQuestion', e.target.value)} />
                        </Field>
                        <Field label="Answer">
                            <textarea className={`${inputClass} min-h-[90px] resize-y`} value={form.infoAnswer} onChange={(e) => updateField('infoAnswer', e.target.value)} />
                        </Field>
                    </Section>

                    <Section index="9 of 9" title="Security PIN" hint="Enter current PIN to save. New PIN is optional">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Field label="Current PIN *">
                                <input className={`${inputClass} text-center tracking-[0.45em]`} type="password" inputMode="numeric" maxLength={4} value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))} required />
                            </Field>
                            <Field label="New PIN">
                                <input className={`${inputClass} text-center tracking-[0.45em]`} type="password" inputMode="numeric" maxLength={4} value={newPin} onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))} />
                            </Field>
                            <Field label="Confirm New PIN">
                                <input className={`${inputClass} text-center tracking-[0.45em]`} type="password" inputMode="numeric" maxLength={4} value={confirmNewPin} onChange={(e) => setConfirmNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))} />
                            </Field>
                        </div>

                        {error && (
                            <div className="flex items-start gap-3 rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-warning">
                                <AlertCircle size={17} className="mt-0.5 shrink-0" />
                                <p className="text-[13px] font-bold">{error}</p>
                            </div>
                        )}
                        {success && (
                            <div className="flex items-start gap-3 rounded-xl border border-patina/40 bg-patina/10 px-4 py-3 text-patina">
                                <CheckCircle size={17} className="mt-0.5 shrink-0" />
                                <p className="text-[13px] font-bold">{success}</p>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button type="button" onClick={() => navigate('/my-business')} className="w-full sm:w-44 border border-rule text-champagne h-14 rounded-2xl font-black uppercase tracking-widest text-[12px] hover:bg-graphite hover:border-kinpaku/40 transition-colors">
                                Cancel
                            </button>
                            <button type="submit" disabled={saving} className="flex-1 bg-kinpaku text-lacquer-deep h-14 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-kinpaku-rich disabled:opacity-60 inline-flex items-center justify-center gap-3 shadow-2xl shadow-[rgba(232,119,34,0.3)] hover:-translate-y-1 transition-all disabled:hover:translate-y-0">
                                {saving ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : <><Save size={17} /> Save Changes</>}
                            </button>
                        </div>
                    </Section>
                </form>
            </div>
        </main>
    );
};

export default EditBusiness;
