import { CheckoutSuccess } from "@/components/billing/checkout-success";

export const metadata = { title: "Subscription confirmed" };

export default async function BillingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  return (
    <div className="py-10">
      <CheckoutSuccess sessionId={session_id} />
    </div>
  );
}
