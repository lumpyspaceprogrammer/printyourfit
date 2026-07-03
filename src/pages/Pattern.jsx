import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import FloatingShapes from '../components/ui/FloatingShapes';
import ProgressSteps from '../components/ui/ProgressSteps';
import SVGDrafter from '../components/pattern/SVGDrafter';
import GlowButton from '../components/ui/GlowButton';
import { createPageUrl } from '@/utils';
import { Loader2, Plus, Download, Scissors } from 'lucide-react';

export default function Pattern() {
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadProject();
  }, []);

  const loadProject = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('projectId');
    
    // For demo/testing if no projectId, use default measurements
    if (!projectId) {
      setProject({
        measurements: {
          waist: 78,
          hip: 102,
          inseam: 72,
          height: 165
        }
      });
      setIsLoading(false);
      return;
    }

    try {
      const projects = await base44.entities.Project.list();
      const foundProject = projects.find(p => p.id === projectId);
      
      if (foundProject && foundProject.measurements) {
        setProject(foundProject);
      } else {
        // Default fallback
        setProject({
          measurements: { waist: 80, hip: 100, inseam: 75, height: 170 }
        });
      }
    } catch (error) {
      console.error('Error loading project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-purple-200 to-cyan-200">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-12 h-12 text-purple-500" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-pink-200 via-purple-200 to-cyan-200 pb-20">
      <FloatingShapes />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent drop-shadow-lg">
            ✨ Print Your Fit ✨
          </h1>
          <p className="text-lg text-gray-700 mt-2 font-medium">
            Your custom trouser sloper is ready!
          </p>
        </motion.div>

        <ProgressSteps currentStep={4} />

        <div className="flex flex-col lg:flex-row gap-8 mt-12">
          {/* Left: SVG Drafting Engine */}
          <div className="flex-1">
            <SVGDrafter measurements={project?.measurements} />
          </div>

          {/* Right: Actions */}
          <div className="w-full lg:w-80 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6 bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            >
              <h3 className="font-black text-xl mb-4 flex items-center gap-2">
                <Scissors className="w-5 h-5" /> Actions
              </h3>
              <div className="space-y-4">
                <GlowButton className="w-full justify-center">
                  <Download className="w-5 h-5 mr-2" />
                  Download SVG
                </GlowButton>
                <GlowButton variant="secondary" className="w-full justify-center" onClick={() => navigate(createPageUrl('Upload'))}>
                  <Plus className="w-5 h-5 mr-2" />
                  New Project
                </GlowButton>
              </div>
            </motion.div>

            <div className="p-6 bg-cyan-100 border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h4 className="font-bold text-sm uppercase text-cyan-800">Drafting Logic</h4>
              <p className="text-xs mt-2 text-cyan-900 leading-relaxed">
                Using standard sloper math:<br/>
                • Front Crotch: (Hip/16) - 0.5cm<br/>
                • Back Crotch: (Hip/16) + 2cm<br/>
                • Hip Line: 21cm below waist
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
