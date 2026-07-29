import { LutSetup } from './types';

function hexToRgb(hex: string) {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  const num = parseInt(hex, 16);
  return {
    r: ((num >> 16) & 255) / 255,
    g: ((num >> 8) & 255) / 255,
    b: (num & 255) / 255
  };
}

export function generateCubeLut(setup: LutSetup): string {
  const size = setup.cube_size;
  let lut = `TITLE "LUT Builder - ${setup.profile}"\n`;
  lut += `LUT_3D_SIZE ${size}\n\n`;

  // Pre-process bands and warnings
  const parsedBands = setup.bands.map(b => ({
    val: b.ire !== undefined ? b.ire : (b.stop || 0),
    width: b.width,
    color: hexToRgb(b.color)
  })).sort((a, b) => a.val - b.val);

  const lowWarningColor = hexToRgb(setup.low_signal_hex);
  const highWarningColor = hexToRgb(setup.high_signal_hex);

  // Note: This is an approximated client-side generator. 
  // It uses a generic Rec709 luminance mapping for demonstration.
  // The official python CLI uses precise camera OETFs and gamut matrices.
  
  for (let b = 0; b < size; b++) {
    for (let g = 0; g < size; g++) {
      for (let r = 0; r < size; r++) {
        // Input RGB values
        const inR = r / (size - 1);
        const inG = g / (size - 1);
        const inB = b / (size - 1);

        // Very simplified relative luminance calculation
        let y = inR * 0.2126 + inG * 0.7152 + inB * 0.0722;
        
        let outR = inR;
        let outG = inG;
        let outB = inB;

        if (setup.monochrome) {
            outR = y; 
            outG = y; 
            outB = y;
        }
        
        // Approximate exposure metric depending on mode
        let value = 0;
        if (setup.band_mode === 'ire') {
            value = y * 100;
        } else {
            // Very rough stop approximation from linear light
            // Assuming y is somewhat linear or log, we just map it loosely
            // For a real match, we'd need exact log decoders.
            value = Math.log2(Math.max(y, 0.001) / 0.18);
        }

        let matched = false;
        
        // High Warning priority
        if (setup.high_signal_warning && Math.max(inR, inG, inB) >= 0.95) {
            outR = highWarningColor.r; 
            outG = highWarningColor.g; 
            outB = highWarningColor.b;
            matched = true;
        } 
        // Low Warning priority
        else if (setup.low_signal_warning && Math.min(inR, inG, inB) <= 0.05) {
            outR = lowWarningColor.r; 
            outG = lowWarningColor.g; 
            outB = lowWarningColor.b;
            matched = true;
        }
        
        if (!matched && parsedBands.length > 0) {
            // Apply fill mode or check bands
            if (setup.fill_mode) {
                 let nearest = parsedBands[0];
                 let minDiff = Infinity;
                 for (const band of parsedBands) {
                     const diff = Math.abs(value - band.val);
                     if (diff < minDiff) {
                         minDiff = diff;
                         nearest = band;
                     }
                 }
                 outR = nearest.color.r;
                 outG = nearest.color.g;
                 outB = nearest.color.b;
                 matched = true;
            } else {
                 // Iterate from top to bottom (later bands win where overlapping, so we can just reverse, or find the last matching)
                 for (let i = parsedBands.length - 1; i >= 0; i--) {
                    const band = parsedBands[i];
                    if (Math.abs(value - band.val) <= (band.width / 2)) {
                        outR = band.color.r;
                        outG = band.color.g;
                        outB = band.color.b;
                        matched = true;
                        break;
                    }
                 }
            }
        }
        
        // Output formatting: RGB on one line separated by spaces
        lut += `${outR.toFixed(6)} ${outG.toFixed(6)} ${outB.toFixed(6)}\n`;
      }
    }
  }

  return lut;
}
