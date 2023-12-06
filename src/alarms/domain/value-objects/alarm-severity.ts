export class AlarmSeverity {
  constructor(readonly value: 'critical' | 'low' | 'medium' | 'high') {}

  equals(severity: AlarmSeverity) {
    return this.value === severity.value;
  }
}
