pragma solidity >=0.4.25 <0.6.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721Enumerable.sol";

contract TicketForge is ERC721, ERC721Enumerable {

    struct Scope {
        bool exists;
        mapping (address => bool) transfer_admins;
        address tokenuri_provider;
        uint256 index;
    }

    mapping (string => Scope) private scopes;
    string[] private scopeByIndex;
    uint256 private ticket_id_counter = 1;
    mapping (uint256 => uint256) private scopeByTicket;

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

        scopes[name].index = scopeByIndex.push(name) - 1;
    }

    /**
     *  @notice Utility to get scope's existence and tokenURI provider.
     *
     *  @param name Name of the scope to check.
     *
     */
    function getScope(string calldata name)
    external view returns (bool exists, address tokenuri_provider, uint256 scope_index) {
        return (scopes[name].exists, scopes[name].tokenuri_provider, scopes[name].index);
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

    /**
     *  @notice Create a new ERC-721 token assigned to given address, under specified scope
     *
     *  @param to Address of initial owner
     *  @param scopeIndex Index of desired scope
     *
     */
    function mint(address to, uint256 scopeIndex) external {
        require(scopeByIndexExists(scopeIndex), "TicketForge::mint | invalid scope for ticket minting");
        _mint(to, ticket_id_counter);
        scopeByTicket[ticket_id_counter] = scopeIndex;
        ++ticket_id_counter;
    }

    /**
     * @dev Transfers the ownership of a given token ID to another address.
     * Usage of this method is discouraged, use `safeTransferFrom` whenever possible.
     * Requires the msg.sender to be the owner, approved, or operator.
     * @param from current owner of the token
     * @param to address to receive the ownership of the given token ID
     * @param tokenId uint256 ID of the token to be transferred
     */
    function transferFrom(address from, address to, uint256 tokenId) public {
        //solhint-disable-next-line max-line-length
        require(_isApprovedOrOwnerOrScopeAdmin(msg.sender, tokenId), "ERC721: transfer caller is not owner, approved or scope admin");

        _transferFrom(from, to, tokenId);
    }

    /**
     * @dev Safely transfers the ownership of a given token ID to another address
     * If the target address is a contract, it must implement `onERC721Received`,
     * which is called upon a safe transfer, and return the magic value
     * `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`; otherwise,
     * the transfer is reverted.
     * Requires the msg.sender to be the owner, approved, or operator
     * @param from current owner of the token
     * @param to address to receive the ownership of the given token ID
     * @param tokenId uint256 ID of the token to be transferred
     */
    function safeTransferFrom(address from, address to, uint256 tokenId) public {
        safeTransferFrom(from, to, tokenId, "");
    }

    /**
     * @dev Safely transfers the ownership of a given token ID to another address
     * If the target address is a contract, it must implement `onERC721Received`,
     * which is called upon a safe transfer, and return the magic value
     * `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`; otherwise,
     * the transfer is reverted.
     * Requires the msg.sender to be the owner, approved, or operator
     * @param from current owner of the token
     * @param to address to receive the ownership of the given token ID
     * @param tokenId uint256 ID of the token to be transferred
     * @param _data bytes data to send along with a safe transfer check
     */
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory _data) public {
        transferFrom(from, to, tokenId);
        require(_checkOnERC721Received(from, to, tokenId, _data), "ERC721: transfer to non ERC721Receiver implementer");
    }


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

    function _isApprovedOrOwnerOrScopeAdmin(address owner, uint256 ticketId) internal view returns (bool) {
        if (_isApprovedOrOwner(owner, ticketId)) {
            return true;
        }
        return scopes[scopeByIndex[scopeByTicket[ticketId]]].transfer_admins[owner];
    }

    function scopeByIndexExists(uint256 index) internal view returns (bool) {
        return scopeByIndex.length > index;
    }
}
