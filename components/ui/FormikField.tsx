import { useField, useFormikContext } from "formik";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/use-theme-color";

export type FormikFieldProps = TextInputProps & {
  name: string;
  onChangeText?: (text: string) => void;
};

export function FormikField({
  name,
  style,
  onChangeText,
  ...props
}: FormikFieldProps) {
  const [field, meta] = useField(name);
  const { setFieldValue, setFieldTouched } = useFormikContext();
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const borderColor = useThemeColor({ light: "#E0E0E0", dark: "#333" }, "text");
  const placeholderColor = useThemeColor(
    { light: "#999", dark: "#666" },
    "icon"
  );

  const hasError = meta.touched && meta.error;

  const handleChangeText = (text: string) => {
    setFieldValue(name, text, false);
    onChangeText?.(text);
  };

  const handleBlur = () => {
    setFieldTouched(name, true, true);
  };

  return (
    <View>
      <TextInput
        {...props}
        style={[
          styles.input,
          { color: textColor, borderColor, backgroundColor },
          hasError && styles.inputError,
          style,
        ]}
        value={field.value}
        onChangeText={handleChangeText}
        onBlur={handleBlur}
        placeholderTextColor={placeholderColor}
      />
      {hasError && (
        <ThemedText style={styles.fieldError}>{meta.error}</ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    minHeight: 50,
  },
  inputError: {
    borderColor: "#ef4444",
  },
  fieldError: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: -12,
    marginBottom: 4,
  },
});
