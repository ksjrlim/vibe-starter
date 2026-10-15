export interface Comment {
  id: string;
  author: string;
  location: string;
  timestamp: string;
  content: string;
  recommendations: number;
  isNYTPick?: boolean;
  replies?: Comment[];
}

export interface Article {
  id: string;
  title: string;
  deck?: string;
  readTime: string;
  kicker?: string;
  topic?: string;
  subtopics?: string[];
  commentsCount?: number;
  imageUrl?: string;
  imageCaption?: string;
  imageCredit?: string;
  bullets?: string[];
  byline: string;
  publishedAt: string;
  updatedAt?: string;
  content: string[];
  pullQuote?: {
    text: string;
    attribution?: string;
  };
  section: string;
  isLead?: boolean;
  isFree?: boolean;
  isBriefing?: boolean;
  isDispatches?: boolean;
}

export type ActiveScreen = 'home' | 'article' | 'section';

export interface UserPreferences {
  fontSize: 'standard' | 'medium' | 'large';
  theme: 'newspaper' | 'sepia' | 'dark';
  savedArticleIds: string[];
  isSubscribed: boolean;
}
