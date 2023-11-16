import {
  convertLabToLch,
  convertOkhslToOklab,
  convertRgbToOklab,
  formatHex,
  interpolate,
  okhsl,
  parseHex,
  rgb,
  wcagContrast,
  type Oklch
} from 'culori';

export type HSL = {
  h: number;
  s: number;
  l: number;
};

export type CSSInput = {
  p: Oklch;
  pf: Oklch;
  pc: Oklch;
  s: Oklch;
  sf: Oklch;
  sc: Oklch;
  a: Oklch;
  af: Oklch;
  ac: Oklch;
  n: Oklch;
  nf: Oklch;
  nc: Oklch;
  b1: Oklch;
  b2: Oklch;
  b3: Oklch;
  bc: Oklch;
  in: Oklch;
  inc: Oklch;
  su: Oklch;
  suc: Oklch;
  wa: Oklch;
  wac: Oklch;
  er: Oklch;
  erc: Oklch;
};

export type OKLCH = {
  l: number;
  c: number;
  h: number;
};

export type CSS = {
  p: OKLCH;
  pf: OKLCH;
  pc: OKLCH;
  s: OKLCH;
  sf: OKLCH;
  sc: OKLCH;
  a: OKLCH;
  af: OKLCH;
  ac: OKLCH;
  n: OKLCH;
  nf: OKLCH;
  nc: OKLCH;
  b1: OKLCH;
  b2: OKLCH;
  b3: OKLCH;
  bc: OKLCH;
  in: OKLCH;
  inc: OKLCH;
  su: OKLCH;
  suc: OKLCH;
  wa: OKLCH;
  wac: OKLCH;
  er: OKLCH;
  erc: OKLCH;
};

export type Theme = {
  name: string;
  id: number;
  colorScheme: 'light' | 'dark';
  css?: CSS;
};

function colorObjToString(input: OKLCH) {
  const cut = (num?: number) => {
    if (!num) {
      return 0;
    }
    return +num.toFixed(6);
  };
  const { l, c, h } = input;
  return `${cut(l)} ${cut(c)} ${cut(h)}`;
}

function generateForegroundColorFrom(input: Oklch, percentage = 0.8): OKLCH {
  const result = interpolate(
    [`oklch(${getOklch(input)})`, isDark(input) ? 'white' : 'black'],
    'oklch'
  )(percentage);
  return {
    l: result.l,
    c: result.c,
    h: result.h ?? 0
  };
}

function generateDarkenColorFrom(input: Oklch, percentage = 0.07): OKLCH {
  const result = interpolate(
    [`oklch(${getOklch(input)})`, 'black'],
    'oklch'
  )(percentage);
  return {
    l: result.l,
    c: result.c,
    h: result.h ?? 0
  };
}

function isDark(input: Oklch): boolean {
  return (
    wcagContrast(`oklch(${getOklch(input)})`, 'black') <
    wcagContrast(`oklch(${getOklch(input)})`, 'white')
  );
}

