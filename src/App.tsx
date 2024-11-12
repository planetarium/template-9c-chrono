import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { useState } from "react";
import Agent from "./Agent";
import { getChronoSdk } from "@planetarium/chrono-sdk";
import { useAccounts, useConnect, useNetwork } from "@planetarium/chrono-sdk/hooks";
import "./App.css";

function App() {
  const [currentAccount, setCurrentAccount] = useState<number>(0);
  const [txId, setTxId] = useState<string | null>(null);

  const {
    data: accountsData,
    isLoading: accountsLoading,
    isSuccess: accountsSuccess,
    error: accountsError,
  } = useAccounts();
  const { connectAsync, isPending } = useConnect();
  const {
    data: networksData,
    isLoading: networksLoading,
    isSuccess: networksSuccess,
  } = useNetwork();

  const chronoWallet = getChronoSdk();

  if (chronoWallet === undefined) {
    return (
      <div className="app-container">
        There is no Chrono Wallet. You should install Chrono wallet first to use
        this app.
      </div>
    );
  }

  if (accountsLoading || networksLoading) {
    return <div className="loading-message">Waiting... If you haven't created an account on Chrono yet, please create one.</div>;
  }

  if (!accountsSuccess) {
    return (
      <div className="error-message">
        Accounts are not loaded successful.
      </div>
    );
  }

  if (!networksSuccess) {
    return (
      <div className="error-message">Network is not loaded successfully.</div>
    );
  }

  const { accounts, isConnected } = accountsData;
  const { network, isConnected: networkIsConnected } = networksData;

  if (!isConnected || !networkIsConnected) {
    return (
      <div className="app-container">
        <p className="error-message">
          You must connect (allow) this site on Chrono first.
        </p>
        {isPending || (
          <button className="connect-button" onClick={() => connectAsync()}>
            Connect
          </button>
        )}
        {isPending && (
          <button
            className="connect-button"
            disabled
            onClick={() => connectAsync()}
          >
            Connecting
          </button>
        )}
      </div>
    );
  }

  if (!network.gqlEndpoint) {
    return (
      <div className="error-message">
        No GraphQL endpoint found for the network.
      </div>
    );
  }

  const client = new ApolloClient({
    uri: network.gqlEndpoint,
    cache: new InMemoryCache(),
  });

  const explorerEndpoint = (network as any).explorerEndpoint;

  return (
    <ApolloProvider client={client}>
      <div className="app-container">
        <select
          className="select-wrapper"
          onChange={(e) => setCurrentAccount(Number(e.target.value))}
        >
          {accounts.map((acc, index) => (
            <option key={acc.toString()} value={index}>
              {acc.toString()}
            </option>
          ))}
        </select>
        <Agent agentAddress={accounts[currentAccount]} setTxId={setTxId} />
        {txId && (
          <p className="error-message">
            Last Transaction :{" "}
            <a className="link" href={`${explorerEndpoint}/tx/${txId}`}>
              9cscan
            </a>
          </p>
        )}
      </div>
    </ApolloProvider>
  );
}

export default App;
