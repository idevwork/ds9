<template>
    
    <div class="row well">
            
        <div class="col-xs-12 col-sm-12 col-md-6 q-pa-md">
            <div :style="leftColumnImage" />
        </div>

        <div class="col-xs-12 col-sm-12 col-md-6 text-left monty q-pa-lg">
            <h1 :style="`color: ${ pvolveMintTitle };`">
                Ten workouts in two weeks
            </h1>
            <br />
            <p style="line-height: 2rem;">
                Welcome to the Summer Sprint Challenge! We developed a P.volve program that will allow you to work out alongside the NYC studio. Get ready to transform your body just in time to look and feel your best at the beach.
            </p>
            <br />
            <p style="line-height: 2rem;">
                Let's change the way you take on summer - one sprint at a time!
            </p>
            <p>
                <q-btn
                    v-if="!contestOptIn && !optInPeriodOver"
                    outline
                    size="lg"
                    class="monty q-my-sm"
                    :style="`background: ${pvolveMintBG} !important; color: #fff; padding: .8rem 2rem;`"
                    @click="$emit('launchOptInModal')"
                    >
                    <h6 class="thickHeader" style="font-size: .8rem; letter-spacing: 1px;">Join Challenge</h6>
                </q-btn>
            </p>
        </div>

        <div class="col-12 q-pa-md" style="border-bottom: 1px solid #E5E5E5;"></div>

        <div class="col-xs-12 col-sm-12 col-md-6 text-left monty q-pa-lg">
            <h1 class="text-center" :style="`color: ${ pvolveSalmon } ;`">
                PRIZES
            </h1>
            <p class="text-weight-medium text-center q-mt-xl" style="font-size: 34px;">
                50% off
            </p>
            <p class="text-center" style="font-size: 21px;">
                3 MONTHS STREAMING MEMBERSHIP
            </p>
            <p class="text-center" style="font-size: 21px;">
                & FREE TOTE
            </p>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-6 q-pa-md">
            <div :style="rightColumnImage" />
        </div>
    </div>
    
</template>

<script>
    import { pvolveColors } from './pvolveColors'
    import { globalComputedData } from '../../../mixins/globalComputedData'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
    
    export default {

        props: [ 'componentData', 'contestOptIn', 'optInPeriodOver' ],

        mixins: [ pvolveColors, globalComputedData, userAndProductInfo ],

        components: {
        
        },

        data: () => ({

        }),

        computed: {

            leftColumnImage() {
                return {
                    'background': `url("https://vault.platformpurple.com/static/clients/mypvolve/summerSprint_left_column.jpg")`,
                    'background-position': '50% 0%',
                    'background-size': 'cover',
                    'background-repeat': 'no-repeat',
                    'height': '415px',
                    'padding': this.windowWidth > 992 ? '8rem' : '1rem'
                }
            },

            rightColumnImage() {
                return {
                    'background': `url("https://vault.platformpurple.com/static/clients/mypvolve/summerSprint_right_column.jpg")`,
                    'background-position': '50% 0%',
                    'background-size': 'cover',
                    'background-repeat': 'no-repeat',
                    'height': '415px',
                    'padding': this.windowWidth > 992 ? '8rem' : '1rem'
                }
            }
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
    
</style>
