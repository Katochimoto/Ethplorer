import page from 'page'
import * as Sentry from '@sentry/browser'
import 'bootstrap'
import './assets/style/main.scss'
import './components/note'
import './components/modal-subscribe'
import './components/cookie-notify'

Sentry.init({
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

page('/wc', () => import(
  /* webpackChunkName: "page-wc" */
  /* webpackMode: "lazy" */
  './pages/wc.js'
))

page({
  click: false,
  popstate: false,
  hashbang: false,
})
