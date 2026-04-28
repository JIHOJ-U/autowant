<template>
  <div class="home">
    <!-- 이달의 특가 -->
    <section class="special-section">
      <div class="special-bg-deco"></div>
      <canvas ref="particleCanvas" class="particle-canvas"></canvas>
      <div class="container" style="position: relative; z-index: 1;">
        <div v-reveal class="special-banner">
          <div class="special-banner-left">
            <span class="special-event-tag">
              <svg class="tag-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
              LIMITED EVENT
            </span>
            <h2 class="special-title">{{ currentMonth }}월 특가 이벤트</h2>
            <p class="special-desc">이달에만 만나볼 수 있는 파격 할인! 지금 바로 상담받으세요</p>
          </div>
          <div class="countdown-wrap">
            <p class="countdown-label">
              <svg class="cd-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              이벤트 종료까지
              <span class="cd-pulse"></span>
            </p>
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
              <p class="card-monthly-row">
                <span class="monthly-label">월 렌트료</span>
                <span class="monthly-prices">
                  <span class="monthly-original">{{ fmt(Math.round(v.monthlyRent / (1 - (v.discount || 0) / 100))) }}원</span>
                  <strong class="monthly-discount">{{ fmt(v.monthlyRent) }}원</strong>
                </span>
              </p>
              <p class="card-meta-row">{{ v.rentMonths }}개월{{ v.deposit ? ' · 보증금 ' + fmt(v.deposit) + '원' : ' · 보증금 없음' }}</p>
            </div>
            <div class="special-card-cta">지금 상담받기</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 상담 신청 현황 -->
    <section class="inquiry-status-section">
      <div class="container">
        <div v-reveal class="inq-header">
          <h3 class="inq-title">상담신청 현황 <span class="inq-live">LIVE</span></h3>
        </div>
        <div class="inq-table-wrap">
          <div class="inq-table-head">
            <span class="inq-th inq-th-name">고객명</span>
            <span class="inq-th inq-th-vehicle">상담 차량</span>
            <span class="inq-th inq-th-status">상태</span>
            <span class="inq-th inq-th-date">날짜</span>
          </div>
          <div class="inq-table-body" ref="inqScrollRef">
            <div class="inq-scroll-track">
              <div v-for="(item, i) in scrollInquiries" :key="'a'+i" class="inq-tr">
                <span class="inq-td inq-td-name">
                  <span class="inq-avatar">{{ item.name.charAt(0) }}</span>
                  {{ maskName(item.name) }}
                </span>
                <span class="inq-td inq-td-vehicle">{{ item.vehicle || item.source || '차량 상담' }}</span>
                <span class="inq-td inq-td-status"><span class="inq-tag">신청</span></span>
                <span class="inq-td inq-td-date">{{ item.date }}</span>
              </div>
            </div>
          </div>
        </div>
        <p v-if="!scrollInquiries.length" class="inq-empty-msg">아직 상담 신청이 없습니다</p>
      </div>
    </section>

    <!-- 이달의 우수사원 -->
    <section v-if="mvpManagers.length || isAdmin" class="mvp-section">
      <div class="mvp-bg-deco"></div>
      <canvas ref="mvpCanvas" class="mvp-canvas"></canvas>
      <div class="container" style="position:relative;z-index:1;">
        <div v-reveal class="section-head mvp-head" style="text-align: center;">
          <div class="mvp-header-stack">
            <img src="/images/usu.png" alt="Best Employee of the Month" class="mvp-cert" />
            <div class="mvp-title-row">
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
              <svg class="mvp-crown mvp-crown-right" viewBox="0 0 64 52" fill="none">
                <path d="M8 40L14 18l10 9 8-19 8 19 10-9 6 22H8z" fill="url(#cg1)"/>
                <path d="M8 40L14 18l10 9 8-19 8 19 10-9 6 22H8z" fill="url(#cg2)" opacity="0.4"/>
                <rect x="6" y="38" width="52" height="8" rx="3" fill="url(#cg1)"/>
                <circle cx="20" cy="42" r="2" fill="#fff" opacity="0.5"/>
                <circle cx="32" cy="42" r="2.5" fill="#fff" opacity="0.6"/>
                <circle cx="44" cy="42" r="2" fill="#fff" opacity="0.5"/>
                <circle cx="14" cy="18" r="2.5" fill="#fff" opacity="0.4"/>
                <circle cx="32" cy="8" r="3" fill="#fff" opacity="0.5"/>
                <circle cx="50" cy="18" r="2.5" fill="#fff" opacity="0.4"/>
              </svg>
            </div>
            <div class="mvp-divider">
              <span class="mvp-divider-line"></span>
              <span class="mvp-divider-dot"></span>
              <span class="mvp-divider-line"></span>
            </div>
            <p class="section-sub">최고의 서비스를 제공한 매니저를 소개합니다</p>
          </div>
        </div>
        <div class="mvp-grid">
          <div v-for="(m, i) in mvpManagers" :key="m.id" v-reveal="{ delay: i * 150 }" class="mvp-card" @mousemove="tiltCard($event)" @mouseleave="resetTilt($event)">
            <!-- 월계수 왕관 뱃지 -->
            <div class="mvp-ribbon-badge" v-html="crownSvg(i)"></div>
            <!-- 관리자: 해제 버튼 -->
            <button v-if="isAdmin" class="mvp-remove" @click="setMVP(m.id)" title="우수사원 해제">✕</button>
            <div class="mvp-photo">
              <img v-if="m.image" :src="m.image" :alt="m.name" />
              <div v-else class="mvp-placeholder"><span>{{ m.name.charAt(0) }}</span></div>
              <div class="mvp-badge-wrap">
                <span class="mvp-badge">MVP</span>
              </div>
              <!-- 관리자: 사진 변경 -->
              <label v-if="isAdmin" class="mvp-photo-edit">
                사진 변경
                <input type="file" accept="image/*" hidden @change="e => changeMvpPhoto(e, m)" />
              </label>
            </div>
            <div class="mvp-info">
              <!-- 관리자: 수정 모드 -->
              <template v-if="isAdmin && mvpEditId === m.id">
                <input v-model="mvpEditForm.name" class="mvp-edit-input" placeholder="이름" />
                <input v-model="mvpEditForm.role" class="mvp-edit-input sm" placeholder="직책" />
                <textarea v-model="mvpEditForm.intro" class="mvp-edit-textarea" rows="2" placeholder="소개"></textarea>
                <input v-model="mvpEditTagInput" class="mvp-edit-input sm" placeholder="태그 (쉼표 구분)" />
                <div class="mvp-edit-actions">
                  <button class="mvp-edit-save" @click="saveMvpEdit(m)">저장</button>
                  <button class="mvp-edit-cancel" @click="mvpEditId = null">취소</button>
                </div>
              </template>
              <!-- 보기 모드 -->
              <template v-else>
                <h3 class="mvp-name">{{ m.name }}</h3>
                <p class="mvp-role">{{ m.role }}</p>
                <p class="mvp-intro">{{ m.intro }}</p>
                <div class="mvp-tags">
                  <span v-for="t in m.tags" :key="t">{{ t }}</span>
                </div>
                <div class="mvp-actions">
                  <button class="mvp-btn" @click="openVehicle(m)">상담받기 ›</button>
                  <button v-if="isAdmin" class="mvp-edit-btn" @click="startMvpEdit(m)">수정</button>
                </div>
              </template>
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
                <div class="carousel-img">
                  <img :src="item.img" :alt="item.title" />
                </div>
                <div class="carousel-body">
                  <span class="carousel-num">{{ String(i + 1).padStart(2, '0') }}</span>
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
        <div v-reveal class="vs-head">
          <p class="vs-eyebrow">VEHICLE SEARCH</p>
          <h2 class="vs-title">차량 검색</h2>
          <p class="vs-count">총 <strong>{{ filteredVehicles.length }}</strong>대의 차량</p>
        </div>

        <!-- 브랜드 필터 -->
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

        <!-- 필터 바 -->
        <div class="filter-bar">
          <div class="filter-bar-inner">
            <v-text-field v-model="searchQuery" placeholder="차량명, 브랜드 검색" prepend-inner-icon="mdi-magnify" variant="outlined" density="compact" rounded="lg" hide-details class="filter-input" />
            <div class="filter-divider"></div>
            <v-select v-model="selectedType" :items="vehicleTypes" placeholder="차종" variant="outlined" density="compact" rounded="lg" hide-details clearable class="filter-select" />
            <v-select v-model="selectedFuel" :items="fuelTypes" placeholder="연료" variant="outlined" density="compact" rounded="lg" hide-details clearable class="filter-select" />
            <v-select v-model="sortBy" :items="sortOptions" variant="outlined" density="compact" rounded="lg" hide-details class="filter-select" />
          </div>
        </div>

        <!-- 차량 그리드 -->
        <div class="vehicle-grid">
          <div v-for="(vehicle, i) in filteredVehicles" :key="vehicle.id" v-reveal="{ delay: i * 60 }" class="vehicle-card" @click="openVehicle(vehicle)">
            <div class="card-img">
              <img :src="vehicle.image" :alt="vehicle.name" />
              <span v-if="vehicle.isSpecial" class="badge badge-special">특가</span>
              <span v-if="vehicle.isImmediate" class="badge badge-immediate">즉시출고</span>
            </div>
            <div class="card-body">
              <div class="card-tag-row">
                <span class="card-tag-rent">장기렌트</span>
                <img v-if="getBrandLogo(vehicle.brand)" :src="getBrandLogo(vehicle.brand)" :alt="vehicle.brand" class="card-brand-logo" />
              </div>
              <h3 class="card-name">{{ vehicle.name }}</h3>
              <p class="card-sub">{{ vehicle.year }}년형 · {{ vehicle.fuel }}{{ vehicle.type ? ' · ' + vehicle.type : '' }}</p>
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
      <div class="review-bg"></div>
      <div class="review-overlay"></div>
      <div class="container review-container">
        <div v-reveal class="review-hero">
          <p class="review-eyebrow">REAL STORIES</p>
          <h2 class="review-headline">진심을 담은 상담,<br/>오토원트가 증명합니다</h2>
          <div class="review-hero-actions">
            <router-link to="/reviews" class="review-list-btn">전체 후기 보기 →</router-link>
            <router-link to="/reviews/write" class="review-write-btn">후기 작성하기 →</router-link>
          </div>
        </div>

        <div v-if="filteredReviews.length" class="review-carousel" @mouseenter="stopReviewAuto" @mouseleave="startReviewAuto">
          <button class="review-arrow prev" @click="prevReview" aria-label="이전">‹</button>
          <div class="review-stage">
            <router-link
              v-for="r in visibleReviews"
              :key="r.id + '_' + r._slot"
              :to="'/reviews/' + r.id"
              class="review-slide"
              :class="['slot-' + (r._slot === 0 ? 'center' : r._slot === -1 ? 'left' : 'right')]"
            >
              <div class="review-card-img" v-if="r.thumbnail">
                <img :src="r.thumbnail" :alt="r.title" />
              </div>
              <div class="review-card-body">
                <div class="review-card-head">
                  <div>
                    <h3 class="review-card-title">{{ r.title }}</h3>
                    <p class="review-card-meta">{{ (r.region || '') }}{{ r.region && r.vehicle ? ' | ' : '' }}{{ r.vehicle }}</p>
                  </div>
                  <span class="review-card-tag">장기렌트</span>
                </div>
                <div class="review-card-rating">
                  <div class="stars-row">
                    <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= r.rating }">★</span>
                  </div>
                  <span class="review-card-date">{{ r.date }}</span>
                </div>
                <p class="review-card-text">{{ r.blocks?.find(b => b.type === 'text')?.content || '' }}</p>
              </div>
            </router-link>
          </div>
          <button class="review-arrow next" @click="nextReview" aria-label="다음">›</button>
        </div>
      </div>
    </section>

    <!-- 카운터 통계 -->
    <section class="counter-section">
      <div class="counter-bg">
        <img src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80" alt="" />
        <div class="counter-overlay"></div>
      </div>
      <div class="container counter-inner">
        <div v-reveal class="counter-box">
          <p class="counter-label">TODAY</p>
          <p class="counter-number" ref="counterEl1">0</p>
          <p class="counter-desc">오토원트에서 오늘 상담을 받으신<br>고객님 수 입니다.</p>
        </div>
        <div class="counter-divider"></div>
        <div v-reveal="{ delay: 150 }" class="counter-box counter-box-main">
          <p class="counter-label">TOTAL</p>
          <p class="counter-number" ref="counterEl2">0</p>
          <p class="counter-desc">현재까지 오토원트를 이용해주신<br>고객님 수 입니다.</p>
        </div>
        <div class="counter-divider"></div>
        <div v-reveal="{ delay: 300 }" class="counter-box">
          <p class="counter-label">DEAL</p>
          <p class="counter-number" ref="counterEl3">0</p>
          <p class="counter-desc">오토원트를 이용해주신 소중한<br>고객님들의 거래 성사건 수 입니다.</p>
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
import { inquiries } from '../stores/inquiries'

