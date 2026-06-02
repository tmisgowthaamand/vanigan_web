import React from 'react';
import { MapPin, Phone, LayoutGrid, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const BusinessCard = ({ business }) => {
    // Handling real API fields
    const id = business._id || business.id;
    const {
        name,
        category,
        subCategory,
        avgRating,
        address,
        phone,
        district,
        assembly,
        image
    } = business;

    return (
        <Link
            to={`/business/${id}`}
            className="group bg-paper rounded-2xl border border-line overflow-hidden hover:border-line-strong transition-all flex flex-col h-full hover:shadow-[0_18px_40px_-22px_rgba(26,22,19,0.3)]"
        >
            {/* Image */}
            <div className="h-48 bg-paper-2 flex items-center justify-center border-b border-line relative overflow-hidden">
                {image ? (
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-ink-3">
                        <LayoutGrid size={28} strokeWidth={1.5} />
                    </div>
                )}
                {avgRating > 0 && (
                    <div className="absolute top-3 right-3 bg-paper/95 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 border border-line">
                        <span className="text-rating text-xs">★</span>
                        <span className="text-[11px] font-semibold text-ink tabular-nums">{avgRating.toFixed(1)}</span>
                    </div>
                )}
            </div>

            <div className="p-6 flex-1 flex flex-col">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-accent mb-2">
                    {category}{subCategory && ` · ${subCategory}`}
                </p>
                <h3 className="text-xl font-medium text-ink group-hover:text-accent transition-colors mb-4 line-clamp-2 leading-snug" style={{ fontFamily: 'var(--font-display)' }}>
                    {name}
                </h3>

                <div className="space-y-2.5 mb-6 mt-auto">
                    {(address || district) && (
                        <div className="flex items-start gap-2.5 text-ink-2">
                            <MapPin size={15} className="text-ink-3 mt-0.5 shrink-0" />
                            <p className="text-[13px] leading-snug line-clamp-1">
                                {[...new Set([assembly || address, district])].filter(Boolean).join(', ')}
                            </p>
                        </div>
                    )}
                    {phone && (
                        <div className="flex items-center gap-2.5 text-ink-2">
                            <Phone size={15} className="text-ink-3 shrink-0" />
                            <p className="text-[13px] tabular-nums">{phone}</p>
                        </div>
                    )}
                </div>

                <div className="pt-4 border-t border-line flex items-center justify-between">
                    <span className="text-[13px] font-medium text-ink group-hover:text-accent transition-colors">View profile</span>
                    <ArrowUpRight size={18} className="text-ink-3 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
            </div>
        </Link>
    );
};

export default BusinessCard;
