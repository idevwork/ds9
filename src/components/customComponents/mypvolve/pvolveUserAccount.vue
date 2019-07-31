<template>
    
    <div class="bg-grey-2">
        <UserAccount
            ref="userAccount"
            :subscription-cancellation-handler="subscriptionCancellationHandler"
            @showCustomSubscriptionModal="handleCustomSubscriptionModalShow"
        />

        <pVolveSubscriptionCancellationModal
            ref="subscriptionCancellationModal"
            :product="product"
            @keepStreaming="handleKeepStreaming"
            @cancel="handleCancel" 
        />

        <div class="q-px-md">
            <div class="row well bg-white" v-if="creditBalance && creditHistory.length" style="padding: 1rem 0;">
                <div class="col-12 row q-pa-md">
                    
                    <div align="center" class="col-12">
                        <h2 class="text-grey-8">
                            <span class="thinHeader">Credit</span> <span class="thickHeader"> history</span>
                        </h2>
                        <p class="text-grey">
                            Credits will be auto-applied at the end of your current subscription period.
                        </p>
                    </div>
                    
                    <h4 class="col-12 text-grey-8" style="margin: 0px 0px 1rem;">Current balance: {{ currencyFormat(creditBalance) }}</h4>
        
                    <div class="gt-sm col-12 row" style="padding: .5rem 0;">
                        <div class="col-sm-12 col-md tableHead">Date</div>
                        <div class="col-sm-12 col-md tableHead">Credit</div>
                        <div class="col-sm-12 col-md tableHead">Note</div>
                    </div>
        
                    <div class="col-12 row" v-for="(item, index) in creditHistory" :key="index" style="padding: .5rem 0; border-bottom: 1px solid #eee;">
                        <div class="col-sm-12 col-md tableCol">
                            {{ moment(item.dateTime).format('MM/DD/YY') }}
                        </div>
                        <div class="col-sm-12 col-md tableCol">
                            {{ currencyFormat(item.creditAmount) }}
                        </div>
                        <div class="col-sm-12 col-md tableCol">
                            {{ item.eventDesc }}
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>

        <pVolveSubscriptionUpdateModal ref="subscriptionUpdateModal"/>
        
        <galentines v-if="!afterPromotionEnd" />
        
        <referAFriendAd v-else class="q-mt-md" />
    </div>
    
</template>

<script>
    import UserAccount from '../../common/showcase/userAccount'
    import ReferAFriendAd from './referAFriendAd'
    import galentines from './galentines'
    import pVolveSubscriptionCancellationModal from './pVolveSubscriptionCancellationModal'
    import pVolveSubscriptionUpdateModal from './pVolveSubscriptionUpdateModal'
    import { globalComputedData } from '../../../mixins/globalComputedData';

    const EVENT_TYPE_CANCELLATION = 'cancellationOffer50Percentoff'
    const OFFER_NAME_CANCELLATION = 'cancellation50PercentOff'
    const PROMOTION_END = 1550206800000 // Thursday, February 14, 2019 9:00:00 PM GMT-08:00

    export default {
        components: {
            UserAccount,
            ReferAFriendAd,
            galentines,
            pVolveSubscriptionCancellationModal,
            pVolveSubscriptionUpdateModal
        },

        mixins: [globalComputedData],

        data() {
            return {
                showSubscriptionUpdateModal: false,
                product: null,
                creditBalance: 0,
                creditHistory: []
            }
        },

        computed: {
            afterPromotionEnd() {
                k('afterPromotionEnd? ', Date.now(), PROMOTION_END, Date.now() > PROMOTION_END)
                return Date.now() > PROMOTION_END
            }
        },

        methods: {
            handleCancel() {
                k('cancel')
                this.$refs.userAccount.sendCancelToAPI()
            },
            
            /**
             * When user selects Keep Streaming from cancellation offer modal
             */
            handleKeepStreaming() {
                const data = {
                    userLoginToken: this.$store.state.user.userLoginToken,
                    offerName: OFFER_NAME_CANCELLATION,
                    recurringAmount: this.product.recurringAmount
                }
                k('keepStreaming', data)

                const url = `${this.api.apiv4Route}api/client/mypvolve/applyCancellationOffer`

                this.api.post(url, data, res => {
                    k('applyCancellationOffer', res)
                    this.$refs.subscriptionUpdateModal.open()
                })
            },
            
            /**
             * Function to customize subscription cancellation modal opening
             */
            subscriptionCancellationHandler() {
                const data = {
                    userLoginToken: this.$store.state.user.userLoginToken,
                    eventType: EVENT_TYPE_CANCELLATION,
                    environment: this.$root.$store.state.environment.name
                }

                k('subscriptionCancellationHandler', data)

                return new Promise((resolve, reject) => {
                    const url = `${this.api.apiv4Route}api/user/eventQuery`
                    this.api.post(url, data, res => {
                        k('eventQuery', res)
                        resolve(res)
                    })
                })
            },
            
            handleCustomSubscriptionModalShow(product) {
                this.product = product
                
                this.$refs.subscriptionCancellationModal.open()
            },

            getUserCreditBalance() {
                let req = {
                    userLoginToken: this.userLoginToken,
                    affiliateID: this.environmentData.affiliateID
                }

                this.api.post(`${this.api.apiv4Route}api/codes/creditBalance4User`, req, res => {

                    if (res.success) {
                        this.creditBalance = res.creditBalance
                    }

                })
            },

            getUserCreditHistory() {
                let req = {
                    userLoginToken: this.userLoginToken,
                    eventType: 'creditAddedToUserAccount',
                    environment: this.environmentName
                }

                this.api.post(`${this.api.apiv4Route}api/user/eventQuery`, req, res => {

                    if (res.success && res.data.length) {

                        this.creditHistory = res.data.map(item => ({
                            dateTime: item.dateTime,
                            creditAmount: item.creditAmount,
                            eventDesc: item.eventDesc
                        }))

                    }

                })
            }
        },

        mounted() {
            this.getUserCreditBalance()
            this.getUserCreditHistory()
        }
    }
</script>

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