import { createTranslator, hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";

function escapeHtml(value: string) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

// The site stores the chosen language in the NEXT_LOCALE cookie
export function getRequestLocale(request?: Request) {
    const cookie = request?.headers.get("cookie") ?? "";
    const locale = cookie.match(/(?:^|;\s*)NEXT_LOCALE=([^;]+)/)?.[1];
    return hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
}

export async function buildResetPasswordEmail(locale: string, name: string, url: string) {
    const messages = (await import(`../../messages/${locale}.json`)).default;
    const t = createTranslator({ locale, messages, namespace: "emails.resetPassword" });

    const greeting = t("greeting", { name });
    const lines = [t("body"), t("expiry"), t("ignore")];

    const text = [greeting, "", lines[0], "", url, "", lines[1], lines[2]].join("\n");

    const html = `<!doctype html>
<html lang="${locale}">
  <body style="margin:0;padding:24px;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;">
      <tr>
        <td style="padding:32px;">
          <p style="margin:0 0 24px;font-size:20px;font-weight:bold;color:#0A3730;">GreenTouch</p>
          <p style="margin:0 0 16px;font-size:16px;">${escapeHtml(greeting)}</p>
          <p style="margin:0 0 24px;font-size:16px;line-height:1.5;">${escapeHtml(lines[0])}</p>
          <p style="margin:0 0 24px;">
            <a href="${escapeHtml(url)}" style="display:inline-block;padding:12px 24px;background:#1F6E4C;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:bold;">${escapeHtml(t("button"))}</a>
          </p>
          <p style="margin:0 0 16px;font-size:14px;color:#4b5563;">${escapeHtml(lines[1])}</p>
          <p style="margin:0 0 24px;font-size:14px;color:#4b5563;">${escapeHtml(lines[2])}</p>
          <p style="margin:0;font-size:12px;color:#6b7280;">${escapeHtml(t("linkFallback"))}<br><a href="${escapeHtml(url)}" style="color:#1F566E;word-break:break-all;">${escapeHtml(url)}</a></p>
        </td>
      </tr>
    </table>
  </body>
</html>`;

    return { subject: t("subject"), text, html };
}
