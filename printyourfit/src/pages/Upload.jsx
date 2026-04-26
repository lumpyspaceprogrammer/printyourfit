import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Lock } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import FloatingShapes from '../components/ui/FloatingShapes';
import ProgressSteps from '../components/ui/ProgressSteps';
import ImageUploader from '../components/upload/ImageUploader';
import UpgradeModal from '../components/monetization/UpgradeModal';
import { createPageUrl } from '@/utils';
import { tierData } from '../components/monetization/SubscriptionTiers';

export default function Upload() {
  const [isUploading, setIsUploading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const isAuth = await base44.auth.isAuthenticated();
    if (!isAuth) {
      base44.auth.redirectToLogin(createPageUrl('Upload'));
      return;
    }
    checkSubscription();
  };

  const checkSubscription = async () => {
    try {
      const user = await base44.auth.me();
      if (user) {
        const subs = await base44.entities.UserSubscription.list();
        const userSub = subs.find(s => s.created_by === user.email);

        if (userSub) {
          const today = new Date().toISOString().split('T')[0];
          if (userSub.last_pattern_date !== today) {
            await base44.entities.UserSubscription.update(userSub.id, {
              patterns_used_today: 0,
              last_pattern_date: today
            });
            userSub.patterns_used_today = 0;
          }
          setSubscription(userSub);
        } else {
          const newSub = await base44.entities.UserSubscription.create({
            tier: 'free',
            patterns_used_today: 0,
            total_patterns_created: 0,
            has_used_free_pattern: false,
          });
          setSubscription(newSub);
        }
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const canCreatePattern = () => {
    if (!subscription) return true;
    const tier = tierData[subscription.tier] || tierData.free;
    if (subscription.tier === 'free') {
      return !subscription.has_used_free_pattern;
    }
    if (tier.patternsPerDay === -1) return true;
    return subscription.patterns_used_today < tier.patternsPerDay;
  };

  const handleImageSelect = async (file) => {
    if (!canCreatePattern()) {
      setShowUpgradeModal(true);
      return;
    }
    setIsUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });

      const project = await base44.entities.Project.create({
        original_image_url: file_url,
        status: 'uploaded'
      });

      if (subscription) {
        const updates = {
          patterns_used_today: (subscription.patterns_used_today || 0) + 1,
          total_patterns_created: (subscription.total_patterns_created || 0) + 1,
          last_pattern_date: new Date().toISOString().split('T')[0]
        };
        if (subscription.tier === 'free') {
          updates.has_used_free_pattern = true;
        }
        await base44.entities.UserSubscription.update(subscription.id, updates);
      }

      navigate(createPageUrl('Refine') + `?projectId=${project.id}`);
    } catch (error) {
      console.error('Error uploading:', error);
      setIsUploading(false);
    }
  };

  const getRemainingPatterns = () => {
    if (!subscription) return 1;
    const tier = tierData[subscription.tier] || tierData.free;
    if (subscription.tier === 'free') {
      return subscription.has_used_free_pattern ? 0 : 1;
    }
    if (tier.patternsPerDay === -1) return '∞';
    return Math.max(0, tier.patternsPerDay - (subscription.patterns_used_today || 0));
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-pink-200 via-purple-200 to-cyan-200">
      <FloatingShapes />

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentTier={subscription?.tier || 'free'}
        reason={subscription?.tier === 'free'
          ? "You've used your free pattern! Upgrade to create more."
          : "You've reached your daily limit. Upgrade for more patterns."
        }
      />

      <div className="relative z-10 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent drop-shadow-lg">
            ✨ Print A Fit ✨
          </h1>
          <p className="text-lg text-gray-700 mt-2 font-medium">
            Transform any clothing photo into a custom sewing pattern
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            {canCreatePattern() ? (
              <>
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span className="font-bold text-sm">
                  {getRemainingPatterns()} pattern{getRemainingPatterns() === 1 ? '' : 's'} remaining today
                </span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-gray-500" />
                <span className="font-bold text-sm text-gray-600">Upgrade for more patterns</span>
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="text-purple-600 underline font-bold text-sm"
                >
                  View Plans
                </button>
              </>
            )}
          </motion.div>
        </motion.div>

        <ProgressSteps currentStep={1} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="p-6 rounded-full bg-gradient-to-br from-pink-400 via-purple-400 to-cyan-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                <Sparkles className="w-12 h-12 text-white" />
              </motion.div>
              <p className="mt-4 text-xl font-bold text-purple-600">Uploading your fit...</p>
            </div>
          ) : (
            <ImageUploader onImageSelect={handleImageSelect} />
          )}
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-pink-400/30 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-gradient-to-bl from-purple-400/30 to-transparent rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}
