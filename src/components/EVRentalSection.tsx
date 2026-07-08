import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { EVBike, UserProfile } from '../types';
import { Info, Battery, Calendar, CreditCard, Fuel, CheckCircle, Flame } from 'lucide-react';

interface EVRentalSectionProps {
  user: UserProfile | null;
  onOpenAuth: (isSignUp: boolean) => void;
}

export default function EVRentalSection({ user, onOpenAuth }: EVRentalSectionProps) {
  const [selectedBike, setSelectedBike] = useState<EVBike | null>(null);
  const [startDate, setStartDate] = useState('');
  const [duration, setDuration] = useState('1'); // Months
  const [phone, setPhone] = useState('');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const evBikes: EVBike[] = [
    {
      id: 'enuri-v1',
      name: '이누리 V1',
      type: '출퇴근/실용형 (플러그인)',
      batteryCapacity: '싱글/더블 배터리팩 구성',
      maxSpeed: '75 km/h',
      range: '200 km (더블 배터리)',
      monthlyFee: 100000,
      imageUrl: 'https://akcdn-eecdn.cafe24img.com/enuri/item/1708663136/visual_v1.png',
      description: '출, 퇴근은 싱글 배터리, 장거리는 더블 배터리로! 탈착식 배터리팩 탑재로 언제 어디서나 콘센트 충전이 간편한 최적 모델.'
    }
  ];


  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth(false);
      return;
    }
    if (!selectedBike) return;

    setLoading(true);
    try {
      const newRental = {
        userId: user.uid,
        userName: user.displayName,
        userPhone: phone,
        bikeModel: selectedBike.name,
        reservationType: 'rental',
        date: startDate,
        time: '12:00', // Standard pickup time
        status: 'pending',
        details: `렌탈 희망 기간: ${duration}개월 | 추가 사항: ${details}`,
        createdAt: Date.now()
      };

      await addDoc(collection(db, 'reservations'), newRental);
      setSubmitted(true);
      setStartDate('');
      setPhone('');
      setDetails('');
    } catch (err) {
      console.error('Error reserving rental:', err);
      alert('렌탈 예약 등록 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="rental" className="py-24 bg-navy-950 text-slate-200 relative border-b border-navy-800">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(193,150,42,0.04),transparent_40%)]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <span className="text-xs font-bold text-gold-500 tracking-widest uppercase">
            SIGNATURE EV BIKE SHOWCASE
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-sans text-white">
            친환경 이누리(Enuri) V1 전기 바이크
          </h2>
          <p className="text-slate-400 text-base">
            유류비 걱정 끝! 일상 주행부터 배달대행까지 완벽히 소화하는 대표 베스트셀러 모델 <strong className="text-gold-400">이누리 V1</strong>을 만나보세요. 
            탈착식 배터리팩 탑재로 언제 어디서나 콘센트 충전이 가능하며 뛰어난 내구성을 자랑합니다.
          </p>
        </div>

        {/* Centered EV Showcase Card (Single Model) */}
        <div className="flex justify-center mb-16">
          {evBikes.map((bike) => (
            <div
              key={bike.id}
              className={`flex flex-col md:flex-row justify-between rounded-3xl bg-navy-900 border transition-all overflow-hidden shadow-xl max-w-3xl w-full ${
                selectedBike?.id === bike.id ? 'border-gold-500 ring-4 ring-gold-500/10' : 'border-navy-800 hover:border-gold-500/30'
              }`}
            >
              {/* Image Column */}
              <div className="h-64 md:h-auto md:w-1/2 relative overflow-hidden bg-navy-950 shrink-0">
                <img
                  src={bike.imageUrl}
                  alt={bike.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-80 hover:opacity-100 hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-navy-900/95 text-gold-400 text-xs font-bold px-3 py-1.5 rounded-full border border-gold-500/20">
                  {bike.type}
                </div>
              </div>

              {/* Content Column */}
              <div className="p-6 sm:p-8 md:w-1/2 flex-1 flex flex-col justify-between space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white">{bike.name}</h3>
                  <p className="text-sm text-slate-400 mt-2.5 leading-relaxed">
                    {bike.description}
                  </p>
                </div>

                {/* Specs */}
                <div className="grid grid-cols-2 gap-3 text-xs text-slate-300 py-4 border-t border-b border-navy-850 font-mono">
                  <div className="flex items-center space-x-2">
                    <Battery className="w-4 h-4 text-gold-500 shrink-0" />
                    <span className="truncate">{bike.batteryCapacity}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Fuel className="w-4 h-4 text-gold-500 shrink-0" />
                    <span className="truncate">{bike.range}</span>
                  </div>
                  <div className="flex items-center space-x-2 col-span-2">
                    <Flame className="w-4 h-4 text-gold-500 shrink-0" />
                    <span>최고 속도: {bike.maxSpeed}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <span className="text-xs text-slate-500 block">월 렌탈료</span>
                    <span className="text-xl font-black text-gold-500 font-mono">
                      ₩{(bike.monthlyFee).toLocaleString()} <span className="text-xs text-slate-450 font-normal">/월</span>
                    </span>
                  </div>
                  <button
                    id={`bike-rent-btn-${bike.id}`}
                    onClick={() => {
                      setSelectedBike(bike);
                      setSubmitted(false);
                      // Scroll slightly to detail form
                      document.getElementById('ev-booking-anchor')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-6 py-2.5 bg-gold-500 hover:bg-gold-600 text-navy-950 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg cursor-pointer"
                  >
                    렌탈 및 구매 신청
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Anchor point */}
        <div id="ev-booking-anchor" className="scroll-mt-24"></div>

        {/* Selected Bike Application Form */}
        {selectedBike && (
          <div className="bg-navy-900 border border-navy-800 rounded-3xl p-6 sm:p-10 shadow-2xl max-w-2xl mx-auto animate-fade-in text-white">
            {submitted ? (
              <div className="text-center py-12 space-y-6">
                <div className="inline-flex p-4 bg-green-500/10 border border-green-500/20 rounded-full">
                  <CheckCircle className="w-12 h-12 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold">전기 이륜차 렌탈 접수 완료!</h3>
                <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
                  <strong>{selectedBike.name}</strong> 렌탈 청약 예약이 성공적으로 접수되었습니다. 
                  고객 센터에서 서류 검토(운전 면허 및 신용 한도 확인) 후 계약서 서명을 위해 별도 연락드립니다.
                </p>
                <button
                  id="ev-reset-btn"
                  onClick={() => {
                    setSubmitted(false);
                    setSelectedBike(null);
                  }}
                  className="px-6 py-2.5 bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold transition-all cursor-pointer text-sm"
                >
                  목록으로 돌아가기
                </button>
              </div>
            ) : (
              <form onSubmit={handleBooking} className="space-y-6">
                <div className="flex items-center justify-between border-b border-navy-800 pb-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Info className="w-5.5 h-5.5 text-gold-500" />
                    <h3 className="text-lg font-bold">이누리 바이크 렌탈 온라인 신청서</h3>
                  </div>
                  <span className="text-xs bg-gold-500/10 text-gold-400 border border-gold-500/20 px-3 py-1 rounded-full font-bold">
                    선택 모델: {selectedBike.name}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                      희망 출고 개시일
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                      <input
                        id="ev-start-date"
                        type="date"
                        required
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full bg-navy-950 border border-navy-850 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-gold-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                      의무 사용 약정 기간
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                      <select
                        id="ev-duration-select"
                        required
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="w-full bg-navy-950 border border-navy-850 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-gold-500 transition-colors appearance-none cursor-pointer"
                      >
                        <option value="1">1개월 (단기 렌트)</option>
                        <option value="3">3개월 (정기 라이딩)</option>
                        <option value="6">6개월 (합리적 선택)</option>
                        <option value="12">12개월 (월 렌탈료 추가 할인)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                      연락처
                    </label>
                    <input
                      id="ev-phone-input"
                      type="tel"
                      required
                      placeholder="010-XXXX-XXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-navy-950 border border-navy-850 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-gold-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                      월 사용료 (추정액)
                    </label>
                    <div className="w-full bg-navy-950 border border-navy-850 rounded-xl py-2.5 px-4 text-sm text-gold-400 font-extrabold font-mono">
                      ₩{(selectedBike.monthlyFee).toLocaleString()} / 월
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                    추가 요구 및 요청 내용
                  </label>
                  <textarea
                    id="ev-details-input"
                    rows={2}
                    placeholder="예: 종합 책임보험 패키지 결합 희망, 배달용 스마트폰 충전 거치대 무상 증정 혜택 포함 여부 등"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    className="w-full bg-navy-950 border border-navy-850 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-gold-500 transition-colors resize-none"
                  />
                </div>

                <div className="flex gap-3 bg-gold-500/5 p-4 border border-gold-500/20 rounded-xl text-xs text-slate-350">
                  <input id="ev-license-checkbox" type="checkbox" required className="accent-gold-500 w-4 h-4 shrink-0 rounded" />
                  <span>
                    <strong>[필수] 만 21세 이상 및 오토바이/이륜차 운전 면허증 보유 동의</strong><br/>
                    차량 인도 시 면허 소지 여부가 재확인되며 무면허 시 인도가 불가합니다.
                  </span>
                </div>

                {!user && (
                  <div className="bg-gold-500/10 border border-gold-500/20 rounded-xl p-3 text-center text-xs text-gold-400">
                    렌탈 신청을 등록하려면 로그인이 필요합니다.
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    id="ev-cancel-btn"
                    type="button"
                    onClick={() => setSelectedBike(null)}
                    className="flex-1 py-3.5 bg-navy-950 hover:bg-navy-850 text-slate-300 font-bold border border-navy-850 rounded-xl transition-colors cursor-pointer text-sm"
                  >
                    취소하기
                  </button>
                  <button
                    id="ev-submit-btn"
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3.5 bg-gold-500 hover:bg-gold-600 disabled:bg-gold-800 text-navy-950 font-black rounded-xl transition-colors cursor-pointer text-sm"
                  >
                    {loading ? '제출 중...' : user ? '렌탈 예약 신청하기' : '로그인 후 신청'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
