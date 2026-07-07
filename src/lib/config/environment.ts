/**
 * Environment Configuration Validation
 * 
 * This module provides centralized environment variable validation
 * and helpful error messages for deployment troubleshooting.
 */

interface EnvironmentConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceKey?: string;
  nodeEnv: string;
  isProduction: boolean;
  isDevelopment: boolean;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  config: Partial<EnvironmentConfig>;
}

/**
 * Validates all required environment variables
 */
export function validateEnvironment(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const config: Partial<EnvironmentConfig> = {};

  // Check Supabase URL
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    errors.push('NEXT_PUBLIC_SUPABASE_URL is not set. Supabase connection will fail.');
  } else if (!supabaseUrl.startsWith('http')) {
    errors.push(`NEXT_PUBLIC_SUPABASE_URL has invalid format: ${supabaseUrl}. It should start with http:// or https://`);
  } else {
    config.supabaseUrl = supabaseUrl;
  }

  // Check Supabase Anon Key
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseAnonKey) {
    errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set. Supabase authentication will fail.');
  } else if (supabaseAnonKey.length < 30) {
    warnings.push('NEXT_PUBLIC_SUPABASE_ANON_KEY seems unusually short. Please verify it is correct.');
  } else {
    config.supabaseAnonKey = supabaseAnonKey;
  }

  // Check Supabase Service Role Key (optional but recommended for server operations)
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseServiceKey) {
    warnings.push('SUPABASE_SERVICE_ROLE_KEY is not set. Server-side operations will be limited.');
  } else {
    config.supabaseServiceKey = supabaseServiceKey;
  }

  // Check Node Environment
  const nodeEnv = process.env.NODE_ENV || 'development';
  config.nodeEnv = nodeEnv;
  config.isProduction = nodeEnv === 'production';
  config.isDevelopment = nodeEnv === 'development';

  if (config.isProduction && (errors.length > 0 || warnings.length > 0)) {
    warnings.push('Running in production mode with missing or invalid environment variables.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    config: config as EnvironmentConfig
  };
}

/**
 * Get environment configuration with validation
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  const validation = validateEnvironment();
  
  if (!validation.isValid) {
    // Log errors for debugging
    console.error('Environment validation failed:');
    validation.errors.forEach(error => console.error(`  - ${error}`));
    validation.warnings.forEach(warning => console.warn(`  - ${warning}`));
  }

  return validation.config;
}

/**
 * Check if Supabase is properly configured
 */
export function isSupabaseConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

/**
 * Get user-friendly error message for missing Supabase configuration
 */
export function getSupabaseConfigError(): string {
  const missing: string[] = [];
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    missing.push('NEXT_PUBLIC_SUPABASE_URL');
  }
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  if (missing.length === 0) return '';

  return `Supabase configuration is incomplete. Missing environment variables: ${missing.join(', ')}. ` +
         'Please add these to your deployment configuration.';
}

/**
 * Generate deployment troubleshooting guide
 */
export function getDeploymentTroubleshootingGuide(): string {
  const validation = validateEnvironment();
  const lines: string[] = [
    '=== Deployment Troubleshooting ==='
  ];

  if (validation.errors.length > 0) {
    lines.push('\n❌ Critical Errors:');
    validation.errors.forEach(error => lines.push(`  - ${error}`));
  }

  if (validation.warnings.length > 0) {
    lines.push('\n⚠️  Warnings:');
    validation.warnings.forEach(warning => lines.push(`  - ${warning}`));
  }

  lines.push('\n📋 Required Environment Variables:');
  lines.push('  - NEXT_PUBLIC_SUPABASE_URL: Your Supabase project URL');
  lines.push('  - NEXT_PUBLIC_SUPABASE_ANON_KEY: Your Supabase anon public key');
  lines.push('\n📋 Optional Environment Variables:');
  lines.push('  - SUPABASE_SERVICE_ROLE_KEY: For server-side operations');
  lines.push('\n🔗 Get these values from your Supabase project:');
  lines.push('  1. Go to https://app.supabase.com');
  lines.push('  2. Select your project');
  lines.push('  3. Navigate to Settings → API');
  lines.push('  4. Copy the Project URL and anon public key');

  return lines.join('\n');
}

// Export validation result for debugging
export const environmentValidation = validateEnvironment();
