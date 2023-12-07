import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MaterializedAlarmView } from '../schemas/materialized-alarm-view.schema';
import { AlarmReadModel } from 'src/alarms/domain/read-models/alarm.read-model';

@Injectable()
export class OrmUpsertMaterializedAlarmRepository {
  constructor(
    @InjectModel(MaterializedAlarmView.name)
    private readonly alarmModel: Model<MaterializedAlarmView>,
  ) {}

  async upsert(
    alarm: Pick<AlarmReadModel, 'id'> & Partial<AlarmReadModel>,
  ): Promise<void> {
    await this.alarmModel.findOneAndUpdate({ id: alarm.id }, alarm, {
      upsert: true,
    });
  }
}
