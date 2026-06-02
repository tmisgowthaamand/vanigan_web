import { MapPin, Phone, LayoutGrid, ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const BusinessCard = ({ business }) => {
    const id = business._id || business.id;
    const {
        name,
        category,
        avgRating,
        address,
        phone,
        district,
        assembly,
        image,
        verified = true
    } = business;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-[#1C1813] border border-[var(--ks-rule)] rounded-[6px] overflow-hidden hover:border-[var(--ks-rule-strong)] hover:-translate-y-1 transition-all duration-500 group flex flex-col h-full"
        >
            {/* Image */}
            <div className="h-56 bg-[#0C0A07] flex items-center justify-center relative overflow-hidden">
                {image ? (
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-16 h-16 rounded-[6px] flex items-center justify-center border border-[var(--ks-rule)] text-[#E87722]/50 group-hover:text-[#E87722] transition-colors duration-500">
                        <LayoutGrid size={32} strokeWidth={1.5} />
                    </div>
                )}

                <div className="absolute top-4 left-4 flex gap-2">
                    {verified && (
                        <div className="ks-badge is-improved !bg-[#0C0A07]/80 backdrop-blur-md">
                            <CheckCircle size={12} /> Verified
                        </div>
                    )}
                </div>

                {avgRating > 0 && (
                    <div className="absolute top-4 right-4 bg-[#0C0A07]/85 backdrop-blur-md px-3 py-1.5 rounded-[4px] flex items-center gap-1.5 border border-[var(--ks-rule)]">
                        <span className="text-[#E87722] text-[13px]">★</span>
                        <span className="text-[12px] font-bold text-[var(--ks-champagne)]">{avgRating.toFixed(1)}</span>
                    </div>
                )}
            </div>

            <div className="p-6 flex-1 flex flex-col relative">
                <div className="mb-4 relative z-10">
                    <p className="ks-mono text-[11px] text-[#E87722] mb-2">
                        {category}
                    </p>
                    <h3 className="text-[19px] font-semibold text-[var(--ks-champagne)] leading-tight line-clamp-2 group-hover:text-[#E87722] transition-colors">
                        {name}
                    </h3>
                </div>

                <div className="space-y-3 mb-6 relative z-10">
                    {(address || district) && (
                        <div className="flex items-start gap-3 text-[var(--ks-text-muted)]">
                            <MapPin size={16} className="text-[var(--ks-text-faint)] mt-0.5 shrink-0 group-hover:text-[#E87722]/70 transition-colors" />
                            <p className="text-[13.5px] font-medium leading-relaxed line-clamp-2">
                                {[...new Set([assembly || address, district])].filter(Boolean).join(', ')}
                            </p>
                        </div>
                    )}
                    {phone && (
                        <div className="flex items-center gap-3 text-[var(--ks-text-muted)]">
                            <Phone size={16} className="text-[var(--ks-text-faint)] shrink-0 group-hover:text-[#E87722]/70 transition-colors" />
                            <p className="text-[13.5px] font-bold tracking-wide">{phone}</p>
                        </div>
                    )}
                </div>

                <div className="pt-5 border-t border-[var(--ks-rule)] mt-auto relative z-10">
                    <Link
                        to={`/business/${id}`}
                        className="w-full bg-transparent border border-[var(--ks-rule-strong)] text-[#E87722] px-6 py-3 rounded-[4px] text-[13px] font-semibold flex items-center justify-center gap-2 group-hover:bg-[#E87722] group-hover:text-[#0C0A07] group-hover:border-[#E87722] transition-all duration-300"
                    >
                        View Profile <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default BusinessCard;
