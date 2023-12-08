import { CommandHandler } from '@nestjs/cqrs';
import { Not } from 'typeorm';
import { NotifyFacilitySupervisorCommand } from './notify-facility-supervisor.command';
import { Logger } from '@nestjs/common';

@CommandHandler(NotifyFacilitySupervisorCommand)
export class NotifyFacilitySupervisorCommandHandler {
  private readonly logger = new Logger(
    NotifyFacilitySupervisorCommandHandler.name,
  );
  async execute(command: NotifyFacilitySupervisorCommand) {
    this.logger.debug(
      `Processing "NotifyFacilitySupervisorCommand": ${JSON.stringify(
        command,
      )}`,
    );

    // TODO: Send e-mail/text message to facility supervisor
  }
}
