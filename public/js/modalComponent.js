const modalComponent = {
    data() {
        return {
            imageInfo: {},
        };
    },
    props: ["imageId"],
    mounted() {
        console.log("on COMPONENT mounted lifecyle!");
        fetch(`/single-image/${this.imageId}`)
            .then((resp) => {
                return resp.json();
            })
            .then((data) => {
                let wholeDate = new Date(data.created_at).toDateString();
                const date = `${wholeDate.split(" ").splice(1, 1).join("")} ${wholeDate.split(" ").splice(3, 1).join("")}`;

                data.created_at = date;
                this.imageInfo = data;
            })
            .catch((err) => {
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
    template: `
        <div @click="closeModal" class="modal-container">
            <div class="modal">
                <div @click="closeModal" class="close-icon">X</div>
                <div class="modal-img-text-container">
                    <img class="modal-img" :src=this.imageInfo.url>
                    <div class="modal-text-container">
                        <p class="modal-username">@{{this.imageInfo.username}}</p>
                        <p class="modal-title">{{this.imageInfo.title}}</p>
                        <p class="modal-desc">{{this.imageInfo.description}}</p>
                        <p class="modal-timestamp">Picture taken in {{this.imageInfo.created_at}}</p>
                    </div>  
                </div>      
            </div>
        </div>
        `,
};

export default modalComponent;