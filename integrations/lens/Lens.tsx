import { Box, CommandHandlerProps, Detail, Group, Stack, Text } from "@/sdk";
import { useEffect, useState } from "react";
import useSWR from "swr";
import icon from "./icon.png";
import IconHeader from "@/sdk/templates/IconHeader";
import { ProfileFragment } from "@lens-protocol/client";
import LensClient from "@lens-protocol/client/dist/declarations/src";

interface LensProfileProps extends CommandHandlerProps {
  query: string;
  client: LensClient;
}

const LensProfile: React.FC<LensProfileProps> = ({ client, query }) => {
  const {
    data: profile,
    isLoading,
    error,
  } = useSWR(`lens:get-lens-profile:${query}`, async () => {
    return client.profile.fetch({ handle: query });
  });

  return (
    <Detail isPending={isLoading} isError={!!error}>
      <Stack spacing="lg" m="md">
        <IconHeader
          title={profile?.handle}
          subtitle={profile?.bio}
          imageUrl={icon.src}
        />
        <Group spacing="md">
          <Box>
            <Text fw={700}>Followers:</Text>
            <Text fw={700}>Following:</Text>
            <Text fw={700}>Posts:</Text>
          </Box>
          <Box ta="right">
            <Text>{profile?.stats?.totalFollowers}</Text>
            <Text>{profile?.stats?.totalFollowing}</Text>
            <Text>{profile?.stats?.totalPosts}</Text>
          </Box>
        </Group>
      </Stack>
    </Detail>
  );
};

export default LensProfile;
