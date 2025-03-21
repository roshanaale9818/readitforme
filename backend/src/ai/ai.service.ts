import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAI as OpenAIApi } from 'openai';
import { APIError } from 'openai';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private openai!: OpenAIApi;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      this.logger.error('OPENAI_API_KEY is not set in environment variables');
      throw new Error('OpenAI API key is not configured');
    }

    this.openai = new OpenAIApi({ apiKey });
  }

  async summarizeDocument(content: string): Promise<string> {
    if (!content) {
      throw new Error('No content provided for summarization');
    }

    try {
      const prompt = `Please provide a comprehensive summary of the following document, focusing on the main points and key takeaways:

${content}

Please structure the summary to be clear and concise while capturing the essential information.`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content:
              'You are a professional document summarizer. Create clear, concise, and accurate summaries that capture the main points and key information from documents.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      const summary = completion?.choices?.[0]?.message?.content;
      if (!summary) {
        this.logger.error('OpenAI response contained no summary');
        throw new Error(
          'Failed to generate summary: No content received from AI',
        );
      }

      return summary;
    } catch (error) {
      this.logger.error('Error generating summary:', error);
      const err = error as APIError;

      if (err.status === 401) {
        throw new Error('Invalid OpenAI API key');
      }

      throw new Error(
        `Failed to generate summary: ${err.message || 'Unknown error occurred'}`,
      );
    }
  }
}
