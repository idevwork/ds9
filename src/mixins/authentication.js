import cookies from '../js/cookies'
import { userAndProductInfo } from './userAndProductInfo'

export const authentication = {
    computed: {
        goingTo() {
            return this.$store.state.goingTo
        },

        comingFrom() {
            return this.$store.state.comingFrom
        },

        environmentName() {
            return this.$store.state.environment.name
        },

        anonymousUserID() {
            return this.$store.state.user.anonymousUserID
        },

        initialParameters() {
            return this.$store.state.initialParameters
        },

        userAgentInfo() {
            return this.$store.state.userAgentInfo
        },

        firstVisitToEnvironment() {
            return this.$store.state.firstVisitToEnvironment
        },

        sessionLogObj() {
            return this.$store.state.sessionLogObj
        }
    },

    mixins: [userAndProductInfo],

    methods: {
        sendEmailToAPI(cb) {
            var req = {
                "userEmail": this.userEmail
            }

            this.api.post(this.api.apiv4Route + 'api/user/emailAccountExists', req, (res) => {
                k('userInfoFromEmail: ', res)

                cb(res)
            })
        },

        signUserIn(cb) {

            let req = {
                userEmail: this.userEmail,
                password: this.userPassword
            }

            k('sign in req: ', req)

            this.api.post(this.api.apiv4Route + 'api/user/signin', req, res => {
                k('auth: ', res)

                if (res.success) {
                    res.authenticated = true // TODO: review other places that require this and refactor/improve so we don't have to set this

                    var logEventObj = {
                        eventType: 'userSignedIn',
                        userEmail: this.userEmail,
                        // userID: res.userID,
                        os: this.userAgentInfo.os.name,
                        referrer: document.referrer
                    }
                    var logEvent = this.j_.mergeObjects(logEventObj, this.j_.cloneObject(this.sessionLogObj))
                    this.api.sendEvent(logEvent)

                    this.userFound(res)
                }

                cb(res)
            })

            // this.api.post(this.api.whichServer() == '-dev2' ? this.api.apiv4Route + 'api/user/authenticate' : this.api.apiv3Route + 'user/authenticate', req, res => {
            //     k('auth: ', res)

            //     if (this.api.whichServer() == '-dev2' && res.success == 'true') res.authenticated = true

            //     if (res.authenticated) {
            //         var logEventObj = {
            //             eventType: 'userSignedIn',
            //             userEmail: this.userEmail,
            //             userID: res.userID,
            //             os: this.userAgentInfo.os.name,
            //             referrer: document.referrer
            //         }
            //         var logEvent = this.j_.mergeObjects(logEventObj, this.j_.cloneObject(this.sessionLogObj))
            //         this.api.sendEvent(logEvent)

            //         this.userFound(res)
            //     }

            //     cb(res)
            // })
        },

        registerNewUser(cb) {
            var req = {
                "userEmail": this.userEmail,
                "password": this.userPassword,
                "firstName": this.firstName,
                "lastName": this.lastName
            }

            k('signUserUp req: ', req)

            this.api.post(this.api.apiv4Route + 'api/user/createNewUserIfNecessary', req, (res) => {
                k('newUser res: ', res)

                if (res.success) {
                    var logEventObj = {
                        eventType: 'userAccountCreated',
                        userEmail: this.userEmail,
                        userID: res.userID,
                        os: this.userAgentInfo.os.name,
                        referrer: document.referrer
                    }
                    var logEvent = this.j_.mergeObjects(logEventObj, this.j_.cloneObject(this.sessionLogObj))
                    this.api.sendEvent(logEvent)

                    this.userFound(res)
                }

                cb(res)
            })
        },

        marketingOptIn(cb) {
            let req = {
                "userEmail": this.userEmail,
                "environment": this.environmentName
            }

            this.api.post(this.api.apiv4Route + 'api/crm/marketingOptIn', req, (res) => {
                k('marketingOptIn: ', res)
                cb(res)
            })
        },

        userFound(res) {
            k('userFound: ', res)

            this.$store.commit('userLoginToken', res.userLoginToken)
            this.$store.commit('authenticated', true)
            if (!this.noredirect) this.route(this.$route.query.redirect || this.comingFrom || '/')

            var isSignIn = true
            this.initUser(isSignIn)
        },

        initUser(signIn) {
            // get user Info
            this.getUserInfo(userInfo => {
                k('userInfo res: ', userInfo)

                if (!userInfo) {
                    this.$store.commit('userLoginToken', '')
                    this.$store.commit('authenticated', false)
                }

                if (userInfo) {
                    this.$store.commit('userInfo', userInfo)

                    if (signIn && this.anonymousUserID) {
                        var req = {
                            "newUserID": userInfo.userID,
                            "originalUserID": this.anonymousUserID,
                            "newUserEmail": userInfo.userEmail
                        }

                        this.api.post(this.api.ioRoute + 'support/reassignIssues', req, (res) => {
                            k('reassignIssues: ', res)
                            this.$store.commit('issuesReassigned', true)

                            var req = {
                                anonymousUserID: this.anonymousUserID,
                                loggedInUserID: userInfo.userID
                            }

                            this.api.post(this.api.ioRoute + 'events/updateAnonUserID', req, (res) => {
                                k('updateAnonUserID: ', res)
                                this.$store.commit('anonymousUserID', '')
                            })
                        })
                    }

                    var logEventObj = {
                        eventType: 'userInfo',
                        userEmail: userInfo.userEmail,
                        userID: userInfo.userID,
                        os: this.userAgentInfo.os.name,
                        referrer: document.referrer
                    }

                    if (this.initialParameters.utm_source) logEventObj.utm_source = this.initialParameters.utm_source
                    if (this.firstVisitToEnvironment) logEventObj.firstVisitToEnvironment = this.firstVisitToEnvironment

                    // kw('userInfo log event: ', logEventObj)
                    // kw('sessionLogObj: ', this.sessionLogObj)

                    var logEvent = this.j_.mergeObjects(logEventObj, this.j_.cloneObject(this.sessionLogObj))
                    // k('logEvent after userInfo: ', logEvent)
                    this.api.sendEvent(logEvent)

                    var newSessionLogObj = this.j_.mergeObjects(this.j_.cloneObject(this.sessionLogObj), logEventObj)
                    this.$store.commit('sessionLogObj', newSessionLogObj)
                }
            })

            if (this.goingTo !== '/activate') {
                this.removeEnvironmentProductInfo()
                this.getProductsAndTags4Environment()
            }
        },

        resetPassword() {
            this.sendRequestPasswordChangeToAPI((res) => {
                if (res.success) {
                    this.informUserPasswordResetHasBeenSent()
                }
                else {
                    var resStr = 'Sorry we could not reset your password. Please try again later or contact support.'
                    if (res.message) {
                        if (res.message === 'noUserEmailFound') resStr = 'This email was not found in our system. Please check that the email is correct.'
                    }
                }
            })
        },

        sendRequestPasswordChangeToAPI(cb) {
            var req = {
                userEmail: this.userEmail,
                environment: this.environmentName
            }

            k('requestPasswordChange req: ', req)

            this.api.post(this.api.apiv4Route + 'api/user/requestPassword', req, (res) => {
                k('request password change res: ', res)

                cb(res)
            })
        },

        showBadPasswordDialog(cb) {

            this.$q.dialog({
                title: 'Oops!',
                message: 'The password you entered doesn’t match the one we have on file for you.',
                ok: {
                    label: 'Reset password'
                },
                cancel: {
                    label: 'Enter password again'
                }
            }).then(() => {
                cb('resetPassword')
            }).catch(() => {
                cb('tryAgain')
            })
        },

        informUserPasswordResetHasBeenSent() {
            this.$q.dialog({
                title: 'Your password reset email has been sent!',
                message: 'Please check your email for the link to reset your password.'
            })
        },

        removeLocalStorageItems(keys2remove) {
            k('removeLocalStorageItems: ', keys2remove)
            keys2remove.forEach((key) => {
                this.localStorage.remove(key)
            })
        },

        signout() {
            cookies.resetCookie('userLoginToken')
            cookies.resetCookie('userSessionToken')
            cookies.resetCookie('userSessionKey')

            this.removeLocalStorageItems(['purple_CipherText', 'purple_Salt'])

            if (window.userLoggedInToFB) {
                FB.logout((response) => {
                    k('person is now logged out of FB')
                    window.location.reload()
                });
            } else {
                window.location.reload()
            }
        }
    }
}