<template>
    <div class="relative-position">
        <div v-if="!codeAccepted">
            
            <div v-if="componentData.productInfo" style="padding: 0 1rem;">
                <p class="monty" style="font-size: .9rem; clear: both;"><span style="margin-right: .5rem;">{{componentData.productInfo.productName}}</span> <span class="float-right">{{numeral(componentData.productInfo.productPrice).format('$0.00')}}</span></p>
                <p class="monty" style="font-size: .9rem; clear: both;"><strong>Total: <span class="float-right">{{numeral(componentData.productInfo.productPrice).format('$0.00')}}</span></strong></p>
            </div>
            
            <q-input 
                class="inputBox" 
                color="grey" 
                float-label="Enter VIP Access Code" 
                v-model="$store.state.activationCode"
            />
            
            <div class="row cursor-pointer q-mb-md" v-if="componentData.enableTermsOfService">
                <div class="col-1" align="center">
                    <q-checkbox color="#000" v-model="generalTermsOfServiceAcceptance" />
                </div>
                <div class="col-11" style="font-size: 13px; margin-top: 5px;">
                    <h6>
                        <span @click="generalTermsOfServiceAcceptance = !generalTermsOfServiceAcceptance">
                            I have read and agree to the
                        </span>
                        <span :style="{ color: componentData.termsOfServiceTextColor || '#000' }" @click="navigateToTermsOfService()"> 
                            terms of service
                        </span>
                    </h6>
                </div>
            </div>
            
            <div :class="['q-py-sm', { 'rounded': roundedDesign }, 'error-field-color']" align="center" v-if="termsOfServiceErrorMessage">
                {{ termsOfServiceErrorMessage }}
            </div>
            
            <q-btn size="lg" @click="submitCode()" color="green" class="full-width monty" :style="(buttonColor || brandColor) ? 'background: ' + (buttonColor || brandColor) + ' !important;' : ''">
                <h6 class="thickHeader">{{ componentData.submitButtonLabel }}</h6>
                <q-icon name="fa-caret-right" style="font-size: 1.5rem; margin-left: .5rem;" />
            </q-btn>
        </div>
        
        <div v-else>
            <h6 class="text-green" style="margin: .5rem 0;">CODE ACCEPTED</h6>
            
            <div v-if="componentData.productInfo">
                <p style="clear: both;">{{componentData.productInfo.productName}} <span class="float-right">{{numeral(componentData.productInfo.productPrice).format('$0.00')}}</span></p>
                <p style="clear: both;"><strong>VIP access code: <span class="float-right">-{{numeral(componentData.productInfo.productPrice).format('$0.00')}}</span></strong></p>
                <p style="clear: both;"><strong>Total: <span class="float-right">$0</span></strong></p>
            </div>
            
            <q-btn size="lg" @click="continueToLibrary()" color="green" class="full-width monty" :style="(buttonColor || brandColor) ? 'background: ' + (buttonColor || brandColor) + ' !important;' : ''">
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
                // activationCode: '',
                codeAccepted: false,
                generalTermsOfServiceAcceptance: false,
                termsOfServiceErrorMessage: ''
            }
        },
        
        props: ['componentData', 'buttonColor'],
        
        mixins: [purchaseAndActivation],
        
        methods: {
            
            submitCode() {
                if (this.componentData.enableTermsOfService && !this.generalTermsOfServiceAcceptance) {
                    this.termsOfServiceErrorMessage = 'Please agree to our terms of service to sign up'
                    return false
                }
                
                this.activateCode((res) => {
                    if (res) {
                        this.codeAccepted = true
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
            
            continueToLibrary() {
                this.route('/library')
            },
            
            navigateToTermsOfService() {
                if (this.componentData.enableTermsOfService && this.componentData.url) {
                    window.open(this.componentData.url, '_blank')
                } else {
                    this.route(this.componentData.route)
                }
            }
        },
        
        mounted() {
            this.$emit('componentLoaded')
        }
    }
</script>

<style>

</style>
