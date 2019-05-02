import $ from 'jquery'
import page from 'page'
import Cookies from 'js-cookie'
import * as Sentry from '@sentry/browser'
import 'bootstrap'
import './assets/style/main.scss'
import widget from 'ethplorer-widget'
import EthplorerSearch from 'ethplorer-search'

import './templates/components/note'
import './templates/components/modal-subscribe'

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

Sentry.init({
  dsn: 'https://8d6dcaecdb6c4390b545e02c5b2e7116@ethplorer.io/erp'
})

$(function () {
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
      Cookies.set('agree_to_use', Date.now(), { expires: 365 * 2 })
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
