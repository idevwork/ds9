<template>
    
    <div class="row">
        <q-icon name="fa-times" @click.native="route('/library')" id="closeX" />
        
        <div v-if="blueRidgeScene === 'blueRidgeMain'" id="blueRidgeMain" class="col-12">
            <div class="row well">
                <div id="headerRow" align="center" class="col-12">
                    <img :src="titleImageSrc" style="margin: 0 auto; max-width: 750px; width: 100%;" />
                </div>
                
                <div class="col" style="padding: 0 .5rem;">
                    <q-btn size="lg" class="full-width" icon="fa-play-circle" :style="'background-color: ' + productColor + '; color: #fff;'" @click="launchPlayer()">
                        <h6>PLAY FILM</h6>
                    </q-btn>
                </div>
                
            </div>
        </div>
        
        <!--<div v-if="blueRidgeScene === 'blueRidgeBonus'" id="blueRidgeBonus" class="col-12">-->
        <!--    <div class="row well">-->
        <!--        <div id="headerRow" align="center" class="col-12">-->
        <!--            <img class="ui image" :src="titleImageSrc" style="margin: 0 auto; max-width: 750px; width: 100%;" />-->
        <!--        </div>-->
                
        <!--        <div class="col" style="padding: 0 .5rem;">-->
        <!--            <q-btn size="lg" class="full-width" icon="fa-chevron-left" :style="'background-color: ' + productColor + '; color: #fff;'" @click="blueRidgeScene = 'blueRidgeMain'">-->
        <!--                <h6>MAIN MENU</h6>-->
        <!--            </q-btn>-->
        <!--        </div>-->
                
        <!--        <div class="row full-width" style="padding: .5rem;">-->
                    
        <!--            <div v-if="chapter.fileName !== mainVideoFilename" v-for="(chapter, index) in currentProduct.productJSON.video" class="col-6" style="padding: .5rem;">-->
        <!--                <q-btn size="lg" class="full-width" icon="fa-play" :style="'background-color: ' + productColor + '; color: #fff;'" @click="watchBonus(index)">-->
        <!--                    <h6>{{chapter.displayName}}</h6>-->
        <!--                </q-btn>-->
        <!--            </div>-->
                    
        <!--        </div>-->
        <!--    </div>-->
        <!--</div>-->
        
        <div v-if="blueRidgeScene === 'blueRidgePlayer'" id="blueRidgeMain" class="col-12">
            <div class="row well">
                
                <div id="headerRow" align="center" class="col-12">
                    <img class="ui image" :src="titleImageSrc" style="margin: 0 auto; max-width: 750px; width: 100%;" />
                </div>
                
                <div class="col" style="padding: 0 .5rem;">
                    <q-btn size="lg" class="full-width" icon="fa-chevron-left" :style="'background-color: ' + productColor + '; color: #fff;'" @click="blueRidgeScene = 'blueRidgeMain'">
                        <h6>MAIN MENU</h6>
                    </q-btn>
                </div>
                
                <!--<div class="col" style="padding: 0 .5rem;">-->
                <!--    <q-btn size="lg" class="full-width" icon="fa-chevron-right" :style="'background-color: ' + productColor + '; color: #fff;'" @click="blueRidgeScene = 'blueRidgeBonus'">-->
                <!--        <h6>BONUS FEATURES</h6>-->
                <!--    </q-btn>-->
                <!--</div>-->
                
                <q-card class="full-width" style="padding: .5rem;">
                    <VideoHold :videoLayout="'DefaultVideoLayout'"/>
                </q-card>
                
            </div>
        </div>
    </div>
    
</template>

<script>
    import VideoHold from '../../../common/player/VideoHold'
    
    export default {
        components: {
            VideoHold
        },
        
        computed: {
            currentProduct() {
                return this.$store.state.currentProduct
            }  
        },
        
        data() {
            return {
                titleImageSrc: 'https://f3r6v6t8.ssl.hwcdn.net/static/clients/aperture/blueRidge_logo.png',
                productColor: '#3b508f',
                blueRidgeScene: 'blueRidgeMain',
                mainVideoFilename: 'aper3749_blueridgepark-926_369.mp4'
            }
        },
        
        created() {
            k('we in here!')

            // this.on('closeSuperPlayer *.closeSuperPlayer', function(e) {
            //     self.set('blueRidgeScene', self.get('lastblueRidgeScene') || 'blueRidgeMain')
            // })

            // this.on('watchBonus', function(e) {
            //     var index = e.keypath.split('.').pop()
            //     k(index)
            //     self.set('chapterIndexToStartFrom', index)
            //     self.launchPlayer()
            // })

            // this.observe('blueRidgeScene', function(n, o) {
            //     if (n) k('blueRidgeScene', n)
            //     if (o) self.set('lastblueRidgeScene', o)
            // })
        },
        
        methods: {
            launchPlayer() {
                this.blueRidgeScene = 'blueRidgePlayer'
            },
            
            watchBonus(e) {
                var index = e.keypath.split('.').pop()
                k(index)
                self.set('chapterIndexToStartFrom', index)
                self.launchPlayer()
            }
        }
    }
</script>

<style>
   #blueRidgeMain {
        background: url('https://f3r6v6t8.ssl.hwcdn.net/static/clients/aperture/blueRidge_bg.jpg');
        background-size: cover;
        background-position: 50%;
        background-repeat: no-repeat;
        padding: 2rem;
        min-height: 100vh;
    }

    #blueRidgeBonus {
        background: url('https://f3r6v6t8.ssl.hwcdn.net/static/clients/aperture/blueRidge_bg.jpg');
        background-size: cover;
        background-position: 50%;
        background-repeat: no-repeat;
        padding: 2rem;
        min-height: 100vh;
    }
    
    #headerRow {
        padding: 3rem 0rem;
    }

    #closeX {
        color: white;
        font-size: 2rem;
        cursor: pointer;
        position: absolute;
        top: 3rem;
        right: 0;
        z-index: 99;
        padding: 1rem;
        margin: 0;
        background: rgba(0, 0, 0, 0.32);
    }
</style>