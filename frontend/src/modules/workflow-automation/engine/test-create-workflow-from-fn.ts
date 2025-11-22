// import WorkflowBoundary from '../models/workflow/elements/WorkflowBoundary.model';
// import WorkflowAction from '../models/workflow/elements/WorkflowAction.model';
// import WorkflowStatus from '../models/workflow/elements/WorkflowStatus.model';
// import WorkflowSwitch from '../models/workflow/elements/WorkflowSwitch.model';

// type TCreateWorkflowFromFn = {
//     switches: {
//         [switchFnName: string]: (...args: unknown[]) => WorkflowSwitch,
//     },
//     actions: {
//         [actionFnName: string]: (...args: unknown[]) => WorkflowAction<any, any, any> | WorkflowStatus | WorkflowBoundary,
//     },
//     generatorFn: (...args: unknown[]) => Generator<any, any, any>,
// }

// /**
//  * Creates a complex workflow for testing nested conditions and various depths.
//  * This workflow simulates an e-commerce order processing system with multiple validation steps.
//  *
//  * @returns An object containing actions, switches, and the generator function
//  */
// export function createWorkflowFromFn(): TCreateWorkflowFromFn {

//     // Define all actions used in the workflow
//     const actions = {
//         BOUNDARY_START: () => new WorkflowBoundary({
//             id: 'BOUNDARY_START',
//             title: 'Order received',
//         }),

//         ACTION_VALIDATE_ORDER: () => new WorkflowAction({
//             id: 'ACTION_VALIDATE_ORDER',
//             title: 'Validate order details',
//             type: { id: 'validateOrder', title: 'Validate Order' },
//             peoplePickerFormItemNames: [],
//             keyDatas: [],
//             fileFormItemNames: {},
//         }),

//         STATUS_ORDER_VALIDATED: () => new WorkflowStatus({
//             id: 'STATUS_ORDER_VALIDATED',
//             title: 'Order validated',
//         }),

//         ACTION_CHECK_INVENTORY: () => new WorkflowAction({
//             id: 'ACTION_CHECK_INVENTORY',
//             title: 'Check product availability',
//             type: { id: 'checkInventory', title: 'Check Inventory' },
//             peoplePickerFormItemNames: [],
//             keyDatas: [],
//             fileFormItemNames: {},
//         }),

//         ACTION_RESERVE_ITEMS: () => new WorkflowAction({
//             id: 'ACTION_RESERVE_ITEMS',
//             title: 'Reserve items from inventory',
//             type: { id: 'reserveItems', title: 'Reserve Items' },
//             peoplePickerFormItemNames: [],
//             keyDatas: [],
//             fileFormItemNames: {},
//         }),

//         ACTION_CONTACT_SUPPLIER: () => new WorkflowAction({
//             id: 'ACTION_CONTACT_SUPPLIER',
//             title: 'Contact supplier for restocking',
//             type: { id: 'contactSupplier', title: 'Contact Supplier' },
//             peoplePickerFormItemNames: [],
//             keyDatas: [],
//             fileFormItemNames: {},
//         }),

//         STATUS_AWAITING_RESTOCK: () => new WorkflowStatus({
//             id: 'STATUS_AWAITING_RESTOCK',
//             title: 'Awaiting restock',
//         }),

//         ACTION_CANCEL_ORDER_PAYMENT_INVALID: () => new WorkflowAction({
//             id: 'ACTION_CANCEL_ORDER_PAYMENT_INVALID',
//             title: 'Cancel order - payment invalid',
//             type: { id: 'cancelOrderPayment', title: 'Cancel Order Payment' },
//             peoplePickerFormItemNames: [],
//             keyDatas: [],
//             fileFormItemNames: {},
//         }),

