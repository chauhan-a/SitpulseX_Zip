import React, { useState } from 'react';
import pb from '@/lib/pb';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await pb.collection('users').authWithPassword(email, password);
      setError('');
      navigate('/settings'); // Redirect after login
    } catch (err) {
      setError('Invalid credentials, please try again.');
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-4 border rounded">
      <h2 className="text-xl mb-4">Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full mb-3 p-2 border rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full mb-3 p-2 border rounded"
      />
      <button
        onClick={handleLogin}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Login
      </button>
      {error && <p className="text-red-600 mt-3">{error}</p>}
    </div>
  );
};

export default Login;
