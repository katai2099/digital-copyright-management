// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

contract CopyrightManagement {
    enum ContentType {
        IMAGE,
        AUDIO,
        TEXT
    }
    enum ContentAction {
        CREATE,
        UPDATE
    }
    struct Content {
        address ownerAddress;
        uint256 Id;
        string pHash;
        string IPFSAddress;
        string title;
        string ownerName;
        string ownerEmail;
        string desc;
        uint256 price;
        uint256 publishDate;
        ContentType contentType;
    }
    event addContentEvent(Content _content, ContentAction _content_action);

    event updateContentPriceEvent(
        address indexed _caller,
        uint256 indexed _id,
        uint256 _price,
        ContentType _content_type,
        ContentAction _content_action
    );

    uint256 public contentCount;

    mapping(uint256 => Content) public contents;

    function addContent(
        string memory _pHash,
        string memory _IPFSAddress,
        string memory _title,
        string memory _ownerName,
        string memory _ownerEmail,
        string memory _desc,
        uint256 _price,
        ContentType _contentType
    ) public {
        Content memory content = Content(
            msg.sender,
            contentCount,
            _pHash,
            _IPFSAddress,
            _title,
            _ownerName,
            _ownerEmail,
            _desc,
            _price,
            block.timestamp,
            _contentType
        );
        contents[contentCount] = content;
        contentCount++;
        emit addContentEvent(content, ContentAction.CREATE);
    }

    function updateContentData(
        uint256 _id,
        string memory _desc,
        uint256 _price,
        ContentType _contentType
    ) public {
        contents[_id].desc = _desc;
        contents[_id].price = _price;
        emit updateContentPriceEvent(
            msg.sender,
            _id,
            _price,
            _contentType,
            ContentAction.UPDATE
        );
    }
}
