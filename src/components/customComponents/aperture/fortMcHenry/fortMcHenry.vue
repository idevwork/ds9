<template>
    
    <div class="row">
        <q-icon name="fa-times" @click.native="route('/library')" id="closeX" />
        
        <div v-if="fortMcHenryScene === 'fortMcHenryMain'" id="fortMcHenryMain" class="col-12">
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
                    <q-btn size="lg" class="full-width" icon="fa-chevron-right" :style="'background-color: ' + productColor + '; color: #fff;'" @click="fortMcHenryScene = 'fortMcHenryBonus'">
                        <h6>BONUS FEATURES</h6>
                    </q-btn>
                </div>
                
            </div>
        </div>
        
        <div v-if="fortMcHenryScene === 'fortMcHenryBonus'" id="fortMcHenryBonus" class="col-12">
            <div class="row well">
                <div align="center" class="col-12">
                    <img class="ui image" :src="titleImageSrc" style="margin: 0 auto; padding: 3rem; max-width: 750px; width: 100%;" />
                </div>
                
                <div class="col-12" style="padding: .5rem;">
                    <q-btn size="lg" class="full-width" icon="fa-chevron-left" :style="'background-color: ' + productColor + '; color: #fff;'" @click="fortMcHenryScene = 'fortMcHenryMain'">
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
        
        <div v-if="fortMcHenryScene === 'fortMcHenryPlayer'" id="fortMcHenryMain" class="col-12">
            <div class="row well">
                
                <div align="center" class="col-12">
                    <img class="ui image" :src="titleImageSrc" style="margin: 0 auto; padding: 3rem; max-width: 750px; width: 100%;" />
                </div>
                
                <div class="col" style="padding: 0 .5rem;">
                    <q-btn size="lg" class="full-width" icon="fa-chevron-left" :style="'background-color: ' + productColor + '; color: #fff;'" @click="fortMcHenryScene = 'fortMcHenryMain'">
                        <h6>MAIN MENU</h6>
                    </q-btn>
                </div>
                
                <div class="col" style="padding: 0 .5rem;">
                    <q-btn size="lg" class="full-width" icon="fa-chevron-right" :style="'background-color: ' + productColor + '; color: #fff;'" @click="fortMcHenryScene = 'fortMcHenryBonus'">
                        </h6>BONUS FEATURES</h6>
                    </q-btn>
                </div>
                
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
                titleImageSrc: 'https://f3r6v6t8.ssl.hwcdn.net/static/clients/aperture/fortMcHenry_logo.png',
                productColor: '#0b3a6c',
                fortMcHenryScene: 'fortMcHenryMain',
                mainVideoFilename: 'aper3749_fortmchen-307_880.mp4',
                bonusFeatures: [{
                    text: 'BUFFALO BONUS FOOTAGE',
                    icon: 'play'
                }, {
                    text: 'BONUS AERIAL REEL',
                    icon: 'play'
                }, {
                    text: 'CUSTER STATE PARK ROUNDUP',
                    icon: 'play'
                }, {
                    text: 'OPENING LOOP',
                    icon: 'play'
                }, {
                    text: 'STORYBOARD COMPARISONS',
                    icon: 'play'
                }, {
                    text: 'SOUNDTRACK',
                    icon: 'play'
                }, {
                    text: 'ARCHIVAL PHOTOS',
                    icon: 'play'
                }, {
                    text: 'BEHIND-THE-SCENES PHOTOS',
                    icon: 'play'
                }]
            }
        },
        
        created() {
            k('we in here!')

            // this.on('closeSuperPlayer *.closeSuperPlayer', function(e) {
            //     self.set('fortMcHenryScene', self.get('lastfortMcHenryScene') || 'fortMcHenryMain')
            // })

            // this.on('watchBonus', function(e) {
            //     var index = e.keypath.split('.').pop()
            //     k(index)
            //     self.set('chapterIndexToStartFrom', index)
            //     self.launchPlayer()
            // })

            // this.observe('fortMcHenryScene', function(n, o) {
            //     if (n) k('fortMcHenryScene', n)
            //     if (o) self.set('lastfortMcHenryScene', o)
            // })
        },
        
        methods: {
            launchPlayer() {
                this.fortMcHenryScene = 'fortMcHenryPlayer'
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
    #fortMcHenryMain {
        background: url('https://f3r6v6t8.ssl.hwcdn.net/static/clients/aperture/fortMcHenryMain.png');
        background-size: cover;
        background-position: 50%;
        padding: 2rem;
        min-height: calc(100vh - 50px);
    }

    #fortMcHenryBonus {
        background: url('https://f3r6v6t8.ssl.hwcdn.net/static/clients/aperture/fortMcHenryMain.png');
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
