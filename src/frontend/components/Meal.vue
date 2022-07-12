<template>
  <div class="card container">
    <div class="card-body">
      <h5 class="card-title">Mahlzeit</h5>
      <div class="mb-3">
        <label for="act_carbs"> Kohlenhydrate (g) </label>
        <input
          class="form-control mb-1"
          type="Number"
          id="act_carbs"
          min="0"
          placeholder="Kohlenhydrate (g)"
          v-model="meal.actual.carbs"
          @change="changed"
        />
        <label for="actual_start"> Zeitpunkt </label>
        <input
          class="form-control mb-1"
          type="datetime-local"
          id="actual_start"
          placeholder="Zeitpunkt"
          :min="this.$store.state.options.t0"
          v-model="tStartString"
          @change="changed"
        />
      </div>

      <div class="mb-3">
        <label for="ann-carbs"> Angekündigte Kohlenhydrate (g) </label>
        <input
          class="form-control mb-1"
          type="Number"
          id="ann_carbs"
          min="0"
          placeholder="Angekündigte Kohlenhydrate (g)"
          v-model="meal.announcement.carbs"
          @change="changed"
        />
        <label for="actual_start"> Angekündigter Zeitpunkt </label>
        <input
          class="form-control mb-1"
          type="datetime-local"
          id="ann_start"
          placeholder="Angekündigte Ko"
          :min="this.$store.state.options.t0"
          v-model="tAnnouncedStartString"
          @change="changed"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { dateToBrowserLocale } from "../../common/util.js";

export default {
  data() {
    return {
      tActualStartString: "",
      tAnnouncedStartString: "",
      tAnnouncementTimeString: "",
    };
  },
  watch: {
    "meal.actual.start": {
      handler: function (val) {
        this.tStartString = dateToBrowserLocale(this.meal.actual.start);
      },
      immediate: true,
    },
    "meal.announcement.start": {
      handler: function (val) {
        this.tAnnouncedStartString = dateToBrowserLocale(
          this.meal.announcement.start
        );
      },
      immediate: true,
    },
    "meal.announcement.time": {
      handler: function (val) {
        this.tAnnouncementTimeString = dateToBrowserLocale(
          this.meal.announcement.time
        );
      },
      immediate: true,
    },
  },
  props: {
    meal: {},
  },
  methods: {
    changed() {
      this.meal.actual.start = new Date(this.tActualStartString);
      this.meal.announcement.start = new Date(this.tAnnouncedStartString);
      this.meal.announcement.time = new Date(this.tAnnouncementTimeString);
      this.$emit("mealChanged", JSON.parse(JSON.stringify(this.meal)));
    },
  },
  computed: {
    actualTime() {
      return new Date(this.meal.actual.time);
    },
  },
};
</script>

<style></style>
