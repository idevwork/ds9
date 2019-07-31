<template>
    
    <div>
        <div class="row" style="padding: 2rem 1rem;">
            <div align="center" class="col-12" style="padding: 2rem;">
                <h2 :style="`text-transform: none; color: ${ componentData && componentData.headerTextColor ? componentData.headerTextColor : pvolveSalmon};`">What do I get access to?</h2>    
            </div>
            
            <div class="col-sm-12 col-md-7" align="center">
                <img style="max-width: 750px; width: 100%;" :src="componentData && componentData.trialVideoImageSrc ? componentData.trialVideoImageSrc : 'https://vault.platformpurple.com/static/clients/mypvolve/trial_video.png'" />
            </div>
            
            <div class="col-sm-12 col-md-5" style="position: relative;">
                <div :style="windowWidth > 767 ? 'position: absolute; top: 50%; transform: translateY(-50%); padding: 2rem;' : 'padding: 2rem;'">
                    <h5 :style="`color: ${ componentData && componentData.headerTextColor ? componentData.headerTextColor : pvolveSalmon}; margin: .5rem 0;`">150+ workout videos</h5>
                    <p class="monty">Detailed instruction for all fitness levels, using various equipment including the proprietary p.band and p.ball.</p>
                </div>
            </div>
        </div>
        
        <div class="row">
            <div class="col-sm-12 col-md-4" align="center" style="padding: 1rem;">
                <img style="max-width: 100%;" src="https://vault.platformpurple.com/static/clients/mypvolve/21_day_calendar_image.jpg" />
                <div style="padding: 1rem; max-width: 400px;">
                    <h6 :style="`color: ${pvolveSalmon}; margin: .5rem 0;`">Structured programs</h6>
                    <p class="monty">Our programs are created by P. to target specific areas of the body in 3 to 30 days.</p>
                </div>
            </div>
            <div class="col-sm-12 col-md-4" align="center" style="padding: 1rem;">
                <img style="max-width: 100%;" src="https://vault.platformpurple.com/static/clients/mypvolve/calendar_in_computer_image.jpg" />
                
                <div style="padding: 1rem; max-width: 400px;">
                    <h6 :style="`color: ${pvolveSalmon}; margin: .5rem 0;`">custom calendar</h6>
                    <p class="monty">Personalized monthly calendar to help you achieve your fitness goals.</p>
                </div>
            </div>
            <div class="col-sm-12 col-md-4" align="center" style="padding: 1rem;">
                <img style="max-width: 100%;" src="https://vault.platformpurple.com/static/clients/mypvolve/phone_app_image.jpg" />
                <div style="padding: 1rem; max-width: 400px;">
                    <h6 :style="`color: ${pvolveSalmon}; margin: .5rem 0;`">the p.volve app</h6>
                    <p class="monty">Downloadable workouts for offline streaming and SMS notifications to help you stay on track!</p>
                </div>
            </div>
        </div>
    </div>
      
</template>

<script>
    
    import { pvolveColors } from './pvolveColors'
    import { globalComputedData } from '../../../mixins/globalComputedData'
    
    export default {
        props: ['componentData'],

        components: {
        },

        data() {
            return {
            }
        },

        mixins: [ pvolveColors, globalComputedData ],

        computed: {
        },

        methods: {
        },

        watch: {

        },

        created() {
        }
    }
</script>

<style>
    
</style>
