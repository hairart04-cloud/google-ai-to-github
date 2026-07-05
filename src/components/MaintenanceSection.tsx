import React, { useState, useEffect, useRef } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { ChatMessage, UserProfile } from '../types';
import { Wrench, Calendar, Send, HelpCircle, CheckCircle, MessageSquare } from 'lucide-react';

interface MaintenanceSectionProps {
  user: UserProfile | null;
  onOpenAuth: (isSignUp: boolean) => void;
}

export default function MaintenanceSection({ user, onOpenAuth }: MaintenanceSectionProps) {
  // Form States
  const [bikeModel, setBikeModel] = useState('');
  const [userName, setUserName] = useState(user?.displayName || '');
  const [userPhone, setUserPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [details, setDetails] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Chat States
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'bot',
      text: '안녕하세요! LAVACORE MOBILITY의 오토바이 정비 및 솔루션 전문 라이브 챗봇입니다. 무엇을 도와드릴까요?',
      timestamp: Date.now()
    },
    {
      id: 'init-2',
      sender: 'bot',
      text: '정비 공임, 엔진 오일 점검, 부품 교체 주기 등 궁금한 점을 적어주시거나 아래의 자주 묻는 질문을 클릭해 보세요.',
      timestamp: Date.now()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      setUserName(user.displayName);
    }
  }, [user]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const faqQuestions = [
    { q: '엔진오일은 언제 갈아야 하나요?', a: '통상적으로 신차 출고 후 500km~1,000km에서 첫 교환을 권장하며, 이후에는 일반 광유의 경우 1,000km, 50% 합성유는 1,500km~2,000km, 100% 최고급 합성유는 2,500km~3,000km 주기로 교체하시는 것이 최상의 엔진 상태 유지에 좋습니다.' },
    { q: '이누리 전기오토바이 정비 가능한가요?', a: '네, LAVACORE MOBILITY는 친환경 전기 오토바이 브랜드 "이누리(Enuri)"의 공식 파트너사입니다. 전용 정비 진단 장비를 구비하고 있으며 배터리 셀 밸런싱, 모터 케어, 전자 제어 보드 장치 정비를 완벽하게 처리해 드립니다.' },
    { q: '브레이크 패드 수명 확인법은?', a: '브레이크를 잡을 때 "끼익" 하는 쇳소리가 나거나 브레이크 레버가 너무 깊게 잡힌다면 패드가 닳았을 확률이 매우 높습니다. 휠 캘리퍼 내부를 손전등으로 비추어 패드 홈 잔량이 1.5mm 이하로 보이면 즉시 정비가 필요합니다.' },
    { q: '출장 정비도 지원하나요?', a: 'LAVACORE MOBILITY 정비 마스터들이 강남, 서초, 송파 등 서울 주요 권역에 한해 긴급 출장 정비를 제공합니다. 큰 고장으로 운행 불가 시 트럭 탁송 정비도 예약해 드립니다.' }
  ];

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: Date.now()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');

    // Simulate intelligent bot reply after a short delay
    setTimeout(() => {
      let replyText = '죄상합니다. 문의하신 내용에 대해 스마트 답변을 찾는 중입니다. 더욱 자세한 1:1 유선 상담은 고객센터(1544-9876)로 연락 주시면 정비 마스터가 즉시 정비 항목과 견적을 진단해 드립니다.';
      
      const cleanText = textToSend.toLowerCase().replace(/\s+/g, '');
      
      if (cleanText.includes('엔진') || cleanText.includes('오일') || cleanText.includes('교환')) {
        replyText = '오토바이 엔진오일 교환 주기는 정기 정비의 핵심입니다! 일반 배달 오토바이의 경우 약 1,500km 주기로 교환하는 것이 이상적이며, 교체 시 오일 필터도 함께 점검받으시는 것을 강력 추천합니다. 저희 지사 정비소에 방문 예약하시면 10분 만에 신속 교환이 가능합니다!';
      } else if (cleanText.includes('이누리') || cleanText.includes('전기') || cleanText.includes('enuri') || cleanText.includes('배터리')) {
        replyText = '이누리(Enuri) 전기 이륜차는 정밀 센서와 고가형 배터리가 핵심입니다. 일반 내연기관 오토바이와 달리 구동계 모터 오일, 전력 전압 제어 부품, 배터리 충전 단자 보호가 필수적이며 LAVACORE 전용 정비 진단기로 완벽하고 섬세하게 검진해 드립니다.';
      } else if (cleanText.includes('비용') || cleanText.includes('가격') || cleanText.includes('공임')) {
        replyText = 'LAVACORE MOBILITY는 투명하고 합리적인 표준 정비 공임제를 시행하고 있습니다! 단순 오일 교환 공임은 10,000원부터 시작하며, 무상 구동계 기본 점검 서비스도 함께 제공해 드립니다. 사전 상담 주시면 차종별 가성비 최고 수준의 맞춤형 견적을 보내드립니다.';
      } else if (cleanText.includes('브레이크') || cleanText.includes('패드') || cleanText.includes('소리')) {
        replyText = '브레이크 패드는 라이더의 생명과 직결됩니다. 제동 시 비정상적인 소음이 들린다면 즉시 디스크 마모 검사를 해야 합니다. 방치할 경우 고가의 디스크 로터까지 마모될 수 있으니 신속하게 예약을 잡아주세요.';
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: replyText,
        timestamp: Date.now()
      };

      setMessages((prev) => [...prev, botMsg]);
    }, 800);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth(false);
      return;
    }

    setFormLoading(true);
    try {
      const newReservation = {
        userId: user.uid,
        userName,
        userPhone,
        bikeModel,
        reservationType: 'maintenance',
        date,
        time,
        status: 'pending',
        details,
        createdAt: Date.now()
      };

      await addDoc(collection(db, 'reservations'), newReservation);
      setFormSubmitted(true);
      setBikeModel('');
      setUserPhone('');
      setDate('');
      setTime('');
      setDetails('');
    } catch (err) {
      console.error('Error submitting maintenance res:', err);
      alert('예약 등록에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <section id="maintenance" className="py-24 bg-slate-50 text-slate-800 relative border-b border-slate-200">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.03),transparent_35%)]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold text-orange-600 tracking-widest uppercase">
            MAINTENANCE & LIVE CHAT
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-sans text-slate-900">
            오토바이 정비 예약 및 실시간 상담
          </h2>
          <p className="text-slate-500 text-base">
            최상의 컨디션으로 정교하고 안전한 운행을 돕습니다. LAVACORE 정비 센터의 예약과 
            실시간 전문 챗봇 상담을 원스톱으로 누려 보세요.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Reservation Form */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-sm">
            {formSubmitted ? (
              <div className="text-center py-20 space-y-6 flex-1 flex flex-col justify-center items-center">
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-full">
                  <CheckCircle className="w-12 h-12 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">정비 예약 접수 완료!</h3>
                <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
                  정비 전문가가 내용을 검토한 후, 승인 여부와 세부 예상 정비 비용을 안내하기 위해 연락드리겠습니다.
                </p>
                <button
                  id="maint-reset-btn"
                  onClick={() => setFormSubmitted(false)}
                  className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition-colors cursor-pointer text-sm"
                >
                  새 정비 예약 추가하기
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-4 mb-5">
                    <Wrench className="w-5.5 h-5.5 text-orange-600" />
                    <h3 className="text-lg font-bold text-slate-900">신속 정비 예약 신청</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">예약자 성함</label>
                        <input
                          id="maint-name-input"
                          type="text"
                          required
                          placeholder="홍길동"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-sm text-slate-800 focus:outline-none focus:border-orange-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">연락처</label>
                        <input
                          id="maint-phone-input"
                          type="tel"
                          required
                          placeholder="010-XXXX-XXXX"
                          value={userPhone}
                          onChange={(e) => setUserPhone(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-sm text-slate-800 focus:outline-none focus:border-orange-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">희망 날짜</label>
                        <input
                          id="maint-date-input"
                          type="date"
                          required
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-sm text-slate-800 focus:outline-none focus:border-orange-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">희망 시간</label>
                        <input
                          id="maint-time-input"
                          type="time"
                          required
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-sm text-slate-800 focus:outline-none focus:border-orange-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">기종 및 차종</label>
                      <input
                        id="maint-model-input"
                        type="text"
                        required
                        placeholder="예: 이누리 Enuri V1, 혼다 PCX 125, 야마하 NMAX"
                        value={bikeModel}
                        onChange={(e) => setBikeModel(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-sm text-slate-800 focus:outline-none focus:border-orange-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">정비 요청 내용</label>
                      <textarea
                        id="maint-details-input"
                        required
                        rows={3}
                        placeholder="예: 엔진 오일 교체 및 소음 점검, 브레이크 밀림 증상 점검 등 상세히 적어주세요."
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-sm text-slate-800 focus:outline-none focus:border-orange-500 transition-colors resize-none"
                      />
                    </div>
                  </div>
                </div>

                {!user && (
                  <div className="bg-orange-100 border border-orange-200 rounded-xl p-3 mt-4 text-center text-xs text-orange-800">
                    예약을 접수하려면 먼저 로그인이 필요합니다.
                  </div>
                )}

                <button
                  id="maint-submit-btn"
                  type="submit"
                  disabled={formLoading}
                  className="w-full mt-6 py-3.5 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-850 text-white font-bold rounded-xl transition-colors cursor-pointer text-sm"
                >
                  {formLoading ? '제출 중...' : user ? '정비 예약 등록하기' : '로그인 후 예약하기'}
                </button>
              </form>
            )}
          </div>

          {/* Real Chatbot & FAQ Helper */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-between shadow-sm h-[600px]">
            {/* Header */}
            <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-4 shrink-0">
              <MessageSquare className="w-5.5 h-5.5 text-orange-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">LAVACORE 실시간 AI 챗봇</h3>
                <p className="text-[10px] text-green-600 font-mono">● LIVE CHATBOT ONLINE</p>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3 px-1 custom-scrollbar">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-orange-600 text-white rounded-tr-none'
                        : 'bg-slate-100 text-slate-800 border border-slate-200/65 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef}></div>
            </div>

            {/* FAQ helper clickers */}
            <div className="border-t border-slate-100 pt-3 pb-2 shrink-0">
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1 mb-2">
                <HelpCircle className="w-3.5 h-3.5 text-orange-600" />
                자주 묻는 질문 (클릭 시 챗봇과 즉시 상담)
              </p>
              <div className="flex flex-wrap gap-1.5 max-h-[90px] overflow-y-auto">
                {faqQuestions.map((item, idx) => (
                  <button
                    key={idx}
                    id={`faq-btn-${idx}`}
                    onClick={() => handleSendMessage(item.q)}
                    className="text-[11px] bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full px-3 py-1 text-slate-600 hover:text-slate-900 transition-colors text-left cursor-pointer truncate max-w-full"
                    title={item.q}
                  >
                    {item.q}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <div className="border-t border-slate-100 pt-3 shrink-0 flex items-center gap-2">
              <input
                id="chatbot-text-input"
                type="text"
                placeholder="정비에 관해 무엇이든 물어보세요..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage(inputMessage);
                }}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 transition-colors"
              />
              <button
                id="chatbot-send-btn"
                onClick={() => handleSendMessage(inputMessage)}
                className="p-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white transition-colors cursor-pointer"
              >
                <Send className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
