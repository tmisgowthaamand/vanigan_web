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
            className="bg-raised border border-rule rounded-[6px] overflow-hidden hover:border-rule-strong hover:-translate-y-1 transition-all duration-500 group flex flex-col h-full"
        >
            {/* Image */}
            <div className="h-56 bg-lacquer-deep flex items-center justify-center relative overflow-hidden">
                {image ? (
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-16 h-16 rounded-[6px] flex items-center justify-center border border-rule text-kinpaku/50 group-hover:text-kinpaku transition-colors duration-500">
                        <LayoutGrid size={32} strokeWidth={1.5} />
                    </div>
                )}

                <div className="absolute top-4 left-4 flex gap-2">
                    {verified && (
                        <div className="ks-badge is-improved bg-lacquer-deep/80! backdrop-blur-md">
                            <CheckCircle size={12} /> Verified
                        </div>
                    )}
                </div>

                {avgRating > 0 && (
                    <div className="absolute top-4 right-4 bg-lacquer-deep/85 backdrop-blur-md px-3 py-1.5 rounded-[4px] flex items-center gap-1.5 border border-rule">
                        <span className="text-kinpaku text-[13px]">★</span>
                        <span className="text-[12px] font-bold text-champagne">{avgRating.toFixed(1)}</span>
                    </div>
                )}
            </div>

            <div className="p-6 flex-1 flex flex-col relative">
                <div className="mb-4 relative z-10">
                    <p className="ks-mono text-[11px] text-kinpaku mb-2">
                        {category}
                    </p>
                    <h3 className="text-[19px] font-semibold text-champagne leading-tight line-clamp-2 group-hover:text-kinpaku transition-colors">
                        {name}
                    </h3>
                </div>

                <div className="space-y-3 mb-6 relative z-10">
                    {(address || district) && (
                        <div className="flex items-start gap-3 text-muted">
                            <MapPin size={16} className="text-faint mt-0.5 shrink-0 group-hover:text-kinpaku/70 transition-colors" />
                            <p className="text-[13.5px] font-medium leading-relaxed line-clamp-2">
                                {[...new Set([assembly || address, district])].filter(Boolean).join(', ')}
                            </p>
                        </div>
                    )}
                    {phone && (
                        <div className="flex items-center gap-3 text-muted">
                            <Phone size={16} className="text-faint shrink-0 group-hover:text-kinpaku/70 transition-colors" />
                            <p className="text-[13.5px] font-bold tracking-wide">{phone}</p>
                        </div>
                    )}
                </div>

                <div className="pt-5 border-t border-rule mt-auto relative z-10">
                    <Link
                        to={`/business/${id}`}
                        className="w-full bg-transparent border border-rule-strong text-kinpaku px-6 py-3 rounded-[4px] text-[13px] font-semibold flex items-center justify-center gap-2 group-hover:bg-kinpaku group-hover:text-lacquer-deep group-hover:border-kinpaku transition-all duration-300"
                    >
                        View Profile <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default BusinessCard;
