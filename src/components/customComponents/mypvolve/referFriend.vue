<template>

    <div class="row">
        <div class="col-sm-12">
            
            <div v-if="!userInfo.firstName || !userInfo.lastName" class="row" align="left">
                <h6 class="col-12" style="padding: 0 .5rem;">Your Name</h6>
                
                <div class="col-sm-12 col-md-6" style="padding: 0 .5rem;">
                    <q-input
                        v-model="firstName"
                        type="text"
                        :attributes="{autocompletetype: 'given-name', autocorrect: 'off'}"
                        float-label="your first name"
                        class="inputBox"
                        color="grey-7"
                        v-mask="'SSSSSSSSSSSSSSSSSSSSSSSSSSSSS'"
                    />
                </div>

                <div class="col-sm-12 col-md-6" style="padding: 0 .5rem;">
                    <q-input
                        v-model="lastName"
                        type="text"
                        :attributes="{autocompletetype: 'family-name', autocorrect: 'off'}"
                        float-label="your last name"
                        class="inputBox"
                        color="grey-7"
                        v-mask="'SSSSSSSSSSSSSSSSSSSSSSSSSSSSS'"
                    />
                </div>
            </div>
            
            <div class="row" align="left">
                <h6 class="col-12" style="margin-top: 1rem; padding: 0 .5rem;">Who should we send this to?</h6>
                
                <q-field
                    class="col-12"
                    :error="referFriendFormError.friendsEmail"
                    error-label="Please enter a valid email."
                    style="padding: 0 .5rem;"
                >
                    <q-input v-model="friendsEmail" @input="referFriendFormError.friendsEmail = false" type="email" color="grey-7" class="full-width refer-a-friend__email-input inputBox" float-label="Your friends' email addresses" />
                </q-field>
            </div>
            
            <div v-if="emailSent" class="monty" style="color: #fff; background-color: #868e9a; padding: .5rem; margin: 0 .5rem;">
                <q-icon name="fa-check"></q-icon> Invitation sent to {{ emailSent }}
            </div>
            
            <q-btn outline @click="sendIt()" :style="`color: ${buttonColor ? '#fff' : '#333'}; background: ${buttonColor ? buttonColor : '#fff'} !important; margin: .5rem;`">
                <h6 style="font-size: .8rem; letter-spacing: 1px;">Send Invite(s)</h6>
            </q-btn>
            
            <p class="monty" style="font-weight: 100; font-size: .9rem;">*To send to multiple people separate email addresses via a comma</p>
        </div>

        <div v-if="!showingMagicLink" class="col-sm-12" style="padding: 1rem .5rem;">
            <p class="monty">Prefer to send them a link yourself?</p>
            <q-btn outline @click="getMagicLink" style="color: #333; background-color: #fff !important;">
                <h6 style="font-size: .8rem; letter-spacing: 1px;">Get Link Instead</h6>
            </q-btn>
        </div>
        
        <div class="col-12 row" v-else style="padding: 1rem .5rem;">
            <div class="col-md-10" style="padding-right: .5rem;">
                <q-input v-model="magicLink" readonly color="grey-7" class="full-width full-width magic-link-input" />
            </div>
            <div class="col-md-2">
                <q-btn outline @click="copyLink" size="sm" class="full-width" style="color: #333; background: #fff !important;">
                    <h6 style="font-size: .8rem; letter-spacing: 1px;">{{ magicLinkCopied ? 'COPIED' : 'COPY' }}</h6>
                </q-btn>
            </div>
        </div>
    </div>
    
</template>

<script>

import { userAndProductInfo } from '../../../mixins/userAndProductInfo'

