import commentsComponent from "./commentsComponent.js";
import dateHelper from "../dateHelper.js";

const modalComponent = {
    data() {
        return {
            imageInfo: {},
            hasImage: true,
            hasPrev: true,
            hasNext: true,
        };
    },
    props: ["imageId"],
    mounted() {
        this.fetchImg();
    },
    methods: {
        closeModal: function (e) {
            e.stopPropagation();
            if (
                e.target.className === "modal-container" ||
                e.target.className === "close-icon"
            ) {
                document.body.style.overflow = "auto";
                this.$emit("close");
            }
        },
        prevClick: function () {
            this.$emit("prevNext", this.imageInfo.prevId);
        },
        nextClick: function () {
            this.$emit("prevNext", this.imageInfo.nextId);
        },
        fetchImg: function () {
            fetch(`/single-image/${this.imageId}`)
                .then((resp) => {
                    return resp.json();
                })
                .then((data) => {
                    dateHelper(data);
                    this.imageInfo = data;
                    this.hasImage = true;

                    !this.imageInfo.nextId
                        ? (this.hasNext = false)
                        : (this.hasNext = true);
                    !this.imageInfo.prevId
                        ? (this.hasPrev = false)
                        : (this.hasPrev = true);
                })
                .catch((err) => {
                    !this.imageInfo.id
                        ? (this.hasImage = false)
                        : (this.hasImage = true);
                    this.hasPrev = false;
                    this.hasNext = false;
                    document.querySelector(".modal").style.height = "auto";
                    console.log("error getting data form server: ", err);
                });
        },
        deleteImg: function() {
            this.imageInfo = {};
            this.$emit("deleteImage")
        },
    },
    watch: {
        imageId: function () {
            this.fetchImg();
        },
    },
    components: {
        "comments-component": commentsComponent,
    },
    template: `
        <div @click="closeModal" class="modal-container">
        <div v-if="hasPrev" class="prev-next-buttons" @click="prevClick"><p><</p></div>
            <div class="modal">

                <p class="not-found" v-if="!this.hasImage">👮‍♀️ 🕵️‍♀️ Sorry! Image not found! 🕵️ 👮‍♀️</p>
                
                <div v-if="this.hasImage" class="modal-img-text-container">
                    <img class="modal-img" :src=this.imageInfo.url>
                    <div class="modal-text-container">
                        <div class="modal-p-container">
                            <p class="modal-username">@{{this.imageInfo.username}}</p>
                            <p class="modal-title">{{this.imageInfo.title}}</p>
                            <p class="modal-desc">{{this.imageInfo.description}}</p>
                            <p class="modal-timestamp">From {{this.imageInfo.created_at}}</p>
                        </div>
                        
                        <comments-component @delete="deleteImg" :image-id="this.imageId"></comments-component>
                    </div>  

                    <div @click="closeModal" class="close-icon">X</div>
                </div> 
            </div>

            <div v-if="hasNext" class="prev-next-buttons" @click="nextClick"><p>></p></div>
        </div>
    `,
};

export default modalComponent;