const openInquiryModal = inject('openInquiryModal')

const crownCache = {}
function crownSvg(i) {
  if (crownCache[i]) return crownCache[i]
  const s = `c${i}`
  const svg = `<svg viewBox="0 0 120 130" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- 월계수 왼쪽 -->
    <g fill="url(#gd-${s})">
      <ellipse cx="22" cy="50" rx="6" ry="12" transform="rotate(-20 22 50)"/>
      <ellipse cx="18" cy="62" rx="5.5" ry="11" transform="rotate(-8 18 62)"/>
      <ellipse cx="17" cy="75" rx="5" ry="10" transform="rotate(5 17 75)"/>
      <ellipse cx="19" cy="87" rx="5" ry="9.5" transform="rotate(15 19 87)"/>
      <ellipse cx="24" cy="97" rx="4.5" ry="9" transform="rotate(28 24 97)"/>
      <ellipse cx="28" cy="40" rx="5.5" ry="11" transform="rotate(-32 28 40)"/>
      <ellipse cx="35" cy="32" rx="5" ry="10" transform="rotate(-42 35 32)"/>
    </g>
    <!-- 월계수 오른쪽 -->
    <g fill="url(#gd-${s})" transform="translate(120,0) scale(-1,1)">
      <ellipse cx="22" cy="50" rx="6" ry="12" transform="rotate(-20 22 50)"/>
      <ellipse cx="18" cy="62" rx="5.5" ry="11" transform="rotate(-8 18 62)"/>
      <ellipse cx="17" cy="75" rx="5" ry="10" transform="rotate(5 17 75)"/>
      <ellipse cx="19" cy="87" rx="5" ry="9.5" transform="rotate(15 19 87)"/>
      <ellipse cx="24" cy="97" rx="4.5" ry="9" transform="rotate(28 24 97)"/>
      <ellipse cx="28" cy="40" rx="5.5" ry="11" transform="rotate(-32 28 40)"/>
      <ellipse cx="35" cy="32" rx="5" ry="10" transform="rotate(-42 35 32)"/>
    </g>
    <!-- 하단 리본 묶음 -->
    <path d="M52 112 Q56 108 60 112 Q64 108 68 112" stroke="url(#gd-${s})" stroke-width="2.5" fill="none" stroke-linecap="round"/>

    <!-- 왕관 -->
    <g transform="translate(38, 22)">
      <path d="M0 32 L6 10 L14 22 L22 0 L30 22 L38 10 L44 32Z" fill="url(#cr-${s})"/>
      <rect x="0" y="32" width="44" height="6" rx="1.5" fill="url(#cr-${s})"/>
      <!-- 왕관 보석 -->
      <circle cx="22" cy="14" r="3" fill="url(#gm-${s})"/>
      <circle cx="10" cy="22" r="2" fill="url(#gm-${s})" opacity="0.8"/>
      <circle cx="34" cy="22" r="2" fill="url(#gm-${s})" opacity="0.8"/>
      <!-- 왕관 하이라이트 -->
      <path d="M4 30 L8 14 L14 22 L22 6 L30 22 L36 14 L40 30" fill="url(#ch-${s})" opacity="0.2"/>
    </g>

    <defs>
      <linearGradient id="gd-${s}" x1="0" y1="0" x2="120" y2="130"><stop stop-color="#f7e27a"/><stop offset="0.2" stop-color="#daa520"/><stop offset="0.4" stop-color="#f5d442"/><stop offset="0.6" stop-color="#c8941a"/><stop offset="0.8" stop-color="#eab308"/><stop offset="1" stop-color="#daa520"/></linearGradient>
      <linearGradient id="cr-${s}" x1="0" y1="0" x2="44" y2="38"><stop stop-color="#fef3c7"/><stop offset="0.2" stop-color="#f7e27a"/><stop offset="0.5" stop-color="#daa520"/><stop offset="0.8" stop-color="#c8941a"/><stop offset="1" stop-color="#f5d442"/></linearGradient>
      <radialGradient id="gm-${s}" cx="0.4" cy="0.35"><stop stop-color="#fff"/><stop offset="0.3" stop-color="#fde68a"/><stop offset="1" stop-color="#b8860b"/></radialGradient>
      <linearGradient id="ch-${s}" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#fffde0"/><stop offset="1" stop-color="#daa520" stop-opacity="0"/></linearGradient>
    </defs>
  </svg>`
  crownCache[i] = svg
  return svg
}

