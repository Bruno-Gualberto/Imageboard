import commentsComponent from "./commentsComponent.js";
import dateHelper from "./dateHelper.js";

const modalComponent = {
    data() {
        return {
            imageInfo: {},
        };
    },
    props: ["imageId"],
    mounted() {
        fetch(`/single-image/${this.imageId}`).then(resp => {
            return resp.json();
        }).then(data => {
            dateHelper(data);
            this.imageInfo = data;
        })
        .catch(err => {
            console.log("error getting data form server: ", err);
        });
    },
    methods: {
        closeModal: function (e) {
            e.stopPropagation();
            if (e.target.className === "modal-container" || e.target.className === "close-icon") {
                document.body.style.overflow = "auto";
                this.$emit("close");
            }
        },
    },
    components: {
        "comments-component": commentsComponent
    },
    template: `
        <div @click="closeModal" class="modal-container">
            <div class="modal">
                <div class="modal-img-text-container">
                    <img class="modal-img" :src=this.imageInfo.url>
                    <div class="modal-text-container">
                        <p class="modal-username">@{{this.imageInfo.username}}</p>
                        <p class="modal-title">{{this.imageInfo.title}}</p>
                        <p class="modal-desc">{{this.imageInfo.description}}</p>
                        <p class="modal-timestamp">From {{this.imageInfo.created_at}}</p>
                        
                        <comments-component :image-id="this.imageId"></comments-component>
                    </div>  

                    <div @click="closeModal" class="close-icon">X</div>
                    
                </div>      
            </div>
        </div>
    `,
};

export default modalComponent;