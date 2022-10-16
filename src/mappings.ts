import { Address, BigInt } from "@graphprotocol/graph-ts";
import { ERC20, Balance, Allowance } from "../generated/schema";
import { ERC20 as ERC20Contract, Transfer, Approval } from "../generated/ERC20/ERC20";
import { METADATA_CONFIG } from "./generated/config";

export let ONE_ETH = BigInt.fromI64(1000000000000000000);
export let BIGINT_ZERO = BigInt.fromI32(0);
export let ZERO_ADDRESS = Address.fromHexString('0x0000000000000000000000000000000000000000');

export function createERC20IfNonExistent(address: Address): ERC20 {
  let erc20Contract = ERC20Contract.bind(address);

  let erc20 = ERC20.load(address.toHexString());
  if (erc20 == null) {
    erc20 = new ERC20(address.toHexString());
    let config = METADATA_CONFIG.get(address.toHexString());
    if (config) {
      erc20.name = (config.get("name")) as string;
    } else {
      erc20.name = "Unknown";
    }
    erc20.address = address;
    erc20.minted = BIGINT_ZERO;
    erc20.burned = BIGINT_ZERO;
    erc20.totalSupply = BIGINT_ZERO;
    erc20.save();
  }

  erc20.totalSupply = erc20Contract.totalSupply();
  erc20.save();

  return erc20 as ERC20;
}

export function createBalanceIfNonExistent(erc20Address: Address, user: Address): Balance {
  let id = user.toHexString();
  let balance = Balance.load(id);
  if (!balance) {
    balance = new Balance(id);
    balance.user = user;
    balance.balance = BIGINT_ZERO;
    balance.token = createERC20IfNonExistent(erc20Address).id
    balance.save();
  }
  return balance;
}

export function createAllowanceIfNonExistent(
  erc20Address: Address, owner: Address, spender: Address, amount: BigInt
): void {
  if (owner.notEqual(ZERO_ADDRESS) && spender.notEqual(ZERO_ADDRESS)) {
    let id = owner.toHexString() + "-" + spender.toHexString();
    let allowance = Allowance.load(id);
    if (allowance == null) {
      allowance = new Allowance(id);
      allowance.owner = owner;
      allowance.spender = spender;
      allowance.token = createERC20IfNonExistent(erc20Address).id
    }
    allowance.amount = amount;
    allowance.save();
  }
}

function isMintOperation(from: Address, to: Address): boolean {
  return from.equals(ZERO_ADDRESS) && !to.equals(ZERO_ADDRESS);
}

function isBurnOperation(from: Address, to: Address): boolean {
  return from.notEqual(ZERO_ADDRESS) && to.equals(ZERO_ADDRESS);
}

export function handleTransfer(event: Transfer): void {
  let erc20 = createERC20IfNonExistent(event.address);

  if (isMintOperation(event.params.from, event.params.to)) {
    erc20.minted = erc20.minted.plus(event.params.value);
  }
  else if (isBurnOperation(event.params.from, event.params.to)) {
    erc20.burned = erc20.burned.plus(event.params.value);
  }

  erc20.save();

  let fromBalance = createBalanceIfNonExistent(event.address, event.params.from);
  fromBalance.balance = fromBalance.balance.minus(event.params.value);
  fromBalance.save();

  let toBalance = createBalanceIfNonExistent(event.address, event.params.to);
  toBalance.balance = toBalance.balance.plus(event.params.value);
  toBalance.save();
}

export function handleApproval(event: Approval): void {
  createAllowanceIfNonExistent(event.address, event.params.owner, event.params.spender, event.params.value);
}
