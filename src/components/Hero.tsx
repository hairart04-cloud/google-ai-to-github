import React from 'react';
import { ChevronRight, Shield, ShieldCheck, Zap, Award } from 'lucide-react';

interface HeroProps {
  onNavigate: (section: string) => void;
  onOpenAuth: (isSignUp: boolean) => void;
  hasUser: boolean;
}

export default function Hero({ onNavigate, onOpenAuth, hasUser }: HeroProps) {
  const stats = [
    { label: '연계 가맹점 수', value: '2,500 +', desc: '전국 주요 지사 및 배달대행 연계' },
    { label: '누적 바이크 렌탈', value: '1,800 +', desc: '이누리(Enuri) 전기 이륜차 포함' },
    { label: '신속 정비 만족도', value: '99.4 %', desc: '자체 정비소 및 모바일 현장 출동' },
  ];

  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-center bg-slate-50 text-slate-800 pt-24 overflow-hidden">
      {/* Background visual accents */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(249,115,22,0.06),transparent_50%)]"></div>
      <div className="absolute top-[30%] left-[-10%] w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Visual Call To Action & Text */}
        <div className="lg:col-span-7 space-y-8 text-left">
          <div className="inline-flex items-center space-x-2 bg-orange-100 border border-orange-200 px-3 py-1.5 rounded-full">
            <Zap className="w-4 h-4 text-orange-600 animate-pulse" />
            <span className="text-xs font-bold text-orange-700 tracking-wider font-mono">
              PREMIUM MOBILITY SOLUTION
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight font-sans text-slate-900">
            모빌리티의 기준을 세우다
            <span className="block mt-2 text-orange-600">
              LAVACORE MOBILITY
            </span>
          </h1>

          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl font-medium">
            배달대행 플랫폼과의 매끄러운 연동, 최고 수준의 자체 정비 인프라, 
            친환경 <strong>이누리(Enuri)</strong> 전기 이륜차 렌탈까지. 
            상생과 상생을 이어주는 최첨단 모빌리티 생태계, 지금 LAVACORE MOBILITY와 함께 만들어가세요.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              id="hero-franchise-btn"
              onClick={() => onNavigate('franchise')}
              className="flex items-center justify-center space-x-2 px-8 py-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold transition-all transform hover:-translate-y-0.5 shadow-lg shadow-orange-600/15 cursor-pointer"
            >
              <span>가맹 및 상담 문의</span>
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              id="hero-recruitment-btn"
              onClick={() => onNavigate('recruitment')}
              className="flex items-center justify-center space-x-2 px-8 py-4 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm font-semibold transition-all cursor-pointer"
            >
              <span>라이더 지원하기</span>
            </button>
          </div>

          {/* Key Trust Badges */}
          <div className="pt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500 font-semibold">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-orange-600" />
              <span>종합 책임 보험 지원</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-orange-600" />
              <span>실시간 플랫폼 API 연계</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-orange-600" />
              <span>공식 브랜드 이누리 취급</span>
            </div>
          </div>
        </div>

        {/* Dynamic Mockup Card visual of LAVACORE platform */}
        <div className="lg:col-span-5 relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/5 to-yellow-500/5 rounded-3xl blur-2xl"></div>
          <div className="relative bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <span className="text-xs font-bold font-mono text-slate-400">LAVACORE MOBILITY DASHBOARD</span>
            </div>

            {/* Quick Interactive Promo inside card */}
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-semibold">ACTIVE PLATFORMS</p>
                  <p className="text-sm font-bold text-slate-800 mt-1">배민커넥트 & 쿠팡이츠</p>
                </div>
                <span className="px-2.5 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded">CONNECTED</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-semibold">ENURI EV BIKE RENTAL</p>
                  <p className="text-sm font-bold text-slate-800 mt-1">이누리 V1 스페셜 모델</p>
                </div>
                <span className="px-2.5 py-1 bg-orange-100 text-orange-700 text-[10px] font-bold rounded">AVAILABLE</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-semibold">MAINTENANCE SYSTEM</p>
                  <p className="text-sm font-bold text-slate-800 mt-1">실시간 정비 접수 현황</p>
                </div>
                <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded">LIVE SUPPORT</span>
              </div>
            </div>

            {/* Micro-login reminder inside Hero card if user is anonymous */}
            {!hasUser && (
              <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl text-center">
                <p className="text-xs text-slate-600 font-semibold mb-2">간편하게 회원가입 후 예약/접수를 진행하세요.</p>
                <button
                  id="hero-card-signup-btn"
                  onClick={() => onOpenAuth(true)}
                  className="text-xs text-orange-600 font-extrabold hover:underline cursor-pointer"
                >
                  3초 회원가입 바로가기 &rarr;
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Numerical Stats Bar */}
      <div className="border-t border-slate-200 bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center space-y-2">
                <p className="text-4xl font-black text-orange-600 font-mono">
                  {stat.value}
                </p>
                <p className="text-sm font-bold text-slate-800">{stat.label}</p>
                <p className="text-xs text-slate-500">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
