export type Profile = 
  | 'Sony S-Log3'
  | 'Panasonic V-Log'
  | 'Canon Log 3'
  | 'ARRI LogC3'
  | 'RED Log3G10'
  | 'Blackmagic Film Gen 5';

export type Target = 'Rec.709' | 'Rec.2020';

export type BandMode = 'stops' | 'ire';

export interface Band {
  id: string;
  value: number; // Represents 'stop' or 'ire' depending on band_mode
  color: string;
  width: number;
}

export interface LutSetup {
  version: number;
  profile: Profile;
  target: Target;
  cube_size: number;
  bands: Array<{ stop?: number; ire?: number; color: string; width: number }>;
  band_mode: BandMode;
  fill_mode: boolean;
  low_signal_warning: boolean;
  low_signal_hex: string;
  high_signal_warning: boolean;
  high_signal_hex: string;
  monochrome: boolean;
  legal_range: boolean;
  output: string;
}
