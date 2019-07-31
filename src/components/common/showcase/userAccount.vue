<template>

    <div class="bg-grey-2" style="padding: 1rem;">

        <div class="bg-white row justify-center well" style="padding: 2rem 0;">
            <div class="col-12" align="center" style="padding: 0 1rem;">
                <h2 class="text-grey-8">
                    <span class="thinHeader">About</span> <span class="thickHeader"> you</span>
                </h2>
                <p>
                    Update your name, email or password here. (Leave the password fields blank if you do not wish to change your password.)
                </p>
            </div>

            <div class="col-sm-12 col-lg-6" style="padding: 1rem;">

                <!--<h5>-->
                <!--    <q-icon name="fa-info" style="font-size: 1.5rem; vertical-align: middle;" /> -->
                <!--    Update Account Info-->
                <!--</h5>-->

                <div class="row">
                    <div class="col-md-6" style="padding: 0 .5rem;">
                        <q-input
                            class="inputBox"
                            :attributes="{autocompletetype: 'given-name', autocorrect: 'off'}"
                            color="grey-7"
                            v-model="firstName"
                            type="text"
                            float-label="First Name"
                        />
                    </div>
                    <div class="col-md-6" style="padding: 0 .5rem;">
                        <q-input
                            class="inputBox"
                            :attributes="{autocompletetype: 'family-name', autocorrect: 'off'}"
                            color="grey-7"
                            v-model="lastName"
                            type="text"
                            float-label="Last Name"
                        />
                    </div>
                    <div class="col-12" style="padding: 0 .5rem;">
                        <q-input
                            class="inputBox"
                            :attributes="{autocompletetype: 'email', autocorrect: 'off'}"
                            color="grey-7"
                            v-model="newUserEmail"
                            type="email"
                            float-label="Update email"
                        />
                    </div>
                    <div class="col-md-6" style="padding: 0 .5rem;">
                        <q-input
                            class="inputBox"
                            :attributes="{autocompletetype: 'new-password', autocorrect: 'off'}"
                            color="grey-7"
                            v-model="userPassword"
                            type="password"
                            float-label="Update Password"
                        />
                    </div>
                    <div class="col-md-6" style="padding: 0 .5rem;">
                        <q-input
                            class="inputBox"
                            :attributes="{autocompletetype: 'new-password', autocorrect: 'off'}"
                            color="grey-7"
                            v-model="userPassword2"
                            type="password"
                            float-label="Confirm Password"
                        />
                    </div>

                    <div class="col-12" align="center" style="padding: 1rem .5rem 0;">
                        <q-btn outline @click="updateInfo()" size="lg" :style="`background: ${brandColor} !important; color: #fff;`">
                            <h6 style="font-size: .8rem; letter-spacing: 1px;">Update Your Account</h6>
                        </q-btn>
                    </div>
                </div>

            </div>
        </div>

        <div v-if="showUpdateCardInfo" class="bg-white row justify-center well" style="padding: 2rem 0; margin-top: 1rem;">
            <div class="col-12" align="center" style="padding: 0 1rem;">
                <h2 class="text-grey-8">
                    <span class="thinHeader">Update</span> <span class="thickHeader"> card</span>
                </h2>
                <p>
                    Enter your new payment details or cancel your subscription.
                </p>
            </div>

            <div class="col-sm-12 col-lg-6" align="center" style="padding: .5rem; position: relative;">

                <q-inner-loading :visible="cardInfoUpdateLoad" />

                <div v-if="!cardInfoUpdateLoad">

                    <CreditCardFields
                        :submitButtonLabel="'Update Card Details'"
                        :buttonColor="brandColor"
                        :hidePaypal="true"
                        :hideSaveInfo="true"
                        @newCardDetails="setCardDetails"
                        @submitPayment="updateCardInfo"
                    />

                </div>

                <q-btn outline color="red" @click="clickToCancelAutoRenew()">
                    <h6 style="font-size: .8rem; letter-spacing: 1px;">Cancel Subscription</h6>
                </q-btn>
            </div>
        </div>

        <!-- areYouSureYouWantToCancel modal-->
        <q-modal v-model="cancellationModalOpen" :content-css="cancellationSurveyModalCSS">

            <div v-if="modalContent === 'AreYouSure'">
                <div style="padding: 1rem;">
                    <div class="monty" style="font-size: 140%; margin-bottom: 1rem;">Are you sure?</div>
                    <p>You have selected to cancel this auto renewal. Are you sure you want to cancel?</p>
                    <div class="float-right" style="padding: 1rem;">
                        <q-btn outline @click="closeCancellationModal">Never mind</q-btn>
                        <q-btn outline color="red" @click="sendCancelToAPI">Confirm renewal cancellation</q-btn>
                    </div>
                </div>
            </div>

            <div v-if="modalContent === 'cancellationSurvey'">
                <q-modal-layout>
                    <q-toolbar slot="header" :style="'background: ' + accentMedium3 + ';'">
                        <div class="q-toolbar-title">
                            <h5>Cancel subscription</h5>
                        </div>
                    </q-toolbar>

                    <div class="layout-padding">
                        <div class="monty" style="font-size: 1.6rem;">
                            We’re sorry to see you go!
                            <span style="font-size: 1rem;">
                                <br />Could you take a moment to help us improve?
                            </span>
                        </div>

                        <h6 class="monty text-white bg-grey-5" style="padding: .7rem;">
                            Please check all that apply:
                        </h6>

                        <q-option-group
                            type="checkbox"
                            color="grey-8"
                            v-model="cancelSurveyGroup"
                            :options="cancellationSurveyQuestions"
                        />

                        <q-input
                            v-model="cancellationComments"
                            type="textarea"
                            float-label="What could we have done better?"

                        />

                    </div>

                    <div class="row" align="center" style="margin-top: 0rem;">
                        <div class="col">
                            <q-btn @click="closeCancellationSurveyAndReset" :style="goBackButtonStyle">
                                <q-icon name="fa-chevron-left" />
                                <h6>go back</h6>
                            </q-btn>
                        </div>

                        <div class="col">
                            <q-btn @click="sendSurveyToAPI" color="red">
                                <h6>submit</h6>
                                <q-icon name="fa-chevron-right" />
                            </q-btn>
                        </div>
                    </div>

                </q-modal-layout>
            </div>
        </q-modal>

        <div class="bg-white row justify-center well" style="padding: 2rem .5rem; margin-top: 1rem;">
            <div class="col-12" align="center" style="padding 1rem;">
                <h2 class="text-grey-8">
                    <span class="thinHeader">Account</span> <span class="thickHeader"> history</span>
                </h2>

                <p class="text-grey">
                  View your account history and cancel subscriptions.
                </p>
            </div>

            <div class="col-sm-12" style="padding: .5rem;">

                <q-inner-loading :visible="userHistoryLoaderShow" />

                <div class="row" v-if="!userHistoryLoaderShow">

                    <h4 class="col-12 text-grey-8" style="margin: 0 0 1rem;">Product Access Status</h4>

                    <h6 class="col-12" v-if="productAccessForEnv && !productAccessForEnv.length">No product access.</h6>

                    <div v-if="productAccessForEnv && productAccessForEnv.length" class="gt-sm col-12 row" style="padding: .5rem 0;">
                        <div class="col-md-3 tableHead">Product</div>
                        <div class="col-md tableHead">Start Date</div>
                        <div class="col-md tableHead">End Date</div>
                        <div class="col-md tableHead">Access Status</div>
                        <div class="col-md tableHead">Next Renewal Date</div>
                        <div class="col-md tableHead">Recurring Amount</div>
                    </div>

                    <div v-if="productAccessForEnv && productAccessForEnv.length" class="col-12 row" v-for="item in productAccessForEnv" style="padding: .5rem 0; border-bottom: 1px solid #eee;">
                        <div class="col-sm-12 col-md-3 tableCol">
                            <span class="lt-md tableHead">Product: </span> {{ item.productName }}
                        </div>
                        <div class="col-sm-12 col-md tableCol">
                            <span class="lt-md tableHead">Start Date: </span> {{ item.startDateTime ? moment(item.startDateTime).format('MM/DD/YY') : '' }}
                        </div>
                        <div class="col-sm-12 col-md tableCol">
                            <span class="lt-md tableHead">End Date: </span>{{ item.endDate ? moment(item.endDate).format('MM/DD/YY') : '' }}
                        </div>
                        <div class="col-sm-12 col-md tableCol">
                            <span class="lt-md tableHead">Access Status: </span>

                            <span v-if="item.accessStatus" :style="`color: ${item.accessStatus !== 'inactive' ? 'green' : 'red'}`">{{ accessStatusMap[item.accessStatus] }}</span>

                            <span v-if="itemIsCurrentSubscription(item)">
                                <q-btn outline color="red" class="monty" size="sm" @click="clickToCancelAutoRenew(item)" style="margin-top: .5rem;">Cancel Auto Renew</q-btn>
                            </span>
                        </div>
                        <div class="col-sm-12 col-md tableCol">
                            <span class="lt-md tableHead">Next Renewal Date: </span> {{ item.renewalStatus && item.renewalStatus !== 'renewal cancelled' ? moment(item.renewalStatus).format('MM/DD/YY') : item.renewalStatus === 'renewal cancelled' ? 'Renewal Cancelled' : ''}}
                        </div>
                        <div class="col-sm-12 col-md tableCol">
                            <span class="lt-md tableHead">Recurring Amount: </span> {{ numeral(item.recurringAmount).format('$0.00') }}
                        </div>
                    </div>
                </div>

                <div v-if="!userHistoryLoaderShow" style="border-top: 1px solid #777; margin: 2rem 0;"></div>

                <div class="row" v-if="!userHistoryLoaderShow">

                    <h4 class="col-12 text-grey-8" style="margin: 0 0 1rem;">Transaction History</h4>

                    <h6 class="col-12 text-grey-8" v-if="transactionHistoryForEnv && !transactionHistoryForEnv.length">No transaction history.</h6>

                    <div v-if="transactionHistoryForEnv && transactionHistoryForEnv.length" class="gt-sm col-12 row" style="padding: .5rem 0;">
                        <div class="col-md-3 tableHead">Product</div>
                        <div class="col-md tableHead">Date</div>
                        <div class="col-md tableHead">Coupon Used</div>
                        <div class="col-md tableHead">Shop</div>
                        <div class="col-md tableHead">Purchase Amount</div>
                    </div>

                    <div v-if="transactionHistoryForEnv && transactionHistoryForEnv.length" class="col-12 row" v-for="item in transactionHistoryForEnv" style="padding: .5rem 0; border-bottom: 1px solid #eee;">
                        <div class="col-sm-12 col-md-3 tableCol">
                            <span class="lt-md tableHead">Product: </span> {{ item.productName }}
                        </div>
                        <div class="col-sm-12 col-md tableCol">
                            <span class="lt-md tableHead">Date: </span> {{ moment(item.dateTime).format('MM/DD/YY') }}
                        </div>
                        <div class="col-sm-12 col-md tableCol">
                            <span class="lt-md tableHead">Coupon Used: </span>{{ item.couponCodeUsed }}
                        </div>
                        <div class="col-sm-12 col-md tableCol">
                            <span class="lt-md tableHead">Shop: </span> {{ item.shopName }}
                        </div>
                        <div class="col-sm-12 col-md tableCol">
                            <span class="lt-md tableHead">Purchase Amount: </span> {{ numeral(item.productSoldFor).format('$0.00') }}
                        </div>
                    </div>

                </div>

            </div>
        </div>

    </div>

