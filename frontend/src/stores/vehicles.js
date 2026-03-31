import { ref, computed } from 'vue'

const vehicleList = ref([
  { id: 1, name: '쏘나타 하이브리드', brand: '현대', year: 2025, type: '세단', fuel: '하이브리드', price: 35900000, monthlyRent: 498000, rentMonths: 48, deposit: 0, image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&q=80', isSpecial: false, isImmediate: true, discount: 0 },
  { id: 2, name: '카니발 하이브리드', brand: '기아', year: 2025, type: 'RV/MPV', fuel: '하이브리드', price: 52000000, monthlyRent: 689000, rentMonths: 48, deposit: 0, image: 'https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=400&q=80', isSpecial: true, isImmediate: false, discount: 8 },
  { id: 3, name: '싼타페 하이브리드', brand: '현대', year: 2025, type: 'SUV', fuel: '하이브리드', price: 48000000, monthlyRent: 638000, rentMonths: 48, deposit: 0, image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&q=80', isSpecial: true, isImmediate: true, discount: 7 },
  { id: 4, name: 'K5 하이브리드', brand: '기아', year: 2025, type: '세단', fuel: '하이브리드', price: 35000000, monthlyRent: 478000, rentMonths: 36, deposit: 0, image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=400&q=80', isSpecial: false, isImmediate: false, discount: 0 },
  { id: 5, name: '팰리세이드', brand: '현대', year: 2025, type: 'SUV', fuel: '디젤', price: 52000000, monthlyRent: 698000, rentMonths: 48, deposit: 0, image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&q=80', isSpecial: false, isImmediate: true, discount: 0 },
  { id: 6, name: 'GV70', brand: '제네시스', year: 2025, type: 'SUV', fuel: '가솔린', price: 58000000, monthlyRent: 768000, rentMonths: 48, deposit: 0, image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&q=80', isSpecial: true, isImmediate: false, discount: 8 },
  { id: 7, name: '캐스퍼', brand: '현대', year: 2025, type: '경차', fuel: '가솔린', price: 18000000, monthlyRent: 248000, rentMonths: 36, deposit: 0, image: 'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=400&q=80', isSpecial: false, isImmediate: true, discount: 0 },
  { id: 8, name: '쏘렌토 하이브리드', brand: '기아', year: 2025, type: 'SUV', fuel: '하이브리드', price: 50000000, monthlyRent: 658000, rentMonths: 48, deposit: 0, image: 'https://images.unsplash.com/photo-1552799446-159ba9523315?w=400&q=80', isSpecial: true, isImmediate: false, discount: 8 },
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
