// import React from 'react';

// import { Alignment, Button, Checkbox, defaultComponentProps, Direction, IComponentProps, IMoleculeProps, IOption, ITitledCollapsibleBoxTheme, OptionSelect, PaddingSize, SingleLineInput, Spacing, Stack, StatefulTitledCollapsibleBox, Text, TitledCollapsibleBox } from '@kibalabs/ui-react';
// import { ISingleAnyChildProps } from '@kibalabs/core-react';
// import { getClassName } from '@kibalabs/core';


// interface IOptionSelectTitledCollapsibleBoxTheme extends ITitledCollapsibleBoxTheme {

// }

// interface IOptionSelectTitledCollapsibleBoxProps extends IComponentProps<IOptionSelectTitledCollapsibleBoxTheme>, ISingleAnyChildProps {
//   options: IOption[];
//   selectedItemKey?: string;
//   isDisabled?:boolean;
//   openIconId?: string;
//   messageText?: string;
//   placeholderText?: string;
//   isCollapsed: boolean;
//   onCollapseToggled(): void;
//   onItemSelected(itemKey: string);
// }

// NOTE(krishan711): the goal here is to create an option select thats within a collapsible box (so it looks nice in the FilterView)
// export const OptionSelectTitledCollapsibleBox = (props: IOptionSelectTitledCollapsibleBoxProps): React.ReactElement => {
//   const chosenOption = props.options.find((option: IOption): boolean => option.itemKey === props.selectedItemKey);

//   return (
//     <TitledCollapsibleBox
//       title={chosenOption ? chosenOption.text : (props.placeholderText ?? 'Choose')}
//       isCollapsed={props.isCollapsed}
//       onCollapseToggled={props.onCollapseToggled}
//     >
//       <Stack direction={Direction.Vertical} shouldAddGutters={true}>

//       </Stack>
//     </TitledCollapsibleBox>
//   );
// }
// OptionSelectTitledCollapsibleBox.displayName = 'OptionSelectTitledCollapsibleBox';
// OptionSelectTitledCollapsibleBox.defaultProps = {
//   ...defaultComponentProps,
// };


// interface IStatefulOptionSelectTitledCollapsibleBoxProps extends IComponentProps<IOptionSelectTitledCollapsibleBoxTheme>, ISingleAnyChildProps {
//   isCollapsedInitially?: boolean;
//   onItemSelected(itemKey: string);
// }

// export const StatefulOptionSelectTitledCollapsibleBox = (props: IStatefulOptionSelectTitledCollapsibleBoxProps): React.ReactElement => {
//   const [isCollapsed, setIsCollapsed] = React.useState(!!props.isCollapsedInitially);
//   const onCollapseToggled = (): void => {
//     setIsCollapsed(!isCollapsed);
//   };

//   return (
//     <OptionSelectTitledCollapsibleBox
//       id={props.id}
//       className={getClassName(StatefulOptionSelectTitledCollapsibleBox.displayName, props.className)}
//       theme={props.theme}
//       variant={props.variant}
//       isCollapsed={isCollapsed}
//       onCollapseToggled={onCollapseToggled}
//     >
//       {props.children}
//     </OptionSelectTitledCollapsibleBox>
//   );
// };

// StatefulOptionSelectTitledCollapsibleBox.displayName = 'StatefulOptionSelectTitledCollapsibleBox';
// StatefulOptionSelectTitledCollapsibleBox.defaultProps = {
//   ...defaultComponentProps,
// };
