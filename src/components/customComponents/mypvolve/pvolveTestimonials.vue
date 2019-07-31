<template>

    <div id="pvolveTestimonials" class="well row">

         <div class="col-12">
            <h6 class="thickHeader" align="center" :style="'color: ' + pvolveSalmon + ';'">What our streamers are saying:</h6>
        </div>
        
        <q-carousel class="col-12" quick-nav infinite arrows autoplay color="light" style="padding-bottom: 4rem;">
            <q-carousel-slide v-for="slide in testimonials" :key="slide.id" align="center" style="padding: 1rem;">
                <img src="https://f3r6v6t8.ssl.hwcdn.net/static/clients/mypvolve/quote_orange_icon.png" />
                <h1 class="thinHeader" style="text-transform: none;">"{{slide.quote}}"</h1>
                <p v-if="slide.author" style="color: #777; margin-top: 1rem;" class="monty">{{slide.author}}</p>
            </q-carousel-slide>
        </q-carousel>
    </div>

</template>

<script>
    import { pvolveColors } from './pvolveColors'

    export default {
        props: ['componentData'],
        
        mixins: [ pvolveColors ],
    
        data() {
            return {
                testimonials: [{
                    quote: 'The focus to execute the movements is the thing that makes you sweat.',
                    author: '@Blancabyana (obsessed w/ P.volve since 2015)'
                }, {
                    quote: 'I did my second pvolve workout yesterday and my booty is sore in a way it\'s never been before !!! Please let me know when you have a pop up class in Michigan :) I would love to come!',
                    author: 'Vistoriazo (new P.volve streamer)'
                }, {
                    quote: 'I\'m seeing lines of definition on my stomach and ass that I didn\'t even know existed :)',
                    author: 'Sivantra (streaming P.volve for a few weeks)'
                }]
            }
        }
    }
</script>

<style>
    .q-carousel-quick-nav {
        background: rgba(0, 0, 0, 0);
    }
</style>
