import { Schema, model, models } from "mongoose";

const HospitalSchema = new Schema({
  hospitalName: { type: String },
  imgSrc: { type: String },
  pageUrl: { type: String },
  hospitalInfo: {
    address: { type: String },
    website: { type: String },
    phoneNumber: { type: String },
    postalCode: { type: String },
  },
});

const Hospital = models.Hospital || model("Hospital", HospitalSchema);

export default Hospital;
