<template>
    <div>
        <slot name="image"></slot>

        <div class="col-md-12 col-lg-12 col-xl-12">
            <div class="row" style="padding: 1rem 0 0;">
                <div class="col-8">
                    <span :style="`font-size: ${adaptiveFontSize(1.4)}rem; line-height: ${adaptiveFontSize(1.6)}rem;`">
                        {{productPreviewData.productName}}
                    </span>
                </div>

                <div class="col" align="right">
                    <q-btn-dropdown label="SHARE" icon="fas fa-share-alt" class="text-grey-9">
                        <q-list link>
                            <q-item @click.native="showProductPreviewLink = !showProductPreviewLink" class="text-grey-8" v-close-overlay>
                                <q-icon name="fa-link" class="on-left" />
                                <q-item-tile label>Product Link</q-item-tile>
                            </q-item>
                            <q-item @click.native="share2Facebook(productPreviewData)" class="text-grey-8" v-close-overlay>
                                <q-icon name="fab fa-facebook" class="on-left" />
                                <q-item-tile label>Facebook</q-item-tile>
                            </q-item>
                            <q-item @click.native="share2Twitter(productPreviewData)" class="text-grey-8" v-close-overlay>
                                <q-icon name="fab fa-twitter" class="on-left" />
                                <q-item-tile label>Twitter</q-item-tile>
                            </q-item>
                        </q-list>
                    </q-btn-dropdown>
                </div>
            </div>

            <div class="row q-py-md">
                <span v-if="productPreviewData.duration">
                    <q-icon name="fa-clock" color="green" />
                    {{ j_.secondsToHms(productPreviewData.duration) }}
                </span>
            </div>

            <div v-if="showProductPreviewLink" class="bg-white shadow-3">
                <q-field
                    icon="fa-link"
                    helper="Select and copy this link to send people to this product"
                >
                    <q-input v-model="productPreviewLink" readonly />
                </q-field>
            </div>

            <p :style="`color: ${environmentJSON.e.brandColor}; margin-top: .5rem;`">{{productPreviewData.byLine}}</p>

            <p v-html="productPreviewData.productBlurb" class="gt-md" style="margin-top: .5rem;"></p>
            <p v-html="productPreviewData.productBlurb" class="lt-sm" style="margin-top: .5rem;"></p>
        </div>
    </div>
</template>

<script>
    import favoriteProductButton from './favoriteProductButton'
    import { productPreviewTools } from '../../../mixins/productPreviewTools'

    export default {
        props: [],

        components: {
            favoriteProductButton
        },

        mixins: [productPreviewTools]
    }
</script>
<style>

</style>