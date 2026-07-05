import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Reservation, Inquiry, RiderApplication } from '../types';
import { Shield, Check, X, ClipboardList, UserCheck, MessageSquare, Trash, BarChart3, Clock, AlertCircle, BookOpen, Settings, Database, Key, HelpCircle, CheckSquare, Sparkles, Lightbulb, ArrowRight } from 'lucide-react';

export default function AdminDashboard() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [riderApplications, setRiderApplications] = useState<RiderApplication[]>([]);
  const [activeTab, setActiveTab] = useState<'reservations' | 'inquiries' | 'applications' | 'manual'>('reservations');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Real-time listener for reservations
    const unsubRes = onSnapshot(collection(db, 'reservations'), (snapshot) => {
      const resData = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Reservation));
      // Sort by creation time descending
      resData.sort((a, b) => b.createdAt - a.createdAt);
      setReservations(resData);
      setLoading(false);
    });

    // Real-time listener for inquiries
    const unsubInq = onSnapshot(collection(db, 'inquiries'), (snapshot) => {
      const inqData = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Inquiry));
      inqData.sort((a, b) => b.createdAt - a.createdAt);
      setInquiries(inqData);
    });

    // Real-time listener for rider applications
    const unsubApps = onSnapshot(collection(db, 'rider_applications'), (snapshot) => {
      const appsData = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as RiderApplication));
      appsData.sort((a, b) => b.createdAt - a.createdAt);
      setRiderApplications(appsData);
    });

    return () => {
      unsubRes();
      unsubInq();
      unsubApps();
    };
  }, []);

  const handleUpdateReservationStatus = async (id: string, status: 'approved' | 'cancelled') => {
    try {
      const docRef = doc(db, 'reservations', id);
      await updateDoc(docRef, { status });
    } catch (err) {
      console.error('Error updating status:', err);
      alert('상태 업데이트에 실패했습니다.');
    }
  };

  const handleDeleteReservation = async (id: string) => {
    if (!window.confirm('정말 이 예약을 영구 삭제하시겠습니까?')) return;
    try {
      await deleteDoc(doc(db, 'reservations', id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateInquiryStatus = async (id: string, status: 'pending' | 'completed') => {
    try {
      const docRef = doc(db, 'inquiries', id);
      await updateDoc(docRef, { status });
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateRiderStatus = async (id: string, status: 'pending' | 'reviewed' | 'approved' | 'rejected') => {
    try {
      const docRef = doc(db, 'rider_applications', id);
      await updateDoc(docRef, { status });
    } catch (err) {
      console.error(err);
    }
  };

  // Stats Calculations
  const pendingReservationsCount = reservations.filter(r => r.status === 'pending').length;
  const approvedReservationsCount = reservations.filter(r => r.status === 'approved').length;
  const totalInquiriesCount = inquiries.length;
  const pendingInquiriesCount = inquiries.filter(i => i.status === 'pending').length;
  const totalRidersCount = riderApplications.length;

  return (
    <section id="admin-dashboard" className="py-24 bg-slate-50 text-slate-800 min-h-screen relative border-b border-slate-200">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(239,68,68,0.04),transparent_40%)]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-200 pb-6 mb-10 gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-50 border border-red-200 rounded-2xl">
              <Shield className="w-8 h-8 text-red-600 animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-sans text-slate-900">
                LAVACORE 통합 관리자 콘솔
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-mono uppercase tracking-wider">
                Real-time Firebase Synchronization Activated
              </p>
            </div>
          </div>
          <span className="bg-red-50 text-red-600 border border-red-200 px-4 py-1.5 rounded-full text-xs font-bold font-mono">
            ADMINISTRATOR MODE
          </span>
        </div>

        {/* Analytics Stats Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-xs text-slate-500 block font-semibold mb-1">대기 중인 방문/정비</span>
              <span className="text-3xl font-extrabold font-mono text-orange-600">{pendingReservationsCount}</span>
              <span className="text-[10px] text-slate-400 block mt-1">승인 대기 건수</span>
            </div>
            <Clock className="w-10 h-10 text-orange-500/10" />
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-xs text-slate-500 block font-semibold mb-1">승인된 방문/정비</span>
              <span className="text-3xl font-extrabold font-mono text-green-600">{approvedReservationsCount}</span>
              <span className="text-[10px] text-slate-400 block mt-1">매칭 완료 및 출고 대기</span>
            </div>
            <UserCheck className="w-10 h-10 text-green-500/10" />
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-xs text-slate-500 block font-semibold mb-1">가맹 및 대행 상담</span>
              <span className="text-3xl font-extrabold font-mono text-blue-600">{totalInquiriesCount}</span>
              <span className="text-[10px] text-slate-400 block mt-1">대기: {pendingInquiriesCount}건</span>
            </div>
            <MessageSquare className="w-10 h-10 text-blue-500/10" />
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-xs text-slate-500 block font-semibold mb-1">신규 라이더 지원</span>
              <span className="text-3xl font-extrabold font-mono text-amber-600">{totalRidersCount}</span>
              <span className="text-[10px] text-slate-400 block mt-1">총 인재 등록 인원</span>
            </div>
            <ClipboardList className="w-10 h-10 text-amber-500/10" />
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 mb-8 space-x-1.5 overflow-x-auto pb-px">
          <button
            id="tab-res-btn"
            onClick={() => setActiveTab('reservations')}
            className={`px-5 py-3 text-sm font-bold rounded-t-xl transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'reservations'
                ? 'border-orange-600 text-orange-600 bg-orange-50/30'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            방문 & 정비 예약 리스트 ({reservations.length})
          </button>
          <button
            id="tab-inq-btn"
            onClick={() => setActiveTab('inquiries')}
            className={`px-5 py-3 text-sm font-bold rounded-t-xl transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'inquiries'
                ? 'border-orange-600 text-orange-600 bg-orange-50/30'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            가맹 및 배달 대행 문의 ({inquiries.length})
          </button>
          <button
            id="tab-apps-btn"
            onClick={() => setActiveTab('applications')}
            className={`px-5 py-3 text-sm font-bold rounded-t-xl transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'applications'
                ? 'border-orange-600 text-orange-600 bg-orange-50/30'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            라이더 지원자 이력서 ({riderApplications.length})
          </button>
          <button
            id="tab-manual-btn"
            onClick={() => setActiveTab('manual')}
            className={`px-5 py-3 text-sm font-bold rounded-t-xl transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'manual'
                ? 'border-orange-600 text-orange-600 bg-orange-50/30'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            📖 관리자 매뉴얼 (운영 가이드)
          </button>
        </div>

        {/* Console Lists */}
        {loading ? (
          <div className="text-center py-20 text-slate-400 font-mono">
            Loading consolidated database records...
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            {/* 1. RESERVATIONS TAB CONTENT */}
            {activeTab === 'reservations' && (
              <div className="overflow-x-auto">
                {reservations.length === 0 ? (
                  <div className="text-center py-16 text-slate-400">접수된 방문/정비 예약이 없습니다.</div>
                ) : (
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                        <th className="py-4 px-6">신청인 / 기종</th>
                        <th className="py-4 px-6">유형</th>
                        <th className="py-4 px-6">예약 일정</th>
                        <th className="py-4 px-6">예약 메모</th>
                        <th className="py-4 px-6">진행 상태</th>
                        <th className="py-4 px-6 text-right">관리 작업</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {reservations.map((res) => (
                        <tr key={res.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4.5 px-6">
                            <div className="font-bold text-slate-900">{res.userName}</div>
                            <div className="text-slate-400 text-[11px] mt-0.5 font-mono">{res.userPhone}</div>
                            {res.bikeModel && (
                              <span className="inline-block bg-slate-100 text-orange-700 border border-slate-200 px-2 py-0.5 rounded text-[10px] font-bold mt-1 font-mono">
                                {res.bikeModel}
                              </span>
                            )}
                          </td>
                          <td className="py-4.5 px-6">
                            <span className={`px-2.5 py-1 rounded text-[10px] font-extrabold ${
                              res.reservationType === 'maintenance'
                               ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                               : res.reservationType === 'rental'
                               ? 'bg-amber-50 text-amber-700 border border-amber-100'
                               : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            }`}>
                              {res.reservationType === 'maintenance' ? '정비점검' : res.reservationType === 'rental' ? '바이크렌탈' : '본사상담'}
                            </span>
                          </td>
                          <td className="py-4.5 px-6">
                            <div className="font-bold text-slate-800 font-mono">{res.date}</div>
                            <div className="text-slate-400 text-[11px] mt-0.5 font-mono">{res.time}</div>
                          </td>
                          <td className="py-4.5 px-6 max-w-xs truncate" title={res.details}>
                            <p className="text-slate-500 text-xs truncate leading-relaxed">{res.details || '-'}</p>
                          </td>
                          <td className="py-4.5 px-6">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              res.status === 'approved'
                                ? 'bg-green-50 text-green-700 border border-green-100'
                                : res.status === 'cancelled'
                                ? 'bg-red-50 text-red-750 border border-red-100'
                                : 'bg-orange-50 text-orange-700 border border-orange-100'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                res.status === 'approved' ? 'bg-green-500' : res.status === 'cancelled' ? 'bg-red-500' : 'bg-orange-500'
                              }`} />
                              {res.status === 'approved' ? '승인 완료' : res.status === 'cancelled' ? '취소됨' : '승인 대기'}
                            </span>
                          </td>
                          <td className="py-4.5 px-6 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {res.status === 'pending' && (
                                <>
                                  <button
                                    id={`approve-btn-${res.id}`}
                                    onClick={() => handleUpdateReservationStatus(res.id, 'approved')}
                                    className="p-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors cursor-pointer"
                                    title="승인"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    id={`cancel-btn-${res.id}`}
                                    onClick={() => handleUpdateReservationStatus(res.id, 'cancelled')}
                                    className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors cursor-pointer"
                                    title="취소"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}
                              <button
                                id={`delete-btn-${res.id}`}
                                onClick={() => handleDeleteReservation(res.id)}
                                className="p-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-500 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                                title="삭제"
                              >
                                <Trash className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* 2. INQUIRIES TAB CONTENT */}
            {activeTab === 'inquiries' && (
              <div className="overflow-x-auto">
                {inquiries.length === 0 ? (
                  <div className="text-center py-16 text-slate-400">등록된 가맹점 문의글이 없습니다.</div>
                ) : (
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                        <th className="py-4 px-6">가맹점 상호 / 연락처</th>
                        <th className="py-4 px-6">희망 지역</th>
                        <th className="py-4 px-6">문의 상세 사안</th>
                        <th className="py-4 px-6">상태</th>
                        <th className="py-4 px-6 text-right">답변 여부 변경</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {inquiries.map((inq) => (
                        <tr key={inq.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4.5 px-6">
                            <div className="font-bold text-slate-900">{inq.name}</div>
                            <div className="text-slate-400 text-[11px] mt-0.5 font-mono">{inq.phone}</div>
                          </td>
                          <td className="py-4.5 px-6">
                            <span className="font-semibold text-slate-700">{inq.region}</span>
                          </td>
                          <td className="py-4.5 px-6 max-w-sm">
                            <p className="text-slate-500 text-xs whitespace-pre-line leading-relaxed">{inq.content}</p>
                          </td>
                          <td className="py-4.5 px-6">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              inq.status === 'completed'
                                ? 'bg-green-50 text-green-750 border border-green-100'
                                : 'bg-red-50 text-red-700 border border-red-100'
                            }`}>
                              {inq.status === 'completed' ? '답변 완료' : '상담 대기'}
                            </span>
                          </td>
                          <td className="py-4.5 px-6 text-right">
                            <button
                              id={`inquiry-status-btn-${inq.id}`}
                              onClick={() => handleUpdateInquiryStatus(inq.id, inq.status === 'completed' ? 'pending' : 'completed')}
                              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-semibold cursor-pointer"
                            >
                              {inq.status === 'completed' ? '대기로 변경' : '완료로 변경'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* 3. APPLICATIONS TAB CONTENT */}
            {activeTab === 'applications' && (
              <div className="overflow-x-auto">
                {riderApplications.length === 0 ? (
                  <div className="text-center py-16 text-slate-400">접수된 라이더 입사 서류가 없습니다.</div>
                ) : (
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                        <th className="py-4 px-6">지원자 성명 / 인적사항</th>
                        <th className="py-4 px-6">희망지</th>
                        <th className="py-4 px-6">면허 여부</th>
                        <th className="py-4 px-6">경력 요약</th>
                        <th className="py-4 px-6">첨부 문서</th>
                        <th className="py-4 px-6">현재 심사상태</th>
                        <th className="py-4 px-6 text-right">심사 조치</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {riderApplications.map((appItem) => (
                        <tr key={appItem.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4.5 px-6">
                            <div className="font-bold text-slate-900">{appItem.name}</div>
                            <div className="text-slate-400 text-[11px] mt-0.5 font-mono">연령: 만 {appItem.age}세 / {appItem.phone}</div>
                          </td>
                          <td className="py-4.5 px-6">
                            <span className="font-semibold text-slate-700">{appItem.region}</span>
                          </td>
                          <td className="py-4.5 px-6">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              appItem.hasLicense ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                            }`}>
                              {appItem.hasLicense ? '소지함' : '소지안함'}
                            </span>
                          </td>
                          <td className="py-4.5 px-6">
                            <p className="text-slate-500 text-xs leading-relaxed max-w-xs truncate" title={appItem.experience}>
                              {appItem.experience || '신입'}
                            </p>
                          </td>
                          <td className="py-4.5 px-6 font-mono text-xs text-orange-600 underline decoration-orange-500/30">
                            {appItem.attachmentName || '없음'}
                          </td>
                          <td className="py-4.5 px-6">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              appItem.status === 'approved'
                                ? 'bg-green-50 text-green-700 border border-green-100'
                                : appItem.status === 'rejected'
                                ? 'bg-red-50 text-red-750 border border-red-100'
                                : appItem.status === 'reviewed'
                                ? 'bg-blue-50 text-blue-700 border border-blue-100'
                                : 'bg-orange-50 text-orange-700 border border-orange-100'
                            }`}>
                              {appItem.status === 'approved' ? '최종합격' : appItem.status === 'rejected' ? '불합격' : appItem.status === 'reviewed' ? '서류검토중' : '접수됨'}
                            </span>
                          </td>
                          <td className="py-4.5 px-6 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                id={`app-review-btn-${appItem.id}`}
                                onClick={() => handleUpdateRiderStatus(appItem.id, 'reviewed')}
                                className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-bold cursor-pointer"
                              >
                                검토
                              </button>
                              <button
                                id={`app-approve-btn-${appItem.id}`}
                                onClick={() => handleUpdateRiderStatus(appItem.id, 'approved')}
                                className="px-2 py-1 bg-green-650 hover:bg-green-700 text-white rounded text-[11px] font-bold cursor-pointer"
                              >
                                합격
                              </button>
                              <button
                                id={`app-reject-btn-${appItem.id}`}
                                onClick={() => handleUpdateRiderStatus(appItem.id, 'rejected')}
                                className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[11px] font-bold cursor-pointer"
                              >
                                거절
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* 4. ADMIN MANUAL TAB CONTENT */}
            {activeTab === 'manual' && (
              <div className="p-6 sm:p-10 space-y-12">
                <div className="border-b border-slate-150 pb-6">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-orange-600" /> LAVACORE 관리자 시스템 운영 가이드
                  </h3>
                  <p className="text-slate-500 text-sm mt-1.5 leading-relaxed">
                    본 통합 어드민 시스템은 Firebase 실시간 동기화 데이터베이스를 통해 가맹점 상담 신청, 정비/방문/렌탈 예약, 라이더 이력서 현황을 즉각 수신하고 처리하도록 설계되었습니다. 아래의 매뉴얼을 준수하여 최고의 비즈니스 시너지를 확보하세요.
                  </p>
                </div>

                {/* Grid layout for major operations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Operation Block 1 */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-orange-50 border border-orange-200 rounded-xl">
                        <CheckSquare className="w-5 h-5 text-orange-600" />
                      </div>
                      <h4 className="text-base font-bold text-slate-900">방문 & 정비 예약 관리</h4>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      고객이 신청한 전기바이크 렌탈, 본사 방문, 실시간 모바일 정비 서비스 내역을 실시간으로 확인하고 일정을 조율하는 업무입니다.
                    </p>
                    <ul className="text-xs text-slate-500 space-y-2 font-sans pl-1.5 list-disc list-inside">
                      <li><strong>승인(Approve)</strong>: 유선 협의 후 매장에 메카닉이 배정되었거나 출고 준비가 끝났을 때 승인 처리합니다.</li>
                      <li><strong>취소(Cancel)</strong>: 중복 신청이거나 고객 사정으로 인한 취소 시 변경합니다. 취소된 예약은 리스트에 붉은색 상태로 유지됩니다.</li>
                      <li><strong>영구 삭제</strong>: 휴지통 아이콘을 누르면 데이터베이스에서 즉시 삭제되며 복구가 불가합니다.</li>
                    </ul>
                  </div>

                  {/* Operation Block 2 */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl">
                        <MessageSquare className="w-5 h-5 text-blue-600" />
                      </div>
                      <h4 className="text-base font-bold text-slate-900">가맹 및 배달대행 문의 관리</h4>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      이누리 v1 대리점 가맹 상담 신청 및 배달대행 지사 연동을 신청한 전국의 대행업체 연락처를 관리하고 전용 상담을 진행합니다.
                    </p>
                    <ul className="text-xs text-slate-500 space-y-2 font-sans pl-1.5 list-disc list-inside">
                      <li><strong>대기(Pending)</strong>: 신규 가맹 신청건은 디폴트로 접수 대기 상태를 가집니다.</li>
                      <li><strong>검토완료(Complete)</strong>: 담당자가 유선 연락 및 상권 분석 피드백을 전달한 후 검토 완료로 전송하여 효율적인 히스토리를 유지합니다.</li>
                    </ul>
                  </div>

                  {/* Operation Block 3 */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                        <ClipboardList className="w-5 h-5 text-emerald-600" />
                      </div>
                      <h4 className="text-base font-bold text-slate-900">라이더 이력서 심사제도</h4>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      LAVACORE 배달 네트워크 및 정비팀에 직접 이력서와 라이선스를 첨부하여 입사를 지원한 구직 라이더를 승인하고 면접을 연계합니다.
                    </p>
                    <ul className="text-xs text-slate-500 space-y-2 font-sans pl-1.5 list-disc list-inside">
                      <li><strong>검토(Reviewed)</strong>: 이력서 열람 및 서류 필터링 후 면접 제안 상태로 분류합니다.</li>
                      <li><strong>합격(Approved)</strong>: 채용 확정 및 라이더 배정이 완료되었을 시 합격으로 지정하여 대시보드에 녹색 표시를 띄웁니다.</li>
                      <li><strong>거절(Rejected)</strong>: 자격 요건 미달 혹은 거절을 진행합니다.</li>
                    </ul>
                  </div>

                  {/* Operation Block 4 */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl">
                        <Settings className="w-5 h-5 text-amber-600" />
                      </div>
                      <h4 className="text-base font-bold text-slate-900">이누리 V1 렌탈 & 판매 특장점</h4>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      LAVACORE의 단일 플래그십 기종인 <strong>이누리 V1</strong>에 관한 영업 상담 가이드라인입니다.
                    </p>
                    <ul className="text-xs text-slate-500 space-y-2 font-sans pl-1.5 list-disc list-inside">
                      <li><strong>배터리 팩 충전</strong>: 220V 일반 콘센트 충전이 자유로운 탈착식 배터리를 채택하여 BSS 인프라가 없는 지역에서도 즉각 영업 가능.</li>
                      <li><strong>커스텀 요금제</strong>: 싱글팩 출퇴근형(기본료)부터 장거리 전용 더블 배터리 요금제까지 유동적으로 제안.</li>
                    </ul>
                  </div>
                </div>

                {/* System Infrastructure Guidelines */}
                <div className="bg-slate-900 text-slate-200 rounded-2xl p-6 sm:p-8 space-y-5 relative overflow-hidden">
                  <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none transform translate-y-12 translate-x-12">
                    <Database className="w-72 h-72 text-white" />
                  </div>
                  <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                    <Database className="w-5 h-5 text-orange-500" />
                    <h4 className="text-base font-bold text-white">LAVACORE Cloud DB & Firebase 인프라 가이드</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-relaxed">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-white font-bold">
                        <Key className="w-4 h-4 text-orange-500" /> 1단계: 보안 규칙 보증
                      </div>
                      <p className="text-slate-400">
                        모든 데이터 통신은 Firebase Rules (`firestore.rules`)에 의해 암호화 보증됩니다. `hairart04@gmail.com` 마스터 어드민만이 방문 예약, 라이더 이력서 및 가맹 상담의 전체 데이터 읽기 및 수정 승인을 받습니다.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-white font-bold">
                        <Settings className="w-4 h-4 text-orange-500" /> 2단계: 자동 시딩 메커니즘
                      </div>
                      <p className="text-slate-400">
                        신규 데이터베이스가 비어있을 시 최초 기동 시 어드민 전용 더미 데이터를 자동 삽입하는 자동 시딩 시스템이 탑재되어 있습니다. 초기 대시보드 구조 확인 및 UI 테스트를 안정적으로 수행할 수 있습니다.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-white font-bold">
                        <Sparkles className="w-4 h-4 text-orange-500" /> 3단계: AI 챗봇 및 실시간 엔진
                      </div>
                      <p className="text-slate-400">
                        자연스러운 다이얼로그 플로우 및 오프라인/온라인 응대 챗봇을 통해 가맹 희망자 및 라이더들의 사전 리스크 필터링이 가능하도록 FAQ 및 시나리오 챗봇이 정비소 탭 하단에 완벽 연동되어 운영 중입니다.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Helpful tips card */}
                <div className="bg-orange-50 border border-orange-100 rounded-xl p-5 flex items-start gap-4">
                  <Lightbulb className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h5 className="text-sm font-bold text-slate-900">운영 꿀팁: 라이더 합격 처리 시</h5>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      라이더 합격 처리를 완료하면 지원자의 상태가 즉시 &lsquo;최종합격&rsquo;으로 표기됩니다. 사전에 작성한 연락처를 복사하여 모바일 정비 교육 일정 및 이누리 v1 오토바이 대여 상세 계약서를 조속히 발송해 주시기 바랍니다.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
