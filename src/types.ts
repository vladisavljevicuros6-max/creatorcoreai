export interface Idea {
  id: string;
  platform: string;
  title: string;
  hook: string;
  explanation: string;
  productionTips: string;
  thumbnailSuggestion: string;
  seoTitle: string;
  seoDescription: string;
  hashtags: string[];
  viralityScore: number;
  script?: string;
  thumbnailUrl?: string;
  scheduledDate?: string;
}

export interface GenerationRequest {
  platform: string;
  channel: string;
  description: string;
  template: string;
}

export interface GenerationBatch {
  id: string;
  createdAt: string;
  request: GenerationRequest;
  ideas: Idea[];
}
