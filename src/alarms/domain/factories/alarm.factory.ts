import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AlarmSeverity } from '../value-objects/alarm-severity';
import { Alarm } from '../alarm';
import { AlarmItem } from '../alarm-item';
import { AlarmCreatedEvent } from 'src/alarms/application/events/alarm-created.event';

@Injectable()
export class AlarmFactory {
  create(
    name: string,
    severity: string,
    triggeredAt: Date,
    items: Array<{ name: string; type: string }>,
  ) {
    const alarmId = randomUUID();
    const alarmSeverity = new AlarmSeverity(severity as AlarmSeverity['value']);

    const alarm = new Alarm(alarmId);
    alarm.name = name;
    alarm.severity = alarmSeverity;
    alarm.triggeredAt = triggeredAt;
    items
      .map((item) => new AlarmItem(randomUUID(), item.name, item.type))
      .forEach((item) => alarm.addAlarmItem(item));

    alarm.apply(new AlarmCreatedEvent(alarm), { skipHandler: true });
    return alarm;
  }
}
