<template>

    <div id="thankyouPage" class="row well relative-position" style="min-height: 3rem;">
        <div class="col-12" v-html="receiptHTML" style="border: 1px solid #ccc; overflow: hidden; max-width: 1000px; margin: 0 auto;"></div>

        <q-inner-loading :visible="!receiptHTML" />
    </div>

</template>

<script>

    export default {
        props: ['componentData'],

        data() {
            return {

            }
        },

        computed: {
            environment() {
                return this.$store.state.environment
            },

            homePageData() {
                return this.$store.state.environment.json
            },

            userInfo() {
                return this.$store.state.user.info
            },

            userLoginToken() {
                return this.$store.state.user.userLoginToken
            },

            receiptHTML() {
                return this.$store.state.receiptHTML
            }
        },

        methods: {

        },

        mounted() {
            k('receiptHTML: ', this.receiptHTML)

            if (!this.receiptHTML) {
                this.route('/')
            }
        },

        beforeDestroy () {

        }
    }
</script>

<style>

</style>
