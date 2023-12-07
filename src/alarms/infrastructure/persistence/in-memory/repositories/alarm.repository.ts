import { Injectable } from '@nestjs/common';
import { AlarmEntity } from '../entities/alarm.entity';
import { Alarm } from 'src/alarms/domain/alarm';
import { AlarmMapper } from '../mappers/alarm.mapper';
import { UpsertMaterializedAlarmRepository } from 'src/alarms/application/ports/upsert-materialized-alarm.repository';
import { CreateAlarmRepository } from 'src/alarms/application/ports/create-alarm.repository';
import { FindAlarmRepository } from 'src/alarms/application/ports/find-alarm.repository';
import { AlarmReadModel } from 'src/alarms/domain/read-models/alarm.read-model';

@Injectable()
export class InMemoryAlarmRepository
  implements
    CreateAlarmRepository,
    FindAlarmRepository,
    UpsertMaterializedAlarmRepository
{
  private readonly alarms = new Map<string, AlarmEntity>();
  private readonly matelializedAlarmViews = new Map<string, AlarmReadModel>();

  async findAll(): Promise<AlarmReadModel[]> {
    return Array.from(this.matelializedAlarmViews.values());
  }

  async save(alarm: Alarm): Promise<Alarm> {
    const persistenceModel = AlarmMapper.toPersistence(alarm);
    this.alarms.set(persistenceModel.id, persistenceModel);

    const newEntity = this.alarms.get(persistenceModel.id);
    return AlarmMapper.toDomain(newEntity);
  }

  async upsert(
    alarm: Pick<AlarmReadModel, 'id'> & Partial<AlarmReadModel>,
  ): Promise<void> {
    if (this.matelializedAlarmViews.has(alarm.id)) {
      this.matelializedAlarmViews.set(alarm.id, {
        ...this.matelializedAlarmViews.get(alarm.id),
        ...alarm,
      });
      return;
    }
    this.matelializedAlarmViews.set(alarm.id, alarm as AlarmReadModel);
  }
}
