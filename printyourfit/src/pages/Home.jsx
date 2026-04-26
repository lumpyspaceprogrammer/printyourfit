import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Upload, Wand2, Ruler, Scissors, Star, Heart, ArrowRight, Users, CheckCircle, Download, Leaf } from 'lucide-react';
import FloatingShapes from '../components/ui/FloatingShapes';
import GlowButton from '../components/ui/GlowButton';
import GlowCard from '../components/ui/GlowCard';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';

const HeroMockup = () => (
  <div className="relative w-full max-w-[260px] mx-auto mt-8 mb-4">
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      className="relative"
    >
      <div className="bg-white rounded-[2rem] border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <div className="bg-black h-6 w-full flex items-center justify-center rounded-t-[1.8rem]">
          <div className="bg-gray-800 h-2.5 w-16 rounded-full" />
        </div>
        <div className="bg-gradient-to-br from-pink-100 via-purple-100 to-cyan-100 p-3">
          {/* Upload */}
          <div className="bg-white rounded-xl border-2 border-black p-2.5 mb-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 border-2 border-black flex items-center justify-center">
                <Upload className="w-2.5 h-2.5 text-white" />
              </div>
              <span className="text-[10px] font-bold text-gray-700">Upload your fit</span>
            </div>
            <div className="bg-gradient-to-br from-pink-200 to-purple-200 rounded-lg border-2 border-black h-16 flex items-center justify-center">
              <span className="text-2xl">👗</span>
            </div>
          </div>
          {/* AI */}
          <div className="bg-white rounded-xl border-2 border-black p-2.5 mb-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-400 to-cyan-400 border-2 border-black flex items-center justify-center">
                <Wand2 className="w-2.5 h-2.5 text-white" />
              </div>
              <span className="text-[10px] font-bold text-gray-700">AI generating pattern...</span>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3].map(i => (
                <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                  className="flex-1 h-1.5 rounded-full bg-gradient-to-r from-pink-400 to-purple-400" />
              ))}
            </div>
          </div>
          {/* Done */}
          <div className="bg-gradient-to-r from-lime-400 to-cyan-400 rounded-xl border-2 border-black p-2.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-white" />
              <span className="text-[10px] font-bold text-white">Pattern ready! ✨</span>
            </div>
            <div className="mt-1 flex items-center gap-1">
              <Download className="w-2.5 h-2.5 text-white" />
              <span className="text-[10px] text-white/90">PDF → Print → Sew</span>
            </div>
          </div>
        </div>
        <div className="bg-white h-5 flex items-center justify-center">
          <div className="bg-black h-1 w-14 rounded-full" />
        </div>
      </div>
    </motion.div>

    {/* Floating badges — tucked inside the mockup width so they don't overflow hero */}
    <motion.div
      animate={{ rotate: [-3, 3, -3], scale: [1, 1.05, 1] }}
      transition={{ duration: 3, repeat: Infinity }}
      className="absolute top-2 -right-2 bg-yellow-300 border-2 border-black rounded-xl px-2 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
    >
      <p className="text-[10px] font-black leading-tight">🆓 FREE</p>
      <p className="text-[10px] font-bold leading-tight">1st pattern</p>
    </motion.div>

    <motion.div
      animate={{ rotate: [3, -3, 3], y: [0, 4, 0] }}
      transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
      className="absolute bottom-6 -left-2 bg-pink-300 border-2 border-black rounded-xl px-2 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
    >
      <p className="text-[10px] font-black leading-tight">✨ AI Magic</p>
      <p className="text-[10px] font-bold leading-tight">Custom fit</p>
    </motion.div>
  </div>
);

