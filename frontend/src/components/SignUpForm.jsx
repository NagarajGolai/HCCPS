import OtpAuthCard from "./OtpAuthCard";

export default function SignUpForm(props) {
  return (
    <OtpAuthCard
      purpose="signup"
      title="Sign up"
      subtitle="Create your PropVerse profile. Name and email are used for your workspace."
      showFullName
      {...props}
    />
  );
}
