import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSass } from '@rsbuild/plugin-sass';
import { pluginBasicSsl } from '@rsbuild/plugin-basic-ssl';

const path = require('path');

// =============================================================================
// Environment Variable Validation
// =============================================================================
// Log environment variables during build for debugging
const envVars = {
    APP_ENV: process.env.APP_ENV || 'development',
    CLIENT_ID: process.env.CLIENT_ID || '',
    APP_ID: process.env.APP_ID || '',
    GD_CLIENT_ID: process.env.GD_CLIENT_ID || '',
    GD_APP_ID: process.env.GD_APP_ID || '',
    GD_API_KEY: process.env.GD_API_KEY || '',
};

// Validate required environment variables
const requiredVars = ['CLIENT_ID'];
const missingVars = requiredVars.filter(varName => !envVars[varName as keyof typeof envVars]);

if (missingVars.length > 0) {
    console.warn(`
⚠️  WARNING: Missing environment variables during build:
    ${missingVars.join(', ')}
    
    If this is intentional (e.g., will be set via Vercel Dashboard),
    you can ignore this warning. OAuth login will not work until these are set.
    
    For local development, add these to .env.local:
    - See .env.example for documentation
    - See Vercel Dashboard settings for production values
`);
}

console.log(`
✅ Build Configuration:
   Environment: ${envVars.APP_ENV}
   OAuth Enabled: ${envVars.CLIENT_ID ? 'YES' : 'NO (set CLIENT_ID to enable)'}
   Google Drive: ${envVars.GD_CLIENT_ID ? 'YES' : 'NO (optional)'}
`);

export default defineConfig({
    plugins: [
        pluginSass({
            sassLoaderOptions: {
                sourceMap: true,
                sassOptions: {
                    // includePaths: [path.resolve(__dirname, 'src')],
                },
                // additionalData: `@use "${path.resolve(__dirname, 'src/components/shared/styles')}" as *;`,
            },
            exclude: /node_modules/,
        }),
        pluginReact(),
        pluginBasicSsl(),
    ],
    source: {
        entry: {
            index: './src/main.tsx',
        },
        define: {
            'process.env': {
                // Core environment variables
                APP_ENV: JSON.stringify(envVars.APP_ENV),
                
                // OAuth variables (required)
                CLIENT_ID: JSON.stringify(envVars.CLIENT_ID),
                APP_ID: JSON.stringify(envVars.APP_ID),
                
                // Google Drive variables (optional)
                GD_CLIENT_ID: JSON.stringify(envVars.GD_CLIENT_ID),
                GD_APP_ID: JSON.stringify(envVars.GD_APP_ID),
                GD_API_KEY: JSON.stringify(envVars.GD_API_KEY),
            },
        },
        alias: {
            react: path.resolve('./node_modules/react'),
            'react-dom': path.resolve('./node_modules/react-dom'),
            '@/external': path.resolve(__dirname, './src/external'),
            '@/components': path.resolve(__dirname, './src/components'),
            '@/hooks': path.resolve(__dirname, './src/hooks'),
            '@/utils': path.resolve(__dirname, './src/utils'),
            '@/constants': path.resolve(__dirname, './src/constants'),
            '@/stores': path.resolve(__dirname, './src/stores'),
        },
    },
    output: {
        copy: [
            {
                from: 'node_modules/@deriv-com/smartcharts-champion/dist/*',
                to: 'js/smartcharts/[name][ext]',
                globOptions: {
                    ignore: ['**/*.LICENSE.txt'],
                },
            },
            { from: 'node_modules/@deriv-com/smartcharts-champion/dist/assets/*', to: 'assets/[name][ext]' },
            {
                from: 'node_modules/@deriv-com/smartcharts-champion/dist/assets/fonts/*',
                to: 'assets/fonts/[name][ext]',
            },
            {
                from: 'node_modules/@deriv-com/smartcharts-champion/dist/assets/shaders/*',
                to: 'assets/shaders/[name][ext]',
            },
            { from: path.join(__dirname, 'public') },
        ],
    },
    html: {
        template: './index.html',
    },
    server: {
        port: 8443,
        compress: true,
    },
    dev: {
        hmr: true,
    },
    performance: {
        // Configure Rsbuild's native bundle analyzer
        bundleAnalyze:
            process.env.BUNDLE_ANALYZE === 'true'
                ? {
                      analyzerMode: 'server',
                      analyzerHost: 'localhost',
                      analyzerPort: 8888,
                      openAnalyzer: true,
                      generateStatsFile: true,
                      statsFilename: 'stats.json',
                  }
                : undefined,
    },
    tools: {
        rspack: {
            plugins: [],
            resolve: {},
            module: {
                rules: [
                    {
                        test: /\.xml$/,
                        exclude: /node_modules/,
                        use: 'raw-loader',
                    },
                ],
            },
        },
    },
});
