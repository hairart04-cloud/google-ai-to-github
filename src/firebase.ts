import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, collection, writeBatch, doc, getDocs, getDoc, query, limit } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "dev-science-lj1d7",
  appId: "1:413751485695:web:a7232c071a166eb43118ca",
  apiKey: "AIzaSyBF9b6nDckUQVUJSVw_Yk0oBg1EQb3WduM",
  authDomain: "dev-science-lj1d7.firebaseapp.com",
  storageBucket: "dev-science-lj1d7.firebasestorage.app",
  messagingSenderId: "413751485695"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
// Use the specific firestoreDatabaseId if available, otherwise default
export const db = getFirestore(app, "ai-studio-0ffee1bc-41a7-49ca-8929-b1d2f1a78841");

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Helper to seed initial sample data so the dashboard is not empty on start
export async function seedInitialData() {
  try {
    const docRef = doc(db, 'reservations', 'res-1');
    let docSnap;
    try {
      docSnap = await getDoc(docRef);
    } catch (err) {
      console.log('Seeding check skipped (requires admin or public access):', err instanceof Error ? err.message : err);
      return;
    }

    if (docSnap && docSnap.exists()) {
      console.log('Database already seeded or contains data.');
      return;
    }

    console.log('Seeding initial sample data into Firestore...');
    const batch = writeBatch(db);

    // Initial reservations
    const reservations = [
      {
        id: 'res-1',
        userId: 'system-user-1',
        userName: '김철수',
        userPhone: '010-1234-5678',
        reservationType: 'maintenance',
        bikeModel: 'Honda Super Cub',
        date: '2026-07-10',
        time: '14:00',
        status: 'approved',
        details: '엔진 오일 교체 및 브레이크 패드 무상 점검 희망합니다.',
        createdAt: Date.now() - 86400000 * 2
      },
      {
        id: 'res-2',
        userId: 'system-user-2',
        userName: '박지영',
        userPhone: '010-8765-4321',
        reservationType: 'rental',
        bikeModel: '이누리 Enuri V1',
        date: '2026-07-12',
        time: '10:00',
        status: 'pending',
        details: '배달 업무용 월간 렌탈 신청합니다.',
        createdAt: Date.now() - 86400000
      },
      {
        id: 'res-3',
        userId: 'system-user-3',
        userName: '이민호',
        userPhone: '010-5555-4444',
        reservationType: 'visit',
        date: '2026-07-08',
        time: '16:30',
        status: 'pending',
        details: '배달 대행 가맹 상담 및 지사 방문 예정',
        createdAt: Date.now() - 43200000
      }
    ];

    reservations.forEach((res) => {
      const docRef = doc(db, 'reservations', res.id);
      batch.set(docRef, res);
    });

    // Initial Inquiries
    const inquiries = [
      {
        id: 'inq-1',
        name: '네오피자 역삼점',
        phone: '02-123-4567',
        region: '서울 강남구',
        content: '가맹점 배달대행 연계 수수료 및 고정금 조건이 어떻게 되는지 궁금합니다. 배민원 연동 여부도 답변 요청드립니다.',
        status: 'pending',
        createdAt: Date.now() - 86400000 * 3
      },
      {
        id: 'inq-2',
        name: '교촌치킨 서초점',
        phone: '010-9999-8888',
        region: '서울 서초구',
        content: '신규 오픈 예정 매장입니다. LAVACORE MOBILITY 전담 라이더 매칭이 가능한지 문의합니다.',
        status: 'completed',
        createdAt: Date.now() - 86400000 * 5
      }
    ];

    inquiries.forEach((inq) => {
      const docRef = doc(db, 'inquiries', inq.id);
      batch.set(docRef, inq);
    });

    // Initial Rider Applications
    const applications = [
      {
        id: 'app-1',
        name: '정우성',
        phone: '010-2222-3333',
        age: 28,
        region: '서울 송파구',
        experience: '배민커넥트 및 쿠팡이츠 도합 1년 6개월',
        hasLicense: true,
        status: 'pending',
        attachmentName: 'resume_rider.pdf',
        createdAt: Date.now() - 86400000
      },
      {
        id: 'app-2',
        name: '한소희',
        phone: '010-4444-5555',
        age: 24,
        region: '서울 강남구',
        experience: '배달 업무 무경험 (초보 라이더 지원)',
        hasLicense: true,
        status: 'reviewed',
        attachmentName: 'license_img.jpg',
        createdAt: Date.now() - 86400000 * 4
      }
    ];

    applications.forEach((appItem) => {
      const docRef = doc(db, 'rider_applications', appItem.id);
      batch.set(docRef, appItem);
    });

    try {
      await batch.commit();
      console.log('Sample data successfully seeded.');
    } catch (err) {
      console.log('Seeding write skipped (requires admin permissions):', err instanceof Error ? err.message : err);
    }
  } catch (error) {
    console.log('Seed check status (seeding requires admin permissions):', error instanceof Error ? error.message : error);
  }
}
