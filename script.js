// 탭 전환
const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

loginTab.addEventListener("click", () => {
  loginForm.classList.remove("hidden");
  signupForm.classList.add("hidden");
  loginTab.classList.add("active");
  signupTab.classList.remove("active");
});

signupTab.addEventListener("click", () => {
  signupForm.classList.remove("hidden");
  loginForm.classList.add("hidden");
  signupTab.classList.add("active");
  loginTab.classList.remove("active");
});

// 회원가입
async function SignUp(event) {
  event.preventDefault();
  const signup_userid = document.getElementById("signup_userid").value.trim();
  const signup_password = document.getElementById("signup_password").value.trim();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const result = document.getElementById("result");

  if (!signup_userid || !signup_password || !name || !email) {
    alert("모든 값을 입력해주세요!");
    return;
  }

  try {
    const response = await fetch("http://localhost:8080/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userid: signup_userid, password: signup_password, name, email })
    });

    const data = await response.json();

    if (response.ok) {
      alert("회원가입 성공! 사용자: " + data.userid);
      result.innerText = JSON.stringify(data);
    } else {
      alert("회원가입 실패: " + (data.message || "에러 발생"));
    }
  } catch (err) {
    alert("서버 연결 실패: " + err.message);
  }
}

// 로그인
async function Login(event) {
  event.preventDefault();
  const login_userid = document.getElementById("login_userid").value.trim();
  const login_password = document.getElementById("login_password").value.trim();
  const result = document.getElementById("result");

  if (!login_userid || !login_password) {
    alert("아이디와 비밀번호를 입력해주세요");
    return;
  }

  try {
    const response = await fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userid: login_userid, password: login_password })
    });

    const data = await response.json();

    if (response.ok) {
      alert("로그인 성공! 사용자: " + data.userid);
      localStorage.setItem("token", data.token);
      result.innerText = JSON.stringify(data);
    } else {
      alert("로그인 실패: " + (data.message || "에러 발생"));
    }
  } catch (err) {
    alert("서버 연결 실패: " + err.message);
  }
}
