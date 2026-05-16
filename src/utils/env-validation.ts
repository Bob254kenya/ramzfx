/**
 * Environment Variables Validation Utility
 * 
 * This module validates all required environment variables and provides
 * helpful error messages if they're missing or invalid.
 * 
 * Usage:
 *   import { validateEnvironment, getEnvVar } from '@/utils/env-validation';
 *   validateEnvironment(); // Checks all required variables
 *   const clientId = getEnvVar('CLIENT_ID'); // Get with fallback handling
 */

// =============================================================================
// Type Definitions
// =============================================================================

export interface EnvironmentVariable {
    name: string;
    required: boolean;
    description: string;
    fallback?: string;
}

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    missingVariables: string[];
}

// =============================================================================
// Environment Variables Definition
// =============================================================================

const ENV_VARIABLES: Record<string, EnvironmentVariable> = {
    APP_ENV: {
        name: 'APP_ENV',
        required: false,
        description: 'Application environment (development, staging, production)',
        fallback: 'development',
    },
    CLIENT_ID: {
        name: 'CLIENT_ID',
        required: true,
        description: 'OAuth2 Client ID from Deriv API Console (REQUIRED for authentication)',
        fallback: undefined,
    },
    APP_ID: {
        name: 'APP_ID',
        required: false,
        description: 'OAuth2 Application ID (optional, for legacy Deriv API)',
        fallback: undefined,
    },
    GD_CLIENT_ID: {
        name: 'GD_CLIENT_ID',
        required: false,
        description: 'Google Drive OAuth2 Client ID (optional)',
        fallback: undefined,
    },
    GD_APP_ID: {
        name: 'GD_APP_ID',
        required: false,
        description: 'Google Drive Project ID (optional)',
        fallback: undefined,
    },
    GD_API_KEY: {
        name: 'GD_API_KEY',
        required: false,
        description: 'Google Drive API Key (optional)',
        fallback: undefined,
    },
};

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Get an environment variable value with validation
 * @param key Variable name
 * @param fallback Default value if not found
 * @returns Variable value or fallback
 */
export function getEnvVar(key: string, fallback?: string): string {
    const value = process.env[key];
    
    if (!value) {
        if (fallback !== undefined) {
            return fallback;
        }
        return '';
    }
    
    return value;
}

/**
 * Validate if an environment variable is set
 * @param key Variable name
 * @returns true if variable is set and not empty
 */
export function isEnvVarSet(key: string): boolean {
    const value = process.env[key];
    return !!value && value.trim().length > 0;
}

/**
 * Validate a specific environment variable
 * @param key Variable name
 * @param required Whether this variable is required
 * @returns Validation error message or empty string if valid
 */
function validateVariable(key: string, required: boolean): string {
    const value = process.env[key];
    
    if (!value || value.trim().length === 0) {
        if (required) {
            return `❌ MISSING REQUIRED: ${key} - This variable must be set for the application to work`;
        }
        return '';
    }
    
    // Check for placeholder values that shouldn't be in production
    if (value === 'undefined' || value === 'null' || value === '') {
        if (required) {
            return `❌ INVALID VALUE: ${key} = "${value}" - Please set a valid value`;
        }
    }
    
    return '';
}

/**
 * Get validation error for a specific issue
 * @param variable The environment variable definition
 * @returns Error message or empty string
 */
function getValidationError(variable: EnvironmentVariable): string {
    const varName = variable.name;
    const value = process.env[varName];
    
    if (!value || value.trim().length === 0) {
        if (variable.required) {
            return `
❌ CRITICAL: Required environment variable "${varName}" is not set

   Description: ${variable.description}
   
   To fix:
   1. Local Development: Add to .env.local
   2. Vercel Deployment: Add in Vercel Dashboard → Settings → Environment Variables
   
   Documentation: See .env.example for more details
`;
        }
        return '';
    }
    
    return '';
}

/**
 * Validate all environment variables
 * @returns Validation result with errors and warnings
 */
