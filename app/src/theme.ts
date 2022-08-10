import { RecursivePartial } from '@kibalabs/core';
import { buildTheme, ITheme, mergeThemePartial } from '@kibalabs/ui-react';

export const buildProjectTheme = (projectId: string): ITheme => {
  const overrideTheme = buildOverrideTheme();
  if (projectId === 'sprites') {
    return buildTheme(mergeThemePartial(overrideTheme, {
      colors: {
        brandPrimary: '#ffffff',
        background: 'rgb(220,137,117)',
        text: '#ffffff',
        spriteGreen: 'rgb(89,190,144)',
        spritePink: 'rgb(211,163,181)',
        spriteOrange: 'rgb(220,137,117)',
        textInverse: '#222222',
      },
      alternateColors: {
        dialog: {
          background: '#ffffff',
          text: '#222222',
          brandPrimary: 'rgb(89,190,144)',
        },
      },
      dimensions: {
        borderRadius: '1em',
      },
      fonts: {
        main: {
          url: 'https://fonts.googleapis.com/css2?family=Kodchasan:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;1,200;1,300;1,400;1,500;1,600;1,700&display=swap',
        },
      },
      texts: {
        default: {
          'font-family': "'Kodchasan', sans-serif",
          'font-weight': '500',
        },
      },
      buttons: {
        default: {
          normal: {
            default: {
              background: {
                'border-radius': '2em',
              },
            },
          },
        },
      },
      // inputWrappers: {
      //   default: {
      //     normal: {
      //       default: {
      //         background: {
      //           'background-color': 'rgba(255, 255, 255, 0.3)',
      //           'border-color': 'rgba(255, 255, 255, 0.4)',
      //         },
      //       },
      //     },
      //   },
      // },
      boxes: {
        tokenCard: {
          'border-width': '2px',
          'border-color': 'rgba(255, 255, 255, 0.2)',
          'background-color': 'rgba(255, 255, 255, 0.1)',
        },
      },
      dividers: {
        default: {
          color: 'white',
        },
      },
    }));
  }
  if (projectId === 'pepes') {
    return buildTheme(mergeThemePartial(overrideTheme, {
      colors: {
        background: '#606455',
      },
      dimensions: {
        borderRadius: '0.25em',
      },
      boxes: {
        tokenCard: {
          'border-width': '2px',
          'border-color': 'rgba(255, 255, 255, 0.2)',
          'background-color': 'rgba(255, 255, 255, 0.1)',
        },
      },
      texts: {
        default: {
          'font-family': "'RevMiniPixel-Regular', monospace",
          'font-weight': '500',
        },
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
          url: 'https://fonts.googleapis.com/css2?family=Sunshiney&display=swap',
        },
      },
      texts: {
        default: {
          'font-family': "'Sunshiney', sans-serif",
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
      backdrop: 'rgba(0, 0, 0, 0.3)',
      inputWrapperBackground: 'rgba(255, 255, 255, 0.1)',
      inputWrapperBorder: 'rgba(255, 255, 255, 0.1)',
    },
    alternateColors: {
      dialog: {
        inputWrapperBackground: 'rgba(0, 0, 0, 0.1)',
        inputWrapperBorder: 'rgba(0, 0, 0, 0.1)',
      },
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
      tokenCardName: {
        'font-size': '0.8em',
        'font-weight': '600',
      },
      tokenCardValue: {
        'font-size': '0.8em',
        'line-height': '1em',
      },
      footer: {},
      dark: {
        color: '$colors.textInverse',
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
      filterOverlay: {
        'background-color': '$colors.backgroundClear10',
        'backdrop-filter': 'blur(3px)',
        'border-radius': '1em 1em 0 0',
      },
      backdrop: {
        'border-radius': '0',
        'background-color': '$colors.backdrop',
      },
      tokenCard: {
      },
      unrounded: {
        'border-radius': '0',
      },
      footer: {
        'background-color': '$colors.backgroundClear25',
        'border-color': '$colors.backgroundClear05',
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
              'background-color': '$colors.inputWrapperBackground',
              'border-color': '$colors.inputWrapperBorder',
              'border-width': '2px',
            },
          },
        },
      },
      error: {
        normal: {
          default: {
            background: {
              'background-color': '$colors.inputWrapperBackground',
              'border-color': '$colors.errorClear50',
            },
          },
        },
      },
    },
    titledCollapsibleBoxes: {
      default: {
        normal: {
          default: {
            background: {
              'border-color': '$colors.inputWrapperBorder',
              'border-width': '2px',
            },
            headerBackground: {
              'background-color': '$colors.inputWrapperBackground',
            },
          },
        },
      },
    },
    links: {
      note: {
        normal: {
          default: {
            text: {
              'font-size': baseTheme.texts.note['font-size'],
            },
          },
        },
      },
      small: {
        normal: {
          default: {
            text: {
              'font-size': baseTheme.texts.small['font-size'],
            },
          },
        },
      },
      secondary: {
        normal: {
          default: {
            text: {
              color: baseTheme.texts.default.color,
            },
          },
        },
      },
    },
    images: {
      unrounded: {
        background: {
          'border-radius': '0',
        },
      },
    },
    buttons: {
      narrow: {
        normal: {
          default: {
            background: {
              padding: `${baseTheme.dimensions.paddingNarrow2} ${baseTheme.dimensions.padding}`,
              'border-width': '0',
            },
          },
        },
      },
      unrounded: {
        normal: {
          default: {
            background: {
              'border-radius': '0',
            },
          },
        },
      },
    },
  };
};
