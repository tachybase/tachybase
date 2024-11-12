// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DataStorage {
    struct Data {
        string hashedData;
        string salt;
    }
    
    mapping(uint256 => Data) private data;

    event DataStored(uint256 indexed id, string hashedData, string salt);
    event DataDeleted(uint256 indexed id);

    function storeData(uint256 id, string memory hashedData, string memory salt) public {
        require(bytes(data[id].hashedData).length == 0, "Data already exists for this ID");
        data[id] = Data(hashedData, salt);
        emit DataStored(id, hashedData, salt);
    }

    function getData(uint256 id) public view returns (string memory hashedData, string memory salt) {
        Data storage item = data[id];
        require(bytes(item.hashedData).length != 0, "Data not found");
        return (item.hashedData, item.salt);
    }

    function deleteData(uint256 id) public {
        require(bytes(data[id].hashedData).length != 0, "Data not found");
        delete data[id];
        emit DataDeleted(id);
    }
}