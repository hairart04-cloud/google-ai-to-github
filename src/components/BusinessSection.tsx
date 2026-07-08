import React from 'react';
import { Bike, Wrench, Briefcase, ArrowRight } from 'lucide-react';

export default function BusinessSection() {
  const businessPillars = [
    {
      id: 'pillar-ev',
      title: '친환경 전기이륜차 렌탈 및 보급',
      subtitle: 'Eco-friendly EV Fleet',
      description: '정부 인증 정식 규격의 이누리(Enuri) 전기 바이크 라인업을 통해 배달 대행 지사 및 라이더 분들께 업계 최저 수준의 유지비와 최고의 주행 성능을 보장하는 스마트 렌탈 시스템을 제공합니다.',
      imageUrl: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=800&q=80',
      icon: <Bike className="w-6 h-6 text-gold-500" />,
      features: ['쿠루 BSS 배터리 교환 기술 연동', '정부 보조금 즉시 적용 혜택', '최대 280km 주행 플래그십 모델 라인업']
    },
    {
      id: 'pillar-maint',
      title: '정밀 이동식 모바일 정비 서비스',
      subtitle: 'Mobility Maintenance',
      description: '모빌리티 정비 전문 메카닉이 첨단 장비를 탑재한 정비 차량과 함께 현장으로 직접 찾아가는 전국 단위 홈케어 및 현장 긴급 정비 시스템을 통해 비즈니스의 연속성을 빈틈없이 지원합니다.',
      imageUrl: 'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?auto=format&fit=crop&w=800&q=80',
      icon: <Wrench className="w-6 h-6 text-gold-500" />,
      features: ['실시간 비대면 정비 예약 시스템', '순정 소모품 및 배터리 정밀 진단', '예방 점검 및 전담 메카닉 케어']
    },
    {
      id: 'pillar-franchise',
      title: '가맹 지사 및 라이더 파트너십',
      subtitle: 'Strategic Partnerships',
      description: 'LAVACORE MOBILITY의 체계적인 가맹지사 창업 모델과 고수익 라이더 일자리 연계를 통해 가맹점주와 라이더가 상생하며 동반 성장할 수 있는 완벽한 모빌리티 생태계를 구축합니다.',
      imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
      icon: <Briefcase className="w-6 h-6 text-gold-500" />,
      features: ['상권 분석 기반 독점 가맹 지역권', '라이더 인력 수급 및 세무 교육 지원', '배달 플랫폼 최적 통합 솔루션']
    }
  ];

  return (
    <section id="business-pillars" className="py-20 bg-navy-900 border-b border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-black tracking-widest text-gold-500 uppercase">
            LAVACORE MOBILITY PORTFOLIO
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            지속 가능한 그린 모빌리티 비즈니스
          </h2>
          <div className="h-1 w-12 bg-gold-500 mx-auto rounded-full"></div>
          <p className="text-slate-400 leading-relaxed text-sm sm:text-base">
            라바코어 모빌리티는 첨단 친환경 전기 오토바이 보급, 고도화된 정밀 메카닉 서비스, 
            그리고 전국 가맹 지사 파트너십을 통해 녹색 성장을 실천하며 상생 비즈니스 모델을 선도합니다.
          </p>
        </div>

        {/* Bento Grid layout with 3 High-quality business images */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {businessPillars.map((pillar) => (
            <div
              key={pillar.id}
              id={pillar.id}
              className="group bg-navy-950 rounded-3xl border border-navy-800 overflow-hidden shadow-lg hover:shadow-gold-500/5 hover:border-gold-500/30 transition-all duration-300 flex flex-col"
            >
              {/* Image Frame with Zoom effect */}
              <div className="relative h-56 sm:h-64 overflow-hidden bg-navy-950 shrink-0">
                <img
                  src={pillar.imageUrl}
                  alt={pillar.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-all duration-700 ease-out opacity-80 group-hover:opacity-100"
                />
                {/* Visual Accent Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent"></div>
                <div className="absolute top-4 left-4 bg-navy-900/95 backdrop-blur p-3 rounded-2xl shadow-md border border-navy-850">
                  {pillar.icon}
                </div>
              </div>

              {/* Card Contents */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <span className="text-xs font-bold text-gold-500 uppercase tracking-wider block">
                    {pillar.subtitle}
                  </span>
                  <h3 className="text-xl font-bold text-white leading-snug group-hover:text-gold-400 transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                {/* Features list */}
                <div className="space-y-2 pt-4 border-t border-navy-850">
                  {pillar.features.map((feature, i) => (
                    <div key={i} className="flex items-center space-x-2 text-xs sm:text-sm text-slate-300">
                      <div className="w-1.5 h-1.5 bg-gold-500 rounded-full shrink-0"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
