import React from 'react';
import { validateEnvironment, getEnvVar } from '@/utils/env-validation';
import styles from './env-error.module.scss';

/**
 * Component that displays environment configuration errors
 * Shows critical missing environment variables and how to fix them
 */
export const EnvironmentError: React.FC = () => {
    const validation = validateEnvironment();

    if (validation.isValid) {
        return null; // Don't show anything if environment is valid
    }

    return (
        <div className={styles.container}>
            <div className={styles.errorBox}>
                <h1>⚠️ Configuration Error</h1>

                {validation.errors.length > 0 && (
                    <div className={styles.section}>
                        <h2>Critical Issues (Must Fix):</h2>
                        <ul className={styles.errorList}>
                            {validation.errors.map((error, idx) => (
                                <li key={idx} className={styles.error}>
                                    {error}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {validation.missingVariables.length > 0 && (
                    <div className={styles.section}>
                        <h2>Missing Variables:</h2>
                        <ul className={styles.variableList}>
                            {validation.missingVariables.map(varName => (
                                <li key={varName} className={styles.variable}>
                                    <code>{varName}</code>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className={styles.section}>
                    <h2>How to Fix:</h2>

                    {typeof window !== 'undefined' && window.location.hostname === 'localhost' ? (
                        <div className={styles.instructions}>
                            <h3>Local Development:</h3>
                            <ol>
                                <li>
                                    Copy <code>.env.example</code> to <code>.env.local</code>
                                </li>
                                <li>
                                    Add your credentials from Deriv API Console:
                                    <a
                                        href="https://app.deriv.com/account/api-token"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Deriv API Token Page
                                    </a>
                                </li>
                                <li>Restart the development server: npm run start</li>
                            </ol>
                        </div>
                    ) : (
                        <div className={styles.instructions}>
                            <h3>Vercel Deployment:</h3>
                            <ol>
                                <li>
                                    Go to Vercel Dashboard for your project:
                                    <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer">
                                        https://vercel.com/dashboard
                                    </a>
                                </li>
                                <li>Navigate to: Settings → Environment Variables</li>
                                <li>
                                    Add each missing variable from{' '}
                                    <a href="/env.example" target="_blank" rel="noopener noreferrer">
                                        .env.example
                                    </a>
                                </li>
                                <li>Deploy again by pushing to your branch</li>
                            </ol>
                        </div>
                    )}
                </div>

                <div className={styles.section}>
                    <h2>Required Credentials:</h2>
                    <table className={styles.credentialsTable}>
                        <thead>
                            <tr>
                                <th>Variable</th>
                                <th>Description</th>
                                <th>Where to Get</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className={validation.missingVariables.includes('CLIENT_ID') ? styles.missing : ''}>
                                <td>
                                    <code>CLIENT_ID</code>
                                </td>
                                <td>OAuth2 Client ID (REQUIRED)</td>
                                <td>
                                    <a
                                        href="https://app.deriv.com/account/api-token"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Deriv Console → OAuth Applications
                                    </a>
                                </td>
                            </tr>
                            <tr className={validation.missingVariables.includes('APP_ID') ? styles.missing : ''}>
                                <td>
                                    <code>APP_ID</code>
                                </td>
                                <td>Application ID (Optional)</td>
                                <td>
                                    <a
                                        href="https://app.deriv.com/account/api-token"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Deriv Console
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className={styles.section}>
                    <p className={styles.hint}>
                        💡 For detailed setup instructions, see <code>.env.example</code> in the project root
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EnvironmentError;
