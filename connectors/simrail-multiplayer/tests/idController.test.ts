import { IdController } from "../src/controllers/idController";
import { AccountMap } from "../src/models/accountMap";
import { Request, Response } from "express";

describe("IdController", () => {
    let accountMap: AccountMap;
    let controller: IdController;
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        accountMap = new AccountMap();
        controller = new IdController(accountMap);

        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
        };
    });

    test("should add an account successfully", () => {
        req.body = { internalUserId: "user1", accountId: "account1" };

        controller.addAccount(req as Request, res as Response);

        expect(accountMap.hasAccount("account1")).toBe(true);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            status: "success",
            message: "Account added successfully.",
        });
    });

    test("should fail to add account if data is missing", () => {
        req.body = { accountId: "account1" };

        controller.addAccount(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            status: "error",
            message: "Both internalUserId and accountId are required.",
        });
    });

    test("should remove an account successfully", () => {
        accountMap.addAccount("user1", "account1");
        req.body = { accountId: "account1" };

        controller.removeAccount(req as Request, res as Response);

        expect(accountMap.hasAccount("account1")).toBe(false);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: "success",
            message: "Account removed successfully.",
        });
    });
});
