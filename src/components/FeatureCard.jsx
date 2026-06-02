import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

const FeatureCard = ({ icon: Icon, title, description, className, delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className={cn(
                "p-8 bg-[#1C1813] border border-(--ks-rule) rounded-[6px] group hover:border-(--ks-rule-strong) transition-all duration-500",
                className
            )}
        >
            <div className="w-14 h-14 rounded-[6px] border border-(--ks-rule) flex items-center justify-center mb-8 text-[#E87722] group-hover:border-(--ks-rule-strong) transition-all duration-500">
                <Icon size={28} />
            </div>
            <h3 className="text-xl font-semibold text-(--ks-champagne) mb-4 group-hover:text-[#E87722] transition-colors">
                {title}
            </h3>
            <p className="text-(--ks-text-muted) leading-relaxed text-sm">
                {description}
            </p>
        </motion.div>
    );
};

export default FeatureCard;
