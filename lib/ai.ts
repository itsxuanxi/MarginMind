import { SKUS, byMarket, topProducts, worstProducts } from "./mock-data";
import { LEAKS, leakSummary } from "./leaks";
import { summarize } from "./profit";
import { formatCurrency, formatPercent } from "./format";
import type { AiRecommendation, Sku } from "./types";

/**
 * AI Profit Agent core.
 *
 * `buildRecommendations` and `mockChatAnswer` are fully self-contained
 * so the agent always works, even with no OpenAI key. When a key IS
 * present, the API route augments these with a live model call using
 * `buildContext()` as grounding.
 */

const summary = summarize(SKUS);

const byMargin = (a: Sku, b: Sku) => a.marginPct - b.marginPct;

export function buildRecommendations(): AiRecommendation[] {
  const recs: AiRecommendation[] = [];
  const worst = worstProducts(3);
  const best = topProducts(3);
  const markets = [...byMarket()].sort((a, b) => b.margin - a.margin);
  const bestMarket = markets[0];
  const thin = [...SKUS]
    .filter((s) => s.status === "Low Margin" || s.status === "At Risk")
    .sort(byMargin)[0];
  const heavyAd = [...SKUS].sort((a, b) => b.adSpend / b.revenue - a.adSpend / a.revenue)[0];
  const heavyShip = [...SKUS].sort(
    (a, b) => b.shippingCost / b.revenue - a.shippingCost / a.revenue
  )[0];
  const loser = worst[0];
  const topWinner = best[0];

  if (thin) {
    const lift = Math.round(thin.revenue * 0.06);
    recs.push({
      id: "rec-pricing",
      title: `Raise price on ${thin.sku} by 6–8%`,
      category: "Pricing",
      priority: "High",
      confidence: 88,
      monthlyImpact: lift,
      explanation: `${thin.productName} runs a thin ${formatPercent(
        thin.marginPct
      )} net margin. Demand in ${thin.market} is price-inelastic in this category; a modest increase flows almost entirely to the bottom line.`,
      suggestedAction: `Increase list price ~7% and monitor conversion for 14 days. Expected to add ~${formatCurrency(
        lift
      )}/mo with minimal volume loss.`,
      relatedSku: thin.sku,
    });
  }

  if (heavyAd) {
    const save = Math.round(heavyAd.adSpend * 0.35);
    recs.push({
      id: "rec-adbudget",
      title: `Cut ad spend on ${heavyAd.sku} by 35%`,
      category: "Ad Budget",
      priority: "Critical",
      confidence: 91,
      monthlyImpact: save,
      explanation: `${heavyAd.productName} spends ${formatCurrency(
        heavyAd.adSpend
      )}/mo on ads (${formatPercent(
        (heavyAd.adSpend / heavyAd.revenue) * 100
      )} of revenue) at a ROAS that no longer covers fulfillment. The bottom 35% of ad sets are pure leakage.`,
      suggestedAction: `Pause the lowest-ROAS ad sets and reallocate ${formatCurrency(
        Math.round(save * 0.5)
      )} to ${topWinner.sku}. Net profit improvement ~${formatCurrency(save)}/mo.`,
      relatedSku: heavyAd.sku,
    });
  }

  if (bestMarket) {
    const impact = Math.round(bestMarket.revenue * 0.12);
    recs.push({
      id: "rec-market",
      title: `Expand winning catalog into ${bestMarket.market}`,
      category: "Market Expansion",
      priority: "Medium",
      confidence: 79,
      monthlyImpact: impact,
      explanation: `${bestMarket.market} is your highest-margin market at ${formatPercent(
        bestMarket.margin
      )} net. Your top home-market winners aren't fully listed there yet.`,
      suggestedAction: `List your 3 best-margin SKUs in ${bestMarket.market} and mirror the ad mix. Conservative upside ~${formatCurrency(
        impact
      )}/mo.`,
    });
  }

  if (heavyShip) {
    const save = Math.round((heavyShip.shippingCost - heavyShip.revenue * 0.08) * 0.6);
    recs.push({
      id: "rec-shipping",
      title: `Move ${heavyShip.sku} to regional fulfillment`,
      category: "Shipping",
      priority: "High",
      confidence: 84,
      monthlyImpact: Math.max(0, save),
      explanation: `Shipping on ${heavyShip.productName} is ${formatPercent(
        (heavyShip.shippingCost / heavyShip.revenue) * 100
      )} of revenue. Long-zone parcels to ${heavyShip.market} are the culprit.`,
      suggestedAction: `Stock inventory in a ${heavyShip.market}-local 3PL to collapse shipping zones. Estimated saving ~${formatCurrency(
        Math.max(0, save)
      )}/mo.`,
      relatedSku: heavyShip.sku,
    });
  }

  recs.push({
    id: "rec-inventory",
    title: `Prioritize restock & ad budget on ${topWinner.sku}`,
    category: "Inventory",
    priority: "Medium",
    confidence: 86,
    monthlyImpact: Math.round(topWinner.netProfit * 0.2),
    explanation: `${topWinner.productName} is your single most profitable SKU at ${formatCurrency(
      topWinner.netProfit
    )}/mo net (${formatPercent(topWinner.marginPct)} margin). It's under-funded relative to its return.`,
    suggestedAction: `Guarantee stock coverage and shift freed ad budget here. Scaling 20% adds ~${formatCurrency(
      Math.round(topWinner.netProfit * 0.2)
    )}/mo.`,
    relatedSku: topWinner.sku,
  });

  if (loser && loser.netProfit < 0) {
    recs.push({
      id: "rec-discontinue",
      title: `Discontinue or reprice ${loser.sku}`,
      category: "Discontinuation",
      priority: "Critical",
      confidence: 82,
      monthlyImpact: Math.abs(loser.netProfit),
      explanation: `${loser.productName} loses ${formatCurrency(
        Math.abs(loser.netProfit)
      )}/mo on ${formatCurrency(loser.revenue)} revenue. Every sale deepens the loss.`,
      suggestedAction: `Sunset the SKU or restructure its unit economics (price +15%, drop ads, switch carrier). Stopping the bleed recovers ~${formatCurrency(
        Math.abs(loser.netProfit)
      )}/mo.`,
      relatedSku: loser.sku,
    });
  }

  const ls = leakSummary();
  recs.push({
    id: "rec-margin",
    title: "Execute the top 5 leak fixes this month",
    category: "Margin",
    priority: "High",
    confidence: 90,
    monthlyImpact: Math.round(LEAKS.slice(0, 5).reduce((s, l) => s + l.monthlyLoss, 0) * 0.7),
    explanation: `MarginMind found ${ls.count} active profit leaks totaling ${formatCurrency(
      ls.totalMonthly
    )}/mo across ${ls.affectedSkus} SKUs. The top 5 alone are ~70% recoverable.`,
    suggestedAction:
      "Work the Profit Leaks queue top-down. Closing the five biggest leaks compounds to a material annual margin gain.",
  });

  return recs.sort((a, b) => b.monthlyImpact - a.monthlyImpact);
}

