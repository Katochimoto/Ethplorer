import $ from 'jquery'
import widget from 'ethplorer-widget'
import {
  isAddress,
  stripTags,
  prepareToken,
  toChecksumAddress,
} from '@/utils'
import template from '../templates/detail/address.twig?component'

export function init (ctx) {
  const address = ctx.params.data

  fetchAddressData({
    data: address,
    page: ctx.hashQueryString,
    debugId: ctx.query.debug,
    showTx: ctx.hashQuery.showTx,
  })
  .then(data => {
    console.log(data)
    try {
      const $app = document.getElementById('app')
      $app.innerHTML = template({
        ...window.__DATA__,
        data
      });
    } catch (e) {
      debugger
    }


    // if (data.token || (data.isContract && data.contract.isChainy)) {
    //   const token = prepareToken(data.token)
    //   const title = (data.isContract && data.contract.isChainy) ?
    //     'Chainy' :
    //     (token.name && stripTags(token.name) || '')

    //   widget.init('#token-price-history-grouped-widget', 'tokenPriceHistoryGrouped', {
    //     theme: 'dark',
    //     getCode: true,
    //     address: address,
    //     period: 730,
    //     options: { title },
    //   })
    // } else {
    //   widget.init('#token-price-history-grouped-widget', 'addressPriceHistoryGrouped', {
    //     theme: 'dark',
    //     getCode: true,
    //     address: address,
    //     period: 730,
    //     showTx: ctx.hashQuery.showTx,
    //   })
    // }

    // widget.loadGoogleControlCharts()

    // $(function () {
    //   $('[data-toggle="tooltip"]').tooltip()
    // })
  })
  .catch(error => {

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
      resolve({
        ...data,
        address: toChecksumAddress(params.data),
      })
    }, () => {
      reject()
    })
  })
}
