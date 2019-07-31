<template>

    <div id="myTransformation" class="row relative-position justify-center">
        <!--<questionMarkHelp class="col-12" :componentData="{}" :helpContents="`-->
        <!--    <p class='monty'>Here's how to create a visual storybook of your P.volve transformation journey to share with your friends:</p>-->
        <!--    <p class='monty' style='font-size: .9rem'>To add a photo to your story:</p>-->
        <!--    <ol class='monty' style='font-size: .9rem'>-->
        <!--        <li>First, select the date your photo was taken.</li>-->
        <!--        <li>Then drag or select your photo in the drop zone. Do this with as many photos as you wish.</li>-->
        <!--    </ol>-->
        <!--    <p class='monty' style='font-size: .9rem'>To share your storybook:</p>-->
        <!--    <ol class='monty' style='font-size: .9rem'>-->
        <!--        <li>Click 'SHARE YOUR STORY', select your before, then your after picture, and then click 'Create Your Story'.</li>-->
        <!--        <li>Write a brief comment and share it to Facebook!</li>-->
        <!--    </ol>-->
        <!--`" -->
        <!--    style="margin-top: 1rem; padding: 1rem 0;"-->
        <!--/>-->
        
        <div class="col-xs-12 col-lg-6 bg-white row">
            
            <template v-if="!facebookShareImageUrl">
                
                <div v-for="(image, index) in progressImages" :key="image.imageURL" class="col-xs-12 col-md-4 relative-position" style="padding: .5rem;" align="center">
                    <div class="bg-white shadow-2" style="color: black !important;">
                        <q-btn round flat size="sm" @click="removeImage(image, index)" style="background: white; color: red; z-index: 99; position: absolute; top: 0; right: 0; padding: 0 0.5rem;">
                            <q-icon name="fas fa-times" style="font-size: 1rem; margin: 0;" />
                        </q-btn>
    
                        <img crossorigin="anonymous" :src="image.imageURL" style="max-width: 100%;" :id="`image-${image.id}`" />
                        
                        <div style="padding: .5rem">
                            <q-btn v-if="shareUserStory && beforeDateIsActive(image)" class="full-width" size="sm" outline @click="imageSelectSlotIndex = 0, selectImageForSlot(image)" :style="`background: #fff !important; color: #333; padding: 0; margin: .25rem 0;`">
                                <q-icon :name="(beforeImage && beforeImage.imageData && (beforeImage.imageData.id === image.id)) ? 'fas fa-check-circle' : 'far fa-circle'" :style="`font-size: 1rem; margin-left: 0;`" />
                                <h6 class="thickHeader" style="font-size: .7rem; letter-spacing: 1px;">
                                    set as before
                                </h6>
                            </q-btn>
                            
                            <q-btn v-if="shareUserStory && afterDateIsActive(image) && beforeImage && beforeImage.imageData" class="full-width" size="sm" outline @click="imageSelectSlotIndex = 1, selectImageForSlot(image)" :style="`background: #fff !important; color: #333; padding: 0; margin: .25rem 0;`">
                                <q-icon :name="(afterImage && afterImage.imageData && (afterImage.imageData.id === image.id)) ? 'fas fa-check-circle' : 'far fa-circle'" :style="`font-size: 1rem; margin-left: 0;`" />
                                <h6 class="thickHeader" style="font-size: .7rem; letter-spacing: 1px;">
                                    set as after
                                </h6>
                            </q-btn>
                            
                            <p class="monty" style="font-size: .8rem; letter-spacing: 1px;">uploaded on: {{moment(image.displayDateTimeStamp).format('M/DD/YY')}}</p>
                        </div>
                    </div>
                </div>
                
                <div class="col-xs-12 col-md-4" style="padding: .5rem;">
                    <div class="bg-white shadow-2" align="left" style="color: black !important; padding: 1rem;">
                        <h5 align="center" :style="`color: ${highlightColor};`">Upload a photo</h5>
                        
                        <q-datetime color="grey-7" float-label="Select date" format="M/DD/YY" v-model="transformationDate" type="date" />
    
                        <div align="center" style="border: 4px #eee dashed; margin-top: .5rem; min-height: 2rem;">
                            <Resumabledropzone ref="resumableRef" :class="{hidden: !transformationDate}"  @fileAdded="createResumableFileObj" @uploadComplete="uploadComplete" />
                            <h6 v-if="!transformationDate" class="text-grey-8" style="margin: .5rem;">Select date to upload an image</h6>
                        </div>
                    </div>
                </div>
                
            </template>
            
            <template v-else>
                
                <div class="flex flex-center q-pa-xl">
                    <h3 class="thickHeader">Thank you for submitting your Before and After.</h3>
                
                    <q-btn v-if="facebookShareImageUrl" outline @click="shareTransformation()" class="full-width" :style="{ 'background-color': `${pvolveMintTitle} !important`, color: '#fff' }">
                        <h6 style="letter-spacing: 1px;">Share to Facebook</h6>
                    </q-btn>
                </div>
                
            </template>
            
            <div v-if="mustUploadMoreImages" class="col-12 text-left" style="padding: 1rem 0;">
                <h5 class="">Please upload more pics to create your transformation story</h5>
            </div>
            
        </div>

        <div class="col-xs-12 col-lg-6 bg-white row" style="max-height: fit-content;">
            
            <div class="col-md-12" style="padding: .5rem;">
                
                <div class="text-center">
                    <canvas id="transformationCanvas" ref="transformationCanvas" :width="canvasWidth" :height="canvasHeight"></canvas>
                </div>
                
                <div v-if="shareUserStory">
                    <q-input
                        v-model="sharedText"
                        type="textarea"
                        float-label="Your Story"
                        :max-height="100"
                        :min-rows="7"
                        color="grey-7"
                        @input="sharedTextError = false"
                    />
    
                    <p v-if="sharedTextError" style="color: red;">
                        <q-icon name="fa-warning" />
                        Please enter text to share your story.
                    </p>
                    <p v-if="selectProgressImageError" style="color: red;">
                        <q-icon name="fa-warning" />
                        Please select images above to share your story.
                    </p>
                    <div class="col-md-12" style="padding: 1rem;">
                        <p style="font-size: .8rem;">{{disclaimer}}</p>
                    </div>
                </div>
                
            </div>

            <div class="col-12" v-if="!beforeImage.imageData" style="padding: 0 .5rem;">
                <q-btn outline @click="validatePicsAmount()" class="full-width" :style="{ 'background-color': `${pvolveMintTitle} !important`, color: '#fff' }">
                    <h6 style="letter-spacing: 1px;">Create before and after</h6>
                </q-btn>
            </div>
            
            <div class="col-12" v-if="shareUserStory && beforeImage.imageData && afterImage.imageData" style="padding: 0 .5rem;">
                <q-btn outline @click="uploadTransformChallengeImages()" class="full-width" :style="{ 'background-color': `${pvolveMintTitle} !important`, color: '#fff' }">
                    <h6 style="letter-spacing: 1px;">Submit</h6>
                </q-btn>
            </div>
            
            <div class="col-12" v-if="beforeImage.imageData && !facebookShareImageUrl" style="padding: 0 .5rem;">
                <q-btn outline @click="resetCanvasAndImages(), shareUserStory = false" class="full-width" :style="{ 'background-color': `${pvolveMintTitle} !important`, color: '#fff' }">
                    <h6 style="letter-spacing: 1px;">Cancel</h6>
                </q-btn>
            </div>

        </div>

        <q-modal v-model="showCropperModal" minimized no-backdrop-dismiss>
            <div class="q-pa-sm" >
                <vue-cropper
                    style="max-height: 300px"
                    v-if="cropperImageIndex || cropperImageIndex === 0"
                    ref="cropper"
                    :src="transformationSlots[cropperImageIndex].imageData.imageURL"
                    alt="Source Image"
                    :viewMode="1"
                    :aspectRatio="cropperAspectRatio"
                    :zoomOnWheel="false"
                    :background="false"
                />

                <div class="q-mt-md text-center">
                    <q-btn @click="cancelCrop()" flat style="background: #fff !important; color: #333;">
                        <h6 style="font-size: .8rem; letter-spacing: 1px;">Cancel</h6>
                    </q-btn>

                    <q-btn @click="setImageFromCropper()" flat :style="`background: ${highlightColor}; color: white;`">
                        <h6 style="font-size: .8rem; letter-spacing: 1px;">Save</h6>
                    </q-btn>
                </div>
            </div>
            
        </q-modal>

    </div>