export const RECOMMENDATIONS = buildRecommendations();

/** Compact grounding context for an LLM prompt. */
export function buildContext(): string {
  const markets = byMarket()
    .map((m) => `${m.market}: ${formatPercent(m.margin)} margin, ${formatCurrency(m.revenue)} rev`)
    .join("; ");
  const losers = SKUS.filter((s) => s.netProfit < 0)
    .map((s) => `${s.sku} (${s.productName}) net ${formatCurrency(s.netProfit)}`)
    .join("; ");
  const ls = leakSummary();
  return [
    `Business snapshot (monthly): revenue ${formatCurrency(summary.revenue)}, net profit ${formatCurrency(
      summary.netProfit
    )}, avg margin ${formatPercent(summary.avgMargin)}, ad spend ${formatCurrency(summary.adSpend)}.`,
    `Markets — ${markets}.`,
    `Profit leaks: ${ls.count} totaling ${formatCurrency(ls.totalMonthly)}/mo.`,
    `Money-losing SKUs: ${losers || "none"}.`,
    `Best SKU: ${topProducts(1)[0].sku}. Worst SKU: ${worstProducts(1)[0].sku}.`,
  ].join("\n");
}

export const SUGGESTED_QUESTIONS = [
  "Which products are losing money?",
  "Where should I cut ad spend?",
  "Which market has the highest margin?",
  "How can I increase profit next month?",
  "Which products should I discontinue?",
];

