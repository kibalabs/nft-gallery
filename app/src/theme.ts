import { RecursivePartial } from '@kibalabs/core';
import { buildTheme, ITheme, mergeThemePartial } from '@kibalabs/ui-react';

export const buildProjectTheme = (projectId: string): ITheme => {
  const overrideTheme = buildOverrideTheme();
  if (projectId === 'sprites') {
    return buildTheme(mergeThemePartial(overrideTheme, {
      colors: {
        brandPrimary: 'rgb(119,187,149)',
        background: '#ffffff',
        text: '#111111',
      },
    }));
  }
  if (projectId === 'goblintown') {
    return buildTheme(mergeThemePartial(overrideTheme, {
      colors: {
        brandPrimary: 'rgb(245, 91, 32)',
        background: '#333',
      },
      fonts: {
        main: {
          // url: 'https://fonts.googleapis.com/css2?family=Square+Peg&display=swap',
          url: 'https://fonts.googleapis.com/css2?family=Sunshiney&display=swap',
        },
      },
      texts: {
        default: {
          // 'font-family': "'Square Peg', cursive, sans-serif",
          'font-family': "'Sunshiney', cursive, sans-serif",
          'font-size': '20px',
        },
        note: {
          'font-size': '0.8em',
        },
      },
    }));
  }
  return buildTheme(overrideTheme);
};

export const buildOverrideTheme = (): RecursivePartial<ITheme> => {
  const baseTheme = buildTheme();
  return {
    colors: {
      brandPrimary: '#B3C7F8',
      brandSecondary: '#2D86A3',
      background: '#000000',
    },
    fonts: {
      main: {
        url: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700&display=swap',
      },
    },
    texts: {
      default: {
        'font-family': "'Montserrat', sans-serif",
        'font-weight': '400',
      },
      note: {
        color: '$colors.textClear50',
      },
      header3: {
        'font-size': '1.5rem',
        'font-weight': '800',
      },
      wrapped: {
        'overflow-wrap': 'anywhere',
      },
    },
    prettyTexts: {
      header3: {
        normal: {
          default: {
            text: {
              margin: '2em 0 0.5em 0',
            },
          },
        },
      },
    },
    boxes: {
      notification: {
        'background-color': '$colors.brandPrimaryClear90',
        padding: `${baseTheme.dimensions.padding} ${baseTheme.dimensions.paddingWide2}`,
      },
      card: {
        margin: '0',
        padding: '0',
        'border-width': '0.20em',
        'border-color': '#363636',
      },
      wideBorder: {
        margin: '0',
        'box-shadow': '0px 0px 50px 20px rgba(255, 255, 255, 0.35) ',
      },
      dottedBorder: {
        margin: '0',
        'border-style': 'dashed',
        'border-width': '0.20em',
        'border-color': '#FFFFFF',
      },
      overlay: {
        'background-color': '$colors.backgroundClear10',
        'backdrop-filter': 'blur(3px)',
      },
    },
    pills: {
      default: {
        normal: {
          default: {
            background: {
              'background-color': 'transparent',
              'border-radius': '0.5em',
            },
          },
        },
      },
      info: {
        normal: {
          default: {
            background: {
              'border-color': '$colors.brandSecondary',
            },
            text: {
              color: '$colors.brandSecondary',
            },
          },
        },
      },
      small: {
        normal: {
          default: {
            text: {
              'font-size': '0.7em',
              'font-weight': '600',
            },
            background: {
              'border-width': '0.11em',
              padding: '0.1em 1em',
            },
          },
        },
      },
    },
    inputWrappers: {
      default: {
        normal: {
          default: {
            background: {
              'background-color': '$colors.backgroundDark05',
            },
          },
        },
      },
    },
  };
};
