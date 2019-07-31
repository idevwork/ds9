<template>

    <div class="row well">
        <div class="col-12">
            <h6 v-if="previouslyOwnedTrial" align="center" style="line-height: 2rem; letter-spacing: 1px;">
                Thanks for trying us out! Sign up for a subscription
                <q-btn flat class="pchip" @click="$emit('subscribe')" :style="`padding: .1rem .5rem; border: 1px solid #333; background: ${ componentData && componentData.chipBackgroundColor ? componentData.chipBackgroundColor : '#fff' }; color: ${ componentData && componentData.chipTextColor ? componentData.chipTextColor : '#333' };`">
                    Here
                </q-btn >
            </h6>

            <h6 v-else align="center" style="line-height: 2rem; letter-spacing: 1px;">
                Not a subscriber? Sign up for a
                <q-btn flat class="pchip" @click="$emit('trial')" :style="`padding: .1rem .5rem; border: 1px solid #333; background: ${ componentData && componentData.chipBackgroundColor ? componentData.chipBackgroundColor : '#fff' }; color: ${ componentData && componentData.chipTextColor ? componentData.chipTextColor : '#333' };`">
                    Free Trial
                </q-btn>
            </h6>

        </div>
    </div>

</template>

<script>
    import { globalComputedData } from '../../../mixins/globalComputedData'
    import { pvolveColors } from './pvolveColors'

    export default {
        props: ['componentData'],

        components: {

        },

        data() {
            return {

            }
        },

        mixins: [globalComputedData, pvolveColors],

        computed: {
            userSubscriptionProductStatusHistory() {
                return this.$store.state.userSubscriptionProductStatusHistory
            },

            previouslyOwnedTrial() {
                return this.userSubscriptionProductStatusHistory && this.userSubscriptionProductStatusHistory.length
            },
        },

        methods: {

        },

        watch: {

        },

        created() {

        }
    }
</script>

<style scoped>
    .pchip {
        /* width: fit-content; */
        color: #fff;
        background: #fff;
        border-radius: .25rem;
        padding: .25rem .5rem;
        margin: 0;
    }
</style>
