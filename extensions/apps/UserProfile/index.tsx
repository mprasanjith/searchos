import { App, Param } from "@/extensions/types";
import useSWR from "swr";

interface UserProfileProps {
  address: `0x${string}`;
}

const UserProfile: React.FC<UserProfileProps> = ({ address }) => {
  const { data } = useSWR(`/api/data/wallet?address=${address}`);
  console.log(data);
  return <div>User Profile</div>;
};

const handler: App = {
  name: "ShowUserProfileAndBalances",
  props: {
    address: Param.ETH_ADDRESS,
  },
  description: "Show user profile and balances",
  component: UserProfile,
};

export default handler;
