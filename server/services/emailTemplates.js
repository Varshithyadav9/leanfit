export const emailTemplates = {
 welcome: ({name}) => ({subject:"Welcome to LeanFit",html:`<h2>Welcome, ${name}</h2><p>Your LeanFit account is ready.</p>`}),
 orderReceived: ({name,orderId}) => ({subject:`LeanFit order ${orderId} received`,html:`<p>Hello ${name}, your order has been recorded and is waiting for verification.</p>`}),
 paymentVerified: ({name,orderId}) => ({subject:`Payment verified — ${orderId}`,html:`<p>Hello ${name}, your payment was verified and your plan is being prepared.</p>`}),
 planReady: ({name,orderId}) => ({subject:`Your LeanFit plan is ready — ${orderId}`,html:`<p>Hello ${name}, your plan is available in the Customer Portal.</p>`}),
};
