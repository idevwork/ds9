<template>
    
    <div class="row">
        <q-icon name="fa-times" @click.native="route('/library')" id="closeX" />
        
        <div v-if="appomattoxScene === 'appomattoxMain'" id="appomattoxMain" class="col-12">
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
        
        <!--<div v-if="appomattoxScene === 'appomattoxBonus'" id="appomattoxBonus" class="col-12">-->
        <!--    <div class="row well">-->
        <!--        <div id="headerRow" align="center" class="col-12">-->
        <!--            <img class="ui image" :src="titleImageSrc" style="margin: 0 auto; padding: 3rem; max-width: 750px; width: 100%;" />-->
        <!--        </div>-->
                
        <!--        <div class="col" style="padding: 0 .5rem;">-->
        <!--            <q-btn size="lg" class="full-width" icon="fa-chevron-right" :style="'background-color: ' + productColor + '; color: #fff;'" @click="appomattoxScene = 'appomattoxMain'">-->
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
        
        <div v-if="appomattoxScene === 'appomattoxPlayer'" id="appomattoxMain" class="col-12">
            <div class="row well">
                
                <div id="headerRow" align="center" class="col-12">
                    <img class="ui image" :src="titleImageSrc" style="margin: 0 auto; max-width: 750px; width: 100%;" />
                </div>
                
                <div class="col" style="padding: 0 .5rem;">
                    <q-btn size="lg" class="full-width" icon="fa-chevron-left" :style="'background-color: ' + productColor + '; color: #fff;'" @click="appomattoxScene = 'appomattoxMain'">
                        <h6>MAIN MENU</h6>
                    </q-btn>
                </div>
                
                <!--<div class="col" style="padding: 0 .5rem;">-->
                <!--    <q-btn size="lg" class="full-width" icon="fa-chevron-right" :style="'background-color: ' + productColor + '; color: #fff;'" @click="appomattoxScene = 'appomattoxBonus'">-->
                <!--        <h6>BONUS FEATURES</h6>-->
                <!--    </q-btn>-->
                <!--</div>-->
                
                <q-card class="full-width" style="padding: .5rem;">
                    <VideoHold :videoLayout="'DefaultVideoLayout'" />
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
                titleImageSrc: 'https://f3r6v6t8.ssl.hwcdn.net/static/clients/aperture/appomattox_logo.jpg',
                productColor: '#e7a46d',
                appomattoxScene: 'appomattoxMain',
                mainVideoFilename: 'aper3749_appomwithmalic-310_808.mp4'
            }
        },
        
        created() {
            // k('we in here!')

            // this.on('closeSuperPlayer *.closeSuperPlayer', function(e) {
            //     self.set('appomattoxScene', self.get('lastappomattoxScene') || 'appomattoxMain')
            // })

            // this.on('watchBonus', function(e) {
            //     var index = e.keypath.split('.').pop()
            //     k(index)
            //     self.set('chapterIndexToStartFrom', index)
            //     self.launchPlayer()
            // })

            // this.observe('appomattoxScene', function(n, o) {
            //     if (n) k('appomattoxScene', n)
            //     if (o) self.set('lastappomattoxScene', o)
            // })
        },
        
        methods: {
            launchPlayer() {
                this.appomattoxScene = 'appomattoxPlayer'
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
   #appomattoxMain {
        background: url('https://f3r6v6t8.ssl.hwcdn.net/static/clients/aperture/appomattox_main.png');
        background-size: cover;
        background-position: 50%;
        background-repeat: no-repeat;
        padding: 2rem;
        min-height: 100vh;
    }

    #appomattoxBonus {
        background: url('https://f3r6v6t8.ssl.hwcdn.net/static/clients/aperture./appomattox_main.png');
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