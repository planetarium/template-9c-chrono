import { Address } from "@planetarium/account";
import { RefillButton } from "./RefillButton";
import {
  useGetAvatarsQuery,
  useGetTipQuery,
} from "./graphql/generated/graphql";
import "./App.css";

interface AgentProps {
  agentAddress: Address;
  setTxId: (value: string | null) => void;
}

function Agent({ agentAddress, setTxId }: AgentProps) {
  const {
    data: tipData,
    loading: tipLoading,
    error: tipError,
  } = useGetTipQuery({
    pollInterval: 1000,
  });

  const {
    data: avatarsData,
    loading: avatarsLoading,
    error: avatarsError,
  } = useGetAvatarsQuery({
    variables: { agentAddress: agentAddress.toString() },
    pollInterval: 1000,
  });

  if (tipLoading || avatarsLoading) {
    return <p className="loading-message">Loading...</p>;
  }

  if (tipError || avatarsError) {
    return <p className="error-message">Failed to fetch data.</p>;
  }

  const tip = tipData?.nodeStatus?.tip?.index || -1;
  const avatars = avatarsData?.stateQuery?.agent?.avatarStates || [];
  const REFILL_INTERVAL = 2550 as const;

  if (avatars.length === 0) {
    return <p className="error-message">No avatars found.</p>;
  }
  return (
    <div className="agent-container">
      {avatars.map(
        ({
          address: avatarAddress,
          name: avatarName,
          actionPoint,
          dailyRewardReceivedIndex,
        }) => (
          <div className="avatar-card" key={avatarAddress}>
            <div className="avatar-info">
              {avatarName} ({actionPoint} / 120)
              {tip - dailyRewardReceivedIndex > REFILL_INTERVAL && (
                <RefillButton
                  signer={agentAddress}
                  avatarAddress={Address.fromHex(avatarAddress as string)}
                  setTxId={setTxId}
                />
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default Agent;
