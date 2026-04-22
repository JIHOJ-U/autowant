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
  return { total: 0, daily: {} };
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

// 방문 기록 조회
app.get('/api/visits', (req, res) => {
  const data = readVisits();
  const today = todayKey();
  res.json({
    total: data.total || 0,
    today: (data.daily || {})[today] || 0,
  });
});

// 방문 기록 증가 (페이지 로드 시 호출)
app.post('/api/visits', (req, res) => {
  const data = readVisits();
  const today = todayKey();
  data.total = (data.total || 0) + 1;
  data.daily = data.daily || {};
  data.daily[today] = (data.daily[today] || 0) + 1;
  saveVisits(data);
  res.json({ total: data.total, today: data.daily[today] });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend server is running' });
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
