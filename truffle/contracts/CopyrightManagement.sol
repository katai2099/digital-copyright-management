// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

contract CopyrightManagement {
    enum ContentType {
        IMAGE,
        AUDIO,
        TEXT
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
    struct Agreement {
        uint256 id;
        address licensee;
        address licenser;
        uint256 contentId;
        string purposeOfUse;
        uint256 timestamp;
    }
    event addContentEvent(
        address indexed _caller,
        Content _content,
        uint256 timestamp
    );
    event updateContentEvent(
        address indexed _caller,
        uint256 indexed _contentId,
        uint256 _lastPrice,
        uint256 _currentPrice,
        uint256 timestamp
    );
    event licensingEvent(Agreement _agreement, uint256 _price);

    uint256 public contentCount;
    uint256 public agreementCount;

    mapping(uint256 => Content) public contents;
    mapping(uint256 => Agreement) public agreements;
    mapping(address => uint256) public balances;

    event withdrawEvent(address _caller, uint256 _amount, uint256 _timestamp);

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
        emit addContentEvent(msg.sender, content, block.timestamp);
    }

    function updateContentData(uint256 _id, uint256 _price) public {
        require(
            msg.sender == contents[_id].ownerAddress,
            "You are not the owner of the content"
        );
        uint256 lastPrice = contents[_id].price;
        contents[_id].price = _price;
        emit updateContentEvent(
            msg.sender,
            _id,
            lastPrice,
            _price,
            block.timestamp
        );
    }

    function licensingContent(
        uint256 _id,
        string memory _purposeOfUse
    ) public payable {
        Content memory content = contents[_id];
        require(
            msg.sender != content.ownerAddress,
            "You are the owner.You are free to use your own content"
        );
        require(
            msg.value >= content.price,
            "Amount of Ether provided is less than content price"
        );
        balances[content.ownerAddress] += content.price;
        if (msg.value > content.price) {
            uint256 excess = msg.value - content.price;
            payable(msg.sender).transfer(excess);
        }
        Agreement memory agreement = Agreement(
            agreementCount,
            msg.sender,
            content.ownerAddress,
            content.Id,
            _purposeOfUse,
            block.timestamp
        );
        agreements[agreementCount] = agreement;
        agreementCount++;
        emit licensingEvent(agreement, content.price);
    }

    function withdraw() public payable {
        uint refund = balances[msg.sender];
        balances[msg.sender] = 0;
        payable(msg.sender).transfer(refund);
        emit withdrawEvent(msg.sender, refund, block.timestamp);
    }
}
