import { View as RNView, type ViewProps as RNViewProps } from 'react-native';

export type ViewProps = RNViewProps;

export function View({ style, className, ...otherProps }: ViewProps) {
  return (
    <RNView 
      className={`${className || ""}`}
      style={style} 
      {...otherProps} 
    />
  );
}
