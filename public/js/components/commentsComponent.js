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
        this.fetchComments();
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
            }).then(resp => resp.json()).then(data => {
                if (data.hasError) {
                    this.hasError = true;
                } else {
                    dateHelper(data);
                    this.comments.unshift(data);
                    this.username = "";
                    this.comment = "";
                    this.hasError = false;
                }
            }).catch(err => console.log("error on submiting comment", err));
        },
        fetchComments: function() {
            this.comments = [];
            fetch(`/comments/${this.imageId}`).then(resp => resp.json()).then(data => {
                data.forEach(comment => {
                    dateHelper(comment);
                    this.comments.unshift(comment);
                });
                if (!this.comments.length) {
                    document.querySelector(".comments-section").style.padding = "0";
                } else {
                    document.querySelector(".comments-section").style.padding = "5px 10px";
                }
            }).catch(err => console.log("error getting comments:", err));
        },
        deleteImg: function() {
            // delete img from db
            // update state array deleting the img from there
            // delete all comments referring that img
            // delete img from aws s3
            fetch(`/deleteImg/${this.imageId}`).then(resp => {
                this.comments = [];
                this.$emit("delete");
            }).catch(err => console.log("error deleting on client", err))
        }
    },
    watch: {
        imageId: function () {
            this.fetchComments();
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
                <div class="buttons-container">
                    <button @click="clickHandler">SEND</button>
                    <button @click="deleteImg" class="delete-button">DELETE IMAGE</button>
                </div>
            </div>
        </div>
    `,
};

export default commentsComponent;