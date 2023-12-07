import { Alarm } from 'src/alarms/domain/alarm';

export class AlarmCreatedEvent {
  constructor(public readonly alarm: Alarm) {}
}
