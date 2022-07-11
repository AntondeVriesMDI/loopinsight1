<template>

<p :class="object"> {{title}}</p>

</template>


<script>
export default {
    props: {
        title: String
    },

    data(){
        return {
            object: String
        }
    },

    methods:{
        changeColour() {
            switch (this.title) {
            case "M":
                this.object = 'meal'
                break;
            
            case "B":
                this.object = 'bolus'
                break;
            
            case "A":
                this.object = 'action'
                break;
        }
    }
    },

    mounted() {
        this.changeColour()
    } 
}
</script>

<style scoped>

.meal {
    width: 50px;
    height: 50px;
    -webkit-border-radius: 25px;
    -moz-border-radius: 25px;
    border-radius: 25px;
    background: blue;
    display: flex;
    justify-content: center;
}

.bolus {
    width: 50px;
    height: 50px;
    -webkit-border-radius: 25px;
    -moz-border-radius: 25px;
    border-radius: 25px;
    background: green;
    display: flex;
    justify-content: center;
}
    

 .action {
      width: 50px;
      height: 50px;
      -webkit-border-radius: 25px;
      -moz-border-radius: 25px;
      border-radius: 25px;
      background: red;
      display: flex;
      justify-content: center;
     
    }

</style>
