import createMiddleware from "next-intl/middleware";
import { locales } from "./i18n";

export default createMiddleware({
  // အသုံးပြုမယ့် Locales အားလုံး ('my', 'en', 'zh', 'de')
  locales: locales,
  // Default သုံးမယ့် ဘာသာစကား
  defaultLocale: "en",
  // URL မှာ default locale ကို ဖျောက်ထားချင်ရင် localePrefix: 'as-needed' သုံးနိုင်ပါတယ် (Optional)
});

export const config = {
  // ဒီ Matcher က internationalized route တွေကို Vercel ပေါ်မှာ အလုပ်လုပ်စေမယ့်အပြင်
  // _next, api, images စတဲ့ static ဖိုင်တွေကို လွတ်ငြိမ်းခွင့်ပေးပါတယ်
  matcher: [
    // Match all pathnames except for the ones starting with:
    // - api (API routes)
    // - _next (Next.js internals)
    // - _vercel (Vercel internals)
    // - All static files (.png, .jpg, .json, etc.)
    "/((?!api|_next|_vercel|.*\\..*).*)",
    // Match all root internationalized paths
    "/(my|en|zh|de)/:path*",
  ],
};