//         ACTION_NOTIFY_CUSTOMER_PAYMENT_ISSUE: () => new WorkflowAction({
//             id: 'ACTION_NOTIFY_CUSTOMER_PAYMENT_ISSUE',
//             title: 'Notify customer of payment issue',
//             type: { id: 'notifyCustomerPaymentIssue', title: 'Notify Customer Payment Issue' },
//             peoplePickerFormItemNames: [],
//             keyDatas: [],
//             fileFormItemNames: {},
//         }),

//         ACTION_CANCEL_ORDER_NO_RESTOCK: () => new WorkflowAction({
//             id: 'ACTION_CANCEL_ORDER_NO_RESTOCK',
//             title: 'Cancel order - cannot restock',
//             type: { id: 'cancelOrderNoRestock', title: 'Cancel Order No Restock' },
//             peoplePickerFormItemNames: [],
//             keyDatas: [],
//             fileFormItemNames: {},
//         }),

//         ACTION_NOTIFY_CUSTOMER_OUT_OF_STOCK: () => new WorkflowAction({
//             id: 'ACTION_NOTIFY_CUSTOMER_OUT_OF_STOCK',
//             title: 'Notify customer - out of stock',
//             type: { id: 'notifyCustomerOutOfStock', title: 'Notify Customer Out Of Stock' },
//             peoplePickerFormItemNames: [],
//             keyDatas: [],
//             fileFormItemNames: {},
//         }),

//         ACTION_VERIFY_PAYMENT: () => new WorkflowAction({
//             id: 'ACTION_VERIFY_PAYMENT',
//             title: 'Verify payment information',
//             type: { id: 'verifyPayment', title: 'Verify Payment' },
//             peoplePickerFormItemNames: [],
//             keyDatas: [],
//             fileFormItemNames: {},
//         }),

//         ACTION_PROCESS_PAYMENT: () => new WorkflowAction({
//             id: 'ACTION_PROCESS_PAYMENT',
//             title: 'Process payment',
//             type: { id: 'processPayment', title: 'Process Payment' },
//             peoplePickerFormItemNames: [],
//             keyDatas: [],
//             fileFormItemNames: {},
//         }),

//         STATUS_PAYMENT_CONFIRMED: () => new WorkflowStatus({
//             id: 'STATUS_PAYMENT_CONFIRMED',
//             title: 'Payment confirmed',
//         }),

//         ACTION_APPLY_DISCOUNT: () => new WorkflowAction({
//             id: 'ACTION_APPLY_DISCOUNT',
//             title: 'Apply VIP discount',
//             type: { id: 'applyDiscount', title: 'Apply Discount' },
//             peoplePickerFormItemNames: [],
//             keyDatas: [],
//             fileFormItemNames: {},
//         }),

//         ACTION_SEND_GIFT: () => new WorkflowAction({
//             id: 'ACTION_SEND_GIFT',
//             title: 'Include complimentary gift',
//             type: { id: 'sendGift', title: 'Send Gift' },
//             peoplePickerFormItemNames: [],
//             keyDatas: [],
//             fileFormItemNames: {},
//         }),

//         ACTION_CALCULATE_SHIPPING: () => new WorkflowAction({
//             id: 'ACTION_CALCULATE_SHIPPING',
//             title: 'Calculate shipping costs',
//             type: { id: 'calculateShipping', title: 'Calculate Shipping' },
//             peoplePickerFormItemNames: [],
//             keyDatas: [],
//             fileFormItemNames: {},
//         }),

//         ACTION_EXPRESS_SHIPPING: () => new WorkflowAction({
//             id: 'ACTION_EXPRESS_SHIPPING',
//             title: 'Arrange express shipping',
//             type: { id: 'expressShipping', title: 'Express Shipping' },
//             peoplePickerFormItemNames: [],
//             keyDatas: [],
//             fileFormItemNames: {},
//         }),

//         ACTION_STANDARD_SHIPPING: () => new WorkflowAction({
//             id: 'ACTION_STANDARD_SHIPPING',
//             title: 'Arrange standard shipping',
//             type: { id: 'standardShipping', title: 'Standard Shipping' },
//             peoplePickerFormItemNames: [],
//             keyDatas: [],
//             fileFormItemNames: {},
//         }),