// 카운터
const counterEl1 = ref(null)
const counterEl2 = ref(null)
const counterEl3 = ref(null)
let counterObserver = null

function animateCount(el, target, duration = 2000) {
  const start = performance.now()
  const fmt = (n) => n.toLocaleString()
  function tick(now) {
    const p = Math.min((now - start) / duration, 1)
    const ease = 1 - Math.pow(1 - p, 3)
    el.textContent = fmt(Math.round(target * ease))
    if (p < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

function initCounters(overrides = {}) {
  const now = new Date()
  const base = new Date('2025-01-01')
  const days = Math.floor((now - base) / 86400000)
  const seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate()
  const seeded = (n) => ((seed * 9301 + 49297 + n * 1301) % 233280) / 233280

  const todayVal = overrides.today ?? Math.floor(45 + seeded(1) * 30)
  const totalVal = 3662 + days * Math.floor(3 + seeded(2) * 5)
  const dealVal = 2386 + days * Math.floor(2 + seeded(3) * 4)

  const targets = [
    { el: counterEl1.value, val: todayVal },
    { el: counterEl2.value, val: totalVal },
    { el: counterEl3.value, val: dealVal },
  ]
  counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const t = targets.find(t => t.el === e.target)
        if (t) animateCount(t.el, t.val)
        counterObserver.unobserve(e.target)
      }
    })
  }, { threshold: 0.5 })
  targets.forEach(t => { if (t.el) counterObserver.observe(t.el) })
}
const openCalcModal = inject('openCalcModal')
const { vehicleList, specialList: specialVehicles } = useVehicles()
const { toggleCompare, isInCompare } = useCompare()
const { reviewList: reviews } = useReviews()

// 후기 캐러셀
const filteredReviews = computed(() => reviews.value)
const reviewIdx = ref(0)
const visibleReviews = computed(() => {
  const list = filteredReviews.value
  if (!list?.length) return []
  const len = list.length
  const result = []
  for (let i = -1; i <= 1; i++) {
    const idx = ((reviewIdx.value + i) % len + len) % len
    result.push({ ...list[idx], _slot: i })
  }
  return result
})
let reviewAutoTimer = null
function startReviewAuto() {
  stopReviewAuto()
  reviewAutoTimer = setInterval(() => {
    if (!reviews.value?.length) return
    reviewIdx.value = (reviewIdx.value + 1) % reviews.value.length
  }, 4500)
}
function stopReviewAuto() {
  if (reviewAutoTimer) { clearInterval(reviewAutoTimer); reviewAutoTimer = null }
}
function prevReview() {
  if (!reviews.value?.length) return
  reviewIdx.value = (reviewIdx.value - 1 + reviews.value.length) % reviews.value.length
  startReviewAuto()
}
function nextReview() {
  if (!reviews.value?.length) return
  reviewIdx.value = (reviewIdx.value + 1) % reviews.value.length
  startReviewAuto()
}
const { mvpManagers, managerList, setMVP, updateManager } = useManagers()
const mvpAddOpen = ref(false)
const nonMvpManagers = computed(() => managerList.value.filter(m => !m.isMVP))

function addMvpManager(id) {
  const m = managerList.value.find(x => x.id === id)
  if (m) m.isMVP = true
  mvpAddOpen.value = false
}

// 관리자: MVP 수정
const mvpEditId = ref(null)
const mvpEditForm = ref({})
const mvpEditTagInput = ref('')

function startMvpEdit(m) {
  mvpEditId.value = m.id
  mvpEditForm.value = { name: m.name, role: m.role, intro: m.intro }
  mvpEditTagInput.value = (m.tags || []).join(', ')
}

function saveMvpEdit(m) {
  m.name = mvpEditForm.value.name
  m.role = mvpEditForm.value.role
  m.intro = mvpEditForm.value.intro
  m.tags = mvpEditTagInput.value ? mvpEditTagInput.value.split(',').map(t => t.trim()).filter(Boolean) : []
  updateManager(m)
  mvpEditId.value = null
}

