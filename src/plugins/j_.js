import j_ from '@jmellicker/j_'

export default ({ Vue }) => {
  Vue.prototype.j_ = j_

  Vue.prototype.countdown = (endDate, cb) => {
        let days, hours, minutes, seconds;

        endDate = new Date(endDate).getTime();
        k('COUNTDOWN: ', endDate)

        if (isNaN(endDate)) {
            return false;
        }

        let retObj

        let countdownInterval = setInterval(() => {
            let startDate = new Date();
            startDate = startDate.getTime();

            let timeRemaining = parseInt((endDate - startDate) / 1000);
            // k('countdown timeRemaining: ', timeRemaining)

            if (timeRemaining >= 0) {
                days = parseInt(timeRemaining / 86400);
                timeRemaining = (timeRemaining % 86400);

                hours = parseInt(timeRemaining / 3600);
                timeRemaining = (timeRemaining % 3600);

                minutes = parseInt(timeRemaining / 60);
                timeRemaining = (timeRemaining % 60);

                seconds = parseInt(timeRemaining);

                retObj = {
                    days: parseInt(days, 10),
                    hours: ("0" + hours).slice(-2),
                    minutes: ("0" + minutes).slice(-2),
                    seconds: ("0" + seconds).slice(-2)
                }
                // k('retObj: ', retObj)

                cb(retObj)
            }
            else {
                cb(false)
                clearInterval(countdownInterval)
                return false;
            }

        }, 1000);
    }
}