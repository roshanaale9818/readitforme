import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

interface OllamaApiResponse {
  response: string;
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly ollamaApiUrl: string;

  constructor(private configService: ConfigService) {
    this.ollamaApiUrl =
      this.configService.get<string>('OLLAMA_API_URL') ||
      'http://localhost:11434/api/generate';
    console.log('API URL CAME HERE0', this.ollamaApiUrl);
  }

  async summarizeDocument(content: string): Promise<string> {
    if (!content) {
      throw new Error('No content provided for summarization');
    }

    const prompt = `Summarize the following content accurately and concisely while preserving key details, main arguments, and important insights. Ensure clarity and coherence in the summary, avoiding unnecessary information or misinterpretation. Maintain a neutral and professional tone. If the content includes structured data (such as lists or bullet points), retain its logical flow. Here is the content to summarize:

${content}

Please structure the summary to be clear and concise while capturing the essential information.`;

    try {
      const { data } = await axios.post<OllamaApiResponse>(
        this.ollamaApiUrl,
        {
          model: 'mistral:latest',
          prompt: prompt,
          stream: false,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );

      if (!data || !data.response) {
        this.logger.error('Ollama response contained no summary');
        throw new Error(
          'Failed to generate summary: No content received from AI',
        );
      }

      return data.response;
    } catch (error) {
      this.logger.error('Error generating summary:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to generate summary: ${errorMessage}`);
    }
  }
}
