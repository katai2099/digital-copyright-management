// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

contract CopyrightManagement {
    enum ContentType {
        IMAGE,
        AUDIO,
        TEXT
    }
    enum RequestType {
        PENDING,
        REJECTED,
        APPROVED
    }
    struct User {
        address walletAddress;
        string firstname;
        string lastname;
        string emailAddress;
    }
    struct Content {
        address ownerAddress;
        uint256 Id;
        string pHash;
        string IPFSAddress;
        string title;
        string desc;
        string fieldOfUse;
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
        string fieldOfUse;
        uint256 price;
        uint256 timestamp;
    }
    struct Request {
        uint256 id;
        address licensee;
        uint256 contentId;
        string purposeOfUse;
        string fieldOfUse;
        uint256 price;
        RequestType requestType;
        string rejectReason;
        uint256 timestamp;
    }
    event addUserEvent(address indexed _caller, User _user, uint256 timestamp);
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
        string _lastFieldOfUse,
        string _currentFieldOfUse,
        uint256 timestamp
    );
    event licensingEvent(Agreement _agreement);
    event requestEvent(Request _request);
    event updateRequestEvent(
        address indexed _caller,
        Request _request,
        uint256 timestamp
    );
    event transferEvent(
        address _caller,
        address _receiver,
        uint256 _amount,
        uint256 _timestamp
    );

    uint256 public userCount;
    uint256 public contentCount;
    uint256 public agreementCount;
    uint256 public requestCount;
    mapping(uint256 => address) public usersList;
    mapping(address => User) public users;
    mapping(uint256 => Content) public contents;
    mapping(uint256 => Agreement) public agreements;
    mapping(uint256 => Request) public requests;
    mapping(address => uint256) public balances;

    modifier isWhitelisted(address _address) {
        require(
            bytes(users[_address].emailAddress).length != 0,
            "You need to be whitelisted"
        );
        _;
    }

    function addUser(
        string memory _firstname,
        string memory _lastname,
        string memory _email
    ) public {
        for (uint i = 0; i < userCount; i++) {
            require(
                keccak256(bytes(users[usersList[i]].emailAddress)) !=
                    keccak256(bytes(_email)),
                "user with the same email already exists"
            );
        }
        User memory user = User(msg.sender, _firstname, _lastname, _email);
        users[msg.sender] = user;
        usersList[userCount] = msg.sender;
        userCount++;
        emit addUserEvent(msg.sender, user, block.timestamp);
    }

    function updateUser(
        string memory _firstname,
        string memory _lastname
    ) public isWhitelisted(msg.sender) {
        users[msg.sender].firstname = _firstname;
        users[msg.sender].lastname = _lastname;
    }

    function addContent(
        string memory _pHash,
        string memory _IPFSAddress,
        string memory _title,
        string memory _desc,
        string memory _fieldOfUse,
        uint256 _price,
        ContentType _contentType
    ) public isWhitelisted(msg.sender) {
        for (uint256 i = 0; i < contentCount; i++) {
            Content memory tmpContent = contents[i];
            require(
                keccak256(bytes(tmpContent.pHash)) != keccak256(bytes(_pHash)),
                "Content with same hash already exist"
            );
        }
        Content memory content = Content(
            msg.sender,
            contentCount,
            _pHash,
            _IPFSAddress,
            _title,
            _desc,
            _fieldOfUse,
            _price,
            block.timestamp,
            _contentType
        );
        contents[contentCount] = content;
        contentCount++;
        emit addContentEvent(msg.sender, content, block.timestamp);
    }

    function updateContentData(
        uint256 _id,
        uint256 _price,
        string memory _fieldOfUse
    ) public isWhitelisted(msg.sender) {
        Content memory content = contents[_id];
        require((bytes(content.pHash)).length != 0, "content does not exists");
        require(
            msg.sender == contents[_id].ownerAddress,
            "You are not the owner of the content"
        );
        uint256 lastPrice = content.price;
        contents[_id].price = _price;
        string memory lastFieldOfUse = content.fieldOfUse;
        contents[_id].fieldOfUse = _fieldOfUse;

        emit updateContentEvent(
            msg.sender,
            _id,
            lastPrice,
            _price,
            lastFieldOfUse,
            _fieldOfUse,
            block.timestamp
        );
    }

    function requestAgreement(
        uint256 _contentId,
        string memory _purposeOfUse,
        string memory _fieldOfUse
    ) public payable isWhitelisted(msg.sender) {
        Content memory content = contents[_contentId];
        require((bytes(content.pHash)).length != 0, "content does not exists");
        require(
            msg.sender != content.ownerAddress,
            "You are the owner.You are free to use your own content"
        );
        require(
            msg.value >= content.price,
            "Amount of Ether provided is less than content price"
        );
        for (uint256 i = 0; i < requestCount; i++) {
            Request memory tmpRequest = requests[i];
            if (
                tmpRequest.contentId == _contentId &&
                tmpRequest.licensee == msg.sender
            ) {
                require(
                    tmpRequest.requestType != RequestType.PENDING,
                    "There exist a pending request"
                );
                require(
                    tmpRequest.requestType != RequestType.APPROVED,
                    "Your request to use this content has been approved"
                );
            }
        }

        balances[content.ownerAddress] += content.price;
        if (msg.value > content.price) {
            uint256 excess = msg.value - content.price;
            payable(msg.sender).transfer(excess);
        }
        Request memory request = Request(
            requestCount,
            msg.sender,
            _contentId,
            _purposeOfUse,
            _fieldOfUse,
            content.price,
            RequestType.PENDING,
            "",
            block.timestamp
        );
        requests[requestCount] = request;
        requestCount++;
        emit requestEvent(request);
        emit transferEvent(
            msg.sender,
            address(this),
            content.price,
            block.timestamp
        );
    }

    function rejectAgreement(
        uint256 _requestId,
        string memory _rejectReason
    ) public payable isWhitelisted(msg.sender) {
        Request memory request = requests[_requestId];
        require(
            bytes(request.purposeOfUse).length != 0,
            "Request does not exist"
        );
        Content memory content = contents[request.contentId];
        require(
            content.ownerAddress == msg.sender,
            "You are not the owner of the content"
        );
        require(
            request.requestType != RequestType.APPROVED,
            "The request has already been approved"
        );
        require(
            request.requestType != RequestType.REJECTED,
            "You cannot reject a rejected request"
        );
        require(
            balances[msg.sender] > 0,
            "You have no balance left in the smart contract"
        );
        balances[msg.sender] -= request.price;
        payable(request.licensee).transfer(request.price);
        requests[_requestId].requestType = RequestType.REJECTED;
        requests[_requestId].rejectReason = _rejectReason;
        emit updateRequestEvent(
            msg.sender,
            requests[_requestId],
            block.timestamp
        );
        emit transferEvent(
            msg.sender,
            request.licensee,
            request.price,
            block.timestamp
        );
    }

    function approveAgreement(
        uint256 _requestId
    ) public payable isWhitelisted(msg.sender) {
        Request memory request = requests[_requestId];
        require(
            bytes(request.purposeOfUse).length != 0,
            "Request does not exist"
        );
        Content memory content = contents[request.contentId];
        require(
            content.ownerAddress == msg.sender,
            "You are not the owner of the content"
        );
        require(
            request.requestType != RequestType.APPROVED,
            "The request has already been approved"
        );
        require(
            request.requestType != RequestType.REJECTED,
            "You cannot approve rejected request"
        );
        require(
            balances[msg.sender] > 0,
            "You have no balance left in the smart contract"
        );
        requests[_requestId].requestType = RequestType.APPROVED;
        Agreement memory agreement = Agreement(
            agreementCount,
            request.licensee,
            msg.sender,
            content.Id,
            request.purposeOfUse,
            request.fieldOfUse,
            request.price,
            block.timestamp
        );
        agreements[agreementCount] = agreement;
        agreementCount++;
        balances[msg.sender] -= request.price;
        payable(msg.sender).transfer(request.price);
        emit updateRequestEvent(
            msg.sender,
            requests[_requestId],
            block.timestamp
        );
        emit transferEvent(
            request.licensee,
            msg.sender,
            request.price,
            block.timestamp
        );
        emit licensingEvent(agreement);
    }
}
