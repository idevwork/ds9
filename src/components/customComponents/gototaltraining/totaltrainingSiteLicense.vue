<template>
    
    <div style="padding: 2rem 0;">
        
        <div style="
            text-align: center; 
            padding: 8rem 0; 
            background: url('https://f3r6v6t8.ssl.hwcdn.net/static/clients/gototaltraining/group-of-business-people.jpg'); 
            background-size: cover; 
            background-position: 50%;"
        >
            <div style="background: rgba(0, 0, 0, .5); padding: 2rem;" class="row" align="center">
                <h2 class="col-12" style="color: white;">
                    <q-icon name="fa-marker" />
                    Get access for your entire organization with Total Training site licenses
                </h2>
                
                <h5 class="col-12" style="color: white;">
                    Contact us about subscriptions and special pricing for your organization.
                </h5>
        
                <div class="col-12" align="center" style="margin-top: 1rem;">
                    <q-btn size="lg" align="center" :style="`background: ${brandColor}; color: #fff;`" @click="route('/contact-us')">
                        <h6>Contact Us</h6>
                    </q-btn>
                </div>
            </div>
            
        </div>
        
        <div style="background: #efefef; padding: 2rem 0;" align="center">
            <img style="margin: 0 auto; max-width: 100%;" src="https://f3r6v6t8.ssl.hwcdn.net/static/clients/gototaltraining/clients.png">
        </div>
    
    </div>
</template>

<script>
    import { globalComputedData } from '../../../mixins/globalComputedData'
    
    export default {
        props: ['componentData'],
        
        mixins: [globalComputedData],
        
        computed: {
            contactUs() {
                return this.componentData.contactUs ? this.componentData.contactUs : 'mailto:brad@totaltraining.com?subject=Total%20Training%20Site%20License%20Inquiry&amp;body=Hello%20Brad%2C%20we%20are%20interested%20in%20a%20Total%20Training%20site%20license.%20Could%20you%20call%20me%20to%20discuss?'
            }
        }
    }
</script>