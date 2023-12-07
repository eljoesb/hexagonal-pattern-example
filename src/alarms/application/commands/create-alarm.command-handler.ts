import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateAlarmCommand } from './create-alarm.command';
import { Logger } from '@nestjs/common';
import { AlarmFactory } from 'src/alarms/domain/factories/alarm.factory';
import { CreateAlarmRepository } from '../ports/create-alarm.repository';
import { AlarmCreatedEvent } from '../events/alarm-created.event';

@CommandHandler(CreateAlarmCommand)
export class CreateAlarmCommandHandler
  implements ICommandHandler<CreateAlarmCommand>
{
  private readonly logger = new Logger(CreateAlarmCommandHandler.name);

  constructor(
    private readonly alarmsRepository: CreateAlarmRepository,
    private readonly alarmFactory: AlarmFactory,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateAlarmCommand) {
    this.logger.debug(`
    Processing "CreateAlarmCommand": ${JSON.stringify(command)}`);
    const alarm = this.alarmFactory.create(
      command.name,
      command.severity,
      command.triggeredAt,
      command.items,
    );
    const newAlarm = await this.alarmsRepository.save(alarm);

    this.eventBus.publish(new AlarmCreatedEvent(alarm));
    return newAlarm;
  }
}
