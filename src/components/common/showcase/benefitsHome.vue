<template>
    
    <div class="text-grey-9 bg-grey-3" :style="benefitsStyle">
        <div class="well row">
            <h2 align="center" class="col-12 dividerHeader">
                <span :style="'background: ' + (componentData.backgroundColor ? componentData.backgroundColor : '#efefef') + '; color: ' + (componentData.headerColor ? componentData.headerColor : '#000') + ';'">Benefits</span>
            </h2>
        </div>
        <div class="row well">
            <div class="col-sm-12 col-md-6 col-lg-3" v-for="item in benefits" :key="item.title" align="center" style="padding: 2rem;">
                <h4 style="margin: 0;">
                    <q-icon :name="item.icon" class="big-icon" :color="item.color" /> 
                </h4>                
                <h4>
                    {{item.title}}
                </h4>
                <p style="font-size: .9rem;">{{item.desc}}</p>
            </div>
    
            <!--<q-card class="col-md" v-for="item in benefits" :key="item.title" :color="item.color">-->
            <!--    <q-card-title>-->
            <!--        <h5 style="margin: 0;">-->
            <!--            <q-icon :name="item.icon" /> {{item.title}}-->
            <!--        </h5>-->
            <!--    </q-card-title>-->
            <!--    <q-card-main style="font-weight: 900;">-->
            <!--        {{item.desc}}-->
            <!--    </q-card-main>-->
            <!--</q-card>-->
        </div>
    </div>
    
</template>

<script>
    export default {
        props: ['componentData'],
    
        data() {
            return {
                benefits: [{
                    color: 'primary',
                    icon: 'fa-download',
                    title: 'Instant delivery',
                    desc: 'Order and start watching in seconds. No waiting for deliveries. No shipping and handling charges. Never out of stock. No lost or damaged shipments.'
                }, {
                    color: 'green',
                    icon: 'fa-lock',
                    title: 'Safe',
                    desc: 'Unlike discs that can get damaged or lost, you’ll never lose your digital purchases. You can conveniently download or stream on almost any device you have now or in the future.'
                }, {
                    color: 'orange',
                    icon: 'fa-clock',
                    title: 'Instant access',
                    desc: 'Watch anything you’ve purchased in a few taps or clicks, online or offline. No more hassles with players, remote controls or TV inputs.'
                }, {
                    color: 'purple',
                    icon: 'fa-globe',
                    title: 'Eco-friendly',
                    desc: '1.6 billion discs go into landfills every year. Enjoy the advantages of digital and save the planet while you’re at it!'
                }, ]
            }
        },
    
        computed: {
            benefitsStyle() {
                return 'background: ' + (this.componentData.backgroundColor || '#fff') + '; padding: 0; margin: 0 0 0 0;'
            }
        },
    
        methods: {
    
        },
    
        mounted() {
            // k('componentData: ', this.componentData)
        },
    
        beforeDestroy() {
    
        }
    }
</script>

<style>
   
</style>
