'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Phone, Lock, User, ArrowRight } from 'lucide-react';

interface FormData {
  phone: string;
  password: string;
}

interface FormErrors {
  phone?: string;
  password?: string;
}

export default function SignInPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    phone: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.phone || formData.phone.length < 10) {
      newErrors.phone = 'Phone number must be at least 10 digits';
    }
    
    if (!formData.password || formData.password.length < 4) {
      newErrors.password = 'Password must be at least 4 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const result = await signIn('credentials', {
        phone: formData.phone,
        password: formData.password,
        redirect: false
      });

      if (result?.error) {
        setErrors({ password: 'Invalid phone number or password' });
        setIsLoading(false);
      } else if (result?.ok) {
        // Redirect to dashboard or home page after successful login
        router.push('/');
      }
      
    } catch (error) {
      setIsLoading(false);
      setErrors({ password: 'An error occurred during sign in' });
      console.error('Sign in error:', error);
    }
  };

  const handleGuestSignIn = async () => {
    setIsLoading(true);
    
    try {
      const result = await signIn('guest', {
        isGuest: 'true',
        redirect: false
      });

      if (result?.error) {
        setIsLoading(false);
        console.error('Guest sign in error:', result.error);
        alert('Failed to sign in as guest. Please try again.');
      } else if (result?.ok) {
        // Redirect to dashboard after successful guest login
        router.push('/');
      } else {
        setIsLoading(false);
        alert('Failed to sign in as guest. Please try again.');
      }
      
    } catch (error) {
      setIsLoading(false);
      console.error('Guest sign in error:', error);
      alert('Failed to sign in as guest. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-200 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] opacity-30"></div>
      
      <div className="relative w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
            <p className="text-gray-600">Sign in to continue to your account</p>
          </div>

          {/* Sign In Form */}
          <div className="space-y-6">
            {/* Phone Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                    errors.phone 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-200 bg-gray-50 focus:border-blue-500 focus:bg-white'
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className={`w-full px-4 py-3 pr-12 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                    errors.password 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-200 bg-gray-50 focus:border-blue-500 focus:bg-white'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Sign In Button */}
            <button
              onClick={handleSignIn}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">or</span>
            </div>
          </div>

          {/* Guest Button */}
          <button
            onClick={handleGuestSignIn}
            disabled={isLoading}
            className="w-full bg-white text-gray-700 py-3 px-6 rounded-xl font-semibold border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
            ) : (
              <>
                <User className="w-4 h-4" />
                Continue as Guest
              </>
            )}
          </button>

          {/* Footer Links */}
          <div className="text-center space-y-3 pt-4">
            <button 
              type="button"
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              Forgot your password?
            </button>
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button 
                type="button"
                className="text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors"
              >
                Sign up here
              </button>
            </p>
          </div>
        </div>

        {/* Bottom Text */}
        <p className="text-center text-sm text-gray-500 mt-6">
          By signing in, you agree to our{' '}
          <button type="button" className="hover:underline">Terms of Service</button> and{' '}
          <button type="button" className="hover:underline">Privacy Policy</button>
        </p>
      </div>
    </div>
  );
}