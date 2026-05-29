import React from 'react';
import { MapPin, Phone, LayoutGrid, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const BusinessCard = ({ business }) => {
    // Handling real API fields
    const id = business._id || business.id;
    const {
        name,
        category,
        subCategory,
        avgRating,
        description,
        address,
        phone,
        email,
        district,
        assembly,
        image
    } = business;

    return (
        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-2xl transition-all group flex flex-col h-full">
            {/* Top Image Placeholder */}
            <div className="h-56 bg-slate-50 flex items-center justify-center border-b border-slate-100 relative overflow-hidden">
                {image ? (
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-300">
                        <LayoutGrid size={32} strokeWidth={1.5} />
                    </div>
                )}
                {avgRating > 0 && (
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xl border border-slate-100">
                        <span className="text-amber-500 font-bold text-xs">★</span>
                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-tighter">{avgRating.toFixed(1)}</span>
                    </div>
                )}
            </div>

            <div className="p-8 flex-1 flex flex-col">
                <div className="mb-6">
                    <h3 className="text-xl font-black text-slate-900 group-hover:text-rose-600 transition-colors mb-2 line-clamp-1 uppercase tracking-tight">
                        {name}
                    </h3>
                    <p className="text-[11px] font-black text-rose-600 uppercase tracking-[0.2em] flex items-center gap-2">
                        {category} {subCategory && `• ${subCategory}`}
                    </p>
                </div>

                <div className="space-y-4 mb-8">
                    {(address || district) && (
                        <div className="flex items-start gap-3 text-slate-400 group/item">
                            <MapPin size={16} className="text-slate-300 group-hover/item:text-rose-500 transition-colors mt-0.5" />
                            <p className="text-[12px] font-bold leading-tight line-clamp-1">
                                {[...new Set([assembly || address, district])].filter(Boolean).join(', ')}
                            </p>
                        </div>
                    )}
                    {phone && (
                        <div className="flex items-center gap-3 text-slate-400 group/item">
                            <Phone size={16} className="text-slate-300 group-hover/item:text-emerald-500 transition-colors" />
                            <p className="text-[12px] font-black tracking-widest">{phone}</p>
                        </div>
                    )}
                </div>

                <div className="pt-6 border-t border-slate-50 mt-auto">
                    <Link
                        to={`/business/${id}`}
                        className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-3 group-hover:gap-5 transition-all hover:text-rose-600"
                    >
                        View Profile <Plus size={14} className="text-rose-600" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BusinessCard;
