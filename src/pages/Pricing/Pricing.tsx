import Layout from "../../component/layouts/layout";
import Breadcrumb from "../../component/layouts/common/Breadcrumb";
import { useAuthStore } from "../../stores/authStore";
import { useGetCompanyById } from "../../hooks/useGetCompany";
import {
  SALES_CONTACT_EMAIL,
  SUBSCRIPTION_PLANS,
  type SubscriptionPlanKey,
} from "../../config/plans";

const Pricing = () => {
  const user = useAuthStore((state) => state.user);
  const isClient = user?.role === "CLIENT";
  const { data: companyData } = useGetCompanyById(
    isClient ? user?.companyId || "" : "",
  );
  const currentPlan = (companyData?.plan as SubscriptionPlanKey) || undefined;

  const buildContactHref = (planName: string) => {
    const subject = encodeURIComponent(`Upgrade request: ${planName} plan`);
    const body = encodeURIComponent(
      `Hi,\n\nWe would like to upgrade to the ${planName} plan.\n\nCompany: ${
        user?.name || ""
      }\n\nThank you.`,
    );
    return `mailto:${SALES_CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <Layout>
      <div className="card card-bordered w-full bg-base-100 mb-6">
        <div className="card-body">
          <Breadcrumb
            items={[{ label: "Home", path: "/" }, { label: "Plans & Pricing" }]}
          />
          <h1 className="mt-2 text-3xl font-bold">Plans & Pricing</h1>
          <p className="text-base-content/70">
            Upgrades are handled manually — pick the plan that fits your team and
            contact us to activate it.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {SUBSCRIPTION_PLANS.map((plan) => {
          const isCurrent = currentPlan === plan.key;
          return (
            <div
              key={plan.key}
              className={`card border bg-base-100 shadow-sm transition-all hover:shadow-md ${
                plan.highlight
                  ? "border-primary ring-1 ring-primary/30"
                  : "border-base-300"
              }`}
            >
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">{plan.name}</h2>
                  {plan.highlight && (
                    <span className="badge badge-primary badge-sm">Popular</span>
                  )}
                </div>

                <div className="mt-2">
                  <span className="text-2xl font-extrabold">
                    {plan.priceLabel}
                  </span>
                </div>
                <p className="text-sm text-base-content/70">
                  {plan.employeeRange}
                </p>

                <ul className="mt-4 space-y-2 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <span className="mt-0.5 text-success">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="card-actions mt-6">
                  {isCurrent ? (
                    <span className="btn btn-disabled btn-block">
                      Current plan
                    </span>
                  ) : plan.key === "FREE" ? (
                    <span className="btn btn-ghost btn-block no-animation">
                      Included
                    </span>
                  ) : (
                    <a
                      href={buildContactHref(plan.name)}
                      className={`btn btn-block ${
                        plan.highlight ? "btn-primary" : "btn-outline"
                      }`}
                    >
                      Contact us
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-xl border border-base-300 bg-base-100 p-4 text-sm text-base-content/70">
        Need a custom quote or API integration? Email us at{" "}
        <a className="link link-primary" href={`mailto:${SALES_CONTACT_EMAIL}`}>
          {SALES_CONTACT_EMAIL}
        </a>
        .
      </div>
    </Layout>
  );
};

export default Pricing;
