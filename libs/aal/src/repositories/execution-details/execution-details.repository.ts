import { ExecutionDetailsEntity, ExecutionDetailsDBModel } from './execution-details.entity';
import { BaseRepository } from '../base-repository';
import { EnforceEnvId } from '@novu/dal';
import { AALService } from '../../aal.service';
import { Injectable } from '@nestjs/common';

/**
 * Execution details is meant to be read only almost exclusively as a log history of the Jobs executions.
 */
@Injectable()
export class ExecutionDetailsRepository extends BaseRepository<
  ExecutionDetailsDBModel,
  ExecutionDetailsEntity,
  EnforceEnvId
> {
  constructor(protected service: AALService) {
    super('executiondetails', service);
  }
}
