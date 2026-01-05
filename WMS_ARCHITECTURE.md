# WMS Architecture & Workflow Map

## 1. System Structure Strategy

### 1️⃣ Master Data (Foundation)
*Single Source of Truth. No transactions occur here.*
* **Item Master (Stock Buffering)**
    *   **Data Source**: `ItemMasterRecord`
    *   **Capabilities**: Create, Edit, View.
    *   **Role**: Provides SKU, Brand, Dimensions, and Base Cost to all other modules.
* **Warehouse Master**
    *   **Role**: Defines physical storage locations (Main, TSD, Production).
* **Supplier Master**
    *   **Role**: Directory of approved vendors.
* **Customer Master**
    *   **Role**: Directory of clients/destinations.

### 2️⃣ Stock Management (Transactional Modules)
*Inventory movement processing. Logic enforced: Stock quantity changes ONLY when Status = DONE.*

| Module | Fields (Key) | Status Workflow | Stock Impact (On DONE) |
| :--- | :--- | :--- | :--- |
| **Adjustment** | Ref #, Date, Source Ref, Category (JO, Zero Out, etc), WH | Open → Pending → Done | (+/-) Adjust based on category |
| **Withdrawal** | Ref #, Date, Category, WH | Open → Pending → Done | (-) Deduct Stock |
| **Transfer** | Ref #, Needed Date, Source/Dest WH, Requestor | Open → For Approval → For Withdrawal → In Transit → Done | (-) Source / (+) Dest |
| **Customer Return** | Ref #, Customer, WH, Reason (Multi), Amount | Open → For Segregation → Done | (+) Add to Stock (or Quarantine) |

* **Stock Inquiry / Location Inquiry**: Read-only interfaces pulling aggregations from the transaction ledger and item master.

### 3️⃣ Supplier Module
*Inbound Supply Chain.*
* **Supplier Profile**: Master Data management for vendors.
* **Supplier Delivery**:
    *   **Fields**: Ref #, PO Link, Packing List, Container, Type.
    *   **Workflow**: Open → Pending → Done.
    *   **Impact**: (+) Increases Stock Level upon "Done".

### 4️⃣ Order Completion (Workflow Engine)
*Process Execution Only. NO Creation capabilities.*
* **Rule**: Order Completion pages cannot create new orders or modify ordered items/quantities. They only update *fulfillment status*.

**Workflow Chain:**
1.  **Order Source**: Approved Sales Orders (Flows into system).
2.  **Picker Assignment**:
    *   *Input*: Orders with status "Pending Picker".
    *   *Action*: Assign Staff -> Status "Picking" -> Status "Picked".
3.  **Barcoder Assignment**:
    *   *Input*: Orders with status "Picked".
    *   *Action*: Assign Staff -> Verify Barcodes -> Status "Scanned".
4.  **Tagger Assignment**:
    *   *Input*: Orders with status "Scanned".
    *   *Action*: Assign Staff -> Apply Tags -> Status "Tagged".
5.  **Checker Assignment**:
    *   *Input*: Orders with status "Tagged".
    *   *Action*: Final Verification -> Status "Checked".
6.  **Transfer Assignment**: (Optional) Internal routing for the finished order.

**Allocation Summary**: Read-only dashboard showing "Ordered vs Picked vs Packed".

### 5️⃣ Monitoring & Reporting
* **Order Monitoring**: The "Control Tower" view. Shows the real-time status of every order across the 4 workflow stages (Picker, Barcoder, Tagger, Checker).
* **Reports**: Historical data analysis (Inventory Snapshot, Movement Logs).

---

## 2. Data Flow & Ownership Rules

1.  **Master Data Sovereignty**:
    *   Transactions (e.g., Adjustments) must *reference* Item Master IDs, never duplicate string data (like Descriptions) unless capturing a historical snapshot.
2.  **Unidirectional Status Flow**:
    *   Orders move `Picker` -> `Barcoder` -> `Tagger` -> `Checker`.
    *   Backtracking (e.g., Checker rejecting to Picker) requires a "Return to Stage" action, not arbitrary status editing.
3.  **Immutability**:
    *   Once a transaction is `DONE`, it is locked. To correct a mistake, a *new* reversal transaction (Adjustment) must be created.
4.  **Read vs Write**:
    *   **Write**: Transaction Pages (Create), Workflow Pages (Status Update), Master Data Pages (Edit Profiles).
    *   **Read-Only**: Inquiries, Monitoring, Reports.

## 3. End-to-End Flow Summary

1.  **Inbound**: Supplier Delivery (Status: Open -> Done) ==> **Stock Increase**.
2.  **Inventory Mgmt**: Adjustments/Transfers manage internal accuracy.
3.  **Outbound Order**:
    *   **Sales System** generates Order.
    *   **WMS Order Monitoring** sees new Order.
    *   **Picker** picks items (Status: Picked).
    *   **Barcoder** verifies items (Status: Scanned).
    *   **Tagger** labels boxes (Status: Tagged).
    *   **Checker** confirms shipment (Status: Ready).
    *   **Dispatch** (Status: Shipped) ==> **Stock Decrease**.
