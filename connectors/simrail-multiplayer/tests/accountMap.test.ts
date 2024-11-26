import { AccountMap } from "../src/models/accountMap";

describe("AccountMap", () => {
    let accountMap: AccountMap;

    beforeEach(() => {
        accountMap = new AccountMap();
    });

    test("should add an account", () => {
        accountMap.addAccount("user1", "account1");
        expect(accountMap.hasAccount("account1")).toBe(true);
    });

    test("should remove an account", () => {
        accountMap.addAccount("user1", "account1");
        accountMap.removeAccount("account1");
        expect(accountMap.hasAccount("account1")).toBe(false);
    });

    test("should retrieve internal user ID by account ID", () => {
        accountMap.addAccount("user1", "account1");
        expect(accountMap.getInternalUserId("account1")).toBe("user1");
    });

    test("should return undefined for non-existent account", () => {
        expect(accountMap.getInternalUserId("nonexistent")).toBeNull();
    });
});
