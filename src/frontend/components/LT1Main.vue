<script>
/* 	This file is part of LoopInsighT1, an open source tool to
   	simulate closed-loop glycemic control in type 1 diabetes.
   	Distributed under the MIT software license.
	See https://lt1.org for further information.	*/

import { defaults } from "chart.js";

import ControllerConfig from "./ControllerConfig.vue";
import VirtualPatientConfig from "./VirtualPatientConfig.vue";
import MealTable from "./MealTable.vue";
import ChartAGP from "./ChartAGP.vue";
import Event from "./Event.vue";
import GlucoseChart from "./GlucoseChart.vue";
import { computed } from "vue";
import GlucoseStats from "./GlucoseStats.vue";
import Meals from "./Meals.vue";
import Scenario from "./Scenario.vue";
import InsulinStats from "./InsulinStats.vue";
import "../assets/base.css";

let controller = {};

export default {
  props: {
    runSimulation: Function,
  },

  beforeMount() {
    // set default options for Chart
  },

  components: {
    ControllerConfig,
    VirtualPatientConfig,
    MealTable,
    ChartAGP,
    Event,
    GlucoseChart,
    GlucoseStats,
    Meals,
    Scenario,
    InsulinStats,
  },

  data() {
    return {
      boxactive: false,
      patientData: {}, // todo
      patientObject: {}, // todo
      meals: {},
      myCharts: [],
      t0String: new Date(Date.now()).toISOString().substr(0, 11) + "06:00:00",
      tspan: 8,
      isActive: false,
      activeTab: 0,
      tabList: ["Szenarien", "Pa", "Tab3", "Tab4"],
      events: {
        meals: this.meals,
      },
    };
  },
  computed: {
    t0() {
      return new Date(this.t0String.valueOf());
    },
  },
  mounted() {
    this.$store.watch(
      (state, getters) => state.targetValues.upper,
      (newValue, oldValue) => {
        this.run();
      }
    );
    this.$store.watch(
      (state, getters) => state.targetValues.lower,
      (newValue, oldValue) => {
        this.run();
      }
    );
  },
  methods: {
    increment() {
      this.tspan++;
      console.log(this.tspan);
    },
    decrement() {
      if (this.tspan > 0) {
        this.tspan--;
      }
    },
    selectTab(i) {
      this.activeTab = i;
      // loop over all the tabs
      this.tabList.forEach((tab, index) => {
        tab.isActive = index === i;
      });
    },
    run() {
      this.runSimulation();
    },
    getController() {
      return controller;
    },
    getPatient() {
      //console.log(this.$store.state.patient);
      return this.$store.state.patient;
    },
    getMeals() {
      return JSON.parse(JSON.stringify(this.$store.state.meals));
    },
    getOptions() {
      const t0 = new Date(this.t0.valueOf());
      const tmax = new Date(t0.valueOf() + this.tspan * 3600000);
      return { t0, tmax };
    },
    controllerChanged(newController) {
      if (typeof newController !== "undefined") {
        controller = newController;
      }
    },
    patientChanged(newPatient) {
      this.patientObject = newPatient;
      this.$store.commit("setPatient", newPatient);
    },
    mealsChanged(newMeals) {
      this.meals = newMeals;
    },
    szenarioChanged() {
      console.log("hier");
      this.run();
    },
    eventsChanged(changedEvents) {
      this.$store.commit("setMeal", changedEvents);
      this.run();
    },
    propagateSimulationResults(simResults) {
      //console.log(simResults);
      for (const chart in this.$refs) {
        //console.log(chart);
        try {
          this.$refs[chart].setSimulationResults(simResults);
        } catch {}
      }
    },
    // update charts after simulation is complete
    updateCharts() {
      for (const chart in this.$refs) {
        try {
          this.$refs[chart]._update();
        } catch {}
      }
    },

    // callback when mouse hovers over treatment chart
    controllerDataHover(t0, data) {
      if (typeof data == "undefined") {
        return;
      }
      data = JSON.parse(JSON.stringify(data));
      for (const chart in this.$refs) {
        try {
          this.$refs[chart].controllerDataHover(t0, data);
        } catch {}
      }
    },
  },
};
</script>