//         ACTION_VERIFY_SHIPPING_ADDRESS: () => new WorkflowAction({
//             id: 'ACTION_VERIFY_SHIPPING_ADDRESS',
//             title: 'Verify shipping address',
//             type: { id: 'verifyShippingAddress', title: 'Verify Shipping Address' },
//             peoplePickerFormItemNames: [],
//             keyDatas: [],
//             fileFormItemNames: {},
//         }),

//         STATUS_SHIPPING_CONFIRMED: () => new WorkflowStatus({
//             id: 'STATUS_SHIPPING_CONFIRMED',
//             title: 'Shipping details confirmed',
//         }),

//         ACTION_CALCULATE_TOTAL_COST: () => new WorkflowAction({
//             id: 'ACTION_CALCULATE_TOTAL_COST',
//             title: 'Calculate total order cost',
//             type: { id: 'calculateTotalCost', title: 'Calculate Total Cost' },
//             peoplePickerFormItemNames: [],
//             keyDatas: [],
//             fileFormItemNames: {},
//         }),

//         ACTION_REQUEST_FRAUD_CHECK: () => new WorkflowAction({
//             id: 'ACTION_REQUEST_FRAUD_CHECK',
//             title: 'Request fraud verification',
//             type: { id: 'requestFraudCheck', title: 'Fraud Check' },
//             peoplePickerFormItemNames: [],
//             keyDatas: [],
//             fileFormItemNames: {},
//         }),

//         STATUS_UNDER_REVIEW: () => new WorkflowStatus({
//             id: 'STATUS_UNDER_REVIEW',
//             title: 'Under fraud review',
//         }),

//         ACTION_MANUAL_VERIFICATION: () => new WorkflowAction({
//             id: 'ACTION_MANUAL_VERIFICATION',
//             title: 'Manual verification by security team',
//             type: { id: 'manualVerification', title: 'Manual Verification' },
//             peoplePickerFormItemNames: [],
//             keyDatas: [],
//             fileFormItemNames: {},
//         }),

//         ACTION_BLOCK_ORDER: () => new WorkflowAction({
//             id: 'ACTION_BLOCK_ORDER',
//             title: 'Block fraudulent order',
//             type: { id: 'blockOrder', title: 'Block Order' },
//             peoplePickerFormItemNames: [],
//             keyDatas: [],
//             fileFormItemNames: {},
//         }),

//         ACTION_REFUND_PAYMENT: () => new WorkflowAction({
//             id: 'ACTION_REFUND_PAYMENT',
//             title: 'Process refund',
//             type: { id: 'refundPayment', title: 'Refund Payment' },
//             peoplePickerFormItemNames: [],
//             keyDatas: [],
//             fileFormItemNames: {},
//         }),

//         ACTION_PREPARE_PACKAGE_AFTER_FRAUD_CHECK: () => new WorkflowAction({
//             id: 'ACTION_PREPARE_PACKAGE_AFTER_FRAUD_CHECK',
//             title: 'Prepare package after fraud verification',
//             type: { id: 'preparePackageAfterFraud', title: 'Prepare Package After Fraud Check' },
//             peoplePickerFormItemNames: [],
//             keyDatas: [],
//             fileFormItemNames: {},
//         }),

//         STATUS_READY_TO_SHIP_AFTER_FRAUD: () => new WorkflowStatus({
//             id: 'STATUS_READY_TO_SHIP_AFTER_FRAUD',
//             title: 'Ready to ship (verified)',
//         }),

//         ACTION_PREPARE_PACKAGE_LOW_RISK: () => new WorkflowAction({
//             id: 'ACTION_PREPARE_PACKAGE_LOW_RISK',
//             title: 'Prepare package (low risk order)',
//             type: { id: 'preparePackageLowRisk', title: 'Prepare Package Low Risk' },
//             peoplePickerFormItemNames: [],
//             keyDatas: [],
//             fileFormItemNames: {},
//         }),

