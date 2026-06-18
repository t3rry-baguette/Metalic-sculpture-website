// ============================================================
// MOSES SCULPTURES — Product Catalog
// Category-based e-commerce product system
// ============================================================

// Pricing multipliers for customizations
const PRICE_CONFIG = {
  size: {
    small:  { label: 'Small (≈30 cm)',  multiplier: 0.55, note: 'Ideal for desk & shelf' },
    medium: { label: 'Medium (≈60 cm)', multiplier: 1.00, note: 'Most popular size' },
    large:  { label: 'Large (≈120 cm)', multiplier: 1.90, note: 'Statement piece' },
    custom: { label: 'Custom Dimensions', multiplier: 2.50, note: 'You specify exact size' }
  },
  finish: {
    'raw-steel':      { label: 'Raw Steel',      pct: 0.00, hex: '#7A7A7A', note: 'Natural aged metal' },
    'polished-silver':{ label: 'Polished Silver', pct: 0.25, hex: '#D8D8D8', note: 'Mirror-bright finish' },
    'matte-black':    { label: 'Matte Black',     pct: 0.20, hex: '#2A2A2A', note: 'Sleek modern look' },
    'brushed-copper': { label: 'Brushed Copper',  pct: 0.35, hex: '#B87333', note: 'Warm classic tone' }
  },
  color: {
    none:    { label: 'Natural Metal', extra: 0,    note: 'Keep the natural finish' },
    painted: { label: 'Custom Paint',  extra: 3000, note: '+KES 3,000 — specify colour' }
  },
  engraving: { extra: 2500, note: '+KES 2,500 per piece' }
};

// ============================================================
// SVG ART GENERATORS
// Each returns an SVG string — IDs are prefixed with productId
// ============================================================

function svgLion(id) {
  return `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="${id}-m" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#C8944A"/><stop offset="100%" stop-color="#6A4820"/>
    </radialGradient>
    <radialGradient id="${id}-b" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#E0E0E0"/><stop offset="100%" stop-color="#8A8A8A"/>
    </radialGradient>
    <radialGradient id="${id}-leg" cx="30%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#C8C8C8"/><stop offset="100%" stop-color="#7A7A7A"/>
    </radialGradient>
  </defs>
  <!-- Shadow -->
  <ellipse cx="150" cy="292" rx="80" ry="6" fill="rgba(0,0,0,0.25)"/>
  <!-- Mane -->
  <circle cx="150" cy="108" r="70" fill="url(#${id}-m)" opacity="0.95"/>
  <!-- Head -->
  <circle cx="150" cy="102" r="50" fill="url(#${id}-b)"/>
  <!-- Ears -->
  <circle cx="108" cy="66" r="16" fill="url(#${id}-leg)"/>
  <circle cx="192" cy="66" r="16" fill="url(#${id}-leg)"/>
  <circle cx="108" cy="66" r="9"  fill="#1A1A1A"/>
  <circle cx="192" cy="66" r="9"  fill="#1A1A1A"/>
  <!-- Eyes -->
  <ellipse cx="133" cy="96" rx="9" ry="7" fill="#1A1A1A"/>
  <ellipse cx="167" cy="96" rx="9" ry="7" fill="#1A1A1A"/>
  <circle cx="135" cy="94" r="3" fill="rgba(255,255,255,0.35)"/>
  <circle cx="169" cy="94" r="3" fill="rgba(255,255,255,0.35)"/>
  <!-- Snout -->
  <ellipse cx="150" cy="116" rx="16" ry="10" fill="#9A9A9A"/>
  <ellipse cx="150" cy="113" rx="8"  ry="6"  fill="#0B0B0B"/>
  <!-- Mouth -->
  <path d="M141 121 Q150 129 159 121" stroke="#2A2A2A" stroke-width="2" fill="none" stroke-linecap="round"/>
  <!-- Whiskers -->
  <line x1="112" y1="110" x2="136" y2="116" stroke="#9A9A9A" stroke-width="1.2" opacity="0.6"/>
  <line x1="112" y1="116" x2="136" y2="119" stroke="#9A9A9A" stroke-width="1.2" opacity="0.6"/>
  <line x1="164" y1="116" x2="188" y2="110" stroke="#9A9A9A" stroke-width="1.2" opacity="0.6"/>
  <line x1="164" y1="119" x2="188" y2="116" stroke="#9A9A9A" stroke-width="1.2" opacity="0.6"/>
  <!-- Body -->
  <ellipse cx="150" cy="212" rx="60" ry="66" fill="url(#${id}-b)"/>
  <!-- Front legs -->
  <rect x="108" y="242" width="22" height="54" rx="11" fill="url(#${id}-leg)"/>
  <rect x="170" y="242" width="22" height="54" rx="11" fill="url(#${id}-leg)"/>
  <!-- Paws -->
  <ellipse cx="119" cy="293" rx="14" ry="5" fill="#8A8A8A"/>
  <ellipse cx="181" cy="293" rx="14" ry="5" fill="#8A8A8A"/>
  <!-- Tail -->
  <path d="M208 195 Q248 170 258 138 Q265 112 252 100" stroke="url(#${id}-leg)" stroke-width="10" fill="none" stroke-linecap="round"/>
  <circle cx="254" cy="96" r="14" fill="url(#${id}-leg)"/>
</svg>`;
}