<template>
  <div>
    <nav class="navbar navbar-expand-md flex">
      <div id="generaloptions" class="container-fluid parameterlist d-flex">
        <div class="d-flex flex-row align-items-center">
          <form class="d-flex align-items-center pe-5">
            <label class="text lead fs-6 px-2">{{ $t("t0") }}</label>
            <input
              id="date-picker"
              class="form-control form-control-sm"
              v-model="t0String"
              type="datetime-local"
            />
          </form>
          <p class="text lead fs-6 m-auto">{{ $t("tspan") }}:</p>
          <p class="text lead fs-5 m-auto px-3">
            <b>{{ tspan }} h</b>
          </p>
          <div class="d-grid gap-2 d-md-flex justify-content-md-end">
            <button
              id="hour"
              class="btn btn-primary me-md-1"
              type="button"
              @click="increment"
            >
              +
            </button>
            <button
              id="hour"
              class="btn btn-primary"
              type="button"
              @click="decrement"
            >
              -
            </button>
          </div>
        </div>

        <button
          type="button"
          class="btn btn-primary"
          id="startbutton"
          @click="run"
        >
          {{ $t("run") }}
        </button>
      </div>
    </nav>
    <div id="options-Holder" class="container-fill">
      <ul class="nav nav-pills nav-fill pt-4">
        <li
          class="nav-item p-3"
          :key="tab.title"
          v-for="(tab, index) in tabList"
          @click="selectTab(index)"
        >
          <a
            class="nav-link"
            v-text="tab"
            :class="{
              'nav-item active': index === activeTab,
              'nav-item inactive': index !== activeTab,
            }"
            href="#"
          ></a>
        </li>
      </ul>
      <ul class="nav nav-pills col-sm-3 flex-column">
        <li
          class="nav-item p-3"
          :value="szenario"
          :key="szenario"
          v-for="szenario in szenarios"
        >
          <a
            class="nav-link nav-item active"
            v-text="szenario.name"
            href="#"
          ></a>
        </li>
      </ul>
      <Scenario @szenarioChanged="szenarioChanged" />
    </div>
    <!--<Meals />-->
    <div id="container">
      <div id="controls">
        <GlucoseStats ref="chartAGP" />
        <!--<InsulinStats />-->
      </div>
      <div id="results">
        <GlucoseChart
          @eventsChanged="eventsChanged"
          :events="this.meals"
          ref="chartG"
        />
      </div>
    </div>
    <div v-show="false">
      <ControllerConfig
        @controllerChanged="controllerChanged"
        v-bind:patient="patientData"
      >
      </ControllerConfig>
      <VirtualPatientConfig @patientChanged="patientChanged">
      </VirtualPatientConfig>
    </div>
  </div>
</template>

<style lang="css">
body {
  overflow-y: scroll;
  min-width: 440px;
}
input[type="datetime-local"]:focus {
  border-color: var(--orange-light);
  box-shadow: 0 0 0 0.25rem var(--orange-light);
}
/* for wide screen, show results next to settings. otherwise below */
div#container {
  font-family: ABeeZee, Candara, Helvetica, sans-serif;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
div#controls {
  width: 15%;
  height: min-content;
}
div#results {
  width: 100%;
  max-width: 850px;
  min-width: 350px;
}
@media screen and (min-width: 850px) {
  div#container {
    flex-wrap: nowrap;
  }
  div#results {
    width: calc(100% - 350px);
  }
}

#container a {
  cursor: pointer;
}

#container input,
select {
  padding: 0.25rem;
  font-size: 0.8rem;
  box-sizing: border-box;
  font-family: inherit;
}

/* outer boxes */
.box {
  border: solid;
  border-width: 1px;
  border-radius: 4px;
  border-color: #586067;
  padding: 5px;
  margin: 5px;
}

