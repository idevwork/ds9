import defaultLayout from 'layouts/default'
import showcase from 'pages/Showcase'
import signIn from 'components/common/auth/Signin'

export default [{
        path: '/',

        component: defaultLayout,

        children: [{
            path: '/',
            name: 'showcase',
            component: showcase,
            meta: {
                currentView: 'showcase'
            }
        }, {
            name: 'signin',
            path: '/signin',
            component: signIn
        }, {
            path: '/library',
            component: showcase,
            meta: {
                requiresAuth: true,
                currentView: 'myLibrary'
            }
        // }, {
        //     name: 'playlists',
        //     path: '/library/playlists/',
        //     component: showcase,
        //     meta: {
        //         requiresAuth: true,
        //         currentView: 'playlists'
        //     }
        // }, {
        //     name: 'editPlaylist',
        //     path: '/library/playlists/:playlistID',
        //     component: showcase,
        //     props: true,
        //     meta: {
        //         requiresAuth: true,
        //         currentView: 'playlists'
        //     }
        }, {
            name: 'shop',
            path: '/shop',
            component: showcase,
            meta: {
                currentView: 'filterResults'
            }
        }, {
            name: 'checkout',
            path: '/shop/checkout',
            component: showcase,
            meta: {
                currentView: 'checkout'
            }
        }, {
            name: 'thankyou',
            path: '/shop/thankyou',
            component: showcase,
            meta: {
                requiresAuth: true,
                currentView: 'thankyou'
            }
        }, {
            name: 'giftToken',
            path: '/shop/gift',
            component: () => import ('pages/shopGiftPreview')
        }, {
            name: 'preview',
            path: '/shop/:productID2Preview',
            component: showcase,
            props: true,
            meta: {
                currentView: 'productPreview'
            }
        }, {
            name: 'token',
            path: '/token',
            component: () => import ('pages/token')
        }, {
            name: 'tagFilter',
            path: '/tagFilter/:tagIDs',
            component: showcase,
            props: true,
            meta: {
                currentView: 'filterResults'
            }
        }, {
            name: 'profile',
            path: '/profile',
            alias: '/me',
            component: showcase,
            meta: {
                currentView: 'myProfile'
            }
        }, {
            name: 'account',
            path: '/account',
            component: showcase,
            meta: {
                requiresAuth: true,
                currentView: 'myAccount'
            }
        }, {
            name: 'activate',
            path: '/activate',
            alias: '/redeem',
            component: () => import ('pages/Activate')
        }, {
            name: 'affiliates',
            path: '/affiliates',
            component: () => import ('pages/Affiliates')
        }, {
            name: 'signUp',
            path: '/signUp',
            component: () => import ('pages/publisherSignUp')
        }, {
            name: 'contentOwnerSignup',
            path: '/content-owner-signup',
            component: () => import ('pages/publisherAccess'),
            meta: {
                requiresAuth: true
            },
            props: true
        }, {
            name: 'player',
            path: '/play/:productID2Play/:productContextID?',
            component: () => import ('pages/SuperPlayer'),
            meta: {
                requiresAuth: true
            },
            props: true
        }, {
            name: 'support',
            path: '/support',
            component: () => import ('pages/Support')
        }, {
            name: 'supportIssue',
            path: '/support/:currentIssueID',
            component: () => import ('pages/Support'),
            props: true
        }, {
            name: 'offerBrand',
            path: '/offer/:offerBrand/:offerProductID?',
            component: showcase,
            props: true,
            meta: {
                currentView: 'offer'
            }
        }, {
            name: 'test',
            path: '/test',
            component: () => import ('pages/test'),
            props: true
        }, {
            name: '404',
            path: '/404',
            component: () => import ('pages/404'),
            props: true
        // },{
        //     path: '/experience',
        //     component: () => import ('pages/html5Experience/ExperienceLayout'),
        //     props: true
        },
        {
            name: 'catchAll',
            path: '*',
            component: showcase,
            meta: {
                currentView: ''
            }
        }]
    }
]
