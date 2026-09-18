import { describe, it, expect } from "vitest";
import {
  isAdminOfCommunity,
  isMemberOfCommunity,
  canRemoveMember,
} from "./communityPermissions";

describe("Community Permissions", () => {
  describe("isAdminOfCommunity", () => {
    it("deve retornar true apenas para role admin", () => {
      expect(isAdminOfCommunity("admin")).toBe(true);
      expect(isAdminOfCommunity("member")).toBe(false);
      expect(isAdminOfCommunity(undefined)).toBe(false);
      expect(isAdminOfCommunity(null)).toBe(false);
    });
  });

  describe("isMemberOfCommunity", () => {
    it("deve retornar true para admin e member", () => {
      expect(isMemberOfCommunity("admin")).toBe(true);
      expect(isMemberOfCommunity("member")).toBe(true);
      expect(isMemberOfCommunity("guest")).toBe(false);
      expect(isMemberOfCommunity(undefined)).toBe(false);
    });
  });

  describe("canRemoveMember", () => {
    it("deve bloquear a remoção quando o alvo é o único admin", () => {
      const result = canRemoveMember("admin", 1);
      expect(result.canRemove).toBe(false);
      expect(result.reason).toBe("Não é possível remover o único administrador da comunidade.");
    });

    it("deve permitir a remoção de um admin quando existem 2 ou mais admins", () => {
      const result = canRemoveMember("admin", 2);
      expect(result.canRemove).toBe(true);
      expect(result.reason).toBeUndefined();
    });

    it("deve permitir a remoção de um membro comum mesmo com 1 admin na comunidade", () => {
      const result = canRemoveMember("member", 1);
      expect(result.canRemove).toBe(true);
    });
  });
});