/* inner boxes */
.box2 {
  border: solid;
  border-width: 1px;
  border-color: #aaaaaa;
  padding: 0.5rem;
  margin-top: 1rem;
}

/* box that can be opened or closed */
.accordionbox {
  height: 1.25rem;
  overflow: hidden;
  box-sizing: content-box;
}
.boxactive {
  height: auto;
  overflow: visible;
}

/* box title */
#container h2 {
  color: #003160;
  margin-left: 0.5rem;
}
#container h3 {
  margin: 0px;
  font-size: 1.25rem;
  line-height: 1.25rem;
  font-weight: bold;
  position: relative;
  margin-bottom: 1rem;
  color: #586067;
}
#container h3 {
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}
#container h4 {
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

/* arrow to open or close box content */
#container .accordionbox h3::after {
  position: absolute;
  font-size: 1.25rem;
  right: 0.5rem;
  /*    top: -.25em;*/
  transition: all 0.5s;
  content: "\27A6";
  transform: rotate(90deg);
}
#container .boxactive h3::after {
  content: "\27A5";
  transform: rotate(180deg);
}

/* parameter input */
#container .parameterinput {
  width: 90%;
  line-height: 1;
}

/* parameter list container */
#container .parameterlist {
  display: block;
  /*	grid-template-columns: 200px 5.5rem auto;
	grid-template-rows: auto;
	grid-row-gap: 10px;
	align-items: center;*/
  margin-bottom: 10px;
}
#container .parameterlist label {
  font-size: 0.9rem;
  display: grid;
  grid-template-columns: 50% 5.5rem auto;
  grid-template-rows: auto;
  grid-row-gap: 10px;
  align-items: center;
  margin-bottom: 10px;
}
#container .parameterlist hr {
  width: 80%;
}

#container .parameterlist ul {
  padding: 0;
  width: 100%;
}
#container .parameterlist li {
  display: grid;
  width: 100%;
}
#container .item-description .item-input .item-unit {
  display: inline-grid;
}
#container .item-input input {
  width: 6em;
}

/* Chart canvas */
.canvasdiv {
  height: 250px;
  width: 100%;
  margin-top: 1rem;
}

/* button "run simulation"
input#startbutton {
	float: right;
	margin: 1rem;
	padding: 0.5rem;
	font-size: 1rem;
	padding: 0.5em;
}*/

#date-picker {
  color: white;
  border-color: var(--blue-light);
  background-color: var(--blue-light);
}
input[type="datetime-local"]::-webkit-calendar-picker-indicator {
  cursor: pointer;
  opacity: 1;
  filter: invert(1);
}
.navbar {
  background: var(--blue-light);
  border-top: 2px solid var(--blue-dark);
}
#startbutton {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  background-color: var(--blue-dark);
}
.text {
  color: white;
}
#hour {
  background-color: var(--orange-light);
  border-radius: 30%;
  border: 0;
  margin: auto;
}
#options-Holder {
  background: var(--blue-light-tr);
}
#options-Holder .inactive {
  color: var(--blue-dark);
  border: 2px solid var(--blue-light);
  background: white;
}
#options-Holder a {
  background: var(--blue-dark);
  border: 2px solid var(--blue-dark);
}
/* tooltip popups */
.v-popper__inner {
  font-family: ABeeZee, Candara, Helvetica, sans-serif;
}
</style>

}

<i18n locale="en">
{
	"settings": 	"Settings",
	"run": 			"run simulation",
	"general": 		"General options",
	"t0": 			"Simulation start",
	"tspan": 		"Simulation timespan",
	"results":		"Results",
	"timeaxis":		"time",
}
</i18n>
<i18n locale="de">
{
	"settings": 	"Einstellungen",
	"run": 			"Simulation starten",
	"general":		"Allgemein",
	"t0": 			"Simulationsbeginn",
	"tspan":		"Simulationszeitraum",
	"results":		"Ergebnisse",
	"timeaxis":		"Zeit",
}
</i18n>
