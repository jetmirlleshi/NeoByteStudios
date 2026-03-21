import { describe, it, expect, beforeEach } from "vitest";
import { useBillingStore } from "@/stores/billing-store";

describe("billing-store", () => {
  beforeEach(() => {
    // Reset the store to its initial state before each test
    const { closeUpgradeDialog } = useBillingStore.getState();
    closeUpgradeDialog();
  });

  describe("initial state", () => {
    it("should have upgradeDialogOpen set to false", () => {
      const state = useBillingStore.getState();
      expect(state.upgradeDialogOpen).toBe(false);
    });

    it("should have upgradeFeature set to null or undefined", () => {
      const state = useBillingStore.getState();
      expect(state.upgradeFeature).toBeFalsy();
    });
  });

  describe("openUpgradeDialog", () => {
    it("should set upgradeDialogOpen to true", () => {
      const { openUpgradeDialog } = useBillingStore.getState();
      openUpgradeDialog("ai_assistant");

      const state = useBillingStore.getState();
      expect(state.upgradeDialogOpen).toBe(true);
    });

    it("should set upgradeFeature to the provided value", () => {
      const { openUpgradeDialog } = useBillingStore.getState();
      openUpgradeDialog("ai_assistant");

      const state = useBillingStore.getState();
      expect(state.upgradeFeature).toBe("ai_assistant");
    });

    it("should update feature when called with different features", () => {
      const store = useBillingStore.getState();

      store.openUpgradeDialog("export_pdf");
      expect(useBillingStore.getState().upgradeFeature).toBe("export_pdf");

      store.openUpgradeDialog("worldbuilding");
      expect(useBillingStore.getState().upgradeFeature).toBe("worldbuilding");
    });

    it("should handle empty string as feature", () => {
      const { openUpgradeDialog } = useBillingStore.getState();
      openUpgradeDialog("");

      const state = useBillingStore.getState();
      expect(state.upgradeDialogOpen).toBe(true);
      expect(state.upgradeFeature).toBe("");
    });
  });

  describe("closeUpgradeDialog", () => {
    it("should set upgradeDialogOpen to false", () => {
      const store = useBillingStore.getState();
      store.openUpgradeDialog("ai_assistant");
      expect(useBillingStore.getState().upgradeDialogOpen).toBe(true);

      store.closeUpgradeDialog();
      expect(useBillingStore.getState().upgradeDialogOpen).toBe(false);
    });

    it("should clear upgradeFeature when closing", () => {
      const store = useBillingStore.getState();
      store.openUpgradeDialog("export_pdf");
      expect(useBillingStore.getState().upgradeFeature).toBe("export_pdf");

      store.closeUpgradeDialog();
      const state = useBillingStore.getState();
      expect(state.upgradeFeature).toBeFalsy();
    });

    it("should be safe to call multiple times", () => {
      const { closeUpgradeDialog } = useBillingStore.getState();
      closeUpgradeDialog();
      closeUpgradeDialog();
      closeUpgradeDialog();

      const state = useBillingStore.getState();
      expect(state.upgradeDialogOpen).toBe(false);
    });
  });

  describe("full workflow", () => {
    it("should support open -> close -> open cycle", () => {
      const store = useBillingStore.getState();

      // Open with first feature
      store.openUpgradeDialog("ai_assistant");
      expect(useBillingStore.getState().upgradeDialogOpen).toBe(true);
      expect(useBillingStore.getState().upgradeFeature).toBe("ai_assistant");

      // Close
      store.closeUpgradeDialog();
      expect(useBillingStore.getState().upgradeDialogOpen).toBe(false);

      // Open with different feature
      store.openUpgradeDialog("export_pdf");
      expect(useBillingStore.getState().upgradeDialogOpen).toBe(true);
      expect(useBillingStore.getState().upgradeFeature).toBe("export_pdf");
    });
  });
});
