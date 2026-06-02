import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        if (query.trim()) {
            navigate(`/business-list?search=${encodeURIComponent(query.trim())}&category=All%20Categories`);
        }
    };

    return (
        <section className="relative w-full bg-paper pt-[72px] overflow-hidden">
            {/* hairline grid texture */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.5]"
                style={{
                    backgroundImage:
                        'linear-gradient(var(--color-line) 1px, transparent 1px), linear-gradient(90deg, var(--color-line) 1px, transparent 1px)',
                    backgroundSize: '64px 64px',
                    maskImage: 'radial-gradient(ellipse 80% 60% at 70% 20%, black, transparent)'
                }}
            />

            <div className="container-custom relative z-10 py-16 md:py-24 lg:py-28">
                <div className="grid lg:grid-cols-12 gap-12 items-center">
                    {/* Left: editorial copy + search */}
                    <div className="lg:col-span-7 max-w-2xl">
                        <p className="eyebrow mb-6">
                            <span className="inline-block w-6 h-px bg-accent" />
                            Tamil Nadu Business Directory
                        </p>

                        <h1 className="display-head text-[clamp(2.5rem,6.5vw,5.25rem)] text-ink mb-6">
                            Discover <span className="italic text-accent">trusted</span> businesses near you.
                        </h1>

                        <p className="text-ink-2 text-base md:text-lg leading-relaxed mb-10 max-w-xl">
                            The most complete directory of services, vendors, and professionals
                            across Tamil Nadu — verified, searchable, and free to explore.
                        </p>

                        {/* Search — same navigation logic, editorial styling */}
                        <form onSubmit={handleSearch} className="w-full max-w-xl">
                            <div className="flex flex-col sm:flex-row items-stretch gap-3 bg-paper border border-line-strong rounded-2xl sm:rounded-full p-2 shadow-[0_8px_30px_-12px_rgba(26,22,19,0.18)] focus-within:border-ink transition-colors">
                                <div className="flex-1 flex items-center px-4 py-2 sm:py-0">
                                    <Search className="text-ink-3 mr-3 shrink-0" size={20} />
                                    <input
                                        type="text"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="Search a name, service or keyword…"
                                        className="w-full bg-transparent border-none focus:outline-none text-ink font-medium text-sm md:text-base placeholder:text-ink-3 h-11"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="btn-accent shrink-0 px-8 py-3.5 rounded-xl sm:rounded-full"
                                >
                                    Search
                                </button>
                            </div>
                        </form>

                        {/* trust line */}
                        <p className="mt-6 text-[13px] text-ink-3 flex items-center gap-2">
                            <MapPin size={15} className="text-accent" />
                            Serving every district across Tamil Nadu
                        </p>
                    </div>

                    {/* Right: stat panel (no invented metrics — labelled, brand-honest) */}
                    <div className="lg:col-span-5">
                        <div className="bg-ink text-paper rounded-3xl p-8 md:p-10 relative overflow-hidden">
                            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-accent/20 blur-2xl" />
                            <p className="eyebrow text-paper/60 mb-8 relative">Why Vanigan</p>
                            <ul className="space-y-6 relative">
                                {[
                                    { t: 'Verified listings', d: 'Businesses reviewed before they go live.' },
                                    { t: 'Search by service', d: 'Filter by category, district and assembly.' },
                                    { t: 'Free to list', d: 'Local businesses join at no cost.' },
                                ].map((item) => (
                                    <li key={item.t} className="flex gap-4">
                                        <span className="mt-1.5 w-2 h-2 rounded-full bg-accent shrink-0" />
                                        <div>
                                            <p className="font-display font-medium text-lg leading-tight" style={{ fontFamily: 'var(--font-display)' }}>{item.t}</p>
                                            <p className="text-paper/60 text-sm mt-1">{item.d}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="rule" />
        </section>
    );
};

export default HeroSection;
