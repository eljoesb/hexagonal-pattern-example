import { Module } from '@nestjs/common';
import { CreateAlarmRepository } from 'src/alarms/application/ports/create-alarm.repository';
import { InMemoryAlarmRepository } from './repositories/alarm.repository';
import { FindAlarmRepository } from 'src/alarms/application/ports/find-alarm.repository';
import { UpsertMaterializedAlarmRepository } from 'src/alarms/application/ports/upsert-materialized-alarm.repository';

@Module({
  imports: [],
  providers: [
    InMemoryAlarmRepository,
    {
      provide: CreateAlarmRepository,
      useExisting: InMemoryAlarmRepository,
    },
    {
      provide: FindAlarmRepository,
      useExisting: InMemoryAlarmRepository,
    },
    {
      provide: UpsertMaterializedAlarmRepository,
      useExisting: InMemoryAlarmRepository,
    },
  ],
  exports: [
    CreateAlarmRepository,
    FindAlarmRepository,
    UpsertMaterializedAlarmRepository,
  ],
})
export class InMemoryAlarmPersistenceModule {}
