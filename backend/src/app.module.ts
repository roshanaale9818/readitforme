import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AiModule } from './ai/ai.module';
import { DocumentsModule } from './documents/documents.module';

const envFilePath = '.env';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath,
      isGlobal: true,
      cache: true,
      validate: (config: Record<string, any>) => {
        const requiredEnvVars = ['MONGO_URI', 'OPENAI_API_KEY'];
        const missingVars = requiredEnvVars.filter((key) => !config[key]);

        if (missingVars.length > 0) {
          throw new Error(
            `Missing required environment variables: ${missingVars.join(', ')}`,
          );
        }
        return config;
      },
    }),
    MongooseModule.forRoot(process.env.MONGO_URI as string),
    AiModule,
    DocumentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
