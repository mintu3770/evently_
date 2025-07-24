import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export const SignupPage = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup(formData);
      navigate('/events');
    } catch (err) {
      console.error('Signup failed:', err);
      alert('Signup failed. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 border rounded-lg shadow-lg bg-white">
      <h2 className="text-3xl font-bold text-center mb-6">Create Account</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input type="text" name="username" placeholder="Username" onChange={handleChange} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition">Sign Up</button>
      </form>
      <p className="text-center mt-4">
        Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
      </p>
    </div>
  );
};