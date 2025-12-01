// app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="home-root">
      {/* 왼쪽: 소개 영역 */}
      <section className="home-hero">
        <h2 className="home-title">SmartAttend</h2>
        <p className="home-subtitle">
          관리자는 시스템을 설정하고, 교원은 출석을 관리하며,
          <br />
          학생은 한 번의 클릭으로 출석을 완료하는
          <br />
          통합 출석 관리 웹 시스템입니다.
        </p>

        <div className="home-actions">
          <Link href="/login" className="btn btn-primary">
            로그인 하러 가기
          </Link>
          {/* 나중에 역할별 바로가기 만들고 싶으면 여기에 추가 */}
          {/* <Link href="/student/dashboard" className="btn btn-outline">
            학생 대시보드 예시 보기
          </Link> */}
        </div>

        <p className="home-note">
          ※ 실제 사용 시에는 로그인 후 <strong>학생 / 교원 / 관리자</strong>{" "}
          권한에 따라
          <br />
          각자의 대시보드로 이동합니다.
        </p>
      </section>

      {/* 오른쪽: 역할 카드 영역 */}
      <section className="home-roles">
        <div className="role-card">
          <h3>학생(Student)</h3>
          <ul>
            <li>오늘 수업 확인 및 출석 체크</li>
            <li>주차별 출석 현황 조회</li>
            <li>공결 신청 및 이의제기</li>
          </ul>
        </div>

        <div className="role-card">
          <h3>교원(Instructor)</h3>
          <ul>
            <li>강의별 출석 열기 / 마감</li>
            <li>실시간 출석 현황 확인</li>
            <li>공결 / 이의 처리 및 공지</li>
          </ul>
        </div>

        <div className="role-card">
          <h3>관리자(Admin)</h3>
          <ul>
            <li>학기 / 과목 / 사용자 관리</li>
            <li>출석 정책 및 리포트</li>
            <li>출석 변경 감사 로그 확인</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
