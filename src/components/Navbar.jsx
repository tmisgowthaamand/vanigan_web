import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        {
            title: 'Business List',
            path: '/business-list',
            submenu: [
                { name: 'Search Directory', path: '/business-list' },
                { name: 'Verified Traders', path: '/business-list' },
                { name: 'Local Shops', path: '/business-list' }
            ]
        },
        {
            title: 'My Business',
            path: '/my-business',
            submenu: [
                { name: 'Dashboard', path: '/my-business' },
                { name: 'Add Listing', path: '/add-business' },
                { name: 'Manage Results', path: '/my-business' }
            ]
        },
        {
            title: 'Community',
            path: '/joining',
            submenu: [
                { name: 'Trader Network', path: '/joining' },
                { name: 'Trade Events', path: '/events' },
                { name: 'Join with us', path: '/add-business' }
            ]
        },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-lacquer-deep/95 backdrop-blur-xl border-b border-rule' : 'bg-lacquer border-b border-transparent'}`}
            style={{ fontFamily: 'var(--ks-font-body)' }}
        >
            <div className="max-w-[1320px] mx-auto px-6 h-[72px] flex items-center justify-between">

                {/* Left: Logo + Nav */}
                <div className="flex items-center gap-10">
                    <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
                        <img
                            src="https://vanigan.org/front/images/home/tnvslogo.png"
                            alt="Vanigan"
                            className="h-9 w-auto"
                        />
                        <span
                            className="text-[20px] text-champagne uppercase"
                            style={{ fontFamily: 'var(--ks-font-wordmark)', fontWeight: 500, letterSpacing: '0.12em' }}
                        >
                            Vanigan<span className="text-kinpaku">.org</span>
                        </span>
                    </Link>

                    <div className="hidden lg:flex items-center gap-7">
                        {navLinks.map((link) => (
                            <div key={link.title} className="relative group">
                                <Link
                                    to={link.path}
                                    className="text-[14px] font-medium text-muted hover:text-kinpaku transition-colors flex items-center gap-1"
                                >
                                    {link.title}
                                    <ChevronDown size={14} className="text-faint group-hover:text-kinpaku group-hover:rotate-180 transition-all duration-200" />
                                </Link>
                                <div className="absolute top-full left-0 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                    <div className="bg-raised border border-rule shadow-[0_24px_70px_rgba(2,2,1,0.5)] rounded-lg py-2 w-48">
                                        {link.submenu.map(item => (
                                            <Link
                                                key={item.name}
                                                to={item.path}
                                                className="block px-4 py-2.5 text-[13.5px] font-medium text-muted hover:text-kinpaku hover:bg-graphite transition-all"
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-5">
                    <div className="hidden md:flex items-center gap-5">
                        <button className="w-10 h-10 rounded-full bg-graphite border border-rule flex items-center justify-center text-muted hover:text-kinpaku hover:border-rule-strong transition-colors">
                            <Search size={18} strokeWidth={2} />
                        </button>
                        <Link to="/add-business" className="text-[13.5px] font-medium text-muted hover:text-kinpaku transition-colors whitespace-nowrap">
                            Add Business
                        </Link>
                        <Link to="/login" className="text-[13.5px] font-medium text-muted hover:text-kinpaku transition-colors">
                            Login
                        </Link>
                    </div>

                    <button
                        onClick={() => navigate('/add-business')}
                        className="ks-button ks-button-primary min-h-10! px-6! text-[13.5px]! whitespace-nowrap"
                    >
                        Join for free
                    </button>

                    <button
                        className="lg:hidden text-champagne ml-1"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="lg:hidden bg-lacquer-deep border-t border-rule"
                    >
                        <div className="p-6 flex flex-col gap-5">
                            {navLinks.map((link) => (
                                <div key={link.title}>
                                    <Link
                                        to={link.path}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="text-[17px] font-semibold text-champagne block mb-2"
                                    >
                                        {link.title}
                                    </Link>
                                    <div className="pl-4 flex flex-col gap-1 border-l border-rule">
                                        {link.submenu.map(item => (
                                            <Link
                                                key={item.name}
                                                to={item.path}
                                                onClick={() => setIsMenuOpen(false)}
                                                className="text-[14px] text-muted font-medium py-1"
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            <div className="pt-4 mt-2 border-t border-rule flex flex-col gap-3">
                                <Link to="/login" className="text-[16px] font-semibold text-champagne">Login</Link>
                                <button
                                    onClick={() => { navigate('/add-business'); setIsMenuOpen(false); }}
                                    className="ks-button ks-button-primary w-full"
                                >
                                    Join for free
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
