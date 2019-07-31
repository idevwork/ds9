<template>
    
    <div class="bg-grey-3">
        <div class="row well">
            <div class="col-12" style="padding: .5rem;">
                <helpFAQ v-if="componentData.faqContent" :faqData="componentData.faqContent" :buttonColor="pvolveMintBG" :hideSearch="true" />
            </div>
        </div>
    </div>
      
</template>

<script>
    import { pvolveColors } from './pvolveColors'
    import { globalComputedData } from '../../../mixins/globalComputedData'
    import helpFAQ from '../../common/support/helpFAQ'

    export default {
        props: ['componentData'],

        components: {
            helpFAQ
        },

        data() {
            return {
                messageFieldError: false,
                emailFieldError: false,
                message: '',
                unauthenticatedEmail: ''
            }
        },

        mixins: [pvolveColors, globalComputedData],

        computed: {
 
        },

        methods: {
            sendMessage() {
                if ((!this.userInfo.userEmail && !this.unauthenticatedEmail) || !this.message) {
                    if (!this.message) this.messageFieldError = true
                    return false
                }

                let route = this.api.apiv4Route + 'api/email/send2Support'
                let req = {
                    "environment": this.environmentName,
                    "message": this.message,
                    "from": this.userInfo.userEmail || this.unauthenticatedEmail,
                    "firstName": this.userInfo.firstName
                }
                k('sendMessage req: ', route, req)

                this.api.post(route, req, (res) => {
                    k('sendMessage res: ', res)
                    
                    if (res.success) {
                        this.message = ''

                        this.$q.notify({
                            message: 'Email has been sent!',
                            type: 'positive',
                            icon: 'fas fa-check-circle',
                            position: 'bottom-left'
                        })
                    }
                })
            }
        },

        watch: {

        },

        created() {
            k('environmentJSON: ', this.environmentJSON)
        }
    }
</script>

<style>
    
</style>
