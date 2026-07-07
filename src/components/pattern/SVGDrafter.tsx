import React, { useMemo } from 'react';
import { calculateTrouserSloper } from '../../utils/trouserMath';
import { BodyMeasurements } from '../../types/patterns';

interface SVGDrafterProps {
  measurements?: BodyMeasurements;
}

export default function SVGDrafter({ measurements }: SVGDrafterProps) {
  // Use fallback values if measurements are missing
  const activeMeasurements = useMemo(() => measurements || {
    waist: 80,
    hip: 100,
    inseam: 75,
    height: 170
  }, [measurements]);

  const patternData = useMemo(() => {
    return calculateTrouserSloper(activeMeasurements);
  }, [activeMeasurements]);

  const scale = 4; // Visual scaling factor

  // Separate front and back paths from our schema array
  // Index 0 is front, Index 1 is back based on trouserMath implementation
  const frontPath = patternData.paths[0]?.d || '';
  const backPath = patternData.paths[1]?.d || '';

  return (
    <div className="w-full bg-white rounded-3xl border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-auto">
      <div className="flex flex-col md:flex-row gap-12 items-center justify-center min-w-[600px]">
        
        {/* Front Panel */}
        <div className="flex flex-col items-center">
          <span className="font-black text-xl mb-4 uppercase tracking-tighter bg-pink-400 px-4 py-1 border-2 border-black rotate-[-2deg]">
            Front Panel
          </span>
          <svg 
            width={patternData.dimensions.width * scale} 
            height={patternData.dimensions.height * scale} 
            viewBox={`-20 -10 ${patternData.dimensions.width + 40} ${patternData.dimensions.height + 20}`}
            className="drop-shadow-xl"
          >
            <path
              d={frontPath}
              fill="none"
              stroke="black"
              strokeWidth="0.5"
              className="stroke-[0.5] fill-cyan-50/50"
            />
          </svg>
        </div>

        {/* Back Panel */}
        <div className="flex flex-col items-center">
          <span className="font-black text-xl mb-4 uppercase tracking-tighter bg-purple-400 px-4 py-1 border-2 border-black rotate-[2deg]">
            Back Panel
          </span>
          <svg 
            width={patternData.dimensions.width * scale} 
            height={patternData.dimensions.height * scale} 
            viewBox={`-40 -10 ${patternData.dimensions.width + 60} ${patternData.dimensions.height + 20}`}
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

      {/* Dynamic Measurements Display */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(activeMeasurements).map(([key, val]) => (
          <div key={key} className="p-3 border-2 border-black rounded-xl bg-yellow-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-xs font-bold uppercase text-gray-500">{key}</p>
            <p className="text-lg font-black">{val}cm</p>
          </div>
        ))}
      </div>
    </div>
  );
}
