import React, { useState } from 'react';
import {
  usePrepareContractWrite,
  useContractWrite,
  useNetwork,
  useAccount,
} from 'wagmi';
import generateMerkleProof from '../utils/generateMerkleProof';

import { WAYSTONE_CONTRACT_ADDRESS } from '../utils/constants';
import WaystoneContract from '../contracts/WaystoneDevContract.json';

const INVALID_PROOF_ERROR = 'execution reverted: Invalid proof';
const EXCEEDS_MINT_ERROR = 'execution reverted: Exceeds mint allocation';
const SALE_NOT_STARTED_ERROR = 'execution reverted: Sale has not started yet.';
const EXCEEDS_MAX_SUPPLY_ERROR = 'execution reverted: Exceeds max supply';

export default function ExtractShardButton(props) {
  const [touched, setTouched] = useState(false);
  const { chain } = useNetwork();
  const { address } = useAccount();
  const contractAddress = WAYSTONE_CONTRACT_ADDRESS[chain?.id];

  const merkleProof = generateMerkleProof(address);

  const { config, error } = usePrepareContractWrite({
    addressOrName: contractAddress,
    contractInterface: WaystoneContract,
    functionName: 'allowlistMint',
    args: [merkleProof],
  });
  const { write } = useContractWrite(config);

  if (!contractAddress) {
    return <></>;
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        marginBottom: 16,
      }}
    >
      <button
        disabled={!address}
        onClick={() => {
          setTouched(true);
          write?.();
        }}
        className="extract-shard-link"
      >
        <img alt="Link to extract shard" src="/assets/buttons/shard.png" />
      </button>
      {error && error.reason === INVALID_PROOF_ERROR && touched ? (
        <div
          style={{
            color: 'yellow',
          }}
        >
          Your address is not on the holo-records. Please wait for public
          extraction.
        </div>
      ) : null}
      {error && error.reason === EXCEEDS_MINT_ERROR && touched ? (
        <div
          style={{
            color: 'yellow',
          }}
        >
          The holo-records indicate a shard has already been extracted by you.
        </div>
      ) : null}
      {error && error.reason === SALE_NOT_STARTED_ERROR && touched ? (
        <div
          style={{
            color: 'yellow',
          }}
        >
          Extraction is not available yet. Please await further messages.
        </div>
      ) : null}
      {error && error.reason === EXCEEDS_MAX_SUPPLY_ERROR && touched ? (
        <div
          style={{
            color: 'yellow',
          }}
        >
          All shards have been extracted!
        </div>
      ) : null}
    </div>
  );
}
