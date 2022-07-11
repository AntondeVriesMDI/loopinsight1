<template>

<div class="container-fluid">
<p>{{ senText }}</p>
</div>

    
</template>


<script>
export default {

    props: {
    senText: String,
    },

    data() {
        return {
            scenario: String
        };
},
methods:
{
    changeText() {
        switch(this.senText) {
            case "keins":
                this.scenario = "Keins <p></p> Diese Funktion unterstützt kein Szenario, damit ebenfalls individuelle Werte über Patient*in, Mahlzeiten und AID-System und Insulin eingestellt werden können.";
                break;
            case "überzuckerung":
                this.scenario = "Überzuckerung <p></p> Die Überzuckerung, med. Hyperglykämie, stellt einen zu hohen Glukosewert im Blut dar. <p></p> Hoher Bereich: 181-250 mg/dL <p></p> Sehr hoher Bereich: >250 mg/dL";
                break;
            case "unterzuckerung":
                this.scenario = "Unterzuckerung <p></p> Die Unterzuckerung, med. Hypoglykämie, stellt einen zu niedrigen Glukosewert im Blut dar. <p></p> Niedriger Bereich: 54-69 mg/dL <p></p> Sehr niedriger Bereich: <54 mg/dL";
                break;
            case "aufstehen":
                this.scenario = "Überzuckerung <p></p> Die Überzuckerung, med. Hyperglykämie, am Morgen stellt einen zu hohen Glukosewert im Blut dar. <p></p> Hoher Bereich: 181-250 mg/dL <p></p> Sehr hoher Bereich: >250 mg/dL";
                break;
            case "alkohol":
                this.scenario = "Alkoholkonsum";
                break;
            case "überschätzung":
                this.scenario = "Überschätzung <p></p> Zu große Mahlzeit für Menge an Insulin.";
                break;
            case "unterschätzung":
                this.scenario = "Unterschätzung <p></p> Zu kleine Mahlzeit für Menge an Insulin.";
                break;
            case "unangekündigt":
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

</style>
