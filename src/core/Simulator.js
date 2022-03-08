/* This file is part of LoopInsighT1, an open source tool to
   simulate closed-loop glycemic control in type 1 diabetes.
   Distributed under the MIT software license.
   See https://lt1.org for further information.	*/

import InvalidResultError from '../common/InvalidResultError.js'
import RK4 from './SolverRK4.js'

class Simulator {

	setPatient(patient) {
		this.patient = patient
	}

	setController(controller) {
		this.controller = controller
	}

	setMeals(meals) {
		this.meals = meals
	}

	setPushData(pushData) {
		this.pushData = pushData
	}

	setOptions(options) {
		this.options = options
	}

	// run simulation
	startSim() {

		// initialize controller
		this.controller.setPatient(this.patient)
		this.controller.setAnnouncedCarbs((t_) => this._announcedCarbs(this.meals, t_, t))
		this.controller.reset()

		// initialize simulation variables
		let t = 0
		let tmax = this.options.tmax
		if (!Number.isInteger(tmax) || tmax < 0) {
			tmax = 10
		}

		const dt = 1
		let x = this.patient.getInitialState()
		let u = { meal: 0, iir: this.patient.IIReq, ibolus: 0 }
		let y = this.patient.outputs(t, x, u)
		let log = {}

		// start simulation
		while (t < tmax) {
			// compute controller output
			log = this.controller.update(t, y, x)

			const { iir, ibolus } = this.controller.getTreatment()
			const carbs = this._momentaryCarbIntake(this.meals, t)
			const isMeal = this._newMealstartsAt(this.meals, t)
			const u = { iir, ibolus, carbs, meal: isMeal }

			// output current state to frontend
			try {
				this.pushData(t, x, u, y, log)
			} catch (err) {
				if (err instanceof InvalidResultError) {
					// abort simulation
					// FIXME Hier gehört ein sauberes Error-Handling hin.
					// (Hab erstmal nur den bestehenden Code nachgebaut)
					return
				} else {
					throw err
				}
			}

			// proceed one time step
			x = RK4((t_, x_) => this.patient.derivatives(t_, x_, u), t, x, dt)
			y = this.patient.outputs(t, x, u)
			t += dt
		}
	}

	/**
	 * Computes momentary carb intake
	 * 
	 * @param {array} meals - An array of announced meals
	 * @param {number} t - The current time
	 * @returns {number} the current carb intake
	 */
	_momentaryCarbIntake(meals, t) {
		let m = 0;
		for (const meal of meals) {
			const { start, duration, carbs } = meal.actual
			if (t >= start && t < start + duration) {
				if (duration < 1) {
					duration = 1
				}
				m += carbs / duration
			}
		}
		return m
	}

	/**
	 * determines whether a new meal starts at time t
	 * @param {array}  meals - an array of announced meals
	 * @param {number} t - the time of interest
	 * @returns {boolean}
	 */
	_newMealstartsAt(meals, t) {
		let m = 0;
		for (const meal of meals) {
			const { start, carbs } = meal.actual
			if (start == t && carbs > 0) {
				return true
			}
		}
		return false
	}


	/** 
	 * computes announced carbs:
	 * @param {array} meal - Array of announced meals
	 * @param {number} treq - requested time of interest
	 * @param {number} tsim - simulation time
	 * @returns {number} Sum of announced carbs
	 */
	_announcedCarbs(meals, tReq, tSim) {
		let a = 0;
		for (const meal of meals) {
			if (!meal.announcement) continue
			const { start, carbs, time } = meal.announcement
			if (tSim > time && start == tReq) {
				a += carbs
			}
		}

		return a
	}

}

export default Simulator;
