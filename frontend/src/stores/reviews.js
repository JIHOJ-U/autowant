import { ref } from 'vue'

const IMG = '/images/reviews'

const reviewList = ref([
  {
    id: 1, name: '김**', vehicle: '르노코리아 필랑트', date: '2026.04', rating: 5,
    title: '르노코리아 필랑트 출고후기',
    thumbnail: `${IMG}/KakaoTalk_20260421_115536457_23.jpg`,
    tags: ['친절한 상담', '빠른 출고'],
    blocks: [
      { type: 'text', content: '친절한 팀장님 덕분에 출고 잘했습니다. 감사합니다!' },
      { type: 'image', src: `${IMG}/KakaoTalk_20260421_115536457_23.jpg`, caption: '르노코리아 필랑트 출고' },
    ],
  },
  {
    id: 2, name: '이**', vehicle: '기아 쏘렌토', date: '2026.04', rating: 5,
    title: '기아 쏘렌토 출고후기',
    thumbnail: `${IMG}/KakaoTalk_20260421_115536457_11.jpg`,
    tags: ['시원한 상담', '빠른 계약'],
    blocks: [
      { type: 'text', content: '장기렌트를 두번째 이용하지만 신차장기렌트전팀장 매니저님 처럼 시원시원하게 견적과 계약을 진행해주신 분은 처음입니다. 차량도 깔끔하게 잘 받았고, 모든 과정이 만족스럽습니다^^ 친절하게 마지막까지 신경써주셔서 감사합니다^^' },
      { type: 'image', src: `${IMG}/KakaoTalk_20260421_115536457_11.jpg`, caption: '쏘렌토 인수 당일' },
    ],
  },
  {
    id: 3, name: '박**', vehicle: '기아 EV4', date: '2026.04', rating: 5,
    title: '기아 EV4 출고후기',
    thumbnail: `${IMG}/KakaoTalk_20260421_120205738_17.jpg`,
    tags: ['친절한 안내', '옵션 챙김'],
    blocks: [
      { type: 'text', content: '모델y 출고하려다 EV4로 급선회하면서 많이 귀찮게 해드렸는데 출고까지 하게되었네요. 고생많으셨어요. 여기를 빌어 감사하다고 전합니다. 상담하면서 맘에 들었던것은 진행상황을 수시로 안내해 주신다는 겁니다. 그리고 옵션도 빵빵하게 챙겨주시고 서비스 품목도 잘 챙겨 주셨어요. 감사하고 판매왕 되시고 부자되세요.' },
      { type: 'image', src: `${IMG}/KakaoTalk_20260421_120205738_17.jpg`, caption: 'EV4 출고' },
    ],
  },
  {
    id: 4, name: '최**', vehicle: '기아 카니발', date: '2026.03', rating: 5,
    title: '기아 카니발 출고후기',
    thumbnail: `${IMG}/KakaoTalk_20260421_115536457_19.jpg`,
    tags: ['빠른 진행', '리스 세팅'],
    blocks: [
      { type: 'text', content: '오토원트 처음 이용해봅니다. 간단하게 견적 봐주시고 여러 매니저분들 만나서 꽤나 타협점 찾기어려웠습니다. 그래도 매니저님 만나고 차량 리스 세팅부터 차량 확보까지 일주일이 채 안걸려서 안그래도 급한 상황이었는데 너무 감사하게도 인도 잘 받았습니다. 앞으로도 좋은일 가득하시고 번창하셨으면 좋겠습니다.' },
      { type: 'image', src: `${IMG}/KakaoTalk_20260421_115536457_19.jpg`, caption: '카니발 리스 출고' },
    ],
  },
  {
    id: 5, name: '정**', vehicle: '제네시스 GV70', date: '2026.03', rating: 5,
    title: '제네시스 GV70 출고후기',
    thumbnail: `${IMG}/KakaoTalk_20260421_115728590.png`,
    tags: ['무보증 출고', '끝까지 책임'],
    blocks: [
      { type: 'text', content: '오토원트 앱을 통해 전호영 팀장님과 처음 연결됐습니다. 처음부터 무보증으로 출고를 원했는데, 와이프 신용도와 부채가 좀 있어 승인이 쉽지 않았습니다. 그 과정이 길어지면서 걱정도 많았지만, 전호영 팀장님께서 끝까지 친절하게 응대해주시고 계속 신경 써주신 덕분에 드디어 승인까지 나서 오늘 차량을 받게 됐습니다. 진행 과정 내내 서비스도 너무 좋았고, 문의할 때마다 빠르고 친절하게 안내해주셔서 정말 만족스러웠습니다. 쉽지 않은 상황에서도 포기하지 않고 도와주셔서 더 감사하게 느껴졌습니다. 장기렌트 알아보시는 분들께 전호영 팀장님 정말 추천드리고 싶습니다.' },
      { type: 'image', src: `${IMG}/KakaoTalk_20260421_115728590.png`, caption: 'GV70 출고 당일' },
    ],
  },
  {
    id: 6, name: '강**', vehicle: '현대 코나', date: '2026.03', rating: 5,
    title: '현대 코나 출고후기',
    thumbnail: `${IMG}/KakaoTalk_20260421_115536457_18.jpg`,
    tags: ['최저가', '빠른 출고'],
    blocks: [
      { type: 'text', content: '좋은 매니저 님 매칭 되어서, 원하는대로 그리고 빠르게 차량 출고 받았네요. 오토원트 통해서 처음 진행해 보았는데, 다른 지인 소개나 인터넷 업체보다 금액도 저렴하고 신뢰도도 높았습니다. 다음 출고도 오토원트를 이용 할것 같네요. 황팀장님께도 이 자리를 빌어 감사 인사 다시 드립니다. ^^' },
      { type: 'image', src: `${IMG}/KakaoTalk_20260421_115536457_18.jpg`, caption: '코나 출고' },
    ],
  },
  {
    id: 7, name: '윤**', vehicle: '기아 EV3', date: '2026.03', rating: 5,
    title: '기아 EV3 출고후기',
    thumbnail: `${IMG}/KakaoTalk_20260421_122453241_05.jpg`,
    tags: ['친절한 설명', '자세한 안내'],
    blocks: [
      { type: 'text', content: '여러군데 알아보던 중 좋은 담당자님 만나 친절한 설명과 자세한 안내 덕분에 출고 잘 했습니다!!!' },
      { type: 'image', src: `${IMG}/KakaoTalk_20260421_122453241_05.jpg`, caption: 'EV3 출고' },
    ],
  },
  {
    id: 8, name: '조**', vehicle: '제네시스 GV70', date: '2026.01', rating: 5,
    title: '제네시스 GV70 출고후기',
    thumbnail: `${IMG}/KakaoTalk_20260421_115737307.png`,
    tags: ['빠른 진행', '정확한 안내'],
    blocks: [
      { type: 'text', content: '차량 넘 맘에 들어요! 문의사항도 많아서 귀찮으셨을텐데 빠르고 정확하게 진행해주셔서 빠르게 수령했습니다!👍🏻' },
      { type: 'image', src: `${IMG}/KakaoTalk_20260421_115737307.png`, caption: 'GV70 출고' },
    ],
  },
  {
    id: 9, name: '장**', vehicle: '현대 팰리세이드', date: '2026.01', rating: 5,
    title: '현대 팰리세이드 출고후기',
    thumbnail: `${IMG}/KakaoTalk_20260421_115536457_08.jpg`,
    tags: ['친절', '도움 많이'],
    blocks: [
      { type: 'text', content: '딜러님 너무 친절하시고 도움많이주셔서 너무너무 감사합니다 차 너무 이쁨니다!!! 제가 지인소개 많이 할께욧!!!' },
      { type: 'image', src: `${IMG}/KakaoTalk_20260421_115536457_08.jpg`, caption: '팰리세이드 출고' },
    ],
  },
  {
    id: 10, name: '임**', vehicle: '장기렌트 계약', date: '2026.01', rating: 5,
    title: '전팀장님 덕분에 후회 없는 장기렌트 계약',
    thumbnail: `${IMG}/KakaoTalk_20260421_115648815.png`,
    tags: ['꼼꼼함', '정직함', '합리적 가격'],
    blocks: [
      { type: 'text', content: '이번에 차량 장기렌트를 알아보면서 여러 군데 견적을 받아봤는데, 결국 이곳에서 계약하게 된 이유는 전팀장님의 꼼꼼함과 정직함 때문이었습니다.' },
      { type: 'text', content: '처음 상담할 때부터 제가 놓칠 수 있는 세세한 부분까지 하나하나 짚어주시고, 무엇보다 가격적인 면에서 가장 합리적이고 저렴한 조건을 찾아주셔서 정말 감동했습니다. 진행 과정 내내 친절하게 답변해 주셔서 궁금한 점도 바로바로 해결할 수 있었고요.' },
      { type: 'text', content: '차량 인도받는 날까지 신경 써주시는 모습에 \'정말 사람을 소중히 생각하시는구나\'라는 느낌을 받았습니다. 장기렌트 고민 중이신 분들이라면 전팀장님 강력하게 추천드립니다! 후회 없으실 거예요.' },
      { type: 'image', src: `${IMG}/KakaoTalk_20260421_115648815.png`, caption: '인수 당일' },
    ],
  },
  {
    id: 11, name: '한**', vehicle: '제네시스 GV70', date: '2026.04', rating: 5,
    title: '제네시스 GV70 출고후기',
    thumbnail: `${IMG}/KakaoTalk_20260421_115916522_03.png`,
    tags: ['꼼꼼한 상담', '재구매'],
    blocks: [
      { type: 'text', content: '신차 몇번을 구매했지만 이번에 오토원트를 통해 알게된 딜러분 엄청 꼼꼼하시고 잘해주시더라구요. 다음번 구매도 그 딜러분한테 구매할 예정입니다.' },
      { type: 'image', src: `${IMG}/KakaoTalk_20260421_115916522_03.png`, caption: 'GV70 출고' },
    ],
  },
  {
    id: 12, name: '오**', vehicle: '제네시스 G80', date: '2026.04', rating: 5,
    title: '제네시스 G80 출고후기',
    thumbnail: `${IMG}/KakaoTalk_20260421_115916522_04.png`,
    tags: ['최저가', '친절한 설명'],
    blocks: [
      { type: 'text', content: '친절하게 설명해주시고 최저가로 잘 이용하게 됐습니다! 출고후에도 꼼꼼하게 잘 챙겨주셔서 너무 좋습니다. 앞으로 하게되면 무조건 여기서 할거에요.' },
      { type: 'image', src: `${IMG}/KakaoTalk_20260421_115916522_04.png`, caption: 'G80 출고' },
    ],
  },
  {
    id: 13, name: '유**', vehicle: '제네시스 GV70', date: '2026.03', rating: 5,
    title: '제네시스 GV70 출고후기',
    thumbnail: `${IMG}/KakaoTalk_20260421_115728590.png`,
    tags: ['친절', '꼼꼼한 안내'],
    blocks: [
      { type: 'text', content: '제가 뭘 원하는지도 스스로도 모를때 차량부터 옵션, 절차까지 하나부터 열까지 모두 친절히 응대해주셔서 너무 감사하게 출고하였습니다. 하나도 모르겠다 하시는 분들 매니저님 강추드립니다. 앞으로 회사차도, 와이프 차도 매니저님 통해 진행하려고합니다.' },
      { type: 'image', src: `${IMG}/KakaoTalk_20260421_115728590.png`, caption: 'GV70 인수' },
    ],
  },
  {
    id: 14, name: '신**', vehicle: '현대 캐스퍼', date: '2026.02', rating: 5,
    title: '현대 캐스퍼 출고후기',
    thumbnail: `${IMG}/KakaoTalk_20260421_115536457_13.png`,
    tags: ['빠른 배정', '업무용'],
    blocks: [
      { type: 'text', content: '현대·기아측에 계약 후 1개월 기약없이 6~24개월 출고대기 통보 받아 업무용 차량이라 답답해서 오토원트에 의뢰한지 1일만에 차량배정, 1주일이내에 인도 받았어요 ㅎㅎ 앞으로도 신차 역시 오토원트입니다. 담당 매니저님의 세심함과 신속함에 깊은 감사드립니다!!' },
      { type: 'image', src: `${IMG}/KakaoTalk_20260421_115536457_13.png`, caption: '캐스퍼 출고' },
    ],
  },
  {
    id: 15, name: '홍**', vehicle: '현대 팰리세이드', date: '2026.01', rating: 5,
    title: '현대 팰리세이드 출고후기',
    thumbnail: `${IMG}/KakaoTalk_20260421_115536457.jpg`,
    tags: ['최고의 조건', '합리적 가격'],
    blocks: [
      { type: 'text', content: '최고의 조건으로 잘 출고했어요ㅎ 친절하고 합리적인 가격!! 최고ㅎ' },
      { type: 'image', src: `${IMG}/KakaoTalk_20260421_115536457.jpg`, caption: '팰리세이드 인수' },
    ],
  },
  {
    id: 16, name: '서**', vehicle: '기아 쏘렌토', date: '2026.01', rating: 5,
    title: '기아 쏘렌토 출고후기',
    thumbnail: `${IMG}/KakaoTalk_20260421_115536457_27.jpg`,
    tags: ['꼼꼼한 선택지', '편한 출고'],
    blocks: [
      { type: 'text', content: '출고과정에서 꼼꼼하시고 합리적으로 선택지를 주셔서 편하게 이용하고 출고하였습니다. 👍' },
      { type: 'image', src: `${IMG}/KakaoTalk_20260421_115536457_27.jpg`, caption: '쏘렌토 출고' },
    ],
  },
  {
    id: 17, name: '권**', vehicle: '테슬라 Model Y', date: '2025.12', rating: 5,
    title: '테슬라 Model Y 출고후기',
    thumbnail: `${IMG}/KakaoTalk_20260421_120205738.jpg`,
    tags: ['최저가', '빠른 전환'],
    blocks: [
      { type: 'text', content: '아이오닉 9 견적으로 시작했다가 테슬라 모델Y 주니퍼로 계약했어요!! 그 누구보다 싸게 계약했네요 ㅎㅎ 감사합니다!' },
      { type: 'image', src: `${IMG}/KakaoTalk_20260421_120205738.jpg`, caption: 'Model Y 주니퍼' },
    ],
  },
  {
    id: 18, name: '문**', vehicle: '기아 카니발', date: '2025.11', rating: 5,
    title: '기아 카니발 출고후기',
    thumbnail: `${IMG}/KakaoTalk_20260421_115536457_25.jpg`,
    tags: ['2주 출고', '저렴한 가격'],
    blocks: [
      { type: 'text', content: '좋은 출고입니다. 거의 2주정도만에 신차 받았습니다. 다른곳보다 저렴하고 꼼꼼하게 응대해주네여. 딜러분도 잘해주셔서 대만족입니다! 지인들한테도 소개해줘야겠습니다.' },
      { type: 'image', src: `${IMG}/KakaoTalk_20260421_115536457_25.jpg`, caption: '카니발 출고' },
    ],
  },
  {
    id: 19, name: '안**', vehicle: '현대 그랜저', date: '2025.11', rating: 5,
    title: '현대 그랜저 출고후기',
    thumbnail: `${IMG}/KakaoTalk_20260421_115536457_02.jpg`,
    tags: ['안전한 출고', '빠른 출고'],
    blocks: [
      { type: 'text', content: '안전하게 빠른 출고 잘 했습니다!' },
      { type: 'image', src: `${IMG}/KakaoTalk_20260421_115536457_02.jpg`, caption: '그랜저 출고' },
    ],
  },
  {
    id: 20, name: '황**', vehicle: '기아 K8', date: '2025.10', rating: 5,
    title: '기아 K8 출고후기',
    thumbnail: `${IMG}/KakaoTalk_20260421_115536457_14.jpg`,
    tags: ['빠른 응대'],
    blocks: [
      { type: 'text', content: '잘해주셨어요. 필요할때 연락만 잘 받아주세요.' },
      { type: 'image', src: `${IMG}/KakaoTalk_20260421_115536457_14.jpg`, caption: 'K8 출고' },
    ],
  },
  {
    id: 21, name: '배**', vehicle: '현대 쏘나타 디 엣지', date: '2025.09', rating: 5,
    title: '현대 쏘나타 디 엣지 출고후기',
    thumbnail: `${IMG}/KakaoTalk_20260421_115536457_26.jpg`,
    tags: ['딜러 강추', '만족스러운 계약'],
    blocks: [
      { type: 'text', content: '사정이 있어 기존 계획이랑은 다른 차 계약했지만 아주 만족스러워요! 담당해주신 딜러분 강추 드립니다~' },
      { type: 'image', src: `${IMG}/KakaoTalk_20260421_115536457_26.jpg`, caption: '쏘나타 디 엣지 출고' },
    ],
  },
  {
    id: 22, name: '송**', vehicle: '기아 레이', date: '2025.09', rating: 5,
    title: '기아 레이 출고후기',
    thumbnail: `${IMG}/KakaoTalk_20260421_115545645.png`,
    tags: ['꾸준한 안내', '저렴한 견적'],
    blocks: [
      { type: 'text', content: '처음에 레이밴으로 견적신청했었는데 차량이 없어서 고생이 많았어요 ㅠㅠ 그래도 매일매일 차량 알아봐주시고 견적도 아주 저렴하게 잘 해주시고 매일매일 귀찮게 했는데도 답변도 빨리빨리 잘해주십니당!! 결국 차가없어 레이로 하게됬지만 끝까지 너무 만족합니다.😃😃 정말 많은 분들께 견적도 받고 상담도 받았지만, 출고는 무조건 강재원님께 강추.👍🏻' },
      { type: 'image', src: `${IMG}/KakaoTalk_20260421_115545645.png`, caption: '레이 출고' },
    ],
  },
  {
    id: 23, name: '전**', vehicle: '현대 싼타페', date: '2025.08', rating: 5,
    title: '현대 싼타페 출고후기',
    thumbnail: `${IMG}/KakaoTalk_20260421_115536457_28.jpg`,
    tags: ['빠른 출고', '저렴한 견적'],
    blocks: [
      { type: 'text', content: '빠르게 출고해서 차량 잘 받았습니다. 견적도 저렴하고 친절하세요~' },
      { type: 'image', src: `${IMG}/KakaoTalk_20260421_115536457_28.jpg`, caption: '싼타페 출고' },
    ],
  },
  {
    id: 24, name: '남**', vehicle: '제네시스 G80', date: '2026.01', rating: 5,
    title: '제네시스 G80 출고후기',
    thumbnail: `${IMG}/KakaoTalk_20260421_120205738_05.jpg`,
    tags: ['견적부터 출고까지', '기분 좋은 계약'],
    blocks: [
      { type: 'text', content: '견적부터 출고까지 많은 부분 케어 받았습니다. 매니저님의 친절한 응대에 정말 기분 좋게 차량 출고 하였습니다.' },
      { type: 'image', src: `${IMG}/KakaoTalk_20260421_120205738_05.jpg`, caption: 'G80 출고' },
    ],
  },
  {
    id: 25, name: '고**', vehicle: '현대 싼타페', date: '2025.12', rating: 5,
    title: '현대 싼타페 출고후기',
    thumbnail: `${IMG}/KakaoTalk_20260421_122453241_25.jpg`,
    tags: ['책임감 있는 진행'],
    blocks: [
      { type: 'text', content: '딜러분이 너무 친절하게 처음부터 끝까지 책임지고 진행해주셔서 기분좋게 차량 출고 받았습니다. 너무 감사합니다.' },
      { type: 'image', src: `${IMG}/KakaoTalk_20260421_122453241_25.jpg`, caption: '싼타페 출고' },
    ],
  },
  {
    id: 26, name: '류**', vehicle: '제네시스 GV80', date: '2025.12', rating: 5,
    title: '제네시스 GV80 출고후기',
    thumbnail: `${IMG}/KakaoTalk_20260421_115536457_09.jpg`,
    tags: ['일사천리', '전팀장님'],
    blocks: [
      { type: 'text', content: '오토원트에서 전팀장님과 인연이 되서 차량 선점부터 계약까지 일사천리로 빠르게 잘 출고받았습니다. 출고 후 문의사항들까지도 늘 친절한 마인드로 응대해주셔서 깊은 감사말씀 드립니다^^' },
      { type: 'image', src: `${IMG}/KakaoTalk_20260421_115536457_09.jpg`, caption: 'GV80 출고' },
    ],
  },
  {
    id: 27, name: '노**', vehicle: '기아 쏘렌토', date: '2025.11', rating: 5,
    title: '기아 쏘렌토 출고후기',
    thumbnail: `${IMG}/KakaoTalk_20260421_115536457_22.jpg`,
    tags: ['최저가', '빠른 출고'],
    blocks: [
      { type: 'text', content: '끝까지 잘 챙겨주셔서 제일 싸고 빠르게 출고 받았습니다. 여기에서 계약하세요 그냥.' },
      { type: 'image', src: `${IMG}/KakaoTalk_20260421_115536457_22.jpg`, caption: '쏘렌토 출고' },
    ],
  },
  {
    id: 28, name: '구**', vehicle: '현대 아반떼', date: '2025.09', rating: 5,
    title: '현대 아반떼 출고후기',
    thumbnail: `${IMG}/KakaoTalk_20260421_115617248.png`,
    tags: ['빠른 출고', '예쁜 차'],
    blocks: [
      { type: 'text', content: '차 너무너무 예쁘고 빠르고 친절하게 기다림없이 바로 출고 도와주셨습니다. 다음 제 차도 이 분이랑 계약할거 같습니다!! 감사합니다!!' },
      { type: 'image', src: `${IMG}/KakaoTalk_20260421_115617248.png`, caption: '아반떼 출고' },
    ],
  },
  {
    id: 29, name: '채**', vehicle: '현대 아반떼', date: '2025.09', rating: 5,
    title: '현대 아반떼 출고후기',
    thumbnail: `${IMG}/KakaoTalk_20260421_122453241_02.jpg`,
    tags: ['깔끔한 차량 상태', '빠른 인도'],
    blocks: [
      { type: 'text', content: '정말 고민 많이하고 구매했는데 차량 상태도 정말 깔끔하고 인도도 생각보다 빠른 시일 내에 받아서 좋았습니다. 지금은 아주 만족하면서 잘 타고 있습니다. 다음차도 구매한다면 매니저님께 의뢰하고 싶습니다.' },
      { type: 'image', src: `${IMG}/KakaoTalk_20260421_122453241_02.jpg`, caption: '아반떼 출고' },
    ],
  },
  {
    id: 30, name: '표**', vehicle: '기아 레이', date: '2025.07', rating: 5,
    title: '기아 레이 출고후기',
    thumbnail: `${IMG}/KakaoTalk_20260421_115545645.png`,
    tags: ['빠른 진행'],
    blocks: [
      { type: 'text', content: '차 잘 받았습니다. 급해서 많이 서둘렀는데, 빠르게 진행해 아주 맘에 듭니다. 다음에도 이용할껍니다.' },
      { type: 'image', src: `${IMG}/KakaoTalk_20260421_115545645.png`, caption: '레이 출고' },
    ],
  },
])

export function useReviews() {
  function addReview(r) {
    reviewList.value.unshift({ ...r, id: Date.now() })
  }

  function updateReview(r) {
    const idx = reviewList.value.findIndex(x => x.id === r.id)
    if (idx !== -1) reviewList.value[idx] = { ...r }
  }

  function removeReview(id) {
    reviewList.value = reviewList.value.filter(r => r.id !== id)
  }

  return { reviewList, addReview, updateReview, removeReview }
}
