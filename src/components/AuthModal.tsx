import React, { useState } from 'react';
import { X, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSignUpInitial: boolean;
  onAuthSuccess: (profile: UserProfile) => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  isSignUpInitial,
  onAuthSuccess,
}: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(isSignUpInitial);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Save or update user profile in firestore and invoke callback
  const handleUserProfile = async (firebaseUser: any, customName?: string) => {
    const docRef = doc(db, 'users', firebaseUser.uid);
    const docSnap = await getDoc(docRef);
    
    let role: 'user' | 'admin' = 'user';
    // Auto-promote the specified email to admin
    if (firebaseUser.email === 'hairart04@gmail.com') {
      role = 'admin';
    }

    const profile: UserProfile = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: customName || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '사용자',
      role: role,
    };

    // Save/update in firestore
    await setDoc(docRef, profile, { merge: true });
    onAuthSuccess(profile);
    onClose();
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        // Sign Up
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        await handleUserProfile(userCredential.user, name);
      } else {
        // Log In
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await handleUserProfile(userCredential.user);
      }
    } catch (err: any) {
      console.error(err);
      let errorMsg = '인증에 실패했습니다. 다시 시도해 주세요.';
      if (err.code === 'auth/invalid-credential') {
        errorMsg = '이메일 주소 또는 비밀번호가 올바르지 않습니다.';
      } else if (err.code === 'auth/email-already-in-use') {
        errorMsg = '이미 사용 중인 이메일 주소입니다.';
      } else if (err.code === 'auth/weak-password') {
        errorMsg = '비밀번호는 최소 6자 이상이어야 합니다.';
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await handleUserProfile(result.user);
    } catch (err: any) {
      console.error(err);
      setError('구글 로그인 중 에러가 발생했습니다. (아이프레임 환경일 경우 새 창에서 열기를 권장합니다)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-6 sm:p-8 text-slate-800">
        {/* Close Button */}
        <button
          id="auth-modal-close-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-950 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-2 font-sans">
            LAVACORE MOBILITY
          </h2>
          <p className="text-slate-500 text-sm">
            {isSignUp ? '간편하게 회원가입하고 서비스를 이용해 보세요' : '로그인하여 고품격 모빌리티 솔루션을 경험하세요'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-100 rounded-xl mb-5 text-red-600 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">이름</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="signup-name-input"
                  type="text"
                  required
                  placeholder="홍길동"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">이메일 주소</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                id="auth-email-input"
                type="email"
                required
                placeholder="example@lavacore.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">비밀번호</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                id="auth-password-input"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
          </div>

          <button
            id="auth-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-800 text-white font-semibold py-3.5 px-4 rounded-xl shadow-md shadow-orange-500/10 transition-colors cursor-pointer text-sm"
          >
            {loading ? '처리 중...' : isSignUp ? '이메일 회원가입' : '이메일 로그인'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <span className="relative bg-white px-3 text-xs uppercase tracking-wider text-slate-400">
            또는
          </span>
        </div>

        {/* Google OAuth Login */}
        <button
          id="google-signin-btn"
          onClick={handleGoogleAuth}
          disabled={loading}
          className="w-full flex items-center justify-center space-x-3.5 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 font-semibold py-3.5 px-4 rounded-xl transition-colors shadow-sm cursor-pointer text-sm"
        >
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Google 계정으로 계속하기</span>
        </button>

        {/* Toggle Sign up / Log in */}
        <div className="text-center mt-6 text-sm">
          <span className="text-slate-400">
            {isSignUp ? '이미 계정이 있으신가요?' : '아직 계정이 없으신가요?'}
          </span>{' '}
          <button
            id="auth-toggle-mode-btn"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-orange-600 hover:text-orange-700 font-semibold underline underline-offset-4 cursor-pointer"
          >
            {isSignUp ? '로그인하기' : '회원가입하기'}
          </button>
        </div>
      </div>
    </div>
  );
}
