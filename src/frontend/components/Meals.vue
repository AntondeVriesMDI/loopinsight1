<template>
  <div>
    <div :key="meal" v-for="meal in meals">
      <Meal :meal="meal" @mealChanged="mealsChanged" />
    </div>
  </div>
</template>

<script>
import Meal from "./Meal.vue";
export default {
  components: {
    Meal,
  },
  data() {
    return {};
  },
  methods: {
    mealsChanged(newMeals) {
      //console.log(newMeals);
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
