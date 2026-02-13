// Represents a single telemetry data point from Azure
export interface PulseMetric {
  value: number;
  recordedAt: string;
}

// Defines the structure for an Azure resource and its most recent metric
export interface AzureResource {
  id: string;
  name: string;
  type: string;
  // Can be null if the worker hasn't collected data yet
  latestPulse: PulseMetric | null;
}