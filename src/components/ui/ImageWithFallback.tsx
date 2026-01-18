"use client";

import { useState } from "react";

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    fallbackSrc?: string;
}

export default function ImageWithFallback({ src, fallbackSrc, alt, ...props }: ImageWithFallbackProps) {
    const [imgSrc, setImgSrc] = useState(src);
    const [hasError, setHasError] = useState(false);

    // Default professional finance fallback if none provided
    const DEFAULT_FALLBACK = "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&h=300&fit=crop";

    return (
        <img
            {...props}
            src={hasError ? (fallbackSrc || DEFAULT_FALLBACK) : imgSrc}
            alt={alt}
            onError={() => {
                setHasError(true);
            }}
        />
    );
}
