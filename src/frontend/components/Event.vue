<template>
  <g v-if="this.y < 380 || this.title == 'B'">
    <line
      class="eventLine"
      :y1="this.initcoords.y"
      :y2="this.lineEnd"
      :x1="this.initcoords.x"
      :x2="this.initcoords.x"
    />
    <circle
      @mousedown="handleMouseDown"
      @mouseup="handleMouseUp"
      r="10"
      :cx="this.initcoords.x"
      :cy="this.initcoords.y"
      :class="object"
      ref="events"
    >
      {{ title }}</circle
    >
    <circle
      r="5"
      :cx="this.initcoords.x"
      :cy="this.lineEnd"
      :class="object"
      ref="events"
    >
    </circle>
  </g>
</template>

<script>
import { onMounted } from "@vue/runtime-core";

export default {
  emits: ["eventChanged"],
  props: {
    title: String,
    x: Number,
    y: Number,
    time: Date,
    id: Number,
  },

  data() {
    return {
      object: String,
      coords: {
        x: 0,
        y: 0,
      },
      initcoords: {
        x: 0,
        y: 0,
      },
      lineEnd: 0,
      moovable: false,
    };
  },

  methods: {
    changeColour() {
      switch (this.title) {
        case "M":
          this.object = "meal";
          this.lineEnd = 420;
          this.moovable = true;
          break;

        case "B":
          this.object = "bolus";
          this.lineEnd = 460;
          break;

        case "A":
          this.object = "action";
          this.lineEnd = 460;

          break;
      }
    },
    drag(event) {
      if (this.moovable) {
        const xDiff = this.coords.x - event.pageX;
        const yDiff = this.coords.y - event.pageY;

        this.coords.x = event.pageX;
        this.coords.y = event.pageY;
        this.initcoords.x = this.initcoords.x - xDiff;
        this.initcoords.y = this.initcoords.y - yDiff;
      }
      //console.log("drag");
    },
    handleMouseDown(event) {
      if (this.moovable) {
        //console.log("mouse down");
        this.coords = {
          x: event.pageX,
          y: event.pageY,
        };
        document.addEventListener("mousemove", this.drag);
      }
    },
    handleMouseUp() {
      document.removeEventListener("mousemove", this.drag);
      this.coords = {};

      let changedMeal = {
        id: this.id,
        x: this.initcoords.x,
        y: this.initcoords.y,
        type: this.title,
        time: this.time,
      };
      //console.log(changedMeal);
      this.$emit("eventChanged", changedMeal);
    },
  },
  //todo

  mounted() {
    //console.log(this.x);
    this.changeColour();
    console.log(this.y);
    this.initcoords.x = this.x;
    this.initcoords.y = this.y;
    //console.log(this.x);
  },
};
</script>

<style scoped>
.meal {
  fill: blue;
}

.bolus {
  fill: green;
}

.action {
  fill: red;
}

cirlce.moving {
  stroke: red;
}

cirlce {
  cursor: move;
}
.eventLine {
  stroke: #888888;
  stroke-width: 2;
  fill: none;
  stroke-dasharray: 10 4;
}
</style>
