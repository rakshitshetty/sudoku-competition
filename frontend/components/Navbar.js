import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "../styles/Navbar.module.css";

const Navbar = () => {
  const router = useRouter();
  const [username, setUsername] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUsername(localStorage.getItem("username"));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    router.push("/login");
  };

  return (
    <nav className={styles.navbar}>
      {username ? (
        <>
          <span className={styles.username}>👤 {username}</span>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </>
      ) : (
        <Link href="/login" className={styles.loginBtn}>
          🔐 Login
        </Link>
      )}
    </nav>
  );
};

export default Navbar;
