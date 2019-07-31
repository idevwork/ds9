<template>
    
    <div class="row" style="videoRowStyle">
        <div v-if="!videoCardModalSrc" class="well row justify-center" style="margin: 0; width: 100%;">

            <div v-for="card in componentData.cards" class="col-sm-12 col-md-4" align="center" @click="openVideo(card)" style="color: white; cursor: pointer;">
                <img :src="'https://f3r6v6t8.ssl.hwcdn.net/static/clients/' + card.imageSrc" style="border: 2px solid #0c08b4; max-height: 10rem; max-width: 100%; margin: 0 auto;" />
            </div>

        </div>
        
        <div v-if="videoCardModalSrc" class="well row">
            <div class="col-12" style="max-width: 500px; margin: 0 auto;">
                <q-btn flat size="sm" @click="videoCardModalSrc = ''" style="float: right; padding: .5rem;">
                    <q-icon name="fa-times" />
                </q-btn>

                <video id="modalVideo" :src="'https://f3r6v6t8.ssl.hwcdn.net/static/clients/digitalnightclubbarandrestauranttraining/promovideos/' + videoCardModalSrc" autoplay controls style="width: 100%; height: auto;"></video>
            </div>
        </div>
    </div>
    
</template>

<script>
    export default {
        props: ['componentData'],
        
        computed: {
            videoRowStyle() {
                return 'background: ' + (this.componentData.backgroundColor || '#efefef') + '; padding: 0;'
            }    
        },
        
        data() {
            return {
                videoCardModalSrc: '',
                videoCardModalTitle: ''
            }
        },
        
        created() {
        
        },
        
        methods: {
            openVideo(card) {
                k('openVideo: ', card)
                
                this.videoCardModalTitle = card.header
                this.videoCardModalSrc = card.videoFilename
                // document.getElementById('modalVideo').play()

            }
        }
    }
</script>