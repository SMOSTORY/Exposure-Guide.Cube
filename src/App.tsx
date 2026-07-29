import React, { useState, useEffect } from 'react';
import { Download, Plus, Trash2, Code, Palette, Sun, Moon, Monitor, Info, CheckCircle2, SlidersHorizontal, Camera, AlertCircle, ChevronDown, ArrowRight, ArrowLeft, X, ExternalLink } from 'lucide-react';
import { Profile, Target, BandMode, Band, LutSetup } from './types';
import { generateCubeLut } from './utils';

const PROFILES: Profile[] = [
  'Sony S-Log3',
  'Panasonic V-Log',
  'Canon Log 3',
  'ARRI LogC3',
  'RED Log3G10',
  'Blackmagic Film Gen 5',
];

const TARGETS: Target[] = ['Rec.709', 'Rec.2020'];
const CUBE_SIZES = [17, 33, 65];

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

const DEFAULT_BANDS: Band[] = [
  { id: generateId(), value: -2, color: '#1e40af', width: 0.3 },
  { id: generateId(), value: -1, color: '#38bdf8', width: 0.3 },
  { id: generateId(), value: 0, color: '#22c55e', width: 0.3 },
  { id: generateId(), value: 1, color: '#facc15', width: 0.3 },
  { id: generateId(), value: 2, color: '#f97316', width: 0.3 },
];

const Toggle = ({ checked, onChange, label, description, colorElement }: any) => (
  <div className="flex items-center justify-between py-4">
    <div className="flex-1 pr-6">
      <label className="text-[17px] font-medium text-neutral-900 dark:text-neutral-100 block cursor-pointer select-none" onClick={() => onChange(!checked)}>
        {label}
      </label>
      {description && <p className="text-[14px] text-neutral-500 dark:text-neutral-400 mt-1 leading-snug">{description}</p>}
    </div>
    <div className="flex items-center gap-4 shrink-0">
      {colorElement}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black ${checked ? 'bg-blue-500' : 'bg-neutral-300 dark:bg-neutral-700'}`}
      >
        <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-[0_2px_4px_rgba(0,0,0,0.2)] ring-0 transition-transform duration-300 ease-in-out ${checked ? 'translate-x-7' : 'translate-x-1'}`} />
      </button>
    </div>
  </div>
);

const FormGroup = ({ children, title }: any) => (
  <div className="mb-6 sm:mb-8 last:mb-0 w-full">
    {title && <h3 className="text-[13px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider ml-4 mb-2">{title}</h3>}
    <div className="bg-white/60 dark:bg-[#2C2C2E]/60 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-700/50 rounded-3xl overflow-hidden shadow-sm">
      <div className="divide-y divide-neutral-200/50 dark:divide-neutral-700/50 px-5">
        {children}
      </div>
    </div>
  </div>
);

