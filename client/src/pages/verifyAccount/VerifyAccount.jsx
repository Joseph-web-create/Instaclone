import { useNavigate, useParams } from "react-router";
import { verifyEmailAccount } from "../../api/auth";
import { useEffect, useState } from "react";
import handleError from "../../utils/handlleError";
import { useAuth } from "../../store";
import { toast } from "sonner";
import { DataSpinner } from "../../componet/Spinner/";
import MetaArgs from "../../componet/MetaArgs";

const VerifyAccount = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { userId, verificationToken } = useParams();
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const verify = async () => {
      try {
        const res = await verifyEmailAccount(
          userId,
          verificationToken,
          accessToken
        );
        if (isMounted && res.status === 200) {
          setIsLoading(false);
          setIsSuccess(res.data.success);
          toast.success(res.data.message, { id: "verifySuccess" });
          setTimeout(() => (window.location.href = "/"), 1500);
        }
      } catch (error) {
        if (isMounted) {
          handleError(error);
        }
      }
    };
    verify();
    return () => (isMounted = false);
  }, [accessToken, userId, verificationToken]);
  if (isLoading) {
    return <DataSpinner />;
  }

  return (
    <>
      <MetaArgs
        title="Verify your email account"
        content="Verify your email account"
      />
      <div className="flex justify-center flex-col items-center min-h-screen gap-4">
        {isSuccess ? (
          <>
            <h1 className="text-2xl">
              You have successfully verify your account
            </h1>
            <p className="text-gray-600">Redirecting you to the home page...</p>
          </>
        ) : (
          <>
            <h1 className="text-2xl">
              There was a problem verifying your account
            </h1>
            <button
              className="btn bg-[#8d0d76] w-[250px] text-white"
              onClick={() => navigate("/verify-email")}
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default VerifyAccount;
