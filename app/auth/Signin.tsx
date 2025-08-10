import { useState } from 'react';
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
    
    // Simulate API call
    try {
      // Here you would typically call signIn from next-auth
      // const result = await signIn('credentials', {
      //   phone: formData.phone,
      //   password: formData.password,
      //   redirect: false
      // });
      
      console.log('Signing in with:', formData);
      
      // Simulate loading
      setTimeout(() => {
        setIsLoading(false);
        alert('Sign in functionality would be implemented here with next-auth');
      }, 1500);
      
    } catch (error) {
      setIsLoading(false);
      console.error('Sign in error:', error);
    }
  };

  const handleGuestSignIn = async () => {
    setIsLoading(true);
    
    try {
      // Here you would set up the guest session with user and merchant ID as 20
      // This could be done by creating a guest session or calling a special endpoint
      console.log('Signing in as guest with user ID: 20, merchant ID: 20');
      
      // Simulate API call for guest login
      setTimeout(() => {
        setIsLoading(false);
        alert('Guest sign in - User ID: 20, Merchant ID: 20');
        // Redirect to dashboard or main app
      }, 1000);
      
    } catch (error) {
      setIsLoading(false);
      console.error('Guest sign in error:', error);
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
            <a href="#" className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors">
              Forgot your password?
            </a>
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="#" className="text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors">
                Sign up here
              </a>
            </p>
          </div>
        </div>

        {/* Bottom Text */}
        <p className="text-center text-sm text-gray-500 mt-6">
          By signing in, you agree to our{' '}
          <a href="#" className="hover:underline">Terms of Service</a> and{' '}
          <a href="#" className="hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}