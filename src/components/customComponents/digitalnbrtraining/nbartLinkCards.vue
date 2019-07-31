<template>
    
    <div class="well" :style="rowStyle">
        <div class="row" align="center" style="max-width: 800px; margin: 0 auto;">
            
            <div class="col-12">
                <img @click="route('/shop')" src="https://f3r6v6t8.ssl.hwcdn.net/static/clients/digitalnightclubbarandrestauranttraining/nextStep_clickHere.png" style="cursor: pointer; margin: 0 auto;" />
            </div>
    
            <!--<div v-for="card in componentData.cards" class="col-3" align="center" @click="nbartCardTap(card)" style="color: white;">-->
            <!--    <img :src="'https://f3r6v6t8.ssl.hwcdn.net/static/clients/' + card.imageSrc" style="cursor: pointer; margin: 0 auto;" />-->
    
            <!--    <hr v-if="card.description" />-->
            <!--    <p v-if="card.description" style="color: #000;">{{description}}</p>-->
    
            <!--</div>-->
            
        </div>
    </div>

</template>

<script>
    export default {
        props: ['componentData'],
        
        computed: {
            rowStyle() {
                return 'background: ' + (this.componentData.backgroundColor || '#efefef') + ';'
            }  ,
            
            authenticated() {
                return this.$store.state.user.authenticated
            }    
        },
        
        methods: {
            
            nbartCardTap(card) {
                k(card)

                var tags = card.tags
                var link = card.link
                var mailto = card.mailto
                var action = card.action
                
                k('cardTap: ', tags, link, mailto, action)

                // sendLogEvent({
                //     eventType: 'userTappedCard',
                //     cardHeader: card.header,
                //     eventDesc: 'user tapped "' + card.header + '" card'
                // })
                
                if (action) {
                    if (action === 'signIn' && !this.authenticated) this.route('/signIn')
                } else {
                    if (tags && tags.length) {
                        this.route('/tagFilter/' + tags)
    
                    } else if (link) {
                        if (link.indexOf('http') > -1) {
                            window.open(link, '_blank')
                        } else {
                            this.route(link)
                        }
                    } else if (mailto) {
                        window.open('mailto:' + mailto, '_blank')
                    }
                }
            }
        }
    }
</script>