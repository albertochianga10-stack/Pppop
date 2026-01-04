
export enum Platform {
  ALIEXPRESS = 'AliExpress',
  SHEIN = 'Shein',
  ALIBABA = 'Alibaba'
}

export interface ProductTrend {
  id: string;
  name: string;
  platform: Platform;
  category: string;
  description: string;
  popularityScore: number;
  estimatedPriceKz: string;
  estimatedResalePriceKz: string;
  potentialProfitKz: string;
  tags: string[];
}

export interface MarketInsight {
  title: string;
  summary: string;
  trends: ProductTrend[];
}

export interface GroundingSource {
  web?: {
    uri: string;
    title: string;
  };
}

export interface AnalyticsState {
  loading: boolean;
  error: string | null;
  insight: MarketInsight | null;
  sources: GroundingSource[];
}
