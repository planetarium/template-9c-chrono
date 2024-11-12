import { useMemo, useState } from "react";
import { useStageTransactionMutation } from "./graphql/generated/graphql";
import { getChronoSdk } from "@planetarium/chrono-sdk";
import { Address } from "@planetarium/account";
import { DailyReward } from "@planetarium/lib9c";
import "./App.css";

interface RefillButtonProps {
  signer: Address;
  avatarAddress: Address;
  setTxId: (value: string | null) => void;
}

function createDailyRewardAction(avatarAddress: Address): DailyReward {
  return new DailyReward({
    avatarAddress,
  });
}

type RefillProgress = "None" | "Signing" | "Staging" | "Done";

export function RefillButton({
  signer,
  avatarAddress,
  setTxId,
}: RefillButtonProps) {
  const [progress, setProgress] = useState<RefillProgress>("None");
  const [stage] = useStageTransactionMutation();
  const action = useMemo(() => {
    return createDailyRewardAction(avatarAddress);
  }, [avatarAddress]);

  const onClick = () => {
    setProgress("Signing");
    const chronoWallet = getChronoSdk();
    if (chronoWallet === undefined) {
      return;
    }

    chronoWallet
      .sign(signer, action)
      .then((tx) => {
        setProgress("Staging");
        return stage({
          variables: { tx: tx.toString("hex") },
        }).then(({ data, errors }) => {
          setProgress("Done");
          setTxId(data?.stageTransaction || null);
        });
      })
      .catch((e: unknown) => {
        setProgress("None");
      });
  };

  if (progress !== "None") {
    return <button className="progress-button">{progress}</button>;
  }

  return (
    <button className="refill-button" onClick={onClick}>
      Refill
    </button>
  );
}
