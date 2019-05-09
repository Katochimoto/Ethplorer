import $ from 'jquery'
import { isAddress } from '@/utils'

export function init (ctx) {
  const address = ctx.params.address
  const query = ctx.hashQuery
  const queryString = ctx.hashQueryString
  const debug = ctx.query.debug

  if (!isAddress(address)) {
    return Promise.reject(new Error('Invalid address format'))
  }

  return new Promise((resolve, reject) => {
    $.ajax({
      // url: 'https://ethplorer.io/service/service.php',
      url: '/service/service.php',
      dataType: 'json',
      cache: false,
      data: {
        data: address,
        page: queryString,
        debugId: debug,
        showTx: query.showTx,
      },
    })
    .then(data => {
      // Ethplorer.requestDebug = data.debug
      resolve()
    }, () => {
      reject()
    })
  })
}
