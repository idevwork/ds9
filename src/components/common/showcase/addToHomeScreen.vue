<template>
  
    <div v-if="mobileBrowser && !homescreenApp" class="well" align="center">
        <q-btn flat @click="addToHomeScreen = !addToHomeScreen">
            <h5 align="center">Tap here to make this an app!</h5>
        </q-btn>
        
        <div v-if="addToHomeScreen" class="row full-width">
            
            <div :class="'col-xs-12 ' + (showApple ? '' : 'col-sm-6')">
                <q-card v-if="!showAndroid" @click.native="showApple = !showApple">
                    <q-card-title>
                        <h6>steps for</h6>
                        <h5 style="text-transform: none;">
                            <q-icon name="fab fa-apple" color="grey-7" style="font-size: 1.6rem;" />
                            APPLE iOS
                        </h5>
                    </q-card-title>
                    
                    <q-card-main v-if="showApple">
                        <q-list>
                            
                            <q-item v-for="step in appleSteps" :key="step.imageFileName">
                                <q-item-main>
                                    <h6>
                                        {{step.title}}
                                    </h6>
                                    <p class="content">
                                        {{step.desc}}
                                    </p>
                                </q-item-main>
                                
                                <q-item-side>
                                    <img style="max-width: 80px;" :src="imageURL + step.imageFileName" />
                                </q-item-side>
                            </q-item>
                            
                        </q-list>
                    </q-card-main>
                </q-card>
            </div>
            
            <div :class="'col-xs-12 ' + (showAndroid ? '' : 'col-sm-6')">
                <q-card v-if="!showApple" class="col-sm-12 col-md-6" @click.native="showAndroid = !showAndroid">
                    <q-card-title>
                        <h6>steps for</h6>
                        <h5>
                            <q-icon name="fab fa-android" color="green-4" style="font-size: 1.6rem;" />
                            Android OS
                        </h5>
                    </q-card-title>
                    
                    <q-card-main v-if="showAndroid">
                        <q-list>
                            
                            <q-item v-for="step in androidSteps" :key="step.imageFileName">
                                <q-item-main>
                                    <h6>
                                        {{step.title}}
                                    </h6>
                                    <p class="content">
                                        {{step.desc}}
                                    </p>
                                </q-item-main>
                                
                                <q-item-side>
                                    <img style="max-width: 80px;" :src="imageURL + step.imageFileName" />
                                </q-item-side>
                            </q-item>
                            
                        </q-list>
                    </q-card-main>
                </q-card>
            </div>
            
        </div>
    </div>
    
</template>

<script>
    export default {
        props: ['componentData'],
    
        data() {
            return {
                addToHomeScreen: false,
                showApple: false,
                showAndroid: false,
                
                imageURL: 'https://f3r6v6t8.ssl.hwcdn.net/static/clients/common/',
                
                appleSteps: [{
                    title: 'Step One:',
                    desc: 'Tap this icon in your browser tool bar:',
                    imageFileName: 'iOS-add2homescreen1.png'
                }, {
                    title: 'Step Two:',
                    desc: 'Find and tap "Add to home screen":',
                    imageFileName: 'iOS-add2homescreen2.png'
                }, {
                    title: 'Step Three:',
                    desc: 'Tap "Add" in the upper right corner:',
                    imageFileName: 'iOS-add2homescreen3.png'
                }],
                
                androidSteps: [{
                    title: 'Step One:',
                    desc: 'Tap the three dots in the upper right:',
                    imageFileName: 'android-add2homescreen1.png'
                }, {
                    title: 'Step Two:',
                    desc: 'Find and tap "Add to home screen":',
                    imageFileName: 'android-add2homescreen2.png'
                }, {
                    title: 'Step Three:',
                    desc: 'Tap "ADD":',
                    imageFileName: 'android-add2homescreen3.png'
                }]
            }
        },
    
        computed: {
            mobileBrowser() {
                // device detection
                var _isMobile = false; //initiate as false
                if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) ||
                    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) _isMobile = true;
                // k('isMobile? ', _isMobile)
                return _isMobile
            },
    
            homescreenApp() {
                return window.navigator.standalone
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
