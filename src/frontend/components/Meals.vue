<template>
  <div class="container">
    <div class="row" :key="meal" v-for="meal in meals">
      <Meal class="col" :meal="meal" @mealChanged="mealsChanged" />
    </div>
  </div>
  <button
    type="button"
    class="btn btn-primary"
    id="loadbutton"
    @click="addMeal"
  >
    neue Mahlzeit
  </button>
</template>

<script>
import Meal from "./Meal.vue";
export default {
  components: {
    Meal,
  },
  data() {
    return {
      mealCount: Number,
    };
  },
  methods: {
    mealsChanged(newMeals) {
      //console.log(newMeals);
    },
    addMeal() {
      this.mealCount = this.$store.state.meals.length;
      this.$store.commit("addMeal", {
        id: this.mealCount + 1,
        actual: {
          start: new Date(Date.now()).toISOString().substr(0, 11) + "10:00:00",
          duration: 15,
          carbs: 30,
        },
        announcement: {
          start: new Date(Date.now()).toISOString().substr(0, 11) + "10:00:00",
          carbs: 30,
          time: new Date(Date.now()).toISOString().substr(0, 11) + "07:00:00",
        },
      });
    },
  },
  computed: {
    meals() {
      return this.$store.state.meals;
    },
  },
};
</script>

<style></style>
