<template>
    
    <div>
            
        <div id="headerColor" class="row well justify-center items-center" style="z-index: 1;  background: rgba(255, 255, 255, .7)">
            
            <div class="col-sm-12 col-md-5" :style="`padding: 1rem;`">
                <h1 :style="`font-size: ${adaptiveFontSize(2)}rem;`">Enter Your Shipping Info</span></h1>
                
                <h4 style="margin: 1rem 0;">Thanks for signing up!</h4>
                <p style="margin: 1rem 0; font-size: 1rem;">Please submit your shipping information so we can have it on file.</p>
            </div>
            
            <div class="col-sm-12 col-md-7" :style="`padding: 1rem;`">
                <q-field
                    :error="fieldError.userEmail"
                    error-label="Please enter your email address."
                    style="padding: 0 .5rem;"
                >
                    <q-input
                        v-model="userEmail"
                        type="email"
                        :attributes="{autocompletetype: 'email', autocorrect: 'off'}"
                        float-label="Email *"
                        class="inputBox"
                        color="grey-7"
                        @input="fieldError.userEmail = false"
                    />
                </q-field>
                
                <div class="row">
                    <div class="col-md-6" style="padding: 0 .5rem;">
                        <q-field
                            :error="fieldError.firstName"
                            error-label="Please enter your first name."
                        >
                            <q-input
                                v-model="firstName"
                                type="text"
                                :attributes="{autocompletetype: 'given-name', autocorrect: 'off'}"
                                float-label="First Name *"
                                class="inputBox"
                                color="grey-7"
                                v-mask="'SSSSSSSSSSSSSSSSSSSSSSSSSSSSS'"
                                @input="fieldError.firstName = false"
                            />
                        </q-field>
                    </div>
    
                    <div class="col-md-6" style="padding: 0 .5rem;">
                        <q-field
                            :error="fieldError.lastName"
                            error-label="Please enter your last name."
                        >
                            <q-input
                                v-model="lastName"
                                type="text"
                                :attributes="{autocompletetype: 'family-name', autocorrect: 'off'}"
                                float-label="Last Name *"
                                class="inputBox"
                                color="grey-7"
                                v-mask="'SSSSSSSSSSSSSSSSSSSSSSSSSSSSS'"
                                @input="fieldError.lastName = false"
                            />
                        </q-field>
                    </div>
                </div>
                
                <q-field
                    style="padding: 0 .5rem;"
                >
                    <q-input
                        v-model="company"
                        type="text"
                        :attributes="{autocompletetype: 'company', autocorrect: 'off'}"
                        float-label="Company"
                        class="inputBox"
                        color="grey-7"
                    />
                </q-field>
                
                <q-field
                    :error="fieldError.address"
                    error-label="Please enter your address."
                    style="padding: 0 .5rem;"
                >
                    <q-input
                        v-model="address"
                        type="text"
                        :attributes="{autocompletetype: 'address-line1', autocorrect: 'off'}"
                        float-label="Street Address *"
                        class="inputBox"
                        color="grey-7"
                        @input="fieldError.address = false"
                    />
                </q-field>
                
                <q-field
                    style="padding: 0 .5rem;"
                >
                    <q-input
                        v-model="address2"
                        type="text"
                        :attributes="{autocompletetype: 'address-line2', autocorrect: 'off'}"
                        float-label="Address 2"
                        class="inputBox"
                        color="grey-7"
                    />
                </q-field>
                
                <div class="row">
                    <div class="col-md-6" style="padding: 0 .5rem;">
                        <q-field
                            :error="fieldError.city"
                            error-label="Please enter your city."
                        >
                            <q-input
                                v-model="city"
                                type="text"
                                :attributes="{autocompletetype: 'city', autocorrect: 'off'}"
                                float-label="City *"
                                class="inputBox"
                                color="grey-7"
                                @input="fieldError.city = false"
                            />
                        </q-field>
                    </div>
    
                    <div class="col-md-6" style="padding: 0 .5rem;">
                        <q-field
                            :error="fieldError.state"
                            error-label="Please enter your state."
                        >
                            <q-input
                                v-model="state"
                                type="text"
                                :attributes="{autocompletetype: 'state', autocorrect: 'off'}"
                                float-label="State *"
                                class="inputBox"
                                color="grey-7"
                                @input="fieldError.state = false"
                            />
                        </q-field>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-6" style="padding: 0 .5rem;">
                        <q-field
                            :error="fieldError.country"
                            error-label="Please enter your country."
                        >
                            <q-input
                                v-model="country"
                                type="text"
                                :attributes="{autocompletetype: 'country', autocorrect: 'off'}"
                                float-label="Country *"
                                class="inputBox"
                                color="grey-7"
                                @input="fieldError.county = false"
                            />
                        </q-field>
                    </div>
    
                    <div class="col-md-6" style="padding: 0 .5rem;">
                        <q-field
                            :error="fieldError.zipcode"
                            error-label="Please enter your last name."
                        >
                            <q-input
                                v-model="zipCode"
                                type="text"
                                :attributes="{autocompletetype: 'zip', autocorrect: 'off'}"
                                float-label="Zip/Postal Code *"
                                class="inputBox"
                                color="grey-7"
                                @input="fieldError.zipcode = false"
                            />
                        </q-field>
                    </div>
                </div>
                
                <div style="padding: .5rem;">
                    <q-btn size="lg" outline @click="collectShippingAddress()" class="full-width" :style="`background: ${brandColor} !important; color: #fff;`">
                        Submit
                    </q-btn>
                </div>
                
            </div>
            
        </div>

    </div>
      
