/**
 * This is a mock Instasend service. In a real production application, this function
 * would make a call to your backend, which would then securely communicate with the
 * Instasend API to initiate the payment.
 *
 * Your backend would use environment variables (e.g., process.env.INSTASEND_API_KEY)
 * to securely access your credentials without exposing them on the client-side.
 *
 * @param phoneNumber The customer's phone number in the format 254xxxxxxxxx
 * @param amount The amount to be charged
 * @returns A promise that resolves if the payment is successful or rejects if it fails.
 */
export async function initiateInstasendPayment(phoneNumber: string, amount: number): Promise<{ success: boolean }> {
  console.log(`Simulating Instasend payment to ${phoneNumber} for amount KSH ${amount}`);
  
  // In a real backend, you would use these environment variables.
  // const apiKey = process.env.INSTASEND_API_KEY;
  // const apiSecret = process.env.INSTASEND_API_SECRET;
  // console.log("Using Instasend credentials (backend only):", { apiKey });


  return new Promise((resolve, reject) => {
    // Simulate network delay and API processing time (e.g., user entering PIN on their phone)
    setTimeout(() => {
      // In a real scenario, you'd wait for a webhook or poll an endpoint to confirm payment status.
      // Here, we'll just simulate a successful transaction most of the time.
      // To test a failed transaction, you could uncomment the following block:
      /*
      if (Math.random() > 0.8) { // 20% chance of failure for testing
        console.error('Simulated Instasend API failure.');
        return reject(new Error('The payment provider could not complete the transaction. Please try again.'));
      }
      */
      
      console.log('Simulated Instasend payment successful.');
      resolve({ success: true });
    }, 4000); // 4-second delay
  });
}
