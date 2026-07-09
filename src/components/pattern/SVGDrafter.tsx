import React, { useMemo } from 'react';
import { calculateTrouserSloper } from '@/utils/trouserMath';
import type { BodyMeasurements } from '@/types/patterns';

interface SVGDrafterProps {
  measurements?: BodyMeasurements;
}

export default function SVGDrafter({ measurements }: SVGDrafterProps) {
  const svgDimensions = useMemo(() => {
    const scale = 5; // scale up for better visibility
    return {
      width: 600,
      height: 800,
      scale,
    };
  }, []);

  const panelData = useMemo(() => {
    if (!measurements) return null;
    try {
      return calculateTrouserSloper(measurements);
    } catch (error) {
      console.error('Error calculating trouser sloper:', error);
      return null;
    }
  }, [measurements]);

  if (!panelData) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-100 rounded-lg">
        <p className="text-gray-500">Enter measurements to see pattern preview</p>
      </div>
    );
  }

  const { frontPanel, backPanel } = panelData;

  return (
    <svg
      width={svgDimensions.width}
      height={svgDimensions.height}
      viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
      className="border border-gray-300 rounded-lg"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Grid background */}
      <defs>
        <pattern
          id="grid"
          width="50"
          height="50"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 50 0 L 0 0 0 50"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width={svgDimensions.width} height={svgDimensions.height} fill="url(#grid)" />

      {/* Front Panel */}
      <g transform="translate(50, 50)">
        <text x="0" y="-10" className="text-sm font-semibold" fill="#000">
          Front Panel
        </text>
        <path
          d={`
            M ${frontPanel.waistAnchor.x},${frontPanel.waistAnchor.y}
            L ${frontPanel.waistSide.x},${frontPanel.waistSide.y}
            L ${frontPanel.hipSide.x},${frontPanel.hipSide.y}
            L ${frontPanel.crotchSide.x},${frontPanel.crotchSide.y}
            L ${frontPanel.kneeSide.x},${frontPanel.kneeSide.y}
            L ${frontPanel.ankleCenter.x},${frontPanel.ankleCenter.y}
            Z
          `}
          fill="#d8b4fe"
          stroke="#9333ea"
          strokeWidth="2"
        />

        {/* Waist line */}
        <line
          x1={frontPanel.waistAnchor.x}
          y1={frontPanel.waistAnchor.y}
          x2={frontPanel.waistSide.x}
          y2={frontPanel.waistSide.y}
          stroke="#dc2626"
          strokeWidth="1.5"
          strokeDasharray="3,3"
        />

        {/* Measurement annotations */}
        <text x={frontPanel.waistAnchor.x} y={frontPanel.waistAnchor.y - 5} className="text-xs" fill="#666">
          Waist
        </text>
        <text x={frontPanel.hipSide.x + 5} y={frontPanel.hipSide.y} className="text-xs" fill="#666">
          Hip
        </text>
      </g>

      {/* Back Panel */}
      <g transform="translate(350, 50)">
        <text x="0" y="-10" className="text-sm font-semibold" fill="#000">
          Back Panel
        </text>
        <path
          d={`
            M ${backPanel.waistAnchor.x},${backPanel.waistAnchor.y}
            L ${backPanel.waistSide.x},${backPanel.waistSide.y}
            L ${backPanel.hipSide.x},${backPanel.hipSide.y}
            L ${backPanel.crotchSide.x},${backPanel.crotchSide.y}
            L ${backPanel.kneeSide.x},${backPanel.kneeSide.y}
            L ${backPanel.ankleCenter.x},${backPanel.ankleCenter.y}
            Z
          `}
          fill="#bfdbfe"
          stroke="#0284c7"
          strokeWidth="2"
        />

        {/* Waist line */}
        <line
          x1={backPanel.waistAnchor.x}
          y1={backPanel.waistAnchor.y}
          x2={backPanel.waistSide.x}
          y2={backPanel.waistSide.y}
          stroke="#dc2626"
          strokeWidth="1.5"
          strokeDasharray="3,3"
        />

        {/* Measurement annotations */}
        <text x={backPanel.waistAnchor.x} y={backPanel.waistAnchor.y - 5} className="text-xs" fill="#666">
          Waist
        </text>
        <text x={backPanel.hipSide.x + 5} y={backPanel.hipSide.y} className="text-xs" fill="#666">
          Hip
        </text>
      </g>

      {/* Legend */}
      <g transform="translate(50, 750)">
        <rect x="0" y="0" width="150" height="40" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="1" rx="4" />
        <rect x="10" y="8" width="15" height="15" fill="#d8b4fe" stroke="#9333ea" strokeWidth="1" />
        <text x="30" y="20" className="text-xs" fill="#000">Front</text>
        <rect x="90" y="8" width="15" height="15" fill="#bfdbfe" stroke="#0284c7" strokeWidth="1" />
        <text x="110" y="20" className="text-xs" fill="#000">Back</text>
      </g>
    </svg>
  );
}
