/**
 * This is a mock M-Pesa service. In a real production application, this function
 * would make a call to your backend, which would then securely communicate with the
 * Safaricom Daraja API to initiate the STK push.
 *
 * @param phoneNumber The customer's phone number in the format 254xxxxxxxxx
 * @param amount The amount to be charged
 * @returns A promise that resolves if the payment is successful or rejects if it fails.
 */
export async function initiateStkPush(phoneNumber: string, amount: number): Promise<{ success: boolean }> {
  console.log(`Simulating STK Push to ${phoneNumber} for amount ${amount}`);

  return new Promise((resolve, reject) => {
    // Simulate network delay and API processing time
    setTimeout(() => {
      // In a real scenario, you'd check the callback from Safaricom.
      // Here, we'll just simulate a successful transaction.
      // To test a failed transaction, you could use:
      // if (Math.random() > 0.8) {
      //   console.error('Simulated M-Pesa API failure.');
      //   return reject(new Error('The M-Pesa transaction failed.'));
      // }
      
      console.log('Simulated M-Pesa payment successful.');
      resolve({ success: true });
    }, 4000); // 4-second delay to simulate user entering PIN
  });
}
