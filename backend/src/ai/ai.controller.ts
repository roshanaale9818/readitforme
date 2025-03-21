import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('summarize')
  async summarize(
    @Body('content') content: string,
  ): Promise<{ summary: string }> {
    const summary = await this.aiService.summarizeDocument(content);
    return { summary };
  }
}
