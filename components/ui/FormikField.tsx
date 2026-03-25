import { useField, useFormikContext } from "formik";
import { type TextInputProps } from "react-native";
import { Input } from "heroui-native";
import { Text } from "./Text";
import { View } from "./View";

export type FormikFieldProps = TextInputProps & {
  name: string;
  label?: string;
  onChangeText?: (text: string) => void;
};

export function FormikField({
  name,
  label,
  style,
  className,
  onChangeText,
  ...props
}: FormikFieldProps) {
  const [field, meta] = useField(name);
  const { setFieldValue, setFieldTouched } = useFormikContext();

  const hasError = !!(meta.touched && meta.error);

  const handleChangeText = (text: string) => {
    setFieldValue(name, text, false);
    onChangeText?.(text);
  };

  const handleBlur = () => {
    setFieldTouched(name, true, true);
  };

  return (
    <View className="gap-1.5">
      {label && (
        <Text className="text-sm font-semibold opacity-70 ml-1">
          {label}
        </Text>
      )}
      <Input
        {...props}
        isInvalid={hasError}
        className={className}
        style={style}
        value={field.value}
        onChangeText={handleChangeText}
        onBlur={handleBlur}
      />
      {hasError && (
        <Text className="text-danger text-xs ml-1">
          {meta.error}
        </Text>
      )}
    </View>
  );
}
