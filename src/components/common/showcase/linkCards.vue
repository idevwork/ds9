<template>
    <div class="row" :style="rowStyle">
        <div class="row well" style="margin: 0 auto; width: 100%;">
            <h5 v-if="componentData.title" style="margin: 0;" class="col-12 dividerHeader" align="center">
                <span :style="'background: ' + (this.componentData.backgroundColor || '#fff') + ';'">{{componentData.title}}</span>
            </h5>
            
            <div v-for="card in componentData.cards" class="col-sm-12 col-md" align="center" style="padding: 1rem; color: white;">
    
                <q-btn @click="cardTap(card)" class="full-width" :style="'padding: 1rem; background-color: ' + card.backgroundColor + '; color: white;'">
                    <q-icon v-if="card.icon" :name="'fa-' + card.icon" style="margin-right: .5rem;" /> 
                    <h3>{{card.header}}</h3>
                </q-btn>
    
                <p v-if="card.description" style="margin-top: 1rem;">{{card.description}}</p>
            </div>
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
                return 'background: ' + (this.componentData.backgroundColor || '#fff') + ';'
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