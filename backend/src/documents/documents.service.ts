import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DocumentType, DocumentEntity } from './document.schema';
import * as pdf from 'pdf-parse';
import * as mammoth from 'mammoth';

type ValidatedFile = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
};

interface PDFData {
  text: string;
  numpages: number;
  info: any;
  metadata: any;
  version: string;
}

const parsePDF = pdf as (buffer: Buffer) => Promise<PDFData>;

@Injectable()
export class DocumentsService {
  private readonly logger = new Logger(DocumentsService.name);

  constructor(
    @InjectModel(DocumentEntity.name)
    private documentModel: Model<DocumentType>,
  ) {}

  async processAndSaveDocument(
    file: ValidatedFile,
    title: string,
  ): Promise<DocumentEntity> {
    try {
      const content = await this.extractContent(file);

      const document = await this.documentModel.create({
        title,
        content,
        fileType: file.mimetype,
        isProcessed: false,
      });

      return document;
    } catch (error) {
      this.logger.error(
        `Error processing document: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw error;
    }
  }

  private async extractContent(file: ValidatedFile): Promise<string> {
    const fileBuffer = file.buffer;
    const mimeType = file.mimetype;

    try {
      switch (mimeType) {
        case 'application/pdf': {
          const pdfData = await parsePDF(fileBuffer);
          return pdfData.text;
        }
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
          const result = await mammoth.extractRawText({ buffer: fileBuffer });
          return result.value;
        }
        case 'text/plain': {
          return fileBuffer.toString('utf-8');
        }
        default:
          throw new Error(`Unsupported file type: ${mimeType}`);
      }
    } catch (error) {
      this.logger.error(
        `Error extracting content: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw error;
    }
  }

  async findAll(): Promise<DocumentEntity[]> {
    return this.documentModel.find().sort({ createdAt: -1 }).exec();
  }

  async findById(_id: string): Promise<DocumentEntity | null> {
    return this.documentModel.findById(_id).exec();
  }

  async updateSummary(
    _id: string,
    summary: string,
  ): Promise<DocumentEntity | null> {
    return this.documentModel
      .findByIdAndUpdate(_id, { summary, isProcessed: true }, { new: true })
      .exec();
  }

  async updateAudioUrl(
    _id: string,
    audioUrl: string,
  ): Promise<DocumentEntity | null> {
    return this.documentModel
      .findByIdAndUpdate(_id, { audioUrl }, { new: true })
      .exec();
  }
}
