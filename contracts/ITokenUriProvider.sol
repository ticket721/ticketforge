pragma solidity >=0.4.25 <0.6.0;

contract ITokenUriProvider {

    function tokenURI(uint256 id) external view returns (string memory uri);

}