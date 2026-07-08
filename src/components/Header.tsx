import React, { useState } from 'react';
import { ShieldCheck, LogIn, LogOut, Menu, X, User, Settings } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  user: UserProfile | null;
  isAdminMode: boolean;
  setIsAdminMode: (mode: boolean) => void;
  onOpenAuth: (isSignUp: boolean) => void;
  onLogout: () => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export default function Header({
  user,
  isAdminMode,
  setIsAdminMode,
  onOpenAuth,
  onLogout,
  activeSection,
  setActiveSection,
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'hero', label: 'HOME' },
    { id: 'about-enuri', label: 'About 라바코어' },
    { id: 'plus-recruitment', label: '배민/쿠팡 플러스' },
    { id: 'franchise', label: '가맹 및 배달대행' },
    { id: 'maintenance', label: '정비 & 실시간챗' },
    { id: 'rental', label: '전기바이크 렌탈' },
    { id: 'recruitment', label: '라이더 모집' },
    { id: 'reservation', label: '방문 예약' },
  ];

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setIsMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-navy-950/90 backdrop-blur-md border-b border-navy-800 text-slate-200 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div 
            className="flex-shrink-0 flex items-center cursor-pointer"
            onClick={() => handleNavClick('hero')}
            id="logo-container"
          >
            <span className="text-2xl font-black tracking-tight text-slate-100 font-sans">
              LAVACORE <span className="text-gold-500">MOBILITY</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-1 xl:space-x-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeSection === item.id
                    ? 'bg-gold-500 text-navy-950 shadow-md shadow-gold-500/15 scale-[1.02]'
                    : 'text-slate-300 hover:text-white hover:bg-navy-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Action Area (Auth + Admin Switcher) */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Admin Switcher Mode */}
            {user && user.role === 'admin' && (
              <div className="flex items-center space-x-2 bg-navy-900 p-1.5 rounded-lg border border-navy-800">
                <span className="text-xs text-slate-400 px-2 font-mono">
                  ADMIN
                </span>
                <button
                  id="admin-toggle-btn"
                  onClick={() => setIsAdminMode(!isAdminMode)}
                  className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    isAdminMode
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'bg-navy-850 text-slate-300 hover:bg-navy-800'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>관리자 {isAdminMode ? 'ON' : 'OFF'}</span>
                </button>
              </div>
            )}

            {/* User Auth Info */}
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-navy-900 px-3 py-1.5 rounded-lg border border-navy-800 text-slate-300">
                  <User className="w-4 h-4 text-gold-500" />
                  <span className="text-sm font-semibold max-w-[120px] truncate" title={user.displayName || user.email}>
                    {user.displayName || user.email.split('@')[0]}님
                  </span>
                </div>
                <button
                  id="logout-btn"
                  onClick={onLogout}
                  className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-200 border border-navy-700 transition-colors text-sm font-semibold cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>로그아웃</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  id="login-modal-open-btn"
                  onClick={() => onOpenAuth(false)}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-navy-850 transition-colors text-sm font-semibold cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-gold-500" />
                  <span>로그인</span>
                </button>
                <button
                  id="signup-modal-open-btn"
                  onClick={() => onOpenAuth(true)}
                  className="px-4 py-2 rounded-lg bg-gold-500 hover:bg-gold-600 text-navy-950 text-sm font-bold transition-all shadow-md shadow-gold-500/10 cursor-pointer"
                >
                  회원가입
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-2">
            {user && user.role === 'admin' && (
              <button
                id="admin-toggle-mobile-btn"
                onClick={() => setIsAdminMode(!isAdminMode)}
                className={`p-2 rounded-lg text-xs font-semibold ${
                  isAdminMode ? 'bg-red-600 text-white' : 'bg-navy-800 text-slate-300'
                }`}
                title="관리자 모드 전환"
              >
                <ShieldCheck className="w-4 h-4" />
              </button>
            )}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-navy-800 focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div id="mobile-menu" className="lg:hidden bg-navy-900 border-b border-navy-800 px-4 pt-2 pb-6 space-y-2 shadow-lg">
          {navItems.map((item) => (
            <button
              key={item.id}
              id={`nav-mobile-${item.id}`}
              onClick={() => handleNavClick(item.id)}
              className={`block w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                activeSection === item.id
                  ? 'bg-gold-500 text-navy-950 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-navy-800'
              }`}
            >
              {item.label}
            </button>
          ))}
          
          <div className="pt-4 border-t border-navy-800 mt-4 space-y-3">
            {user ? (
              <>
                <div className="flex items-center justify-between px-4 py-2 bg-navy-950 rounded-lg border border-navy-850">
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-gold-500" />
                    <span className="text-sm font-semibold text-slate-200">{user.displayName || user.email}</span>
                  </div>
                  <span className="text-xs text-slate-450 font-mono">[{user.role.toUpperCase()}]</span>
                </div>
                <button
                  id="mobile-logout-btn"
                  onClick={() => {
                    onLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center space-x-2 w-full px-4 py-3 rounded-lg bg-navy-800 hover:bg-navy-750 text-slate-200 transition-colors font-medium text-sm border border-navy-700"
                >
                  <LogOut className="w-4 h-4" />
                  <span>로그아웃</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  id="mobile-login-btn"
                  onClick={() => {
                    onOpenAuth(false);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center space-x-2 py-3 rounded-lg bg-navy-800 text-slate-200 border border-navy-700 font-medium text-sm"
                >
                  <LogIn className="w-4 h-4 text-gold-500" />
                  <span>로그인</span>
                </button>
                <button
                  id="mobile-signup-btn"
                  onClick={() => {
                    onOpenAuth(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="py-3 rounded-lg bg-gold-500 text-navy-950 font-semibold text-sm text-center shadow-md shadow-gold-500/10"
                >
                  회원가입
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
