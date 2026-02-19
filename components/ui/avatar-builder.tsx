'use client';

import React from 'react';
import { cn } from '@/lib/utils';

/* ═══════════════════════════════════════════════════════════
   Types & Defaults
   ═══════════════════════════════════════════════════════════ */

export interface AvatarConfig {
    gender: 'male' | 'female';
    skinColor: string;
    hairType: string;
    clothing: string;
}

export const DEFAULT_AVATAR: AvatarConfig = {
    gender: 'male',
    skinColor: '#C68642',
    hairType: 'short',
    clothing: 'tshirt',
};

export const SKIN_COLORS = [
    { label: 'Light', value: '#FDEBD0' },
    { label: 'Fair', value: '#F5CBA7' },
    { label: 'Medium', value: '#E0AC69' },
    { label: 'Tan', value: '#C68642' },
    { label: 'Brown', value: '#8D5524' },
    { label: 'Dark', value: '#5C3A1E' },
];

export const HAIR_TYPES_MALE = ['short', 'buzz', 'curly', 'spiky', 'slick', 'none'] as const;
export const HAIR_TYPES_FEMALE = ['long', 'bob', 'curly', 'ponytail', 'braids', 'bun'] as const;

export const CLOTHING_OPTIONS = [
    { label: 'T-Shirt', value: 'tshirt' },
    { label: 'Hoodie', value: 'hoodie' },
    { label: 'Formal', value: 'formal' },
    { label: 'Tank Top', value: 'tank' },
] as const;

/* ═══════════════════════════════════════════════════════════
   SVG Parts — Head shapes, hair, clothing
   ═══════════════════════════════════════════════════════════ */

function HeadShape({ skinColor, gender }: { skinColor: string; gender: string }) {
    const faceWidth = gender === 'female' ? 58 : 64;
    const jawOffset = gender === 'female' ? 4 : 0;
    return (
        <g>
            {/* Neck */}
            <rect
                x={100 - 14}
                y={135}
                width={28}
                height={30}
                rx={6}
                fill={skinColor}
            />
            {/* Head */}
            <ellipse
                cx={100}
                cy={90 + jawOffset}
                rx={faceWidth / 2}
                ry={gender === 'female' ? 38 : 42}
                fill={skinColor}
            />
            {/* Ears */}
            <ellipse cx={100 - faceWidth / 2 - 3} cy={92} rx={6} ry={9} fill={skinColor} />
            <ellipse cx={100 + faceWidth / 2 + 3} cy={92} rx={6} ry={9} fill={skinColor} />
            {/* Eyes */}
            <circle cx={87} cy={88} r={3.5} fill="#1a1a1a" />
            <circle cx={113} cy={88} r={3.5} fill="#1a1a1a" />
            <circle cx={88} cy={87} r={1.2} fill="white" />
            <circle cx={114} cy={87} r={1.2} fill="white" />
            {/* Eyebrows */}
            <line x1={82} y1={80} x2={92} y2={79} stroke="#333" strokeWidth={2} strokeLinecap="round" />
            <line x1={108} y1={79} x2={118} y2={80} stroke="#333" strokeWidth={2} strokeLinecap="round" />
            {/* Nose */}
            <path d="M97 95 Q100 100 103 95" fill="none" stroke={darkenColor(skinColor, 30)} strokeWidth={1.5} strokeLinecap="round" />
            {/* Mouth */}
            <path d="M92 107 Q100 114 108 107" fill="none" stroke={darkenColor(skinColor, 40)} strokeWidth={1.8} strokeLinecap="round" />
        </g>
    );
}

function HairMale({ type, color }: { type: string; color: string }) {
    const hairColor = color;
    switch (type) {
        case 'short':
            return (
                <g>
                    <ellipse cx={100} cy={62} rx={35} ry={22} fill={hairColor} />
                    <rect x={66} y={58} width={68} height={18} rx={8} fill={hairColor} />
                </g>
            );
        case 'buzz':
            return (
                <g>
                    <ellipse cx={100} cy={66} rx={34} ry={18} fill={hairColor} />
                </g>
            );
        case 'curly':
            return (
                <g>
                    <ellipse cx={100} cy={58} rx={38} ry={26} fill={hairColor} />
                    <circle cx={72} cy={70} r={10} fill={hairColor} />
                    <circle cx={128} cy={70} r={10} fill={hairColor} />
                    <circle cx={80} cy={56} r={9} fill={hairColor} />
                    <circle cx={120} cy={56} r={9} fill={hairColor} />
                </g>
            );
        case 'spiky':
            return (
                <g>
                    <polygon points="75,72 82,40 90,68" fill={hairColor} />
                    <polygon points="88,68 96,35 104,68" fill={hairColor} />
                    <polygon points="100,68 108,38 116,68" fill={hairColor} />
                    <polygon points="112,68 120,42 128,72" fill={hairColor} />
                    <rect x={72} y={60} width={56} height={16} rx={6} fill={hairColor} />
                </g>
            );
        case 'slick':
            return (
                <g>
                    <ellipse cx={100} cy={60} rx={36} ry={24} fill={hairColor} />
                    <path d="M64,70 Q62,60 68,52 Q80,42 100,40 Q120,42 132,52 Q138,60 136,70" fill={hairColor} />
                </g>
            );
        case 'none':
            return null;
        default:
            return null;
    }
}

