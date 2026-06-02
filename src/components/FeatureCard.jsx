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
                "p-8 bg-raised border border-rule rounded-[6px] group transition-all duration-500 hover:border-rule-strong",
                className
            )}
        >
            <div className="w-14 h-14 rounded-[6px] border border-rule flex items-center justify-center mb-8 text-kinpaku group-hover:border-rule-strong transition-all duration-500">
                <Icon size={28} />
            </div>
            <h3 className="text-xl font-semibold text-champagne mb-4 group-hover:text-kinpaku transition-colors">
                {title}
            </h3>
            <p className="text-muted leading-relaxed text-sm">
                {description}
            </p>
        </motion.div>
    );
};

export default FeatureCard;
