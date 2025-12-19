
export enum SuggestionCategory {
  CURRICULUM = 'תכנית לימודים',
  FACILITIES = 'מתקנים וציוד',
  NETWORKING = 'נטוורקינג ואירועים',
  PRACTICAL = 'התנסות מעשית',
  OTHER = 'אחר'
}

export enum SuggestionType {
  INITIATIVE = 'יוזמה',
  IMPROVEMENT = 'הצעה לשיפור'
}

export enum SuggestionStatus {
  PENDING = 'בבדיקה',
  REVIEWED = 'נבחן ע"י הסגל',
  ACCEPTED = 'התקבל לביצוע',
  IMPLEMENTED = 'בוצע בשטח'
}

export interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: number;
}

export interface Suggestion {
  id: string;
  title: string;
  problem: string;
  solution: string;
  impact: string;
  category: SuggestionCategory;
  type: SuggestionType;
  status: SuggestionStatus;
  author: string;
  createdAt: number;
  likes: number;
  views: number;
  comments?: Comment[];
}
