// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint32, euint8 } from "@fhevm/solidity/lib/FHE.sol";

contract PrivacyBuildingCertification {
    address public owner;
    address public authority;
    uint256 public totalBuildings;

    mapping(uint256 => euint32) private energy;
    mapping(uint256 => euint8) private efficiency;
    mapping(uint256 => address) public buildingOwner;
    mapping(uint256 => bool) public verified;
    mapping(uint256 => uint256) public score;

    event BuildingSubmitted(uint256 id, address owner);
    event BuildingVerified(uint256 id);
    event ScoreCalculated(uint256 id, uint256 score);

    constructor(address _authority) {
        owner = msg.sender;
        authority = _authority;
    }

    function submitBuilding(uint32 _energy, uint8 _efficiency) external {
        totalBuildings++;
        uint256 id = totalBuildings;

        energy[id] = FHE.asEuint32(_energy);
        efficiency[id] = FHE.asEuint8(_efficiency);
        buildingOwner[id] = msg.sender;

        FHE.allowThis(energy[id]);
        FHE.allowThis(efficiency[id]);
        FHE.allow(energy[id], msg.sender);
        FHE.allow(efficiency[id], msg.sender);

        emit BuildingSubmitted(id, msg.sender);
    }

    function verifyBuilding(uint256 id) external {
        require(msg.sender == authority, "Not authorized");
        verified[id] = true;
        emit BuildingVerified(id);
    }

    function calculateScore(uint256 id) external {
        require(verified[id], "Not verified");
        require(buildingOwner[id] == msg.sender || msg.sender == authority, "Not authorized");

        euint32 effScore = FHE.mul(FHE.asEuint32(efficiency[id]), FHE.asEuint32(100));
        euint32 energyPenalty = FHE.mul(energy[id], FHE.asEuint32(1));
        euint32 totalScore = FHE.sub(effScore, energyPenalty);

        bytes32[] memory cts = new bytes32[](1);
        cts[0] = FHE.toBytes32(totalScore);
        FHE.requestDecryption(cts, this.processScore.selector);
    }

    function processScore(uint256, uint32 _score, bytes[] memory) external {
        score[totalBuildings] = _score;
        emit ScoreCalculated(totalBuildings, _score);
    }

    function getScore(uint256 id) external view returns (uint256) {
        return score[id];
    }

    function changeAuthority(address newAuthority) external {
        require(msg.sender == owner, "Not owner");
        authority = newAuthority;
    }
}