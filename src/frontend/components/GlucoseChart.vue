<template>
  <div class="graphContainer">
    <div>
      <h3 class="graphHeader">Glukose (mg/dl)</h3>
      <h3 class="graphHeader rightHeader">Kohlenhydrate g</h3>
    </div>
    <svg id="svg" class="svg" width="100%" height="700" ref="glucoseSvg">
      <g :key="tick" v-for="tick in yTicks">
        <text
          class="tickText"
          text-anchor="end"
          x="30"
          dy=".25em"
          :y="scaleY(tick)"
        >
          {{ tick }}
        </text>
        <line
          class="tick"
          :y1="scaleY(tick)"
          :y2="scaleY(tick)"
          x1="40"
          :x2="this.svgWidth - 30"
        ></line>
      </g>
      <g :key="tick" v-for="tick in xTicks">
        <text
          class="tickText"
          text-anchor="middle"
          y="395"
          dy=".25em"
          :x="scaleX(tick)"
        >
          {{ tick.getHours() }}
        </text>
        <line
          class="tick"
          :x1="scaleX(tick)"
          :x2="scaleX(tick)"
          y1="515"
          y2="631"
        ></line>
        <text
          class="tickText"
          text-anchor="middle"
          y="646"
          dy=".25em"
          :x="scaleX(tick)"
        >
          {{ tick.getHours() }}
        </text>
        <line
          class="tick"
          :x1="scaleX(tick)"
          :x2="scaleX(tick)"
          y1="15"
          y2="380"
        ></line>
      </g>
      <g :key="tick" v-for="tick in fTicks">
        <text
          class="tickText"
          text-anchor="start"
          :y="scaleFood(tick)"
          dy=".25em"
          :x="this.svgWidth - 20"
        >
          {{ tick }}
        </text>

        <line
          class="tick"
          :y1="scaleFood(tick)"
          :y2="scaleFood(tick)"
          :x1="this.svgWidth - 30"
          :x2="this.svgWidth - 25"
        ></line>
      </g>
      <line
        class="stakeholderLine"
        x1="150"
        :x2="this.svgWidth - 30"
        y1="420"
        y2="420"
      />
      <line
        class="stakeholderLine"
        x1="135"
        :x2="this.svgWidth - 30"
        y1="460"
        y2="460"
      />
      <g :key="tick" v-for="tick in AIDyTicks">
        <text
          class="tickText"
          text-anchor="end"
          :y="scaleAIDy(tick)"
          dy=".25em"
          x="30"
        >
          {{ tick }}
        </text>

        <line
          class="tick"
          :y1="scaleAIDy(tick)"
          :y2="scaleAIDy(tick)"
          x1="40"
          :x2="this.svgWidth - 30"
        ></line>
      </g>
      <BorderLine
        :className="'upper'"
        :x="this.svgWidth - 30"
        :y="scaleY(this.$store.state.targetValues.upper)"
        v-tooltip="'Obere Grenze:'"
      />
      <BorderLine
        :className="'lower'"
        :x="this.svgWidth - 30"
        :y="scaleY(this.$store.state.targetValues.lower)"
      />
      <path id="glucoseLine" class="line" :d="line[0]" />
      <path id="bolusLine" :d="basalLine[0]" />
      <g v-if="datahere">
        <g :key="meal" v-for="meal in meals">
          <Event
            title="A"
            :x="scaleX(new Date(meal.announcement.start))"
            :y="scaleFood(meal.announcement.carbs)"
            :id="meal.id"
            @eventChanged="eventChanged"
          ></Event>
          <Event
            title="M"
            :x="scaleX(new Date(meal.actual.start))"
            :y="scaleFood(meal.actual.carbs)"
            :id="meal.id"
            @eventChanged="eventChanged"
          ></Event>
          >
        </g>
        <g :key="bolus" v-for="bolus in boluses">
          <Event
            title="B"
            :x="scaleX(bolus.t)"
            :y="scaleAIDy(bolus.y)"
            :id="bolus.id"
            @eventChanged="eventChanged"
          ></Event>
        </g>
      </g>

      <text
        class="stakeholderText"
        text-anchor="start"
        y="420"
        dy=".25em"
        x="40"
      >
        Patient*innen
      </text>
      <text
        class="stakeholderText"
        text-anchor="start"
        y="460"
        dy=".25em"
        x="40"
      >
        AID-System
      </text>
      <text x="40" y="500">Bolus U, Basalrate U/h</text>

      <defs>
        <linearGradient
          id="gradient1"
          x1="0"
          x2="0"
          :y1="scaleY(this.$store.state.targetValues.upper + 1)"
          :y2="scaleY(this.$store.state.targetValues.lower - 1)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" style="stop-color: #ffcf52; stop-opacity: 1" />
          <stop offset="1%" style="stop-color: #186ea8; stop-opacity: 1" />
          <stop offset="99%" style="stop-color: #186ea8; stop-opacity: 1" />
          <stop offset="100%" style="stop-color: #ffa1a1; stop-opacity: 1" />
        </linearGradient>
      </defs>
    </svg>
  </div>
