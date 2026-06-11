import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { session } from '../services/api';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [auth, setAuth] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Track the account session so the navbar shows the right actions. We poll
    // on focus + a light interval since localStorage writes in the same tab
    // don't fire the 'storage' event.
    useEffect(() => {
        const read = () => setAuth(session.get());
        read();
        window.addEventListener('focus', read);
        const id = setInterval(read, 1000);
        return () => { window.removeEventListener('focus', read); clearInterval(id); };
    }, []);

    const handleLogout = () => {
        session.clear();
        setAuth(null);
        setIsMenuOpen(false);
        navigate('/login');
    };

    const isLoggedIn = !!auth?.user;

    const navLinks = [
        {
            title: 'Categories',
            path: '/categories',
            submenu: [
                { name: 'All Categories', path: '/categories' },
                { name: 'Browse Directory', path: '/business-list' },
                { name: 'Verified Traders', path: '/business-list' }
            ]
        },
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
            className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${scrolled ? 'bg-lacquer-deep/95 backdrop-blur-xl border-b border-rule' : 'bg-lacquer border-b border-transparent'}`}
            style={{ fontFamily: 'var(--ks-font-body)' }}
        >
            <div className="max-w-[1320px] mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between gap-2">

                {/* Left: Logo + Nav */}
                <div className="flex items-center gap-10 min-w-0">
                    <Link to="/" className="flex items-center gap-2 sm:gap-2.5 shrink-0 group">
                        <img
                            src="/tnvslogo.png"
                            alt="Vanigan"
                            className="h-10 sm:h-11 w-auto"
                        />
                        <span
                            className="text-[16px] sm:text-[20px] text-champagne uppercase whitespace-nowrap"
                            style={{ fontFamily: 'var(--ks-font-wordmark)', fontWeight: 500, letterSpacing: '0.1em' }}
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
                <div className="flex items-center gap-3 sm:gap-5 shrink-0">
                    <div className="hidden lg:flex items-center gap-5">
                        {isLoggedIn ? (
                            <>
                                <Link to="/my-business" className="text-[13.5px] font-medium text-muted hover:text-kinpaku transition-colors whitespace-nowrap">
                                    My Business
                                </Link>
                                <button onClick={handleLogout} className="text-[13.5px] font-medium text-muted hover:text-kinpaku transition-colors">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/add-business" className="text-[13.5px] font-medium text-muted hover:text-kinpaku transition-colors whitespace-nowrap">
                                    Add Business
                                </Link>
                                <Link to="/login" className="text-[13.5px] font-medium text-muted hover:text-kinpaku transition-colors">
                                    Login
                                </Link>
                            </>
                        )}
                    </div>

                    <button
                        onClick={() => navigate(isLoggedIn ? '/my-business' : '/signup')}
                        className="hidden lg:inline-flex ks-button ks-button-primary min-h-10! px-6! text-[13.5px]! whitespace-nowrap"
                    >
                        {isLoggedIn ? 'My Dashboard' : 'Sign up'}
                    </button>

                    <button
                        className="lg:hidden text-champagne p-1 -mr-1"
                        aria-label="Toggle menu"
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
                        className="lg:hidden bg-lacquer-deep border-t border-rule max-h-[calc(100vh-72px)] overflow-y-auto custom-scrollbar"
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
                                {isLoggedIn ? (
                                    <>
                                        <Link to="/my-business" onClick={() => setIsMenuOpen(false)} className="text-[16px] font-semibold text-champagne">My Business</Link>
                                        <button onClick={handleLogout} className="text-[16px] font-semibold text-champagne text-left">Logout</button>
                                        <button
                                            onClick={() => { navigate('/my-business'); setIsMenuOpen(false); }}
                                            className="ks-button ks-button-primary w-full"
                                        >
                                            My Dashboard
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-[16px] font-semibold text-champagne">Login</Link>
                                        <Link to="/add-business" onClick={() => setIsMenuOpen(false)} className="text-[16px] font-semibold text-champagne">Add Business</Link>
                                        <button
                                            onClick={() => { navigate('/signup'); setIsMenuOpen(false); }}
                                            className="ks-button ks-button-primary w-full"
                                        >
                                            Sign up
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