</template>

<script>
    import Resumabledropzone from '../../common/Resumabledropzone'
    import questionMarkHelp from '../../common/questionMarkHelp'
    import VueCropper from 'vue-cropperjs'
    
    import { globalComputedData } from '../../../mixins/globalComputedData'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
    import { transformationImageTools } from '../../../mixins/transformationImageTools'
    import { pvolveColors } from './pvolveColors'

    export default {
        props: ['highlightColor', 'disclaimer'],

        mixins: [ userAndProductInfo, globalComputedData, transformationImageTools, pvolveColors ],

        components: {
            questionMarkHelp,
            Resumabledropzone,
            VueCropper
        },

        data() {
            return {
                mustUploadMoreImages: false,
                shareToFacebook: false
            }
        },

        methods: {
            createResumableFileObj(file) {
                k('createResumableFileObj 90 day: ', this.uploadingCanvasImage)
                this.newProgressImageFileName = `progressImage_${this.userInfo.userID}_${Date.now()}.jpg`
    
                var fileInfo = {}
                fileInfo[file.uniqueIdentifier] = {
                    'purpleFileName': this.newProgressImageFileName,
                    'filePurpose': 'progressImage'
                }
                // k('fileInfo: ', fileInfo)
    
                this.$store.commit('dropZoneFileInfo', fileInfo)
                this.uploadImage()
            },
            
            validatePicsAmount() {
                if (this.progressImages.length < 2) {
                    this.mustUploadMoreImages = true
                } else {
                    this.mustUploadMoreImages = false
                    this.shareUserStory = true
                }
            },
            
            uploadTransformChallengeImages() {
                let req = {
                    userID: this.userInfo.userID,
                    type: 'transformationStoryShare',
                    environment: 'mypvolve',
                    beforeImageURL: this.beforeImage.imageData && this.beforeImage.imageData.imageURL,
                    afterImageURL: this.afterImage.imageData && this.afterImage.imageData.imageURL,
                    storyText: this.sharedText
                }
                
                k('uploadTransformChallengeImages req: ', req)
                
                this.api.post(this.api.ioRoute + 'userInfo', req, (res) => {
                    k('userInfo resssssssssssssssssssss: ', res)
                    
                    if (res.success) {
                        this.shareTransformation()
                        this.shareTransformationWithPvolve()
                        
                        this.shareUserStory = false
                    } else {
                        this.$q.notify({
                            message: 'Your transformation could not be shared. Please try again or contact support.',
                            type: 'negative',
                            icon: 'fa-exclamation-circle',
                            position: 'bottom-left'
                        })
                    }
                    
                })
            },
            
            shareTransformation() {
                if (this.facebookShareImageUrl) {
                    this.openFacebookModal()
                    
                    this.resetCanvasAndImages()
                } else {
                    this.uploadTransformationImage()
                }
            },
            
            resetCanvasAndImages() {
                this.facebookShareImageUrl = null
                this.resetAllTransformationSlots()
                setTimeout(() => {
                    this.drawCanvas()    
                })
                this.sharedText = ''
                this.sharedTextError = false
            }
        },

        watch: {
        
        },

        created() {
            this.$store.commit('dropZoneTarget', this.api.bigRoute + 'upload/progressImages')
            this.$store.commit('dropZoneFileTypesAllowed', ['image/png', 'image/jpeg'])

            if (this.userPreferences) {
                this.displayProgressImages()
            } else if (this.userInfo && this.userInfo.userID) this.getUserPreferences(() => {})
        },
        
        mounted() {
            setTimeout(() => {
                this.drawCanvas()
            })
        }
    }
</script>

<style scoped>
    .productCard {
        height: 100%;
    }
    .padded {
        padding: 2rem;
    }
    #transformationCanvas {
        width: 100%;
        max-width: 750px;
        border: 1px solid rgb(153, 153, 153);
    }
    .img-container {
        height: 300px; 
    }
</style>