import React from 'react';
import { SchoolHeaderConfig } from '../types';

interface KopSuratViewProps {
  config: SchoolHeaderConfig;
  className?: string;
}

export const KopSuratView: React.FC<KopSuratViewProps> = ({ config, className = '' }) => {
  return (
    <div className={`w-full select-none ${className}`}>
      <div className="flex items-center justify-between gap-4 pb-2">
        {/* Left Logo (e.g. Tut Wuri Handayani / Pemprov) */}
        {config.logoLeftUrl && (
          <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center">
            <img
              src={config.logoLeftUrl}
              alt="Logo Instansi Kiri"
              referrerPolicy="no-referrer"
              className="max-h-20 max-w-20 object-contain drop-shadow-sm"
              onError={(e) => {
                // Graceful fallback to SVG placeholder if link is broken
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Center Kop Text */}
        <div className={`flex-1 text-center font-serif text-black leading-tight ${config.headerAlignment === 'left' ? 'text-left' : 'text-center'}`}>
          <div className="text-[12px] md:text-[13px] font-semibold tracking-wide uppercase text-neutral-800">
            {config.provinceGov}
          </div>
          <div className="text-[12px] md:text-[13px] font-semibold tracking-wide uppercase text-neutral-800">
            {config.educationDept}
          </div>
          {config.subDistrictDept && (
            <div className="text-[11px] md:text-[12px] font-medium tracking-wide uppercase text-neutral-700">
              {config.subDistrictDept}
            </div>
          )}
          <div className="text-[16px] md:text-[19px] font-black tracking-wider uppercase text-neutral-950 mt-0.5">
            {config.schoolName}
          </div>
          {config.showNpsn && (
            <div className="text-[10px] md:text-[11px] font-medium text-neutral-700">
              NPSN: {config.npsn} &bull; {config.akreditasi}
            </div>
          )}
          <div className="text-[9.5px] md:text-[10.5px] text-neutral-700 mt-1 leading-snug">
            {config.address}
          </div>
          <div className="text-[8.5px] md:text-[9.5px] text-neutral-600 italic">
            {config.contactInfo}
          </div>
        </div>

        {/* Right Logo (e.g. School Crest) */}
        {config.showLogoRight && config.logoRightUrl && (
          <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center">
            <img
              src={config.logoRightUrl}
              alt="Logo Sekolah Kanan"
              referrerPolicy="no-referrer"
              className="max-h-20 max-w-20 object-contain drop-shadow-sm rounded-full"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      {/* Official Indonesian Kedinasan Double Border Line */}
      {config.borderStyle === 'dinas_double' && (
        <div className="w-full pt-1 pb-3">
          <div className="w-full border-t-[2.5px] border-black"></div>
          <div className="w-full border-t-[1px] border-black mt-[1.5px]"></div>
        </div>
      )}

      {config.borderStyle === 'classic_single' && (
        <div className="w-full pt-1 pb-3">
          <div className="w-full border-t-[2px] border-black"></div>
        </div>
      )}

      {config.borderStyle === 'modern_minimal' && (
        <div className="w-full pt-1 pb-3">
          <div className="w-full border-t-[1px] border-neutral-400"></div>
        </div>
      )}
    </div>
  );
};
