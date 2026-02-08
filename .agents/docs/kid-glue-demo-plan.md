# Baby Glue Plan

## Goal
Ship a Base Sepolia demo for kids (age 8-12) that explains Glue using mascot speech bubbles and two actions: deposit ETH and unglue.

## Success Criteria
- One-page flow: connect wallet -> deposit -> unglue.
- Every concept and action has mascot guidance text.
- Smart contract, tests, deploy script, and frontend are all present.
- Demo can be presented in under 2 minutes.

## Tasks with User Stories and Measurable Outcomes

### Task 1: Kid-safe copy and mascot script
- User story: As a kid, I want simple words so I understand each click.
- Deliverables:
  - Define simple terms: token, glue vault, backing, burn, fair share.
  - Add mascot bubble per UI step.
- Measurable outcome:
  - 100% action cards include mascot text.
  - Every mascot line is <= 12 words.

### Task 2: Smart contract
- User story: As a judge, I want real on-chain redemption logic.
- Deliverables:
  - `contracts/BackedDemoToken.sol` based on `StickyAsset`.
  - No custom hook logic for MVP speed/safety.
- Measurable outcome:
  - Contract compiles with Solidity 0.8.28 and Cancun EVM.

### Task 3: Tests
- User story: As a judge, I want proof the core flow works.
- Deliverables:
  - Deployment test.
  - Glue address existence test.
  - ETH deposit + unglue redemption test.
  - Zero burn revert test.
- Measurable outcome:
  - All listed tests pass.

### Task 4: Deployment automation
- User story: As presenter, I need reproducible deployment.
- Deliverables:
  - `scripts/deploy.ts` for Base Sepolia.
  - Console output for token/glue addresses and frontend env keys.
- Measurable outcome:
  - Deploy script prints required env values.

### Task 5: Frontend with mascot guidance
- User story: As a kid, I want clear steps and quick feedback.
- Deliverables:
  - One route UI.
  - Connect wallet + 2 actions.
  - Live metrics: piggy-bank ETH, my tokens, all tokens, backing per token.
  - Friendly error messages.
- Measurable outcome:
  - Buttons disable during pending tx.
  - Metrics refresh after successful tx.
  - Full flow can be completed in < 2 minutes.

### Task 6: Documentation and discoverability
- User story: As teammate, I want one place to find the project plan.
- Deliverables:
  - This plan file in `.agents/docs`.
  - `AGENTS.md` reference to this file.
- Measurable outcome:
  - Path is explicitly documented in AGENTS.

## Defaults and Constraints
- Chain: Base Sepolia only.
- Collateral in UI: ETH only.
- Backend: not required for MVP.
- Mascot style: speech bubbles.

## Demo Script (60 seconds)
1. Connect wallet.
2. Show piggy bank balance.
3. Deposit ETH.
4. Burn tokens with unglue.
5. Show updated balances and explain fair share.
