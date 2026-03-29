import React, { useState } from "react";
import { SignOutButton } from "@/components/SignOutButton";
import { Text } from "@/components/ui/Text";
import { View } from "@/components/ui/View";
import { formatDate } from "@/utils/formatting";
import { useUser } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import * as ImagePicker from "expo-image-picker";

import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/ui/Loading";
import { User } from "@/components/User";
import { T, useLocaleSelector, Var } from "gt-react-native";
import { Select } from "heroui-native";
import {
  AtSign,
  ChevronRight,
  FileText,
  Languages,
  Lock,
  LogOut,
  Shield,
  Trash2,
  UserRound,
} from "lucide-react-native";

const SettingsButton = React.forwardRef(({ icon: Icon, title, destructive, hideBorder, rightElement, ...props }: any, ref) => {
  return (
    <TouchableOpacity
      ref={ref as any}
      activeOpacity={0.7}
      className={`flex-row items-center justify-between py-5 px-6 bg-transparent ${hideBorder ? "" : "border-b border-foreground/5"}`}
      {...props}
    >
      <View className="flex-row items-center gap-4 bg-transparent">
        <View className="w-8 items-center bg-transparent">
          <Icon
            size={22}
            color={destructive ? "#ef4444" : "#666"}
          />
        </View>
        <T>
          <Text
            className={`text-base font-semibold ${destructive ? "text-danger" : "text-foreground"}`}
          >
            <Var>{title}</Var>
          </Text>
        </T>
      </View>
      <View className="flex-row items-center gap-2 bg-transparent">
        {rightElement}
        <ChevronRight size={18} color="#ccc" />
      </View>
    </TouchableOpacity>
  );
});
SettingsButton.displayName = "SettingsButton";

