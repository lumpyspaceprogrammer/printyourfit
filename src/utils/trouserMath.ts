import { BodyMeasurements, PatternCoordinates } from '../types/patterns';

interface PanelCoordinates {
  waistAnchor: { x: number; y: number };
  waistSide: { x: number; y: number };
  hipSide: { x: number; y: number };
  crotchSide: { x: number; y: number };
  crotchPoint: { x: number; y: number };
  hemCenter: { x: number; y: number };
  hemSide: { x: number; y: number };
}

export const calculateTrouserSloper = (measurements: BodyMeasurements): PatternCoordinates => {
  // Ensure we fall back gracefully if a measurement is missing
  const waist = measurements.waist ?? 0;
  const hip = measurements.hip ?? 0;
  const inseam = measurements.inseam ?? 0;

  // 1. Basic Formula Logic
  const crotchDepth = (hip / 4) + 1.5;
  const frontCrotchExtension = (hip / 16) - 0.5;
  const backCrotchExtension = (hip / 16) + 2.0;

  const frontWaistArc = (waist / 4) + 0.5 + 2.0; // +2cm for dart
  const backWaistArc = (waist / 4) - 0.5 + 3.0;  // +3cm for dart

  const hipLineY = 21.0; 
  const totalLength = crotchDepth + inseam;

  // 2. Front Panel Coordinates
  const frontPanel: PanelCoordinates = {
    waistAnchor: { x: 0, y: 0 },
    waistSide: { x: frontWaistArc, y: 0 },
    hipSide: { x: (hip / 4) + 0.5, y: hipLineY },
    crotchSide: { x: (hip / 4) + 0.5, y: crotchDepth },
    crotchPoint: { x: -frontCrotchExtension, y: crotchDepth },
    hemCenter: { x: (hip / 8), y: totalLength },
    hemSide: { x: (hip / 4), y: totalLength }
  };

  // 3. Back Panel Coordinates
  const backPanel: PanelCoordinates = {
    waistAnchor: { x: 0, y: 0 },
    waistSide: { x: backWaistArc, y: 0 },
    hipSide: { x: (hip / 4) - 0.5, y: hipLineY },
    crotchSide: { x: (hip / 4) - 0.5, y: crotchDepth },
    crotchPoint: { x: -backCrotchExtension, y: crotchDepth },
    hemCenter: { x: (hip / 8), y: totalLength },
    hemSide: { x: (hip / 4), y: totalLength }
  };

  // 4. Generate SVG Path Strings
  const frontD = `
    M ${frontPanel.waistAnchor.x} ${frontPanel.waistAnchor.y}
    L ${frontPanel.waistSide.x} ${frontPanel.waistSide.y}
    Q ${frontPanel.hipSide.x} ${hipLineY / 2}, ${frontPanel.hipSide.x} ${frontPanel.hipSide.y}
    L ${frontPanel.crotchSide.x} ${frontPanel.crotchSide.y}
    L ${frontPanel.hemSide.x} ${frontPanel.hemSide.y}
    L ${frontPanel.hemCenter.x} ${frontPanel.hemCenter.y}
    L ${frontPanel.crotchPoint.x} ${frontPanel.crotchPoint.y}
    Q 0 ${frontPanel.crotchPoint.y}, 0 0
    Z
  `.replace(/\s+/g, ' ').trim();

  const backD = `
    M ${backPanel.waistAnchor.x} ${backPanel.waistAnchor.y}
    L ${backPanel.waistSide.x} ${backPanel.waistSide.y}
    Q ${backPanel.hipSide.x} ${hipLineY / 2}, ${backPanel.hipSide.x} ${backPanel.hipSide.y}
    L ${backPanel.crotchSide.x} ${backPanel.crotchSide.y}
    L ${backPanel.hemSide.x} ${backPanel.hemSide.y}
    L ${backPanel.hemCenter.x} ${backPanel.hemCenter.y}
    L ${backPanel.crotchPoint.x} ${backPanel.crotchPoint.y}
    Q -5 ${backPanel.crotchPoint.y}, 0 0
    Z
  `.replace(/\s+/g, ' ').trim();

  // 5. Structure data to perfectly fit your Supabase jsonb column
  return {
    nodes: [
      { id: 'f_waist_cf', x: frontPanel.waistAnchor.x, y: frontPanel.waistAnchor.y, label: 'Front Waist CF' },
      { id: 'b_waist_cb', x: backPanel.waistAnchor.x, y: backPanel.waistAnchor.y, label: 'Back Waist CB' }
    ],
    paths: [
      { d: frontD, type: 'cut' },
      { d: backD, type: 'cut' }
    ],
    dimensions: {
      width: hip / 2,
      height: totalLength + 10
    }
  };
};
