const removeAllIntroText = () => {
  document.querySelectorAll(`[data-intro]`).forEach((el) => el.classList.add('hide'))
}

const setIntroText = (state) => {
  removeAllIntroText()

  if (state === 'default') {
    document.querySelector(`[data-intro="${state}"]`).classList.remove('hide')
  } else if (state === 'simple') {
    document.querySelector(`[data-intro="${state}"]`).classList.remove('hide')
  } else if (state === 'detailed') {
    document.querySelector(`[data-intro="${state}"]`).classList.remove('hide')
  }
}

const fadeTransition = () => {
  const fadeEl = document.querySelector('.calculator_fade')
  fadeEl.classList.remove('is--ending')
  fadeEl.classList.add('is--active')
  setTimeout(() => {
    fadeEl.classList.remove('is--active')
    fadeEl.classList.add('is--ending')
  }, 500)
}

const initSwitch = () => {
  const switches = document.querySelectorAll('.calculator_switcher_item')

  const detailedElements = document.querySelectorAll('[data-detailed]')

  detailedElements.forEach((detailedEl) => detailedEl.classList.add('hide'))
  switches.forEach((switchEl) => {
    switchEl.addEventListener('click', (e) => {
      let currentEl = e.currentTarget

      fadeTransition()
      setTimeout(() => {
        switches.forEach((switchEl) => switchEl.classList.remove('is--active'))
        if (currentEl.classList.contains('is--simple')) {
          detailedElements.forEach((detailedEl) => detailedEl.classList.add('hide'))
          currentEl.classList.add('is--active')
          setIntroText('simple')
        } else {
          detailedElements.forEach((detailedEl) => detailedEl.classList.remove('hide'))
          currentEl.classList.add('is--active')
          setIntroText('detailed')
        }
      }, 350)
    })
  })
}

initSwitch()
