<template>
    
    <div id="instantAccessTrial" class="row bg-grey-3 relative-position" style="min-height: 10rem;">
        <q-inner-loading :visible="!showNextSteps">
            <q-spinner size="40px" />
            connecting...
        </q-inner-loading>
        
        <div v-if="showNextSteps" class="col-12">
            <div align="center" style="background: url('https://f3r6v6t8.ssl.hwcdn.net/static/clients/mypvolve/Signup-Background.png'); background-size: cover; padding: 3rem 0; color: #fff;">
                <h1 style="font-size: 4rem;">Congrats!</h1>
                <h2 style="text-transform: none;">Your 15 day FREE trial has been activated!</h2>
            </div>
            
            <div class="well">
                <div :style="'color: ' + pvolveMintTitle + '; font-size: 2.3rem; font-weight: 700;'">just one more step...</div>
                
                <q-card class="full-width bg-white" style="padding: 2rem; margin: 2rem;">
                    <q-card-main class="row">
                        <h6 class="col-12" style="text-transform: none;">Update your account info:</h6>
                        
                        <div class="col-md-6" style="padding: 0 .5rem;">
                            <q-input :attributes="{ autocompletetype: 'given-name', autocorrect: 'off' }" color="grey-7" v-model="firstName" type="text" float-label="First Name" />
                        </div>
                        <div class="col-md-6" style="padding: 0 .5rem;">
                            <q-input :attributes="{ autocompletetype: 'family-name', autocorrect: 'off' }" color="grey-7" v-model="lastName" type="text" float-label="Last Name" />
                        </div>
                        <div class="col-md-6" style="padding: 0 .5rem;">
                            <q-input :attributes="{ autocompletetype: 'new-password', autocorrect: 'off' }" color="grey-7" v-model="userPassword" type="password" float-label="Password" />
                        </div>
                        <div class="col-md-6" style="padding: 0 .5rem;">
                            <q-input :attributes="{ autocompletetype: 'new-password', autocorrect: 'off' }" color="grey-7" v-model="userPassword2" type="password" float-label="Confirm Password" />
                        </div>
                        <div class="col-12" style="padding: 0 .5rem;">
                            <q-btn @click="updateInfo()" class="text-white" :style="'background: ' + pvolveMintTitle + '; margin-top: 2rem;'">
                                <h6>Update Info</h6>
                                <q-icon name="fa-caret-right" class="big-icon" style="margin-left: .5rem !important;" />
                            </q-btn>
                        </div>
                    </q-card-main>
                </q-card>
                
            </div>
        </div>
    </div>
      
</template>

<script>
    import { pvolveColors } from './pvolveColors'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'

    export default {
        
        mixins: [ pvolveColors, userAndProductInfo ],
        
        data() {
            return {
                showNextSteps: false,
                connectedUser: false,
                firstName: '',
                lastName: '',
                userPassword: '',
                userPassword2: ''
            }
        },
        
        created() {
            k('instantAccessTrial: ', this.userLoginToken, this.userInfo)
            
            if (!this.userLoginToken) {
                this.route('/')
                return false
            }
            
            if (this.userInfo && this.environmentProductAndTagState !== 'fetchingWithToken') this.connectUserToTrial()
        },
        
        watch: {
            userInfo() {
                if (this.environmentProductAndTagState !== 'fetchingWithToken') this.connectUserToTrial()
            },
            
            connectedUser() {
                if (this.environmentProductAndTagState === 'fetched' && this.connectedUser) this.route('/library')
            },
            
            environmentProductAndTagState() {
                if (this.connectedUser) {
                    if (this.environmentProductAndTagState === 'fetched') this.route('/library')
                } else {
                    if (this.userInfo && this.environmentProductAndTagState !== 'fetchingWithToken') this.connectUserToTrial()
                }
            }
        },
        
        computed: {
            userLoginToken() {
                return this.$store.state.user.userLoginToken
            },
            
            environmentJSON() {
                return this.$store.state.environment.json
            },
            
            environmentProducts() {
                return this.$store.state.environmentProducts
            },
    
            authenticated() {
                return this.$store.state.user.authenticated
            },
            
            userInfo() {
                return this.$store.state.user.info
            },
            
            environmentProductAndTagState() {
                return this.$store.state.environmentProductAndTagState
            },
        },
        
        methods: {
            connectUserToTrial() {
                k('connectUserToTrial!')
                // https://api-v4-dev2.platformpurple.com/api/client/mypvolve/registerTrial?userEmail=pvolve@platformpurple.com
                
                var req = {
                    userEmail: this.userInfo.userEmail
                }
                
                this.api.post(this.api.apiv4Route + 'api/client/mypvolve/registerTrial', req, (res) => {
                    k('connectUserToTrial: ', res)
                    
                    if (res.success) {
                        this.connectedUser = true
                        this.getProductsAndTags4Environment()
                    }
                    if (!res.success) this.showError(res)
                })
            },
            
            showError(res) {
                var toastString = 'There was a problem connecting you.'
                
                if (res.messageCode) {
                    if (res.messageCode === 'userHasAlreadyRegisteredTrial') {
                        toastString = 'Looks like you are already connected to the trial! You have now been navigated to your library.'
                        this.connectedUser = true
                    }
                }
                
                ke(toastString)
                
                // this.$q.notify({
                //   message: toastString,
                //   type: 'negative',
                //   timeout: 0,
                //   icon: 'fa-exclamation-circle',
                //   position: 'bottom-left'
                // })
            },
            
            updateInfo() {
                // check if user entered a password
                // check password fields against one another
                // if all good then send password change request
                k('update user info')
                var req = {
                    "firstName": this.firstName,
                    "lastName": this.lastName,
                    "userEmail": this.userInfo.userEmail,
                    "userPassword": this.userPassword,
                    "userLoginToken": this.userLoginToken
                }

                if (this.userPassword && this.userPassword != this.userPassword2) {
                    this.$q.notify({
                        message: 'Oops, passwords must match.',
                        type: 'negative',
                        icon: 'fa-exclamation-circle',
                        position: 'bottom-left'
                    })
                    return false
                }
                
                k(j(req))
                
                this.updateUserInfo(req, (res) => {
                    k(res)
                    if (res.success) {
                        this.$q.notify({
                            message: 'User information updated!',
                            type: 'positive',
                            icon: 'fa-check-circle',
                            position: 'bottom-left'
                        })
                        
                        this.getUserInfo(userInfo => {
                            if (userInfo) {
                                this.$store.commit('userInfo', userInfo)
                            }
                        })

                        this.$q.notify({
                           message: '<h6>Your user info has been updated!</h6>',
                           type: 'positive',
                           timeout: 0,
                           icon: 'fa-check-circle',
                           position: 'bottom-right'
                        })
                    }
                    else {
                        var message = 'Sorry, something went wrong with your user info update, please try again later.'
                        
                        if (this.userPassword.length > 0) {
                            this.$q.notify({
                                message: message,
                                type: 'negative',
                                icon: 'fa-exclamation-circle',
                                position: 'bottom-left'
                            })
                            this.data.userPassword = ''
                            this.data.userPassword2 = ''
                        }
                        else {
                            k('show negative')
                            this.$q.notify({
                               message: message,
                               type: 'negative',
                               icon: 'fa-exclamation-circle',
                               position: 'bottom-left'
                            })
                        }
                    }
                })
            }
        }
    }
</script>

<style>

    .floatingBadge {
        position: absolute;
        right: 0;
        top: -1rem;
        padding: .25rem .5rem;
        color: #fff;
        font-size: .8rem;
        font-weight: 700;
        border: 2px solid white;
    }

</style>