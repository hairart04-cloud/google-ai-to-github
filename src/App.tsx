/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, seedInitialData, handleFirestoreError, OperationType } from './firebase';
import { UserProfile } from './types';

// Custom Section Components
import Header from './components/Header';
import Hero from './components/Hero';
import FranchiseSection from './components/FranchiseSection';
import BusinessSection from './components/BusinessSection';
import MaintenanceSection from './components/MaintenanceSection';
import EVRentalSection from './components/EVRentalSection';
import RiderSection from './components/RiderSection';
import ReservationSection from './components/ReservationSection';
import AdminDashboard from './components/AdminDashboard';
import AuthModal from './components/AuthModal';
import FloatingChatbot from './components/FloatingChatbot';

import { Shield, Sparkles, MapPin, Phone, Mail, FileText, ChevronUp } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [authModal, setAuthModal] = useState({ isOpen: false, isSignUp: false });
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    // 1. Seed initial sample database records if empty
    seedInitialData();

    // 2. Track authentication states
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const docRef = doc(db, 'users', firebaseUser.uid);
        let docSnap;
        try {
          docSnap = await getDoc(docRef);
        } catch (err) {
          handleFirestoreError(err, OperationType.GET, `users/${firebaseUser.uid}`);
          return;
        }

        let role: 'user' | 'admin' = 'user';
        if (firebaseUser.email === 'hairart04@gmail.com') {
          role = 'admin';
        }

        const profile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '사용자',
          role: role,
        };

        if (docSnap && !docSnap.exists()) {
          try {
            await setDoc(docRef, profile, { merge: true });
          } catch (err) {
            handleFirestoreError(err, OperationType.WRITE, `users/${firebaseUser.uid}`);
            return;
          }
        } else if (docSnap) {
          const existingData = docSnap.data();
          profile.role = existingData.role || role;
        }

        setUser(profile);
        // Auto-enable Admin Mode if the logged-in user is an admin
        if (profile.role === 'admin') {
          setIsAdminMode(true);
        }
      } else {
        setUser(null);
        setIsAdminMode(false);
      }
    });

    // 3. Track scroll to show 'Scroll to Top' button and active sections
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);

      const sections = ['hero', 'franchise', 'maintenance', 'rental', 'recruitment', 'reservation'];
      const scrollPosition = window.scrollY + 300;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsAdminMode(false);
      alert('성공적으로 로그아웃되었습니다.');
    } catch (err) {
      console.error(err);
    }
  };

  const handleAuthSuccess = (profile: UserProfile) => {
    setUser(profile);
    if (profile.role === 'admin') {
      setIsAdminMode(true);
    }
    alert(`${profile.displayName}님, 환영합니다!`);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 font-sans selection:bg-orange-600 selection:text-white">
      {/* 1. Universal Top Header */}
      <Header
        user={user}
        isAdminMode={isAdminMode}
        setIsAdminMode={setIsAdminMode}
        onOpenAuth={(isSignUp) => setAuthModal({ isOpen: true, isSignUp })}
        onLogout={handleLogout}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* 2. Admin mode Banner notification */}
      {isAdminMode && (
        <div className="fixed bottom-6 left-6 z-40 bg-red-650 text-white font-semibold text-xs py-2 px-4 rounded-xl shadow-2xl border border-red-500 flex items-center space-x-2 animate-bounce">
          <Shield className="w-4 h-4" />
          <span>관리자 시뮬레이션 모드 활성화 중</span>
        </div>
      )}

      {/* 3. Floating Scroll To Top Button */}
      {showScrollTop && (
        <button
          id="scroll-to-top-btn"
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-600/20 transition-all transform hover:-translate-y-1 hover:scale-105 cursor-pointer"
          title="맨 위로"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}

      {/* 4. Active Main Page View Switcher */}
      {isAdminMode && user?.role === 'admin' ? (
        <div className="pt-20">
          <AdminDashboard />
          
          {/* Quick exit bar from Admin Console */}
          <div className="bg-slate-900 border-t border-slate-800 py-8 text-center text-slate-400 text-sm">
            <p className="mb-2">콘솔 관리를 마치셨나요? 유저 서비스를 테스트해 보세요.</p>
            <button
              id="exit-admin-btn"
              onClick={() => setIsAdminMode(false)}
              className="px-6 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-orange-500 font-semibold border border-slate-700 transition-colors cursor-pointer"
            >
              사용자 화면(Landing Page)으로 돌아가기
            </button>
          </div>
        </div>
      ) : (
        <main className="relative">
          {/* Section 1: Hero Intro */}
          <Hero
            onNavigate={(id) => {
              setActiveSection(id);
              document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
            }}
            onOpenAuth={(isSignUp) => setAuthModal({ isOpen: true, isSignUp })}
            hasUser={!!user}
          />

          {/* Business Core Pillars with Images */}
          <BusinessSection />

          {/* Section 2: Franchise & 대행상담 */}
          <FranchiseSection />

          {/* Section 3: 정비 & 챗봇 */}
          <MaintenanceSection
            user={user}
            onOpenAuth={(isSignUp) => setAuthModal({ isOpen: true, isSignUp })}
          />

          {/* Section 4: 전기이륜차 렌탈 */}
          <EVRentalSection
            user={user}
            onOpenAuth={(isSignUp) => setAuthModal({ isOpen: true, isSignUp })}
          />

          {/* Section 5: 라이더 구인구직 */}
          <RiderSection
            user={user}
            onOpenAuth={(isSignUp) => setAuthModal({ isOpen: true, isSignUp })}
          />

          {/* Section 6: 본사/지사 방문예약 */}
          <ReservationSection
            user={user}
            onOpenAuth={(isSignUp) => setAuthModal({ isOpen: true, isSignUp })}
          />
        </main>
      )}

      {/* 5. Cohesive Premium Footer */}
      <footer className="bg-slate-900 border-t border-slate-850 text-slate-400 py-16 text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column Brand */}
          <div className="md:col-span-4 space-y-4">
            <span className="text-lg font-black tracking-wider text-slate-200 font-sans block">
              LAVACORE MOBILITY
            </span>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              우리는 배달대행 사업주, 전문 라이더, 정비 마스터를 유기적으로 연결하는 
              차세대 이륜 모빌리티 선도 파트너입니다.
            </p>
          </div>

          {/* Middle Column Contacts */}
          <div className="md:col-span-5 space-y-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-2">
              Corporate & Support Information
            </span>
            <div className="space-y-1.5 text-slate-400">
              <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 shrink-0" /> 회사 주소: 대전광역시 서구 괴정로 88</p>
              <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 shrink-0" /> 대표 번호: 010-3934-4022 (연중무휴)</p>
              <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 shrink-0" /> 이메일: hairart04@gmail.com</p>
              <p className="flex items-center gap-2"><FileText className="w-3.5 h-3.5 shrink-0" /> 대표이사: 방효석</p>
              <p className="flex items-center gap-2"><FileText className="w-3.5 h-3.5 shrink-0" /> 사업자등록번호: 806-25-01282</p>
            </div>
          </div>

          {/* Right Column Services overview */}
          <div className="md:col-span-3 space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-2">
              Core Businesses
            </span>
            <div className="space-y-1 text-slate-400">
              <p>배달대행 API 플랫폼 연동 제휴</p>
              <p>이누리(Enuri) 전기 오토바이 판매/렌탈</p>
              <p>마이크로 딜리버리 이륜차 현장 케어</p>
              <p>라이더 수급 및 직무 안전 교육</p>
            </div>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <p>© 2026 LAVACORE MOBILITY. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#privacy" className="hover:text-slate-300">개인정보처리방침</a>
            <a href="#terms" className="hover:text-slate-300">이용약관</a>
            <a href="#location" className="hover:text-slate-300">위치기반서비스이용약관</a>
          </div>
        </div>
      </footer>

      {/* 6. Universal Authentication Dialog/Modal */}
      <AuthModal
        isOpen={authModal.isOpen}
        onClose={() => setAuthModal({ ...authModal, isOpen: false })}
        isSignUpInitial={authModal.isSignUp}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* 7. Global Floating AI Chatbot Assistant */}
      <FloatingChatbot />
    </div>
  );
}