export default function Home() {
  const features = [
    { icon: Upload, title: "Upload Your Fit", description: "Photo of any outfit you want to recreate", color: "from-pink-400 to-rose-400", delay: 0.1 },
    { icon: Wand2, title: "AI Magic", description: "AI analyzes the garment and builds your pattern", color: "from-purple-400 to-violet-400", delay: 0.2 },
    { icon: Ruler, title: "Your Measurements", description: "Enter your size for a perfectly tailored fit", color: "from-cyan-400 to-blue-400", delay: 0.3 },
    { icon: Scissors, title: "Print & Sew", description: "Download a printable PDF with full instructions", color: "from-lime-400 to-green-400", delay: 0.4 },
  ];

  const handleStart = async () => {
    try {
      const isAuth = await base44.auth.isAuthenticated();
      if (isAuth) {
        window.location.href = createPageUrl('Upload');
      } else {
        base44.auth.redirectToLogin(createPageUrl('Upload'));
      }
    } catch {
      window.location.href = createPageUrl('Upload');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-pink-200 via-purple-200 to-cyan-200">
      <FloatingShapes />

      <div className="relative z-10">

        {/* ── HERO ── */}
        <section className="container mx-auto px-5 pt-8 pb-4">
          {/* Mobile: stacked center. Desktop: side by side */}
          <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-12">

            {/* Text column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-1 text-center lg:text-left"
            >
              {/* Badge */}
              <motion.div
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/80 backdrop-blur-sm rounded-full border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-4"
              >
                <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                <span className="font-bold text-xs text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                  Y2K Sewing Magic
                </span>
                <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              </motion.div>

              {/* Headline */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-3 leading-none">
                <span className="block bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                  Print A
                </span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500">
                  ✨ Fit ✨
                </span>
              </h1>

              <p className="text-base md:text-lg text-gray-700 max-w-md mx-auto lg:mx-0 mb-4 font-medium leading-relaxed">
                Upload any clothing photo → get a <strong>custom sewing pattern</strong> sized to your body. AI-powered. Always free to start.
              </p>

              {/* Trust pills */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-5">
                {[
                  { icon: '🆓', text: 'Free first pattern' },
                  { icon: '📏', text: 'Your measurements' },
                  { icon: '🖨️', text: 'Print-at-home PDF' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-1 bg-white/70 px-3 py-1 rounded-full border-2 border-black text-xs font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <span>{item.icon}</span><span>{item.text}</span>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <GlowButton variant="primary" className="text-base px-7 py-3.5" onClick={handleStart}>
                  <Star className="w-4 h-4 mr-1.5 inline animate-spin" style={{ animationDuration: '3s' }} />
                  Start Free — Get Your Pattern!
                  <ArrowRight className="w-4 h-4 ml-1.5 inline" />
                </GlowButton>
                <Link to={createPageUrl('Community')}>
                  <button className="w-full sm:w-auto text-sm px-5 py-3.5 rounded-2xl border-4 border-black bg-white/80 font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 transition-all">
                    👗 See Community
                  </button>
                </Link>
              </div>
            </motion.div>

            {/* Mockup column — hidden on very small screens, shown md+ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden sm:flex flex-1 justify-center lg:justify-end"
            >
              <HeroMockup />
            </motion.div>
          </div>
        </section>

        {/* ── TICKER STRIP ── */}
        <div className="bg-black/10 backdrop-blur-sm py-2.5 my-2">
          <div className="flex items-center gap-6 px-4 justify-center flex-wrap">
            {['Slow fashion ✦', 'Zero waste ✦', 'Made by you ✦', 'AI-powered ✦', 'Custom fit ✦', 'Print at home ✦'].map((t, i) => (
              <span key={i} className="text-xs font-bold text-gray-700 whitespace-nowrap">{t}</span>
            ))}
          </div>
        </div>

        {/* ── HOW IT WORKS ── */}
        <section className="container mx-auto px-5 py-10">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-black text-center mb-7 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent"
          >
            How It Works ✨
          </motion.h2>

          {/* 2×2 on mobile, 4 columns on lg */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: feature.delay }}
              >
                <GlowCard glowColor={index % 2 === 0 ? 'pink' : 'cyan'} className="h-full p-4">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-3 border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`}>
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-[10px] font-black text-gray-400 mb-0.5">STEP {index + 1}</div>
                  <h3 className="text-sm font-bold mb-1">{feature.title}</h3>
                  <p className="text-gray-600 text-xs leading-relaxed">{feature.description}</p>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── WHY PRINT A FIT ── */}
        <section className="container mx-auto px-5 pb-10">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-black text-center mb-7 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent"
          >
            Why Print A Fit? 💜
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: '💸', title: 'Actually affordable', body: 'Custom patterns without the boutique price tag. Your first one is completely free.' },
              { icon: '🌱', title: 'Sustainable by design', body: 'Every piece you sew is one less fast fashion item. Make it, love it, keep it.' },
              { icon: '📐', title: 'Made for YOUR body', body: "Enter your measurements — get a pattern that fits you, not a generic size chart." },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GlowCard glowColor="rainbow" className="h-full text-center p-5">
                  <div className="text-3xl mb-2">{card.icon}</div>
                  <h3 className="text-base font-bold mb-1">{card.title}</h3>
                  <p className="text-gray-600 text-xs leading-relaxed">{card.body}</p>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── COMMUNITY ── */}
        <section className="container mx-auto px-5 pb-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <GlowCard glowColor="cyan" className="p-5 md:p-8">
              <div className="flex flex-col md:flex-row items-center gap-5">
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl md:text-2xl font-bold mb-2 flex items-center justify-center md:justify-start gap-2">
                    <Users className="w-6 h-6 text-purple-500 flex-shrink-0" />
                    <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                      Community Showcase
                    </span>
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    Get inspired by makers around the world. Share your creations and discover new styles!
                  </p>
                  <Link to={createPageUrl('Community')}>
                    <GlowButton variant="secondary">
                      <Heart className="w-4 h-4 mr-2 inline" />
                      Explore Community
                    </GlowButton>
                  </Link>
                </div>
                <div className="flex -space-x-3">
                  {['🧵', '✂️', '🎀', '👗'].map((emoji, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-xl"
                    >
                      {emoji}
                    </motion.div>
                  ))}
                </div>
              </div>
            </GlowCard>
          </motion.div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="container mx-auto px-5 pb-12">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <GlowCard glowColor="rainbow" className="text-center py-10 px-6">
              <div className="text-4xl mb-3">🎉</div>
              <h2 className="text-2xl md:text-3xl font-black mb-2 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                Ready to Print A Fit?
              </h2>
              <p className="text-sm text-gray-600 mb-5 max-w-md mx-auto leading-relaxed">
                Your first pattern is always free. No credit card. No catch. Just upload, measure, and sew.
              </p>
              <GlowButton variant="success" className="text-base px-7 py-3.5" onClick={handleStart}>
                <Sparkles className="w-4 h-4 mr-2 inline" />
                Make Your First Outfit — It's Free!
              </GlowButton>
              <p className="text-[11px] text-gray-400 mt-3">Free to start · No credit card · Works on any device</p>
            </GlowCard>
          </motion.div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="border-t-4 border-black/10 bg-white/40 backdrop-blur-sm py-6 px-5">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-4">
              <div className="text-center md:text-left">
                <p className="text-base font-black bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                  Print A Fit ✨
                </p>
                <p className="text-xs text-gray-500">Custom AI sewing patterns for every body</p>
              </div>
              <div className="flex gap-4 flex-wrap justify-center text-xs font-bold text-gray-600">
                <Link to={createPageUrl('Community')} className="hover:text-pink-500 transition-colors">Community</Link>
                <Link to={createPageUrl('Contact')} className="hover:text-pink-500 transition-colors">Contact</Link>
                <a href="/privacy.html" className="hover:text-pink-500 transition-colors">Privacy Policy</a>
                <a href="/terms.html" className="hover:text-pink-500 transition-colors">Terms of Use</a>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-between gap-1 pt-3 border-t border-black/10">
              <p className="text-[11px] text-gray-400">© {new Date().getFullYear()} Print A Fit. Made with 💜 by Skate Byrne.</p>
              <div className="flex items-center gap-1">
                <Leaf className="w-3 h-3 text-green-500" />
                <p className="text-[11px] text-gray-400">Slow fashion · Zero waste · Made by you.</p>
              </div>
            </div>
          </div>
        </footer>

      </div>

      {/* BG blobs */}
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-pink-400/40 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-cyan-400/40 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}
