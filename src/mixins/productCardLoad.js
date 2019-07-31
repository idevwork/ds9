
import productCard from '../components/common/productCard/productCard'

// component must have componentData prop
export const productCardLoad = {
    data() {
        return {
            productCardComponent: ''
        }
    },
    
    components: {
        productCard    
    },
    
    computed: {
        homePageData() {
            return this.$store.state.environment.json
        }
    },
    
    watch: {
        productCardComponent() {
            k('productCardComponent: ', this.productCardComponent)
        }
    },
    
    created() {
        
        if (this.homePageData.e.customProductCard) {
            this.productCardComponent = this.homePageData.e.customProductCard
        } else if (this.componentData && this.componentData.customProductCard) {
            this.loadIt(this.componentData.customProductCard, 'common/productCard/' + this.componentData.customProductCard)
            this.productCardComponent = this.componentData.customProductCard
        } else {
            this.productCardComponent = 'productCard'
        }
        
        k('productCardLoad created: ', this.productCardComponent)
    }
}