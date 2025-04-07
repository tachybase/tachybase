export type OcrProviderType = 'tencent-cloud';

export interface OcrProvider {
  id: string;
  title: string;
  type: OcrProviderType;
  options: any;
}

export type TencentOcrType =
  | 'general'
  | 'general-accurate'
  | 'handwriting'
  | 'idcard'
  | 'business-license'
  | 'bankcard'
  | 'vehicle-license'
  | 'driver-license';

export interface TencentOcrConfig {
  secretId: string;
  secretKey: string;
  region: string;
  endpoint: string;
  enabledTypes: TencentOcrType[];
}

export interface OcrRecognitionParams {
  providerId: string;
  type?: string;
  url?: string;
  base64?: string;
  file?: File;
}

export interface OcrRecognitionResult {
  text: string;
  confidence?: number;
  structured?: Record<string, any>;
  original?: any;
}

export interface OcrApiInterface {
  getProviders(): Promise<OcrProvider[]>;
  recognize(params: OcrRecognitionParams): Promise<OcrRecognitionResult>;
}
