import webpush, { PushSubscription } from "web-push";

let vapidConfigured = false;

export function configureWebPush(): boolean {
  if (vapidConfigured) {
    return true;
  }

  const subject = process.env.WEB_PUSH_SUBJECT;
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;

  if (!subject || !publicKey || !privateKey) {
    return false;
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);
  vapidConfigured = true;
  return true;
}

export async function sendPushNotification(subscription: PushSubscription, payload: unknown): Promise<void> {
  if (!configureWebPush()) {
    throw new Error("VAPID keys are not configured.");
  }

  await webpush.sendNotification(subscription, JSON.stringify(payload));
}