function svgElephant(id) {
  return `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="${id}-b" cx="40%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#D0D0D0"/><stop offset="100%" stop-color="#7A7A7A"/>
    </radialGradient>
    <radialGradient id="${id}-e" cx="60%" cy="40%" r="65%">
      <stop offset="0%" stop-color="#C8C8C8"/><stop offset="100%" stop-color="#6A6A6A"/>
    </radialGradient>
  </defs>
  <ellipse cx="150" cy="292" rx="90" ry="6" fill="rgba(0,0,0,0.22)"/>
  <!-- Body -->
  <ellipse cx="152" cy="195" rx="78" ry="75" fill="url(#${id}-b)"/>
  <!-- Left Ear -->
  <ellipse cx="74" cy="162" rx="38" ry="48" fill="url(#${id}-e)" transform="rotate(-15 74 162)"/>
  <!-- Right Ear -->
  <ellipse cx="226" cy="158" rx="34" ry="42" fill="url(#${id}-e)" transform="rotate(12 226 158)"/>
  <!-- Head -->
  <circle cx="150" cy="130" r="52" fill="url(#${id}-b)"/>
  <!-- Tusks -->
  <path d="M130 158 Q108 172 100 190" stroke="#E8E8D0" stroke-width="7" fill="none" stroke-linecap="round"/>
  <path d="M170 158 Q192 172 200 190" stroke="#E8E8D0" stroke-width="7" fill="none" stroke-linecap="round"/>
  <!-- Eyes -->
  <circle cx="127" cy="118" r="8" fill="#1A1A1A"/>
  <circle cx="173" cy="118" r="8" fill="#1A1A1A"/>
  <circle cx="129" cy="116" r="3" fill="rgba(255,255,255,0.3)"/>
  <circle cx="175" cy="116" r="3" fill="rgba(255,255,255,0.3)"/>
  <!-- Trunk -->
  <path d="M150 170 Q130 195 120 215 Q112 235 120 255 Q128 270 138 265 Q148 260 142 242 Q136 225 145 208 Q155 190 158 175" stroke="url(#${id}-b)" stroke-width="18" fill="none" stroke-linecap="round"/>
  <!-- Trunk tip -->
  <ellipse cx="139" cy="263" rx="10" ry="6" fill="#7A7A7A" transform="rotate(-10 139 263)"/>
  <!-- Legs -->
  <rect x="100" y="252" width="28" height="42" rx="14" fill="url(#${id}-e)"/>
  <rect x="140" y="255" width="28" height="39" rx="14" fill="url(#${id}-e)"/>
  <rect x="168" y="252" width="28" height="42" rx="14" fill="url(#${id}-e)"/>
  <!-- Tail -->
  <path d="M228 198 Q248 185 252 202" stroke="#9A9A9A" stroke-width="5" fill="none" stroke-linecap="round"/>
  <circle cx="253" cy="205" r="7" fill="#8A8A8A"/>
</svg>`;
}

