pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./Interfaces/ICowNFT.sol";

/** @author Centric Technologies PTY LTD
    @title A unique cattle identification platform */
contract CattleNFT is ERC721, ICowNFT {
    uint256 public tokenCounter;
    string public NLIS;
    string public PIC;
    bytes32 public DNAHash;
    string private _name;
    string private _symbol;
    //uint256 public totalSupply;
    event cowCreated(bytes32 _DNAHash, address _ownerAddress, uint256 _tokenId);

    struct Cow {
        string NLIS;
        string PIC;
        bytes32 DNAHash;
        address Owner;
    }

    //Mapping the token ID to NLIS Tag data
    mapping(string => uint256) public _NLISToTokenID;
    //Mapping the token ID to the DNA hash
    mapping(bytes32 => uint256) public _DNAHashToTokenId;
    //Mapping to group all values identified by tokenId
    mapping(uint256 => Cow) public cowStruct;

    constructor (string memory name, string memory symbol) 
    ERC721 (name, symbol){
        _name = name;
        _symbol = symbol;
        tokenCounter = 1; //should probably have token counter indexing from one
    }
    /** @notice function call for minting an NFT with set identity metrics
        @param _NLIS unique RFID Based identifier for the cattle asset
        @param _PIC property identifier code for the property the cattle asset is from
        @param _DNAHash hash of the DNA of the cattle asset used as an identifier
        @dev tokenId is the main identifier for the asset once it is on chain,
        the other metrics support the bridge between physical and digital
        @return tokenId of the newly minted digital cattle asset*/
    function mintNFT (string memory _NLIS, string memory _PIC, bytes32 _DNAHash, address ownerAddress) 
        override public returns (uint256){
            uint256 newItemId = tokenCounter;
            Cow memory cow;
            cow = Cow(_NLIS, _PIC, _DNAHash, ownerAddress);
            _safeMint(ownerAddress, newItemId);
            cowStruct[tokenCounter] = cow;
            _NLISToTokenID[_NLIS] = newItemId;
            _DNAHashToTokenId[_DNAHash] = newItemId;
            tokenCounter++;             //should probably emit event that NFT has been minted ?
            emit cowCreated(_DNAHash, ownerAddress, newItemId);
            return newItemId;
        }
    /** @notice function used to create the unique DNA hash for the cattle
        @param DNAData the raw DNA data used to create the DNAhash identifier
        @dev the input of the DNAData is generated using a unique algorithm
        owned by Centric Technologies PTY LTD
        @return The hash of the unique DNA data */
    function hashDNA (string memory DNAData) 
        override public pure returns (bytes32){
            return keccak256(abi.encodePacked(DNAData));
        }

    /** @notice function used to reset the identity of a given cattle asset
        @param _tokenCounter the tokenId of the cattle NFT you wish to reset
        @param _NLIS the updated RFID information for the cattle asset
        @param _PIC the updated PIC information for the cattle asset
        @param _DNAHash the updated DNA hash information for the cattle asset */
    function setNewIdentity (uint256 _tokenCounter, string memory _NLIS, string memory _PIC, bytes32 _DNAHash)
        override public {
            cowStruct[_tokenCounter].NLIS = _NLIS;
            cowStruct[_tokenCounter].PIC = _PIC;
            cowStruct[_tokenCounter].DNAHash = _DNAHash;
        }

    /** @notice function used to reference the mapping of tokenid -> DNAhash
        @param tokenId the tokenId to be used as a key in the mapping
        @return the DNAHash for the corresponding tokenId*/
    function TokenIDToDNAHash (uint256 tokenId) 
        override public view returns (bytes32) {
            return cowStruct[tokenId].DNAHash;
        }
    /** @notice function used to reference the mapping of NLIS -> PIC
        @param NLISID the NLIS data used as a key in the mapping
        @return the PIC for the corresponding NLISID */
    function NLISToPIC (string memory NLISID)
        override public view returns (string memory) {
            uint256 _tokenID = _NLISToTokenID[NLISID];
            return cowStruct[_tokenID].PIC;
        }

    /** @notice the function used to reference the mapping of tokenId -> NLIS
        @param tokenId the tokenid to be used as a key in the mapping
        @return the NLIS for the corresponding tokenId */
    function TokenIDToNLIS (uint256 tokenId)
        override public view returns (string memory) {
            return cowStruct[tokenId].NLIS;
        }

    /** @notice the function used to reference the mapping of NLIS -> DNAHash
        @param NLISID the NLISID to be used as a key in the mapping
        @return the DNAHash for the corresponding NLISID */
    function NLISToDNAHash (string memory NLISID)
        override public view returns (bytes32) {
            uint256 _tokenID = _NLISToTokenID[NLISID];
            return cowStruct[_tokenID].DNAHash;
        }

    /** @notice the function used to reference the mapping of DNAHash -> PIC
        @param DNAData the DNAHash used as a key in the mapping
        @return the PIC for the corresponding DNAHash */
    function DNAHashToPIC (bytes32 DNAData)
        override public view returns (string memory) {
            uint256 _tokenID = _DNAHashToTokenId[DNAData];
            return cowStruct[_tokenID].PIC;
        }

    /** @notice the function used to reference the mapping of tokenId -> Owner
        @param TokenId the tokenId used as a key in the mapping
        @return Owner address for the corresponding tokenId */
    function TokenIDToOwner(uint256 TokenId)
        override public view returns (address) {
            return cowStruct[TokenId].Owner;
        }
    /** @notice the function used to reference the mapping of tokenId -> PIC
        @param TokenId the tokenId used as a key in the mapping
        @return the PIC for the corresponding tokenId */
    function TokenIDToPIC(uint256 TokenId)
        override public view returns (string memory) {
            return cowStruct[TokenId].PIC;
        }
    /** @notice the functoin used to reference the mapping of NLIS -> tokenId
        @param NLISID the NLIS data used as a key in the mapping
        @return the tokenId for the corresponding NLISID */
    function NLISToTokenID (string memory NLISID)
        override public view returns (uint256) {
            return _NLISToTokenID[NLISID];
        }
    /** @notice the function used to reference the mapping of DNAHash -> tokenId
        @param DNAData the DNAHash used as a key in the mapping
        @return the tokenId for the corresponding DNAHash */
    function DNAHashToTokenID (bytes32 DNAData)
        override public view returns (uint256) {
            return _DNAHashToTokenId[DNAData];
        }
    
    /** @notice the function used to check whether an address owns the token
        @param _claimant the address to check
        @param _tokenId the tokenId to check
        @return whether the address owns the token */
    function isOwnerOf(address _claimant, uint256 _tokenId) override public view returns (bool) {
        return ownerOf(_tokenId) == _claimant;
    }

    /** @notice the function used to check how many assets an address owns
        @param _claimant the address to check
        @dev can be refactored and deleted to just use @openzeppelins balanceOf()
        @return the number of assets the address owns
     */
    function getBalanceOf(address _claimant) override public view returns(uint256) {
        return balanceOf(_claimant);
    }

    /** @notice the function to send an asset from one address to another
        @param _from the address that is currently holding the token
        @param _to the address that will be receiving the token
        @param _tokenId the token to transfer
    */
    function sendCow(address _from, address _to, uint256 _tokenId) override external {
        safeTransferFrom(_from, _to, _tokenId);
        cowStruct[_tokenId].Owner = _to;
    }

    /** @notice the function to get all tokenIds being held by a specific address
        @param _owner the address to check
        @return an array containing all tokenIds owned by the given _owner
        @dev **SHOULD NOT BE CALLED BY ANY SMART CONTRACT CODE**
            Expensive function, can be changed in the future to a 
            mapping of addresses to array of tokenIds (mapping(address => uint256[])).
            Function also returns a dynamic array, which is not supported for
            contract-contract calls.
     */
    function tokensOfOwner(address _owner) override external view returns(uint256[] memory) {
        uint256 tokenCount = balanceOf(_owner);

        if (tokenCount == 0) {
            return new uint256[](0);
        }

        uint256[] memory resultCows = new uint256[](tokenCount);
        uint256 totalCows = tokenCounter;
        uint256 resultIndex = 0;

        uint256 cowId;

        for(cowId = 1; cowId <= totalCows; cowId++) {
            if (cowStruct[cowId].Owner == _owner) {
                resultCows[resultIndex] = cowId;
                resultIndex++;
            }
        }

        return resultCows;


    }


}
