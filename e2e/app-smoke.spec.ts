import { expect, test } from "@playwright/test";

test("يعرض الصفحة الرئيسية والتنقل السفلي الحديث", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("رفيق رمضان")).toBeVisible();
  await expect(page.getByRole("heading", { name: "لوحة اليوم" })).toBeVisible();

  const nav = page.getByRole("navigation", { name: "التنقل الرئيسي" });
  await expect(nav).toBeVisible();
  await expect(nav.getByRole("link")).toHaveCount(5);
  await expect(nav.getByRole("link", { name: /اليوم/ })).toBeVisible();
  await expect(nav.getByRole("link", { name: /المزيد/ })).toBeVisible();
});

test("ينتقل إلى صفحة المزيد ثم يفتح الإمساكية", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /المزيد/ }).click();

  await expect(page).toHaveURL(/\/more$/);
  await expect(page.getByRole("heading", { name: "المزيد" })).toBeVisible();

  await page.getByRole("link", { name: /الإمساكية/ }).first().click();

  await expect(page).toHaveURL(/\/imsakiya$/);
  await expect(page.getByRole("heading", { name: "إمساكية رمضان" })).toBeVisible();
});

test("يعرض صفحات العبادات الأساسية", async ({ page }) => {
  await page.goto("/khatma");
  await expect(page.getByRole("heading", { name: "خطة ختمة القرآن" })).toBeVisible();

  await page.goto("/quran");
  await expect(page.getByRole("heading", { name: "المصحف الكامل" })).toBeVisible();

  await page.goto("/prayer");
  await expect(page.getByRole("heading", { name: "مواقيت الصلاة" })).toBeVisible();
});