function svgGiraffe(id) {
  return `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="${id}-b" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#D4D4D4"/><stop offset="100%" stop-color="#8A8A8A"/>
    </linearGradient>
    <linearGradient id="${id}-s" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#C09030"/><stop offset="100%" stop-color="#7A5A18"/>
    </linearGradient>
  </defs>
  <ellipse cx="150" cy="293" rx="60" ry="5" fill="rgba(0,0,0,0.2)"/>
  <!-- Body -->
  <ellipse cx="155" cy="225" rx="48" ry="55" fill="url(#${id}-b)"/>
  <!-- Spots on body -->
  <ellipse cx="138" cy="208" rx="12" ry="9"  fill="url(#${id}-s)" opacity="0.7"/>
  <ellipse cx="168" cy="230" rx="10" ry="8"  fill="url(#${id}-s)" opacity="0.7"/>
  <ellipse cx="148" cy="248" rx="9"  ry="7"  fill="url(#${id}-s)" opacity="0.7"/>
  <ellipse cx="172" cy="208" rx="8"  ry="6"  fill="url(#${id}-s)" opacity="0.5"/>
  <!-- Neck -->
  <path d="M138 175 Q130 125 135 70 Q137 40 148 22" stroke="url(#${id}-b)" stroke-width="30" fill="none" stroke-linecap="round"/>
  <!-- Spots on neck -->
  <ellipse cx="135" cy="140" rx="9" ry="6" fill="url(#${id}-s)" opacity="0.6" transform="rotate(-10 135 140)"/>
  <ellipse cx="140" cy="105" rx="8" ry="5" fill="url(#${id}-s)" opacity="0.6" transform="rotate(-5 140 105)"/>
  <ellipse cx="143" cy="68"  rx="7" ry="4" fill="url(#${id}-s)" opacity="0.6"/>
  <!-- Head -->
  <ellipse cx="152" cy="18" rx="20" ry="15" fill="url(#${id}-b)"/>
  <!-- Ossicones -->
  <rect x="143" y="4"  width="5" height="12" rx="2" fill="#9A9A9A"/>
  <rect x="160" y="5"  width="5" height="11" rx="2" fill="#9A9A9A"/>
  <circle cx="145" cy="4"  r="4" fill="#7A7A7A"/>
  <circle cx="162" cy="5"  r="4" fill="#7A7A7A"/>
  <!-- Eye -->
  <circle cx="145" cy="16" r="5" fill="#1A1A1A"/>
  <circle cx="147" cy="14" r="2" fill="rgba(255,255,255,0.3)"/>
  <!-- Nostril -->
  <ellipse cx="165" cy="22" rx="5" ry="3" fill="#6A6A6A"/>
  <!-- Legs -->
  <rect x="114" y="265" width="18" height="32" rx="9" fill="#9A9A9A"/>
  <rect x="140" y="267" width="18" height="30" rx="9" fill="#9A9A9A"/>
  <rect x="164" y="265" width="18" height="32" rx="9" fill="#9A9A9A"/>
  <!-- Tail -->
  <path d="M202 225 Q218 218 222 235" stroke="#9A9A9A" stroke-width="4" fill="none" stroke-linecap="round"/>
  <ellipse cx="223" cy="237" rx="5" ry="8" fill="#8A8A8A" transform="rotate(20 223 237)"/>
</svg>`;
}

function svgRhino(id) {
  return `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="${id}-b" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#C8C8C8"/><stop offset="100%" stop-color="#6A6A6A"/>
    </radialGradient>
    <radialGradient id="${id}-h" cx="30%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#B0B0B0"/><stop offset="100%" stop-color="#5A5A5A"/>
    </radialGradient>
  </defs>
  <ellipse cx="150" cy="293" rx="95" ry="6" fill="rgba(0,0,0,0.22)"/>
  <!-- Body -->
  <ellipse cx="155" cy="195" rx="92" ry="72" fill="url(#${id}-b)"/>
  <!-- Neck folds / texture -->
  <path d="M95 180 Q88 195 90 210" stroke="#8A8A8A" stroke-width="4" fill="none" opacity="0.5"/>
  <path d="M90 185 Q83 198 84 212" stroke="#8A8A8A" stroke-width="3" fill="none" opacity="0.4"/>
  <!-- Head -->
  <ellipse cx="80" cy="175" rx="52" ry="40" fill="url(#${id}-h)"/>
  <!-- Horn (front) -->
  <path d="M42 165 Q30 140 38 118" stroke="#9A9A9A" stroke-width="12" fill="none" stroke-linecap="round"/>
  <ellipse cx="37" cy="117" rx="8" ry="5" fill="#8A8A8A" transform="rotate(-20 37 117)"/>
  <!-- Horn (rear, smaller) -->
  <path d="M68 153 Q60 138 66 126" stroke="#8A8A8A" stroke-width="8" fill="none" stroke-linecap="round"/>
  <!-- Eye -->
  <circle cx="92" cy="165" r="8" fill="#1A1A1A"/>
  <circle cx="94" cy="163" r="3" fill="rgba(255,255,255,0.25)"/>
  <!-- Ear -->
  <ellipse cx="108" cy="145" rx="14" ry="10" fill="url(#${id}-h)" transform="rotate(-25 108 145)"/>
  <ellipse cx="108" cy="145" rx="8"  ry="6"  fill="#0B0B0B" transform="rotate(-25 108 145)"/>
  <!-- Nostril -->
  <ellipse cx="42" cy="178" rx="6" ry="4" fill="#3A3A3A" transform="rotate(-10 42 178)"/>
  <!-- Lip fold -->
  <path d="M38 184 Q55 190 70 182" stroke="#5A5A5A" stroke-width="3" fill="none"/>
  <!-- Legs (short and stocky) -->
  <rect x="90"  y="248" width="32" height="46" rx="16" fill="url(#${id}-b)"/>
  <rect x="135" y="250" width="32" height="44" rx="16" fill="url(#${id}-b)"/>
  <rect x="178" y="248" width="32" height="46" rx="16" fill="url(#${id}-b)"/>
  <rect x="222" y="245" width="28" height="49" rx="14" fill="url(#${id}-h)"/>
  <!-- Tail -->
  <path d="M246 195 Q266 188 268 205 Q270 218 260 222" stroke="#9A9A9A" stroke-width="5" fill="none" stroke-linecap="round"/>
  <circle cx="259" cy="224" r="7" fill="#8A8A8A"/>
</svg>`;
}

