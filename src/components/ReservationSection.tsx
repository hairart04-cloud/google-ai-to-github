import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile } from '../types';
import { Calendar as CalendarIcon, Clock, CheckCircle, ShieldAlert, FileText, Phone } from 'lucide-react';

interface ReservationSectionProps {
  user: UserProfile | null;
  onOpenAuth: (isSignUp: boolean) => void;
}

export default function ReservationSection({ user, onOpenAuth }: ReservationSectionProps) {
  // Calendar Dates logic (July 2026 as per local time context 2026-07-05)
  const currentYear = 2026;
  const currentMonth = 7; // July
  const currentMonthName = '2026년 7월';

  // Days in July: 31 days
  // First day of July 2026: Wednesday (3)
  const daysInMonth = 31;
  const startDayOffset = 3; // Sunday=0, Mon=1, Tue=2, Wed=3...

  const [selectedDay, setSelectedDay] = useState<number | null>(5); // default to 5th
  const [selectedTime, setSelectedTime] = useState<string | null>('14:00');
  const [reservationType, setReservationType] = useState<'visit' | 'maintenance' | 'rental'>('visit');
  const [details, setDetails] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const times = [
    '09:00', '10:00', '11:00', '13:00', 
    '14:00', '15:00', '16:00', '17:00'
  ];

  const handleDaySelect = (day: number) => {
    // Avoid selecting past days relative to current time 2026-07-05
    if (day < 5) return;
    setSelectedDay(day);
    setSubmitted(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth(false);
      return;
    }
    if (!selectedDay || !selectedTime) {
      alert('예약 날짜와 시간을 선택해 주세요.');
      return;
    }

    setLoading(true);
    try {
      const formattedDate = `2026-07-${selectedDay.toString().padStart(2, '0')}`;
      const newBooking = {
        userId: user.uid,
        userName: user.displayName,
        userPhone: phone,
        reservationType,
        date: formattedDate,
        time: selectedTime,
        status: 'pending',
        details,
        createdAt: Date.now()
      };

      await addDoc(collection(db, 'reservations'), newBooking);
      setSubmitted(true);
      setDetails('');
      setPhone('');
    } catch (err) {
      console.error('Error adding visit booking:', err);
      alert('방문 예약 등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // Generate calendar grid array
  const calendarCells = [];
  // Empty offsets
  for (let i = 0; i < startDayOffset; i++) {
    calendarCells.push(null);
  }
  // Days
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push(d);
  }

  return (
    <section id="reservation" className="py-24 bg-navy-900 text-slate-200 relative border-b border-navy-800">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(193,150,42,0.04),transparent_35%)]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold text-gold-500 tracking-widest uppercase">
            VISIT RESERVATION SYSTEM
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-sans text-white">
            편리한 온라인 본사 방문 예약
          </h2>
          <p className="text-slate-400 text-base">
            대기 없이 쾌적하게 1:1 비즈니스 상담 및 차량 계약을 받아보실 수 있습니다. 
            달력에서 원하는 날짜와 타임테이블 상의 빈 시간대를 클릭하여 즉시 예약하세요.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Calendar Day & Time Selector */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-navy-950 border border-navy-800 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-navy-850 pb-4 mb-6">
                <div className="flex items-center space-x-2.5">
                  <CalendarIcon className="w-5.5 h-5.5 text-gold-500" />
                  <span className="text-base font-bold text-white">{currentMonthName} 달력</span>
                </div>
                <span className="text-xs text-slate-500 font-mono">* 오늘 날짜: 7월 5일</span>
              </div>

              {/* Day of Week Headers */}
              <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 font-mono">
                <span className="text-red-500">일</span>
                <span>월</span>
                <span>화</span>
                <span>수</span>
                <span>목</span>
                <span>금</span>
                <span className="text-blue-500">토</span>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {calendarCells.map((day, idx) => {
                  if (day === null) {
                    return <div key={`empty-${idx}`} className="aspect-square"></div>;
                  }

                  const isPast = day < 5;
                  const isSelected = selectedDay === day;
                  const isSunday = (idx % 7) === 0;
                  const isSaturday = (idx % 7) === 6;

                  return (
                    <button
                      key={`day-${day}`}
                      id={`calendar-day-${day}`}
                      type="button"
                      disabled={isPast}
                      onClick={() => handleDaySelect(day)}
                      className={`aspect-square rounded-xl text-xs sm:text-sm font-semibold flex flex-col items-center justify-center transition-all relative cursor-pointer ${
                        isPast
                          ? 'text-slate-650 bg-navy-950 border-transparent cursor-not-allowed line-through'
                          : isSelected
                          ? 'bg-gold-500 text-navy-950 font-black shadow-md shadow-gold-500/20 ring-2 ring-gold-500/10 scale-105'
                          : 'bg-navy-900 hover:bg-navy-850 text-slate-200 border border-navy-850'
                      }`}
                    >
                      <span className={isPast ? '' : isSunday ? 'text-red-400' : isSaturday ? 'text-blue-400' : ''}>
                        {day}
                      </span>
                      {day === 5 && (
                        <span className="absolute bottom-1.5 w-1 h-1 rounded-full bg-gold-500"></span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slot Selector */}
            <div className="bg-navy-950 border border-navy-800 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center space-x-2.5 border-b border-navy-850 pb-4 mb-6">
                <Clock className="w-5.5 h-5.5 text-gold-500" />
                <span className="text-base font-bold text-white">희망 방문 시간 선택</span>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {times.map((t) => {
                  const isSelected = selectedTime === t;
                  return (
                    <button
                      key={t}
                      id={`time-slot-${t.replace(':', '-')}`}
                      type="button"
                      onClick={() => setSelectedTime(t)}
                      className={`py-3 px-1 rounded-xl text-xs sm:text-sm font-bold tracking-wider font-mono text-center transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-gold-500 text-navy-950 border-gold-400 shadow-sm scale-105 font-black'
                          : 'bg-navy-900 hover:bg-navy-850 text-slate-300 border border-navy-850'
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Form Side details */}
          <div className="lg:col-span-5">
            <div className="bg-navy-950 border border-navy-800 rounded-3xl p-6 sm:p-8 shadow-xl h-full">
              {submitted ? (
                <div className="text-center py-16 space-y-6 animate-fade-in flex flex-col items-center justify-center h-full">
                  <div className="inline-flex p-4 bg-green-500/10 border border-green-500/20 rounded-full">
                    <CheckCircle className="w-12 h-12 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">방문 예약 신청 완료!</h3>
                  <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                    <strong>2026-07-{selectedDay?.toString().padStart(2, '0')} {selectedTime}</strong> 에 방문 예약 신청되었습니다. 
                    관리자 승인 즉시 기입해 주신 번호로 모바일 알림톡이 발송됩니다.
                  </p>
                  <button
                    id="reservation-reset-btn"
                    onClick={() => {
                      setSubmitted(false);
                      setSelectedDay(5);
                      setSelectedTime('14:00');
                    }}
                    className="px-6 py-2.5 bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold rounded-xl transition-colors cursor-pointer text-sm"
                  >
                    추가 예약하기
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h3 className="text-lg font-bold border-b border-navy-850 pb-4 flex items-center gap-2 text-white">
                    <FileText className="w-5 h-5 text-gold-500" />
                    예약 상세 정보 입력
                  </h3>

                  <div className="space-y-4">
                    <div className="p-4 bg-navy-900 rounded-xl border border-navy-850 space-y-2">
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>선택된 날짜:</span>
                        <span className="font-extrabold text-gold-400">
                          {selectedDay ? `2026-07-${selectedDay.toString().padStart(2, '0')} (금)` : '날짜 선택 필요'}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>선택된 시간:</span>
                        <span className="font-extrabold text-gold-400">
                          {selectedTime ? `${selectedTime}` : '시간 선택 필요'}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">방문 상담 유형</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['visit', 'maintenance', 'rental'] as const).map((type) => {
                          const label = type === 'visit' ? '가맹상담' : type === 'maintenance' ? '정비점검' : '렌탈계약';
                          return (
                            <button
                              key={type}
                              id={`res-type-btn-${type}`}
                              type="button"
                              onClick={() => setReservationType(type)}
                              className={`py-2 px-1 text-xs rounded-lg font-bold transition-colors cursor-pointer border ${
                                reservationType === type
                                  ? 'bg-gold-500 text-navy-950 border-gold-400 font-bold'
                                  : 'bg-navy-900 text-slate-400 border border-navy-850 hover:bg-navy-850 hover:text-white'
                              }`}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">예약자 연락처</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                        <input
                          id="res-phone-input"
                          type="tel"
                          required
                          placeholder="010-XXXX-XXXX"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-navy-900 border border-navy-850 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-gold-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">상담 및 전달 내용</label>
                      <textarea
                        id="res-details-input"
                        rows={3}
                        placeholder="상담을 원하는 주요 사안이나 차종, 사전 조율 사항을 기록해 주세요."
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        className="w-full bg-navy-900 border border-navy-850 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-gold-500 transition-colors resize-none"
                      />
                    </div>
                  </div>

                  {!user && (
                    <div className="bg-gold-500/10 border border-gold-500/20 rounded-xl p-3.5 flex items-start gap-2 text-xs text-gold-400">
                      <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-gold-500" />
                      <span>원활한 예약 관리 및 노쇼 방지를 위해 사전 로그인이 필수입니다.</span>
                    </div>
                  )}

                  <button
                    id="res-submit-btn"
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-gold-500 hover:bg-gold-600 disabled:bg-gold-800 text-navy-950 font-black rounded-xl transition-colors cursor-pointer text-sm"
                  >
                    {loading ? '신청 중...' : user ? '방문 예약 확정하기' : '로그인 후 예약 확정'}
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
