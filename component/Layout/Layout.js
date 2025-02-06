import { useEffect, useState } from "react";
import NavHourlyProduction from "../Common/NavHourlyProduction";
import { useRouter } from "next/router";

function LayoutOfHourlyProduction({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        // API call to check authentication and role
        const response = await fetch("/api/LoginSystem/checkAuth", {
          method: "GET",
          credentials: "include", // Include cookies in the request
        });
        const data = await response.json();

        if (response.ok && data.role === "user") {
          setIsLoading(false); // User authenticated and role is 'user'
        } else {
          // Redirect to login if not authenticated or role is not 'user'
          router.replace("/login");
        }
      } catch (error) {
        // In case of error, redirect to login
        router.replace("/login");
      }
    }

    checkAuth();
  }, [router]); // Dependency on router for re-rendering

  // Loading state while checking authentication
  if (isLoading) return null;

  return (
    <>
      <NavHourlyProduction />
      {children}
    </>
  );
}

export default LayoutOfHourlyProduction;
