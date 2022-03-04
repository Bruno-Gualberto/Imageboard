import * as Vue from './vue.js';
import modalComponent from "./components/modalComponent.js";
import errorMessage from "./components/errorMessage.js";

const app = Vue.createApp({
    data () {
        return {
            title: "",
            description: "",
            username: "",
            file: "",
            images: [],
            imageId: location.pathname.slice(1),
            hasError: false,
            moreButton: true,
        }
    },
    mounted() {
        fetch("/images.json").then(result => {
            return result.json();
        }).then(data => {
                this.images = data;
                this.images.filter(item => item.id === item.lowestId).length ? this.moreButton = false : this.moreButton = true;
        }).catch(err => console.log("error on getting data", err))

        addEventListener("popstate", () => {
            this.imageId = location.pathname.slice(1);
        });
    },
    methods: {
        selectFile: function(e) {
            this.file = e.target.files[0];
        },
        upload: function() {
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
                if (data.hasError) {
                    this.hasError = true;
                } else {
                    this.images.unshift(data);
                    this.title = "";
                    this.description = "";
                    this.username = "";
                    this.file = "";
                }
            }).catch(err => console.log("err in /upload", err));
        },
        showModal: function(e) {
            document.body.style.overflow = "hidden";
            this.imageId = e.target.__vnode.key;
            history.pushState({}, "", `/${this.imageId}`);
        },
        closeHandler: function() {
            history.pushState({}, "", "/");
            this.imageId = location.pathname.slice(1);
        },
        moreHandler: function() {
            const smallestId = this.images[this.images.length - 1].id;
            fetch(`/more-images/${smallestId}`).then(resp => resp.json()).then(data => {
                this.images = [...this.images, ...data];
                this.images.filter(item => item.id === item.lowestId).length ? (this.moreButton = false) : (this.moreButton = true);
            }).catch(err => console.log("error on fetch on more button", err))
        }
    },
    components: {
        "modal-component": modalComponent,
        "error-message": errorMessage
    }
});

app.mount("#main");