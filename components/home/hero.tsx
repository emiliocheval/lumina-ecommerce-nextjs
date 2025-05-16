'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { urlFor } from '@/lib/sanity';

interface HeroProps {
  content: {
    title: string;
    subtitle: string;
    cta: string;
    ctaLink?: string;
    link?: string;
    image: string;
  };
}

export default function Hero({ content }: HeroProps) {
  // Support Sanity image object and field mapping
  const imageUrl = content.image && typeof content.image === 'object'
    ? urlFor(content.image).url()
    : content.image;
  const cta = content.cta;
  const ctaLink = content.ctaLink || content.link || "/products";

  return (
    <div className="relative h-[70vh] md:h-[80vh] w-full overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={imageUrl}
          alt={content.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/50 to-transparent" />
      </div>
      
      <div className="relative h-full container mx-auto px-4 z-10 flex items-center">
        <div className="max-w-xl">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {content.title}
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl mb-8 text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {content.subtitle}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link href={ctaLink}>
              <Button size="lg" className="rounded-full px-8">
                {cta}
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}