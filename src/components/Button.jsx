import React from 'react';
import { cn } from '../utils/cn';

const Button = ({
    children,
    className,
    variant = 'primary',
    size = 'md',
    disabled = false,
    ...props
}) => {
    const variants = {
        primary: 'ks-button ks-button-primary',
        secondary: 'ks-button ks-button-secondary',
        outline: 'ks-button ks-button-secondary',
        ghost: 'ks-button ks-button-ghost',
        danger: 'ks-button bg-[#D7563B] text-white border-[#D7563B] hover:bg-[#c14a30]',
    };

    const sizes = {
        sm: '!min-h-[40px] !px-5 !text-[13px]',
        md: '',
        lg: '!min-h-[58px] !px-10 !text-[1rem]',
    };

    return (
        <button
            disabled={disabled}
            className={cn(
                variants[variant] || variants.primary,
                sizes[size],
                disabled && 'opacity-50 cursor-not-allowed',
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
