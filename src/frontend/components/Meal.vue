<template>
  <div>
    <div>
      <p>Tatsächliche Mahlzeit</p>
      <input
        type="Number"
        id="act_carbs"
        min="0"
        v-model="meal.actual.carbs"
        @change="changed"
      />
      <input
        type="datetime-local"
        id="actual_start"
        :min="this.$store.state.options.t0"
        v-model="tStartString"
        @change="changed"
      />
    </div>
    <div>
      <p>Ankündigung</p>
      <input
        type="Number"
        id="ann_carbs"
        min="0"
        v-model="meal.announcement.carbs"
        @change="changed"
      />
      <input
        type="datetime-local"
        id="actual_start"
        :min="this.$store.state.options.t0"
        v-model="tAnnouncedStartString"
        @change="changed"
      />
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
