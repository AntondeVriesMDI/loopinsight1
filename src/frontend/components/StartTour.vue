<template>
  <div type="text/x-template" id="modal-template">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div id="modal-container">
          <svg
            class="svg"
            width="50"
            height="50"
            viewBox="0 0 52 52"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.0936 12.4729C18.608 11.5445 18.4998 10.4643 18.7917 9.45796C19.0837 8.45164 19.7531 7.59704 20.6603 7.07267C21.5675 6.5483 22.6422 6.39472 23.6599 6.644C24.6776 6.89329 25.5597 7.52616 26.1218 8.41042L32.2155 18.9526"
              stroke="#FFFFFF"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M13.6913 19.3368L10.4413 13.7102C9.95562 12.7818 9.84745 11.7016 10.1394 10.6953C10.4313 9.68894 11.1008 8.83434 12.008 8.30997C12.9151 7.7856 13.9898 7.63202 15.0075 7.88131C16.0253 8.13059 16.9073 8.76346 17.4694 9.64773L24.3757 21.6118"
              stroke="#FFFFFF"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M31.2821 33.5765C30.7469 32.654 30.399 31.6349 30.2584 30.5777C30.1178 29.5205 30.1872 28.4459 30.4628 27.4156C30.7383 26.3852 31.2144 25.4194 31.8639 24.5735C32.5134 23.7275 33.3235 23.0181 34.2478 22.4859L32.2165 18.9515C31.6778 18.0168 31.5324 16.9064 31.8124 15.8646C32.0924 14.8227 32.7748 13.9347 33.7095 13.396C34.6442 12.8573 35.7546 12.7119 36.7964 12.9919C37.8383 13.2719 38.7262 13.9543 39.265 14.889L43.3275 21.9374C45.4823 25.6708 46.0659 30.1072 44.9498 34.2708C43.8336 38.4344 41.1092 41.9841 37.3759 44.139C33.6426 46.2939 29.2061 46.8774 25.0425 45.7613C20.8789 44.6452 17.3292 41.9208 15.1743 38.1874L6.64308 23.3999C6.37633 22.9371 6.20335 22.4263 6.13402 21.8966C6.06469 21.367 6.10035 20.8289 6.23899 20.313C6.51898 19.2711 7.20137 18.3832 8.13605 17.8445C9.07073 17.3057 10.1811 17.1604 11.223 17.4404C12.2648 17.7204 13.1528 18.4027 13.6915 19.3374L18.1603 27.0765"
              stroke="#FFFFFF"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M16.4734 48.75C13.7134 46.8463 11.4157 44.3474 9.75 41.4375"
              stroke="#FFFFFF"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M35.75 6.29691C37.6042 6.29189 39.4267 6.77789 41.0322 7.7055C42.6376 8.63312 43.9689 9.96928 44.8906 11.5782"
              stroke="#FFFFFF"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <div class="modal-header">
            <h3 name="header">
              {{ header }}
            </h3>
          </div>

          <div class="modal-body">
            <slot name="body">
              {{ body }}
            </slot>
          </div>

          <div v-if="step == 2">
            <button class="modalbutton btn btn-primary" @click="$emit('close')">
              Beenden
            </button>
          </div>

          <div v-else-if="step == 1">
            <button class="modalbutton btn btn-primary" @click="incrementStep">
              Weiter
            </button>
          </div>

          <div v-else-if="step == 0">
            <button class="modalbutton btn btn-primary" @click="incrementStep">
              starten
            </button>
            <button
              class="btn btn-secondary btn-sm float-end"
              @click="$emit('close')"
            >
              überspringen
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      header: " Einführung in den LoopInsight AID-Simulator",
      body: "In diesem Simulator können Sie in den verschiedenen Reitern, Szenarien, Patient:in, Mahlzeiten oder AID-System und Insulin, Paramter für die Simulation von z.B.verschiedenen Szenarien durch den Algorithmus berechnen und anzeigen lassen. Dabei können Sie in jedem Reitereinzeln die Paramter anpassen oder zusätzlich einSzenario, wie z.B. Über- oder Unterzuckerung, dazuauswählen.",
      step: 0,
    };
  },
  methods: {
    incrementStep() {
      this.step++;
      if (this.step == 1) {
        document.getElementById("modal-container").style.top = "5%";
        this.header = "Erklärung des Menüs";
        this.body =
          "In diesem Menü können Sie die verschiedenen Szenarien auswählen und durch andere Optionen, wie z.B. Patient:in entsprechende Parameter ändern, um diese auf Ihre:n Patient:in anzupassen.";
      } else if (this.step == 2) {
        document.getElementById("modal-container").style.top = "-35%";
        this.header = "Erklärung der Graphen";
        this.body =
          "In diesem Abschnitt werden die zuvor eingestellten Parameter visualisiert. Darüber hinaus haben Sie die Möglichkeit, die Icons per Drag und Drop mit dem Mauszeiger zu verschieben und so die Mahlzeiten und den  Bolus dynamisch anzupassen.";
      }
      this.$emit("step", this.step);
    },
  },
  mounted() {
    this.$emit("step", this.step);
  },
};
</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
.svg {
  margin-bottom: 10px;
}
#modal-container {
  width: 30%;
  position: relative;
  top: 0;
  left: 0;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: var(--blue-dark);
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.5s ease;
  font-family: ABeeZee, Candara, Helvetica, sans-serif;
  color: white;
}
.show-modal {
  padding-left: 2rem;
  padding-right: 2rem;
  margin: 1%;
  background-color: var(--blue-dark);
}

.modal-header h3 {
  color: white;
}

.modal-body {
  margin: 10px 0;
}
.modal-footer {
}

.modal-default-button {
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
.modalbutton {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  background: #57bcff;
  font-family: ABeeZee, Candara, Helvetica, sans-serif;
  color: white;
  outline: 0;
}
</style>
