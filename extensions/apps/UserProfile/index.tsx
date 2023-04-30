import { App, Param, Wallet } from "@/utils/types";
import useSWR from "swr";

interface UserProfileProps {
  wallet: Wallet;
}

const UserProfile: React.FC<UserProfileProps> = ({ wallet }) => {
  const { data } = useSWR(`/api/data/wallet?address=${wallet.address}`);
  console.log(data);
  return <div>User Profile</div>;
};

const handler: App = {
  name: "ShowUserProfileAndBalances",
  props: {
    wallet: Param.WALLET,
  },
  description: "Show user profile and balances",
  component: UserProfile,
};

export default handler;