function svgBird(id) {
  return `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="${id}-w" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#E0E0E0"/><stop offset="100%" stop-color="#9A9A9A"/>
    </linearGradient>
    <radialGradient id="${id}-b" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#D0D0D0"/><stop offset="100%" stop-color="#7A7A7A"/>
    </radialGradient>
  </defs>
  <ellipse cx="150" cy="292" rx="30" ry="5" fill="rgba(0,0,0,0.2)"/>
  <!-- Left wing (spread) -->
  <path d="M138 148 Q90 120 45 108 Q25 104 20 115 Q18 128 50 130 Q85 132 120 148" fill="url(#${id}-w)" stroke="#8A8A8A" stroke-width="1"/>
  <!-- Right wing (spread) -->
  <path d="M162 148 Q210 120 255 108 Q275 104 280 115 Q282 128 250 130 Q215 132 180 148" fill="url(#${id}-w)" stroke="#8A8A8A" stroke-width="1"/>
  <!-- Wing feather details — left -->
  <path d="M125 144 Q90 122 55 112" stroke="#9A9A9A" stroke-width="1.5" fill="none" opacity="0.6"/>
  <path d="M120 150 Q78 135 40 128" stroke="#9A9A9A" stroke-width="1.5" fill="none" opacity="0.6"/>
  <!-- Wing feather details — right -->
  <path d="M175 144 Q210 122 245 112" stroke="#9A9A9A" stroke-width="1.5" fill="none" opacity="0.6"/>
  <path d="M180 150 Q222 135 260 128" stroke="#9A9A9A" stroke-width="1.5" fill="none" opacity="0.6"/>
  <!-- Body -->
  <ellipse cx="150" cy="170" rx="26" ry="36" fill="url(#${id}-b)"/>
  <!-- Head -->
  <circle cx="150" cy="122" r="22" fill="url(#${id}-b)"/>
  <!-- Beak -->
  <path d="M166 118 L185 112 L168 125 Z" fill="#8A8A8A"/>
  <!-- Eye -->
  <circle cx="155" cy="116" r="6" fill="#1A1A1A"/>
  <circle cx="157" cy="114" r="2" fill="rgba(255,255,255,0.4)"/>
  <!-- Tail feathers -->
  <path d="M140 202 Q128 225 118 248" stroke="url(#${id}-b)" stroke-width="9" fill="none" stroke-linecap="round"/>
  <path d="M150 204 Q150 228 150 252" stroke="url(#${id}-b)" stroke-width="9" fill="none" stroke-linecap="round"/>
  <path d="M160 202 Q172 225 182 248" stroke="url(#${id}-b)" stroke-width="9" fill="none" stroke-linecap="round"/>
  <!-- Talons / perch feet -->
  <line x1="143" y1="250" x2="123" y2="272" stroke="#7A7A7A" stroke-width="4" stroke-linecap="round"/>
  <line x1="143" y1="250" x2="133" y2="276" stroke="#7A7A7A" stroke-width="4" stroke-linecap="round"/>
  <line x1="143" y1="250" x2="143" y2="278" stroke="#7A7A7A" stroke-width="4" stroke-linecap="round"/>
  <line x1="157" y1="250" x2="167" y2="278" stroke="#7A7A7A" stroke-width="4" stroke-linecap="round"/>
  <line x1="157" y1="250" x2="177" y2="276" stroke="#7A7A7A" stroke-width="4" stroke-linecap="round"/>
  <line x1="157" y1="250" x2="157" y2="278" stroke="#7A7A7A" stroke-width="4" stroke-linecap="round"/>
</svg>`;
}

function svgAbstract(id) {
  return `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="${id}-g1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#D0D0D0"/><stop offset="100%" stop-color="#7A7A7A"/>
    </linearGradient>
    <linearGradient id="${id}-g2" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#C8A84B"/><stop offset="100%" stop-color="#8A6A20"/>
    </linearGradient>
    <linearGradient id="${id}-g3" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#B0B0B0"/><stop offset="100%" stop-color="#5A5A5A"/>
    </linearGradient>
  </defs>
  <ellipse cx="150" cy="291" rx="85" ry="7" fill="rgba(0,0,0,0.2)"/>
  <!-- Base triangle -->
  <polygon points="150,30 260,240 40,240" fill="url(#${id}-g1)" stroke="#9A9A9A" stroke-width="2"/>
  <!-- Inner accent -->
  <polygon points="150,70 230,220 70,220" fill="url(#${id}-g3)" opacity="0.5"/>
  <!-- Central orb -->
  <circle cx="150" cy="148" r="30" fill="url(#${id}-g2)"/>
  <!-- Ring -->
  <circle cx="150" cy="148" r="40" fill="none" stroke="#C8A84B" stroke-width="3" opacity="0.6"/>
  <circle cx="150" cy="148" r="50" fill="none" stroke="#C8C8C8" stroke-width="1.5" opacity="0.4"/>
  <!-- Geometric accent lines -->
  <line x1="150" y1="30" x2="150" y2="108" stroke="#D0D0D0" stroke-width="2" opacity="0.7"/>
  <line x1="150" y1="188" x2="150" y2="240" stroke="#D0D0D0" stroke-width="2" opacity="0.7"/>
  <line x1="108" y1="148" x2="40" y2="240" stroke="#C0C0C0" stroke-width="1.5" opacity="0.5"/>
  <line x1="192" y1="148" x2="260" y2="240" stroke="#C0C0C0" stroke-width="1.5" opacity="0.5"/>
  <!-- Base platform -->
  <rect x="50" y="240" width="200" height="14" rx="7" fill="url(#${id}-g3)"/>
  <rect x="80" y="252" width="140" height="8" rx="4" fill="#6A6A6A"/>
</svg>`;
}

