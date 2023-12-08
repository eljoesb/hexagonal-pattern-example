import { AutowiredEvent } from 'src/shared/decorators/autowired-event.decorator';

@AutowiredEvent
export class AlarmAcknowledgeEvent {
  constructor(public readonly alarmId: string) {}
}
