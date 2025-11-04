export type SortableColumn =
  | 'cve'
  | 'severity'
  | 'cvss'
  | 'packageName'
  | 'packageVersion'
  | 'published'
  | 'status';

export interface VulnerabilityTableProps {
  initialLimit?: number;
}

export interface FilterValues {
  severity: string;
  status: string;
  packageName: string;
  cve: string;
  kaiStatus: string;
}
