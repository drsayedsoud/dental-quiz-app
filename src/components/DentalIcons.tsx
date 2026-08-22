import React from 'react';

export function EndodonticIcon({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="endoTooth" x1="20" y1="10" x2="80" y2="90" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F8FAFC" />
          <stop offset="0.7" stopColor="#E2E8F0" />
          <stop offset="1" stopColor="#CBD5E1" />
        </linearGradient>
        <linearGradient id="endoPulp" x1="50" y1="25" x2="50" y2="85" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF453A" />
          <stop offset="0.5" stopColor="#FF9F0A" />
          <stop offset="1" stopColor="#FFD60A" />
        </linearGradient>
        <linearGradient id="endoGlow" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#06B6D4" stopOpacity="0.3" />
          <stop offset="1" stopColor="#3B82F6" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="url(#endoGlow)" stroke="#06B6D4" strokeWidth="1.5" strokeDasharray="3 3" />
      {/* Outer Tooth Shape */}
      <path
        d="M32 18 C22 18 16 28 18 42 C19 52 24 64 28 85 C30 92 37 92 39 84 C42 70 47 52 50 52 C53 52 58 70 61 84 C63 92 70 92 72 85 C76 64 81 52 82 42 C84 28 78 18 68 18 C60 18 55 24 50 24 C45 24 40 18 32 18 Z"
        fill="url(#endoTooth)"
        stroke="#94A3B8"
        strokeWidth="2"
      />
      {/* Root Canal / Pulp System (Yellow & Red Root Canal Filling) */}
      <path
        d="M38 30 C34 30 32 35 34 42 C36 48 38 60 34 82 C35 84 37 84 37 82 C41 62 46 45 48 45 C50 45 50 45 50 35 C50 30 45 30 38 30 Z"
        fill="url(#endoPulp)"
      />
      <path
        d="M62 30 C66 30 68 35 66 42 C64 48 62 60 66 82 C65 84 63 84 63 82 C59 62 54 45 52 45 C50 45 50 45 50 35 C50 30 55 30 62 30 Z"
        fill="url(#endoPulp)"
      />
      {/* Endodontic File Indicator */}
      <line x1="34" y1="84" x2="34" y2="25" stroke="#06B6D4" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="2 4" />
      <circle cx="34" cy="22" r="4" fill="#06B6D4" />
      <circle cx="64" cy="22" r="4" fill="#F59E0B" />
      <line x1="64" y1="84" x2="64" y2="25" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="2 4" />
    </svg>
  );
}

export function OperativeIcon({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="opTooth" x1="20" y1="15" x2="80" y2="85" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#CBD5E1" />
        </linearGradient>
        <linearGradient id="fillingGrad" x1="35" y1="20" x2="65" y2="45" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38BDF8" />
          <stop offset="0.5" stopColor="#0284C7" />
          <stop offset="1" stopColor="#0369A1" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="#0284C7" fillOpacity="0.1" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="3 3" />
      {/* Tooth */}
      <path
        d="M32 20 C22 20 16 30 18 44 C19 54 24 66 28 85 C30 91 37 91 39 84 C42 70 47 54 50 54 C53 54 58 70 61 84 C63 91 70 91 72 85 C76 66 81 54 82 44 C84 30 78 20 68 20 C60 20 55 25 50 25 C45 25 40 20 32 20 Z"
        fill="url(#opTooth)"
        stroke="#94A3B8"
        strokeWidth="2"
      />
      {/* Composite Restoration Filling in Occlusal Surface */}
      <path
        d="M36 24 C40 28 45 27 50 28 C55 27 60 28 64 24 C67 30 65 38 60 42 C53 46 47 46 40 42 C35 38 33 30 36 24 Z"
        fill="url(#fillingGrad)"
        stroke="#38BDF8"
        strokeWidth="1.5"
      />
      {/* Diamond Sparkle */}
      <path d="M50 14 L53 22 L61 25 L53 28 L50 36 L47 28 L39 25 L47 22 Z" fill="#FDE047" />
      <circle cx="68" cy="18" r="2.5" fill="#38BDF8" />
    </svg>
  );
}

