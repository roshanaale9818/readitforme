import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DocumentType = Document & DocumentEntity;

@Schema({ timestamps: true })
export class DocumentEntity {
  id: string; // Virtual field for the document ID

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  fileType: string;

  @Prop({ default: false })
  isProcessed: boolean;

  @Prop()
  summary?: string;

  @Prop()
  audioUrl?: string;

  @Prop({ default: false })
  isSummarizing: boolean;

  @Prop()
  summarizedAt?: Date;
}

export const DocumentSchema = SchemaFactory.createForClass(DocumentEntity);

// Add virtual id field that maps to _id
DocumentSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
