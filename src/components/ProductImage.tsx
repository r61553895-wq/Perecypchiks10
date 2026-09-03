import React, { useState } from 'react';
import { 
  Headphones, 
  Keyboard, 
  Mouse, 
  Gamepad2, 
  Watch, 
  Smartphone, 
  Tablet, 
  Camera, 
  Aperture, 
  Mic, 
  Laptop, 
  Cpu, 
  Monitor, 
  Sparkles, 
  Footprints,
  Package,
  Car,
  Gauge
} from 'lucide-react';
import { ItemCategory } from '../types';

// Bundled high-res local product photography (100% reliable anywhere in the world)
import earbudsImg from '../assets/images/tws_earbuds_1788431377971.jpg';
import keyboardImg from '../assets/images/mech_keyboard_1788431392170.jpg';
import phoneImg from '../assets/images/flagship_phone_1788431406924.jpg';
import laptopImg from '../assets/images/gaming_laptop_1788431421299.jpg';
import cameraImg from '../assets/images/pro_camera_1788431434897.jpg';
import watchImg from '../assets/images/swiss_watch_1788431452757.jpg';
import gpuImg from '../assets/images/rtx_gpu_1788431467523.jpg';
import sneakersImg from '../assets/images/hype_sneakers_1788431486885.jpg';
import sportsSedanImg from '../assets/images/sports_sedan_car_1788431861897.jpg';
import classicTunerImg from '../assets/images/classic_tuning_car_1788431877116.jpg';
import supercarImg from '../assets/images/luxury_supercar_1788431893256.jpg';

interface ProductImageProps {
  src?: string;
  alt: string;
  category?: ItemCategory;
  title?: string;
  className?: string;
  containerClassName?: string;
  loading?: 'lazy' | 'eager';
}

function getLocalProductImage(title: string = '', category?: ItemCategory): string {
  const t = title.toLowerCase();

  // Vehicles / Cars
  if (t.includes('lada') || t.includes('2107') || t.includes('боевая') || t.includes('классик') || t.includes('mark ii') || t.includes('mark 2')) {
    return classicTunerImg;
  }
  if (t.includes('porsche') || t.includes('carrera') || t.includes('supercar')) {
    return supercarImg;
  }
  if (t.includes('bmw') || t.includes('camry') || t.includes('mercedes') || t.includes('седан') || t.includes('sedan')) {
    return sportsSedanImg;
  }

  if (t.includes('earbuds') || t.includes('audio') || t.includes('tws')) {
    return earbudsImg;
  }
  if (t.includes('keyboard') || t.includes('keys')) {
    return keyboardImg;
  }
  if (t.includes('laptop') || t.includes('ultrabook') || t.includes('macbook') || t.includes('rog')) {
    return laptopImg;
  }
  if (t.includes('phone') || t.includes('fold') || t.includes('ultra') || t.includes('galaxy') || t.includes('pro max')) {
    return phoneImg;
  }
  if (t.includes('camera') || t.includes('lens') || t.includes('photo') || t.includes('alpha') || t.includes('lumix') || t.includes('mic')) {
    return cameraImg;
  }
  if (t.includes('watch') || t.includes('chrono') || t.includes('diver') || t.includes('speedmaster') || t.includes('submariner')) {
    return watchImg;
  }
  if (t.includes('gpu') || t.includes('rtx') || t.includes('geforce') || t.includes('ti') || t.includes('card')) {
    return gpuImg;
  }
  if (t.includes('sneakers') || t.includes('jordan') || t.includes('travis') || t.includes('dunk') || t.includes('dior') || t.includes('retro')) {
    return sneakersImg;
  }

  // Category fallback
  switch (category) {
    case 'vehicles':
      return sportsSedanImg;
    case 'accessories':
      return keyboardImg;
    case 'smartphones':
      return phoneImg;
    case 'audio_photo':
      return cameraImg;
    case 'laptops_pc':
      return laptopImg;
    case 'luxury_drops':
      return watchImg;
    default:
      return gpuImg;
  }
}

