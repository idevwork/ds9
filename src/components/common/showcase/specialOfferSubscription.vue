<template>
    <div :class="[{ rounded: roundedDesign }, 'col-12']" :style="cardStyle" align="center">
        <h2 :style="`color: ${textColor};`" v-if="freeTrialPeriod" class="q-mb-lg">Try it free for {{freeTrialPeriod}} days!</h2>

        <h3 :style="`color: ${textColor};`">{{ title }}</h3>

        <div class="row justify-center" style="margin: 0 -.5rem;">

            <div v-for="(details, index) in offers" class="col" style="padding: 1rem .5rem;">
                <div class="cursor-pointer text-black" :class="{ rounded: roundedDesign }" align="center" :style="`background: ${localOfferProductID === details.offerProductID ? buttonColor : '#cecece' }; padding: 1.7rem .4rem;`" @click="$emit('input', details.offerProductID)">
                    <q-icon :name="localOfferProductID === details.offerProductID ? 'far fa-check-circle' : 'far fa-circle'" :style="`font-size: 1.5rem; color: ${localOfferProductID === details.offerProductID ? '#fff' : textColor};`" />

                    <h5 :style="`margin: 0; color: ${localOfferProductID === details.offerProductID ? '#fff' : textColor};`">{{ details.description }}</h5>

                    <h5 :style="`margin: 0; color: ${localOfferProductID === details.offerProductID ? '#fff' : textColor};`">${{ details.price }}</h5>
                </div>
            </div>

        </div>

        <slot></slot>
    </div>
</template>

<script>
    import { globalComputedData } from '../../../mixins/globalComputedData'

    export default {
        name: 'special-offer-subscription',

        props: ['localOfferProductID', 'componentData'],

        mixins: [ globalComputedData ],

        data () {
            return {

            }
        },

        methods: {

        },

        computed: {
            offers() {
                return this.componentData.specialOffer.offers
            },

            cardStyle() {
                var cardBackgroundColor = this.componentData.specialOffer && this.componentData.specialOffer.backgroundColor ? this.componentData.specialOffer.backgroundColor : '#fff'
                return `background: ${ cardBackgroundColor }; width: 100%; padding: 2rem;`
            },

            buttonColor() {
                var buttonColor = this.componentData.specialOffer && this.componentData.specialOffer.buttonColor ? this.componentData.specialOffer.buttonColor : '#fff'
                return buttonColor
            },

            textColor() {
                var textColor = this.componentData.specialOffer && this.componentData.specialOffer.textColor ? this.componentData.specialOffer.textColor : '#000'
                return textColor
            },

            title() {
                return this.componentData.specialOffer.title
            },

            freeTrialPeriod() {
                return this.componentData.specialOffer.freeTrialPeriod
            },

            roundedDesign() {
                return this.environment.json.e.noRoundedDesign ? false : true
            }
        },

        created() {
            k('specialOffer', this.componentData)
        }
    }
</script>
<style>

</style>