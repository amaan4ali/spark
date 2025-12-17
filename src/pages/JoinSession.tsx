import { useParams, useNavigate } from "react-router-dom";
import { SessionFlow } from "@/components/SessionFlow";

export default function JoinSession() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();

  return (
    <SessionFlow
      sessionCode={code}
      onBack={() => navigate("/")}
    />
  );
}
