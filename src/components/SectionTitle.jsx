import React from 'react';

const SectionTitle = ({ title }) => {
    return (
        <div className="mb-12">
            <h2 className="ks-display text-4xl md:text-5xl text-champagne" style={{ fontWeight: 600 }}>{title}</h2>
            <div className="mt-5 h-px w-16 bg-kinpaku" />
        </div>
    );
};

export default SectionTitle;
