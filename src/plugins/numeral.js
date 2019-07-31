import numeral from 'numeral'

export default ({ Vue }) => {
    Vue.prototype.numeral = numeral
  
    Vue.prototype.currencyFormat = function(theNumber) {
        return numeral(theNumber).format('$0,0.00')
    }
    Vue.prototype.numberFormat = function(theNumber) {
        return numeral(theNumber).format('0,0')
    }
}