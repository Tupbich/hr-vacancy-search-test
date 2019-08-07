import Vue from 'vue'

import './styles/quasar.styl'
import lang from 'quasar/lang/ru.js'
import '@quasar/extras/roboto-font/roboto-font.css'
import '@quasar/extras/material-icons/material-icons.css'
import Quasar from 'quasar'

Vue.use(Quasar, {
  config: {},
  lang: lang
})