//         STATUS_READY_TO_SHIP_LOW_RISK: () => new WorkflowStatus({
//             id: 'STATUS_READY_TO_SHIP_LOW_RISK',
//             title: 'Ready to ship',
//         }),

//         ACTION_PRINT_LABEL: () => new WorkflowAction({
//             id: 'ACTION_PRINT_LABEL',
//             title: 'Print shipping label',
//             type: { id: 'printLabel', title: 'Print Label' },
//             peoplePickerFormItemNames: [],
//             keyDatas: [],
//             fileFormItemNames: {},
//         }),

//         ACTION_HANDOVER_TO_CARRIER: () => new WorkflowAction({
//             id: 'ACTION_HANDOVER_TO_CARRIER',
//             title: 'Hand over to carrier',
//             type: { id: 'handoverToCarrier', title: 'Handover to Carrier' },
//             peoplePickerFormItemNames: [],
//             keyDatas: [],
//             fileFormItemNames: {},
//         }),

//         STATUS_IN_TRANSIT: () => new WorkflowStatus({
//             id: 'STATUS_IN_TRANSIT',
//             title: 'Package in transit',
//         }),

//         ACTION_TRACK_SHIPMENT: () => new WorkflowAction({
//             id: 'ACTION_TRACK_SHIPMENT',
//             title: 'Enable shipment tracking',
//             type: { id: 'trackShipment', title: 'Track Shipment' },
//             peoplePickerFormItemNames: [],
//             keyDatas: [],
//             fileFormItemNames: {},
//         }),

//         ACTION_NOTIFY_CUSTOMER_SHIPPED: () => new WorkflowAction({
//             id: 'ACTION_NOTIFY_CUSTOMER_SHIPPED',
//             title: 'Notify customer of shipment',
//             type: { id: 'notifyCustomerShipped', title: 'Notify Customer Shipped' },
//             peoplePickerFormItemNames: [],
//             keyDatas: [],
//             fileFormItemNames: {},
//         }),

//         ACTION_CONFIRM_DELIVERY: () => new WorkflowAction({
//             id: 'ACTION_CONFIRM_DELIVERY',
//             title: 'Confirm delivery',
//             type: { id: 'confirmDelivery', title: 'Confirm Delivery' },
//             peoplePickerFormItemNames: [],
//             keyDatas: [],
//             fileFormItemNames: {},
//         }),

//         STATUS_DELIVERED: () => new WorkflowStatus({
//             id: 'STATUS_DELIVERED',
//             title: 'Order delivered',
//         }),

//         ACTION_REQUEST_FEEDBACK: () => new WorkflowAction({
//             id: 'ACTION_REQUEST_FEEDBACK',
//             title: 'Request customer feedback',
//             type: { id: 'requestFeedback', title: 'Request Feedback' },
//             peoplePickerFormItemNames: [],
//             keyDatas: [],
//             fileFormItemNames: {},
//         }),

//         ACTION_FINALIZE_PAYMENT_PROCESSING: () => new WorkflowAction({
//             id: 'ACTION_FINALIZE_PAYMENT_PROCESSING',
//             title: 'Finalize payment processing',
//             type: { id: 'finalizePaymentProcessing', title: 'Finalize Payment Processing' },
//             peoplePickerFormItemNames: [],
//             keyDatas: [],
//             fileFormItemNames: {},
//         }),

//         ACTION_FINALIZE_SHIPPING_SELECTION: () => new WorkflowAction({
//             id: 'ACTION_FINALIZE_SHIPPING_SELECTION',
//             title: 'Finalize shipping selection',
//             type: { id: 'finalizeShippingSelection', title: 'Finalize Shipping Selection' },
//             peoplePickerFormItemNames: [],
//             keyDatas: [],
//             fileFormItemNames: {},
//         }),

