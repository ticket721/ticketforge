pragma solidity >=0.4.25 <0.6.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721Enumerable.sol";

contract TicketForge is ERC721, ERC721Enumerable {

    struct Scope {
        bool exists;
        mapping (address => bool) transfer_admins;
        address tokenuri_provider;
    }

    mapping (string => Scope) scopes;

    function verifyScopeName(string memory name) internal pure returns (bool) {
        bytes memory check_bytes = bytes(name);

        if (check_bytes.length == 0) return false;

        for (uint idx = 0; idx < check_bytes.length; ++idx) {
            if ((int8(check_bytes[idx]) >= 33 && int8(check_bytes[idx]) <= 64) || // Ascii values from ! to @
                (int8(check_bytes[idx]) >= 91 && int8(check_bytes[idx]) <= 126)) // Ascii values from [ to ~
            {
                continue ;
            }
            return false;
        }

        return true;
    }

    /**
     *  @notice Creates an immutable scope. Define transfer admins that can trigger any transfers
     *          on any user's behalf. This is meant to delegate logics like marketplaces to other
     *          contracts. Do not use this to set wallets as admins ...
     *          The tokenuri_provider is a contract that implement the TokenURIProvider interface.
     *          This contract will be called to resolve tokenURIs. Set to 0x000.. to use a normal
     *          behavior where each token should have its own tokenURI.
     *
     *  @dev The function MUST throw if the provided name is empty
     *
     *  @dev The function MUST throw if the provided name contains uppercase letters
     *
     *  @dev The function MUST throw if the provided name is already defined
     *
     *  @param name Name to give to the new scope
     *
     *  @param tokenuri_provider Address of TokenURIProvider contract. `address(0)` is none should be used.
     *
     *  @param transfer_admins Array of addresses. They all become transfer admins for the scope's tickets. This
     *                         means they can trigger any transfers. Made to be used on contracts like marketplaces.
     *                         Use at your own risk on wallets ...
     *
     */
    function createScope(string calldata name, address tokenuri_provider, address[] calldata transfer_admins) external {
        require(verifyScopeName(name) == true,
            "TicketForge::createScope | name empty or with invalid characters");
        require(scopes[name].exists == false,
            "TicketForge::createScope | scope name already in use");

        scopes[name].exists = true;
        scopes[name].tokenuri_provider = tokenuri_provider;

        for (uint idx = 0; idx < transfer_admins.length; ++idx) {
            scopes[name].transfer_admins[transfer_admins[idx]] = true;
        }
    }

    /**
     *  @notice Utility to get scope's existence and tokenURI provider.
     *
     *  @param name Name of the scope to check.
     *
     */
    function getScope(string calldata name) external view returns (bool exists, address tokenuri_provider) {
        return (scopes[name].exists, scopes[name].tokenuri_provider);
    }

    /**
     *  @notice Utility to know if a provided address is a admin of provided scope name
     *
     *  @param name Name of the scope to check.
     *
     *  @param admin Address to check.
     *
     */
    function isScopeAdmin(string calldata name, address admin) external view returns (bool) {
        return scopes[name].transfer_admins[admin];
    }
}