function HairFemale({ type, color }: { type: string; color: string }) {
    const hairColor = color;
    switch (type) {
        case 'long':
            return (
                <g>
                    <ellipse cx={100} cy={60} rx={36} ry={24} fill={hairColor} />
                    <rect x={62} y={58} width={16} height={85} rx={8} fill={hairColor} />
                    <rect x={122} y={58} width={16} height={85} rx={8} fill={hairColor} />
                    <path d="M64,70 Q60,100 66,140" fill={hairColor} stroke={hairColor} strokeWidth={4} />
                    <path d="M136,70 Q140,100 134,140" fill={hairColor} stroke={hairColor} strokeWidth={4} />
                </g>
            );
        case 'bob':
            return (
                <g>
                    <ellipse cx={100} cy={58} rx={38} ry={24} fill={hairColor} />
                    <rect x={60} y={56} width={80} height={50} rx={20} fill={hairColor} />
                </g>
            );
        case 'curly':
            return (
                <g>
                    <ellipse cx={100} cy={56} rx={40} ry={28} fill={hairColor} />
                    <circle cx={64} cy={76} r={14} fill={hairColor} />
                    <circle cx={136} cy={76} r={14} fill={hairColor} />
                    <circle cx={68} cy={100} r={12} fill={hairColor} />
                    <circle cx={132} cy={100} r={12} fill={hairColor} />
                    <circle cx={74} cy={120} r={10} fill={hairColor} />
                    <circle cx={126} cy={120} r={10} fill={hairColor} />
                </g>
            );
        case 'ponytail':
            return (
                <g>
                    <ellipse cx={100} cy={60} rx={35} ry={22} fill={hairColor} />
                    <rect x={66} y={58} width={68} height={14} rx={7} fill={hairColor} />
                    {/* Ponytail going back */}
                    <ellipse cx={130} cy={68} rx={8} ry={12} fill={hairColor} />
                    <rect x={126} y={68} width={10} height={60} rx={5} fill={hairColor} />
                </g>
            );
        case 'braids':
            return (
                <g>
                    <ellipse cx={100} cy={60} rx={36} ry={22} fill={hairColor} />
                    <rect x={66} y={58} width={68} height={14} rx={7} fill={hairColor} />
                    {/* Left braid */}
                    <rect x={68} y={66} width={8} height={80} rx={4} fill={hairColor} />
                    <circle cx={72} cy={148} r={5} fill={hairColor} />
                    {/* Right braid */}
                    <rect x={124} y={66} width={8} height={80} rx={4} fill={hairColor} />
                    <circle cx={128} cy={148} r={5} fill={hairColor} />
                </g>
            );
        case 'bun':
            return (
                <g>
                    <ellipse cx={100} cy={60} rx={35} ry={22} fill={hairColor} />
                    <rect x={66} y={58} width={68} height={14} rx={7} fill={hairColor} />
                    <circle cx={100} cy={42} r={16} fill={hairColor} />
                </g>
            );
        default:
            return null;
    }
}

