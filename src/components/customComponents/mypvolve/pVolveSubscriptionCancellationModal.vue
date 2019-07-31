<template>

    <q-modal v-model="showSubscriptionCancellationModal" @hide="showSubscriptionCancellationModal = false">
        <div :style="`background-color: ${brandColor}; height: 100%;`">
            <div class="q-pa-md text-white" :style="{ maxWidth: '40rem', margin: '0 auto' }">
    
                <h1>NOT CONVINCED YET?</h1>
                <h1>LET'S CHANGE THAT.</h1>
    
                <h4 class="subtitle q-mt-md">Get your next month of streaming for</h4>
    
                <div class="percent">
                    <div class="value">50%</div>
                    <div class="off">off*</div>
                </div>
    
                <h4>Your only commitment is you.</h4>
                
                <br />
                
                <p class="text-white">* The next month of your subscription will be discounted at 50% your current rate. Subsequent months will be billed at the prior rate unless you request to cancel.</p>
    
                <div class="row actions q-mt-lg">
                    <q-btn class="action q-pa-md q-mb-lg bg-white text-grey-8" label="KEEP STREAMING" @click="keepStreaming" />
                    <q-btn class="action q-pa-md q-mb-md bg-white text-grey-8" label="I WOULD LIKE TO CANCEL" @click="close" />
                </div>
    
            </div>
        </div>
    </q-modal>

</template>

<script>
    import { globalComputedData } from '../../../mixins/globalComputedData';
    const EVENT_TYPE_CANCELLATION_OFFER = 'cancellationOffer50Percentoff'

    export default {
        props: {
            product: {
                type: Object
            },
        },

        mixins: [globalComputedData],

        data() {
            return {
                showSubscriptionCancellationModal: false
            }
        },

        methods: {
            sendCancellationEvent() {
                const sessionInfoEvent = {
                    eventType: EVENT_TYPE_CANCELLATION_OFFER,
                    userID: this.$store.state.user.info.userID
                }
                this.api.sendEvent(sessionInfoEvent)
            },

            keepStreaming() {
                this.sendCancellationEvent()

                this.showSubscriptionCancellationModal = false
                this.$emit('keepStreaming')
            },

            open() {
                this.showSubscriptionCancellationModal = true
            },

            close() {
                this.sendCancellationEvent()

                this.$emit('cancel')
                this.showSubscriptionCancellationModal = false
            }
        }
    }
</script>

<style scoped>
    .subtitle {
        width: 250px;
        line-height: inherit;
    }

    .percent {
        display: flex;
        font-weight: bold;
    }

    .value {
        font-size: 120px;
    }

    .off {
        font-size: 70px;
    }

    .actions {
        display: flex;
        flex-direction: column;
    }

    .action {
        font-size: 18px;
        font-weight: bold;
        display: inline;
        width: 100%;
    }
</style>
