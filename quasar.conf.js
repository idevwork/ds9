// Configuration for your app

module.exports = function (ctx) {
  return {
    plugins: [
      'babelPolyfill',
      'api',
      'componentLoad',
      'i18n',
      'injection',
      'j_',
      'localStorage',
      'moment',
      'velocity',
      'numeral',
      'VueTheMask',
      'VueTimeago',
    ],
    css: [
      'app.styl'
    ],
    extras: [
      ctx.theme.mat ? 'roboto-font' : null,
      // 'material-icons'
      // 'ionicons',
      // 'mdi',
      'fontawesome'
    ],
    supportIE: true,
    vendor: {
      add: [],
      remove: []
    },
    build: {
      scopeHoisting: true,
      vueRouterMode: 'history',
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      // useNotifier: false,
      extendWebpack (cfg) {

      }
    },
    devServer: {
      // https: true,
      port: 8080,
      open: true // opens browser window automatically
    },
    // framework: 'all' --- includes everything; for dev only!
    framework: {
      components: [
        'QChatMessage',
        'QBtn',
        'QBtnGroup',
        'QCard',
        'QCardActions',
        'QCardMain',
        'QCardMedia',
        'QCardSeparator',
        'QCardTitle',
        'QCarousel',
        'QCarouselSlide',
        'QCarouselControl',
        'QCheckbox',
        'QChip',
        'QChipsInput',
        'QCollapsible',
        'QContextMenu',
        'QDatetime',
        'QDatetimePicker',
        'QField',
        'QIcon',
        'QInnerLoading',
        'QInput',
        'QItem',
        'QItemMain',
        'QItemSeparator',
        'QItemSide',
        'QItemTile',
        'QLayoutDrawer',
        'QLayoutHeader',
        'QList',
        'QListHeader',
        'QModal',
        'QModalLayout',
        'QOptionGroup',
        'QPage',
        'QPageContainer',
        'QPageSticky',
        'QPopover',
        'QProgress',
        'QRouteTab',
        'QScrollArea',
        'QSearch',
        'QSelect',
        'QSlideTransition',
        'QSpinner',
        'QTab',
        'QTable',
        'QTabPane',
        'QTabs',
        'QToggle',
        'QToolbar',
        'QToolbarTitle',
        'QTooltip',
        'QUploader',
        'QVideo',
        'QRadio',
        'QWindowResizeObservable',
        'QLayout',
        'QBtnDropdown'
      ],
      directives: [
        'Ripple',
        'BackToTop',
        'TouchSwipe',
        'TouchHold',
        'CloseOverlay'
      ],
      plugins: [
        'Notify',
        'Loading',
        'Dialog',
        'SessionStorage'
      ],
      iconSet: 'fontawesome'
    },
    animations: 'all',
    // animations: 'all' --- includes all animations
    // animations: [
    // ],
    pwa: {
      cacheExt: 'js,html,css,ttf,eot,otf,woff,woff2,json,svg,gif,jpg,jpeg,png,wav,ogg,webm,flac,aac,mp4,mp3',
      manifest: {
        // name: 'Quasar App',
        // short_name: 'Quasar-PWA',
        // description: 'Best PWA App in town!',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            'src': 'statics/icons/icon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-256x256.png',
            'sizes': '256x256',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-384x384.png',
            'sizes': '384x384',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-512x512.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ]
      }
    },
    cordova: {
      // id: 'org.cordova.quasar.app'
    },
    electron: {
      extendWebpack (cfg) {
        // do something with cfg
      },
      packager: {
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Window only
        // win32metadata: { ... }
      }
    },

    // leave this here for Quasar CLI
    starterKit: '1.0.0-beta.4'
  }
}