//         ACTION_FINALIZE_FRAUD_CHECK: () => new WorkflowAction({
//             id: 'ACTION_FINALIZE_FRAUD_CHECK',
//             title: 'Finalize fraud verification',
//             type: { id: 'finalizeFraudCheck', title: 'Finalize Fraud Check' },
//             peoplePickerFormItemNames: [],
//             keyDatas: [],
//             fileFormItemNames: {},
//         }),

//         ACTION_CLOSE_ORDER: () => new WorkflowAction({
//             id: 'ACTION_CLOSE_ORDER',
//             title: 'Close order',
//             type: { id: 'closeOrder', title: 'Close Order' },
//             peoplePickerFormItemNames: [],
//             keyDatas: [],
//             fileFormItemNames: {},
//         }),

//         BOUNDARY_END: () => new WorkflowBoundary({
//             id: 'BOUNDARY_END',
//             title: 'Order completed',
//         }),
//     };

//     // Define all switches used in the workflow
//     const switches = {
//         SWITCH_ITEMS_AVAILABLE: () => new WorkflowSwitch({
//             id: 'SWITCH_ITEMS_AVAILABLE',
//             title: 'Are all items available in stock?',
//         }),

//         SWITCH_CAN_RESTOCK: () => new WorkflowSwitch({
//             id: 'SWITCH_CAN_RESTOCK',
//             title: 'Can items be restocked within 48h?',
//         }),

//         SWITCH_PAYMENT_VALID: () => new WorkflowSwitch({
//             id: 'SWITCH_PAYMENT_VALID',
//             title: 'Is payment information valid?',
//         }),

//         SWITCH_IS_VIP_CUSTOMER: () => new WorkflowSwitch({
//             id: 'SWITCH_IS_VIP_CUSTOMER',
//             title: 'Is customer a VIP member?',
//         }),

//         SWITCH_EXPRESS_REQUESTED: () => new WorkflowSwitch({
//             id: 'SWITCH_EXPRESS_REQUESTED',
//             title: 'Is express shipping requested?',
//         }),

//         SWITCH_HIGH_RISK_ORDER: () => new WorkflowSwitch({
//             id: 'SWITCH_HIGH_RISK_ORDER',
//             title: 'Is this a high-risk order?',
//         }),

//         SWITCH_FRAUD_CONFIRMED: () => new WorkflowSwitch({
//             id: 'SWITCH_FRAUD_CONFIRMED',
//             title: 'Is fraud confirmed?',
//         }),
//     };

//     // Define the generator function - SIMPLIFIÉ pour éviter les switches imbriqués de type Règle 1
//     const generatorFn = function* (
//         folder?: any,
//         preDefinedSwitchValues?: { id: string, value: boolean, hasBeenUsed?: boolean }[]
//     ): Generator<WorkflowAction<any, any, any> | WorkflowStatus | WorkflowSwitch | WorkflowBoundary> {

//         // Start boundary
//         yield actions.BOUNDARY_START();

//         // Initial validation
//         yield actions.ACTION_VALIDATE_ORDER();
//         yield actions.STATUS_ORDER_VALIDATED();
//         yield actions.ACTION_CHECK_INVENTORY();

//         // ✅ LEVEL 1: Check inventory availability (Règle 1 OK car pas imbriqué)
//         const inventorySwitch = switches.SWITCH_ITEMS_AVAILABLE();
//         yield inventorySwitch;
//         inventorySwitch.setSwitchValue(preDefinedSwitchValues);

//         if (inventorySwitch.getSwitchValue()) {
//             // Items available - proceed with order
//             yield actions.ACTION_RESERVE_ITEMS();
//             yield actions.ACTION_VERIFY_PAYMENT();

//             // 🧪 TEST: Réintroduction d'un switch imbriqué (Règle 1)
//             const paymentSwitch = switches.SWITCH_PAYMENT_VALID();
//             yield paymentSwitch;
//             paymentSwitch.setSwitchValue(preDefinedSwitchValues);

