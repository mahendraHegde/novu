import { ExecutionDetailsSourceEnum, ExecutionDetailsStatusEnum, StepTypeEnum } from '@novu/shared';

import type { EnvironmentId } from '@novu/dal';
import type { OrganizationId } from '@novu/dal';

export class ExecutionDetailsEntity {
  _id: string;
  _jobId: string;
  _environmentId: EnvironmentId;
  _organizationId: OrganizationId;
  _notificationId: string;
  _notificationTemplateId: string;
  _subscriberId: string;
  _messageId?: string;
  providerId?: string;
  transactionId: string;
  channel?: StepTypeEnum;
  detail: string;
  source: ExecutionDetailsSourceEnum;
  status: ExecutionDetailsStatusEnum;
  isTest: boolean;
  isRetry: boolean;
  createdAt: string;
  expireAt?: string;
  updatedAt?: string;
  raw?: string | null;
  webhookStatus?: string;
}

export type ExecutionDetailsDBModel = ExecutionDetailsEntity;
