import * as Vue from './vue.js';

const app = Vue.createApp({
    data () {
        return {
            images: []
        }
    },
    mounted: function () {
        console.log("on mounted lifecyle!");
        fetch("/images.json").then(result => {
            return result.json();
        }).then(data => {
            this.images = data;
            console.log("loggin images inside data(): ", this.images)
        }).catch(err => console.log("error on getting data", err))
    }
});

app.mount("#main");