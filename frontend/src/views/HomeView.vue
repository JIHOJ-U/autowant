<template>
  <div class="home">
    <!-- 이달의 특가 -->
    <section class="special-section">
      <div class="special-bg-deco"></div>
      <canvas ref="particleCanvas" class="particle-canvas"></canvas>
      <div class="container" style="position: relative; z-index: 1;">
        <div v-reveal class="special-banner">
          <div class="special-banner-left">
            <span class="special-event-tag">LIMITED EVENT</span>
            <h2 class="special-title">{{ currentMonth }}월 특가 이벤트</h2>
            <p class="special-desc">이달에만 만나볼 수 있는 파격 할인! 지금 바로 상담받으세요</p>
          </div>
          <div class="countdown-wrap">
            <p class="countdown-label">이벤트 종료까지</p>
            <div class="countdown">
              <div class="cd-block"><span class="cd-num">{{ countdown.days }}</span><span class="cd-unit">일</span></div>
              <span class="cd-sep">:</span>
              <div class="cd-block"><span class="cd-num">{{ countdown.hours }}</span><span class="cd-unit">시간</span></div>
              <span class="cd-sep">:</span>
              <div class="cd-block"><span class="cd-num">{{ countdown.minutes }}</span><span class="cd-unit">분</span></div>
              <span class="cd-sep">:</span>
              <div class="cd-block"><span class="cd-num">{{ countdown.seconds }}</span><span class="cd-unit">초</span></div>
            </div>
            <div v-if="isAdmin" class="event-date-edit">
              <button v-if="!editingEventDate" class="event-edit-btn" @click="editingEventDate = true">종료일 변경</button>
              <div v-else class="event-date-form">
                <input type="datetime-local" v-model="eventDateInput" class="event-date-input" />
                <button class="event-save-btn" @click="saveEventDate">저장</button>
                <button class="event-cancel-btn" @click="editingEventDate = false">취소</button>
              </div>
            </div>
          </div>
        </div>
        <div class="special-scroll">
          <div v-for="(v, i) in specialVehicles" :key="v.id" v-reveal="{ delay: i * 80, dir: 'right' }" class="special-card" @click="openVehicle(v)">
            <div class="card-img">
              <img :src="v.image" :alt="v.name" />
              <span class="badge badge-special">{{ v.discount }}% OFF</span>
            </div>
            <div class="card-body">
              <p class="card-sub">{{ v.brand }}</p>
              <h3 class="card-name">{{ v.name }}</h3>
              <p class="price-original">{{ fmt(v.originalPrice) }}원</p>
              <p class="price-discount">{{ fmt(v.price) }}<span class="won">원</span></p>
              <p class="card-monthly">월 <strong>{{ fmt(v.monthlyRent) }}원</strong> / {{ v.rentMonths }}개월</p>
            </div>
            <div class="special-card-cta">지금 상담받기</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 이달의 우수사원 -->
    <section v-if="mvpManagers.length || isAdmin" class="mvp-section">
      <div class="container">
        <div v-reveal class="section-head" style="text-align: center;">
          <svg class="mvp-crown" viewBox="0 0 64 52" fill="none">
            <path d="M8 40L14 18l10 9 8-19 8 19 10-9 6 22H8z" fill="url(#cg1)"/>
            <path d="M8 40L14 18l10 9 8-19 8 19 10-9 6 22H8z" fill="url(#cg2)" opacity="0.4"/>
            <rect x="6" y="38" width="52" height="8" rx="3" fill="url(#cg1)"/>
            <circle cx="20" cy="42" r="2" fill="#fff" opacity="0.5"/>
            <circle cx="32" cy="42" r="2.5" fill="#fff" opacity="0.6"/>
            <circle cx="44" cy="42" r="2" fill="#fff" opacity="0.5"/>
            <circle cx="14" cy="18" r="2.5" fill="#fff" opacity="0.4"/>
            <circle cx="32" cy="8" r="3" fill="#fff" opacity="0.5"/>
            <circle cx="50" cy="18" r="2.5" fill="#fff" opacity="0.4"/>
            <defs>
              <linearGradient id="cg1" x1="8" y1="4" x2="56" y2="48"><stop stop-color="#FFD54F"/><stop offset="0.5" stop-color="#FFB300"/><stop offset="1" stop-color="#FF8F00"/></linearGradient>
              <linearGradient id="cg2" x1="32" y1="0" x2="32" y2="48"><stop stop-color="#fff" stop-opacity="0.5"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
            </defs>
          </svg>
          <h2 class="section-title">이달의 우수사원</h2>
          <p class="section-sub">최고의 서비스를 제공한 매니저를 소개합니다</p>
        </div>
        <div class="mvp-grid">
          <div v-for="(m, i) in mvpManagers" :key="m.id" v-reveal="{ delay: i * 100, dir: 'scale' }" class="mvp-card">
            <!-- 관리자: 삭제 버튼 -->
            <button v-if="isAdmin" class="mvp-remove" @click="setMVP(m.id)" title="우수사원 해제">✕</button>
            <div class="mvp-photo">
              <img v-if="m.image" :src="m.image" :alt="m.name" />
              <div v-else class="mvp-placeholder"><span>{{ m.name.charAt(0) }}</span></div>
              <div class="mvp-badge-wrap">
                <span class="mvp-badge">MVP</span>
              </div>
            </div>
            <div class="mvp-info">
              <h3 class="mvp-name">{{ m.name }}</h3>
              <p class="mvp-role">{{ m.role }} · {{ m.experience }}</p>
              <p class="mvp-intro">{{ m.intro }}</p>
              <div class="mvp-tags">
                <span v-for="t in m.tags" :key="t">{{ t }}</span>
              </div>
              <button class="mvp-btn" @click="openVehicle(m)">상담받기 ›</button>
            </div>
          </div>
          <!-- 관리자: 추가 버튼 -->
          <div v-if="isAdmin" class="mvp-card mvp-add-card" @click="mvpAddOpen = true">
            <div class="mvp-add-icon">+</div>
            <p class="mvp-add-text">우수사원 추가</p>
          </div>
        </div>
        <!-- 관리자: 추가 모달 -->
        <div v-if="mvpAddOpen" class="mvp-modal-overlay" @click.self="mvpAddOpen = false">
          <div class="mvp-modal">
            <div class="mvp-modal-head">
              <h3>우수사원 추가</h3>
              <button @click="mvpAddOpen = false">&times;</button>
            </div>
            <div class="mvp-modal-body">
              <p class="mvp-modal-sub">등록된 매니저 중 우수사원으로 지정할 매니저를 선택하세요</p>
              <div v-for="m in nonMvpManagers" :key="m.id" class="mvp-pick-row" @click="addMvpManager(m.id)">
                <div class="mvp-pick-avatar">{{ m.name.charAt(0) }}</div>
                <div class="mvp-pick-info">
                  <p class="mvp-pick-name">{{ m.name }}</p>
                  <p class="mvp-pick-role">{{ m.role }} · {{ m.experience }}</p>
                </div>
                <span class="mvp-pick-btn">선택</span>
              </div>
              <p v-if="!nonMvpManagers.length" class="mvp-pick-empty">모든 매니저가 이미 우수사원입니다</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 왜 오토원트인가요 -->
    <section class="feature-section">
      <div class="container">
        <div v-reveal class="section-head" style="text-align: center;">
          <p class="feature-eyebrow">WHY AUTOWANT</p>
          <h2 class="feature-title">왜 <span class="feature-highlight">오토원트</span>인가요?</h2>
          <p class="feature-sub">고객 만족을 위한 오토원트만의 특별한 약속</p>
          <div class="feature-divider"></div>
        </div>
        <div class="carousel-wrap" v-reveal="{ delay: 100 }">
          <div class="carousel-track" :style="{ transform: `translateX(-${featureIdx * 100}%)` }">
            <div v-for="(item, i) in features" :key="i" class="carousel-item">
              <div class="carousel-card">
                <div class="carousel-img" :style="{ background: item.bg }">
                  <!-- 합리적인 가격 -->
                  <svg v-if="i === 0" viewBox="0 0 400 260" fill="none" class="ci-svg">
                    <rect x="80" y="40" width="240" height="160" rx="20" fill="#fff" opacity="0.9"/>
                    <rect x="100" y="60" width="200" height="36" rx="8" fill="#e3ecff"/>
                    <text x="200" y="85" text-anchor="middle" font-size="22" font-weight="800" fill="#4d8ef7">최저가 비교 시스템</text>
                    <rect x="110" y="110" width="76" height="70" rx="10" fill="#fff" stroke="#4d8ef7" stroke-width="1.5"/>
                    <text x="148" y="137" text-anchor="middle" font-size="13" font-weight="700" fill="#999">A 금융사</text>
                    <text x="148" y="162" text-anchor="middle" font-size="18" font-weight="800" fill="#4d8ef7">489,000</text>
                    <rect x="198" y="110" width="76" height="70" rx="10" fill="#4d8ef7"/>
                    <text x="236" y="137" text-anchor="middle" font-size="13" font-weight="700" fill="rgba(255,255,255,0.8)">오토원트</text>
                    <text x="236" y="162" text-anchor="middle" font-size="18" font-weight="900" fill="#fff">398,000</text>
                    <circle cx="274" cy="115" r="14" fill="#ff6b6b"/>
                    <text x="274" y="120" text-anchor="middle" font-size="11" font-weight="800" fill="#fff">BEST</text>
                    <circle cx="340" cy="60" r="20" fill="#fff3e0" opacity="0.7"/>
                    <text x="340" y="66" text-anchor="middle" font-size="18" font-weight="800" fill="#ff9800">₩</text>
                    <circle cx="60" cy="180" r="14" fill="#e8f5e9" opacity="0.7"/>
                    <path d="M54 180l4 4 8-10" stroke="#66bb6a" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  <!-- 투명한 견적 -->
                  <svg v-else-if="i === 1" viewBox="0 0 400 260" fill="none" class="ci-svg">
                    <rect x="90" y="30" width="220" height="200" rx="16" fill="#fff" opacity="0.9"/>
                    <rect x="110" y="50" width="120" height="10" rx="5" fill="#a5d6a7"/>
                    <rect x="110" y="72" width="180" height="6" rx="3" fill="#e8f5e9"/>
                    <rect x="110" y="86" width="160" height="6" rx="3" fill="#e8f5e9"/>
                    <rect x="110" y="100" width="180" height="6" rx="3" fill="#e8f5e9"/>
                    <line x1="110" y1="120" x2="290" y2="120" stroke="#e0e0e0" stroke-width="1"/>
                    <rect x="110" y="130" width="100" height="8" rx="4" fill="#c8e6c9"/>
                    <text x="160" y="138" text-anchor="middle" font-size="7" font-weight="700" fill="#2e7d32">항목별 상세 내역</text>
                    <rect x="110" y="148" width="180" height="5" rx="2.5" fill="#f1f8e9"/>
                    <rect x="110" y="160" width="150" height="5" rx="2.5" fill="#f1f8e9"/>
                    <rect x="110" y="172" width="170" height="5" rx="2.5" fill="#f1f8e9"/>
                    <rect x="110" y="190" width="180" height="24" rx="12" fill="#66bb6a"/>
                    <text x="200" y="206" text-anchor="middle" font-size="12" font-weight="800" fill="#fff">숨겨진 비용 0원</text>
                    <circle cx="340" cy="80" r="24" fill="#e8f5e9"/>
                    <path d="M330 80l7 7 14-16" stroke="#66bb6a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="60" cy="60" r="16" fill="#c8e6c9" opacity="0.5"/>
                  </svg>
                  <!-- 전문 1:1 상담 -->
                  <svg v-else-if="i === 2" viewBox="0 0 400 260" fill="none" class="ci-svg">
                    <circle cx="160" cy="100" r="45" fill="#e3f2fd"/>
                    <circle cx="160" cy="85" r="16" fill="#bbdefb"/>
                    <path d="M136 115c0-14 10-24 24-24s24 10 24 14" stroke="#4d8ef7" stroke-width="2.5" fill="#bbdefb"/>
                    <circle cx="260" cy="110" r="35" fill="#e8eaf6"/>
                    <circle cx="260" cy="97" r="13" fill="#c5cae9"/>
                    <path d="M240 122c0-12 8-20 20-20s20 8 20 12" stroke="#5c6bc0" stroke-width="2" fill="#c5cae9"/>
                    <rect x="185" y="60" width="80" height="36" rx="18" fill="#fff" stroke="#4d8ef7" stroke-width="1.5"/>
                    <circle cx="205" cy="78" r="3" fill="#4d8ef7"/><circle cx="220" cy="78" r="3" fill="#4d8ef7"/><circle cx="235" cy="78" r="3" fill="#4d8ef7"/>
                    <rect x="100" y="160" width="200" height="50" rx="14" fill="#fff" opacity="0.9"/>
                    <rect x="120" y="173" width="80" height="8" rx="4" fill="#e3f2fd"/>
                    <rect x="120" y="186" width="160" height="6" rx="3" fill="#f0f4ff"/>
                    <circle cx="340" cy="50" r="8" fill="#4d8ef7" opacity="0.2"/>
                    <circle cx="60" cy="160" r="6" fill="#4d8ef7" opacity="0.15"/>
                    <circle cx="80" cy="50" r="10" fill="#e3f2fd" opacity="0.6"/>
                  </svg>
                  <!-- 빠른 출고 -->
                  <svg v-else-if="i === 3" viewBox="0 0 400 260" fill="none" class="ci-svg">
                    <rect x="50" y="190" width="300" height="4" rx="2" fill="#f8bbd0"/>
                    <path d="M100 170 Q120 100 200 100 Q280 100 300 170" fill="#fff" stroke="#e91e63" stroke-width="2"/>
                    <rect x="140" y="110" width="120" height="55" rx="12" fill="#fce4ec"/>
                    <rect x="155" y="120" width="90" height="30" rx="6" fill="#fff" opacity="0.8"/>
                    <text x="200" y="140" text-anchor="middle" font-size="14" font-weight="800" fill="#e91e63">즉시출고</text>
                    <circle cx="145" cy="180" r="16" fill="#fff" stroke="#e91e63" stroke-width="2"/>
                    <circle cx="145" cy="180" r="6" fill="#e91e63"/>
                    <circle cx="255" cy="180" r="16" fill="#fff" stroke="#e91e63" stroke-width="2"/>
                    <circle cx="255" cy="180" r="6" fill="#e91e63"/>
                    <path d="M80 155l-25-12" stroke="#f8bbd0" stroke-width="3" stroke-linecap="round"/>
                    <path d="M72 140l-20-6" stroke="#f8bbd0" stroke-width="2" stroke-linecap="round"/>
                    <path d="M75 168l-20-3" stroke="#f8bbd0" stroke-width="2" stroke-linecap="round"/>
                    <rect x="220" y="80" width="60" height="24" rx="12" fill="#e91e63"/>
                    <text x="250" y="96" text-anchor="middle" font-size="12" font-weight="800" fill="#fff">D-DAY</text>
                    <circle cx="350" cy="70" r="12" fill="#fce4ec" opacity="0.6"/>
                    <circle cx="50" cy="80" r="8" fill="#f8bbd0" opacity="0.5"/>
                  </svg>
                </div>
                <div class="carousel-body">
                  <h4>{{ item.title }}</h4>
                  <p>{{ item.desc }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="car-dots">
            <button v-for="(_, i) in features" :key="i" class="car-dot" :class="{ active: featureIdx === i }" @click="featureIdx = i; resetAutoSlide()"></button>
          </div>
        </div>
      </div>
    </section>

    <!-- 차량 검색 -->
    <section class="vehicle-section">
      <div class="container">
        <div v-reveal class="section-head">
          <h2 class="section-title">차량 검색</h2>
          <p class="section-sub">{{ filteredVehicles.length }}대의 차량</p>
        </div>

        <div v-reveal="{ delay: 100 }" class="brand-row-wrap">
          <transition name="brand-switch" mode="out-in">
            <div :key="brandMode" class="brand-row">
              <button v-for="b in visibleBrands" :key="b.name" class="brand-circle" :class="{ active: selectedBrand === b.name }" @click="selectBrand(b)">
                <div class="brand-logo-wrap">
                  <img v-if="b.logo" :src="b.logo" :alt="b.name" />
                  <svg v-else-if="b.icon === 'grid'" viewBox="0 0 24 24" class="brand-svg" fill="currentColor"><rect x="2" y="2" width="4" height="4" rx="1"/><rect x="10" y="2" width="4" height="4" rx="1"/><rect x="18" y="2" width="4" height="4" rx="1"/><rect x="2" y="10" width="4" height="4" rx="1"/><rect x="10" y="10" width="4" height="4" rx="1"/><rect x="18" y="10" width="4" height="4" rx="1"/><rect x="2" y="18" width="4" height="4" rx="1"/><rect x="10" y="18" width="4" height="4" rx="1"/><rect x="18" y="18" width="4" height="4" rx="1"/></svg>
                  <svg v-else-if="b.icon === 'globe'" viewBox="0 0 24 24" class="brand-svg" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z"/></svg>
                  <svg v-else-if="b.icon === 'back'" viewBox="0 0 24 24" class="brand-svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 19l-7-7 7-7"/></svg>
                  <span v-else class="brand-fallback">{{ b.name.charAt(0) }}</span>
                </div>
                <span class="brand-name">{{ b.name }}</span>
              </button>
            </div>
          </transition>
        </div>

        <div class="filter-bar">
          <v-text-field v-model="searchQuery" placeholder="차량명 검색" prepend-inner-icon="mdi-magnify" variant="outlined" density="compact" rounded="lg" hide-details class="filter-input" />
          <v-select v-model="selectedType" :items="vehicleTypes" placeholder="차종" variant="outlined" density="compact" rounded="lg" hide-details clearable class="filter-select" />
          <v-select v-model="selectedFuel" :items="fuelTypes" placeholder="연료" variant="outlined" density="compact" rounded="lg" hide-details clearable class="filter-select" />
          <v-select v-model="sortBy" :items="sortOptions" variant="outlined" density="compact" rounded="lg" hide-details class="filter-select" />
        </div>

        <div class="vehicle-grid">
          <div v-for="(vehicle, i) in filteredVehicles" :key="vehicle.id" v-reveal="{ delay: i * 60 }" class="vehicle-card hvr-float" @click="openVehicle(vehicle)">
            <div class="card-img">
              <img :src="vehicle.image" :alt="vehicle.name" />
              <span v-if="vehicle.isSpecial" class="badge badge-special">특가</span>
              <span v-if="vehicle.isImmediate" class="badge badge-immediate">즉시출고</span>
            </div>
            <div class="card-body">
              <p class="card-sub">{{ vehicle.brand }} · {{ vehicle.year }} · {{ vehicle.fuel }}</p>
              <h3 class="card-name">{{ vehicle.name }}</h3>
              <div class="card-price-area">
                <p class="card-price">{{ fmt(vehicle.price) }}<span class="won">원</span></p>
                <p class="card-monthly">
                  월 <strong>{{ fmt(vehicle.monthlyRent) }}원</strong>
                  <span class="card-months">/ {{ vehicle.rentMonths }}개월</span>
                </p>
                <p v-if="vehicle.deposit" class="card-deposit">보증금 {{ fmt(vehicle.deposit) }}원</p>
                <p v-else class="card-deposit">보증금 없음</p>
              </div>
              <div class="card-btns">
                <button class="card-btn calc" @click.stop="openCalcModal(vehicle)">계산기</button>
                <button class="card-btn compare" :class="{ active: isInCompare(vehicle.id) }" @click.stop="toggleCompare(vehicle)">
                  {{ isInCompare(vehicle.id) ? '비교 중' : '비교' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 고객 후기 -->
    <section class="review-section">
      <div class="container">
        <div class="section-head review-head">
          <div>
            <h2 class="section-title">고객 후기</h2>
            <p class="section-sub">오토원트와 함께한 고객님들의 이야기</p>
          </div>
          <router-link to="/reviews/write" class="write-review-btn">후기 작성하기</router-link>
        </div>
        <div class="review-grid">
          <router-link v-for="(r, i) in reviews" :key="r.id" :to="'/reviews/' + r.id" v-reveal="{ delay: i * 80 }" class="review-card hvr-float">
            <div class="review-img" v-if="r.thumbnail">
              <img :src="r.thumbnail" :alt="r.title" />
            </div>
            <div class="review-body">
              <div class="review-stars">
                <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= r.rating }">★</span>
              </div>
              <h3 class="review-title">{{ r.title }}</h3>
              <p class="review-text">{{ r.blocks?.find(b => b.type === 'text')?.content || '' }}</p>
              <div v-if="r.tags?.length" class="review-tags">
                <span v-for="t in r.tags" :key="t" class="review-tag">{{ t }}</span>
              </div>
              <div class="review-footer">
                <div class="review-avatar">{{ r.name.charAt(0) }}</div>
                <div>
                  <p class="review-name">{{ r.name }}</p>
                  <p class="review-meta">{{ r.vehicle }} · {{ r.date }}</p>
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-section">
      <div class="cta-bg-shapes">
        <div class="cta-shape cta-s1"></div>
        <div class="cta-shape cta-s2"></div>
        <div class="cta-shape cta-s3"></div>
      </div>
      <div v-reveal="{ dir: 'scale' }" class="container cta-inner">
        <div class="cta-text">
          <p class="cta-eyebrow">CONTACT US</p>
          <h2>견적이 궁금하신가요?</h2>
          <p class="cta-desc">전문 매니저가 최적의 조건을 찾아드립니다</p>
          <div class="cta-features">
            <span>무료 상담</span>
            <span>빠른 회신</span>
            <span>맞춤 견적</span>
          </div>
        </div>
        <div class="cta-action">
          <router-link to="/contact" class="cta-btn">견적 상담 →</router-link>
          <a href="tel:0507-1344-7898" class="cta-phone">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
            0507-1344-7898
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted, onUnmounted, reactive } from 'vue'
import { useVehicles } from '../stores/vehicles'
import { useCompare } from '../stores/compare'
import { useReviews } from '../stores/reviews'
import { useManagers } from '../stores/managers'
import { useAuth } from '../stores/auth'

const openInquiryModal = inject('openInquiryModal')
const openCalcModal = inject('openCalcModal')
const { vehicleList, specialList: specialVehicles } = useVehicles()
const { toggleCompare, isInCompare } = useCompare()
const { reviewList: reviews } = useReviews()
const { mvpManagers, managerList, setMVP } = useManagers()
const mvpAddOpen = ref(false)
const nonMvpManagers = computed(() => managerList.value.filter(m => !m.isMVP))

function addMvpManager(id) {
  const m = managerList.value.find(x => x.id === id)
  if (m) m.isMVP = true
  mvpAddOpen.value = false
}
const { isAdmin } = useAuth()

const searchQuery = ref('')
const selectedBrand = ref('전체')
const selectedType = ref(null)
const selectedFuel = ref(null)
const sortBy = ref('최신순')
const brandMode = ref('domestic')

const domesticBrandNames = ['현대', '기아', '제네시스', '쉐보레', 'KGM', '르노']

const domesticBrands = [
  { name: '전체', logo: null, icon: 'grid' },
  { name: '현대', logo: '/images/brand/1.png' },
  { name: '기아', logo: '/images/brand/tab1_2.png' },
  { name: '제네시스', logo: '/images/brand/genesis-logo.png' },
  { name: '쉐보레', logo: '/images/brand/tab1_3.png' },
  { name: 'KGM', logo: '/images/brand/tab1_5.png' },
  { name: '르노', logo: '/images/brand/tab1_4.png' },
  { name: '수입차', logo: null, icon: 'globe' },
]

const importedBrands = [
  { name: '국산차', logo: null, icon: 'back' },
  { name: '전체', logo: null, icon: 'grid' },
  { name: '벤츠', logo: '/images/brand/tab2_1.png' },
  { name: 'BMW', logo: '/images/brand/tab2_2.png' },
  { name: 'MINI', logo: '/images/brand/tab2_3.png' },
  { name: '아우디', logo: '/images/brand/tab2_4.png' },
  { name: '폭스바겐', logo: '/images/brand/tab2_5.png' },
  { name: '포르쉐', logo: '/images/brand/tab2_6.png' },
  { name: '재규어', logo: '/images/brand/tab2_7.png' },
  { name: '랜드로버', logo: '/images/brand/tab2_8.png' },
  { name: '푸조', logo: '/images/brand/tab2_9.png' },
  { name: '시트로엥', logo: '/images/brand/tab2_10.png' },
  { name: '마세라티', logo: '/images/brand/tab2_11.png' },
  { name: '볼보', logo: '/images/brand/tab2_12.png' },
  { name: '렉서스', logo: '/images/brand/tab2_13.png' },
  { name: '토요타', logo: '/images/brand/tab2_14.png' },
  { name: '혼다', logo: '/images/brand/tab2_15.png' },
  { name: '캐딜락', logo: '/images/brand/tab2_16.png' },
  { name: '포드', logo: '/images/brand/tab2_17.png' },
  { name: '링컨', logo: '/images/brand/tab2_18.png' },
  { name: '지프', logo: '/images/brand/tab2_19.png' },
  { name: '테슬라', logo: '/images/brand/tab2_20.png' },
]

const visibleBrands = computed(() => brandMode.value === 'domestic' ? domesticBrands : importedBrands)

function selectBrand(b) {
  if (b.name === '수입차') {
    brandMode.value = 'imported'
    selectedBrand.value = '전체'
    return
  }
  if (b.name === '국산차') {
    brandMode.value = 'domestic'
    selectedBrand.value = '전체'
    return
  }
  selectedBrand.value = b.name
}

const vehicleTypes = ['세단', 'SUV', '경차', 'RV/MPV']
const fuelTypes = ['가솔린', '디젤', '전기', '하이브리드']
const sortOptions = ['최신순', '가격 낮은순', '가격 높은순', '이름순']

const filteredVehicles = computed(() => {
  let list = [...vehicleList.value]
  if (brandMode.value === 'imported') {
    list = list.filter(v => !domesticBrandNames.includes(v.brand))
    if (selectedBrand.value !== '전체') {
      list = list.filter(v => v.brand === selectedBrand.value)
    }
  } else {
    if (selectedBrand.value !== '전체') {
      list = list.filter(v => v.brand === selectedBrand.value)
    }
  }
  if (selectedType.value) list = list.filter(v => v.type === selectedType.value)
  if (selectedFuel.value) list = list.filter(v => v.fuel === selectedFuel.value)
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(v => v.name.toLowerCase().includes(q) || v.brand.toLowerCase().includes(q))
  }
  if (sortBy.value === '가격 낮은순') list.sort((a, b) => a.price - b.price)
  else if (sortBy.value === '가격 높은순') list.sort((a, b) => b.price - a.price)
  else if (sortBy.value === '이름순') list.sort((a, b) => a.name.localeCompare(b.name))
  return list
})

