import $ from 'jquery'
import Cookies from 'js-cookie'

$(function () {
  $('#cookie-notify')
    .on('closed.bs.alert', () => {
      Cookies.set('agree_to_use', Date.now(), { expires: 365 * 2 })
    })

  if (!Cookies.get('agree_to_use')) {
    setTimeout(() => $('#cookie-notify').slideDown(), 200)
  }
})
