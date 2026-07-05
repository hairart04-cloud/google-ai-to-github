import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, HelpCircle, Sparkles, Battery, Wrench, FileText, Phone, Building } from 'lucide-react';
import { ChatMessage } from '../types';

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: '반가워요! LAVACORE MOBILITY 통합 비즈니스 AI 비서입니다. ⚡',
      timestamp: Date.now()
    },
    {
      id: 'welcome-2',
      sender: 'bot',
      text: '국내 베스트셀러 전기이륜차 [이누리 V1] 제품 정보, 모바일 출장 정비 예약, 지사 가맹 문의, 라이더 입사 지원 등 궁금하신 점을 선택하시거나 직접 입력해주세요!',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto show tooltip after 3 seconds to catch user's attention
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) {
        setShowTooltip(true);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const quickQuestions = [
    { label: '🛵 이누리 V1 렌탈/구매', value: '이누리 V1 전기바이크 렌탈과 구매 정보를 알려줘' },
    { label: '🔧 정비 예약 및 출장', value: '오토바이 출장 정비 예약 및 오일 교환 주기를 알려줘' },
    { label: '🏢 가맹점 및 사업 제휴', value: '대리점 가맹 가이드 및 사업 제휴 절차를 알려줘' },
    { label: '🏍️ 라이더 지원 안내', value: '배달 대행 라이더 채용 및 자격요건을 알려줘' }
  ];

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: Date.now()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // AI/Scenario Response Generation
    setTimeout(() => {
      let reply = '';
      const cleanText = textToSend.toLowerCase().replace(/\s+/g, '');

      if (cleanText.includes('v1') || cleanText.includes('이누리') || cleanText.includes('렌탈') || cleanText.includes('구매') || cleanText.includes('오토바이') || cleanText.includes('바이크') || cleanText.includes('전기')) {
        reply = '🏆 **이누리 V1**은 LAVACORE의 대표 시그니처 친환경 전기이륜차입니다!\n\n' +
          '• **월 렌탈료**: 월 100,000원 (실속형 요금제 적용 시)\n' +
          '• **주요 스펙**: 리튬이온 고효율 배터리팩, 최고속도 80 km/h, 정속 주행 시 최대 120km 주행 가능\n' +
          '• **특징**: 언제 어디서나 220V 콘센트에 꼽아 바로 충전할 수 있는 스마트 탈착식 배터리팩 디자인!\n\n' +
          '상단의 "전기이륜차 렌탈" 탭을 방문하시거나, 우측 상단 "상담 신청" 버튼을 통해 성함과 연락처를 남겨주시면 정식 딜러가 즉각 안내 전화를 드립니다.';
      } else if (cleanText.includes('정비') || cleanText.includes('오일') || cleanText.includes('엔진') || cleanText.includes('출장') || cleanText.includes('점검') || cleanText.includes('수리')) {
        reply = '🛠️ **LAVACORE 이동식 모바일 정비 서비스 안내**\n\n' +
          '• **정비 범위**: 엔진오일 교환, 브레이크 패드 수명 점검, 구동계 정밀 소모품 진단 및 전기 배터리 충전 셀 밸런싱\n' +
          '• **출장 서비스**: 서울 주요 권역(강남/서초/송파 등) 및 지사 반경 내 신속한 이동식 정비 차량 출동\n' +
          '• **방문 예약**: "오토바이 정비 예약" 코너에서 희망하는 일시와 차종을 기입하시면 전문 메카닉이 사전 진단 후 방문을 확정합니다.\n\n' +
          '표준 공임 제도를 도입하여 바가지 없는 투명한 정비 비용을 보증합니다!';
      } else if (cleanText.includes('가맹') || cleanText.includes('제휴') || cleanText.includes('대리점') || cleanText.includes('지사') || cleanText.includes('가입')) {
        reply = '🤝 **LAVACORE 프랜차이즈 및 상생 지사 연동**\n\n' +
          'LAVACORE의 이누리 V1 공식 딜러십 및 친환경 정비 프랜차이즈 가맹점을 모집하고 있습니다.\n\n' +
          '• **가맹 혜택**: 마이크로 정비 모빌리티 특허 기술 이전, 이누리 정품 부품 수급 쉐어, 정비 시스템 솔루션 제공\n' +
          '• **신청 방법**: "가맹 상담 문의" 영역에 지역과 문의 내용을 남겨주시면, 상권 분석 전담팀이 24시간 이내 연락을 취해 최적의 맞춤 매장 설립을 돕습니다.';
      } else if (cleanText.includes('라이더') || cleanText.includes('지원') || cleanText.includes('채용') || cleanText.includes('일자리') || cleanText.includes('급여')) {
        reply = '🏍️ **LAVACORE 프리미엄 라이더 네트워크 파트너 모집**\n\n' +
          '가장 안전하고 고수익을 보장하는 스마트 딜리버리 라이더를 상시 모집 중입니다.\n\n' +
          '• **혜택**: 업계 최고 수준의 건당 배송료, 고성능 이누리 V1 특가 대여 지원, 전문 메카닉 무상 정비 서포트\n' +
          '• **지원 자격**: 원동기 또는 면허증 소지자라면 초보자도 1:1 정비 및 주행 기술 안심 교육을 통해 즉시 투입 가능합니다.\n\n' +
          '하단의 "라이더 지원" 영역에서 입사 지원서를 제출해주시면 검토 후 즉시 면접을 예약해 드립니다!';
      } else {
        reply = '감사합니다! 남겨주신 문의 사항은 저희 영업팀에서 소중히 관리하고 있습니다.\n\n' +
          '추가로 상세한 1:1 심층 설명이 필요하신 경우 아래의 대표 문의처로 직통 전화를 주시면 연중무휴로 즉시 정밀 안내를 도와 드리겠습니다.\n\n' +
          '📞 **LAVACORE 상담 핫라인**: 010-3934-4022';
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: reply,
        timestamp: Date.now()
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Welcome Notification Tooltip */}
      {showTooltip && !isOpen && (
        <div className="mb-3 mr-2 bg-slate-900 text-white text-xs sm:text-sm py-2.5 px-4 rounded-2xl shadow-xl border border-slate-800 animate-fade-in max-w-[260px] relative">
          <button 
            onClick={() => setShowTooltip(false)}
            className="absolute top-1.5 right-1.5 text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <p className="font-bold text-orange-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> 실시간 비즈니스 챗봇
          </p>
          <p className="text-slate-300 mt-1 text-[11px] sm:text-xs">
            이누리 V1 렌탈 및 정비 상담을 즉시 해결하세요!
          </p>
          <div className="absolute right-4 -bottom-1.5 w-3 h-3 bg-slate-900 rotate-45 border-r border-b border-slate-800"></div>
        </div>
      )}

      {/* Floating Action Button (FAB) */}
      <button
        id="floating-chatbot-toggle-btn"
        onClick={() => {
          setIsOpen(!isOpen);
          setShowTooltip(false);
        }}
        className={`p-4 rounded-full shadow-2xl transition-all transform hover:-translate-y-1 hover:scale-105 cursor-pointer text-white flex items-center justify-center ${
          isOpen 
            ? 'bg-slate-900 ring-4 ring-slate-900/10' 
            : 'bg-gradient-to-tr from-orange-600 to-orange-500 shadow-orange-600/35 hover:shadow-orange-600/45 ring-4 ring-orange-500/10'
        }`}
        title="LAVACORE 실시간 챗봇"
      >
        {isOpen ? <X className="w-6 h-6 animate-spin-once" /> : <MessageSquare className="w-6 h-6" />}
      </button>

      {/* Chatbot Window Panel */}
      {isOpen && (
        <div 
          id="floating-chatbot-panel"
          className="absolute bottom-18 right-0 w-[90vw] sm:w-[400px] h-[550px] bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col justify-between overflow-hidden animate-fade-in-up"
        >
          {/* Header */}
          <div className="bg-slate-900 p-4 sm:p-5 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-tr from-orange-600 to-orange-500 rounded-xl">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-black tracking-wide">LAVACORE AI 스마트 비서</h3>
                <p className="text-[10px] text-orange-400 font-mono flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping"></span>
                  ONLINE ASSISTANT LIVE
                </p>
              </div>
            </div>
            <button
              id="chatbot-panel-close-btn"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50 custom-scrollbar">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-sm whitespace-pre-line ${
                    msg.sender === 'user'
                      ? 'bg-orange-600 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-sm flex items-center space-x-1.5 text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef}></div>
          </div>

          {/* Quick interactive buttons list */}
          <div className="px-4 sm:px-5 py-3 border-t border-slate-100 bg-white shrink-0">
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1 mb-2">
              <HelpCircle className="w-3.5 h-3.5 text-orange-600" />
              자주 찾는 비즈니스 질문
            </p>
            <div className="grid grid-cols-2 gap-2">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  id={`chatbot-quick-btn-${idx}`}
                  onClick={() => handleSendMessage(q.value)}
                  className="text-[11px] bg-slate-50 hover:bg-orange-50 hover:text-orange-700 border border-slate-200 hover:border-orange-200 rounded-xl px-2.5 py-2 text-slate-600 transition-colors text-left font-medium cursor-pointer"
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          {/* Text Input Form */}
          <div className="p-4 border-t border-slate-150 bg-white shrink-0 flex items-center gap-2">
            <input
              id="chatbot-floating-input"
              type="text"
              placeholder="예: 이누리 V1 가격, 오일 교체 주기..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage(input);
              }}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 transition-colors"
            />
            <button
              id="chatbot-floating-send-btn"
              onClick={() => handleSendMessage(input)}
              className="p-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white transition-colors cursor-pointer"
            >
              <Send className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
