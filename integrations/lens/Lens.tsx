import {
  Box,
  CommandHandlerProps,
  Detail,
  Group,
  Stack,
  Avatar,
  Text,
} from "@/sdk";
import { useEffect, useState } from "react";
import icon from "./icon.png";
import IconHeader from "@/sdk/templates/IconHeader";
import DetailsGrid from "@/sdk/templates/DetailsGrid";
import { ProfileFragment } from "@lens-protocol/client";
import LensClient, {
  Profile,
} from "@lens-protocol/client/dist/declarations/src";

interface LensProfileProps extends CommandHandlerProps {
  query: string;
  client: LensClient;
}

const LensProfile: React.FC<LensProfileProps> = ({ client, query }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [profile, setProfile] = useState<ProfileFragment | null>(null);

  useEffect(() => {
    if (!query) return;

    setIsLoading(true);
    setIsError(false);
    let active = true;

    async function getProfile() {
      const result = await client.profile.fetch({ handle: query });
      if (!result) return;

      if (active) {
        !result ? setIsError(true) : setProfile(result);
        setIsLoading(false);
      }
    }

    getProfile();

    return () => {
      active = false;
      setIsLoading(false);
      setIsError(false);
    };
  }, [query, client.profile]);
  if (!profile) return null;
  return (
    <Detail isPending={isLoading} isError={isError}>
      <Stack spacing="lg" m="md">
        <IconHeader
          title={profile?.handle}
          subtitle={profile.bio}
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
