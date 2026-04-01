<template>
  <div class="admin-page">
    <!-- 상단 탭바 -->
    <div class="admin-topbar">
      <div class="admin-topbar-inner">
        <div class="admin-title">
          <h1>관리자</h1>
          <span class="admin-badge">ADMIN</span>
        </div>
        <nav class="admin-tabs">
          <button v-for="tab in tabs" :key="tab.key" class="admin-tab" :class="{ active: currentTab === tab.key }" @click="currentTab = tab.key">{{ tab.label }}</button>
        </nav>
        <button class="logout-btn" @click="handleLogout">로그아웃</button>
      </div>
    </div>

    <div class="admin-content">

      <!-- 대시보드 -->
      <div v-if="currentTab === 'dashboard'">
        <div class="stats-grid">
          <div v-for="(s, i) in dashStats" :key="s.label" v-reveal="{ delay: i * 80, dir: 'scale' }" class="stat-card hvr-grow">
            <p class="stat-label">{{ s.label }}</p>
            <p class="stat-value">{{ s.value }}</p>
          </div>
        </div>
        <div class="panel">
          <div class="panel-head"><h3>최근 문의</h3><button class="link-btn" @click="currentTab = 'inquiries'">전체보기 →</button></div>
          <div v-for="item in inquiries.slice(0, 3)" :key="item.id" class="list-row clickable" :class="{ unread: !item.read }" @click="openInquiryDetail(item)">
            <div><p class="row-title">{{ item.name }}</p><p class="row-sub">{{ item.vehicle }} · {{ item.phone }}</p></div>
            <div class="row-right">
              <span class="status-tag" :class="item.status === '대기' ? 'pending' : 'done'">{{ item.status }}</span>
              <span class="row-date">{{ item.date }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 차량 관리 -->
      <div v-if="currentTab === 'vehicles'">
        <div class="tab-header"><h2 class="page-title">차량 관리</h2><button class="add-btn" @click="openAdd()">+ 차량 추가</button></div>
        <div class="v-grid">
          <div v-for="(v, i) in vehicleList" :key="v.id" v-reveal="{ delay: i * 50 }" class="v-item hvr-float">
            <div class="v-img"><img :src="v.image" :alt="v.name" />
              <div class="v-badges">
                <span v-if="v.isSpecial" class="tag-s">특가</span>
                <span v-if="v.isImmediate" class="tag-i">즉시출고</span>
              </div>
            </div>
            <div class="v-body">
              <p class="v-sub">{{ v.brand }} · {{ v.year }} · {{ v.type }} · {{ v.fuel }}</p>
              <h3 class="v-name">{{ v.name }}</h3>
              <div class="v-price-area">
                <p class="v-price">{{ fmt(v.price) }}<span>원</span></p>
                <p class="v-monthly">월 <strong>{{ fmt(v.monthlyRent) }}원</strong> / {{ v.rentMonths }}개월</p>
                <p class="v-deposit">보증금 {{ v.deposit ? fmt(v.deposit) + '원' : '없음' }}</p>
              </div>
              <div class="v-actions">
                <button class="btn-edit" @click="openEdit(v)">수정</button>
                <button class="btn-del" @click="confirmDel(v)">삭제</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 문의 관리 -->
      <div v-if="currentTab === 'inquiries'">
        <h2 class="page-title tab-solo">문의 관리</h2>
        <div class="panel">
          <div v-for="item in inquiries" :key="item.id" class="list-row clickable" :class="{ unread: !item.read }" @click="openInquiryDetail(item)">
            <div>
              <p class="row-title">{{ item.name }} <span class="row-phone">{{ item.phone }}</span><span v-if="item.source" class="row-source">{{ item.source }}</span></p>
              <p class="row-sub">{{ item.vehicle }}{{ item.carColor ? ' · ' + item.carColor : '' }}{{ item.email ? ' · ' + item.email : '' }}{{ item.availableTime ? ' · ' + item.availableTime : '' }}</p>
              <p class="row-sub">{{ item.message || '내용 없음' }}</p>
            </div>
            <div class="row-right">
              <span class="status-tag" :class="item.status === '대기' ? 'pending' : 'done'">{{ item.status }}</span>
              <span class="row-date">{{ item.date }}</span>
              <button v-if="item.status === '대기'" class="btn-edit sm" @click.stop="item.status = '완료'">완료</button>
              <button class="btn-del sm" @click.stop="delInquiry(item.id)">삭제</button>
            </div>
          </div>
          <p v-if="!inquiries.length" class="empty">문의가 없습니다</p>
        </div>
      </div>

      <!-- 매니저 관리 -->
      <div v-if="currentTab === 'managers'">
        <div class="tab-header"><h2 class="page-title">매니저 관리</h2><button class="add-btn">+ 매니저 추가</button></div>
        <div class="panel">
          <table class="admin-table">
            <thead><tr><th>이름</th><th>직책</th><th>경력</th><th>전문분야</th><th></th></tr></thead>
            <tbody>
              <tr v-for="m in managerList" :key="m.id">
                <td class="td-bold">{{ m.name }}</td><td>{{ m.role }}</td><td>{{ m.experience }}</td>
                <td><span v-for="t in m.tags" :key="t" class="tag-i">{{ t }}</span></td>
                <td class="td-r"><button class="btn-edit">수정</button><button class="btn-del">삭제</button></td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 매니저별 문의 현황 -->
        <div v-for="m in managerList" :key="'inq-' + m.id" class="mgr-inq-section">
          <div class="mgr-inq-head">
            <h3>{{ m.name }} <span class="mgr-role">{{ m.role }}</span></h3>
            <span class="mgr-inq-count" :class="{ 'has-inq': managerInquiries(m.name).length > 0 }">문의 {{ managerInquiries(m.name).length }}건</span>
          </div>
          <div v-if="managerInquiries(m.name).length" class="panel">
            <div v-for="item in managerInquiries(m.name)" :key="item.id" class="list-row clickable" :class="{ unread: !item.read }" @click="openInquiryDetail(item)">
              <div>
                <p class="row-title">{{ item.name }} <span class="row-phone">{{ item.phone }}</span></p>
                <p class="row-sub">{{ item.message || '내용 없음' }}</p>
              </div>
              <div class="row-right">
                <span class="status-tag" :class="item.status === '대기' ? 'pending' : 'done'">{{ item.status }}</span>
                <span class="row-date">{{ item.date }}</span>
              </div>
            </div>
          </div>
          <p v-else class="mgr-inq-empty">접수된 문의가 없습니다</p>
        </div>
      </div>

      <!-- 특가 관리 -->
      <div v-if="currentTab === 'specials'">
        <div class="tab-header"><h2 class="page-title">이달의 특가 관리</h2><button class="add-btn" @click="openAdd(true)">+ 특가 추가</button></div>
        <div class="v-grid">
          <div v-for="(v, i) in specialList" :key="v.id" v-reveal="{ delay: i * 50 }" class="v-item hvr-float">
            <div class="v-img"><img :src="v.image" :alt="v.name" /><span class="discount-tag">{{ v.discount }}% OFF</span></div>
            <div class="v-body">
              <p class="v-sub">{{ v.brand }} · {{ v.year }}</p>
              <h3 class="v-name">{{ v.name }}</h3>
              <div class="v-price-area">
                <p class="v-original">{{ fmt(v.originalPrice) }}원</p>
                <p class="v-price">{{ fmt(v.price) }}<span>원</span></p>
                <p class="v-monthly">월 <strong>{{ fmt(v.monthlyRent) }}원</strong> / {{ v.rentMonths }}개월</p>
                <p class="v-deposit">보증금 {{ v.deposit ? fmt(v.deposit) + '원' : '없음' }}</p>
              </div>
              <div class="v-actions">
                <button class="btn-edit" @click="openEdit(v)">수정</button>
                <button class="btn-del" @click="toggleFlag(v, 'isSpecial')">특가 해제</button>
              </div>
            </div>
          </div>
        </div>
        <p v-if="!specialList.length" class="empty">특가 차량이 없습니다</p>
      </div>

      <!-- 즉시출고 관리 -->
      <div v-if="currentTab === 'immediate'">
        <div class="tab-header"><h2 class="page-title">즉시출고 관리</h2><button class="add-btn" @click="openAdd(false, true)">+ 즉시출고 추가</button></div>
        <div class="v-grid">
          <div v-for="(v, i) in immediateList" :key="v.id" v-reveal="{ delay: i * 50 }" class="v-item hvr-float">
            <div class="v-img"><img :src="v.image" :alt="v.name" /><span class="imm-tag">즉시출고</span></div>
            <div class="v-body">
              <p class="v-sub">{{ v.brand }} · {{ v.year }} · {{ v.fuel }}</p>
              <h3 class="v-name">{{ v.name }}</h3>
              <div class="v-price-area">
                <p class="v-price">{{ fmt(v.price) }}<span>원</span></p>
                <p class="v-monthly">월 <strong>{{ fmt(v.monthlyRent) }}원</strong> / {{ v.rentMonths }}개월</p>
                <p class="v-deposit">보증금 {{ v.deposit ? fmt(v.deposit) + '원' : '없음' }}</p>
              </div>
              <div class="v-actions">
                <button class="btn-edit" @click="openEdit(v)">수정</button>
                <button class="btn-del" @click="toggleFlag(v, 'isImmediate')">즉시출고 해제</button>
              </div>
            </div>
          </div>
        </div>
        <p v-if="!immediateList.length" class="empty">즉시출고 차량이 없습니다</p>
      </div>

      <!-- 후기 관리 -->
      <div v-if="currentTab === 'reviews'">
        <div class="tab-header"><h2 class="page-title">후기 관리</h2><button class="add-btn" @click="openAddReview">+ 후기 작성</button></div>
        <div class="rv-grid">
          <div v-for="(r, i) in reviewList" :key="r.id" v-reveal="{ delay: i * 60 }" class="rv-card hvr-float">
            <div class="rv-img" v-if="r.image"><img :src="r.image" /></div>
            <div class="rv-body">
              <div class="rv-stars"><span v-for="n in 5" :key="n" :class="n <= r.rating ? 'sf' : 'se'">★</span></div>
              <h4 class="rv-title">{{ r.title }}</h4>
              <p class="rv-text">{{ r.text }}</p>
              <div class="rv-tags" v-if="r.tags?.length"><span v-for="t in r.tags" :key="t">{{ t }}</span></div>
              <div class="rv-footer">
                <span class="rv-author">{{ r.name }} · {{ r.vehicle }} · {{ r.date }}</span>
              </div>
              <div class="v-actions">
                <button class="btn-edit" @click="openEditReview(r)">수정</button>
                <button class="btn-del" @click="confirmDelReview(r)">삭제</button>
              </div>
            </div>
          </div>
        </div>
        <p v-if="!reviewList.length" class="empty">후기가 없습니다</p>
      </div>

      <!-- 후기 수정/추가 모달 -->
      <div v-if="rvModal" class="overlay" @click.self="rvModal = false">
        <div class="modal modal-wide">
          <div class="modal-top"><h3>{{ isNewRv ? '후기 작성' : '후기 수정' }}</h3><button class="modal-x" @click="rvModal = false">&times;</button></div>
          <div class="modal-body">
            <div class="field"><label>제목 *</label><input v-model="rvForm.title" /></div>
            <div class="row2">
              <div class="field"><label>고객명 *</label><input v-model="rvForm.name" /></div>
              <div class="field"><label>차량명</label><input v-model="rvForm.vehicle" /></div>
            </div>
            <div class="row2">
              <div class="field"><label>날짜</label><input v-model="rvForm.date" placeholder="2026.03" /></div>
              <div class="field"><label>별점</label>
                <select v-model.number="rvForm.rating"><option v-for="n in 5" :key="n" :value="n">{{ n }}점</option></select>
              </div>
            </div>
            <div class="field">
              <label>대표 이미지</label>
              <div class="img-input-row"><input v-model="rvForm.thumbnail" placeholder="URL 또는 파일 선택" /><label class="file-btn">파일<input type="file" accept="image/*" hidden @change="e => fileToData(e, v => rvForm.thumbnail = v)" /></label></div>
              <div v-if="rvForm.thumbnail" class="field-preview"><img :src="rvForm.thumbnail" /></div>
            </div>
            <div class="field"><label>태그 (쉼표 구분)</label><input v-model="rvTagInput" placeholder="친절한 상담, 빠른 출고" /></div>

            <!-- 블록 에디터 -->
            <div class="rv-editor">
              <label class="editor-label">내용 (블록)</label>
              <div v-for="(block, i) in rvForm.blocks" :key="i" class="rv-block">
                <div class="rv-block-bar">
                  <span>{{ block.type === 'text' ? '텍스트' : '이미지' }}</span>
                  <div class="rv-block-ctrls">
                    <button v-if="i > 0" @click="rvMoveBlock(i, -1)">↑</button>
                    <button v-if="i < rvForm.blocks.length - 1" @click="rvMoveBlock(i, 1)">↓</button>
                    <button class="rv-del" @click="rvForm.blocks.splice(i, 1)">✕</button>
                  </div>
                </div>
                <textarea v-if="block.type === 'text'" v-model="block.content" rows="3" placeholder="텍스트 입력..."></textarea>
                <template v-if="block.type === 'image'">
                  <div class="img-input-row rv-img-row"><input v-model="block.src" placeholder="URL 또는 파일 선택" /><label class="file-btn">파일<input type="file" accept="image/*" hidden @change="e => fileToData(e, v => block.src = v)" /></label></div>
                  <div v-if="block.src" class="rv-block-preview"><img :src="block.src" /></div>
                  <input v-model="block.caption" placeholder="사진 설명 (선택)" />
                </template>
              </div>
              <div class="rv-add-row">
                <button @click="rvForm.blocks.push({ type: 'text', content: '' })">+ 텍스트</button>
                <button @click="rvForm.blocks.push({ type: 'image', src: '', caption: '' })">+ 이미지</button>
              </div>
            </div>
          </div>
          <div class="modal-foot">
            <button class="cancel-btn" @click="rvModal = false">취소</button>
            <button class="save-btn" @click="saveReview">{{ isNewRv ? '작성' : '저장' }}</button>
          </div>
        </div>
      </div>

      <!-- 후기 삭제 확인 -->
      <div v-if="rvDelModal" class="overlay" @click.self="rvDelModal = false">
        <div class="modal modal-sm">
          <div class="modal-top"><h3>후기 삭제</h3><button class="modal-x" @click="rvDelModal = false">&times;</button></div>
          <div class="del-body">
            <p class="del-name">{{ rvDelTarget?.name }}님의 후기</p>
            <p class="del-warn">"{{ rvDelTarget?.title }}" 후기를 삭제하시겠습니까?</p>
          </div>
          <div class="modal-foot">
            <button class="cancel-btn" @click="rvDelModal = false">취소</button>
            <button class="del-btn" @click="doDelReview">삭제</button>
          </div>
        </div>
      </div>

      <!-- 설정 -->
      <div v-if="currentTab === 'settings'">
        <h2 class="page-title tab-solo">사이트 설정</h2>
        <div class="panel settings-panel">
          <div v-for="f in settingFields" :key="f.key" class="setting-row">
            <label>{{ f.label }}</label><input type="text" v-model="siteSettings[f.key]" />
          </div>
          <div class="setting-actions"><button class="save-btn" @click="alert('저장되었습니다')">저장</button></div>
        </div>
      </div>
    </div>

    <!-- ===== 수정/추가 모달 ===== -->
    <div v-if="editModal" class="overlay" @click.self="editModal = false">
      <div class="modal">
        <div class="modal-top"><h3>{{ isNew ? '차량 추가' : '차량 수정' }}</h3><button class="modal-x" @click="editModal = false">&times;</button></div>
        <div class="modal-body">
          <div class="edit-preview">
            <img v-if="form.image" :src="form.image" />
            <div v-else class="no-img">이미지를 입력하세요</div>
          </div>
          <div class="field">
            <label>차량 이미지</label>
            <div class="img-input-row"><input v-model="form.image" placeholder="URL 또는 파일 선택" /><label class="file-btn">파일<input type="file" accept="image/*" hidden @change="e => fileToData(e, v => form.image = v)" /></label></div>
          </div>
          <div class="row2">
            <div class="field"><label>차량명 *</label><input v-model="form.name" /></div>
            <div class="field"><label>브랜드 *</label><input v-model="form.brand" /></div>
          </div>
          <div class="row3">
            <div class="field"><label>차종</label>
              <select v-model="form.type"><option v-for="t in typeOpts" :key="t">{{ t }}</option></select>
            </div>
            <div class="field"><label>연료</label>
              <select v-model="form.fuel"><option v-for="f in fuelOpts" :key="f">{{ f }}</option></select>
            </div>
            <div class="field"><label>연식</label><input v-model.number="form.year" type="number" /></div>
          </div>
          <div class="row3">
            <div class="field"><label>차량 가격 (원)</label><input v-model.number="form.price" type="number" /></div>
            <div class="field"><label>월 렌트료 (원)</label><input v-model.number="form.monthlyRent" type="number" /></div>
            <div class="field"><label>계약 개월수</label>
              <select v-model.number="form.rentMonths">
                <option v-for="m in monthOpts" :key="m" :value="m">{{ m }}개월</option>
              </select>
            </div>
          </div>
          <div class="row2">
            <div class="field"><label>보증금 (원)</label><input v-model.number="form.deposit" type="number" placeholder="0 = 보증금 없음" /></div>
            <div class="field"><label>할인율 (%)</label><input v-model.number="form.discount" type="number" /></div>
          </div>
          <div class="check-row">
            <label class="check"><input type="checkbox" v-model="form.isSpecial" /> 이달의 특가</label>
            <label class="check"><input type="checkbox" v-model="form.isImmediate" /> 즉시출고</label>
          </div>
        </div>
        <div class="modal-foot">
          <button class="cancel-btn" @click="editModal = false">취소</button>
          <button class="save-btn" @click="save">{{ isNew ? '추가' : '저장' }}</button>
        </div>
      </div>
    </div>

    <!-- 문의 상세 모달 -->
    <div v-if="inquiryDetailModal" class="overlay" @click.self="inquiryDetailModal = false">
      <div class="modal modal-sm">
        <div class="modal-top">
          <h3>문의 상세</h3>
          <button class="modal-x" @click="inquiryDetailModal = false">&times;</button>
        </div>
        <div class="inq-detail" v-if="inquiryDetail">
          <div class="inq-detail-row">
            <span class="inq-label">이름</span>
            <span class="inq-value">{{ inquiryDetail.name }}</span>
          </div>
          <div class="inq-detail-row">
            <span class="inq-label">연락처</span>
            <a :href="'tel:' + inquiryDetail.phone" class="inq-value inq-phone">{{ inquiryDetail.phone }}</a>
          </div>
          <div class="inq-detail-row" v-if="inquiryDetail.vehicle">
            <span class="inq-label">관심 차량</span>
            <span class="inq-value">{{ inquiryDetail.vehicle }}{{ inquiryDetail.carColor ? ' · ' + inquiryDetail.carColor : '' }}</span>
          </div>
          <div class="inq-detail-row" v-if="inquiryDetail.email">
            <span class="inq-label">이메일</span>
            <span class="inq-value">{{ inquiryDetail.email }}</span>
          </div>
          <div class="inq-detail-row" v-if="inquiryDetail.availableTime">
            <span class="inq-label">연락 가능 시간</span>
            <span class="inq-value">{{ inquiryDetail.availableTime }}</span>
          </div>
          <div class="inq-detail-msg">
            <span class="inq-label">문의 내용</span>
            <p class="inq-msg">{{ inquiryDetail.message || '내용 없음' }}</p>
          </div>
          <div class="inq-detail-footer">
            <span class="inq-detail-date">{{ inquiryDetail.date }}{{ inquiryDetail.time ? ' ' + inquiryDetail.time : '' }}</span>
            <span class="inq-detail-source" v-if="inquiryDetail.source">{{ inquiryDetail.source }}</span>
          </div>
          <div class="inq-detail-actions">
            <button v-if="inquiryDetail.status === '대기'" class="save-btn" @click="inquiryDetail.status = '완료'; inquiryDetailModal = false">완료 처리</button>
            <button class="cancel-btn" @click="inquiryDetailModal = false">닫기</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 문의 알림 패널 (오른쪽 하단) -->
    <div class="noti-bell" :class="{ 'has-unread': unreadCount > 0 }" @click="notiOpen = !notiOpen">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
      <span v-if="unreadCount > 0" class="noti-badge">{{ unreadCount }}</span>
    </div>

    <transition name="noti-panel">
      <div v-if="notiOpen" class="noti-panel">
        <div class="noti-panel-head">
          <h4>문의 알림</h4>
          <div class="noti-panel-actions">
            <button v-if="unreadCount > 0" class="noti-readall" @click="doMarkAllRead">모두 읽음</button>
            <button class="noti-panel-close" @click="notiOpen = false">&times;</button>
          </div>
        </div>
        <div class="noti-panel-body">
          <div v-for="item in recentInquiries" :key="item.id" class="noti-item" :class="{ unread: !item.read }" @click="handleNotiClick(item)">
            <div class="noti-dot" v-if="!item.read"></div>
            <div class="noti-item-body">
              <p class="noti-item-title">{{ item.name }} <span>{{ item.phone }}</span></p>
              <p class="noti-item-desc">{{ item.vehicle || '차량 미정' }}{{ item.message ? ' · ' + item.message : '' }}</p>
              <p class="noti-item-time">{{ item.date }}{{ item.time ? ' ' + item.time : '' }}</p>
            </div>
            <span class="noti-item-status" :class="item.status === '대기' ? 'pending' : 'done'">{{ item.status }}</span>
          </div>
          <p v-if="!recentInquiries.length" class="noti-empty">문의가 없습니다</p>
        </div>
      </div>
    </transition>

    <!-- ===== 삭제 확인 모달 ===== -->
    <div v-if="delModal" class="overlay" @click.self="delModal = false">
      <div class="modal modal-sm">
        <div class="modal-top"><h3>차량 삭제</h3><button class="modal-x" @click="delModal = false">&times;</button></div>
        <div class="del-body">
          <div class="del-img"><img v-if="delTarget?.image" :src="delTarget.image" /></div>
          <p class="del-name">{{ delTarget?.brand }} {{ delTarget?.name }}</p>
          <p class="del-warn">삭제하시겠습니까? 되돌릴 수 없습니다.</p>
        </div>
        <div class="modal-foot">
          <button class="cancel-btn" @click="delModal = false">취소</button>
          <button class="del-btn" @click="doDel">삭제</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../stores/auth'
import { useVehicles } from '../stores/vehicles'
import { useReviews } from '../stores/reviews'
import { inquiries, removeInquiry, unreadCount, markAsRead, markAllAsRead } from '../stores/inquiries'
import { useManagers } from '../stores/managers'

const router = useRouter()
const { logout } = useAuth()
const { vehicleList, specialList, immediateList, addVehicle, updateVehicle, removeVehicle } = useVehicles()
const { reviewList, addReview, updateReview, removeReview } = useReviews()

const currentTab = ref('dashboard')
const tabs = [
  { key: 'dashboard', label: '대시보드' },
  { key: 'vehicles', label: '차량 관리' },
  { key: 'inquiries', label: '문의 관리' },
  { key: 'managers', label: '매니저 관리' },
  { key: 'specials', label: '특가 관리' },
  { key: 'immediate', label: '즉시출고' },
  { key: 'reviews', label: '후기 관리' },
  { key: 'settings', label: '설정' },
]

const dashStats = computed(() => [
  { label: '등록 차량', value: vehicleList.value.length + '대' },
  { label: '이번 달 문의', value: inquiries.value.length + '건' },
  { label: '즉시출고', value: immediateList.value.length + '대' },
  { label: '이달의 특가', value: specialList.value.length + '대' },
])


const { managerList } = useManagers()

const siteSettings = ref({ company: '오토원트', ceo: '신선호', tel: '0507-1344-7898', email: 'autowant@naver.com', address: '경기도 광명시 일직로 72 에이동 14층 1420호', bizNum: '609-88-02424' })
const settingFields = [
  { key: 'company', label: '상호명' }, { key: 'ceo', label: '대표자명' },
  { key: 'tel', label: '전화번호' }, { key: 'email', label: '이메일' },
  { key: 'address', label: '주소' }, { key: 'bizNum', label: '사업자등록번호' },
]

const typeOpts = ['세단', 'SUV', '경차', 'RV/MPV', '스포츠카', '화물', '승합']
const fuelOpts = ['가솔린', '디젤', '전기', '하이브리드', 'LPG']
const monthOpts = [12, 24, 36, 48, 60]

// 수정/추가 모달
const editModal = ref(false)
const isNew = ref(false)
const form = ref({})

function openEdit(v) {
  isNew.value = false
  form.value = { ...v }
  editModal.value = true
}

function openAdd(special = false, immediate = false) {
  isNew.value = true
  form.value = {
    name: '', brand: '', year: 2025, type: 'SUV', fuel: '가솔린',
    price: 0, monthlyRent: 0, rentMonths: 48, deposit: 0,
    image: '', isSpecial: special, isImmediate: immediate, discount: special ? 8 : 0,
  }
  editModal.value = true
}

function save() {
  if (!form.value.name || !form.value.brand) return alert('차량명과 브랜드를 입력해주세요')
  if (isNew.value) addVehicle(form.value)
  else updateVehicle(form.value)
  editModal.value = false
}

// 삭제 모달
const delModal = ref(false)
const delTarget = ref(null)
function confirmDel(v) { delTarget.value = v; delModal.value = true }
function doDel() { removeVehicle(delTarget.value.id); delModal.value = false }

function toggleFlag(v, flag) {
  const item = vehicleList.value.find(x => x.id === v.id)
  if (item) { item[flag] = false; if (flag === 'isSpecial') item.discount = 0 }
}

// 후기 모달
const rvModal = ref(false)
const isNewRv = ref(false)
const rvForm = ref({})
const rvTagInput = ref('')

function openAddReview() {
  isNewRv.value = true
  rvForm.value = { name: '', vehicle: '', date: '', rating: 5, title: '', thumbnail: '', tags: [], blocks: [{ type: 'text', content: '' }] }
  rvTagInput.value = ''
  rvModal.value = true
}

function openEditReview(r) {
  isNewRv.value = false
  rvForm.value = { ...r, blocks: (r.blocks || []).map(b => ({ ...b })) }
  rvTagInput.value = (r.tags || []).join(', ')
  rvModal.value = true
}

function rvMoveBlock(i, dir) {
  const arr = rvForm.value.blocks
  const j = i + dir
  ;[arr[i], arr[j]] = [arr[j], arr[i]]
}

function saveReview() {
  if (!rvForm.value.title || !rvForm.value.name) return alert('제목과 고객명을 입력해주세요')
  rvForm.value.tags = rvTagInput.value ? rvTagInput.value.split(',').map(t => t.trim()).filter(Boolean) : []
  rvForm.value.blocks = rvForm.value.blocks.filter(b => (b.type === 'text' && b.content) || (b.type === 'image' && b.src))
  if (!rvForm.value.thumbnail) rvForm.value.thumbnail = rvForm.value.blocks.find(b => b.type === 'image')?.src || ''
  if (isNewRv.value) addReview(rvForm.value)
  else updateReview(rvForm.value)
  rvModal.value = false
}

const rvDelModal = ref(false)
const rvDelTarget = ref(null)
function confirmDelReview(r) { rvDelTarget.value = r; rvDelModal.value = true }
function doDelReview() { removeReview(rvDelTarget.value.id); rvDelModal.value = false }

function delInquiry(id) {
  if (confirm('이 문의를 삭제하시겠습니까?')) removeInquiry(id)
}

function fileToData(e, setter) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => setter(reader.result)
  reader.readAsDataURL(file)
}

