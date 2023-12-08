import { VersionedAggregateRoot } from 'src/shared/domain/aggregate-root';
import { AlarmItem } from './alarm-item';
import { AlarmSeverity } from './value-objects/alarm-severity';
import { AlarmAcknowledgeEvent } from '../application/events/alarm-acknowledge.event';
import { SerializedEventPayload } from 'src/shared/domain/interfaces/serializable-event';
import { AlarmCreatedEvent } from '../application/events/alarm-created.event';

export class Alarm extends VersionedAggregateRoot {
  public name: string;
  public severity: AlarmSeverity;
  public triggeredAt: Date;
  public isAcknowledged = false;
  public items = new Array<AlarmItem>();

  constructor(public id: string) {
    super();
  }

  acknowledge() {
    this.apply(new AlarmAcknowledgeEvent(this.id));
  }

  addAlarmItem(alarmItem: AlarmItem) {
    this.items.push(alarmItem);
  }

  [`on${AlarmCreatedEvent.name}`](
    event: SerializedEventPayload<AlarmCreatedEvent>,
  ) {
    this.name = event.alarm.name;
    this.severity = new AlarmSeverity(event.alarm.severity);
    this.triggeredAt = new Date(event.alarm.triggeredAt);
    this.isAcknowledged = event.alarm.isAcknowledged;
    this.items = event.alarm.items.map(
      (item) => new AlarmItem(item.id, item.name, item.type),
    );
  }

  [`on${AlarmAcknowledgeEvent.name}`](
    event: SerializedEventPayload<AlarmAcknowledgeEvent>,
  ) {
    if (this.isAcknowledged) {
      throw new Error('Alarm has already been acknowledged');
    }
    this.isAcknowledged = true;
  }
}
