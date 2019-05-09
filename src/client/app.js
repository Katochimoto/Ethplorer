import page from 'page'
import { init as initSentry } from '@sentry/browser'
import queryString from 'query-string'
import storage from 'local-storage'
import 'bootstrap'
import './assets/style/main.scss'
import './components/nav'
import './components/note'
import './components/modal-subscribe'
import './components/cookie-notify'

initSentry({
  dsn: 'https://8d6dcaecdb6c4390b545e02c5b2e7116@ethplorer.io/erp'
})

page('*', (ctx, next) => {
  ctx.query = queryString.parse(ctx.querystring)
  ctx.hashQuery = queryString.parse(ctx.hash)

  // showTx
  const showTxEnum = ['all', 'eth', 'tokens']
  let showTx = storage.get('showTx')
  if (showTxEnum.indexOf(showTx) === -1) {
    showTx = 'all'
  }

  if (
    ctx.hashQuery.showTx &&
    ctx.hashQuery.showTx !== showTx &&
    showTxEnum.indexOf(ctx.hashQuery.showTx) !== -1
  ) {
    showTx = ctx.hashQuery.showTx
    storage.set('showTx', showTx)
  }

  ctx.hashQuery.showTx = showTx
  // /showTx

  ctx.hashQueryString = queryString.stringify(ctx.hashQuery)
  next()
})

page('/', () => import(
  /* webpackChunkName: "page-index" */
  /* webpackMode: "lazy" */
  './pages/index.js'
))

page('/index', () => import(
  /* webpackChunkName: "page-chart" */
  /* webpackMode: "lazy" */
  './pages/chart.js'
))

page('/top', () => import(
  /* webpackChunkName: "page-top" */
  /* webpackMode: "lazy" */
  './pages/top.js'
))

page('/top/weekly', () => import(
  /* webpackChunkName: "page-top-weekly" */
  /* webpackMode: "lazy" */
  './pages/top-weekly.js'
))

page('/last', () => import(
  /* webpackChunkName: "page-last" */
  /* webpackMode: "lazy" */
  './pages/last.js'
))

page('/widgets', () => import(
  /* webpackChunkName: "page-widgets" */
  /* webpackMode: "lazy" */
  './pages/widgets.js'
))

page('/about', () => import(
  /* webpackChunkName: "page-about" */
  /* webpackMode: "lazy" */
  './pages/about.js'
))

page('/privacy', () => import(
  /* webpackChunkName: "page-privacy" */
  /* webpackMode: "lazy" */
  './pages/privacy.js'
))

page('/address/:address', ctx => import(
  /* webpackChunkName: "page-address" */
  /* webpackMode: "lazy" */
  './pages/address.js'
).then(address => address.init(ctx)))

page('/tx/:tx', ctx => import(
  /* webpackChunkName: "page-address" */
  /* webpackMode: "lazy" */
  './pages/address.js'
).then(tx => tx.init(ctx)))

page('/search/:search', ctx => import(
  /* webpackChunkName: "page-address" */
  /* webpackMode: "lazy" */
  './pages/address.js'
).then(search => search.init(ctx)))

page({
  click: false,
  popstate: false,
})
