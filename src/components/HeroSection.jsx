import React from 'react';
import { Search } from 'lucide-react';

const HeroSection = () => {
    return (
        <section className="relative w-full min-h-[70vh] md:min-h-[85vh] flex flex-col items-center justify-center overflow-hidden">
            {/* Background Image - Using a more robust background handling */}
            <div
                className="absolute inset-0 z-0 bg-[#0F172A]"
                style={{
                    backgroundImage: 'url("/top_banner.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            />

            {/* Overlay Gradient for better readability */}
            <div className="absolute inset-0 z-[1] bg-black/30" />

            {/* Content Container */}
            <div className="container-custom relative z-10 text-center text-white px-4 py-20 flex flex-col items-center justify-center min-h-[inherit]">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Top Tagline */}
                    <p className="text-primary text-xs md:text-sm font-black uppercase tracking-[0.3em] mb-2 drop-shadow-lg">
                        12,000+ Businesses Listed
                    </p>

                    {/* Main Title - Adjusted size and weight for zoom stability */}
                    <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-[1.1] drop-shadow-2xl">
                        Discover <span className="text-primary italic">Trusted</span><br />
                        <span className="italic">Businesses</span> Near You
                    </h1>

                    {/* Subtitle - More compact on mobile */}
                    <p className="max-w-2xl mx-auto text-slate-200 text-xs md:text-lg font-bold leading-relaxed drop-shadow-lg mb-12">
                        Tamil Nadu's most complete business directory — find the best services, vendors, and professionals in seconds.
                    </p>

                    {/* Highly Responsive Search Bar */}
                    <div className="w-full max-w-3xl mx-auto relative group px-2 sm:px-0">
                        <div className="absolute -inset-1 bg-primary/20 blur-2xl group-hover:bg-primary/30 transition-all rounded-full" />
                        <div className="relative bg-white rounded-2xl sm:rounded-full p-2 flex flex-col sm:flex-row items-center shadow-2xl transition-transform hover:scale-[1.01]">
                            <div className="w-full flex-1 flex items-center px-6 py-2 sm:py-0">
                                <Search className="text-slate-400 mr-4 shrink-0" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search name, service or keyword..."
                                    className="w-full bg-transparent border-none focus:outline-none text-slate-800 font-bold text-sm md:text-base placeholder:text-slate-400 h-10 md:h-12"
                                />
                            </div>
                            <button className="w-full sm:w-auto bg-[#FF3D4D] text-white px-10 py-4 rounded-xl sm:rounded-full font-black text-sm md:text-base shadow-xl hover:bg-[#E63946] active:scale-95 transition-all">
                                Search Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
