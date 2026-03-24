import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
{
    name:
    {
        type: String,
        required: true,
        trim: true
    },

    email:
    {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },

    photo:
    {
        type: String,
        required: true
        // stored as: /uploads/comments/filename.jpg
    },

    rating:
    {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },

    comment:
    {
        type: String,
        required: true,
        trim: true
    },

    userType:
    {
        type: String,
        required: true,
        enum: ["volunteer", "donor"]
    },
    public_id: {
  type: String
},

    isVerified:
    {
        type: Boolean,
        default: true
    }

},
{
    timestamps: true
}
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;