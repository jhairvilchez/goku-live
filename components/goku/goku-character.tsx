import type { DanceId } from '@/lib/dances'

type Props = {
  dance: DanceId
  talking: boolean
  ssj: boolean
  className?: string
}

const ORANGE = '#f97316'
const ORANGE_DARK = '#c2410c'
const BLUE = '#1d4ed8'
const BLUE_DARK = '#1e3a8a'
const SKIN = '#f5c9a0'
const SKIN_SHADE = '#e0a878'
const INK = '#1c1917'

export function GokuCharacter({ dance, talking, ssj, className }: Props) {
  return (
    <svg
      viewBox="0 0 200 300"
      className={`goku ${className ?? ''}`}
      data-dance={dance}
      data-talking={talking}
      data-ssj={ssj}
      role="img"
      aria-label={`Goku ${dance === 'idle' ? 'esperando' : 'bailando'}`}
      overflow="visible"
    >
      <g className="aura">
        <ellipse cx="100" cy="160" rx="92" ry="150" />
        <ellipse cx="100" cy="170" rx="70" ry="125" className="aura-inner" />
      </g>

      <ellipse className="shadow" cx="100" cy="276" rx="48" ry="7" fill="#000" opacity="0.25" />

      <g className="body">
        <g className="leg leg-l">
          <path d="M74 176 Q69 210 78 242 L99 242 Q103 210 101 176 Z" fill={ORANGE} stroke={ORANGE_DARK} strokeWidth="2" />
          <path d="M76 240 L100 240 L102 266 Q88 274 70 270 Q70 258 76 240 Z" fill={BLUE} stroke={BLUE_DARK} strokeWidth="2" />
          <rect x="77" y="240" width="22" height="6" fill="#dc2626" />
        </g>
        <g className="leg leg-r">
          <path d="M99 176 Q97 210 101 242 L122 242 Q131 210 126 176 Z" fill={ORANGE} stroke={ORANGE_DARK} strokeWidth="2" />
          <path d="M100 240 L124 240 Q130 258 130 270 Q112 274 98 266 Z" fill={BLUE} stroke={BLUE_DARK} strokeWidth="2" />
          <rect x="101" y="240" width="22" height="6" fill="#dc2626" />
        </g>

        <g className="arm arm-l">
          <line x1="70" y1="120" x2="58" y2="164" stroke={SKIN} strokeWidth="14" strokeLinecap="round" />
          <circle cx="70" cy="118" r="11" fill={BLUE} />
          <line x1="58.5" y1="160" x2="56.5" y2="170" stroke={BLUE} strokeWidth="16" strokeLinecap="round" />
          <circle cx="55" cy="178" r="9" fill={SKIN} stroke={SKIN_SHADE} strokeWidth="2" />
        </g>

        <g className="torso">
          <path d="M70 112 Q64 150 73 180 L127 180 Q136 150 130 112 Q100 102 70 112 Z" fill={ORANGE} stroke={ORANGE_DARK} strokeWidth="2" />
          <path d="M85 108 L100 142 L115 108 Z" fill={BLUE} />
          <path d="M85 108 L100 142 L115 108" fill="none" stroke={ORANGE_DARK} strokeWidth="2" />
          <rect x="71" y="166" width="58" height="11" rx="3" fill={BLUE} stroke={BLUE_DARK} strokeWidth="2" />
          <path d="M96 176 L90 192 M104 176 L110 192" stroke={BLUE} strokeWidth="6" strokeLinecap="round" />
        </g>

        <g className="arm arm-r">
          <line x1="130" y1="120" x2="142" y2="164" stroke={SKIN} strokeWidth="14" strokeLinecap="round" />
          <circle cx="130" cy="118" r="11" fill={BLUE} />
          <line x1="141.5" y1="160" x2="143.5" y2="170" stroke={BLUE} strokeWidth="16" strokeLinecap="round" />
          <circle cx="145" cy="178" r="9" fill={SKIN} stroke={SKIN_SHADE} strokeWidth="2" />
        </g>

        <g className="head">
          <rect x="92" y="92" width="16" height="18" rx="4" fill={SKIN_SHADE} />
          <circle cx="75" cy="80" r="6" fill={SKIN} />
          <circle cx="125" cy="80" r="6" fill={SKIN} />
          <path
            className="hair"
            d="M74 72 L48 62 L68 54 L44 32 L74 40 L68 10 L92 32 L100 2 L110 30 L132 10 L127 40 L156 32 L134 54 L152 62 L126 72 Q100 40 74 72 Z"
          />
          <ellipse cx="100" cy="78" rx="25" ry="28" fill={SKIN} />
          <path
            className="hair"
            d="M75 64 L82 78 L87 60 L95 74 L100 56 L106 74 L113 60 L118 78 L125 64 Q100 38 75 64 Z"
          />
          <path d="M83 68 L95 72" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
          <path d="M117 68 L105 72" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
          <g className="eyes">
            <ellipse cx="90" cy="79" rx="4" ry="5" className="iris" />
            <ellipse cx="110" cy="79" rx="4" ry="5" className="iris" />
            <circle cx="91.3" cy="77.3" r="1.3" fill="#fff" />
            <circle cx="111.3" cy="77.3" r="1.3" fill="#fff" />
          </g>
          <path d="M99 84 L101 89" stroke={SKIN_SHADE} strokeWidth="2" strokeLinecap="round" />
          <path className="mouth-closed" d="M92 94 Q100 100 108 94" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
          <ellipse className="mouth-open" cx="100" cy="96" rx="6" ry="4.5" fill="#7f1d1d" stroke={INK} strokeWidth="1.5" />
        </g>

        <g className="ki-ball">
          <circle cx="186" cy="124" r="16" fill="#bae6fd" />
          <circle cx="186" cy="124" r="9" fill="#fff" />
        </g>
        <g className="beam">
          <rect x="186" y="110" width="420" height="28" rx="14" fill="#7dd3fc" />
          <rect x="186" y="117" width="420" height="14" rx="7" fill="#fff" />
        </g>
      </g>
    </svg>
  )
}