//             if (paymentSwitch.getSwitchValue()) {
//                 // Payment valid
//                 yield actions.ACTION_PROCESS_PAYMENT();
//                 yield actions.STATUS_PAYMENT_CONFIRMED();

//                 // ✅ Check if VIP customer (Règle 2 - branche vide OK)
//                 const vipSwitch = switches.SWITCH_IS_VIP_CUSTOMER();
//                 yield vipSwitch;
//                 vipSwitch.setSwitchValue(preDefinedSwitchValues);

//                 if (vipSwitch.getSwitchValue()) {
//                     // VIP customer - special treatment
//                     yield actions.ACTION_APPLY_DISCOUNT();
//                     yield actions.ACTION_SEND_GIFT();
//                 }

//                 yield actions.ACTION_CALCULATE_SHIPPING();
//                 yield actions.ACTION_EXPRESS_SHIPPING();
//                 yield actions.ACTION_VERIFY_SHIPPING_ADDRESS();
//                 yield actions.STATUS_SHIPPING_CONFIRMED();
//                 yield actions.ACTION_CALCULATE_TOTAL_COST();
//                 yield actions.ACTION_REQUEST_FRAUD_CHECK();
//                 yield actions.STATUS_UNDER_REVIEW();
//                 yield actions.ACTION_MANUAL_VERIFICATION();
//                 yield actions.ACTION_PREPARE_PACKAGE_AFTER_FRAUD_CHECK();
//                 yield actions.STATUS_READY_TO_SHIP_AFTER_FRAUD();

//             } else {
//                 // Payment invalid
//                 yield actions.ACTION_CANCEL_ORDER_PAYMENT_INVALID();
//                 yield actions.ACTION_NOTIFY_CUSTOMER_PAYMENT_ISSUE();
//             }

//             // Shipping and delivery (convergence)
//             yield actions.ACTION_PRINT_LABEL();
//             yield actions.ACTION_HANDOVER_TO_CARRIER();
//             yield actions.STATUS_IN_TRANSIT();
//             yield actions.ACTION_TRACK_SHIPMENT();
//             yield actions.ACTION_NOTIFY_CUSTOMER_SHIPPED();
//             yield actions.ACTION_CONFIRM_DELIVERY();
//             yield actions.STATUS_DELIVERED();
//             yield actions.ACTION_REQUEST_FEEDBACK();

//         } else {
//             // Items not available
//             yield actions.ACTION_CONTACT_SUPPLIER();

//             // ✅ LEVEL 2: Check if can restock (Règle 1 OK car dans branche courte)
//             const restockSwitch = switches.SWITCH_CAN_RESTOCK();
//             yield restockSwitch;
//             restockSwitch.setSwitchValue(preDefinedSwitchValues);

//             if (restockSwitch.getSwitchValue()) {
//                 yield actions.STATUS_AWAITING_RESTOCK();
//             } else {
//                 yield actions.ACTION_CANCEL_ORDER_NO_RESTOCK();
//                 yield actions.ACTION_NOTIFY_CUSTOMER_OUT_OF_STOCK();
//             }
//         }

//         // Final common path: close order
//         yield actions.ACTION_CLOSE_ORDER();
//         yield actions.BOUNDARY_END();
//     };

//     const actionsCount = Object.keys(actions).length;
//     const switchesCount = Object.keys(switches).length;

//     console.log('[createWorkflowFromFn - collected] 📦 Workflow elements:', {
//         actions: actionsCount,
//         switches: switchesCount,
//         total: actionsCount + switchesCount
//     });

//     console.log('[createWorkflowFromFn - actions] 🎬 Actions defined:', Object.keys(actions));
//     console.log('[createWorkflowFromFn - switches] 🔀 Switches defined:', Object.keys(switches));

//     return {
//         actions,
//         switches,
//         generatorFn,
//     };
// }
