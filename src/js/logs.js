  // window.k = console.log.bind(console)
  // window.kw = console.warn.bind(console)
  // window.ki = console.info.bind(console)
  // window.kd = console.debug.bind(console)
  // window.ke = console.error.bind(console)

import moment from 'moment'

const logs = {
    
    p(str) { this.printIt(str, 'color: #8a2be2;') },
    b(str) { this.printIt(str, 'color: blue;') },
    c(str) { this.printIt(str, 'color: #00bbcc;') },
    g(str) { this.printIt(str, 'color: green;') },
    y(str) { this.printIt(str, 'color: #ffcc00;') },
    o(str) { this.printIt(str, 'color: #ffa500;') },
    r(str) { this.printIt(str, 'color: red;') },
    
    ph(str) { this.p(this.makeHeader(str)); },
    bh(str) { this.b(this.makeHeader(str)); },
    ch(str) { this.c(this.makeHeader(str)); },
    gh(str) { this.g(this.makeHeader(str)); },
    yh(str) { this.y(this.makeHeader(str)); },
    oh(str) { this.o(this.makeHeader(str)); },
    rh(str) { this.r(this.makeHeader(str)); },
    
    pb(str) { this.printIt(str, 'background: #8a2be2; color: white; padding: 3px;') },
    bb(str) { this.printIt(str, 'background: blue; color: white; padding: 3px;') },
    cb(str) { this.printIt(str, 'background: #00bbcc; color: white; padding: 3px;') },
    gb(str) { this.printIt(str, 'background: green; color: white; padding: 3px;') },
    yb(str) { this.printIt(str, 'background: #ffcc00; color: black; padding: 3px;') },
    ob(str) { this.printIt(str, 'background: #ffa500; color: white; padding: 3px;') },
    rb(str) { this.printIt(str, 'background: red; color: white; padding: 3px;') },
    
    pbh(str) { this.pb(this.makeHeader(str)); },
    bbh(str) { this.bb(this.makeHeader(str)); },
    cbh(str) { this.cb(this.makeHeader(str)); },
    gbh(str) { this.gb(this.makeHeader(str)); },
    ybh(str) { this.yb(this.makeHeader(str)); },
    obh(str) { this.ob(this.makeHeader(str)); },
    rbh(str) { this.rb(this.makeHeader(str)); },
    
    makeHeader(str) { return moment().format('hh:mm a') + ': ======== ' + str + ' ========' },
    
    printIt(str, css) {
        if (typeof str === 'object') str = JSON.stringify(str, null, 2)
        console.log('%c ' + str + ' ', css)
    }
}

export default logs