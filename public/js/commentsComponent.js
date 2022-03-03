import dateHelper from "./dateHelper.js";

const commentsComponent = {
    data() {
        return {
            comments: [],
            username: "",
            comment: "",
        };
    },
    props: ["imageId"],
    mounted() {
        fetch(`/comments/${this.imageId}`).then(resp => resp.json()).then(data => {
            data.forEach(comment => {
                dateHelper(comment);
                this.comments.unshift(comment);
            })
        }).catch(err => console.log("error getting comments:", err)); 
    },
    methods: {
        clickHandler: function() {
            fetch("/submit-comments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    imageId: this.imageId,
                    username: this.username,
                    comment: this.comment
                })
            }).then(resp => resp.json()).then(data => {
                dateHelper(data)
                this.comments.unshift(data)
                this.username = "";
                this.comment = "";
            })
            .catch(err => console.log("error on submiting comment", err))
        }
    },
    template: `
        <div class="comments-container">
            <div class="comments-section">
                <div class="each-comment" v-for="comment in comments">
                    <p><u><strong>{{comment.username}}:</strong></u> {{comment.comment}} - <small>{{comment.created_at}}</small></p>
                </div>
            </div>
            <div class="inputs">
                <input v-model="comment" type="text" name="comment" placeholder="Comment">
                <input v-model="username" type="text" name="username" placeholder="Username">
                <button @click="clickHandler">SUBMIT</button>
            </div>
        </div>
    `,
};

export default commentsComponent;