// SVG view generators (slight angle variations)
function svgLionSeated(id) {
  return `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="${id}-m" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#C8944A"/><stop offset="100%" stop-color="#6A4820"/>
    </radialGradient>
    <radialGradient id="${id}-b" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#E0E0E0"/><stop offset="100%" stop-color="#8A8A8A"/>
    </radialGradient>
  </defs>
  <ellipse cx="150" cy="292" rx="75" ry="6" fill="rgba(0,0,0,0.22)"/>
  <!-- Mane -->
  <circle cx="150" cy="105" r="72" fill="url(#${id}-m)" opacity="0.9"/>
  <!-- Head -->
  <circle cx="150" cy="100" r="51" fill="url(#${id}-b)"/>
  <!-- Seated body -->
  <ellipse cx="150" cy="228" rx="62" ry="60" fill="url(#${id}-b)"/>
  <!-- Haunches -->
  <ellipse cx="100" cy="248" rx="30" ry="38" fill="#9A9A9A"/>
  <ellipse cx="200" cy="248" rx="30" ry="38" fill="#9A9A9A"/>
  <!-- Front paws -->
  <rect x="118" y="240" width="20" height="42" rx="10" fill="#A8A8A8"/>
  <rect x="162" y="240" width="20" height="42" rx="10" fill="#A8A8A8"/>
  <ellipse cx="128" cy="282" rx="13" ry="5" fill="#8A8A8A"/>
  <ellipse cx="172" cy="282" rx="13" ry="5" fill="#8A8A8A"/>
  <!-- Ears -->
  <circle cx="110" cy="62" r="16" fill="#9A9A9A"/>
  <circle cx="190" cy="62" r="16" fill="#9A9A9A"/>
  <circle cx="110" cy="62" r="9"  fill="#1A1A1A"/>
  <circle cx="190" cy="62" r="9"  fill="#1A1A1A"/>
  <!-- Eyes -->
  <ellipse cx="132" cy="95" rx="9" ry="7" fill="#1A1A1A"/>
  <ellipse cx="168" cy="95" rx="9" ry="7" fill="#1A1A1A"/>
  <circle cx="134" cy="93" r="3" fill="rgba(255,255,255,0.35)"/>
  <circle cx="170" cy="93" r="3" fill="rgba(255,255,255,0.35)"/>
  <!-- Snout -->
  <ellipse cx="150" cy="115" rx="16" ry="10" fill="#9A9A9A"/>
  <ellipse cx="150" cy="112" rx="8"  ry="6"  fill="#0B0B0B"/>
  <path d="M141 120 Q150 128 159 120" stroke="#2A2A2A" stroke-width="2" fill="none" stroke-linecap="round"/>
</svg>`;
}

