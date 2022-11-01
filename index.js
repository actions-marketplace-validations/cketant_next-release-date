const core = require('@actions/core')
const github = require('@actions/github')

/*
 * Week days according to the indexing
 */
const WEEK_DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]

/**
 * Get the next valid Release Candidate date
 *
 * @param - Array of days represented by numbers
 * @return - Date
 * */
const nextRCValidDate = (releaseDays) => {
  // 1. Loop through the next 7 days to find the next Release Day
    var potentialDay = new Date()
    for (var i = 0; i < 7; i++) {
      potentialDay.setDate(potentialDay.getDate() + 1) // start with tomorrow so we don't return today
      if (releaseDays.includes(potentialDay.getDay())) {
        return potentialDay
      }
    }
}

const run = async () => {
  try {
    // Get Input
    const releaseDaysString = core.getInput('releaseDays') // comma separated days

    // Input Validation
    if (releaseDaysString.length == 0) {
      core.setFailed('Invalid input please provide a comma separated string with numbers')
      return
    }

    const releaseDays = releaseDaysString.split(",").map(d => Number(d)).sort()
    releaseDays.forEach(day => {
      if (day > 6) {
        core.setFailed('Invalid input please provide a number that is 0-6')
        return
      }
    })

    console.log(`The provided release days are: ${releaseDays.map(d => WEEK_DAYS[d])}...`)

        // 1. Get the next valid RC date
        const nextRCDueDate = nextRCValidDate(releaseDays)
        nextRCDueDate.setHours(16) // set the hours to avoid edges spill over into next days when converting

        // 2. Output MM-DD-YYYY
        var month = '' + (nextRCDueDate.getMonth() + 1)
        var day = '' + nextRCDueDate.getDate()
        const year = nextRCDueDate.getFullYear()

        if (month.length < 2) {
          month = '0' + month
        }
        if (day.length < 2) {
          day = '0' + day
        }
        const nextRCDateTitle = [month, day, year].join('-')

        // 3. Get Day of week
        const nextRCDayOfWeek = WEEK_DAYS[nextRCDueDate.getDay()]

        // 4. Set Output 
        core.setOutput('next_rc_day_of_week', nextRCDayOfWeek)
        core.setOutput('next_rc_date_title', nextRCDateTitle)
        core.setOutput('next_rc_date_iso', nextRCDueDate.toISOString())
  } catch (error) {
    core.debug(error)
    core.setFailed(error)
  }
}

run()