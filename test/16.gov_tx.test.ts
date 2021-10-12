import { expect } from 'chai';
import Long from 'long';
import { VotingOption } from '../sdk/firmachain/common';
import { FirmaSDK } from "../sdk/FirmaSDK"
import { aliceMnemonic, bobMnemonic, TestChainConfig, validatorMnemonic } from './config_test';

// If test it, the properties of the chain change, so skip it.

describe.skip('[16. Gov Tx Test]', () => {

	const firma = new FirmaSDK(TestChainConfig);

	// Test order
	// 1. submitProposal
	// 2. deposit(for pass minium deposit value)
	// 3. vote

	it('SubmitTextProposal Test', async () => {

		const wallet = await firma.Wallet.fromMnemonic(aliceMnemonic);

		const proposer = await wallet.getAddress();
		const initialDepositFCT = 10;
		const title = "test submit proposal";
		const description = "test description";

		var result = await firma.Gov.SubmitTextProposal(wallet, title, description, initialDepositFCT, proposer);

		console.log(result);
		expect(result.code).to.equal(0);
	});

	it('SubmitCommunityPoolSpendProposal Test', async () => {

		const aliceWallet = await firma.Wallet.fromMnemonic(aliceMnemonic);
		const bobWallet = await firma.Wallet.fromMnemonic(bobMnemonic);

		const proposer = await aliceWallet.getAddress();
		const initialDepositFCT = 10;
		const title = "Community spend proposal1";
		const description = "This is a community spend proposal";
		const amount = 1000;
		const recipient = await bobWallet.getAddress();

		var result = await firma.Gov.SubmitCommunityPoolSpendProposal(aliceWallet, title, description, initialDepositFCT, proposer, amount, recipient);

		console.log(result);
		expect(result.code).to.equal(0);
	});

	it('SubmitParameterChangeProposal Test', async () => {

		const aliceWallet = await firma.Wallet.fromMnemonic(aliceMnemonic);

		const proposer = await aliceWallet.getAddress();
		const initialDepositFCT = 10;
		const title = "Parameter Change proposal1";
		const description = "This is a Parameter change proposal";

		const changeParamList = [{
			subspace: "staking",
			key: "MaxValidators",
			value: "100",
		}];

		var result = await firma.Gov.SubmitParameterChangeProposal(aliceWallet, title, description, initialDepositFCT, proposer, changeParamList);

		console.log(result);
		expect(result.code).to.equal(0);
	});

	it('SubmitSoftwareUpgradeProposalByHeight Test', async () => {

		const aliceWallet = await firma.Wallet.fromMnemonic(aliceMnemonic);

		const proposer = await aliceWallet.getAddress();
		const initialDepositFCT = 1000;
		const title = "Software Upgrade proposal1";
		const description = "This is a software upgrade proposal";

		const upgradeName = "v0.2.7";
		const upgradeHeight = Long.fromInt(20000000);

		var result = await firma.Gov.SubmitSoftwareUpgradeProposalByHeight(aliceWallet, title, description, initialDepositFCT, proposer, upgradeName, upgradeHeight);

		//console.log(result);
		expect(result.code).to.equal(0);
	});


	// NOTICE: time-based upgrades have been deprecated in the SDK: invalid request
	/*it.skip('SubmitSoftwareUpgradeProposalByTime Test', async () => {

		const aliceWallet = await firma.Wallet.fromMnemonic(aliceMnemonic);
		const bobWallet = await firma.Wallet.fromMnemonic(bobMnemonic);

		const proposer = await aliceWallet.getAddress();
		const initialDepositFCT = 8;
		const title = "Software Upgrade proposal2";
		const description = "This is a software upgrade proposal";

		const expirationDate = new Date();
		expirationDate.setMinutes(expirationDate.getMinutes() + 3);

		const upgradeName = "v0.2.4";
		const upgradeTime = expirationDate;
		const upgradeInfo = "info?";

		var result = await firma.Gov.SubmitSoftwareUpgradeProposalByTime(aliceWallet, title, description, initialDepositFCT, proposer, upgradeName, upgradeTime);

		console.log(result);
		expect(result.code).to.equal(0);
	});*/

	// TODO: get recent gov proposal list and then set proposalId for below case
	const tempProposalId = 1;

	// more deposit after initial deposit case
	it('Deposit OK', async () => {

		const wallet = await firma.Wallet.fromMnemonic(aliceMnemonic);

		const proposalId = Long.fromInt(tempProposalId);
		const amount = 1000;
		var result = await firma.Gov.Deposit(wallet, proposalId, amount);
		//console.log(result);
		expect(result.code).to.equal(0);
	});

	it('Vote - alice YES', async () => {

		const wallet = await firma.Wallet.fromMnemonic(aliceMnemonic);
		const proposalId = Long.fromInt(tempProposalId);

		var result = await firma.Gov.Vote(wallet, proposalId, VotingOption.VOTE_OPTION_YES);
		//console.log(result);
		expect(result.code).to.equal(0);
	});

	it('Vote - bob NO', async () => {

		const wallet = await firma.Wallet.fromMnemonic(bobMnemonic);
		const proposalId = Long.fromInt(tempProposalId);

		var result = await firma.Gov.Vote(wallet, proposalId, VotingOption.VOTE_OPTION_NO);
		//console.log(result);
		expect(result.code).to.equal(0);
	});

	// TODO: more voting case need it!
});