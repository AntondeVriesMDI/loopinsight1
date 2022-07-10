<template>
  <svg id="svg" class="svg" width="100%" height="700" ref="glucoseSvg">
    <g v-if="datahere">
      <g :key="meal.id" v-for="meal in myEvents">
        <Event
          title="A"
          :x="scaleX(meal.announcement.start)"
          :y="scaleFood(meal.announcement.carbs)"
          :id="meal.id"
          @eventChanged="eventChanged"
        ></Event>
        <Event
          title="M"
          :x="scaleX(meal.actual.start)"
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
    <text x="30" y="15">Glukose (mg/dl)</text>
    <text text-anchor="end" :x="this.svgWidth - 30" y="15">
      Kohlenhydrate g
    </text>

    <path class="line" :d="line[0]" />
    <path class="line" :d="basalLine[0]" />
    <g :key="tick" v-for="tick in yTicks">
      <text
        class="tickText"
        text-anchor="end"
        x="25"
        dy=".25em"
        :y="scaleY(tick)"
      >
        {{ tick }}
      </text>
      <line
        class="tick"
        :y1="scaleY(tick)"
        :y2="scaleY(tick)"
        x1="30"
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
        y1="30"
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

    <text
      class="stakeholderText"
      text-anchor="start"
      y="420"
      dy=".25em"
      :x="30"
    >
      Patient*innen
    </text>
    <line
      class="stakeholderLine"
      x1="125"
      :x2="this.svgWidth - 30"
      y1="420"
      y2="420"
    />

    <text
      class="stakeholderText"
      text-anchor="start"
      y="460"
      dy=".25em"
      :x="30"
    >
      AID-System
    </text>
    <line
      class="stakeholderLine"
      x1="125"
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
        x="25"
      >
        {{ tick }}
      </text>

      <line
        class="tick"
        :y1="scaleAIDy(tick)"
        :y2="scaleAIDy(tick)"
        x1="30"
        :x2="this.svgWidth - 30"
      ></line>
    </g>
    <text x="30" y="500">Bolus U, Basalrate U/h</text>

    <defs>
      <linearGradient
        id="gradient1"
        x1="0"
        x2="0"
        :y1="scaleY(40)"
        :y2="scaleY(280)"
        gradientUnits="userSpaceOnUse"
      >
        <stop :offset="borders[0]" style="stop-color: green; stop-opacity: 1" />
        <stop :offset="borders[2]" style="stop-color: red; stop-opacity: 1" />
      </linearGradient>
    </defs>
  </svg>
</template>

<script>
import * as d3 from "d3";
import { curveBasis, stackOffsetNone } from "d3";
import Event from "./Event.vue";

export default {
  data() {
    return {
      options: {},
      timeSpan: 9,
      goals: [0, 0],
      yTicks: [40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260],
      xTicks: [],
      AIDyTicks: [0, 1, 2, 3, 4],
      fTicks: [0, 10, 20, 30, 40],
      data: [],
      AidData: [],
      basalData: [],
      meals: [],
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
  },
  props: {
    events: Object,
  },
  emits: ["eventsChanged"],
  mounted() {
    this.svgWidth = this.$refs.glucoseSvg.clientWidth - 10;
    this.getOffset();
  },
  methods: {
    reset() {
      this.data = [];
      this.xTicks = [];
      this.meals = [];
      this.myEvents = {};
      this.line = [];
      this.basalData = [];
      this.basalLine = [];
      this.boluses = [];
    },
    eventChanged(changedEvent) {
      console.log(changedEvent);
      console.log(this.scaleTinvert(changedEvent.x).toISOString());
      if (changedEvent.type == "M") {
        for (let i = 0; i <= this.events.length - 1; i++) {
          if (this.events[i].id == changedEvent.id) {
            this.events[i].actual.carbs = this.scaleFinvert(changedEvent.y);
            this.events[i].actual.start = this.scaleTinvert(changedEvent.x)
              .toISOString()
              .toString();
          }
        }
        this.$emit("eventsChanged", this.events);
      } else if (changedEvent.type == "A") {
        for (let i = 0; i <= this.events.length - 1; i++) {
          if (this.events[i].id == changedEvent.id) {
            this.events[i].announcement.carbs = this.scaleFinvert(
              changedEvent.y
            );
            this.events[i].announcement.start = this.scaleTinvert(
              changedEvent.x
            )
              .toISOString()
              .toString();
          }
        }
        this.$emit("eventsChanged", this.events);
      }
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
      //console.log(simResults);
      this.reset();
      this.maxY = simResults[0].y.G;
      this.minY = simResults[0].y.G;
      let mealid = 0;
      for (let i = 0; i < simResults.length; i++) {
        if (!isNaN(simResults[i].u.meal)) {
          this.meals.push(simResults[i]);
          this.meals[this.meals.length - 1].id = mealid;
          mealid = mealid + 1;
          console.log(this.meals);
        }
        this.data.push({ t: simResults[i].t, y: simResults[i].y.Gp });

        if (simResults[i].u.ibolus > 0) {
          this.boluses.push({ t: simResults[i].t, y: simResults[i].u.ibolus });
        }
        //console.log(this.boluses);

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

      /**d3.select("path")
        .attr("stroke-width", 3)
        .attr("stroke", "url(#gradient1)")
        .attr("fill", "none");*/
    },
    scaleFinvert(value) {
      const fScale = d3.scaleLinear().domain([40, 0]).range([30, 380]);
      return fScale.invert(value);
    },
    scaleY(value) {
      const yScale = d3.scaleLinear().domain([260, 40]).range([30, 380]);
      return yScale(value);
    },
    scaleAIDy(value) {
      const scale = d3.scaleLinear().domain([4, 0]).range([515, 631]);
      return scale(value);
    },
    scaleX(value) {
      const xScale = d3
        .scaleTime()
        .domain([this.startDate, this.endDate])
        .range([30, this.svgWidth - 30]);
      //d3.scaleLinear().domain([this.xTicks[0], this.xTicks[this.xTicks.length - 1]]).range([30, this.svgWidth]);
      return xScale(value);
    },
    scaleTinvert(value) {
      const xScale = d3
        .scaleTime()
        .domain([this.startDate, this.endDate])
        .range([30, this.svgWidth - 30]);
      //d3.scaleLinear().domain([this.xTicks[0], this.xTicks[this.xTicks.length - 1]]).range([30, this.svgWidth]);
      return xScale.invert(value);
    },
    scaleFood(value) {
      const fScale = d3.scaleLinear().domain([40, 0]).range([30, 380]);
      return fScale(value);
    },
  },
};
</script>

<style scoped>
.svg {
  border: 1px solid red;
}
.tick {
  stroke: #888888;
  stroke-width: 0.5;
}
.line {
  stroke: #186ea8;
  stroke-width: 3;
  fill: none;
}
.stakeholderLine {
  stroke: #888888;
  stroke-width: 4;
  fill: none;
  stroke-dasharray: 10 4;
}

.eventLine {
  stroke: #888888;
  stroke-width: 4;
  fill: none;
  stroke-dasharray: 10 4;
}
</style>
