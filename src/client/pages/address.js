import $ from 'jquery'
import widget from 'ethplorer-widget'
import {
  isAddress,
  stripTags,
  prepareToken,
} from '@/utils'

export function init (ctx) {
  fetchAddressData({
    data: ctx.params.data,
    page: ctx.hashQueryString,
    debugId: ctx.query.debug,
    showTx: ctx.hashQuery.showTx,
  })
  .then(data => {
    console.log(data)

    if (data.token || (data.isContract && data.contract.isChainy)) {
      const token = prepareToken(data.token)

      if (data.isContract && data.contract.isChainy) {
        token.name = 'Chainy';
      }

      widget.init('#token-price-history-grouped-widget', 'tokenPriceHistoryGrouped', {
        theme: 'dark',
        getCode: true,
        address: ctx.params.data,
        period: 730,
        options: {
          title: token.name && stripTags(token.name) || '',
        },
      })
    } else {
      widget.init('#token-price-history-grouped-widget', 'addressPriceHistoryGrouped', {
        theme: 'dark',
        getCode: true,
        address: ctx.params.data,
        period: 730,
        showTx: ctx.hashQuery.showTx,
      })
    }

    widget.loadGoogleControlCharts()

    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    })
  })
}

function fetchAddressData (params) {
  if (!isAddress(params.data)) {
    return Promise.reject(new Error('Invalid address format'))
  }

  return new Promise((resolve, reject) => {
    $.ajax({
      // url: 'https://ethplorer.io/service/service.php',
      url: '/service/service.php',
      dataType: 'json',
      cache: false,
      data: params,
    })
    .then(data => {
      resolve(data)
    }, () => {
      reject()
    })
  })
}
