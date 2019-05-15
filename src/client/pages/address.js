import $ from 'jquery'
import diff from 'diffhtml'
import debounce from 'lodash/debounce'
import queryString from 'query-string'
import widget from 'ethplorer-widget'
import config from 'ethplorer-config'
import {
  isAddress,
  stripTags,
  prepareToken,
  toChecksumAddress,
} from '@/utils'
import template from '../templates/detail/address.twig?component'

const REFRESH_TABS = {
  'tab-transfers': 'transfers',
  'tab-issuances': 'issuances',
  'tab-holders': 'holders',
  'tab-chainy': 'chainy',
}

export function init (ctx) {
  let state = {}

  const render = debounce(() => diff.innerHTML(document.getElementById('app'), template({
    ...window.__DATA__,
    ctx: ctx,
    data: state,
    config: config,
  })), 100)

  const fetchData = (refresh) => fetchAddressData({
    data: ctx.params.data,
    page: ctx.hashQueryString,
    debugId: ctx.query.debug,
    showTx: ctx.getStateParam('showTx'),
    refresh: refresh,
  }).then(data => {
    if (refresh) {
      state = {
        ...state,
        token: data.token,
        srcToken: data.srcToken,
        ethPrice: data.ethPrice,
        contract: data.contract,
        pager: {
          ...state.pager,
          ...data.pager
        },
        [refresh]: data[refresh]
      }
    } else {
      state = data
    }
  })

  const refreshDataTab = () => {
    const tab = ctx.getStateParam('tab', 'tab-transfers')
    const refresh = REFRESH_TABS[tab]

    state.loading = true
    render()

    return fetchData(refresh)
      .then(() => {
        state.loading = false
        render()
        return refresh
      })
  }

  fetchData()
    .then(() => {
      render()
      window.addEventListener('hashchange', render, false)
    })
    .catch(error => {
      debugger
    })


    // if (data.token || (data.isContract && data.contract.isChainy)) {
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


  $(function () {
    // $('[data-toggle="tooltip"]').tooltip()

    let needReload = []

    $(document)
      .on('click', '.pagination a.page-link', event => {
        event.preventDefault()
        const $target = $(event.currentTarget)
        const name = $target.data('name')
        const page = parseInt($target.data('page'), 10)
        ctx.setStateParam(name, page)
        refreshDataTab()
      })
      .on('change', 'select[name="pageSize"]', event => {
        const pageSize = parseInt($(event.currentTarget).val(), 10)
        ctx.setStateParam('pageSize', pageSize)
        needReload = Object.values(REFRESH_TABS)
        refreshDataTab()
          .then(tab => {
            needReload = needReload.filter(item => item !== tab)
          })
      })
      .on('shown.bs.tab', '.nav-tabs a.nav-link', event => {
        const $target = $(event.target)
        const tabName = $target.attr('aria-controls')
        ctx.setStateParam('tab', `tab-${tabName}`)

        if (needReload.includes(tabName)) {
          refreshDataTab()
            .then(tab => {
              needReload = needReload.filter(item => item !== tab)
            })
        }
      })

  })
}

export function destroy () {
  // window.removeEventListener
}

function fetchAddressData (params) {
  if (!isAddress(params.data)) {
    return Promise.reject(new Error('Invalid address format'))
  }

  return new Promise((resolve, reject) => {
    $.ajax({
      url: '/service/service.php',
      dataType: 'json',
      cache: false,
      data: params,
    })
    .then(data => {
      data = {
        ...data,
        address: params.data,
        checksumAddress: toChecksumAddress(params.data),
      }

      data.srcToken = data.token
      data.token = prepareToken(data.token, data)
      resolve(data)
    }, () => {
      reject()
    })
  })
}
