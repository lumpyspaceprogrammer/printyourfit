// base44Client.js — Drop-in replacement using Supabase + Gemini
// This replaces all base44.auth, base44.entities, and base44.integrations calls

import { supabase } from './supabaseClient';
import { InvokeLLM, GenerateImage } from './geminiClient';

// ─── AUTH ────────────────────────────────────────────────────────────────────
const auth = {
  async isAuthenticated() {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  },

  async me() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || user.email,
    };
  },

  redirectToLogin(returnUrl) {
    window.location.href = `/login?return=${encodeURIComponent(returnUrl || '/')}`;
  },

  async signInWithGoogle() {
    return supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
  },

  async signInWithEmail(email, password) {
    return supabase.auth.signInWithPassword({ email, password });
  },

  async signUpWithEmail(email, password) {
    return supabase.auth.signUp({ email, password });
  },

  async logout() {
    return supabase.auth.signOut();
  },

  async signOut() {
    return supabase.auth.signOut();
  }
};

// ─── ENTITY FACTORY ──────────────────────────────────────────────────────────
function createEntity(tableName) {
  return {
    async list() {
      const { data, error } = await supabase.from(tableName).select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },

    async filter(conditions) {
      let query = supabase.from(tableName).select('*');
      for (const [key, value] of Object.entries(conditions)) {
        query = query.eq(key, value);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },

    async get(id) {
      const { data, error } = await supabase.from(tableName).select('*').eq('id', id).single();
      if (error) throw error;
      return data;
    },

    async create(record) {
      const { data: { user } } = await supabase.auth.getUser();
      const newRecord = {
        ...record,
        created_by: user?.email || 'anonymous',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const { data, error } = await supabase.from(tableName).insert(newRecord).select().single();
      if (error) throw error;
      return data;
    },

    async update(id, updates) {
      const { data, error } = await supabase
        .from(tableName)
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async delete(id) {
      const { error } = await supabase.from(tableName).delete().eq('id', id);
      if (error) throw error;
    }
  };
}

// ─── ENTITIES ────────────────────────────────────────────────────────────────
const entities = {
  Project: createEntity('projects'),
  UserSubscription: createEntity('user_subscriptions'),
  Community: createEntity('community'),
  PatternVersion: createEntity('pattern_versions'),
};

// ─── INTEGRATIONS ─────────────────────────────────────────────────────────────
const integrations = {
  Core: {
    InvokeLLM,
    GenerateImage,
  }
};

// ─── FILE UPLOAD ──────────────────────────────────────────────────────────────
async function uploadFile({ file }) {
  const fileName = `${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from('uploads')
    .upload(fileName, file, { upsert: true });

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('uploads')
    .getPublicUrl(fileName);

  return { file_url: publicUrl };
}

// ─── EXPORT ───────────────────────────────────────────────────────────────────
export const base44 = {
  auth,
  entities,
  integrations,
  uploadFile,
};
