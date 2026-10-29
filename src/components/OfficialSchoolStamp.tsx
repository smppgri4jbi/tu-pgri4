import React from 'react';

interface OfficialSchoolStampProps {
  schoolName: string;
  deptName?: string;
  cityName?: string;
  color?: string;
  className?: string;
}

export const OfficialSchoolStamp: React.FC<OfficialSchoolStampProps> = ({
  schoolName = 'SMA NEGERI 1 TELADAN',
  deptName = 'DINAS PENDIDIKAN & KEBUDAYAAN',
  cityName = 'KOTA JAKARTA PUSAT',
  color = '#1d4ed8', // Kedinasan royal blue ink
  className = ''
}) => {
  // SVG rubber circular stamp with concentric rings, stars, and text paths
  return (
    <div
      className={`pointer-events-none select-none relative ${className}`}
      style={{
        transform: 'rotate(-7deg)',
        mixBlendMode: 'multiply',
        opacity: 0.88
      }}
    >
      <svg
        width="110"
        height="110"
        viewBox="0 0 200 200"
        className="drop-shadow-sm filter contrast-125"
      >
        <defs>
          {/* Top curve for school/dept name */}
          <path
            id="stampTopArc"
            d="M 25,100 A 75,75 0 1,1 175,100"
            fill="none"
          />
          {/* Bottom curve for city / region name */}
          <path
            id="stampBottomArc"
            d="M 175,100 A 75,75 0 0,1 25,100"
            fill="none"
          />
        </defs>

        {/* Outer concentric border */}
        <circle
          cx="100"
          cy="100"
          r="92"
          fill="none"
          stroke={color}
          strokeWidth="3.5"
          strokeDasharray="1200"
        />

        {/* Inner thin concentric border */}
        <circle
          cx="100"
          cy="100"
          r="86"
          fill="none"
          stroke={color}
          strokeWidth="1.2"
        />

        {/* Top curved department text */}
        <text
          fill={color}
          fontSize="11.5"
          fontWeight="bold"
          letterSpacing="2"
          fontFamily="Arial, sans-serif"
        >
          <textPath href="#stampTopArc" startOffset="50%" textAnchor="middle">
            {deptName.slice(0, 32).toUpperCase()}
          </textPath>
        </text>

        {/* Decorative Stars */}
        <text
          x="20"
          y="104"
          fill={color}
          fontSize="14"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          ★
        </text>
        <text
          x="180"
          y="104"
          fill={color}
          fontSize="14"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          ★
        </text>

        {/* Middle Line Separators */}
        <line x1="28" y1="78" x2="172" y2="78" stroke={color} strokeWidth="1.5" />
        <line x1="28" y1="122" x2="172" y2="122" stroke={color} strokeWidth="1.5" />

        {/* Center School Name */}
        <text
          x="100"
          y="95"
          fill={color}
          fontSize="13"
          fontWeight="900"
          textAnchor="middle"
          fontFamily="'Plus Jakarta Sans', Arial, sans-serif"
          letterSpacing="0.8"
        >
          {schoolName.length > 20 ? schoolName.slice(0, 20) : schoolName}
        </text>
        <text
          x="100"
          y="112"
          fill={color}
          fontSize="9.5"
          fontWeight="700"
          textAnchor="middle"
          fontFamily="'Plus Jakarta Sans', Arial, sans-serif"
          letterSpacing="1"
        >
          RESMI
        </text>

        {/* Bottom curved region text */}
        <text
          fill={color}
          fontSize="11"
          fontWeight="bold"
          letterSpacing="1.5"
          fontFamily="Arial, sans-serif"
        >
          <textPath href="#stampBottomArc" startOffset="50%" textAnchor="middle">
            {cityName.slice(0, 28).toUpperCase()}
          </textPath>
        </text>
      </svg>
    </div>
  );
};
