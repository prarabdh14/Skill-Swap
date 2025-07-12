import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { SignIn } from './SignIn';
import { SignUp } from './SignUp';
import { useApp } from '../../contexts/AppContext';
import { authService, SignUpData, SignInData } from '../../services';

interface AuthContainerProps {
  onAuthSuccess: () => void;
}

export const AuthContainer: React.FC<AuthContainerProps> = ({ onAuthSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { dispatch } = useApp();

  const handleSignIn = async (email: string, password: string) => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const { user } = await authService.signIn({ email, password });
      dispatch({ type: 'SET_CURRENT_USER', payload: user });
      onAuthSuccess();
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'An error occurred during sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (userData: SignUpData) => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const { user } = await authService.signUp(userData);
      dispatch({ type: 'SET_CURRENT_USER', payload: user });
      onAuthSuccess();
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'An error occurred during sign up. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    setAuthError(null);

    try {
      // Send the Google credential to our backend
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credential: credentialResponse.credential,
        }),
      });

      if (!response.ok) {
        throw new Error('Google authentication failed');
      }

      const { user, token } = await response.json();
      
      // Store the token
      localStorage.setItem('authToken', token);
      
      // Update app state
      dispatch({ type: 'SET_CURRENT_USER', payload: user });
      onAuthSuccess();
    } catch (error) {
      setAuthError('Google authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setAuthError('Google authentication was cancelled or failed.');
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: handleGoogleError,
  });

  const handleSocialAuth = async (provider: 'google' | 'twitter') => {
    if (provider === 'google') {
      googleLogin();
    } else {
      setAuthError(`${provider} authentication is not implemented yet. Please use email/password.`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl"></div>
      </div>

      {/* Error message */}
      {authError && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-lg max-w-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{authError}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setAuthError(null)}
                  className="inline-flex text-red-400 hover:text-red-600"
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auth content */}
      <div className="relative z-10">
        {isSignUp ? (
          <SignUp
            onSwitchToSignIn={() => setIsSignUp(false)}
            onSignUp={handleSignUp}
            onGoogleAuth={() => handleSocialAuth('google')}
            isLoading={isLoading}
          />
        ) : (
          <SignIn
            onSwitchToSignUp={() => setIsSignUp(true)}
            onSignIn={handleSignIn}
            onGoogleAuth={() => handleSocialAuth('google')}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* Info hint */}
      <div className="fixed bottom-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-sm">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
          Getting Started
        </h3>
        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <p>Create a new account or sign in to start swapping skills!</p>
          <p className="text-xs text-gray-500 mt-2">
            The backend API is now connected and ready to use.
          </p>
        </div>
      </div>
    </div>
  );
}; 