function svgFlamingo(id) {
  return `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="${id}-b" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#D8D8D8"/><stop offset="100%" stop-color="#8A8A8A"/>
    </linearGradient>
  </defs>
  <ellipse cx="150" cy="292" rx="50" ry="5" fill="rgba(0,0,0,0.18)"/>
  <!-- Body (left flamingo) -->
  <ellipse cx="118" cy="168" rx="28" ry="38" fill="url(#${id}-b)" transform="rotate(-15 118 168)"/>
  <!-- Body (right flamingo) -->
  <ellipse cx="182" cy="172" rx="26" ry="36" fill="#B8B8B8" transform="rotate(12 182 172)"/>
  <!-- Wings detail -->
  <path d="M94 155 Q80 140 78 125" stroke="#C8C8C8" stroke-width="10" fill="none" stroke-linecap="round"/>
  <path d="M142 158 Q158 140 162 122" stroke="#A8A8A8" stroke-width="9" fill="none" stroke-linecap="round"/>
  <!-- Necks -->
  <path d="M118 130 Q112 100 108 75 Q105 55 110 40" stroke="url(#${id}-b)" stroke-width="10" fill="none" stroke-linecap="round"/>
  <path d="M182 136 Q188 108 192 82 Q196 60 190 45" stroke="#B8B8B8" stroke-width="9" fill="none" stroke-linecap="round"/>
  <!-- Heads -->
  <circle cx="112" cy="36" r="14" fill="url(#${id}-b)"/>
  <circle cx="188" cy="42" r="13" fill="#B8B8B8"/>
  <!-- Beaks (curved) -->
  <path d="M122 30 Q135 28 138 34 Q135 40 122 42" stroke="#7A7A7A" stroke-width="3" fill="#7A7A7A"/>
  <path d="M178 36 Q166 32 162 38 Q165 44 178 48" stroke="#6A6A6A" stroke-width="3" fill="#6A6A6A"/>
  <!-- Eyes -->
  <circle cx="108" cy="32" r="4" fill="#0B0B0B"/>
  <circle cx="192" cy="38" r="4" fill="#0B0B0B"/>
  <!-- Legs -->
  <line x1="112" y1="204" x2="108" y2="260" stroke="#8A8A8A" stroke-width="5" stroke-linecap="round"/>
  <line x1="125" y1="205" x2="128" y2="262" stroke="#8A8A8A" stroke-width="5" stroke-linecap="round"/>
  <line x1="172" y1="207" x2="168" y2="264" stroke="#7A7A7A" stroke-width="4.5" stroke-linecap="round"/>
  <line x1="186" y1="208" x2="190" y2="265" stroke="#7A7A7A" stroke-width="4.5" stroke-linecap="round"/>
  <!-- Feet -->
  <path d="M101 261 Q108 272 115 261" stroke="#8A8A8A" stroke-width="3" fill="none"/>
  <path d="M121 263 Q128 274 135 263" stroke="#8A8A8A" stroke-width="3" fill="none"/>
  <path d="M161 265 Q168 276 175 265" stroke="#7A7A7A" stroke-width="2.5" fill="none"/>
  <path d="M183 266 Q190 277 197 266" stroke="#7A7A7A" stroke-width="2.5" fill="none"/>
</svg>`;
}

function svgGeometric(id) {
  return `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="${id}-g1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E0E0E0"/><stop offset="100%" stop-color="#7A7A7A"/>
    </linearGradient>
    <linearGradient id="${id}-g2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#D0D0D0"/><stop offset="100%" stop-color="#5A5A5A"/>
    </linearGradient>
  </defs>
  <ellipse cx="150" cy="291" rx="90" ry="7" fill="rgba(0,0,0,0.2)"/>
  <!-- Human figure 1 — left -->
  <circle cx="95"  cy="55"  r="22" fill="url(#${id}-g1)" stroke="#AAAAAA" stroke-width="1.5"/>
  <rect   x="80"  y="78"   width="30" height="60" rx="15" fill="url(#${id}-g2)"/>
  <rect   x="70"  y="80"   width="14" height="48" rx="7"  fill="#9A9A9A"/>
  <rect   x="96"  y="80"   width="14" height="48" rx="7"  fill="#9A9A9A"/>
  <rect   x="82"  y="138"  width="14" height="55" rx="7"  fill="url(#${id}-g2)"/>
  <rect   x="99"  y="138"  width="14" height="55" rx="7"  fill="url(#${id}-g2)"/>
  <!-- Human figure 2 — right -->
  <circle cx="205" cy="55"  r="22" fill="url(#${id}-g1)" stroke="#AAAAAA" stroke-width="1.5"/>
  <rect   x="190" y="78"   width="30" height="60" rx="15" fill="url(#${id}-g2)"/>
  <rect   x="180" y="80"   width="14" height="48" rx="7"  fill="#9A9A9A"/>
  <rect   x="206" y="80"   width="14" height="48" rx="7"  fill="#9A9A9A"/>
  <rect   x="188" y="138"  width="14" height="55" rx="7"  fill="url(#${id}-g2)"/>
  <rect   x="205" y="138"  width="14" height="55" rx="7"  fill="url(#${id}-g2)"/>
  <!-- Connecting arch between them -->
  <path d="M95 48 Q150 12 205 48" stroke="url(#${id}-g1)" stroke-width="8" fill="none" stroke-linecap="round"/>
  <!-- Central star/connection -->
  <polygon points="150,148 158,165 175,165 162,176 166,194 150,183 134,194 138,176 125,165 142,165" fill="url(#${id}-g1)" stroke="#C8A84B" stroke-width="1.5"/>
  <!-- Base platform -->
  <rect x="40" y="248" width="220" height="16" rx="8" fill="url(#${id}-g2)"/>
  <rect x="65" y="262" width="170" height="9"  rx="4" fill="#5A5A5A"/>
</svg>`;
}

