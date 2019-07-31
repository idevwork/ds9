import { authentication } from './authentication'

export const social = {
    
    mixins: [authentication],
    
    computed: {
        environment() {
            return this.$store.state.environment
        },
        
        includeSocialLogin() {
            return this.environment.json ? this.environment.json.e.includeSocialLogin : false
        }
    },
    
    methods: {
        share2Facebook(product) {
            // k('share to fb: ', product)

            var defaultShareURL = 'https://share' + this.api.whichServer() + '.platformpurple.com/product-preview/' + this.environment.name + '/' + product.productID
            
            var url = 'https://www.facebook.com/sharer/sharer.php?u=' + 
                (product.productJSON && product.productJSON.shareURL ? product.productJSON.shareURL : 
                this.environment.json && this.environment.json.e.shareURL ? this.environment.json.e.shareURL : 
                defaultShareURL)
            // open external fb share dialog
            var w = window.open(
                url,
                'name',
                'width=600,height=400,toolbar=0,menubar=0,location=-100,status=1,scrollbars=0,resizable=0')
            w.focus()
        },

        share2Twitter(product) {
            // k('share to twitter: ', product)

            var defaultShareURL = 'https://share' + this.api.whichServer() + '.platformpurple.com/product-preview/' + this.environment.name + '/' + product.productID
            
            var url = 'https://www.twitter.com/share?url=' + 
                (product.productJSON && product.productJSON.shareURL ? product.productJSON.shareURL : 
                this.environment.json && this.environment.json.e.shareURL ? this.environment.json.e.shareURL : 
                defaultShareURL)
            
            var w = window.open(
                url, 
                'name', 
                'width=600,height=400,toolbar=0,menubar=0,location=-100,status=1,scrollbars=0,resizable=0')
            w.focus()
        },
        
        fbLogin(cb) {
            FB.login((res) => {
                // Handle the response object, like in statusChangeCallback() in our demo
                // code.
                kw('FB LOGIN RES: ', res)
                
                if (res.authResponse) {
                    window.userLoggedInToFB = true
                    this.sendFBAuthToPurple(res.authResponse, cb)
                }
            }, {scope: 'public_profile,email'});
        },

        googleLogin(cb) {
            gapi.auth2.getAuthInstance().currentUser.listen((currentUser) => {
                k('current googleAuth user: ', currentUser)
                this.sendGoogleAuthToPurple(gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse(), cb)
            })
            
            gapi.auth2.getAuthInstance().signIn()
        },
        
        sendFBAuthToPurple(authRes, cb) {
            // https://api-v4-dev2.platformpurple.com/api/auth/facebook
            // {
            // 	"accessToken": "EAAYXqKYXAmcBAMr1aOOZCDrHzm0yHZBZAFgkwGunjDUdWTEOZCqCgySVzXTd8hybztbqPs7cTsPFF9J5cEByjdYIaaf5ZCseSIiyoPUyWjLZAcCCcpmJZCnZCyq2YEiC8ZAqDjLjzqSqt6gk8I19o4UkPxaDDEP4T4KPBZA7v86lmvrLrkr7In1YunwJ91Nek1bVXqsmS8ons4uAZDZD",
            // 	"userID": "10154848432133573"
            // }

            var route = this.api.apiv4Route + 'api/auth/facebook'

            var req = {
                "accessToken": authRes.accessToken,
                "userID": authRes.userID,
                "reauthorize_required_in": authRes.reauthorize_required_in,
                "appID": this.environment.json.e.includeSocialLogin.facebookAppID
            }
            
            k('sendFBAuthToPurple route req: ', route, req)

            this.api.post(route, req, (res) => {
                k('sendFBAuthToPurple res: ', res)

                if (res.success && res.userLoginToken) {
                    var logEventObj = {
                        eventType: 'userSignedInWithFB',
                        userEmail: this.userEmail,
                        userID: res.userID,
                        os: this.userAgentInfo.os.name,
                        referrer: document.referrer
                    }
                    this.api.sendEvent(logEventObj)
                    
                    cb(res)
                } else {
                    cb(false)                    
                }
            })
        },
        
        sendGoogleAuthToPurple(authRes, cb) {
            if (!authRes.access_token) {
                k('why no googleAuth token?')
                return false
            }
            
            var route = this.api.apiv4Route + 'api/auth/google'
            
            var req = {
                "accessToken": authRes.access_token,
                "appID": this.environment.json.e.includeSocialLogin.googleAppID,
                "expires_in": authRes.expires_in,
                "projectID": this.environment.json.e.includeSocialLogin.googleProjectID
            }
            
            k('sendGoogleAuthToPurple route req: ', route, req)

            this.api.post(route, req, (res) => {
                k('sendGoogleAuthToPurple res: ', res)
                if (res.success && res.userLoginToken) {
                    var logEventObj = {
                        eventType: 'userSignedInWithGoogle',
                        userEmail: this.userEmail,
                        userID: res.userID,
                        os: this.userAgentInfo.os.name,
                        referrer: document.referrer
                    }
                    this.api.sendEvent(logEventObj)
                    
                    cb(res)
                } else {
                    cb(false)
                }
                
            })
        }
    }
}