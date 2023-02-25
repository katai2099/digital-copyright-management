// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

contract CopyrightManagement {
    
    uint public imageCount;

    mapping(uint => ImageInfo) public images;

    struct ImageInfo{
        address ownerAddress;
        uint imageID;
        string pHash;
        string IPFSAddress;
        string imageTitle;
        string ownerName;
        string ownerEmail;
        uint publishDate;
    }

    function addImage(string memory _pHash, string memory _IPFSAddress, string memory _imageTitle, string memory _ownerName, string memory _ownerEmail) public {
        ImageInfo memory image = ImageInfo(msg.sender,imageCount,_pHash,_IPFSAddress,_imageTitle,_ownerName,_ownerEmail,block.timestamp);
        images[imageCount] = image;
        imageCount++; 
    }

}