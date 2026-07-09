import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import FloatingShapes from '@/components/ui/FloatingShapes';
import ProgressSteps from '@/components/ui/ProgressSteps';
import SVGDrafter from '@/components/pattern/SVGDrafter';
import { createPageUrl } from '@/utils';
import type { BodyMeasurements } from '@/types/patterns';

export default function Pattern() {
  const navigate = useNavigate();
  const [measurements, setMeasurements] = useState<BodyMeasurements | undefined>();
  const [projectData, setProjectData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Get projectId from URL params
  const projectId = new URLSearchParams(window.location.search).get('projectId');

  useEffect(() => {
    const loadProject = async () => {
      try {
        if (projectId) {
          const project = await base44.entities.get(projectId);
          if (project && project.measurements) {
            setMeasurements(project.measurements as BodyMeasurements);
            setProjectData(project);
          } else {
            console.error('Project not found or missing measurements');
            navigate(createPageUrl('Upload'));
          }
        } else {
          console.error('Project not found or missing measurements');
          navigate(createPageUrl('Upload'));
        }
      } catch (error) {
        console.error('Error loading project:', error);
        navigate(createPageUrl('Upload'));
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId, navigate]);

  const handleDownload = async () => {
    if (!measurements) return;
    
    try {
      const svgElement = document.querySelector('svg');
      if (svgElement) {
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const pngUrl = canvas.toDataURL('image/png');
            const downloadLink = document.createElement('a');
            downloadLink.href = pngUrl;
            downloadLink.download = 'pattern.png';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
          }
        };
        
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
      }
    } catch (error) {
      console.error('Error downloading pattern:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      <FloatingShapes />
      
      <div className="relative z-10 container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-white mb-4">Your Custom Pattern</h1>
          <p className="text-xl text-purple-200">
            AI-generated sewing pattern tailored to your exact measurements
          </p>
        </motion.div>

        <ProgressSteps currentStep={3} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 mb-8"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">Pattern Preview</h2>
            <div className="bg-white/5 rounded-lg p-4 overflow-x-auto">
              {measurements ? (
                <SVGDrafter measurements={measurements} />
              ) : (
                <div className="text-center text-gray-400 py-8">
                  Loading pattern...
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">Your Measurements</h3>
              {measurements && (
                <ul className="text-sm text-purple-200 space-y-1">
                  {Object.entries(measurements).map(([key, value]) => (
                    <li key={key}>
                      <span className="capitalize">{key}:</span> {value}cm
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">Pattern Info</h3>
              <p className="text-sm text-purple-200">
                Professional trouser sloper generated using AI-powered pattern drafting technology.
              </p>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all"
            >
              Download Pattern
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(createPageUrl('Refine'))}
              className="px-8 py-3 bg-white/10 text-white font-semibold rounded-lg border border-white/20 hover:bg-white/20 transition-all"
            >
              Refine Pattern
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <button
            onClick={() => navigate(createPageUrl('Home'))}
            className="text-purple-300 hover:text-white transition-colors"
          >
            ← Back to Home
          </button>
        </motion.div>
      </div>
    </div>
  );
}