const features = [
  { bg: 'linear-gradient(135deg, #eef4ff, #dbe9ff)', title: '합리적인 가격', desc: '20개 이상 금융사를 비교해 업계 최저가를 보장합니다. 같은 차량, 같은 조건이라면 오토원트가 더 저렴합니다.' },
  { bg: 'linear-gradient(135deg, #e8f5e9, #d0ecd2)', title: '투명한 견적', desc: '숨겨진 비용 없이 정직하고 명확한 가격을 제시합니다. 견적서 하나하나 꼼꼼히 설명해드립니다.' },
  { bg: 'linear-gradient(135deg, #e3f2fd, #c5e1fb)', title: '전문 1:1 상담', desc: '경험 풍부한 매니저가 고객 맞춤형 상담을 제공합니다. 궁금한 점 무엇이든 편하게 물어보세요.' },
  { bg: 'linear-gradient(135deg, #fce4ec, #f9d0dc)', title: '빠른 출고', desc: '즉시출고 차량을 상시 보유하여 빠르게 인도합니다. 급하게 차가 필요할 때도 걱정 없습니다.' },
]

const featureIdx = ref(0)
let autoSlideTimer = null

function resetAutoSlide() {
  clearInterval(autoSlideTimer)
  autoSlideTimer = setInterval(() => {
    featureIdx.value = (featureIdx.value + 1) % features.length
  }, 4000)
}

