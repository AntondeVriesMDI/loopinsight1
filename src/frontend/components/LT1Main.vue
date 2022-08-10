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
import Oref0 from "../components/controllers/Oref0.vue";
import ControllerOref0 from "../../core/controllers/Oref0.js";
import UvaPadova from "../components/models/UvaPadova.vue";
import StartTour from "./StartTour.vue";

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
      showModal: false,
      showStartScreen: false,
    };
  },
  computed: {
    t0() {
      return new Date(this.t0String.valueOf());
    },
  },
  mounted() {
    this.showStartScreen = true;
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
    closeTour() {
      this.showStartScreen = false;
      this.showModal = false;
    },
    startTour() {
      this.showStartScreen = false;
      this.showModal = true;
    },
    noTour() {
      this.showStartScreen = false;
      this.showModal = false;
    },
    run() {
      this.runSimulation();
      document.getElementById("results").scrollIntoView();
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
    patientChanged(newPatient) {
      this.patientObject = newPatient;
      this.$store.commit("setPatient", newPatient);
      console.log("changedAPtient!");
    },
    mealsChanged(newMeals) {
      this.meals = newMeals;
    },
    szenarioChanged() {
      this.resetCharts();
      //this.run();
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
          ></a>
        </li>
      </ul>

      <div v-if="showStartScreen">
        <div id="text-font" class="container-fill px-3">
        <div class="row justify-content-md-center">
            <div class="col-5" id="scenario-box">
        <div class="card">
          <div class="card-body">
            <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.0936 12.4729C18.608 11.5445 18.4998 10.4643 18.7917 9.45796C19.0837 8.45164 19.7531 7.59704 20.6603 7.07267C21.5675 6.5483 22.6422 6.39472 23.6599 6.644C24.6776 6.89329 25.5597 7.52616 26.1218 8.41042L32.2155 18.9526" stroke="#186EA8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M13.6913 19.3368L10.4413 13.7102C9.95562 12.7818 9.84745 11.7016 10.1394 10.6953C10.4313 9.68894 11.1008 8.83434 12.008 8.30997C12.9151 7.7856 13.9898 7.63202 15.0075 7.88131C16.0253 8.13059 16.9073 8.76346 17.4694 9.64773L24.3757 21.6118" stroke="#186EA8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M31.2821 33.5765C30.7469 32.654 30.399 31.6349 30.2584 30.5777C30.1178 29.5205 30.1872 28.4459 30.4628 27.4156C30.7383 26.3852 31.2144 25.4194 31.8639 24.5735C32.5134 23.7275 33.3235 23.0181 34.2478 22.4859L32.2165 18.9515C31.6778 18.0168 31.5324 16.9064 31.8124 15.8646C32.0924 14.8227 32.7748 13.9347 33.7095 13.396C34.6442 12.8573 35.7546 12.7119 36.7964 12.9919C37.8383 13.2719 38.7262 13.9543 39.265 14.889L43.3275 21.9374C45.4823 25.6708 46.0659 30.1072 44.9498 34.2708C43.8336 38.4344 41.1092 41.9841 37.3759 44.139C33.6426 46.2939 29.2061 46.8774 25.0425 45.7613C20.8789 44.6452 17.3292 41.9208 15.1743 38.1874L6.64308 23.3999C6.37633 22.9371 6.20335 22.4263 6.13402 21.8966C6.06469 21.367 6.10035 20.8289 6.23899 20.313C6.51898 19.2711 7.20137 18.3832 8.13605 17.8445C9.07073 17.3057 10.1811 17.1604 11.223 17.4404C12.2648 17.7204 13.1528 18.4027 13.6915 19.3374L18.1603 27.0765" stroke="#186EA8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16.4734 48.75C13.7134 46.8463 11.4157 44.3474 9.75 41.4375" stroke="#186EA8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M35.75 6.29691C37.6042 6.29189 39.4267 6.77789 41.0322 7.7055C42.6376 8.63312 43.9689 9.96928 44.8906 11.5782" stroke="#186EA8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <h5 class="card-title"> Einführung in den LoopInsight AID-Simulator </h5>
            <div class="card-text">
              <p>In diesem Simulator können Sie in den verschiedenen Reitern, Szenarien, Patient:in, Mahlzeiten oder AID-System und Insulin, Paramter für die Simulation von z.B. verschiedenen Szenarien durch den Algorithmus berechnen und anzeigen lassen. Dabei können Sie in jedem Reiter einzeln die Paramter anpassen oder zusätzlich ein Szenario, wie z.B. Über- oder Unterzuckerung, dazu auswählen.</p>
                </div>
                <button class="btn btn-primary" id="show-modal" @click="startTour">Tour starten</button>
                <button class="btn btn-primary" id="show-modal" @click="noTour">Tour überspringen</button>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

      <div v-else>
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

     
    <!-- use the modal component -->
    <transition name="modal">
      <StartTour v-if="showModal" @close="closeTour">
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