</template>

<script>
    
    import { globalComputedData } from '../../../mixins/globalComputedData'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
    import { designTools } from '../../../mixins/designTools'
    
    export default {
        props: ['componentData'],
        
        components: {

        },
        
        mixins: [designTools, globalComputedData, userAndProductInfo],

        data() {
            return {
                userEmail: '',
                firstName: '',
                lastName: '',
                company: '',
                address: '',
                address2: '',
                city: '',
                state: '',
                country: '',
                zipCode: '',
                
                fieldError: {
                    userEmail: false,
                    firstName: false,
                    lastName: false,
                    address: false,
                    city: false,
                    state: false,
                    country: false,
                    zipCode: false
                }
            }
        },

        computed: {
           
        },

        methods: {
            
            collectShippingAddress() {
                k('collectShippingAddress')  
                
                if (!this.userEmail ||!this.firstName || !this.lastName || !this.address || !this.city || !this.state || !this.country || !this.zipCode) {
                    if (!this.userEmail) this.fieldError.userEmail = true
                    if (!this.firstName) this.fieldError.firstName = true
                    if (!this.lastName) this.fieldError.lastName = true
                    if (!this.address) this.fieldError.address = true
                    if (!this.city) this.fieldError.city = true
                    if (!this.state) this.fieldError.state = true
                    if (!this.country) this.fieldError.country = true
                    if (!this.zipCode) this.fieldError.zipCode = true
                    
                    return false;
                }
                
                let req = {
                    "userEmail": this.userEmail,
                	"firstName": this.firstName,
                	"lastName": this.lastName,
                	"company": this.company,
                	"address1": this.address,
                	"address2": this.address2,
                	"city": this.city,
                	"stateProvince": this.state,
                	"country": this.country,
                	"zipCode": this.zipCode
                }
                
                k('collectShippingAddress req: ', req)  
                
                this.$q.loading.show()
                
                this.api.post(`${this.api.apiv4Route}api/client/mysigningtime/sendUserBillingAddress`, req, (res) => {
                    k('collectShippingAddress req: ', res)  
                    this.$q.loading.hide()
                    
                    if (res.success) {
                        this.$q.notify({
                            message: 'Thank you for submitting your information!',
                            type: 'positive',
                            icon: 'fa-check-circle',
                            position: 'bottom-left'
                        })
                    }
                })
            },
            
            
        },
        
        watch: {
            userInfo() {
                if (this.userInfo && this.userInfo.userEmail) this.userEmail = this.userInfo.userEmail
            }
        },
        
        created() {
            if (this.userInfo && this.userInfo.userEmail) this.userEmail = this.userInfo.userEmail
        }
    }
</script>

<style scoped>

</style>
