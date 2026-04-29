const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 6000;
const DATA_FILE = path.join(__dirname, 'inquiries.json');
const VISITS_FILE = path.join(__dirname, 'visits.json');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 파일에서 문의 데이터 읽기
function readInquiries() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    }
  } catch (e) {}
  return [];
}

// 파일에 문의 데이터 저장
function saveInquiries(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// 전체 문의 조회
app.get('/api/inquiries', (req, res) => {
  res.json(readInquiries());
});

// 문의 추가
app.post('/api/inquiries', (req, res) => {
  const list = readInquiries();
  const newId = list.length ? Math.max(...list.map(i => i.id)) + 1 : 1;
  const inquiry = {
    id: newId,
    ...req.body,
    date: req.body.date || new Date().toISOString().slice(0, 10),
    time: req.body.time || new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    status: '대기',
    read: false,
  };
  list.unshift(inquiry);
  saveInquiries(list);
  res.json(inquiry);
});

// 문의 수정 (읽음 처리, 상태 변경)
app.patch('/api/inquiries/:id', (req, res) => {
  const list = readInquiries();
  const idx = list.findIndex(i => i.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'not found' });
  Object.assign(list[idx], req.body);
  saveInquiries(list);
  res.json(list[idx]);
});

// 전체 읽음 처리
app.patch('/api/inquiries-read-all', (req, res) => {
  const list = readInquiries();
  list.forEach(i => { i.read = true; });
  saveInquiries(list);
  res.json({ success: true });
});

// 문의 삭제
app.delete('/api/inquiries/:id', (req, res) => {
  let list = readInquiries();
  list = list.filter(i => i.id !== Number(req.params.id));
  saveInquiries(list);
  res.json({ success: true });
});

// 방문자 카운터
function readVisits() {
  try {
    if (fs.existsSync(VISITS_FILE)) {
      return JSON.parse(fs.readFileSync(VISITS_FILE, 'utf-8'));
    }
  } catch (e) {}
  return { total: 0, daily: {}, fakeInquiries: [] };
}

function saveVisits(data) {
  fs.writeFileSync(VISITS_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

function todayKey() {
  const kst = new Date(Date.now() + 9 * 3600 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// 가짜 상담 신청 생성용 풀
const FAKE_LAST_NAMES = ['김','이','박','최','정','강','조','윤','장','임','한','신','서','권','황','안','송','전','홍','유','고','문','양','노','배','남','심','백','허','구'];
const FAKE_VEHICLES = [
  '현대 쏘나타','현대 아반떼','현대 그랜저','현대 팰리세이드','현대 싼타페','현대 투싼','현대 코나','현대 캐스퍼','현대 아이오닉5','현대 아이오닉6',
  '기아 K5','기아 K8','기아 K9','기아 카니발','기아 쏘렌토','기아 스포티지','기아 셀토스','기아 레이','기아 EV3','기아 EV4','기아 EV6','기아 EV9','기아 카니발 하이리무진',
  '제네시스 G70','제네시스 G80','제네시스 G90','제네시스 GV70','제네시스 GV80','제네시스 GV60',
  '쉐보레 트레일블레이저','쉐보레 트랙스 크로스오버','KGM 토레스','KGM 렉스턴','르노 그랑콜레오스','르노 필랑트',
  'BMW 5시리즈','BMW X5','벤츠 E-Class','벤츠 S-Class','벤츠 GLC','아우디 A6','아우디 Q5','포르쉐 카이엔','테슬라 Model Y','테슬라 Model 3','볼보 XC60','볼보 XC90',
];

function makeFakeInquiry() {
  const last = FAKE_LAST_NAMES[Math.floor(Math.random() * FAKE_LAST_NAMES.length)];
  const vehicle = FAKE_VEHICLES[Math.floor(Math.random() * FAKE_VEHICLES.length)];
  const now = Date.now();
  const d = new Date(now + 9 * 3600 * 1000);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  const hh = String(d.getUTCHours()).padStart(2, '0');
  const mm = String(d.getUTCMinutes()).padStart(2, '0');
  return {
    id: 'fake-' + now + '-' + Math.random().toString(36).slice(2, 7),
    name: last + '**',
    vehicle,
    date: `${y}-${m}-${day}`,
    time: `${hh}:${mm}`,
    createdAt: now,
    fake: true,
  };
}

// 방문 기록 조회
app.get('/api/visits', (req, res) => {
  const data = readVisits();
  const today = todayKey();
  res.json({
    total: data.total || 0,
    today: (data.daily || {})[today] || 0,
    fakes: (data.fakeInquiries || []).slice(0, 30),
  });
});

// 가짜 상담신청 최대 보관 개수 (한 번 채워지면 더 이상 늘어나지 않고 유지)
const FAKE_CAP = 10;

// 방문 기록 증가 + 가짜 상담신청 추가 (페이지 로드 시 호출)
app.post('/api/visits', (req, res) => {
  const data = readVisits();
  const today = todayKey();
  data.total = (data.total || 0) + 1;
  data.daily = data.daily || {};
  data.daily[today] = (data.daily[today] || 0) + 1;
  data.fakeInquiries = data.fakeInquiries || [];
  // FAKE_CAP에 도달하기 전까지만 새 가짜 문의 추가, 도달 후에는 그대로 유지
  if (data.fakeInquiries.length < FAKE_CAP) {
    data.fakeInquiries.unshift(makeFakeInquiry());
  }
  saveVisits(data);
  res.json({
    total: data.total,
    today: data.daily[today],
    fakes: data.fakeInquiries.slice(0, 30),
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend server is running' });
});

// === 임시 마이그레이션 엔드포인트 (옮기고 나서 반드시 제거) ===
const MIGRATION_TOKEN = process.env.MIGRATION_TOKEN || 'autowant-migration-2026-temp-key';

// 데이터 내보내기 (옛 Render에서 호출)
app.get('/api/admin/export', (req, res) => {
  if (req.query.token !== MIGRATION_TOKEN) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  res.json({
    inquiries: readInquiries(),
    visits: readVisits(),
    exportedAt: new Date().toISOString(),
  });
});

// 데이터 가져오기 (새 Render로 POST)
app.post('/api/admin/import', (req, res) => {
  if (req.query.token !== MIGRATION_TOKEN) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  const { inquiries, visits } = req.body || {};
  if (Array.isArray(inquiries)) saveInquiries(inquiries);
  if (visits && typeof visits === 'object') saveVisits(visits);
  res.json({
    success: true,
    inquiriesCount: Array.isArray(inquiries) ? inquiries.length : 0,
    visitsTotal: visits?.total || 0,
    fakeInquiriesCount: visits?.fakeInquiries?.length || 0,
  });
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
