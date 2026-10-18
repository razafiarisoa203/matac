// src/utils/constructionNotifications.js

const ORG_NAME = 'MATAC';

// Date du jour au format jj/mm/aaaa
export const formatToday = () => new Date().toLocaleDateString('fr-FR');

// Récupère la référence du permis de construction
export const getConstructionReference = (result) => {
  const data = result?.data ?? result;
  return data?.reference ?? data?.referenceConstruction ?? data?.id ?? null;
};

// Email de confirmation bilingue (FR + Malagasy)
export const buildConfirmationEmail = ({ reference, date = formatToday() }) => {
  const refFr = reference ? ` sous référence n°<strong>${reference}</strong>` : '';
  const refMg = reference ? ` araka ny laharana faha-<strong>${reference}</strong>.` : '.';

  const body = `
<div style="background:#f4f4f4;padding:24px 0;font-family:Arial,Helvetica,sans-serif;">
  <table align="center" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;max-width:100%;">
    <tr>
      <td style="padding:24px 32px 8px;text-align:center;font-size:18px;font-weight:bold;color:#222;">
        ${ORG_NAME}
      </td>
    </tr>
    <tr>
      <td style="padding:16px 32px;font-size:14px;line-height:1.6;color:#222;">
        <p style="margin:0 0 16px;">
          Nous vous informons que votre dossier de <strong>permis de construction</strong> a été bien enregistré${refFr} en date du ${date} :
        </p>
        <p style="margin:0 0 16px;">
          Izahay dia faly mampahafantatra anao fa ny fangatahanao <strong>permis de construction</strong> dia voaray tsara${refMg} ny ${date} :
        </p>
        <p style="margin:0;">L'équipe ${ORG_NAME}</p>
      </td>
    </tr>
  </table>
</div>`;

  return {
    subject: reference
      ? `Enregistrement du permis de construction ${reference}`
      : 'Enregistrement du permis de construction',
    body,
  };
};

// Message pour la notification interne (admin)
export const buildProcessorMessage = (fullName, reference = null) => {
  const ref = reference ? ` (N°${reference})` : "";
  return `Nouvelle demande de permis de construction de ${fullName}${ref}. À traiter par le Service Technique.`;
};