function tiltCard(e) {
  const card = e.currentTarget
  const rect = card.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const cx = rect.width / 2
  const cy = rect.height / 2
  const rotateX = ((y - cy) / cy) * -8
  const rotateY = ((x - cx) / cx) * 8
  card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`
}

function resetTilt(e) {
  e.currentTarget.style.transform = ''
}

function changeMvpPhoto(e, m) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => { m.image = reader.result; updateManager(m) }
  reader.readAsDataURL(file)
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

// 브랜드명 → 로고 매핑
const brandLogoMap = computed(() => {
  const map = {}
  ;[...domesticBrands, ...importedBrands].forEach(b => {
    if (b.logo) map[b.name] = b.logo
  })
  return map
})
function getBrandLogo(name) {
  return brandLogoMap.value[name] || null
}

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
  // 합리적인 가격 - 동전 + 계산기 (가격 비교)
  { img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80', title: '합리적인 가격', desc: '20개 이상 금융사를 비교해 업계 최저가를 보장합니다. 같은 차량, 같은 조건이라면 오토원트가 더 저렴합니다.' },
  // 투명한 견적 - 서류/계약서
  { img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80', title: '투명한 견적', desc: '숨겨진 비용 없이 정직하고 명확한 가격을 제시합니다. 견적서 하나하나 꼼꼼히 설명해드립니다.' },
  // 전문 1:1 상담 - 비즈니스 미팅 (프로페셔널 아시안 여성)
  { img: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80', title: '전문 1:1 상담', desc: '경험 풍부한 매니저가 고객 맞춤형 상담을 제공합니다. 궁금한 점 무엇이든 편하게 물어보세요.' },
  // 빠른 출고 - 키 핸드오버
  { img: 'https://images.unsplash.com/photo-1486006920555-c77dcf18193c?w=800&q=80', title: '빠른 출고', desc: '즉시출고 차량을 상시 보유하여 빠르게 인도합니다. 급하게 차가 필요할 때도 걱정 없습니다.' },
]



// 우수사원 골드 파티클
const mvpCanvas = ref(null)
let mvpAnim = null
let mvpVisible = false
let mvpObserver = null

function initMvpParticles() {
  const canvas = mvpCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const section = canvas.parentElement
  let w, h, sparkles

  function resize() {
    w = section.offsetWidth; h = section.offsetHeight
    canvas.width = w; canvas.height = h
  }
  function create() {
    sparkles = []
    const count = Math.min(40, Math.floor((w * h) / 18000))
    for (let i = 0; i < count; i++) {
      sparkles.push({
        x: Math.random() * w, y: Math.random() * h,
        size: 0.5 + Math.random() * 2,
        speed: 0.2 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        drift: (Math.random() - 0.5) * 0.3,
      })
    }
  }

  function drawStar(cx, cy, size, alpha) {
    ctx.save()
    ctx.translate(cx, cy)
    ctx.beginPath()
    ctx.moveTo(0, -size)
    ctx.lineTo(size * 0.3, -size * 0.3)
    ctx.lineTo(size, 0)
    ctx.lineTo(size * 0.3, size * 0.3)
    ctx.lineTo(0, size)
    ctx.lineTo(-size * 0.3, size * 0.3)
    ctx.lineTo(-size, 0)
    ctx.lineTo(-size * 0.3, -size * 0.3)
    ctx.closePath()
    ctx.fillStyle = `rgba(255,215,0,${alpha})`
    ctx.fill()
    ctx.restore()
  }

  function draw() {
    if (!mvpVisible) { mvpAnim = null; return }
    ctx.clearRect(0, 0, w, h)
    for (const s of sparkles) {
      s.phase += 0.015 * s.speed
      s.y -= s.speed * 0.15
      s.x += s.drift
      if (s.y < -10) { s.y = h + 10; s.x = Math.random() * w }
      if (s.x < 0) s.x = w; if (s.x > w) s.x = 0
      const alpha = 0.08 + 0.25 * Math.abs(Math.sin(s.phase))
      drawStar(s.x, s.y, s.size, alpha)
    }
    mvpAnim = requestAnimationFrame(draw)
  }
  resize(); create()
  window.addEventListener('resize', () => { resize(); create() })

  // 화면에 보일 때만 애니메이션 실행
  mvpObserver = new IntersectionObserver((entries) => {
    mvpVisible = entries[0].isIntersecting
    if (mvpVisible && !mvpAnim) draw()
  }, { threshold: 0.05 })
  mvpObserver.observe(section)
}

// 캐러셀
const featureIdx = ref(0)
let autoSlideTimer = null

function resetAutoSlide() {
  clearInterval(autoSlideTimer)
  autoSlideTimer = setInterval(() => {
    featureIdx.value = (featureIdx.value + 1) % features.length
  }, 5000)
}

// 별자리 파티클
const particleCanvas = ref(null)
let particleAnim = null
let particleVisible = false
let particleObserver = null

function initParticles() {
  const canvas = particleCanvas.value
  if (!canvas) return
  // 모바일에서는 비활성화 (성능)
  if (window.innerWidth < 768) return
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
    const count = Math.min(50, Math.floor((w * h) / 22000))
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
    if (!particleVisible) { particleAnim = null; return }
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
  window.addEventListener('resize', () => { resize(); createParticles() })

  particleObserver = new IntersectionObserver((entries) => {
    particleVisible = entries[0].isIntersecting
    if (particleVisible && !particleAnim) draw()
  }, { threshold: 0.05 })
  particleObserver.observe(section)
}

const currentMonth = computed(() => new Date().getMonth() + 1)

// 상담 현황
const fakeInquiries = ref([])
function inqTimestamp(inq) {
  if (inq.createdAt) return inq.createdAt
  const date = inq.date || '2025-01-01'
  const time = inq.time || '00:00'
  const ts = Date.parse(`${date}T${time}:00+09:00`)
  return isNaN(ts) ? 0 : ts
}
const scrollInquiries = computed(() => {
  const merged = [...(inquiries.value || []), ...(fakeInquiries.value || [])]
  return merged
    .sort((a, b) => inqTimestamp(b) - inqTimestamp(a))
    .slice(0, 10)
})
const inqScrollRef = ref(null)
let inqScrollTimer = null

function startInqScroll() {
  if (!inqScrollRef.value) return
  inqScrollTimer = setInterval(() => {
    const el = inqScrollRef.value
    if (!el) return
    el.scrollTop += 1
    if (el.scrollTop >= el.scrollHeight - el.clientHeight) {
      el.scrollTop = 0
    }
  }, 40)
}

function maskName(name) {
  if (!name) return '**'
  if (name.length <= 1) return name + '*'
  return name.charAt(0) + '*'.repeat(name.length - 1)
}

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

async function fetchVisitCount() {
  const API = import.meta.env.VITE_API_URL || ''
  // 개발 모드(localhost)거나 관리자 로그인 상태에서는 카운트를 올리지 않고 현재값만 조회
  const skipIncrement = import.meta.env.DEV || isAdmin.value
  const method = skipIncrement ? 'GET' : 'POST'
  try {
    const res = await fetch(`${API}/api/visits`, { method })
    if (res.ok) return await res.json()
  } catch {}
  return null
}

onMounted(async () => {
  updateCountdown()
  cdTimer = setInterval(updateCountdown, 1000)
  initParticles()
  initMvpParticles()
  resetAutoSlide()
  setTimeout(startInqScroll, 1000)
  startReviewAuto()
  const visits = await fetchVisitCount()
  if (visits?.fakes) fakeInquiries.value = visits.fakes
  initCounters(visits ? { today: visits.today } : {})
})
onUnmounted(() => {
  if (counterObserver) counterObserver.disconnect()
  clearInterval(cdTimer)
  clearInterval(autoSlideTimer)
  clearInterval(inqScrollTimer)
  stopReviewAuto()
  cancelAnimationFrame(mvpAnim)
  cancelAnimationFrame(particleAnim)
  if (mvpObserver) mvpObserver.disconnect()
  if (particleObserver) particleObserver.disconnect()
})
</script>

<style scoped>
.container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
.section-head { margin-bottom: 24px; }
.section-title { font-size: 1.4rem; font-weight: 800; color: #2d2d2d; letter-spacing: -0.5px; }
.section-sub { font-size: 13px; color: #999; margin-top: 2px; }
/* 차량 검색 섹션 */
.vehicle-section {
  padding: 80px 0 60px;
  background: linear-gradient(180deg, #f8f9fb 0%, #eef1f6 100%);
  position: relative;
}
.vs-head { text-align: center; margin-bottom: 40px; }
.vs-eyebrow {
  font-size: 11px; font-weight: 700; letter-spacing: 4px;
  color: #8b95a1; margin: 0 0 10px; text-transform: uppercase;
}
.vs-title {
  font-size: 2rem; font-weight: 900; color: #191f28;
  margin: 0 0 8px; letter-spacing: -0.5px;
}
.vs-count {
  font-size: 14px; color: #8b95a1; margin: 0; font-weight: 500;
}
.vs-count strong { color: #3182f6; font-weight: 800; }

/* 브랜드 필터 */
.brand-row-wrap { margin-bottom: 28px; }
.brand-row {
  display: flex; gap: 14px; flex-wrap: wrap;
  padding: 8px 4px 12px; justify-content: center;
}
.brand-row::-webkit-scrollbar { display: none; }
.brand-circle {
  display: flex; flex-direction: column; align-items: center;
  gap: 6px; background: none; border: none; cursor: pointer; flex-shrink: 0;
}
.brand-logo-wrap {
  width: 68px; height: 68px; border-radius: 16px; background: white;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  border: 2px solid transparent;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.25s ease; overflow: hidden;
}
.brand-circle:hover .brand-logo-wrap {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}
.brand-circle.active .brand-logo-wrap {
  border-color: #3182f6;
  background: #f0f6ff;
  box-shadow: 0 4px 16px rgba(49,130,246,0.2);
}
.brand-logo-wrap img { width: 38px; height: 38px; object-fit: contain; }
.brand-svg { width: 24px; height: 24px; color: #8b95a1; }
.brand-circle.active .brand-svg { color: #3182f6; }
.brand-fallback { font-size: 16px; font-weight: 800; color: #8b95a1; }
.brand-circle.active .brand-fallback { color: #3182f6; }
.brand-name { font-size: 11px; font-weight: 600; color: #8b95a1; white-space: nowrap; transition: color 0.2s; }
.brand-circle:hover .brand-name { color: #4e5968; }
.brand-circle.active .brand-name { color: #3182f6; font-weight: 700; }
.brand-switch-enter-active { animation: brandIn 0.3s ease; }
.brand-switch-leave-active { animation: brandOut 0.2s ease; }
@keyframes brandIn { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
@keyframes brandOut { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(-30px); } }
@media (max-width: 768px) {
  .brand-logo-wrap { width: 56px; height: 56px; border-radius: 14px; }
  .brand-logo-wrap img { width: 30px; height: 30px; }
  .brand-row { gap: 8px; }
}

/* 필터 바 */
.filter-bar {
  margin-bottom: 28px;
}
.filter-bar-inner {
  display: flex; gap: 10px; align-items: center; flex-wrap: wrap;
  background: white;
  padding: 12px 16px;
  border-radius: 14px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.06);
}
.filter-divider {
  width: 1px; height: 28px; background: #e5e8eb;
  flex-shrink: 0;
}
.filter-input { max-width: 300px; flex: 1; }
.filter-select { max-width: 150px; flex-shrink: 0; }
@media (max-width: 768px) {
  .filter-bar-inner { flex-direction: column; gap: 8px; }
  .filter-divider { display: none; }
  .filter-input, .filter-select { max-width: 100%; width: 100%; }
}

/* 차량 그리드 */
.vehicle-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
@media (max-width: 1024px) { .vehicle-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 768px) { .vehicle-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; } }

/* 차량 카드 */
.vehicle-card {
  background: white; border: none; border-radius: 16px;
  overflow: hidden; cursor: pointer;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
}
.vehicle-card:hover {
  box-shadow: 0 12px 36px rgba(0,0,0,0.12);
  transform: translateY(-4px);
}
.card-img { position: relative; background: #f5f5f5; aspect-ratio: 16/10; overflow: hidden; display: flex; align-items: center; justify-content: center; }
.card-img img { width: 90%; height: auto; object-fit: contain; mix-blend-mode: multiply; transition: transform 0.3s; }
.vehicle-card:hover .card-img img { transform: scale(1.05); }
.badge { position: absolute; top: 8px; left: 8px; font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 4px; }
.badge-special { background: linear-gradient(135deg, #ff6b6b, #ee5a24); color: white; }
.badge-immediate { background: white; color: #111; border: 1px solid #e5e5e5; left: auto; right: 8px; }
.card-body { padding: 12px; }
.card-sub { font-size: 11px; color: #aaa; margin: 0 0 2px; }
.card-name { font-size: 15px; font-weight: 800; color: #111; margin: 0 0 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; letter-spacing: -0.3px; }
.card-tag-row {
  display: flex; align-items: center; justify-content: space-between;
  gap: 8px; margin-bottom: 8px;
}
.card-tag-rent {
  flex-shrink: 0;
  display: inline-block; padding: 5px 11px;
  background: linear-gradient(135deg, #3182f6, #2563eb); color: #fff;
  font-size: 11px; font-weight: 700; border-radius: 6px;
  letter-spacing: -0.2px;
  box-shadow: 0 2px 6px rgba(49,130,246,0.25);
}
.card-brand-logo {
  flex-shrink: 0;
  width: 32px; height: 32px; object-fit: contain;
  opacity: 0.9;
}
.card-price-area { border-top: 1px solid #f5f5f5; padding-top: 8px; }
.card-price { font-size: 15px; font-weight: 800; color: #111; margin: 0; }
.won { font-size: 11px; font-weight: 500; color: #888; }
.card-monthly { font-size: 12px; color: #555; margin: 4px 0 0; }
.card-monthly strong { color: #111; }
.special-card .card-monthly strong { color: #e53935; }
.card-monthly-row {
  display: flex; align-items: center; justify-content: space-between;
  gap: 10px; margin: 8px 0 6px;
}
.monthly-label { font-size: 12px; color: #8b95a1; font-weight: 600; }
.monthly-prices { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; }
.monthly-original {
  font-size: 11px; color: #c1c8d1; text-decoration: line-through;
  font-weight: 500; line-height: 1;
}
.monthly-discount {
  font-size: 17px; font-weight: 800; color: #e53935;
  letter-spacing: -0.3px; line-height: 1.1;
}
.card-meta-row {
  display: flex; align-items: center; gap: 6px;
  font-size: 11px; color: #8b95a1; margin: 6px 0 0; font-weight: 500;
}
.card-months { font-size: 11px; color: #aaa; }
.card-deposit { font-size: 11px; color: #bbb; margin: 2px 0 0; }
.card-btns { display: flex; gap: 6px; margin-top: 10px; }
.card-btn {
  flex: 1; padding: 7px 0; border-radius: 6px; font-size: 11.5px; font-weight: 600;
  cursor: pointer; transition: all 0.15s; text-align: center;
}
.card-btn.calc { background: #eef4ff; color: #4d8ef7; border: none; transition: all 0.2s; }
.card-btn.calc:hover { background: #dde9ff; color: #3a6fd8; transform: scale(1.04); }
.card-btn.compare { background: white; color: #666; border: 1px solid #ddd; transition: all 0.2s; }
.card-btn.compare:hover { border-color: #4d8ef7; color: #4d8ef7; transform: scale(1.04); }
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
  display: inline-flex; align-items: center; gap: 5px;
  padding: 5px 14px 5px 11px;
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white; font-size: 11px; font-weight: 800;
  border-radius: 100px; letter-spacing: 1.5px; margin-bottom: 10px;
  box-shadow: 0 4px 14px rgba(238,90,36,0.35);
}
.tag-icon {
  width: 12px; height: 12px;
  fill: #ffd54f; stroke: #ffd54f;
  filter: drop-shadow(0 0 4px rgba(255,213,79,0.6));
  animation: tagBolt 2s ease-in-out infinite;
}
@keyframes tagBolt {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}
.special-title {
  font-size: 1.8rem; font-weight: 900; color: white; margin: 0 0 6px;
  letter-spacing: -0.5px;
}
.special-desc { font-size: 14px; color: rgba(255,255,255,0.6); margin: 0; }
.countdown-wrap { text-align: right; }
.countdown-label {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 11px; font-weight: 700; color: #ff6b6b;
  margin: 0 0 10px; letter-spacing: 0.5px;
  justify-content: flex-end; width: 100%;
}
.cd-icon {
  width: 14px; height: 14px;
  color: #ff6b6b;
  animation: clockTick 2s linear infinite;
  transform-origin: center;
}
@keyframes clockTick {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(6deg); }
  75% { transform: rotate(-6deg); }
}
.cd-pulse {
  width: 6px; height: 6px; border-radius: 50%;
  background: #ff6b6b;
  box-shadow: 0 0 0 0 rgba(255,107,107,0.6);
  animation: cdDotPulse 1.6s ease-out infinite;
}
@keyframes cdDotPulse {
  0% { box-shadow: 0 0 0 0 rgba(255,107,107,0.55); }
  70% { box-shadow: 0 0 0 7px rgba(255,107,107,0); }
  100% { box-shadow: 0 0 0 0 rgba(255,107,107,0); }
}
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
/* 상담 신청 현황 */
.inquiry-status-section { padding: 56px 0 40px; background: #fafbfd; }
.inq-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
.inq-title {
  font-size: 17px; font-weight: 800; color: #191f28; margin: 0;
  display: flex; align-items: center; gap: 10px;
  letter-spacing: -0.4px;
}
.inq-live {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 10px; font-weight: 800; color: #e11d48;
  background: #fef2f4; border: 1px solid #fce7eb;
  padding: 4px 10px 4px 8px; border-radius: 100px; letter-spacing: 0.6px;
}
.inq-live::before {
  content: ''; width: 6px; height: 6px; border-radius: 50%;
  background: #e11d48;
  box-shadow: 0 0 0 0 rgba(225,29,72,0.6);
  animation: livePulse 1.6s ease-out infinite;
}
@keyframes livePulse {
  0% { box-shadow: 0 0 0 0 rgba(225,29,72,0.5); }
  70% { box-shadow: 0 0 0 6px rgba(225,29,72,0); }
  100% { box-shadow: 0 0 0 0 rgba(225,29,72,0); }
}
.inq-total { font-size: 12px; color: #8b95a1; margin: 0; }

.inq-table-wrap {
  background: #ffffff; border-radius: 16px; overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02), 0 8px 24px rgba(15,23,42,0.04);
  border: 1px solid #eef0f3;
}
.inq-table-head {
  display: flex; padding: 14px 24px;
  background: #fafbfd;
  border-bottom: 1px solid #eef0f3;
}
.inq-th {
  font-size: 11px; font-weight: 700; color: #8b95a1;
  letter-spacing: 0.4px; text-align: center;
  text-transform: uppercase;
}
.inq-th-name { flex: 2; }
.inq-th-vehicle { flex: 3; }
.inq-th-status { flex: 1; }
.inq-th-date { flex: 1.5; }

.inq-table-body { max-height: 260px; overflow: hidden; }
.inq-scroll-track { }

.inq-tr {
  display: flex; align-items: center; padding: 16px 24px;
  border-bottom: 1px solid #f5f6f8; transition: background 0.2s ease;
}
.inq-tr:last-child { border-bottom: none; }
.inq-tr:hover { background: #fafbfd; }
.inq-td { font-size: 13px; color: #4e5968; text-align: center; }
.inq-td-name {
  flex: 2; display: flex; align-items: center; justify-content: center;
  gap: 10px; font-weight: 700; color: #191f28;
}
.inq-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  color: #2563eb;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 800; flex-shrink: 0;
  border: 1px solid #e5edff;
}
.inq-td-vehicle { flex: 3; color: #4e5968; text-align: center; font-weight: 500; }
.inq-td-status { flex: 1; display: flex; align-items: center; justify-content: center; }
.inq-tag {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 11px; font-weight: 700; color: #2563eb;
  background: #eff6ff;
  padding: 5px 12px; border-radius: 6px;
  border: 1px solid #dbeafe;
}
.inq-tag::before {
  content: ''; width: 5px; height: 5px; border-radius: 50%;
  background: #3b82f6;
}
.inq-td-date {
  flex: 1.5; text-align: center; font-size: 12px;
  color: #8b95a1; white-space: nowrap; font-weight: 500;
  font-variant-numeric: tabular-nums;
}
@media (max-width: 768px) {
  .inq-table-head, .inq-tr { padding: 10px 12px; }
  .inq-th-name, .inq-td-name { flex: 1.5; }
  .inq-th-vehicle, .inq-td-vehicle { flex: 2; font-size: 12px; }
  .inq-th-status, .inq-td-status { flex: 0.8; }
  .inq-th-date, .inq-td-date { flex: 1.8; font-size: 11px; }
  .inq-avatar { width: 24px; height: 24px; font-size: 10px; }
  .inq-td { font-size: 12px; }
}
.inq-empty-msg { text-align: center; color: #ccc; padding: 24px 0; font-size: 13px; }

.mvp-section {
  padding: 80px 0; position: relative; overflow: hidden;
  background: linear-gradient(180deg, #f8faff 0%, #eef2ff 50%, #fef3f8 100%);
}
.mvp-bg-deco {
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse 600px 400px at 15% 20%, rgba(99,102,241,0.08), transparent 60%),
    radial-gradient(ellipse 500px 400px at 85% 30%, rgba(236,72,153,0.06), transparent 60%),
    radial-gradient(ellipse 700px 500px at 50% 100%, rgba(49,130,246,0.07), transparent 60%);
}
.mvp-bg-deco::before { display: none; }
.mvp-bg-deco::after { display: none; }
.mvp-canvas { position: absolute; inset: 0; z-index: 0; pointer-events: none; opacity: 0.4; }
.mvp-section .section-title { color: #191f28; text-shadow: none; font-weight: 800; letter-spacing: -0.6px; }
.mvp-section .section-sub { color: #6b7684; font-weight: 500; }
.mvp-crown {
  width: 38px; height: auto;
  filter: drop-shadow(0 3px 8px rgba(200,160,50,0.35));
  animation: crownFloat 4s ease-in-out infinite;
}
@keyframes crownFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

/* 이달의 우수사원 헤더 스택 */
.mvp-head { position: relative; padding-top: 4px; margin-bottom: 36px; }
.mvp-header-stack {
  display: inline-flex; flex-direction: column; align-items: center;
  position: relative;
}

/* 인증서 이미지 - 흰색 액자 테두리 잘라내기 */
.mvp-cert {
  width: 360px; height: auto;
  clip-path: inset(5.5% 5% 5.5% 5%);
  margin-top: -16px;
  margin-bottom: -10px;
  filter: drop-shadow(0 8px 20px rgba(180,140,40,0.18));
  pointer-events: none;
  user-select: none;
  animation: certFloat 6s ease-in-out infinite;
}
@keyframes certFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

/* 타이틀 + 크라운 가로 배치 */
.mvp-title-row {
  display: flex; align-items: center; justify-content: center;
  gap: 14px; position: relative; z-index: 2;
}
.mvp-section .mvp-title-row .section-title {
  margin: 0;
}

/* 골드 디바이더 */
.mvp-divider {
  display: flex; align-items: center; justify-content: center;
  gap: 10px; margin: 14px 0 10px;
}
.mvp-divider-line {
  width: 50px; height: 1px;
  background: linear-gradient(90deg, transparent, #c8a84e, transparent);
}
.mvp-divider-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: linear-gradient(135deg, #ffd700, #ff8f00);
  box-shadow: 0 2px 8px rgba(255,143,0,0.4);
}

@media (max-width: 768px) {
  .mvp-cert { width: 260px; margin-top: -12px; margin-bottom: -8px; }
  .mvp-crown { width: 30px; }
  .mvp-title-row { gap: 10px; }
  .mvp-divider-line { width: 36px; }
}
.mvp-grid {
  display: flex; gap: 16px; overflow-x: auto;
  padding: 14px 14px 14px; margin: -14px -14px 0;
  scrollbar-width: none;
  -ms-overflow-style: none;
  position: sticky; top: 80px; z-index: 2;
}
.mvp-grid::-webkit-scrollbar { display: none; }
.mvp-card {
  position: relative;
  display: flex; flex-direction: column; align-items: center; text-align: center;
  min-width: 220px; flex: 1;
  background: #ffffff;
  border: 1px solid #eef0f3; border-radius: 16px;
  padding: 36px 24px 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  min-height: 400px; will-change: transform;
}
.mvp-card:hover {
  box-shadow: 0 12px 32px rgba(0,0,0,0.08);
  transform: translateY(-3px);
}

.mvp-card::before, .mvp-card::after { display: none; }

/* 월계수 왕관 뱃지 */
.mvp-ribbon-badge {
  position: absolute; top: -12px; left: -12px;
  z-index: 10;
  width: 64px; height: 70px;
  filter: drop-shadow(0 2px 6px rgba(180,130,20,0.4));
  pointer-events: none;
  transition: transform 0.3s ease, filter 0.3s ease;
  animation: badgeShine 3s ease-in-out infinite;
}
.mvp-card:hover .mvp-ribbon-badge {
  transform: scale(1.1) rotate(-3deg);
  filter: drop-shadow(0 2px 8px rgba(180,130,20,0.5)) drop-shadow(0 0 14px rgba(218,165,32,0.5));
}
@keyframes badgeShine {
  0%, 100% { filter: drop-shadow(0 2px 6px rgba(180,130,20,0.35)); }
  50% { filter: drop-shadow(0 2px 8px rgba(180,130,20,0.4)) drop-shadow(0 0 12px rgba(218,165,32,0.45)); }
}

.mvp-photo { position: relative; margin-bottom: 18px; z-index: 1; }
.mvp-photo img {
  width: 96px; height: 96px; border-radius: 50%; object-fit: cover;
  border: none;
  background: #f9fafb;
  transition: transform 0.25s ease;
}
.mvp-card:hover .mvp-photo img { transform: scale(1.04); }
.mvp-info { z-index: 1; }
.mvp-placeholder {
  width: 96px; height: 96px; border-radius: 50%;
  background: #f2f4f6;
  display: flex; align-items: center; justify-content: center;
  border: none;
}
.mvp-placeholder span { font-size: 30px; font-weight: 700; color: #8b95a1; }
.mvp-badge-wrap { position: absolute; bottom: -2px; right: -2px; }
.mvp-badge {
  display: inline-block; padding: 4px 10px;
  background: linear-gradient(135deg, #191f28, #2d3748);
  color: #fff; font-size: 9px; font-weight: 800;
  border-radius: 100px;
  letter-spacing: 0.8px;
  border: 2px solid #fff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.mvp-info { flex: 1; display: flex; flex-direction: column; align-items: center; width: 100%; }
.mvp-name { font-size: 17px; font-weight: 800; color: #191f28; margin: 0 0 4px; letter-spacing: -0.3px; }
.mvp-role { font-size: 12px; color: #8b95a1; margin: 0 0 14px; font-weight: 500; }
.mvp-intro {
  font-size: 13px; color: #4e5968; line-height: 1.65; margin: 0 0 auto;
  word-break: keep-all;
  max-height: 85px;
  overflow-y: auto;
  padding-bottom: 16px;
  scrollbar-width: thin;
  scrollbar-color: #ddd transparent;
}
.mvp-intro::-webkit-scrollbar { width: 3px; }
.mvp-intro::-webkit-scrollbar-thumb { background: #ddd; border-radius: 3px; }
.mvp-intro::-webkit-scrollbar-track { background: transparent; }
.mvp-tags { display: flex; gap: 5px; flex-wrap: wrap; justify-content: center; margin-bottom: 18px; }
.mvp-tags span {
  font-size: 11px; font-weight: 600; padding: 4px 10px;
  background: #f5f7fa; border-radius: 100px; color: #4e5968;
}
.mvp-actions { display: flex; gap: 6px; justify-content: center; width: 100%; }
.mvp-btn {
  padding: 11px 0; width: 100%; max-width: 180px;
  background: #191f28; color: #fff; border: none;
  border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer;
  transition: all 0.2s ease;
}
.mvp-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(0,0,0,0.15); background: #333d4b; }
.mvp-edit-btn {
  padding: 11px 14px; background: white; color: #8b95a1; border: 1px solid #e5e8eb;
  border-radius: 10px; font-size: 12px; font-weight: 600; cursor: pointer;
}
.mvp-edit-btn:hover { border-color: #d1d6db; color: #4e5968; }

/* 관리자: 사진 변경 */
.mvp-photo-edit {
  position: absolute; bottom: 6px; left: 50%; transform: translateX(-50%);
  padding: 3px 10px; background: rgba(0,0,0,0.5); color: white; border-radius: 4px;
  font-size: 10px; font-weight: 600; cursor: pointer; opacity: 0; transition: opacity 0.2s;
}
.mvp-card:hover .mvp-photo-edit { opacity: 1; }

/* 관리자: 인라인 수정 */
.mvp-edit-input, .mvp-edit-textarea {
  width: 100%; padding: 6px 10px; border: 1px solid #e5e5e5; border-radius: 6px;
  font-size: 12px; color: #333; outline: none; font-family: inherit; margin-bottom: 6px;
}
.mvp-edit-input.sm { font-size: 11px; }
.mvp-edit-textarea { resize: vertical; font-size: 11px; }
.mvp-edit-actions { display: flex; gap: 6px; justify-content: center; }
.mvp-edit-save {
  padding: 5px 14px; background: linear-gradient(135deg, #4d8ef7, #6c5ce7); color: white;
  border: none; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer;
}
.mvp-edit-cancel {
  padding: 5px 14px; background: white; color: #888; border: 1px solid #e5e5e5;
  border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer;
}

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
  border: 2px dashed #c8a84e; background: rgba(255,255,255,0.6);
  cursor: pointer; transition: all 0.2s; min-height: 200px;
}
.mvp-add-card:hover { border-color: #a07c28; background: rgba(255,255,255,0.8); transform: translateY(-4px); }
.mvp-add-icon { font-size: 36px; font-weight: 300; color: #8b6914; line-height: 1; }
.mvp-add-text { font-size: 14px; font-weight: 700; color: #8b6914; margin-top: 8px; }

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
  .mvp-card { min-width: 180px; padding: 20px 16px; min-height: 360px; }
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
.feature-section { padding: 72px 0; background: #fafbff; overflow: hidden; }
.feature-eyebrow {
  font-size: 12px; font-weight: 700; letter-spacing: 3px;
  color: #4d8ef7; margin: 0 0 12px; text-transform: uppercase;
}
.feature-title { font-size: 2rem; font-weight: 900; color: #1a1a1a; margin: 0 0 10px; letter-spacing: -0.5px; }
.feature-highlight { color: #4d8ef7; }
.feature-sub { font-size: 15px; color: #aaa; margin: 0 0 12px; font-weight: 400; }
.feature-divider { width: 40px; height: 3px; background: linear-gradient(90deg, #4d8ef7, #6c5ce7); border-radius: 2px; margin: 0 auto 44px; }

/* 캐러셀 */
.carousel-wrap { position: relative; overflow: hidden; border-radius: 16px; width: 100%; }
.carousel-track { display: flex; transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1); width: 100%; }
.carousel-item { min-width: 100%; width: 100%; flex-shrink: 0; }
.carousel-card {
  display: flex; background: white; border-radius: 16px;
  overflow: hidden; height: 360px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.04);
}
.carousel-img { width: 45%; flex-shrink: 0; overflow: hidden; }
.carousel-img img { width: 100%; height: 100%; object-fit: cover; }
.carousel-body {
  flex: 1; padding: 48px 44px;
  display: flex; flex-direction: column; justify-content: center;
}
.carousel-num {
  font-size: 56px; font-weight: 900; color: #4d8ef7; opacity: 0.1;
  line-height: 1; margin: 0 0 8px;
}
.carousel-body h4 { font-size: 1.4rem; font-weight: 900; color: #1a1a1a; margin: 0 0 14px; }
.carousel-body p { font-size: 15px; color: #888; line-height: 1.8; margin: 0; }

/* 도트 */
.car-dots { display: flex; justify-content: center; gap: 6px; margin-top: 24px; }
.car-dot {
  width: 6px; height: 6px; border-radius: 3px;
  border: none; background: #d0d9f0; cursor: pointer;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1); padding: 0;
}
.car-dot.active { background: #4d8ef7; width: 24px; }

@media (max-width: 768px) {
  .feature-section { padding: 40px 0; }
  .feature-title { font-size: 1.5rem; }
  .feature-sub { font-size: 13px; }
  .feature-divider { margin-bottom: 28px; }
  .carousel-wrap { border-radius: 12px; max-width: 100%; }
  .carousel-card { flex-direction: column; height: auto; border-radius: 12px; max-width: 100%; }
  .carousel-img { width: 100%; height: 180px; }
  .carousel-body { padding: 20px 16px; }
  .carousel-body h4 { font-size: 1.05rem; margin-bottom: 8px; }
  .carousel-body p { font-size: 13px; line-height: 1.7; }
  .carousel-num { font-size: 36px; margin-bottom: 4px; }
  .car-dots { margin-top: 16px; }
}
/* 고객 후기 */
.review-section {
  position: relative; padding: 100px 0 110px;
  overflow: hidden; isolation: isolate;
}
.review-bg {
  position: absolute; inset: 0; z-index: -2;
  background: url('/images/cars/car9.jpg') center/cover no-repeat;
  filter: brightness(0.55);
}
.review-overlay {
  position: absolute; inset: 0; z-index: -1;
  background: linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.15) 35%, rgba(0,0,0,0.55) 100%);
}
.review-container { position: relative; }

.review-hero { text-align: center; margin-bottom: 56px; }
.review-eyebrow {
  font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.85);
  letter-spacing: 4px; margin: 0 0 18px; text-transform: uppercase;
}
.review-headline {
  font-size: 2.4rem; font-weight: 900; color: #fff;
  margin: 0 0 28px; letter-spacing: -0.6px; line-height: 1.35;
  text-shadow: 0 4px 30px rgba(0,0,0,0.5);
}
.review-hero-actions {
  display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;
}
.review-list-btn, .review-write-btn {
  display: inline-block; padding: 12px 28px;
  border-radius: 100px;
  font-size: 13px; font-weight: 700; text-decoration: none;
  backdrop-filter: blur(10px);
  transition: all 0.25s ease;
}
.review-list-btn {
  background: #fff; color: #111;
  border: 1px solid #fff;
}
.review-list-btn:hover {
  background: rgba(255,255,255,0.9);
  transform: translateY(-2px);
}
.review-write-btn {
  background: rgba(255,255,255,0.12); color: #fff;
  border: 1px solid rgba(255,255,255,0.3);
}
.review-write-btn:hover {
  background: rgba(255,255,255,0.22);
  border-color: rgba(255,255,255,0.5);
  transform: translateY(-2px);
}

/* 캐러셀 */
.review-carousel {
  position: relative;
  display: flex; align-items: center; justify-content: center;
  gap: 12px;
}
.review-stage {
  position: relative;
  display: flex; align-items: center; justify-content: center;
  gap: 24px;
  width: 100%;
  perspective: 1200px;
}
.review-slide {
  position: relative;
  flex: 0 0 340px;
  background: #fff; border-radius: 18px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.35);
  overflow: hidden; text-decoration: none; color: inherit;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.review-slide.slot-center {
  transform: scale(1.05);
  z-index: 2;
  box-shadow: 0 30px 80px rgba(0,0,0,0.45);
}
.review-slide.slot-left {
  transform: scale(0.92) translateX(20px);
  opacity: 0.7;
  filter: brightness(0.85);
}
.review-slide.slot-right {
  transform: scale(0.92) translateX(-20px);
  opacity: 0.7;
  filter: brightness(0.85);
}
.review-slide:hover { filter: brightness(1); }

.review-card-img { aspect-ratio: 16/10; overflow: hidden; background: #f5f5f5; }
.review-card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
.review-slide:hover .review-card-img img { transform: scale(1.05); }

.review-card-body { padding: 18px 22px 22px; }
.review-card-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; margin-bottom: 12px; }
.review-card-title {
  font-size: 16px; font-weight: 800; color: #111; margin: 0 0 4px;
  letter-spacing: -0.3px;
}
.review-card-meta { font-size: 12px; color: #999; margin: 0; font-weight: 500; }
.review-card-tag {
  flex-shrink: 0; padding: 5px 12px;
  background: linear-gradient(135deg, #3182f6, #2563eb); color: #fff;
  border-radius: 6px; font-size: 11px; font-weight: 700;
}
.review-card-rating {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 12px;
}
.stars-row { display: flex; gap: 1px; }
.stars-row .star { font-size: 14px; color: #e5e7eb; }
.stars-row .star.filled { color: #fbbf24; }
.review-card-date { font-size: 11px; color: #bbb; }
.review-card-text {
  font-size: 13px; color: #555; line-height: 1.7; margin: 0;
  display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 88px;
}

/* 화살표 */
.review-arrow {
  flex-shrink: 0;
  width: 48px; height: 48px; border-radius: 50%;
  background: rgba(255,255,255,0.15); color: #fff;
  border: 1px solid rgba(255,255,255,0.3);
  font-size: 26px; font-weight: 300; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(10px);
  transition: all 0.25s ease;
  z-index: 5;
}
.review-arrow:hover {
  background: rgba(255,255,255,0.28);
  transform: scale(1.1);
}
.review-arrow.prev { margin-right: -8px; }
.review-arrow.next { margin-left: -8px; }

@media (max-width: 1024px) {
  .review-slide { flex: 0 0 300px; }
  .review-headline { font-size: 1.9rem; }
}
@media (max-width: 768px) {
  .review-section { padding: 64px 0 80px; }
  .review-bg { background-attachment: scroll; }
  .review-headline { font-size: 1.4rem; }
  .review-eyebrow { font-size: 10px; letter-spacing: 3px; }
  .review-hero { margin-bottom: 36px; }
  .review-stage { gap: 12px; }
  .review-slide { flex: 0 0 260px; }
  .review-slide.slot-left, .review-slide.slot-right { display: none; }
  .review-slide.slot-center { transform: scale(1); }
  .review-arrow { width: 40px; height: 40px; font-size: 22px; }
  .review-card-body { padding: 14px 16px 18px; }
  .review-card-title { font-size: 14px; }
}

.cta-section {
  padding: 80px 0; position: relative; overflow: hidden;
  background: linear-gradient(135deg, #f8faff 0%, #eef2ff 50%, #f5f3ff 100%);
}
.cta-bg-shapes { position: absolute; inset: 0; pointer-events: none; }
.cta-shape {
  position: absolute; border-radius: 50%;
}
.cta-s1 {
  width: 380px; height: 380px; top: -140px; right: -120px;
  background: radial-gradient(circle, rgba(99,102,241,0.18), transparent 70%);
  filter: blur(20px);
}
.cta-s2 {
  width: 280px; height: 280px; bottom: -100px; left: -80px;
  background: radial-gradient(circle, rgba(49,130,246,0.15), transparent 70%);
  filter: blur(20px);
}
.cta-s3 {
  width: 160px; height: 160px; top: 30%; left: 40%;
  background: radial-gradient(circle, rgba(236,72,153,0.1), transparent 70%);
  filter: blur(16px);
}
.cta-inner {
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 32px; position: relative; z-index: 1;
}
.cta-eyebrow {
  font-size: 11px; font-weight: 700; letter-spacing: 3px;
  color: #6366f1; margin: 0 0 12px; text-transform: uppercase;
}
.cta-inner h2 {
  font-size: 2rem; font-weight: 900; color: #191f28;
  margin: 0 0 10px; letter-spacing: -0.6px;
}
.cta-desc { font-size: 15px; color: #6b7684; margin: 0 0 20px; font-weight: 500; }
.cta-features { display: flex; gap: 8px; flex-wrap: wrap; }
.cta-features span {
  padding: 6px 14px; border-radius: 100px;
  background: #fff; border: 1px solid #e5e8eb;
  color: #4e5968; font-size: 12px; font-weight: 600;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
}
.cta-action { display: flex; flex-direction: column; align-items: center; gap: 14px; }
.cta-btn {
  display: inline-block; padding: 16px 40px;
  background: linear-gradient(135deg, #3182f6, #6366f1);
  color: #fff;
  font-size: 15px; font-weight: 700; text-decoration: none; border-radius: 12px;
  transition: all 0.25s; box-shadow: 0 8px 24px rgba(99,102,241,0.28);
  letter-spacing: -0.2px;
}
.cta-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(99,102,241,0.4);
}
.cta-phone {
  display: flex; align-items: center; gap: 6px;
  color: #6b7684; font-size: 13px; font-weight: 600;
  text-decoration: none; transition: color 0.15s;
}
.cta-phone:hover { color: #191f28; }
@media (max-width: 768px) {
  .cta-section { padding: 56px 0; }
  .cta-inner { flex-direction: column; text-align: center; }
  .cta-inner h2 { font-size: 1.5rem; }
  .cta-features { justify-content: center; }
  .cta-action { width: 100%; }
  .cta-btn { width: 100%; text-align: center; }
}

/* 카운터 통계 */
.counter-section {
  position: relative;
  padding: 100px 0;
  overflow: hidden;
}
.counter-bg {
  position: absolute; inset: 0;
}
.counter-bg img {
  width: 100%; height: 100%; object-fit: cover;
}
.counter-overlay {
  position: absolute; inset: 0;
  background: rgba(0,0,0,0.7);
}
.counter-inner {
  position: relative; z-index: 1;
  display: flex; align-items: center; justify-content: center;
  gap: 0;
}
.counter-box {
  flex: 1; text-align: center; padding: 20px 0;
}
.counter-divider {
  width: 1px; height: 80px;
  background: rgba(255,255,255,0.15);
  flex-shrink: 0;
}
.counter-label {
  font-size: 11px; font-weight: 700; letter-spacing: 3px;
  color: rgba(255,255,255,0.5);
  margin: 0 0 12px; text-transform: uppercase;
}
.counter-number {
  font-size: 52px; font-weight: 900; color: #fff;
  margin: 0 0 14px; line-height: 1;
  letter-spacing: -1px;
}
.counter-box-main .counter-number {
  color: #4d8ef7;
}
.counter-desc {
  font-size: 13px; color: rgba(255,255,255,0.6);
  margin: 0; line-height: 1.7;
}
@media (max-width: 768px) {
  .counter-section { padding: 60px 0; }
  .counter-inner { flex-direction: column; gap: 0; }
  .counter-divider { width: 60px; height: 1px; margin: 16px auto; }
  .counter-number { font-size: 40px; }
  .counter-desc { font-size: 12px; }
}
</style>
