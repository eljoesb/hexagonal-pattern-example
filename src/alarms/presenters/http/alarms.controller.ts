import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { AlarmsService } from '../../application/alarms.service';
import { CreateAlarmDto } from './dto/create-alarm.dto';
import { CreateAlarmCommand } from 'src/alarms/application/commands/create-alarm.command';

@Controller('alarms')
export class AlarmsController {
  constructor(private readonly alarmsService: AlarmsService) {}

  @Post()
  create(@Body() createAlarmDto: CreateAlarmDto) {
    return this.alarmsService.create(
      new CreateAlarmCommand(
        createAlarmDto.name,
        createAlarmDto.severity,
        createAlarmDto.triggeredAt,
        createAlarmDto.items,
      ),
    );
  }

  @Get()
  findAll() {
    return this.alarmsService.findAll();
  }

  @Patch(':id/acknowledge')
  acknowledge(@Param('id') id: string) {
    return this.alarmsService.acknowledge(id);
  }
}
