<template>

<div class="container-fluid">
<p>{{scenario}}</p>
</div>

    
</template>


<script>
export default {

    props: {
    scenario: String,
    },

    data() {
        return {};
},
methods:
{
    changeText() {
        switch(this.scenario) {
            case keins:
                this.scenario = "Keins";
                break;
            case überzuckerung:
                this.scenario = "Überzuckerung";
                break;
            case unterzuckerung:
                this.scenario = "Unterzuckerung";
                break;
            case aufstehen:
                this.scenario = "Aufstehen";
                break;
            case alkohol:
                this.scenario = "Alkoholkonsum";
                break;
            case überschätzung:
                this.scenario = "Überschätzung";
                break;
            case unterschätzung:
                this.scenario = "Unterschätzumg";
                break;
            case unangekündigt:
                this.scenario = "Unangekündigte Mahlzeit";
                break;
            }
        }
    },

mounted() {
    this.changeText;
    }
}
</script>


<style scoped>
.container-fluid {
  width: 40%;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}
</style>
