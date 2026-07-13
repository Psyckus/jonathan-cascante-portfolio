import type { ProjectSlug } from "../lib/projects";

export function ProjectPreview({ type, compact = false }: { type: ProjectSlug; compact?: boolean }) {
  if (type === "casanet") {
    return (
      <div className={`system-preview property-preview ${compact ? "compact" : ""}`} role="img" aria-label="Vista representativa de Casa Net">
        <div className="preview-top"><i /><span>Casa Net</span><small>Panel inmobiliario</small></div>
        <div className="property-layout">
          <aside><b>CN</b><i /><i /><i /><i /></aside>
          <div className="property-main">
            <div className="preview-stats"><span><small>Propiedades</small><b>128</b></span><span><small>Clientes</small><b>846</b></span><span><small>Consultas</small><b>32</b></span></div>
            <div className="property-cards"><article><div /><b>Casa moderna</b><small>Heredia · $185k</small></article><article><div /><b>Apartamento</b><small>San José · $140k</small></article></div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "ccss") {
    return (
      <div className={`system-preview ccss-preview ${compact ? "compact" : ""}`} role="img" aria-label="Vista representativa del sistema institucional CCSS">
        <div className="preview-top"><i /><span>Gestión institucional</span><small>Solicitudes</small></div>
        <div className="ccss-layout">
          <div className="ccss-summary"><span><b>24</b><small>Pendientes</small></span><span><b>86%</b><small>Resueltas</small></span></div>
          <div className="request-table"><header><span>Solicitud</span><span>Estado</span><span>Fecha</span></header><p><b>#1048</b><i className="pending">Pendiente</i><small>Hoy</small></p><p><b>#1047</b><i className="done">Asignado</i><small>Ayer</small></p><p><b>#1046</b><i className="done">Asignado</i><small>12 Jul</small></p></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`system-preview transfer-preview ${compact ? "compact" : ""}`} role="img" aria-label="Vista representativa de transferencias interbancarias">
      <div className="preview-top"><i /><span>Transfer API</span><small>Operación segura</small></div>
      <div className="transfer-layout">
        <div className="phone-shell"><span>Transferir</span><label>Cuenta destino<i /></label><label>Monto<i className="short" /></label><button>Confirmar transferencia</button></div>
        <div className="api-trace"><p><i /> POST /transferencias</p><p><i /> validando saldo</p><p><i /> autorización vigente</p><p className="success"><i /> 201 registrada</p></div>
      </div>
    </div>
  );
}
