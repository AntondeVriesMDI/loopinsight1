<template>
  <line
    :class="className"
    :y1="this.initcoords.y"
    :y2="this.initcoords.y"
    x1="40"
    :x2="this.x"
  />
  <circle
    :class="className"
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
    r="5"
    cx="40"
    :cy="this.initcoords.y"
  />
</template>

<script>
import * as d3 from "d3";
export default {
  data() {
    return {
      coords: {
        x: 0,
        y: 0,
      },
      initcoords: {
        x: 0,
        y: 0,
      },
    };
  },
  props: {
    x: Number,
    y: Number,
    className: String,
  },
  mounted() {
    console.log(this.x);
    this.initcoords.y = this.y;
    this.initcoords.x = this.x;
    //console.log(this.x);
  },
  methods: {
    scaleYinvert(value) {
      const yScale = d3.scaleLinear().domain([260, 40]).range([15, 380]);
      return yScale.invert(value);
    },
    drag(event) {
      const yDiff = this.coords.y - event.pageY;
      this.coords.y = event.pageY;
      this.initcoords.y = this.initcoords.y - yDiff;

      //console.log("drag");
    },
    handleMouseDown(event) {
      //console.log("mouse down");
      this.coords = {
        y: event.pageY,
      };
      document.addEventListener("mousemove", this.drag);
    },
    handleMouseUp() {
      document.removeEventListener("mousemove", this.drag);
      this.coords = {};
      let payload;
      if (this.className == "upper") {
        payload = {
          upper: this.scaleYinvert(this.initcoords.y),
          lower: this.$store.state.targetValues.lower,
        };
        this.$store.commit("setValues", payload);
      } else {
        let payload = {
          lower: this.scaleYinvert(this.initcoords.y),
          upper: this.$store.state.targetValues.upper,
        };
        this.$store.commit("setValues", payload);
      }
    },
  },
};
</script>

<style>
.upper {
  stroke: #ffcf52;
  stroke-width: 3;
  fill: #ffcf52;
}

.lower {
  stroke: #ffa1a1;
  stroke-width: 3;
  fill: #ffa1a1;
}
</style>
