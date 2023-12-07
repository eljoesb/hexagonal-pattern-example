import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AlarmSeverity } from '../value-objects/alarm-severity';
import { Alarm } from '../alarm';
import { AlarmItem } from '../alarm-item';

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

    return alarm;
  }
}
