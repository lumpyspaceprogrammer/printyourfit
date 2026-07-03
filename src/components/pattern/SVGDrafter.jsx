import React, { useMemo } from 'react';
import { calculateTrouserSloper } from '@/utils/trouserMath';

export default function SVGDrafter({ measurements }) {
  const { frontPath, backPath, dimensions } = useMemo(() => {
    return calculateTrouserSloper(measurements || {
      waist: 80,
      hip: 100,
      inseam: 75,
      height: 170
    });
  }, [measurements]);

  const scale = 4; // Scale for visualization

  return (
    <div className="w-full bg-white rounded-3xl border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-auto">
      <div className="flex flex-col md:flex-row gap-12 items-center justify-center min-w-[600px]">
        {/* Front Panel */}
        <div className="flex flex-col items-center">
          <span className="font-black text-xl mb-4 uppercase tracking-tighter bg-pink-400 px-4 py-1 border-2 border-black rotate-[-2deg]">Front Panel</span>
          <svg 
            width={dimensions.width * scale} 
            height={dimensions.height * scale} 
            viewBox={`-20 -10 ${dimensions.width + 40} ${dimensions.height + 20}`}
            className="drop-shadow-xl"
          >
            <path
              d={frontPath}
              fill="none"
              stroke="black"
              strokeWidth="0.5"
              className="stroke-[0.5] fill-cyan-50/50"
            />
            {/* Grid/Guide lines could go here */}
          </svg>
        </div>

        {/* Back Panel */}
        <div className="flex flex-col items-center">
          <span className="font-black text-xl mb-4 uppercase tracking-tighter bg-purple-400 px-4 py-1 border-2 border-black rotate-[2deg]">Back Panel</span>
          <svg 
            width={dimensions.width * scale} 
            height={dimensions.height * scale} 
            viewBox={`-40 -10 ${dimensions.width + 60} ${dimensions.height + 20}`}
            className="drop-shadow-xl"
          >
            <path
              d={backPath}
              fill="none"
              stroke="black"
              strokeWidth="0.5"
              className="stroke-[0.5] fill-pink-50/50"
            />
          </svg>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(measurements || {}).map(([key, val]) => (
          <div key={key} className="p-3 border-2 border-black rounded-xl bg-yellow-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-xs font-bold uppercase text-gray-500">{key}</p>
            <p className="text-lg font-black">{val}cm</p>
          </div>
        ))}
      </div>
    </div>
  );
}
