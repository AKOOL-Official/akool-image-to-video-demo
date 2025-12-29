
export interface FormState {
  imageUrl: string;
  imageStatus: "idle" | "valid" | "invalid" | "validating";
  imagePreview: string | null;
  prompt: string;
  negativePrompt: string;
  model: AiModel | null;
  resolution: string;
  videoLength: number;
  audioUrl: string;
  audioType: "1" | "2" | "3";        //1 = AI generate, 2 = user custom upload, 3 = none (no audio)
  selectedEffect: string | null;
  count: number;
  isPremiumModel: boolean
}

export type generate_audio = {
  required: boolean,
  type: boolean,
  default: boolean,
  extra_credit_multiplier: number
}

export interface ResolutionOption {
  label: string;
  value: string;
  width: number;
  height: number;
  unit_credit: number;
}

export interface AiModel {
  sort: number;
  group: string;
  provider: string;
  type: number;
  value: string;
  name?: string;
  label: string;
  description?: string;
  isPro: boolean;
  resolutionList: ResolutionOption[];
  durationList: number[];
  generate_audio?: generate_audio | null;
  requiresPay: boolean;
  supportedLastFrame: boolean;
  supportedExtendPrompt: boolean;
  maxImageCount: number;
  maxCount: number;
}

export interface VideoResultItem {
  _id: string;

  video_duration: number;
  file_name: string;

  effect_name: string;
  effect_code: string;

  image_url: string;
  prompt: string;
  resolution: string;

  audio_type: number;
  audio_url: string;

  deduction_credit: number;
  only_add_audio: boolean;

  status: number;

  video_url?: string;
  cover_url?: string;

}

export type AiModelsByProvider = Record<string, AiModel[]>;


export type UseAnimatorLogicReturn = {
  form: FormState;
  setFormField: (field: keyof FormState, value: string | number | boolean | null) => void;

  videoEffects: VideoEffect[];
  AiModelsByProvider: AiModelsByProvider;
  isLoadingVideoEffects: boolean;

  videoData: VideoResultItem[] | null;
  error: string | null;
  isProcessing: boolean;
  isFormValid: boolean;

  handleGenerate: () => Promise<void>;
  resetForm: () => void;
  applyModelDefaults: (model: AiModel) => void;

  view: "form" | "processing" | "result";
  setView: React.Dispatch<React.SetStateAction<"form" | "processing" | "result">>;

  showBack: boolean;
  handleBack: () => void;

  handleUpdateAudio: () => void;
  userCredits: number
}


export interface FormFieldProps {
  form: FormState;
  onChange: (
    key: keyof FormState,
    value: string | boolean | number | null
  ) => void;
}

export interface VideoEffect {
  _id: string,
  create_time: number,
  logo: string,
  name: string,
  video_url: string,
  effect_code: string,
}

export interface Image2VideoItem {
  _id: string;
  create_time: number;
  uid: number;
  team_id: string;
  status: number;
  webhookUrl: string;
  resolution: string;
  file_name: string;
  image_url: string;
  prompt: string;
  negative_prompt: string;
  extend_prompt: boolean;
  deduction_credit: number;
  model_name: string;
  batch_id: string;
  batch_count: number;
}


export type updateAudioPaylod = {
  pre_video_id: string;
  audio_url: string,
  audio_type: number
}

export type Image2VideoResponse = ApiResponse<{
  successList: Image2VideoItem[];
  errorList: any[];
}>;


export type ApiListResponse<T> = ApiResponse<{ result: T[] }>;

export interface ApiResponse<T = any> {
  code: number;
  msg: string;
  data: T;
}
