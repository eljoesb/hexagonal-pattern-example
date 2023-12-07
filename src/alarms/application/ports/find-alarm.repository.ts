import { AlarmReadModel } from 'src/alarms/domain/read-models/alarm.read-model';

export abstract class FindAlarmRepository {
  abstract findAll(): Promise<AlarmReadModel[]>;
}
