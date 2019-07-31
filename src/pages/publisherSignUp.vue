<template>
    
    <div class="row well">
    
        <div class="col-12">
            <div align="center">
                <img style="max-height: 5rem;" src="https://vault.platformpurple.com/static/shopLogos/purple.png" />
                <h4>Sign up to be a Purple publisher:</h4>
            </div>
    
            <q-card class="pubSignUp">
                <q-card-title align="center">
                    <h5 class="thinHeader">Get started in <span class="thickHeader">60 seconds</span> for <span class="thickHeader">$99:</span></h5>
                </q-card-title>
    
                <q-card-main>
                    <div align="center">
                        <q-checkbox id="agreeToTOS" :error="agreeToTermsError" @blur="agreeToTermsError = false" v-model="agreeToTerms" /> Agree to <a href="http://platformpurple.com/faq/could-i-look-over-your-publisher-agreement" target="_blank">terms and conditions</a>
                    </div>
    
                    <q-field 
                        :error="newOrganizationNameError" 
                        error-label="Please enter a new organization name."
                    >
                        <q-input 
                            id="signUpName" 
                            v-model="$root.$store.state.newOrganizationName" 
                            @input="newOrganizationNameError = false" 
                            float-label="Enter your new organization name" 
                            color="grey-7" 
                        />
                    </q-field>
    
                    <q-btn id="signMeUp" class="full-width bg-purple" @click="goToSignUpRoute()">
                        <h6>Sign me up!</h6>
                    </q-btn>
                </q-card-main>
    
            </q-card>
        </div>
    
    </div>
  
</template>

<script>
    
    export default {
        data() {
            return {
                agreeToTerms: false,
                agreeToTermsError: false,
                newOrganizationNameError: false,
                // newOrganizationName: ''
            }
        },
    
        components: {
            // SigninForm
        },
    
        computed: {
            authenticated() {
                return this.$store.state.user.authenticated
            },
    
            environmentData() {
                return this.$store.state.environment.data
            },
    
            brandColor() {
                return this.$store.state.environment.json ? this.$store.state.environment.json.e.brandColor : ''
            },
    
            userInfo() {
                return this.$store.state.user.info
            },
    
            initialParameters() {
                return this.$store.state.initialParameters
            },
    
            inputStyle() {
                return 'background: ' + (this.brandColor || '#777') + ' !important; color: white;'
            },
    
            newOrganizationName() {
                return this.$store.state.newOrganizationName
            }
    
        },
    
        methods: {
            goToSignUpRoute() {
                if (!this.agreeToTerms || !this.newOrganizationName) {
                    //please agree to terms 
    
                    if (!this.agreeToTerms) {
                        this.agreeToTermsError = true
                        this.$q.notify({
                            message: 'Please agree to the terms and conditions.',
                            type: 'negative',
                            icon: 'fa-exclamation-circle',
                            position: 'bottom-left'
                        })
                    }
    
                    if (!this.newOrganizationName) {
                        this.newOrganizationNameError = true
                        this.$q.notify({
                            message: 'Please enter a new organization name.',
                            type: 'negative',
                            icon: 'fa-exclamation-circle',
                            position: 'bottom-left'
                        })
                    }
    
                    return false
                }
    
                this.route('/content-owner-signup')
            }
        },
    
        watch: {
    
        },
    
        mounted() {
            // console.log('componentData: ', this.componentData)
    
        }
    }
</script>

<style>
    .pubSignUp {
        margin: 0 auto;
        margin-top: 1rem;
        max-width: 750px;
    }
</style>
