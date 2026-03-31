import { ref, computed } from 'vue'

const compareList = ref([])
const MAX = 3

export function useCompare() {
  const count = computed(() => compareList.value.length)
  const isFull = computed(() => compareList.value.length >= MAX)

  function isInCompare(id) {
    return compareList.value.some(v => v.id === id)
  }

  function toggleCompare(vehicle) {
    if (isInCompare(vehicle.id)) {
      compareList.value = compareList.value.filter(v => v.id !== vehicle.id)
    } else {
      if (isFull.value) return false
      compareList.value.push({ ...vehicle })
    }
    return true
  }

  function removeCompare(id) {
    compareList.value = compareList.value.filter(v => v.id !== id)
  }

  function clearCompare() {
    compareList.value = []
  }

  return { compareList, count, isFull, isInCompare, toggleCompare, removeCompare, clearCompare }
}
