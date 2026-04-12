import OtpAuthCard from "./OtpAuthCard";

export default function SignInForm(props) {
  return (
    <OtpAuthCard
      purpose="signin"
      title="Sign in"
      subtitle="Use the email on your account. We will send a one-time code."
      showFullName={false}
      {...props}
    />
  );
}
