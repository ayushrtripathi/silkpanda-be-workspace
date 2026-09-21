export const RESERVED_SLUGS = new Set([
  "login",
  "dashboard",
  "api",
  "admin",
  "auth",
  "favicon.ico",
  "_next",
]);

export const FABRIC_OPTIONS = [
  "Kanjeevaram",
  "Banarasi",
  "Cotton",
  "Silk",
  "Chiffon",
  "Georgette",
  "Linen",
] as const;

export const OCCASION_OPTIONS = [
  "Wedding",
  "Festive",
  "Casual",
  "Party",
  "Daily Wear",
] as const;

export const STOCK_STATUS_OPTIONS = ["in_stock", "out_of_stock"] as const;
