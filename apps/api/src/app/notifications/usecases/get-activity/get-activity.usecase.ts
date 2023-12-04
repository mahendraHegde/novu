import { Inject, Injectable } from '@nestjs/common';
import { NotificationRepository } from '@novu/dal';
import { ExecutionDetailsRepository, ExecutionDetailsEntity } from '@novu/aal';

import { AnalyticsService } from '@novu/application-generic';

import { ActivityNotificationResponseDto } from '../../dtos/activities-response.dto';
import { GetActivityCommand } from './get-activity.command';

@Injectable()
export class GetActivity {
  constructor(
    private notificationRepository: NotificationRepository,
    private analyticsService: AnalyticsService,
    private executionDetailsRepository: ExecutionDetailsRepository
  ) {}

  async execute(command: GetActivityCommand): Promise<ActivityNotificationResponseDto> {
    this.analyticsService.track('Get Activity Feed Item - [Activity Feed]', command.userId, {
      _organization: command.organizationId,
    });
    const [feed, executionDetails] = await Promise.all([
      this.notificationRepository.getFeedItem(
        command.notificationId,
        command.environmentId,
        command.organizationId
      ) as Promise<ActivityNotificationResponseDto>,
      this.executionDetailsRepository.find(
        {
          _environmentId: command.environmentId,
          _organizationId: command.organizationId,
          _notificationId: command.notificationId,
        },
        [
          '_id',
          '_jobId',
          'createdAt',
          'detail',
          'isRetry',
          'isTest',
          'providerId',
          'raw',
          'source',
          'status',
          'updatedAt',
          'webhookStatus',
        ]
      ),
    ]);

    return this.mergeFeedWithExecutionDetails(feed, executionDetails);
  }

  private mergeFeedWithExecutionDetails(
    feed: ActivityNotificationResponseDto,
    executionDetails: Array<ExecutionDetailsEntity>
  ): ActivityNotificationResponseDto {
    const groupedByJobId = executionDetails.reduce((res, cur) => {
      if (res[cur._jobId]) {
        res[cur._jobId].push(cur);
      } else {
        res[cur._jobId] = [cur];
      }

      return res;
    }, {} as Record<string, ExecutionDetailsEntity[]>);

    feed.jobs = feed.jobs?.map((job) => {
      return {
        ...job,
        executionDetails: groupedByJobId[job._id] as any,
      };
    });

    return feed;
  }
}
