import React from 'react';

const SectionTitle = ({ title }) => {
    return (
        <div className="mb-12">
            <h2 className="ks-display text-4xl md:text-5xl text-champagne" style={{ fontWeight: 600 }}>{title}</h2>
            <div className="w-16 h-px bg-kinpaku mt-5" />
        </div>
    );
};

export default SectionTitle;
