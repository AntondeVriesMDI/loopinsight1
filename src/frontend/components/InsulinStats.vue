<template>
  <div class="insulinStats">
    <div>
      <h3>Insulinstatistik</h3>
    </div>
    <svg class="stats" width="100%" height="116">
      <text x="5%" y="17%" text-anchor="start">Gesamt:</text>
      <text x="95%" y="17%" text-anchor="end">777 u</text>
      <text x="5%" y="35%" text-anchor="start">Basalrate:</text>
      <rect
        x="5%"
        y="40%"
        height="20px"
        :width="xScale(77)"
        id="basal"
        rx="5"
        ry="5"
      ></rect>
      <text x="95%" y="55%" text-anchor="end">77%</text>
      <text x="5%" y="73%" text-anchor="start">Bolus:</text>
      <rect
        x="5%"
        y="78%"
        height="20px"
        :width="xScale(23)"
        id="bolus"
        rx="5"
        ry="5"
      ></rect>
      <text x="95%" y="93%" text-anchor="end">23%</text>
    </svg>
  </div>
</template>

<script>
import * as d3 from "d3";
export default {
  data() {
    return {};
  },
  methods: {
    xScale(value) {
      const xScale = d3.scaleLinear().domain([0, 60]).range([0, 100]);
      return xScale(value);
    },
  },
};
</script>

<style>
.insulinStats {
  padding: 5px;
  margin-top: 80px;
}
.stats {
  border: solid 2px #186ea8;
  border-radius: 7px;
  margin-top: 15px;
}
#basal {
  fill: #f5a83b;
}
#bolus {
  fill: #186ea8;
}
</style>
