module.exports = {
    NULL_VALUE: '필요한 값이 없습니다',
    OUT_OF_VALUE: '파라미터 값이 잘못되었습니다',
    REQUIRE_LOGIN: '로그인이 필요한 api입니다.',

    // 회원가입
    CREATED_USER: '회원 가입 성공',
    DELETE_USER: '회원 탈퇴 성공',
    CREATED_AND_LOGIN: '회원 가입 후 로그인 성공',
    ALREADY_ID: '이미 사용중인 아이디입니다.',
    ALREADY_EMAIL: '이미 등록된 이메일입니다.',
    AVAILABLE_EMAIL: '가입 가능한 이메일입니다.',
    ALREADY_NICKNAME: '이미 사용중인 닉네임입니다.',
    AVAILABLE_NICKNAME: '사용 가능한 닉네임입니다.',
    NOT_EMAIL_FORM: '이메일 형식을 확인주세요.',
    NOT_PASSWORD_FORM: '비밀번호는 영문 숫자 특수문자 포함 10~20자로 입력해주세요.',
    NOT_NAME_FORM: '이름은 특수문자 제외 글자와 숫자 포함 10자 이내로 입력해주세요.',
    NOT_CHECK_EMAIL: '이메일 중복확인을 해주세요.',
    NULL_SIGNUP_VALUE: '입력항목을 확인해주세요.',

    // 로그인
    LOGIN_SUCCESS: '로그인 성공',
    LOGIN_FAIL: '이메일을 확인해주세요',
    NO_USER: '존재하지 않는 회원입니다.',
    MISS_MATCH_PW: '비밀번호를 확인해주세요.',
    NO_USER_PW : 'ID/PW를 확인해주세요',

    // 로그아웃
    SESSION_NOT_DESTROYED: '세션 만료 실패',
    SESSION_DESTROYED: '세션 만료. 로그아웃 성공',
    LOGOUT_SUCCESS: '로그아웃 성공',

    //ID/PW 찾기
    GET_ACCOUT_SUCCESS: '해당 계정 확인 조회 성공', 
    GET_ACCOUT_FAIL: '해당 계정이 존재하지 않습니다.',

    // 인증
    EMPTY_TOKEN: '토큰 값이 없습니다.',
    EXPIRED_TOKEN: '토큰 값이 만료되었습니다.',
    INVALID_TOKEN: '유효하지 않은 토큰값입니다.',
    AUTH_SUCCESS: '인증에 성공했습니다.',
    ISSUE_SUCCESS: '새로운 토큰이 생성되었습니다.',
    
    // 프로필 조회
    READ_PROFILE_SUCCESS: '프로필 조회 성공',
    READ_PROFILE_FAIL: '정보가 없습니다.',
    UNSUPPORTED_TYPE: '지원하지 않는 타입입니다.',
    // 이미지 업데이트
    UPDATE_IMAGE_SUCCESS: '이미지 업데이트 성공',
    // 프로필 업데이트
    UPDATE_PROFILE_SUCCESS: '프로필 업데이트 성공',

    SHOW_ALL_BY_ID: '홈 카테고리 클릭',
    SHOW_BY_MAIN: 'MAIN 카테고리 중 하나 클릭',
    SHOW_BY_SUB: 'SUB 카테고리 중 하나 클릭',
    DB_ERROR: 'DB 오류'

};