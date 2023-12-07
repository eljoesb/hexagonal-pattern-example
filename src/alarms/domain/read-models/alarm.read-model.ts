export class AlarmReadModel {
  id: string;
  name: string;
  severity: string;
  triggeredAt: Date;
  isAcknowledged: boolean;
  items: Array<{ name: string; type: string }>;
}
