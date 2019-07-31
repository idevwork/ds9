<template>
    
    <div class="row" style="background: #f2eaca; padding: 2rem 1rem;">
        <div class="well">
            <div class="row">
                <h5 class="col-12 dividerHeader" align="center">
                    <span style="background: #f2eaca;">Sifus / Instructors</span>
                </h5>
                
                <div v-for="sifu in mainSifus" class="col-6">
                    
                    <q-card class="bg-white pointer-cursor" @click="route('/tagFilter/' + sifu.tag)">
                        <q-card-media>
                            <img :src="'https://f3r6v6t8.ssl.hwcdn.net/static/clients/wcu/' + sifu.img">
                        </q-card-media>
                        
                        <q-card-main align="center">
                            <h6 class="header">{{sifu.name}}</h6>
                            <div class="meta">
                                <span class="date">{{sifu.extra}}</span>
                            </div>
                        </q-card-main>
                    </q-card>
                    
                </div>
                
            </div>

            <div class="row">
                    
                <div v-for="sifu in otherSifus" class="col-4">
                
                    <q-card class="bg-white pointer-cursor" @click="route('/tagFilter/' + sifu.tag)">
                        <q-card-media>
                            <img :src="'https://f3r6v6t8.ssl.hwcdn.net/static/clients/wcu/' + sifu.img">
                        </q-card-media>
                        
                        <q-card-main align="center">
                            <h6 class="header">{{sifu.name}}</h6>
                            <div class="meta">
                                <span class="date">{{sifu.extra}}</span>
                            </div>
                        </q-card-main>
                    </q-card>
                    
                </div>

            </div>
        </div>
    </div>

</template>


<script>
    export default {
        data() {
            return {
                mainSifus: [{
                    name: 'Sifu Wayne Belonoha',
                    extra: 'The Complete Ving Tsun System',
                    img: 'wayne.png',
                    tag: '1097'
                }, {
                    name: 'Sifu Fernandez',
                    extra: 'The Complete Ving Tchun Do System',
                    img: 'fernandez.png',
                    tag: '1140'
                }],
                otherSifus: [{
                    name: 'Sifu Larry Saccoia',
                    extra: 'Applied Wing Chun System',
                    img: 'larry.png',
                    tag: '3977'
                }, {
                    name: 'Sifu Tyler Rea',
                    extra: 'Wing Chun Rattan Rings',
                    img: 'tyler.png',
                    tag: '1096'
                }, {
                    name: 'Sifu Greg Yau',
                    extra: 'Wing Chun Power',
                    img: 'greg.png',
                    tag: '2516'
                }]
            }
        },

        methods: {
            
        }
    }
</script>