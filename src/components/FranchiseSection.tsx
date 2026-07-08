import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Mail, Phone, MapPin, CheckCircle, Store, Award, ThumbsUp } from 'lucide-react';

export default function FranchiseSection() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [region, setRegion] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newInquiry = {
        name,
        phone,
        region,
        content,
        status: 'pending',
        createdAt: Date.now(),
      };
      await addDoc(collection(db, 'inquiries'), newInquiry);
      setSubmitted(true);
      setName('');
      setPhone('');
      setRegion('');
      setContent('');
    } catch (err) {
      console.error('Error saving inquiry:', err);
      alert('문의 사항 등록에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    {
      icon: <Store className="w-6 h-6 text-gold-500" />,
      title: "지역 맞춤 플랫폼 연계",
      description: "배민커넥트, 쿠팡이츠 등 주요 배달 플랫폼과의 연동을 통해 한 차원 빠른 오더 수행률을 선보입니다."
    },
    {
      icon: <Award className="w-6 h-6 text-gold-500" />,
      title: "프리미엄 바이크 인프라",
      description: "당사에서 직접 취급하는 친환경 고성능 전기 바이크 지원과 체계적인 기사 매칭 서비스를 제공합니다."
    },
    {
      icon: <ThumbsUp className="w-6 h-6 text-gold-500" />,
      title: "합리적인 파트너십 조건",
      description: "고정식 및 건당 배차 등 점주님의 매장 스타일과 예산에 맞춤화된 요금제를 제안해 드립니다."
    }
  ];

  return (
    <section id="franchise" className="py-24 bg-navy-950 text-slate-200 relative border-b border-navy-800">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(193,150,42,0.05),transparent_40%)]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold text-gold-500 tracking-widest uppercase">
            FRANCHISE & DELIVERY INQUIRY
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-sans text-white">
            매출을 올리는 가장 빠른 파트너,
            <span className="block mt-1 text-gold-500">
              LAVACORE MOBILITY와 함께하세요
            </span>
          </h2>
          <p className="text-slate-400 text-base">
            대행 업체 조율로 머리 아픈 나날은 이제 끝입니다. 최고의 플랫폼 연계와 
            최고의 라이더 수급 능력을 지닌 LAVACORE MOBILITY가 점주님의 든든한 날개가 되겠습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Benefits Content / Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex gap-4 p-5 rounded-2xl bg-navy-900 border border-navy-800 hover:border-gold-500/30 transition-all shadow-lg">
                  <div className="p-3 bg-gold-500/10 rounded-xl h-fit">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{benefit.title}</h3>
                    <p className="text-sm text-slate-450 leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-navy-900 rounded-2xl border border-navy-800 space-y-4">
              <p className="text-sm font-bold text-slate-200">신속 가맹 상담 문의 연락처</p>
              <div className="space-y-2.5 text-sm text-slate-350">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4.5 h-4.5 text-gold-500" />
                  <span className="font-medium">대표 번호: 010-3934-4022 (연중무휴)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4.5 h-4.5 text-gold-500" />
                  <span className="font-medium">이메일: hairart04@gmail.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4.5 h-4.5 text-gold-500" />
                  <span className="font-medium">회사 주소: 대전광역시 서구 괴정로 88</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="lg:col-span-7">
            <div className="bg-navy-900 border border-navy-800 rounded-3xl p-6 sm:p-10 shadow-xl relative text-slate-200">
              {submitted ? (
                <div className="text-center py-16 space-y-6 animate-fade-in">
                  <div className="inline-flex p-4 bg-green-950/20 border border-green-900/30 rounded-full">
                    <CheckCircle className="w-12 h-12 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">가맹/배달대행 문의 완료!</h3>
                  <p className="text-slate-400 max-w-md mx-auto leading-relaxed text-sm">
                    작성해 주신 문의 사항이 접수되었습니다. LAVACORE MOBILITY 전문 컨설턴트가 
                    기재해 주신 연락처로 24시간 이내에 전화를 드릴 예정입니다.
                  </p>
                  <button
                    id="franchise-reset-btn"
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold transition-all transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    추가 상담 등록하기
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h3 className="text-xl font-bold border-b border-navy-850 pb-4 text-white">
                    실시간 온라인 상담 신청
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                        상호명 또는 신청인 성함
                      </label>
                      <input
                        id="franchise-name-input"
                        type="text"
                        required
                        placeholder="예: 교촌치킨 강남점 / 홍길동"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-navy-950 border border-navy-800 rounded-xl py-3.5 px-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-gold-500 focus:bg-navy-950 transition-all text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                        연락처
                      </label>
                      <input
                        id="franchise-phone-input"
                        type="tel"
                        required
                        placeholder="예: 010-1234-5678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-navy-950 border border-navy-800 rounded-xl py-3.5 px-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-gold-500 focus:bg-navy-950 transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      희망 지역
                    </label>
                    <input
                      id="franchise-region-input"
                      type="text"
                      required
                      placeholder="예: 서울 강남구 / 경기 성남시 분당구"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="w-full bg-navy-950 border border-navy-800 rounded-xl py-3.5 px-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-gold-500 focus:bg-navy-950 transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      문의 내용
                    </label>
                    <textarea
                      id="franchise-content-input"
                      required
                      rows={4}
                      placeholder="연계하고자 하는 배달대행 플랫폼 종류, 일평균 배달 건수 등을 작성해 주시면 더욱 정밀한 상담이 가능합니다."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full bg-navy-950 border border-navy-800 rounded-xl py-3.5 px-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-gold-500 focus:bg-navy-950 transition-all resize-none text-sm"
                    />
                  </div>

                  <div className="flex items-center gap-3 bg-navy-950 p-4 rounded-xl border border-navy-850 text-xs text-slate-400">
                    <input id="franchise-privacy-agree" type="checkbox" required className="accent-gold-500 w-4 h-4 shrink-0 rounded" />
                    <span>[필수] 개인정보 수집 및 상담 목적 이용 동의에 동의합니다.</span>
                  </div>

                  <button
                    id="franchise-submit-btn"
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl bg-gold-500 hover:bg-gold-600 disabled:bg-gold-800 text-navy-950 font-black transition-colors cursor-pointer text-sm"
                  >
                    {loading ? '신청 접수 중...' : '매출 상승을 위한 무료 상담 신청하기'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
