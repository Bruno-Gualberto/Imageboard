const modalComponent = {
    data() {
        return {
            imageInfo: {}
        }
    },
     props: [
        "imageId",
    ],
    mounted() {
        console.log("on COMPONENT mounted lifecyle!")
        fetch(`/single-image/${this.imageId}`).then(resp => {
            return resp.json()
        }).then(data => {
            this.imageInfo = data;
        }).catch(err => {
            console.log("error getting data form server: ", err)
        })
    },
    methods: {
        closeModal: function() {
            this.$emit("close")
        }
    },
    template: `
        <div class="modal-container">
            <div @click="closeModal" class="close-icon">X</div>
            <img class="modal-img" :src=this.imageInfo.url>
            <p class="modal-title">{{this.imageInfo.title}}</p>
            <p class="modal-desc">{{this.imageInfo.description}}</p>
            <p class="modal-username">{{this.imageInfo.username}}</p>
            <p class="modal-timestamp">{{this.imageInfo.created_at}}</p>
        </div>
        `,
    };

export default modalComponent;