/* This file is part of LoopInsighT1, an open source tool to
   simulate closed-loop glycemic control in type 1 diabetes.
   Distributed under the MIT software license.
   See https://lt1.org for further information.	*/

import * as Vue from "vue";
import LT1Main from "./components/LT1Main.vue";
import Simulator from "../core/Simulator.js";
import { createI18n } from "vue-i18n";
import VTooltip from "v-tooltip";
import "v-tooltip/dist/v-tooltip.css";
import "bootstrap/dist/css/bootstrap.min.css";
//import store from "./store";
import { createStore, createLogger } from "vuex";

// prepare Vue app
const LT1VueApp = {
  template: '<LT1Main :runSimulation="runSimulation" ref="main" />',
  components: {
    LT1Main,
  },
  data() {
    return {
      runSimulation: () => {
        // dummy, replaced by actual callback
      },
    };
  },
};

const store = createStore({
  state() {
    return {
      meals: [
        {
          id: 2,
          actual: {
            start:
              new Date(Date.now()).toISOString().substr(0, 11) + "08:00:00",
            duration: 15,
            carbs: 30,
          },
          announcement: {
            start:
              new Date(Date.now()).toISOString().substr(0, 11) + "08:00:00",
            carbs: 30,
            time: new Date(Date.now()).toISOString().substr(0, 11) + "07:00:00",
          },
        },
      ],
      patient: {
        IIReq: 0.7687743244645887,
        inputList: ["meal", "iir", "ibolus"],
        outputList: ["G"],
        parameterList: [
          "BW",
          "Gpeq",
          "VG",
          "k1",
          "k2",
          "VI",
          "m1",
          "m2",
          "m4",
          "m5",
          "m6",
          "HEeq",
          "kmax",
          "kmin",
          "kabs",
          "kgri",
          "f",
          "kp1",
          "kp2",
          "kp3",
          "kp4",
          "ki",
          "Fcns",
          "Vm0",
          "Vmx",
          "Km0",
          "p2u",
          "ke1",
          "ke2",
          "ka1",
          "ka2",
          "kd",
        ],
        stateList: [
          "Gp",
          "Gt",
          "Ip",
          "Il",
          "Qsto1",
          "Qsto2",
          "Qgut",
          "XL",
          "I_",
          "X",
          "Isc1",
          "Isc2",
        ],
        signalList: [
          "RaI",
          "E",
          "EGP",
          "Uid",
          "Uii",
          "I",
          "Qsto",
          "Ra",
          "S",
          "HE",
          "m3",
        ],
        defaultParameters: {
          BW: 75,
          Gpeq: 180,
          VG: 1.88,
          k1: 0.065,
          k2: 0.079,
          VI: 0.05,
          m1: 0.19,
          m2: 0.484,
          m4: 0.194,
          m5: 0.0304,
          m6: 0.6471,
          HEeq: 0.6,
          kmax: 0.0558,
          kmin: 0.008,
          kabs: 0.057,
          kgri: 0.0558,
          f: 0.9,
          kp1: 2.7,
          kp2: 0.0021,
          kp3: 0.009,
          kp4: 0.0618,
          ki: 0.0079,
          Fcns: 1,
          Vm0: 2.5,
          Vmx: 0.047,
          Km0: 225.59,
          p2u: 0.0331,
          ke1: 0.0005,
          ke2: 339,
          ka1: 0.0018,
          ka2: 0.0182,
          kd: 0.0164,
        },
        parameters: {
          BW: 75,
          Gpeq: 180,
          VG: 1.88,
          k1: 0.065,
          k2: 0.079,
          VI: 0.05,
          m1: 0.19,
          m2: 0.484,
          m4: 0.194,
          m5: 0.0304,
          m6: 0.6471,
          HEeq: 0.6,
          kmax: 0.0558,
          kmin: 0.008,
          kabs: 0.057,
          kgri: 0.0558,
          f: 0.9,
          kp1: 2.7,
          kp2: 0.0021,
          kp3: 0.009,
          kp4: 0.0618,
          ki: 0.0079,
          Fcns: 1,
          Vm0: 2.5,
          Vmx: 0.047,
          Km0: 225.59,
          p2u: 0.0331,
          ke1: 0.0005,
          ke2: 339,
          ka1: 0.0018,
          ka2: 0.0182,
          kd: 0.0164,
        },
        xeq: {
          Gp: 180,
          Gt: 136.18855213996963,
          Ip: 2.1160867725422206,
          Il: 2.156181048232494,
          Qsto1: 0,
          Qsto2: 0,
          Qgut: 0,
          XL: 42.32173545084441,
          I_: 42.32173545084441,
          X: 0,
          Isc1: 56.320463330739095,
          Isc2: 50.75030761670995,
        },
      },
      options: {
        t0: "2022-07-10T04:00:00.000Z",
        tmax: "2022-07-10T12:00:00.000Z",
      },
      ControllerOref0: {
        profile: {
          max_iob: 3.5,
          dia: 6,
          max_daily_basal: 1.3,
          max_basal: 3.5,
          max_bg: 120,
          min_bg: 95,
          sens: 50,
          carb_ratio: 9,
          maxCOB: 120,
          type: "current",
          min_5m_carbimpact: 12,
          isfProfile: {
            sensitivities: [
              {
                offset: 0,
                sensitivity: 100,
              },
            ],
          },
        },
        useBolus: true,
        PreBolusTime: 30,
        CarbFactor: 1.11,
      },
      targetValues: {
        upper: 181,
        lower: 69,
      },
    };
  },
  mutations: {
    setMeal: (state, payload) => {
      state.meals = payload;
      //console.log(state.meals);
    },
    setPatient: (state, payload) => {
      state.patient = payload;
    },
    setSzenario: (state, payload) => {
      console.log("hieeer");
      state.meals = payload.meals;
      state.patient = payload.patient;
    },
    setValues: (state, payload) => {
      state.targetValues.upper = payload.upper;
      state.targetValues.lower = payload.lower;
      //.log(state.targetValues.upper);
    },
  },
});

// create
const app = Vue.createApp(LT1VueApp);

// add multi-language support
const i18n = createI18n({
  locale:
    document.getElementsByTagName("html")[0].lang ||
    navigator.language.split("-")[0],
  fallbackLocale: "en",
});
app.use(i18n);

// add tooltip support
app.use(VTooltip);

app.use(store);

// mount
const gui = app.mount("#app");

// prepare simulator
var sim = new Simulator();

// configure callback to run simulation
gui.runSimulation = () => {
  console.log("start simulation");
  //console.log(gui.$refs.main.getPatient());
  sim.setPatient(gui.$refs.main.getPatient());
  sim.setController(gui.$refs.main.getController());
  sim.setMeals(gui.$refs.main.getMeals());
  sim.setOptions(gui.$refs.main.getOptions());
  sim.runSimulation();

  // propagate results to charts
  const results = sim.getSimulationResults();
  gui.$refs.main.propagateSimulationResults(results);
};