export function validateEnvironment(): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const missingVariables: string[] = [];
    
    // Check each environment variable
    Object.values(ENV_VARIABLES).forEach(variable => {
        const error = getValidationError(variable);
        
        if (error) {
            if (variable.required) {
                errors.push(error);
                missingVariables.push(variable.name);
            } else {
                warnings.push(error);
            }
        }
    });
    
    // Additional validation for OAuth configuration
    if (!isEnvVarSet('CLIENT_ID')) {
        if (!missingVariables.includes('CLIENT_ID')) {
            missingVariables.push('CLIENT_ID');
        }
    }
    
    return {
        isValid: errors.length === 0,
        errors,
        warnings,
        missingVariables,
    };
}

/**
 * Log environment validation results
 * @param result Validation result
 */
export function logValidationResults(result: ValidationResult): void {
    if (result.isValid && result.warnings.length === 0) {
        console.log('✅ All environment variables are properly configured');
        return;
    }
    
    if (result.errors.length > 0) {
        console.error('🚨 ENVIRONMENT CONFIGURATION ERRORS:');
        result.errors.forEach(error => {
            console.error(error);
        });
    }
    
    if (result.warnings.length > 0) {
        console.warn('⚠️ ENVIRONMENT CONFIGURATION WARNINGS:');
        result.warnings.forEach(warning => {
            console.warn(warning);
        });
    }
}

/**
 * Check if running in production environment
 * @returns true if APP_ENV is set to 'production'
 */
export function isProduction(): boolean {
    return getEnvVar('APP_ENV', 'development').toLowerCase() === 'production';
}

/**
 * Check if running in development environment
 * @returns true if APP_ENV is set to 'development'
 */
export function isDevelopment(): boolean {
    return getEnvVar('APP_ENV', 'development').toLowerCase() === 'development';
}

/**
 * Get all configured environment variables (excluding sensitive ones in production)
 * @returns Object with environment variables
 */
export function getEnvironmentConfig() {
    return {
        APP_ENV: getEnvVar('APP_ENV', 'development'),
        CLIENT_ID: isEnvVarSet('CLIENT_ID') ? '***' : 'NOT_SET',
        APP_ID: isEnvVarSet('APP_ID') ? '***' : 'NOT_SET',
        GD_CLIENT_ID: isEnvVarSet('GD_CLIENT_ID') ? '***' : 'NOT_SET',
        GD_APP_ID: isEnvVarSet('GD_APP_ID') ? '***' : 'NOT_SET',
        GD_API_KEY: isEnvVarSet('GD_API_KEY') ? '***' : 'NOT_SET',
    };
}

/**
 * Get detailed environment variable documentation
 * @returns String with formatted documentation
 */
export function getEnvironmentDocumentation(): string {
    let docs = `
=============================================================================
ENVIRONMENT VARIABLES DOCUMENTATION
=============================================================================

Required Variables (must be set for the app to work):
`;
    
    Object.values(ENV_VARIABLES).filter(v => v.required).forEach(variable => {
        docs += `\n  • ${variable.name}`;
        docs += `\n    Description: ${variable.description}`;
    });
    
    docs += `\n\nOptional Variables (only needed if using specific features):`;
    
    Object.values(ENV_VARIABLES).filter(v => !v.required).forEach(variable => {
        docs += `\n  • ${variable.name}`;
        docs += `\n    Description: ${variable.description}`;
    });
    
    docs += `\n\nSetup Instructions:
  1. Development: Create .env.local with your variables
  2. Vercel Staging: Add to Vercel Dashboard (Preview environment)
  3. Vercel Production: Add to Vercel Dashboard (Production environment)
  
For more details, see .env.example
=============================================================================
`;
    
    return docs;
}

// =============================================================================
// Export Summary
// =============================================================================

export const EnvValidation = {
    getEnvVar,
    isEnvVarSet,
    validateEnvironment,
    logValidationResults,
    isProduction,
    isDevelopment,
    getEnvironmentConfig,
    getEnvironmentDocumentation,
};

export default EnvValidation;
