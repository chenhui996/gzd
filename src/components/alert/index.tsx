import Alert, { type GZDAlertProps } from './Alert';
import ErrorBoundary, { type GZDAlertErrorBoundaryProps } from './ErrorBoundary';

export type { GZDAlertProps, GZDAlertErrorBoundaryProps };

export type GZDAlertComponent = typeof Alert & {
  ErrorBoundary: typeof ErrorBoundary;
};

const TransAlert = Alert as GZDAlertComponent;

TransAlert.ErrorBoundary = ErrorBoundary;

export default TransAlert;
