export type EducationRole = "system" | "user";

export interface Message {
    id: string;
    role: EducationRole;
    content: string;
    type?: "text" | "options" | "input" | "report";
    options?: string[];
    timestamp?: Date;
}

export type ContentStatus = "pending" | "processing" | "ready" | "error";
export type ContentType =
    | "video"
    | "audio"
    | "pdf"
    | "image"
    | "text"
    | "document";

export interface EducationContent {
    id: string;
    title: string;
    originalUrl?: string;
    type: ContentType;
    source_type?: ContentType;
    status: ContentStatus;
    thumbnailUrl?: string;
    summary?: string;
    createdAt: string;
    updatedAt?: string;
    fullData?: Record<string, any>;
    question_process?: {
        completed: boolean;
        question_blocks: QuestionBlock[];
    };
    telegram_tracking?: {
        active: boolean;
        activated_at: string | null;
    };
    copilot_tracking_active?: boolean;
}

export interface GeneratedContent {
    question_process_generated?: {
        title?: string;
        summary?: string;
        key_insights?: Array<{ icon: string; text: string }>;
        strategic_analysis?: {
            alignment: string;
            friction_bypass: string;
        };
        action_plan?: Array<{
            task: string;
            impact: string;
            time: string;
        }>;
    };
}

export interface TrackingResponse {
    success: boolean;
    data?: {
        active?: boolean;
        copilot_tracking_active?: boolean;
        resource_id?: string;
        activated_at?: string;
        title?: string;
    };
}

interface QuestionBlock {
    block: string;
    intent: string;
    questions: Array<{
        id: string;
        question: string;
        type: string;
        options?: string[];
    }>;
}

export interface UserContext {
    goals90Days?: string;
    timeAvailable?: string;
    preferredFormat?: string; // 'video', 'text', 'audio'
    missionStatement?: string;
}

export interface OnboardingSession {
    userId: string;
    currentStep: number;
    totalSteps: number;
    history: Message[];
    status: "active" | "completed";
    context: UserContext;
}
