<template>
    
    <div class="row" style="padding: 1rem; background: #fff;">
        <div class="well">
            <div class="col-12" align="center">
                <h5 class="ui header">Upskill Your Career.</h5>
                <div class="row">
    
                    <div v-for="cat in categories" align="center" class="col-xs-12 col-sm-6 col-md-3" style="padding: 1rem;">
                        <q-card @click.native="cardTap(cat)" :style="'background: url(https://f3r6v6t8.ssl.hwcdn.net/static/clients/' + cat.src + '); background-size: cover; background-position: 50%; width: 100%; height: auto; cursor: pointer;'">
                            <h6 style="padding: 3rem 0; color: #fff; font-weight: 900;">{{cat.title}}</h6>
                        </q-card>
                    </div>
    
                </div>
    
                <h6 style="margin: 1rem;">430 Expert Training Courses.</h6>
                <!--<q-btn size="lg" color="primary" align="center" @click="route('/shop')"><h6>Browse all courses</h6></q-btn>-->
            </div>
        </div>
    </div>
    
</template>

<script>
    export default {
        props: ['componentData'],
        
        data() {
            return {
                categories: [{
                    src: 'gototaltraining/video.jpg',
                    title: 'Video Production',
                    tags: [1751, 2295]
                },{
                    src: 'gototaltraining/photo.jpg',
                    title: 'Photography',
                    tags: [1578]
                },{
                    src: 'gototaltraining/web-design.jpg',
                    title: 'Web Design',
                    tags: [3519]
                },{
                    src: 'gototaltraining/audio.jpg',
                    title: 'Audio Music/Tech',
                    tags: [3514]
                },{
                    src: 'gototaltraining/graphic_design.jpg',
                    title: 'Graphic Design',
                    tags: [1463]
                },{
                    src: 'gototaltraining/office.jpg',
                    title: 'Office & Business',
                    tags: [3515]
                },{
                    src: 'gototaltraining/vfx.jpg',
                    title: 'VFX',
                    tags: [1738, 3517]
                },{
                    src: 'gototaltraining/print.jpg',
                    title: 'Print Design',
                    tags: [2769]
                }]
            }
        },
        
        methods: {
            cardTap(card) {
                k('cardTap: ', card)
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
        }
    }
</script>