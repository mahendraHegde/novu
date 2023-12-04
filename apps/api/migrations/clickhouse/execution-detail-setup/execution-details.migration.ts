import { AALService } from '@novu/aal';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../../src/app.module';

export async function executionDetailsSetup() {
  // Init the mongodb connection
  const app = await NestFactory.create(AppModule, {
    logger: false,
  });

  const aalService = app.get(AALService);

  // eslint-disable-next-line no-console
  console.log('start migration - create execution detail table');
  const query = `
  CREATE TABLE executiondetails (
    _id UUID DEFAULT generateUUIDv4(),
    _jobId String,
    providerId String,
    _environmentId String,
    _organizationId String,
    _notificationId String,
    webhookStatus String,
    _notificationTemplateId String,
    _subscriberId String,
    transactionId String,
    channel String,
    detail String,
    source String,
    status String,
    raw String,
    isTest Boolean,
    isRetry Boolean,
    expireAt DateTime,
    createdAt DateTime DEFAULT now(),
    updatedAt DateTime DEFAULT now()
) ENGINE = MergeTree
ORDER BY (_jobId);`;

  await aalService.client.command({ query });

  // eslint-disable-next-line no-console
  console.log('end migration');
}

executionDetailsSetup();
