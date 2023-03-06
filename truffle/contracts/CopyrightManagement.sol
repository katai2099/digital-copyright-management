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
        uint256 contentID;
        string pHash;
        string IPFSAddress;
        string contentTitle;
        string ownerName;
        string ownerEmail;
        string desc;
        uint256 price;
        uint256 publishDate;
    }
    event addContentEvent(
        address indexed _creator,
        uint256 indexed _id,
        ContentType _content_type,
        ContentAction _content_action
    );
    event updateContentPriceEvent(
        address indexed _caller,
        uint256 indexed _id,
        uint256 _price,
        ContentType _content_type,
        ContentAction _content_action
    );

    uint256 public imageCount;
    uint256 public textCount;
    uint256 public audioCount;

    mapping(address => uint256) public balances;

    mapping(uint256 => Content) public images;
    mapping(uint256 => Content) public audio;
    mapping(uint256 => Content) public texts;

    function addImageContent(
        string memory _pHash,
        string memory _IPFSAddress,
        string memory _imageTitle,
        string memory _ownerName,
        string memory _ownerEmail,
        string memory _desc,
        uint256 _price
    ) public {
        Content memory image = Content(
            msg.sender,
            imageCount,
            _pHash,
            _IPFSAddress,
            _imageTitle,
            _ownerName,
            _ownerEmail,
            _desc,
            _price,
            block.timestamp
        );
        images[imageCount] = image;
        imageCount++;
        emit addContentEvent(
            msg.sender,
            imageCount,
            ContentType.IMAGE,
            ContentAction.CREATE
        );
    }

    function updateImageData(
        uint256 _id,
        string memory _desc,
        uint256 _price
    ) public {
        images[_id].desc = _desc;
        images[_id].price = _price;
        emit updateContentPriceEvent(
            msg.sender,
            _id,
            _price,
            ContentType.IMAGE,
            ContentAction.UPDATE
        );
    }

    function addAudioContent(
        string memory _pHash,
        string memory _IPFSAddress,
        string memory _audioTitle,
        string memory _ownerName,
        string memory _ownerEmail,
        string memory _desc,
        uint256 _price
    ) public {
        Content memory tmpAudio = Content(
            msg.sender,
            audioCount,
            _pHash,
            _IPFSAddress,
            _audioTitle,
            _ownerName,
            _ownerEmail,
            _desc,
            _price,
            block.timestamp
        );
        audio[audioCount] = tmpAudio;
        audioCount++;
        emit addContentEvent(
            msg.sender,
            audioCount,
            ContentType.AUDIO,
            ContentAction.CREATE
        );
    }

    function updateAudioData(
        uint256 _id,
        string memory _desc,
        uint256 _price
    ) public {
        audio[_id].desc = _desc;
        audio[_id].price = _price;
        emit addContentEvent(
            msg.sender,
            audioCount,
            ContentType.AUDIO,
            ContentAction.CREATE
        );
    }

    function addTextContent(
        string memory _pHash,
        string memory _IPFSAddress,
        string memory _textTitle,
        string memory _ownerName,
        string memory _ownerEmail,
        string memory _desc,
        uint256 _price
    ) public {
        Content memory text = Content(
            msg.sender,
            textCount,
            _pHash,
            _IPFSAddress,
            _textTitle,
            _ownerName,
            _ownerEmail,
            _desc,
            _price,
            block.timestamp
        );
        texts[textCount] = text;
        textCount++;
        emit addContentEvent(
            msg.sender,
            textCount,
            ContentType.TEXT,
            ContentAction.CREATE
        );
    }

    function updateTextData(
        uint256 _id,
        string memory _desc,
        uint256 _price
    ) public {
        texts[_id].desc = _desc;
        texts[_id].price = _price;
        emit updateContentPriceEvent(
            msg.sender,
            _id,
            _price,
            ContentType.TEXT,
            ContentAction.UPDATE
        );
    }
}
