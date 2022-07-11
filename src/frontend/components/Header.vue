<template>
<nav class="navbar navbar-expand-md flex">
    <div id="generaloptions" class="container-fluid parameterlist">
					<ul class="navbar-nav">
						<li class="item">
							<label for="t0">
								<div class="item-description">{{$t("t0")}}</div>
								<div >
									<input v-model="t0String" type="datetime-local">
								</div>
								<div class="item-unit"></div>
							</label>
						</li>
						<li class="item">
							<label for="t0">
								<div class="item-description">{{$t("tspan")}}</div>
								<div class="item-input">
									<input v-model.number="tspan"
										type="number" min="0" step="1">
								</div>
								<div class="item-unit">h</div>
							</label>
						</li>
					</ul>
				</div>
    <button type="button" class="btn btn-primary" id="startbutton" @click="getOptions">Simulation starten</button>
</nav>
<div id="header" class="container-full ">
</div>
</template>
<script>
    export default {
        props: {
        },
        computed: {
		t0() {
			return new Date(this.t0String.valueOf())
		},
	},
        data() {
            return {
                t0String: new Date(Date.now()).toISOString().substr(0,11)+"06:00:00",
                tspan: 8, 
                object : String,
                opt : []
            }
        },
        methods: {
            getOptions() {
	    		//const t0 = new Date((new Date(Date.now())).toDateString() + 
		    	//	" " + JSON.parse(JSON.stringify(this.t0)) + ":00")
			    const t0 = new Date(this.t0.valueOf());
			    const tmax = new Date(t0.valueOf() + this.tspan * 3600000)
			    this.$emit("generalOpt", {tFix:t0, tLength:tmax})
		    },
        }
    }
</script>
<style>
.navbar{
    background: #57BCFF;
    border-top: 2px solid #186EA8;
}
#startbutton {
   background-color: #186EA8;
}
</style>
