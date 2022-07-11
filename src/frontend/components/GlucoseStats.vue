<template>
  <div class="statsContainer">
    <div>
      <h3>Glukosestatistik</h3>
    </div>
    <svg class="stats" width="100%" height="365">
      <g :key="rect" v-for="rect in rects">
        <text
          text-anchor="middle"
          :x="rect.center"
          :y="this.yScale(rect.pr) - 10"
        >
          {{ rect.pr }}%
        </text>
        <rect
          class="rect"
          rx="7"
          ry="7"
          :x="rect.x"
          :y="this.yScale(rect.pr)"
          width="10%"
          :height="this.yScale(0) - this.yScale(rect.pr)"
          :id="rect.id"
        ></rect>
        <text
          font-size=".7em"
          text-anchor="middle"
          :x="rects.veryLow.center"
          :y="this.yScale(0) + 15"
        >
          {{ "<" + rects.veryLow.range }}
        </text>
        <text
          font-size=".7em"
          text-anchor="middle"
          :x="rects.low.center"
          :y="this.yScale(0) + 15"
        >
          {{
            rects.veryLow.range +
            "-" +
            Math.floor(this.$store.state.targetValues.lower)
          }}
        </text>
        <text
          font-size=".7em"
          text-anchor="middle"
          :x="rects.target.center"
          :y="this.yScale(0) + 15"
        >
          {{
            Math.floor(this.$store.state.targetValues.lower) +
            "-" +
            Math.floor(this.$store.state.targetValues.upper)
          }}
        </text>
        <text
          font-size=".7em"
          text-anchor="middle"
          :x="rects.high.center"
          :y="this.yScale(0) + 15"
        >
          {{
            Math.floor(this.$store.state.targetValues.upper) +
            "-" +
            rects.veryHigh.range
          }}
        </text>

        <text
          font-size=".7em"
          text-anchor="middle"
          :x="rects.veryHigh.center"
          :y="this.yScale(0) + 15"
        >
          {{ ">" + rects.veryHigh.range }}
        </text>
      </g>

      <text x="5%" y="270" text-anchor="start">Mittelwert:</text>
      <text x="95%" y="270" text-anchor="end">{{ averageGlucose }} mg/dl</text>

      <text x="5%" y="300" text-anchor="start">Variabilität:</text>
      <text x="95%" y="300" text-anchor="end">{{ glucoseVariability }} %</text>

      <text x="5%" y="330" text-anchor="start">Glukosemanagement-</text>
      <text x="5%" y="345" text-anchor="start">indikator (GMI):</text>
      <text x="95%" y="345" text-anchor="end">{{ GMI }} %</text>
    </svg>
  </div>
</template>

<script>
import * as d3 from "d3";
import { curveBasis, stackOffsetNone } from "d3";
import * as util from "../../common/util.js";

export default {
  data() {
    return {
      t_total: 0,
      G: [],
      averageGlucose: 0,
      GMI: 0,
      glucoseVariability: 0,
      rects: {
        veryLow: {
          val: 0,
          pr: 0,
          range: "54",
          x: "5%",
          id: "veryLow",
          center: "10%",
        },
        low: {
          val: 0,
          pr: 0,
          range: this.$store.state.targetValues.lower,
          x: "25%",
          id: "low",
          center: "30%",
        },
        target: {
          val: 0,
          pr: 0,
          range: "67-180",
          x: "45%",
          id: "target",
          center: "50%",
        },
        high: {
          val: 0,
          pr: 0,
          range: "181-250",
          x: "65%",
          id: "high",
          center: "70%",
        },
        veryHigh: {
          val: 0,
          pr: 0,
          range: "250",
          x: "85%",
          id: "veryHigh",
          center: "90%",
        },
      },
    };
  },
  methods: {
    yScale(value) {
      const scale = d3.scaleLinear().domain([0, 100]).range([225, 30]);
      return scale(value);
    },
    setSimulationResults(simResults) {
      this.reset();
      for (const result of simResults) {
        const { t, x, u, y, logData } = result;
        this._pushRecord(t, x, u, y, logData);
      }
      this._update;
    },
    reset() {
      this.G = [];
      this.rects.veryLow.pr = 0;
      this.rects.low.pr = 0;
      this.rects.veryHigh.pr = 0;
      this.rects.high.pr = 0;
      this.rects.target.pr = 0;
      this.rects.veryLow.val = 0;
      this.rects.low.val = 0;
      this.rects.veryHigh.val = 0;
      this.rects.high.val = 0;
      this.rects.target.val = 0;

      this.t_total = 0;
    },
    _update() {
      this.averageGlucose = Math.round(util.mean(this.G));
      this.GMI = Math.round((3.38 + 0.02345 * this.averageGlucose) * 10) / 10;
      this.glucoseVariability = Math.round(
        100 * util.coefficientOfVariation(this.G)
      );
    },
    _pushRecord(_t, _x, _u, y, _log) {
      this.G.push(y.G);
      this.t_total++;
      let G = y.G;
      if (G < 54) {
        this.rects.veryLow.val++;
      } else if (G >= 54 && G < this.$store.state.targetValues.lower) {
        this.rects.low.val++;
      } else if (G > 250) {
        this.rects.veryHigh.val++;
      } else if (G > this.$store.state.targetValues.upper && G <= 250) {
        this.rects.high.val++;
      } else if (
        G >= this.$store.state.targetValues.lower &&
        G <= this.$store.state.targetValues.upper
      ) {
        this.rects.target.val++;
      }

      this.rects.target.pr = this.tir_target_percent;
      this.rects.veryHigh.pr = this.tir_veryhigh_percent;
      this.rects.high.pr = this.tir_high_percent;
      this.rects.veryLow.pr = this.tir_verylow_percent;
      this.rects.low.pr = this.tir_low_percent;
    },
  },
  computed: {
    tir_veryhigh_percent: function () {
      return this.t_total <= 0
        ? 0
        : Math.round((100 * this.rects.veryHigh.val) / this.t_total);
    },
    tir_high_percent: function () {
      return this.t_total <= 0
        ? 0
        : Math.round((100 * this.rects.high.val) / this.t_total);
    },
    tir_target_percent: function () {
      return this.t_total <= 0
        ? 0
        : Math.round((100 * this.rects.target.val) / this.t_total);
    },
    tir_low_percent: function () {
      return this.t_total <= 0
        ? 0
        : Math.round((100 * this.rects.low.val) / this.t_total);
    },
    tir_verylow_percent: function () {
      return this.t_total <= 0
        ? 0
        : Math.round((100 * this.rects.veryLow.val) / this.t_total);
    },
  },
};
</script>

<style>
.statsContainer {
  padding: 5px;
}
.container {
  float: left;
}
.rect {
  fill: blue;
}

.stats {
  border: solid 2px #186ea8;
  border-radius: 7px;
  margin-top: 15px;
}

#veryLow {
  fill: #ffa1a1;
}
#low {
  fill: #ffd3d3;
}
#target {
  fill: #186ea8;
}
#high {
  fill: #ffe5a1;
}
#veryHigh {
  fill: #ffcf52;
}
</style>
