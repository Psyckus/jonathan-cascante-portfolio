import type { ProjectSlug } from "../lib/projects";
import type { Dictionary } from "../i18n/config";
import { StatusDot } from "./status-dot";

export function ProjectPreview({ type, copy }: { type: ProjectSlug; copy: Dictionary["projectPreviews"] }) {
  if (type === "casanet") {
    return (
      <div className="system-preview property-preview" role="img" aria-label={copy.casanet.aria}>
        <div className="preview-top"><i /><span>Casa Net</span><small>{copy.casanet.panel}</small></div>
        <div className="property-layout">
          <aside><b>CN</b><i /><i /><i /><i /></aside>
          <div className="property-main">
            <div className="preview-stats"><span><small>{copy.casanet.properties}</small><b>128</b></span><span><small>{copy.casanet.clients}</small><b>846</b></span><span><small>{copy.casanet.inquiries}</small><b>32</b></span></div>
            <div className="property-cards"><article><div /><b>{copy.casanet.house}</b><small>Heredia · $185k</small></article><article><div /><b>{copy.casanet.apartment}</b><small>San José · $140k</small></article></div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "ccss") {
    return (
      <div className="system-preview ccss-preview" role="img" aria-label={copy.ccss.aria}>
        <div className="preview-top"><i /><span>{copy.ccss.title}</span><small>{copy.ccss.requests}</small></div>
        <div className="ccss-layout">
          <div className="ccss-summary"><span><b>24</b><small>{copy.ccss.pending}</small></span><span><b>86%</b><small>{copy.ccss.resolved}</small></span></div>
          <div className="request-table"><header><span>{copy.ccss.request}</span><span>{copy.ccss.status}</span><span>{copy.ccss.date}</span></header><p><b>#1048</b><i className="pending">{copy.ccss.pendingOne}</i><small>{copy.ccss.today}</small></p><p><b>#1047</b><i className="done">{copy.ccss.assigned}</i><small>{copy.ccss.yesterday}</small></p><p><b>#1046</b><i className="done">{copy.ccss.assigned}</i><small>12 Jul</small></p></div>
        </div>
      </div>
    );
  }

  return (
    <div className="system-preview transfer-preview" role="img" aria-label={copy.transfer.aria}>
      <div className="preview-top"><i /><span>Transfer API</span><small>{copy.transfer.secure}</small></div>
      <div className="transfer-layout">
        <div className="phone-shell" inert><span>{copy.transfer.transfer}</span><label>{copy.transfer.destination}<i /></label><label>{copy.transfer.amount}<i className="short" /></label><button type="button">{copy.transfer.confirm}</button></div>
        <div className="api-trace"><p><i /> POST /transfers</p><p><i /> {copy.transfer.validating}</p><p><i /> {copy.transfer.authorized}</p><p className="success"><StatusDot size="xs" /> {copy.transfer.registered}</p></div>
      </div>
    </div>
  );
}
