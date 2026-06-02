import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, ChevronDown, LayoutGrid, Plus } from 'lucide-react';
import { businessService } from '../services/api';

const Navbar = () => {
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

    const linkBase = "text-[13px] font-medium tracking-tight transition-colors whitespace-nowrap";
    const linkRest = "text-ink-2 hover:text-ink";
    const linkActive = "text-accent";

    return (
        <nav className="fixed top-0 left-0 right-0 z-2000 border-b border-line bg-paper/85 backdrop-blur-md">
            <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-12">
                <div className="flex justify-between h-[72px] items-center gap-6">
                    {/* Logo */}
                    <Link to="/" className="shrink-0 flex items-center gap-3 group min-w-0">
                        <img
                            src="https://vanigan.org/front/images/home/tnvslogo.png"
                            alt="Vanigan Logo"
                            className="h-9 w-auto md:h-10 transition-transform group-hover:scale-105"
                        />
                        <span className="text-xl md:text-2xl font-display font-medium text-ink tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                            Vanigan
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center gap-7 xl:gap-9">
                        <NavLink to="/" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkRest}`}>Home</NavLink>

                        {/* Categories Dropdown */}
                        <div className="relative" onMouseEnter={() => setShowCategories(true)} onMouseLeave={() => setShowCategories(false)}>
                            <button className={`flex items-center gap-1.5 ${linkBase} ${showCategories ? linkActive : linkRest}`}>
                                Categories <ChevronDown size={14} className={`transition-transform duration-300 ${showCategories ? 'rotate-180' : ''}`} />
                            </button>

                            {showCategories && (
                                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4 w-[820px] animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="bg-paper rounded-2xl shadow-[0_24px_60px_-20px_rgba(26,22,19,0.25)] border border-line overflow-hidden">
                                        <div className="px-8 py-6 bg-paper-2 border-b border-line flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-ink rounded-xl flex items-center justify-center text-paper">
                                                    <LayoutGrid size={18} />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-semibold text-ink tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Directory categories</h4>
                                                    <p className="text-[11px] text-ink-3 mt-0.5">Browse verified local businesses</p>
                                                </div>
                                            </div>
                                            <span className="text-[11px] font-medium text-ink-2 bg-paper px-3 py-1.5 rounded-full border border-line whitespace-nowrap">
                                                {categories.length} categories
                                            </span>
                                        </div>

                                        <div className="p-6 grid grid-cols-3 gap-x-8 gap-y-1 max-h-[440px] overflow-y-auto custom-scrollbar">
                                            {categories.map((cat) => (
                                                <Link
                                                    key={cat}
                                                    to={`/business-list?category=${encodeURIComponent(cat)}`}
                                                    onClick={() => setShowCategories(false)}
                                                    className="flex items-center justify-between group py-2 border-b border-line/60"
                                                >
                                                    <span className="text-[13px] text-ink-2 group-hover:text-accent transition-colors">{cat}</span>
                                                    <span className="text-[11px] font-medium text-ink-3 tabular-nums opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {new Intl.NumberFormat('en-IN').format(stats.categories[cat] || 0)}
                                                    </span>
                                                </Link>
                                            ))}
                                        </div>
                                        <div className="px-8 py-5 bg-paper-2 text-center border-t border-line">
                                            <Link
                                                to="/business-list?category=All%20Categories"
                                                onClick={() => {
                                                    setShowCategories(false);
                                                    if (window.location.pathname === '/business-list') {
                                                        window.location.href = '/business-list?category=All%20Categories';
                                                    }
                                                }}
                                                className="text-[13px] font-medium text-ink hover:text-accent transition-colors inline-flex items-center justify-center gap-2 group/btn"
                                            >
                                                <span>View all listings</span>
                                                <span className="transition-transform group-hover/btn:translate-x-1">&rarr;</span>
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
                                className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkRest}`}
                            >
                                {link.name}
                            </NavLink>
                        ))}
                        <NavLink to="/my-business" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkRest}`}>My Business</NavLink>
                        <NavLink to="/contact" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkRest}`}>Contact</NavLink>

                        <Link to="/add-business" className="shrink-0">
                            <button className="bg-ink text-paper px-5 py-2.5 rounded-full text-[13px] font-semibold transition-all hover:bg-accent active:translate-y-px flex items-center gap-1.5 whitespace-nowrap">
                                <Plus size={15} /> Register Business
                            </button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-ink p-1" aria-label="Toggle menu">
                            {isOpen ? <X size={26} /> : <Menu size={26} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Panel */}
            {isOpen && (
                <div className="lg:hidden border-b border-line bg-paper animate-in slide-in-from-top-4 duration-300">
                    <div className="px-5 pt-2 pb-8 space-y-1 max-h-[80vh] overflow-y-auto">
                        <NavLink to="/" onClick={() => setIsOpen(false)} className={({ isActive }) => `block px-4 py-3.5 text-sm font-medium rounded-xl ${isActive ? 'bg-accent-soft text-accent' : 'text-ink-2'}`}>Home</NavLink>

                        <div className="px-4 py-4">
                            <p className="eyebrow mb-3">Categories</p>
                            <div className="grid grid-cols-1 gap-1">
                                {categories.slice(0, 8).map(cat => (
                                    <Link key={cat} to={`/business-list?category=${encodeURIComponent(cat)}`} onClick={() => setIsOpen(false)} className="text-[13px] text-ink-2 py-1.5">{cat}</Link>
                                ))}
                                <Link to="/business-list" onClick={() => setIsOpen(false)} className="text-[13px] font-medium text-accent py-1.5">View all categories &rarr;</Link>
                            </div>
                        </div>

                        {navLinks.filter(l => l.name !== 'Home').map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) => `block px-4 py-3.5 text-sm font-medium rounded-xl transition-all ${isActive ? 'bg-accent-soft text-accent' : 'text-ink-2 hover:bg-paper-2'}`}
                            >
                                {link.name}
                            </NavLink>
                        ))}
                        <NavLink to="/my-business" onClick={() => setIsOpen(false)} className={({ isActive }) => `block px-4 py-3.5 text-sm font-medium rounded-xl transition-all ${isActive ? 'bg-accent-soft text-accent' : 'text-ink-2 hover:bg-paper-2'}`}>My Business</NavLink>
                        <NavLink to="/contact" onClick={() => setIsOpen(false)} className={({ isActive }) => `block px-4 py-3.5 text-sm font-medium rounded-xl transition-all ${isActive ? 'bg-accent-soft text-accent' : 'text-ink-2 hover:bg-paper-2'}`}>Contact</NavLink>
                        <Link to="/add-business" onClick={() => setIsOpen(false)} className="block pt-4">
                            <button className="w-full bg-ink text-paper py-3.5 rounded-full text-[13px] font-semibold">
                                Register Business
                            </button>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
