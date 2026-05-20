import './AuthIllustration.css'

function AuthIllustration() {
  return (
    <div className="illustration-panel">
      <svg
        viewBox="0 0 480 540"
        xmlns="http://www.w3.org/2000/svg"
        className="illustration-svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="screenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f472b6" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
          <filter id="phoneShadow" x="-15%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="6" dy="12" stdDeviation="10" floodColor="rgba(0,0,0,0.28)" />
          </filter>
          <filter id="lockShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="3" dy="5" stdDeviation="5" floodColor="rgba(0,0,0,0.2)" />
          </filter>
        </defs>

        {/* Cloud — top left */}
        <g opacity="0.92">
          <ellipse cx="56" cy="72" rx="36" ry="22" fill="white" />
          <ellipse cx="82" cy="59" rx="28" ry="21" fill="white" />
          <ellipse cx="106" cy="70" rx="23" ry="17" fill="white" />
          <rect x="36" y="72" width="92" height="20" rx="4" fill="white" />
        </g>

        {/* Cloud — top right */}
        <g opacity="0.88">
          <ellipse cx="388" cy="54" rx="30" ry="18" fill="white" />
          <ellipse cx="411" cy="43" rx="24" ry="18" fill="white" />
          <ellipse cx="430" cy="52" rx="19" ry="14" fill="white" />
          <rect x="369" y="54" width="79" height="16" rx="4" fill="white" />
        </g>

        {/* Cloud — bottom left */}
        <g opacity="0.85">
          <ellipse cx="42" cy="460" rx="38" ry="24" fill="white" />
          <ellipse cx="70" cy="447" rx="30" ry="22" fill="white" />
          <ellipse cx="97" cy="458" rx="24" ry="17" fill="white" />
          <rect x="22" y="460" width="97" height="22" rx="4" fill="white" />
        </g>

        {/* Cloud — bottom right */}
        <g opacity="0.85">
          <ellipse cx="400" cy="472" rx="36" ry="22" fill="white" />
          <ellipse cx="426" cy="460" rx="28" ry="20" fill="white" />
          <ellipse cx="450" cy="470" rx="22" ry="16" fill="white" />
          <rect x="382" y="472" width="90" height="20" rx="4" fill="white" />
        </g>

        {/* Phone body */}
        <rect
          x="218"
          y="88"
          width="152"
          height="292"
          rx="22"
          fill="#15162b"
          filter="url(#phoneShadow)"
        />
        {/* Phone screen */}
        <rect
          x="229"
          y="103"
          width="130"
          height="265"
          rx="13"
          fill="url(#screenGrad)"
        />
        {/* Notch */}
        <rect x="266" y="95" width="48" height="9" rx="4.5" fill="#0a0b18" />

        {/* Phone top-bar icons */}
        <circle cx="302" cy="118" r="7" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.4" />
        <circle cx="302" cy="118" r="2.5" fill="rgba(255,255,255,0.55)" />
        <line x1="313" y1="114" x2="325" y2="114" stroke="rgba(255,255,255,0.5)" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="313" y1="118" x2="325" y2="118" stroke="rgba(255,255,255,0.5)" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="313" y1="122" x2="325" y2="122" stroke="rgba(255,255,255,0.5)" strokeWidth="1.4" strokeLinecap="round" />

        {/* Scan-frame corners */}
        <g stroke="white" strokeWidth="2.8" fill="none" strokeLinecap="round" opacity="0.9">
          <path d="M 252 158 L 252 142 L 268 142" />
          <path d="M 336 158 L 336 142 L 320 142" />
          <path d="M 252 258 L 252 274 L 268 274" />
          <path d="M 336 258 L 336 274 L 320 274" />
        </g>

        {/* Fingerprint whorl */}
        <g
          transform="translate(294, 208)"
          fill="none"
          stroke="rgba(255,255,255,0.88)"
          strokeWidth="1.6"
          strokeLinecap="round"
        >
          <circle cx="0" cy="0" r="3.5" fill="white" stroke="none" />
          <path d="M 0 -9 A 9 9 0 0 1 9 0 A 9 9 0 0 1 0 9 A 9 9 0 0 1 -9 0 A 9 9 0 0 1 -6 -7" />
          <path d="M -2 -16 A 16 16 0 0 1 16 -2 A 16 16 0 0 1 2 16 A 16 16 0 0 1 -16 0 A 16 16 0 0 1 -12 -11" />
          <path d="M -4 -23 A 23 23 0 0 1 23 -4 A 23 23 0 0 1 4 23 A 23 23 0 0 1 -23 0 A 23 23 0 0 1 -18 -16" />
          <path d="M -6 -30 A 30 30 0 0 1 30 -6 A 30 30 0 0 1 6 30 A 30 30 0 0 1 -30 0 A 30 30 0 0 1 -24 -20" />
          <path d="M -8 -37 A 37 37 0 0 1 37 -8 A 37 37 0 0 1 8 37 A 37 37 0 0 1 -37 0 A 37 37 0 0 1 -30 -24" />
        </g>

        {/* Progress bar */}
        <rect x="254" y="296" width="80" height="4" rx="2" fill="rgba(255,255,255,0.2)" />
        <rect x="254" y="296" width="50" height="4" rx="2" fill="rgba(255,255,255,0.88)" />

        {/* Instruction text */}
        <text x="294" y="316" textAnchor="middle" fill="rgba(255,255,255,0.75)" fontSize="8.5">
          Please tap your finger
        </text>
        <text x="294" y="328" textAnchor="middle" fill="rgba(255,255,255,0.75)" fontSize="8.5">
          to your phone
        </text>

        {/* Lock icon */}
        <g transform="translate(415, 310)" filter="url(#lockShadow)">
          <rect x="-22" y="2" width="44" height="35" rx="7" fill="white" />
          <path
            d="M -12 2 L -12 -16 A 12 12 0 0 1 12 -16 L 12 2"
            fill="none"
            stroke="white"
            strokeWidth="5.5"
            strokeLinecap="round"
          />
          <circle cx="0" cy="16" r="6" fill="#9b7fd4" />
          <rect x="-2.5" y="16" width="5" height="9" rx="1.5" fill="#9b7fd4" />
        </g>

        {/* Check-mark speech bubble */}
        <g transform="translate(115, 200)">
          <rect x="-32" y="-28" width="64" height="52" rx="14" fill="white" />
          <polygon points="0,24 -10,38 12,38" fill="white" />
          <path
            d="M -14 0 L -4 10 L 16 -12"
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* Person — hair */}
        <ellipse cx="152" cy="247" rx="22" ry="13" fill="#1e293b" />
        {/* Person — head */}
        <circle cx="152" cy="264" r="21" fill="#fcd34d" />
        {/* Person — face */}
        <circle cx="144" cy="262" r="3" fill="#1e293b" opacity="0.65" />
        <circle cx="160" cy="262" r="3" fill="#1e293b" opacity="0.65" />
        <path d="M 144 271 Q 152 277 160 271" fill="none" stroke="#1e293b" strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />

        {/* Person — jacket body */}
        <path
          d="M 130 284 Q 127 340 132 368 L 172 368 Q 177 340 174 284 Q 165 272 152 270 Q 139 272 130 284"
          fill="#f59e0b"
        />

        {/* Person — bag strap */}
        <path d="M 142 278 Q 122 300 118 328" stroke="#94a3b8" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        {/* Person — bag */}
        <rect x="106" y="326" width="26" height="22" rx="5" fill="#475569" />
        <rect x="112" y="323" width="10" height="6" rx="2" fill="#475569" />

        {/* Person — right arm (extended to phone) */}
        <path
          d="M 174 300 Q 196 294 218 308"
          stroke="#f59e0b"
          strokeWidth="17"
          fill="none"
          strokeLinecap="round"
        />
        {/* Person — hand */}
        <circle cx="218" cy="308" r="10" fill="#fcd34d" />

        {/* Person — left arm */}
        <path
          d="M 130 300 Q 116 310 114 326"
          stroke="#f59e0b"
          strokeWidth="15"
          fill="none"
          strokeLinecap="round"
        />

        {/* Person — pants */}
        <path d="M 137 366 Q 132 404 136 432" stroke="#f1f5f9" strokeWidth="17" fill="none" strokeLinecap="round" />
        <path d="M 167 366 Q 172 404 168 432" stroke="#f1f5f9" strokeWidth="17" fill="none" strokeLinecap="round" />

        {/* Person — shoes */}
        <ellipse cx="133" cy="436" rx="18" ry="9" fill="#1e293b" />
        <ellipse cx="171" cy="436" rx="18" ry="9" fill="#1e293b" />
        <ellipse cx="131" cy="434" rx="12" ry="6" fill="#334155" />
        <ellipse cx="173" cy="434" rx="12" ry="6" fill="#334155" />
      </svg>
    </div>
  )
}

export default AuthIllustration