function getGadgetConfig(title: string = '', category?: ItemCategory) {
  const t = title.toLowerCase();

  if (t.includes('earbuds')) {
    return {
      Icon: Headphones,
      gradient: 'from-sky-900/90 via-slate-900 to-zinc-950',
      iconColor: 'text-sky-400',
      tag: 'TWS AUDIO',
      accentGlow: 'bg-sky-500/20'
    };
  }
  if (t.includes('keyboard')) {
    return {
      Icon: Keyboard,
      gradient: 'from-indigo-900/90 via-slate-900 to-zinc-950',
      iconColor: 'text-indigo-400',
      tag: 'MECH KEYS',
      accentGlow: 'bg-indigo-500/20'
    };
  }
  if (t.includes('mouse')) {
    return {
      Icon: Mouse,
      gradient: 'from-teal-900/90 via-slate-900 to-zinc-950',
      iconColor: 'text-teal-400',
      tag: 'OPTICAL',
      accentGlow: 'bg-teal-500/20'
    };
  }
  if (t.includes('gamepad') || t.includes('controller')) {
    return {
      Icon: Gamepad2,
      gradient: 'from-violet-900/90 via-slate-900 to-zinc-950',
      iconColor: 'text-violet-400',
      tag: 'PRO GAMEPAD',
      accentGlow: 'bg-violet-500/20'
    };
  }
  if (t.includes('tracker') || t.includes('smartband')) {
    return {
      Icon: Watch,
      gradient: 'from-emerald-900/90 via-slate-900 to-zinc-950',
      iconColor: 'text-emerald-400',
      tag: 'OLED WATCH',
      accentGlow: 'bg-emerald-500/20'
    };
  }
  if (t.includes('tablet')) {
    return {
      Icon: Tablet,
      gradient: 'from-blue-900/90 via-slate-900 to-zinc-950',
      iconColor: 'text-blue-400',
      tag: 'RETINA PAD',
      accentGlow: 'bg-blue-500/20'
    };
  }
  if (t.includes('phone') || t.includes('smartphone') || t.includes('fold')) {
    return {
      Icon: Smartphone,
      gradient: 'from-cyan-900/90 via-slate-900 to-zinc-950',
      iconColor: 'text-cyan-400',
      tag: 'FLAGSHIP',
      accentGlow: 'bg-cyan-500/20'
    };
  }
  if (t.includes('camera') || t.includes('mirrorless')) {
    return {
      Icon: Camera,
      gradient: 'from-amber-900/90 via-stone-900 to-zinc-950',
      iconColor: 'text-amber-400',
      tag: 'FULL FRAME',
      accentGlow: 'bg-amber-500/20'
    };
  }
  if (t.includes('lens')) {
    return {
      Icon: Aperture,
      gradient: 'from-zinc-800 via-neutral-900 to-zinc-950',
      iconColor: 'text-blue-300',
      tag: 'PRIME OPTICS',
      accentGlow: 'bg-blue-500/20'
    };
  }
  if (t.includes('mic')) {
    return {
      Icon: Mic,
      gradient: 'from-rose-900/90 via-stone-900 to-zinc-950',
      iconColor: 'text-rose-400',
      tag: 'BROADCAST',
      accentGlow: 'bg-rose-500/20'
    };
  }
  if (t.includes('headphones') || t.includes('anc')) {
    return {
      Icon: Headphones,
      gradient: 'from-purple-900/90 via-slate-900 to-zinc-950',
      iconColor: 'text-purple-400',
      tag: 'STUDIO ANC',
      accentGlow: 'bg-purple-500/20'
    };
  }
  if (t.includes('laptop') || t.includes('ultrabook')) {
    return {
      Icon: Laptop,
      gradient: 'from-slate-800 via-slate-900 to-zinc-950',
      iconColor: 'text-sky-300',
      tag: 'ULTRABOOK',
      accentGlow: 'bg-sky-500/20'
    };
  }
  if (t.includes('gpu') || t.includes('rtx')) {
    return {
      Icon: Cpu,
      gradient: 'from-emerald-950 via-zinc-900 to-black',
      iconColor: 'text-emerald-400',
      tag: 'RTX GRAPHICS',
      accentGlow: 'bg-emerald-500/20'
    };
  }
  if (t.includes('monitor')) {
    return {
      Icon: Monitor,
      gradient: 'from-blue-950 via-zinc-900 to-black',
      iconColor: 'text-blue-400',
      tag: 'QD-OLED',
      accentGlow: 'bg-blue-500/20'
    };
  }
  if (t.includes('chronograph') || t.includes('diver') || t.includes('watch')) {
    return {
      Icon: Watch,
      gradient: 'from-amber-950 via-neutral-900 to-zinc-950',
      iconColor: 'text-amber-300',
      tag: 'SWISS CHRONO',
      accentGlow: 'bg-amber-500/20'
    };
  }
  if (t.includes('sneakers')) {
    return {
      Icon: Footprints,
      gradient: 'from-fuchsia-950 via-zinc-900 to-zinc-950',
      iconColor: 'text-fuchsia-400',
      tag: 'DEADSTOCK',
      accentGlow: 'bg-fuchsia-500/20'
    };
  }

  // Fallback by category
  switch (category) {
    case 'accessories':
      return {
        Icon: Headphones,
        gradient: 'from-sky-900/80 via-slate-900 to-zinc-950',
        iconColor: 'text-sky-400',
        tag: 'ACCESSORY',
        accentGlow: 'bg-sky-500/20'
      };
    case 'smartphones':
      return {
        Icon: Smartphone,
        gradient: 'from-cyan-900/80 via-slate-900 to-zinc-950',
        iconColor: 'text-cyan-400',
        tag: 'SMARTPHONE',
        accentGlow: 'bg-cyan-500/20'
      };
    case 'audio_photo':
      return {
        Icon: Camera,
        gradient: 'from-purple-900/80 via-slate-900 to-zinc-950',
        iconColor: 'text-purple-400',
        tag: 'PRO AUDIO',
        accentGlow: 'bg-purple-500/20'
      };
    case 'laptops_pc':
      return {
        Icon: Laptop,
        gradient: 'from-slate-800 via-zinc-900 to-zinc-950',
        iconColor: 'text-emerald-400',
        tag: 'COMPUTING',
        accentGlow: 'bg-emerald-500/20'
      };
    case 'luxury_drops':
      return {
        Icon: Sparkles,
        gradient: 'from-amber-950 via-zinc-900 to-black',
        iconColor: 'text-amber-300',
        tag: 'LUXURY DROP',
        accentGlow: 'bg-amber-500/20'
      };
    case 'vehicles':
      return {
        Icon: Car,
        gradient: 'from-red-950 via-zinc-900 to-black',
        iconColor: 'text-amber-400',
        tag: 'АВТОМОБИЛЬ',
        accentGlow: 'bg-amber-500/20'
      };
    default:
      return {
        Icon: Package,
        gradient: 'from-zinc-800 via-zinc-900 to-black',
        iconColor: 'text-zinc-400',
        tag: 'HARDWARE',
        accentGlow: 'bg-zinc-500/20'
      };
  }
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  category,
  title,
  className = 'w-full h-full object-cover',
  containerClassName = 'w-full h-full relative overflow-hidden',
  loading = 'lazy'
}) => {
  const [useFallbackImg, setUseFallbackImg] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const localFallback = getLocalProductImage(title || alt, category);
  const config = getGadgetConfig(title || alt, category);
  const { Icon, gradient, iconColor, tag, accentGlow } = config;

  // If external src failed, switch to local image bundled in the build
  const displaySrc = (!useFallbackImg && src) ? src : localFallback;

  return (
    <div className={`relative select-none flex items-center justify-center bg-zinc-950 ${containerClassName}`}>
      {/* Background graphic glow while loading */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${gradient} flex flex-col items-center justify-center p-2 text-center transition-opacity duration-300 ${
          isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className={`absolute w-12 h-12 rounded-full ${accentGlow} blur-md`} />
        <div className="relative z-10 w-8 h-8 rounded-lg bg-white/10 border border-white/15 backdrop-blur-xs flex items-center justify-center shadow-inner">
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        <span className="relative z-10 text-[8px] font-mono font-bold tracking-widest text-zinc-400 uppercase mt-1 line-clamp-1 opacity-90">
          {tag}
        </span>
      </div>

      {/* Guaranteed Real Image */}
      <img
        src={displaySrc}
        alt={alt}
        loading={loading}
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          if (!useFallbackImg) {
            setUseFallbackImg(true);
          }
        }}
        className={`${className} relative z-20 transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};
