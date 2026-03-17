import React, { useState } from 'react';
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import { Alert } from './components/Alert';

export const LoginPage: React.FC = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch {
      setError('E-mail ou senha incorretos. Verifique e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-white flex items-center justify-center p-4"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      <div className="w-full max-w-sm">
        <div
          className="border border-gray-200 rounded-2xl p-8 shadow-sm"
          style={{ animation: 'modalIn 0.25s ease-out' }}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl select-none">
              ✂️
            </div>
            <h1 className="text-xl font-bold text-black">Área Administrativa</h1>
            <p className="text-gray-400 text-sm mt-1">Barbearia Guarujá 01</p>
          </div>

          {error && (
            <div className="mb-5">
              <Alert type="error" message={error} onDismiss={() => setError('')} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@barbearia.com"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 bg-white focus:outline-none focus:border-black transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 bg-white focus:outline-none focus:border-black transition-colors"
              />
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-3 cursor-pointer select-none group">
              <div
                onClick={() => setRemember(r => !r)}
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors shrink-0 ${
                  remember ? 'bg-black border-black' : 'border-gray-300 group-hover:border-gray-500'
                }`}
              >
                {remember && (
                  <svg className="w-3 h-3 text-white" viewBox="0 0 12 10" fill="none">
                    <path d="M1 5l3.5 3.5L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className="text-sm text-gray-600">Continuar logado</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-xl font-semibold text-sm hover:bg-gray-800 active:scale-[0.98] transition-all disabled:opacity-50 mt-2"
            >
              {loading ? 'Entrando…' : 'Entrar no Dashboard'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-5">
          <a href="/" className="hover:text-black transition-colors">← Voltar ao site público</a>
        </p>
      </div>
    </div>
  );
};
