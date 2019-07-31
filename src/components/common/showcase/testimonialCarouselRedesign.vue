<template>
    <div :id="componentData.id" :style="`background-color: ${componentData.backgroundColor}; color: ${componentData.textColor}!important;`">
        
        <div class="row justify-center " v-if="componentData.image">
            <div class="image-holder">
                <img :src="componentData.image" style="max-width: 100%;" />
            </div>
        </div>
        
        <h6 class="text-center title-holder">{{componentData.title}}</h6>
        
        <div class="row well justify-center">
            <div class="col-6 col-md-12" style="max-width: 750px;">
                <q-carousel quick-nav arrows infinite color="white">
                    <q-carousel-slide v-for="slide in componentData.testimonials" :key="slide.id">
                        <q-card class="bg-white" :style="`padding: 2rem; `" >
                            <p class="text-center "
                                :style="`color: ${componentData.textColor}!important;`"
                            >
                                <q-icon class="slide-quote" name="fas fa-quote-left" size="30px" />
                                
                                <i>
                                    <span v-html="slide.text" style="line-height: 2rem;" />
                                </i>
                                
                                <q-icon class="slide-quote" name="fas fa-quote-right" size="30px" />
                            </p>
                            
                            <div class=" row text-center who-is justify-center items-center" :style="`color: ${componentData.textColor}!important; font-size: .8rem;`">
                                <img class="float-left" :src="componentData.avatar" style="max-width: 100%;">
    
                                <div class="q-ml-sm">
                                    <strong class="font-greater">
                                        {{slide.name}}
                                    </strong>
                                    
                                    <!--<br>-->
                                    
                                    <!--<a href="slide.role">{{slide.role}}</a>-->
                                </div>
                            </div>
                        </q-card>
                    </q-carousel-slide>
                </q-carousel>
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
        
        computed: {
            
        },
        
        methods: {
            
        },

        mounted() {
            // k('componentData: ', this.componentData)
        }
    }
</script>

<style scoped>
.who-is{
    padding-top: 2.25rem;    
}

.row.justify-center{
    padding-bottom: 3.5rem;
}
.font-greater{
    font-size: 1.1rem;
}
.slide-quote{
    font-size: 80px;
    margin: 0 1rem;
}

p{
    font-size: 1.2rem;
}

.q-card{
    box-shadow: none;
}

.q-carousel-slide .q-card{
    background-color: transparent!important;
}

.image-holder{
    margin-top: 3.5rem;
}

.title-holder{
    padding-top: 1rem 0;
    font-size: 2.25rem;
}
    
</style>
