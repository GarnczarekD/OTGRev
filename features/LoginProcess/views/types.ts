import { UserProfile } from "services/api/user";

export interface QuickLoginForm {
  code: string;
}

export interface FullLoginForm {
  username: string;
  code: string;
}

export interface QuickLoginViewProps {
  onLogin: (code: string, remember: boolean) => void;
  onFullLoginSelect: () => void;
  error?: boolean;
}

export interface FullLoginViewProps {
  onLogin: (username: string, code: string, remember: boolean) => void;
  onQuickLoginSelect: () => void;
  error?: boolean;
}

export interface ConsentsViewProps {
  onAccept: (accepted: boolean) => void;
}

export interface ProfilesViewProps {
  onProfileSelect: (profile: string) => Promise<void>;
  onCreateProfile: () => void;
}
