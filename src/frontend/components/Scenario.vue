<template>
  <div id="text-font" class="container-fill px-3">
    <div class="row justify-content-md-center">
      <div class="col-2" id="scenario-drop">
        <select
          class="form-select"
          v-model="currentSzenario"
          @change="szenarioSelected"
        >
          <option
            :value="szenario"
            :key="szenario"
            v-for="szenario in szenarios"
          >
            {{ szenario.name }}
          </option>
        </select>
      </div>
      <div class="col-5" id="scenario-box">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">{{ this.currentSzenario.name }}</h5>
            <div class="card-text">
              <p>{{ this.currentSzenario.text }}</p>
              <h6
                v-if="
                  this.currentSzenario.name != 'Kein Szenario' &&
                  this.currentSzenario.name != 'Alkohol'
                "
              >
                Relevante Parameter:
              </h6>
              <div
                class="container"
                :key="parameter"
                v-for="parameter in this.currentSzenario.parameter"
              >
                <div class="row p-1">
                  <input
                    class="col-md-auto"
                    :type="parameter.type"
                    :min="parameter.min"
                    v-model="
                      this.currentSzenario.meals[0][parameter.sz][parameter.zs]
                    "
                  />
                  <div class="col-md-auto">{{ parameter.name }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/base.css";
export default {
  props: {
    senText: String,
  },

  data() {
    return {
      szenarios: {
        keinSzenario: {
          name: "Kein Szenario",
          text: "Diese Funktion unterstützt kein Szenario, damit ebenfalls individuelle Werte über Patient:in, Mahlzeiten und AID-System und Insulin eingestellt werden können.",
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
          meals: [
            {
              id: 0,
              actual: {
                start: "2022-07-10T06:00:00.000Z",
                duration: 15,
                carbs: 15,
              },
              announcement: {
                start: "2022-07-10T06:00:00.000Z",
                carbs: 30,
                time: "2022-07-10T04:00:00.000Z",
              },
            },
          ],
        },
        Überzuckerung: {
          name: "Hyperglykämie",
          text: "Durch eine angekündigte Mahlzeit wird eine Überzuckerung ausgelöst, die durch das AID-System bewältigt werden kann.",
          parameter: [
            {
              type: "Number",
              min: 0,
              name: "Tatsächliche Kohlenhydrate",
              sz: "actual",
              zs: "carbs",
            },
            {
              type: "Number",
              min: 0,
              name: "Angekündigte Kohlenhydrate",
              sz: "announcement",
              zs: "carbs",
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
          meals: [
            {
              id: 0,
              actual: {
                start:
                  new Date(Date.now()).toISOString().substr(0, 11) + "08:00:00",
                duration: 15,
                carbs: 70,
              },
              announcement: {
                start:
                  new Date(Date.now()).toISOString().substr(0, 11) + "08:00:00",
                carbs: 70,
                time:
                  new Date(Date.now()).toISOString().substr(0, 11) + "06:00:00",
              },
            },
          ],
        },
        Unterzuckerung: {
          name: "Hypoglykämie",
          text: "Eine angekündigte Mahlzeit wird nicht eingenommen. Dadurch entsteht einer Hypoglykämie. Diese kann nicht durch das AID-System bewältigt werden.",
          parameter: [
            {
              type: "Number",
              min: 0,
              name: "Tatsächliche Kohlenhydrate",
              sz: "actual",
              zs: "carbs",
            },
            {
              type: "Number",
              min: 0,
              name: "Angekündigte Kohlenhydrate",
              sz: "announcement",
              zs: "carbs",
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
          meals: [
            {
              id: 0,
              actual: {
                start:
                  new Date(Date.now()).toISOString().substr(0, 11) + "08:00:00",
                duration: 15,
                carbs: 0,
              },
              announcement: {
                start:
                  new Date(Date.now()).toISOString().substr(0, 11) + "08:00:00",
                carbs: 60,
                time:
                  new Date(Date.now()).toISOString().substr(0, 11) + "06:00:00",
              },
            },
          ],
        },
        Unterschätzung: {
          name: "Unterschätzung",
          text: "Eine angekündigte Mahlzeit wird unterschätzt. Dadurch isst der:die Patient:in mehr Kohlenhydrate als angegeben. Es entsteht eine Hyperglykämie.",
          parameter: [
            {
              type: "Number",
              min: 0,
              name: "Tatsächliche Kohlenhydrate",
              sz: "actual",
              zs: "carbs",
            },
            {
              type: "Number",
              min: 0,
              name: "Angekündigte Kohlenhydrate",
              sz: "announcement",
              zs: "carbs",
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
          meals: [
            {
              id: 0,
              actual: {
                start:
                  new Date(Date.now()).toISOString().substr(0, 11) + "08:00:00",
                duration: 15,
                carbs: 70,
              },
              announcement: {
                start:
                  new Date(Date.now()).toISOString().substr(0, 11) + "08:00:00",
                carbs: 50,
                time:
                  new Date(Date.now()).toISOString().substr(0, 11) + "06:00:00",
              },
            },
          ],
        },
        Überschätzung: {
          name: "Überschätzung",
          text: "Eine angekündigte Mahlzeit wird überschätzt. Dadurch isst der:die Patient:in weniger Kohlenhydrate als angegeben. Es entsteht eine Hypoglykämie.",
          parameter: [
            {
              type: "Number",
              min: 0,
              name: "Tatsächliche Kohlenhydrate",
              sz: "actual",
              zs: "carbs",
            },
            {
              type: "Number",
              min: 0,
              name: "Angekündigte Kohlenhydrate",
              sz: "announcement",
              zs: "carbs",
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
          meals: [
            {
              id: 0,
              actual: {
                start:
                  new Date(Date.now()).toISOString().substr(0, 11) + "10:00:00",
                duration: 50,
                carbs: 20,
              },
              announcement: {
                start:
                  new Date(Date.now()).toISOString().substr(0, 11) + "10:00:00",
                carbs: 80,
                time:
                  new Date(Date.now()).toISOString().substr(0, 11) + "08:00:00",
              },
            },
          ],
        },
        Alkohol: {
          name: "Alkohol",
          text: "Der Glukosewert im Blut kann durch Alkohol gesenkt werden, d.h. das Szenario einer Unterzuckerung Hypoglykämie kann eintreten. Dieses Feature wird nicht vom Simulator unterstützt.",
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
          meals: [
            {
              id: 0,
              actual: {
                start: "2022-07-10T06:00:00.000Z",
                duration: 15,
                carbs: 15,
              },
              announcement: {
                start: "2022-07-10T06:00:00.000Z",
                carbs: 30,
                time: "2022-07-10T04:00:00.000Z",
              },
            },
          ],
        },
      },
      currentSzenario: {
        name: "Kein Szenario",
        text: "Diese Funktion unterstützt kein Szenario, damit ebenfalls individuelle Werte über Patient:in, Mahlzeiten und AID-System und Insulin eingestellt werden können.",
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
        meals: [
          {
            id: 2,
            actual: {
              start: "2022-07-10T06:00:00.000Z",
              duration: 15,
              carbs: 15,
            },
            announcement: {
              start: "2022-07-10T06:00:00.000Z",
              carbs: 30,
              time: "2022-07-10T04:00:00.000Z",
            },
          },
        ],
      },
    };
  },
  emits: ["szenarioChanged"],
  methods: {
    szenarioSelected() {
      if (this.currentSzenario.name != "Alkohol") {
        this.currentSzenario.patient = this.getPatient();
        this.$store.commit("setSzenario", this.currentSzenario);
        this.$emit("szenarioChanged");
      }
      //this.run();
    },
    getPatient() {
      //console.log(this.$store.state.patient);
      return this.$store.state.patient;
    },
    changeText() {
      switch (this.senText) {
        case "keins":
          this.scenario =
            "Keins <p></p> Diese Funktion unterstützt kein Szenario, damit ebenfalls individuelle Werte über Patient*in, Mahlzeiten und AID-System und Insulin eingestellt werden können.";
          break;
        case "überzuckerung":
          this.scenario =
            "Überzuckerung <p></p> Die Überzuckerung, med. Hyperglykämie, stellt einen zu hohen Glukosewert im Blut dar. <p></p> Hoher Bereich: 181-250 mg/dL <p></p> Sehr hoher Bereich: >250 mg/dL";
          break;
        case "unterzuckerung":
          this.scenario =
            "Unterzuckerung <p></p> Die Unterzuckerung, med. Hypoglykämie, stellt einen zu niedrigen Glukosewert im Blut dar. <p></p> Niedriger Bereich: 54-69 mg/dL <p></p> Sehr niedriger Bereich: <54 mg/dL";
          break;
        case "aufstehen":
          this.scenario =
            "Überzuckerung <p></p> Die Überzuckerung, med. Hyperglykämie, am Morgen stellt einen zu hohen Glukosewert im Blut dar. <p></p> Hoher Bereich: 181-250 mg/dL <p></p> Sehr hoher Bereich: >250 mg/dL";
          break;
        case "alkohol":
          this.scenario = "Alkoholkonsum";
          break;
        case "überschätzung":
          this.scenario =
            "Überschätzung <p></p> Zu große Mahlzeit für Menge an Insulin.";
          break;
        case "unterschätzung":
          this.scenario =
            "Unterschätzung <p></p> Zu kleine Mahlzeit für Menge an Insulin.";
          break;
        case "unangekündigt":
          this.scenario = "Unangekündigte Mahlzeit";
          break;
      }
    },
  },

  mounted() {
    this.changeText;
  },
};
</script>

<style scoped>
#loadbutton {
  width: 100%;
  padding-right: 1.5rem;
  margin-top: 1%;
  margin-bottom: 1%;
  background-color: var(--blue-dark);
}
.form-select {
  width: 100%;
  padding-left: 1.5rem;
  margin-top: 1%;
}
.col-4 {
  position: left;
}
#scenarioBox {
  margin-top: 1%;
  margin-bottom: 1%;
}
#text-font {
  font-family: ABeeZee, Candara, Helvetica, sans-serif;
}
</style>