export function createTheme(
  name: string,
  css: Partial<CSSInput> & Pick<CSSInput, 'p' | 's' | 'a' | 'n' | 'b1'>
): Theme {
  return {
    name,
    id: Date.now(),
    colorScheme: isDark(css.b1) ? 'dark' : 'light',
    css: {
      p: OklchToOKLCH(css.p),
      s: OklchToOKLCH(css.s),
      a: OklchToOKLCH(css.a),
      n: OklchToOKLCH(css.n),
      b1: OklchToOKLCH(css.b1),
      pf: css.pf ? OklchToOKLCH(css.pf) : generateDarkenColorFrom(css.p),
      pc: css.pc ? OklchToOKLCH(css.pc) : generateForegroundColorFrom(css.p),
      sf: css.sf ? OklchToOKLCH(css.sf) : generateDarkenColorFrom(css.s),
      sc: css.sc ? OklchToOKLCH(css.sc) : generateForegroundColorFrom(css.s),
      af: css.af ? OklchToOKLCH(css.af) : generateDarkenColorFrom(css.a),
      ac: css.ac ? OklchToOKLCH(css.ac) : generateForegroundColorFrom(css.a),
      nf: css.nf ? OklchToOKLCH(css.nf) : generateDarkenColorFrom(css.n),
      nc: css.nc ? OklchToOKLCH(css.nc) : generateForegroundColorFrom(css.n),
      b2: css.b2 ? OklchToOKLCH(css.b2) : generateDarkenColorFrom(css.b1, 0.07),
      b3: css.b3
        ? OklchToOKLCH(css.b3)
        : css.b2
          ? generateDarkenColorFrom(css.b2, 0.07)
          : generateDarkenColorFrom(css.b1, 0.14),
      bc: css.bc ? OklchToOKLCH(css.bc) : generateForegroundColorFrom(css.b1),
      in: css.in
        ? OklchToOKLCH(css.in)
        : {
            l: 0.7206,
            c: 0.191,
            h: 231.6
          },
      inc: css.inc
        ? OklchToOKLCH(css.inc)
        : generateForegroundColorFrom(
            css.in ?? {
              mode: 'oklch',
              l: 0.7206,
              c: 0.191,
              h: 231.6
            }
          ),
      su: css.su
        ? OklchToOKLCH(css.su)
        : {
            l: 0.7441,
            c: 0.213,
            h: 164.75
          },
      suc: css.suc
        ? OklchToOKLCH(css.suc)
        : generateForegroundColorFrom(
            css.su ?? {
              mode: 'oklch',
              l: 0.7441,
              c: 0.213,
              h: 164.75
            }
          ),
      wa: css.wa
        ? OklchToOKLCH(css.wa)
        : {
            l: 0.8471,
            c: 0.199,
            h: 83.87
          },
      wac: css.wac
        ? OklchToOKLCH(css.wac)
        : generateForegroundColorFrom(
            css.wa ?? {
              mode: 'oklch',
              l: 0.8471,
              c: 0.199,
              h: 83.87
            }
          ),
      er: css.er
        ? OklchToOKLCH(css.er)
        : {
            l: 0.7176,
            c: 0.221,
            h: 22.18
          },
      erc: css.erc
        ? OklchToOKLCH(css.erc)
        : generateForegroundColorFrom(
            css.er ?? {
              mode: 'oklch',
              l: 0.7176,
              c: 0.221,
              h: 22.18
            }
          )
    }
  };
}

function OklchToOKLCH(input: Oklch): OKLCH {
  return {
    l: input.l,
    c: input.c,
    h: input.h ?? 0
  };
}

export function toStyleString(css: CSS, colorScheme: 'light' | 'dark') {
  let cssStr = `color-scheme: ${colorScheme};`;
  for (const [key, value] of Object.entries(css)) {
    cssStr += `--${key}: ${colorObjToString(value)};`;
  }
  return cssStr;
}

export function getHSL(hsl: HSL) {
  return `${hsl.h} ${hsl.s}% ${hsl.l}%`;
}

export function getOklch(oklch: Oklch) {
  return `${oklch.l} ${oklch.c} ${oklch.h ?? 0}`;
}

export function hexToOklch(hex: string): Oklch {
  return convertLabToLch(convertRgbToOklab(rgb(parseHex(hex))));
}

export function OKLCHToHex(input: OKLCH): string {
  return formatHex({ mode: 'oklch', ...input });
}

export function hslToOklch(hsl: HSL): Oklch {
  const okhslObj = okhsl(`hsl(${getHSL(hsl)})`);
  if (!okhslObj) {
    throw new Error('Invalid HSL');
  }
  return convertLabToLch(convertOkhslToOklab(okhslObj));
}

export function isHSL(input: unknown): input is HSL {
  return (
    typeof input === 'object' &&
    input !== null &&
    'h' in input &&
    's' in input &&
    'l' in input
  );
}

export function checkAndConvertTheme(theme: Theme): Theme {
  if (!theme.css) {
    return theme;
  }

  const newValue = Object.entries(theme.css).reduce(
    (acc, [key, value]) => {
      acc[key] = isHSL(value) ? OklchToOKLCH(hslToOklch(value)) : value;
      return acc;
    },
    {} as Record<string, OKLCH>
  );

  return { ...theme, css: newValue as Theme['css'] };
}

export function encodeName(name: string): string {
  return name.toLowerCase().replace(/ /g, '-');
}

export const defaultThemes: { [key: string]: Theme } = {
  light: {
    name: 'light',
    id: 0,
    colorScheme: 'light'
  },
  dark: {
    name: 'dark',
    id: 1,
    colorScheme: 'dark'
  },
  system: {
    name: 'system',
    id: 2,
    colorScheme: 'light'
  }
};

Object.freeze(defaultThemes);
