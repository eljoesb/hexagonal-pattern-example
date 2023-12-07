import { Alarm } from 'src/alarms/domain/alarm';
import { AutowiredEvent } from 'src/shared/decorators/autowired-event.decorator';

@AutowiredEvent
export class AlarmCreatedEvent {
  constructor(public readonly alarm: Alarm) {}
}
