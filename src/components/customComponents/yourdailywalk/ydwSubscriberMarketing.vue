<template>
    <div>
        <div class="row" :style="rowStyle">
            
            <div class="row full-width" style="padding: 0 2rem; background: rgba(119, 119, 119, 0.8);">
                <div class="col-12" align="center">
                    <h1 style="font-size: 4rem; color: white;">YOUR DAILY WALK</h1>
                </div>
            </div>
            
            <div class="row full-width" style="padding: 2rem 0 3rem; background: rgba(220, 57, 114, 0.8);">
                <div align="center" class="col-12">
                    <h5 style="color: white;">Keep your workout fresh with a new video every day!</h5>
                    <q-btn outline color="white" @click="goToPreview">Learn More</q-btn>
                </div>
            </div>
            
        </div>
        
        <div class="row well" align="center">
            <ydwSubscribeButtons class="col-12" />
           
            <h5 class="col-12" align="center">
                Already a Your Daily Walk subscriber? 
                <a style="cursor: pointer;" @click="goToSignIn">
                   Sign in here.
                </a>
            </h5>
        </div>
    </div>

</template>

<script>
    import ydwSubscribeButtons from './ydwSubscribeButtons'
    
    export default {
        components: {
            ydwSubscribeButtons
        },
        
        computed: {
            rowStyle() {
                return 'padding-top: ' + (window.innerWidth > 767 ? '25' : '1') + 'rem; background: url("https://f3r6v6t8.ssl.hwcdn.net/static/clients/yourdailywalk/walkathome-hero-darker3.jpg"); background-size: cover; background-position: 50%;'
            }    
        },
        
        methods: {
            goToPreview(e) {
                // k(e.node){
                this.route('/shop/109777')
            },
            
            goToSignIn() {
                // r.signInOrOut()
                this.route('/signin')
            }
        }
    }
</script>