</template>

<script>
    import { purchaseAndActivation } from '../../../mixins/purchaseAndActivation'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
    import CreditCardFields from '../../../components/common/shop/checkout/CreditCardFields'

    export default {
        props: {
          subscriptionCancellationHandler: {
            type: Function
          }
        },
        data() {
            return {
                showAboutYou: true,
                showHistory: true,
                userHistoryLoaderShow: true,

                newUserEmail: '',
                userPassword: '',
                userPassword2: '',

                transactionHistoryForEnv: '',
                productAccessForEnv: '',

                tableColumns: [{
                    name: 'Product',
                    label: 'Product',
                    field: 'productName'
                }, {
                    name: 'Date',
                    label: 'Date',
                    field: 'dateTime'
                }, {
                    name: 'End',
                    label: 'End',
                    field: 'endDateTime'
                }, {
                    name: 'Shop',
                    label: 'Shop',
                    field: 'shopName'
                }, {
                    name: 'Purchase Status',
                    label: 'Purchase Status',
                    field: 'purchaseStatus'
                }, {
                    name: 'Purchase Amount',
                    label: 'Purchase Amount',
                    field: 'productSoldFor'
                }, {
                    name: 'Product Status',
                    label: 'Product Status',
                    field: 'name'
                }],

                cancellationModalOpen: false,
                modalContent: 'AreYouSure',
                itemToCancel: {},
                cancellationSurveyModalCSS: {},
                cancelSurveyGroup: [],
                cancellationComments: '',

                cardDetail: {
                    number: '',
                    name: '',
                    expiry: '',
                    cvc: ''
                },

                cardDetailError: {
                    number: false,
                    name: false,
                    expiry: false,
                    cvc: false
                },

                creditCardExpired: false,
                creditCardAPIError: false,
                cardInfoUpdateLoad: false,

                itemIsCurrentSubscription(item) {
                    return item.accessStatus === 'subscriptionAccess' && !item.masterProduct && item.referenceTransactionID && item.renewalStatus !== 'renewal cancelled'
                },

                accessStatusMap: {
                    ownedAccess: 'Active',
                    subscriptionAccess: 'Active Subscription',
                    rentalAccess: 'Active rental',
                    inactive: 'Inactive'
                }
            }
        },

        components: {
            CreditCardFields
        },

        mixins: [userAndProductInfo, purchaseAndActivation],

        computed: {
            windowWidth() {
                return this.$store.state.windowWidth
            },

            firstName: {
                get() {
                    return this.$store.state.user.info.firstName
                },
                set(newValue) {
                    this.$store.commit('userFirstName', newValue)
                }
            },

            lastName: {
                get() {
                    return this.$store.state.user.info.lastName
                },
                set(newValue) {
                    this.$store.commit('userLastName', newValue)
                }
            },

            userEmail: {
                get() {
                    return this.$store.state.user.info.userEmail
                },
                set(newValue) {
                    this.$store.commit('userEmail', newValue)
                }
            },

            userID() {
                return this.$store.state.user.info.userID
            },

            userLoginToken() {
                return this.$store.state.user.userLoginToken
            },

            environmentName() {
                return this.$store.state.environment.name
            },

            cancellationSurveyQuestions() {
                return this.$store.state.environment.json.cancellationSurvey
            },

            goBackButtonStyle() {
                let maybeBrandColor = this.accentMedium2

                return maybeBrandColor ? 'background: ' + maybeBrandColor + '; color: white;' : 'background: #4caf50;'
            },

            accentMedium2() {
                return this.$store.state.environment.json.e.brandColors && this.$store.state.environment.json.e.brandColors.accentMedium2 || '#757575'
            },

            accentMedium3() {
                return this.$store.state.environment.json.e.brandColors && this.$store.state.environment.json.e.brandColors.accentMedium3 || '#757575'
            },

            brandColor() {
                return this.$store.state.environment.json ? this.$store.state.environment.json.e.brandColor : ''
            },

            showUpdateCardInfo() {
                return this.subscriptionProductIDs ? this.subscriptionProductIDs.length : false
            },

            subscriptionProductIDs() {
                return this.productAccessForEnv ? this.productAccessForEnv.filter((item) => {
                    return this.itemIsCurrentSubscription(item) ? item : false
                }).map((subscriptionItem) => {
                    return subscriptionItem.productID
                }) : []
            },

            topSubscriptionProduct() {
                var topProduct
                for (var i = 0; i < this.productAccessForEnv.length; i++) {
                    if (this.itemIsCurrentSubscription(this.productAccessForEnv[i])) {
                        topProduct = this.productAccessForEnv[i]
                        break;
                    }
                }
                return topProduct
            }
        },

        created() {
            if (this.userEmail) {
                this.newUserEmail = this.userEmail
                this.getUserHistory()
            }
        },

        watch: {
            userEmail() {
                this.newUserEmail = this.userEmail
                this.getUserHistory()
            },

            modalContent() {
                k('modalContent! ', this.modalContent)
            }
        },

        methods: {

            clickToCancelAutoRenew(product) {
                k('clickToCancelAutoRenew: ', product)
                if (!product) {
                    this.itemToCancel = this.topSubscriptionProduct
                } else {
                    this.itemToCancel = product
                }

                if (this.subscriptionCancellationHandler) {
                    this.subscriptionCancellationHandler().then(res => {

                        if (!res.success || res.data.length == 0) {
                            this.$emit('showCustomSubscriptionModal', this.itemToCancel)
                        }
                        else {
                            this.cancellationModalOpen = true
                        }
                    })
                }
                else {
                    this.cancellationModalOpen = true
                }
                
                k('cancellationSurveyQuestions: ', this.cancellationSurveyQuestions)
            },

            closeCancellationModal() {
                this.cancellationModalOpen = false
            },

            sendCancelToAPI() {
                var req = {
                    "environmentName": this.environmentName,
                    "productID": this.itemToCancel.productID,
                    "userLoginToken": this.userLoginToken,
                    "referenceTransactionID": this.itemToCancel.referenceTransactionID
                }

                k('sendCancelToAPI req: ', req)

                this.api.post(`${this.api.apiv4Route}api/user/cancelSubscriptionRenewal`, req, (res) => {
                    k('sendCancelToAPI res: ', res)

                    if (res.success) {
                        this.getUserHistory()

                        this.$q.notify({
                            message: 'Auto Renewal succesfully cancelled',
                            type: 'positive',
                            icon: 'fa-check-circle',
                            position: 'bottom-left'
                        })

                        if (this.environment.json.cancellationSurvey){
                            this.modalContent = 'cancellationSurvey'
                            this.cancellationModalOpen = true
                            this.cancellationSurveyModalCSS = {minWidth: '80vw', minHeight: '650px'}
                        } else {
                            this.cancellationModalOpen = false
                        }
                    } else {
                        this.$q.notify({
                            message: 'Error: Auto Renewal not cancelled',
                            type: 'negative',
                            icon: 'fa-exclamation-circle',
                            position: 'bottom-left'
                        })
                    }
                })
            },

            closeCancellationSurveyAndReset() {
                this.cancellationModalOpen = false
                this.cancellationSurveyModalCSS = {}
                this.cancelSurveyGroup = []
                this.modalContent = 'AreYouSure'
            },

            sendSurveyToAPI() {
                this.api.sendEvent({
                    eventType: "subscriptionCancellation",
                    eventDesc: "user cancelled subscription to " + this.itemToCancel.productName,
                    productName: this.itemToCancel.productName,
                    productID: this.itemToCancel.productID,
                    userID: this.userID,
                    cancellationReasons: this.cancelSurveyGroup,
                    cancellationComments: this.cancellationComments
                })
                this.closeCancellationSurveyAndReset()
            },

            getTransactionHistoryForEnv() {
                var req = {
                    environment: this.environmentName,
                    userLoginToken: this.userLoginToken
                }
                k('getTransactionHistoryForEnv req: ', req)

                this.api.post(`${this.api.apiv4Route}api/user/transactionHistory4Env`, req, (res) => {
                    k('getTransactionHistoryForEnv res: ', res)

                    if (res.success && res.data) {
                        k('user history successs! ', res)

                        this.userHistoryLoaderShow = false
                        this.transactionHistoryForEnv = res.data

                    } else {
                        this.$q.notify({
                            message: 'Sorry, could not retrieve your user history.',
                            type: 'negative',
                            icon: 'fa-exclamation-circle',
                            position: 'bottom-left'
                        })
                    }
                })
            },

            getProductAccessForEnv() {
                var req = {
                    environment: this.environmentName,
                    userLoginToken: this.userLoginToken
                }
                k('getProductAccessForEnv req: ', req)

                this.api.post(`${this.api.apiv4Route}api/user/productAccess4Env`, req, (res) => {
                    k('getProductAccessForEnv res: ', res)

                    if (res.success && res.data) {
                        k('user history successs! ', res)

                        this.userHistoryLoaderShow = false
                        this.productAccessForEnv = res.data

                        k('subscriptionProductIDs: ', this.subscriptionProductIDs)

                        // this.$q.notify({
                        //     message: 'Got user history!',
                        //     type: 'positive',
                        //     icon: 'fa-check-circle',
                        //     position: 'bottom-left'
                        // })
                    } else {
                        this.$q.notify({
                            message: 'Sorry, could not retrieve your user history.',
                            type: 'negative',
                            icon: 'fa-exclamation-circle',
                            position: 'bottom-left'
                        })
                    }
                })
            },

            getUserHistory() {
                this.userHistoryLoaderShow = true

                this.getTransactionHistoryForEnv()
                this.getProductAccessForEnv()
            },

            updateInfo() {

                // validate user email
                // update userInfo
                // if new password info, send new password

                // check if user entered a password
                // check password fields against one another
                // if all good then send password change request
                k('update user info')
                var req = {
                    "firstName": this.firstName,
                    "lastName": this.lastName,
                    "userEmail": this.newUserEmail,
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
                    } else {
                        if (this.userPassword.length > 0) {
                            this.$q.notify({
                                message: 'Sorry, something went wrong with your password change. Please contact support.',
                                type: 'negative',
                                icon: 'fa-exclamation-circle',
                                position: 'bottom-left'
                            })
                            this.data.userPassword = ''
                            this.data.userPassword2 = ''
                        }
                        else {
                            k('show negative')
                            var message
                            if (res.messageCode === 'emailAlreadyExists') {
                                message = 'Sorry, that email address is already assigned to another account. Please contact our support team to help merge your accounts.'
                            } else {
                                message = 'Sorry, something went wrong with your user info update, please try again later.'
                            }
                            this.$q.notify({
                                message: message,
                                type: 'negative',
                                icon: 'fa-exclamation-circle',
                                position: 'bottom-left'
                            })
                        }
                    }
                })
            },

            setCardDetails(data) {
                k('setCardDetails: ', data)
                this.cardDetail = data
            },

            updateCardInfo() {
                if (this.validatePaymentInfo()) this.sendCardInfoToAPI()
            },

            sendCardInfoToAPI() {
                this.cardInfoUpdateLoad = true

                var req = {
                    "subscriptionProductIDs": this.subscriptionProductIDs,
                    "environment": this.environmentName,
                	"userLoginToken": this.userLoginToken,
                	"creditCard": this.cardDetail.number,
                	"expirationMonth": this.expiryMonth,
                	"expirationYear": this.expiryYear,
                	"cvv": this.cardDetail.cvc
                }

                k('updateCardInfo req: ', req)

                this.api.post(`${this.api.apiv4Route}api/shop/updateRecurringBillingAcctForSubscriptionProducts`, req, (res) => {
                    k('updateCardInfo: ', res)
                    this.cardInfoUpdateLoad = false

                    if (res.success) {
                        this.cardDetail.number = ''
                        this.cardDetail.name = ''
                        this.cardDetail.expiry = ''
                        this.cardDetail.cvc = ''

                        this.$q.notify({
                            message: 'Your card has been updated!',
                            type: 'positive',
                            icon: 'fa-check-circle',
                            position: 'bottom-left'
                        })
                    } else {
                        this.$q.notify({
                            message: 'There was a problem updating your card info. Please try again or contact support.',
                            type: 'negative',
                            icon: 'fa-exclamation-circle',
                            position: 'bottom-left'
                        })
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .renewalTag {
        background: #efefef;
        padding: .25rem;
        margin: .25rem 0;
        width: fit-content;
        width: -moz-fit-content;
    }
</style>

<style>
    .tableHead {
        font-size: .7rem;
        color: #444;
        padding: 0 .25rem 0;
    }

    .tableCol {
        padding: .25rem;
    }
</style>