export default function App() {
  const [profile, setProfile] = useState<Profile>('Panasonic V-Log');
  const [target, setTarget] = useState<Target>('Rec.709');
  const [cubeSize, setCubeSize] = useState<number>(33);
  const [bandMode, setBandMode] = useState<BandMode>('stops');
  const [fillMode, setFillMode] = useState<boolean>(false);
  const [bands, setBands] = useState<Band[]>(DEFAULT_BANDS);
  const [lowSignalWarning, setLowSignalWarning] = useState<boolean>(true);
  const [lowSignalHex, setLowSignalHex] = useState<string>('#7c3aed');
  const [highSignalWarning, setHighSignalWarning] = useState<boolean>(true);
  const [highSignalHex, setHighSignalHex] = useState<string>('#dc2626');
  const [monochrome, setMonochrome] = useState<boolean>(true);
  const [legalRange, setLegalRange] = useState<boolean>(false);
  const [output, setOutput] = useState<string>('my_false_color');

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;

  const stepInfo = [
    { title: "Choose Your Camera", desc: "Select the camera log profile that matches your footage." },
    { title: "Target Output", desc: "Choose the color space for your diagnostic output." },
    { title: "LUT Resolution", desc: "Configure the quality and size of your LUT." },
    { title: "Exposure Measurement", desc: "How should exposure values be calculated?" },
    { title: "Exposure Bands", desc: "Define the colors mapped to specific exposure ranges." },
    { title: "Warnings & Rendering", desc: "Configure clipping warnings and how the base video is displayed." },
    { title: "Ready to Export", desc: "Your LUT is ready. Name your file and download the generated .cube file directly to use in your editing software." }
  ];

  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [showPreview, setShowPreview] = useState(false);
  const [showDocumentation, setShowDocumentation] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  const addBand = () => {
    setBands([...bands, { id: generateId(), value: 0, color: '#ffffff', width: 0.3 }]);
  };

  const removeBand = (id: string) => {
    setBands(bands.filter(b => b.id !== id));
  };

  const updateBand = (id: string, updates: Partial<Band>) => {
    setBands(bands.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const lutSetup: LutSetup = {
    version: 2,
    profile,
    target,
    cube_size: cubeSize,
    bands: bands.map(b => ({
      [bandMode === 'stops' ? 'stop' : 'ire']: b.value,
      color: b.color,
      width: b.width
    })),
    band_mode: bandMode,
    fill_mode: fillMode,
    low_signal_warning: lowSignalWarning,
    low_signal_hex: lowSignalHex,
    high_signal_warning: highSignalWarning,
    high_signal_hex: highSignalHex,
    monochrome,
    legal_range: legalRange,
    output: output.endsWith('.cube') ? output : `${output}.cube`
  };

  const jsonString = JSON.stringify(lutSetup, null, 2);

  const downloadJson = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'setup.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadCubeFile = () => {
    const cubeData = generateCubeLut(lutSetup);
    const blob = new Blob([cubeData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = lutSetup.output;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const renderStep = () => {
    switch (currentStep) {
      case 1: return (
         <div className="animate-in fade-in slide-in-from-right-4 duration-500 w-full">
           <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
             {PROFILES.map(p => {
               const getBrandInfo = (profile: string) => {
                 if (profile.includes('Sony')) return { brand: 'SONY', text: 'S-Log3' };
                 if (profile.includes('Panasonic')) return { brand: 'LUMIX', text: 'V-Log' };
                 if (profile.includes('Canon')) return { brand: 'CANON', text: 'Log 3' };
                 if (profile.includes('ARRI')) return { brand: 'ARRI', text: 'LogC3' };
                 if (profile.includes('RED')) return { brand: 'RED', text: 'Log3G10' };
                 if (profile.includes('Blackmagic')) return { brand: 'BMD', text: 'Film Gen 5' };
                 return { brand: 'CAM', text: profile };
               };
               const { brand, text } = getBrandInfo(p);
               const isSelected = profile === p;
               return (
                 <button
                   key={p}
                   onClick={() => {
                     setProfile(p);
                     nextStep();
                   }}
                   className={`flex flex-col items-center justify-center p-6 rounded-3xl border transition-all duration-200 ${
                     isSelected 
                       ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-500 shadow-md shadow-blue-500/10'
                       : 'bg-white/60 dark:bg-[#2C2C2E]/60 border-neutral-200/50 dark:border-neutral-700/50 hover:bg-white dark:hover:bg-[#3C3C3E]/60 hover:shadow-sm cursor-pointer'
                   }`}
                 >
                   <span className={`text-2xl font-black tracking-tight mb-2 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-neutral-900 dark:text-neutral-100'}`}>{brand}</span>
                   <span className={`text-[13px] font-medium ${isSelected ? 'text-blue-500/80 dark:text-blue-300' : 'text-neutral-500 dark:text-neutral-400'}`}>{text}</span>
                 </button>
               );
             })}
           </div>
         </div>
      );
      case 2: return (
         <div className="animate-in fade-in slide-in-from-right-4 duration-500 w-full flex flex-col gap-3">
           <FormGroup>
             <div className="py-2 relative">
               <select 
                 value={target} 
                 onChange={e => setTarget(e.target.value as Target)}
                 className="w-full bg-transparent py-3 pr-10 text-[17px] font-medium text-neutral-900 dark:text-neutral-100 focus:outline-none appearance-none cursor-pointer"
               >
                 {TARGETS.map(t => <option key={t} value={t}>{t}</option>)}
               </select>
               <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">
                 <ChevronDown className="w-5 h-5" />
               </div>
             </div>
           </FormGroup>

           <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-3xl p-5 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-[14px] text-blue-900 dark:text-blue-200 leading-relaxed">
                <strong>Rec.709</strong><br/>
                The standard for most HD displays. Recommended for typical monitoring.<br/><br/>
                <strong>Rec.2020</strong><br/>
                Used for HDR displays. Only select if explicitly set up for Rec.2020.
              </p>
           </div>
         </div>
      );
      case 3: return (
         <div className="animate-in fade-in slide-in-from-right-4 duration-500 w-full flex flex-col gap-3">
           <FormGroup>
             <div className="py-2 relative">
               <select 
                 value={cubeSize} 
                 onChange={e => setCubeSize(Number(e.target.value))}
                 className="w-full bg-transparent py-3 pr-10 text-[17px] font-medium text-neutral-900 dark:text-neutral-100 focus:outline-none appearance-none cursor-pointer"
               >
                 {CUBE_SIZES.map(s => <option key={s} value={s}>{s} Point (3D LUT)</option>)}
               </select>
               <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">
                 <ChevronDown className="w-5 h-5" />
               </div>
             </div>
           </FormGroup>
           
           <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-3xl p-5 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-[14px] text-blue-900 dark:text-blue-200 leading-relaxed">
                This is the "resolution" of your LUT file.<br/><br/>
                • <strong>33 Point</strong> is the industry standard (best balance of quality/size).<br/>
                • <strong>65 Point</strong> provides the sharpest color transitions (larger file).<br/>
                • <strong>17 Point</strong> creates a very small file.
              </p>
           </div>
         </div>
      );
      case 4: return (
         <div className="animate-in fade-in slide-in-from-right-4 duration-500 w-full flex flex-col gap-3">
           <FormGroup>
             <div className="py-2 relative">
               <select 
                 value={bandMode} 
                 onChange={e => setBandMode(e.target.value as BandMode)}
                 className="w-full bg-transparent py-3 pr-10 text-[17px] font-medium text-neutral-900 dark:text-neutral-100 focus:outline-none appearance-none cursor-pointer"
               >
                 <option value="stops">Stops (Camera Stops)</option>
                 <option value="ire">IRE (0-100 Scale)</option>
               </select>
               <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">
                 <ChevronDown className="w-5 h-5" />
               </div>
             </div>
           </FormGroup>
           
           <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-3xl p-5 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-[14px] text-blue-900 dark:text-blue-200 leading-relaxed">
                How do you want to measure your exposure?<br/><br/>
                • <strong>Stops:</strong> Uses camera stops relative to middle grey.<br/>
                • <strong>IRE:</strong> Uses a 0–100 scale based on the brightness signal.
              </p>
           </div>
         </div>
      );
      case 5: return (
         <div className="animate-in fade-in slide-in-from-right-4 duration-500 w-full flex flex-col gap-3">
           <FormGroup>
             {bands.map((band, index) => (
               <div key={band.id} className="py-5 flex flex-col sm:flex-row sm:items-center gap-4 group">
                  <div className="flex-1 grid grid-cols-3 gap-3 sm:gap-4">
                     <div>
                       <label className="text-[10px] sm:text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest block mb-2">
                         {bandMode === 'stops' ? 'Stops' : 'IRE'}
                       </label>
                       <input
                         type="number"
                         step={bandMode === 'stops' ? "0.1" : "1"}
                         value={band.value}
                         onChange={e => updateBand(band.id, { value: parseFloat(e.target.value) || 0 })}
                         className="w-full bg-neutral-100/50 dark:bg-neutral-800/50 border border-neutral-200/50 dark:border-neutral-700/50 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-[15px] sm:text-[17px] font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                       />
                     </div>
                     <div>
                       <label className="text-[10px] sm:text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest block mb-2">Color</label>
                       <div className="relative">
                         <input
                           type="color"
                           value={band.color}
                           onChange={e => updateBand(band.id, { color: e.target.value })}
                           className="w-full h-[40px] sm:h-[50px] bg-neutral-100/50 dark:bg-neutral-800/50 border border-neutral-200/50 dark:border-neutral-700/50 rounded-xl sm:rounded-2xl cursor-pointer [&::-webkit-color-swatch-wrapper]:p-1.5 [&::-webkit-color-swatch]:border-none [&::-webkit-color-swatch]:rounded-xl transition-shadow"
                         />
                       </div>
                     </div>
                     <div>
                       <label className="text-[10px] sm:text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest block mb-2">Width</label>
                       <input
                         type="number"
                         step="0.1"
                         min="0"
                         value={band.width}
                         onChange={e => updateBand(band.id, { width: parseFloat(e.target.value) || 0 })}
                         className="w-full bg-neutral-100/50 dark:bg-neutral-800/50 border border-neutral-200/50 dark:border-neutral-700/50 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-[15px] sm:text-[17px] font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                       />
                     </div>
                  </div>
                  <button
                    onClick={() => removeBand(band.id)}
                    className="mt-2 sm:mt-6 text-neutral-400 hover:text-red-500 transition-colors shrink-0 p-2 sm:p-3 sm:opacity-0 group-hover:opacity-100 focus:opacity-100 rounded-full hover:bg-red-50 dark:hover:bg-red-500/10 self-center sm:self-start"
                    title="Remove band"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
               </div>
             ))}
             {bands.length === 0 && (
               <div className="py-10 text-center text-[15px] text-neutral-500">
                 No exposure bands configured.
               </div>
             )}
             <div className="-mx-5 px-5 py-6 bg-blue-50/40 dark:bg-blue-500/5 border-t border-blue-100/50 dark:border-blue-500/10">
               <button 
                 onClick={addBand}
                 className="w-full flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 font-semibold py-3.5 sm:py-4 rounded-2xl bg-white/50 dark:bg-blue-500/10 hover:bg-white dark:hover:bg-blue-500/20 border border-blue-200/50 dark:border-blue-500/20 shadow-sm transition-all text-[16px] sm:text-[17px]"
               >
                 <Plus className="w-5 h-5" /> Add New Band
               </button>
             </div>
           </FormGroup>
           <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-3xl p-5 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-[14px] text-blue-900 dark:text-blue-200 leading-relaxed">
                Tip: Later bands in the list override earlier ones if they overlap.
              </p>
           </div>
         </div>
      );
      case 6: return (
         <div className="animate-in fade-in slide-in-from-right-4 duration-500 w-full flex flex-col gap-3">
           <FormGroup title="Signal Warnings (Clipping)">
             <Toggle 
               label="Low Signal Warning"
               description="Highlights completely crushed shadows (pitch black areas)."
               checked={lowSignalWarning}
               onChange={setLowSignalWarning}
               colorElement={
                 <input
                   type="color"
                   value={lowSignalHex}
                   onChange={e => setLowSignalHex(e.target.value)}
                   disabled={!lowSignalWarning}
                   className={`w-10 h-10 rounded-xl cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0.5 [&::-webkit-color-swatch]:border-none [&::-webkit-color-swatch]:rounded-[9px] shadow-sm transition-opacity border border-neutral-200 dark:border-neutral-700 ${!lowSignalWarning ? 'opacity-50 cursor-not-allowed' : ''}`}
                 />
               }
             />
             <Toggle 
               label="High Signal Warning"
               description="Highlights completely blown-out highlights (pure white areas)."
               checked={highSignalWarning}
               onChange={setHighSignalWarning}
               colorElement={
                 <input
                   type="color"
                   value={highSignalHex}
                   onChange={e => setHighSignalHex(e.target.value)}
                   disabled={!highSignalWarning}
                   className={`w-10 h-10 rounded-xl cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0.5 [&::-webkit-color-swatch]:border-none [&::-webkit-color-swatch]:rounded-[9px] shadow-sm transition-opacity border border-neutral-200 dark:border-neutral-700 ${!highSignalWarning ? 'opacity-50 cursor-not-allowed' : ''}`}
                 />
               }
             />
           </FormGroup>
 
           <FormGroup title="Base Image Rendering">
             <Toggle 
               label="Black & White Background"
               description="Makes the underlying video black and white, so your colored exposure bands stand out clearly."
               checked={monochrome}
               onChange={setMonochrome}
             />
             <Toggle 
               label="Solid Colors Only (Fill Mode)"
               description="Hides the video completely and only shows solid colors for every part of the image, based on your exposure settings."
               checked={fillMode}
               onChange={setFillMode}
             />
             <Toggle 
               label="Legal Range Output"
               description="Encodes for broadcast video (codes 64-940). Leave disabled for standard full data range (codes 0-1023)."
               checked={legalRange}
               onChange={setLegalRange}
             />
           </FormGroup>
         </div>
      );
      case 7: return (
         <div className="animate-in fade-in slide-in-from-right-4 duration-500 w-full flex flex-col gap-3">
           <FormGroup>
             <div className="py-5">
               <label className="text-[12px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest block mb-3 ml-1">Output Filename</label>
               <div className="relative flex items-center">
                 <input
                   type="text"
                   value={output.replace('.cube', '')}
                   onChange={e => setOutput(e.target.value)}
                   className="w-full bg-neutral-100/50 dark:bg-neutral-800/50 border border-neutral-200/50 dark:border-neutral-700/50 rounded-2xl px-5 py-4 text-[17px] font-semibold text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow pr-20"
                   placeholder="my_lut"
                 />
                 <span className="absolute right-5 text-[17px] font-semibold text-neutral-400 pointer-events-none">.cube</span>
               </div>
             </div>
           </FormGroup>

           <div className="mt-3 flex flex-col gap-5">
             <button 
               onClick={downloadCubeFile}
               className="w-full flex justify-center items-center gap-3 bg-blue-500 hover:bg-blue-400 text-white font-semibold text-[17px] px-8 py-5 rounded-[1.5rem] transition-all shadow-[0_8px_20px_0_rgba(59,130,246,0.4)] hover:shadow-[0_12px_28px_rgba(59,130,246,0.3)] active:scale-[0.98]"
             >
               <Download className="w-6 h-6" />
                 Download .cube File
               </button>
               
               <div className="mt-6 pt-6 border-t border-neutral-200/50 dark:border-neutral-800/50">
                 <button 
                   onClick={() => setShowPreview(!showPreview)}
                   className="w-full flex justify-between items-center px-5 py-4 text-[15px] font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors rounded-2xl hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50"
                 >
                   <span className="flex items-center gap-3"><Code className="w-5 h-5" /> Advanced Settings (For Developers)</span>
                   <span>{showPreview ? 'Hide' : 'Show'}</span>
                 </button>
                 
                 {showPreview && (
                   <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                     <div className="bg-[#1C1C1E] rounded-3xl overflow-hidden border border-neutral-800 shadow-inner">
                       <div className="px-6 py-4 bg-[#2C2C2E] flex justify-between items-center border-b border-neutral-800">
                         <span className="text-[13px] font-mono text-neutral-300">setup.json</span>
                         <button onClick={downloadJson} className="text-[13px] font-semibold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1.5 bg-blue-500/10 px-3 py-1.5 rounded-lg">
                           <Download className="w-4 h-4" /> Save JSON
                         </button>
                       </div>
                       <pre className="p-6 text-[13px] font-mono text-blue-300 overflow-x-auto leading-relaxed max-h-64">
                         {jsonString}
                       </pre>
                     </div>
                   </div>
                 )}
               </div>
             </div>
         </div>
      );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-black text-neutral-900 dark:text-neutral-100 font-sans selection:bg-blue-500/30 transition-colors duration-500 relative overflow-hidden flex flex-col">
      {/* Ambient Background Blur for Modern Vibe */}
      <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-blue-400/20 dark:bg-blue-600/20 blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-screen" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-purple-400/20 dark:bg-purple-600/20 blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-screen" />

      {/* Header */}
      <header className="px-6 py-3 sm:py-4 flex items-center justify-between relative z-10 w-full max-w-5xl mx-auto border-b border-neutral-200/50 dark:border-neutral-800/50">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500 text-white p-2 rounded-xl shadow-md shadow-blue-500/30">
            <Palette className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-[17px] font-display font-bold tracking-tight leading-tight">Exposure-Guide.Cube</h1>
            <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-widest leading-tight mt-0.5">LUT Builder</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowDocumentation(true)}
            className="text-[13px] font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors hidden sm:block cursor-pointer"
          >
            Documentation
          </button>
          <div className="flex bg-white/60 dark:bg-[#1C1C1E]/60 backdrop-blur-xl p-1 rounded-xl border border-white/40 dark:border-neutral-800 shadow-[0_2px_10px_rgb(0,0,0,0.05)] dark:shadow-none">
            <button
              onClick={() => setTheme('light')}
              className={`cursor-pointer p-2.5 rounded-xl transition-all duration-300 ${theme === 'light' ? 'bg-white dark:bg-neutral-800 shadow-[0_2px_10px_rgba(0,0,0,0.08)] text-blue-500' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'}`}
              title="Light Mode"
            >
              <Sun className="w-5 h-5" />
            </button>
            <button
              onClick={() => setTheme('system')}
              className={`cursor-pointer p-2.5 rounded-xl transition-all duration-300 ${theme === 'system' ? 'bg-white dark:bg-neutral-800 shadow-[0_2px_10px_rgba(0,0,0,0.08)] text-blue-500' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'}`}
              title="System Theme"
            >
              <Monitor className="w-5 h-5" />
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`cursor-pointer p-2.5 rounded-xl transition-all duration-300 ${theme === 'dark' ? 'bg-white dark:bg-neutral-800 shadow-[0_2px_10px_rgba(0,0,0,0.08)] text-blue-500' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'}`}
              title="Dark Mode"
            >
              <Moon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Wizard Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 relative z-10 w-full max-w-2xl mx-auto pb-12">
         {/* Wizard Header */}
         <div className="w-full flex flex-col items-center text-center mb-8">
           <h2 className="text-2xl sm:text-3xl font-display font-bold mb-2 sm:mb-3">{stepInfo[currentStep - 1].title}</h2>
           <p className="text-[15px] sm:text-[16px] text-neutral-500 dark:text-neutral-400 mb-6 max-w-lg">
             {stepInfo[currentStep - 1].desc}
           </p>
           
           {/* Step Indicator */}
           <div className="w-full max-w-md flex justify-center gap-2">
             {Array.from({ length: totalSteps }).map((_, i) => (
               <div
                 key={i}
                 className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i + 1 <= currentStep ? 'bg-blue-500' : 'bg-neutral-200 dark:bg-neutral-800'}`}
               />
             ))}
           </div>
         </div>

         {/* Wizard Card */}
         <div className="w-full bg-white/70 dark:bg-[#1C1C1E]/70 backdrop-blur-3xl border border-white/50 dark:border-white/10 shadow-[0_20px_60px_rgb(0,0,0,0.06)] dark:shadow-[0_20px_60px_rgb(0,0,0,0.4)] rounded-[2.5rem] p-6 sm:p-8 md:p-10 relative overflow-hidden">
            
            <div className="flex flex-col">
              {renderStep()}
            </div>

            {/* Footer Navigation */}
            <div className="mt-8 pt-6 border-t border-neutral-200/50 dark:border-neutral-800/50 flex items-center justify-between">
              <button
                onClick={prevStep}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-[16px] transition-all duration-200 cursor-pointer ${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50'}`}
              >
                <ArrowLeft className="w-5 h-5" /> Back
              </button>
              {currentStep < totalSteps && (
                <button
                  onClick={nextStep}
                  className="flex items-center gap-2 px-8 py-3 rounded-2xl font-semibold text-[16px] text-white bg-blue-500 hover:bg-blue-400 transition-all duration-200 shadow-[0_8px_20px_0_rgba(59,130,246,0.3)] hover:shadow-[0_12px_28px_rgba(59,130,246,0.25)] active:scale-[0.98] cursor-pointer"
                >
                  Next <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </div>
         </div>
      </main>

      {/* Documentation Modal */}
      {showDocumentation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1C1C1E] w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden border border-neutral-200/50 dark:border-neutral-800/50 flex flex-col max-h-[90vh]">
            <div className="px-6 py-5 border-b border-neutral-200/50 dark:border-neutral-800/50 flex justify-between items-center bg-neutral-50/50 dark:bg-black/20">
              <h3 className="font-display font-bold text-lg">About Exposure-Guide.Cube</h3>
              <button 
                onClick={() => setShowDocumentation(false)}
                className="p-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex flex-col gap-5 text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-300">
              <p>
                This application helps you generate false color exposure LUTs for professional cinema cameras.
              </p>
              
              <div className="bg-blue-50 dark:bg-blue-500/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-500/20">
                <p className="font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4" /> Acknowledgments
                </p>
                <p className="text-[14px]">
                  The core logic and math behind these LUTs was created by <strong>Alpha Bravo Media</strong>. The original tool was a script without a user interface. 
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-500/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-500/20">
                <p className="font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4" /> How to use it?
                </p>
                <p className="text-[14px]">
                  Want to learn how to load these LUTs on your camera (Sony, Panasonic) or editing software?
                </p>
                <a
                  href="https://github.com/SMOSTORY/Exposure-Guide.Cube#how-to-use-the-lut-cube-file"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-[13px] font-semibold transition-colors cursor-pointer"
                >
                  Click here for more information
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <div className="flex flex-col gap-3">
                <a 
                  href="https://github.com/SMOSTORY/Exposure-Guide.Cube" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors group cursor-pointer"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">This UI Repository</span>
                    <span className="text-[13px] text-neutral-500">github.com/SMOSTORY/Exposure-Guide.Cube</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-blue-500 transition-colors" />
                </a>

                <a 
                  href="https://github.com/Today20092/lut_builder" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors group cursor-pointer"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">Original Core Script</span>
                    <span className="text-[13px] text-neutral-500">github.com/Today20092/lut_builder</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-blue-500 transition-colors" />
                </a>

                <a 
                  href="https://www.youtube.com/watch?v=fwnOEfC48HU" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors group cursor-pointer"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">YouTube Video</span>
                    <span className="text-[13px] text-neutral-500">Free False Color LUT Builder by Alpha Bravo Media</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-blue-500 transition-colors" />
                </a>
              </div>
              
              <p className="text-[13px] text-neutral-500 text-center mt-2">
                This UI was built with the help of Gemini.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
