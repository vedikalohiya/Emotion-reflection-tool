export interface EmotionResult {
    emotion: string;
    confidence: number;
    description: string;
    suggestions: string[];
    quote?: string;
}

export interface HistoryItem {
    id: number;
    text: string;
    emotion: string;
    confidence: number;
    timestamp: string;
}