</template>

<script>
import * as d3 from "d3";
import { curveBasis, stackOffsetNone } from "d3";
import Event from "./Event.vue";
import BorderLine from "./BorderLine.vue";

export default {
  data() {
    return {
      options: {},
      timeSpan: 9,
      goals: [0, 0],
      yTicks: [40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260],
      xTicks: [],
      AIDyTicks: [0, 2, 4, 6, 8, 10],
      fTicks: [0, 20, 40, 60, 80, 100],
      data: [],
      AidData: [],
      basalData: [],
      boluses: [],
      maxY: Number,
      minY: Number,
      maxX: Number,
      minX: Number,
      svgWidth: Number,
      line: [],
      basalLine: [],
      startDate: Number,
      endDate: Number,
      borders: [100, 120],
      offsets: [0, 0, 0, 0],
      myEvents: [],
      datahere: false,
    };
  },
  components: {
    Event,
    BorderLine,
  },
  props: {
    events: Object,
  },
  emits: ["eventsChanged"],
  mounted() {
    this.svgWidth = this.$refs.glucoseSvg.clientWidth - 10;
    this.getOffset();
  },
  computed: {
    meals() {
      return this.$store.state.meals;
    },
  },
  methods: {
    update() {
      console.log("update");
    },
    reset() {
      this.data = [];
      this.xTicks = [];
      this.myEvents = {};
      this.line = [];
      this.basalData = [];
      this.basalLine = [];
      this.boluses = [];
      this.datahere = false;
    },
    eventChanged(changedEvent) {
      let payload = this.meals;
      if (changedEvent.type == "M") {
        for (let i = 0; i <= payload.length - 1; i++) {
          if (payload[i].id == changedEvent.id) {
            payload[i].actual.carbs = this.scaleFinvert(changedEvent.y);
            payload[i].actual.start = this.scaleTinvert(changedEvent.x);
          }
        }
      } else if (changedEvent.type == "A") {
        for (let i = 0; i <= payload.length - 1; i++) {
          if (payload[i].id == changedEvent.id) {
            payload[i].announcement.carbs = this.scaleFinvert(changedEvent.y);
            payload[i].announcement.start = this.scaleTinvert(changedEvent.x);
          }
        }
      }

      this.$emit("eventsChanged", JSON.parse(JSON.stringify(payload)));
    },
    getOffset() {
      let top = this.scaleY(this.borders[1]);
      let bottom = this.scaleY(this.borders[0]);
      let spam = 260 - 40;
      this.offsets[0] = (top / spam) * 100 - 100;
      this.offsets[1] = (top / spam) * 100 - 100;
      this.offsets[2] = (bottom / spam) * 100 - 100;
      this.offsets[3] = (bottom / spam) * 100 - 100;
    },
    setSimulationResults(simResults) {
      console.log(simResults);
      this.reset();
      this.maxY = simResults[0].y.G;
      this.minY = simResults[0].y.G;
      for (let i = 0; i < simResults.length; i++) {
        this.data.push({ t: simResults[i].t, y: simResults[i].y.Gp });

        if (simResults[i].u.ibolus > 0) {
          //console.log(simResults[i]);
          this.boluses.push({ t: simResults[i].t, y: simResults[i].u.ibolus });
        }
        this.basalData.push({
          t: simResults[i].t,
          y: simResults[i].u.iir,
        });
      }
      for (const dataPoint of this.data) {
        if (this.maxY < dataPoint.y.G) {
          this.maxY = dataPoint.y.G;
        }
        if (this.minY > dataPoint.y.G) {
          this.minY = dataPoint.y.G;
        }
        if (dataPoint.t.getMinutes() == 0) {
          this.xTicks.push(dataPoint.t);
        }
      }
      this.startDate = this.data[0].t;
      this.endDate = this.data[this.data.length - 1].t;

      this.line.push(
        d3
          .line()
          .x((d) => this.scaleX(d.t))
          .y((d) => this.scaleY(d.y))
          .curve(curveBasis)(this.data)
      );

      this.basalLine.push(
        d3
          .line()
          .x((d) => this.scaleX(d.t))
          .y((d) => this.scaleAIDy(d.y))
          .curve(curveBasis)(this.basalData)
      );

      this.myEvents = this.events;

      for (let i = 0; i <= this.myEvents.length - 1; i++) {
        const ann = new Date(this.myEvents[i].announcement.start);
        this.myEvents[i].announcement.start = ann;

        const act = new Date(this.myEvents[i].actual.start);
        this.myEvents[i].actual.start = act;
      }

      this.datahere = true;

      d3.select("#glucoseLine")
        .attr("stroke-width", 5)
        .attr("stroke", "url(#gradient1)")
        .attr("fill", "none");
    },
    scaleFinvert(value) {
      const fScale = d3.scaleLinear().domain([100, 0]).range([40, 380]);
      return fScale.invert(value);
    },
    scaleY(value) {
      const yScale = d3.scaleLinear().domain([260, 40]).range([15, 380]);
      return yScale(value);
    },
    scaleAIDy(value) {
      const scale = d3.scaleLinear().domain([10, 0]).range([515, 631]);
      return scale(value);
    },
    scaleX(value) {
      const xScale = d3
        .scaleTime()
        .domain([this.startDate, this.endDate])
        .range([40, this.svgWidth - 30]);
      //d3.scaleLinear().domain([this.xTicks[0], this.xTicks[this.xTicks.length - 1]]).range([30, this.svgWidth]);
      return xScale(value);
    },
    scaleTinvert(value) {
      const xScale = d3
        .scaleTime()
        .domain([this.startDate, this.endDate])
        .range([40, this.svgWidth - 30]);
      //d3.scaleLinear().domain([this.xTicks[0], this.xTicks[this.xTicks.length - 1]]).range([30, this.svgWidth]);
      return xScale.invert(value);
    },
    scaleFood(value) {
      const fScale = d3.scaleLinear().domain([100, 0]).range([15, 380]);
      return fScale(value);
    },
  },
};
</script>

<style scoped>
.graphContainer {
  padding: 5px;
}
.graphHeader {
  display: inline;
}
.rightHeader {
  float: right;
}
.tick {
  stroke: #888888;
  stroke-width: 0.5;
}
.line {
  fill: none;
}
.stakeholderLine {
  stroke: #888888;
  stroke-width: 4;
  fill: none;
  stroke-dasharray: 10 4;
}

#bolusLine {
  stroke: #f5a83b;
  stroke-width: 4;
  fill: none;
}
.eventLine {
  stroke: #888888;
  stroke-width: 4;
  fill: none;
  stroke-dasharray: 10 4;
}

.upperBorder {
  stroke: #ffcf52;
  stroke-width: 3;
  fill: none;
}
.lowerBorder {
  stroke: #ffa1a1;
  stroke-width: 3;
  fill: none;
}
</style>
