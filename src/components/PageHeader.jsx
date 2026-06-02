import React from 'react';
import { Sparkles } from 'lucide-react';

const PageHeader = ({ title, subtitle }) => {
    return (
        <section className="relative pt-36 pb-16 bg-lacquer overflow-hidden border-b border-rule" style={{ fontFamily: 'var(--ks-font-body)' }}>
            {/* Calibration grid — functional structure, not decoration */}
            <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(232,119,34,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(232,119,34,0.04)_1px,transparent_1px)] bg-size-[48px_48px] mask-[radial-gradient(ellipse_at_center,black_30%,transparent_75%)] pointer-events-none" />

            <div className="max-w-[1320px] mx-auto px-6 relative z-10 text-center">
                <span className="inline-flex items-center gap-2 border border-rule-strong px-4 py-2 rounded-[3px] mb-7">
                    <Sparkles size={14} className="text-kinpaku" />
                    <span className="ks-mono text-[11px] text-kinpaku">Premium Portal</span>
                </span>

                <h1 className="ks-display text-[44px] md:text-[64px] leading-[1.04] mb-6 max-w-3xl mx-auto" style={{ fontWeight: 400 }}>
                    {title}
                </h1>

                {subtitle && (
                    <p className="max-w-2xl mx-auto text-[17px] text-muted font-normal leading-[1.7]">
                        {subtitle}
                    </p>
                )}
            </div>
        </section>
    );
};

export default PageHeader;
