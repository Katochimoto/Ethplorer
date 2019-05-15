import './assets/style/main.scss'

import page from 'page'
import { init as initSentry } from '@sentry/browser'
import queryString from 'query-string'
import storage from 'local-storage'
import 'bootstrap'
import '@/utils/twig'

import './templates/nav'
import './templates/note'
import './templates/modal-subscribe'
import './templates/cookie-notify'

initSentry({
  dsn: 'https://8d6dcaecdb6c4390b545e02c5b2e7116@ethplorer.io/erp'
})

page('*', (ctx, next) => {
  ctx.query = queryString.parse(ctx.querystring)
  ctx.hashQuery = queryString.parse(ctx.hash)
  ctx.hashQueryString = queryString.stringify(ctx.hashQuery)

  ctx.setStateParam = (name, value) => {
    ctx.hashQuery[name] = value
    ctx.hashQueryString = queryString.stringify(ctx.hashQuery)
    ctx.state.path = `${ctx.path}${ctx.hashQueryString ? `#${ctx.hashQueryString}` : ''}`
    ctx.canonicalPath = ctx.state.path
    ctx.hash = ctx.hashQueryString
    window.location.hash = ctx.hashQueryString
    ctx.save()
  }

  ctx.getStateParam = (name, defaultValue) => {
    let value = ctx.hashQuery[name] || defaultValue

    if (name === 'showTx') {
      const showTxEnum = ['all', 'eth', 'tokens']
      const storeValue = storage.get(name)
      value = ctx.hashQuery[name] || storeValue || defaultValue || 'all'
      if (!showTxEnum.includes(value)) {
        value = 'all'
      }

      if (
        ctx.hashQuery[name] &&
        ctx.hashQuery[name] !== storeValue &&
        showTxEnum.includes(ctx.hashQuery[name])
      ) {
        storage.set(name, value)
      }
    }

    if (name === 'pageSize') {
      const pageSizeEnum = [10, 25, 50, 100]
      const storeValue = parseInt(storage.get(name), 10) || 0
      value = parseInt(ctx.hashQuery[name] || storeValue || defaultValue) || 10
      if (!pageSizeEnum.includes(value)) {
        value = 10
      }

      if (
        ctx.hashQuery[name] &&
        ctx.hashQuery[name] !== storeValue &&
        pageSizeEnum.includes(ctx.hashQuery[name])
      ) {
        storage.set(name, value)
      }
    }

    return value
  }

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

page('/address/:data', ctx => import(
  /* webpackChunkName: "page-address" */
  /* webpackMode: "lazy" */
  './pages/address.js'
).then(address => address.init(ctx)))

page.exit('/address/:data', ctx => import(
  /* webpackChunkName: "page-address" */
  /* webpackMode: "lazy" */
  './pages/address.js'
).then(address => address.destroy(ctx)))

page('/tx/:data', ctx => import(
  /* webpackChunkName: "page-address" */
  /* webpackMode: "lazy" */
  './pages/address.js'
).then(tx => tx.init(ctx)))

page('/search/:data', ctx => import(
  /* webpackChunkName: "page-address" */
  /* webpackMode: "lazy" */
  './pages/address.js'
).then(search => search.init(ctx)))

page({
  click: false,
  popstate: false,
})
