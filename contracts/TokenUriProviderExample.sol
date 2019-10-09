pragma solidity >=0.4.25 <0.6.0;

import "./ITokenUriProvider.sol";

contract TokenUriProviderExample is ITokenUriProvider {

    function tokenURI(uint256 id) external view returns (string memory uri) {
        id;
        return "salut";
    }

}