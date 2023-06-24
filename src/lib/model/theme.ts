import { colord, extend } from 'colord';
import mixPlugin from 'colord/plugins/mix';

extend([mixPlugin]);

export type HSL = {
  h: number;
  s: number;
  l: number;
};

export type CSS = {
  p: HSL;
  pf: HSL;
  pc: HSL;
  s: HSL;
  sf: HSL;
  sc: HSL;
  a: HSL;
  af: HSL;
  ac: HSL;
  n: HSL;
  nf: HSL;
  nc: HSL;
  b1: HSL;
  b2: HSL;
  b3: HSL;
  bc: HSL;
  in: HSL;
  inc: HSL;
  su: HSL;
  suc: HSL;
  wa: HSL;
  wac: HSL;
  er: HSL;
  erc: HSL;
};

export type Theme = {
  name: string;
  id: number;
  colorScheme: 'light' | 'dark';
  css?: CSS;
};

function generateForegroundColorFrom(input: HSL, percentage = 0.8): HSL {
  const stringified = `hsl(${input.h}, ${input.s}%, ${input.l}%)`;
  const hsl = colord(stringified)
    .mix(colord(stringified).isDark() ? '#ffffff' : '#000000', percentage)
    .toHsl();
  console.debug('generateForegroundColorFrom', input, hsl);
  return hsl;
}

function generateDarkenColorFrom(input: HSL, percentage = 0.07): HSL {
  const stringified = `hsl(${input.h}, ${input.s}%, ${input.l}%)`;
  const hsl = colord(stringified).darken(percentage).toHsl();
  return hsl;
}

export function createTheme(
  name: string,
  colorScheme: 'light' | 'dark',
  css: Partial<CSS> & Pick<CSS, 'p' | 's' | 'a' | 'n' | 'b1'>
): Theme {
  return {
    name,
    id: Date.now(),
    colorScheme,
    css: {
      ...css,
      pf: css.pf ?? generateDarkenColorFrom(css.p),
      pc: css.pc ?? generateForegroundColorFrom(css.p),
      sf: css.sf ?? generateDarkenColorFrom(css.s),
      sc: css.sc ?? generateForegroundColorFrom(css.s),
      af: css.af ?? generateDarkenColorFrom(css.a),
      ac: css.ac ?? generateForegroundColorFrom(css.a),
      nf: css.nf ?? generateDarkenColorFrom(css.n),
      nc: css.nc ?? generateForegroundColorFrom(css.n),
      b2: css.b2 ?? generateDarkenColorFrom(css.b1),
      b3:
        css.b3 ??
        (css.b2
          ? generateDarkenColorFrom(css.b2)
          : generateDarkenColorFrom(css.b1, 0.14)),
      bc: css.bc ?? generateForegroundColorFrom(css.b1),
      in: css.in ?? {
        h: 198,
        s: 93,
        l: 60
      },
      inc:
        css.inc ??
        (css.in
          ? generateForegroundColorFrom(css.in)
          : {
              h: 198,
              s: 100,
              l: 12
            }),
      su: css.su ?? {
        h: 158,
        s: 64,
        l: 52
      },
      suc:
        css.suc ??
        (css.su
          ? generateForegroundColorFrom(css.su)
          : {
              h: 158,
              s: 100,
              l: 10
            }),
      wa: css.wa ?? {
        h: 43,
        s: 96,
        l: 56
      },
      wac:
        css.wac ??
        (css.wa
          ? generateForegroundColorFrom(css.wa)
          : {
              h: 43,
              s: 100,
              l: 11
            }),
      er: css.er ?? {
        h: 0,
        s: 91,
        l: 71
      },
      erc:
        css.erc ??
        (css.er
          ? generateForegroundColorFrom(css.er)
          : {
              h: 0,
              s: 100,
              l: 14
            })
    }
  };
}

export function toStyleString(css: CSS, colorScheme: 'light' | 'dark') {
  let cssStr = `color-scheme: ${colorScheme};`;
  for (const [key, value] of Object.entries(css)) {
    cssStr += `--${key}: ${getHSL(value)};`;
  }
  return cssStr;
}

export function getHSL(hsl: HSL) {
  return `${hsl.h} ${hsl.s}% ${hsl.l}%`;
}

export function hexToHSL(hex: string): HSL {
  return colord(hex).toHsl();
}

export function hslToHex(hsl: HSL): string {
  return colord(hsl).toHex();
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
