import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { Link, useNavigate } from 'react-router-dom';
import HearMeOutLogo from '../assets/Hear_meOUT.svg';
import BannerIllustration from '../assets/banner.svg';
import { API_BASE_URL } from '../config/api';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Sign up failed');

      // ✅ Save JWT to localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      navigate('/home', { replace: true });
    } catch (err) {
      setError(err.message || 'Sign up failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center pl-8 pr-2 py-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <img src={HearMeOutLogo} className="h-10 mx-auto" />
            <p className="mt-5 text-2xl font-medium text-gray-600">
              Create your account
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              required
            />

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              required
            />

            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              required
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              required
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-2.5 rounded-lg"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <button
            onClick={handleGoogleSignup}
            className="w-full flex items-center justify-center gap-3 py-2.5 border border-gray-300 rounded-lg"
          >
            <FcGoogle className="text-xl" />
            Sign up with Google
          </button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-black">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* Right Illustration */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center pl-2 pr-8 py-8">
        <img
          src={BannerIllustration}
          alt="Banner Illustration"
          className="w-full max-w-xl h-auto"
        />
      </div>
    </div>
  );
}
