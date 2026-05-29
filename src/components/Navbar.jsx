import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, ChevronDown, LayoutGrid, Plus, User, Phone, Smartphone } from 'lucide-react';
import { businessService } from '../services/api';

const Navbar = ({ dark = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showCategories, setShowCategories] = useState(false);
    const [stats, setStats] = useState({ total: 18424, categories: {} });

    const categories = [
        "Advertising", "Advocate & Legal", "Agriculture", "Automobile", "B2B Services",
        "Banking & Finance", "Banquets & Event Halls", "Bills & Recharge", "Caterers",
        "Civil Contractors", "Construction Materials", "Courier Services", "Daily Needs",
        "Digital & IT Products", "Doctors", "Education", "Electricals & Electronics",
        "Hire Services", "Home Appliances", "Hospitals & Clinics", "Hotels & Restaurants",
        "IT & Software", "Insurance", "Jewellery", "Jobs", "Labs & Diagnostics",
        "Organic Products", "Packers & Movers", "Pest Control", "Printing Services",
        "Real Estate", "Religious", "Repairs", "Spa & Beauty", "Sports",
        "Textiles & Garments", "Transport", "Travel & Tourism", "Wedding Services"
    ];

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await businessService.getStats();
                setStats(data);
            } catch (err) {
                console.error("Stats fetch error:", err);
            }
        };
        fetchStats();
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Business List', path: '/business-list' },
    ];

    const navBg = 'bg-white/90 backdrop-blur-md shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border-slate-100';
    const textColor = 'text-slate-700';
    const activeTextColor = 'text-rose-600';

    return (
        <nav className={`fixed top-0 left-0 right-0 z-[2000] border-b transition-all duration-300 ${navBg}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0 flex items-center gap-4 group">
                        <img
                            src="https://vanigan.org/front/images/home/tnvslogo.png"
                            alt="Vanigan Logo"
                            className="h-10 w-auto md:h-12 transition-all group-hover:scale-105"
                        />
                        <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase group-hover:text-rose-600 transition-colors">Vanigan</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center gap-6 xl:gap-10 ml-8">
                        <NavLink to="/" className={({ isActive }) => `text-[13px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${isActive ? activeTextColor : `${textColor} hover:text-rose-600`}`}>Home</NavLink>

                        {/* Categories Dropdown */}
                        <div className="relative" onMouseEnter={() => setShowCategories(true)} onMouseLeave={() => setShowCategories(false)}>
                            <button className={`flex items-center gap-2 text-[13px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${showCategories ? 'text-rose-600' : textColor} hover:text-rose-600`}>
                                Categories <ChevronDown size={14} className={`transition-transform duration-300 ${showCategories ? 'rotate-180' : ''}`} />
                            </button>

                            {showCategories && (
                                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4 w-[850px] animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="bg-white rounded-[2.5rem] shadow-[0_30px_80px_-15px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden">
                                        <div className="p-8 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-rose-600/20">
                                                    <LayoutGrid size={20} />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Premium Directory</h4>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Discover verified local businesses</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl border border-slate-100 shadow-sm">
                                                <LayoutGrid size={16} className="text-rose-600" />
                                                <span className="text-xs font-black text-rose-600 tracking-widest">{categories.length} CATEGORIES FOUND</span>
                                            </div>
                                        </div>

                                        <div className="p-8 grid grid-cols-3 gap-x-12 gap-y-4 max-h-[480px] overflow-y-auto custom-scrollbar">
                                            {categories.map((cat) => (
                                                <Link
                                                    key={cat}
                                                    to={`/business-list?category=${encodeURIComponent(cat)}`}
                                                    onClick={() => setShowCategories(false)}
                                                    className="flex items-center justify-between group py-1.5 transition-all"
                                                >
                                                    <span className="text-[11px] font-bold text-slate-600 group-hover:text-rose-600 transition-colors uppercase tracking-wider">{cat}</span>
                                                    <span className="text-[10px] font-black bg-rose-600 text-white min-w-[24px] h-[20px] px-1.5 rounded-lg flex items-center justify-center shadow-lg shadow-rose-600/20 transition-all opacity-0 group-hover:opacity-100 group-hover:scale-110">
                                                        {new Intl.NumberFormat('en-IN').format(stats.categories[cat] || 0)}
                                                    </span>
                                                </Link>
                                            ))}
                                        </div>
                                        <div className="p-8 bg-slate-50/50 text-center border-t border-slate-100">
                                            <Link
                                                to="/business-list?category=All%20Categories"
                                                onClick={() => {
                                                    setShowCategories(false);
                                                    if (window.location.pathname === '/business-list') {
                                                        window.location.href = '/business-list?category=All%20Categories';
                                                    }
                                                }}
                                                className="text-[12px] font-black text-rose-600 uppercase tracking-[0.3em] hover:tracking-[0.4em] transition-all flex items-center justify-center gap-4 group/btn"
                                            >
                                                <span>VIEW ALL PREMIUM LISTINGS</span>
                                                <span className="text-xl transition-transform group-hover/btn:translate-x-2">→</span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {navLinks.filter(l => l.name !== 'Home').map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className={({ isActive }) =>
                                    `text-[13px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${isActive ? activeTextColor : `${textColor} hover:text-rose-600`}`
                                }
                            >
                                {link.name}
                            </NavLink>
                        ))}
                        <NavLink to="/my-business" className={({ isActive }) => `text-[13px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${isActive ? activeTextColor : `${textColor} hover:text-rose-600`}`}>My Business</NavLink>
                        <NavLink to="/contact" className={({ isActive }) => `text-[13px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${isActive ? activeTextColor : `${textColor} hover:text-rose-600`}`}>Contact</NavLink>

                        <a
                            href="https://play.google.com/store/apps/details?id=io.vanigan.ai&pcampaignid=web_share"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-rose-600 transition-all shadow-lg active:scale-95 group"
                        >
                            <Smartphone size={16} className="group-hover:rotate-12 transition-transform" />
                            Download App
                        </a>

                        <Link to="/add-business" className="shrink-0">
                            <button className="bg-rose-600 text-white px-8 py-3 rounded-2xl text-[13px] font-black uppercase tracking-widest shadow-xl shadow-rose-600/20 hover:bg-rose-500 hover:shadow-rose-600/30 transition-all active:scale-95 flex items-center gap-2 whitespace-nowrap">
                                <Plus size={16} /> Register Business
                            </button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} className={dark ? 'text-white' : 'text-slate-900'}>
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Panel */}
            {isOpen && (
                <div className={`lg:hidden border-b animate-in slide-in-from-top-4 duration-300 ${dark ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-100'}`}>
                    <div className="px-6 pt-2 pb-8 space-y-2 max-h-[80vh] overflow-y-auto">
                        <NavLink to="/" onClick={() => setIsOpen(false)} className={({ isActive }) => `block px-4 py-4 text-sm font-black uppercase tracking-widest rounded-2xl ${isActive ? 'bg-rose-50 text-rose-600' : `${textColor}`}`}>Home</NavLink>

                        <div className="px-4 py-4">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Categories</p>
                            <div className="grid grid-cols-1 gap-2">
                                {categories.slice(0, 8).map(cat => (
                                    <Link key={cat} to={`/business-list?category=${encodeURIComponent(cat)}`} onClick={() => setIsOpen(false)} className="text-[11px] font-bold text-slate-600 py-1 uppercase">{cat}</Link>
                                ))}
                                <Link to="/business-list" onClick={() => setIsOpen(false)} className="text-[11px] font-black text-rose-600 py-1 uppercase underline decoration-rose-200">View All Categories</Link>
                            </div>
                        </div>

                        {navLinks.filter(l => l.name !== 'Home').map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) =>
                                    `block px-4 py-4 text-sm font-black uppercase tracking-widest rounded-2xl transition-all ${isActive ? 'bg-rose-50 text-rose-600' : `${textColor} hover:bg-slate-50`}`
                                }
                            >
                                {link.name}
                            </NavLink>
                        ))}
                        <Link to="/add-business" className="block pt-4">
                            <button className="w-full bg-rose-600 text-white py-4 rounded-2xl text-[13px] font-black uppercase tracking-wider shadow-lg">
                                List Your Business
                            </button>
                        </Link>
                    </div>
                </div>
            )}
            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
            `}} />
        </nav>
    );
};

export default Navbar;
