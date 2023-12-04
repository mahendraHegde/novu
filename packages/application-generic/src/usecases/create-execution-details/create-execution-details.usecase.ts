import { Injectable } from '@nestjs/common';
import { ExecutionDetailsRepository } from '@novu/dal';
import {
  ExecutionDetailsRepository as ExRepo,
  ExecutionDetailsEntity,
} from '@novu/aal';
import { ExecutionDetailsStatusEnum } from '@novu/shared';

import {
  CreateExecutionDetailsResponseDto,
  mapExecutionDetailsCommandToEntity,
} from './dtos/execution-details.dto';
import { CreateExecutionDetailsCommand } from './create-execution-details.command';

@Injectable()
export class CreateExecutionDetails {
  constructor(
    private executionDetailsRepository: ExecutionDetailsRepository,
    private exRepo: ExRepo
  ) {}

  async execute(
    command: CreateExecutionDetailsCommand
  ): Promise<CreateExecutionDetailsResponseDto> {
    // TODO: Which checks to do? If the notification and job belong to the environment and organization provided?
    let entity = mapExecutionDetailsCommandToEntity(command);

    entity = this.cleanFromNulls(entity);

    await this.executionDetailsRepository.create(
      { ...entity, _id: ExecutionDetailsRepository.createObjectId() },
      { writeConcern: 1 }
    );
    await this.exRepo.create([entity]);

    if (command.status === ExecutionDetailsStatusEnum.FAILED) {
      throw new Error(command.detail);
    }

    /**
     * Response for a HTTP 201
     * TODO: Provide more data for a HTTP 200. Discuss which one choose.
     */
    return {
      id: entity._id,
      createdAt: new Date(entity.createdAt).toISOString(),
    };
  }

  private cleanFromNulls(
    entity: ExecutionDetailsEntity
  ): ExecutionDetailsEntity {
    const cleanEntity = Object.assign({}, entity);

    if (cleanEntity.raw === null) {
      delete cleanEntity.raw;
    }

    return cleanEntity;
  }
}