onMounted(() => {
  autoSlideTimer = setInterval(() => {
    featureIdx.value = (featureIdx.value + 1) % features.length
  }, 4000)
})
onUnmounted(() => { clearInterval(autoSlideTimer) })

// 별자리 파티클
const particleCanvas = ref(null)
let particleAnim = null

function initParticles() {
  const canvas = particleCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const section = canvas.parentElement
  let w, h, particles
  const mouse = { x: -9999, y: -9999 }
  const mouseRadius = 150

  function resize() {
    w = section.offsetWidth
    h = section.offsetHeight
    canvas.width = w
    canvas.height = h
  }

  function createParticles() {
    const count = Math.floor((w * h) / 12000)
    particles = []
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: 1.2 + Math.random() * 1.5,
      })
    }
  }

  section.addEventListener('mousemove', (e) => {
    const rect = section.getBoundingClientRect()
    mouse.x = e.clientX - rect.left
    mouse.y = e.clientY - rect.top
  })
  section.addEventListener('mouseleave', () => {
    mouse.x = -9999
    mouse.y = -9999
  })

  function draw() {
    ctx.clearRect(0, 0, w, h)
    const maxDist = 120

    // 마우스 글로우
    if (mouse.x > 0 && mouse.y > 0) {
      const grd = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, mouseRadius)
      grd.addColorStop(0, 'rgba(77,142,247,0.06)')
      grd.addColorStop(1, 'transparent')
      ctx.fillStyle = grd
      ctx.fillRect(mouse.x - mouseRadius, mouse.y - mouseRadius, mouseRadius * 2, mouseRadius * 2)
    }

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]

      // 마우스 인터랙션: 가까우면 끌려옴
      const mdx = mouse.x - p.x
      const mdy = mouse.y - p.y
      const mDist = Math.sqrt(mdx * mdx + mdy * mdy)
      if (mDist < mouseRadius && mDist > 0) {
        const force = (mouseRadius - mDist) / mouseRadius * 0.02
        p.vx += mdx * force
        p.vy += mdy * force
      }

      // 속도 감쇠
      p.vx *= 0.99
      p.vy *= 0.99

      p.x += p.vx
      p.y += p.vy
      if (p.x < 0) p.x = w
      if (p.x > w) p.x = 0
      if (p.y < 0) p.y = h
      if (p.y > h) p.y = 0

      // 마우스 근처 별 더 밝게
      const brightness = mDist < mouseRadius ? 0.7 + 0.3 * (1 - mDist / mouseRadius) : 0.7
      const size = mDist < mouseRadius ? p.r + 1.5 * (1 - mDist / mouseRadius) : p.r

      ctx.beginPath()
      ctx.arc(p.x, p.y, size, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255,255,255,${brightness})`
      ctx.fill()

      // 마우스와 별 연결
      if (mDist < mouseRadius) {
        ctx.beginPath()
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(mouse.x, mouse.y)
        ctx.strokeStyle = `rgba(77,142,247,${0.2 * (1 - mDist / mouseRadius)})`
        ctx.lineWidth = 0.8
        ctx.stroke()
      }

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j]
        const dx = p.x - q.x
        const dy = p.y - q.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < maxDist) {
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(q.x, q.y)
          ctx.strokeStyle = `rgba(255,255,255,${0.15 * (1 - dist / maxDist)})`
          ctx.lineWidth = 0.6
          ctx.stroke()
        }
      }
    }
    particleAnim = requestAnimationFrame(draw)
  }

  resize()
  createParticles()
  draw()
  window.addEventListener('resize', () => { resize(); createParticles() })
}

const currentMonth = computed(() => new Date().getMonth() + 1)

function fmt(p) { return p.toLocaleString('ko-KR') }
function openVehicle(vehicle) { openInquiryModal(vehicle) }

// 이달의 특가 카운트다운
const countdown = reactive({ days: '00', hours: '00', minutes: '00', seconds: '00' })
let cdTimer = null

const editingEventDate = ref(false)
const eventDateInput = ref('')

function getEventEndDate() {
  const saved = localStorage.getItem('autowant_event_end')
  if (saved) return new Date(saved)
  return new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59)
}

function saveEventDate() {
  if (!eventDateInput.value) return
  localStorage.setItem('autowant_event_end', new Date(eventDateInput.value).toISOString())
  editingEventDate.value = false
  updateCountdown()
}

function updateCountdown() {
  const now = new Date()
  const endDate = getEventEndDate()
  const diff = endDate - now
  if (diff <= 0) {
    countdown.days = '00'; countdown.hours = '00'; countdown.minutes = '00'; countdown.seconds = '00'
    return
  }
  const d = Math.floor(diff / 86400000)
  const h = Math.floor((diff % 86400000) / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  countdown.days = String(d).padStart(2, '0')
  countdown.hours = String(h).padStart(2, '0')
  countdown.minutes = String(m).padStart(2, '0')
  countdown.seconds = String(s).padStart(2, '0')
}

onMounted(() => {
  updateCountdown()
  cdTimer = setInterval(updateCountdown, 1000)
  initParticles()
})
onUnmounted(() => {
  clearInterval(cdTimer)
  cancelAnimationFrame(particleAnim)
})
</script>

<style scoped>
.container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
.section-head { margin-bottom: 24px; }
.section-title { font-size: 1.4rem; font-weight: 800; color: #2d2d2d; letter-spacing: -0.5px; }
.section-sub { font-size: 13px; color: #999; margin-top: 2px; }
.vehicle-section { padding: 36px 0 24px; }
.brand-row-wrap { margin-bottom: 20px; overflow: hidden; }
.brand-row { display: flex; gap: 12px; overflow-x: auto; padding: 8px 4px 12px; scrollbar-width: none; }
.brand-row::-webkit-scrollbar { display: none; }
.brand-circle { display: flex; flex-direction: column; align-items: center; gap: 6px; background: none; border: none; cursor: pointer; flex-shrink: 0; }
.brand-logo-wrap {
  width: 64px; height: 64px; border-radius: 50%; background: white;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07); border: 2px solid transparent;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.25s ease; overflow: hidden;
}
.brand-circle:hover .brand-logo-wrap { transform: translateY(-3px); box-shadow: 0 6px 20px rgba(0,0,0,0.1); }
.brand-circle.active .brand-logo-wrap { border-color: #2979ff; box-shadow: 0 4px 16px rgba(41,121,255,0.2); }
.brand-logo-wrap img { width: 38px; height: 38px; object-fit: contain; }
.brand-svg { width: 24px; height: 24px; color: #888; }
.brand-circle.active .brand-svg { color: #2979ff; }
.brand-fallback { font-size: 16px; font-weight: 800; color: #888; }
.brand-circle.active .brand-fallback { color: #2979ff; }
.brand-name { font-size: 11px; font-weight: 600; color: #888; white-space: nowrap; transition: color 0.2s; }
.brand-circle:hover .brand-name { color: #555; }
.brand-circle.active .brand-name { color: #2979ff; }
/* brand switch transition */
.brand-switch-enter-active { animation: brandIn 0.3s ease; }
.brand-switch-leave-active { animation: brandOut 0.2s ease; }
@keyframes brandIn { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
@keyframes brandOut { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(-30px); } }
@media (max-width: 768px) {
  .brand-logo-wrap { width: 52px; height: 52px; }
  .brand-logo-wrap img { width: 30px; height: 30px; }
  .brand-row { gap: 8px; }
}
.filter-bar { display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap; }
.filter-input { max-width: 280px; }
.filter-select { max-width: 140px; }
@media (max-width: 768px) { .filter-input, .filter-select { max-width: 100%; flex: 1 1 calc(50% - 4px); } }
.vehicle-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
@media (max-width: 1024px) { .vehicle-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 768px) { .vehicle-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; } }
.vehicle-card { background: white; border: 1px solid #f0f0f0; border-radius: 12px; overflow: hidden; cursor: pointer; transition: box-shadow 0.2s, transform 0.2s; }
.vehicle-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.06); transform: translateY(-2px); }
.card-img { position: relative; background: #f5f5f5; aspect-ratio: 16/10; overflow: hidden; display: flex; align-items: center; justify-content: center; }
.card-img img { width: 90%; height: auto; object-fit: contain; mix-blend-mode: multiply; transition: transform 0.3s; }
.vehicle-card:hover .card-img img { transform: scale(1.05); }
.badge { position: absolute; top: 8px; left: 8px; font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 4px; }
.badge-special { background: linear-gradient(135deg, #ff6b6b, #ee5a24); color: white; }
.badge-immediate { background: white; color: #111; border: 1px solid #e5e5e5; left: auto; right: 8px; }
.card-body { padding: 12px; }
.card-sub { font-size: 11px; color: #aaa; margin: 0 0 2px; }
.card-name { font-size: 14px; font-weight: 700; color: #111; margin: 0 0 8px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.card-price-area { border-top: 1px solid #f5f5f5; padding-top: 8px; }
.card-price { font-size: 15px; font-weight: 800; color: #111; margin: 0; }
.won { font-size: 11px; font-weight: 500; color: #888; }
.card-monthly { font-size: 12px; color: #555; margin: 4px 0 0; }
.card-monthly strong { color: #111; }
.special-card .card-monthly strong { color: #e53935; }
.card-months { font-size: 11px; color: #aaa; }
.card-deposit { font-size: 11px; color: #bbb; margin: 2px 0 0; }
.card-btns { display: flex; gap: 6px; margin-top: 10px; }
.card-btn {
  flex: 1; padding: 7px 0; border-radius: 6px; font-size: 11.5px; font-weight: 600;
  cursor: pointer; transition: all 0.15s; text-align: center;
}
.card-btn.calc { background: #f5f5f5; color: #555; border: none; transition: all 0.2s; }
.card-btn.calc:hover { background: #eee; color: #111; transform: scale(1.04); }
.card-btn.compare { background: white; color: #888; border: 1px solid #e5e5e5; transition: all 0.2s; }
.card-btn.compare:hover { border-color: #111; color: #111; transform: scale(1.04); }
.card-btn.compare.active { background: #4d8ef7; color: white; border-color: #4d8ef7; }
.special-section {
  padding: 48px 0; position: relative; overflow: hidden;
  background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460, #1a1a2e);
  background-size: 400% 400%;
  animation: gradientShift 12s ease infinite;
}
@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  25% { background-position: 100% 0%; }
  50% { background-position: 100% 100%; }
  75% { background-position: 0% 100%; }
  100% { background-position: 0% 50%; }
}
.special-bg-deco {
  position: absolute; inset: 0; z-index: 0;
  background:
    radial-gradient(ellipse at 20% 50%, rgba(255,107,107,0.15) 0%, transparent 60%),
    radial-gradient(ellipse at 80% 30%, rgba(77,142,247,0.18) 0%, transparent 50%),
    radial-gradient(ellipse at 60% 80%, rgba(255,193,7,0.1) 0%, transparent 50%);
  animation: decoShift 8s ease-in-out infinite alternate;
}
@keyframes decoShift {
  0% { opacity: 0.7; transform: scale(1) translate(0, 0); }
  100% { opacity: 1; transform: scale(1.1) translate(20px, -10px); }
}

/* 관리자 이벤트 날짜 수정 */
.event-date-edit { margin-top: 8px; text-align: right; }
.event-edit-btn {
  padding: 4px 12px; background: rgba(255,255,255,0.15); color: rgba(255,255,255,0.7);
  border: 1px solid rgba(255,255,255,0.2); border-radius: 4px;
  font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.15s;
}
.event-edit-btn:hover { background: rgba(255,255,255,0.25); color: white; }
.event-date-form { display: flex; gap: 6px; align-items: center; }
.event-date-input {
  padding: 5px 8px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.3);
  background: rgba(255,255,255,0.1); color: white; font-size: 12px;
  font-family: inherit; outline: none;
}
.event-date-input::-webkit-calendar-picker-indicator { filter: invert(1); }
.event-save-btn {
  padding: 5px 12px; background: #4d8ef7; color: white; border: none;
  border-radius: 4px; font-size: 11px; font-weight: 700; cursor: pointer;
}
.event-save-btn:hover { background: #3a7be0; }
.event-cancel-btn {
  padding: 5px 10px; background: none; color: rgba(255,255,255,0.6);
  border: 1px solid rgba(255,255,255,0.2); border-radius: 4px;
  font-size: 11px; font-weight: 600; cursor: pointer;
}
.event-cancel-btn:hover { color: white; }

/* 파티클 캔버스 */
.particle-canvas { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
.special-banner {
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 16px; margin-bottom: 28px;
}
.special-banner-left {}
.special-event-tag {
  display: inline-block; padding: 4px 14px;
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white; font-size: 11px; font-weight: 800;
  border-radius: 100px; letter-spacing: 1.5px; margin-bottom: 10px;
}
.special-title {
  font-size: 1.8rem; font-weight: 900; color: white; margin: 0 0 6px;
  letter-spacing: -0.5px;
}
.special-desc { font-size: 14px; color: rgba(255,255,255,0.6); margin: 0; }
.countdown-wrap { text-align: right; }
.countdown-label { font-size: 11px; font-weight: 700; color: #ff6b6b; margin: 0 0 8px; letter-spacing: 0.5px; }
.countdown { display: flex; align-items: center; gap: 6px; }
.cd-block {
  display: flex; flex-direction: column; align-items: center;
  background: rgba(255,255,255,0.1); backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.15); border-radius: 4px;
  padding: 8px 12px; min-width: 52px;
}
.cd-num { font-size: 22px; font-weight: 900; color: white; line-height: 1.2; font-variant-numeric: tabular-nums; }
.cd-unit { font-size: 9px; font-weight: 600; color: rgba(255,255,255,0.5); margin-top: 2px; }
.cd-sep { font-size: 18px; font-weight: 700; color: rgba(255,255,255,0.3); }

/* 이달의 우수사원 */
.mvp-section { padding: 48px 0; }
.mvp-crown { width: 44px; height: auto; margin-bottom: 10px; filter: drop-shadow(0 3px 8px rgba(255,143,0,0.35)); }
.mvp-grid { display: flex; gap: 16px; overflow-x: auto; padding-bottom: 8px; scrollbar-width: thin; }
.mvp-grid::-webkit-scrollbar { height: 4px; }
.mvp-grid::-webkit-scrollbar-thumb { background: #ddd; border-radius: 4px; }
.mvp-card {
  display: flex; flex-direction: column; align-items: center; text-align: center;
  min-width: 220px; flex: 1;
  background: white; border: 1px solid #f0f0f0; border-radius: 16px;
  padding: 28px 20px; box-shadow: 0 4px 24px rgba(0,0,0,0.04);
  transition: transform 0.2s, box-shadow 0.2s;
  min-height: 380px;
}
.mvp-card:hover { transform: translateY(-4px); box-shadow: 0 8px 28px rgba(0,0,0,0.08); }
.mvp-photo { position: relative; margin-bottom: 16px; }
.mvp-photo img {
  width: 100px; height: 100px; border-radius: 50%; object-fit: cover;
  border: 3px solid #f0f0f0;
}
.mvp-placeholder {
  width: 100px; height: 100px; border-radius: 50%;
  background: linear-gradient(135deg, #222, #444);
  display: flex; align-items: center; justify-content: center;
  border: 3px solid #f0f0f0;
}
.mvp-placeholder span { font-size: 32px; font-weight: 800; color: white; }
.mvp-badge-wrap { position: absolute; bottom: 0; right: 0; }
.mvp-badge {
  display: inline-block; padding: 3px 10px;
  background: linear-gradient(135deg, #ffd700, #ffb300);
  color: #111; font-size: 10px; font-weight: 800;
  border-radius: 100px; box-shadow: 0 2px 8px rgba(255,179,0,0.3);
  letter-spacing: 1px;
}
.mvp-info { flex: 1; display: flex; flex-direction: column; align-items: center; width: 100%; }
.mvp-name { font-size: 1.1rem; font-weight: 800; color: #111; margin: 0 0 2px; }
.mvp-role { font-size: 12px; color: #999; margin: 0 0 10px; }
.mvp-intro {
  font-size: 13px; color: #555; line-height: 1.6; margin: 0 0 auto;
  word-break: keep-all; display: -webkit-box; -webkit-line-clamp: 3;
  -webkit-box-orient: vertical; overflow: hidden;
  padding-bottom: 12px;
}
.mvp-tags { display: flex; gap: 4px; flex-wrap: wrap; justify-content: center; margin-bottom: 14px; }
.mvp-tags span {
  font-size: 10px; font-weight: 600; padding: 3px 10px;
  background: #f5f5f5; border-radius: 100px; color: #888;
}
.mvp-btn {
  padding: 8px 24px; background: linear-gradient(135deg, #4d8ef7, #6c5ce7); color: white; border: none;
  border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer;
  transition: all 0.2s;
}
.mvp-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(77,142,247,0.3); }

/* 관리자: 삭제 버튼 */
.mvp-remove {
  position: absolute; top: 10px; right: 10px; z-index: 2;
  width: 28px; height: 28px; border-radius: 50%;
  background: rgba(0,0,0,0.5); color: white; border: none;
  font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center;
  opacity: 0; transition: opacity 0.2s;
}
.mvp-card:hover .mvp-remove { opacity: 1; }
.mvp-remove:hover { background: #e53935; }
.mvp-card { position: relative; }

/* 관리자: 추가 카드 */
.mvp-add-card {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  border: 2px dashed #d0d9f0; background: rgba(240,244,255,0.5);
  cursor: pointer; transition: all 0.2s; min-height: 200px;
}
.mvp-add-card:hover { border-color: #4d8ef7; background: rgba(240,244,255,0.8); transform: translateY(-4px); }
.mvp-add-icon { font-size: 36px; font-weight: 300; color: #4d8ef7; line-height: 1; }
.mvp-add-text { font-size: 13px; font-weight: 600; color: #4d8ef7; margin-top: 8px; }

/* 관리자: 추가 모달 */
.mvp-modal-overlay {
  position: fixed; inset: 0; z-index: 2100;
  background: rgba(0,0,0,0.4); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
}
.mvp-modal {
  width: 400px; max-width: 90vw; max-height: 70vh;
  background: white; border-radius: 16px; overflow: hidden;
  box-shadow: 0 16px 48px rgba(0,0,0,0.15);
}
.mvp-modal-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 22px; border-bottom: 1px solid #f0f0f0;
}
.mvp-modal-head h3 { font-size: 16px; font-weight: 800; color: #2d2d2d; margin: 0; }
.mvp-modal-head button { background: none; border: none; font-size: 22px; color: #ccc; cursor: pointer; }
.mvp-modal-head button:hover { color: #2d2d2d; }
.mvp-modal-body { padding: 16px 22px 22px; overflow-y: auto; max-height: 50vh; }
.mvp-modal-sub { font-size: 13px; color: #999; margin: 0 0 14px; }
.mvp-pick-row {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 14px; border-radius: 10px; cursor: pointer;
  transition: background 0.15s;
}
.mvp-pick-row:hover { background: #f5f7ff; }
.mvp-pick-avatar {
  width: 40px; height: 40px; border-radius: 50%;
  background: linear-gradient(135deg, #222, #444); color: white;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; font-weight: 800; flex-shrink: 0;
}
.mvp-pick-info { flex: 1; }
.mvp-pick-name { font-size: 14px; font-weight: 700; color: #2d2d2d; margin: 0; }
.mvp-pick-role { font-size: 12px; color: #999; margin: 2px 0 0; }
.mvp-pick-btn {
  padding: 5px 14px; background: linear-gradient(135deg, #4d8ef7, #6c5ce7);
  color: white; border-radius: 6px; font-size: 12px; font-weight: 700;
}
.mvp-pick-empty { text-align: center; color: #ccc; padding: 20px 0; font-size: 13px; }
@media (max-width: 768px) {
  .mvp-grid { gap: 12px; }
  .mvp-card { min-width: 180px; padding: 20px 16px; }
  .mvp-photo img, .mvp-placeholder { width: 80px; height: 80px; }
  .mvp-placeholder span { font-size: 28px; }
}
.special-scroll { display: flex; gap: 16px; overflow-x: auto; padding-bottom: 8px; scrollbar-width: thin; }
.special-scroll::-webkit-scrollbar { height: 4px; }
.special-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }
.special-card {
  min-width: 250px; max-width: 250px; flex-shrink: 0;
  background: rgba(255,255,255,0.95); backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.2); border-radius: 14px;
  overflow: hidden; cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}
.special-card:hover { transform: translateY(-6px); box-shadow: 0 12px 32px rgba(0,0,0,0.2); }
.special-card-cta {
  padding: 10px; text-align: center;
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white; font-size: 13px; font-weight: 700;
  transition: all 0.2s;
}
.special-card:hover .special-card-cta { letter-spacing: 2px; }
.price-original { font-size: 11px; color: #bbb; text-decoration: line-through; margin: 0; }
.price-discount { font-size: 16px; font-weight: 800; color: #2d2d2d; margin: 0; }
@media (max-width: 600px) {
  .special-banner { flex-direction: column; align-items: flex-start; }
  .countdown-wrap { text-align: left; }
  .special-title { font-size: 1.4rem; }
  .cd-block { min-width: 44px; padding: 6px 10px; }
  .cd-num { font-size: 18px; }
}
.feature-section { padding: 64px 0; background: #fff; }
.feature-eyebrow {
  font-size: 12px; font-weight: 700; letter-spacing: 3px;
  color: #4d8ef7; margin: 0 0 12px; text-transform: uppercase;
}
.feature-title { font-size: 2rem; font-weight: 900; color: #1a1a1a; margin: 0 0 10px; letter-spacing: -0.5px; }
.feature-highlight { color: #4d8ef7; }
.feature-sub { font-size: 15px; color: #aaa; margin: 0 0 12px; font-weight: 400; }
.feature-divider { width: 40px; height: 3px; background: linear-gradient(90deg, #4d8ef7, #6c5ce7); border-radius: 2px; margin: 0 auto 36px; }

/* 캐러셀 */
.carousel-wrap { position: relative; overflow: hidden; border-radius: 20px; }
.carousel-track {
  display: flex; transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.carousel-item { min-width: 100%; flex-shrink: 0; padding: 0 4px; }
.carousel-card {
  display: flex; gap: 0; background: white; border-radius: 20px;
  overflow: hidden; border: 1px solid #eef2ff;
  box-shadow: 0 4px 24px rgba(77,142,247,0.06);
}
.carousel-img {
  width: 55%; min-height: 280px;
  display: flex; align-items: center; justify-content: center;
  position: relative; overflow: hidden; flex-shrink: 0;
}
.ci-svg { width: 90%; height: auto; max-width: 360px; }
.carousel-body {
  flex: 1; padding: 40px 36px;
  display: flex; flex-direction: column; justify-content: center;
}
.carousel-body h4 { font-size: 1.4rem; font-weight: 900; color: #2d2d2d; margin: 0 0 14px; }
.carousel-body p { font-size: 15px; color: #777; line-height: 1.8; margin: 0; }

/* 도트 인디케이터 */
.car-dots { display: flex; justify-content: center; gap: 6px; margin-top: 24px; }
.car-dot {
  width: 6px; height: 6px; border-radius: 3px;
  border: none; background: #d0d9f0; cursor: pointer;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1); padding: 0;
}
.car-dot.active { background: #4d8ef7; width: 24px; }

@media (max-width: 768px) {
  .carousel-card { flex-direction: column; }
  .carousel-img { width: 100%; min-height: 200px; }
  .carousel-body { padding: 24px 20px; }
  .carousel-body h4 { font-size: 1.1rem; }
  .carousel-body p { font-size: 13px; }
}
/* 고객 후기 */
.review-section { padding: 48px 0; background: linear-gradient(180deg, #f0f4ff, #f5f7ff); }
.review-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
@media (max-width: 1024px) { .review-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) { .review-grid { grid-template-columns: 1fr; } }
.review-head { display: flex; align-items: flex-end; justify-content: space-between; }
.write-review-btn {
  padding: 8px 18px; background: linear-gradient(135deg, #4d8ef7, #6c5ce7); color: white; border-radius: 6px;
  font-size: 12px; font-weight: 700; text-decoration: none; transition: all 0.2s; flex-shrink: 0;
}
.write-review-btn:hover { box-shadow: 0 4px 12px rgba(77,142,247,0.3); transform: translateY(-1px); }
.review-card { background: white; border: 1px solid #f0f0f0; border-radius: 12px; overflow: hidden; transition: box-shadow 0.2s, transform 0.2s; text-decoration: none; color: inherit; display: block; }
.review-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.06); transform: translateY(-2px); }
.review-img { aspect-ratio: 16/9; overflow: hidden; }
.review-img img { width: 100%; height: 100%; object-fit: cover; }
.review-body { padding: 16px; }
.review-stars { margin-bottom: 8px; }
.star { font-size: 13px; color: #ddd; }
.star.filled { color: #ffc107; }
.review-title { font-size: 15px; font-weight: 700; color: #111; margin: 0 0 8px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.review-text { font-size: 13px; color: #777; line-height: 1.6; margin: 0 0 12px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.review-tags { display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 14px; }
.review-tag { font-size: 10px; font-weight: 600; padding: 3px 8px; background: #f5f5f5; border-radius: 4px; color: #888; }
.review-footer { display: flex; align-items: center; gap: 8px; padding-top: 12px; border-top: 1px solid #f5f5f5; }
.review-avatar {
  width: 32px; height: 32px; border-radius: 50%; background: #111; color: white;
  display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0;
}
.review-name { font-size: 12px; font-weight: 700; color: #111; margin: 0; }
.review-meta { font-size: 10px; color: #bbb; margin: 1px 0 0; }

.cta-section {
  padding: 100px 0; position: relative; overflow: hidden;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%);
}
.cta-bg-shapes { position: absolute; inset: 0; pointer-events: none; }
.cta-shape {
  position: absolute; border-radius: 50%; opacity: 0.08;
  background: white;
}
.cta-s1 { width: 300px; height: 300px; top: -100px; right: -80px; }
.cta-s2 { width: 200px; height: 200px; bottom: -60px; left: -40px; }
.cta-s3 { width: 120px; height: 120px; top: 20px; left: 30%; background: #4d8ef7; opacity: 0.1; }
.cta-inner {
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 28px; position: relative; z-index: 1;
}
.cta-text {}
.cta-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 2px; color: #4d8ef7; margin: 0 0 8px; }
.cta-inner h2 { font-size: 1.6rem; font-weight: 900; color: white; margin: 0 0 6px; }
.cta-desc { font-size: 14px; color: rgba(255,255,255,0.5); margin: 0 0 16px; }
.cta-features { display: flex; gap: 8px; }
.cta-features span {
  padding: 4px 12px; border-radius: 100px;
  background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.6); font-size: 11px; font-weight: 600;
}
.cta-action { display: flex; flex-direction: column; align-items: center; gap: 12px; }
.cta-btn {
  display: inline-block; padding: 14px 36px;
  background: linear-gradient(135deg, #4d8ef7, #6c5ce7); color: white;
  font-size: 15px; font-weight: 700; text-decoration: none; border-radius: 10px;
  transition: all 0.25s; box-shadow: 0 4px 16px rgba(77,142,247,0.3);
}
.cta-btn:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(77,142,247,0.4); }
.cta-phone {
  display: flex; align-items: center; gap: 6px;
  color: rgba(255,255,255,0.5); font-size: 13px; font-weight: 600;
  text-decoration: none; transition: color 0.15s;
}
.cta-phone:hover { color: white; }
@media (max-width: 600px) {
  .cta-inner { flex-direction: column; text-align: center; }
  .cta-features { justify-content: center; }
  .cta-action { width: 100%; }
  .cta-btn { width: 100%; text-align: center; }
}
</style>
