import $ from 'jquery'
import page from 'page'
import Cookies from 'js-cookie'
import 'bootstrap'
import './assets/style/main.scss'
import widget from 'ethplorer-widget'
import EthplorerSearch from 'ethplorer-search'

window.eWgs = []
window.tildaBrowserLang = 'EN'

eWgs.push(function () {
  widget.init('#token-pulse', 'tokenHistoryGrouped', {
    period: 90,
    theme: 'dark',
    cap: true,
    total: true,
    options: { pointSize: 0 },
  })

  widget.init('#token-top', 'top', {
    limit: 10
  })

  widget.init('#token-last', 'tokenHistory', {
    limit: 5
  }, {
    header: ''
  })
})

page('subscribe', function () {
  $('#modal-subscribe').modal('show')
})

page({
  click: false,
  popstate: false,
  decodeURLComponents: false,
  hashbang: true,
})

$(function () {
  $('#modal-subscribe')
    .on('hidden.bs.modal', function () {
      $('input[name="email"]', this)
        .removeClass('is-invalid')
        .val('')

      page('/#')
    })
    .on('shown.bs.modal', function () {
      $('input[name="email"]', this)
        .trigger('focus')
    })
    .on('submit', 'form', function (event) {
      event.preventDefault()
      const $email = $('input[name="email"]', this)
      const email = $.trim($email.val())
      const isValid = email && /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(email)

      $email.toggleClass('is-invalid', !isValid)

      if (!isValid) {
        $email.trigger('focus')
      }
    })
    .on('input', 'input[name="email"]', function () {
      $(this).removeClass('is-invalid')
    })

  $('#search-form')
    .on('submit', function (event) {
      event.preventDefault()
      const $data = $('input[name="data"]', this)
      const data = $.trim($data.val()).toLowerCase()
      const isValid = data && (/^0x[0-9a-f]{40}$/.test(data) || /^0x[0-9a-f]{64}$/.test(data))

      $data.toggleClass('is-invalid', !isValid)

      if (!isValid) {
        $data.trigger('focus')
      }
    })
    .on('input', 'input[name="data"]', function () {
      $(this).removeClass('is-invalid')
    })

  $('#cookie-notify')
    .on('closed.bs.alert', () => {
      const expires = new Date()
      expires.setFullYear(expires.getFullYear() + 2)
      Cookies.set('agree_to_use', Date.now(), { expires })
    })

  EthplorerSearch.init($('#search-form'), $('#search-form input[name="data"]'), data => {
    data = $.trim(data).toLowerCase()
    const isAddress = data && /^0x[0-9a-f]{40}$/.test(data)
    const isTx = data && /^0x[0-9a-f]{64}$/.test(data)

    if (isAddress) {
      document.location.href = '/address/' + data + '?from=search';
    } else if (isTx) {
      document.location.href = '/tx/' + data + '?from=search';
    }
  })

  if (!Cookies.get('agree_to_use')) {
    setTimeout(() => $('#cookie-notify').slideDown(), 200)
  }
})
