function setLanguageCookie() {
  // Function to set a cookie
  function setCookie(name, value, days) {
    const date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    const expires = 'expires=' + date.toUTCString()
    document.cookie = name + '=' + value + ';' + expires + ';path=/'
  }

  // Function to get a cookie by name
  function getCookie(name) {
    const nameEQ = name + '='
    const ca = document.cookie.split(';')
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) == ' ') c = c.substring(1, c.length)
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length)
    }
    return null
  }

  // Event listener for button to set the cookie
  document
    .querySelector('.banner_close-button')
    .addEventListener('click', function () {
      setCookie('correct-language', 'true', 7)
    })

  // On page load, check the cookie and manipulate the DOM
  window.onload = function () {
    const correctLanguage = getCookie('correct-language')
    if (correctLanguage !== 'true') {
      const banner = document.querySelector('.banner_component')
      if (banner) {
        banner.classList.remove('hide')
      }
    }
  }
}

export default setLanguageCookie
