<template>
    
    <div class="row" :style="rowStyle">
        
        <div class="row well" style="margin: 0 auto;">
            <h4 style="margin: 0;" class="col-12" align="center">Subjects</h4>
            
            <q-card @click.native="cardTap(card)" v-for="card in componentData.subjectCards" :key="card.header" class="col cursor-pointer" align="center" color="white">
                <q-card-media>
                    <img :src="'https://f3r6v6t8.ssl.hwcdn.net/static/clients/painttube/' + card.filename" />
                </q-card-media>
                
                <q-card-main style="color: black;">
                    <h5>{{card.header}}</h5>
                    
                    <hr v-if="card.description" />
                    <p v-if="card.description" style="color: #000;">{{card.description}}</p>
                </q-card-main>            
            </q-card>
            
        </div>
        
        <div class="row well" style="margin: 0 auto;">
            <h4 style="margin: 0;" class="col-12" align="center">Mediums</h4>
            
            <q-card @click.native="cardTap(card)" v-for="card in componentData.mediumCards" :key="card.header" class="col cursor-pointer" align="center" color="white">
                <q-card-media>
                    <img :src="'https://f3r6v6t8.ssl.hwcdn.net/static/clients/painttube/' + card.filename" />
                </q-card-media>
                
                <q-card-main style="color: black;">
                  <h5>{{card.header}}</h5>
                  
                  <hr v-if="card.description" />
                  <p v-if="card.description" style="color: #000;">{{card.description}}</p>
                </q-card-main>            
            </q-card>
            
        </div>
        
    </div>
    
</template>

<script>
    export default {
        props: ['componentData'],

        data() {
            return {

            }
        },

        components: {

        },

        computed: {
            rowStyle() {
                return 'background: ' + (this.componentData.backgroundColor || '#fff') + '; padding: 2rem;'
            },
        },

        methods: {
            cardTap(card) {
                var tags = card.tags
                var link = card.link

                if (tags && tags.length) {
                    this.route('/tagFilter/' + tags)

                }
                else if (link) {
                    if (link.indexOf('http') > -1) {
                        window.open(link, '_blank')
                    }
                    else {
                        this.route(link)
                    }
                }
            }
        },

        mounted() {
            // console.log('componentData: ', this.componentData)
        }
    }
</script>

<style>
</style>