import React from 'react';

const PageHeader = ({ title, subtitle }) => {
    return (
        <section className="relative pt-40 pb-20 bg-white overflow-hidden border-b border-slate-100">
            {/* Background Image/Pattern from original design */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: 'url("/top_banner.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }} />

            <div className="container-custom relative z-10 text-center">
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-slate-900 mb-6 tracking-tighter uppercase">
                    {title.split(' ').map((word, i) => i === title.split(' ').length - 1 ? <span key={i} className="text-rose-600">{word}</span> : word + ' ')}
                </h1>
                {subtitle && (
                    <p className="max-w-2xl mx-auto text-slate-500 text-lg font-bold uppercase tracking-widest text-[11px]">
                        {subtitle}
                    </p>
                )}
            </div>
        </section>
    );
};

export default PageHeader;
