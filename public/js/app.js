import * as Vue from './vue.js';

const app = Vue.createApp({
    data () {
        return {
            title: "",
            description: "",
            username: "",
            file: "",
            images: []
        }
    },
    updated() {
        console.log("this.file on update", this.file)
    },
    mounted() {
        console.log("on mounted lifecyle!");
        fetch("/images.json").then(result => {
            return result.json();
        }).then(data => {
            this.images = data;
        }).catch(err => console.log("error on getting data", err))
    },
    methods: {
        selectFile: function(e) {
            this.file = e.target.files[0];
        },
        upload: function(e) {
            // I'm already preventing default behavior on html with vue syntax

            // The FormData é um metodo JS que me permite mandar um arquivo por um POST request em formato JSON
            // E preciso usar isso pra mandar pelo POST porque estou querendo mandar um arquivo tambem
            const fd = new FormData();
            fd.append("file", this.file);
            fd.append("title", this.title);
            fd.append("username", this.username);
            fd.append("description", this.description);
            // o fd vai loggar um empty object mesmo eu tendo adicionado os dados corretamente
            // pra eu ver os dados la, preciso fazer um loop nele usando o metodo values() 
            fetch("/upload", {
                method: "POST",
                body: fd
                // depois devo unshift a imagem no array do state com a resposta do server:
            }).then(resp => resp.json()).then(data => {
                console.log("response in fetch /upload: ", data);
                this.images.unshift(data);
            }).catch(err => console.log("err in /upload", err));
        }
    },
});

app.mount("#main");