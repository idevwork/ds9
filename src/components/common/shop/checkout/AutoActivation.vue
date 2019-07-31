<template>
    <div class="relative-position" style="min-height: 3rem;">
        <q-inner-loading :visible="!codeAccepted" />
        
        <div v-if="codeAccepted">
            <h6 class="text-green" align="center" style="margin: 1rem 0;">You are now connected!</h6>
            
            <div v-if="componentData.productInfo">
                <p style="clear: both;">{{componentData.productInfo.productName}} <span class="float-right">{{numeral(componentData.productInfo.productPrice).format('$0.00')}}</span></p>
            </div>
            
            <q-btn v-if="componentData && componentData.afterActivateContinueButtonAction" size="lg" @click="continueAction()" color="green" class="full-width monty" :style="(buttonColor || brandColor) ? 'background: ' + (buttonColor || brandColor) + ' !important;' : ''">
                CONTINUE
                <q-icon name="fa-caret-right" style="font-size: 1.5rem; margin-left: .5rem;" />
            </q-btn>
        </div>
        
    </div>
</template>

<script>
    import { purchaseAndActivation } from '../../../../mixins/purchaseAndActivation'
    
    export default {
        data() {
            return {
                codeAccepted: false
            }
        },
        
        props: ['componentData', 'buttonColor'],
        
        mixins: [purchaseAndActivation],
        
        methods: {
            
            submitCode() {
                this.activateCode((res) => {
                    if (res) {
                        this.codeAccepted = true
                        
                        this.$root.$emit('activateCodeSuccess')
                    }
                })  
            },
            
            subscribeUserToActivateMailingList(listID) {
                var req = {
                    userEmail: this.userInfo.userEmail,
                    listID: listID,
                    mergeFields: {
                       FNAME: this.userInfo.firstName,
                       LNAME: this.userInfo.lastName
                    }
                }
                
                this.api.post(this.api.apiv4Route + 'api/client/' + this.environment.name + '/subscribeUser2MailingList', req, (res) => {
                    k('subscribeUserToActivateMailingList: ', res)
                })
            },
            
            goToLibrary() {
                this.route('/library')  
            },
            
            continueAction() {
                k('continueAction: ', this.componentData.afterActivateContinueButtonAction)
                
                if (this.componentData.afterActivateContinueButtonAction) {
                    this[this.componentData.afterActivateContinueButtonAction]()
                }
            }
        },
        
        mounted() {
            this.$emit('componentLoaded')
            
            if (this.componentData.activationCode) {
                this.$store.commit('activationCode', this.componentData.activationCode)
                this.submitCode()
            }
        }
    }
</script>

<style>

</style>
