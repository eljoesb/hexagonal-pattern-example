import { Injectable, Logger } from '@nestjs/common';
import { ICommand, Saga, ofType } from '@nestjs/cqrs';
import {
  EMPTY,
  Observable,
  filter,
  first,
  map,
  mergeMap,
  race,
  timer,
} from 'rxjs';
import { AlarmAcknowledgeEvent } from '../events/alarm-acknowledge.event';
import { AlarmCreatedEvent } from '../events/alarm-created.event';
import { time } from 'console';
import { NotifyFacilitySupervisorCommand } from '../commands/notify-facility-supervisor.command';

@Injectable()
export class UnacknowledgedAlarmSaga {
  private readonly logger = new Logger(UnacknowledgedAlarmSaga.name);

  @Saga()
  start = (events$: Observable<any>): Observable<ICommand> => {
    // A stream of alarm acknowledged events
    const alarmAcknowledgedEvents$ = events$.pipe(
      ofType(AlarmAcknowledgeEvent),
    );

    // A stream of alarm created events
    const alarmCreatedEvents$ = events$.pipe(ofType(AlarmCreatedEvent));

    return alarmCreatedEvents$.pipe(
      // Wait for an alarm to be acknowledged or 10 seconds to pass
      mergeMap((alarmCreatedEvent) =>
        race(
          alarmAcknowledgedEvents$.pipe(
            filter(
              (alarmAcknowledgedEvent) =>
                alarmAcknowledgedEvent.alarmId === alarmCreatedEvent.alarm.id,
            ),
            first(),
            // If the alarm is acknowledged, we don't need to do anything
            // Just return an empty observable that never emits
            mergeMap(() => EMPTY),
          ),
          timer(15000).pipe(map(() => alarmCreatedEvent)),
        ),
      ),
      map((alarmCreatedEvent) => {
        this.logger.debug(
          `Alarm ${alarmCreatedEvent.alarm.name} not acknowledged in 15 seconds`,
        );

        const facilityId = '12345'; // replace with facility ID
        return new NotifyFacilitySupervisorCommand(facilityId, [
          alarmCreatedEvent.alarm.id,
        ]);
      }),
    );
  };
}
