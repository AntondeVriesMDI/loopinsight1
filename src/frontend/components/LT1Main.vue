<script>
/* 	This file is part of LoopInsighT1, an open source tool to
   	simulate closed-loop glycemic control in type 1 diabetes.
   	Distributed under the MIT software license.
	See https://lt1.org for further information.	*/

import { defaults } from "chart.js";

import Event from "./Event.vue";
import GlucoseChart from "./GlucoseChart.vue";
import GlucoseStats from "./GlucoseStats.vue";
import Meals from "./Meals.vue";
import Scenario from "./Scenario.vue";

import "../assets/base.css";
import Oref0 from "../components/controllers/Oref0.vue";
import ControllerOref0 from "../../core/controllers/Oref0.js";
import UvaPadova from "../components/models/UvaPadova.vue";
import StartTour from "./StartTour.vue";
export default {
  props: {
    runSimulation: Function,
  },

  beforeMount() {
    // set default options for Chart
  },

  components: {
    Event,
    GlucoseChart,
    GlucoseStats,
    Meals,
    Scenario,

    Oref0,
    UvaPadova,
    StartTour,
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
      tabList: [
        "Szenarien",
        "Mahlzeiten",
        "Patient:innen",
        "Insulin und AID-System",
      ],
      events: {
        meals: this.meals,
      },
      showModal: true,
      showStartScreen: false,
    };
  },
  computed: {
    t0() {
      return new Date(this.t0String.valueOf());
    },
  },
  mounted() {
    //this.showStartScreen = true;
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
    this.getController();
    document.getElementById("container").style.opacity = "0.1";
    document.getElementById("options-Holder").style.opacity = "0.1";
  },
  methods: {
    increment() {
      this.tspan++;
      //console.log(this.tspan);
    },
    decrement() {
      if (this.tspan > 0) {
        this.tspan--;
      }
    },
    selectTab(i) {
      this.activeTab = i;
      // loop over all the tabs
    },
    closeTour() {
      this.showStartScreen = false;
      this.showModal = false;
      document.getElementById("results").style.opacity = "1";
      document.getElementById("options-Holder").style.opacity = "1";
      document.getElementById("container").style.opacity = "1";
      document.getElementById("results").style.border = "none";
      document.getElementById("options-Holder").style.border = "none";
    },
    startTour() {
      this.showStartScreen = false;
      this.showModal = true;
    },
    tourStep(step) {
      if (step == 1) {
        document.getElementById("results").style.opacity = "0.1";
        document.getElementById("options-Holder").style.opacity = "1";
        document.getElementById("options-Holder").style.border =
          "thick solid #F5A83B";
        document.getElementById("options-Holder").style.borderRadius = "7px";
        document.getElementById("results").style.border = "none";
      } else if (step == 2) {
        document.getElementById("container").style.opacity = "1";
        document.getElementById("options-Holder").style.opacity = "0.1";
        document.getElementById("results").style.opacity = "1";
        document.getElementById("results").style.border = "thick solid #F5A83B";
        document.getElementById("results").style.borderRadius = "7px";
        document.getElementById("options-Holder").style.border = "none";
      }
      //>console.log(step);
    },
    noTour() {
      this.showStartScreen = false;
      this.showModal = false;
    },
    run() {
      this.runSimulation();
      document.getElementById("results").scrollIntoView();
      //console.log(this.$store.state.ControllerOref0.useBolus);
    },
    getController() {
      let controller = new ControllerOref0();
      controller.setParameters(
        JSON.parse(JSON.stringify(this.$store.state.ControllerOref0.profile)),
        this.$store.state.ControllerOref0.useBolus,
        this.$store.state.ControllerOref0.PreBolusTime,
        this.$store.state.ControllerOref0.CarbFactor
      );
      return controller;
    },

    getPatient() {
      return this.$store.state.patient;
    },

    patientChanged(newPatient) {
      this.patientObject = newPatient;
      this.$store.commit("setPatient", newPatient);
    },

    getMeals() {
      return JSON.parse(JSON.stringify(this.$store.state.meals));
    },
    getOptions() {
      const t0 = new Date(this.t0.valueOf());
      const tmax = new Date(t0.valueOf() + this.tspan * 3600000);
      return { t0, tmax };
    },

    szenarioChanged() {
      this.resetCharts();
      //this.run();
    },
    eventsChanged(changedEvents) {
      //console.log(this.$store.state.meals);
      console.log(changedEvents);
      this.$store.commit("setMeal", changedEvents);
      //console.log(this.$store.state.meals);
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
    resetCharts() {
      for (const chart in this.$refs) {
        try {
          this.$refs[chart].reset();
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
  <div id="text-font">
    <nav class="navbar navbar-expand-md flex">
      <div id="generaloptions" class="container-fluid parameterlist d-flex">
        <div class="d-flex flex-row align-items-center">
          <form class="d-flex align-items-center pe-5">
            <label class="text lead fs-6 px-2">{{ $t("t0") }}:</label>
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
      <div id="opTour">
        <ul class="px-5 nav nav-pills justify-content-md-center">
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
              :id="index"
            ></a>
          </li>
        </ul>

        <div>
          <div v-show="activeTab == 0">
            <Scenario @szenarioChanged="szenarioChanged" />
          </div>
          <div v-show="activeTab == 1">
            <Meals />
          </div>
          <div v-show="activeTab == 2">
            <UvaPadova @patientChanged="patientChanged" />
          </div>

          <div v-show="activeTab == 3">
            <Oref0 :patient="patientData" />
          </div>
        </div>
      </div>
    </div>

    <!-- use the modal component -->
    <transition name="modal">
      <StartTour v-if="showModal" @close="closeTour" @step="tourStep">
        <!--
          you can use custom content here to overwrite
          default content
        -->
        <template v-slot:header>
          <h3>custom header</h3>
        </template>
      </StartTour>
    </transition>

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
  font-family: ABeeZee, Candara, Helvetica, sans-serif;
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
  border: 2px solid var(--orange-light);
  background-color: var(--blue-light);
}
input[type="datetime-local"]::-webkit-calendar-picker-indicator {
  cursor: pointer;
  opacity: 1;
  filter: invert(1);
}
.navbar {
  background: var(--blue-light);
  border-bottom: 3px solid var(--blue-dark);
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
  padding-bottom: 1em;
  margin-bottom: 3em;
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

#text-font {
  font-family: ABeeZee, Candara, Helvetica, sans-serif;
}

#show-modal {
  padding-left: 2rem;
  padding-right: 2rem;
  margin: 1%;
  background-color: var(--blue-dark);
}

.grey {
  opacity: 0.1;
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
