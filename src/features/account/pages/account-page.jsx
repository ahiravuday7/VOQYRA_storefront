import { BadgeCheck, Mail, Phone, UserRound } from "lucide-react";
import { useOutletContext } from "react-router-dom";

function AccountPage() {
  const { user } = useOutletContext();

  return (
    <div className="rounded-2xl border border-cloud bg-soft-white p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate">Profile</p>

      <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em]">Your details.</h2>

      <p className="mt-3 text-sm leading-6 text-slate">
        These details come from your authenticated VOQYRA account.
      </p>

      <div className="mt-8 divide-y divide-cloud border-y border-cloud">
        <div className="flex gap-4 py-5">
          <UserRound className="mt-0.5 size-5 shrink-0 text-slate" aria-hidden="true" />

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate">Name</p>

            <p className="mt-1 font-semibold">
              {user.fullName ||
                `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() ||
                "Not provided"}
            </p>
          </div>
        </div>

        <div className="flex gap-4 py-5">
          <Mail className="mt-0.5 size-5 shrink-0 text-slate" aria-hidden="true" />

          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate">Email</p>

            <p className="mt-1 break-all font-semibold">{user.email ?? "Not provided"}</p>
          </div>
        </div>

        <div className="flex gap-4 py-5">
          <Phone className="mt-0.5 size-5 shrink-0 text-slate" aria-hidden="true" />

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate">Phone</p>

            <p className="mt-1 font-semibold">{user.phone ?? "Not provided"}</p>
          </div>
        </div>

        <div className="flex gap-4 py-5">
          <BadgeCheck className="mt-0.5 size-5 shrink-0 text-slate" aria-hidden="true" />

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate">
              Email verification
            </p>

            <p className="mt-1 font-semibold">
              {user.isEmailVerified ? "Verified" : "Not verified"}
            </p>
          </div>
        </div>
      </div>

      <p className="mt-5 text-xs leading-5 text-slate">
        Profile editing is not part of the current Backend v1 account API, so these details are
        read-only.
      </p>
    </div>
  );
}

export { AccountPage };
