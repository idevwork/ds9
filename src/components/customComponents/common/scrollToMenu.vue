<template>
    
    <div id="scrollToMenu" class="row" :style="rowStyle">
        <div class="well">

            <a v-for="link in componentData.links" class="col" @click="scrollUser(link)" :style="link.backgroundColor ? 'background: ' + link.backgroundColor + ';' : ''">
                <q-icon name="fa-chevron-down" />
                {{link.title}}
            </a>

        </div>
    </div>
    
</template>

<script>
    import { scroll } from 'quasar'

    export default {
        props: ['componentData'],
        
        computed: {
            rowStyle() {
                return 'background: ' + (this.componentData.backgroundColor || '#efefef') + '; padding: 1rem 0;'
            }
        },
        
        methods: {
            scrollUser(link) {
                k('link: ', link)
                scroll('#' + link.id, -50, 1000)
            }
        }
    }
</script>