export function OralSurgeryIcon({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="surgGrad" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EF4444" stopOpacity="0.2" />
          <stop offset="1" stopColor="#DC2626" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="url(#surgGrad)" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="3 3" />
      {/* Surgical Shield / Cross */}
      <rect x="44" y="18" width="12" height="34" rx="4" fill="#EF4444" />
      <rect x="33" y="29" width="34" height="12" rx="4" fill="#EF4444" />
      {/* Extracted Tooth with Roots */}
      <path
        d="M37 48 C30 48 26 55 27 64 C28 71 31 79 34 91 C35 94 39 94 40 90 C43 81 46 72 50 72 C54 72 57 81 60 90 C61 94 65 94 66 91 C69 79 72 71 73 64 C74 55 70 48 63 48 C58 48 55 51 50 51 C45 51 42 48 37 48 Z"
        fill="#FFFFFF"
        stroke="#CBD5E1"
        strokeWidth="2"
      />
      {/* Surgical Scalpel / Forceps Line */}
      <path d="M22 25 L38 41 M20 28 L35 43" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
      <path d="M78 25 L62 41 M80 28 L65 43" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function PeriodonticIcon({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="46" fill="#10B981" fillOpacity="0.1" stroke="#10B981" strokeWidth="1.5" strokeDasharray="3 3" />
      {/* Healthy Gingiva / Gum Margin */}
      <path
        d="M18 55 Q35 48 50 58 Q65 48 82 55 L82 85 Q50 92 18 85 Z"
        fill="#F43F5E"
        fillOpacity="0.85"
        stroke="#E11D48"
        strokeWidth="2"
      />
      {/* Tooth Sitting in Gum */}
      <path
        d="M35 22 C28 22 24 28 25 38 C26 46 30 58 35 78 C36 82 40 82 41 78 C44 70 47 62 50 62 C53 62 56 70 59 78 C60 82 64 82 65 78 C70 58 74 46 75 38 C76 28 72 22 65 22 C60 22 57 25 50 25 C43 25 40 22 35 22 Z"
        fill="#FFFFFF"
        stroke="#CBD5E1"
        strokeWidth="2"
      />
      {/* Periodontal Probe with millimeter markings */}
      <line x1="72" y1="16" x2="54" y2="60" stroke="#06B6D4" strokeWidth="3" strokeLinecap="round" />
      <circle cx="54" cy="60" r="2.5" fill="#FDE047" />
      <line x1="68" y1="25" x2="72" y2="27" stroke="#F43F5E" strokeWidth="2" />
      <line x1="64" y1="35" x2="68" y2="37" stroke="#F43F5E" strokeWidth="2" />
      <line x1="60" y1="45" x2="64" y2="47" stroke="#F43F5E" strokeWidth="2" />
    </svg>
  );
}

export function FixedProsthodonticIcon({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="goldCrown" x1="25" y1="20" x2="75" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDE047" />
          <stop offset="0.5" stopColor="#EAB308" />
          <stop offset="1" stopColor="#CA8A04" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="#EAB308" fillOpacity="0.1" stroke="#FDE047" strokeWidth="1.5" strokeDasharray="3 3" />
      {/* Prepared Tooth Abutment below */}
      <path
        d="M34 52 L36 82 Q37 86 41 86 Q45 86 48 76 Q52 86 56 86 Q60 86 61 82 L63 52 Z"
        fill="#E2E8F0"
        stroke="#94A3B8"
        strokeWidth="1.5"
      />
      {/* Dental Crown (Fixed Prosthesis) */}
      <path
        d="M26 26 L36 46 L50 24 L64 46 L74 26 C78 40 76 56 72 58 C62 60 38 60 28 58 C24 56 22 40 26 26 Z"
        fill="url(#goldCrown)"
        stroke="#A16207"
        strokeWidth="2"
      />
      <circle cx="26" cy="24" r="3.5" fill="#FEF08A" stroke="#CA8A04" />
      <circle cx="50" cy="22" r="4.5" fill="#FEF08A" stroke="#CA8A04" />
      <circle cx="74" cy="24" r="3.5" fill="#FEF08A" stroke="#CA8A04" />
      {/* Insertion Arrows */}
      <path d="M50 56 L50 66 M46 62 L50 66 L54 62" stroke="#06B6D4" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function PedodonticIcon({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="46" fill="#F472B6" fillOpacity="0.1" stroke="#F472B6" strokeWidth="1.5" strokeDasharray="3 3" />
      {/* Cute Primary Milk Tooth */}
      <path
        d="M30 25 C20 25 15 35 17 48 C19 58 23 70 28 85 C31 92 37 92 39 84 C42 72 47 58 50 58 C53 58 58 72 61 84 C63 92 69 92 72 85 C77 70 81 58 83 48 C85 35 80 25 70 25 C61 25 56 30 50 30 C44 30 39 25 30 25 Z"
        fill="#FFFFFF"
        stroke="#CBD5E1"
        strokeWidth="2"
      />
      {/* Cheerful Happy Face */}
      <circle cx="40" cy="44" r="3.5" fill="#0F172A" />
      <circle cx="60" cy="44" r="3.5" fill="#0F172A" />
      <circle cx="34" cy="48" r="4" fill="#FB7185" fillOpacity="0.6" />
      <circle cx="66" cy="48" r="4" fill="#FB7185" fillOpacity="0.6" />
      <path d="M43 52 Q50 60 57 52" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
      {/* Magic Pediatric Star */}
      <path d="M72 16 L74 22 L80 24 L74 26 L72 32 L70 26 L64 24 L70 22 Z" fill="#FBBF24" />
      <circle cx="26" cy="20" r="2.5" fill="#38BDF8" />
    </svg>
  );
}

export function OrthodonticIcon({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="46" fill="#818CF8" fillOpacity="0.1" stroke="#818CF8" strokeWidth="1.5" strokeDasharray="3 3" />
      {/* 3 Aligned Teeth in Dental Arch */}
      <rect x="18" y="32" width="18" height="36" rx="6" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.5" />
      <rect x="41" y="28" width="18" height="42" rx="6" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.5" />
      <rect x="64" y="32" width="18" height="36" rx="6" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.5" />
      {/* Archwire passing through all teeth */}
      <path d="M12 50 Q50 44 88 50" stroke="#06B6D4" strokeWidth="3" strokeLinecap="round" />
      {/* Orthodontic Brackets */}
      <rect x="22" y="44" width="10" height="12" rx="2" fill="#475569" stroke="#94A3B8" />
      <rect x="45" y="43" width="10" height="12" rx="2" fill="#475569" stroke="#94A3B8" />
      <rect x="68" y="44" width="10" height="12" rx="2" fill="#475569" stroke="#94A3B8" />
      {/* Elastic Ligatures (Cyan / Blue) */}
      <circle cx="27" cy="50" r="3" fill="#38BDF8" />
      <circle cx="50" cy="49" r="3" fill="#38BDF8" />
      <circle cx="73" cy="50" r="3" fill="#38BDF8" />
    </svg>
  );
}

export function PathologyIcon({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="46" fill="#A855F7" fillOpacity="0.1" stroke="#A855F7" strokeWidth="1.5" strokeDasharray="3 3" />
      {/* Microscope Body */}
      <path d="M52 20 L62 20 L58 40 L48 40 Z" fill="#94A3B8" stroke="#475569" strokeWidth="1.5" />
      <circle cx="55" cy="18" r="4" fill="#38BDF8" />
      {/* Microscope Objective & Stage */}
      <rect x="49" y="40" width="10" height="8" rx="1" fill="#CBD5E1" />
      <rect x="36" y="54" width="36" height="4" rx="1" fill="#475569" />
      {/* Biopsy Glass Slide */}
      <rect x="42" y="51" width="24" height="3" fill="#38BDF8" fillOpacity="0.7" />
      {/* Arm and Base */}
      <path d="M62 30 C76 34 76 60 62 68 L66 82 L34 82 L34 76 L58 76 C66 70 66 45 56 36" fill="#475569" />
      {/* Cellular Pathological Microscopic View Circle */}
      <circle cx="28" cy="34" r="14" fill="#581C87" stroke="#C084FC" strokeWidth="1.5" />
      <circle cx="24" cy="30" r="3" fill="#F43F5E" />
      <circle cx="32" cy="36" r="4" fill="#E879F9" />
      <circle cx="27" cy="40" r="2.5" fill="#38BDF8" />
    </svg>
  );
}

export function RadiologyIcon({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="xrayScreen" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0F172A" />
          <stop offset="1" stopColor="#0284C7" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="#0EA5E9" fillOpacity="0.1" stroke="#0EA5E9" strokeWidth="1.5" strokeDasharray="3 3" />
      {/* X-Ray Film / Sensor */}
      <rect x="20" y="16" width="60" height="68" rx="8" fill="url(#xrayScreen)" stroke="#38BDF8" strokeWidth="2" />
      {/* Radiopaque Tooth Shadow on Film */}
      <path
        d="M38 28 C30 28 28 35 29 44 C30 52 34 60 38 72 Q40 76 43 76 Q46 76 48 66 Q52 76 55 76 Q58 76 60 72 C64 60 68 52 69 44 C70 35 68 28 60 28 C54 28 51 31 49 31 C47 31 44 28 38 28 Z"
        fill="#FFFFFF"
        fillOpacity="0.9"
      />
      {/* Radiolucent Pulp Canal inside X-Ray */}
      <path d="M42 36 Q42 56 43 72" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M56 36 Q56 56 55 72" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />
      {/* Radiation / X-Ray Rays Icon */}
      <circle cx="70" cy="24" r="3" fill="#FDE047" />
      <path d="M66 24 L63 24 M77 24 L74 24 M70 20 L70 17 M70 31 L70 28" stroke="#FDE047" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function RemovableProsthodonticIcon({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="46" fill="#F43F5E" fillOpacity="0.1" stroke="#FB7185" strokeWidth="1.5" strokeDasharray="3 3" />
      {/* Removable Pink Acrylic Denture Base */}
      <path
        d="M20 62 C20 40 32 30 50 30 C68 30 80 40 80 62 C74 58 64 56 50 56 C36 56 26 58 20 62 Z"
        fill="#FB7185"
        stroke="#E11D48"
        strokeWidth="2"
      />
      {/* Artificial Teeth Mounted on Denture */}
      <rect x="26" y="50" width="8" height="14" rx="2" fill="#FFFFFF" stroke="#CBD5E1" />
      <rect x="35" y="46" width="9" height="18" rx="2" fill="#FFFFFF" stroke="#CBD5E1" />
      <rect x="45" y="44" width="10" height="20" rx="2" fill="#FFFFFF" stroke="#CBD5E1" />
      <rect x="56" y="46" width="9" height="18" rx="2" fill="#FFFFFF" stroke="#CBD5E1" />
      <rect x="66" y="50" width="8" height="14" rx="2" fill="#FFFFFF" stroke="#CBD5E1" />
      {/* Retentive Wrought Wire Clasps on both sides */}
      <path d="M22 66 C16 64 16 54 22 52" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M78 66 C84 64 84 54 78 52" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function OralMedicineIcon({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pillGrad" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38BDF8" />
          <stop offset="0.5" stopColor="#0284C7" />
          <stop offset="0.51" stopColor="#EF4444" />
          <stop offset="1" stopColor="#DC2626" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="#38BDF8" fillOpacity="0.1" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="3 3" />
      {/* Medical Pill Capsule */}
      <g transform="rotate(-35 50 50)">
        <rect x="30" y="28" width="40" height="44" rx="20" fill="url(#pillGrad)" stroke="#FFFFFF" strokeWidth="2" />
        <line x1="30" y1="50" x2="70" y2="50" stroke="#FFFFFF" strokeWidth="2" />
      </g>
      {/* Medical Cross Badge */}
      <circle cx="70" cy="70" r="14" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />
      <rect x="68" y="62" width="4" height="16" rx="1" fill="#FFFFFF" />
      <rect x="62" y="68" width="16" height="4" rx="1" fill="#FFFFFF" />
    </svg>
  );
}

export const DentalIconMap: Record<string, React.FC<{ className?: string }>> = {
  'Endodontic': EndodonticIcon,
  'Operative': OperativeIcon,
  'Oral Surgery': OralSurgeryIcon,
  'Periodontic': PeriodonticIcon,
  'Fixed Prosthodontic': FixedProsthodonticIcon,
  'Pedodontic': PedodonticIcon,
  'Orthodontic': OrthodonticIcon,
  'Pathology': PathologyIcon,
  'Radiology': RadiologyIcon,
  'Removable Prosthodontic': RemovableProsthodonticIcon,
  'Oral Medicine': OralMedicineIcon,
};
