import { model, Schema, SchemaType } from "mongoose";

const programSchema = new Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    }, duration: {
        type: String,
        required: true,
        default: "4 years"
    },

    // The first two name of the Course and the random id like Computer Science (CS 35)
    code: {
        type: String,
        default: function () {
            return (
                this.name
                    .split("")
                    .map(name => name[0])
                    .join("")
                    .toUppercase() +
                Math.floor(10 + Math.random() * 90) +
                Math.floor(10 + Math.random() * 90)
            )
        }
    },
    // realtion foregin key 
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "Admin",
        required: true
    },
    // teachers that are the incharge of the program 
    teacher: [
        {
            type: Schema.Types.ObjectId,
            ref: "Teacher",
            default: []
        }
    ],
    // involve student in the course 
    students: [
        {
            type: Schema.Types.ObjectId,
            ref: "Student",
            default: []
        }
    ],
    // subject in the course
    courses: [
        {
            type: Schema.Types.ObjectId,
            ref: "Course",
            default: []
        }
    ]
}, {
    timestamps: true
})


const Program = model("Program", programSchema)

export default Program;