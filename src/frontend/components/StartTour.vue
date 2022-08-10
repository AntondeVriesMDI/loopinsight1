<template>
<div type="text/x-template" id="modal-template">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">

          <div class="modal-header">
            <div name="header">
              {{header}}
            </div>
          </div>  

          <div class="modal-body">
            <slot name="body">
              {{body}}
            </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              <button v-if = "step == 2" class="modalbutton btn btn-primary" @click="$emit('close')">
                Beenden
              </button>
                <button v-else class="modalbutton btn btn-primary" @click="incrementStep">
                Weiter
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
</div>
</template>

<script>
export default {
    data () {
        return {
            header: "Erklärung des Menüs",
            body: "In diesem Menü können Sie die verschiedenen Szenarien auswählen und durch andere Optionen, wie z.B. Patient:in entsprechende Parameter ändern, um diese auf Ihre:n Patient:in anzupassen.",
            step: 1,
        }
    },
    methods: {
        incrementStep() {
            this.step++;
            if(this.step == 2) {
                this.header = "Erklärung der Graphen"
                this.body = "In diesem Abschnitt werden die zuvor eingestellten Parameter visualisiert. Darüber hinaus haben Sie die Möglichkeit, die Icons per Drag und Drop mit dem Mauszeiger zu verschieben und so die Mahlzeiten und den  Bolus dynamisch anzupassen."
            }
        }
    }
}
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

.modal-container {
  width: 25%;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: var(--blue-dark);
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: ABeeZee, Candara, Helvetica, sans-serif;
  color: white;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter-from, .modal-leave-to {
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
  background: #57BCFF;
  font-family: ABeeZee, Candara, Helvetica, sans-serif;
  color: white;
  outline: 0;
}

</style>
