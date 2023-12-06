import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateAlarmCommand } from './create-alarm.command';
import { Logger } from '@nestjs/common';
import { AlarmFactory } from 'src/alarms/domain/factories/alarm.factory';
import { AlarmRepository } from '../ports/alarm.repository';

@CommandHandler(CreateAlarmCommand)
export class CreateAlarmCommandHandler
  implements ICommandHandler<CreateAlarmCommand>
{
  private readonly logger = new Logger(CreateAlarmCommandHandler.name);

  constructor(
    private readonly alarmsRepository: AlarmRepository,
    private readonly alarmFactory: AlarmFactory,
  ) {}

  async execute(command: CreateAlarmCommand) {
    this.logger.debug(`
    Processing "CreateAlarmCommand": ${JSON.stringify(command)}`);
    const alarm = this.alarmFactory.create(command.name, command.severity);
    return this.alarmsRepository.save(alarm);
  }
}
