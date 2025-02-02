// Handle Login
const handleLogin = async (username, password) => {
  try {
    const response = await fetch("https://fakestoreapi.com/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    if (!response.ok) {
      throw new Error("Login gagal");
    }

    const data = await response.json();
    localStorage.setItem("userToken", data.token);

    // Fetch user data dan simpan ke localStorage
    const userResponse = await fetch("https://fakestoreapi.com/users/1");
    const userData = await userResponse.json();
    localStorage.setItem("userData", JSON.stringify(userData));

    // Set flag untuk menandai login baru
    localStorage.setItem("newLogin", "true");

    // Tampilkan pesan sukses dengan SweetAlert2
    Swal.fire({
      icon: "success",
      title: "Login Berhasil!",
      text: `Selamat datang, ${userData.name.firstname} ${userData.name.lastname}!`,
      timer: 1500,
      showConfirmButton: false,
    }).then(() => {
      // Redirect ke beranda
      window.location.href = "../index.html";
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Login Gagal",
      text: "Username atau password salah",
    });
    console.error("Error:", error);
  }
};

// Handle Register
const handleRegister = async (userData) => {
  try {
    const response = await fetch("https://fakestoreapi.com/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userData.email,
        username: userData.username,
        password: userData.password,
        name: {
          firstname: userData.firstname,
          lastname: userData.lastname,
        },
        address: {
          city: userData.city,
          street: userData.street,
          number: userData.number,
          zipcode: userData.zipcode,
          geolocation: {
            lat: "-37.3159",
            long: "81.1496",
          },
        },
        phone: userData.phone,
      }),
    });

    if (!response.ok) {
      throw new Error("Registrasi gagal");
    }

    const data = await response.json();
    alert("Registrasi berhasil! Silakan login.");
    window.location.href = "login.html";
  } catch (error) {
    alert("Registrasi gagal. Silakan coba lagi.");
    console.error("Error:", error);
  }
};

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      handleLogin(username, password);
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const userData = {
        email: document.getElementById("email").value,
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
        firstname: document.getElementById("firstname").value,
        lastname: document.getElementById("lastname").value,
        phone: document.getElementById("phone").value,
        street: document.getElementById("street").value,
        number: parseInt(document.getElementById("number").value),
        city: document.getElementById("city").value,
        zipcode: document.getElementById("zipcode").value,
      };
      handleRegister(userData);
    });
  }
});

// Check if user is logged in
const checkAuth = () => {
  const token = localStorage.getItem("userToken");
  if (!token) {
    window.location.href = "/account/login.html";
  }
  return token;
};

// Update fungsi logout
const logout = () => {
  Swal.fire({
    title: "Apakah Anda yakin?",
    text: "Anda akan keluar dari akun Anda",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Ya, Keluar!",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem("userToken");
      Swal.fire({
        title: "Berhasil Keluar!",
        text: "Anda telah keluar dari akun",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        window.location.href = "../account/login.html";
      });
    }
  });
};
