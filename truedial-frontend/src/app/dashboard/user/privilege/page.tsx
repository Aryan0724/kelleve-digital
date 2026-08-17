import { redirect } from "next/navigation";
// Privilege card details are on the main user dashboard
export default function PrivilegeRedirectPage() {
  redirect("/dashboard/user");
}
