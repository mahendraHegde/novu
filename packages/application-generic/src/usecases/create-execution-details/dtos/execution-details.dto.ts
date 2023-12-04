import { ApiProperty } from '@nestjs/swagger';
import { ExecutionDetailsEntity } from '@novu/aal';

import { CreateExecutionDetailsCommand } from '../create-execution-details.command';

export class CreateExecutionDetailsResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: string;
}

export const mapExecutionDetailsCommandToEntity = (
  command: CreateExecutionDetailsCommand
): ExecutionDetailsEntity => {
  const {
    jobId: _jobId,
    environmentId: _environmentId,
    organizationId: _organizationId,
    subscriberId: _subscriberId,
    notificationId: _notificationId,
    notificationTemplateId: _notificationTemplateId,
    messageId: _messageId,
    _id: _id,
    createdAt,
    ...nonUnderscoredFields
  } = command;
  const created = createdAt ? new Date(createdAt) : new Date();

  return {
    _jobId: _jobId as string,
    _environmentId,
    _organizationId,
    _subscriberId,
    _notificationId,
    _notificationTemplateId: _notificationTemplateId as string,
    _messageId,
    _id: _id,
    createdAt: created.toISOString(),
    ...nonUnderscoredFields,
  } as ExecutionDetailsEntity;
};