/** Deterministic, high-quality fallback answers grounded in real data. */
export function mockChatAnswer(question: string): string {
  const q = question.toLowerCase();
  const fmtList = (skus: Sku[]) =>
    skus
      .map(
        (s) =>
          `• **${s.sku} — ${s.productName}**: ${formatCurrency(s.netProfit)}/mo net (${formatPercent(
            s.marginPct
          )} margin) on ${formatCurrency(s.revenue)} revenue`
      )
      .join("\n");

  if (/(lose|losing|unprofitable|negative)/.test(q)) {
    const losers = SKUS.filter((s) => s.netProfit < 0).sort((a, b) => a.netProfit - b.netProfit);
    if (!losers.length) return "Good news — no SKUs are currently net-negative.";
    const total = losers.reduce((s, k) => s + Math.abs(k.netProfit), 0);
    return `You have **${losers.length} SKUs losing money**, bleeding **${formatCurrency(
      total
    )}/mo** combined:\n\n${fmtList(losers)}\n\nThe fastest win is repricing or pausing ads on the worst offender. Closing all of them recovers about **${formatCurrency(
      total * 12
    )}/yr**.`;
  }

  if (/(ad|advertis|roas|marketing)/.test(q)) {
    const heavy = [...SKUS]
      .sort((a, b) => b.adSpend / b.revenue - a.adSpend / a.revenue)
      .slice(0, 3);
    return `Cut ad spend where ROAS no longer covers fulfillment. Top candidates:\n\n${heavy
      .map(
        (s) =>
          `• **${s.sku}** — ${formatCurrency(s.adSpend)}/mo (${formatPercent(
            (s.adSpend / s.revenue) * 100
          )} of revenue), ${formatPercent(s.marginPct)} net margin`
      )
      .join(
        "\n"
      )}\n\nStart by trimming ~35% from the highest ad-to-revenue SKU and reallocating to your best margin winner.`;
  }

  if (/(market|country|region|geograph)/.test(q)) {
    const markets = [...byMarket()].sort((a, b) => b.margin - a.margin);
    return `Ranked by net margin:\n\n${markets
      .map(
        (m, i) =>
          `${i + 1}. **${m.market}** — ${formatPercent(m.margin)} margin, ${formatCurrency(
            m.revenue
          )} revenue`
      )
      .join("\n")}\n\n**${markets[0].market}** is your most profitable market. Consider expanding your best SKUs there before scaling lower-margin regions.`;
  }

  if (/(discontinue|drop|kill|cut product|sunset)/.test(q)) {
    const worst = worstProducts(3).filter((s) => s.netProfit < 0);
    if (!worst.length) return "Nothing needs discontinuing right now — all SKUs are contribution-positive.";
    return `Strong candidates to discontinue or restructure:\n\n${fmtList(
      worst
    )}\n\nBefore cutting, try a price increase + ad pause. If unit economics stay negative, sunset them.`;
  }

  if (/(increase|improve|grow|next month|more profit|boost)/.test(q)) {
    const recs = RECOMMENDATIONS.slice(0, 3);
    const total = recs.reduce((s, r) => s + r.monthlyImpact, 0);
    return `Here's how to add roughly **${formatCurrency(total)}/mo** next month:\n\n${recs
      .map((r, i) => `${i + 1}. **${r.title}** — +${formatCurrency(r.monthlyImpact)}/mo (${r.confidence}% confidence)`)
      .join("\n")}\n\nWork these top-down in the AI Profit Agent queue.`;
  }

  // Default summary
  return `Here's your profit snapshot:\n\n• Revenue: **${formatCurrency(
    summary.revenue
  )}/mo**\n• Net profit: **${formatCurrency(summary.netProfit)}/mo** (${formatPercent(
    summary.avgMargin
  )} avg margin)\n• Active profit leaks: **${formatCurrency(
    leakSummary().totalMonthly
  )}/mo** recoverable\n\nAsk me about losing products, ad spend, your best market, or how to grow profit next month.`;
}
