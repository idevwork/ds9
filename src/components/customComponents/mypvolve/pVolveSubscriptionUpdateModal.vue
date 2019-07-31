<template>
    
    <q-modal v-model="subscriptionUpdateModal" :content-css="subscriptionUpdateModalCSS">
        <div class="q-pa-md bg-white">
            <div class="text-center" :style="{ color: brandColor }">
                <h1>YOUR SUBSCRIPTION</h1>
                <h1>HAS BEEN UPDATED!</h1>
            </div>

            <div>
                <h4 class="q-mt-md text-grey-8 text-center">
                    You're a step closer to achieving your goals!
                </h4>
            </div>

            <div class="row justify-center q-mt-xl">
                <q-btn :style="{ backgroundColor: brandColor }" class="action q-pa-md text-white q-px-xl" label="STREAM NOW!" @click="route('/')" />
            </div>
        </div>
    </q-modal>
    
</template>

<script>
    import { globalComputedData } from '../../../mixins/globalComputedData';

    export default {
        mixins: [globalComputedData],
        
        data() {
            return {
                subscriptionUpdateModal: false,
                subscriptionUpdateModalCSS: {
                    minWidth: '50vw',
                    minHeight: '400px'
                }
            }
        },
        
        methods: {
            open() {
                this.subscriptionUpdateModal = true
            }
        }
    }
</script>

<style scoped>
    .action {
        font-size: 18px;
        font-weight: bold;
        width: 100%;
    }
</style>
