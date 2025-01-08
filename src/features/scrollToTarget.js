export default function scrollToTarget(id) {
  console.log('scrolled to target')
  var element = document.getElementById(id)
  var headerOffset = 100
  var elementPosition = element.getBoundingClientRect().top
  var offsetPosition = elementPosition + window.pageYOffset - headerOffset

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth',
  })
}
