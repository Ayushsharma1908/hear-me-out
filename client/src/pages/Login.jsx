import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { Link, useNavigate } from 'react-router-dom';
import HearMeOutLogo from '../assets/Hear_meOUT.svg';
import NerdIllustration from '../assets/nerd-illustration.svg';
import { API_BASE_URL } from '../config/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }), // ✅ no credentials
      });

      const data = await res.json();
      console.log('🔑 Login response:', data);

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // ✅ Save JWT for future requests
      localStorage.setItem('token', data.token); // store JWT
      localStorage.setItem('user', JSON.stringify(data.user)); // optional user info

      // ✅ LOGIN SUCCESS → GO TO HOME
      navigate('/home', { replace: true });

    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };


  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Illustration */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center pl-2 pr-8 py-8">
        <img
          src={NerdIllustration}
          alt="Nerd Illustration"
          className="w-full max-w-xl h-auto"
        />
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center pl-2 pr-18 py-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <img src={HearMeOutLogo} alt="Hear Me Out" className="h-10 mx-auto" />
            <p className="mt-5 text-2xl font-medium text-gray-600">
              Welcome back
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white  py-2.5 rounded-lg"
            >
              {isLoading ? 'Processing...' : 'Continue'}
            </button>
          </form>

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-2.5 border border-gray-300 rounded-lg"
          >
            <FcGoogle className="text-xl" />
            Continue with Google
          </button>

          <p className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="font-medium text-black">
              Sign Up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
