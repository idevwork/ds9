import store from 'store'

export default ({ Vue }) => {
  Vue.prototype.localStorage = store
}