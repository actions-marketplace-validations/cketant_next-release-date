const core = require('@actions/core')
const github = require('@actions/github')

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
		const releaseDays = releaseDaysString.split(",").map(d => Number(d)).sort()

		if (releaseDays.length == 0) {
			core.error('Invalid input please provide a comma separated string')
		}
		releaseDays.forEach(day => {
			if (day > 6) {
				core.error('Invalid input please provide a number that is 0-6')		
			}
		})

		// 1. Get the next valid RC date
		const nextRCDueDate = nextRCValidDate(releaseDays)

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
        const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
        const nextRCDayOfWeek = weekday[nextRCDueDate.getDay()]

        // 4. Set Output 
        core.setOutput('next_rc_day_of_week', nextRCDayOfWeek)
        core.setOutput('next_rc_date_title', nextRCDateTitle)
        core.setOutput('next_rc_date_iso', nextRCDueDate.toISOString())
	} catch (error) {
		core.setFailed(error)
	}
}

run()