export default function SettingsScreen() {
  const { user, isLoaded } = useUser();
  const [isUpdating, setIsUpdating] = useState(false);
  const insets = useSafeAreaInsets();
  const { locale, locales, setLocale, getLocaleProperties } = useLocaleSelector();
  
  const currentLanguageLabel = React.useMemo(() => {
    if (!locale) return "";
    const props = getLocaleProperties(locale);
    return props?.nativeNameWithRegionCode || locale;
  }, [locale, getLocaleProperties]);

  const snapPoints = React.useMemo(() => ["40%"], []);

  const pickImage = async () => {
    if (!isLoaded || !user) return;

    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setIsUpdating(true);
        const asset = result.assets[0];
        const fileObject = {
          uri: asset.uri,
          name: asset.fileName || "profile-image.jpg",
          type: asset.mimeType || "image/jpeg",
        };

        await user.setProfileImage({
          file: fileObject as unknown as string | Blob | File | null,
        });

        await user.reload();
      }
    } catch (error) {
      console.error("Error updating profile image:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isLoaded || !user) {
    return <Loading fullScreen />;
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingBottom: 80,
          paddingTop: insets.top + 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 mb-10">
          <T>
            <Text className="text-4xl font-extrabold tracking-tight text-foreground leading-[48px]">
              Settings
            </Text>
          </T>
        </View>

        <View className="px-6 mb-10">
          <View className="bg-surface rounded-[40px] p-8 border border-foreground/5 items-center">
            <TouchableOpacity
              onPress={pickImage}
              disabled={isUpdating}
              className="mb-6"
            >
              <User
                imageUrl={user.imageUrl || undefined}
                username={undefined}
                avatarSize={100}
                variant="ghost"
              />
            </TouchableOpacity>

            <Text className="text-2xl font-bold text-foreground">
              <Var>{user.username || user.firstName || "User"}</Var>
            </Text>
            <Text className="text-foreground opacity-40 text-base mt-1">
              <Var>{user.primaryEmailAddress?.emailAddress}</Var>
            </Text>

            <View className="bg-foreground/5 h-px w-full my-8" />

            <View className="w-full flex-row justify-around bg-transparent">
              <View className="items-center bg-transparent">
                <T>
                  <Text className="text-[10px] font-bold opacity-30 uppercase tracking-[2px]">
                    Joined
                  </Text>
                </T>
                <Text className="text-base font-bold mt-1 text-foreground">
                  <Var>{formatDate(user.createdAt).split(",")[0]}</Var>
                </Text>
              </View>
              <View className="bg-foreground/10 w-[1px] h-10" />
              <View className="items-center bg-transparent">
                <T>
                  <Text className="text-[10px] font-bold opacity-30 uppercase tracking-[2px]">
                    Status
                  </Text>
                </T>
                <T>
                  <Text className="text-base font-bold mt-1 text-success">
                    Active
                  </Text>
                </T>
              </View>
            </View>
          </View>
        </View>

        <View className="gap-12">
          {/* General Preferences */}
          <View>
            <T>
              <Text className="text-[11px] font-bold opacity-30 uppercase tracking-[3px] ml-12 mb-4">
                General
              </Text>
            </T>
            <View className="bg-surface rounded-[32px] overflow-hidden border border-foreground/5 mx-6">
              <Select
                value={locale}
                onValueChange={(option: any) => {
                  const newLocale = typeof option === "string" ? option : option?.value;
                  if (newLocale) {
                    setLocale(newLocale);
                  }
                }}
                presentation="bottom-sheet"
              >
                <Select.Trigger asChild>
                  <SettingsButton
                    title="Language"
                    icon={Languages}
                    rightElement={
                      <Text className="text-foreground opacity-40 font-medium">
                        <Var>{currentLanguageLabel}</Var>
                      </Text>
                    }
                    hideBorder
                  />
                </Select.Trigger>
                <Select.Portal>
                  <Select.Overlay />
                  <Select.Content presentation="bottom-sheet" snapPoints={snapPoints}>
                    <Select.ListLabel>
                      <T>Select Language</T>
                    </Select.ListLabel>
                    {locales?.map((loc) => {
                      const props = getLocaleProperties(loc);
                      const label = props?.nativeNameWithRegionCode || loc;
                      return (
                        <Select.Item key={loc} value={loc} label={label}>
                          <Select.ItemLabel className="text-foreground">{label}</Select.ItemLabel>
                          <Select.ItemIndicator />
                        </Select.Item>
                      );
                    })}
                  </Select.Content>
                </Select.Portal>
              </Select>
            </View>
          </View>

          {/* Account Actions */}
          <View>
            <T>
              <Text className="text-[11px] font-bold opacity-30 uppercase tracking-[3px] ml-12 mb-4">
                Account
              </Text>
            </T>
            <View className="bg-surface rounded-[32px] overflow-hidden border border-foreground/5 mx-6">
              <Link href="/(home)/change-password" asChild>
                <SettingsButton title="Change Password" icon={Lock} />
              </Link>
              <Link href="/(home)/change-email" asChild>
                <SettingsButton title="Change Email" icon={AtSign} />
              </Link>
              <Link href="/(home)/change-username" asChild>
                <SettingsButton title="Change Username" icon={UserRound} />
              </Link>
              <Link href="/(home)/delete-account" asChild>
                <SettingsButton
                  title="Delete Account"
                  icon={Trash2}
                  destructive
                  hideBorder
                />
              </Link>
            </View>
          </View>

          {/* Legal Section */}
          <View>
            <T>
              <Text className="text-[11px] font-bold opacity-30 uppercase tracking-[3px] ml-12 mb-4">
                Legal
              </Text>
            </T>
            <View className="bg-surface rounded-[32px] overflow-hidden border border-foreground/5 mx-6">
              <Link href="/(home)/terms-and-conditions" asChild>
                <SettingsButton title="Terms of Use" icon={FileText} />
              </Link>
              <Link href="/(home)/privacy-policy" asChild>
                <SettingsButton title="Privacy Policy" icon={Shield} hideBorder />
              </Link>
            </View>
          </View>

          {/* Session */}
          <View className="px-6">
            <SignOutButton
              variant="primary"
              className="h-16 rounded-[24px] flex-row items-center justify-center gap-3 shadow-md shadow-accent/20"
            >
              <LogOut size={20} color="white" />
              <T>
                <Text className="text-base font-bold text-white">Log Out</Text>
              </T>
            </SignOutButton>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
