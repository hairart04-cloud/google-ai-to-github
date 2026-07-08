import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile } from '../types';
import { 
  ArrowRight, 
  CheckCircle, 
  ShieldCheck, 
  Award, 
  Sparkles, 
  Leaf, 
  Zap, 
  Briefcase, 
  Heart,
  TrendingUp,
  Mail,
  User,
  Phone,
  Building,
  FileText
} from 'lucide-react';

interface AboutEnuriSectionProps {
  user: UserProfile | null;
  onOpenAuth: (isSignUp: boolean) => void;
}

type ModalType = 'ceo' | 'proposal' | null;

export default function AboutEnuriSection({ user, onOpenAuth }: AboutEnuriSectionProps) {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  
  // Partnership Form state
  const [company, setCompany] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleProposalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newInquiry = {
        name: contactName,
        phone,
        region: company,
        content: `[협업 제안 문의]\n회사/단체명: ${company}\n담당자: ${contactName}\n이메일: ${email}\n\n제안 상세 내용:\n${message}`,
        status: 'pending',
        createdAt: Date.now()
      };

      await addDoc(collection(db, 'inquiries'), newInquiry);
      setSuccess(true);
      // Reset fields
      setCompany('');
      setContactName('');
      setPhone('');
      setEmail('');
      setMessage('');
    } catch (err) {
      console.error('Error saving partnership proposal:', err);
      alert('문의 접수 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type: ModalType) => {
    setActiveModal(type);
    setSuccess(false);
    if (type === 'proposal' && user) {
      setContactName(user.displayName || '');
      setPhone((user as any).phone || '');
      setEmail(user.email || '');
    }
  };

  return (
    <section id="about-enuri" className="py-24 bg-navy-950 text-slate-200 relative border-b border-navy-800 scroll-mt-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.05),transparent_50%)]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl sm:text-5xl font-black font-sans text-white tracking-tight">
            About LAVACORE
          </h2>
          <p className="text-slate-400 text-sm sm:text-base tracking-wide font-medium">
            친환경 모빌리티 라이프를 선도하는 라바코어 모빌리티
          </p>
          <div className="w-12 h-1 bg-emerald-500 mx-auto rounded-full mt-4"></div>
        </div>

        {/* 2 Column Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          
          {/* Card 1: CEO Greetings */}
          <div 
            id="about-card-ceo"
            onClick={() => openModal('ceo')}
            className="group relative h-[450px] rounded-3xl overflow-hidden border border-white/5 shadow-2xl cursor-pointer hover:border-emerald-500/30 transition-all duration-500"
          >
            {/* Background Aurora Image */}
            <div className="absolute inset-0 bg-navy-950">
              <img 
                src="https://images.unsplash.com/photo-1579033461380-adb47c3eb938?auto=format&fit=crop&q=80&w=800" 
                alt="CEO Greetings Background" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-45 group-hover:scale-105 transition-transform duration-750 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent"></div>
            </div>

            {/* Content Container */}
            <div className="absolute inset-0 flex flex-col items-center justify-between p-8 text-center z-10">
              <div /> {/* Spacer */}
              
              <div className="space-y-3">
                <h3 className="text-2xl font-black text-white tracking-tight group-hover:text-emerald-300 transition-colors">
                  CEO 인사말
                </h3>
                <p className="text-slate-350 text-xs tracking-wider">
                  라바코어의 비전
                </p>
              </div>

              {/* Circular Action Button */}
              <div className="w-12 h-12 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm flex items-center justify-center text-white group-hover:bg-emerald-500 group-hover:border-emerald-400 group-hover:scale-110 transition-all duration-300">
                <ArrowRight className="w-5 h-5 transform group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>

          {/* Card 2: Business Proposals */}
          <div 
            id="about-card-proposal"
            onClick={() => openModal('proposal')}
            className="group relative h-[450px] rounded-3xl overflow-hidden border border-white/5 shadow-2xl cursor-pointer hover:border-emerald-500/30 transition-all duration-500"
          >
            {/* Background Aurora Image */}
            <div className="absolute inset-0 bg-navy-950">
              <img 
                src="https://images.unsplash.com/photo-1483168527879-c66136b56105?auto=format&fit=crop&q=80&w=800" 
                alt="Business Proposals Background" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-45 group-hover:scale-105 transition-transform duration-750 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent"></div>
            </div>

            {/* Content Container */}
            <div className="absolute inset-0 flex flex-col items-center justify-between p-8 text-center z-10">
              <div /> {/* Spacer */}
              
              <div className="space-y-3">
                <h3 className="text-2xl font-black text-white tracking-tight group-hover:text-emerald-300 transition-colors">
                  협업 제안
                </h3>
                <p className="text-slate-350 text-xs tracking-wider">
                  비즈니스 파트너십 문의
                </p>
              </div>

              {/* Circular Action Button */}
              <div className="w-12 h-12 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm flex items-center justify-center text-white group-hover:bg-emerald-500 group-hover:border-emerald-400 group-hover:scale-110 transition-all duration-300">
                <ArrowRight className="w-5 h-5 transform group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Interactive Clean Detail Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/85 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl bg-navy-900 border border-navy-800 rounded-3xl overflow-hidden shadow-2xl relative text-slate-200">
            
            {/* Modal Header */}
            <div className="p-6 bg-navy-950 border-b border-navy-850 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {activeModal === 'ceo' && <Heart className="w-5 h-5 text-emerald-400" />}
                {activeModal === 'proposal' && <Briefcase className="w-5 h-5 text-emerald-400" />}
                <h4 className="text-xl font-black text-white">
                  {activeModal === 'ceo' && 'CEO 인사말'}
                  {activeModal === 'proposal' && '비즈니스 협업 제안'}
                </h4>
              </div>
              <button 
                id="close-about-modal-btn"
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-lg bg-navy-900 hover:bg-navy-800 text-slate-400 hover:text-white border border-navy-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="p-8 max-h-[75vh] overflow-y-auto space-y-6">
              
              {/* CEO GREETINGS TEXT */}
              {activeModal === 'ceo' && (
                <div className="space-y-6 text-sm sm:text-base leading-relaxed text-slate-300">
                  <div className="border-l-4 border-emerald-500 pl-4 py-1">
                    <p className="font-extrabold text-white text-lg sm:text-xl">
                      "지속 가능한 친환경 모빌리티의 미래를 개척합니다."
                    </p>
                  </div>
                  <p>
                    안녕하십니까, 친환경 모빌리티 서비스를 선도하는 <strong>라바코어 모빌리티(LAVACORE Mobility)</strong>에 관심을 가져주신 모든 분들께 깊은 감사를 드립니다.
                  </p>
                  <p>
                    라바코어 모빌리티는 급변하는 패러다임과 배달 대행 인프라 시장 속에서, 고출력 친환경 전기 이륜차 보급과 완벽한 애프터 정비 서비스를 결합한 <strong>독자적인 친환경 모빌리티 생태계</strong>를 제공하고 있습니다.
                  </p>
                  <p>
                    저희 라바코어 모빌리티는 대전, 세종, 충청권을 대표하는 프리미엄 파트너로서 소음과 탄소 배출이 없는 미래 도시 환경을 가꾸어 가는 동시에, 고물가 시대에 전속 지사장 및 라이더님들께 극대화된 경제적 가치와 최고의 리스 보조 혜택을 선사할 것을 약속드립니다.
                  </p>
                  <p>
                    언제나 신뢰할 수 있는 기술력과 진심을 담은 모바일 정비 케어로 현장 라이더분들의 든든한 날개가 되겠습니다. 여러분과 함께 푸르고 안전한 도로를 넓혀 나가겠습니다. 감사합니다.
                  </p>
                  <div className="pt-6 border-t border-navy-850 flex justify-end">
                    <div className="text-right">
                      <span className="text-xs text-slate-450 block font-mono">LAVACORE Mobility Group</span>
                      <p className="text-white font-extrabold text-sm sm:text-base mt-1">라바코어 모빌리티 임직원 일동</p>
                    </div>
                  </div>
                </div>
              )}

              {/* PROPOSAL FORM & CONTACT */}
              {activeModal === 'proposal' && (
                <div className="space-y-6">
                  {success ? (
                    <div className="text-center py-8 space-y-4 animate-scale-up">
                      <div className="inline-flex p-3 bg-green-500/10 border border-green-500/20 rounded-full">
                        <CheckCircle className="w-10 h-10 text-green-400" />
                      </div>
                      <h5 className="text-xl font-bold text-white">제안서 제출 완료</h5>
                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md mx-auto">
                        보내주신 비즈니스 제안서 및 연계 제휴 요청 사항이 접수되었습니다. 담당 부서에서 상세 검토 후 연락처로 피드백을 전달해 드리겠습니다.
                      </p>
                      <button
                        id="proposal-success-ok-btn"
                        onClick={() => setActiveModal(null)}
                        className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-navy-950 font-bold rounded-xl cursor-pointer"
                      >
                        닫기
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleProposalSubmit} className="space-y-4">
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                            <Building className="w-3.5 h-3.5 text-emerald-400" /> 회사 / 단체명
                          </label>
                          <input
                            id="proposal-company"
                            type="text"
                            required
                            placeholder="예: (주)라바코어"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            className="w-full bg-navy-950 border border-navy-800 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-emerald-400" /> 담당자명
                          </label>
                          <input
                            id="proposal-contact-name"
                            type="text"
                            required
                            placeholder="예: 김철수 대리"
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            className="w-full bg-navy-950 border border-navy-800 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-emerald-400" /> 연락처
                          </label>
                          <input
                            id="proposal-phone"
                            type="tel"
                            required
                            placeholder="예: 010-1234-5678"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-navy-950 border border-navy-800 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5 text-emerald-400" /> 이메일 주소
                          </label>
                          <input
                            id="proposal-email"
                            type="email"
                            required
                            placeholder="예: partner@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-navy-950 border border-navy-800 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5 text-emerald-400" /> 제휴 제안 및 제휴내용 상세
                        </label>
                        <textarea
                          id="proposal-message"
                          required
                          rows={4}
                          placeholder="배달 대행 제휴, 대량 렌탈 리스 금융 설계, 배터리 충전소 설치 제안, 또는 지역 광고 협업 등 원하시는 협업 내용을 구체적으로 기록해 주시면 빠른 안내에 도움이 됩니다."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="w-full bg-navy-950 border border-navy-800 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
                        />
                      </div>

                      <div className="flex items-center gap-2 text-[10px] text-slate-500 py-1">
                        <input id="proposal-privacy" type="checkbox" required className="accent-emerald-500 rounded" />
                        <span>[필수] 비즈니스 문의에 필요한 상호, 연락처 등 개인정보 수집 동의에 동의합니다.</span>
                      </div>

                      <button
                        id="proposal-submit-btn"
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-800 text-navy-950 font-black rounded-xl transition-all cursor-pointer text-xs sm:text-sm shadow-md"
                      >
                        {loading ? '제안 전송 중...' : '공식 비즈니스 협업 제안서 제출 완료하기'}
                      </button>
                    </form>
                  )}
                </div>
              )}

            </div>

          </div>
        </div>
      )}

    </section>
  );
}