function fmt(p) { return p.toLocaleString('ko-KR') }
function handleLogout() { logout(); router.push('/') }

// 문의 상세 모달
const inquiryDetailModal = ref(false)
const inquiryDetail = ref(null)

function openInquiryDetail(item) {
  inquiryDetail.value = item
  inquiryDetailModal.value = true
  markAsRead(item.id)
}

// 알림 패널
const notiOpen = ref(false)
const recentInquiries = computed(() => inquiries.value.slice(0, 20))

function handleNotiClick(item) {
  markAsRead(item.id)
  currentTab.value = 'inquiries'
  notiOpen.value = false
}

function doMarkAllRead() {
  markAllAsRead()
}

// 매니저별 문의
function managerInquiries(managerName) {
  return inquiries.value.filter(i => i.manager === managerName)
}
</script>

<style scoped>
/* 탭바 */
.admin-topbar { position: sticky; top: 64px; z-index: 100; background: white; border-bottom: 1px solid #eee; }
.admin-topbar-inner { max-width: 1200px; margin: 0 auto; padding: 0 20px; display: flex; align-items: center; height: 52px; gap: 24px; }
.admin-title { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.admin-title h1 { font-size: 15px; font-weight: 800; color: #111; margin: 0; }
.admin-badge { font-size: 9px; font-weight: 700; color: white; background: #111; padding: 2px 7px; border-radius: 4px; }
.admin-tabs { display: flex; gap: 2px; overflow-x: auto; scrollbar-width: none; flex: 1; }
.admin-tabs::-webkit-scrollbar { display: none; }
.admin-tab { padding: 6px 14px; border: none; background: none; font-size: 13px; font-weight: 600; color: #999; cursor: pointer; border-radius: 6px; white-space: nowrap; transition: all 0.15s; }
.admin-tab:hover { color: #555; background: #f5f5f5; }
.admin-tab.active { color: #111; background: #f0f0f0; }
.logout-btn { padding: 5px 14px; background: white; color: #999; border: 1px solid #eee; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer; flex-shrink: 0; }

/* 레이아웃 */
.admin-content { max-width: 1200px; margin: 0 auto; padding: 28px 20px 48px; }
.page-title { font-size: 1.2rem; font-weight: 800; color: #111; margin: 0; }
.tab-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.tab-solo { margin-bottom: 20px; }

/* 통계 */
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
.stat-card { border: 1px solid #f0f0f0; border-radius: 10px; padding: 18px; }
.stat-label { font-size: 11px; color: #999; margin: 0 0 4px; font-weight: 600; }
.stat-value { font-size: 1.3rem; font-weight: 800; color: #111; margin: 0; }

/* 차량 카드 그리드 */
.v-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
.v-item { border: 1px solid #f0f0f0; border-radius: 10px; overflow: hidden; background: white; }
.v-img { position: relative; aspect-ratio: 16/10; background: #f5f5f5; overflow: hidden; display: flex; align-items: center; justify-content: center; }
.v-img img { width: 85%; height: auto; object-fit: contain; mix-blend-mode: multiply; }
.v-badges { position: absolute; top: 6px; left: 6px; display: flex; gap: 4px; }
.tag-s { font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 4px; background: #111; color: white; }
.tag-i { display: inline-block; font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 4px; background: transparent; color: #888; border: 1px solid #ddd; margin-right: 4px; }
.discount-tag { position: absolute; top: 6px; left: 6px; background: #111; color: white; font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 4px; }
.imm-tag { position: absolute; top: 6px; left: 6px; background: white; color: #111; border: 1px solid #ddd; font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 4px; }

.v-body { padding: 12px; }
.v-sub { font-size: 11px; color: #aaa; margin: 0 0 2px; }
.v-name { font-size: 14px; font-weight: 700; color: #111; margin: 0 0 8px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.v-price-area { border-top: 1px solid #f5f5f5; padding-top: 8px; margin-bottom: 10px; }
.v-original { font-size: 11px; color: #ccc; text-decoration: line-through; margin: 0; }
.v-price { font-size: 15px; font-weight: 800; color: #111; margin: 0; }
.v-price span { font-size: 11px; font-weight: 500; color: #888; }
.v-monthly { font-size: 12px; color: #555; margin: 4px 0 0; }
.v-monthly strong { color: #111; }
.v-deposit { font-size: 11px; color: #bbb; margin: 2px 0 0; }
.v-actions { display: flex; gap: 6px; }

/* 버튼 */
.btn-edit { flex: 1; padding: 6px 0; border: 1px solid #eee; border-radius: 6px; background: white; font-size: 12px; font-weight: 600; color: #555; cursor: pointer; transition: all 0.15s; }
.btn-edit:hover { border-color: #ccc; color: #111; }
.btn-edit.sm { flex: none; padding: 3px 10px; font-size: 11px; }
.btn-del { flex: 1; padding: 6px 0; border: 1px solid #fdd; border-radius: 6px; background: white; font-size: 12px; font-weight: 600; color: #d00; cursor: pointer; transition: all 0.15s; }
.btn-del:hover { background: #fff5f5; }
.add-btn { padding: 7px 16px; background: #111; color: white; border: none; border-radius: 6px; font-size: 12px; font-weight: 700; cursor: pointer; }
.add-btn:hover { background: #333; }

/* 패널/테이블 */
.panel { border: 1px solid #f0f0f0; border-radius: 10px; overflow: hidden; }
.panel-head { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-bottom: 1px solid #f0f0f0; }
.panel-head h3 { font-size: 14px; font-weight: 700; color: #111; margin: 0; }
.link-btn { background: none; border: none; font-size: 12px; font-weight: 600; color: #999; cursor: pointer; }
.list-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-bottom: 1px solid #fafafa; }
.list-row:last-child { border-bottom: none; }
.row-title { font-size: 13px; font-weight: 600; color: #111; margin: 0 0 2px; }
.row-phone { font-weight: 400; color: #999; margin-left: 8px; }
.row-source { font-size: 10px; font-weight: 600; background: #e8f0fe; color: #2563eb; border-radius: 4px; padding: 2px 6px; margin-left: 8px; }
.row-sub { font-size: 11px; color: #999; margin: 0; }
.row-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.row-date { font-size: 11px; color: #ccc; }
.status-tag { font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 100px; }
.pending { background: #fef3cd; color: #b8860b; }
.done { background: #d4edda; color: #2e7d32; }
.admin-table { width: 100%; border-collapse: collapse; }
.admin-table th { text-align: left; font-size: 11px; font-weight: 600; color: #999; padding: 10px 14px; border-bottom: 1px solid #f0f0f0; background: #fafafa; }
.admin-table td { font-size: 13px; color: #444; padding: 12px 14px; border-bottom: 1px solid #fafafa; }
.td-bold { font-weight: 700; color: #111 !important; }
.td-r { text-align: right; white-space: nowrap; }
/* 후기 카드 */
.rv-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.rv-card { border: 1px solid #f0f0f0; border-radius: 10px; overflow: hidden; background: white; }
.rv-img { aspect-ratio: 16/9; overflow: hidden; }
.rv-img img { width: 100%; height: 100%; object-fit: cover; }
.rv-body { padding: 14px; }
.rv-stars { margin-bottom: 6px; }
.sf { font-size: 13px; color: #111; }
.se { font-size: 13px; color: #ddd; }
.rv-title { font-size: 14px; font-weight: 700; color: #111; margin: 0 0 6px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.rv-text { font-size: 12px; color: #888; line-height: 1.5; margin: 0 0 8px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.rv-tags { display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 8px; }
.rv-tags span { font-size: 10px; font-weight: 600; padding: 2px 7px; background: #f5f5f5; border-radius: 4px; color: #888; }
.rv-footer { margin-bottom: 10px; }
.modal-wide { max-width: 680px; }
.rv-author { font-size: 11px; color: #bbb; }
.field textarea { width: 100%; padding: 9px 12px; border: 1px solid #eee; border-radius: 6px; font-size: 13px; color: #111; outline: none; resize: vertical; font-family: inherit; }
.field textarea:focus { border-color: #999; }

/* 블록 에디터 */
.rv-editor { margin-top: 10px; }
.editor-label { display: block; font-size: 12px; font-weight: 600; color: #888; margin-bottom: 8px; }
.rv-block { border: 1px solid #f0f0f0; border-radius: 6px; overflow: hidden; margin-bottom: 8px; }
.rv-block-bar { display: flex; align-items: center; justify-content: space-between; padding: 6px 10px; background: #fafafa; border-bottom: 1px solid #f0f0f0; }
.rv-block-bar span { font-size: 10px; font-weight: 600; color: #999; }
.rv-block-ctrls { display: flex; gap: 3px; }
.rv-block-ctrls button { width: 22px; height: 22px; border: 1px solid #eee; border-radius: 3px; background: white; font-size: 10px; cursor: pointer; color: #888; }
.rv-block-ctrls button:hover { border-color: #ccc; color: #111; }
.rv-del { color: #d00 !important; }
.rv-block textarea { width: 100%; border: none; padding: 10px; font-size: 13px; color: #333; outline: none; resize: vertical; font-family: inherit; min-height: 70px; }
.rv-block input { width: 100%; border: none; border-bottom: 1px solid #f5f5f5; padding: 8px 10px; font-size: 12px; outline: none; color: #111; }
.rv-block-preview { padding: 6px 10px; }
.rv-block-preview img { width: 100%; border-radius: 4px; max-height: 160px; object-fit: cover; }
.rv-add-row { display: flex; gap: 6px; }
.rv-add-row button { flex: 1; padding: 8px; border: 1px dashed #ddd; border-radius: 6px; background: white; font-size: 12px; font-weight: 600; color: #999; cursor: pointer; }
.rv-add-row button:hover { border-color: #111; color: #111; }
.rv-img-row { padding: 6px 10px; }
.rv-img-row input { border: 1px solid #eee !important; border-radius: 4px !important; padding: 6px 8px !important; }

/* 파일 업로드 공통 */
.img-input-row { display: flex; gap: 6px; }
.img-input-row input { flex: 1; }
.file-btn {
  padding: 0 12px; background: #f5f5f5; border: 1px solid #eee; border-radius: 6px;
  font-size: 11px; font-weight: 600; color: #666; cursor: pointer; display: flex; align-items: center;
  white-space: nowrap; transition: all 0.15s;
}
.file-btn:hover { background: #eee; color: #111; }
.field-preview { margin-top: 6px; border-radius: 6px; overflow: hidden; max-height: 120px; }
.field-preview img { width: 100%; max-height: 120px; object-fit: cover; }

.empty { padding: 40px; text-align: center; color: #ccc; font-size: 13px; }

/* 설정 */
.settings-panel { padding: 20px; }
.setting-row { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.setting-row label { width: 120px; font-size: 13px; font-weight: 600; color: #666; flex-shrink: 0; }
.setting-row input { flex: 1; padding: 9px 12px; border: 1px solid #eee; border-radius: 6px; font-size: 13px; color: #111; outline: none; }
.setting-row input:focus { border-color: #999; }
.setting-actions { margin-top: 8px; display: flex; justify-content: flex-end; }

/* ===== 모달 ===== */
.overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 20px; }
.modal { background: white; border-radius: 12px; width: 100%; max-width: 580px; max-height: 90vh; display: flex; flex-direction: column; }
.modal-sm { max-width: 400px; }
.modal-top { display: flex; align-items: center; justify-content: space-between; padding: 18px 20px; border-bottom: 1px solid #f0f0f0; }
.modal-top h3 { font-size: 16px; font-weight: 700; color: #111; margin: 0; }
.modal-x { background: none; border: none; font-size: 22px; color: #ccc; cursor: pointer; }
.modal-x:hover { color: #111; }
.modal-body { padding: 20px; overflow-y: auto; flex: 1; }
.modal-foot { padding: 14px 20px; border-top: 1px solid #f0f0f0; display: flex; justify-content: flex-end; gap: 8px; }

.edit-preview { margin-bottom: 14px; border-radius: 8px; overflow: hidden; background: #f5f5f5; aspect-ratio: 16/9; }
.edit-preview img { width: 100%; height: 100%; object-fit: cover; }
.no-img { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #ccc; font-size: 13px; }

.field { margin-bottom: 10px; }
.field label { display: block; font-size: 12px; font-weight: 600; color: #888; margin-bottom: 4px; }
.field input, .field select { width: 100%; padding: 9px 12px; border: 1px solid #eee; border-radius: 6px; font-size: 13px; color: #111; outline: none; background: white; }
.field input:focus, .field select:focus { border-color: #999; }
.row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.row3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
.check-row { display: flex; gap: 20px; margin-top: 4px; }
.check { font-size: 13px; color: #444; display: flex; align-items: center; gap: 6px; cursor: pointer; }
.check input[type="checkbox"] { width: 16px; height: 16px; accent-color: #111; }

.cancel-btn { padding: 8px 20px; background: white; color: #666; border: 1px solid #eee; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; }
.save-btn { padding: 8px 24px; background: #111; color: white; border: none; border-radius: 6px; font-size: 13px; font-weight: 700; cursor: pointer; }
.save-btn:hover { background: #333; }

/* 삭제 모달 */
.del-body { padding: 20px; text-align: center; }
.del-img { width: 200px; height: 110px; margin: 0 auto 14px; border-radius: 8px; overflow: hidden; background: #f5f5f5; }
.del-img img { width: 100%; height: 100%; object-fit: cover; }
.del-name { font-size: 15px; font-weight: 700; color: #111; margin: 0 0 4px; }
.del-warn { font-size: 13px; color: #999; margin: 8px 0 0; }
.del-btn { padding: 8px 24px; background: #d00; color: white; border: none; border-radius: 6px; font-size: 13px; font-weight: 700; cursor: pointer; }
.del-btn:hover { background: #b00; }

/* 반응형 */
@media (max-width: 1024px) { .v-grid { grid-template-columns: repeat(3, 1fr); } .rv-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px) {
  .v-grid { grid-template-columns: repeat(2, 1fr); }
  .rv-grid { grid-template-columns: 1fr; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .admin-topbar-inner { gap: 12px; }
  .row2, .row3 { grid-template-columns: 1fr; }
  .setting-row { flex-direction: column; align-items: flex-start; gap: 4px; }
  .setting-row label { width: auto; }
  .noti-panel { right: 12px; left: 12px; width: auto; }
}

/* 매니저별 문의 */
.mgr-inq-section { margin-top: 24px; }
.mgr-inq-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.mgr-inq-head h3 { font-size: 15px; font-weight: 700; color: #111; margin: 0; }
.mgr-role { font-size: 12px; font-weight: 500; color: #999; margin-left: 4px; }
.mgr-inq-count { font-size: 12px; font-weight: 700; color: #999; padding: 3px 10px; background: #f5f5f5; border-radius: 100px; }
.mgr-inq-count.has-inq { color: #2979ff; background: #f0f5ff; }
.mgr-inq-empty { font-size: 12px; color: #ccc; padding: 12px 0; }

/* 문의 행 클릭 & 읽지않음 */
.list-row.clickable { cursor: pointer; transition: background 0.15s; }
.list-row.clickable:hover { background: #fafafa; }
.list-row.unread { background: #f6f9ff; border-left: 3px solid #2979ff; }
.list-row.unread:hover { background: #edf2ff; }

/* 문의 상세 모달 */
.inq-detail { padding: 20px 24px; }
.inq-detail-row { display: flex; align-items: center; padding: 10px 0; border-bottom: 1px solid #f5f5f5; }
.inq-label { font-size: 12px; font-weight: 600; color: #999; width: 100px; flex-shrink: 0; }
.inq-value { font-size: 14px; font-weight: 600; color: #111; }
.inq-phone { color: #2979ff; text-decoration: none; }
.inq-phone:hover { text-decoration: underline; }
.inq-detail-msg { padding: 14px 0; border-bottom: 1px solid #f5f5f5; }
.inq-detail-msg .inq-label { display: block; margin-bottom: 6px; }
.inq-msg { font-size: 13px; color: #555; line-height: 1.6; margin: 0; padding: 10px 14px; background: #f9f9f9; border-radius: 6px; }
.inq-detail-footer { display: flex; align-items: center; gap: 8px; padding: 12px 0; }
.inq-detail-date { font-size: 11px; color: #bbb; }
.inq-detail-source { font-size: 10px; font-weight: 600; color: #2979ff; background: #f0f5ff; padding: 2px 8px; border-radius: 4px; }
.inq-detail-actions { display: flex; gap: 8px; padding-top: 4px; }
.inq-detail-actions .save-btn, .inq-detail-actions .cancel-btn { flex: 1; }

/* 알림 벨 버튼 */
.noti-bell {
  position: fixed; bottom: 28px; right: 28px; z-index: 1100;
  width: 52px; height: 52px; border-radius: 50%;
  background: #111; color: white; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  transition: all 0.2s;
}
.noti-bell:hover { transform: scale(1.08); box-shadow: 0 6px 24px rgba(0,0,0,0.2); }
.noti-bell.has-unread { animation: bellPulse 2s ease infinite; }
@keyframes bellPulse {
  0%, 100% { box-shadow: 0 4px 20px rgba(0,0,0,0.15); }
  50% { box-shadow: 0 4px 20px rgba(0,0,0,0.15), 0 0 0 8px rgba(17,17,17,0.08); }
}
.noti-badge {
  position: absolute; top: -4px; right: -4px;
  min-width: 20px; height: 20px; padding: 0 6px;
  background: #e53935; color: white; border-radius: 10px;
  font-size: 11px; font-weight: 700; line-height: 20px; text-align: center;
}

/* 알림 패널 */
.noti-panel {
  position: fixed; bottom: 92px; right: 28px; z-index: 1100;
  width: 380px; max-height: 480px;
  background: white; border-radius: 12px;
  box-shadow: 0 8px 40px rgba(0,0,0,0.12); border: 1px solid #eee;
  display: flex; flex-direction: column; overflow: hidden;
}
.noti-panel-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 18px; border-bottom: 1px solid #f0f0f0;
}
.noti-panel-head h4 { font-size: 15px; font-weight: 800; color: #111; margin: 0; }
.noti-panel-actions { display: flex; align-items: center; gap: 8px; }
.noti-readall {
  font-size: 11px; font-weight: 600; color: #2979ff; background: none;
  border: none; cursor: pointer; padding: 4px 8px; border-radius: 4px;
}
.noti-readall:hover { background: #f0f5ff; }
.noti-panel-close {
  background: none; border: none; font-size: 20px; color: #ccc;
  cursor: pointer; line-height: 1; padding: 0;
}
.noti-panel-close:hover { color: #111; }

.noti-panel-body { overflow-y: auto; flex: 1; scrollbar-width: thin; }

.noti-item {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 14px 18px; cursor: pointer; transition: background 0.15s;
  border-bottom: 1px solid #f8f8f8; position: relative;
}
.noti-item:hover { background: #fafafa; }
.noti-item.unread { background: #f6f9ff; }
.noti-item.unread:hover { background: #edf2ff; }

.noti-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: #2979ff; flex-shrink: 0; margin-top: 6px;
}
.noti-item-body { flex: 1; min-width: 0; }
.noti-item-title { font-size: 13px; font-weight: 700; color: #111; margin: 0 0 2px; }
.noti-item-title span { font-weight: 500; color: #999; margin-left: 6px; }
.noti-item-desc {
  font-size: 12px; color: #777; margin: 0 0 4px; line-height: 1.4;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.noti-item-time { font-size: 10px; color: #ccc; margin: 0; }
.noti-item-status {
  font-size: 10px; font-weight: 700; padding: 2px 8px;
  border-radius: 4px; flex-shrink: 0; margin-top: 2px;
}
.noti-item-status.pending { background: #fff3e0; color: #e65100; }
.noti-item-status.done { background: #e8f5e9; color: #2e7d32; }

.noti-empty { text-align: center; color: #ccc; padding: 40px 0; font-size: 13px; }

/* 패널 트랜지션 */
.noti-panel-enter-active { animation: panelIn 0.25s ease; }
.noti-panel-leave-active { animation: panelOut 0.2s ease; }
@keyframes panelIn { from { opacity: 0; transform: translateY(12px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes panelOut { from { opacity: 1; transform: translateY(0) scale(1); } to { opacity: 0; transform: translateY(12px) scale(0.96); } }
</style>