export default {
    name: 'referFriend',
    
    props: ['buttonColor', 'buttonTextColor', 'promotionID'],
    
    mixins: [ userAndProductInfo ],

    data () {
        return {
            emailSent: '',
            firstName: '',
            lastName: '',
            friendsEmail: '',
            showingMagicLink: false,
            magicLinkCopied: false,
            magicLink: '',
            referFriendFormError: {
                friendsEmail: false
            }
        }
    },
    
    computed: {
        windowWidth() {
            return this.$store.state.windowWidth
        },
        
        userInfo() {
            return this.$store.state.user.info        
        },
        
        environmentName() {
            return this.$store.state.environment.name
        },
        
        userFullName() {
            return this.firstName || this.lastName ? `${this.firstName} ${this.lastName}` : ''
        }
    },
    
    methods: {
        sendIt() {
            if ( (this.firstName && (this.firstName !== this.userInfo.firstName)) || (this.lastName && (this.lastName !== this.userInfo.lastName)) ) {
                var req = {
                    userLoginToken: this.userLoginToken,
                    firstName: this.firstName,
                    lastName: this.lastName
                }
                
                k('updateUserInfo req: ', req)
                
                this.updateUserInfo(req, (res) => {
                    if (res.success) {
                        this.$q.notify({
                            message: 'User info saved!',
                            type: 'positive',
                            icon: 'fas fa-check-circle',
                            position: 'bottom-left'
                        })
                        
                        if (this.firstName && this.userInfo && (this.firstName !== this.userInfo.firstName)) this.userInfo.firstName = this.firstName
                        if (this.lastName && this.userInfo && (this.lastName !== this.userInfo.lastName)) this.userInfo.lastName = this.lastName
                    }
                    else {
                        this.$q.notify({
                            message: 'User info was not saved, please try again.',
                            type: 'negative',
                            icon: 'fas fa-exclamation-circle',
                            position: 'bottom-left'
                        })
                    }
                    
                    this.sendReferralEmail()
                })
            } else {
                this.sendReferralEmail()
            }
        },
        
        getMagicLink() {
            if (this.promotionID) {
                let req = {
                	"referringUserID":  this.userInfo.userID,
                    "promotionID": this.promotionID
                }
                
                this.api.post(this.api.apiv4Route + 'api/referral/generateReferralToken', req, (res) => {
                    this.magicLink = `${window.location.host}/trial?referralToken=${res.referralToken}${this.api.whichServer() ? '&e=' + this.environmentName : ''}`
                    this.showingMagicLink = true
                })
            }            
        },
        
        sendReferralEmail() {
            if (!this.friendsEmail || !this.friendsEmail.includes('@') || !this.friendsEmail.includes('.')) {
                this.referFriendFormError.friendsEmail = true
            } else {
                
                let req = {
                    "environment": this.environmentName,
                    "friendsEmails": this.friendsEmail.includes(',') ? this.friendsEmail.split(',') : [this.friendsEmail],
                    "referrerName": this.userFullName ? this.userFullName : this.userInfo.userEmail,
                    "referringUserID": this.userInfo.userID,
                    "promotionID": this.promotionID
                }
                
                k('sendReferralEmail req: ', req)
                
                this.api.post(this.api.apiv4Route + 'api/referral/sendReferralEmail', req, (res) => {
                    k('sendReferralEmail res: ', res)
                    
                    if (res.success) {
                        this.emailSent = this.friendsEmail
                        this.friendsEmail = ''
                    } else {
                        
                    }
                })
            }
        },
        
        copyLink () {
            const magicLink = document.querySelectorAll('.magic-link-input input')[0]
            magicLink.select()
            document.execCommand("Copy");
            this.magicLinkCopied = true
        }
    },
    
    created() {
        if (this.userInfo.firstName) this.firstName = this.userInfo.firstName
        if (this.userInfo.lastName) this.lastName = this.userInfo.lastName
    }
}
</script>

<style scoped>

.refer-a-friend .refer-a-friend__email-input {
    margin: 0px;
    padding-right: 15px;
}
.magic-link-input {
    margin: 0px;
    padding-right: 15px;
}
.refer-a-friend h2 {
    font-size: 2rem;
}
.refer-a-friend .refer-a-friend__section-title {
    margin-top: 25px !important;
    margin-bottom: 25px !important;
}
</style>
