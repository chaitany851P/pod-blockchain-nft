// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CourseCompletionNFT
 * @notice Issues non-transferable (soulbound) NFT certificates upon course completion.
 * @dev Each NFT stores course name, completion date, skills learned, and student address on-chain.
 *      NFTs are soulbound — they cannot be transferred after minting.
 */
contract CourseCompletionNFT {
    // ──────────────────────────────────────────────
    // Types
    // ──────────────────────────────────────────────
    struct Certificate {
        string courseName;
        string studentName;
        uint256 completionDate;
        string[] skillsLearned;
        uint256 totalModules;
        uint256 quizScore; // percentage 0-100
        address student;
        string metadataURI; // optional off-chain metadata (image, etc.)
    }

    struct Course {
        string name;
        string description;
        uint256 totalModules;
        uint256 totalQuizzes;
        bool isActive;
        uint256 enrolledCount;
        uint256 completedCount;
        string[] skills;
    }

    struct StudentProgress {
        uint256 completedModules;
        uint256 quizScore;
        bool hasMinted;
        bool isEnrolled;
    }

    // ──────────────────────────────────────────────
    // State Variables
    // ──────────────────────────────────────────────
    string public name = "CourseCompletionNFT";
    string public symbol = "CCNFT";

    address public owner;
    address public instructor;

    uint256 private _nextTokenId;
    uint256 private _nextCourseId;

    // tokenId => Certificate
    mapping(uint256 => Certificate) public certificates;

    // tokenId => owner
    mapping(uint256 => address) private _owners;

    // owner => token count
    mapping(address => uint256) private _balances;

    // courseId => Course
    mapping(uint256 => Course) public courses;

    // courseId => student => StudentProgress
    mapping(uint256 => mapping(address => StudentProgress)) public studentProgress;

    // student => list of token IDs they own
    mapping(address => uint256[]) private _ownedTokens;

    // ──────────────────────────────────────────────
    // Events
    // ──────────────────────────────────────────────
    event CourseCreated(uint256 indexed courseId, string name, uint256 totalModules);
    event StudentEnrolled(uint256 indexed courseId, address indexed student);
    event ModuleCompleted(uint256 indexed courseId, address indexed student, uint256 completedModules);
    event QuizCompleted(uint256 indexed courseId, address indexed student, uint256 score);
    event CertificateMinted(
        uint256 indexed tokenId,
        uint256 indexed courseId,
        address indexed student,
        string courseName,
        uint256 completionDate
    );
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

    // ──────────────────────────────────────────────
    // Errors
    // ──────────────────────────────────────────────
    error NotOwner();
    error NotInstructor();
    error CourseNotActive();
    error AlreadyEnrolled();
    error NotEnrolled();
    error CourseNotCompleted();
    error AlreadyMinted();
    error SoulboundTransferNotAllowed();
    error InvalidTokenId();

    // ──────────────────────────────────────────────
    // Modifiers
    // ──────────────────────────────────────────────
    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    modifier onlyInstructor() {
        if (msg.sender != instructor && msg.sender != owner) revert NotInstructor();
        _;
    }

    // ──────────────────────────────────────────────
    // Constructor
    // ──────────────────────────────────────────────
    constructor(address _instructor) {
        owner = msg.sender;
        instructor = _instructor;
    }

    // ──────────────────────────────────────────────
    // Course Management (Instructor)
    // ──────────────────────────────────────────────

    /// @notice Create a new course
    function createCourse(
        string calldata _name,
        string calldata _description,
        uint256 _totalModules,
        uint256 _totalQuizzes,
        string[] calldata _skills
    ) external onlyInstructor returns (uint256) {
        uint256 courseId = _nextCourseId++;
        Course storage course = courses[courseId];
        course.name = _name;
        course.description = _description;
        course.totalModules = _totalModules;
        course.totalQuizzes = _totalQuizzes;
        course.isActive = true;
        course.skills = _skills;

        emit CourseCreated(courseId, _name, _totalModules);
        return courseId;
    }

    /// @notice Toggle course active status
    function setCourseActive(uint256 courseId, bool active) external onlyInstructor {
        courses[courseId].isActive = active;
    }

    // ──────────────────────────────────────────────
    // Student Actions
    // ──────────────────────────────────────────────

    /// @notice Enroll in a course
    function enroll(uint256 courseId) external {
        if (!courses[courseId].isActive) revert CourseNotActive();
        StudentProgress storage progress = studentProgress[courseId][msg.sender];
        if (progress.isEnrolled) revert AlreadyEnrolled();

        progress.isEnrolled = true;
        courses[courseId].enrolledCount++;

        emit StudentEnrolled(courseId, msg.sender);
    }

    /// @notice Mark a module as completed (called by instructor or backend oracle)
    function completeModule(uint256 courseId, address student) external onlyInstructor {
        StudentProgress storage progress = studentProgress[courseId][student];
        if (!progress.isEnrolled) revert NotEnrolled();

        progress.completedModules++;
        emit ModuleCompleted(courseId, student, progress.completedModules);
    }

    /// @notice Record quiz score (called by instructor or backend oracle)
    function recordQuizScore(uint256 courseId, address student, uint256 score) external onlyInstructor {
        StudentProgress storage progress = studentProgress[courseId][student];
        if (!progress.isEnrolled) revert NotEnrolled();

        progress.quizScore = score;
        emit QuizCompleted(courseId, student, score);
    }

    /// @notice Mint a completion NFT once all modules are done
    function mintCertificate(
        uint256 courseId,
        string calldata studentName,
        string calldata metadataURI
    ) external {
        Course storage course = courses[courseId];
        StudentProgress storage progress = studentProgress[courseId][msg.sender];

        if (!progress.isEnrolled) revert NotEnrolled();
        if (progress.completedModules < course.totalModules) revert CourseNotCompleted();
        if (progress.hasMinted) revert AlreadyMinted();

        progress.hasMinted = true;
        course.completedCount++;

        uint256 tokenId = _nextTokenId++;

        // Store certificate on-chain
        Certificate storage cert = certificates[tokenId];
        cert.courseName = course.name;
        cert.studentName = studentName;
        cert.completionDate = block.timestamp;
        cert.skillsLearned = course.skills;
        cert.totalModules = course.totalModules;
        cert.quizScore = progress.quizScore;
        cert.student = msg.sender;
        cert.metadataURI = metadataURI;

        // Mint the NFT
        _owners[tokenId] = msg.sender;
        _balances[msg.sender]++;
        _ownedTokens[msg.sender].push(tokenId);

        emit Transfer(address(0), msg.sender, tokenId);
        emit CertificateMinted(tokenId, courseId, msg.sender, course.name, block.timestamp);
    }

    // ──────────────────────────────────────────────
    // View Functions
    // ──────────────────────────────────────────────

    function balanceOf(address _owner) external view returns (uint256) {
        return _balances[_owner];
    }

    function ownerOf(uint256 tokenId) external view returns (address) {
        address tokenOwner = _owners[tokenId];
        if (tokenOwner == address(0)) revert InvalidTokenId();
        return tokenOwner;
    }

    function getCertificate(uint256 tokenId) external view returns (Certificate memory) {
        if (_owners[tokenId] == address(0)) revert InvalidTokenId();
        return certificates[tokenId];
    }

    function getStudentTokens(address student) external view returns (uint256[] memory) {
        return _ownedTokens[student];
    }

    function getCourseSkills(uint256 courseId) external view returns (string[] memory) {
        return courses[courseId].skills;
    }

    function totalSupply() external view returns (uint256) {
        return _nextTokenId;
    }

    function totalCourses() external view returns (uint256) {
        return _nextCourseId;
    }

    // ──────────────────────────────────────────────
    // Soulbound: Block Transfers
    // ──────────────────────────────────────────────

    /// @notice Transfers are blocked — certificates are soulbound
    function transferFrom(address, address, uint256) external pure {
        revert SoulboundTransferNotAllowed();
    }

    function safeTransferFrom(address, address, uint256) external pure {
        revert SoulboundTransferNotAllowed();
    }

    function safeTransferFrom(address, address, uint256, bytes calldata) external pure {
        revert SoulboundTransferNotAllowed();
    }

    function approve(address, uint256) external pure {
        revert SoulboundTransferNotAllowed();
    }

    function setApprovalForAll(address, bool) external pure {
        revert SoulboundTransferNotAllowed();
    }

    // ──────────────────────────────────────────────
    // Admin
    // ──────────────────────────────────────────────

    function setInstructor(address _instructor) external onlyOwner {
        instructor = _instructor;
    }

    /// @notice ERC-165 interface detection
    function supportsInterface(bytes4 interfaceId) external pure returns (bool) {
        return interfaceId == 0x80ac58cd || // ERC-721
               interfaceId == 0x01ffc9a7;   // ERC-165
    }
}
