import ml from '@/assets/data/mainline.js';
import af from '@/assets/data/allfen.js'
import eventBus from '@/eventBus.js'


export function lineChooser (tsarray, oidexclusion=-1) {
    return new Promise((resolve) => {
        const ctime = Math.floor(Date.now() / 1000) // current unix timestamp in seconds

        var winner={"oid":-1,"gid":-1,"fullname":"","weight":-1,"prior_delay":-1,"prior_completion_time":-1}

        ml.allopenings.forEach((entry) => {
            if (tsarray.indexOf(entry.gid) > -1 && entry.weight > winner.weight && entry.prior_delay + entry.prior_completion_time <= ctime && entry.oid != oidexclusion) {
                winner = entry
            }
        })

        if (winner.weight == -1) {
            winner.prior_completion_time = ctime * 2
            ml.allopenings.forEach((entry) => {
                if (tsarray.indexOf(entry.gid) > -1 && entry.weight > winner.weight) {
                    winner = entry
                }
            })
        }

        resolve(winner)
    })
}

export function progressUpdater(completed_line, wrong_count) {
    const ctime = Math.floor(Date.now() / 1000) // current unix timestamp in seconds
    let data = []
    let newdelay = 0

    if (!(completed_line instanceof Array)) {
        data.push(completed_line)
    } else {
        data = completed_line
    }
    data.forEach((entry) => {
        if (wrong_count == 0) {
            switch (entry.prior_delay) {
                case 0:
                    newdelay = 25;
                    break;
                case 25:
                    newdelay = 60 // 1 minute
                    break;
                case 60:
                    newdelay = 60 // 2 minutes
                    break;
                case 120:
                    newdelay = 300 // 5 minutes
                    break;
                case 300:
                    newdelay = 600 // 10 minutes
                    break;
                case 600:
                    newdelay = 600 // 10 minutes
            }
        } else {
            switch (entry.prior_delay) {
                case 25:
                    newdelay = 25
                    break;
                case 60:
                    newdelay = 25 // 25 seconds
                    break;
                case 120:
                    newdelay = 60 // 1 minutes
                    break;
                case 300:
                    newdelay = 120 // 2 minutes
                    break;
                case 600:
                    newdelay = 300 // 5 minutes
            }
        }
        eventBus.$emit('delay', newdelay)
        for (var i = 0;i < ml.allopenings.length; ++i) {
            if (entry.oid == ml.allopenings[i].oid){
                ml.allopenings[i].prior_completion_time = ctime
                ml.allopenings[i].prior_delay = newdelay
                break;
            }
        }
    })
}

export function sublineCounter(tsarray) {
    let count = 0
    ml.allopenings.forEach((entry) => {
        if (tsarray.indexOf(entry.gid) > -1) {
            ++count
        }
    })
    return count
}

export function transposeCounter(fen) {
    return new Promise((resolve) => {
        let olist = []
        af.allfens.forEach((entry) => {
            if (entry.fen == fen) {
                olist.push(entry.gid)
            }
        })
        resolve(Array.from(new Set(olist)))
    })
}
