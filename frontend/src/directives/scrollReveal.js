export const vReveal = {
  mounted(el, binding) {
    const delay = binding.value?.delay || 0
    const direction = binding.value?.dir || 'up'
    const duration = binding.value?.duration || 600

    el.style.opacity = '0'
    el.style.transition = `opacity ${duration}ms ease ${delay}ms, transform ${duration}ms ease ${delay}ms`

    if (direction === 'up') el.style.transform = 'translateY(50px)'
    else if (direction === 'left') el.style.transform = 'translateX(-50px)'
    else if (direction === 'right') el.style.transform = 'translateX(50px)'
    else if (direction === 'scale') el.style.transform = 'scale(0.9)'

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0) translateX(0) scale(1)'
          observer.unobserve(el)
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -40px 0px' }
    )
    observer.observe(el)
  },
}
