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

page({
  click: false,
  popstate: false,
  hashbang: false,
})
