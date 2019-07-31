<template>
    
    <div class="row">
        <q-icon name="fa-times" @click.native="route('/library')" id="closeX" />
        
        <div v-if="grandCanyonScene === 'grandCanyonMain'" id="grandCanyonMain" class="col-12">
            <div class="row well">
                <div align="center" class="col-12">
                    <img :src="titleImageSrc" style="margin: 0 auto; padding: 3rem; max-width: 750px; width: 100%;" />
                </div>
                
                <div class="col" style="padding: 0 .5rem;">
                    <q-btn size="lg" class="full-width" icon="fa-play-circle" :style="'background-color: ' + productColor + '; color: #fff;'" @click="launchPlayer()">
                        <h6>PLAY FILM</h6>
                    </q-btn>
                </div>
                
                <div class="col" style="padding: 0 .5rem;">
                    <q-btn size="lg" class="full-width" icon="fa-chevron-right" :style="'background-color: ' + productColor + '; color: #fff;'" @click="grandCanyonScene = 'grandCanyonBonus'">
                        <h6>BONUS FEATURES</h6>
                    </q-btn>
                </div>
                
            </div>
        </div>
        
        <div v-if="grandCanyonScene === 'grandCanyonBonus'" id="grandCanyonBonus" class="col-12">
            <div class="row well">
                <div align="center" class="col-12">
                    <img class="ui image" :src="titleImageSrc" style="margin: 0 auto; padding: 3rem; max-width: 750px; width: 100%;" />
                </div>
                
                <div class="col-12" style="padding: .5rem;">
                    <q-btn size="lg" class="full-width" icon="fa-chevron-left" :style="'background-color: ' + productColor + '; color: #fff;'" @click="grandCanyonScene = 'grandCanyonMain'">
                        <h6>MAIN MENU</h6>
                    </q-btn>
                </div>
                
                <div v-if="chapter.fileName !== mainVideoFilename" v-for="(chapter, index) in currentProduct.productJSON.video" class="col-sm-12 col-md-6" style="padding: .5rem;">
                    <q-btn size="lg" class="full-width" :style="'background-color: ' + productColor + '; color: #fff;'" @click="watchBonus(index)">
                        <h6>
                            {{chapter.displayName}}
                        </h6>
                    </q-btn>
                </div>
            </div>
        </div>
        
        <div v-if="grandCanyonScene === 'grandCanyonPlayer'" id="grandCanyonMain" class="col-12">
            <div class="row well">
                
                <div align="center" class="col-12">
                    <img class="ui image" :src="titleImageSrc" style="margin: 0 auto; padding: 3rem; max-width: 750px; width: 100%;" />
                </div>
                
                <div class="col" style="padding: 0 .5rem;">
                    <q-btn size="lg" class="full-width" icon="fa-chevron-left" :style="'background-color: ' + productColor + '; color: #fff;'" @click="grandCanyonScene = 'grandCanyonMain'">
                        <h6>MAIN MENU</h6>
                    </q-btn>
                </div>
                
                <div class="col" style="padding: 0 .5rem;">
                    <q-btn size="lg" class="full-width" icon="fa-chevron-right" :style="'background-color: ' + productColor + '; color: #fff;'" @click="grandCanyonScene = 'grandCanyonBonus'">
                        <h6> FEATURES</h6>
                    </q-btn>
                </div>
                
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
                titleImageSrc: 'https://f3r6v6t8.ssl.hwcdn.net/static/clients/aperture/grandCanyon_logo.png',
                productColor: '#023548',
                grandCanyonScene: 'grandCanyonMain',
                mainVideoFilename: 'aper3749_grandcanyo-218_612.mp4'
            }
        },
        
        created() {
            k('we in here!')

            // this.on('closeSuperPlayer *.closeSuperPlayer', function(e) {
            //     self.set('grandCanyonScene', self.get('lastgrandCanyonScene') || 'grandCanyonMain')
            // })

            // this.on('watchBonus', function(e) {
            //     var index = e.keypath.split('.').pop()
            //     k(index)
            //     self.set('chapterIndexToStartFrom', index)
            //     self.launchPlayer()
            // })

            // this.observe('grandCanyonScene', function(n, o) {
            //     if (n) k('grandCanyonScene', n)
            //     if (o) self.set('lastgrandCanyonScene', o)
            // })
        },
        
        methods: {
            launchPlayer() {
                this.grandCanyonScene = 'grandCanyonPlayer'
            },
            
            watchBonus(index) {
                k(index)
                this.$store.commit('chapterIndexToStartFrom', index)
                this.launchPlayer()
            }
        }
    }
</script>

<style>
    #grandCanyonMain {
        background: url('https://f3r6v6t8.ssl.hwcdn.net/static/clients/aperture/grandCanyon_bg.jpg');
        background-size: cover;
        background-position: 50%;
        padding: 2rem;
        min-height: calc(100vh - 50px);
    }

    #grandCanyonBonus {
        background: url('https://f3r6v6t8.ssl.hwcdn.net/static/clients/aperture/grandCanyon_bg.jpg');
        background-size: cover;
        background-position: 50%;
        padding: 2rem;
        min-height: calc(100vh - 50px);
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