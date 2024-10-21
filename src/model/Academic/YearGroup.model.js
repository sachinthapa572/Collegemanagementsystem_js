import { model, Schema } from "mongoose";


const yearGroupSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    academicYear: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AcademicYear",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

//model
const YearGroup = model("YearGroup", yearGroupSchema);

export default YearGroup;
