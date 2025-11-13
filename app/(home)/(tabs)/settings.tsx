import { formatDate } from "@/utils/formatting";
import { useUser } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { SignOutButton } from "../../../components/SignOutButton";

import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function SettingsScreen() {
  const { user, isLoaded } = useUser();
  const [isUpdating, setIsUpdating] = useState(false);

  const pickImage = async () => {
    if (!isLoaded || !user) return;

    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        // TODO: Add an error message to the user to tell them that gallery access is required
        return;
      }

      const ImagePickerresult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!ImagePickerresult.canceled && ImagePickerresult.assets[0]) {
        setIsUpdating(true);

        const asset = ImagePickerresult.assets[0];

        const fileObject = {
          uri: asset.uri,
          name: asset.fileName || "profile-image.jpg",
          type: asset.mimeType || "image/jpeg",
        };

        await user.setProfileImage({
          file: fileObject as unknown as string | Blob | File | null,
        });

        await user.reload();

        console.log("Profile image updated successfully");
        // TODO: Add a success message to the user
      }
    } catch (error) {
      console.error("Error updating profile image:", error);
      // TODO: Add an error message to the user
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAvatarPress = () => {
    if (!isLoaded || !user) return;
    pickImage();
  };

  if (!isLoaded || !user) {
    return null; // Or a loading spinner
  }

  const primaryEmail = user.primaryEmailAddress?.emailAddress;
  const allEmails = user.emailAddresses || [];

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#197ea3", dark: "#0A7EA4" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#90e0ef"
          name="gearshape"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Settings</ThemedText>
      </ThemedView>

      <ThemedView style={styles.settingsContainer}>
        <ThemedView style={styles.section}>
          <ThemedView style={styles.userInfoContainer}>
            <TouchableOpacity
              onPress={handleAvatarPress}
              disabled={isUpdating}
              activeOpacity={0.7}
            >
              <Image
                source={user?.imageUrl ? { uri: user.imageUrl } : undefined}
                style={[styles.avatar, isUpdating && styles.avatarUpdating]}
              />
            </TouchableOpacity>
            <ThemedView style={styles.userNameContainer}>
              {user.firstName || user.lastName ? (
                <ThemedText style={styles.userName}>
                  {[user.firstName, user.lastName].filter(Boolean).join(" ")}
                </ThemedText>
              ) : null}
              {user.username && (
                <ThemedText style={styles.username}>
                  @{user.username}
                </ThemedText>
              )}
              {primaryEmail && (
                <ThemedText style={styles.email}>{primaryEmail}</ThemedText>
              )}
            </ThemedView>
          </ThemedView>
        </ThemedView>

        {/* Account Information */}
        <ThemedView style={styles.section}>
          {allEmails.length > 0 && (
            <ThemedView style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Email Addresses</ThemedText>
              <ThemedView style={styles.infoValueContainer}>
                {allEmails.map((email, index) => (
                  <ThemedView key={email.id || index} style={styles.emailItem}>
                    <ThemedText style={styles.infoValue}>
                      {email.emailAddress}
                    </ThemedText>
                    <ThemedText
                      style={[
                        styles.verificationBadge,
                        email.verification?.status === "verified"
                          ? styles.verified
                          : styles.unverified,
                      ]}
                    >
                      {email.verification?.status === "verified"
                        ? "✓ Verified"
                        : "Unverified"}
                    </ThemedText>
                  </ThemedView>
                ))}
              </ThemedView>
            </ThemedView>
          )}

          <ThemedView style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Account Created</ThemedText>
            <ThemedText style={styles.infoValue}>
              {formatDate(user.createdAt)}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Actions
          </ThemedText>
          <ThemedView style={styles.buttonsContainer}>
            <Link href="/(home)/change-password" asChild>
              <ThemedButton>Change Password</ThemedButton>
            </Link>
            <Link href="/(home)/change-email" asChild>
              <ThemedButton>Change Email</ThemedButton>
            </Link>

            <Link href="/(home)/change-username" asChild>
              <ThemedButton>Change Username</ThemedButton>
            </Link>

            <Link href="/(home)/delete-account" asChild>
              <ThemedButton>Delete Account</ThemedButton>
            </Link>
            <SignOutButton />
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}

// Replace the styles object (lines 244-344) with:
const styles = StyleSheet.create({
  headerImage: {
    bottom: -100,
    left: -90,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  settingsContainer: {
    flexDirection: "column",
    gap: 18,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    marginBottom: 8,
    fontSize: 18,
    fontWeight: "600",
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    paddingVertical: 8,
  },
  userNameContainer: {
    flex: 1,
    gap: 4,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
  },
  username: {
    fontSize: 14,
    opacity: 0.7,
  },
  email: {
    fontSize: 14,
    opacity: 0.8,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  avatarUpdating: {
    opacity: 0.5,
  },
  infoRow: {
    flexDirection: "column",
    gap: 2,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(128, 128, 128, 0.2)",
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "600",
    opacity: 0.7,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
  },
  infoValueContainer: {
    gap: 8,
  },
  emailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  phoneItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  verificationBadge: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  verified: {
    backgroundColor: "rgba(34, 197, 94, 0.2)",
    color: "#22c55e",
  },
  unverified: {
    backgroundColor: "rgba(239, 68, 68, 0.2)",
    color: "#ef4444",
  },
  buttonsContainer: {
    gap: 20,
  },
});

// TODO: Add a way to delete the account
// TODO: Add a way to change username
// TODO: Manage SSO connections and remove them
