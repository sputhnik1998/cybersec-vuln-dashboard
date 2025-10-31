import type { SeverityData, SeverityLevel } from '../types/vulnerability';

export const SEVERITY_COLORS: Record<SeverityLevel, string> = {
  critical: '#dc2626',
  high: '#f97316',
  medium: '#eab308',
  low: '#22c55e',
};

export const formatSeverityData = (
  severityBreakdown: Record<SeverityLevel, number>
): SeverityData[] => {
  return [
    {
      label: 'Critical',
      count: severityBreakdown.critical,
      color: SEVERITY_COLORS.critical,
    },
    {
      label: 'High',
      count: severityBreakdown.high,
      color: SEVERITY_COLORS.high,
    },
    {
      label: 'Medium',
      count: severityBreakdown.medium,
      color: SEVERITY_COLORS.medium,
    },
    {
      label: 'Low',
      count: severityBreakdown.low,
      color: SEVERITY_COLORS.low,
    },
  ];
};
