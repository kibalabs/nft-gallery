import { RecursivePartial } from '@kibalabs/core';
import { buildTheme, IBoxTheme, ITextTheme, ITheme, mergeTheme, mergeThemePartial } from '@kibalabs/ui-react';

// NOTE(krishan711): the ordering here is wrong cos buildOverrideTheme uses baseTheme many times
// but that doesn't take into account anything changed in this function.
export const buildProjectTheme = (projectId: string): ITheme => {
  const overrideTheme = buildOverrideTheme();
  if (projectId === 'sprites') {
    return buildTheme(mergeThemePartial(overrideTheme, {
      colors: {
        brandPrimary: '#ffffff',
        brandSecondary: 'rgb(89,190,144)',
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
          brandSecondary: '#ffffff',
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
      boxes: {
        tokenCard: {
          'border-width': '2px',
          'border-color': 'rgba(255, 255, 255, 0.2)',
          'background-color': 'rgba(255, 255, 255, 0.1)',
        },
        navBarScrolled: {
          'background-color': '$colors.spriteGreenClear20',
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
        brandSecondary: 'rgb(158, 143, 160)',
        background: '#333',
        tabSelectedBackground: 'rgba(245, 91, 32, 0.2)',
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
  if (projectId === 'mdtp') {
    return buildTheme(mergeThemePartial(overrideTheme, {
      dimensions: {
        borderRadius: '1px',
      },
    }));
  }
  if (projectId === 'rudeboys') {
    return buildTheme(mergeThemePartial(overrideTheme, {
      dimensions: {
        borderRadius: '1rem',
      },
      texts: {
        default: {
          'font-family': 'RudeText, sans-serif',
          'font-weight': '400',
        },
        header1: {
          'font-family': '"RudeScript", sans-serif',
          'font-weight': '500',
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
      tabSelectedBackground: 'rgba(255, 255, 255, 0.2)',
    },
    dimensions: {
      paddingInverseNarrow: '-0.25em',
      paddingInverse: '-0.5em',
      paddingInverseWide: '-1em',
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
    dividers: {
      default: {
        color: '$colors.tabSelectedBackground',
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
        'background-color': '$colors.backgroundClear05',
        'backdrop-filter': 'blur(4px)',
        'border-radius': '1em 1em 0 0',
      },
      backdrop: {
        'border-radius': '0',
        'background-color': '$colors.backdrop',
      },
      tokenCard: {
      },
      tokenCardQuantity: {
        'background-color': 'rgba(255, 255, 255, 0.05)',
      },
      unrounded: {
        'border-radius': '0',
      },
      footer: {
        'background-color': '$colors.backgroundClear25',
        'border-color': '$colors.backgroundClear05',
        'backdrop-filter': 'blur(3px)',
      },
      bordered: {
        'background-color': 'rgba(0, 0, 0, 0)',
        'border-width': baseTheme.dimensions.borderWidth,
        'border-color': 'rgba(255, 255, 255)',
      },
      borderedLight: {
        'background-color': 'rgba(0, 0, 0, 0)',
        'border-width': baseTheme.dimensions.borderWidth,
        'border-color': 'rgba(255, 255, 255, 0.4)',
      },
      memberToken: {
        'background-color': 'rgba(0, 0, 0, 0)',
        'border-width': baseTheme.dimensions.borderWidth,
        'border-color': '$colors.background',
      },
      badge: {
        'background-color': 'rgba(0, 0, 0, 0)',
        'border-width': baseTheme.dimensions.borderWidth,
        'border-color': '$colors.background',
      },
      badgeUnobtained: {
        opacity: '0.3',
      },
      unbordered: {
        'border-width': '0',
      },
      navBar: {
        position: 'sticky',
        top: '0',
        'background-color': 'transparent',
        'border-radius': '0',
        height: '3.4em',
        'transition-duration': '0.3s',
      },
      navBarScrolled: {
        'background-color': '$colors.backgroundClear20',
        'backdrop-filter': 'blur(4px)',
      },
      sideMenu: {
        position: 'sticky',
        // NOTE(krishan711): from navBar.height
        top: '3.4em',
      },
      sticky: {
        position: 'sticky',
        top: '0',
      },
    },
    tables: {
      default: {
        background: mergeTheme<IBoxTheme>(baseTheme.boxes.default, baseTheme.boxes.transparent, {
          'border-width': '0',
        }),
      },
    },
    tableCells: {
      default: {
        normal: {
          default: {
            background: mergeTheme<IBoxTheme>(baseTheme.boxes.default, baseTheme.boxes.transparent, {
              'border-radius': '0',
              'border-width': '1px 0px',
              'border-style': 'solid',
              'border-color': 'rgba(255, 255, 255, 0.2)',
              'background-color': 'rgba(255, 255, 255, 0)',
              padding: `${baseTheme.dimensions.padding} ${baseTheme.dimensions.paddingWide}`,
            }),
            text: mergeTheme<ITextTheme>(baseTheme.texts.default, {
            }),
          },
          hover: {
            background: {
              'background-color': 'rgba(255, 255, 255, 0.2)',
            },
          },
          press: {
            background: {
              'background-color': 'rgba(255, 255, 255, 0.3)',
            },
          },
          focus: {
            background: mergeThemePartial<IBoxTheme>(baseTheme.boxes.focussable, {
            }),
          },
        },
      },
      header: {
        normal: {
          default: {
            background: mergeTheme<IBoxTheme>(baseTheme.boxes.default, baseTheme.boxes.transparent, {
              'border-radius': '0',
              'border-width': '1px 0px',
              'border-style': 'solid',
              'border-color': 'rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.4) rgba(255, 255, 255, 0.2)',
              'background-color': 'rgba(255, 255, 255, 0.1)',
              padding: `${baseTheme.dimensions.padding} ${baseTheme.dimensions.paddingWide}`,
            }),
            text: mergeTheme<ITextTheme>(baseTheme.texts.default, {
            }),
          },
          hover: {
            background: {
              'background-color': 'rgba(255, 255, 255, 0.2)',
            },
          },
          press: {
            background: {
              'background-color': 'rgba(255, 255, 255, 0.3)',
            },
          },
          focus: {
            background: mergeThemePartial<IBoxTheme>(baseTheme.boxes.focussable, {
            }),
          },
        },
      },
    },
    tabBarItems: {
      default: {
        normal: {
          default: {
            background: {
              'border-width': '0',
              'border-radius': baseTheme.dimensions.borderRadius,
            },
          },
        },
        selected: {
          default: {
            background: {
              'border-width': '0',
              'background-color': '$colors.tabSelectedBackground',
            },
          },
        },
      },
      lined: {
        normal: {
          default: {
            background: {
              'border-radius': `${baseTheme.dimensions.borderRadius} ${baseTheme.dimensions.borderRadius} 0 0`,
              'border-width': '0 0 2px 0',
              'background-color': 'transparent',
            },
          },
        },
        selected: {
          default: {
            background: {
              'border-color': '$colors.brandPrimary',
              'border-width': '0 0 2px 0',
              'background-color': 'transparent',
            },
          },
        },
      },
      narrow: {
        normal: {
          default: {
            background: {
              padding: `${baseTheme.dimensions.paddingNarrow} ${baseTheme.dimensions.paddingWide}`,
            },
          },
        },
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
      smallPadding: {
        normal: {
          default: {
            background: {
              padding: `${baseTheme.dimensions.paddingNarrow} ${baseTheme.dimensions.padding}`,
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
      navBarSelected: {
        normal: {
          default: {
            background: {
              'background-color': '$colors.tabSelectedBackground',
            },
          },
        },
      },
      overlay: {
        normal: {
          default: {
            background: {
              'background-color': '$colors.backgroundClear20',
              'backdrop-filter': 'blur(4px)',
            },
          },
        },
      },
    },
    numberPagerItems: {
      default: {
        normal: {
          default: {
            background: mergeTheme(baseTheme.boxes.default, baseTheme.boxes.focusable, {
              padding: `${baseTheme.dimensions.paddingNarrow} ${baseTheme.dimensions.paddingNarrow}`,
              'background-color': 'transparent',
            }),
            text: mergeTheme(baseTheme.texts.default, {
            }),
          },
          hover: {
            background: {
              'background-color': '$colors.brandPrimaryClear90',
            },
          },
          press: {
            background: {
              'background-color': '$colors.brandPrimaryClear80',
            },
          },
          focus: {
            background: baseTheme.boxes.focussed,
          },
        },
        active: {
          default: {
            background: {
              'background-color': '$colors.tabSelectedBackground',
            },
          },
        },
        disabled: {
          default: {
            background: {
              // color: '$colors.disabledText',
              opacity: '0.2',
            },
          },
          hover: {
            background: {
              'background-color': 'transparent',
            },
          },
          press: {
            background: {
              'background-color': 'transparent',
            },
          },
          focus: {
            background: {
              'background-color': 'transparent',
              border: 'none',
            },
          },
        },
      },
    },
  };
};
