<template>
  <v-app>
    <!-- 네비게이션 -->
    <header :class="['main-navbar', { 'navbar-transparent': isAboutPage && !navScrolled, 'navbar-blur': isAboutPage && navScrolled, 'navbar-hidden': navHidden }]">
      <div class="navbar-inner">
        <router-link to="/" class="brand-link">
          <img src="/images/autowantlogo.png" alt="AUTOWANT" class="brand-logo-img" />
        </router-link>

        <!-- 데스크톱 메뉴 (가운데) -->
        <nav class="nav-center d-none d-md-flex">
          <router-link to="/" class="nav-link" active-class="nav-active">홈</router-link>
          <router-link to="/monthly-special" class="nav-link" active-class="nav-active">이달의 특가</router-link>
          <router-link to="/immediate-stock" class="nav-link" active-class="nav-active">즉시 출고</router-link>
          <div class="nav-drop">
            <span class="nav-link" :class="{ 'nav-active': route.path === '/managers' || route.path === '/organization' }">
              매니저
              <svg class="nav-caret" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </span>
            <div class="nav-drop-panel">
              <router-link to="/organization" class="nav-drop-link">조직도</router-link>
              <router-link to="/managers" class="nav-drop-link">매니저 소개</router-link>
            </div>
          </div>
          <router-link to="/reviews" class="nav-link" active-class="nav-active">고객 후기</router-link>
          <router-link to="/about" class="nav-link" active-class="nav-active">회사소개</router-link>
          <router-link to="/contact" class="nav-link" active-class="nav-active">문의하기</router-link>
        </nav>

        <div class="nav-right d-none d-md-flex">
          <v-menu v-if="isAdmin" location="bottom end" offset="4">
            <template #activator="{ props }">
              <v-btn v-bind="props" icon variant="text" size="small" class="admin-avatar-btn">
                <img v-if="adminUser?.avatar" :src="adminUser.avatar" :alt="adminUser.name" class="admin-avatar-img" />
                <v-icon v-else size="20" color="#111">mdi-account-circle</v-icon>
              </v-btn>
            </template>
            <v-list density="compact" rounded="lg" width="200" class="py-1">
              <v-list-item v-if="adminUser?.name" class="admin-user-header" density="compact">
                <template #prepend>
                  <img v-if="adminUser.avatar" :src="adminUser.avatar" :alt="adminUser.name" class="admin-header-avatar" />
                </template>
                <v-list-item-title class="admin-user-name">{{ adminUser.name }}{{ adminUser.role ? ' ' + adminUser.role : '' }}</v-list-item-title>
              </v-list-item>
              <v-divider v-if="adminUser?.name" />
              <v-list-item to="/admin" prepend-icon="mdi-view-dashboard-outline" title="대시보드" density="compact" />
              <v-list-item prepend-icon="mdi-logout" title="로그아웃" @click="handleLogout" density="compact" />
            </v-list>
          </v-menu>
        </div>

        <button class="mobile-menu-btn d-md-none" @click="mobileMenu = !mobileMenu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
      </div>
    </header>

    <!-- 모바일 메뉴 -->
    <v-navigation-drawer v-model="mobileMenu" location="right" temporary width="260">
      <v-list nav>
        <v-list-item class="mb-1 mt-2">
          <span class="brand-text">AUTO</span><span class="brand-accent">WANT</span>
        </v-list-item>
        <v-divider class="mb-1" />
        <v-list-item to="/" title="홈" @click="mobileMenu = false" />
        <v-list-item to="/monthly-special" title="이달의 특가" @click="mobileMenu = false" />
        <v-list-item to="/immediate-stock" title="즉시 출고" @click="mobileMenu = false" />
        <v-list-item to="/organization" title="조직도" @click="mobileMenu = false" />
        <v-list-item to="/managers" title="매니저 소개" @click="mobileMenu = false" />
        <v-list-item to="/reviews" title="고객 후기" @click="mobileMenu = false" />
        <v-list-item to="/about" title="회사소개" @click="mobileMenu = false" />
        <v-list-item to="/contact" title="문의하기" @click="mobileMenu = false" />
        <template v-if="isAdmin">
          <v-divider class="my-1" />
          <v-list-item to="/admin" title="대시보드" @click="mobileMenu = false" />
          <v-list-item title="로그아웃" @click="handleLogout" />
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-main :style="{ paddingTop: isAboutPage ? '0' : '72px' }">
      <router-view />
    </v-main>

    <!-- 왼쪽 연락처 사이드바 -->
    <aside class="floating-sidebar" :class="{ visible: !hideSidebars }" :style="{ top: sidebarY + 'px' }">
      <a href="tel:0507-1344-7898" class="lsb-phone-card">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
        <div>
          <p class="lsb-ph-num">0507-1344-7898</p>
          <p class="lsb-ph-time">평일 09:00~18:00</p>
        </div>
      </a>
      <div class="lsb-mid-card">
        <p class="lsb-mid-text">편하게 상담받으세요</p>
        <router-link to="/contact" class="lsb-mid-btn">상담 문의</router-link>
      </div>
      <div class="lsb-sns-card">
        <div class="lsb-sns-row">
          <a href="https://pf.kakao.com/_example" target="_blank" class="lsb-sn lsb-sn-kakao">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3C6.48 3 2 6.58 2 10.94c0 2.8 1.86 5.27 4.66 6.67-.15.53-.96 3.4-.99 3.63 0 0-.02.17.09.24.11.06.24.01.24.01.32-.04 3.7-2.42 4.28-2.84.56.08 1.14.13 1.72.13 5.52 0 10-3.58 10-7.94S17.52 3 12 3z"/></svg>
          </a>
          <a href="https://blog.naver.com/autowant" target="_blank" class="lsb-sn lsb-sn-naver">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z"/></svg>
          </a>
          <a href="https://instagram.com/autowant" target="_blank" class="lsb-sn lsb-sn-insta">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>
          </a>
          <a href="https://facebook.com/autowant" target="_blank" class="lsb-sn lsb-sn-fb">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
        </div>
      </div>
    </aside>

    <!-- 오른쪽 빠른 견적 사이드바 -->
    <aside class="quick-sidebar" :class="{ visible: !hideSidebars }" :style="{ top: sidebarY + 'px' }">
      <div class="quick-head">
        <h4>빠른 견적 문의</h4>
      </div>
      <div v-if="!quickSubmitted" class="quick-body">
        <v-form ref="quickForm" @submit.prevent="submitQuick">
          <v-text-field v-model="quickData.name" label="이름" variant="outlined" density="compact" rounded="0" :rules="nameRules" @input="quickData.name = quickData.name.replace(/[^a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣\s]/g, '')" class="mb-1" />
          <v-text-field v-model="quickData.phone" label="연락처" placeholder="010-0000-0000" variant="outlined" density="compact" rounded="0" :rules="phoneRules" @input="formatQuickPhone" maxlength="13" class="mb-1" />
          <v-select v-model="quickData.interest" :items="['장기렌트', '리스', '즉시출고', '이달의 특가', '기타']" label="상담 유형" variant="outlined" density="compact" rounded="0" class="mb-1" />
          <v-text-field v-model="quickData.vehicle" label="관심 차량 (선택)" variant="outlined" density="compact" rounded="0" class="mb-1" />
          <v-textarea v-model="quickData.message" label="문의 내용 (선택)" variant="outlined" density="compact" rounded="0" rows="2" class="mb-1" />
          <div class="agree-row">
            <v-checkbox v-model="quickData.agree" :rules="[v => !!v || '동의 필요']" density="compact" hide-details>
              <template #label>
                <span class="agree-label">[필수] 개인정보 수집 및 이용 동의 <a class="privacy-view-btn" @click.prevent.stop="privacyModal = true">[보기]</a></span>
              </template>
            </v-checkbox>
          </div>
          <button type="submit" class="quick-submit">견적 문의하기</button>
        </v-form>
      </div>
      <div v-else class="quick-success">
        <svg class="quick-check" viewBox="0 0 52 52">
          <circle cx="26" cy="26" r="24" fill="none" stroke="#111" stroke-width="2" stroke-dasharray="151" stroke-dashoffset="151" style="animation: qCircle 0.5s ease 0.1s forwards;" />
          <path fill="none" stroke="#111" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M14 27l8 8 16-16" stroke-dasharray="40" stroke-dashoffset="40" style="animation: qCheck 0.35s ease 0.5s forwards;" />
        </svg>
        <p class="quick-done-title">문의가 접수되었습니다!</p>
        <p class="quick-done-sub">매니저가 빠르게 연락드리겠습니다</p>
        <button class="quick-submit" style="margin-top: 16px;" @click="resetQuick">새로운 문의</button>
      </div>
    </aside>

    <!-- 차량 문의 모달 -->
    <v-dialog v-model="inquiryModal" max-width="480" class="inquiry-dialog">
      <v-card rounded="xl" class="pa-0" style="overflow: hidden;">
        <div class="modal-header">
          <div>
            <h3>{{ inquiryVehicle?.role ? '매니저 상담 문의' : '차량 문의' }}</h3>
            <p v-if="inquiryVehicle?.role">{{ inquiryVehicle.name }} {{ inquiryVehicle.role }}</p>
            <p v-else-if="inquiryVehicle">{{ inquiryVehicle.brand }} {{ inquiryVehicle.name }}</p>
          </div>
          <button class="modal-close" @click="inquiryModal = false">&times;</button>
        </div>
        <div class="modal-body">
          <v-form ref="inquiryForm" @submit.prevent="submitInquiry">
            <v-text-field v-model="inquiry.name" label="이름" variant="outlined" density="compact" rounded="lg" :rules="nameRules" @input="inquiry.name = inquiry.name.replace(/[^a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣\s]/g, '')" class="mb-1" />
            <v-text-field v-model="inquiry.phone" label="연락처" placeholder="010-0000-0000" variant="outlined" density="compact" rounded="lg" :rules="phoneRules" @input="formatInquiryPhone" maxlength="13" class="mb-1" />
            <v-textarea v-model="inquiry.message" label="문의 내용 (선택)" variant="outlined" density="compact" rounded="lg" rows="3" class="mb-1" />
            <div class="agree-row">
              <v-checkbox v-model="inquiry.agree" :rules="[v => !!v || '동의 필요']" density="compact" hide-details>
                <template #label>
                  <span class="agree-label">[필수] 개인정보 수집 및 이용 동의 <a class="privacy-view-btn" @click.prevent.stop="privacyModal = true">[보기]</a></span>
                </template>
              </v-checkbox>
            </div>
            <button type="submit" class="modal-submit">문의하기</button>
          </v-form>
        </div>
      </v-card>
    </v-dialog>

    <!-- 월납입금 계산기 모달 -->
    <div v-if="calcModal" class="g-overlay" @click.self="calcModal = false">
      <div class="g-modal calc-modal">
        <div class="g-modal-top">
          <h3>월 납입금 계산기</h3>
          <button class="g-modal-x" @click="calcModal = false">&times;</button>
        </div>
        <div class="calc-body">
          <div class="calc-car">
            <img v-if="calcVehicle?.image" :src="calcVehicle.image" class="calc-car-img" />
            <div class="calc-car-info">
              <p class="calc-car-sub">{{ calcVehicle?.brand }}</p>
              <h4>{{ calcVehicle?.name }}</h4>
              <p class="calc-car-price">차량가 {{ fmt(calcVehicle?.price || 0) }}원</p>
            </div>
          </div>

          <!-- 렌트 유형 선택 -->
          <div class="calc-type-row">
            <button v-for="t in calcTypes" :key="t.key" class="calc-type-btn" :class="{ active: calcType === t.key }" @click="calcType = t.key">
              {{ t.label }}
            </button>
          </div>

          <div class="calc-sliders">
            <div class="slider-group">
              <div class="slider-label"><span>계약 기간</span><strong>{{ calcMonths }}개월</strong></div>
              <input type="range" v-model.number="calcMonths" min="12" max="60" step="12" class="slider" />
              <div class="slider-ticks"><span>12</span><span>24</span><span>36</span><span>48</span><span>60</span></div>
            </div>
            <div class="slider-group">
              <div class="slider-label"><span>보증금</span><strong>{{ fmt(calcDeposit) }}원</strong></div>
              <input type="range" v-model.number="calcDeposit" min="0" :max="Math.round((calcVehicle?.price || 0) * 0.3)" :step="1000000" class="slider" />
              <div class="slider-ticks"><span>0원</span><span>{{ fmt(Math.round((calcVehicle?.price || 0) * 0.3)) }}원</span></div>
            </div>
            <div class="slider-group">
              <div class="slider-label"><span>선납금</span><strong>{{ fmt(calcAdvance) }}원</strong></div>
              <input type="range" v-model.number="calcAdvance" min="0" :max="Math.round((calcVehicle?.price || 0) * 0.3)" :step="1000000" class="slider" />
              <div class="slider-ticks"><span>0원</span><span>{{ fmt(Math.round((calcVehicle?.price || 0) * 0.3)) }}원</span></div>
            </div>
          </div>

          <!-- 결과 요약 -->
          <div class="calc-result">
            <div class="calc-result-main">
              <p class="calc-result-label">예상 월 납입금</p>
              <p class="calc-result-price">{{ fmt(calcMonthlyResult) }}<span>원</span></p>
            </div>
            <div class="calc-result-details">
              <div class="calc-detail-item"><span>렌트 유형</span><strong>{{ calcTypes.find(t => t.key === calcType)?.label }}</strong></div>
              <div class="calc-detail-item"><span>계약 기간</span><strong>{{ calcMonths }}개월</strong></div>
              <div class="calc-detail-item"><span>보증금</span><strong>{{ calcDeposit ? fmt(calcDeposit) + '원' : '없음' }}</strong></div>
              <div class="calc-detail-item"><span>선납금</span><strong>{{ calcAdvance ? fmt(calcAdvance) + '원' : '없음' }}</strong></div>
            </div>
            <p class="calc-result-note">* 실제 금액은 신용등급, 차종, 금융사에 따라 달라질 수 있습니다</p>
          </div>
          <div class="calc-actions">
            <button class="calc-inquiry-btn" @click="calcModal = false; openInquiryModal(calcVehicle)">이 조건으로 상담하기 →</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 비교함 하단 바 -->
    <div class="compare-bar" :class="{ show: compareCount > 0 }">
      <div class="compare-bar-inner">
        <div class="compare-items">
          <div v-for="v in compareList" :key="v.id" class="compare-thumb">
            <img :src="v.image" />
            <button class="compare-thumb-x" @click="removeCompare(v.id)">&times;</button>
            <p>{{ v.name }}</p>
          </div>
          <div v-for="n in (3 - compareCount)" :key="'e'+n" class="compare-thumb empty-thumb">
            <div class="empty-plus">+</div>
            <p>차량 선택</p>
          </div>
        </div>
        <div class="compare-bar-actions">
          <button class="compare-btn" :disabled="compareCount < 2" @click="compareModal = true">비교하기</button>
          <button class="compare-clear" @click="clearCompare">초기화</button>
        </div>
      </div>
    </div>

    <!-- 비교 모달 -->
    <div v-if="compareModal" class="g-overlay" @click.self="compareModal = false">
      <div class="g-modal compare-modal-box">
        <div class="g-modal-top">
          <h3>차량 비교</h3>
          <p class="compare-sub">최대 3대까지 비교할 수 있습니다</p>
          <button class="g-modal-x" @click="compareModal = false">&times;</button>
        </div>
        <div class="compare-body">
          <table class="compare-table">
            <thead>
              <tr>
                <th class="compare-label-col"></th>
                <th v-for="v in compareList" :key="v.id" class="compare-vehicle-col">
                  <div class="compare-vehicle-head">
                    <img :src="v.image" class="compare-head-img" />
                    <h4 class="compare-head-name">{{ v.name }}</h4>
                    <p class="compare-head-brand">{{ v.brand }}</p>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="compare-label">차량가</td>
                <td v-for="v in compareList" :key="v.id">{{ fmt(v.price) }}원</td>
              </tr>
              <tr class="compare-highlight-row">
                <td class="compare-label">월 렌트료</td>
                <td v-for="v in compareList" :key="v.id" class="compare-highlight">{{ fmt(v.monthlyRent) }}원</td>
              </tr>
              <tr>
                <td class="compare-label">계약기간</td>
                <td v-for="v in compareList" :key="v.id">{{ v.rentMonths }}개월</td>
              </tr>
              <tr>
                <td class="compare-label">보증금</td>
                <td v-for="v in compareList" :key="v.id">{{ v.deposit ? fmt(v.deposit) + '원' : '없음' }}</td>
              </tr>
              <tr>
                <td class="compare-label">연식</td>
                <td v-for="v in compareList" :key="v.id">{{ v.year }}년</td>
              </tr>
              <tr>
                <td class="compare-label">차종</td>
                <td v-for="v in compareList" :key="v.id">{{ v.type || '-' }}</td>
              </tr>
              <tr>
                <td class="compare-label">연료</td>
                <td v-for="v in compareList" :key="v.id">{{ v.fuel }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td></td>
                <td v-for="v in compareList" :key="v.id">
                  <button class="compare-col-btn" @click="compareModal = false; openInquiryModal(v)">상담 신청</button>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>

    <!-- 프로모션 팝업 -->
    <Transition name="promo-slide">
      <div v-if="promoVisible" class="promo-popup">
        <div class="promo-header">
          <div class="promo-badge">EVENT</div>
          <h3 class="promo-title">{{ promoConfig.title }}</h3>
          <button class="promo-close" @click="closePromo">&times;</button>
        </div>
        <div class="promo-desc-bar">
          <span><strong>{{ promoConfig.feat1 }}</strong></span>
          <span class="promo-dot"></span>
          <span><strong>{{ promoConfig.feat2 }}</strong></span>
          <span class="promo-dot"></span>
          <span><strong>{{ promoConfig.feat3 }}</strong></span>
        </div>
        <div class="promo-list">
          <router-link v-for="v in promoVehicles.slice(0, 4)" :key="v.id" :to="'/monthly-special'" class="promo-car" @click="closePromo">
            <div class="promo-car-img">
              <img :src="v.image" :alt="v.name" />
              <span v-if="v.discountRate" class="promo-car-off">{{ v.discountRate }}% OFF</span>
            </div>
            <div class="promo-car-info">
              <p class="promo-car-name">{{ v.name }}</p>
              <p class="promo-car-price">월 <strong>{{ fmt(v.monthlyRent) }}</strong>원</p>
            </div>
          </router-link>
        </div>
        <div class="promo-footer">
          <router-link to="/monthly-special" class="promo-btn" @click="closePromo">전체 특가 보기 →</router-link>
          <label class="promo-dismiss">
            <input type="checkbox" v-model="promoDismissToday" @change="closePromo" />
            오늘 하루 보지 않기
          </label>
        </div>
      </div>
    </Transition>

    <!-- 개인정보처리방침 모달 -->
    <div v-if="privacyModal" class="privacy-overlay" @click.self="privacyModal = false">
      <div class="privacy-modal">
        <div class="privacy-head">
          <h3>개인정보 수집 및 이용 동의</h3>
          <button @click="privacyModal = false">&times;</button>
        </div>
        <div class="privacy-body">
          <table class="privacy-table">
            <caption>개인정보 수집 및 이용 동의</caption>
            <thead>
              <tr><th>구분</th><th>목적</th><th>항목</th><th>보유기간</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>필수</td>
                <td>서비스 이용에 따른 본인 식별, 실명확인, 가입의사 확인, 연령제한 서비스 이용</td>
                <td>이름, 휴대전화번호, 이메일, 상담유형</td>
                <td>회원탈퇴 후 1년<br>또는 이용목적 달성 시</td>
              </tr>
              <tr>
                <td>선택</td>
                <td>서비스 관련 정보 안내, 이벤트 참여</td>
                <td>차량 종류/색상, 상담 가능 시간, 문의 내용</td>
                <td>동의 철회 시 또는<br>수집 목적 달성 시</td>
              </tr>
            </tbody>
          </table>
          <div class="privacy-text">
            <p>※ 동의를 거부할 수 있으며, 거부 시에도 서비스 이용이 가능합니다. 다만 필수 항목 미동의 시 상담 서비스 이용이 제한될 수 있습니다.</p>
            <p>※ 수집된 개인정보는 상담 목적 외에 사용되지 않으며, 개인정보 보호법에 따라 안전하게 관리됩니다.</p>
            <h4>개인정보의 제3자 제공</h4>
            <table class="privacy-table">
              <thead>
                <tr><th>제공받는 자</th><th>제공 항목</th><th>제공 목적</th><th>보유기간</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td>제휴 렌터사/금융사(현대캐피탈, KB캐피탈, 롯데렌탈 등)</td>
                  <td>이름, 연락처, 차량 정보, 문의 내용</td>
                  <td>렌트/리스 견적 비교 및 계약 진행</td>
                  <td>제공 목적 달성 시</td>
                </tr>
              </tbody>
            </table>
            <h4>개인정보 처리 위탁</h4>
            <table class="privacy-table">
              <thead>
                <tr><th>수탁업체</th><th>위탁 업무 내용</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td>오토원트</td>
                  <td>고객 상담, 서비스 안내, 계약 관련 업무</td>
                </tr>
              </tbody>
            </table>
            <h4>고객(이용자)의 권리 및 행사</h4>
            <p>고객은 개인정보 열람, 정정, 삭제, 처리정지를 요구할 수 있으며, 이메일(autowant@naver.com) 또는 전화(0507-1344-7898)로 요청 가능합니다.</p>
            <p>※ 본 동의는 오토원트(사업자등록번호: 609-88-02424)의 서비스 이용을 위한 것입니다.</p>
          </div>
        </div>
        <div class="privacy-foot">
          <button class="privacy-close-btn" @click="privacyModal = false">확인</button>
        </div>
      </div>
    </div>

    <!-- 문의 알림 토스트 -->
    <div class="noti-wrap">
      <transition-group name="noti">
        <div v-for="n in notifications" :key="n.id" class="noti-toast">
          <div class="noti-icon">!</div>
          <div class="noti-body">
            <p class="noti-title">{{ n.title }}</p>
            <p class="noti-desc">{{ n.desc }}</p>
            <p class="noti-time">{{ n.time }}</p>
          </div>
          <button class="noti-close" @click="dismissNoti(n.id)">&times;</button>
        </div>
      </transition-group>
    </div>

    <!-- 푸터 -->
    <footer :class="['app-footer', { 'app-footer-grey': isAboutPage }]">
      <div class="footer-inner">
        <!-- 상단: 로고 + 네비 + SNS -->
        <div class="ft-top">
          <div class="ft-brand ft-logo-link">
            <img src="/images/autowantlogo.png" alt="AUTOWANT" class="ft-logo-img" />
          </div>
          <nav class="ft-nav">
            <router-link to="/">홈</router-link>
            <router-link to="/guide">렌트란</router-link>
            <router-link to="/guide">리스란</router-link>
            <router-link to="/privacy">개인정보처리방침</router-link>
            <router-link to="/contact">문의하기</router-link>
          </nav>
          <div class="ft-social">
            <a href="https://instagram.com/autowant" target="_blank" title="Instagram" class="ft-soc-insta">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/></svg>
            </a>
            <a href="https://facebook.com/autowant" target="_blank" title="Facebook" class="ft-soc-fb">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="https://blog.naver.com/autowant" target="_blank" title="Naver" class="ft-soc-naver">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z"/></svg>
            </a>
            <a href="https://pf.kakao.com/_example" target="_blank" title="KakaoTalk">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3C6.48 3 2 6.58 2 10.94c0 2.8 1.86 5.27 4.66 6.67-.15.53-.96 3.4-.99 3.63 0 0-.02.17.09.24.11.06.24.01.24.01.32-.04 3.7-2.42 4.28-2.84.56.08 1.14.13 1.72.13 5.52 0 10-3.58 10-7.94S17.52 3 12 3z"/></svg>
            </a>
          </div>
        </div>

        <div class="ft-divider"></div>

        <!-- 하단: 사업자 정보 -->
        <div class="ft-bottom">
          <div class="ft-info">
            <p>상호명 : 오토원트&emsp;대표 : 신선호&emsp;TEL : 0507-1344-7898&emsp;EMAIL : autowant@naver.com</p>
            <p>주소 : 경기도 광명시 범안로 996번길 6 광명 티아모 IT타워&emsp;사업자등록번호 : 609-88-02424</p>
          </div>
          <p class="ft-copy">Copyright &copy; AUTOWANT. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  </v-app>
</template>

<script setup>
import { ref, computed, provide, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from './stores/auth'
import { useCompare } from './stores/compare'
import { notifications, addInquiry, fetchInquiries } from './stores/inquiries'
import { useVehicles } from './stores/vehicles'

const privacyModal = ref(false)
const fsb = ref('')
provide('openPrivacy', () => { privacyModal.value = true })

const router = useRouter()
const route = useRoute()
const { isAdmin, adminUser, logout } = useAuth()
const mobileMenu = ref(false)

// 프로모션 팝업
const promoConfig = computed(() => JSON.parse(localStorage.getItem('promo_settings') || '{"enabled":true,"title":"4월 특가 이벤트","desc":"","feat1":"보증금 0원","feat2":"최대 8% 할인","feat3":"즉시 출고"}'))
const { specialList: promoVehicles } = useVehicles()
const promoVisible = ref(false)
const promoDismissToday = ref(false)
function closePromo() {
  promoVisible.value = false
  if (promoDismissToday.value) {
    localStorage.setItem('promo_dismiss', new Date().toDateString())
  }
}
function initPromo() {
  if (isAdmin.value) return
  if (route.path === '/admin' || route.path.startsWith('/autowant-admin')) return
  const config = JSON.parse(localStorage.getItem('promo_settings') || '{"enabled":true}')
  if (!config.enabled) return
  const dismissed = localStorage.getItem('promo_dismiss')
  if (dismissed === new Date().toDateString()) return
  setTimeout(() => {
    if (!isAdmin.value && route.path === '/') promoVisible.value = true
  }, 1500)
}

// 회사소개 페이지 투명 네비게이션
const isAboutPage = computed(() => route.path === '/about')
const hideSidebars = computed(() => isAboutPage.value || route.path === '/admin')
const navScrolled = ref(false)
const navHidden = ref(false)
let lastScrollY = 0

// 사이드바 스크롤 따라오기
const showSidebar = ref(true)
const sidebarY = ref(0)
let targetY = 0
let animFrame = null

function onScroll() {
  const sy = window.scrollY
  navScrolled.value = sy > 60
  if (sy > lastScrollY && sy > 200) {
    navHidden.value = true
  } else {
    navHidden.value = false
  }
  lastScrollY = sy
}

function updateSidebarPos() {
  const viewH = window.innerHeight
  targetY = window.scrollY + viewH / 2
  sidebarY.value += (targetY - sidebarY.value) * 0.08
  animFrame = requestAnimationFrame(updateSidebarPos)
}

onMounted(() => {
  sidebarY.value = window.scrollY + window.innerHeight / 2
  window.addEventListener('scroll', onScroll)
  updateSidebarPos()
  fetchInquiries()
  initPromo()
  window.autowant = () => { router.push('/autowant-admin-access') }
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  cancelAnimationFrame(animFrame)
})

// 차량 문의 모달
const inquiryModal = ref(false)
const inquiryVehicle = ref(null)
const inquiryForm = ref(null)
const inquiry = ref({ name: '', phone: '', message: '', agree: false })

const { compareList, count: compareCount, toggleCompare, removeCompare, clearCompare, isInCompare } = useCompare()

// 계산기 모달
const calcModal = ref(false)
const calcVehicle = ref(null)
const calcMonths = ref(48)
const calcDeposit = ref(0)
const calcAdvance = ref(0)
const calcType = ref('long')
const calcTypes = [
  { key: 'long', label: '장기렌트' },
  { key: 'lease', label: '운용리스' },
  { key: 'finance', label: '금융리스' },
]

const calcMonthlyResult = computed(() => {
  if (!calcVehicle.value) return 0
  const base = calcVehicle.value.price - calcDeposit.value - calcAdvance.value
  const rates = { long: 1.05, lease: 1.03, finance: 1.04 }
  const monthly = Math.round(base / calcMonths.value * (rates[calcType.value] || 1.05))
  return Math.max(monthly, 0)
})

function openCalcModal(vehicle) {
  calcVehicle.value = vehicle
  calcMonths.value = vehicle.rentMonths || 48
  calcDeposit.value = vehicle.deposit || 0
  calcAdvance.value = 0
  calcType.value = 'long'
  calcModal.value = true
}

// 비교 모달
const compareModal = ref(false)

provide('openInquiryModal', openInquiryModal)
provide('openCalcModal', openCalcModal)
provide('toggleCompare', toggleCompare)
provide('isInCompare', isInCompare)

function fmt(p) { return (p || 0).toLocaleString('ko-KR') }

// 공통 유효성 규칙
const nameRules = [
  v => !!v || '필수',
  v => /^[a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣\s]*$/.test(v) || '한글 또는 영어만 입력 가능합니다',
]
const phoneRules = [
  v => !!v || '필수',
  v => /^\d{3}-\d{4}-\d{4}$/.test(v) || '010-0000-0000 형식으로 입력해주세요',
]

function formatInquiryPhone() {
  const nums = inquiry.value.phone.replace(/\D/g, '').slice(0, 11)
  if (nums.length <= 3) inquiry.value.phone = nums
  else if (nums.length <= 7) inquiry.value.phone = `${nums.slice(0, 3)}-${nums.slice(3)}`
  else inquiry.value.phone = `${nums.slice(0, 3)}-${nums.slice(3, 7)}-${nums.slice(7)}`
}

function openInquiryModal(vehicle) {
  inquiryVehicle.value = vehicle
  inquiry.value = { name: '', phone: '', message: '', agree: false }
  inquiryModal.value = true
}

async function submitInquiry() {
  const { valid } = await inquiryForm.value.validate()
  if (valid) {
    const v = inquiryVehicle.value
    const isManager = !!v?.role
    addInquiry({
      carType: isManager ? '' : (v ? `${v.brand} ${v.name}` : ''),
      carColor: '',
      name: inquiry.value.name,
      phone: inquiry.value.phone,
      email: '',
      availableTime: '',
      message: inquiry.value.message,
      manager: isManager ? v.name : '',
      source: isManager ? `매니저 상담 (${v.name})` : '차량 문의',
    })
    inquiryModal.value = false
  }
}

// 빠른 견적
const quickOpen = ref(false)
const quickSubmitted = ref(false)
const quickForm = ref(null)
const quickData = ref({ name: '', phone: '', interest: '', vehicle: '', message: '', agree: false })

function formatQuickPhone() {
  const nums = quickData.value.phone.replace(/\D/g, '').slice(0, 11)
  if (nums.length <= 3) quickData.value.phone = nums
  else if (nums.length <= 7) quickData.value.phone = `${nums.slice(0, 3)}-${nums.slice(3)}`
  else quickData.value.phone = `${nums.slice(0, 3)}-${nums.slice(3, 7)}-${nums.slice(7)}`
}

async function submitQuick() {
  const { valid } = await quickForm.value.validate()
  if (valid) {
    addInquiry({
      carType: quickData.value.vehicle,
      carColor: '',
      name: quickData.value.name,
      phone: quickData.value.phone,
      email: '',
      availableTime: '',
      message: quickData.value.message || quickData.value.interest || '',
      source: '빠른 견적',
    })
    quickSubmitted.value = true
  }
}

function resetQuick() {
  quickSubmitted.value = false
  quickData.value = { name: '', phone: '', interest: '', vehicle: '', message: '', agree: false }
}

function dismissNoti(id) {
  notifications.value = notifications.value.filter(n => n.id !== id)
}

function handleLogout() {
  logout()
  mobileMenu.value = false
  router.push('/')
}

async function scrollToSection(id) {
  if (route.path !== '/managers') {
    await router.push('/managers')
  }
  setTimeout(() => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, 100)
}
</script>

<style>
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700;800;900&display=swap');

* { box-sizing: border-box; margin: 0; }
html, body { overflow-x: hidden; width: 100%; }
body { font-family: 'Noto Sans KR', 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #2d2d2d; background: #fefefe; -webkit-font-smoothing: antialiased; }


/* 네비게이션 */
.main-navbar {
  position: fixed; top: 0; left: 0; right: 0;
  height: 72px;
  background: white;
  border-bottom: 1px solid #eee;
  z-index: 1900;
  transition: background 0.3s, border-color 0.3s, box-shadow 0.3s, transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.mobile-menu-btn {
  background: none; border: none; cursor: pointer; padding: 8px;
  color: #555; display: flex; align-items: center;
}
.admin-avatar-btn { width: 36px !important; height: 36px !important; }
.admin-avatar-img {
  width: 32px; height: 32px; border-radius: 50%;
  object-fit: cover; object-position: center top;
  border: 2px solid #f0f0f0;
  transition: border-color 0.15s;
}
.admin-avatar-btn:hover .admin-avatar-img { border-color: #111; }
.admin-header-avatar {
  width: 28px; height: 28px; border-radius: 50%;
  object-fit: cover; object-position: center top;
  margin-right: 10px;
}
.admin-user-header { padding-top: 8px !important; padding-bottom: 8px !important; }
.admin-user-name { font-size: 13px !important; font-weight: 700 !important; color: #111 !important; }
.main-navbar.navbar-hidden { transform: translateY(-100%); }
.main-navbar.navbar-transparent {
  background: transparent;
  border-bottom-color: transparent;
  box-shadow: none;
}
.main-navbar.navbar-blur {
  background: rgba(13, 13, 13, 0.65);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom-color: rgba(255,255,255,0.07);
  box-shadow: none;
}
.main-navbar.navbar-transparent .brand-text,
.main-navbar.navbar-blur .brand-text { color: #fff; }
.main-navbar.navbar-transparent .brand-accent,
.main-navbar.navbar-blur .brand-accent { color: rgba(255,255,255,0.75); }
.main-navbar.navbar-transparent .nav-link,
.main-navbar.navbar-blur .nav-link { color: rgba(255,255,255,0.65); }
.main-navbar.navbar-transparent .nav-link:hover,
.main-navbar.navbar-blur .nav-link:hover { color: #fff; }
.main-navbar.navbar-transparent .nav-active,
.main-navbar.navbar-blur .nav-active { color: #fff !important; }
.main-navbar.navbar-transparent .nav-cta,
.main-navbar.navbar-blur .nav-cta { background: rgba(255,255,255,0.15) !important; color: #fff !important; border: 1px solid rgba(255,255,255,0.3) !important; }
.navbar-inner {
  width: 100%; max-width: 1400px; margin: 0 auto; padding: 0 24px;
  display: flex; align-items: center; height: 100%;
}
.brand-link { text-decoration: none; display: flex; align-items: center; flex-shrink: 0; }
.brand-logo-img { height: 110px; width: auto; object-fit: contain; mix-blend-mode: multiply; }
.brand-text { color: #2d2d2d; transition: color 0.3s; }
.brand-accent { color: #4d8ef7; transition: color 0.3s; }
.nav-center {
  position: absolute; left: 50%; transform: translateX(-50%);
  display: flex; align-items: center; gap: 4px; height: 100%;
  white-space: nowrap;
}
.nav-right { display: flex; align-items: center; gap: 4px; margin-left: auto; }
.nav-link {
  text-decoration: none;
  color: #888;
  font-size: 14.5px;
  font-weight: 600;
  padding: 8px 16px;
  position: relative;
  transition: color 0.2s;
  height: 100%; display: flex; align-items: center;
  white-space: nowrap;
}
.nav-link::after {
  content: ''; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
  width: 0; height: 2.5px; background: #4d8ef7; border-radius: 2px;
  transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.nav-link:hover { color: #2d2d2d; }
.nav-link:hover::after { width: 24px; }
.nav-active { color: #2d2d2d !important; }
.nav-active::after { width: 24px !important; }

/* 드롭다운 */
.nav-drop {
  position: relative; height: 100%; display: flex; align-items: center;
}
.nav-caret {
  margin-left: 4px;
  transition: transform 0.2s ease;
}
.nav-drop:hover .nav-caret { transform: rotate(180deg); }
.nav-drop-panel {
  position: absolute;
  top: 100%; left: 50%; transform: translateX(-50%);
  min-width: 120px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.08);
  padding: 6px 0;
  opacity: 0; pointer-events: none;
  transition: opacity 0.2s ease, transform 0.2s ease;
  transform-origin: top center;
}
.nav-drop-panel::before {
  content: ''; position: absolute;
  top: -10px; left: 0; right: 0; height: 10px;
}
.nav-drop:hover .nav-drop-panel {
  opacity: 1; pointer-events: auto;
}
.nav-drop-link {
  display: block;
  padding: 9px 20px;
  font-size: 13.5px; font-weight: 600;
  color: #555; text-decoration: none;
  transition: color 0.15s, background 0.15s;
  white-space: nowrap;
}
.nav-drop-link:hover {
  color: #222; background: #f7f8fa;
}
/* 투명 네비바일 때 */
.main-navbar.navbar-transparent .nav-drop-panel,
.main-navbar.navbar-blur .nav-drop-panel {
  background: rgba(255,255,255,0.97);
  border-color: rgba(0,0,0,0.06);
  backdrop-filter: blur(12px);
}

.nav-cta {
  background: linear-gradient(135deg, #4d8ef7, #6c5ce7) !important;
  color: white !important;
  font-weight: 700 !important;
  font-size: 12.5px !important;
  letter-spacing: -0.2px;
  padding: 0 20px !important;
  border: none !important;
  transition: all 0.2s !important;
}
.nav-cta:hover { box-shadow: 0 4px 12px rgba(77,142,247,0.3) !important; transform: translateY(-1px) !important; }

/* 푸터 */
.app-footer { background: #fff; color: #888; padding: 0; border-top: 1px solid #f0f0f0; }
.app-footer-grey { background: #1a1a1a !important; border-top-color: #2a2a2a !important; }
.footer-inner { max-width: 1200px; margin: 0 auto; padding: 36px 24px 28px; }

.ft-top { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
.ft-logo-link {
  display: flex; align-items: center;
  flex-shrink: 0;
}
.ft-logo-img {
  height: 50px;
  width: auto;
  object-fit: contain;
  mix-blend-mode: multiply;
}
.ft-nav { display: flex; align-items: center; gap: 24px; flex-wrap: wrap; }
.ft-nav a { text-decoration: none; color: #8b95a1; font-size: 13px; font-weight: 600; transition: color 0.15s; }
.ft-nav a:hover { color: #191f28; }
.ft-social { display: flex; gap: 8px; }
.ft-social a {
  width: 32px; height: 32px; border-radius: 50%; border: 1px solid #e5e5e5;
  display: flex; align-items: center; justify-content: center;
  color: #aaa; text-decoration: none; transition: all 0.15s;
}
.ft-soc-insta { color: #E1306C !important; border-color: #f0c0d0 !important; }
.ft-soc-fb { color: #1877F2 !important; border-color: #b8d4f8 !important; }
.ft-soc-naver { color: #03c75a !important; border-color: #a7ecc5 !important; }

.ft-divider { height: 1px; background: #f0f0f0; margin: 24px 0; }

.ft-bottom { }
.ft-info p { font-size: 12px; color: #aaa; margin: 0 0 4px; line-height: 1.7; }
.ft-copy { font-size: 11px; color: #bbb; margin: 12px 0 0; }

@media (max-width: 768px) {
  .ft-top { flex-direction: column; align-items: flex-start; }
  .ft-info p { font-size: 11px; }
  .ft-info p { word-break: keep-all; }
}

/* 왼쪽 사이드바 */
.floating-sidebar {
  position: absolute;
  left: 20px;
  transform: translateY(-50%);
  z-index: 1800;
  width: 240px;
  display: flex; flex-direction: column; gap: 8px;
  opacity: 0; pointer-events: none;
  transition: opacity 0.3s ease;
}
.floating-sidebar.visible { opacity: 1; pointer-events: auto; }

/* 전화 카드 */
.lsb-phone-card {
  display: flex; align-items: center; gap: 12px;
  background: white; border-radius: 14px; padding: 18px;
  text-decoration: none; color: inherit;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06); border: 1px solid #f0f0f0;
  transition: all 0.2s;
}
.lsb-phone-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.1); transform: translateY(-1px); }
.lsb-phone-card svg { color: #4d8ef7; flex-shrink: 0; }
.lsb-ph-num { font-size: 16px; font-weight: 800; color: #2d2d2d; margin: 0; }
.lsb-ph-time { font-size: 11px; color: #bbb; margin: 2px 0 0; }

/* 상담 카드 */
.lsb-mid-card {
  background: white; border-radius: 14px; padding: 18px;
  text-align: center; box-shadow: 0 2px 12px rgba(0,0,0,0.06); border: 1px solid #f0f0f0;
}
.lsb-mid-text { font-size: 13px; color: #888; margin: 0 0 12px; }
.lsb-mid-btn {
  display: block; padding: 11px; text-decoration: none;
  background: #2d2d2d; color: white;
  border-radius: 8px; font-size: 14px; font-weight: 700;
  transition: all 0.2s;
}
.lsb-mid-btn:hover { background: #444; }

/* SNS 카드 */
.lsb-sns-card {
  background: white; border-radius: 14px; padding: 14px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06); border: 1px solid #f0f0f0;
}
.lsb-sns-row { display: flex; justify-content: center; gap: 8px; }
.lsb-sn {
  width: 40px; height: 40px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  text-decoration: none; transition: transform 0.15s;
}
.lsb-sn:hover { transform: scale(1.1); }
.lsb-sn-kakao { background: #fee500; color: #3c1e1e; }
.lsb-sn-naver { background: #03c75a; color: white; }
.lsb-sn-insta { background: linear-gradient(135deg, #f58529, #dd2a7b, #8134af); color: white; }
.lsb-sn-fb { background: #1877F2; color: white; }

@media (max-width: 1400px) {
  .floating-sidebar { display: none; }
}

/* 오른쪽 빠른 견적 사이드바 */
.quick-sidebar {
  position: absolute; right: 20px; z-index: 1800;
  transform: translateY(-50%);
  width: 280px;
  background: white; border: 1px solid #eee; border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.06);
  display: flex; flex-direction: column;
  opacity: 0; pointer-events: none;
  transition: opacity 0.3s ease;
  max-height: calc(100vh - 100px); overflow-y: auto;
  scrollbar-width: thin;
}
.quick-sidebar.visible { opacity: 1; pointer-events: auto; }
.quick-head {
  padding: 14px 16px; border-bottom: 1px solid #f0f0f0;
}
.quick-head h4 { font-size: 14px; font-weight: 800; color: #111; margin: 0; }
.quick-body { padding: 14px 16px; }
.quick-submit {
  width: 100%; padding: 10px; background: #4d8ef7; color: #fff !important; border: none;
  border-radius: 6px; font-size: 13px; font-weight: 700; cursor: pointer;
  -webkit-text-fill-color: #fff; transition: all 0.2s;
}
.quick-submit:hover { background: #3a7be0; box-shadow: 0 4px 12px rgba(77,142,247,0.3); transform: translateY(-1px); }
.quick-success {
  display: flex; flex-direction: column; align-items: center;
  padding: 32px 16px; text-align: center;
}
.quick-check { width: 48px; height: 48px; margin-bottom: 14px; }
@keyframes qCircle { to { stroke-dashoffset: 0; } }
@keyframes qCheck { to { stroke-dashoffset: 0; } }
.quick-done-title { font-size: 15px; font-weight: 800; color: #111; margin: 0 0 4px; }
.quick-done-sub { font-size: 12px; color: #999; margin: 0; }
@media (max-width: 1600px) {
  .quick-sidebar { right: 8px; width: 240px; }
}
@media (max-width: 1400px) {
  .quick-sidebar { display: none; }
}

/* 동의 행 */
.agree-row { margin-bottom: 12px; }
.agree-label {
  font-size: 13px; color: #333; font-weight: 500;
}
.privacy-view-btn {
  color: #3182f6; font-weight: 600; cursor: pointer;
  text-decoration: none;
}
.privacy-view-btn:hover { color: #1d6ce0; }

/* 개인정보처리방침 모달 */
.privacy-overlay {
  position: fixed; inset: 0; z-index: 3000;
  background: rgba(0,0,0,0.55); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  padding: 24px 16px;
}
.privacy-modal {
  width: 680px; max-width: 100%; max-height: 90vh;
  background: white; border-radius: 8px; overflow: hidden;
  box-shadow: 0 24px 60px rgba(0,0,0,0.35);
  display: flex; flex-direction: column;
  border: 1px solid #d4dae3;
}
/* 상단 헤더 - 하늘색 바 (스크린샷 스타일) */
.privacy-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 20px;
  background: #eef3f9;
  border-bottom: 1px solid #d4dae3;
}
.privacy-head h3 { font-size: 14px; font-weight: 700; color: #2a3a52; margin: 0; }
.privacy-head button {
  background: none; border: none; font-size: 22px; color: #6b7280; cursor: pointer;
  line-height: 1; padding: 0; width: 24px; height: 24px;
}
.privacy-head button:hover { color: #111; }

.privacy-body {
  padding: 24px 28px; overflow-y: auto; flex: 1;
  background: #ffffff;
  font-size: 13px; color: #444; line-height: 1.75;
}
.privacy-body::-webkit-scrollbar { width: 10px; }
.privacy-body::-webkit-scrollbar-track { background: #f5f7fa; }
.privacy-body::-webkit-scrollbar-thumb { background: #c8d0db; border-radius: 5px; }

.privacy-intro {
  font-size: 13px; color: #444; line-height: 1.85;
  margin: 0 0 22px;
  padding-bottom: 18px;
  border-bottom: 1px dashed #e5e8eb;
}
.privacy-h4 {
  font-size: 14px; font-weight: 700; color: #1f2937;
  margin: 22px 0 8px;
}
.privacy-p {
  font-size: 13px; color: #4b5563; line-height: 1.85;
  margin: 0 0 12px;
}
.privacy-text { font-size: 13px; color: #4b5563; line-height: 1.75; }
.privacy-text p { margin: 0 0 10px; }
.privacy-text h4 { font-size: 14px; font-weight: 700; color: #1f2937; margin: 22px 0 10px; }
.privacy-table {
  width: 100%; border-collapse: collapse;
  margin: 12px 0 18px;
  font-size: 12.5px;
}
.privacy-table caption { text-align: left; font-size: 14px; font-weight: 700; color: #1f2937; margin-bottom: 10px; }
.privacy-table th {
  background: #f5f7fa; padding: 11px 12px; text-align: center;
  font-weight: 700; color: #374151;
  border: 1px solid #d4dae3;
}
.privacy-table td {
  padding: 11px 12px; border: 1px solid #d4dae3;
  color: #4b5563; line-height: 1.6; text-align: center;
  vertical-align: middle;
}
.privacy-tail {
  font-size: 12px; color: #888; margin: 20px 0 0;
  padding-top: 16px; border-top: 1px dashed #e5e8eb;
}

.privacy-foot {
  padding: 14px 20px; border-top: 1px solid #d4dae3;
  text-align: center; background: #f9fafb;
}
.privacy-close-btn {
  padding: 10px 40px; background: linear-gradient(135deg, #4d8ef7, #6c5ce7); color: white;
  border: none; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer;
  transition: all 0.2s;
}
.privacy-close-btn:hover { box-shadow: 0 4px 12px rgba(77,142,247,0.3); transform: translateY(-1px); }

@media (max-width: 768px) {
  .privacy-body { padding: 18px 20px; }
  .privacy-table { font-size: 11px; }
  .privacy-table th, .privacy-table td { padding: 8px 6px; }
}

/* 문의 모달 */
.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 24px 24px 16px;
  border-bottom: 1px solid #f0f0f0;
}
.modal-header h3 { font-size: 17px; font-weight: 800; color: #191f28; margin: 0; letter-spacing: -0.3px; }
.modal-header p { font-size: 13px; color: #8b95a1; margin: 4px 0 0; font-weight: 500; }
.modal-close {
  width: 32px; height: 32px; border-radius: 8px;
  background: #f5f7fa; border: none;
  font-size: 18px; color: #8b95a1; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.15s; flex-shrink: 0;
}
.modal-close:hover { background: #e5e8eb; color: #333; }
.modal-body { padding: 20px 24px 24px; }
.modal-submit {
  width: 100%; padding: 14px;
  background: linear-gradient(135deg, #3182f6, #2563eb);
  color: #fff !important; border: none; border-radius: 10px;
  font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.2s;
  -webkit-text-fill-color: #fff;
  box-shadow: 0 2px 8px rgba(49,130,246,0.25);
}
.modal-submit:hover { box-shadow: 0 6px 20px rgba(49,130,246,0.35); transform: translateY(-1px); }

/* 알림 토스트 */
.noti-wrap {
  position: fixed; bottom: 24px; right: 24px; z-index: 2200;
  display: flex; flex-direction: column; gap: 8px; pointer-events: none;
}
.noti-toast {
  pointer-events: auto;
  display: flex; align-items: flex-start; gap: 12px;
  background: white; border: 1px solid #eee; border-radius: 12px;
  padding: 14px 16px; box-shadow: 0 8px 30px rgba(0,0,0,0.12);
  min-width: 300px; max-width: 380px;
}
.noti-icon {
  width: 32px; height: 32px; border-radius: 50%; background: #111; color: white;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; font-weight: 800; flex-shrink: 0;
}
.noti-body { flex: 1; }
.noti-title { font-size: 13px; font-weight: 700; color: #111; margin: 0 0 2px; }
.noti-desc { font-size: 12px; color: #888; margin: 0; }
.noti-time { font-size: 10px; color: #ccc; margin: 4px 0 0; }
.noti-close { background: none; border: none; font-size: 18px; color: #ccc; cursor: pointer; line-height: 1; padding: 0; flex-shrink: 0; }
.noti-close:hover { color: #111; }

/* 알림 애니메이션 */
.noti-enter-active { animation: notiIn 0.3s ease; }
.noti-leave-active { animation: notiOut 0.25s ease; }
@keyframes notiIn { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
@keyframes notiOut { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(40px); } }

@media (max-width: 768px) {
  .noti-wrap { right: 12px; bottom: 12px; left: 12px; }
  .noti-toast { min-width: auto; }
  /* 모바일 네비바: 로고 왼쪽, 햄버거 오른쪽 */
  .navbar-inner { padding: 0 8px 0 0; justify-content: space-between; }
  .brand-link { margin-top: 4px; }
  .brand-logo-img { height: 80px; margin-left: -8px; }
  .main-navbar .v-app-bar-nav-icon { margin-left: auto; }
  /* 첫 화면(어두운 히어로)에서 햄버거 흰색 */
  .main-navbar.navbar-transparent .v-app-bar-nav-icon { color: #fff !important; }
  .main-navbar.navbar-blur .v-app-bar-nav-icon { color: #fff !important; }
}

/* 스크롤 리빌은 v-reveal 디렉티브에서 inline style로 처리 */

/* ===== 호버 이펙트 ===== */
/* 카드 float 효과 */
.hvr-float { transition: transform 0.3s ease, box-shadow 0.3s ease; }
.hvr-float:hover { transform: translateY(-6px); box-shadow: 0 12px 32px rgba(0,0,0,0.08); }

/* 카드 grow 효과 */
.hvr-grow { transition: transform 0.25s ease; }
.hvr-grow:hover { transform: scale(1.03); }

/* 버튼 sweep 효과 */
.hvr-sweep {
  position: relative; overflow: hidden; z-index: 1;
  transition: color 0.3s ease;
}
.hvr-sweep::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  background: #111; z-index: -1; transform: scaleX(0); transform-origin: left;
  transition: transform 0.3s ease;
}
.hvr-sweep:hover::before { transform: scaleX(1); }
.hvr-sweep:hover { color: white; }

/* 버튼 pulse 효과 */
.hvr-pulse:hover { animation: hvr-pulse 0.6s ease; }
@keyframes hvr-pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.06); }
  100% { transform: scale(1); }
}

/* 밑줄 등장 효과 */
.hvr-underline { position: relative; }
.hvr-underline::after {
  content: ''; position: absolute; bottom: -2px; left: 0; width: 0; height: 2px;
  background: #111; transition: width 0.3s ease;
}
.hvr-underline:hover::after { width: 100%; }

/* 아이콘 bounce */
.hvr-icon-bounce:hover .bounce-icon { animation: iconBounce 0.4s ease; }
@keyframes iconBounce {
  0%,100% { transform: translateY(0); }
  40% { transform: translateY(-6px); }
  60% { transform: translateY(-3px); }
}

/* 공통 오버레이/모달 */
.g-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 2100; display: flex; align-items: center; justify-content: center; padding: 20px; }
.g-modal { background: white; border-radius: 14px; width: 100%; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden; }
.g-modal-top { display: flex; align-items: center; justify-content: space-between; padding: 18px 22px; border-bottom: 1px solid #f0f0f0; }
.g-modal-top h3 { font-size: 16px; font-weight: 700; color: #111; margin: 0; }
.g-modal-x { background: none; border: none; font-size: 24px; color: #ccc; cursor: pointer; }
.g-modal-x:hover { color: #111; }

/* ===== 계산기 모달 ===== */
.calc-modal { max-width: 520px; }
.calc-body { padding: 22px; overflow-y: auto; }
.calc-car { display: flex; gap: 14px; align-items: center; margin-bottom: 22px; padding-bottom: 18px; border-bottom: 1px solid #f5f5f5; }
.calc-car-img { width: 120px; height: 72px; border-radius: 8px; object-fit: cover; flex-shrink: 0; }
.calc-car-sub { font-size: 11px; color: #aaa; margin: 0; }
.calc-car-info h4 { font-size: 16px; font-weight: 700; color: #111; margin: 2px 0 4px; }
.calc-car-price { font-size: 13px; color: #666; margin: 0; }

/* 렌트 유형 선택 */
.calc-type-row {
  display: flex; gap: 8px; margin-bottom: 20px;
}
.calc-type-btn {
  flex: 1; padding: 10px 0;
  background: #f5f7fa; border: 1px solid #e5e8eb; border-radius: 8px;
  font-size: 13px; font-weight: 600; color: #4e5968;
  cursor: pointer; transition: all 0.15s;
}
.calc-type-btn.active {
  background: #191f28; border-color: #191f28; color: #fff;
}
.calc-type-btn:not(.active):hover { border-color: #c1c8d1; }

.calc-sliders { margin-bottom: 22px; }
.slider-group { margin-bottom: 18px; }
.slider-label { display: flex; justify-content: space-between; margin-bottom: 8px; }
.slider-label span { font-size: 13px; color: #888; }
.slider-label strong { font-size: 14px; color: #111; }
.slider {
  width: 100%; height: 6px; -webkit-appearance: none; appearance: none;
  background: #eee; border-radius: 3px; outline: none;
}
.slider::-webkit-slider-thumb {
  -webkit-appearance: none; width: 20px; height: 20px; border-radius: 50%;
  background: #111; cursor: pointer; border: 3px solid white; box-shadow: 0 1px 4px rgba(0,0,0,0.2);
}
.slider-ticks { display: flex; justify-content: space-between; margin-top: 4px; }
.slider-ticks span { font-size: 10px; color: #ccc; }

.calc-result {
  background: #191f28; border-radius: 14px; padding: 22px; margin-bottom: 14px;
}
.calc-result-main { text-align: center; margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.1); }
.calc-result-label { font-size: 12px; color: #8b95a1; margin: 0 0 6px; }
.calc-result-price { font-size: 32px; font-weight: 900; color: #3182f6; margin: 0; }
.calc-result-price span { font-size: 14px; font-weight: 500; color: #8b95a1; }
.calc-result-details { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.calc-detail-item {
  display: flex; justify-content: space-between; padding: 6px 0;
  font-size: 12px;
}
.calc-detail-item span { color: #8b95a1; }
.calc-detail-item strong { color: #fff; font-weight: 600; }
.calc-result-note { font-size: 11px; color: #6b7684; margin: 12px 0 0; text-align: center; }

.calc-actions { }
.calc-inquiry-btn {
  width: 100%; padding: 14px;
  background: linear-gradient(135deg, #3182f6, #2563eb); color: #fff; border: none;
  border-radius: 10px; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(49,130,246,0.25);
}
.calc-inquiry-btn:hover { box-shadow: 0 6px 20px rgba(49,130,246,0.35); transform: translateY(-1px); }

/* ===== 비교함 하단 바 ===== */
.compare-bar {
  position: fixed; bottom: -120px; left: 0; right: 0; z-index: 2000;
  background: white; border-top: 1px solid #eee; box-shadow: 0 -4px 20px rgba(0,0,0,0.08);
  transition: bottom 0.3s ease;
}
.compare-bar.show { bottom: 0; }
.compare-bar-inner {
  max-width: 1200px; margin: 0 auto; padding: 12px 20px;
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
}
.compare-items { display: flex; gap: 10px; flex: 1; }
.compare-thumb {
  width: 140px; display: flex; align-items: center; gap: 8px;
  padding: 6px 10px; border: 1px solid #f0f0f0; border-radius: 8px; position: relative;
}
.compare-thumb img { width: 48px; height: 32px; border-radius: 4px; object-fit: cover; flex-shrink: 0; }
.compare-thumb p { font-size: 11px; font-weight: 600; color: #111; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.compare-thumb-x {
  position: absolute; top: -6px; right: -6px; width: 18px; height: 18px;
  background: #111; color: white; border: none; border-radius: 50%; font-size: 11px;
  cursor: pointer; display: flex; align-items: center; justify-content: center; line-height: 1;
}
.empty-thumb { border-style: dashed; border-color: #ddd; justify-content: center; }
.empty-plus { font-size: 18px; color: #ccc; }
.empty-thumb p { color: #ccc; }
.compare-bar-actions { display: flex; gap: 8px; flex-shrink: 0; }
.compare-btn {
  padding: 10px 28px; background: #111; color: white; border: none; border-radius: 8px;
  font-size: 13px; font-weight: 700; cursor: pointer;
}
.compare-btn:disabled { background: #ccc; cursor: not-allowed; }
.compare-btn:not(:disabled):hover { background: #333; }
.compare-clear {
  padding: 10px 16px; background: white; color: #999; border: 1px solid #eee;
  border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer;
}

/* ===== 비교 모달 ===== */
.compare-modal-box { max-width: 920px; width: 95vw; }
.compare-sub { font-size: 12px; color: #8b95a1; margin: 2px 0 0; font-weight: 500; }
.compare-body { overflow-x: auto; padding: 0 0 20px; }
.compare-table { width: 100%; border-collapse: collapse; min-width: 600px; }
.compare-label-col { width: 120px; }
.compare-vehicle-col { text-align: center; padding: 20px 16px; }
.compare-vehicle-head { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.compare-head-img {
  width: 100%; max-width: 180px; height: 100px; object-fit: contain;
  background: #f8f9fb; border-radius: 10px; padding: 8px;
  mix-blend-mode: multiply;
}
.compare-head-name { font-size: 15px; font-weight: 800; color: #191f28; margin: 0; }
.compare-head-brand { font-size: 12px; color: #8b95a1; margin: 0; font-weight: 500; }
.compare-table tbody td {
  padding: 12px 16px; font-size: 14px; color: #333;
  border-bottom: 1px solid #f0f2f5; text-align: center;
  font-weight: 500;
}
.compare-label {
  text-align: left !important; color: #8b95a1 !important;
  font-size: 13px !important; font-weight: 600 !important;
  padding-left: 20px !important;
  background: #f8f9fb;
}
.compare-highlight-row { background: #f0f6ff; }
.compare-highlight {
  color: #3182f6 !important; font-weight: 800 !important;
  font-size: 16px !important;
}
.compare-table tbody tr:hover { background: #fafbfc; }
.compare-highlight-row:hover { background: #e8f0fe !important; }
.compare-table tfoot td { padding: 16px; text-align: center; border: none; }
.compare-col-btn {
  padding: 10px 28px; background: #191f28; color: white; border: none;
  border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer;
  transition: all 0.2s;
}
.compare-col-btn:hover { background: #333; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }

@media (max-width: 768px) {
  .compare-bar-inner { flex-direction: column; padding: 10px 16px; }
  .compare-items { width: 100%; }
  .compare-thumb { flex: 1; width: auto; min-width: 0; }
  .compare-bar-actions { width: 100%; justify-content: stretch; }
  .compare-btn, .compare-clear { flex: 1; }
  .compare-grid { flex-direction: column; }
  .compare-col { border-right: none; border-bottom: 1px solid #f0f0f0; }
}

/* ===== 프로모션 팝업 ===== */
.promo-popup {
  position: fixed; top: 84px; left: 20px; z-index: 2500;
  width: 320px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.06);
  overflow: hidden;
}
.promo-header {
  display: flex; align-items: center; gap: 8px;
  padding: 14px 16px;
  background: #191f28;
}
.promo-badge {
  padding: 3px 8px;
  background: #ef4444; color: white; border-radius: 4px;
  font-size: 10px; font-weight: 800; letter-spacing: 0.5px;
  flex-shrink: 0;
}
.promo-title {
  flex: 1;
  font-size: 15px; font-weight: 800; color: #fff;
  margin: 0; letter-spacing: -0.3px;
}
.promo-close {
  width: 28px; height: 28px; border-radius: 6px;
  background: rgba(255,255,255,0.1); border: none;
  font-size: 16px; color: rgba(255,255,255,0.6); cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.15s;
}
.promo-close:hover { background: rgba(255,255,255,0.2); color: #fff; }
.promo-desc-bar {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  padding: 10px 16px;
  background: #f8f9fb; border-bottom: 1px solid #eef0f3;
  font-size: 11px; color: #4e5968; font-weight: 500;
}
.promo-desc-bar strong { color: #3182f6; font-weight: 700; }
.promo-dot {
  width: 3px; height: 3px; border-radius: 50%;
  background: #d1d6db; flex-shrink: 0;
}
.promo-list {
  padding: 8px;
  display: flex; flex-direction: column; gap: 4px;
  max-height: 320px; overflow-y: auto;
}
.promo-car {
  display: flex; align-items: center; gap: 12px;
  padding: 10px;
  border-radius: 10px;
  text-decoration: none;
  transition: background 0.15s;
}
.promo-car:hover { background: #f5f7fa; }
.promo-car-img {
  position: relative; flex-shrink: 0;
  width: 80px; height: 52px;
  background: #f5f5f5; border-radius: 8px;
  overflow: hidden;
  display: flex; align-items: center; justify-content: center;
}
.promo-car-img img {
  width: 90%; height: auto; object-fit: contain;
  mix-blend-mode: multiply;
}
.promo-car-off {
  position: absolute; top: 3px; left: 3px;
  padding: 2px 5px;
  background: #ef4444; color: white; border-radius: 3px;
  font-size: 9px; font-weight: 800;
}
.promo-car-info { flex: 1; min-width: 0; }
.promo-car-name {
  font-size: 13px; font-weight: 700; color: #191f28;
  margin: 0 0 2px;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.promo-car-price {
  font-size: 12px; color: #8b95a1; margin: 0;
}
.promo-car-price strong { color: #191f28; }
.promo-footer {
  padding: 12px 16px;
  border-top: 1px solid #eef0f3;
  display: flex; flex-direction: column; gap: 10px; align-items: center;
}
.promo-btn {
  display: block; width: 100%; text-align: center;
  padding: 11px;
  background: #191f28; color: white; border: none; border-radius: 8px;
  font-size: 13px; font-weight: 700; text-decoration: none;
  cursor: pointer; transition: background 0.2s;
}
.promo-btn:hover { background: #333d4b; }
.promo-dismiss {
  display: flex; align-items: center; gap: 5px;
  font-size: 11px; color: #8b95a1; cursor: pointer; font-weight: 500;
}
.promo-dismiss input { accent-color: #8b95a1; }

/* 프로모션 트랜지션 */
.promo-slide-enter-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.promo-slide-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.promo-slide-enter-from { opacity: 0; transform: translateX(-20px) translateY(-10px); }
.promo-slide-leave-to { opacity: 0; transform: translateX(-20px); }

@media (max-width: 768px) {
  .promo-popup { width: 280px; left: 10px; top: 80px; }
  .promo-car-img { width: 64px; height: 42px; }
}
</style>