// ============================================================
// CATALOG DATA
// ============================================================
const SCULPTURE_CATALOG = {

  categories: [
    {
      id: 'lions',
      name: 'Lions',
      tagline: 'King of the Savanna',
      emoji: '🦁',
      description: 'Commanding lion sculptures that bring regal power to any space. Each piece captures the majestic spirit of Africa\'s apex predator, hand-welded from premium recycled steel.',
      accentColor: '#C0934A'
    },
    {
      id: 'elephants',
      name: 'Elephants',
      tagline: 'Ancient Wisdom',
      emoji: '🐘',
      description: 'Majestic elephant sculptures symbolising wisdom, strength and family. Perfect centrepieces for hotel lobbies, lodge gardens, and private estates.',
      accentColor: '#8A9BA8'
    },
    {
      id: 'giraffes',
      name: 'Giraffes',
      tagline: 'Graceful Heights',
      emoji: '🦒',
      description: 'Elegant towering giraffe sculptures that add dramatic vertical interest to any interior or garden. Each piece is a testament to Africa\'s most distinctive silhouette.',
      accentColor: '#C09840'
    },
    {
      id: 'rhinos',
      name: 'Rhinos',
      tagline: 'Armoured Power',
      emoji: '🦏',
      description: 'Powerful rhino sculptures embodying raw strength and resilience. A bold statement piece for collectors, architects, and conservation supporters.',
      accentColor: '#7A7A7A'
    },
    {
      id: 'birds',
      name: 'Birds',
      tagline: 'In Flight',
      emoji: '🦅',
      description: 'Lightweight and dynamic bird sculptures capturing motion, freedom and grace. Ideal for indoor displays, garden features, and corporate art installations.',
      accentColor: '#8AA0B8'
    },
    {
      id: 'abstract',
      name: 'Abstract Art',
      tagline: 'Bespoke Vision',
      emoji: '🎨',
      description: 'Avant-garde sculptural forms blending African motifs with contemporary design. One-of-a-kind statement pieces for galleries, modern interiors, and discerning collectors.',
      accentColor: '#9090C0'
    }
  ],

  products: [
    // ── LIONS ──────────────────────────────────────────────
    {
      id: 'lion-king',
      categoryId: 'lions',
      name: 'King of the Savanna',
      tagline: 'Standing male lion, full mane',
      description: 'Our iconic standing male lion with a full dramatic mane, crafted from thick-gauge recycled steel. The king\'s commanding stance — chest forward, gaze fixed — makes this the ultimate statement piece for hotel lobbies, corporate entrances, and private estates. Every weld is hand-finished.',
      basePrice: 25000,
      featured: true,
      getSvg: () => svgLion('lion-king')
    },
    {
      id: 'lion-seated',
      categoryId: 'lions',
      name: 'The Resting King',
      tagline: 'Seated lion, contemplative pose',
      description: 'A beautifully composed seated lion, conveying quiet authority and power at rest. Slightly smaller than our standing model, making it perfect for indoor living spaces, boardrooms, and gallery pedestals. Hand-welded from recycled metal with signature brushed finish.',
      basePrice: 22000,
      featured: false,
      getSvg: () => svgLionSeated('lion-seated')
    },
    {
      id: 'lion-cub',
      categoryId: 'lions',
      name: 'Lion Cub',
      tagline: 'Playful young cub sculpture',
      description: 'A charming miniature cub piece — full of youthful energy and detail. The perfect gift for wildlife lovers, or a companion piece alongside our full-sized King. Ideal for shelves, desks, and small garden displays.',
      basePrice: 12000,
      featured: false,
      getSvg: () => svgLionSeated('lion-cub')
    },

    // ── ELEPHANTS ──────────────────────────────────────────
    {
      id: 'elephant-majesty',
      categoryId: 'elephants',
      name: 'Elephant Majesty',
      tagline: 'Large walking elephant',
      description: 'A majestic large elephant in full stride — trunk raised, tusks gleaming. Sculpted from heavy-gauge steel with intricate surface texture that mimics the wrinkled skin of an African elephant. The raised trunk is a traditional symbol of good fortune.',
      basePrice: 35000,
      featured: true,
      getSvg: () => svgElephant('elephant-majesty')
    },
    {
      id: 'elephant-family',
      categoryId: 'elephants',
      name: 'Mother & Calf',
      tagline: 'Elephant pair — bond of family',
      description: 'A deeply moving composition of a mother elephant gently guiding her calf. Two sculptures unified in a single base, representing the unbreakable bond of family. A favourite for lodges, conservation centres, and family homes.',
      basePrice: 45000,
      featured: false,
      getSvg: () => svgElephant('elephant-family')
    },

    // ── GIRAFFES ──────────────────────────────────────────
    {
      id: 'giraffe-tall',
      categoryId: 'giraffes',
      name: 'Graceful Heights',
      tagline: 'Full standing giraffe',
      description: 'Africa\'s most recognisable silhouette, rendered in stunning steel. Our tall giraffe sculpture creates dramatic vertical impact in any space — from atrium installations to garden centrepieces. Each spot pattern is uniquely hand-cut.',
      basePrice: 22000,
      featured: true,
      getSvg: () => svgGiraffe('giraffe-tall')
    },
    {
      id: 'giraffe-feeding',
      categoryId: 'giraffes',
      name: 'Savanna Elegance',
      tagline: 'Giraffe in feeding pose',
      description: 'A giraffe bent gracefully to feed — a dynamic pose that shows off the flowing neck in full. This composition works beautifully as a garden focal point and is frequently commissioned for safari lodge courtyards.',
      basePrice: 26000,
      featured: false,
      getSvg: () => svgGiraffe('giraffe-feeding')
    },

    // ── RHINOS ────────────────────────────────────────────
    {
      id: 'rhino-charge',
      categoryId: 'rhinos',
      name: 'Rhino Strength',
      tagline: 'Charging rhino, full power',
      description: 'A charging rhino frozen in mid-stride — raw power, armoured hide, and forward momentum captured in steel. A bold statement for contemporary spaces and conservation-themed installations. Built from heavy recycled plate steel for authentic weight and presence.',
      basePrice: 28000,
      featured: true,
      getSvg: () => svgRhino('rhino-charge')
    },
    {
      id: 'rhino-grazing',
      categoryId: 'rhinos',
      name: 'Gentle Giant',
      tagline: 'Grazing rhino, peaceful pose',
      description: 'The rhino at rest — head lowered, calm and immovable. This sculpture captures the peaceful side of one of Africa\'s most powerful animals. Perfect for gardens, courtyards, and conservation memorial spaces.',
      basePrice: 24000,
      featured: false,
      getSvg: () => svgRhino('rhino-grazing')
    },

    // ── BIRDS ─────────────────────────────────────────────
    {
      id: 'eagle-flight',
      categoryId: 'birds',
      name: 'Eagle in Flight',
      tagline: 'Spread-winged eagle, soaring',
      description: 'A magnificent eagle with wings fully spread, suspended in eternal flight. Cast from lightweight sheet steel, this sculpture can be wall-mounted or placed on a pedestal. The wingspan and detail make it one of our most requested pieces.',
      basePrice: 15000,
      featured: true,
      getSvg: () => svgBird('eagle-flight')
    },
    {
      id: 'flamingo-pair',
      categoryId: 'birds',
      name: 'Flamingo Pair',
      tagline: 'Two flamingos, Lake Nakuru inspired',
      description: 'Inspired by the million-flamingo spectacle of Lake Nakuru, this elegant pair sculpture captures the grace, poise and romance of East Africa\'s most photographed birds. A favourite for poolside displays and hotel gardens.',
      basePrice: 18000,
      featured: false,
      getSvg: () => svgFlamingo('flamingo-pair')
    },
    {
      id: 'hornbill-perch',
      categoryId: 'birds',
      name: 'African Hornbill',
      tagline: 'Hornbill perched on branch',
      description: 'The distinctive hornbill — with its magnificent beak — perched proudly on a sculpted steel branch. A smaller, intricate piece full of character and detail. Perfect for indoor shelves, offices, and personal collections.',
      basePrice: 10000,
      featured: false,
      getSvg: () => svgBird('hornbill-perch')
    },

    // ── ABSTRACT ──────────────────────────────────────────
    {
      id: 'abstract-ubuntu',
      categoryId: 'abstract',
      name: 'Ubuntu Spirit',
      tagline: 'Human unity — I am because we are',
      description: 'An abstract composition of interconnected human forms arranged in a circle of unity. Inspired by the Bantu philosophy of Ubuntu — "I am because we are." This geometric steel sculpture is a powerful statement for corporate lobbies, public spaces, and modern homes.',
      basePrice: 20000,
      featured: true,
      getSvg: () => svgGeometric('abstract-ubuntu')
    },
    {
      id: 'abstract-pyramid',
      categoryId: 'abstract',
      name: 'Geometric Fauna',
      tagline: 'Abstract wildlife in geometric form',
      description: 'Wildlife motifs deconstructed into bold geometric shapes — triangles, planes, and intersecting forms that suggest animal silhouettes without depicting them literally. A sophisticated conversation piece for contemporary art spaces and collector interiors.',
      basePrice: 18000,
      featured: false,
      getSvg: () => svgAbstract('abstract-pyramid')
    }
  ]
};

// Helper: get products by category
function getProductsByCategory(categoryId) {
  return SCULPTURE_CATALOG.products.filter(p => p.categoryId === categoryId);
}

// Helper: get product by id
function getProductById(productId) {
  return SCULPTURE_CATALOG.products.find(p => p.id === productId);
}

// Helper: get category by id
function getCategoryById(categoryId) {
  return SCULPTURE_CATALOG.categories.find(c => c.id === categoryId);
}
