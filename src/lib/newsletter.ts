/**
 * Email & Newsletter Management Utilities
 * Handles newsletter subscriptions, email validation, and marketing
 */

interface NewsletterSubscriber {
  email: string;
  firstName?: string;
  lastName?: string;
  subscriptionDate: string;
  status: 'subscribed' | 'unsubscribed' | 'pending';
  preferences?: {
    promotions?: boolean;
    newProducts?: boolean;
    blogUpdates?: boolean;
  };
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitize email (lowercase, trim)
 */
export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

/**
 * Subscribe to newsletter
 * Integrates with email service (Mailchimp, SendGrid, etc.)
 */
export async function subscribeToNewsletter(
  email: string,
  firstName?: string,
  lastName?: string,
  preferences?: NewsletterSubscriber['preferences']
): Promise<{ success: boolean; message: string; subscriberId?: string }> {
  const sanitizedEmail = sanitizeEmail(email);

  if (!validateEmail(sanitizedEmail)) {
    return { success: false, message: 'Invalid email format' };
  }

  try {
    // Call your email service API
    const response = await fetch('/api/newsletter/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: sanitizedEmail,
        firstName,
        lastName,
        preferences,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to subscribe: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      message: 'Successfully subscribed to newsletter!',
      subscriberId: data.id,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Subscription failed',
    };
  }
}

/**
 * Unsubscribe from newsletter
 */
export async function unsubscribeFromNewsletter(email: string): Promise<{ success: boolean; message: string }> {
  const sanitizedEmail = sanitizeEmail(email);

  try {
    const response = await fetch('/api/newsletter/unsubscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: sanitizedEmail }),
    });

    if (!response.ok) {
      throw new Error(`Failed to unsubscribe: ${response.statusText}`);
    }

    return {
      success: true,
      message: 'Successfully unsubscribed from newsletter',
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unsubscription failed',
    };
  }
}

/**
 * Update newsletter preferences
 */
export async function updateNewsletterPreferences(
  email: string,
  preferences: NewsletterSubscriber['preferences']
): Promise<{ success: boolean; message: string }> {
  const sanitizedEmail = sanitizeEmail(email);

  try {
    const response = await fetch('/api/newsletter/preferences', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: sanitizedEmail, preferences }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update preferences: ${response.statusText}`);
    }

    return {
      success: true,
      message: 'Preferences updated successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Update failed',
    };
  }
}

/**
 * Send transactional email
 */
export async function sendTransactionalEmail(
  to: string,
  templateId: string,
  data: Record<string, any>
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const response = await fetch('/api/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, templateId, data }),
    });

    if (!response.ok) {
      throw new Error(`Failed to send email: ${response.statusText}`);
    }

    const result = await response.json();
    return {
      success: true,
      messageId: result.messageId,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Email send failed',
    };
  }
}

/**
 * Generate unsubscribe link
 */
export function generateUnsubscribeLink(email: string): string {
  const encodedEmail = encodeURIComponent(email);
  return `${process.env.NEXT_PUBLIC_SITE_URL}/newsletter/unsubscribe?email=${encodedEmail}`;
}

/**
 * Generate email preview token for testing
 */
export function generateEmailPreviewToken(email: string): string {
  const timestamp = Date.now();
  return Buffer.from(`${email}:${timestamp}`).toString('base64');
}

/**
 * Check if subscriber is active
 */
export function isSubscriberActive(subscriber: NewsletterSubscriber): boolean {
  return subscriber.status === 'subscribed' && !subscriber.preferences?.promotions === false;
}

/**
 * Format subscriber name
 */
export function formatSubscriberName(firstName?: string, lastName?: string): string {
  if (!firstName && !lastName) return 'Subscriber';
  if (firstName && lastName) return `${firstName} ${lastName}`;
  return firstName || lastName || 'Subscriber';
}
