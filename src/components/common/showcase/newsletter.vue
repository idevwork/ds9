<template>
    <div :id="componentData.id" class="q-pa-lg" :style="`background-color: ${componentData.backgroundColor}; color: ${componentData.textColor}!important;`">
       <div class="row well justify-center items-center q-pb-xl-xl q-pb-none">
           <div class="col-xl-3 q-px-md q-pb-md  q-pb-xl-none" align="center">
               <h2 class="q-ma-none text-center">
                   {{componentData.title}}
               </h2>
           </div>
           
           <div class="col-xl-6 q-px-md q-pb-md  q-pb-xl-none" align="center">
                <input v-model="text" :disabled="loading" placeholder="Your e-mail here" class="full-width" />
           </div>
           
           <div class="col-xl-3 q-px-xl q-pb-xl-none" align="center">
                <q-btn label="SUBSCRIBE NOW" color="white" rounded  size="lg" class="no-shadow text-orange text-weight-bold q-px-lg" @click="submit" :loading="loading" style="margin: -.5rem 0;" />
           </div>
       </div>
   </div>
</template>

<script>

    export default {
        props: ['componentData'],
        
        data() {
            return {
                loading: false,
            }
        },
        
        computed: {
            
        },
        
        methods: {
            async submit(){
                this.loading = true
                
                try {
                    
                } catch (error){
                    
                }
                
                this.loading = false
            }
        },

        mounted() {
            // k('componentData: ', this.componentData)
        }
    }
</script>

<style scoped>

input::placeholder{
    color: white!important;
    font-size: 18px;
}

input{
    font-size: 18px;
    outline-color: transparent;
    background-color: transparent;
    height: 48px ;
    padding: 17px 28px 16px 28px;
    color: white;
    border-radius: 30px;
    border: 1px solid white;
}

.q-if:after,
.q-if:before{
    display:none;
}
    
</style>
