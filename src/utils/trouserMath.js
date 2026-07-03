/**
 * Trouser Sloper Math Ledger Logic
 * Units: cm
 */

export const calculateTrouserSloper = (measurements) => {
  const { waist, hip, inseam, height } = measurements;

  // 1. Basic Calculations
  const crotchDepth = (hip / 4) + 1.5;
  const frontCrotchExtension = (hip / 16) - 0.5;
  const backCrotchExtension = (hip / 16) + 2.0;
  
  const frontWaistArc = (waist / 4) + 0.5 + 2.0; // +2cm for dart
  const backWaistArc = (waist / 4) - 0.5 + 3.0;  // +3cm for dart
  
  const hipLineY = 21.0; // 21cm below waist
  const totalLength = crotchDepth + inseam;

  // 2. Front Panel Coordinates (Simplified Box Model for SVG)
  // Origin (0,0) is Top-Left (Waist/Center Front)
  const frontPanel = {
    waistCF: { x: 0, y: 0 },
    waistSide: { x: frontWaistArc, y: 0 },
    hipSide: { x: (hip / 4) + 0.5, y: hipLineY },
    crotchSide: { x: (hip / 4) + 0.5, y: crotchDepth },
    crotchPoint: { x: -frontCrotchExtension, y: crotchDepth },
    hemCenter: { x: (hip / 8), y: totalLength },
    hemSide: { x: (hip / 4), y: totalLength }
  };

  // 3. Back Panel Coordinates
  // Shifted for visualization
  const backPanel = {
    waistCB: { x: 0, y: 0 },
    waistSide: { x: backWaistArc, y: 0 },
    hipSide: { x: (hip / 4) - 0.5, y: hipLineY },
    crotchSide: { x: (hip / 4) - 0.5, y: crotchDepth },
    crotchPoint: { x: -backCrotchExtension, y: crotchDepth },
    hemCenter: { x: (hip / 8), y: totalLength },
    hemSide: { x: (hip / 4), y: totalLength }
  };

  // 4. Generate SVG Paths
  const frontPath = `
    M ${frontPanel.waistCF.x} ${frontPanel.waistCF.y}
    L ${frontPanel.waistSide.x} ${frontPanel.waistSide.y}
    Q ${frontPanel.hipSide.x} ${hipLineY/2}, ${frontPanel.hipSide.x} ${frontPanel.hipSide.y}
    L ${frontPanel.crotchSide.x} ${frontPanel.crotchSide.y}
    L ${frontPanel.hemSide.x} ${frontPanel.hemSide.y}
    L ${frontPanel.hemCenter.x} ${frontPanel.hemCenter.y}
    L ${frontPanel.crotchPoint.x} ${frontPanel.crotchPoint.y}
    Q 0 ${frontPanel.crotchPoint.y}, 0 0
    Z
  `.replace(/\s+/g, ' ').trim();

  const backPath = `
    M ${backPanel.waistCB.x} ${backPanel.waistCB.y}
    L ${backPanel.waistSide.x} ${backPanel.waistSide.y}
    Q ${backPanel.hipSide.x} ${hipLineY/2}, ${backPanel.hipSide.x} ${backPanel.hipSide.y}
    L ${backPanel.crotchSide.x} ${backPanel.crotchSide.y}
    L ${backPanel.hemSide.x} ${backPanel.hemSide.y}
    L ${backPanel.hemCenter.x} ${backPanel.hemCenter.y}
    L ${backPanel.crotchPoint.x} ${backPanel.crotchPoint.y}
    Q -5 ${backPanel.crotchPoint.y}, 0 0
    Z
  `.replace(/\s+/g, ' ').trim();

  return { frontPath, backPath, dimensions: { width: hip/2, height: totalLength + 10 } };
};
