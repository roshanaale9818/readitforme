import {
  Controller,
  Post,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  NotFoundException,
  Body,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { DocumentEntity } from './document.schema';
import { AiService } from '../ai/ai.service';

type ValidatedFile = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
};

@Controller('documents')
export class DocumentsController {
  private readonly logger = new Logger(DocumentsController.name);

  constructor(
    private readonly documentsService: DocumentsService,
    private readonly aiService: AiService,
  ) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
      fileFilter: (req, file, cb) => {
        if (
          file.mimetype === 'application/pdf' ||
          file.mimetype ===
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
          file.mimetype === 'text/plain'
        ) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              'Only PDF, DOCX, and TXT files are allowed!',
            ),
            false,
          );
        }
      },
    }),
  )
  async uploadDocument(
    @UploadedFile() file: ValidatedFile,
    @Body('title') title?: string,
  ): Promise<DocumentEntity> {
    if (!file || !file.originalname) {
      throw new BadRequestException('No valid file uploaded');
    }

    const documentTitle = title || file.originalname;
    const document = await this.documentsService.processAndSaveDocument(
      file as Express.Multer.File,
      documentTitle,
    );

    // Generate summary after upload
    try {
      const summary = await this.aiService.summarizeDocument(document.content);
      const updatedDocument = await this.documentsService.updateSummary(
        document.id,
        summary,
      );
      if (!updatedDocument) {
        throw new Error('Failed to update document with summary');
      }
      return updatedDocument;
    } catch (err) {
      this.logger.error(
        `Failed to generate summary: ${err instanceof Error ? err.message : 'Unknown error'}`,
      );
      // Return the document even if summarization fails
      // The summary can be generated later
      return document;
    }
  }

  @Post(':id/summarize')
  async generateSummary(@Param('id') id: string): Promise<DocumentEntity> {
    const document = await this.documentsService.findById(id);
    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    console.log('document', document);
    console.log('process.env.OPENAI_API_KEY fss', process.env.OPENAI_API_KEY);
    const summary = await this.aiService.summarizeDocument(document.content);
    const updatedDocument = await this.documentsService.updateSummary(
      id,
      summary,
    );
    if (!updatedDocument) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    return updatedDocument;
  }

  @Get()
  async getAllDocuments(): Promise<DocumentEntity[]> {
    return this.documentsService.findAll();
  }

  @Get(':id')
  async getDocument(@Param('id') _id: string): Promise<DocumentEntity> {
    const document = await this.documentsService.findById(_id);
    if (!document) {
      throw new NotFoundException(`Document with ID ${_id} not found`);
    }
    return document;
  }
}