function ClothingShape({ type, skinColor }: { type: string; skinColor: string }) {
    const clothingColors: Record<string, { fill: string; accent: string }> = {
        tshirt: { fill: '#3B82F6', accent: '#2563EB' },
        hoodie: { fill: '#6B7280', accent: '#4B5563' },
        formal: { fill: '#1F2937', accent: '#111827' },
        tank: { fill: '#EF4444', accent: '#DC2626' },
    };

    const c = clothingColors[type] || clothingColors.tshirt;

    switch (type) {
        case 'tshirt':
            return (
                <g>
                    <path
                        d="M60,200 Q60,165 80,155 Q90,150 100,148 Q110,150 120,155 Q140,165 140,200 Z"
                        fill={c.fill}
                    />
                    {/* Sleeves */}
                    <path d="M60,170 L42,185 L50,195 L65,182" fill={c.fill} />
                    <path d="M140,170 L158,185 L150,195 L135,182" fill={c.fill} />
                    {/* Collar */}
                    <path d="M86,150 Q100,158 114,150" fill="none" stroke={c.accent} strokeWidth={2} />
                    {/* Neck skin showing */}
                    <path d="M88,150 Q100,156 112,150 L112,148 Q100,154 88,148 Z" fill={skinColor} />
                </g>
            );
        case 'hoodie':
            return (
                <g>
                    <path
                        d="M55,200 Q55,160 78,152 Q90,148 100,146 Q110,148 122,152 Q145,160 145,200 Z"
                        fill={c.fill}
                    />
                    <path d="M55,168 L38,182 L46,196 L60,180" fill={c.fill} />
                    <path d="M145,168 L162,182 L154,196 L140,180" fill={c.fill} />
                    {/* Hood */}
                    <path d="M72,150 Q70,138 78,132 Q100,126 122,132 Q130,138 128,150" fill={c.accent} fillOpacity={0.6} />
                    {/* Pocket */}
                    <rect x={82} y={178} width={36} height={14} rx={4} fill={c.accent} fillOpacity={0.4} />
                    {/* Zipper line */}
                    <line x1={100} y1={148} x2={100} y2={200} stroke={c.accent} strokeWidth={1.5} strokeDasharray="3,3" />
                </g>
            );
        case 'formal':
            return (
                <g>
                    <path
                        d="M58,200 Q58,162 80,154 Q90,150 100,148 Q110,150 120,154 Q142,162 142,200 Z"
                        fill={c.fill}
                    />
                    <path d="M58,168 L40,183 L48,195 L63,180" fill={c.fill} />
                    <path d="M142,168 L160,183 L152,195 L137,180" fill={c.fill} />
                    {/* Collar / Lapels */}
                    <path d="M88,150 L82,165 L92,160 Z" fill="white" />
                    <path d="M112,150 L118,165 L108,160 Z" fill="white" />
                    {/* Tie */}
                    <polygon points="98,158 102,158 104,185 100,188 96,185" fill="#E11D48" />
                    {/* Buttons */}
                    <circle cx={100} cy={172} r={1.5} fill={c.accent} />
                    <circle cx={100} cy={182} r={1.5} fill={c.accent} />
                </g>
            );
        case 'tank':
            return (
                <g>
                    <path
                        d="M68,200 Q68,168 82,158 Q92,152 100,150 Q108,152 118,158 Q132,168 132,200 Z"
                        fill={c.fill}
                    />
                    {/* Exposed shoulders */}
                    <path d="M68,166 Q60,168 55,178 L58,180 Q62,170 68,168" fill={skinColor} />
                    <path d="M132,166 Q140,168 145,178 L142,180 Q138,170 132,168" fill={skinColor} />
                    {/* Strap */}
                    <rect x={82} y={145} width={8} height={14} rx={3} fill={c.fill} />
                    <rect x={110} y={145} width={8} height={14} rx={3} fill={c.fill} />
                </g>
            );
        default:
            return null;
    }
}

/* ═══════════════════════════════════════════════════════════
   Color Utilities
   ═══════════════════════════════════════════════════════════ */

function darkenColor(hex: string, amount: number): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.max((num >> 16) - amount, 0);
    const g = Math.max(((num >> 8) & 0x00FF) - amount, 0);
    const b = Math.max((num & 0x0000FF) - amount, 0);
    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
}

function getHairColor(skinColor: string): string {
    const hairMap: Record<string, string> = {
        '#FDEBD0': '#D4A574',
        '#F5CBA7': '#8B6914',
        '#E0AC69': '#4A3728',
        '#C68642': '#2C1A0E',
        '#8D5524': '#1A0F08',
        '#5C3A1E': '#0D0705',
    };
    return hairMap[skinColor] || '#2C1A0E';
}

/* ═══════════════════════════════════════════════════════════
   Avatar Preview Component
   ═══════════════════════════════════════════════════════════ */

