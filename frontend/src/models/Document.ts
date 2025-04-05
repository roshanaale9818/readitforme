import mongoose, { HydratedDocument, Schema, Model } from "mongoose";

interface DocumentEntity {
  title: string;
  content: string;
  fileType: string;
  isProcessed: boolean;
  summary?: string;
  audioUrl?: string;
  isSummarizing: boolean;
  summarizedAt?: Date;
}

// Create the Mongoose schema
const documentSchema = new Schema<DocumentEntity>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    fileType: { type: String, required: true },
    isProcessed: { type: Boolean, default: false },
    summary: { type: String, default: "" },
    audioUrl: { type: String, default: "" },
    isSummarizing: { type: Boolean, default: false },
    summarizedAt: { type: Date },
  },
  { timestamps: true }
);

// Add a virtual `id` field to avoid _id being used directly
documentSchema
  .virtual("id")
  .get(function (this: HydratedDocument<DocumentEntity>) {
    return this._id.toHexString();
  });

// Create the Mongoose model
const Document: Model<DocumentEntity> =
  mongoose.models.Document ||
  mongoose.model<DocumentEntity>("Document", documentSchema);

export default Document;
