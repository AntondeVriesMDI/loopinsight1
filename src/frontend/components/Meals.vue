<template>
  <div class="container-fill px-3">
    <div class="row justify-content-md-center">
      <Meal
        :key="meal"
        v-for="meal in meals"
        class="col-md-auto mx-2"
        :meal="meal"
        @mealChanged="mealsChanged"
      />
      <div class="col-2">
        <button
          type="button"
          class="btn btn-primary align-self-end"
          id="addMealButton"
          @click="addMeal"
        >
          Neue Mahlzeit
        </button>
      </div>
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
        id: this.mealCount,
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

<style>
#addMealButton {
  width: 100%;
  padding-right: 1.5rem;
  margin-top: 1%;
  margin-bottom: 1%;
  background-color: var(--blue-dark);
}
</style>
