import { Module } from '@nestjs/common';
import { InMemoryAlarmPersistenceModule } from './in-memory/in-memory-persistence.module';
import { OrmAlarmPersistenceModule } from './orm/orm-persistence.module';

@Module({})
export class AlarmsInfrastructureModule {
  static use(driver: 'orm' | 'in-memory') {
    const persistenceModule =
      driver === 'orm'
        ? OrmAlarmPersistenceModule
        : InMemoryAlarmPersistenceModule;

    return {
      module: AlarmsInfrastructureModule,
      imports: [persistenceModule],
      exports: [persistenceModule],
    };
  }
}
