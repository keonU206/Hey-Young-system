export default function ProfilePage() {
  // 실제 구현 시에는 서버에서 로그인한 유저 정보 불러와서 채우면 됨
  const dummyUser = {
    name: "김건우",
    studentId: "202312345",
    email: "202312345@school.ac.kr",
    role: "학생", // 또는 "교원", "관리자"
    department: "컴퓨터공학과",
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <h1 className="page-title">내 정보</h1>
      <p className="page-subtitle">
        SmartAttend 출석 관리 시스템에서 사용하는 계정 정보를 확인할 수
        있습니다.
      </p>

      <section className="card">
        <h2 className="card-title">기본 정보</h2>

        <div className="profile-grid">
          <div className="form-field">
            <label>이름</label>
            <input type="text" value={dummyUser.name} readOnly />
          </div>

          <div className="form-field">
            <label>역할</label>
            <input type="text" value={dummyUser.role} readOnly />
          </div>

          <div className="form-field">
            <label>학번 / 사번</label>
            <input type="text" value={dummyUser.studentId} readOnly />
          </div>

          <div className="form-field">
            <label>학과</label>
            <input type="text" value={dummyUser.department} readOnly />
          </div>

          <div className="form-field">
            <label>이메일</label>
            <input type="email" value={dummyUser.email} readOnly />
          </div>
        </div>

        <p className="profile-note">
          기본 정보는 학교 시스템과 연동되며, 직접 수정할 수 없습니다.
        </p>
      </section>

      <section className="card mt-24">
        <h2 className="card-title">비밀번호 변경</h2>
        <p className="card-desc">
          현재 버전에서는 UI만 제공되며, 추후 백엔드와 연동하여 실제 비밀번호
          변경 기능을 구현할 수 있습니다.
        </p>

        <form className="login-form">
          <div className="form-field">
            <label htmlFor="currentPassword">현재 비밀번호</label>
            <input
              id="currentPassword"
              type="password"
              placeholder="현재 비밀번호를 입력하세요"
            />
          </div>

          <div className="form-field">
            <label htmlFor="newPassword">새 비밀번호</label>
            <input
              id="newPassword"
              type="password"
              placeholder="새 비밀번호를 입력하세요"
            />
          </div>

          <div className="form-field">
            <label htmlFor="confirmPassword">새 비밀번호 확인</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="한 번 더 입력하세요"
            />
          </div>

          <button type="button" className="btn btn-primary login-submit">
            비밀번호 변경 (예시 버튼)
          </button>
        </form>
      </section>
    </div>
  );
}
