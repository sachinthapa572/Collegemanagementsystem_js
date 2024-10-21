import { model, Schema } from "mongoose";


//exam result schema
const examResultSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    exam: {
      type: Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    grade: {
      type: Number,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    passMark: {
      type: Number,
      required: true,
      default: 32,
    },
    //failed/Passed
    status: {
      type: String,
      required: true,
      enum: ["failed", "passed"],
      default: "failed",
    },
    //Excellent/Good/Poor
    remarks: {
      type: String,
      required: true,
      enum: ["Excellent", "Good", "Poor"],
      default: "Poor",
    },
    position: {
      type: Number,
      required: true,
    },

    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
    classLevel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClassLevel",
    },
    academicTerm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AcademicTerm",
      required: true,
    },
    academicYear: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AcademicYear",
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const ExamResult = model("ExamResult", examResultSchema);

export default ExamResult;