export function AvatarPreview({
    config,
    size = 120,
    className,
}: {
    config: AvatarConfig;
    size?: number;
    className?: string;
}) {
    const hairColor = getHairColor(config.skinColor);
    const hairTypes = config.gender === 'male' ? HAIR_TYPES_MALE : HAIR_TYPES_FEMALE;
    const validHair = (hairTypes as readonly string[]).includes(config.hairType)
        ? config.hairType
        : (hairTypes[0] as string);

    return (
        <div
            className={cn(
                'rounded-full overflow-hidden bg-gradient-to-b from-zinc-800 to-zinc-900 flex items-center justify-center',
                className
            )}
            style={{ width: size, height: size }}
        >
            <svg
                viewBox="30 30 140 170"
                width={size}
                height={size}
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Background circle */}
                <defs>
                    <radialGradient id="avatarBg" cx="50%" cy="40%" r="60%">
                        <stop offset="0%" stopColor="#27272a" />
                        <stop offset="100%" stopColor="#18181b" />
                    </radialGradient>
                </defs>
                <rect x={30} y={30} width={140} height={170} fill="url(#avatarBg)" />

                {/* Clothing (behind head) */}
                <ClothingShape type={config.clothing} skinColor={config.skinColor} />

                {/* Head */}
                <HeadShape skinColor={config.skinColor} gender={config.gender} />

                {/* Hair (on top) */}
                {config.gender === 'male' ? (
                    <HairMale type={validHair} color={hairColor} />
                ) : (
                    <HairFemale type={validHair} color={hairColor} />
                )}
            </svg>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════
   Avatar Customizer Component
   ═══════════════════════════════════════════════════════════ */

export function AvatarCustomizer({
    config,
    onChange,
}: {
    config: AvatarConfig;
    onChange: (config: AvatarConfig) => void;
}) {
    const hairTypes = config.gender === 'male' ? HAIR_TYPES_MALE : HAIR_TYPES_FEMALE;

    const handleGenderChange = (gender: 'male' | 'female') => {
        const newHairTypes = gender === 'male' ? HAIR_TYPES_MALE : HAIR_TYPES_FEMALE;
        onChange({
            ...config,
            gender,
            hairType: newHairTypes[0] as string,
        });
    };

    return (
        <div className="space-y-6">

            {/* Gender */}
            <div className="space-y-2.5">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest pl-1">
                    Gender
                </label>
                <div className="grid grid-cols-2 gap-2">
                    {(['male', 'female'] as const).map((g) => (
                        <button
                            key={g}
                            type="button"
                            onClick={() => handleGenderChange(g)}
                            className={cn(
                                'py-2.5 rounded-xl border text-sm font-medium transition-all capitalize',
                                config.gender === g
                                    ? 'bg-white text-black border-white'
                                    : 'bg-zinc-900/80 text-zinc-500 border-zinc-800 hover:border-zinc-700 hover:text-zinc-300'
                            )}
                        >
                            {g}
                        </button>
                    ))}
                </div>
            </div>

            {/* Skin Color */}
            <div className="space-y-2.5">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest pl-1">
                    Skin Tone
                </label>
                <div className="flex gap-2">
                    {SKIN_COLORS.map((sc) => (
                        <button
                            key={sc.value}
                            type="button"
                            onClick={() => onChange({ ...config, skinColor: sc.value })}
                            className={cn(
                                'w-9 h-9 rounded-full border-2 transition-all hover:scale-110',
                                config.skinColor === sc.value
                                    ? 'border-white scale-110 ring-2 ring-white/20'
                                    : 'border-zinc-700 hover:border-zinc-500'
                            )}
                            style={{ backgroundColor: sc.value }}
                            title={sc.label}
                        />
                    ))}
                </div>
            </div>

            {/* Hair Type */}
            <div className="space-y-2.5">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest pl-1">
                    Hair Style
                </label>
                <div className="grid grid-cols-3 gap-2">
                    {hairTypes.map((ht) => (
                        <button
                            key={ht}
                            type="button"
                            onClick={() => onChange({ ...config, hairType: ht as string })}
                            className={cn(
                                'py-2 rounded-xl border text-xs font-medium transition-all capitalize',
                                config.hairType === ht
                                    ? 'bg-white text-black border-white'
                                    : 'bg-zinc-900/80 text-zinc-500 border-zinc-800 hover:border-zinc-700 hover:text-zinc-300'
                            )}
                        >
                            {ht}
                        </button>
                    ))}
                </div>
            </div>

            {/* Clothing */}
            <div className="space-y-2.5">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest pl-1">
                    Clothing
                </label>
                <div className="grid grid-cols-2 gap-2">
                    {CLOTHING_OPTIONS.map((co) => (
                        <button
                            key={co.value}
                            type="button"
                            onClick={() => onChange({ ...config, clothing: co.value })}
                            className={cn(
                                'py-2.5 rounded-xl border text-sm font-medium transition-all',
                                config.clothing === co.value
                                    ? 'bg-white text-black border-white'
                                    : 'bg-zinc-900/80 text-zinc-500 border-zinc-800 hover:border-zinc-700 hover:text-zinc-300'
                            )}
                        >
                            {co.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
