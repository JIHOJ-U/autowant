import { ref, computed } from 'vue'

const vehicleList = ref([
  { id: 1, name: '쏘나타', brand: '현대', year: 2025, type: '세단', fuel: '하이브리드', price: 35900000, monthlyRent: 498000, rentMonths: 48, deposit: 0, image: '/images/cars/248x124.crop (3).jpg', isSpecial: false, isImmediate: true, discount: 0 },
  { id: 2, name: '카니발', brand: '기아', year: 2025, type: 'RV/MPV', fuel: '하이브리드', price: 52000000, monthlyRent: 689000, rentMonths: 48, deposit: 0, image: '/images/cars/248x124.crop (1).jpg', isSpecial: true, isImmediate: false, discount: 8 },
  { id: 3, name: '쏘렌토', brand: '기아', year: 2025, type: 'SUV', fuel: '하이브리드', price: 48000000, monthlyRent: 638000, rentMonths: 48, deposit: 0, image: '/images/cars/248x124.crop.jpg', isSpecial: true, isImmediate: true, discount: 7 },
  { id: 4, name: 'K8', brand: '기아', year: 2025, type: '세단', fuel: '하이브리드', price: 42000000, monthlyRent: 558000, rentMonths: 48, deposit: 0, image: '/images/cars/248x124.crop (2).jpg', isSpecial: false, isImmediate: false, discount: 0 },
  { id: 5, name: '팰리세이드', brand: '현대', year: 2025, type: 'SUV', fuel: '디젤', price: 52000000, monthlyRent: 698000, rentMonths: 48, deposit: 0, image: '/images/cars/248x124.crop (10).jpg', isSpecial: false, isImmediate: true, discount: 0 },
  { id: 6, name: 'G80', brand: '제네시스', year: 2025, type: '세단', fuel: '가솔린', price: 62000000, monthlyRent: 818000, rentMonths: 48, deposit: 0, image: '/images/cars/248x124.crop (7).jpg', isSpecial: true, isImmediate: false, discount: 8 },
  { id: 7, name: '아반떼', brand: '현대', year: 2025, type: '세단', fuel: '가솔린', price: 22000000, monthlyRent: 298000, rentMonths: 36, deposit: 0, image: '/images/cars/248x124.crop (5).jpg', isSpecial: false, isImmediate: true, discount: 0 },
  { id: 8, name: 'K5', brand: '기아', year: 2025, type: '세단', fuel: '하이브리드', price: 35000000, monthlyRent: 478000, rentMonths: 48, deposit: 0, image: '/images/cars/248x124.crop (4).jpg', isSpecial: false, isImmediate: false, discount: 0 },
  { id: 9, name: 'S-Class', brand: '벤츠', year: 2025, type: '세단', fuel: '가솔린', price: 158000000, monthlyRent: 2180000, rentMonths: 48, deposit: 10000000, image: '/images/cars/248x124.crop (9).jpg', isSpecial: true, isImmediate: false, discount: 5 },
  { id: 10, name: '셀토스', brand: '기아', year: 2025, type: 'SUV', fuel: '가솔린', price: 26000000, monthlyRent: 348000, rentMonths: 36, deposit: 0, image: '/images/cars/248x124.crop (6).jpg', isSpecial: false, isImmediate: true, discount: 0 },
  { id: 11, name: 'G90', brand: '제네시스', year: 2025, type: '세단', fuel: '가솔린', price: 98000000, monthlyRent: 1280000, rentMonths: 48, deposit: 5000000, image: '/images/cars/248x124.crop (8).jpg', isSpecial: false, isImmediate: false, discount: 0 },
  { id: 12, name: '모하비', brand: '기아', year: 2025, type: 'SUV', fuel: '디젤', price: 58000000, monthlyRent: 768000, rentMonths: 48, deposit: 0, image: '/images/cars/248x124.crop (11).jpg', isSpecial: false, isImmediate: false, discount: 0 },
  { id: 13, name: '카니발 하이리무진', brand: '기아', year: 2025, type: 'RV/MPV', fuel: '디젤', price: 62000000, monthlyRent: 828000, rentMonths: 48, deposit: 0, image: '/images/cars/248x124.crop (12).jpg', isSpecial: true, isImmediate: false, discount: 6 },
  { id: 14, name: '트레일블레이저', brand: '쉐보레', year: 2025, type: 'SUV', fuel: '가솔린', price: 28000000, monthlyRent: 378000, rentMonths: 36, deposit: 0, image: '/images/cars/248x124.crop (13).jpg', isSpecial: false, isImmediate: true, discount: 0 },
  { id: 15, name: '렉스턴', brand: 'KGM', year: 2025, type: 'SUV', fuel: '디젤', price: 42000000, monthlyRent: 558000, rentMonths: 48, deposit: 0, image: '/images/cars/248x124.crop (14).jpg', isSpecial: false, isImmediate: false, discount: 0 },
  { id: 16, name: '토레스', brand: 'KGM', year: 2025, type: 'SUV', fuel: '디젤', price: 28000000, monthlyRent: 368000, rentMonths: 36, deposit: 0, image: '/images/cars/248x124.crop (15).jpg', isSpecial: false, isImmediate: true, discount: 0 },
  { id: 17, name: 'A6', brand: '아우디', year: 2025, type: '세단', fuel: '가솔린', price: 72000000, monthlyRent: 958000, rentMonths: 48, deposit: 5000000, image: '/images/cars/248x124.crop (16).jpg', isSpecial: false, isImmediate: false, discount: 0 },
])

export function useVehicles() {
  const specialList = computed(() => vehicleList.value.filter(v => v.isSpecial).map(v => ({
    ...v,
    originalPrice: Math.round(v.price / (1 - v.discount / 100)),
  })))
  const immediateList = computed(() => vehicleList.value.filter(v => v.isImmediate))

  function addVehicle(v) {
    vehicleList.value.push({ ...v, id: Date.now() })
  }

  function updateVehicle(v) {
    const idx = vehicleList.value.findIndex(x => x.id === v.id)
    if (idx !== -1) vehicleList.value[idx] = { ...v }
  }

  function removeVehicle(id) {
    vehicleList.value = vehicleList.value.filter(v => v.id !== id)
  }

  return { vehicleList, specialList, immediateList, addVehicle, updateVehicle, removeVehicle }
}
