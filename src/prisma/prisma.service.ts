import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {

  constructor(readonly configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get('DATABASE_URL')
        }
      }
    });
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') {
      return;
    }

    /** Cleaning Database for integration testing (prevent double uniqueIds) */
    const models = Reflect.ownKeys(this).filter((key) => key[0] !== '_');
    const modelNames = models.filter(model => model.toString() !== '$extends' && model.toString() !== 'Symbol()');

    return Promise.all(
      modelNames.map((modelKey: string) => this[modelKey].deleteMany()),
    );
  }
}
