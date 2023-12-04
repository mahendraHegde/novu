import { Injectable, Logger } from '@nestjs/common';
import { ExecutionDetailsRepository, DalException } from '@novu/dal';

import { ExecutionDetailsEntity } from '@novu/aal';

import { BulkCreateExecutionDetailsCommand } from './bulk-create-execution-details.command';

import { mapExecutionDetailsCommandToEntity } from '../create-execution-details';
import { InstrumentUsecase } from '../../instrumentation';
import { PlatformException } from '../../utils/exceptions';

const LOG_CONTEXT = 'BulkCreateExecutionDetails';

@Injectable()
export class BulkCreateExecutionDetails {
  constructor(private executionDetailsRepository: ExecutionDetailsRepository) {}

  @InstrumentUsecase()
  async execute(command: BulkCreateExecutionDetailsCommand) {
    const entities = [];
    command.details.forEach((detail) => {
      let entity = mapExecutionDetailsCommandToEntity(detail);

      entity = this.cleanFromNulls(entity);

      entities.push(entity);
    });

    try {
      await this.executionDetailsRepository.insertMany(entities);
      Logger.verbose(
        { entities },
        'Bulk execution details created',
        LOG_CONTEXT
      );
    } catch (error) {
      Logger.error(
        { entities, error },
        'Bulk execution details creation failed',
        LOG_CONTEXT
      );

      if (error instanceof DalException) {
        throw new PlatformException(error.message);
      }
      throw error;
    }
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
