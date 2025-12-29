import type { AuthState } from "@/contaxt/AuthProvider";
import type { AiModel, ApiListResponse, Image2VideoItem, Image2VideoResponse, updateAudioPaylod, VideoEffect } from "@/types";

export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
  }
}

export class ApiClient {
  base: string;
  auth: AuthState;


  constructor(
    auth: AuthState,
    version: "v3" | "v4" = "v3") {
    this.base = `/api/open/${version}`;
    this.auth = auth;
  }

  private buildHeaders(extra?: HeadersInit) {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(extra || {}),
    };

    if (this.auth.type === "token") {
      headers["Authorization"] = `Bearer ${this.auth.credential}`;
    } else if (this.auth.type === "apiKey") {
      headers["x-api-key"] = this.auth.credential;
    }

    return headers;
  }

  async request<T>(path: string, opts: RequestInit = {}): Promise<T> {
    const res = await fetch(`${this.base}${path}`, {
      ...opts,
      headers: this.buildHeaders(opts.headers),
    });

    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = text;
    }

    if (!res.ok) {
      const msg = data?.message || data?.error || res.statusText || "API Error";
      throw new ApiError(msg, res.status);
    }

    return data as T;
  }

  async getVideoEffects(): Promise<ApiListResponse<VideoEffect>> {
    return this.request<ApiListResponse<VideoEffect>>("/image2Video/effects");
  }


  getAiModelList() {
    return this.request<{ code: number; msg: string; data: AiModel[] }>("/aigModel/list?types[]=1501");
  }

  createImage2Video(payload: unknown): Promise<Image2VideoResponse> {
    return this.request("/image2Video/createBySourcePrompt/batch", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  getVideoInfo(payload: { _ids: string }): Promise<ApiListResponse<Image2VideoItem[]>> {
    return this.request(`/image2Video/resultsByIds`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  getUserCredits(): Promise<ApiListResponse<Image2VideoItem[]>> {
    return this.request(`/faceswap/quota/info`);
  }

  updateAudio(payload: updateAudioPaylod): Promise<ApiListResponse<Image2VideoItem[]>> {
    return this.request(`/image2Video/updateVideoAudio`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }


  static async getTokenWithClientCredentials(clientId: string, clientSecret: string) {
    const base = "https://openapi.akool.com/api/open/v3";

    const res = await fetch(`${base}/getToken`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId, clientSecret }),
    });

    const json = await res.json();
    if (!res.ok) throw new ApiError(json.message || "Failed to get token", res.status);
    return json;
  }
}
