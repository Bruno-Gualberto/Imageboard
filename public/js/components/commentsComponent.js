import dateHelper from "../dateHelper.js";
import errorMessage from "./errorMessage.js";

const commentsComponent = {
    data() {
        return {
            comments: [],
            username: "",
            comment: "",
            hasError: false,
        };
    },
    props: ["imageId"],
    mounted() {
        fetch(`/comments/${this.imageId}`)
            .then((resp) => resp.json())
            .then((data) => {
                data.forEach((comment) => {
                    dateHelper(comment);
                    this.comments.unshift(comment);
                });
                if (!this.comments.length) {
                    document.querySelector(".comments-section").style.padding = "0";
                }
            })
            .catch((err) => console.log("error getting comments:", err));
    },
    methods: {
        clickHandler: function () {
            fetch("/submit-comments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    imageId: this.imageId,
                    username: this.username,
                    comment: this.comment,
                }),
            })
                .then((resp) => resp.json())
                .then((data) => {
                    if (data.hasError) {
                        this.hasError = true;
                    } else {
                        dateHelper(data);
                        this.comments.unshift(data);
                        this.username = "";
                        this.comment = "";
                        this.hasError = false
                    }
                })
                .catch((err) => console.log("error on submiting comment", err));
        },
    },
    components: {
        "error-message": errorMessage,
    },
    template: `
        <div class="comments-container">
            <div class="comments-section">
                <div  class="each-comment" v-for="comment in comments">
                    <p><strong>{{comment.username}}:</strong> {{comment.comment}} - <small>{{comment.created_at}}</small></p>
                </div>
            </div>
            <div class="inputs">
                <error-message v-if="hasError"></error-message>
                <input v-model="comment" type="text" name="comment" placeholder="Comment">
                <input v-model="username" type="text" name="username" placeholder="Username">
                <button @click="clickHandler">SEND</button>
            </div>
        </div>
    `,
};

export default commentsComponent;