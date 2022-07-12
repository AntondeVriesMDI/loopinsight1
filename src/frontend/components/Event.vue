<template>
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
    v-tooltip="this.name"
  >
  </circle>
  <g v-if="title == 'M'">
    <svg
      :x="this.initcoords.x - 20"
      :y="this.lineEnd - 20"
      @mousedown="handleMouseDown"
      @mouseup="handleMouseUp"
      width="40"
      height="40"
      viewBox="0 0 80 80"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      xml:space="preserve"
      xmlns:serif="http://www.serif.com/"
      style="
        fill-rule: evenodd;
        clip-rule: evenodd;
        stroke-linejoin: round;
        stroke-miterlimit: 2;
      "
      v-tooltip="this.name"
    >
      <g>
        <circle cx="40" cy="40" r="40" style="fill: rgb(46, 194, 126)" />
        <rect
          x="18"
          y="18"
          width="44"
          height="44"
          style="fill: none; fill-rule: nonzero"
        />
        <path
          d="M38.167,34.5l-3.667,0l0,-12.833l-3.667,-0l0,12.833l-3.666,0l-0,-12.833l-3.667,-0l0,12.833c0,3.887 3.043,7.04 6.875,7.278l0,16.555l4.583,0l0,-16.555c3.832,-0.238 6.875,-3.391 6.875,-7.278l0,-12.833l-3.666,-0l-0,12.833Zm9.166,-5.5l0,14.667l4.584,-0l-0,14.666l4.583,0l-0,-36.666c-5.06,-0 -9.167,4.106 -9.167,7.333Z"
          style="fill: white; fill-rule: nonzero"
        />
      </g>
    </svg>
  </g>
  <g v-else-if="title == 'A'">
    <svg
      :x="this.initcoords.x - 20"
      :y="this.lineEnd - 20"
      width="40"
      height="40"
      viewBox="0 0 80 80"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      xml:space="preserve"
      xmlns:serif="http://www.serif.com/"
      style="
        fill-rule: evenodd;
        clip-rule: evenodd;
        stroke-linejoin: round;
        stroke-miterlimit: 2;
      "
      v-tooltip="this.name"
    >
      <g>
        <circle cx="40" cy="40" r="40" style="fill: rgb(245, 168, 59)" />
        <rect
          x="18"
          y="18"
          width="44"
          height="44"
          style="fill: none; fill-rule: nonzero"
        />
        <path
          d="M51,38.167l0,3.666l7.333,0l0,-3.666l-7.333,-0Zm-3.667,12.118c1.76,1.302 4.052,3.025 5.867,4.382c0.733,-0.972 1.467,-1.962 2.2,-2.934c-1.815,-1.356 -4.107,-3.08 -5.867,-4.4c-0.733,0.99 -1.466,1.98 -2.2,2.952Zm8.067,-22.018c-0.733,-0.972 -1.467,-1.962 -2.2,-2.934c-1.815,1.357 -4.107,3.08 -5.867,4.4c0.734,0.972 1.467,1.962 2.2,2.934c1.76,-1.32 4.052,-3.025 5.867,-4.4Zm-30.067,6.233c-2.016,0 -3.666,1.65 -3.666,3.667l-0,3.666c-0,2.017 1.65,3.667 3.666,3.667l1.834,0l-0,7.333l3.666,0l0,-7.333l1.834,0l9.166,5.5l0,-22l-9.166,5.5l-7.334,0Zm21.084,5.5c-0,-2.438 -1.064,-4.638 -2.75,-6.142l-0,12.265c1.686,-1.485 2.75,-3.685 2.75,-6.123Z"
          style="fill: white; fill-rule: nonzero"
        />
      </g>
    </svg>
  </g>
  <g v-else-if="title == 'B'">
    <svg
      :x="this.initcoords.x - 20"
      :y="this.lineEnd - 20"
      width="40"
      height="40"
      viewBox="0 0 80 80"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      xml:space="preserve"
      xmlns:serif="http://www.serif.com/"
      style="
        fill-rule: evenodd;
        clip-rule: evenodd;
        stroke-linejoin: round;
        stroke-miterlimit: 2;
      "
      v-tooltip="this.name"
    >
      <g>
        <circle cx="40" cy="40" r="40" style="fill: rgb(24, 110, 168)" />
        <g>
          <path
            d="M60.072,30.217l1.928,-1.928l-10.288,-10.289l-1.928,1.928l4.18,4.18l-3.859,3.859l-6.108,-6.108l-1.928,1.928l2.249,2.249l-23.364,23.364l3.859,3.859l-6.813,6.813l1.928,1.928l6.813,-6.813l3.859,3.859l23.364,-23.364l2.249,2.249l1.928,-1.928l-6.108,-6.108l3.859,-3.859l4.18,4.181Zm-29.472,24.973l-5.79,-5.79l3.913,-3.913l2.895,2.895l1.928,-1.928l-2.895,-2.895l3.913,-3.913l2.895,2.895l1.928,-1.928l-2.895,-2.895l3.913,-3.913l2.895,2.895l1.928,-1.928l-2.895,-2.895l3.913,-3.913l5.79,5.79l-21.436,21.436Z"
            style="fill: white; fill-rule: nonzero"
          />
        </g>
      </g>
    </svg>
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
      name: String,
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
          this.name = "Mahlzeit";
          break;

        case "B":
          this.object = "bolus";
          this.lineEnd = 460;
          this.name = "Bolus";
          break;

        case "A":
          this.object = "action";
          this.lineEnd = 460;
          this.name = "Ankündigung";

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
    this.initcoords.x = this.x;
    this.initcoords.y = this.y;
    //console.log(this.x);
  },
};
</script>

<style scoped>
.meal {
  fill: #2ec27e;
}

.bolus {
  fill: #186ea8;
}

.action {
  fill: #f5a83b;
}

cirlce {
  cursor: move;
}
.eventLine {
  stroke: #888888;
  stroke-width: 2;
  fill: none;
  stroke-dasharray: 4 10;
}
</style>
