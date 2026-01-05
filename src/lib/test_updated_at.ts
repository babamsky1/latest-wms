// Test script to verify updated_at automation
import { autoComputation } from './AutoComputation';

console.log('Testing updated_at automation...');

// Test the auto computation for purchase order
const testPOData = {
  quantity: 10,
  unitPrice: 15.50
};

const computed = autoComputation.applyComputations('purchase_order', testPOData);
console.log('Computed PO data:', computed);

// The totalAmount should be calculated (10 * 15.50 = 155.00)
// But updatedAt should not be set because it's not in the input data
// It should only be set in the context update methods

console.log('Test completed. Check that updated_at is set in context update methods, not in auto computation alone.');
