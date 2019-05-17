import './assets/style/main.scss'

import $ from 'jquery'
import page from 'page'
import { init as initSentry } from '@sentry/browser'
import 'bootstrap'
import { sendDOMGa } from '@/utils'

import './templates/nav'
import './templates/note'
import './templates/modal-subscribe'
import './templates/cookie-notify'

initSentry({
  dsn: 'https://8d6dcaecdb6c4390b545e02c5b2e7116@ethplorer.io/erp'
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

$(function () {
  $(document)
    .on('click', 'a[data-ga]', event => {
      const $target = $(event.currentTarget)
      if (
        $target.attr('target') === '_blank' ||
        $target.attr('href').charAt(0) === '#'
      ) {
        sendDOMGa(event.currentTarget)
      }
    })
    .on('submit', 'form[data-ga][target="_blank"]', event => sendDOMGa(event.currentTarget))
})
