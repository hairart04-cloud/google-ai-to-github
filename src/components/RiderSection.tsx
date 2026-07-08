import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile } from '../types';
import { CheckCircle, Upload, ShieldCheck, DollarSign, Clock, ArrowRight, UserPlus } from 'lucide-react';

interface RiderSectionProps {
  user: UserProfile | null;
  onOpenAuth: (isSignUp: boolean) => void;
}

export default function RiderSection({ user, onOpenAuth }: RiderSectionProps) {
  const [name, setName] = useState(user?.displayName || '');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [region, setRegion] = useState('');
  const [experience, setExperience] = useState('');
  const [hasLicense, setHasLicense] = useState(true);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const perks = [
    {
      icon: <DollarSign className="w-6 h-6 text-gold-500" />,
      title: "동종 업계 최고 수준 수수료",
      desc: "수수료 최저 보장, 기사 친화적인 정산 시스템을 적용하여 열심히 땀 흘린 만큼 고스란히 가져가실 수 있습니다."
    },
    {
      icon: <Clock className="w-6 h-6 text-gold-500" />,
      title: "완벽하게 자유로운 시간 조율",
      desc: "원할 때 로그인하고 원할 때 로그아웃하는 유연한 근무. 풀타임 주야간 조부터 투잡/알바 파트타임까지 모두 환영합니다."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-gold-500" />,
      title: "이누리 최신 이륜차 렌탈 할인",
      desc: "초기 자본이 부족한 초보자분들을 위해, 공식 친환경 이누리 전기 오토바이를 특가 우대 가격에 파격 렌탈해 드립니다."
    }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAttachment(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth(false);
      return;
    }

    setLoading(true);
    try {
      const newApplication = {
        userId: user.uid,
        name,
        phone,
        age: parseInt(age) || 0,
        region,
        experience,
        hasLicense,
        attachmentName: attachment ? attachment.name : '온라인_자체기재.pdf',
        status: 'pending',
        createdAt: Date.now()
      };

      await addDoc(collection(db, 'rider_applications'), newApplication);
      setSubmitted(true);
      setName('');
      setPhone('');
      setAge('');
      setRegion('');
      setExperience('');
      setAttachment(null);
    } catch (err) {
      console.error('Error submitting rider app:', err);
      alert('라이더 지원서 접수 중 에러가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="recruitment" className="py-24 bg-navy-900 text-slate-200 relative border-b border-navy-800">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(193,150,42,0.04),transparent_40%)]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold text-gold-500 tracking-widest uppercase">
            RIDER RECRUITMENT
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-sans text-white">
            LAVACORE 최고 연봉 라이더의 주인공,
            <span className="block mt-1 text-gold-500">
              바로 당신입니다
            </span>
          </h2>
          <p className="text-slate-400 text-base">
            대행 플랫폼 통합 수급과 이륜차 무상 렌탈 연계 혜택을 받는 LAVACORE 전속 크루에 승선하세요. 
            정기적인 수입 보장과 철저한 상생 안전망으로 라이더님의 뒤를 든든히 지키겠습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          {/* Perks & Values */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              {perks.map((perk, i) => (
                <div key={i} className="p-6 bg-navy-950 border border-navy-800 hover:border-gold-500/20 rounded-3xl transition-all space-y-3 shadow-xl">
                  <div className="p-3 bg-gold-500/10 border border-gold-500/20 rounded-xl w-fit">
                    {perk.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white">{perk.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{perk.desc}</p>
                </div>
              ))}
            </div>

            {/* Micro-guide */}
            <div className="bg-gradient-to-r from-navy-950 to-navy-900 border border-navy-800 rounded-3xl p-6 space-y-3 shadow-xl">
              <p className="text-sm font-extrabold text-gold-400">초보자를 위한 완벽 입직 절차</p>
              <div className="space-y-2 text-xs text-slate-350">
                <p className="flex items-center gap-2"><ArrowRight className="w-3.5 h-3.5 text-gold-500 shrink-0" /> 1단계: 온라인 간편 지원 접수</p>
                <p className="flex items-center gap-2"><ArrowRight className="w-3.5 h-3.5 text-gold-500 shrink-0" /> 2단계: 담당 지사 상담 및 면접</p>
                <p className="flex items-center gap-2"><ArrowRight className="w-3.5 h-3.5 text-gold-500 shrink-0" /> 3단계: 친환경 이누리 바이크 교부 및 기기 세팅</p>
                <p className="flex items-center gap-2"><ArrowRight className="w-3.5 h-3.5 text-gold-500 shrink-0" /> 4단계: 현장 안전 교육 완료 및 즉시 첫 오더 배차</p>
              </div>
            </div>
          </div>

          {/* Online Application Form */}
          <div className="lg:col-span-7 bg-navy-950 border border-navy-800 rounded-3xl p-6 sm:p-10 shadow-xl">
            {submitted ? (
              <div className="text-center py-16 space-y-6 flex flex-col items-center justify-center h-full animate-fade-in">
                <div className="inline-flex p-4 bg-green-500/10 border border-green-500/20 rounded-full">
                  <CheckCircle className="w-12 h-12 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">라이더 입사 지원 완료!</h3>
                <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
                  LAVACORE MOBILITY 라이더 크루 입사 신청서가 정상 전달되었습니다. 
                  희망 근무 지역 담당 센터장이 확인한 후 서류 전형 통과 통보 및 면접 일정 조율을 위해 연락드리겠습니다.
                </p>
                <button
                  id="recruitment-reset-btn"
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold rounded-xl transition-colors cursor-pointer text-sm"
                >
                  새 지원서 제출하기
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center space-x-2.5 border-b border-navy-850 pb-4 mb-5">
                  <UserPlus className="w-5.5 h-5.5 text-gold-500" />
                  <h3 className="text-lg font-bold text-white">크루 입사 간편 온라인 신청</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">이름</label>
                    <input
                      id="recruitment-name"
                      type="text"
                      required
                      placeholder="홍길동"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-navy-900 border border-navy-850 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-gold-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">연락처</label>
                    <input
                      id="recruitment-phone"
                      type="tel"
                      required
                      placeholder="010-XXXX-XXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-navy-900 border border-navy-850 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-gold-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">생년월일 (나이)</label>
                    <input
                      id="recruitment-age"
                      type="number"
                      required
                      placeholder="예: 28"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full bg-navy-900 border border-navy-850 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-gold-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">희망 근무 지역</label>
                    <input
                      id="recruitment-region"
                      type="text"
                      required
                      placeholder="예: 서울 송파구 잠실동"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="w-full bg-navy-900 border border-navy-850 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-gold-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">유사 배달 경력 사항 (자율)</label>
                  <textarea
                    id="recruitment-exp"
                    rows={3}
                    placeholder="예: 배민커넥트 및 도보 배달 6개월 경력 유, 지사 출신 베테랑 등 상세히 기입"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full bg-navy-900 border border-navy-850 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-gold-500 transition-colors resize-none"
                  />
                </div>

                {/* Online Resume Mock File attachment */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                    이력서 또는 면허증 사본 첨부 (선택)
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-navy-800 border-dashed rounded-xl bg-navy-900 hover:bg-navy-850 hover:border-gold-500/50 transition-all cursor-pointer">
                    <div className="space-y-1 text-center relative">
                      <Upload className="mx-auto h-10 w-10 text-slate-500" />
                      <div className="flex text-sm text-slate-400">
                        <label className="relative cursor-pointer rounded-md font-semibold text-gold-500 hover:text-gold-450 focus-within:outline-none">
                          <span>파일 선택</span>
                          <input
                            id="recruitment-file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            onChange={handleFileChange}
                          />
                        </label>
                        <p className="pl-1">또는 여기로 드래그 앤 드롭</p>
                      </div>
                      <p className="text-[10px] text-slate-500">PDF, PNG, JPG 최대 10MB</p>
                      {attachment && (
                        <div className="mt-2 text-xs bg-gold-500/10 text-gold-400 border border-gold-500/20 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 max-w-[280px] mx-auto truncate">
                          <CheckCircle className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                          <span className="truncate">{attachment.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 bg-navy-900 p-4 border border-navy-850 rounded-xl text-xs text-slate-400">
                  <input
                    id="recruitment-license-check"
                    type="checkbox"
                    checked={hasLicense}
                    onChange={(e) => setHasLicense(e.target.checked)}
                    className="accent-gold-500 w-4 h-4 shrink-0 rounded"
                  />
                  <span>
                    <strong>[필수] 오토바이 운전 면허 소지 및 법적 결격 사유 부재 확인</strong><br/>
                    본인은 원동기면허 또는 2종 소형면허(또는 이륜차 운전이 동반되는 1,2종 보통 보통면허) 소지자이며 오토바이 운전에 결격사유가 없음을 서약합니다.
                  </span>
                </div>

                {!user && (
                  <div className="bg-gold-500/10 border border-gold-500/20 rounded-xl p-3 text-center text-xs text-gold-400">
                    크루에 지원하려면 먼저 로그인이 필요합니다.
                  </div>
                )}

                <button
                  id="recruitment-submit-btn"
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-gold-500 hover:bg-gold-600 disabled:bg-gold-800 text-navy-950 font-black transition-colors cursor-pointer text-sm"
                >
                  {loading ? '신청서 제출 중...' : user ? 'LAVACORE 전속 크루 지원 신청하기' : '로그인 후 라이더 지원하기'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
