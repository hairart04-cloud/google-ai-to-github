import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile } from '../types';
import { 
  CheckCircle, 
  ArrowRight, 
  TrendingUp, 
  Award, 
  ShieldCheck, 
  PhoneCall, 
  Check, 
  ChevronRight, 
  FileText, 
  Building2, 
  Users, 
  Smartphone,
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface PlusRecruitmentSectionProps {
  user: UserProfile | null;
  onOpenAuth: (isSignUp: boolean) => void;
}

type CampaignType = 'coupang' | 'baemin';
type ApplicationRole = 'rider' | 'manager';

export default function PlusRecruitmentSection({ user, onOpenAuth }: PlusRecruitmentSectionProps) {
  const [activePlatform, setActivePlatform] = useState<CampaignType>('coupang');
  
  // Modal / Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formRole, setFormRole] = useState<ApplicationRole>('rider');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [region, setRegion] = useState('');
  const [details, setDetails] = useState('');
  const [experience, setExperience] = useState('');
  const [hasLicense, setHasLicense] = useState(true);

  const openApplicationForm = (platform: CampaignType, role: ApplicationRole) => {
    setActivePlatform(platform);
    setFormRole(role);
    setIsFormOpen(true);
    setSuccess(false);
    
    // Autofill name if user is logged in
    if (user) {
      setName(user.displayName || '');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setIsFormOpen(false);
      onOpenAuth(false);
      return;
    }

    setLoading(true);
    try {
      const platformName = activePlatform === 'coupang' ? '쿠팡이츠 플러스' : '배민 플러스';
      const roleName = formRole === 'rider' ? '라이더' : '지사장(가맹)';

      if (formRole === 'rider') {
        const newApplication = {
          userId: user.uid,
          name,
          phone,
          age: parseInt(age) || 0,
          region,
          experience: `[${platformName} 라이더 지원] ${experience}`,
          hasLicense,
          attachmentName: '온라인_플러스_신청.pdf',
          status: 'pending',
          createdAt: Date.now()
        };
        await addDoc(collection(db, 'rider_applications'), newApplication);
      } else {
        const newInquiry = {
          name,
          phone,
          region,
          content: `[${platformName} 지사장 문의] \n희망 지역: ${region} \n상세 내용: ${details}`,
          status: 'pending',
          createdAt: Date.now()
        };
        await addDoc(collection(db, 'inquiries'), newInquiry);
      }

      setSuccess(true);
      // Reset fields
      setAge('');
      setRegion('');
      setDetails('');
      setExperience('');
    } catch (err) {
      console.error('Error saving campaign application:', err);
      alert('신청 접수 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  // Coupang Eats Plus Campaign Data
  const coupangData = {
    title: "쿠팡이츠 플러스 파트너스 모집",
    subtitle: "Coupang Eats Plus Partners",
    heroDesc: "쿠팡이츠 플러스 공식 대행 제휴사 LAVACORE가 제안하는 파격적인 수익 모델. 전속 지사 설립 및 우수 라이더 크루에 합류하여 최고 수준의 건당 할증료를 선점하세요.",
    image: "https://images.unsplash.com/photo-1526367790999-0150786486a9?auto=format&fit=crop&q=80&w=800",
    colorAccent: "text-rose-500",
    bgAccent: "from-rose-950/40 to-slate-900/40 border-rose-500/20",
    badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    hoverBorder: "hover:border-rose-500/40",
    
    riderSection: {
      title: "쿠팡이츠 플러스 라이더",
      perk: "건당 평균 6,500원 ~ 최대 12,000원 초고단가 보장 및 상시 프로모션 보너스 지급",
      steps: [
        { title: "온라인 라이더 지원", desc: "하단 신청 버튼을 통해 인적 사항 및 원동기/이륜 면허 보유 정보를 입력해 주세요." },
        { title: "대전/세종/충청 해피콜 상담", desc: "라바코어 전문 컨설턴트가 24시간 이내 연락하여 상세 운용 구역 및 정산 일정을 상담합니다." },
        { title: "바이크 교부 및 기기 배정", desc: "이누리 v1 전기 바이크 초우대 할인 렌탈 및 배달 가방, 기기 등록을 완료합니다." },
        { title: "전용 피크타임 배차 및 출근", desc: "플러스 전속 라이더 전용 피크타임 오더 우선배차망을 가동하여 최고 수익 주행을 시작합니다." }
      ]
    },
    managerSection: {
      title: "쿠팡이츠 플러스 지사장(가맹)",
      perk: "지정 구역 내 독점 운영권 부여 및 인근 대행 오더 연계, 관리자 통합 페이지 제공",
      steps: [
        { title: "가맹 지사 신청 및 상담", desc: "원하시는 독점 선점 희망 지역과 대형 운용 바이크 대수를 간편히 신청합니다." },
        { title: "상권분석 및 본사 인터뷰", desc: "본사 개설팀에서 해당 구역의 쿠팡이츠 배달 밀도와 상권을 전수 분석하여 타당성을 심사합니다." },
        { title: "라바코어 패키지 계약", desc: "전기바이크 일괄 리스 금융 지원 및 배달 관리 솔루션(BSS 연계) 계약을 체결합니다." },
        { title: "지사 개설 및 크루 배정 지원", desc: "지사장님만의 구역 개설 완료 및 본사 라이더 구인 풀을 통해 즉각적인 수급 시너지를 이끌어냅니다." }
      ]
    }
  };

  // Baemin Plus Campaign Data
  const baeminData = {
    title: "배민 플러스 공식 크루 & 지사장 대모집",
    subtitle: "Baemin Plus Partners",
    heroDesc: "대한민국 1등 배달 플랫폼 '배달의민족'이 보증하고 LAVACORE가 서포트하는 프리미엄 배민 플러스 네트워크. 안정적인 오더 물량과 최고의 모빌리티 서포트를 제공합니다.",
    image: "https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&q=80&w=800",
    colorAccent: "text-teal-400",
    bgAccent: "from-teal-950/40 to-slate-900/40 border-teal-500/20",
    badgeColor: "bg-teal-500/10 text-teal-400 border-teal-500/20",
    hoverBorder: "hover:border-teal-500/40",
    
    riderSection: {
      title: "배민 플러스 전속 라이더",
      perk: "단거리 묶음배송 최적 알고리즘 배차로 시간당 최고 5~6건 오더 수행, 누적 수수료 업계 최저 적용",
      steps: [
        { title: "배민 플러스 크루 온라인 지원", desc: "스마트 기기 보유 여부 및 이륜차 면허 확인을 위한 지원서를 간편 접수합니다." },
        { title: "운행 희망 구역 1:1 조율", desc: "전담 메니저가 배전망 우선 배정 구역 및 시간별 프로모션 단가를 실시간 조율합니다." },
        { title: "바이크 배정 및 웰컴패키지", desc: "친환경 고출력 이누리 바이크 교부 및 헬멧/유니폼 등 전문 웰컴 패키지를 지원합니다." },
        { title: "수행 및 즉각적인 일일 정산", desc: "주간 배달 성과에 따른 본사 추가 보너스 지급 및 즉각적인 정산 시스템을 제공받습니다." }
      ]
    },
    managerSection: {
      title: "배민 플러스 공식 지사장(가맹)",
      perk: "배민 플러스 독점 가맹 상권 배정 및 이륜차 현장 모바일 정비 정기 케어(라바코어 전담) 무상 제공",
      steps: [
        { title: "지사장 지원 상담 요청", desc: "본사 전용 망을 활용한 지사 설립 문의 및 소유 기사 인원 규모를 작성하여 제출합니다." },
        { title: "배정 구역 검토 및 승인", desc: "배민 플러스 관할 대행 가능 독점 구역 할당 및 지사 권역 보안 설정을 확보합니다." },
        { title: "인프라 제휴 및 시스템 등록", desc: "이누리 v1 전기오토바이 통합 보급 지원 및 대행 관리 솔루션을 실시간 연동 등록합니다." },
        { title: "지사 정식 출범 및 매출 달성", desc: "본사 마케팅 지원을 통한 지역 가맹 상가 자동 연계 및 고수익 지사 매출을 창출합니다." }
      ]
    }
  };

  const currentData = activePlatform === 'coupang' ? coupangData : baeminData;

  return (
    <section id="plus-recruitment" className="py-24 bg-navy-950 text-slate-200 relative border-b border-navy-800">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(193,150,42,0.05),transparent_40%)]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold text-gold-500 tracking-widest uppercase flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-gold-500 animate-pulse" /> PREMIUM PLATFORM CAMPAIGN
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-sans text-white">
            메가 플랫폼 전속 연동 파트너십
          </h2>
          <p className="text-slate-450 text-base max-w-2xl mx-auto">
            대한민국 배달 인프라의 핵심, <strong className="text-white">쿠팡이츠 플러스</strong>와 <strong className="text-white">배민 플러스</strong>의 
            공식 모빌리티 협력사 LAVACORE에서 제안하는 획기적인 성장 기회입니다.
          </p>
          
          {/* Platform Tab Switchers */}
          <div className="flex justify-center gap-4 pt-6">
            <button
              id="switch-coupang-btn"
              onClick={() => setActivePlatform('coupang')}
              className={`px-6 py-3 rounded-2xl text-sm font-black transition-all cursor-pointer flex items-center gap-2 border ${
                activePlatform === 'coupang'
                  ? 'bg-rose-500 text-navy-950 border-rose-400 shadow-lg shadow-rose-500/20 scale-105'
                  : 'bg-navy-900 text-slate-350 border-navy-800 hover:text-white hover:border-slate-700'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-rose-300 animate-ping" />
              쿠팡이츠 플러스 파트너스
            </button>
            <button
              id="switch-baemin-btn"
              onClick={() => setActivePlatform('baemin')}
              className={`px-6 py-3 rounded-2xl text-sm font-black transition-all cursor-pointer flex items-center gap-2 border ${
                activePlatform === 'baemin'
                  ? 'bg-teal-500 text-navy-950 border-teal-400 shadow-lg shadow-teal-500/20 scale-105'
                  : 'bg-navy-900 text-slate-350 border-navy-800 hover:text-white hover:border-slate-700'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-teal-300 animate-ping" />
              배달의민족 플러스 크루
            </button>
          </div>
        </div>

        {/* Selected Platform Hero Card */}
        <div className={`bg-gradient-to-br ${currentData.bgAccent} border rounded-3xl p-8 sm:p-12 mb-16 shadow-2xl relative overflow-hidden transition-all duration-300`}>
          <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-12 opacity-5 pointer-events-none">
            <TrendingUp className="w-96 h-96 text-white" />
          </div>
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 relative z-10">
            <div className="max-w-2xl space-y-4 lg:w-3/5 text-left">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase font-mono border ${currentData.badgeColor}`}>
                {currentData.subtitle}
              </span>
              <h3 className="text-2xl sm:text-3.5xl font-extrabold text-white tracking-tight leading-tight">
                {currentData.title}
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {currentData.heroDesc}
              </p>
            </div>
            
            {/* Beautiful Custom Image/Logo Container */}
            <div className="w-full lg:w-2/5 flex justify-center">
              <div className="relative group rounded-2xl overflow-hidden border border-white/10 shadow-2xl max-w-sm w-full aspect-[4/3] select-none">
                {activePlatform === 'coupang' ? (
                  /* Coupang Eats Custom Brand Logo Card */
                  <div className="w-full h-full bg-[#fdfdfd] flex flex-col items-center justify-center p-8 relative">
                    {/* Background decorative elements */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />
                    <div className="absolute -top-12 -left-12 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl" />
                    <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl" />

                    {/* Logo Body */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-3xl sm:text-4xl font-extrabold tracking-tighter">
                        <span className="text-[#CA4F1F]">c</span>
                        <span className="text-[#333333]">o</span>
                        <span className="text-[#D13926]">u</span>
                        <span className="text-[#F3931D]">p</span>
                        <span className="text-[#F4B81A]">a</span>
                        <span className="text-[#399A52]">n</span>
                        <span className="text-[#1B8EC8]">g</span>
                      </div>
                      <div className="text-5xl sm:text-6.5xl font-black tracking-tighter text-[#5D3E31] mt-1">
                        eats
                      </div>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between border-t border-slate-100 pt-3">
                      <span className="text-[10px] font-black tracking-widest text-[#5D3E31]/75 font-mono">
                        COUPANG EATS PLUS
                      </span>
                      <span className="text-[9px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                        OFFICIAL PARTNER
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Baemin Plus Custom Brand Logo Card */
                  <div className="w-full h-full bg-[#2AC1BC] flex flex-col items-center justify-center p-8 relative">
                    {/* Background decorative waves/grids */}
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:24px_24px]" />
                    <div className="absolute -top-16 -right-16 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse" />

                    {/* Logo & Delivery Graphic Container */}
                    <div className="text-center flex flex-col items-center gap-4">
                      {/* Baemin Connect Styled Icon */}
                      <div className="relative">
                        <div className="w-16 h-16 bg-[#1B7A77]/20 rounded-2xl border border-white/20 flex items-center justify-center shadow-lg">
                          <svg className="w-9 h-9 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="8" width="18" height="12" rx="2" />
                            <path d="M12 2v6" />
                            <path d="M12 8H3" />
                            <path d="M12 8h9" />
                            <path d="M7 8v12" />
                            <path d="M17 8v12" />
                          </svg>
                        </div>
                        {/* Delivery Bag Bow Ribbon */}
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-2 bg-white rounded-full border border-[#1B7A77]" />
                      </div>

                      <div>
                        <div className="text-4xl sm:text-5xl font-black tracking-tighter text-white leading-tight drop-shadow-sm">
                          배민 플러스
                        </div>
                        <div className="text-xs font-bold text-[#1B7A77] tracking-wider uppercase font-mono mt-0.5">
                          Baemin Plus Partners
                        </div>
                      </div>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between border-t border-white/10 pt-3">
                      <span className="text-[10px] font-black tracking-widest text-white/95 font-mono">
                        BAEMIN CONNECT PLUS
                      </span>
                      <span className="text-[9px] font-bold text-[#2AC1BC] bg-white px-2 py-0.5 rounded border border-white/20 shadow-sm">
                        OFFICIAL PARTNER
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Core Double Columns: Riders vs Branch Managers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Column A: Riders (라이더) */}
          <div className={`bg-navy-900 border border-navy-800 rounded-3xl p-6 sm:p-10 flex flex-col justify-between shadow-xl transition-all ${currentData.hoverBorder}`}>
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gold-500/10 border border-gold-500/20 rounded-2xl">
                  <Smartphone className="w-6 h-6 text-gold-500" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white">{currentData.riderSection.title}</h4>
                  <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">Rider Recruitment Guide</span>
                </div>
              </div>
              
              <div className="p-4 bg-navy-950 border border-navy-850 rounded-2xl">
                <p className="text-xs text-slate-400 leading-normal font-sans">
                  <strong className="text-gold-500 block mb-1">💡 라이더 특전</strong>
                  {currentData.riderSection.perk}
                </p>
              </div>

              {/* Rider Steps / Application Method */}
              <div className="space-y-4">
                <h5 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-navy-850 pb-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-gold-500 rounded-full" /> 라이더 신청방법 및 상세절차
                </h5>
                <div className="space-y-4 pl-1">
                  {currentData.riderSection.steps.map((step, idx) => (
                    <div key={idx} className="flex gap-3.5 items-start">
                      <div className="w-6 h-6 shrink-0 bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-bold rounded-full flex items-center justify-center font-mono mt-0.5">
                        {idx + 1}
                      </div>
                      <div>
                        <h6 className="text-sm font-bold text-slate-200">{step.title}</h6>
                        <p className="text-xs text-slate-450 mt-0.5 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-navy-850 mt-8">
              <button
                id={`apply-rider-${activePlatform}-btn`}
                onClick={() => openApplicationForm(activePlatform, 'rider')}
                className="w-full py-4 bg-gold-500 hover:bg-gold-600 text-navy-950 font-black rounded-2xl transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-gold-500/10 text-sm"
              >
                <span>{activePlatform === 'coupang' ? '쿠팡이츠' : '배민'} 플러스 라이더 신청하기</span>
                <ChevronRight className="w-4 h-4 font-bold" />
              </button>
            </div>
          </div>

          {/* Column B: Branch Managers (지사장) */}
          <div className={`bg-navy-900 border border-navy-800 rounded-3xl p-6 sm:p-10 flex flex-col justify-between shadow-xl transition-all ${currentData.hoverBorder}`}>
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gold-500/10 border border-gold-500/20 rounded-2xl">
                  <Building2 className="w-6 h-6 text-gold-500" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white">{currentData.managerSection.title}</h4>
                  <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">Branch Manager Guide</span>
                </div>
              </div>
              
              <div className="p-4 bg-navy-950 border border-navy-850 rounded-2xl">
                <p className="text-xs text-slate-400 leading-normal font-sans">
                  <strong className="text-gold-500 block mb-1">💡 지사장(가맹) 특전</strong>
                  {currentData.managerSection.perk}
                </p>
              </div>

              {/* Manager Steps / Application Method */}
              <div className="space-y-4">
                <h5 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-navy-850 pb-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-gold-500 rounded-full" /> 지사장 신청방법 및 가맹개설절차
                </h5>
                <div className="space-y-4 pl-1">
                  {currentData.managerSection.steps.map((step, idx) => (
                    <div key={idx} className="flex gap-3.5 items-start">
                      <div className="w-6 h-6 shrink-0 bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-bold rounded-full flex items-center justify-center font-mono mt-0.5">
                        {idx + 1}
                      </div>
                      <div>
                        <h6 className="text-sm font-bold text-slate-200">{step.title}</h6>
                        <p className="text-xs text-slate-450 mt-0.5 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-navy-850 mt-8">
              <button
                id={`apply-manager-${activePlatform}-btn`}
                onClick={() => openApplicationForm(activePlatform, 'manager')}
                className="w-full py-4 bg-navy-950 hover:bg-navy-850 text-slate-100 border border-navy-800 font-black rounded-2xl transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2 shadow-lg text-sm"
              >
                <span>{activePlatform === 'coupang' ? '쿠팡이츠' : '배민'} 플러스 지사장 개설 신청</span>
                <ChevronRight className="w-4 h-4 text-gold-500" />
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Interactive Clean Application Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/85 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-navy-900 border border-navy-800 rounded-3xl overflow-hidden shadow-2xl relative text-slate-200">
            
            {/* Header */}
            <div className="p-6 bg-navy-950 border-b border-navy-850 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black tracking-widest text-gold-500 uppercase block font-mono">
                  {activePlatform === 'coupang' ? 'COUPANG EATS PLUS' : 'BAEMIN PLUS'} CAMPAIGN
                </span>
                <h4 className="text-lg font-black text-white">
                  {activePlatform === 'coupang' ? '쿠팡이츠 플러스' : '배민 플러스'} {formRole === 'rider' ? '라이더 크루 지원' : '지사장 개설 가맹상담'}
                </h4>
              </div>
              <button 
                id="close-modal-btn"
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 rounded-lg bg-navy-900 hover:bg-navy-800 text-slate-400 hover:text-white border border-navy-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto space-y-6">
              {success ? (
                <div className="text-center py-10 space-y-4 animate-scale-up">
                  <div className="inline-flex p-3 bg-green-500/10 border border-green-500/20 rounded-full">
                    <CheckCircle className="w-10 h-10 text-green-400" />
                  </div>
                  <h5 className="text-xl font-bold text-white">신청서 접수 완료!</h5>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    작성해 주신 소중한 신청서가 정상 접수되었습니다. 
                    라바코어 통합 관리센터 및 희망 구역 메니저가 검토한 후 즉시 전화를 드려 상세 안내를 전해 드리겠습니다.
                  </p>
                  <button
                    id="close-success-btn"
                    onClick={() => setIsFormOpen(false)}
                    className="mt-2 px-6 py-2.5 bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold rounded-xl cursor-pointer"
                  >
                    확인
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  
                  {/* Auth Warning for non-logged in */}
                  {!user && (
                    <div className="p-4 bg-gold-500/10 border border-gold-500/20 rounded-xl text-xs text-gold-400 space-y-2">
                      <p className="font-semibold text-center">💡 로그인이 필요한 작업입니다.</p>
                      <p className="text-center">신청 정보를 저장하고 심사 상태를 실시간 확인하시려면 간편 로그인을 진행해 주세요.</p>
                      <button
                        id="form-login-trigger"
                        type="button"
                        onClick={() => {
                          setIsFormOpen(false);
                          onOpenAuth(false);
                        }}
                        className="w-full py-2 bg-gold-500 text-navy-950 font-bold rounded-lg cursor-pointer hover:bg-gold-600 transition-colors"
                      >
                        간편 로그인 하러가기
                      </button>
                    </div>
                  )}

                  {user && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 mb-1">지원자명 / 상호</label>
                          <input
                            id="campaign-name"
                            type="text"
                            required
                            placeholder="예: 홍길동"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-navy-950 border border-navy-800 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-gold-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 mb-1">연락처</label>
                          <input
                            id="campaign-phone"
                            type="tel"
                            required
                            placeholder="예: 010-1234-5678"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-navy-950 border border-navy-800 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-gold-500"
                          />
                        </div>
                      </div>

                      {formRole === 'rider' ? (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-semibold text-slate-400 mb-1">연령 (만 나이)</label>
                              <input
                                id="campaign-age"
                                type="number"
                                required
                                placeholder="예: 25"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                className="w-full bg-navy-950 border border-navy-800 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-gold-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-slate-400 mb-1">희망 주행 구역</label>
                              <input
                                id="campaign-region-rider"
                                type="text"
                                required
                                placeholder="예: 대전 서구 둔산동"
                                value={region}
                                onChange={(e) => setRegion(e.target.value)}
                                className="w-full bg-navy-950 border border-navy-800 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-gold-500"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1">간단한 이력 및 요청 사항</label>
                            <textarea
                              id="campaign-exp"
                              rows={3}
                              placeholder="배달 경력 유무 및 희망 운행 시간(전업/부업 등)을 적어주세요."
                              value={experience}
                              onChange={(e) => setExperience(e.target.value)}
                              className="w-full bg-navy-950 border border-navy-800 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-gold-500 resize-none"
                            />
                          </div>

                          <div className="flex gap-2.5 bg-navy-950 p-3 border border-navy-850 rounded-xl text-[11px] text-slate-400">
                            <input
                              id="campaign-license"
                              type="checkbox"
                              checked={hasLicense}
                              onChange={(e) => setHasLicense(e.target.checked)}
                              className="accent-gold-500 w-4 h-4 shrink-0 rounded"
                            />
                            <span>이륜차 운전 면허 보유 및 현장 배달 운행에 법적 결격 사유가 없음을 서약합니다.</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1">개설 희망 전용 구역</label>
                            <input
                              id="campaign-region-manager"
                              type="text"
                              required
                              placeholder="예: 충남 천안시 서북구 전체"
                              value={region}
                              onChange={(e) => setRegion(e.target.value)}
                              className="w-full bg-navy-950 border border-navy-800 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-gold-500"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1">지사 운용 계획 및 상세 문의</label>
                            <textarea
                              id="campaign-details"
                              rows={4}
                              placeholder="현재 운용 중인 이륜차 대수 또는 신규 운용 예정 대수와 소속 기사 규모를 간략히 공유해 주시면 최적의 보조금 및 렌탈 리스를 설계해 드립니다."
                              value={details}
                              onChange={(e) => setDetails(e.target.value)}
                              className="w-full bg-navy-950 border border-navy-800 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-gold-500 resize-none"
                            />
                          </div>
                        </>
                      )}

                      <div className="flex items-center gap-2 text-[10px] text-slate-500">
                        <input id="campaign-privacy" type="checkbox" required className="accent-gold-500 rounded" />
                        <span>[필수] 개인정보 수집 및 본사 제휴 심사 이용 약관에 동의합니다.</span>
                      </div>

                      <button
                        id="campaign-submit-btn"
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-gold-500 hover:bg-gold-600 disabled:bg-gold-800 text-navy-950 font-black rounded-xl transition-all cursor-pointer text-xs sm:text-sm shadow-md"
                      >
                        {loading ? '신청서 전송 중...' : '공식 파트너십 무료 등록 신청 완료하기'}
                      </button>
                    </>
                  )}

                </form>
              )}
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
