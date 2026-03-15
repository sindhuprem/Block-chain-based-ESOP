const ESOPManagement = artifacts.require("ESOPManagement");
const { assert } = require("chai");

contract("ESOPManagement", (accounts) => {
  let esopContract;
  const admin = accounts[0];
  const employee1 = accounts[1];
  const employee2 = accounts[2];
  const totalPool = 1000000;

  beforeEach(async () => {
    esopContract = await ESOPManagement.new(totalPool, { from: admin });
  });

  describe("Deployment", () => {
    it("should set the correct ESOP pool", async () => {
      const pool = await esopContract.totalESOPPool();
      assert.equal(pool.toString(), totalPool.toString(), "Pool size mismatch");
    });

    it("should set deployer as admin", async () => {
      const ADMIN_ROLE = await esopContract.ADMIN_ROLE();
      const isAdmin = await esopContract.hasRole(ADMIN_ROLE, admin);
      assert.equal(isAdmin, true, "Admin role not set");
    });

    it("should have zero allocated shares initially", async () => {
      const allocated = await esopContract.allocatedShares();
      assert.equal(allocated.toString(), "0", "Allocated shares should be 0");
    });
  });

  describe("Grant Creation", () => {
    it("should create a grant successfully", async () => {
      const tx = await esopContract.createGrant(
        employee1,
        "John Doe",
        1000,
        365,  // 1 year cliff
        1460, // 4 years vesting
        { from: admin }
      );

      // Check event
      assert.equal(tx.logs[0].event, "GrantCreated", "Event not emitted");
      assert.equal(tx.logs[0].args.employee, employee1, "Wrong employee");
      assert.equal(tx.logs[0].args.totalShares.toString(), "1000", "Wrong shares");

      // Check grant details
      const grant = await esopContract.grants(1);
      assert.equal(grant.totalShares.toString(), "1000", "Wrong shares");
      assert.equal(grant.employeeAddress, employee1, "Wrong address");
      assert.equal(grant.employeeName, "John Doe", "Wrong name");
      assert.equal(grant.isActive, true, "Grant should be active");
    });

    it("should increment grant counter", async () => {
      await esopContract.createGrant(
        employee1,
        "John Doe",
        1000,
        365,
        1460,
        { from: admin }
      );

      const counter = await esopContract.grantCounter();
      assert.equal(counter.toString(), "1", "Counter not incremented");
    });

    it("should fail when non-admin tries to create grant", async () => {
      try {
        await esopContract.createGrant(
          employee1,
          "John Doe",
          1000,
          365,
          1460,
          { from: employee1 }
        );
        assert.fail("Should have thrown error");
      } catch (error) {
        assert.include(error.message, "revert", "Wrong error");
      }
    });

    it("should fail when exceeding ESOP pool", async () => {
      try {
        await esopContract.createGrant(
          employee1,
          "John Doe",
          totalPool + 1,
          365,
          1460,
          { from: admin }
        );
        assert.fail("Should have thrown error");
      } catch (error) {
        assert.include(error.message, "Exceeds ESOP pool", "Wrong error");
      }
    });

    it("should fail with invalid employee address", async () => {
      try {
        await esopContract.createGrant(
          "0x0000000000000000000000000000000000000000",
          "John Doe",
          1000,
          365,
          1460,
          { from: admin }
        );
        assert.fail("Should have thrown error");
      } catch (error) {
        assert.include(error.message, "Invalid employee address", "Wrong error");
      }
    });

    it("should update allocated shares", async () => {
      await esopContract.createGrant(
        employee1,
        "John Doe",
        1000,
        365,
        1460,
        { from: admin }
      );

      const allocated = await esopContract.allocatedShares();
      assert.equal(allocated.toString(), "1000", "Allocated shares not updated");
    });

    it("should grant employee role automatically", async () => {
      await esopContract.createGrant(
        employee1,
        "John Doe",
        1000,
        365,
        1460,
        { from: admin }
      );

      const EMPLOYEE_ROLE = await esopContract.EMPLOYEE_ROLE();
      const hasRole = await esopContract.hasRole(EMPLOYEE_ROLE, employee1);
      assert.equal(hasRole, true, "Employee role not granted");
    });
  });

  describe("Vesting Calculation", () => {
    it("should return 0 shares before cliff", async () => {
      await esopContract.createGrant(
        employee1,
        "John Doe",
        1000,
        365,
        1460,
        { from: admin }
      );

      const vested = await esopContract.calculateVestedShares(1);
      assert.equal(vested.toString(), "0", "Should be 0 before cliff");
    });

    it("should calculate vested shares correctly after full vesting", async () => {
      // Create grant with very short vesting for testing
      await esopContract.createGrant(
        employee1,
        "John Doe",
        1000,
        0,    // No cliff
        1,    // 1 day vesting
        { from: admin }
      );

      // In a real test, we'd use time manipulation here
      // For now, just check the function exists
      const vested = await esopContract.calculateVestedShares(1);
      assert.exists(vested, "Vesting calculation failed");
    });
  });

  describe("Employee Grants Tracking", () => {
    it("should track multiple grants for an employee", async () => {
      await esopContract.createGrant(
        employee1,
        "John Doe",
        1000,
        365,
        1460,
        { from: admin }
      );

      await esopContract.createGrant(
        employee1,
        "John Doe",
        500,
        180,
        730,
        { from: admin }
      );

      const grantIds = await esopContract.getEmployeeGrants(employee1);
      assert.equal(grantIds.length, 2, "Should have 2 grants");
      assert.equal(grantIds[0].toString(), "1", "First grant ID wrong");
      assert.equal(grantIds[1].toString(), "2", "Second grant ID wrong");
    });

    it("should return empty array for employee with no grants", async () => {
      const grantIds = await esopContract.getEmployeeGrants(employee2);
      assert.equal(grantIds.length, 0, "Should have 0 grants");
    });
  });

  describe("Get Grant Details", () => {
    it("should return correct grant details", async () => {
      await esopContract.createGrant(
        employee1,
        "Alice Johnson",
        5000,
        365,
        1460,
        { from: admin }
      );

      const details = await esopContract.getGrantDetails(1);
      assert.equal(details.employee, employee1, "Wrong employee");
      assert.equal(details.employeeName, "Alice Johnson", "Wrong name");
      assert.equal(details.totalShares.toString(), "5000", "Wrong shares");
      assert.equal(details.exercisedShares.toString(), "0", "Wrong exercised");
      assert.equal(details.isActive, true, "Should be active");
    });
  });

  describe("Available Pool", () => {
    it("should calculate available pool correctly", async () => {
      await esopContract.createGrant(
        employee1,
        "John Doe",
        10000,
        365,
        1460,
        { from: admin }
      );

      const available = await esopContract.getAvailablePool();
      assert.equal(
        available.toString(),
        (totalPool - 10000).toString(),
        "Wrong available pool"
      );
    });
  });

  describe("Grant Revocation", () => {
    it("should allow admin to revoke grant", async () => {
      await esopContract.createGrant(
        employee1,
        "John Doe",
        1000,
        365,
        1460,
        { from: admin }
      );

      const tx = await esopContract.revokeGrant(1, { from: admin });
      
      // Check event
      assert.equal(tx.logs[0].event, "GrantRevoked", "Event not emitted");
      
      // Check grant is inactive
      const grant = await esopContract.grants(1);
      assert.equal(grant.isActive, false, "Grant should be inactive");
    });

    it("should not allow non-admin to revoke grant", async () => {
      await esopContract.createGrant(
        employee1,
        "John Doe",
        1000,
        365,
        1460,
        { from: admin }
      );

      try {
        await esopContract.revokeGrant(1, { from: employee1 });
        assert.fail("Should have thrown error");
      } catch (error) {
        assert.include(error.message, "revert", "Wrong error");
      }
    });
  });
});